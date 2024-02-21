import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { deletes, insert, IsolationLevel, upsert } from 'zapatos/db';
import { channel_images } from 'zapatos/schema';
import { Config } from '../../../common';
import { getChannelId } from '../common';
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
    const channelId = getChannelId(payload.id);
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await upsert(
          'channel',
          {
            id: channelId,
            title: payload.title,
            description: payload.description,
          },
          ['id'],
        ).run(txnClient);

        await deletes('channel_images', { channel_id: channelId }).run(
          txnClient,
        );
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
      },
    );
  }
}
