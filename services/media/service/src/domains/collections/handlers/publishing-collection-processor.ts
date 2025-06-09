import { MosaicError } from '@axinom/mosaic-service-common';
import {
  CollectionPublishedEvent,
  CollectionPublishedEventSchema,
  PublishServiceMessagingSettings,
  RelatedItem,
  RelationType,
} from 'media-messages';
import {
  conditions as c,
  parent,
  Queryable,
  select,
  selectExactlyOne,
} from 'zapatos/db';
import { collection_relations } from 'zapatos/schema';
import { CommonErrors, Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  buildBDPublishingId,
  EntityPublishingProcessor,
  SnapshotDataAggregator,
  SnapshotValidationResult,
} from '../../../publishing';
import { getImagesMetadata } from '../../common';
import {
  getCollectionLocalizationsMetadata,
  getLocalizedCollectionImagesMetadata,
} from '../localization';

const applyImageFallbacks = (images: any[]) => {
  const primaryToSecondaryMap = {
    COLLECTION_COVER: ['COLLECTION_COVER_1x1', 'COLLECTION_COVER_4x1'],
    COLLECTION_CLEAN_COVER: [
      'COLLECTION_CLEAN_COVER_1x1',
      'COLLECTION_CLEAN_COVER_4x1',
    ],
    COLLECTION_LIST: ['COLLECTION_LIST_1x1', 'COLLECTION_LIST_15x16'],
  };

  const result = [...images];

  Object.entries(primaryToSecondaryMap).forEach(([primary, secondaries]) => {
    const primaryImage = images.find((img) => img.type === primary);
    if (primaryImage) {
      secondaries.forEach((secondary) => {
        const hasSecondary = images.some((img) => img.type === secondary);
        if (!hasSecondary) {
          result.push({
            ...primaryImage,
            type: secondary,
          });
        }
      });
    }
  });

  // Filter out primary image types
  return result.filter(
    (img) =>
      ![
        'COLLECTION_COVER',
        'COLLECTION_CLEAN_COVER',
        'COLLECTION_LIST',
      ].includes(img.type),
  );
};

const collectionDataAggregator: SnapshotDataAggregator = async (
  entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const collection = await selectExactlyOne(
    'collections',
    { id: entityId },
    {
      lateral: {
        images: select('collections_images', {
          collection_id: parent('id'),
        }),
        tags: select('collections_tags', { collection_id: parent('id') }),
        relations: select('collection_relations', {
          collection_id: parent('id'),
        }),
        countries: select('collection_countries', {
          collection_id: parent('id'),
        }),
      },
    },
  ).run(queryable);

  const [
    { result: images, validation: imagesValidation },
    { result: localizations, validation: localizationsValidation },
  ] = await Promise.all([
    getImagesMetadata(config.imageServiceBaseUrl, authToken, collection.images),
    getCollectionLocalizationsMetadata(
      config,
      authToken,
      collection.id.toString(),
    ),
  ]);

  const imageLocalizations = await getLocalizedCollectionImagesMetadata(
    collection.id,
    localizations,
    config.imageServiceBaseUrl,
    authToken,
  );

  const collectionImages = applyImageFallbacks(images);

  const collectionImageValidations = imagesValidation;
  imageLocalizations.forEach((localization) => {
    const localizedImages = applyImageFallbacks(localization.result);
    collectionImages.push(
      ...localizedImages.map((image) => {
        return {
          ...image,
          language_tag: localization.language_tag,
        };
      }),
    );
    collectionImageValidations.push(
      ...localization.validation.map((validation) => {
        return {
          ...validation,
        };
      }),
    );
  });

  if (
    collection.publishing_id === undefined ||
    collection.publishing_id === null
  ) {
    throw new MosaicError({
      ...CommonErrors.EntityPublishingIdNotFound,
      messageParams: ['Collection', entityId],
    });
  }

  const relatedItems: RelatedItem[] = [];

  for (const relation of collection.relations) {
    const { table, id, relationType } = getRelationTableAndId(relation);
    const relationPublishingId = await getRelationPublishingId(
      relationType,
      table,
      id,
      queryable,
    );
    relatedItems.push({
      order_no: relation.sort_order,
      [`${relationType.toLowerCase()}_id`]: relationPublishingId,
      relation_type: relationType,
    });
  }

  const extendedField = {
    custom: {},
  };
  const metadataValidation: SnapshotValidationResult[] = [];
  try {
    extendedField.custom =
      collection.extended_field !== null
        ? JSON.parse(collection.extended_field)
        : {};
  } catch (error) {
    metadataValidation.push({
      context: 'METADATA',
      severity: 'ERROR',
      message: 'Invalid JSON format in extended_field.',
    });
  }

  const countries = collection.countries
    .map((c) => c.country_id)
    .filter((c) => c !== null && c !== undefined);

  const countryGroups = collection.countries
    .map((c) => c.country_group_id)
    .filter((c) => c !== null && c !== undefined);

  const countryGroupCountries = await select('country_groups_countries', {
    group_id: c.isIn(countryGroups as string[]), // Typescript compiler somehow fails to understand the above filter and infers the type as (string | null)[]. Hence the explicit cast.
  }).run(queryable);

  const countriesFromGroups = countryGroupCountries.map((c) => c.country_id);
  const allCountries = Array.from(
    new Set([...countries, ...countriesFromGroups]),
  );

  const snapshotJson: CollectionPublishedEvent = {
    content_id: collection.publishing_id,
    tags: collection.tags.map((c) => c.name),
    images: collectionImages,
    related_items: relatedItems,
    extended_field: JSON.stringify(extendedField),
    countries: allCountries as string[], // Typescript compiler somehow fails to understand the above filter and infers the type as (string | null)[]. Hence the explicit cast.
    localizations: localizations ?? [
      {
        is_default_locale: true,
        language_tag: DEFAULT_LOCALE_TAG,
        title: collection.title ?? undefined,
        synopsis: collection.synopsis ?? undefined,
        description: collection.description ?? undefined,
      },
    ],
  };

  return {
    result: snapshotJson,
    validation: [
      ...metadataValidation,
      ...collectionImageValidations,
      ...localizationsValidation,
    ],
  };
};

const getRelationTableAndId = (
  relation: collection_relations.JSONSelectable,
): {
  table: 'movies' | 'tvshows' | 'episodes' | 'seasons' | 'collections';
  id: number;
  relationType: RelationType;
} => {
  if (relation.movie_id) {
    return { table: 'movies', id: relation.movie_id, relationType: 'MOVIE' };
  } else if (relation.tvshow_id) {
    return { table: 'tvshows', id: relation.tvshow_id, relationType: 'TVSHOW' };
  } else if (relation.season_id) {
    return { table: 'seasons', id: relation.season_id, relationType: 'SEASON' };
  } else if (relation.episode_id) {
    return {
      table: 'episodes',
      id: relation.episode_id,
      relationType: 'EPISODE',
    };
  } else if (relation.child_collection_id) {
    return {
      table: 'collections',
      id: relation.child_collection_id,
      relationType: 'COLLECTION',
    };
  } else {
    throw new MosaicError({
      ...CommonErrors.UnknownCollectionRelationType,
      messageParams: [relation],
    });
  }
};

const getRelationPublishingId = async (
  relationType: RelationType,
  relationTable: 'movies' | 'tvshows' | 'seasons' | 'episodes' | 'collections',
  relationId: number,
  queryable: Queryable,
): Promise<string | null> => {
  const relation = await selectExactlyOne(relationTable, {
    id: relationId,
  }).run(queryable);
  const publishingId = buildBDPublishingId(
    relationType,
    relation.title,
    relation.external_id,
  );
  return publishingId;
};

const customCollectionValidation = async (
  json: unknown,
): Promise<SnapshotValidationResult[]> => {
  // BeyondDutch needs support for empty collections.
  /*const yupSchema = Yup.object({
    related_items: Yup.array(
      Yup.object().test({
        name: 'one_relation_id',
        message: (params) => {
          const identifier = getReadablePath(params.path);
          return `${identifier} must have a relation id defined.`;
        },
        test: (value) =>
          !!value.movie_id ||
          !!value.tvshow_id ||
          !!value.season_id ||
          !!value.episode_id ||
          !!value.collection_id,
      }),
    ).min(1, `At least one related item must be assigned.`),
    });*/

  //const yupValidationResults = await validateYupPublishSchema(json, yupSchema);
  const customValidationResults: SnapshotValidationResult[] = [];
  const collectionJson = json as CollectionPublishedEvent;

  // Check if title and description are present for default locale
  if (collectionJson.localizations) {
    const defaultLocale = collectionJson.localizations.find(
      (locale) => locale.is_default_locale === true,
    );

    if (defaultLocale) {
      if (!defaultLocale.title || defaultLocale.title.trim() === '') {
        customValidationResults.push({
          context: 'LOCALIZATION',
          severity: 'ERROR',
          message: 'Title is required.',
        });
      }
    }
  }
  return [/*...yupValidationResults,*/ ...customValidationResults];
};

export const publishingCollectionProcessor: EntityPublishingProcessor = {
  type: 'collections',
  aggregator: collectionDataAggregator,
  validator: customCollectionValidation,
  validationSchema: CollectionPublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.CollectionPublished,
  unpublishMessagingSettings:
    PublishServiceMessagingSettings.CollectionUnpublished,
};
