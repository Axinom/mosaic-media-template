import { createOffsetDate } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { SeasonUnpublishedEvent } from 'media-messages';
import { all, count, insert, selectOne } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { SeasonUnpublishedEventHandler } from './season-unpublished-event-handler';

describe('SeasonPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: SeasonUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new SeasonUnpublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('season');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing season is unpublished', async () => {
      // Arrange
      const seasonId = 'season-1';
      await insert('season', { id: seasonId }).run(ctx.ownerPool);
      await insert('season_localizations', {
        season_id: seasonId,
        description: 'testing',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      await insert('season_genres_relation', {
        season_id: seasonId,
        tvshow_genre_id: 'tvshow-genre-1',
        order_no: 1,
      }).run(ctx.ownerPool);
      await insert('season_licenses', {
        season_id: seasonId,
        start_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);
      await insert('season_images', {
        season_id: seasonId,
        type: 'COVER',
      }).run(ctx.ownerPool);
      const seasonVideo = await insert('season_videos', {
        season_id: seasonId,
      }).run(ctx.ownerPool);
      await insert('season_video_streams', {
        season_video_id: seasonVideo.id,
      }).run(ctx.ownerPool);
      await insert('season_video_cue_points', {
        season_video_id: seasonVideo.id,
        cue_point_type_key: 'TEST',
        time_in_seconds: 123,
      }).run(ctx.ownerPool);

      const message = {
        payload: { content_id: 'season-1' },
      } as unknown as TypedTransactionalMessage<SeasonUnpublishedEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });
      // Assert
      const season = await selectOne('season', { id: message.content_id }).run(
        ctx.ownerPool,
      );
      const localizationsCount = await count('season_localizations', all).run(
        ctx.ownerPool,
      );
      const genreRelationsCount = await count(
        'season_genres_relation',
        all,
      ).run(ctx.ownerPool);
      const licensesCount = await count('season_licenses', all).run(
        ctx.ownerPool,
      );
      const imagesCount = await count('season_images', all).run(ctx.ownerPool);
      const videosCount = await count('season_videos', all).run(ctx.ownerPool);
      const streamsCount = await count('season_video_streams', all).run(
        ctx.ownerPool,
      );
      const cuePointsCount = await count('season_video_cue_points', all).run(
        ctx.ownerPool,
      );

      expect(season).toBeUndefined();

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
