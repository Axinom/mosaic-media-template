import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  PublishServiceMessagingSettings,
  SeasonUnpublishedEvent,
} from 'media-messages';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class SeasonUnpublishedEventHandler extends MessageHandler<SeasonUnpublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.SeasonUnpublished.messageType);
  }

  async onMessage(
    payload: SeasonUnpublishedEvent,
    _message: MessageInfo<SeasonUnpublishedEvent>,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      db.IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await db.deletes('season', { id: payload.content_id }).run(txnClient);
      },
    );
  }
}
