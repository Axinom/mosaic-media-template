import 'jest-extended';
import { all, insert, select, selectOne } from 'zapatos/db';
import { tvshow_genre } from 'zapatos/schema';
import { DEFAULT_LOCALE_TAG } from '../../../common';
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
      const message = createGenrePublishedEvent('tvshow_genre-1');

      // Act
      await handler.onMessage(message);

      // Assert
      const tvshowGenre = await select('tvshow_genre', all).run(ctx.ownerPool);
      expect(tvshowGenre).toEqual<tvshow_genre.JSONSelectable[]>([
        {
          id: message.genres[0].content_id,
          order_no: message.genres[0].order_no,
        },
      ]);
      const localizations = await select(
        'tvshow_genre_localizations',
        { tvshow_genre_id: message.genres[0].content_id },
        { columns: ['title', 'locale', 'is_default_locale'] },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        message.genres[0].localizations.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });

    test('An existing tvshow genre is republished', async () => {
      // Arrange
      const contentId = 'tvshow_genre-1';
      await insert('tvshow_genre', {
        id: contentId,
        order_no: 10,
      }).run(ctx.ownerPool);
      await insert('tvshow_genre_localizations', {
        tvshow_genre_id: contentId,
        title: 'Old title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      const message = createGenrePublishedEvent(contentId);

      // Act
      await handler.onMessage(message);

      // Assert
      const tvshowGenre = await selectOne('tvshow_genre', {
        id: contentId,
      }).run(ctx.ownerPool);

      expect(tvshowGenre?.order_no).toEqual(0);
      const localizations = await select(
        'tvshow_genre_localizations',
        { tvshow_genre_id: message.genres[0].content_id },
        { columns: ['title', 'locale', 'is_default_locale'] },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        message.genres[0].localizations.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });

    test('An existing tvshow genre is deleted, while new one added', async () => {
      // Arrange
      await insert('tvshow_genre', {
        id: 'tvshow_genre-1',
        order_no: 10,
      }).run(ctx.ownerPool);
      await insert('tvshow_genre_localizations', {
        tvshow_genre_id: 'tvshow_genre-1',
        title: 'Old title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      const message = createGenrePublishedEvent('tvshow_genre-2');

      // Act
      await handler.onMessage(message);

      // Assert
      const tvshowGenres = await select('tvshow_genre', all).run(ctx.ownerPool);

      expect(tvshowGenres).toHaveLength(1);
      expect(tvshowGenres[0].order_no).toEqual(0);

      const localizations = await select('tvshow_genre_localizations', all, {
        columns: ['title', 'locale', 'is_default_locale'],
      }).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        message.genres[0].localizations.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });
  });
});
