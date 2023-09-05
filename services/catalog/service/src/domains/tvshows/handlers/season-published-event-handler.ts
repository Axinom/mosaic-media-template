import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  PublishServiceMessagingSettings,
  SeasonPublishedEvent,
} from 'media-messages';
import { deletes, insert, IsolationLevel } from 'zapatos/db';
import {
  season_images,
  season_licenses,
  season_localizations,
  season_video_cue_points,
  season_video_streams,
} from 'zapatos/schema';
import { Config } from '../../../common';

export class SeasonPublishedEventHandler extends MessageHandler<SeasonPublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.SeasonPublished.messageType);
  }

  async onMessage(
    payload: SeasonPublishedEvent,
    _message: MessageInfo<SeasonPublishedEvent>,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await deletes('season', { id: payload.content_id }).run(txnClient);

        const insertedSeason = await insert('season', {
          id: payload.content_id,
          tvshow_id: payload.tvshow_id,
          index: payload.index,
          released: payload.released,
          tags: payload.tags,
          season_cast: payload.cast,
          studio: payload.studio,
          production_countries: payload.production_countries,
        }).run(txnClient);

        if (payload.videos) {
          for (const video of payload.videos) {
            const { video_streams, cue_points, ...videoToInsert } = video;

            const seasonVideo = await insert('season_videos', {
              season_id: insertedSeason.id,
              ...videoToInsert,
            }).run(txnClient);
            if (video_streams !== undefined) {
              await insert(
                'season_video_streams',
                video_streams.map(
                  (videoStream): season_video_streams.Insertable => ({
                    season_video_id: seasonVideo.id,
                    ...videoStream,
                  }),
                ),
              ).run(txnClient);
            }

            if (cue_points !== undefined) {
              await insert(
                'season_video_cue_points',
                cue_points.map(
                  (cuePoint): season_video_cue_points.Insertable => ({
                    season_video_id: seasonVideo.id,
                    ...cuePoint,
                  }),
                ),
              ).run(txnClient);
            }
          }
        }

        if (payload.images) {
          await insert(
            'season_images',
            payload.images.map(
              (image): season_images.Insertable => ({
                season_id: insertedSeason.id,
                ...image,
              }),
            ),
          ).run(txnClient);
        }

        await insert(
          'season_licenses',
          payload.licenses.map(
            (license): season_licenses.Insertable => ({
              season_id: insertedSeason.id,
              ...license,
            }),
          ),
        ).run(txnClient);

        if (payload.genre_ids) {
          await insert(
            'season_genres_relation',
            payload.genre_ids.map((genreId, i) => ({
              season_id: insertedSeason.id,
              tvshow_genre_id: genreId,
              order_no: i,
            })),
          ).run(txnClient);
        }

        if (payload.localizations) {
          await insert(
            'season_localizations',
            payload.localizations.map(
              (l): season_localizations.Insertable => ({
                season_id: payload.content_id,
                is_default_locale: l.is_default_locale,
                locale: l.language_tag,
                synopsis: l.synopsis,
                description: l.description,
              }),
            ),
          ).run(txnClient);
        }
      },
    );
  }
}
