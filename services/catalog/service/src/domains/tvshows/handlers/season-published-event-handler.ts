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
import { deletes, insert } from 'zapatos/db';
import {
  season_images,
  season_licenses,
  season_localizations,
  season_video_cue_points,
  season_video_streams,
} from 'zapatos/schema';
import { Config, syncInMemoryLocales } from '../../../common';

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
      await syncInMemoryLocales(payload.localizations, txnClient);
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
  }
}
