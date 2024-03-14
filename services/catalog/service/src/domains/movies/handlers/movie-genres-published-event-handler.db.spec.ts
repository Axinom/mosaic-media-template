import 'jest-extended';
import { all, insert, select, selectOne } from 'zapatos/db';
import { movie_genre } from 'zapatos/schema';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import {
  createMovieGenresPublishedMessage,
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
      const message = createMovieGenresPublishedMessage('movie_genre-1');

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const movieGenre = await select('movie_genre', all).run(ctx.ownerPool);
      expect(movieGenre).toEqual<movie_genre.JSONSelectable[]>([
        {
          id: message.payload.genres[0].content_id,
          order_no: message.payload.genres[0].order_no,
        },
      ]);
      const localizations = await select(
        'movie_genre_localizations',
        { movie_genre_id: message.payload.genres[0].content_id },
        { columns: ['title', 'locale', 'is_default_locale'] },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        message.payload.genres[0].localizations.map(
          ({ language_tag, ...other }) => ({
            ...other,
            locale: language_tag,
          }),
        ),
      );
    });

    test('An existing movie genre is republished', async () => {
      // Arrange
      const contentId = 'movie_genre-1';
      await insert('movie_genre', {
        id: contentId,
        order_no: 10,
      }).run(ctx.ownerPool);
      await insert('movie_genre_localizations', {
        movie_genre_id: contentId,
        title: 'Old title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      const message = createMovieGenresPublishedMessage(contentId);

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const movieGenre = await selectOne('movie_genre', {
        id: contentId,
      }).run(ctx.ownerPool);

      expect(movieGenre?.order_no).toEqual(0);
      const localizations = await select(
        'movie_genre_localizations',
        { movie_genre_id: message.payload.genres[0].content_id },
        { columns: ['title', 'locale', 'is_default_locale'] },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        message.payload.genres[0].localizations.map(
          ({ language_tag, ...other }) => ({
            ...other,
            locale: language_tag,
          }),
        ),
      );
    });

    test('An existing movie genre is deleted, while new one added', async () => {
      // Arrange
      await insert('movie_genre', {
        id: 'movie_genre-1',
        order_no: 10,
      }).run(ctx.ownerPool);
      await insert('movie_genre_localizations', {
        movie_genre_id: 'movie_genre-1',
        title: 'Old title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      const message = createMovieGenresPublishedMessage('movie_genre-2');

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const movieGenres = await select('movie_genre', all).run(ctx.ownerPool);
      expect(movieGenres).toHaveLength(1);
      expect(movieGenres[0].order_no).toEqual(0);

      const localizations = await select('movie_genre_localizations', all, {
        columns: ['title', 'locale', 'is_default_locale'],
      }).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        message.payload.genres[0].localizations.map(
          ({ language_tag, ...other }) => ({
            ...other,
            locale: language_tag,
          }),
        ),
      );
    });
  });
});
