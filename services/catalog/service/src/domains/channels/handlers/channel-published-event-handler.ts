import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { deletes, doNothing, insert, IsolationLevel, upsert } from 'zapatos/db';
import { channel_images, channel_localizations } from 'zapatos/schema';
import { Config, DEFAULT_LOCALE_TAG } from '../../../common';
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
        await upsert('channel', { id: channelId }, ['id'], {
          updateColumns: doNothing,
        }).run(txnClient);

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

        await deletes('channel_localizations', { channel_id: channelId }).run(
          txnClient,
        );
        if (payload.localizations) {
          await insert(
            'channel_localizations',
            //TODO: Remove `as any[]` when messages lib is updated
            (payload.localizations as any[]).map(
              (l): channel_localizations.Insertable => ({
                channel_id: channelId,
                is_default_locale: l.is_default_locale,
                locale: l.language_tag,
                title: l.title,
                description: l.description,
              }),
            ),
          ).run(txnClient);
        } else {
          await insert('channel_localizations', {
            channel_id: channelId,
            is_default_locale: true,
            locale: DEFAULT_LOCALE_TAG,
            title: payload.title,
            description: payload.description,
          }).run(txnClient);
        }
      },
    );
  }
}
