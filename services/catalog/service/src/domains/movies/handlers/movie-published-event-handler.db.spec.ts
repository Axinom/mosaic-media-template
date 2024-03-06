import 'jest-extended';
import { insert, select, selectOne } from 'zapatos/db';
import { movie } from 'zapatos/schema';
import {
  createMoviePublishedMessage,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { MoviePublishedEventHandler } from './movie-published-event-handler';

describe('MoviePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: MoviePublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new MoviePublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('movie');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('A new movie is published', async () => {
      // Arrange
      const message = createMoviePublishedMessage('movie-1');
      const payload = message.payload;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // TODO: Consider verifying via the GQL API.
      // Assert
      const movie = await selectOne('movie', { id: payload.content_id }).run(
        ctx.ownerPool,
      );
      expect(movie).toEqual<movie.JSONSelectable>({
        id: payload.content_id,
        title: payload.title ?? null,
        description: payload.description ?? null,
        movie_cast: payload.cast ?? null,
        original_title: payload.original_title ?? null,
        production_countries: payload.production_countries ?? null,
        released: payload.released ?? null,
        studio: payload.studio ?? null,
        synopsis: payload.synopsis ?? null,
        tags: payload.tags ?? null,
      });

      const images = await select('movie_images', {
        movie_id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(images).toMatchObject(payload.images!);

      // Remove `video_streams` array from `video` object
      const expectedVideos = payload.videos.map((video) => {
        return Object.fromEntries(
          Object.entries(video).filter(
            ([key, _value]) => key !== 'video_streams' && key !== 'cue_points',
          ),
        );
      });
      const videos = await select('movie_videos', {
        movie_id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(videos).toMatchObject(expectedVideos);

      const movieVideoStreams = (
        await select('movie_video_streams', {
          movie_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, movie_video_id, ...stream }) => stream);
      expect(movieVideoStreams).toIncludeSameMembers(
        payload.videos[0].video_streams!,
      );

      const videoCuePoints = (
        await select('movie_video_cue_points', {
          movie_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, movie_video_id, ...cuePoint }) => cuePoint);
      expect(videoCuePoints).toIncludeSameMembers(
        payload.videos[0].cue_points!,
      );

      const licenses = await select('movie_licenses', {
        movie_id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(licenses).toMatchObject(licenses);

      const genreRelations = await select(
        'movie_genres_relation',
        {
          movie_id: payload.content_id,
        },
        {
          order: {
            by: 'order_no',
            direction: 'ASC',
          },
        },
      ).run(ctx.ownerPool);
      expect(genreRelations.map((g) => g.movie_genre_id)).toEqual(
        payload.genre_ids,
      );
    });

    test('An existing movie is republished', async () => {
      // Arrange
      await insert('movie', { id: 'movie-1', title: 'Old title' }).run(
        ctx.ownerPool,
      );
      const message = createMoviePublishedMessage('movie-1');
      const payload = message.payload;
      payload.title = 'New title';

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const movie = await selectOne('movie', { id: payload.content_id }).run(
        ctx.ownerPool,
      );

      expect(movie?.title).toEqual('New title');
    });
  });
});
