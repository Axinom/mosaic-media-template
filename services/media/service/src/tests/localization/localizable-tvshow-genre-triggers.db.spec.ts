/* eslint-disable jest/no-disabled-tests */
import 'jest-extended';
import { deletes, insert, update } from 'zapatos/db';
import { tvshow_genres } from 'zapatos/schema';
import { setIsLocalizationEnabledDbFunction } from '../../common';
import { LocalizableTvshowDbMessagingSettings } from '../../domains/tvshows';
import { createTestContext, ITestContext } from '../test-utils';

describe('Tvshow Genre localizable triggers', () => {
  let ctx: ITestContext;
  let genre: tvshow_genres.JSONSelectable;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    genre = await insert('tvshow_genres', {
      id: 1,
      sort_order: 1,
      title: 'My Tvshow Genre',
    }).run(ctx.ownerPool);
    await ctx.truncateInbox();
  });

  afterEach(async () => {
    await ctx.truncate('tvshow_genres');
    await ctx.truncateInbox();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('tvshow_genres', () => {
    it('Tvshow Genre inserted -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('tvshow_genres');

      // Act
      genre = await insert('tvshow_genres', {
        id: 1,
        sort_order: 1,
        title: 'My Tvshow Genre',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: genre.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowGenreCreated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowGenreCreated
              .messageType,
          metadata: null,
          payload: {
            id: genre.id,
            title: genre.title,
          },
        },
      ]);
    });

    it('Tvshow Genre updated -> inbox entry added', async () => {
      // Act
      const [updatedTvshowGenre] = await update(
        'tvshow_genres',
        { title: 'My Edited Tvshow Genre' },
        { id: genre.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: genre.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowGenreUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowGenreUpdated
              .messageType,
          metadata: null,
          payload: {
            id: genre.id,
            title: updatedTvshowGenre.title,
          },
        },
      ]);
    });

    it('Tvshow Genre updated with field that is not localizable -> inbox entry not added', async () => {
      // Act
      await update('tvshow_genres', { sort_order: 10 }, { id: genre.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow Genre updated with title of same values as currently set -> inbox entry not added', async () => {
      // Act
      await update(
        'tvshow_genres',
        { title: genre.title },
        { id: genre.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow Genre deleted -> inbox entry added', async () => {
      // Act
      await deletes('tvshow_genres', { id: genre.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: genre.id.toString(),
          aggregate_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowGenreDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableTvshowDbMessagingSettings.LocalizableTvshowGenreDeleted
              .messageType,
          metadata: null,
          payload: {
            id: genre.id,
          },
        },
      ]);
    });
  });

  describe('localization is disabled', () => {
    beforeEach(async () => {
      await setIsLocalizationEnabledDbFunction(false, ctx.ownerPool);
    });

    afterEach(async () => {
      await setIsLocalizationEnabledDbFunction(true, ctx.ownerPool);
    });

    it('Tvshow Genre inserted -> inbox entry not added', async () => {
      // Arrange
      await ctx.truncate('tvshow_genres');

      // Act
      genre = await insert('tvshow_genres', {
        id: 1,
        sort_order: 2,
        title: 'My TvshowGenre',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow Genre updated  -> inbox entry not added', async () => {
      // Act
      await update(
        'tvshow_genres',
        { title: 'My Edited TvshowGenre' },
        { id: genre.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Tvshow Genre deleted -> inbox entry not added', async () => {
      // Act
      await deletes('tvshow_genres', { id: genre.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });
  });
});
