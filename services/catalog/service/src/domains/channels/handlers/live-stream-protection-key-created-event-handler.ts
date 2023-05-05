import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import {
  LiveStreamProtectionKeyCreatedEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { IsolationLevel, update } from 'zapatos/db';
import { Config } from '../../../common';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class LiveStreamProtectionKeyCreatedEventHandler extends AuthenticatedMessageHandler<LiveStreamProtectionKeyCreatedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    protected readonly config: Config,
  ) {
    super(
      VodToLiveServiceMessagingSettings.LiveStreamProtectionKeyCreated
        .messageType,
      config,
    );
  }

  async onMessage(payload: LiveStreamProtectionKeyCreatedEvent): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await update(
          'channel',
          {
            key_id: payload.key_id,
          },
          { id: payload.channel_id },
        ).run(txnClient);
      },
    );
  }
}
