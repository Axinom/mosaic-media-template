import 'jest-extended';
import { insert } from 'zapatos/db';
import { movie_genres } from 'zapatos/schema';
import { commonPublishValidator } from '../../../publishing';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { publishingMovieGenresProcessor } from './publishing-movie-genres-processor';

describe('publishingMovieGenresProcessor', () => {
  let ctx: ITestContext;
  let genre1: movie_genres.JSONSelectable;
  const entityId = 12345;
  const authToken = 'does-not-matter-as-request-is-mocked';

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    genre1 = await insert('movie_genres', {
      title: 'Genre1',
      sort_order: 2,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movie_genres');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('aggregator', () => {
    it('no genres -> valid result with error', async () => {
      // Arrange
      await ctx.truncate('movie_genres');

      // Act
      const result = await publishingMovieGenresProcessor.aggregator(
        entityId,
        authToken,
        ctx.config,
        ctx.ownerPool,
      );

      // Assert
      expect(result).toEqual({
        result: { genres: [] },
        validation: [
          {
            context: 'METADATA',
            message: 'At least one genre must exist.',
            severity: 'ERROR',
          },
        ],
      });
    });

    it('one genre -> valid result', async () => {
      // Act
      const result = await publishingMovieGenresProcessor.aggregator(
        entityId,
        authToken,
        ctx.config,
        ctx.ownerPool,
      );

      // Assert
      expect(result).toEqual({
        result: {
          genres: [
            {
              content_id: `movie_genre-${genre1.id}`,
              order_no: genre1.sort_order,
              title: genre1.title,
            },
          ],
        },
        validation: [],
      });
    });

    it('two genres -> valid result sorted by order_no', async () => {
      // Arrange
      const genre2 = await insert('movie_genres', {
        title: 'Genre2',
        sort_order: 1,
      }).run(ctx.ownerPool);

      // Act
      const result = await publishingMovieGenresProcessor.aggregator(
        entityId,
        authToken,
        ctx.config,
        ctx.ownerPool,
      );

      // Assert
      expect(result).toEqual({
        result: {
          genres: [
            {
              content_id: `movie_genre-${genre2.id}`,
              order_no: genre2.sort_order,
              title: genre2.title,
            },
            {
              content_id: `movie_genre-${genre1.id}`,
              order_no: genre1.sort_order,
              title: genre1.title,
            },
          ],
        },
        validation: [],
      });
    });
  });

  // First test starts with empty object and each next test tries to fix validation errors in a somewhat minimal way until a minimal valid object is produced.
  describe('commonPublishValidator and validator', () => {
    it('empty object -> required property error', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {},
          validation: [],
        } as any,
        publishingMovieGenresProcessor.validationSchema,
        publishingMovieGenresProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message: `Property 'genres' is required.`,
          severity: 'ERROR',
        },
      ]);
    });

    it('object with empty required property and custom error -> errors', async () => {
      // Act
      const customError = {
        context: 'METADATA',
        message:
          'JSON path "movie_genre" should have required property \'genres\' (line: 1, column: 1)',
        severity: 'ERROR',
      };
      const result = await commonPublishValidator(
        {
          result: {
            genres: [],
          },
          validation: [customError],
        } as any,
        publishingMovieGenresProcessor.validationSchema,
        publishingMovieGenresProcessor.validator,
      );

      // Assert
      expect(result).toEqual([customError]);
    });

    it('full object with null properties -> errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            genres: [
              {
                content_id: null,
                order_no: null,
                title: null,
              },
            ],
          },
          validation: [],
        } as any,
        publishingMovieGenresProcessor.validationSchema,
        publishingMovieGenresProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message: `Property 'content_id' of the first genre should be of type 'string'.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'title' of the first genre should be of type 'string'.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'order_no' of the first genre should be of type 'integer'.`,
          severity: 'ERROR',
        },
      ]);
    });

    it('full object with empty properties -> errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            genres: [
              {
                content_id: '',
                order_no: 0,
                title: '',
              },
            ],
          },
          validation: [],
        } as any,
        publishingMovieGenresProcessor.validationSchema,
        publishingMovieGenresProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message: `Property 'content_id' of the first genre should match the pattern "^(movie_genre)-([a-zA-Z0-9_-]+)$".`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'title' of the first genre should not be empty.`,
          severity: 'ERROR',
        },
      ]);
    });

    it('full object with full properties -> errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            genres: [
              {
                content_id: 'movie_genre-1',
                order_no: 1,
                title: 'Action',
              },
              {
                content_id: 'movie_genre-2',
                order_no: 2,
                title: 'Adventure',
              },
            ],
          },
          validation: [],
        } as any,
        publishingMovieGenresProcessor.validationSchema,
        publishingMovieGenresProcessor.validator,
      );

      // Assert
      expect(result).toEqual([]);
    });
  });
});
