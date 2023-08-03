import 'jest-extended';
import { MovieGenreLocalization } from 'media-messages';
import { insert } from 'zapatos/db';
import { movie_genres } from 'zapatos/schema';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import {
  commonPublishValidator,
  SnapshotValidationResult,
} from '../../../publishing';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import * as localizationMetadata from '../localization/get-movie-genre-localizations-metadata';
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
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('aggregator', () => {
    let localizationsSpy: jest.SpyInstance;

    beforeEach(async () => {
      localizationsSpy = jest
        .spyOn(localizationMetadata, 'getMovieGenreLocalizationsMetadata')
        .mockImplementation(async () => ({
          result: [],
          validation: [],
        }));
    });

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

    it('one genre without explicit localizations -> valid result', async () => {
      // Arrange
      const localizationError: SnapshotValidationResult = {
        context: 'LOCALIZATION',
        message: `test localization error`,
        severity: 'ERROR',
      };
      localizationsSpy.mockImplementation(async () => ({
        result: undefined,
        validation: [localizationError],
      }));

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
              localizations: [
                {
                  is_default_locale: true,
                  language_tag: DEFAULT_LOCALE_TAG,
                  title: genre1.title,
                },
              ],
            },
          ],
        },
        validation: [localizationError],
      });
    });

    it('two genres with explicit localizations -> valid result sorted by order_no', async () => {
      // Arrange
      const genre2 = await insert('movie_genres', {
        title: 'Genre2',
        sort_order: 1,
      }).run(ctx.ownerPool);
      // Arrange
      const localizations: MovieGenreLocalization[] = [
        {
          title: 'source title',
          language_tag: 'en-US',
          is_default_locale: true,
        },
        {
          title: 'localized title 1',
          language_tag: 'de-DE',
          is_default_locale: false,
        },
        {
          title: 'localized title 2',
          language_tag: 'et-EE',
          is_default_locale: false,
        },
      ];
      localizationsSpy.mockImplementation(async (_config, _token, genreId) => {
        return {
          result: localizations.map((l) => ({
            ...l,
            is_default_locale: genreId === genre1.id.toString(),
          })),
          validation: [],
        };
      });

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
              localizations: localizations.map((l) => ({
                ...l,
                is_default_locale: false,
              })),
            },
            {
              content_id: `movie_genre-${genre1.id}`,
              order_no: genre1.sort_order,
              localizations: localizations.map((l) => ({
                ...l,
                is_default_locale: true,
              })),
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
                localizations: null,
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
          message: `Property 'order_no' of the first genre should be of type 'integer'.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'localizations' of the first genre should be of type 'array'.`,
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
                localizations: [
                  { title: 123, is_default_locale: 'no', language_tag: null },
                ],
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
          message:
            "Property 'is_default_locale' of the first localization of the first genre should be of type 'boolean'.",
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message:
            "Property 'language_tag' of the first localization of the first genre should be of type 'string'.",
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message:
            "Property 'title' of the first localization of the first genre should be of type 'string'.",
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
                localizations: [
                  {
                    title: 'Action',
                    is_default_locale: true,
                    language_tag: 'en-US',
                  },
                  {
                    title: 'localized title 1',
                    is_default_locale: false,
                    language_tag: 'et-EE',
                  },
                  {
                    title: 'localized title 2',
                    is_default_locale: false,
                    language_tag: 'de-DE',
                  },
                ],
              },
              {
                content_id: 'movie_genre-2',
                order_no: 2,
                localizations: [
                  {
                    title: 'Adventure',
                    is_default_locale: true,
                    language_tag: 'en-US',
                  },
                  {
                    title: 'localized title 1',
                    is_default_locale: false,
                    language_tag: 'et-EE',
                  },
                  {
                    title: 'localized title 2',
                    is_default_locale: false,
                    language_tag: 'de-DE',
                  },
                ],
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
