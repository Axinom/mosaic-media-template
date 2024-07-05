import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  MovieGenresUnpublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { conditions as c, deletes } from 'zapatos/db';
import { Config } from '../../../common';

export class MovieGenresUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  MovieGenresUnpublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.MovieGenresUnpublished,
      new Logger({
        config,
        context: MovieGenresUnpublishedEventHandler.name,
      }),
      config,
    );
  }
  override async handleMessage(
    _: TypedTransactionalMessage<MovieGenresUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await deletes('movie_genre', { id: c.isNotNull }).run(txnClient);
  }
}
