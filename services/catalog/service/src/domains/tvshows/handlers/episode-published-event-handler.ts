import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  EpisodePublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { deletes, insert } from 'zapatos/db';
import {
  episode_images,
  episode_licenses,
  episode_localizations,
  episode_video_cue_points,
  episode_video_streams,
} from 'zapatos/schema';
import { Config } from '../../../common';

export class EpisodePublishedEventHandler extends TransactionalInboxMessageHandler<
  EpisodePublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.EpisodePublished,
      new Logger({
        config,
        context: EpisodePublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<EpisodePublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await deletes('episode', { id: payload.content_id }).run(txnClient);

    const insertedEpisode = await insert('episode', {
      id: payload.content_id,
      season_id: payload.season_id,
      index: payload.index,
      original_title: payload.original_title,
      released: payload.released,
      tags: payload.tags,
      episode_cast: payload.cast,
      studio: payload.studio,
      production_countries: payload.production_countries,
    }).run(txnClient);

    if (payload.videos) {
      for (const video of payload.videos) {
        const { video_streams, cue_points, ...videoToInsert } = video;

        const episodeVideo = await insert('episode_videos', {
          episode_id: insertedEpisode.id,
          ...videoToInsert,
        }).run(txnClient);
        if (video_streams !== undefined) {
          await insert(
            'episode_video_streams',
            video_streams.map(
              (videoStream): episode_video_streams.Insertable => ({
                episode_video_id: episodeVideo.id,
                ...videoStream,
              }),
            ),
          ).run(txnClient);
        }

        if (cue_points !== undefined) {
          await insert(
            'episode_video_cue_points',
            cue_points.map(
              (cuePoint): episode_video_cue_points.Insertable => ({
                episode_video_id: episodeVideo.id,
                ...cuePoint,
              }),
            ),
          ).run(txnClient);
        }
      }
    }

    if (payload.images) {
      await insert(
        'episode_images',
        payload.images.map(
          (image): episode_images.Insertable => ({
            episode_id: insertedEpisode.id,
            ...image,
          }),
        ),
      ).run(txnClient);
    }

    await insert(
      'episode_licenses',
      payload.licenses.map(
        (license): episode_licenses.Insertable => ({
          episode_id: insertedEpisode.id,
          ...license,
        }),
      ),
    ).run(txnClient);

    if (payload.genre_ids) {
      await insert(
        'episode_genres_relation',
        payload.genre_ids.map((genreId, i) => ({
          episode_id: insertedEpisode.id,
          tvshow_genre_id: genreId,
          order_no: i,
        })),
      ).run(txnClient);
    }

    if (payload.localizations) {
      await insert(
        'episode_localizations',
        payload.localizations.map(
          (l): episode_localizations.Insertable => ({
            episode_id: payload.content_id,
            is_default_locale: l.is_default_locale,
            locale: l.language_tag,
            title: l.title,
            synopsis: l.synopsis,
            description: l.description,
          }),
        ),
      ).run(txnClient);
    }
  }
}
