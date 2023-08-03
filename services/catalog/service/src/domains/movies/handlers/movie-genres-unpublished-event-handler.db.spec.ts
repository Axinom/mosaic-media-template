import { all, insert, select } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { MovieGenresUnpublishedEventHandler } from './movie-genres-unpublished-event-handler';

describe('MovieGenrePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: MovieGenresUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new MovieGenresUnpublishedEventHandler(ctx.loginPool, ctx.config);
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
    test('Received a movie-genres unpublish message -> the single existing movie-genre is removed', async () => {
      // Arrange
      await insert('movie_genre', {
        id: 'movie_genre-1',
      }).run(ctx.ownerPool);
      await insert('movie_genre_localizations', {
        movie_genre_id: 'movie_genre-1',
        title: 'Some title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);

      // Act
      await handler.onMessage();

      // Assert
      const movieGenre = await select('movie_genre', all).run(ctx.ownerPool);
      const localizations = await select('movie_genre_localizations', all).run(
        ctx.ownerPool,
      );

      expect(movieGenre).toHaveLength(0);
      expect(localizations).toHaveLength(0);
    });

    test('Received a movie-genres unpublish message -> the single existing movie-genre with multiple localizations is removed', async () => {
      // Arrange
      await insert('movie_genre', {
        id: 'movie_genre-1',
      }).run(ctx.ownerPool);
      await insert('movie_genre_localizations', [
        {
          movie_genre_id: 'movie_genre-1',
          title: 'Some title',
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
        },
        {
          movie_genre_id: 'movie_genre-1',
          title: 'Localized title (de-DE)',
          locale: 'de-DE',
          is_default_locale: false,
        },
        {
          movie_genre_id: 'movie_genre-1',
          title: 'Localized title (et-EE)',
          locale: 'et-EE',
          is_default_locale: false,
        },
      ]).run(ctx.ownerPool);

      // Act
      await handler.onMessage();

      // Assert
      const movieGenre = await select('movie_genre', all).run(ctx.ownerPool);
      const localizations = await select('movie_genre_localizations', all).run(
        ctx.ownerPool,
      );

      expect(movieGenre).toHaveLength(0);
      expect(localizations).toHaveLength(0);
    });

    test('Received a movie-genres unpublish message -> all existing movie-genre are removed', async () => {
      // Arrange
      await insert('movie_genre', [
        {
          id: 'movie_genre-1',
        },
        {
          id: 'movie_genre-2',
        },
      ]).run(ctx.ownerPool);
      await insert('movie_genre_localizations', [
        {
          movie_genre_id: 'movie_genre-1',
          title: 'Some title 1',
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
        },
        {
          movie_genre_id: 'movie_genre-2',
          title: 'Some title 2',
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
        },
      ]).run(ctx.ownerPool);

      // Act
      await handler.onMessage();

      // Assert
      const movieGenre = await select('movie_genre', all).run(ctx.ownerPool);
      const localizations = await select('movie_genre_localizations', all).run(
        ctx.ownerPool,
      );

      expect(movieGenre).toHaveLength(0);
      expect(localizations).toHaveLength(0);
    });

    test('An existing movie-genre is unpublished while having a relation -> relation persists', async () => {
      // Arrange
      const genre = await insert('movie_genre', {
        id: 'movie_genre-1',
      }).run(ctx.ownerPool);
      await insert('movie_genre_localizations', {
        movie_genre_id: 'movie_genre-1',
        title: 'Some title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);

      const movie = await insert('movie', {
        id: 'movie-1',
      }).run(ctx.ownerPool);
      await insert('movie_genres_relation', {
        movie_genre_id: genre.id,
        movie_id: movie.id,
        order_no: 1,
      }).run(ctx.ownerPool);

      // Act
      await handler.onMessage();

      // Assert
      const movieGenre = await select('movie_genre', all).run(ctx.ownerPool);
      const localizations = await select('movie_genre_localizations', all).run(
        ctx.ownerPool,
      );

      expect(movieGenre).toHaveLength(0);
      expect(localizations).toHaveLength(0);

      const movies = await select('movie', all).run(ctx.ownerPool);
      const relations = await select('movie_genres_relation', all).run(
        ctx.ownerPool,
      );

      expect(movies).toHaveLength(1);
      expect(relations).toHaveLength(1);
    });
  });
});
