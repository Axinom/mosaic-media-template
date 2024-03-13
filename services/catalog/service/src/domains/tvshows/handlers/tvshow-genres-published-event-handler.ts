import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  PublishServiceMessagingSettings,
  TvshowGenresPublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import { conditions as c, deletes, upsert } from 'zapatos/db';
import { Config } from '../../../common';

export class TvshowGenresPublishedEventHandler extends TransactionalInboxMessageHandler<
  TvshowGenresPublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.TvshowGenresPublished,
      new Logger({
        config,
        context: TvshowGenresPublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<TvshowGenresPublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await deletes('tvshow_genre', {
      id: c.isNotIn(payload.genres.map((genre) => genre.content_id)),
    }).run(txnClient);

    await upsert(
      'tvshow_genre',
      payload.genres.map((genre) => ({
        id: genre.content_id,
        title: genre.title,
        order_no: genre.order_no,
      })),
      ['id'],
    ).run(txnClient);
  }
}
