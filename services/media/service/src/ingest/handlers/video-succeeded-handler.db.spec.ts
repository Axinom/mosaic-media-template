import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { EnsureVideoExistsCreationStartedEvent } from '@axinom/mosaic-messages';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import {
  ingest_documents,
  ingest_items,
  ingest_item_steps,
} from 'zapatos/schema';
import { MockIngestProcessor } from '../../tests/ingest/mock-ingest-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { VideoCreationStartedHandler } from './video-creation-started-handler';

// These tests cover logic for both VideoAlreadyExisted and VideoCreationStarted handlers
describe('VideoSucceededHandler', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handler: VideoCreationStartedHandler;
  let step1: ingest_item_steps.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;

  const createMessage = (
    payload: EnsureVideoExistsCreationStartedEvent,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<EnsureVideoExistsCreationStartedEvent>>({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId);
    handler = new VideoCreationStartedHandler(
      [new MockIngestProcessor()],
      ctx.config,
    );
  });

  beforeEach(async () => {
    doc1 = await insert('ingest_documents', {
      name: 'test1',
      title: 'test1',
      document: {
        name: 'test1',
        document_created: '2020-08-04T08:57:40.763+00:00',
        items: [],
      },
      items_count: 0,
    }).run(ctx.ownerPool);
    item1 = await insert('ingest_items', {
      ingest_document_id: doc1.id,
      external_id: 'externalId',
      entity_id: 1,
      type: 'MOVIE',
      exists_status: 'CREATED',
      display_title: 'title',
      item: {
        type: 'MOVIE',
        external_id: 'externalId',
        data: {
          title: 'title',
          trailers: [{ source: 'test', profile: 'DEFAULT' }],
        },
      },
    }).run(ctx.ownerPool);
    step1 = await insert('ingest_item_steps', {
      id: uuid(),
      type: 'VIDEO',
      ingest_item_id: item1.id,
      sub_type: 'MAIN',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message succeeded without errors -> message without error sent and step updated', async () => {
      // Arrange
      const payload: EnsureVideoExistsCreationStartedEvent = {
        video_id: '6804e7ff-8bed-42b2-85bf-c1ca5b59c417',
        encoding_state: 'IN_PROGRESS',
      };
      const context = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
        videoType: 'MAIN',
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload, context), dbCtx),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);

      expect(step?.entity_id).toEqual(payload.video_id);
      expect(step?.status).toEqual('SUCCESS');
    });
  });

  describe('onMessageFailure', () => {
    it('message failed on all retries -> message with error sent', async () => {
      // Arrange
      const payload: EnsureVideoExistsCreationStartedEvent = {
        video_id: '6804e7ff-8bed-42b2-85bf-c1ca5b59c417',
        encoding_state: 'IN_PROGRESS',
      };
      const context = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
        videoType: 'MAIN',
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleErrorMessage(
          new Error('test error'),
          createMessage(payload, context),
          dbCtx,
          false,
        ),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(step?.response_message).toEqual(
        'An unexpected error occurred while trying to update video relations.',
      );
      expect(step?.status).toEqual('ERROR');
    });
  });
});
