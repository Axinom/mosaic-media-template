import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import {
  createOffsetDate,
  dateToBeInRange,
} from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { UnpublishEntityCommand } from 'media-messages';
import { all, insert, select, update } from 'zapatos/db';
import { movies, snapshots } from 'zapatos/schema';
import { mockPublishingProcessor } from '../../tests/ingest/mock-publish-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { createSnapshotWithRelation } from '../utils';
import { UnpublishEntityHandler } from './unpublish-entity-handler';

describe('UnpublishEntityHandler', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handler: UnpublishEntityHandler;
  let messages: unknown[] = [];
  let movie1: movies.JSONSelectable;
  let snapshot1: snapshots.JSONSelectable;
  let timestampBeforeTest: Date;

  const createMessage = (payload: UnpublishEntityCommand) =>
    stub<TypedTransactionalMessage<UnpublishEntityCommand>>({
      payload,
      metadata: {
        authToken:
          'some token value which is not used because we are substituting getPgSettings method and using a stub user',
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
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
    handler = new UnpublishEntityHandler(
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
    snapshot1 = await createSnapshotWithRelation(
      'MOVIE',
      movie1.id,
      '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
      ctx.ownerPool,
    );
    await update(
      'snapshots',
      { snapshot_state: 'PUBLISHED' },
      { id: snapshot1.id },
    ).run(ctx.ownerPool);
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
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(
          createMessage({
            table_name: mockPublishingProcessor.type,
            entity_id: movie1.id,
          }),
          dbCtx,
        ),
      );

      // Assert
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      expect(snapshots).toMatchObject([
        {
          entity_id: movie1.id,
          entity_title: movie1.title,
          entity_type: 'MOVIE',
          job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
          publish_id: `movie-${movie1.id}`,
          snapshot_json: null,
          snapshot_no: 1,
          snapshot_state: 'UNPUBLISHED',
          validation_status: null,
        },
      ]);
      dateToBeInRange(
        snapshots[0].unpublished_date as string,
        timestampBeforeTest,
      );
      expect(movieSnapshots).toEqual([
        { snapshot_id: snapshots[0].id, movie_id: movie1.id },
      ]);
      expect(messages).toIncludeSameMembers([
        {
          envelopeOverrides: {
            auth_token:
              'some token value which is not used because we are substituting getPgSettings method and using a stub user',
          },
          payload: { content_id: `movie-${movie1.id}` },
          messageType: 'mock-unpublish',
          options: undefined,
        },
      ]);
    });

    it('message to publish a snapshot -> existing snapshot is updated with correct metadata and publish message sent', async () => {
      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(
          createMessage({
            table_name: 'snapshots',
            entity_id: snapshot1.id,
          }),
          dbCtx,
        ),
      );

      // Assert
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      expect(snapshots).toMatchObject([
        {
          entity_id: movie1.id,
          entity_title: movie1.title,
          entity_type: 'MOVIE',
          job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
          publish_id: `movie-${movie1.id}`,
          snapshot_json: null,
          snapshot_no: 1,
          snapshot_state: 'UNPUBLISHED',
          validation_status: null,
        },
      ]);
      dateToBeInRange(
        snapshots[0].unpublished_date as string,
        timestampBeforeTest,
      );
      expect(movieSnapshots).toEqual([
        { snapshot_id: snapshots[0].id, movie_id: movie1.id },
      ]);
      expect(messages).toIncludeSameMembers([
        {
          envelopeOverrides: {
            auth_token:
              'some token value which is not used because we are substituting getPgSettings method and using a stub user',
          },
          payload: { content_id: `movie-${movie1.id}` },
          messageType: 'mock-unpublish',
          options: undefined,
        },
      ]);
    });
  });
});
