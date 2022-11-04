import 'jest-extended';
import { insert, update } from 'zapatos/db';
import { collections } from 'zapatos/schema';
import {
  commonPublishValidator,
  SnapshotValidationResult,
} from '../../../publishing';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { PublishImage } from '../../common';
import * as imageMetadata from '../../common/utils/get-images-metadata';
import { publishingCollectionProcessor } from './publishing-collection-processor';

describe('publishingCollectionProcessor', () => {
  let ctx: ITestContext;
  let collection1: collections.JSONSelectable;
  const authToken = 'does-not-matter-as-request-is-mocked';

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    collection1 = await insert('collections', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('tvshows');
    await ctx.truncate('seasons');
    await ctx.truncate('episodes');
    await ctx.truncate('collections');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('aggregator', () => {
    it('minimal collection -> valid result', async () => {
      //Arrange
      jest
        .spyOn(imageMetadata, 'getImagesMetadata')
        .mockImplementation(async () => ({
          result: [],
          validation: [],
        }));

      // Act
      const result = await publishingCollectionProcessor.aggregator(
        collection1.id,
        authToken,
        ctx.config,
        ctx.ownerPool,
      );

      // Assert
      expect(result).toEqual({
        result: {
          tags: [],
          content_id: `collection-${collection1.id}`,
          description: undefined,
          images: [],
          synopsis: undefined,
          title: 'Entity1',
          related_items: [],
        },
        validation: [],
      });
    });

    it('full metadata collection -> valid result with mocked warnings and errors', async () => {
      // Arrange
      const updateValues = {
        description: 'desc',
        synopsis: 'test syn',
      };
      await update('collections', updateValues, { id: collection1.id }).run(
        ctx.ownerPool,
      );

      await insert('collections_tags', [
        {
          collection_id: collection1.id,
          name: 'Tag 1',
        },
        {
          collection_id: collection1.id,
          name: 'Tag 3',
        },
      ]).run(ctx.ownerPool);

      const movie = await insert('movies', {
        title: 'Entity1',
        external_id: 'existing1',
      }).run(ctx.ownerPool);

      const tvshow = await insert('tvshows', {
        title: 'Entity1',
        external_id: 'existing1',
      }).run(ctx.ownerPool);

      const season = await insert('seasons', {
        index: 1,
        external_id: 'existing1',
      }).run(ctx.ownerPool);

      const episode = await insert('episodes', {
        title: 'Entity1',
        index: 1,
        external_id: 'existing1',
      }).run(ctx.ownerPool);

      await insert('collection_relations', [
        {
          collection_id: collection1.id,
          movie_id: movie.id,
          sort_order: 1,
        },
        {
          collection_id: collection1.id,
          tvshow_id: tvshow.id,
          sort_order: 2,
        },
        {
          collection_id: collection1.id,
          season_id: season.id,
          sort_order: 3,
        },
        {
          collection_id: collection1.id,
          episode_id: episode.id,
          sort_order: 4,
        },
      ]).run(ctx.ownerPool);

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

      // Act
      const result = await publishingCollectionProcessor.aggregator(
        collection1.id,
        authToken,
        ctx.config,
        ctx.ownerPool,
      );

      // Assert
      expect(result).toEqual({
        result: {
          tags: ['Tag 1', 'Tag 3'],
          content_id: `collection-${collection1.id}`,
          description: updateValues.description,
          images: [image],
          synopsis: updateValues.synopsis,
          title: 'Entity1',
          related_items: [
            {
              episode_id: undefined,
              movie_id: `movie-${movie.id}`,
              order_no: 1,
              relation_type: 'MOVIE',
              season_id: undefined,
              tvshow_id: undefined,
            },
            {
              episode_id: undefined,
              movie_id: undefined,
              order_no: 2,
              relation_type: 'TVSHOW',
              season_id: undefined,
              tvshow_id: `tvshow-${tvshow.id}`,
            },
            {
              episode_id: undefined,
              movie_id: undefined,
              order_no: 3,
              relation_type: 'SEASON',
              season_id: `season-${season.id}`,
              tvshow_id: undefined,
            },
            {
              episode_id: `episode-${episode.id}`,
              movie_id: undefined,
              order_no: 4,
              relation_type: 'EPISODE',
              season_id: undefined,
              tvshow_id: undefined,
            },
          ],
        },
        validation: [imageError, imageWarning],
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
        publishingCollectionProcessor.validationSchema,
        publishingCollectionProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message: `Cover image is not assigned.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'content_id' is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'title' is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'related_items' is required.`,
          severity: 'ERROR',
        },
      ]);
    });

    it('object with empty required properties and and invalid video and image -> errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            content_id: '',
            title: '',
            images: [{ type: 'COVER' }],
            related_items: [],
          },
          validation: [],
        } as any,
        publishingCollectionProcessor.validationSchema,
        publishingCollectionProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message: `At least one related item must be assigned.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'content_id' should match the pattern "^(collection)-([a-zA-Z0-9_-]+)$".`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'title' should not be empty.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'path' of the first image is required.`,
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
      ]);
    });

    it('object with invalid relations -> errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            content_id: 'collection-1',
            title: 'test',
            images: [{ type: 'COVER', width: 0, height: 0, path: '' }],
            related_items: [{}],
          },
          validation: [],
        } as any,
        publishingCollectionProcessor.validationSchema,
        publishingCollectionProcessor.validator,
      );

      // Assert
      expect(result).toEqual([
        {
          context: 'METADATA',
          message: `The first related item must have a relation id defined.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'path' of the first image should match the pattern "/[^/]+(.*)".`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'order_no' of the first related item is required.`,
          severity: 'ERROR',
        },
        {
          context: 'METADATA',
          message: `Property 'relation_type' of the first related item is required.`,
          severity: 'ERROR',
        },
      ]);
    });

    it('collection right after creation -> specific errors', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            content_id: 'collection-1',
            title: 'empty',
            tags: [],
            images: [],
            related_items: [],
          },
          validation: [],
        } as any,
        publishingCollectionProcessor.validationSchema,
        publishingCollectionProcessor.validator,
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
          message: 'At least one related item must be assigned.',
          severity: 'ERROR',
        },
      ]);
    });

    it('minimal valid object with additional error and warning -> only additional validation objects', async () => {
      // Act
      const result = await commonPublishValidator(
        {
          result: {
            content_id: 'collection-1',
            title: 'test',
            related_items: [
              { movie_id: 'movie-1', relation_type: 'MOVIE', order_no: 1 },
            ],
            images: [
              {
                type: 'COVER',
                width: 0, // Trusting image service on width and height values
                height: 0,
                path: '/transform/0000000000000000-0000000000000000/9FqubDgdtLaSjXmnBc9UNf.jpg',
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
        publishingCollectionProcessor.validationSchema,
        publishingCollectionProcessor.validator,
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
            content_id: 'collection-6',
            title: 'Avatar',
            synopsis:
              "In 2154, humans have depleted Earth's natural resources...",
            description:
              'Avatar is a 2009 American epic science fiction film...',
            tags: ['3D', 'SciFi', 'Highlight'],

            images: [
              {
                width: 1800,
                height: 1012,
                type: 'COVER',
                path: '/transform/0000000000000000-0000000000000000/9FqubDgdtLaSjXmnBc9UNf.jpg',
              },
            ],
            related_items: [
              { movie_id: 'movie-2', relation_type: 'MOVIE', order_no: 5 },
              { season_id: 'season-3', relation_type: 'SEASON', order_no: 6 },
              { tvshow_id: 'tvshow-4', relation_type: 'TVSHOW', order_no: 7 },
              {
                episode_id: 'episode-5',
                relation_type: 'EPISODE',
                order_no: 8,
              },
              { movie_id: 'movie-1', relation_type: 'MOVIE', order_no: 1 },
              { season_id: 'season-1', relation_type: 'SEASON', order_no: 2 },
              { tvshow_id: 'tvshow-1', relation_type: 'TVSHOW', order_no: 3 },
              {
                episode_id: 'episode-1',
                relation_type: 'EPISODE',
                order_no: 4,
              },
            ],
          },
          validation: [],
        } as any,
        publishingCollectionProcessor.validationSchema,
        publishingCollectionProcessor.validator,
      );

      // Assert
      expect(result).toEqual([]);
    });
  });
});
