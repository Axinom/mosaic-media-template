import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import {
  createOffsetDate,
  dateToBeInRange,
  rejectionOf,
} from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { PublishEntityCommand } from 'media-messages';
import { all, insert, select, update } from 'zapatos/db';
import { movies } from 'zapatos/schema';
import { mockPublishingProcessor } from '../../tests/ingest/mock-publish-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { createSnapshotWithRelation } from '../utils';
import { PublishEntityHandler } from './publish-entity-handler';

describe('PublishEntityCommandHandler', () => {
  let ctx: ITestContext;
  let storeOutboxMessage: StoreOutboxMessage;
  let user: AuthenticatedManagementSubject;
  let handler: PublishEntityHandler;
  let messages: unknown[] = [];
  let movie1: movies.JSONSelectable;
  let timestampBeforeTest: Date;

  const createMessage = (payload: PublishEntityCommand) =>
    stub<TypedTransactionalMessage<PublishEntityCommand>>({
      payload,
      metadata: {
        authToken:
          'some token value which is not used because we are substituting getPgSettings method and using a stub user',
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    storeOutboxMessage = jest.fn(
      async (_aggregateId, { messageType }, payload, _client, optionalData) => {
        const { envelopeOverrides, options } = optionalData || {};
        messages.push({
          messageType,
          payload,
          envelopeOverrides,
          options,
        });
      },
    );
    user = createTestUser(ctx.config.serviceId);

    handler = new PublishEntityHandler(
      [mockPublishingProcessor],
      storeOutboxMessage,
      ctx.config,
    );
  });

  beforeEach(async () => {
    timestampBeforeTest = createOffsetDate(-20);
    movie1 = await insert('movies', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('snapshots');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    it('message to publish a movie -> snapshot with relation created with correct metadata and publish message sent', async () => {
      // Act
      await ctx.executeOwnerSql(user, async (txn) => {
        await handler.handleMessage(
          createMessage({
            table_name: mockPublishingProcessor.type,
            job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
            entity_id: movie1.id,
            publish_options: { action: 'PUBLISH_NOW' },
          }),
          txn,
        );
      });

      // Assert
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      const snapshotValidation = await select(
        'snapshot_validation_results',
        all,
      ).run(ctx.ownerPool);
      expect(snapshots).toMatchObject([
        {
          entity_id: movie1.id,
          entity_title: movie1.title,
          entity_type: 'MOVIE',
          job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
          publish_id: `movie-${movie1.id}`,
          snapshot_json: {
            content_id: 'test',
          },
          snapshot_no: 1,
          snapshot_state: 'PUBLISHED',
          validation_status: 'WARNINGS',
        },
      ]);
      dateToBeInRange(
        snapshots[0].published_date as string,
        timestampBeforeTest,
      );
      expect(movieSnapshots).toEqual([
        { snapshot_id: snapshots[0].id, movie_id: movie1.id },
      ]);
      expect(snapshotValidation).toMatchObject([
        {
          context: 'METADATA',
          message: 'mock message',
          severity: 'WARNING',
          snapshot_id: snapshots[0].id,
          entity_type: snapshots[0].entity_type,
        },
      ]);
      expect(messages).toIncludeSameMembers([
        {
          envelopeOverrides: {
            auth_token:
              'some token value which is not used because we are substituting getPgSettings method and using a stub user',
          },
          payload: { content_id: 'test' },
          messageType: 'mock-publish',
          options: undefined,
        },
      ]);
    });

    it('message to publish a snapshot with INITIALIZATION state -> existing snapshot is updated with correct metadata and publish message sent', async () => {
      // Arrange
      const snapshot = await createSnapshotWithRelation(
        'MOVIE',
        movie1.id,
        '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
        ctx.ownerPool,
      );

      // Act
      await ctx.executeOwnerSql(user, async (txn) => {
        await handler.handleMessage(
          createMessage({
            table_name: 'snapshots',
            job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
            entity_id: snapshot.id,
            publish_options: { action: 'PUBLISH_NOW' },
          }),
          txn,
        );
      });

      // Assert
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      const snapshotValidation = await select(
        'snapshot_validation_results',
        all,
      ).run(ctx.ownerPool);
      expect(snapshots).toMatchObject([
        {
          entity_id: movie1.id,
          entity_title: movie1.title,
          entity_type: 'MOVIE',
          job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
          publish_id: `movie-${movie1.id}`,
          snapshot_json: { content_id: 'test' },
          snapshot_no: 1,
          snapshot_state: 'PUBLISHED',
          validation_status: 'WARNINGS',
        },
      ]);
      dateToBeInRange(
        snapshots[0].published_date as string,
        timestampBeforeTest,
      );
      expect(movieSnapshots).toEqual([
        { snapshot_id: snapshots[0].id, movie_id: movie1.id },
      ]);
      expect(snapshotValidation).toMatchObject([
        {
          context: 'METADATA',
          message: 'mock message',
          severity: 'WARNING',
          entity_type: snapshots[0].entity_type,
        },
      ]);
      expect(messages).toIncludeSameMembers([
        {
          envelopeOverrides: {
            auth_token:
              'some token value which is not used because we are substituting getPgSettings method and using a stub user',
          },
          payload: { content_id: 'test' },
          messageType: 'mock-publish',
          options: undefined,
        },
      ]);
    });

    it('message to publish a snapshot -> existing snapshot is updated with correct metadata and publish message sent', async () => {
      // Arrange
      const snapshot = await createSnapshotWithRelation(
        'MOVIE',
        movie1.id,
        '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
        ctx.ownerPool,
      );

      await update(
        'snapshots',
        { snapshot_json: { test: 'test123' }, snapshot_state: 'UNPUBLISHED' },
        { id: snapshot.id },
      ).run(ctx.ownerPool);

      // Act
      await ctx.executeOwnerSql(user, async (txn) => {
        await handler.handleMessage(
          createMessage({
            table_name: 'snapshots',
            job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
            entity_id: snapshot.id,
            publish_options: { action: 'PUBLISH_NOW' },
          }),
          txn,
        );
      });

      // Assert
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      const snapshotValidation = await select(
        'snapshot_validation_results',
        all,
      ).run(ctx.ownerPool);
      expect(snapshots).toMatchObject([
        {
          entity_id: movie1.id,
          entity_title: movie1.title,
          entity_type: 'MOVIE',
          job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
          publish_id: `movie-${movie1.id}`,
          snapshot_json: { test: 'test123' },
          snapshot_no: 1,
          snapshot_state: 'PUBLISHED',
          validation_status: null,
        },
      ]);
      dateToBeInRange(
        snapshots[0].published_date as string,
        timestampBeforeTest,
      );
      expect(movieSnapshots).toEqual([
        { snapshot_id: snapshots[0].id, movie_id: movie1.id },
      ]);
      expect(snapshotValidation).toEqual([]);
      expect(messages).toIncludeSameMembers([
        {
          envelopeOverrides: {
            auth_token:
              'some token value which is not used because we are substituting getPgSettings method and using a stub user',
          },
          payload: { test: 'test123' },
          messageType: 'mock-publish',
          options: undefined,
        },
      ]);
    });

    it('message to publish a non-existing movie -> error is thrown', async () => {
      // Arrange
      const invalidId = movie1.id + 10;

      // Act
      const error = await rejectionOf(
        ctx.executeOwnerSql(user, async (txn) => {
          await handler.handleMessage(
            createMessage({
              table_name: mockPublishingProcessor.type,
              job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
              entity_id: invalidId,
              publish_options: { action: 'PUBLISH_NOW' },
            }),
            txn,
          );
        }),
      );

      // Assert
      expect(error.message).toEqual(
        `MOVIE with ID '${invalidId}' was not found.`,
      );

      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      const snapshotValidation = await select(
        'snapshot_validation_results',
        all,
      ).run(ctx.ownerPool);
      expect(snapshots).toEqual([]);
      expect(movieSnapshots).toEqual([]);
      expect(snapshotValidation).toEqual([]);
      expect(messages).toIncludeSameMembers([]);
    });

    it('message to publish a movie without matching processor -> snapshot with ERROR state created', async () => {
      // Arrange
      handler = new PublishEntityHandler([], storeOutboxMessage, ctx.config);

      // Act
      await ctx.executeOwnerSql(user, async (txn) => {
        await handler.handleMessage(
          createMessage({
            table_name: 'movies',
            job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
            entity_id: movie1.id,
            publish_options: { action: 'PUBLISH_NOW' },
          }),
          txn,
        );
      });

      // Assert
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      const snapshotValidation = await select(
        'snapshot_validation_results',
        all,
      ).run(ctx.ownerPool);
      expect(snapshots).toMatchObject([
        {
          entity_id: movie1.id,
          entity_title: movie1.title,
          entity_type: 'MOVIE',
          job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
          publish_id: `movie-${movie1.id}`,
          snapshot_json: null,
          snapshot_no: 1,
          snapshot_state: 'ERROR',
          validation_status: null,
          published_date: null,
        },
      ]);
      expect(movieSnapshots).toEqual([
        { snapshot_id: snapshots[0].id, movie_id: movie1.id },
      ]);
      expect(snapshotValidation).toEqual([]);
      expect(messages).toEqual([]);
    });
  });

  describe('handleErrorMessage', () => {
    it('message to publish a movie failed after 10 tries -> snapshot with ERROR state created', async () => {
      // Act
      await ctx.executeOwnerSql(user, async (txn) => {
        await handler.handleMessage(
          createMessage({
            table_name: 'movies',
            job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
            entity_id: movie1.id,
            publish_options: { action: 'PUBLISH_NOW' },
          }),
          txn,
        );
      });

      // Assert
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      const snapshotValidation = await select(
        'snapshot_validation_results',
        all,
      ).run(ctx.ownerPool);
      expect(snapshots).toMatchObject([
        {
          entity_id: movie1.id,
          entity_title: movie1.title,
          entity_type: 'MOVIE',
          job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
          publish_id: `movie-${movie1.id}`,
          snapshot_json: null,
          snapshot_no: 1,
          snapshot_state: 'ERROR',
          validation_status: null,
          published_date: null,
        },
      ]);
      expect(movieSnapshots).toEqual([
        { snapshot_id: snapshots[0].id, movie_id: movie1.id },
      ]);
      expect(snapshotValidation).toEqual([]);
      expect(messages).toEqual([]);
    });

    it('message to publish a snapshot failed after 10 tries -> snapshot updated with ERROR state', async () => {
      // Arrange
      const {
        updated_date,
        updated_user,
        snapshot_state: originalState,
        ...snapshot
      } = await createSnapshotWithRelation(
        'MOVIE',
        movie1.id,
        '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
        ctx.ownerPool,
      );

      // Act
      await ctx.executeOwnerSql(user, async (txn) => {
        await handler.handleMessage(
          createMessage({
            table_name: 'snapshots',
            entity_id: snapshot.id,
            publish_options: { action: 'PUBLISH_NOW' },
          }),
          txn,
        );
      });

      // Assert
      const [{ snapshot_state: updatedState, ...updatedSnapshot }] =
        await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      const snapshotValidation = await select(
        'snapshot_validation_results',
        all,
      ).run(ctx.ownerPool);
      expect(updatedSnapshot).toMatchObject(snapshot);
      expect(updatedState).not.toEqual(originalState);
      expect(updatedState).toEqual('ERROR');
      expect(movieSnapshots).toEqual([
        { snapshot_id: snapshot.id, movie_id: movie1.id },
      ]);
      expect(snapshotValidation).toEqual([]);
      expect(messages).toEqual([]);
    });
  });
});
