import {
  MovieGenre,
  MovieGenresPublishedEvent,
  MovieGenresPublishedEventSchema,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { all, Queryable, select } from 'zapatos/db';
import { Config } from '../../../common';
import {
  buildPublishingId,
  EntityPublishingProcessor,
  SnapshotDataAggregator,
  SnapshotValidationResult,
} from '../../../publishing';
import { getMovieGenreLocalizationsMetadata } from '../localization/get-movie-genre-localizations-metadata';

const movieGenresDataAggregator: SnapshotDataAggregator = async (
  _entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const genres = await select('movie_genres', all, {
    columns: ['id', 'sort_order', 'title'],
    order: { by: 'sort_order', direction: 'ASC' },
  }).run(queryable);

  const validations: SnapshotValidationResult[] = [];
  const mappedGenres: MovieGenre[] = [];
  for (const genre of genres) {
    const { result: localizations, validation: localizationsValidation } =
      await getMovieGenreLocalizationsMetadata(
        config,
        authToken,
        genre.id.toString(),
        genre.title,
      );
    mappedGenres.push({
      title: genre.title,
      order_no: genre.sort_order,
      content_id: buildPublishingId('movie_genres', genre.id),
      localizations,
    });
    validations.push(...localizationsValidation);
  }

  const snapshotJson: MovieGenresPublishedEvent = {
    genres: mappedGenres,
  };

  return {
    result: snapshotJson,
    validation:
      genres.length > 0
        ? validations
        : [
            {
              message: 'At least one genre must exist.',
              severity: 'ERROR',
              context: 'METADATA',
            },
          ],
  };
};

export const publishingMovieGenresProcessor: EntityPublishingProcessor = {
  type: 'movie_genres',
  aggregator: movieGenresDataAggregator,
  validationSchema: MovieGenresPublishedEventSchema,
  publishMessagingSettings:
    PublishServiceMessagingSettings.MovieGenresPublished,
  unpublishMessagingSettings:
    PublishServiceMessagingSettings.MovieGenresUnpublished,
};
