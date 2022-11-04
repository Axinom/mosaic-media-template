import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  MovieGenresUnpublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { conditions as c, deletes, IsolationLevel } from 'zapatos/db';
import { Config } from '../../../common';

export class MovieGenresUnpublishedEventHandler extends MessageHandler<MovieGenresUnpublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.MovieGenresUnpublished.messageType);
  }

  async onMessage(): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await deletes('movie_genre', { id: c.isNotNull }).run(txnClient);
      },
    );
  }
}
