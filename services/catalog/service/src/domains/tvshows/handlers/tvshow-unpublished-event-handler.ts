import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  PublishServiceMessagingSettings,
  TvshowUnpublishedEvent,
} from 'media-messages';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class TvshowUnpublishedEventHandler extends MessageHandler<TvshowUnpublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.TvshowUnpublished.messageType);
  }

  async onMessage(
    payload: TvshowUnpublishedEvent,
    _message: MessageInfo<TvshowUnpublishedEvent>,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      db.IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await db.deletes('tvshow', { id: payload.content_id }).run(txnClient);
      },
    );
  }
}
