import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  CollectionPublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { deletes, insert, IsolationLevel } from 'zapatos/db';
import {
  collection_images,
  collection_items_relation,
  collection_localizations,
} from 'zapatos/schema';
import { Config } from '../../../common';

export class CollectionPublishedEventHandler extends MessageHandler<CollectionPublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.CollectionPublished.messageType);
  }

  async onMessage(payload: CollectionPublishedEvent): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
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
      },
    );
  }
}
