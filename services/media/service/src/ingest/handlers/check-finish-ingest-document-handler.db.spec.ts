import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { assertNotFalsy, sleep } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  CheckFinishIngestDocumentCommand,
  StartIngestItemCommand,
} from 'media-messages';
import { IngestItemStatusEnum } from 'zapatos/custom';
import { insert, selectOne, update } from 'zapatos/db';
import { ingest_documents, ingest_items } from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { CheckFinishIngestDocumentHandler } from './check-finish-ingest-document-handler';
jest.mock('@axinom/mosaic-service-common', () => {
  const original = jest.requireActual('@axinom/mosaic-service-common');
  return {
    ...original,
    sleep: jest.fn(),
  };
});

describe('Check Finish Ingest Document Handler', () => {
  let ctx: ITestContext;
  let handler: CheckFinishIngestDocumentHandler;
  let doc1: ingest_documents.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let item2: ingest_items.JSONSelectable;
  let message: MessageInfo;
  let messages: unknown[] = [];
  let waitingTimeInSeconds = -1;

  beforeAll(async () => {
    ctx = await createTestContext();
    const broker = stub<Broker>({
      publish: (_key: string, message: StartIngestItemCommand) => {
        messages.push(message);
      },
    });
    const user = createTestUser(ctx.config.serviceId);
    message = stub<MessageInfo>({
      envelope: {
        auth_token:
          'some token value which is not used because we are substituting getPgSettings method and using a stub user',
      },
    });
    handler = new CheckFinishIngestDocumentHandler(
      ctx.loginPool,
      broker,
      ctx.config,
    );

    (sleep as jest.Mock<any, any>).mockImplementation(async (ms) => {
      waitingTimeInSeconds = ms / 1000;
      return;
    });
    jest
      .spyOn<any, string>(handler, 'getSubject')
      .mockImplementation(() => user);
  });

  beforeEach(async () => {
    doc1 = await insert('ingest_documents', {
      name: 'test1',
      title: 'test1',
      document: {
        name: 'test1',
        document_created: '2020-08-04T08:57:40.763+00:00',
        items: [{ type: 'MOVIE', external_id: 'test', data: {} }],
      },
      items_count: 2,
      // Always initially set to the number of items
      in_progress_count: 2,
      error_count: 0,
      success_count: 0,
    }).run(ctx.ownerPool);
    item1 = await insert('ingest_items', {
      ingest_document_id: doc1.id,
      external_id: 'externalId-1',
      entity_id: 1,
      type: 'MOVIE',
      exists_status: 'CREATED',
      display_title: 'title',
      status: 'IN_PROGRESS',
      item: {
        type: 'MOVIE',
        external_id: 'test',
        data: { title: 'title' },
      },
    }).run(ctx.ownerPool);
    item2 = await insert('ingest_items', {
      ingest_document_id: doc1.id,
      external_id: 'externalId-2',
      entity_id: 2,
      type: 'MOVIE',
      exists_status: 'CREATED',
      display_title: 'title',
      status: 'IN_PROGRESS',
      item: {
        type: 'MOVIE',
        external_id: 'test',
        data: { title: 'title' },
      },
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
    messages = [];
    waitingTimeInSeconds = -1;
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message with all 0 counts for 2 in progress items, initial call -> seconds_without_progress remains the same, waiting 5 sec', async () => {
      // Arrange
      const content: CheckFinishIngestDocumentCommand = {
        ingest_document_id: doc1.id,
        seconds_without_progress: 0,
        previous_success_count: 0,
        previous_in_progress_count: 0,
        previous_error_count: 0,
      };

      // Act
      await handler.onMessage(content, message);

      // Assert
      const doc = await selectOne('ingest_documents', { id: doc1.id }).run(
        ctx.ownerPool,
      );

      assertNotFalsy(doc);

      expect(doc.in_progress_count).toEqual(2);
      expect(doc.error_count).toEqual(0);
      expect(doc.success_count).toEqual(0);
      expect(doc.status).toEqual('IN_PROGRESS');
      expect(doc.errors).toEqual([]);

      expect(waitingTimeInSeconds).toEqual(5);

      expect(messages).toIncludeSameMembers([
        {
          ingest_document_id: doc1.id,
          seconds_without_progress: 0,
          previous_success_count: 0,
          previous_in_progress_count: 2,
          previous_error_count: 0,
        },
      ]);
    });
    it.each([[0], [5], [10], [590]])(
      'message with same count values and seconds_without_progress %p -> seconds_without_progress increments',
      async (counter) => {
        // Arrange
        const content: CheckFinishIngestDocumentCommand = {
          ingest_document_id: doc1.id,
          seconds_without_progress: counter,
          previous_success_count: 0,
          previous_in_progress_count: 2,
          previous_error_count: 0,
        };

        // Act
        await handler.onMessage(content, message);

        // Assert
        const doc = await selectOne('ingest_documents', { id: doc1.id }).run(
          ctx.ownerPool,
        );

        assertNotFalsy(doc);

        expect(doc.in_progress_count).toEqual(2);
        expect(doc.error_count).toEqual(0);
        expect(doc.success_count).toEqual(0);
        expect(doc.status).toEqual('IN_PROGRESS');
        expect(doc.errors).toEqual([]);

        expect(waitingTimeInSeconds).toEqual(5);

        expect(messages).toIncludeSameMembers([
          {
            ingest_document_id: doc1.id,
            seconds_without_progress: counter + 5,
            previous_success_count: 0,
            previous_in_progress_count: 2,
            previous_error_count: 0,
          },
        ]);
      },
    );

    it('message with same count values and seconds_without_progress 595 -> seconds_without_progress increments to 600 and ingest fails', async () => {
      // Arrange
      const content: CheckFinishIngestDocumentCommand = {
        ingest_document_id: doc1.id,
        seconds_without_progress: 595,
        previous_success_count: 0,
        previous_in_progress_count: 2,
        previous_error_count: 0,
      };

      // Act
      await handler.onMessage(content, message);

      // Assert
      const doc = await selectOne('ingest_documents', { id: doc1.id }).run(
        ctx.ownerPool,
      );

      assertNotFalsy(doc);

      expect(doc.in_progress_count).toEqual(2);
      expect(doc.error_count).toEqual(0);
      expect(doc.success_count).toEqual(0);
      expect(doc.status).toEqual('ERROR');
      expect(doc.errors).toEqual([
        {
          message:
            'The progress of ingest failed to change for a long period of time. Assuming an unexpected messaging issue and failing the document.',
          source: 'CheckFinishIngestDocumentHandler',
        },
      ]);

      expect(waitingTimeInSeconds).toEqual(-1); // sleep not called

      expect(messages).toEqual([]);
    });

    it.each([
      ['ERROR', 0, 1],
      ['SUCCESS', 1, 0],
    ])(
      'message with incremented seconds_without_progress and detected %p change in ingest item -> seconds_without_progress reset, waiting 5 sec',
      async (itemStatus, successCount, errorCount) => {
        // Arrange
        await update(
          'ingest_items',
          { status: itemStatus as IngestItemStatusEnum },
          { id: item1.id },
        ).run(ctx.ownerPool);
        const content: CheckFinishIngestDocumentCommand = {
          ingest_document_id: doc1.id,
          seconds_without_progress: 5,
          previous_success_count: 0,
          previous_in_progress_count: 2,
          previous_error_count: 0,
        };

        // Act
        await handler.onMessage(content, message);

        // Assert
        const doc = await selectOne('ingest_documents', { id: doc1.id }).run(
          ctx.ownerPool,
        );

        assertNotFalsy(doc);

        expect(doc.in_progress_count).toEqual(1);
        expect(doc.error_count).toEqual(errorCount);
        expect(doc.success_count).toEqual(successCount);
        expect(doc.status).toEqual('IN_PROGRESS');
        expect(doc.errors).toEqual([]);

        expect(waitingTimeInSeconds).toEqual(5);

        expect(messages).toIncludeSameMembers([
          {
            ingest_document_id: doc1.id,
            seconds_without_progress: 0,
            previous_success_count: successCount,
            previous_in_progress_count: 1,
            previous_error_count: errorCount,
          },
        ]);
      },
    );

    it.each([
      ['ERROR', 'ERROR', 0, 2, 'ERROR'],
      ['ERROR', 'SUCCESS', 1, 1, 'PARTIAL_SUCCESS'],
      ['SUCCESS', 'SUCCESS', 2, 0, 'SUCCESS'],
    ])(
      'message with incremented seconds_without_progress and detected %p and %p changes in both ingest item -> seconds_without_progress reset, waiting 5 sec',
      async (
        item1Status,
        item2Status,
        successCount,
        errorCount,
        documentResultingStatus,
      ) => {
        // Arrange
        await update(
          'ingest_items',
          { status: item1Status as IngestItemStatusEnum },
          { id: item1.id },
        ).run(ctx.ownerPool);
        await update(
          'ingest_items',
          { status: item2Status as IngestItemStatusEnum },
          { id: item2.id },
        ).run(ctx.ownerPool);
        const content: CheckFinishIngestDocumentCommand = {
          ingest_document_id: doc1.id,
          seconds_without_progress: 5,
          previous_success_count: 0,
          previous_in_progress_count: 2,
          previous_error_count: 0,
        };

        // Act
        await handler.onMessage(content, message);

        // Assert
        const doc = await selectOne('ingest_documents', { id: doc1.id }).run(
          ctx.ownerPool,
        );

        assertNotFalsy(doc);

        expect(doc.in_progress_count).toEqual(0);
        expect(doc.error_count).toEqual(errorCount);
        expect(doc.success_count).toEqual(successCount);
        expect(doc.status).toEqual(documentResultingStatus);
        expect(doc.errors).toEqual([]);

        expect(waitingTimeInSeconds).toEqual(-1); // sleep not called

        expect(messages).toEqual([]);
      },
    );
  });
});
