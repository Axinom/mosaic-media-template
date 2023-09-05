import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  PublishServiceMessagingSettings,
  TvshowGenresPublishedEvent,
} from 'media-messages';
import {
  conditions as c,
  deletes,
  insert,
  IsolationLevel,
  upsert,
} from 'zapatos/db';
import { tvshow_genre_localizations } from 'zapatos/schema';
import { Config } from '../../../common';

export class TvshowGenresPublishedEventHandler extends MessageHandler<TvshowGenresPublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.TvshowGenresPublished.messageType);
  }

  async onMessage(payload: TvshowGenresPublishedEvent): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
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

        await deletes('tvshow_genre_localizations', {}).run(txnClient);
        await insert('tvshow_genre_localizations', localizations).run(
          txnClient,
        );
      },
    );
  }
}
