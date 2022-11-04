import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { IngestItem } from 'media-messages';
import { all, insert, JSONOnlyColsForTable, select } from 'zapatos/db';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { IngestMovieProcessor } from './ingest-movie-processor';

describe('IngestMovieProcessor', () => {
  let ctx: ITestContext;
  let processor: IngestMovieProcessor;
  let movie1: JSONOnlyColsForTable<
    'movies',
    ('id' | 'title' | 'external_id')[]
  >;
  let user: AuthenticatedManagementSubject;

  beforeAll(async () => {
    ctx = await createTestContext();
    processor = new IngestMovieProcessor();
    user = createTestUser(ctx.config.serviceId);
  });

  beforeEach(async () => {
    movie1 = await insert(
      'movies',
      {
        title: 'Entity1',
        external_id: 'existing1',
      },
      { returning: ['id', 'title', 'external_id'] },
    ).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movies');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('processVideo', () => {
    it('message with 1 new movie -> movie created', async () => {
      // Arrange
      const item: IngestItem = {
        type: 'MOVIE',
        external_id: 'test1_external_id',
        data: { title: 'test1_title' },
      };

      // Act
      const result = await ctx.executeGqlSql(user, async (dbCtx) => {
        return processor.initializeMedia([item], dbCtx);
      });

      // Assert
      const movies = await select('movies', all, {
        columns: ['id', 'title', 'external_id'],
        order: [{ by: 'id', direction: 'ASC' }],
      }).run(ctx.ownerPool);

      expect(movies).toIncludeSameMembers([
        movie1,
        {
          id: movies[1].id,
          title: item.data.title,
          external_id: item.external_id,
        },
      ]);

      expect(result).toEqual({
        createdMedia: [
          {
            external_id: item.external_id,
            id: movies[1].id,
          },
        ],
        displayTitleMappings: [
          {
            display_title: item.data.title,
            external_id: item.external_id,
            title: item.data.title,
          },
        ],
        existedMedia: [],
      });
    });

    it.each(['existing1', 'Existing1'])(
      'message with 1 existing movie with external_id %s -> correct result returned',
      async (externalId) => {
        // Arrange
        const item: IngestItem = {
          type: 'MOVIE',
          external_id: externalId,
          data: { title: 'test1_title' },
        };

        // Act
        const result = await ctx.executeGqlSql(user, async (dbCtx) => {
          return processor.initializeMedia([item], dbCtx);
        });

        // Assert
        const movies = await select('movies', all, {
          columns: ['id', 'title', 'external_id'],
        }).run(ctx.ownerPool);

        expect(movies).toIncludeSameMembers([movie1]);

        expect(result).toEqual({
          createdMedia: [],
          displayTitleMappings: [
            {
              display_title: item.data.title,
              external_id: item.external_id,
              title: item.data.title,
            },
          ],
          existedMedia: [
            {
              external_id: movie1.external_id,
              id: movie1.id,
            },
          ],
        });
      },
    );

    it('message with 1 existing movie and 1 new movie -> valid metadata', async () => {
      // Arrange
      const items: IngestItem[] = [
        {
          type: 'MOVIE',
          external_id: movie1.external_id as string,
          data: { title: 'test1_title_existing' },
        },
        {
          type: 'MOVIE',
          external_id: 'test1_external_id',
          data: { title: 'test1_title_new' },
        },
      ];

      // Act
      const result = await ctx.executeGqlSql(user, async (dbCtx) => {
        return processor.initializeMedia(items, dbCtx);
      });

      // Assert
      const movies = await select('movies', all, {
        columns: ['id', 'title', 'external_id'],
      }).run(ctx.ownerPool);

      expect(movies).toIncludeSameMembers([
        movie1,
        {
          id: movies[1].id,
          title: items[1].data.title,
          external_id: items[1].external_id,
        },
      ]);

      expect(result).toEqual({
        createdMedia: [
          {
            external_id: items[1].external_id,
            id: movies[1].id,
          },
        ],
        displayTitleMappings: items.map((item) => ({
          display_title: item.data.title,
          external_id: item.external_id,
          title: item.data.title,
        })),

        existedMedia: [
          {
            external_id: movie1.external_id,
            id: movie1.id,
          },
        ],
      });
    });

    //TODO: This should be adjusted in the future, so that first and third movies are added and for invalid movie an ingest item is created with status ERROR. Work item: #27456
    it('message with 3 new movies, second being invalid -> no movies are created', async () => {
      // Arrange
      const items: IngestItem[] = [
        {
          type: 'MOVIE',
          external_id: 'test_external_id1',
          data: { title: 'valid_test_title1' },
        },
        {
          type: 'MOVIE',
          external_id: 'test_external_id2',
          data: { title: 'x'.repeat(101) },
        },
        {
          type: 'MOVIE',
          external_id: 'test_external_id3',
          data: { title: 'valid_test_title3' },
        },
      ];

      // Act
      const error = await rejectionOf(
        ctx.executeGqlSql(user, async (dbCtx) => {
          return processor.initializeMedia(items, dbCtx);
        }),
      );

      // Assert
      expect(error.message).toEqual(
        'The title can only be 100 characters long.',
      );

      const movies = await select('movies', all, {
        columns: ['id', 'title', 'external_id'],
      }).run(ctx.ownerPool);

      expect(movies).toEqual([movie1]);
    });
  });
});
