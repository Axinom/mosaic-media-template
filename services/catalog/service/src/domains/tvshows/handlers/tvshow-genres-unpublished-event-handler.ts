import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  PublishServiceMessagingSettings,
  TvshowGenresUnpublishedEvent,
} from 'media-messages';
import { conditions as c, deletes, IsolationLevel } from 'zapatos/db';
import { Config } from '../../../common';

export class TvshowGenresUnpublishedEventHandler extends MessageHandler<TvshowGenresUnpublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.TvshowGenresUnpublished.messageType);
  }

  async onMessage(): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await deletes('tvshow_genre', { id: c.isNotNull }).run(txnClient);
      },
    );
  }
}
