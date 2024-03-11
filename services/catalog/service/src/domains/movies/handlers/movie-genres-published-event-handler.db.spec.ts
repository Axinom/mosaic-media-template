import { all, insert, select, selectOne } from 'zapatos/db';
import { movie_genre } from 'zapatos/schema';
import {
  createGenrePublishedMessage,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { MovieGenresPublishedEventHandler } from './movie-genres-published-event-handler';

describe('MovieGenrePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: MovieGenresPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new MovieGenresPublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('movie_genre');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('A new movie genre is published', async () => {
      // Arrange
      const message = createGenrePublishedMessage('movie_genre-1', 'New title');

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // TODO: Consider verifying via the GQL API.
      // Assert
      const movieGenre = await select('movie_genre', all).run(ctx.ownerPool);
      expect(movieGenre).toEqual<movie_genre.JSONSelectable[]>([
        {
          id: message.payload.genres[0].content_id,
          title: message.payload.genres[0].title,
          order_no: message.payload.genres[0].order_no,
        },
      ]);
    });

    test('An existing movie genre is republished', async () => {
      // Arrange
      const contentId = 'movie_genre-1';
      await insert('movie_genre', {
        id: contentId,
        title: 'Old title',
      }).run(ctx.ownerPool);
      const message = createGenrePublishedMessage(contentId, 'New title');

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const movieGenre = await selectOne('movie_genre', {
        id: contentId,
      }).run(ctx.ownerPool);

      expect(movieGenre?.title).toEqual('New title');
    });

    test('An existing movie genre is deleted, while new one added', async () => {
      // Arrange
      await insert('movie_genre', {
        id: 'movie_genre-1',
        title: 'Old title',
      }).run(ctx.ownerPool);
      const message = createGenrePublishedMessage('movie_genre-2', 'New title');

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const movieGenres = await select('movie_genre', all).run(ctx.ownerPool);

      expect(movieGenres).toHaveLength(1);
      expect(movieGenres[0].title).toEqual('New title');
    });
  });
});
