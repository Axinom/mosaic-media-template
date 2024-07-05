import { MosaicError } from '@axinom/mosaic-service-common';
import {
  LiveStreamProtectionKeyCreatedEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { selectOne, update } from 'zapatos/db';
import { Config } from '../../../common';
import { getChannelId } from '../common';

import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { ChannelGuardedTransactionalMessageHandler } from './channel-guarded-transactional-message-handler';

export class LiveStreamProtectionKeyCreatedEventHandler extends ChannelGuardedTransactionalMessageHandler<LiveStreamProtectionKeyCreatedEvent> {
  constructor(config: Config) {
    super(
      VodToLiveServiceMessagingSettings.LiveStreamProtectionKeyCreated,
      new Logger({
        config,
        context: LiveStreamProtectionKeyCreatedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<LiveStreamProtectionKeyCreatedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    const channelId = getChannelId(payload.channel_id);
    const dbChannel = await selectOne('channel', {
      id: channelId,
    }).run(txnClient);
    if (!dbChannel) {
      throw new MosaicError({
        message: `Channel with id ${channelId} not found! Failed to add channel's DRM key id.`,
        code: 'CHANNEL_NOT_FOUND',
      });
    }
    await update('channel', { key_id: payload.key_id }, { id: channelId }).run(
      txnClient,
    );
  }
}
