import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { EnsureVideoExistsFailedEvent } from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { randomUUID } from 'node:crypto';
import { insert, selectOne } from 'zapatos/db';
import {
  ingest_documents,
  ingest_items,
  ingest_item_steps,
} from 'zapatos/schema';
import { CommonErrors } from '../../common';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { VideoFailedHandler } from './video-failed-handler';

describe('VideoFailedHandler', () => {
  let handler: VideoFailedHandler;
  let ctx: ITestContext;
  let step1: ingest_item_steps.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;
  let user: AuthenticatedManagementSubject;

  const createMessage = (
    payload: EnsureVideoExistsFailedEvent,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<EnsureVideoExistsFailedEvent>>({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId);
    handler = new VideoFailedHandler(ctx.config);
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
      id: randomUUID(),
      type: 'IMAGE',
      ingest_item_id: item1.id,
      sub_type: 'COVER',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    it('message received -> step updated', async () => {
      // Arrange
      const payload: EnsureVideoExistsFailedEvent = {
        message: 'Test error message',
        video_location: 'Test',
        video_profile: 'DEFAULT',
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
      expect(step?.response_message).toEqual('Test error message');
      expect(step?.status).toEqual('ERROR');
    });
  });

  describe('mapError', () => {
    it('message failed with non-mosaic error -> default error mapped', async () => {
      // Act
      const error = handler.mapError(new Error('Unexpected status code: 404'));

      // Assert
      expect(error).toMatchObject({
        message:
          'Video encoding has failed to start and there was an error updating the ingest item step status.',
        code: CommonErrors.IngestError.code,
      });
    });

    it('message failed with mosaic error -> thrown error mapped', async () => {
      // Arrange
      const testErrorInfo = {
        message: 'Handled test message',
        code: 'HANDLED_TEST_CODE',
      };

      // Act
      const error = handler.mapError(new MosaicError(testErrorInfo));

      // Assert
      expect(error).toMatchObject(testErrorInfo);
    });
  });

  describe('handleErrorMessage', () => {
    it('message failed on all retries -> step updated', async () => {
      // Arrange
      const payload: EnsureVideoExistsFailedEvent = {
        message: 'Test error message',
        video_location: 'Test',
        video_profile: 'DEFAULT',
      };
      const context = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
        videoType: 'MAIN',
      };
      // mapError makes sure this error is appropriate
      const error = new Error('Handled and mapped message');

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleErrorMessage(
          error,
          createMessage(payload, context),
          dbCtx,
          false,
        ),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(step?.response_message).toEqual(error.message);
      expect(step?.status).toEqual('ERROR');
    });
  });
});
