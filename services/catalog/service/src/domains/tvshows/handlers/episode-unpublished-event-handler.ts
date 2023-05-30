import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  EpisodeUnpublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class EpisodeUnpublishedEventHandler extends MessageHandler<EpisodeUnpublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.EpisodeUnpublished.messageType);
  }

  async onMessage(
    payload: EpisodeUnpublishedEvent,
    _message: MessageInfo<EpisodeUnpublishedEvent>,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      db.IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await db.deletes('episode', { id: payload.content_id }).run(txnClient);
      },
    );
  }
}
