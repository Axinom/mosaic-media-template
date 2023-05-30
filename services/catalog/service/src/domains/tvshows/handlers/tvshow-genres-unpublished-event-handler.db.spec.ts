import { all, insert, select } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { TvshowGenresUnpublishedEventHandler } from './tvshow-genres-unpublished-event-handler';

describe('TvshowGenrePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: TvshowGenresUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new TvshowGenresUnpublishedEventHandler(
      ctx.loginPool,
      ctx.config,
    );
  });

  afterEach(async () => {
    await ctx?.truncate('tvshow_genres_relation');
    await ctx?.truncate('tvshow_genre');
    await ctx?.truncate('tvshow');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing tvshow-genre is unpublished', async () => {
      // Arrange
      await insert('tvshow_genre', {
        id: 'tvshow_genre-1',
        title: 'Some title',
      }).run(ctx.ownerPool);

      // Act
      await handler.onMessage();

      // Assert
      const tvshowGenre = await select('tvshow_genre', all).run(ctx.ownerPool);

      expect(tvshowGenre).toHaveLength(0);
    });

    test('two existing tvshow-genres are unpublished', async () => {
      // Arrange
      await insert('tvshow_genre', [
        {
          id: 'tvshow_genre-1',
          title: 'Some title',
        },
        {
          id: 'tvshow_genre-2',
          title: 'Some title 2',
        },
      ]).run(ctx.ownerPool);

      // Act
      await handler.onMessage();

      // Assert
      const tvshowGenre = await select('tvshow_genre', all).run(ctx.ownerPool);

      expect(tvshowGenre).toHaveLength(0);
    });

    test('An existing tvshow-genre is unpublished while having a relation -> relation persists', async () => {
      // Arrange
      const genre = await insert('tvshow_genre', {
        id: 'tvshow_genre-1',
        title: 'Some title',
      }).run(ctx.ownerPool);
      const tvshow = await insert('tvshow', {
        id: 'tvshow-1',
        title: 'Some title',
      }).run(ctx.ownerPool);
      await insert('tvshow_genres_relation', {
        tvshow_genre_id: genre.id,
        tvshow_id: tvshow.id,
        order_no: 1,
      }).run(ctx.ownerPool);

      // Act
      await handler.onMessage();

      // Assert
      const tvshowGenre = await select('tvshow_genre', all).run(ctx.ownerPool);
      expect(tvshowGenre).toHaveLength(0);

      const tvshows = await select('tvshow', all).run(ctx.ownerPool);
      const relations = await select('tvshow_genres_relation', all).run(
        ctx.ownerPool,
      );

      expect(tvshows).toHaveLength(1);
      expect(relations).toHaveLength(1);
    });
  });
});
