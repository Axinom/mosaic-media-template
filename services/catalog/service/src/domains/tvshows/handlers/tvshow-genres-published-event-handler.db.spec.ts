import { all, insert, select, selectOne } from 'zapatos/db';
import { tvshow_genre } from 'zapatos/schema';
import {
  createGenrePublishedEvent,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { TvshowGenresPublishedEventHandler } from './tvshow-genres-published-event-handler';

describe('TvshowGenrePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: TvshowGenresPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new TvshowGenresPublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('tvshow_genre');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('A new tvshow genre is published', async () => {
      // Arrange
      const message = createGenrePublishedEvent('tvshow_genre-1', 'New title');

      // Act
      await handler.onMessage(message);

      // TODO: Consider verifying via the GQL API.
      // Assert
      const tvshowGenre = await select('tvshow_genre', all).run(ctx.ownerPool);
      expect(tvshowGenre).toEqual<tvshow_genre.JSONSelectable[]>([
        {
          id: message.genres[0].content_id,
          title: message.genres[0].title,
          order_no: message.genres[0].order_no,
        },
      ]);
    });

    test('An existing tvshow genre is republished', async () => {
      // Arrange
      const contentId = 'tvshow_genre-1';
      await insert('tvshow_genre', {
        id: contentId,
        title: 'Old title',
      }).run(ctx.ownerPool);
      const message = createGenrePublishedEvent(contentId, 'New title');

      // Act
      await handler.onMessage(message);

      // Assert
      const tvshowGenre = await selectOne('tvshow_genre', {
        id: contentId,
      }).run(ctx.ownerPool);

      expect(tvshowGenre?.title).toEqual('New title');
    });

    test('An existing tvshow genre is deleted, while new one added', async () => {
      // Arrange
      await insert('tvshow_genre', {
        id: 'tvshow_genre-1',
        title: 'Old title',
      }).run(ctx.ownerPool);
      const message = createGenrePublishedEvent('tvshow_genre-2', 'New title');

      // Act
      await handler.onMessage(message);

      // Assert
      const tvshowGenres = await select('tvshow_genre', all).run(ctx.ownerPool);

      expect(tvshowGenres).toHaveLength(1);
      expect(tvshowGenres[0].title).toEqual('New title');
    });
  });
});
