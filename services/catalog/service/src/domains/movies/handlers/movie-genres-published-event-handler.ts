import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  MovieGenresPublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { conditions as c, deletes, IsolationLevel, upsert } from 'zapatos/db';
import { Config } from '../../../common';

export class MovieGenresPublishedEventHandler extends MessageHandler<MovieGenresPublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.MovieGenresPublished.messageType);
  }

  async onMessage(payload: MovieGenresPublishedEvent): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
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
      },
    );
  }
}
