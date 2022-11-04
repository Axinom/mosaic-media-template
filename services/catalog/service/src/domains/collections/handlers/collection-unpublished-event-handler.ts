import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  CollectionUnpublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class CollectionUnpublishedEventHandler extends MessageHandler<CollectionUnpublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.CollectionUnpublished.messageType);
  }

  async onMessage(
    payload: CollectionUnpublishedEvent,
    _message: MessageInfo<CollectionUnpublishedEvent>,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      db.IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await db
          .deletes('collection', { id: payload.content_id })
          .run(txnClient);
      },
    );
  }
}
