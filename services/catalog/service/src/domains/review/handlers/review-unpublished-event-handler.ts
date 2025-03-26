import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  PublishServiceMessagingSettings,
  ReviewUnpublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class ReviewUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  ReviewUnpublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.ReviewUnpublished,
      new Logger({
        config,
        context: ReviewUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<ReviewUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('review', { id: payload.content_id }).run(txnClient);
  }
}
