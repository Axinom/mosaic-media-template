import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  PublishServiceMessagingSettings,
  SeasonUnpublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class SeasonUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  SeasonUnpublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.SeasonUnpublished,
      new Logger({
        config,
        context: SeasonUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<SeasonUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('season', { id: payload.content_id }).run(txnClient);
  }
}
