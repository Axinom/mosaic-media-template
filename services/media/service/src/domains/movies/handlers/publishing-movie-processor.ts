import { MosaicError } from '@axinom/mosaic-service-common';
import {
  MoviePublishedEvent,
  MoviePublishedEventSchema,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { parent, Queryable, select, selectExactlyOne } from 'zapatos/db';
import { CommonErrors, Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  buildPublishingId,
  EntityPublishingProcessor,
  SnapshotDataAggregator,
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

  const mainVideo = videos.filter((video) => (video.type = 'MAIN'))?.[0];
  if (movie.publishing_id === undefined || movie.publishing_id === null) {
    throw new MosaicError({
      ...CommonErrors.EntityPublishingIdNotFound,
      messageParams: ['Movie', entityId],
    });
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
    licenses: movie.licenses.map((license) => ({
      start_time: license.license_start ?? undefined,
      end_time: license.license_end ?? undefined,
      countries: license.countries.map((country) => country.country_code ?? ''),
    })),
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
    extended_field: movie.extended_field ?? undefined,
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
      ...movieImageValidations,
      ...videosValidation,
      ...localizationsValidation,
    ],
  };
};

export const publishingMovieProcessor: EntityPublishingProcessor = {
  type: 'movies',
  aggregator: movieDataAggregator,
  // No custom validation is done when publishing a movie. This is BeyondDutch specific requirement.
  //validator: customMovieValidation,
  validationSchema: MoviePublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.MoviePublished,
  unpublishMessagingSettings: PublishServiceMessagingSettings.MovieUnpublished,
};
