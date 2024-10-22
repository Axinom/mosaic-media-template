import { DEFAULT_SYSTEM_USERNAME } from '@axinom/mosaic-db-common';
import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import {
  StoreInboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  IngestItem,
  StartIngestCommand,
  StartIngestItemCommand,
} from 'media-messages';
import { all, insert, select } from 'zapatos/db';
import { ingest_documents } from 'zapatos/schema';
import { MockIngestProcessor } from '../../tests/ingest/mock-ingest-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { StartIngestHandler } from './start-ingest-handler';

describe('Start Ingest Handler', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handler: StartIngestHandler;
  let messages: unknown[] = [];
  const processor = new MockIngestProcessor();

  const createMessage = (payload: StartIngestCommand) =>
    stub<TypedTransactionalMessage<StartIngestCommand>>({
      payload,
    });

  const createDoc = async (
    items: IngestItem[],
  ): Promise<ingest_documents.JSONSelectable> => {
    return insert('ingest_documents', {
      name: 'test1',
      title: 'test1',
      document: {
        name: 'test1',
        document_created: '2020-08-04T08:57:40.763+00:00',
        items,
      },
      items_count: items.length,
    }).run(ctx.ownerPool);
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    const storeInboxMessage: StoreInboxMessage = jest.fn(
      async (_aggregateId, _messagingSettings, message) => {
        messages.push(message as StartIngestItemCommand);
      },
    );
    user = createTestUser(ctx.config.serviceId);
    handler = new StartIngestHandler(
      [processor],
      storeInboxMessage,
      ctx.ownerPool,
      ctx.config,
    );
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    it('message with 1 new movie -> ingest item created and message sent', async () => {
      // Arrange
      jest.spyOn(processor, 'initializeMedia').mockImplementation(async () => ({
        createdMedia: [
          {
            external_id: 'test1_external_id',
            id: 1,
          },
        ],
        displayTitleMappings: [
          {
            display_title: 'Display Title',
            external_id: 'test1_external_id',
          },
        ],
        existedMedia: [],
      }));

      const docItems: IngestItem[] = [
        {
          type: 'MOVIE',
          external_id: 'test1_external_id',
          data: { title: 'test1_title' },
        },
      ];
      const doc = await createDoc(docItems);
      const payload: StartIngestCommand = { doc_id: doc.id };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload), dbCtx, { subject: user }),
      );

      // Assert
      const items = await select(
        'ingest_items',
        { ingest_document_id: doc.id },
        {
          columns: [
            'id',
            'external_id',
            'type',
            'entity_id',
            'errors',
            'exists_status',
            'status',
            'item',
            'display_title',
          ],
        },
      ).run(ctx.ownerPool);

      expect(items).toIncludeSameMembers([
        {
          id: items[0].id,
          external_id: docItems[0].external_id,
          type: 'MOVIE',
          entity_id: 1,
          errors: [],
          exists_status: 'CREATED',
          status: 'IN_PROGRESS',
          item: docItems[0],
          display_title: 'Display Title',
        },
      ]);
      expect(messages).toIncludeSameMembers([
        {
          entity_id: 1,
          ingest_item_id: items[0].id,
          item: docItems[0],
        },
        {
          ingest_document_id: doc.id,
          seconds_without_progress: 0,
          previous_error_count: 0,
          previous_in_progress_count: 0,
          previous_success_count: 0,
        },
      ]);
    });

    it('message with 2 new entities -> ingest items created and messages sent', async () => {
      // Arrange
      jest.spyOn(processor, 'initializeMedia').mockImplementation(async () => ({
        createdMedia: [
          {
            external_id: 'test1_external_id',
            id: 1,
          },
        ],
        displayTitleMappings: [
          {
            display_title: 'Display Title',
            external_id: 'test1_external_id',
          },
          {
            display_title: 'Display Title 2',
            external_id: 'existing_external_id',
          },
        ],
        existedMedia: [
          {
            external_id: 'existing_external_id',
            id: 2,
          },
        ],
      }));

      const docItems: IngestItem[] = [
        {
          type: 'MOVIE',
          external_id: 'existing_external_id',
          data: { title: 'test1_title 2' },
        },
        {
          type: 'MOVIE',
          external_id: 'test1_external_id',
          data: { title: 'test1_title' },
        },
      ];
      const doc = await createDoc(docItems);
      const payload: StartIngestCommand = { doc_id: doc.id };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload), dbCtx, { subject: user }),
      );

      // Assert
      const items = await select(
        'ingest_items',
        { ingest_document_id: doc.id },
        {
          order: [{ by: 'id', direction: 'ASC' }],
          columns: [
            'id',
            'external_id',
            'type',
            'entity_id',
            'errors',
            'exists_status',
            'status',
            'item',
            'display_title',
          ],
        },
      ).run(ctx.ownerPool);

      expect(items).toIncludeSameMembers([
        {
          id: items[0].id,
          external_id: docItems[0].external_id,
          type: 'MOVIE',
          entity_id: 2,
          errors: [],
          exists_status: 'EXISTED',
          status: 'IN_PROGRESS',
          item: docItems[0],
          display_title: 'Display Title 2',
        },
        {
          id: items[1].id,
          external_id: docItems[1].external_id,
          type: 'MOVIE',
          entity_id: 1,
          errors: [],
          exists_status: 'CREATED',
          status: 'IN_PROGRESS',
          item: docItems[1],
          display_title: 'Display Title',
        },
      ]);
      expect(messages).toIncludeSameMembers([
        {
          entity_id: 2,
          ingest_item_id: items[0].id,
          item: docItems[0],
        },
        {
          entity_id: 1,
          ingest_item_id: items[1].id,
          item: docItems[1],
        },
        {
          ingest_document_id: doc.id,
          seconds_without_progress: 0,
          previous_error_count: 0,
          previous_in_progress_count: 0,
          previous_success_count: 0,
        },
      ]);
    });
  });

  describe('handleErrorMessage', () => {
    it('message failed on all retries -> document state updated to ERROR', async () => {
      // Arrange
      const docItems: IngestItem[] = [
        {
          type: 'MOVIE',
          external_id: 'test_external_id',
          data: { title: 'test1_title_existing' },
        },
      ];
      const doc = await createDoc(docItems);
      const payload: StartIngestCommand = { doc_id: doc.id };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleErrorMessage(
          new Error('test error'),
          createMessage(payload),
          dbCtx,
          false,
        ),
      );
      // Assert
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);
      const items = await select('ingest_items', all).run(ctx.ownerPool);

      expect(docs).toHaveLength(1);
      expect(items).toHaveLength(0);

      expect(docs[0].status).toEqual('ERROR');
      expect(docs[0].updated_date).not.toBe(doc.updated_date);
      expect(docs[0].updated_user).toBe(DEFAULT_SYSTEM_USERNAME);
      expect(docs[0].errors).toEqual([
        {
          message: 'An error occurred while trying to initialize ingest items.',
          source: 'StartIngestHandler',
        },
      ]);

      doc.status = docs[0].status;
      doc.updated_date = docs[0].updated_date;
      doc.updated_user = docs[0].updated_user;
      doc.errors = docs[0].errors;
      expect(docs[0]).toEqual(doc);
      expect(messages).toIncludeSameMembers([]);
    });
  });
});
