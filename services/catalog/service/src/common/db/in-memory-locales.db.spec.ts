import {
  getFirstMockResult,
  Logger,
  sleep,
} from '@axinom/mosaic-service-common';
import 'jest-extended';
import { Client } from 'pg';
import { all, insert, select, SQL, sql } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../tests/test-utils';
import { DEFAULT_LOCALE_TAG } from '../constants';
import {
  exportedForTesting,
  loadInMemoryLocales,
  startLocalesInsertedListener,
  syncInMemoryLocales,
} from './in-memory-locales';

describe('inMemoryLocales', () => {
  let ctx: ITestContext;
  const movieId = 'movie-1';
  const episodeId = 'episode-1';
  let logger: Logger;

  const populateLocales = async () => {
    return insert('locales', [
      { locale: DEFAULT_LOCALE_TAG, is_default: true },
      { locale: 'de-DE', is_default: false },
      { locale: 'et-EE', is_default: false },
    ]).run(ctx.ownerPool);
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    logger = new Logger({ config: ctx.config });
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
      await loadInMemoryLocales(ctx.ownerPool, logger);

      // Assert
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toEqual([]);
    });

    it('Load with existing locales -> matching in-memory locales array', async () => {
      // Arrange
      const expectedLocales = await populateLocales();

      // Act
      await loadInMemoryLocales(ctx.ownerPool, logger);

      // Assert
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toIncludeSameMembers(expectedLocales);
    });
  });

  describe('syncInMemoryLocales', () => {
    it('Sync with empty array and empty in-memory locales array -> empty in-memory locales array', async () => {
      // Act
      const localesChanged = await syncInMemoryLocales([], ctx.ownerPool);

      // Assert
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toEqual([]);
      expect(localesChanged).toEqual(false);
    });

    it('Sync with empty array and filled in-memory locales array -> unchanged in-memory locales array', async () => {
      // Array
      const expectedLocales = await populateLocales();
      await loadInMemoryLocales(ctx.ownerPool, logger);

      // Act
      const localesChanged = await syncInMemoryLocales([], ctx.ownerPool);

      // Assert
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toIncludeSameMembers(expectedLocales);
      expect(localesChanged).toEqual(false);
    });

    it('Sync with single default element and filled in-memory locales array -> updated in-memory locales array and locales rows', async () => {
      // Array
      await populateLocales();
      await loadInMemoryLocales(ctx.ownerPool, logger);

      // Act
      const localesChanged = await syncInMemoryLocales(
        [{ language_tag: 'en-US', is_default_locale: true }],
        ctx.ownerPool,
      );

      // Assert
      const expectedLocales = [{ locale: 'en-US', is_default: true }];
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toEqual(expectedLocales);
      const dbEntries = await select('locales', all).run(ctx.ownerPool);
      expect(dbEntries).toEqual(expectedLocales);
      expect(localesChanged).toEqual(true);
    });

    it('Sync with two locales and filled in-memory locales array -> updated in-memory locales array and locales rows', async () => {
      // Array
      await insert('locales', [
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
      ]).run(ctx.ownerPool);
      await loadInMemoryLocales(ctx.ownerPool, logger);

      // Act
      const localesChanged = await syncInMemoryLocales(
        [
          { language_tag: DEFAULT_LOCALE_TAG, is_default_locale: true },
          { language_tag: 'de-DE', is_default_locale: false },
        ],
        ctx.ownerPool,
      );

      // Assert
      const expectedLocales = [
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
        { locale: 'de-DE', is_default: false },
      ];
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toIncludeSameMembers(expectedLocales);
      const dbEntries = await select('locales', all).run(ctx.ownerPool);
      expect(dbEntries).toIncludeSameMembers(expectedLocales);
      expect(localesChanged).toEqual(true);
    });

    it('Sync with same locales as before, but default locale is switched -> updated in-memory locales array and locales rows', async () => {
      // Array
      await insert('locales', [
        { locale: 'en-US', is_default: true },
        { locale: 'de-DE', is_default: false },
      ]).run(ctx.ownerPool);
      await loadInMemoryLocales(ctx.ownerPool, logger);

      // Act
      const localesChanged = await syncInMemoryLocales(
        [
          { language_tag: 'en-US', is_default_locale: false },
          { language_tag: 'de-DE', is_default_locale: true },
        ],
        ctx.ownerPool,
      );

      // Assert
      const expectedLocales = [
        { locale: 'en-US', is_default: false },
        { locale: 'de-DE', is_default: true },
      ];
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toIncludeSameMembers(expectedLocales);
      const dbEntries = await select('locales', all).run(ctx.ownerPool);
      expect(dbEntries).toIncludeSameMembers(expectedLocales);
      expect(localesChanged).toEqual(true);
    });

    it('Sync multiple times in parallel -> update only single time', async () => {
      // Array
      await insert('locales', [
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
      ]).run(ctx.ownerPool);
      await loadInMemoryLocales(ctx.ownerPool, logger);

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
      const expectedLocales = [
        { locale: DEFAULT_LOCALE_TAG, is_default: true },
        { locale: 'de-DE', is_default: false },
        { locale: 'et-EE', is_default: false },
      ];
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toIncludeSameMembers(expectedLocales);
      const dbEntries = await select('locales', all).run(ctx.ownerPool);
      expect(dbEntries).toIncludeSameMembers(expectedLocales);
      expect(results.filter((x) => x)).toHaveLength(1);
      expect(results.filter((x) => !x)).toHaveLength(9);
    });
  });

  describe('app_private.set_initial_locales', () => {
    it('No existing locales, but with existing localizations -> locales table updated', async () => {
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
      const [result] = await sql<
        SQL,
        { set_initial_locales: string[] }[]
      >`select app_private.set_initial_locales();`.run(ctx.ownerPool);

      // Assert
      const locales = result.set_initial_locales;
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

    it('No existing locales, but with multiple existing localizations -> locales table updated', async () => {
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
      const [result] = await sql<
        SQL,
        { set_initial_locales: string[] }[]
      >`select app_private.set_initial_locales();`.run(ctx.ownerPool);

      // Assert
      const locales = result.set_initial_locales;
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

  describe('startLocalesInsertedListener', () => {
    let errorSpy: jest.SpyInstance;
    let logSpy: jest.SpyInstance;

    beforeEach(async () => {
      errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation((obj) => JSON.parse(obj));
      logSpy = jest
        .spyOn(console, 'log')
        .mockImplementation((obj) => JSON.parse(obj));
    });

    afterEach(async () => {
      await exportedForTesting.closeActiveClient();
      jest.clearAllMocks();
    });

    it('Insert of locales after the listener stared -> in-memory locales array updated', async () => {
      // Act
      await startLocalesInsertedListener(ctx.config, logger);
      const expectedLocales = await populateLocales();
      await sleep(1000); // notification processing can take a little bit of time

      // Assert
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toIncludeSameMembers(expectedLocales);

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(getFirstMockResult(logSpy)).toMatchObject({
        details: {
          locales: expectedLocales,
        },
        loglevel: 'INFO',
        message: 'In-memory locales successfully (re)loaded.',
      });

      expect(errorSpy).toHaveBeenCalledTimes(0);
    });

    it('Insert of locales before the listener stared -> in-memory locales array is empty as listener was not up when notify was issued', async () => {
      // Arrange
      await populateLocales();

      // Act
      await startLocalesInsertedListener(ctx.config, logger);
      await sleep(1000); // notification processing can take a little bit of time

      // Assert
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toEqual([]);

      expect(logSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(0);
    });

    it('Error is emitted for listener client -> listener recovers, in-memory locales array updated', async () => {
      // Act
      await startLocalesInsertedListener(ctx.config, logger);
      // Casting as Client to make sure error is thrown if it's null
      (exportedForTesting.getActiveClient() as Client).emit(
        'error',
        new Error('Test error'),
      );

      const expectedLocales = await populateLocales();
      await sleep(1000); // notification processing can take a little bit of time

      // Assert
      const locales = exportedForTesting.getInMemoryLocales();
      expect(locales).toIncludeSameMembers(expectedLocales);

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(getFirstMockResult(logSpy)).toMatchObject({
        details: {
          locales: expectedLocales,
        },
        loglevel: 'INFO',
        message: 'In-memory locales successfully (re)loaded.',
      });

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(getFirstMockResult(errorSpy)).toMatchObject({
        error: {
          message: 'Test error',
          name: 'Error',
        },
        loglevel: 'ERROR',
        message:
          'Listener database connection error occurred. Attempting to reconnect. (1/50)',
      });
    });
  });
});
