import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  PublishServiceMessagingSettings,
  TvshowUnpublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class TvshowUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  TvshowUnpublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.TvshowUnpublished,
      new Logger({
        config,
        context: TvshowUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<TvshowUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('tvshow', { id: payload.content_id }).run(txnClient);
  }
}
