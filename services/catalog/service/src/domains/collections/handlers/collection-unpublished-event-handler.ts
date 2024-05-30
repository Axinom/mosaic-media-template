import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CollectionUnpublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class CollectionUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  CollectionUnpublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.CollectionUnpublished,
      new Logger({
        config,
        context: CollectionUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<CollectionUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('collection', { id: payload.content_id }).run(txnClient);
  }
}
