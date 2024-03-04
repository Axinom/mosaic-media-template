import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  MoviePublishedEvent,
  PublishServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import {
  movie_images,
  movie_licenses,
  movie_video_cue_points,
  movie_video_streams,
} from 'zapatos/schema';
import { Config } from '../../../common';

export class MoviePublishedEventHandler extends TransactionalInboxMessageHandler<
  MoviePublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.MoviePublished,
      new Logger({
        config,
        context: MoviePublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<MoviePublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('movie', { id: payload.content_id }).run(txnClient);

    const insertedMovie = await db
      .insert('movie', {
        id: payload.content_id,
        title: payload.title,
        original_title: payload.original_title,
        synopsis: payload.synopsis,
        description: payload.description,
        released: payload.released,
        tags: payload.tags,
        movie_cast: payload.cast,
        studio: payload.studio,
        production_countries: payload.production_countries,
      })
      .run(txnClient);

    if (payload.videos) {
      for (const video of payload.videos) {
        // Remove `video_streams` array from `video` object
        const { video_streams, cue_points, ...videoToInsert } = video;

        const movieVideo = await db
          .insert('movie_videos', {
            movie_id: insertedMovie.id,
            ...videoToInsert,
          })
          .run(txnClient);

        if (video_streams !== undefined) {
          await db
            .insert(
              'movie_video_streams',
              video_streams.map(
                (videoStream): movie_video_streams.Insertable => ({
                  movie_video_id: movieVideo.id,
                  ...videoStream,
                }),
              ),
            )
            .run(txnClient);
        }

        if (cue_points !== undefined) {
          await db
            .insert(
              'movie_video_cue_points',
              cue_points.map(
                (cuePoint): movie_video_cue_points.Insertable => ({
                  movie_video_id: movieVideo.id,
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
          'movie_images',
          payload.images.map(
            (image): movie_images.Insertable => ({
              movie_id: insertedMovie.id,
              ...image,
            }),
          ),
        )
        .run(txnClient);
    }

    await db
      .insert(
        'movie_licenses',
        payload.licenses.map(
          (license): movie_licenses.Insertable => ({
            movie_id: insertedMovie.id,
            ...license,
          }),
        ),
      )
      .run(txnClient);

    if (payload.genre_ids) {
      await db
        .insert(
          'movie_genres_relation',
          payload.genre_ids.map((genreId, i) => ({
            movie_id: insertedMovie.id,
            movie_genre_id: genreId,
            order_no: i,
          })),
        )
        .run(txnClient);
    }
  }
}
