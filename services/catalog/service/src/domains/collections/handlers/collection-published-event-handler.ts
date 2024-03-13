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
import { collection_images, collection_items_relation } from 'zapatos/schema';
import { Config } from '../../../common';

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
      title: payload.title,
      synopsis: payload.synopsis,
      description: payload.description,
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
  }
}
