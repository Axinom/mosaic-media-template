import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { VideoEncodingFinishedEvent } from '@axinom/mosaic-video-messages';
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
import { VideoEncodingFinishedHandler } from './video-encoding-finished-handler';

describe('VideoEncodingFinishedHandler', () => {
  let handler: VideoEncodingFinishedHandler;
  let ctx: ITestContext;
  let step1: ingest_item_steps.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;
  let user: AuthenticatedManagementSubject;
  const videoId = randomUUID();

  const createMessage = (payload: VideoEncodingFinishedEvent) =>
    ({
      payload,
      metadata: {},
    }) satisfies Partial<
      Omit<TypedTransactionalMessage<VideoEncodingFinishedEvent>, 'metadata'>
    > & {
      metadata?: Partial<
        TypedTransactionalMessage<VideoEncodingFinishedEvent>['metadata']
      >;
    } as unknown as TypedTransactionalMessage<VideoEncodingFinishedEvent>;

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId);
    handler = new VideoEncodingFinishedHandler(ctx.config);
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
        data: { title: 'title' },
      },
    }).run(ctx.ownerPool);
    step1 = await insert('ingest_item_steps', {
      id: randomUUID(),
      type: 'VIDEO',
      ingest_item_id: item1.id,
      sub_type: 'MAIN',
      entity_id: videoId,
      status: 'ERROR',
      response_message: 'A previous encoding attempt failed.',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('handleMessage', () => {
    it('matching video step found -> step reset to SUCCESS', async () => {
      // Arrange
      const payload: VideoEncodingFinishedEvent = {
        video_id: videoId,
        source_location: 'test-source',
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload), dbCtx),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(step?.status).toBe('SUCCESS');
      expect(step?.response_message).toBeNull();
    });

    it('no matching video step -> nothing updated', async () => {
      // Arrange
      const payload: VideoEncodingFinishedEvent = {
        video_id: randomUUID(),
        source_location: 'test-source',
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload), dbCtx),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(step?.status).toBe('ERROR');
      expect(step?.response_message).toBe(
        'A previous encoding attempt failed.',
      );
    });
  });

  describe('mapError', () => {
    it('message failed with non-mosaic error -> default error mapped', async () => {
      // Act
      const error = handler.mapError(new Error('Unexpected failure'));

      // Assert
      expect(error).toMatchObject({
        message:
          'The video encoding has finished, but there was an error updating the ingest item step status.',
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
      const payload: VideoEncodingFinishedEvent = {
        video_id: videoId,
        source_location: 'test-source',
      };
      // mapError makes sure this error is appropriate
      const error = new Error('Handled and mapped message');

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleErrorMessage(error, createMessage(payload), dbCtx, false),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(step?.response_message).toEqual(error.message);
      expect(step?.status).toBe('ERROR');
    });

    it('message will be retried -> step not updated', async () => {
      // Arrange
      const payload: VideoEncodingFinishedEvent = {
        video_id: videoId,
        source_location: 'test-source',
      };
      const error = new Error('Handled and mapped message');

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleErrorMessage(error, createMessage(payload), dbCtx, true),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(step?.status).toBe('ERROR');
      expect(step?.response_message).toBe(
        'A previous encoding attempt failed.',
      );
    });
  });
});
