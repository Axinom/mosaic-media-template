import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MosaicError } from '@axinom/mosaic-service-common';
import {
  LiveStreamProtectionKeyCreatedEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { IsolationLevel, selectOne, update } from 'zapatos/db';
import { Config } from '../../../common';
import { getChannelId } from '../common';
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
    const channelId = getChannelId(payload.channel_id);
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        const dbChannel = await selectOne('channel', {
          id: channelId,
        }).run(txnClient);
        if (!dbChannel) {
          throw new MosaicError({
            message: `Channel with id ${channelId} not found! Failed to add channel's DRM key id.`,
            code: 'CHANNEL_NOT_FOUND',
          });
        }
        await update(
          'channel',
          { key_id: payload.key_id },
          { id: channelId },
        ).run(txnClient);
      },
    );
  }
}
