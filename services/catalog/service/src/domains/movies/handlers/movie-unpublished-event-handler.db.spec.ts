import { createOffsetDate } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { MovieUnpublishedEvent } from 'media-messages';
import { all, count, insert, selectOne } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { MovieUnpublishedEventHandler } from './movie-unpublished-event-handler';

describe('MovieUnpublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: MovieUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new MovieUnpublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('movie');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    test('An existing movie is unpublished', async () => {
      // Arrange
      const movieId = 'movie-1';
      await insert('movie', { id: movieId }).run(ctx.ownerPool);
      await insert('movie_localizations', {
        movie_id: movieId,
        title: 'Some title',
        description: 'testing',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      await insert('movie_genres_relation', {
        movie_id: movieId,
        movie_genre_id: 'movie-genre-1',
        order_no: 1,
      }).run(ctx.ownerPool);
      await insert('movie_licenses', {
        movie_id: movieId,
        start_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);
      await insert('movie_images', {
        movie_id: movieId,
        type: 'COVER',
      }).run(ctx.ownerPool);
      const movieVideo = await insert('movie_videos', {
        movie_id: movieId,
      }).run(ctx.ownerPool);
      await insert('movie_video_streams', {
        movie_video_id: movieVideo.id,
      }).run(ctx.ownerPool);
      await insert('movie_video_cue_points', {
        movie_video_id: movieVideo.id,
        cue_point_type_key: 'TEST',
        time_in_seconds: 123,
      }).run(ctx.ownerPool);

      const message = {
        payload: { content_id: 'movie-1' },
      } as unknown as TypedTransactionalMessage<MovieUnpublishedEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const movie = await selectOne('movie', {
        id: message.payload.content_id,
      }).run(ctx.ownerPool);
      const localizationsCount = await count('movie_localizations', all).run(
        ctx.ownerPool,
      );
      const genreRelationsCount = await count('movie_genres_relation', all).run(
        ctx.ownerPool,
      );
      const licensesCount = await count('movie_licenses', all).run(
        ctx.ownerPool,
      );
      const imagesCount = await count('movie_images', all).run(ctx.ownerPool);
      const videosCount = await count('movie_videos', all).run(ctx.ownerPool);
      const streamsCount = await count('movie_video_streams', all).run(
        ctx.ownerPool,
      );
      const cuePointsCount = await count('movie_video_cue_points', all).run(
        ctx.ownerPool,
      );

      expect(movie).toBeUndefined();

      expect(localizationsCount).toBe(0);
      expect(genreRelationsCount).toBe(0);
      expect(licensesCount).toBe(0);
      expect(imagesCount).toBe(0);
      expect(videosCount).toBe(0);
      expect(streamsCount).toBe(0);
      expect(cuePointsCount).toBe(0);
    });
  });
});
