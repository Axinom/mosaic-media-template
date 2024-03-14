/* eslint-disable jest/no-disabled-tests */
import 'jest-extended';
import { deletes, insert, update } from 'zapatos/db';
import { movie_genres } from 'zapatos/schema';
import { setIsLocalizationEnabledDbFunction } from '../../common';
import { LocalizableMovieDbMessagingSettings } from '../../domains/movies';
import { createTestContext, ITestContext } from '../test-utils';

describe('Movie Genre localizable triggers', () => {
  let ctx: ITestContext;
  let genre: movie_genres.JSONSelectable;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    genre = await insert('movie_genres', {
      id: 1,
      sort_order: 1,
      title: 'My Movie Genre',
    }).run(ctx.ownerPool);
    await ctx.truncateInbox();
  });

  afterEach(async () => {
    await ctx.truncate('movie_genres');
    await ctx.truncateInbox();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('movie_genres', () => {
    it('Movie Genre inserted -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('movie_genres');

      // Act
      genre = await insert('movie_genres', {
        id: 1,
        sort_order: 1,
        title: 'My Movie Genre',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: genre.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieGenreCreated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieGenreCreated
              .messageType,
          metadata: null,
          payload: {
            id: genre.id,
            title: genre.title,
          },
        },
      ]);
    });

    it('Movie Genre updated -> inbox entry added', async () => {
      // Act
      const [updatedMovieGenre] = await update(
        'movie_genres',
        { title: 'My Edited Movie Genre' },
        { id: genre.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: genre.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieGenreUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieGenreUpdated
              .messageType,
          metadata: null,
          payload: {
            id: genre.id,
            title: updatedMovieGenre.title,
          },
        },
      ]);
    });

    it('Movie Genre updated with field that is not localizable -> inbox entry not added', async () => {
      // Act
      await update('movie_genres', { sort_order: 10 }, { id: genre.id }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie Genre updated with title of same values as currently set -> inbox entry not added', async () => {
      // Act
      await update(
        'movie_genres',
        { title: genre.title },
        { id: genre.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie Genre deleted -> inbox entry added', async () => {
      // Act
      await deletes('movie_genres', { id: genre.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: genre.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieGenreDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieGenreDeleted
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

    it('Movie Genre inserted -> inbox entry not added', async () => {
      // Arrange
      await ctx.truncate('movie_genres');

      // Act
      genre = await insert('movie_genres', {
        id: 1,
        sort_order: 2,
        title: 'My MovieGenre',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie Genre updated -> inbox entry not added', async () => {
      // Act
      await update(
        'movie_genres',
        { title: 'My Edited MovieGenre' },
        { id: genre.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie Genre deleted -> inbox entry not added', async () => {
      // Act
      await deletes('movie_genres', { id: genre.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });
  });
});
