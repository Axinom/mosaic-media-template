import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelPublishedEvent,
  ChannelServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { deletes, insert, upsert } from 'zapatos/db';
import { channel_images, channel_localizations } from 'zapatos/schema';
import { Config, syncInMemoryLocales } from '../../../common';

export class ChannelPublishedEventHandler extends TransactionalInboxMessageHandler<
  ChannelPublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      ChannelServiceMessagingSettings.ChannelPublished,
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
    const channel_id = payload.content_id;
    await upsert(
      'channel',
      {
        id: channel_id,
      },
      ['id'],
    ).run(txnClient);

    await deletes('channel_images', { channel_id }).run(txnClient);
    if (payload.images) {
      await insert(
        'channel_images',
        payload.images.map(
          (image): channel_images.Insertable => ({
            channel_id,
            type: image.type,
            path: image.path,
            width: image.width,
            height: image.height,
          }),
        ),
      ).run(txnClient);
    }

    await deletes('channel_localizations', { channel_id }).run(txnClient);
    if (payload.localizations) {
      await syncInMemoryLocales(payload.localizations, txnClient);
      await insert(
        'channel_localizations',
        payload.localizations.map(
          (l): channel_localizations.Insertable => ({
            channel_id,
            is_default_locale: l.is_default_locale,
            locale: l.language_tag,
            title: l.title,
            description: l.description,
          }),
        ),
      ).run(txnClient);
    }
  }
}
