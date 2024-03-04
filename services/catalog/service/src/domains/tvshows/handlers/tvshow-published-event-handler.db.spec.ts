import 'jest-extended';
import { insert, select, selectOne } from 'zapatos/db';
import { tvshow } from 'zapatos/schema';
import {
  createTestContext,
  createTvshowPublishedMessage,
  ITestContext,
} from '../../../tests/test-utils';
import { TvshowPublishedEventHandler } from './tvshow-published-event-handler';

describe('TvshowPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: TvshowPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new TvshowPublishedEventHandler(ctx.config);
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
      const message = createTvshowPublishedMessage('tvshow-1');
      const payload = message.payload;

      // Act
      await ctx.executeGqlSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // TODO: Consider verifying via the GQL API.
      // Assert
      const tvshow = await selectOne('tvshow', {
        id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(tvshow).toEqual<tvshow.JSONSelectable>({
        id: payload.content_id,
        title: payload.title ?? null,
        description: payload.description ?? null,
        tvshow_cast: payload.cast ?? null,
        original_title: payload.original_title ?? null,
        production_countries: payload.production_countries ?? null,
        released: payload.released ?? null,
        studio: payload.studio ?? null,
        synopsis: payload.synopsis ?? null,
        tags: payload.tags ?? null,
      });

      const images = await select('tvshow_images', {
        tvshow_id: payload.content_id,
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
      const videos = await select('tvshow_videos', {
        tvshow_id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(videos).toMatchObject(expectedVideos);

      const tvshowVideoStreams = (
        await select('tvshow_video_streams', {
          tvshow_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, tvshow_video_id, ...stream }) => stream);
      expect(tvshowVideoStreams).toIncludeSameMembers(
        payload.videos[0].video_streams!,
      );
      const videoCuePoints = (
        await select('tvshow_video_cue_points', {
          tvshow_video_id: videos[0].id,
        }).run(ctx.ownerPool)
      ).map(({ id, tvshow_video_id, ...cuePoint }) => cuePoint);
      expect(videoCuePoints).toIncludeSameMembers(
        payload.videos[0].cue_points!,
      );

      const licenses = await select('tvshow_licenses', {
        tvshow_id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(licenses).toMatchObject(licenses);

      const genreRelations = await select(
        'tvshow_genres_relation',
        {
          tvshow_id: payload.content_id,
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

    test('An existing tvshow is republished', async () => {
      // Arrange
      await insert('tvshow', { id: 'tvshow-1', title: 'Old title' }).run(
        ctx.ownerPool,
      );
      const message = createTvshowPublishedMessage('tvshow-1');
      message.payload.title = 'New title';

      // Act
      await ctx.executeGqlSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });
      // Assert
      const tvshow = await selectOne('tvshow', {
        id: message.payload.content_id,
      }).run(ctx.ownerPool);

      expect(tvshow?.title).toEqual('New title');
    });
  });
});
