import 'jest-extended';
import { insert, select, selectOne } from 'zapatos/db';
import { episode } from 'zapatos/schema';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import {
  createEpisodePublishedMessage,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { EpisodePublishedEventHandler } from './episode-published-event-handler';

describe('EpisodePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: EpisodePublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new EpisodePublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('episode');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('A new episode is published', async () => {
      // Arrange
      const message = createEpisodePublishedMessage('episode-1');
      const payload = message.payload;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const episode = await selectOne('episode', {
        id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(episode).toEqual<episode.JSONSelectable>({
        id: payload.content_id,
        season_id: payload.season_id ?? null,
        index: payload.index,
        episode_cast: payload.cast ?? null,
        production_countries: payload.production_countries ?? null,
        original_title: payload.original_title ?? null,
        released: payload.released ?? null,
        studio: payload.studio ?? null,
        tags: payload.tags ?? null,
      });

      const images = await select('episode_images', {
        episode_id: payload.content_id,
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
      const videos = await select('episode_videos', {
        episode_id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(videos).toMatchObject(expectedVideos);

      const episodeVideoStreams = (
        await select('episode_video_streams', {
          episode_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, episode_video_id, ...stream }) => stream);
      expect(episodeVideoStreams).toIncludeSameMembers(
        payload.videos[0].video_streams!,
      );

      const videoCuePoints = (
        await select('episode_video_cue_points', {
          episode_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, episode_video_id, ...cuePoint }) => cuePoint);
      expect(videoCuePoints).toIncludeSameMembers(
        payload.videos[0].cue_points!,
      );

      const licenses = await select('episode_licenses', {
        episode_id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(licenses).toMatchObject(licenses);
      const localizations = await select(
        'episode_localizations',
        { episode_id: payload.content_id },
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
        payload.localizations.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });

    test('An existing episode is republished', async () => {
      // Arrange
      await insert('episode', {
        id: 'episode-1',
        original_title: 'Incorrect original title',
      }).run(ctx.ownerPool);
      await insert('episode_localizations', {
        episode_id: 'episode-1',
        title: 'Old title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      const message = createEpisodePublishedMessage('episode-1');

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const episode = await selectOne('episode', {
        id: message.payload.content_id,
      }).run(ctx.ownerPool);

      expect(episode?.original_title).toEqual('Episode title');
      const localizations = await select(
        'episode_localizations',
        { episode_id: 'episode-1' },
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
        message.payload.localizations.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });
  });
});
