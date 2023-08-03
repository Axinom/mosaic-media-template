import 'jest-extended';
import { MovieLocalization } from 'media-messages';
import { insert, update } from 'zapatos/db';
import { movies } from 'zapatos/schema';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import {
  commonPublishValidator,
  SnapshotValidationResult,
} from '../../../publishing';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { PublishImage, PublishVideo } from '../../common';
import * as imageMetadata from '../../common/utils/get-images-metadata';
import * as videoMetadata from '../../common/utils/get-videos-metadata';
import * as localizationMetadata from '../localization/get-movie-localizations-metadata';
import { publishingMovieProcessor } from './publishing-movie-processor';

describe('publishingMovieProcessor', () => {
  let ctx: ITestContext;
  let movie1: movies.JSONSelectable;
  const authToken = 'does-not-matter-as-request-is-mocked';

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    movie1 = await insert('movies', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('movie_genres');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('aggregator', () => {
    it('minimal movie -> valid result', async () => {
      //Arrange
      jest
        .spyOn(videoMetadata, 'getVideosMetadata')
        .mockImplementation(async () => ({
          result: [],
          validation: [],
        }));
      jest
        .spyOn(imageMetadata, 'getImagesMetadata')
        .mockImplementation(async () => ({
          result: [],
          validation: [],
        }));
      jest
        .spyOn(localizationMetadata, 'getMovieLocalizationsMetadata')
        .mockImplementation(async () => ({
          result: undefined,
          validation: [],
        }));

      // Act
      const result = await publishingMovieProcessor.aggregator(
        movie1.id,
        authToken,
        ctx.config,
        ctx.ownerPool,
      );

      // Assert
      expect(result).toEqual({
        result: {
          cast: [],
          tags: [],
          content_id: `movie-${movie1.id}`,
          genre_ids: [],
          images: [],
          licenses: [],
          original_title: undefined,
          production_countries: [],
          released: undefined,
          studio: undefined,
          videos: [],
          localizations: [
            {
              is_default_locale: true,
              language_tag: DEFAULT_LOCALE_TAG,
              title: 'Entity1',
              description: undefined,
              synopsis: undefined,
            },
          ],
        },
        validation: [],
      });
    });

    it('full metadata movie -> valid result with mocked warnings and errors', async () => {
      // Arrange
      const updateValues = {
        description: 'desc',
        original_title: 'some original title',
        released: '2021-05-26',
        studio: 'Random Studio',
        synopsis: 'test syn',
      };
      await update('movies', updateValues, { id: movie1.id }).run(
        ctx.ownerPool,
      );
      const genre1 = await insert('movie_genres', {
        title: 'test 1',
        sort_order: 1,
      }).run(ctx.ownerPool);
      const genre2 = await insert('movie_genres', {
        title: 'test 2',
        sort_order: 2,
      }).run(ctx.ownerPool);

      await insert('movies_movie_genres', [
        {
          movie_id: movie1.id,
          movie_genres_id: genre1.id,
        },
        {
          movie_id: movie1.id,
          movie_genres_id: genre2.id,
        },
      ]).run(ctx.ownerPool);

      await insert('movies_casts', [
        {
          movie_id: movie1.id,
          name: 'Actress 1',
        },
        {
          movie_id: movie1.id,
          name: 'Actor 2',
        },
      ]).run(ctx.ownerPool);

      await insert('movies_tags', [
        {
          movie_id: movie1.id,
          name: 'Tag 1',
        },
        {
          movie_id: movie1.id,
          name: 'Tag 3',
        },
      ]).run(ctx.ownerPool);

      const license1 = await insert('movies_licenses', {
        movie_id: movie1.id,
        license_start: '2021-02-01T15:05:25.000Z',
        license_end: '2021-09-01T15:05:25.000Z',
      }).run(ctx.ownerPool);

      const license2 = await insert('movies_licenses', {
        movie_id: movie1.id,
      }).run(ctx.ownerPool);

      await insert('movies_licenses_countries', {
        movies_license_id: license1.id,
        code: 'KW',
      }).run(ctx.ownerPool);

      await insert('movies_licenses_countries', {
        movies_license_id: license2.id,
        code: 'BY',
      }).run(ctx.ownerPool);

      await insert('movies_licenses_countries', {
        movies_license_id: license2.id,
        code: 'DE',
      }).run(ctx.ownerPool);

      await insert('movies_production_countries', {
        movie_id: movie1.id,
        name: 'Imaginary Country A',
      }).run(ctx.ownerPool);

      await insert('movies_production_countries', {
        movie_id: movie1.id,
        name: 'Imaginary Country B',
      }).run(ctx.ownerPool);

      const video: PublishVideo = {
        type: 'MAIN',
        title: 'test video',
        is_protected: true,
        output_format: 'CMAF',
      };
      const videoWarning: SnapshotValidationResult = {
        context: 'VIDEO',
        message: `test stream warning`,
        severity: 'WARNING',
      };
      const videoError: SnapshotValidationResult = {
        context: 'VIDEO',
        message: `test stream error`,
        severity: 'ERROR',
      };
      jest
        .spyOn(videoMetadata, 'getVideosMetadata')
        .mockImplementation(async () => ({
          result: [video],
          validation: [videoError, videoWarning],
        }));

      const image: PublishImage = {
        width: 111,
        height: 222,
        type: 'COVER',
        path: 'test/path.png',
      };
      const imageWarning: SnapshotValidationResult = {
        context: 'IMAGE',
        message: `test image warning`,
        severity: 'WARNING',
      };
      const imageError: SnapshotValidationResult = {
        context: 'IMAGE',
        message: `test image error`,
        severity: 'ERROR',
      };
      jest
        .spyOn(imageMetadata, 'getImagesMetadata')
        .mockImplementation(async () => ({
          result: [image],
          validation: [imageError, imageWarning],
        }));
      const localizationWarning: SnapshotValidationResult = {
        context: 'LOCALIZATION',
        message: `test localization warning`,
        severity: 'WARNING',
      };
      const localizations: MovieLocalization[] = [
        {
          title: 'source title',
          synopsis: 'source synopsis',
          description: 'source description',
          language_tag: 'en-US',
          is_default_locale: true,
        },
        {
          title: 'localized title 1',
          synopsis: 'localized synopsis',
          description: 'localized description',
          language_tag: 'de-DE',
          is_default_locale: false,
        },
        {
          title: 'localized title 2',
          synopsis: null,
          description: null,
          language_tag: 'et-EE',
          is_default_locale: false,
        },
      ];
      jest
        .spyOn(localizationMetadata, 'getMovieLocalizationsMetadata')
        .mockImplementation(async () => ({
          result: localizations,
          validation: [localizationWarning],
        }));

      // Act
      const result = await publishingMovieProcessor.aggregator(
        movie1.id,
        authToken,
        ctx.config,
        ctx.ownerPool,
      );

      // Assert
      expect(result).toEqual({
        result: {
          cast: ['Actress 1', 'Actor 2'],
          tags: ['Tag 1', 'Tag 3'],
          content_id: `movie-${movie1.id}`,
          genre_ids: [`movie_genre-${genre1.id}`, `movie_genre-${genre2.id}`],
          images: [image],
          licenses: [
            {
              countries: ['KW'],
              end_time: '2021-09-01T15:05:25+00:00',
              start_time: '2021-02-01T15:05:25+00:00',
            },
            {
              countries: ['BY', 'DE'],
              end_time: undefined,
              start_time: undefined,
            },
          ],
          original_title: updateValues.original_title,
          production_countries: ['Imaginary Country A', 'Imaginary Country B'],
          released: updateValues.released,
          studio: updateValues.studio,
          videos: [video],
          localizations,
        },
        validation: [
          imageError,
          imageWarning,
          videoError,
          videoWarning,
          localizationWarning,
        ],
      });
    });
  });

  // First test starts with empty object and each next test tries to fix validation errors in a somewhat minimal way until a minimal valid object is produced.
  describe('validator', () => {
    it('empty object -> required property errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {},
          validation: [],
        } as any,
        publishingMovieProcessor.validationSchema,
        publishingMovieProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message: 'Cover image is not assigned.',
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: 'Main video is not assigned.',
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'content_id' is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'licenses' is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'genre_ids' is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'images' is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'videos' is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'localizations' is required.`,
          severity: 'ERROR',
        },
      ]);
    });

    it('object with empty required properties and and invalid video, image, and localization-> errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            content_id: '',
            licenses: [],
            genre_ids: [],
            images: [{ type: 'COVER' }],
            videos: [{ type: 'MAIN' }],
            localizations: [{ title: '' }],
          },
          validation: [],
        } as any,
        publishingMovieProcessor.validationSchema,
        publishingMovieProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message: 'At least one genre must be assigned.',
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'width' of the first image is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'height' of the first image is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'length_in_seconds' of the first video is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'audio_languages' of the first video is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'subtitle_languages' of the first video is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'caption_languages' of the first video is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `The first video must have either DASH Manifest or HLS Manifest defined. Most probably assigned video is still processing.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `At least one license must be assigned.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'content_id' should match the pattern "^(movie)-([a-zA-Z0-9_-]+)$".`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'path' of the first image is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'title' of the first video is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'output_format' of the first video is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'is_protected' of the first video is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message:
            "Property 'is_default_locale' of the first localization is required.",
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message:
            "Property 'language_tag' of the first localization is required.",
          severity: 'ERROR',
        },
      ]);
    });

    it('object with invalid relations -> errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            content_id: 'movie-1',
            licenses: [
              {},
              {
                end_time: '2020-08-01T00:00:00+00:00',
                start_time: '2020-08-30T23:59:59.999+00:00',
              },
            ],
            genre_ids: ['test'],
            images: [{ type: 'COVER', width: 0, height: 0, path: '' }],
            videos: [
              {
                type: 'MAIN',
                is_protected: false,
                title: '',
                output_format: '',
                length_in_seconds: 0,
                audio_languages: [],
                subtitle_languages: [],
                caption_languages: [],
                dash_manifest: 'a',
              },
              {
                type: 'INVALID',
                title: 'avatar',
                is_protected: false,
                output_format: 'DASH',
                length_in_seconds: 5,
                audio_languages: ['en', 'de'],
                subtitle_languages: ['en', 'de'],
                caption_languages: ['en', 'de'],
                dash_manifest:
                  'https://videoimagedev.blob.core.windows.net/encoded-videos/QtmGgafYUYmrmxw5apkD66/dash/manifest.mpd',
              },
            ],
            localizations: [
              { title: 123, is_default_locale: 'no', language_tag: null },
            ],
          },
          validation: [],
        } as any,
        publishingMovieProcessor.validationSchema,
        publishingMovieProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message:
            "Property 'width' of the first image must be a positive number.",
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message:
            "Property 'height' of the first image must be a positive number.",
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'length_in_seconds' of the first video must be a positive number.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'audio_languages' of the first video must not be empty.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'dash_manifest' of the first video must be a valid URL.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `The first license must have either start_time, end_time, or at least one country defined.`,
          severity: 'ERROR',
        },

        {
          context: 'METADATA',
          message: `Property 'end_time' of the second license must be greater than start_time.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'path' of the first image should match the pattern "/[^/]+(.*)".`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `The first genre should match the pattern "^(movie_genre)-([a-zA-Z0-9_-]+)$".`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'title' of the first video should not be empty.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'output_format' of the first video should be one of the following values: DASH, HLS, DASH_HLS, CMAF, DASH_ON_DEMAND.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'type' of the second video should be one of the following values: MAIN, TRAILER.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message:
            "Property 'is_default_locale' of the first localization should be of type 'boolean'.",
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message:
            "Property 'language_tag' of the first localization should be of type 'string'.",
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message:
            "Property 'title' of the first localization should be of type 'string'.",
          severity: 'ERROR',
        },
      ]);
    });

    it('movie right after creation -> specific errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            content_id: 'movie-1',
            production_countries: [],
            genre_ids: [],
            cast: [],
            tags: [],
            licenses: [],
            images: [],
            videos: [],
            localizations: [
              {
                title: 'empty',
                is_default_locale: true,
                language_tag: DEFAULT_LOCALE_TAG,
              },
            ],
          },
          validation: [],
        } as any,
        publishingMovieProcessor.validationSchema,
        publishingMovieProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message: 'At least one genre must be assigned.',
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: 'Cover image is not assigned.',
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: 'Main video is not assigned.',
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: 'At least one license must be assigned.',
          severity: 'ERROR',
        },
      ]);
    });

    it('minimal valid object with additional error and warning -> only additional validation objects', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            content_id: 'movie-1',
            licenses: [{ countries: ['ZW'] }],
            genre_ids: ['movie_genre-1'],
            images: [
              {
                type: 'COVER',
                width: 100,
                height: 100,
                path: '/transform/0000000000000000-0000000000000000/9FqubDgdtLaSjXmnBc9UNf.jpg',
              },
            ],
            videos: [
              {
                type: 'MAIN',
                is_protected: false,
                title: 'a',
                output_format: 'DASH',
                length_in_seconds: 1,
                audio_languages: ['en'], // Trusting Video Service
                subtitle_languages: [],
                caption_languages: [],
                dash_manifest:
                  'https://videoimagedev.blob.core.windows.net/encoded-videos/83Y9JqrKjiCMLpj1bCnsed/dash/manifest.mpd',
              },
            ],
            localizations: [
              {
                title: 'test',
                is_default_locale: true,
                language_tag: DEFAULT_LOCALE_TAG,
              },
            ],
          },
          validation: [
            {
              context: 'METADATA',
              message: 'additional error',
              severity: 'ERROR',
            },
            {
              context: 'METADATA',
              message: 'additional warning',
              severity: 'WARNING',
            },
          ],
        } as any,
        publishingMovieProcessor.validationSchema,
        publishingMovieProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message: 'additional error',
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: 'additional warning',
          severity: 'WARNING',
        },
      ]);
    });

    it('full valid object -> no errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            content_id: 'movie-6',
            original_title: "James Cameron's Avatar",
            released: '2009-12-10',
            studio: '20th Century Fox',
            production_countries: [
              'United States of America',
              'Estonia',
              'Germany',
              'COL',
              'ESP',
            ],
            genre_ids: ['movie_genre-3', 'movie_genre-18'],
            cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
            tags: ['3D', 'SciFi', 'Highlight'],
            licenses: [
              {
                start_time: '2020-08-01T00:00:00+00:00',
                end_time: '2020-08-30T23:59:59.999+00:00',
                countries: ['AW', 'AT', 'FI'],
              },
              {
                countries: ['AW', 'AT', 'FI'],
              },
              {
                start_time: '2020-08-01T00:00:00+00:00',
              },
              {
                end_time: '2020-08-30T23:59:59.999+00:00',
              },
            ],
            images: [
              {
                width: 1800,
                height: 1012,
                type: 'COVER',
                path: '/transform/0000000000000000-0000000000000000/9FqubDgdtLaSjXmnBc9UNf.jpg',
              },
              {
                width: 1800,
                height: 1012,
                type: 'TEASER',
                path: '/transform/0000000000000000-0000000000000000/43BncavVQvDmjxiwQtt3kd.jpg',
              },
            ],
            videos: [
              {
                type: 'MAIN',
                title: 'avatar',
                is_protected: false,
                output_format: 'DASH',
                length_in_seconds: 5,
                audio_languages: ['en', 'de'],
                subtitle_languages: ['en', 'de'],
                caption_languages: ['en', 'de'],
                hls_manifest: null,
                dash_manifest:
                  'https://videoimagedev.blob.core.windows.net/encoded-videos/QtmGgafYUYmrmxw5apkD66/dash/manifest.mpd',
              },
              {
                type: 'TRAILER',
                title: 'avatar_1',
                is_protected: false,
                output_format: 'HLS',
                length_in_seconds: 5,
                audio_languages: ['en', 'de'],
                subtitle_languages: ['en', 'de'],
                caption_languages: ['en', 'de'],

                dash_manifest: null,
                hls_manifest:
                  'https://videoimagedev.blob.core.windows.net/encoded-videos/SewobHEyxbg3A1y6aWPHve/dash/manifest.mpd',
              },
              {
                type: 'TRAILER',
                title: 'avatar_2',
                is_protected: false,
                output_format: 'CMAF',
                length_in_seconds: 5,
                audio_languages: ['en', 'de'],
                subtitle_languages: ['en', 'de'],
                caption_languages: ['en', 'de'],
                hls_manifest:
                  'https://videoimagedev.blob.core.windows.net/encoded-videos/83Y9JqrKjiCMLpj1bCnsed/dash/manifest.mpd',
                dash_manifest:
                  'https://videoimagedev.blob.core.windows.net/encoded-videos/83Y9JqrKjiCMLpj1bCnsed/dash/manifest.mpd',
              },
            ],
            localizations: [
              {
                title: 'Avatar',
                synopsis:
                  "In 2154, humans have depleted Earth's natural resources...",
                description:
                  'Avatar is a 2009 American epic science fiction film...',
                is_default_locale: true,
                language_tag: 'en-US',
              },
              {
                title: 'localized title 1',
                synopsis: 'localized synopsis 1',
                description: 'localized description 1',
                is_default_locale: false,
                language_tag: 'et-EE',
              },
              {
                title: 'localized title 2',
                synopsis: 'localized synopsis 2',
                description: 'localized description 2',
                is_default_locale: false,
                language_tag: 'de-DE',
              },
            ],
          },
          validation: [],
        } as any,
        publishingMovieProcessor.validationSchema,
        publishingMovieProcessor.validator,
      );

      // Assert
      expect(result).toEqual([]);
    });
  });
});
