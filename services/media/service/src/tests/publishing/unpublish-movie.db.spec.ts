import { toBeUuid } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  UnpublishEntityCommand,
} from 'media-messages';
import { OutboxMessage } from 'pg-transactional-outbox';
import { insert, select, update } from 'zapatos/db';
import { snapshots } from 'zapatos/schema';
import * as tokenHelpers from '../../common/utils/token-utils';
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
import { UNPUBLISH_MOVIE } from './gql-constants';

describe('Movie Unpublish endpoint', () => {
  let ctx: ITestContext;
  let movieId1: number;
  let snapshot1: snapshots.JSONSelectable;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    payload: UnpublishEntityCommand;
  }[] = [];

  beforeAll(async () => {
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload) => {
        messages.push({
          payload: payload as UnpublishEntityCommand,
          messageType,
        });
        return Promise.resolve(stub<OutboxMessage>());
      },
    );
    ctx = await createTestContext({}, storeOutboxMessage);
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
    jest
      .spyOn(tokenHelpers, 'getLongLivedToken')
      .mockImplementation(async () => 'test-long-lived-token');
  });

  beforeEach(async () => {
    movieId1 = (
      await insert('movies', { title: 'Valid Movie1' }).run(ctx.ownerPool)
    ).id;
    snapshot1 = await createSnapshotWithRelation(
      'MOVIE',
      movieId1,
      generateSnapshotJobId(),
      ctx.ownerPool,
    );
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('snapshots');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('unpublishMovies', () => {
    it('unpublish existing movie with published snapshot -> correct response received and message sent', async () => {
      // Arrange
      await update(
        'snapshots',
        { snapshot_state: 'PUBLISHED' },
        { id: snapshot1.id },
      ).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(
        UNPUBLISH_MOVIE,
        { movieId: movieId1 },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();
      const snapshot = resp.data?.unpublishMovie;

      expect(snapshot).toMatchObject({
        createdUser: 'Unknown',
        updatedUser: 'Unknown',
        entityId: movieId1,
        entityTitle: 'Valid Movie1',
        entityType: 'MOVIE',
        publishId: `movie-${movieId1}`,
        unpublishedDate: null,
        scheduledDate: null,
        snapshotJson: null,
        snapshotNo: 1,
        snapshotState: 'PUBLISHED',
        publishedDate: null,
        validationStatus: null,
      });
      toBeUuid(snapshot.jobId);
      expect(snapshot.id).toBeGreaterThan(0);

      expect(messages).toEqual([
        {
          payload: {
            entity_id: movieId1,
            table_name: 'movies',
          },
          messageType:
            MediaServiceMessagingSettings.UnpublishEntity.messageType,
        },
      ]);

      const snapshots = await select('snapshots', { entity_id: movieId1 }).run(
        ctx.ownerPool,
      );
      expect(snapshots).toEqual([
        {
          created_date: snapshot.createdDate,
          created_user: snapshot.createdUser,
          entity_id: snapshot.entityId,
          entity_title: snapshot.entityTitle,
          entity_type: snapshot.entityType,
          id: snapshot.id,
          job_id: snapshot.jobId,
          publish_id: snapshot.publishId,
          published_date: snapshot.publishedDate,
          scheduled_date: snapshot.scheduledDate,
          snapshot_json: snapshot.snapshotJson,
          snapshot_no: snapshot.snapshotNo,
          snapshot_state: snapshot.snapshotState,
          unpublished_date: snapshot.unpublishedDate,
          updated_date: snapshot.updatedDate,
          updated_user: snapshot.updatedUser,
          validation_status: snapshot.validationStatus,
          is_list_snapshot: snapshot.isListSnapshot,
        },
      ]);

      const relations = await select('movies_snapshots', {
        movie_id: movieId1,
      }).run(ctx.ownerPool);
      expect(relations).toEqual([
        { movie_id: movieId1, snapshot_id: snapshot.id },
      ]);
    });

    it('unpublish existing movie with not published snapshot -> error is thrown', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        UNPUBLISH_MOVIE,
        { movieId: movieId1 },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.unpublishMovie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: 'UNPUBLISH_ERROR',
          details: undefined,
          message: `Movie with ID '${movieId1}' does not have a published snapshot.`,
          path: ['unpublishMovie'],
        },
      ]);

      expect(messages).toEqual([]);

      const snapshots = await select('snapshots', { entity_id: movieId1 }).run(
        ctx.ownerPool,
      );
      expect(snapshots).toEqual([snapshot1]);

      const relations = await select('movies_snapshots', {
        movie_id: movieId1,
      }).run(ctx.ownerPool);
      expect(relations).toEqual([
        { movie_id: movieId1, snapshot_id: snapshot1.id },
      ]);
    });

    it('unpublish existing movie with published orphaned snapshot -> error is thrown', async () => {
      // Arrange
      await ctx.truncate('snapshots');

      snapshot1 = await insert('snapshots', {
        entity_id: movieId1,
        publish_id: `movie-${movieId1}`,
        job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
        snapshot_no: 1,
        entity_type: 'MOVIE',
        snapshot_state: 'PUBLISHED',
      }).run(ctx.ownerPool);

      // Act
      const resp = await ctx.runGqlQuery(
        UNPUBLISH_MOVIE,
        { movieId: movieId1 },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.unpublishMovie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: 'UNPUBLISH_ERROR',
          details: undefined,
          message: `Movie with ID '${movieId1}' does not have a published snapshot.`,
          path: ['unpublishMovie'],
        },
      ]);

      expect(messages).toEqual([]);

      const snapshots = await select('snapshots', { entity_id: movieId1 }).run(
        ctx.ownerPool,
      );
      expect(snapshots).toEqual([snapshot1]);

      const relations = await select('movies_snapshots', {
        movie_id: movieId1,
      }).run(ctx.ownerPool);
      expect(relations).toEqual([]);
    });

    it('unpublish existing movie without snapshot -> error is thrown', async () => {
      // Arrange
      await ctx.truncate('snapshots');

      // Act
      const resp = await ctx.runGqlQuery(
        UNPUBLISH_MOVIE,
        { movieId: movieId1 },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.unpublishMovie).toBeFalsy();
      expect(resp.errors).toMatchObject([
        {
          code: 'UNPUBLISH_ERROR',
          details: undefined,
          message: `Movie with ID '${movieId1}' does not have a published snapshot.`,
          path: ['unpublishMovie'],
        },
      ]);

      expect(messages).toEqual([]);

      const snapshots = await select('snapshots', { entity_id: movieId1 }).run(
        ctx.ownerPool,
      );
      expect(snapshots).toEqual([]);

      const relations = await select('movies_snapshots', {
        movie_id: movieId1,
      }).run(ctx.ownerPool);
      expect(relations).toEqual([]);
    });

    it('unpublish non-existing movie -> error is thrown', async () => {
      // Arrange
      const invalidId = movieId1 + 10;

      // Act
      const resp = await ctx.runGqlQuery(
        UNPUBLISH_MOVIE,
        { movieId: invalidId },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.unpublishMovie).toBeFalsy();
      expect(resp.errors).toHaveLength(1);
      expect(resp.errors?.[0]).toMatchObject({
        code: 'UNPUBLISH_ERROR',
        details: undefined,
        message: `Movie with ID '${invalidId}' does not have a published snapshot.`,
        path: ['unpublishMovie'],
      });

      expect(messages).toEqual([]);
    });
  });
});
