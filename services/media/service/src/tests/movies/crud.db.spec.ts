import { DEFAULT_SYSTEM_USERNAME } from '@axinom/mosaic-db-common';
import {
  assertNotFalsy,
  dateToBeGreaterThan,
  MosaicErrors,
  toBeIso8601Strict,
} from '@axinom/mosaic-service-common';
import 'jest-extended';
import { all, insert, select, update } from 'zapatos/db';
import { movies } from 'zapatos/schema';
import {
  createSnapshotWithRelation,
  generateSnapshotJobId,
} from '../../publishing';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import {
  CREATE,
  DELETE_BY_ID,
  GET_BY_ID,
  GET_LIST_WITHOUT_VARIABLES,
  UPDATE,
} from './gql-constants';

describe('Movies GraphQL endpoints', () => {
  let ctx: ITestContext;
  let movie1: movies.JSONSelectable;
  let defaultRequestContext: TestRequestContext;

  const createMovie = async (title: string): Promise<movies.JSONSelectable> => {
    return insert('movies', { title }).run(ctx.ownerPool);
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
  });

  beforeEach(async () => {
    movie1 = await createMovie('Movie1');
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('snapshots');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('createMovie', () => {
    it('minimum properties -> valid element', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        CREATE,
        {
          input: {
            movie: {
              title: 'Valid Title',
            },
          },
        },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      assertNotFalsy(resp.data, 'resp.data');
      const movie = resp.data.createMovie.movie;
      expect(movie.id).toBeTruthy();
      expect(movie.createdDate).toBeTruthy();
      expect(movie.updatedDate).toBeTruthy();
      expect(movie.externalId).toBeNull();
      expect(movie.createdUser).toBe(DEFAULT_SYSTEM_USERNAME);
      expect(movie.updatedUser).toBe(DEFAULT_SYSTEM_USERNAME);
      expect(movie.publishStatus).toBe('NOT_PUBLISHED');
      expect(movie.publishedUser).toBeNull();
      expect(movie.publishedDate).toBeNull();
      expect(movie.title).toBe('Valid Title');
      expect(movie.synopsis).toBeNull();
      expect(movie.description).toBeNull();
    });

    it('title over 250 characters -> error', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        CREATE,
        {
          input: {
            movie: {
              title: 'x'.repeat(251),
            },
          },
        },
        defaultRequestContext,
      );

      // Assert
      assertNotFalsy(resp.data, 'resp.data');
      expect(resp.data.createMovie).toBeFalsy();

      assertNotFalsy(resp.errors, 'resp.errors');
      expect(resp.errors).toHaveLength(1);

      const error = resp.errors[0];
      toBeIso8601Strict(error.timestamp as string);
      expect(error.message).toBe('The title can only be 100 characters long.');
      expect(error.code).toBe('DATABASE_VALIDATION_FAILED');
    });

    it.each(['', ' ', '  '])(
      'title with invalid whitespace values -> error, value: "%s"',
      async (title) => {
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE,
          {
            input: {
              movie: {
                title,
              },
            },
          },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.updateVideo).toBeFalsy();
        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: 'The title cannot be empty.',
            path: ['createMovie'],
          },
        ]);
      },
    );

    it.each([
      ' Title',
      'Title ',
      '   Title',
      'Title    ',
      '    Title   ',
      `\tTitle`,
      `\nTitle`,
      `\u00A0Title`,
    ])(
      'title with valid whitespace values -> no error, value: "%s"',
      async (title) => {
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE,
          {
            input: {
              movie: {
                title,
              },
            },
          },
          defaultRequestContext,
        );

        // Assert
        expect(resp.errors).toBeFalsy();

        assertNotFalsy(resp.data, 'resp.data');
        const movie = resp.data.createMovie.movie;
        expect(movie.title).toBe(title);
      },
    );
  });

  describe('movies', () => {
    it('empty collection -> 0 elements', async () => {
      // Arrange
      await ctx.truncate('movies');

      // Act
      const resp = await ctx.runGqlQuery(
        GET_LIST_WITHOUT_VARIABLES,
        {},
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      assertNotFalsy(resp.data, 'resp.data');
      expect(resp.data.movies.nodes).toHaveLength(0);
    });

    it('filled collection -> 1 elements', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        GET_LIST_WITHOUT_VARIABLES,
        {},
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      assertNotFalsy(resp.data, 'resp.data');
      const movies = resp.data.movies.nodes;
      expect(movies).toHaveLength(1);
      expect(movies[0].title).toContain(movie1.title);
    });
  });

  describe('movie', () => {
    it('existing id -> correct data', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        GET_BY_ID,
        { id: movie1.id },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      assertNotFalsy(resp.data, 'resp.data');
      const movie = resp.data.movie;
      expect(movie.id).toBe(movie1.id);
      expect(movie.createdDate).toBeTruthy();
      expect(movie.createdDate).toBe(movie1.created_date);
      expect(movie.updatedDate).toBeTruthy();
      expect(movie.updatedDate).toBe(movie1.updated_date);
      expect(movie.externalId).toBe(movie1.external_id);
      expect(movie.createdUser).toBe('Unknown');
      expect(movie.updatedUser).toBe('Unknown');
      expect(movie.publishStatus).toBe('NOT_PUBLISHED');
      expect(movie.publishedUser).toBeNull();
      expect(movie.publishedDate).toBeNull();
      expect(movie.title).toBe('Movie1');
      expect(movie.synopsis).toBeNull();
      expect(movie.description).toBeNull();
    });
  });

  describe('updateMovie', () => {
    it('minimum properties -> valid element', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        UPDATE,
        {
          input: {
            id: movie1.id,
            patch: {
              title: 'Valid Title',
            },
          },
        },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      assertNotFalsy(resp.data, 'resp.data');
      const movie = resp.data.updateMovie.movie;
      expect(movie.id).toBe(movie1.id);
      expect(movie.createdDate).toBeTruthy();
      expect(movie.createdDate).toBe(movie1.created_date);
      expect(movie.updatedDate).toBeTruthy();
      dateToBeGreaterThan(movie.updatedDate, movie1.updated_date);
      expect(movie.externalId).toBe(movie1.external_id);
      expect(movie.createdUser).toBe('Unknown');
      expect(movie.updatedUser).toBe(DEFAULT_SYSTEM_USERNAME);
      expect(movie.publishStatus).toBe('NOT_PUBLISHED');
      expect(movie.publishedUser).toBeNull();
      expect(movie.publishedDate).toBeNull();
      expect(movie.title).toBe('Valid Title');
      expect(movie.synopsis).toBeNull();
      expect(movie.description).toBeNull();
    });

    it('empty date time format -> validation error', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        UPDATE,
        {
          input: {
            id: movie1.id,
            patch: {
              released: '',
            },
          },
        },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toHaveLength(1);

      assertNotFalsy(resp.errors, 'resp.errors');
      const error = resp.errors[0];
      expect(error.code).toBe(MosaicErrors.DatabaseValidationFailed.code);
      expect(error.message).toBe('invalid input syntax for type date: ""');
    });
  });

  describe('deleteMovie', () => {
    it('existing id -> deleted asset', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        DELETE_BY_ID,
        {
          input: { id: movie1.id },
        },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      assertNotFalsy(resp.data, 'resp.data');
      const { movie, query } = resp.data.deleteMovie;
      expect(movie.id).toBe(movie1.id);
      expect(movie.createdDate).toBeTruthy();
      expect(movie.createdDate).toBe(movie1.created_date);
      expect(movie.updatedDate).toBeTruthy();
      expect(movie.updatedDate).toBe(movie1.updated_date);
      expect(movie.externalId).toBe(movie1.external_id);
      expect(movie.createdUser).toBe('Unknown');
      expect(movie.updatedUser).toBe('Unknown');
      expect(movie.publishStatus).toBe('NOT_PUBLISHED');
      expect(movie.publishedUser).toBeNull();
      expect(movie.publishedDate).toBeNull();
      expect(movie.title).toBe('Movie1');
      expect(movie.synopsis).toBeNull();
      expect(movie.description).toBeNull();
      expect(query.movies.totalCount).toEqual(0);
    });

    it('delete while active snapshot exists -> error thrown', async () => {
      // Arrange
      const snapshot = await createSnapshotWithRelation(
        'MOVIE',
        movie1.id,
        generateSnapshotJobId(),
        ctx.ownerPool,
      );

      await update(
        'snapshots',
        { snapshot_state: 'PUBLISHED' },
        { id: snapshot.id },
      ).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(
        DELETE_BY_ID,
        { input: { id: movie1.id } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.deleteMovie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: 'DATABASE_VALIDATION_FAILED',
          message: `Movie with ID ${movie1.id} cannot be deleted as it has active snapshots.`,
          path: ['deleteMovie'],
        },
      ]);

      const relations = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);

      expect(relations).toHaveLength(1);
      expect(snapshots).toHaveLength(1);
    });

    it('delete while unpublished snapshot exists -> movie deleted with snapshot and relation', async () => {
      // Arrange
      const snapshot = await createSnapshotWithRelation(
        'MOVIE',
        movie1.id,
        generateSnapshotJobId(),
        ctx.ownerPool,
      );

      await update(
        'snapshots',
        { snapshot_state: 'UNPUBLISHED' },
        { id: snapshot.id },
      ).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(
        DELETE_BY_ID,
        { input: { id: movie1.id } },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();

      assertNotFalsy(resp.data, 'resp.data');
      const { movie, query } = resp.data.deleteMovie;
      expect(movie.id).toBe(movie1.id);
      expect(query.movies.totalCount).toEqual(0);

      const relations = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);

      expect(relations).toHaveLength(0);
      expect(snapshots).toHaveLength(0);
    });
  });
});
