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
import { conditions as c, deletes, insert, upsert } from 'zapatos/db';
import { tvshow_genre_localizations } from 'zapatos/schema';
import { Config, syncInMemoryLocales } from '../../../common';

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
        order_no: genre.order_no,
      })),
      ['id'],
    ).run(txnClient);

    const localizations = payload.genres.flatMap((genre) => {
      return genre.localizations.map(
        (l): tvshow_genre_localizations.Insertable => ({
          tvshow_genre_id: genre.content_id,
          is_default_locale: l.is_default_locale,
          locale: l.language_tag,
          title: l.title,
        }),
      );
    });

    await syncInMemoryLocales(payload.genres[0].localizations, txnClient);
    await deletes('tvshow_genre_localizations', {}).run(txnClient);
    await insert('tvshow_genre_localizations', localizations).run(txnClient);
  }
}
