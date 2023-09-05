import { all, insert, select } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../../common';
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
    test('Received a tvshow-genres unpublish message -> the single existing tvshow-genre is removed', async () => {
      // Arrange
      await insert('tvshow_genre', {
        id: 'tvshow_genre-1',
      }).run(ctx.ownerPool);
      await insert('tvshow_genre_localizations', {
        tvshow_genre_id: 'tvshow_genre-1',
        title: 'Some title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);

      // Act
      await handler.onMessage();

      // Assert
      const tvshowGenre = await select('tvshow_genre', all).run(ctx.ownerPool);
      const localizations = await select('tvshow_genre_localizations', all).run(
        ctx.ownerPool,
      );

      expect(tvshowGenre).toHaveLength(0);
      expect(localizations).toHaveLength(0);
    });

    test('Received a tvshow-genres unpublish message -> the single existing tvshow-genre with multiple localizations is removed', async () => {
      // Arrange
      await insert('tvshow_genre', {
        id: 'tvshow_genre-1',
      }).run(ctx.ownerPool);
      await insert('tvshow_genre_localizations', [
        {
          tvshow_genre_id: 'tvshow_genre-1',
          title: 'Some title',
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
        },
        {
          tvshow_genre_id: 'tvshow_genre-1',
          title: 'Localized title (de-DE)',
          locale: 'de-DE',
          is_default_locale: false,
        },
        {
          tvshow_genre_id: 'tvshow_genre-1',
          title: 'Localized title (et-EE)',
          locale: 'et-EE',
          is_default_locale: false,
        },
      ]).run(ctx.ownerPool);

      // Act
      await handler.onMessage();

      // Assert
      const tvshowGenre = await select('tvshow_genre', all).run(ctx.ownerPool);
      const localizations = await select('tvshow_genre_localizations', all).run(
        ctx.ownerPool,
      );

      expect(tvshowGenre).toHaveLength(0);
      expect(localizations).toHaveLength(0);
    });

    test('Received a tvshow-genres unpublish message -> all existing tvshow-genre are removed', async () => {
      // Arrange
      await insert('tvshow_genre', [
        {
          id: 'tvshow_genre-1',
        },
        {
          id: 'tvshow_genre-2',
        },
      ]).run(ctx.ownerPool);
      await insert('tvshow_genre_localizations', [
        {
          tvshow_genre_id: 'tvshow_genre-1',
          title: 'Some title 1',
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
        },
        {
          tvshow_genre_id: 'tvshow_genre-2',
          title: 'Some title 2',
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
        },
      ]).run(ctx.ownerPool);

      // Act
      await handler.onMessage();

      // Assert
      const tvshowGenre = await select('tvshow_genre', all).run(ctx.ownerPool);
      const localizations = await select('tvshow_genre_localizations', all).run(
        ctx.ownerPool,
      );

      expect(tvshowGenre).toHaveLength(0);
      expect(localizations).toHaveLength(0);
    });

    test('An existing tvshow-genre is unpublished while having a relation -> relation persists', async () => {
      // Arrange
      const genre = await insert('tvshow_genre', {
        id: 'tvshow_genre-1',
      }).run(ctx.ownerPool);
      await insert('tvshow_genre_localizations', {
        tvshow_genre_id: 'tvshow_genre-1',
        title: 'Some title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);

      const tvshow = await insert('tvshow', {
        id: 'tvshow-1',
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
      const localizations = await select('tvshow_genre_localizations', all).run(
        ctx.ownerPool,
      );

      expect(tvshowGenre).toHaveLength(0);
      expect(localizations).toHaveLength(0);

      const tvshows = await select('tvshow', all).run(ctx.ownerPool);
      const relations = await select('tvshow_genres_relation', all).run(
        ctx.ownerPool,
      );

      expect(tvshows).toHaveLength(1);
      expect(relations).toHaveLength(1);
    });
  });
});
