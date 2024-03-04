import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  PublishServiceMessagingSettings,
  TvshowGenresUnpublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import { conditions as c, deletes } from 'zapatos/db';
import { Config } from '../../../common';

export class TvshowGenresUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  TvshowGenresUnpublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.TvshowGenresUnpublished,
      new Logger({
        config,
        context: TvshowGenresUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    _: TypedTransactionalMessage<TvshowGenresUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await deletes('tvshow_genre', { id: c.isNotNull }).run(txnClient);
  }
}
