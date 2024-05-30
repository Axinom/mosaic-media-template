import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  MovieUnpublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class MovieUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  MovieUnpublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.MovieUnpublished,
      new Logger({
        config,
        context: MovieUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<MovieUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('movie', { id: payload.content_id }).run(txnClient);
  }
}
