import { isNullOrWhitespace, MosaicError } from '@axinom/mosaic-service-common';
import {
  License,
  MoviePublishedEvent,
  MoviePublishedEventSchema,
  PublishServiceMessagingSettings,
} from 'media-messages';
import * as Yup from 'yup';
import { parent, Queryable, select, selectExactlyOne } from 'zapatos/db';
import { CommonErrors, Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  atLeastOneString,
  buildPublishingId,
  EntityPublishingProcessor,
  licenseValidationSchema,
  requiredMovieCover,
  SnapshotDataAggregator,
  SnapshotValidationResult,
  validateYupPublishSchema,
  videosValidation,
} from '../../../publishing';
import { getImagesMetadata, getVideosMetadata } from '../../common';
import {
  getLocalizedImagesMetadata,
  getMovieLocalizationsMetadata,
} from '../localization';

const applyImageFallbacks = (images: any[]) => {
  const primaryToSecondaryMap = {
    MOVIE_COVER: ['MOVIE_COVER_1x1', 'MOVIE_COVER_16x9'],
    MOVIE_CLEAN_COVER: ['MOVIE_CLEAN_COVER_1x1', 'MOVIE_CLEAN_COVER_16x9'],
    MOVIE_LIST: ['MOVIE_LIST_1x1', 'MOVIE_LIST_9x13'],
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
      !['MOVIE_COVER', 'MOVIE_CLEAN_COVER', 'MOVIE_LIST'].includes(img.type),
  );
};

/**
 * Builds movie license objects from license data
 */
const buildMovieLicenses = async (
  licenses: any[],
  contentOwner: string | null,
  businessType: string | null,
  queryable: Queryable,
): Promise<License[]> => {
  const movieLicenses: License[] = [];
  for (const license of licenses) {
    const movieLicense: License = {
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
        movieLicense.countries?.push(
          ...countryGroupCountries
            .filter((c) => !movieLicense.countries?.includes(c.country_id))
            .map((c) => c.country_id),
        );
      } else if (
        !isNullOrWhitespace(country.country_code) &&
        !movieLicense.countries?.includes(country.country_code)
      ) {
        movieLicense.countries?.push(country.country_code);
      }
    }
    movieLicenses.push(movieLicense);
  }
  return movieLicenses;
};

const movieDataAggregator: SnapshotDataAggregator = async (
  entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const movie = await selectExactlyOne(
    'movies',
    { id: entityId },
    {
      lateral: {
        images: select('movies_images', {
          movie_id: parent('id'),
        }),
        cast: select('movies_casts', { movie_id: parent('id') }),
        tags: select('movies_tags', { movie_id: parent('id') }),
        licenses: select(
          'movies_licenses',
          { movie_id: parent('id') },
          {
            lateral: {
              countries: select('movies_licenses_countries', {
                movies_license_id: parent('id'),
              }),
            },
          },
        ),
        directors: select('movies_directors', { movie_id: parent('id') }),
        trailers: select('movies_trailers', {
          movie_id: parent('id'),
        }),
        genres: select('movies_movie_genres', {
          movie_id: parent('id'),
        }),
        productionCountries: select('movies_production_countries', {
          movie_id: parent('id'),
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
      movie.main_video_id,
      movie.trailers,
    ),
    getImagesMetadata(config.imageServiceBaseUrl, authToken, movie.images),
    getMovieLocalizationsMetadata(config, authToken, movie.id.toString()),
  ]);

  const imageLocalizations = await getLocalizedImagesMetadata(
    movie.id,
    localizations,
    config.imageServiceBaseUrl,
    authToken,
  );

  const movieImages = applyImageFallbacks(images);

  const movieImageValidations = imagesValidation;
  imageLocalizations.forEach((localization) => {
    const localizedImages = applyImageFallbacks(localization.result);
    movieImages.push(
      ...localizedImages.map((image) => {
        return {
          ...image,
          language_tag: localization.language_tag,
        };
      }),
    );
    movieImageValidations.push(
      ...localization.validation.map((validation) => {
        return {
          ...validation,
        };
      }),
    );
  });

  const mainVideo = videos.filter((video) => video.type === 'MAIN')?.[0];
  if (movie.publishing_id === undefined || movie.publishing_id === null) {
    throw new MosaicError({
      ...CommonErrors.EntityPublishingIdNotFound,
      messageParams: ['Movie', entityId],
    });
  }

  const movieLicenses = await buildMovieLicenses(
    movie.licenses,
    movie.content_owner,
    movie.business_type,
    queryable,
  );

  let extendedField = null;
  const metadataValidation: SnapshotValidationResult[] = [];
  if (!isNullOrWhitespace(movie.extended_field)) {
    try {
      extendedField = {
        custom: JSON.parse(movie.extended_field),
      };
    } catch (error) {
      metadataValidation.push({
        context: 'METADATA',
        severity: 'ERROR',
        message: 'Invalid JSON format in extended_field.',
      });
    }
  }

  if (mainVideo?.cue_points && mainVideo.cue_points.length > 0) {
    const cuePointTypeKeys = new Set<string>();
    for (const cuePoint of mainVideo.cue_points) {
      if (cuePoint.cue_point_type_key) {
        if (cuePointTypeKeys.has(cuePoint.cue_point_type_key)) {
          videosValidation.push({
            context: 'VIDEO',
            severity: 'ERROR',
            message: `Duplicate cue point type key found: ${cuePoint.cue_point_type_key}.`,
          });
        } else {
          cuePointTypeKeys.add(cuePoint.cue_point_type_key);
        }
      }
    }
  }

  const snapshotJson: MoviePublishedEvent = {
    content_id: movie.publishing_id,
    original_title: movie.original_title ?? undefined,
    released: movie.released ?? undefined,
    studio: movie.studio ?? undefined,
    production_countries: movie.productionCountries.map((c) => c.name),
    genre_ids: movie.genres.map((g) =>
      buildPublishingId('movie_genres', g.movie_genres_id),
    ),
    cast: movie.cast.map((c) => c.name),
    tags: movie.tags.map((c) => c.name),
    licenses: movieLicenses,
    images: movieImages,
    videos,
    audio_languages: mainVideo?.audio_languages,
    subtitle_languages: mainVideo?.subtitle_languages,
    caption_languages: mainVideo?.caption_languages,
    directors: movie.directors.map((d) => d.name),
    business_type: movie.business_type ?? undefined,
    credits_start_time:
      mainVideo?.cue_points?.filter(
        (cue_point) => cue_point.cue_point_type_key === 'CREDIT_START',
      )[0]?.time_in_seconds !== undefined
        ? String(
            mainVideo?.cue_points?.filter(
              (cue_point) => cue_point.cue_point_type_key === 'CREDIT_START',
            )[0]?.time_in_seconds,
          )
        : undefined,
    length_in_seconds: mainVideo?.length_in_seconds,
    extended_field: extendedField ? JSON.stringify(extendedField) : undefined,
    rating: movie.rating ?? undefined,
    age_rating: movie.age_rating ?? undefined,
    asset_type: 0,
    asset_subtype: 'Movie',
    localizations: localizations ?? [
      {
        is_default_locale: true,
        language_tag: DEFAULT_LOCALE_TAG,
        title: movie.title,
        synopsis: movie.synopsis ?? undefined,
        description: movie.description ?? undefined,
      },
    ],
  };

  return {
    result: snapshotJson,
    validation: [
      ...metadataValidation,
      ...movieImageValidations,
      ...videosValidation,
      ...localizationsValidation,
    ],
  };
};

const customMovieValidation = async (
  json: unknown,
): Promise<SnapshotValidationResult[]> => {
  const movieJson = json as MoviePublishedEvent;

  const yupSchema = Yup.object({
    genre_ids: atLeastOneString,
    images: requiredMovieCover,
    videos: videosValidation(),
  });

  const yupValidationResults = await validateYupPublishSchema(json, yupSchema);
  const licenseValidationResults: SnapshotValidationResult[] = [];
  let hasValidLicense = false;

  if (movieJson.licenses.length > 0) {
    movieJson.licenses.forEach((license, index) => {
      try {
        licenseValidationSchema.validateSync(license, { abortEarly: false });
        hasValidLicense = true;
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = err.inner
            ? err.inner.map((e) => e.message)
            : [err.message];
          licenseValidationResults.push({
            context: 'LICENSING',
            severity: 'ERROR',
            message: `License ${index + 1}: ${errors.toString()}`,
          });
        } else {
          licenseValidationResults.push({
            context: 'LICENSING',
            severity: 'ERROR',
            message: `Unknown validation error for License ${index + 1}: ${
              (err as Error).message
            }`,
          });
        }
      }
    });

    // If there is at least one valid license, we make the other errors WARNINGS and let the publishing process continue
    if (hasValidLicense && licenseValidationResults.length > 0) {
      licenseValidationResults.forEach((result) => {
        result.severity = 'WARNING';
      });
    }
  } else {
    licenseValidationResults.push({
      context: 'LICENSING',
      severity: 'ERROR',
      message: 'At least one license is required.',
    });
  }

  const customValidationResults: SnapshotValidationResult[] = [];

  if (!movieJson.videos || movieJson.videos.length === 0) {
    customValidationResults.push({
      context: 'VIDEO',
      severity: 'ERROR',
      message: 'At least one video is required.',
    });
  }

  // Check credit_start_time vs length_in_seconds
  if (movieJson.credits_start_time && movieJson.length_in_seconds) {
    const creditsStartTime = parseFloat(movieJson.credits_start_time);
    if (creditsStartTime >= movieJson.length_in_seconds) {
      customValidationResults.push({
        context: 'VIDEO',
        severity: 'ERROR',
        message:
          'Credits start time cue point must be less than the video length.',
      });
    }
  }

  // Check if title and description are present for default locale
  if (movieJson.localizations) {
    const defaultLocale = movieJson.localizations.find(
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

  return [
    ...yupValidationResults,
    ...licenseValidationResults,
    ...customValidationResults,
  ];
};

export const publishingMovieProcessor: EntityPublishingProcessor = {
  type: 'movies',
  aggregator: movieDataAggregator,
  validator: customMovieValidation,
  validationSchema: MoviePublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.MoviePublished,
  unpublishMessagingSettings: PublishServiceMessagingSettings.MovieUnpublished,
};
