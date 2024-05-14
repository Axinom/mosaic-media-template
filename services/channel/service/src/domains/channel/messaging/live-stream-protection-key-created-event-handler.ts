import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  LiveStreamProtectionKeyCreatedEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { selectOne, update } from 'zapatos/db';
import { Config } from '../../../common';
import { ChannelTransactionalInboxMessageHandler } from '../../../messaging';

export class LiveStreamProtectionKeyCreatedEventHandler extends ChannelTransactionalInboxMessageHandler<LiveStreamProtectionKeyCreatedEvent> {
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
    {
      payload: { channel_id, key_id },
    }: TypedTransactionalMessage<LiveStreamProtectionKeyCreatedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    const id = channel_id.substring('channel-'.length);
    const dbChannel = await selectOne('channels', { id }).run(txnClient);
    if (!dbChannel) {
      throw new MosaicError({
        message: `Channel with id ${id} not found! Failed to add channel's DRM key id.`,
        code: 'CHANNEL_NOT_FOUND',
      });
    }
    await update('channels', { key_id }, { id }).run(txnClient);
  }
}
