import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { SeasonPublishedEvent } from 'media-messages';
import { insert, select, selectOne } from 'zapatos/db';
import { season } from 'zapatos/schema';
import {
  createSeasonPublishedEvent,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { SeasonPublishedEventHandler } from './season-published-event-handler';

describe('SeasonPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: SeasonPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new SeasonPublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('season');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('A new season is published', async () => {
      // Arrange
      const message = createSeasonPublishedEvent('season-1');
      const messageInfo = stub<MessageInfo<SeasonPublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // TODO: Consider verifying via the GQL API.
      // Assert
      const season = await selectOne('season', {
        id: message.content_id,
      }).run(ctx.ownerPool);
      expect(season).toEqual<season.JSONSelectable>({
        id: message.content_id,
        tvshow_id: message.tvshow_id ?? null,
        index: message.index,
        description: message.description ?? null,
        season_cast: message.cast ?? null,
        production_countries: message.production_countries ?? null,
        released: message.released ?? null,
        studio: message.studio ?? null,
        synopsis: message.synopsis ?? null,
        tags: message.tags ?? null,
      });

      const images = await select('season_images', {
        season_id: message.content_id,
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
      const videos = await select('season_videos', {
        season_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(videos).toMatchObject(expectedVideos);

      const seasonVideoStreams = (
        await select('season_video_streams', {
          season_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, season_video_id, ...stream }) => stream);
      expect(seasonVideoStreams).toIncludeSameMembers(
        message.videos[0].video_streams!,
      );

      const licenses = await select('season_licenses', {
        season_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(licenses).toMatchObject(licenses);

      const genreRelations = await select(
        'season_genres_relation',
        {
          season_id: message.content_id,
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
    });

    test('An existing season is republished', async () => {
      // Arrange
      await insert('season', {
        id: 'season-1',
        description: 'Old description',
      }).run(ctx.ownerPool);

      const message = createSeasonPublishedEvent('season-1');
      message.description = 'New description';
      const messageInfo = stub<MessageInfo<SeasonPublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const season = await selectOne('season', { id: message.content_id }).run(
        ctx.ownerPool,
      );

      expect(season?.description).toEqual('New description');
    });
  });
});
