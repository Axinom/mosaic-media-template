import { MosaicError } from '@axinom/mosaic-service-common';
import {
  CollectionPublishedEvent,
  CollectionPublishedEventSchema,
  PublishServiceMessagingSettings,
  RelatedItem,
  RelationType,
} from 'media-messages';
import { parent, Queryable, select, selectExactlyOne } from 'zapatos/db';
import { collection_relations } from 'zapatos/schema';
import { CommonErrors, Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  buildBDPublishingId,
  EntityPublishingProcessor,
  SnapshotDataAggregator,
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

  const snapshotJson: CollectionPublishedEvent = {
    content_id: collection.publishing_id,
    tags: collection.tags.map((c) => c.name),
    images: collectionImages,
    related_items: relatedItems,
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
    validation: [...collectionImageValidations, ...localizationsValidation],
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
  } else {
    return {
      table: 'collections',
      id: relation.collection_id,
      relationType: 'COLLECTION',
    };
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

export const publishingCollectionProcessor: EntityPublishingProcessor = {
  type: 'collections',
  aggregator: collectionDataAggregator,
  validationSchema: CollectionPublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.CollectionPublished,
  unpublishMessagingSettings:
    PublishServiceMessagingSettings.CollectionUnpublished,
};
