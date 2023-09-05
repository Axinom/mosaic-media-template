import { MessageInfo } from '@axinom/mosaic-message-bus';
import { createOffsetDate } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import { TvshowUnpublishedEvent } from 'media-messages';
import { all, count, insert, selectOne } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { TvshowUnpublishedEventHandler } from './tvshow-unpublished-event-handler';

describe('TvshowPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: TvshowUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new TvshowUnpublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('tvshow');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing tvshow is unpublished', async () => {
      // Arrange
      const tvshowId = 'tvshow-1';
      await insert('tvshow', { id: tvshowId }).run(ctx.ownerPool);
      await insert('tvshow_localizations', {
        tvshow_id: tvshowId,
        title: 'Some title',
        description: 'testing',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      await insert('tvshow_genres_relation', {
        tvshow_id: tvshowId,
        tvshow_genre_id: 'tvshow-genre-1',
        order_no: 1,
      }).run(ctx.ownerPool);
      await insert('tvshow_licenses', {
        tvshow_id: tvshowId,
        start_time: createOffsetDate(-(60 * 60)),
      }).run(ctx.ownerPool);
      await insert('tvshow_images', {
        tvshow_id: tvshowId,
        type: 'COVER',
      }).run(ctx.ownerPool);
      const tvshowVideo = await insert('tvshow_videos', {
        tvshow_id: tvshowId,
      }).run(ctx.ownerPool);
      await insert('tvshow_video_streams', {
        tvshow_video_id: tvshowVideo.id,
      }).run(ctx.ownerPool);
      await insert('tvshow_video_cue_points', {
        tvshow_video_id: tvshowVideo.id,
        cue_point_type_key: 'TEST',
        time_in_seconds: 123,
      }).run(ctx.ownerPool);

      const message: TvshowUnpublishedEvent = { content_id: 'tvshow-1' };
      const messageInfo = stub<MessageInfo<TvshowUnpublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const tvshow = await selectOne('tvshow', { id: message.content_id }).run(
        ctx.ownerPool,
      );
      const localizationsCount = await count('tvshow_localizations', all).run(
        ctx.ownerPool,
      );
      const genreRelationsCount = await count(
        'tvshow_genres_relation',
        all,
      ).run(ctx.ownerPool);
      const licensesCount = await count('tvshow_licenses', all).run(
        ctx.ownerPool,
      );
      const imagesCount = await count('tvshow_images', all).run(ctx.ownerPool);
      const videosCount = await count('tvshow_videos', all).run(ctx.ownerPool);
      const streamsCount = await count('tvshow_video_streams', all).run(
        ctx.ownerPool,
      );
      const cuePointsCount = await count('tvshow_video_cue_points', all).run(
        ctx.ownerPool,
      );

      expect(tvshow).toBeUndefined();

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
