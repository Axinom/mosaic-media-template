import { createOffsetDate } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import { EpisodeUnpublishedEvent } from 'media-messages';
import { all, count, insert, selectOne } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { EpisodeUnpublishedEventHandler } from './episode-unpublished-event-handler';

describe('EpisodePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: EpisodeUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new EpisodeUnpublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('episode');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    test('An existing episode is unpublished', async () => {
      // Arrange
      const episodeId = 'episode-1';
      await insert('episode', { id: episodeId }).run(ctx.ownerPool);
      await insert('episode_localizations', {
        episode_id: episodeId,
        title: 'Some title',
        description: 'testing',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      await insert('episode_genres_relation', {
        episode_id: episodeId,
        tvshow_genre_id: 'tvshow-genre-1',
        order_no: 1,
      }).run(ctx.ownerPool);
      await insert('episode_licenses', {
        episode_id: episodeId,
        start_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);
      await insert('episode_images', {
        episode_id: episodeId,
        type: 'COVER',
      }).run(ctx.ownerPool);
      const episodeVideo = await insert('episode_videos', {
        episode_id: episodeId,
      }).run(ctx.ownerPool);
      await insert('episode_video_streams', {
        episode_video_id: episodeVideo.id,
      }).run(ctx.ownerPool);
      await insert('episode_video_cue_points', {
        episode_video_id: episodeVideo.id,
        cue_point_type_key: 'TEST',
        time_in_seconds: 123,
      }).run(ctx.ownerPool);

      const message = {
        payload: { content_id: 'episode-1' },
      } as unknown as TypedTransactionalMessage<EpisodeUnpublishedEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const episode = await selectOne('episode', {
        id: message.payload.content_id,
      }).run(ctx.ownerPool);
      const localizationsCount = await count('episode_localizations', all).run(
        ctx.ownerPool,
      );
      const genreRelationsCount = await count(
        'episode_genres_relation',
        all,
      ).run(ctx.ownerPool);
      const licensesCount = await count('episode_licenses', all).run(
        ctx.ownerPool,
      );
      const imagesCount = await count('episode_images', all).run(ctx.ownerPool);
      const videosCount = await count('episode_videos', all).run(ctx.ownerPool);
      const streamsCount = await count('episode_video_streams', all).run(
        ctx.ownerPool,
      );
      const cuePointsCount = await count('episode_video_cue_points', all).run(
        ctx.ownerPool,
      );

      expect(episode).toBeUndefined();

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
