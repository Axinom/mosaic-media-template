import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  PublishServiceMessagingSettings,
  SeasonPublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import {
  season_images,
  season_licenses,
  season_video_cue_points,
  season_video_streams,
} from 'zapatos/schema';
import { Config } from '../../../common';

export class SeasonPublishedEventHandler extends TransactionalInboxMessageHandler<
  SeasonPublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.SeasonPublished,
      new Logger({
        config,
        context: SeasonPublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<SeasonPublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('season', { id: payload.content_id }).run(txnClient);

    const insertedSeason = await db
      .insert('season', {
        id: payload.content_id,
        tvshow_id: payload.tvshow_id,
        index: payload.index,
        synopsis: payload.synopsis,
        description: payload.description,
        released: payload.released,
        tags: payload.tags,
        season_cast: payload.cast,
        studio: payload.studio,
        production_countries: payload.production_countries,
      })
      .run(txnClient);

    if (payload.videos) {
      for (const video of payload.videos) {
        const { video_streams, cue_points, ...videoToInsert } = video;

        const seasonVideo = await db
          .insert('season_videos', {
            season_id: insertedSeason.id,
            ...videoToInsert,
          })
          .run(txnClient);
        if (video_streams !== undefined) {
          await db
            .insert(
              'season_video_streams',
              video_streams.map(
                (videoStream): season_video_streams.Insertable => ({
                  season_video_id: seasonVideo.id,
                  ...videoStream,
                }),
              ),
            )
            .run(txnClient);
        }

        if (cue_points !== undefined) {
          await db
            .insert(
              'season_video_cue_points',
              cue_points.map(
                (cuePoint): season_video_cue_points.Insertable => ({
                  season_video_id: seasonVideo.id,
                  ...cuePoint,
                }),
              ),
            )
            .run(txnClient);
        }
      }
    }

    if (payload.images) {
      await db
        .insert(
          'season_images',
          payload.images.map(
            (image): season_images.Insertable => ({
              season_id: insertedSeason.id,
              ...image,
            }),
          ),
        )
        .run(txnClient);
    }

    await db
      .insert(
        'season_licenses',
        payload.licenses.map(
          (license): season_licenses.Insertable => ({
            season_id: insertedSeason.id,
            ...license,
          }),
        ),
      )
      .run(txnClient);

    if (payload.genre_ids) {
      await db
        .insert(
          'season_genres_relation',
          payload.genre_ids.map((genreId, i) => ({
            season_id: insertedSeason.id,
            tvshow_genre_id: genreId,
            order_no: i,
          })),
        )
        .run(txnClient);
    }
  }
}
