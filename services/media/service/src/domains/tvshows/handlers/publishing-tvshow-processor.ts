import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import {
  License,
  PublishServiceMessagingSettings,
  TvshowPublishedEvent,
  TvshowPublishedEventSchema,
} from 'media-messages';
import * as Yup from 'yup';
import { parent, Queryable, select, selectExactlyOne } from 'zapatos/db';
import { CommonErrors, Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  atLeastOneString,
  buildPublishingId,
  EntityPublishingProcessor,
  requiredTvShowCover,
  SnapshotDataAggregator,
  SnapshotValidationResult,
  validateYupPublishSchema,
  videosValidation,
} from '../../../publishing';
import { getImagesMetadata, getVideosMetadata } from '../../common';
import {
  getTvshowLocalizationsMetadata,
  getTvShowLocalizedImagesMetadata,
} from '../localization';

const applyImageFallbacks = (images: any[]) => {
  const primaryToSecondaryMap = {
    TVSHOW_COVER: ['TVSHOW_COVER_1x1', 'TVSHOW_COVER_16x9'],
    TVSHOW_CLEAN_COVER: ['TVSHOW_CLEAN_COVER_1x1', 'TVSHOW_CLEAN_COVER_16x9'],
    TVSHOW_LIST: ['TVSHOW_LIST_1x1', 'TVSHOW_LIST_9x13'],
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
      !['TVSHOW_COVER', 'TVSHOW_CLEAN_COVER', 'TVSHOW_LIST'].includes(img.type),
  );
};

/**
 * Builds TV Show license objects from license data
 */
const buildTvShowLicenses = async (
  licenses: any[],
  contentOwner: string | null,
  businessType: string | null,
  queryable: Queryable,
): Promise<License[]> => {
  const tvShowLicenses: License[] = [];
  for (const license of licenses) {
    const tvShowLicense: License = {
      start_time: license.license_start ?? undefined,
      end_time: license.license_end ?? undefined,
      is_downloadable: license.is_downloadable,
      downloaded_asset_lifespan: license.downloaded_asset_lifespan ?? undefined,
      content_owner: contentOwner ?? undefined,
      business_type: businessType ?? undefined,
      countries: [],
    };
    for (const country of license.countries) {
      if (!isNullOrWhitespace(country.country_group_id)) {
        const countryGroupCountries = await select('country_groups_countries', {
          group_id: country.country_group_id,
        }).run(queryable);
        tvShowLicense.countries?.push(
          ...countryGroupCountries
            .filter((c) => !tvShowLicense.countries?.includes(c.country_id))
            .map((c) => c.country_id),
        );
      } else if (
        !isNullOrWhitespace(country.country_code) &&
        !tvShowLicense.countries?.includes(country.country_code)
      ) {
        tvShowLicense.countries?.push(country.country_code);
      }
    }
    tvShowLicenses.push(tvShowLicense);
  }
  return tvShowLicenses;
};

const tvshowDataAggregator: SnapshotDataAggregator = async (
  entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const tvshow = await selectExactlyOne(
    'tvshows',
    { id: entityId },
    {
      lateral: {
        images: select('tvshows_images', {
          tvshow_id: parent('id'),
        }),
        cast: select('tvshows_casts', { tvshow_id: parent('id') }),
        tags: select('tvshows_tags', { tvshow_id: parent('id') }),
        licenses: select(
          'tvshows_licenses',
          { tvshow_id: parent('id') },
          {
            lateral: {
              countries: select('tvshows_licenses_countries', {
                tvshows_license_id: parent('id'),
              }),
            },
          },
        ),
        directors: select('tvshows_directors', { tvshow_id: parent('id') }),
        trailers: select('tvshows_trailers', {
          tvshow_id: parent('id'),
        }),
        genres: select('tvshows_tvshow_genres', {
          tvshow_id: parent('id'),
        }),
        productionCountries: select('tvshows_production_countries', {
          tvshow_id: parent('id'),
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
      tvshow.trailers,
    ),
    getImagesMetadata(config.imageServiceBaseUrl, authToken, tvshow.images),
    getTvshowLocalizationsMetadata(config, authToken, tvshow.id.toString()),
  ]);

  const imageLocalizations = await getTvShowLocalizedImagesMetadata(
    tvshow.id,
    localizations,
    config.imageServiceBaseUrl,
    authToken,
  );

  const tvshowImages = applyImageFallbacks(images);

  const tvshowImageValidations = imagesValidation;
  imageLocalizations.forEach((localization) => {
    const localizedImage = applyImageFallbacks(localization.result);
    tvshowImages.push(
      ...localizedImage.map((image) => {
        return {
          ...image,
          language_tag: localization.language_tag,
        };
      }),
    );
    tvshowImageValidations.push(
      ...localization.validation.map((validation) => {
        return {
          ...validation,
        };
      }),
    );
  });

  if (tvshow.publishing_id === undefined || tvshow.publishing_id === null) {
    throw new MosaicError({
      ...CommonErrors.EntityPublishingIdNotFound,
      messageParams: ['TVShow', entityId],
    });
  }

  const tvshowLicenses = await buildTvShowLicenses(
    tvshow.licenses,
    tvshow.content_owner,
    tvshow.business_type,
    queryable,
  );

  const extendedField = {
    custom: {},
  };
  const metadataValidation: SnapshotValidationResult[] = [];
  try {
    extendedField.custom =
      tvshow.extended_field !== null ? JSON.parse(tvshow.extended_field) : {};
  } catch (error) {
    metadataValidation.push({
      context: 'METADATA',
      severity: 'ERROR',
      message: 'Invalid JSON format in extended_field.',
    });
  }

  const snapshotJson: TvshowPublishedEvent = {
    content_id: tvshow.publishing_id,
    original_title: tvshow.original_title ?? undefined,
    released: tvshow.released ?? undefined,
    studio: tvshow.studio ?? undefined,
    production_countries: tvshow.productionCountries.map((c) => c.name),
    genre_ids: tvshow.genres.map((g) =>
      buildPublishingId('tvshow_genres', g.tvshow_genres_id),
    ),
    cast: tvshow.cast.map((c) => c.name),
    tags: tvshow.tags.map((c) => c.name),
    licenses: tvshowLicenses,
    images: tvshowImages,
    videos,
    directors: tvshow.directors.map((d) => d.name),
    business_type: tvshow.business_type ?? undefined,
    extended_field: JSON.stringify(extendedField),
    rating: tvshow.rating ?? undefined,
    age_rating: tvshow.age_rating ?? undefined,
    asset_type: 6,
    asset_subtype: 'TVShow',
    localizations: localizations ?? [
      {
        is_default_locale: true,
        language_tag: DEFAULT_LOCALE_TAG,
        title: tvshow.title,
        synopsis: tvshow.synopsis ?? undefined,
        description: tvshow.description ?? undefined,
      },
    ],
  };

  return {
    result: snapshotJson,
    validation: [
      ...metadataValidation,
      ...tvshowImageValidations,
      ...videosValidation,
      ...localizationsValidation,
    ],
  };
};

const customTvshowValidation = async (
  json: unknown,
): Promise<SnapshotValidationResult[]> => {
  const yupSchema = Yup.object({
    genre_ids: atLeastOneString,
    images: requiredTvShowCover,
    videos: videosValidation(),
    //licenses: licensesValidation(false), For BeyondDutch, licenses for TV Show level is not maintained and we do not validate them.
  });

  const yupValidationResults = await validateYupPublishSchema(json, yupSchema);
  const customValidationResults: SnapshotValidationResult[] = [];
  const tvshowJson = json as TvshowPublishedEvent;

  // Check if title and description are present for default locale
  if (tvshowJson.localizations) {
    const defaultLocale = tvshowJson.localizations.find(
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

      if (
        !defaultLocale.description ||
        defaultLocale.description.trim() === ''
      ) {
        customValidationResults.push({
          context: 'LOCALIZATION',
          severity: 'ERROR',
          message: 'Description is required.',
        });
      }
    }
  }
  return [...yupValidationResults, ...customValidationResults];
};

export const publishingTvshowProcessor: EntityPublishingProcessor = {
  type: 'tvshows',
  aggregator: tvshowDataAggregator,
  validator: customTvshowValidation,
  validationSchema: TvshowPublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.TvshowPublished,
  unpublishMessagingSettings: PublishServiceMessagingSettings.TvshowUnpublished,
};
