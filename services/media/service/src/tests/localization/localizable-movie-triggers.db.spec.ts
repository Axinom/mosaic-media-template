/* eslint-disable jest/no-disabled-tests */
import 'jest-extended';
import { MovieImageTypeEnum } from 'zapatos/custom';
import { deletes, insert, update } from 'zapatos/db';
import { movies } from 'zapatos/schema';
import { setIsLocalizationEnabledDbFunction } from '../../common';
import { LocalizableMovieDbMessagingSettings } from '../../domains/movies';
import { createTestContext, ITestContext } from '../test-utils';

describe('Movie localizable triggers', () => {
  let ctx: ITestContext;
  let movie: movies.JSONSelectable;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    movie = await insert('movies', { id: 1, title: 'My Movie' }).run(
      ctx.ownerPool,
    );
    await ctx.truncateInbox();
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncateInbox();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('movies', () => {
    it('Movie inserted with only title -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('movies');

      // Act
      movie = await insert('movies', { id: 1, title: 'My Movie' }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: movie.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieCreated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieCreated
              .messageType,
          metadata: null,
          payload: {
            id: movie.id,
            title: movie.title,
          },
        },
      ]);
    });

    it('Movie inserted with title, description, synopsis -> inbox entry added', async () => {
      // Arrange
      await ctx.truncate('movies');

      // Act
      movie = await insert('movies', {
        id: 1,
        title: 'My Movie',
        synopsis: 'My Synopsis',
        description: 'My Description',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: movie.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieCreated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieCreated
              .messageType,
          metadata: null,
          payload: {
            id: movie.id,
            title: movie.title,
            synopsis: movie.synopsis,
            description: movie.description,
          },
        },
      ]);
    });

    it('Movie updated with only title -> inbox entry added', async () => {
      // Act
      const [updatedMovie] = await update(
        'movies',
        { title: 'My Edited Movie' },
        { id: movie.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: movie.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieUpdated
              .messageType,
          metadata: null,
          payload: {
            id: movie.id,
            title: updatedMovie.title,
          },
        },
      ]);
    });

    it('Movie updated with title, description, synopsis -> inbox entry added', async () => {
      // Act
      const [updatedMovie] = await update(
        'movies',
        {
          title: 'My Edited Movie',
          synopsis: 'My Edited Synopsis',
          description: 'My Edited Description',
        },
        { id: movie.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: movie.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieUpdated
              .messageType,
          metadata: null,
          payload: {
            id: movie.id,
            title: updatedMovie.title,
            synopsis: updatedMovie.synopsis,
            description: updatedMovie.description,
          },
        },
      ]);
    });

    it('Movie updated with field that is not localizable -> inbox entry not added', async () => {
      // Act
      await update(
        'movies',
        { original_title: 'My Edited Original Title' },
        { id: movie.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie updated with title, description, synopsis of same values as currently set -> inbox entry not added', async () => {
      // Act
      await update(
        'movies',
        {
          title: movie.title,
          synopsis: movie.synopsis,
          description: movie.description,
        },
        { id: movie.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie updated with localizable value changed from null to empty string -> inbox entry not added', async () => {
      // Act
      await update(
        'movies',
        {
          synopsis: '',
          description: '',
        },
        { id: movie.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie updated with field that is not localizable and ingest_correlation_id -> inbox entry added', async () => {
      // Act
      const [updatedMovie] = await update(
        'movies',
        {
          original_title: 'My Edited Original Title',
          ingest_correlation_id: 3,
        },
        { id: movie.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: movie.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieUpdated
              .messageType,
          metadata: {
            messageContext: {
              ingestItemId: updatedMovie.ingest_correlation_id,
            },
          },
          // even if no localizable fields are updated - we want to trigger the
          // message to receive the response from Mosaic localization service if
          // this is an update in context of ingest.
          payload: { id: movie.id },
        },
      ]);
    });

    it('Movie updated with only ingest_correlation_id -> inbox entry added', async () => {
      // Act
      const [updatedMovie] = await update(
        'movies',
        { ingest_correlation_id: 3 },
        { id: movie.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: movie.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieUpdated
              .messageType,
          metadata: {
            messageContext: {
              ingestItemId: updatedMovie.ingest_correlation_id,
            },
          },
          // even if no localizable fields are updated - we want to trigger the
          // message to receive the response from Mosaic localization service if
          // this is an update in context of ingest.
          payload: { id: movie.id },
        },
      ]);
    });

    it('Movie deleted -> inbox entry added', async () => {
      // Act
      await deletes('movies', { id: movie.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: movie.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieDeleted
              .messageType,
          metadata: null,
          payload: {
            id: movie.id,
          },
        },
      ]);
    });
  });

  describe('movies_images', () => {
    it.each(['COVER' as MovieImageTypeEnum, 'TEASER' as MovieImageTypeEnum])(
      'Movie %p inserted -> inbox entry added',
      // TEASER is expected to be skipped in the message handler
      async (imageType) => {
        // Act
        const image = await insert('movies_images', {
          movie_id: movie.id,
          image_id: '00000000-0000-0000-0000-000000000001',
          image_type: imageType,
        }).run(ctx.ownerPool);

        // Assert
        const inbox = await ctx.getInbox();
        expect(inbox).toEqual([
          {
            aggregate_id: image.image_id,
            aggregate_type:
              LocalizableMovieDbMessagingSettings.LocalizableMovieImageCreated
                .aggregateType,
            concurrency: 'parallel',
            message_type:
              LocalizableMovieDbMessagingSettings.LocalizableMovieImageCreated
                .messageType,
            metadata: null,
            payload: {
              movie_id: image.movie_id,
              image_id: image.image_id,
              image_type: image.image_type,
            },
          },
        ]);
      },
    );

    it('Movie image updated -> inbox entry added', async () => {
      // Arrange
      await insert('movies_images', {
        movie_id: movie.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      const [updatedImage] = await update(
        'movies_images',
        { image_id: '00000000-0000-0000-0000-000000000002' },
        { movie_id: movie.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: updatedImage.image_id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieImageUpdated
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieImageUpdated
              .messageType,
          metadata: null,
          payload: {
            movie_id: updatedImage.movie_id,
            image_id: updatedImage.image_id,
            image_type: updatedImage.image_type,
          },
        },
      ]);
    });

    it('Movie image deleted -> inbox entry added', async () => {
      // Arrange
      const image = await insert('movies_images', {
        movie_id: movie.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await deletes('movies_images', { movie_id: movie.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: image.image_id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieImageDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieImageDeleted
              .messageType,
          metadata: null,
          payload: {
            movie_id: image.movie_id,
            image_id: image.image_id,
            image_type: image.image_type,
          },
        },
      ]);
    });

    it('Movie deleted -> inbox entries added for movie and movie image', async () => {
      // Arrange
      const image = await insert('movies_images', {
        movie_id: movie.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);
      await ctx.truncateInbox();

      // Act
      await deletes('movies', { id: movie.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toEqual([
        {
          aggregate_id: movie.id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieDeleted
              .messageType,
          metadata: null,
          payload: {
            id: movie.id,
          },
        },
        {
          // Message handler ignores this by checking if movie exists
          aggregate_id: image.image_id.toString(),
          aggregate_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieImageDeleted
              .aggregateType,
          concurrency: 'parallel',
          message_type:
            LocalizableMovieDbMessagingSettings.LocalizableMovieImageDeleted
              .messageType,
          metadata: null,
          payload: {
            movie_id: image.movie_id,
            image_id: image.image_id,
            image_type: image.image_type,
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

    it('Movie inserted -> inbox entry not added', async () => {
      // Arrange
      await ctx.truncate('movies');

      // Act
      movie = await insert('movies', { id: 1, title: 'My Movie' }).run(
        ctx.ownerPool,
      );

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie updated  -> inbox entry not added', async () => {
      // Act
      await update(
        'movies',
        { title: 'My Edited Movie' },
        { id: movie.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie deleted -> inbox entry not added', async () => {
      // Act
      await deletes('movies', { id: movie.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie COVER inserted -> inbox entry not added', async () => {
      // Act
      await insert('movies_images', {
        movie_id: movie.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie COVER updated -> inbox entry not added', async () => {
      // Arrange
      await insert('movies_images', {
        movie_id: movie.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Act
      await update(
        'movies_images',
        { image_id: '00000000-0000-0000-0000-000000000002' },
        { movie_id: movie.id },
      ).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });

    it('Movie COVER deleted -> inbox entry not added', async () => {
      // Arrange
      await insert('movies_images', {
        movie_id: movie.id,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      }).run(ctx.ownerPool);

      // Act
      await deletes('movies_images', { movie_id: movie.id }).run(ctx.ownerPool);

      // Assert
      const inbox = await ctx.getInbox();
      expect(inbox).toHaveLength(0);
    });
  });
});
