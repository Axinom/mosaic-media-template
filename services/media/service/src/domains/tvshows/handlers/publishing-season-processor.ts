import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import {
  License,
  PublishServiceMessagingSettings,
  SeasonPublishedEvent,
  SeasonPublishedEventSchema,
} from 'media-messages';
import * as Yup from 'yup';
import {
  parent,
  Queryable,
  select,
  selectExactlyOne,
  selectOne,
} from 'zapatos/db';
import { CommonErrors, Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  buildBDPublishingId,
  buildPublishingId,
  EntityPublishingProcessor,
  SnapshotDataAggregator,
  SnapshotValidationResult,
  validateYupPublishSchema,
  videosValidation,
} from '../../../publishing';
import { getImagesMetadata, getVideosMetadata } from '../../common';
import {
  getSeasonLocalizationsMetadata,
  getSeasonLocalizedImagesMetadata,
} from '../localization';

const applyImageFallbacks = (images: any[]) => {
  const primaryToSecondaryMap = {
    SEASON_COVER: ['SEASON_COVER_1x1', 'SEASON_COVER_16x9'],
    SEASON_CLEAN_COVER: ['SEASON_CLEAN_COVER_1x1', 'SEASON_CLEAN_COVER_16x9'],
    SEASON_LIST: ['SEASON_LIST_1x1', 'SEASON_LIST_9x13'],
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
      !['SEASON_COVER', 'SEASON_CLEAN_COVER', 'SEASON_LIST'].includes(img.type),
  );
};

/**
 * Builds season license objects from license data
 */
const buildSeasonLicenses = async (
  licenses: any[],
  contentOwner: string | null,
  queryable: Queryable,
): Promise<License[]> => {
  const seasonLicenses: License[] = [];
  for (const license of licenses) {
    const seasonLicense: License = {
      start_time: license.license_start ?? undefined,
      end_time: license.license_end ?? undefined,
      is_downloadable: license.is_downloadable,
      downloaded_asset_lifespan: license.downloaded_asset_lifespan ?? undefined,
      content_owner: contentOwner ?? undefined,
      countries: [],
    };
    for (const country of license.countries) {
      if (!isNullOrWhitespace(country.country_group_id)) {
        const countryGroupCountries = await select('country_groups_countries', {
          group_id: country.country_group_id,
        }).run(queryable);
        seasonLicense.countries?.push(
          ...countryGroupCountries
            .filter((c) => !seasonLicense.countries?.includes(c.country_id))
            .map((c) => c.country_id),
        );
      } else if (
        !isNullOrWhitespace(country.country_code) &&
        !seasonLicense.countries?.includes(country.country_code)
      ) {
        seasonLicense.countries?.push(country.country_code);
      }
    }
    seasonLicenses.push(seasonLicense);
  }
  return seasonLicenses;
};

const seasonDataAggregator: SnapshotDataAggregator = async (
  entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const season = await selectExactlyOne(
    'seasons',
    { id: entityId },
    {
      lateral: {
        images: select('seasons_images', {
          season_id: parent('id'),
        }),
        cast: select('seasons_casts', { season_id: parent('id') }),
        tags: select('seasons_tags', { season_id: parent('id') }),
        licenses: select(
          'seasons_licenses',
          { season_id: parent('id') },
          {
            lateral: {
              countries: select('seasons_licenses_countries', {
                seasons_license_id: parent('id'),
              }),
            },
          },
        ),
        directors: select('seasons_directors', { season_id: parent('id') }),
        trailers: select('seasons_trailers', {
          season_id: parent('id'),
        }),
        genres: select('seasons_tvshow_genres', {
          season_id: parent('id'),
        }),
        productionCountries: select('seasons_production_countries', {
          season_id: parent('id'),
        }),
        tvshow: selectOne('tvshows', {
          id: parent('tvshow_id'),
        }),
      },
    },
  ).run(queryable);

  const [
    { result: videos, validation: videosValidation },
    { result: images, validation: imagesValidation },
    { result: localizations, validation: localizationsValidation },
  ] = await Promise.all([
    getVideosMetadata(
      config.videoServiceBaseUrl,
      authToken,
      null,
      season.trailers,
    ),
    getImagesMetadata(config.imageServiceBaseUrl, authToken, season.images),
    getSeasonLocalizationsMetadata(config, authToken, season.id.toString()),
  ]);

  const imageLocalizations = await getSeasonLocalizedImagesMetadata(
    season.id,
    localizations,
    config.imageServiceBaseUrl,
    authToken,
  );

  const seasonImages = applyImageFallbacks(images);

  const seasonImageValidations = imagesValidation;
  imageLocalizations.forEach((localization) => {
    const localizedImages = applyImageFallbacks(localization.result);
    seasonImages.push(
      ...localizedImages.map((image) => {
        return {
          ...image,
          language_tag: localization.language_tag,
        };
      }),
    );
    seasonImageValidations.push(
      ...localization.validation.map((validation) => {
        return {
          ...validation,
        };
      }),
    );
  });

  if (season.publishing_id === undefined || season.publishing_id === null) {
    throw new MosaicError({
      ...CommonErrors.EntityPublishingIdNotFound,
      messageParams: ['Season', entityId],
    });
  }

  const seasonLicenses = await buildSeasonLicenses(
    season.licenses,
    season.content_owner,
    queryable,
  );

  let extendedField = null;
  const metadataValidation: SnapshotValidationResult[] = [];
  if (!isNullOrWhitespace(season.extended_field)) {
    try {
      extendedField = {
        custom: JSON.parse(season.extended_field),
      };
    } catch (error) {
      metadataValidation.push({
        context: 'METADATA',
        severity: 'ERROR',
        message: 'Invalid JSON format in extended_field.',
      });
    }
  }

  const snapshotJson: SeasonPublishedEvent = {
    content_id: season.publishing_id,
    tvshow_id: season.tvshow_id
      ? season.tvshow?.publishing_id ||
        buildBDPublishingId(
          'TVSHOW',
          season.tvshow!.title,
          season.tvshow!.external_id!, // TODO: Can we improve this logic?
        )
      : undefined,
    original_title: season.title,
    index: season.index,
    released: season.released ?? undefined,
    studio: season.studio ?? undefined,
    production_countries: season.productionCountries.map((c) => c.name),
    genre_ids: season.genres.map((g) =>
      buildPublishingId('tvshow_genres', g.tvshow_genres_id),
    ),
    cast: season.cast.map((c) => c.name),
    tags: season.tags.map((c) => c.name),
    licenses: seasonLicenses,
    images: seasonImages,
    videos,
    directors: season.directors.map((d) => d.name),
    extended_field: extendedField ? JSON.stringify(extendedField) : undefined,
    rating: season.rating ?? undefined,
    age_rating: season.age_rating ?? undefined,
    asset_type: 2,
    asset_subtype: 'Season',
    localizations: localizations ?? [
      {
        is_default_locale: true,
        language_tag: DEFAULT_LOCALE_TAG,
        title: season.title,
        synopsis: season.synopsis ?? undefined,
        description: season.description ?? undefined,
      },
    ],
  };

  return {
    result: snapshotJson,
    validation: [
      ...metadataValidation,
      ...seasonImageValidations,
      ...videosValidation,
      ...localizationsValidation,
    ],
  };
};

const customSeasonValidation = async (
  json: unknown,
): Promise<SnapshotValidationResult[]> => {
  const yupSchema = Yup.object({
    videos: videosValidation(),
    // licenses: licensesValidation(false), For BeyondDutch, licenses for Season level is not maintained and we do not validate them.
  });
  const yupValidationResults = await validateYupPublishSchema(json, yupSchema);
  const customValidationResults: SnapshotValidationResult[] = [];
  const seasonJson = json as SeasonPublishedEvent;

  // Check if title and description are present for default locale
  if (seasonJson.localizations) {
    const defaultLocale = seasonJson.localizations.find(
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
  return [...yupValidationResults, ...customValidationResults];
};

export const publishingSeasonProcessor: EntityPublishingProcessor = {
  type: 'seasons',
  aggregator: seasonDataAggregator,
  validator: customSeasonValidation,
  validationSchema: SeasonPublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.SeasonPublished,
  unpublishMessagingSettings: PublishServiceMessagingSettings.SeasonUnpublished,
};
