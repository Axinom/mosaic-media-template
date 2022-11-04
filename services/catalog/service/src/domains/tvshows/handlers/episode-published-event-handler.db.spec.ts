import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import { EpisodePublishedEvent } from 'media-messages';
import { insert, select, selectOne } from 'zapatos/db';
import { episode } from 'zapatos/schema';
import {
  createEpisodePublishedEvent,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { EpisodePublishedEventHandler } from './episode-published-event-handler';

describe('EpisodePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: EpisodePublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new EpisodePublishedEventHandler(ctx.loginPool, ctx.config);
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
      const message = createEpisodePublishedEvent('episode-1');
      const messageInfo = stub<MessageInfo<EpisodePublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // TODO: Consider verifying via the GQL API.
      // Assert
      const episode = await selectOne('episode', {
        id: message.content_id,
      }).run(ctx.ownerPool);
      expect(episode).toEqual<episode.JSONSelectable>({
        id: message.content_id,
        season_id: message.season_id ?? null,
        index: message.index,
        title: message.title ?? null,
        description: message.description ?? null,
        episode_cast: message.cast ?? null,
        production_countries: message.production_countries ?? null,
        original_title: message.original_title ?? null,
        released: message.released ?? null,
        studio: message.studio ?? null,
        synopsis: message.synopsis ?? null,
        tags: message.tags ?? null,
      });

      const images = await select('episode_images', {
        episode_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(images).toMatchObject(message.images!);

      // Remove `video_streams` array from `video` object
      const expectedVideos = message.videos.map((video) => {
        return Object.fromEntries(
          Object.entries(video).filter(
            ([key, _value]) => key !== 'video_streams',
          ),
        );
      });
      const videos = await select('episode_videos', {
        episode_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(videos).toMatchObject(expectedVideos);

      const episodeVideoStreams = await select('episode_video_streams', {
        episode_video_id: videos[0].id,
      }).run(ctx.ownerPool);
      expect(episodeVideoStreams).toMatchObject(
        message.videos[0].video_streams!,
      );

      const licenses = await select('episode_licenses', {
        episode_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(licenses).toMatchObject(licenses);
    });

    test('An existing episode is republished', async () => {
      // Arrange
      await insert('episode', { id: 'episode-1', title: 'Old title' }).run(
        ctx.ownerPool,
      );
      const message = createEpisodePublishedEvent('episode-1');
      message.title = 'New title';
      const messageInfo = stub<MessageInfo<EpisodePublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const episode = await selectOne('episode', {
        id: message.content_id,
      }).run(ctx.ownerPool);

      expect(episode?.title).toEqual('New title');
    });
  });
});
