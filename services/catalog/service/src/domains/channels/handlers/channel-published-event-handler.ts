import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { deletes, insert, upsert } from 'zapatos/db';
import { channel_images } from 'zapatos/schema';
import { Config } from '../../../common';
import { getChannelId } from '../common';
import { ChannelGuardedTransactionalMessageHandler } from './channel-guarded-transactional-message-handler';

export class ChannelPublishedEventHandler extends ChannelGuardedTransactionalMessageHandler<ChannelPublishedEvent> {
  constructor(config: Config) {
    super(
      ChannelServiceMultiTenantMessagingSettings.ChannelPublished,
      new Logger({
        config,
        context: ChannelPublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<ChannelPublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    const channelId = getChannelId(payload.id);
    await upsert(
      'channel',
      {
        id: channelId,
        title: payload.title,
        description: payload.description,
      },
      ['id'],
    ).run(txnClient);

    await deletes('channel_images', { channel_id: channelId }).run(txnClient);
    if (payload.images) {
      await insert(
        'channel_images',
        payload.images.map(
          (image): channel_images.Insertable => ({
            channel_id: channelId,
            type: image.type,
            path: image.path,
            width: image.width,
            height: image.height,
          }),
        ),
      ).run(txnClient);
    }
  }
}
