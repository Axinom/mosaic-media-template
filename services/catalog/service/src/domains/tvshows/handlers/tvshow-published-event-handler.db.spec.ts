import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { TvshowPublishedEvent } from 'media-messages';
import { insert, select, selectOne } from 'zapatos/db';
import { tvshow } from 'zapatos/schema';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import {
  createTestContext,
  createTvshowPublishedEvent,
  ITestContext,
} from '../../../tests/test-utils';
import { TvshowPublishedEventHandler } from './tvshow-published-event-handler';

describe('TvshowPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: TvshowPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new TvshowPublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('tvshow');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('A new tvshow is published', async () => {
      // Arrange
      const message = createTvshowPublishedEvent('tvshow-1');
      const messageInfo = stub<MessageInfo<TvshowPublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const tvshow = await selectOne('tvshow', {
        id: message.content_id,
      }).run(ctx.ownerPool);
      expect(tvshow).toEqual<tvshow.JSONSelectable>({
        id: message.content_id,
        tvshow_cast: message.cast ?? null,
        original_title: message.original_title ?? null,
        production_countries: message.production_countries ?? null,
        released: message.released ?? null,
        studio: message.studio ?? null,
        tags: message.tags ?? null,
      });

      const images = await select('tvshow_images', {
        tvshow_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(images).toMatchObject(message.images!);

      // Remove `video_streams` array from `video` object
      const expectedVideos = message.videos.map((video) => {
        return Object.fromEntries(
          Object.entries(video).filter(
            ([key, _value]) => key !== 'video_streams' && key !== 'cue_points',
          ),
        );
      });
      const videos = await select('tvshow_videos', {
        tvshow_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(videos).toMatchObject(expectedVideos);

      const tvshowVideoStreams = (
        await select('tvshow_video_streams', {
          tvshow_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, tvshow_video_id, ...stream }) => stream);
      expect(tvshowVideoStreams).toIncludeSameMembers(
        message.videos[0].video_streams!,
      );
      const videoCuePoints = (
        await select('tvshow_video_cue_points', {
          tvshow_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, tvshow_video_id, ...cuePoint }) => cuePoint);
      expect(videoCuePoints).toIncludeSameMembers(
        message.videos[0].cue_points!,
      );

      const licenses = await select('tvshow_licenses', {
        tvshow_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(licenses).toMatchObject(licenses);

      const genreRelations = await select(
        'tvshow_genres_relation',
        {
          tvshow_id: message.content_id,
        },
        {
          order: {
            by: 'order_no',
            direction: 'ASC',
          },
        },
      ).run(ctx.ownerPool);
      expect(genreRelations.map((g) => g.tvshow_genre_id)).toEqual(
        message.genre_ids,
      );
      const localizations = await select(
        'tvshow_localizations',
        { tvshow_id: message.content_id },
        {
          columns: [
            'title',
            'description',
            'synopsis',
            'locale',
            'is_default_locale',
          ],
        },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        message.localizations.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });

    test('An existing tvshow is republished', async () => {
      // Arrange
      await insert('tvshow', {
        id: 'tvshow-1',
        original_title: 'Incorrect original title',
      }).run(ctx.ownerPool);
      await insert('tvshow_localizations', {
        tvshow_id: 'tvshow-1',
        title: 'Old title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      const message = createTvshowPublishedEvent('tvshow-1');
      const messageInfo = stub<MessageInfo<TvshowPublishedEvent>>({
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

      expect(tvshow?.original_title).toEqual(message.original_title);
      const localizations = await select(
        'tvshow_localizations',
        { tvshow_id: 'tvshow-1' },
        {
          columns: [
            'title',
            'description',
            'synopsis',
            'locale',
            'is_default_locale',
          ],
        },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        message.localizations.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });
  });
});
