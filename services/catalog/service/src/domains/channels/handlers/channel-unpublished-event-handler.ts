import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageInfo } from '@axinom/mosaic-message-bus';
import {
  ChannelServiceMultiTenantMessagingSettings,
  ChannelUnpublishedEvent,
} from '@axinom/mosaic-messages';
import * as db from 'zapatos/db';
import { Config } from '../../../common';
import { getChannelId } from '../common';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class ChannelUnpublishedEventHandler extends AuthenticatedMessageHandler<ChannelUnpublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    protected readonly config: Config,
  ) {
    super(
      ChannelServiceMultiTenantMessagingSettings.ChannelUnpublished.messageType,
      config,
    );
  }

  async onMessage(
    payload: ChannelUnpublishedEvent,
    _message: MessageInfo<ChannelUnpublishedEvent>,
  ): Promise<void> {
    const channelId = getChannelId(payload.id);
    await transactionWithContext(
      this.loginPool,
      db.IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await db.deletes('channel', { id: channelId }).run(txnClient);
      },
    );
  }
}
