import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { MovieGenresUnpublishedEvent } from 'media-messages';
import { all, insert, select } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { MovieGenresUnpublishedEventHandler } from './movie-genres-unpublished-event-handler';

describe('MovieGenrePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: MovieGenresUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new MovieGenresUnpublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('movie_genres_relation');
    await ctx?.truncate('movie_genre');
    await ctx?.truncate('movie');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing movie-genre is unpublished', async () => {
      // Arrange
      await insert('movie_genre', {
        id: 'movie_genre-1',
        title: 'Some title',
      }).run(ctx.ownerPool);

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(
          {} as unknown as TypedTransactionalMessage<MovieGenresUnpublishedEvent>,
          txn,
        );
      });

      // Assert
      const movieGenre = await select('movie_genre', all).run(ctx.ownerPool);

      expect(movieGenre).toHaveLength(0);
    });

    test('two existing movie-genres are unpublished', async () => {
      // Arrange
      await insert('movie_genre', [
        {
          id: 'movie_genre-1',
          title: 'Some title',
        },
        {
          id: 'movie_genre-2',
          title: 'Some title 2',
        },
      ]).run(ctx.ownerPool);

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(
          {} as unknown as TypedTransactionalMessage<MovieGenresUnpublishedEvent>,
          txn,
        );
      });

      // Assert
      const movieGenre = await select('movie_genre', all).run(ctx.ownerPool);

      expect(movieGenre).toHaveLength(0);
    });

    test('An existing movie-genre is unpublished while having a relation -> relation persists', async () => {
      // Arrange
      const genre = await insert('movie_genre', {
        id: 'movie_genre-1',
        title: 'Some title',
      }).run(ctx.ownerPool);
      const movie = await insert('movie', {
        id: 'movie-1',
        title: 'Some title',
      }).run(ctx.ownerPool);
      await insert('movie_genres_relation', {
        movie_genre_id: genre.id,
        movie_id: movie.id,
        order_no: 1,
      }).run(ctx.ownerPool);

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(
          {} as unknown as TypedTransactionalMessage<MovieGenresUnpublishedEvent>,
          txn,
        );
      });

      // Assert
      const movieGenre = await select('movie_genre', all).run(ctx.ownerPool);
      expect(movieGenre).toHaveLength(0);

      const movies = await select('movie', all).run(ctx.ownerPool);
      const relations = await select('movie_genres_relation', all).run(
        ctx.ownerPool,
      );

      expect(movies).toHaveLength(1);
      expect(relations).toHaveLength(1);
    });
  });
});
