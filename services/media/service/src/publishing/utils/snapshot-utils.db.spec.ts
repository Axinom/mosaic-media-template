import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import 'jest-extended';
import { insert, select, update } from 'zapatos/db';
import { movies, snapshots } from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { EntityListInfo } from '../models';
import {
  createListSnapshot,
  createSnapshotWithRelation,
  getPublishedSnapshot,
} from './snapshot-utils';

describe('snapshot-utils', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let movie1: movies.JSONSelectable;
  let snapshot1: snapshots.JSONSelectable;
  const listSnapshotInfo: EntityListInfo = {
    id: 123,
    type: 'MOVIE_GENRE',
    table: 'movie_genres',
    title: 'Test Snapshot title',
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId);
  });

  beforeEach(async () => {
    movie1 = await insert('movies', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
    snapshot1 = await insert('snapshots', {
      entity_id: movie1.id,
      publish_id: `movie-${movie1.id}`,
      job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
      snapshot_no: 1,
      entity_type: 'MOVIE',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('snapshots');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('createSnapshotWithRelation', () => {
    it('call with no existing snapshots -> snapshot returned', async () => {
      // Arrange
      await ctx.truncate('snapshots');

      // Act
      const snapshot = await ctx.executeGqlSql(user, async (ct) => {
        return createSnapshotWithRelation(
          'MOVIE',
          movie1.id,
          '5f936eab-ed44-455d-ab22-fea3f50195ed',
          ct,
        );
      });

      // Assert
      const ref = await select('movies_snapshots', { movie_id: movie1.id }).run(
        ctx.ownerPool,
      );

      expect(snapshot).toMatchObject({
        // Auto-generated
        // updated_date: '2021-05-26T09:36:26.209Z',
        // created_date: '2021-05-26T09:36:26.209Z',
        // id: 8,
        updated_user: 'System',
        created_user: 'System',
        entity_id: movie1.id,
        entity_title: movie1.title,
        entity_type: 'MOVIE',
        job_id: '5f936eab-ed44-455d-ab22-fea3f50195ed',
        publish_id: `movie-${movie1.id}`,
        published_date: null,
        scheduled_date: null,
        snapshot_json: null,
        snapshot_no: 1,
        snapshot_state: 'INITIALIZATION',
        unpublished_date: null,
        validation_status: null,
      });
      expect(ref).toEqual([{ movie_id: movie1.id, snapshot_id: snapshot.id }]);
    });

    it('call with 1 existing snapshots -> snapshot returned with incremented snapshot_no', async () => {
      // Arrange
      await insert('movies_snapshots', {
        movie_id: movie1.id,
        snapshot_id: snapshot1.id,
      }).run(ctx.ownerPool);

      // Act
      const snapshot = await ctx.executeGqlSql(user, async (ct) => {
        return createSnapshotWithRelation(
          'MOVIE',
          movie1.id,
          '5f936eab-ed44-455d-ab22-fea3f50195ed',
          ct,
        );
      });

      // Assert
      const ref = await select('movies_snapshots', { movie_id: movie1.id }).run(
        ctx.ownerPool,
      );

      expect(snapshot).toMatchObject({
        // Auto-generated
        // updated_date: '2021-05-26T09:36:26.209Z',
        // created_date: '2021-05-26T09:36:26.209Z',
        // id: 8,
        updated_user: 'System',
        created_user: 'System',
        entity_id: movie1.id,
        entity_title: movie1.title,
        entity_type: 'MOVIE',
        job_id: '5f936eab-ed44-455d-ab22-fea3f50195ed',
        publish_id: `movie-${movie1.id}`,
        published_date: null,
        scheduled_date: null,
        snapshot_json: null,
        snapshot_no: 2,
        snapshot_state: 'INITIALIZATION',
        unpublished_date: null,
        validation_status: null,
      });
      expect(ref).toEqual([
        { movie_id: movie1.id, snapshot_id: snapshot1.id },
        { movie_id: movie1.id, snapshot_id: snapshot.id },
      ]);
    });
  });

  describe('getPublishedSnapshot', () => {
    it('call while published snapshots exist -> non-empty result', async () => {
      // Arrange
      await insert('movies_snapshots', {
        movie_id: movie1.id,
        snapshot_id: snapshot1.id,
      }).run(ctx.ownerPool);

      const [{ created_date, updated_date, ...updated }] = await update(
        'snapshots',
        { snapshot_state: 'PUBLISHED' },
        { id: snapshot1.id },
      ).run(ctx.ownerPool);

      // Act
      const snapshot = await ctx.executeGqlSql(user, async (ct) => {
        return getPublishedSnapshot('movies', movie1.id, ct);
      });

      // Assert
      expect(snapshot).toMatchObject(updated);
    });

    it('call while published orphaned snapshots exist -> undefined result', async () => {
      // Arrange
      await update(
        'snapshots',
        { snapshot_state: 'PUBLISHED' },
        { id: snapshot1.id },
      ).run(ctx.ownerPool);

      // Act
      const snapshot = await ctx.executeGqlSql(user, async (ct) => {
        return getPublishedSnapshot('movies', movie1.id, ct);
      });

      // Assert
      expect(snapshot).toBeUndefined();
    });

    it('call while unpublished snapshots exist -> undefined result', async () => {
      await insert('movies_snapshots', {
        movie_id: movie1.id,
        snapshot_id: snapshot1.id,
      }).run(ctx.ownerPool);

      // Act
      const snapshot = await ctx.executeGqlSql(user, async (ct) => {
        return getPublishedSnapshot('movies', movie1.id, ct);
      });

      // Assert
      expect(snapshot).toBeUndefined();
    });
  });

  describe('createListSnapshot', () => {
    it('call with no existing snapshots -> snapshot returned', async () => {
      // Act
      const snapshot = await ctx.executeGqlSql(user, async (ct) => {
        return createListSnapshot(
          listSnapshotInfo,
          '5f936eab-ed44-455d-ab22-fea3f50195ed',
          ct,
        );
      });

      // Assert
      expect(snapshot).toMatchObject({
        // Auto-generated
        // updated_date: '2021-05-26T09:36:26.209Z',
        // created_date: '2021-05-26T09:36:26.209Z',
        // id: 8,
        updated_user: 'System',
        created_user: 'System',
        entity_id: listSnapshotInfo.id,
        entity_title: listSnapshotInfo.title,
        entity_type: listSnapshotInfo.type,
        job_id: '5f936eab-ed44-455d-ab22-fea3f50195ed',
        publish_id: `movie_genre-${listSnapshotInfo.id}`,
        published_date: null,
        scheduled_date: null,
        snapshot_json: null,
        snapshot_no: 1,
        snapshot_state: 'INITIALIZATION',
        unpublished_date: null,
        validation_status: null,
      });
    });

    it('3 insert calls -> last snapshot returned with incremented snapshot_no', async () => {
      // Act
      const snapshot = await ctx.executeGqlSql(user, async (ct) => {
        await createListSnapshot(
          listSnapshotInfo,
          '5f936eab-ed44-455d-ab22-fea3f50195ed',
          ct,
        );
        await createListSnapshot(
          listSnapshotInfo,
          '5f936eab-ed44-455d-ab22-fea3f50195ed',
          ct,
        );
        return createListSnapshot(
          listSnapshotInfo,
          '5f936eab-ed44-455d-ab22-fea3f50195ed',
          ct,
        );
      });

      // Assert
      expect(snapshot).toMatchObject({
        // Auto-generated
        // updated_date: '2021-05-26T09:36:26.209Z',
        // created_date: '2021-05-26T09:36:26.209Z',
        // id: 8,
        updated_user: 'System',
        created_user: 'System',
        entity_id: listSnapshotInfo.id,
        entity_title: listSnapshotInfo.title,
        entity_type: listSnapshotInfo.type,
        job_id: '5f936eab-ed44-455d-ab22-fea3f50195ed',
        publish_id: `movie_genre-${listSnapshotInfo.id}`,
        published_date: null,
        scheduled_date: null,
        snapshot_json: null,
        snapshot_no: 3,
        snapshot_state: 'INITIALIZATION',
        unpublished_date: null,
        validation_status: null,
      });
    });
  });
});
