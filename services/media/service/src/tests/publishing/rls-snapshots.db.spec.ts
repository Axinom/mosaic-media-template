import {
  buildPgSettings,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { EntityTypeEnum } from 'zapatos/custom';
import {
  all,
  deletes,
  insert,
  IsolationLevel,
  select,
  TxnClient,
  update,
} from 'zapatos/db';
import { snapshots } from 'zapatos/schema';
import { createTestContext, createTestUser, ITestContext } from '../test-utils';

describe('snapshots RLS', () => {
  let ctx: ITestContext;
  let readUser: AuthenticatedManagementSubject;
  let writeUser: AuthenticatedManagementSubject;
  let movieSnapshot: snapshots.JSONSelectable;
  let genreSnapshot: snapshots.JSONSelectable;
  let episodeSnapshot: snapshots.JSONSelectable;

  const createSnapshot = async (
    type: EntityTypeEnum,
  ): Promise<snapshots.JSONSelectable> => {
    return insert('snapshots', {
      entity_id: 1,
      publish_id: `${type} snapshot-1`,
      job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
      snapshot_no: 1,
      entity_type: type,
      snapshot_state: 'UNPUBLISHED', // To avoid pre-delete trigger error
    }).run(ctx.ownerPool);
  };

  const createValidationResult = async (
    snapshot: snapshots.JSONSelectable,
  ): Promise<void> => {
    await insert('snapshot_validation_results', {
      snapshot_id: snapshot.id,
      entity_type: snapshot.entity_type,
      message: 'test message',
      context: 'METADATA',
      severity: 'ERROR',
    }).run(ctx.ownerPool);
  };
  const executeOwnerSql = async <T>(
    callback: (client: TxnClient<IsolationLevel>) => Promise<T>,
  ): Promise<T> => {
    const pgSettings = buildPgSettings(
      readUser,
      ctx.config.dbOwner,
      ctx.config.serviceId,
    );
    return transactionWithContext(
      ctx.ownerPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (dbContext) => callback(dbContext),
    );
  };
  beforeAll(async () => {
    ctx = await createTestContext();
    readUser = createTestUser(ctx.config.serviceId, {
      permissions: {
        [ctx.config.serviceId]: ['MOVIES_VIEW'],
      },
    });
    writeUser = createTestUser(ctx.config.serviceId, {
      permissions: {
        [ctx.config.serviceId]: ['MOVIES_EDIT'],
      },
    });
  });

  beforeEach(async () => {
    movieSnapshot = await createSnapshot('MOVIE');
    genreSnapshot = await createSnapshot('TVSHOW_GENRE');
    episodeSnapshot = await createSnapshot('EPISODE');
    await createValidationResult(movieSnapshot);
    await createValidationResult(genreSnapshot);
    await createValidationResult(episodeSnapshot);
  });

  afterEach(async () => {
    await ctx.truncate('snapshots');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('Owner pool and read user', () => {
    it('select all from snapshots using owner role and MOVIE permissions without ADMIN -> get all snapshots, RLS bypassed', async () => {
      await executeOwnerSql(async (tc) => {
        // Act
        const snapshots = await select('snapshots', all).run(tc);

        // Assert
        expect(snapshots.map((x) => x.id)).toIncludeSameMembers([
          movieSnapshot.id,
          genreSnapshot.id,
          episodeSnapshot.id,
        ]);
      });
    });

    it('create a season snapshot using owner role and MOVIE permissions without ADMIN -> snapshot created, RLS bypassed', async () => {
      await executeOwnerSql(async (tc) => {
        // Act
        const snapshot = await insert('snapshots', {
          entity_id: 2,
          publish_id: 'season-2',
          job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
          snapshot_no: 1,
          entity_type: 'SEASON',
        }).run(tc);

        // Assert
        expect(snapshot).toBeTruthy();
      });
    });

    it('update an episode snapshot using owner role and MOVIE permissions without ADMIN -> snapshot updated, RLS bypassed', async () => {
      await executeOwnerSql(async (tc) => {
        // Act
        const snapshots = await update(
          'snapshots',
          { entity_title: 'test123' },
          { id: episodeSnapshot.id },
        ).run(tc);

        // Assert
        expect(snapshots).toHaveLength(1);
      });
    });

    it('delete a genre snapshot using owner role and MOVIE permissions without ADMIN -> snapshot deleted, RLS bypassed', async () => {
      await executeOwnerSql(async (tc) => {
        // Act
        const snapshots = await deletes('snapshots', {
          id: genreSnapshot.id,
        }).run(tc);

        // Assert
        expect(snapshots).toHaveLength(1);
      });
    });
  });

  describe('Login pool with gql role and write user', () => {
    it('select all from snapshots using gql role and MOVIE WRITE permissions without ADMIN -> get MOVIE snapshot, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const snapshots = await select('snapshots', all).run(tc);

        // Assert
        expect(snapshots.map((x) => x.id)).toIncludeSameMembers([
          movieSnapshot.id,
        ]);
      });
    });

    it('select all from snapshots using gql role and MOVIE WRITE and TVSHOW WRITE permissions without ADMIN -> get MOVIE and EPISODE snapshots, RLS used', async () => {
      const multiWriteUser = createTestUser(ctx.config.serviceId, {
        permissions: {
          [ctx.config.serviceId]: ['MOVIES_EDIT', 'TVSHOWS_EDIT'],
        },
      });
      await ctx.executeGqlSql(multiWriteUser, async (tc) => {
        // Act
        const snapshots = await select('snapshots', all).run(tc);

        // Assert
        expect(snapshots.map((x) => x.id)).toIncludeSameMembers([
          movieSnapshot.id,
          episodeSnapshot.id,
        ]);
      });
    });

    it('create a season snapshot using gql role and MOVIE WRITE permissions without ADMIN -> error thrown, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          insert('snapshots', {
            entity_id: 2,
            publish_id: 'season-2',
            job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
            snapshot_no: 1,
            entity_type: 'SEASON',
          }).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: TVSHOWS_EDIT,ADMIN',
        );
      });
    });

    it('create a season snapshot using gql role and TVSHOW WRITE permissions without ADMIN -> snapshot created, RLS used', async () => {
      const seasonWriteUser = createTestUser(ctx.config.serviceId, {
        permissions: {
          [ctx.config.serviceId]: ['TVSHOWS_EDIT'],
        },
      });
      await ctx.executeGqlSql(seasonWriteUser, async (tc) => {
        // Act
        const snapshot = await insert('snapshots', {
          entity_id: 2,
          publish_id: 'season-2',
          job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
          snapshot_no: 1,
          entity_type: 'SEASON',
        }).run(tc);

        // Assert
        expect(snapshot).toBeTruthy();
        expect(snapshot.entity_type).toBe('SEASON');
      });
    });

    it('create a movie snapshot using gql role and MOVIE WRITE permissions without ADMIN -> snapshot created, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const snapshot = await insert('snapshots', {
          entity_id: 2,
          publish_id: 'movie-2',
          job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
          snapshot_no: 1,
          entity_type: 'MOVIE',
        }).run(tc);

        // Assert
        expect(snapshot).toBeTruthy();
        expect(snapshot.entity_type).toBe('MOVIE');
      });
    });

    it('update an episode snapshot using gql role and MOVIE WRITE permissions without ADMIN -> error thrown, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          update(
            'snapshots',
            { entity_title: 'test123' },
            { id: episodeSnapshot.id },
          ).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: TVSHOWS_EDIT,ADMIN',
        );
      });
    });

    it('update a movie snapshot using gql role and MOVIE WRITE permissions without ADMIN -> snapshot updated, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const snapshots = await update(
          'snapshots',
          { entity_title: 'test123' },
          { id: movieSnapshot.id },
        ).run(tc);

        // Assert
        expect(snapshots).toHaveLength(1);
        expect(snapshots[0].entity_type).toBe('MOVIE');
      });
    });

    it('delete a genre snapshot using gql role and MOVIE WRITE permissions without ADMIN -> error thrown, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          deletes('snapshots', {
            id: genreSnapshot.id,
          }).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: SETTINGS_EDIT,ADMIN',
        );
      });
    });

    it('delete a movie snapshot using gql role and MOVIE WRITE permissions without ADMIN -> snapshot deleted, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const snapshots = await deletes('snapshots', {
          id: movieSnapshot.id,
        }).run(tc);

        // Assert
        expect(snapshots).toHaveLength(1);
        expect(snapshots[0].entity_type).toBe('MOVIE');
      });
    });
  });

  describe('Login pool with gql role and read user', () => {
    it('select all from snapshots using gql role and MOVIE READ permissions without ADMIN -> get MOVIE snapshot, RLS used', async () => {
      await ctx.executeGqlSql(readUser, async (tc) => {
        // Act
        const snapshots = await select('snapshots', all).run(tc);

        // Assert
        expect(snapshots.map((x) => x.id)).toIncludeSameMembers([
          movieSnapshot.id,
        ]);
      });
    });

    it('create a season snapshot using gql role and MOVIE READ permissions without ADMIN -> error thrown, RLS used', async () => {
      await ctx.executeGqlSql(readUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          insert('snapshots', {
            entity_id: 2,
            publish_id: 'season-2',
            job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
            snapshot_no: 1,
            entity_type: 'SEASON',
          }).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: TVSHOWS_EDIT,ADMIN',
        );
      });
    });

    it('create a movie snapshot using gql role and MOVIE READ permissions without ADMIN -> error thrown, RLS used', async () => {
      await ctx.executeGqlSql(readUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          insert('snapshots', {
            entity_id: 2,
            publish_id: 'movie-2',
            job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
            snapshot_no: 1,
            entity_type: 'MOVIE',
          }).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: MOVIES_EDIT,ADMIN',
        );
      });
    });

    it('update an episode snapshot using gql role and MOVIE READ permissions without ADMIN -> error thrown, RLS used', async () => {
      await ctx.executeGqlSql(readUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          update(
            'snapshots',
            { entity_title: 'test123' },
            { id: episodeSnapshot.id },
          ).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: TVSHOWS_EDIT,ADMIN',
        );
      });
    });

    it('update a movie snapshot using gql role and MOVIE READ permissions without ADMIN -> error thrown, RLS used', async () => {
      await ctx.executeGqlSql(readUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          update(
            'snapshots',
            { entity_title: 'test123' },
            { id: movieSnapshot.id },
          ).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: MOVIES_EDIT,ADMIN',
        );
      });
    });

    it('delete a genre snapshot using gql role and MOVIE READ permissions without ADMIN -> error thrown, RLS used', async () => {
      await ctx.executeGqlSql(readUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          deletes('snapshots', {
            id: genreSnapshot.id,
          }).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: SETTINGS_EDIT,ADMIN',
        );
      });
    });

    it('delete a movie snapshot using gql role and MOVIE READ permissions without ADMIN -> error thrown, RLS used', async () => {
      // Arrange
      await ctx.executeGqlSql(readUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          deletes('snapshots', {
            id: movieSnapshot.id,
          }).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: MOVIES_EDIT,ADMIN',
        );
      });
    });
  });

  describe('Login pool with gql role and write user, snapshots validation results', () => {
    it('select all from results using gql role and MOVIE WRITE permissions without ADMIN -> get MOVIE result, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const results = await select('snapshot_validation_results', all).run(
          tc,
        );

        // Assert
        expect(results.map((x) => x.snapshot_id)).toIncludeSameMembers([
          movieSnapshot.id,
        ]);
      });
    });

    it('select all from results using gql role and MOVIE WRITE and SETTINGS WRITE permissions without ADMIN -> get MOVIE and GENRE results, RLS used', async () => {
      const multiWriteUser = createTestUser(ctx.config.serviceId, {
        permissions: {
          [ctx.config.serviceId]: ['MOVIES_EDIT', 'SETTINGS_EDIT'],
        },
      });
      await ctx.executeGqlSql(multiWriteUser, async (tc) => {
        // Act
        const results = await select('snapshot_validation_results', all).run(
          tc,
        );

        // Assert
        expect(results.map((x) => x.snapshot_id)).toIncludeSameMembers([
          movieSnapshot.id,
          genreSnapshot.id,
        ]);
      });
    });

    it('create a result for episode snapshot using gql role and MOVIE WRITE permissions without ADMIN -> error thrown, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          insert('snapshot_validation_results', {
            snapshot_id: episodeSnapshot.id,
            entity_type: episodeSnapshot.entity_type,
            message: 'test message',
            context: 'METADATA',
            severity: 'ERROR',
          }).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: TVSHOWS_EDIT,ADMIN',
        );
      });
    });

    it('create a result for movie snapshot using gql role and MOVIE WRITE permissions without ADMIN -> result created, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const result = await insert('snapshot_validation_results', {
          snapshot_id: movieSnapshot.id,
          entity_type: movieSnapshot.entity_type,
          message: 'test message',
          context: 'METADATA',
          severity: 'ERROR',
        }).run(tc);

        // Assert
        expect(result).toBeTruthy();
        expect(result.entity_type).toBe('MOVIE');
      });
    });

    it('delete a genre result using gql role and MOVIE WRITE permissions without ADMIN -> error thrown, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const error = await rejectionOf(
          deletes('snapshot_validation_results', {
            snapshot_id: genreSnapshot.id,
          }).run(tc),
        );

        // Assert
        expect(error.message).toBe(
          'At least one of these permissions must be granted: SETTINGS_EDIT,ADMIN',
        );
      });
    });

    it('delete a movie result using gql role and MOVIE WRITE permissions without ADMIN -> result deleted, RLS used', async () => {
      await ctx.executeGqlSql(writeUser, async (tc) => {
        // Act
        const results = await deletes('snapshot_validation_results', {
          snapshot_id: movieSnapshot.id,
        }).run(tc);

        // Assert
        expect(results).toHaveLength(1);
        expect(results[0].entity_type).toBe('MOVIE');
      });
    });
  });
});
