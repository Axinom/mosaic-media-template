import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { deletes, insert, IsolationLevel } from 'zapatos/db';
import { channel_images } from 'zapatos/schema';
import { Config } from '../../../common';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class ChannelPublishedEventHandler extends AuthenticatedMessageHandler<ChannelPublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    protected readonly config: Config,
  ) {
    super(
      ChannelServiceMultiTenantMessagingSettings.ChannelPublished.messageType,
      config,
    );
  }

  async onMessage(payload: ChannelPublishedEvent): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await deletes('channel', { id: payload.id }).run(txnClient);

        const insertedChannel = await insert('channel', {
          id: payload.id,
          title: payload.title,
          description: payload.description,
        }).run(txnClient);

        if (payload.images) {
          await insert(
            'channel_images',
            payload.images.map(
              (image): channel_images.Insertable => ({
                channel_id: insertedChannel.id,
                type: image.type,
                path: image.path,
                width: image.width,
                height: image.height,
              }),
            ),
          ).run(txnClient);
        }
      },
    );
  }
}
