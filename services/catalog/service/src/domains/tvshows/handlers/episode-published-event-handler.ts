import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageHandler, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  EpisodePublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import * as db from 'zapatos/db';
import {
  episode_images,
  episode_licenses,
  episode_video_cue_points,
  episode_video_streams,
} from 'zapatos/schema';
import { Config } from '../../../common';

export class EpisodePublishedEventHandler extends MessageHandler<EpisodePublishedEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    private readonly config: Config,
  ) {
    super(PublishServiceMessagingSettings.EpisodePublished.messageType);
  }

  async onMessage(
    payload: EpisodePublishedEvent,
    _message: MessageInfo<EpisodePublishedEvent>,
  ): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      db.IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        await db.deletes('episode', { id: payload.content_id }).run(txnClient);

        const insertedEpisode = await db
          .insert('episode', {
            id: payload.content_id,
            title: payload.title,
            season_id: payload.season_id,
            index: payload.index,
            original_title: payload.original_title,
            synopsis: payload.synopsis,
            description: payload.description,
            released: payload.released,
            tags: payload.tags,
            episode_cast: payload.cast,
            studio: payload.studio,
            production_countries: payload.production_countries,
          })
          .run(txnClient);

        if (payload.videos) {
          for (const video of payload.videos) {
            const { video_streams, cue_points, ...videoToInsert } = video;

            const episodeVideo = await db
              .insert('episode_videos', {
                episode_id: insertedEpisode.id,
                ...videoToInsert,
              })
              .run(txnClient);
            if (video_streams !== undefined) {
              await db
                .insert(
                  'episode_video_streams',
                  video_streams.map(
                    (videoStream): episode_video_streams.Insertable => ({
                      episode_video_id: episodeVideo.id,
                      ...videoStream,
                    }),
                  ),
                )
                .run(txnClient);
            }

            if (cue_points !== undefined) {
              await db
                .insert(
                  'episode_video_cue_points',
                  cue_points.map(
                    (cuePoint): episode_video_cue_points.Insertable => ({
                      episode_video_id: episodeVideo.id,
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
              'episode_images',
              payload.images.map(
                (image): episode_images.Insertable => ({
                  episode_id: insertedEpisode.id,
                  ...image,
                }),
              ),
            )
            .run(txnClient);
        }

        await db
          .insert(
            'episode_licenses',
            payload.licenses.map(
              (license): episode_licenses.Insertable => ({
                episode_id: insertedEpisode.id,
                ...license,
              }),
            ),
          )
          .run(txnClient);

        if (payload.genre_ids) {
          await db
            .insert(
              'episode_genres_relation',
              payload.genre_ids.map((genreId, i) => ({
                episode_id: insertedEpisode.id,
                tvshow_genre_id: genreId,
                order_no: i,
              })),
            )
            .run(txnClient);
        }
      },
    );
  }
}
