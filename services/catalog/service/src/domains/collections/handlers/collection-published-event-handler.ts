import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CollectionPublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { deletes, insert } from 'zapatos/db';
import {
  collection_images,
  collection_items_relation,
  collection_localizations,
} from 'zapatos/schema';
import { Config, syncInMemoryLocales } from '../../../common';

export class CollectionPublishedEventHandler extends TransactionalInboxMessageHandler<
  CollectionPublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.CollectionPublished,
      new Logger({
        config,
        context: CollectionPublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<CollectionPublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await deletes('collection', { id: payload.content_id }).run(txnClient);

    const insertedCollection = await insert('collection', {
      id: payload.content_id,
      tags: payload.tags,
    }).run(txnClient);

    if (payload.images) {
      await insert(
        'collection_images',
        payload.images.map(
          (image): collection_images.Insertable => ({
            collection_id: insertedCollection.id,
            ...image,
          }),
        ),
      ).run(txnClient);
    }

    if (payload.related_items) {
      await insert(
        'collection_items_relation',
        payload.related_items.map(
          (relation): collection_items_relation.Insertable => ({
            collection_id: insertedCollection.id,
            ...relation,
          }),
        ),
      ).run(txnClient);
    }

    if (payload.localizations) {
      await syncInMemoryLocales(payload.localizations, txnClient);
      await insert(
        'collection_localizations',
        payload.localizations.map(
          (l): collection_localizations.Insertable => ({
            collection_id: payload.content_id,
            is_default_locale: l.is_default_locale,
            locale: l.language_tag,
            title: l.title,
            synopsis: l.synopsis,
            description: l.description,
          }),
        ),
      ).run(txnClient);
    }
  }
}
