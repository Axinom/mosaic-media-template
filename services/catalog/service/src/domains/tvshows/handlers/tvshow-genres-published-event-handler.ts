import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  PublishServiceMessagingSettings,
  TvshowGenresPublishedEvent,
} from 'media-messages';
import { conditions as c, deletes, IsolationLevel, upsert } from 'zapatos/db';
import { Config } from '../../../common';

export class TvshowGenresPublishedEventHandler extends MessageHandler<TvshowGenresPublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.TvshowGenresPublished.messageType);
  }

  async onMessage(payload: TvshowGenresPublishedEvent): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await deletes('tvshow_genre', {
          id: c.isNotIn(payload.genres.map((genre) => genre.content_id)),
        }).run(txnClient);

        await upsert(
          'tvshow_genre',
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
