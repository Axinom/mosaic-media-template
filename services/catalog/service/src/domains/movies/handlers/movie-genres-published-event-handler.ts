import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  MovieGenresPublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import {
  conditions as c,
  deletes,
  insert,
  IsolationLevel,
  upsert,
} from 'zapatos/db';
import { movie_genre_localizations } from 'zapatos/schema';
import { Config } from '../../../common';

export class MovieGenresPublishedEventHandler extends MessageHandler<MovieGenresPublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.MovieGenresPublished.messageType);
  }

  async onMessage(payload: MovieGenresPublishedEvent): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await deletes('movie_genre', {
          id: c.isNotIn(payload.genres.map((genre) => genre.content_id)),
        }).run(txnClient);

        await upsert(
          'movie_genre',
          payload.genres.map((genre) => ({
            id: genre.content_id,
            order_no: genre.order_no,
          })),
          ['id'],
        ).run(txnClient);

        const localizations = payload.genres.flatMap((genre) => {
          return genre.localizations.map(
            (l): movie_genre_localizations.Insertable => ({
              movie_genre_id: genre.content_id,
              is_default_locale: l.is_default_locale,
              locale: l.language_tag,
              title: l.title,
            }),
          );
        });

        await deletes('movie_genre_localizations', {}).run(txnClient);
        await insert('movie_genre_localizations', localizations).run(txnClient);
      },
    );
  }
}
