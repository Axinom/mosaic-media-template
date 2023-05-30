import {
  PublishServiceMessagingSettings,
  TvshowGenresPublishedEvent,
  TvshowGenresPublishedEventSchema,
} from 'media-messages';
import { all, Queryable, select } from 'zapatos/db';
import { Config } from '../../../common';
import {
  buildPublishingId,
  EntityPublishingProcessor,
  SnapshotDataAggregator,
} from '../../../publishing';

const tvshowGenresDataAggregator: SnapshotDataAggregator = async (
  _entityId: number,
  _authToken: string,
  _config: Config,
  queryable: Queryable,
) => {
  const genres = await select('tvshow_genres', all, {
    columns: ['id', 'sort_order', 'title'],
    order: { by: 'sort_order', direction: 'ASC' },
  }).run(queryable);

  const snapshotJson: TvshowGenresPublishedEvent = {
    genres: genres.map((genre) => ({
      title: genre.title,
      order_no: genre.sort_order,
      content_id: buildPublishingId('tvshow_genres', genre.id),
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

export const publishingTvshowGenresProcessor: EntityPublishingProcessor = {
  type: 'tvshow_genres',
  aggregator: tvshowGenresDataAggregator,
  validationSchema: TvshowGenresPublishedEventSchema,
  publishMessagingSettings:
    PublishServiceMessagingSettings.TvshowGenresPublished,
  unpublishMessagingSettings:
    PublishServiceMessagingSettings.TvshowGenresUnpublished,
};
