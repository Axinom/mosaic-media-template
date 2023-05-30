import {
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
} from '../../../publishing';

const movieGenresDataAggregator: SnapshotDataAggregator = async (
  _entityId: number,
  _authToken: string,
  _config: Config,
  queryable: Queryable,
) => {
  const genres = await select('movie_genres', all, {
    columns: ['id', 'sort_order', 'title'],
    order: { by: 'sort_order', direction: 'ASC' },
  }).run(queryable);

  const snapshotJson: MovieGenresPublishedEvent = {
    genres: genres.map((genre) => ({
      title: genre.title,
      order_no: genre.sort_order,
      content_id: buildPublishingId('movie_genres', genre.id),
    })),
  };

  return {
    result: snapshotJson,
    validation:
      genres.length > 0
        ? []
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
