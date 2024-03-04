import 'jest-extended';
import { insert, select, selectOne } from 'zapatos/db';
import { season } from 'zapatos/schema';
import {
  createSeasonPublishedMessage,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { SeasonPublishedEventHandler } from './season-published-event-handler';

describe('SeasonPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: SeasonPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new SeasonPublishedEventHandler(ctx.config);
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
      const message = createSeasonPublishedMessage('season-1');
      const payload = message.payload;

      // Act
      await ctx.executeGqlSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // TODO: Consider verifying via the GQL API.
      // Assert
      const season = await selectOne('season', {
        id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(season).toEqual<season.JSONSelectable>({
        id: payload.content_id,
        tvshow_id: payload.tvshow_id ?? null,
        index: payload.index,
        description: payload.description ?? null,
        season_cast: payload.cast ?? null,
        production_countries: payload.production_countries ?? null,
        released: payload.released ?? null,
        studio: payload.studio ?? null,
        synopsis: payload.synopsis ?? null,
        tags: payload.tags ?? null,
      });

      const images = await select('season_images', {
        season_id: payload.content_id,
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
      const videos = await select('season_videos', {
        season_id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(videos).toMatchObject(expectedVideos);

      const seasonVideoStreams = (
        await select('season_video_streams', {
          season_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, season_video_id, ...stream }) => stream);
      expect(seasonVideoStreams).toIncludeSameMembers(
        payload.videos[0].video_streams!,
      );

      const videoCuePoints = (
        await select('season_video_cue_points', {
          season_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, season_video_id, ...cuePoint }) => cuePoint);
      expect(videoCuePoints).toIncludeSameMembers(
        payload.videos[0].cue_points!,
      );

      const licenses = await select('season_licenses', {
        season_id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(licenses).toMatchObject(licenses);

      const genreRelations = await select(
        'season_genres_relation',
        {
          season_id: payload.content_id,
        },
        {
          order: {
            by: 'order_no',
            direction: 'ASC',
          },
        },
      ).run(ctx.ownerPool);
      expect(genreRelations.map((g) => g.tvshow_genre_id)).toEqual(
        payload.genre_ids,
      );
    });

    test('An existing season is republished', async () => {
      // Arrange
      await insert('season', {
        id: 'season-1',
        description: 'Old description',
      }).run(ctx.ownerPool);

      const message = createSeasonPublishedMessage('season-1');
      message.payload.description = 'New description';

      // Act
      await ctx.executeGqlSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const season = await selectOne('season', {
        id: message.payload.content_id,
      }).run(ctx.ownerPool);

      expect(season?.description).toEqual('New description');
    });
  });
});
