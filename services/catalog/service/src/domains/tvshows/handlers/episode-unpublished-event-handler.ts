import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  EpisodeUnpublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class EpisodeUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  EpisodeUnpublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.EpisodeUnpublished,
      new Logger({
        config,
        context: EpisodeUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<EpisodeUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('episode', { id: payload.content_id }).run(txnClient);
  }
}
