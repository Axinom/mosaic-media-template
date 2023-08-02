import {
  MoviePublishedEvent,
  MoviePublishedEventSchema,
  PublishServiceMessagingSettings,
} from 'media-messages';
import * as Yup from 'yup';
import { parent, Queryable, select, selectExactlyOne } from 'zapatos/db';
import { Config } from '../../../common';
import {
  atLeastOneString,
  buildPublishingId,
  EntityPublishingProcessor,
  licensesValidation,
  requiredCover,
  SnapshotDataAggregator,
  SnapshotValidationResult,
  validateYupPublishSchema,
  videosValidation,
} from '../../../publishing';
import { getImagesMetadata, getVideosMetadata } from '../../common';
import { getMovieLocalizationsMetadata } from '../localization';

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

  const snapshotJson: MoviePublishedEvent = {
    content_id: buildPublishingId('movies', movie.id),
    title: movie.title,
    synopsis: movie.synopsis ?? undefined,
    description: movie.description ?? undefined,
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
      countries: license.countries.map((country) => country.code),
    })),
    images,
    videos,
    localizations,
  };

  return {
    result: snapshotJson,
    validation: [
      ...imagesValidation,
      ...videosValidation,
      ...localizationsValidation,
    ],
  };
};

const customMovieValidation = async (
  json: unknown,
): Promise<SnapshotValidationResult[]> => {
  const yupSchema = Yup.object({
    genre_ids: atLeastOneString,
    images: requiredCover,
    videos: videosValidation('MAIN', 'TRAILER'),
    licenses: licensesValidation(true),
  });
  return validateYupPublishSchema(json, yupSchema);
};

export const publishingMovieProcessor: EntityPublishingProcessor = {
  type: 'movies',
  aggregator: movieDataAggregator,
  validator: customMovieValidation,
  validationSchema: MoviePublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.MoviePublished,
  unpublishMessagingSettings: PublishServiceMessagingSettings.MovieUnpublished,
};
