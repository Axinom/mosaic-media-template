import 'jest-extended';
import { all, insert, select } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../tests/test-utils';
import { DEFAULT_LOCALE_TAG } from '../constants';
import {
  exportedForTesting,
  getInMemoryLocales,
  loadInMemoryLocales,
  syncInMemoryLocales,
} from './in-memory-locales';

describe('inMemoryLocales', () => {
  let ctx: ITestContext;
  const movieId = 'movie-1';
  const episodeId = 'episode-1';

  const populateLocales = async () => {
    return (
      await insert('locales', [
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
        { locale: 'de-DE', is_default: false },
        { locale: 'et-EE', is_default: false },
      ]).run(ctx.ownerPool)
    ).map((l) => l.locale);
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('movie', { id: movieId }).run(ctx.ownerPool);
    await insert('episode', { id: episodeId }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx?.truncate('locales');
    await ctx?.truncate('movie_localizations');
    await ctx?.truncate('episode_localizations');
    exportedForTesting.clearInMemoryLocales();
  });

  afterAll(async () => {
    await ctx?.truncate('movie');
    await ctx?.truncate('episode');
    await ctx?.dispose();
  });

  describe('loadInMemoryLocales', () => {
    it('Load without any db entries -> empty in-memory locales array', async () => {
      // Act
      await loadInMemoryLocales(ctx.ownerPool);

      // Assert
      const locales = getInMemoryLocales();
      expect(locales).toEqual([]);
    });

    it('Load with existing locales -> matching in-memory locales array', async () => {
      // Arrange
      await populateLocales();

      // Act
      await loadInMemoryLocales(ctx.ownerPool);

      // Assert
      const locales = getInMemoryLocales();
      expect(locales).toIncludeSameMembers([
        DEFAULT_LOCALE_TAG,
        'de-DE',
        'et-EE',
      ]);
    });

    it('Load without existing locales, but with existing localizations -> matching in-memory locales array', async () => {
      // Arrange
      await insert('movie_localizations', [
        {
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
          title: 'test',
          movie_id: movieId,
        },
        {
          locale: 'de-DE',
          is_default_locale: false,
          title: 'test',
          movie_id: movieId,
        },
        {
          locale: 'et-EE',
          is_default_locale: false,
          title: 'test',
          movie_id: movieId,
        },
      ]).run(ctx.ownerPool);

      // Act
      await loadInMemoryLocales(ctx.ownerPool);

      // Assert
      const locales = getInMemoryLocales();
      expect(locales).toIncludeSameMembers([
        DEFAULT_LOCALE_TAG,
        'de-DE',
        'et-EE',
      ]);

      const dbEntries = await select('locales', all).run(ctx.ownerPool);
      expect(dbEntries).toIncludeSameMembers([
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
        { locale: 'de-DE', is_default: false },
        { locale: 'et-EE', is_default: false },
      ]);
    });

    it('Load without existing locales, but with multiple existing localizations -> matching in-memory locales array', async () => {
      // Arrange
      await insert('movie_localizations', [
        {
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
          title: 'test',
          movie_id: movieId,
        },
        {
          locale: 'de-DE',
          is_default_locale: false,
          title: 'test',
          movie_id: movieId,
        },
        {
          locale: 'et-EE',
          is_default_locale: false,
          title: 'test',
          movie_id: movieId,
        },
      ]).run(ctx.ownerPool);
      await insert('episode_localizations', [
        {
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
          title: 'test',
          episode_id: episodeId,
        },
        {
          locale: 'de-DE',
          is_default_locale: false,
          title: 'test',
          episode_id: episodeId,
        },
        {
          locale: 'et-EE',
          is_default_locale: false,
          title: 'test',
          episode_id: episodeId,
        },
      ]).run(ctx.ownerPool);

      // Act
      await loadInMemoryLocales(ctx.ownerPool);

      // Assert
      const locales = getInMemoryLocales();
      expect(locales).toIncludeSameMembers([
        DEFAULT_LOCALE_TAG,
        'de-DE',
        'et-EE',
      ]);

      const dbEntries = await select('locales', all).run(ctx.ownerPool);
      expect(dbEntries).toIncludeSameMembers([
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
        { locale: 'de-DE', is_default: false },
        { locale: 'et-EE', is_default: false },
      ]);
    });
  });

  describe('syncInMemoryLocales', () => {
    it('Sync with empty array and empty in-memory locales array -> empty in-memory locales array', async () => {
      // Act
      const localesChanged = await syncInMemoryLocales([], ctx.ownerPool);

      // Assert
      const locales = getInMemoryLocales();
      expect(locales).toEqual([]);
      expect(localesChanged).toEqual(false);
    });

    it('Sync with empty array and filled in-memory locales array -> unchanged in-memory locales array', async () => {
      // Array
      const expectedLocales = await populateLocales();
      await loadInMemoryLocales(ctx.ownerPool);

      // Act
      const localesChanged = await syncInMemoryLocales([], ctx.ownerPool);

      // Assert
      const locales = getInMemoryLocales();
      expect(locales).toIncludeSameMembers(expectedLocales);
      expect(localesChanged).toEqual(false);
    });

    it('Sync with single default element and filled in-memory locales array -> updated in-memory locales array and locales row', async () => {
      // Array
      await populateLocales();
      await loadInMemoryLocales(ctx.ownerPool);

      // Act
      const localesChanged = await syncInMemoryLocales(
        [{ language_tag: 'en-US', is_default_locale: true }],
        ctx.ownerPool,
      );

      // Assert
      const locales = getInMemoryLocales();
      expect(locales).toEqual(['en-US']);
      const dbEntries = await select('locales', all).run(ctx.ownerPool);
      expect(dbEntries).toEqual([{ locale: 'en-US', is_default: true }]);
      expect(localesChanged).toEqual(true);
    });

    it('Sync with two locales and filled in-memory locales array -> updated in-memory locales array and locales row', async () => {
      // Array
      await insert('locales', [
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
      ]).run(ctx.ownerPool);
      await loadInMemoryLocales(ctx.ownerPool);

      // Act
      const localesChanged = await syncInMemoryLocales(
        [
          { language_tag: DEFAULT_LOCALE_TAG, is_default_locale: true },
          { language_tag: 'de-DE', is_default_locale: false },
        ],
        ctx.ownerPool,
      );

      // Assert
      const locales = getInMemoryLocales();
      expect(locales).toIncludeSameMembers([DEFAULT_LOCALE_TAG, 'de-DE']);
      const dbEntries = await select('locales', all).run(ctx.ownerPool);
      expect(dbEntries).toIncludeSameMembers([
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
        { locale: 'de-DE', is_default: false },
      ]);
      expect(localesChanged).toEqual(true);
    });

    it('Sync multiple times in parallel -> update only single time', async () => {
      // Array
      await insert('locales', [
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
      ]).run(ctx.ownerPool);
      await loadInMemoryLocales(ctx.ownerPool);

      // Act
      const results = await Promise.all(
        Array.from({ length: 10 }).map(() =>
          syncInMemoryLocales(
            [
              { language_tag: DEFAULT_LOCALE_TAG, is_default_locale: true },
              { language_tag: 'de-DE', is_default_locale: false },
              { language_tag: 'et-EE', is_default_locale: false },
            ],
            ctx.ownerPool,
          ),
        ),
      );

      // Assert
      const locales = getInMemoryLocales();
      expect(locales).toIncludeSameMembers([
        DEFAULT_LOCALE_TAG,
        'de-DE',
        'et-EE',
      ]);
      const dbEntries = await select('locales', all).run(ctx.ownerPool);
      expect(dbEntries).toIncludeSameMembers([
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
        { locale: 'de-DE', is_default: false },
        { locale: 'et-EE', is_default: false },
      ]);
      expect(results.filter((x) => x)).toHaveLength(1);
      expect(results.filter((x) => !x)).toHaveLength(9);
    });
  });
});
