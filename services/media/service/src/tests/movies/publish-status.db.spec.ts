import 'jest-extended';
import { insert, selectExactlyOne, update } from 'zapatos/db';
import { movies, snapshots } from 'zapatos/schema';
import { createTestContext, ITestContext } from '../test-utils';

describe('Movies publish status', () => {
  let ctx: ITestContext;

  const snapshot: snapshots.Insertable = {
    entity_type: 'MOVIE',
    entity_id: 1,
    validation_status: 'OK',
    snapshot_no: 1,
    job_id: '1',
    publish_id: '1',
  };

  const getMovie = async (): Promise<movies.JSONSelectable> =>
    selectExactlyOne('movies', { id: 1 }).run(ctx.ownerPool);

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  beforeEach(async () => {
    await insert('movies', { id: 1, title: 'My Movie' }).run(ctx.ownerPool);
    await insert('snapshots', snapshot).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('snapshots');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('changes set publish status of entity', () => {
    it('published entity updated -> changed', async () => {
      // Arrange
      const publishedDate = new Date();
      await update(
        'snapshots',
        {
          snapshot_state: 'PUBLISHED',
          published_date: publishedDate.toISOString(),
        },
        { snapshot_no: 1 },
      ).run(ctx.ownerPool);

      // Act
      await update('movies', { title: 'New title' }, { id: 1 }).run(
        ctx.ownerPool,
      );

      // Assert
      const movie = await getMovie();
      expect(movie.publish_status).toBe('CHANGED');
      expect(new Date(movie.published_date!)).toEqual(publishedDate);
      expect(movie.published_user).toEqual('Unknown');
    });

    it('not_published entity updated -> not_published', async () => {
      // Act
      await update('movies', { title: 'New title' }, { id: 1 }).run(
        ctx.ownerPool,
      );

      // Assert
      const movie = await getMovie();
      expect(movie.publish_status).toBe('NOT_PUBLISHED');
      expect(movie.published_date).toBeNull();
      expect(movie.published_user).toBeNull();
    });
  });

  describe('snapshot publication sets publish_status of entity', () => {
    it('publish -> published', async () => {
      // Act
      const publishedDate = new Date();
      await update(
        'snapshots',
        {
          snapshot_state: 'PUBLISHED',
          published_date: publishedDate.toISOString(),
        },
        { snapshot_no: 1 },
      ).run(ctx.ownerPool);

      // Assert
      const movie = await getMovie();
      expect(movie.publish_status).toBe('PUBLISHED');
      expect(new Date(movie.published_date!)).toEqual(publishedDate);
      expect(movie.published_user).toEqual('Unknown');
    });

    it('publish old -> changed', async () => {
      // Arrange
      await update('movies', { title: 'New title' }, { id: 1 }).run(
        ctx.ownerPool,
      );

      // Act
      const publishedDate = new Date();
      await update(
        'snapshots',
        {
          snapshot_state: 'PUBLISHED',
          published_date: publishedDate.toISOString(),
        },
        { snapshot_no: 1 },
      ).run(ctx.ownerPool);

      // Assert
      const movie = await getMovie();
      expect(movie.publish_status).toBe('CHANGED');
      expect(new Date(movie.published_date!)).toEqual(publishedDate);
      expect(movie.published_user).toEqual('Unknown');
    });
  });

  describe('snapshot unpublish sets publish_status of entity', () => {
    it('unpublish -> not_published', async () => {
      // Arrange
      await update(
        'snapshots',
        {
          snapshot_state: 'PUBLISHED',
          published_date: new Date().toISOString(),
        },
        { snapshot_no: 1 },
      ).run(ctx.ownerPool);

      // Act
      await update(
        'snapshots',
        {
          snapshot_state: 'UNPUBLISHED',
          published_date: new Date().toISOString(),
        },
        { snapshot_no: 1 },
      ).run(ctx.ownerPool);

      // Assert
      const movie = await getMovie();
      expect(movie.publish_status).toBe('NOT_PUBLISHED');
      expect(movie.published_date).toBeNull();
      expect(movie.published_user).toBeNull();
    });
  });

  describe('snapshot publication does not change entity updated date', () => {
    it('publish -> no change', async () => {
      // Act
      const publishedDate = new Date();
      await update(
        'snapshots',
        {
          snapshot_state: 'PUBLISHED',
          published_date: publishedDate.toISOString(),
        },
        { snapshot_no: 1 },
      ).run(ctx.ownerPool);

      // Assert
      const movie = await getMovie();
      expect(movie.updated_date).toEqual(movie.created_date);
    });

    it('unpublish -> no change', async () => {
      // Arrange
      const publishedDate = new Date();
      await update(
        'snapshots',
        {
          snapshot_state: 'PUBLISHED',
          published_date: publishedDate.toISOString(),
        },
        { snapshot_no: 1 },
      ).run(ctx.ownerPool);

      // Act
      await update(
        'snapshots',
        {
          snapshot_state: 'UNPUBLISHED',
          published_date: new Date().toISOString(),
        },
        { snapshot_no: 1 },
      ).run(ctx.ownerPool);

      // Assert
      const movie = await getMovie();
      expect(movie.updated_date).toEqual(movie.created_date);
    });
  });
});
