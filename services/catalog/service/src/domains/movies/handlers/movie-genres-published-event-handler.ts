import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  MovieGenresPublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { conditions as c, deletes, upsert } from 'zapatos/db';
import { Config } from '../../../common';

export class MovieGenresPublishedEventHandler extends TransactionalInboxMessageHandler<
  MovieGenresPublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.MovieGenresPublished,
      new Logger({
        config,
        context: MovieGenresPublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<MovieGenresPublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await deletes('movie_genre', {
      id: c.isNotIn(payload.genres.map((genre) => genre.content_id)),
    }).run(txnClient);

    await upsert(
      'movie_genre',
      payload.genres.map((genre) => ({
        id: genre.content_id,
        title: genre.title,
        order_no: genre.order_no,
      })),
      ['id'],
    ).run(txnClient);
  }
}
