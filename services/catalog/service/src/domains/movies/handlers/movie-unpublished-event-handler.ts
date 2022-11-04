import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  MovieUnpublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class MovieUnpublishedEventHandler extends MessageHandler<MovieUnpublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.MovieUnpublished.messageType);
  }

  async onMessage(
    payload: MovieUnpublishedEvent,
    _message: MessageInfo<MovieUnpublishedEvent>,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      db.IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await db.deletes('movie', { id: payload.content_id }).run(txnClient);
      },
    );
  }
}
