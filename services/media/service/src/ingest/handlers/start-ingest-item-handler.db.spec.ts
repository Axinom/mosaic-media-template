import { DEFAULT_SYSTEM_USERNAME } from '@axinom/mosaic-db-common';
import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { VideoServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import {
  createOffsetDate,
  dateToBeInRange,
} from '@axinom/mosaic-service-common';
import {
  StoreInboxMessage,
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  IngestItem,
  MediaServiceMessagingSettings,
  StartIngestItemCommand,
} from 'media-messages';
import { all, insert, select } from 'zapatos/db';
import { ingest_documents, ingest_items } from 'zapatos/schema';
import { MockIngestProcessor } from '../../tests/ingest/mock-ingest-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { DeferredOrchestrationData, OrchestrationData } from '../models';
import { StartIngestItemHandler } from './start-ingest-item-handler';

describe('Start Ingest Item Handler', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handler: StartIngestItemHandler;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;
  let messages: unknown[] = [];
  let timestampBeforeTest: Date;
  const processor = new MockIngestProcessor();
  const createOrchestrationMock = (
    itemId: number,
    stepIdprefix: number,
    settings: MessagingSettings,
  ): OrchestrationData => {
    return {
      aggregateId: itemId.toString(),
      messagingSettings: settings,
      messagePayload: { test: 'payload' },
      messageContext: { test: 'context' },
      ingestItemStep: {
        ingest_item_id: itemId,
        type: 'ENTITY',
        id: `${stepIdprefix}49c11f1-c188-4950-9743-442c45c5c8e5`,
        sub_type: 'TEST',
      },
    };
  };

  const createMessage = (payload: StartIngestItemCommand) =>
    stub<TypedTransactionalMessage<StartIngestItemCommand>>({
      payload,
      metadata: {
        authToken: 'test',
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (
        _aggregateId,
        messagingSettings,
        payload,
        _client,
        optionalData,
      ) => {
        const { envelopeOverrides, options } = optionalData || {};
        messages.push({
          key: messagingSettings.messageType,
          payload,
          envelopeOverrides: {
            authToken: envelopeOverrides?.auth_token,
            messageContext: envelopeOverrides?.message_context,
          },
          options,
        });
      },
    );
    const storeInboxMessage: StoreInboxMessage = jest.fn(
      async (
        _aggregateId,
        messagingSettings,
        payload,
        _client,
        optionalData,
      ) => {
        const { metadata } = optionalData || {};
        messages.push({
          key: messagingSettings.messageType,
          payload,
          envelopeOverrides: metadata,
        });
      },
    );
    user = createTestUser(ctx.config.serviceId);
    handler = new StartIngestItemHandler(
      [processor],
      storeInboxMessage,
      storeOutboxMessage,
      ctx.config,
    );
  });

  beforeEach(async () => {
    timestampBeforeTest = createOffsetDate(-20);
    const item: IngestItem = {
      type: 'MOVIE',
      external_id: 'externalId',
      data: { title: 'title' },
    };
    doc1 = await insert('ingest_documents', {
      name: 'test1',
      title: 'test1',
      document: {
        name: 'test1',
        document_created: '2020-08-04T08:57:40.763+00:00',
        items: [item],
      },
      items_count: 1,
      in_progress_count: 1,
    }).run(ctx.ownerPool);
    item1 = await insert('ingest_items', {
      ingest_document_id: doc1.id,
      external_id: 'externalId',
      entity_id: 1,
      type: 'MOVIE',
      exists_status: 'CREATED',
      display_title: 'title',
      item,
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
    await ctx.truncate('movies');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message for one step -> step is saved and command is sent', async () => {
      // Arrange
      const mockItem = createOrchestrationMock(
        item1.id,
        1,
        MediaServiceMessagingSettings.UpdateMetadata,
      );
      jest
        .spyOn(processor, 'getOrchestrationData')
        .mockImplementation(() => [mockItem]);

      const payload: StartIngestItemCommand = {
        ingest_item_id: item1.id,
        entity_id: 1,
        item: {
          type: 'MOVIE',
          external_id: 'externalId',
          data: {},
        },
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload), dbCtx),
      );

      // Assert
      const items = await select('ingest_items', all, { columns: ['id'] }).run(
        ctx.ownerPool,
      );
      expect(items).toHaveLength(1);

      const steps = await select(
        'ingest_item_steps',
        { ingest_item_id: items[0].id },
        { columns: ['id', 'ingest_item_id', 'sub_type', 'type', 'status'] },
      ).run(ctx.ownerPool);

      expect(steps).toIncludeSameMembers([
        { ...mockItem.ingestItemStep, status: 'IN_PROGRESS' },
      ]);

      expect(messages).toEqual([
        {
          key: MediaServiceMessagingSettings.UpdateMetadata.messageType,
          payload: { test: 'payload' },
          envelopeOverrides: {
            authToken: 'test',
            messageContext: { test: 'context' },
          },
          options: undefined,
        },
      ]);
    });

    it('message for two steps -> steps are saved and commands are sent', async () => {
      // Arrange
      const mockItem = createOrchestrationMock(
        item1.id,
        1,
        MediaServiceMessagingSettings.UpdateMetadata,
      );
      const mockItem2 = createOrchestrationMock(
        item1.id,
        2,
        VideoServiceMultiTenantMessagingSettings.EnsureVideoExists,
      );
      jest
        .spyOn(processor, 'getOrchestrationData')
        .mockImplementation(() => [mockItem, mockItem2]);

      const payload: StartIngestItemCommand = {
        ingest_item_id: item1.id,
        entity_id: 1,
        item: {
          type: 'MOVIE',
          external_id: 'externalId',
          data: {},
        },
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload), dbCtx),
      );

      // Assert
      const items = await select('ingest_items', all, { columns: ['id'] }).run(
        ctx.ownerPool,
      );
      expect(items).toHaveLength(1);

      const steps = await select(
        'ingest_item_steps',
        { ingest_item_id: items[0].id },
        { columns: ['id', 'ingest_item_id', 'sub_type', 'type', 'status'] },
      ).run(ctx.ownerPool);

      expect(steps).toIncludeSameMembers([
        { ...mockItem.ingestItemStep, status: 'IN_PROGRESS' },
        { ...mockItem2.ingestItemStep, status: 'IN_PROGRESS' },
      ]);

      expect(messages).toIncludeSameMembers([
        {
          key: MediaServiceMessagingSettings.UpdateMetadata.messageType,
          payload: { test: 'payload' },
          envelopeOverrides: {
            authToken: 'test',
            messageContext: { test: 'context' },
          },
          options: undefined,
        },
        {
          key: VideoServiceMultiTenantMessagingSettings.EnsureVideoExists
            .messageType,
          payload: { test: 'payload' },
          envelopeOverrides: {
            authToken: 'test',
            messageContext: { test: 'context' },
          },
          options: {
            routingKey: `${
              VideoServiceMultiTenantMessagingSettings.EnsureVideoExists
                .serviceId
            }.${VideoServiceMultiTenantMessagingSettings.EnsureVideoExists.routingKey
              .replace('*', ctx.config.tenantId)
              .replace('*', ctx.config.environmentId)}`,
          },
        },
      ]);
    });

    it('message for 3 steps -> 3 steps are saved and 2 commands are sent', async () => {
      // Arrange
      const mockItem = createOrchestrationMock(
        item1.id,
        1,
        MediaServiceMessagingSettings.UpdateMetadata,
      );
      const mockItem2 = createOrchestrationMock(
        item1.id,
        2,
        VideoServiceMultiTenantMessagingSettings.EnsureVideoExists,
      );
      const mockItem3: DeferredOrchestrationData = {
        ingestItemStep: {
          ingest_item_id: item1.id,
          type: 'ENTITY',
          id: `349c11f1-c188-4950-9743-442c45c5c8e5`,
          sub_type: 'TEST',
        },
      };
      jest
        .spyOn(processor, 'getOrchestrationData')
        .mockImplementation(() => [mockItem, mockItem2, mockItem3]);

      const payload: StartIngestItemCommand = {
        ingest_item_id: item1.id,
        entity_id: 1,
        item: {
          type: 'MOVIE',
          external_id: 'externalId',
          data: {},
        },
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload), dbCtx),
      );

      // Assert
      const items = await select('ingest_items', all, { columns: ['id'] }).run(
        ctx.ownerPool,
      );
      expect(items).toHaveLength(1);

      const steps = await select(
        'ingest_item_steps',
        { ingest_item_id: items[0].id },
        { columns: ['id', 'ingest_item_id', 'sub_type', 'type', 'status'] },
      ).run(ctx.ownerPool);

      expect(steps).toIncludeSameMembers([
        { ...mockItem.ingestItemStep, status: 'IN_PROGRESS' },
        { ...mockItem2.ingestItemStep, status: 'IN_PROGRESS' },
        { ...mockItem3.ingestItemStep, status: 'IN_PROGRESS' },
      ]);

      expect(messages).toIncludeSameMembers([
        {
          key: MediaServiceMessagingSettings.UpdateMetadata.messageType,
          payload: { test: 'payload' },
          envelopeOverrides: {
            authToken: 'test',
            messageContext: { test: 'context' },
          },
          options: undefined,
        },
        {
          key: VideoServiceMultiTenantMessagingSettings.EnsureVideoExists
            .messageType,
          payload: { test: 'payload' },
          envelopeOverrides: {
            authToken: 'test',
            messageContext: { test: 'context' },
          },
          options: {
            routingKey: `${
              VideoServiceMultiTenantMessagingSettings.EnsureVideoExists
                .serviceId
            }.${VideoServiceMultiTenantMessagingSettings.EnsureVideoExists.routingKey
              .replace('*', ctx.config.tenantId)
              .replace('*', ctx.config.environmentId)}`,
          },
        },
      ]);
    });
  });

  describe('onMessageFailure', () => {
    it('message failed on all retries -> item state updated to ERROR', async () => {
      // Arrange
      const payload: StartIngestItemCommand = {
        ingest_item_id: item1.id,
        entity_id: 1,
        item: {
          type: 'MOVIE',
          external_id: 'externalId',
          data: { title: 'title' },
        },
      };

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

      // Calculation done in separate handler
      expect(docs[0].status).toEqual('IN_PROGRESS');
      expect(docs[0].error_count).toEqual(0);
      expect(docs[0].in_progress_count).toEqual(1);
      expect(docs[0].success_count).toEqual(0);
      expect(docs[0].items_count).toEqual(1);

      expect(items).toHaveLength(1);
      expect(items[0].status).toEqual('ERROR');
      expect(items[0].errors).toEqual([
        {
          message:
            'An error occurred while trying to orchestrate ingest items.',
          source: 'StartIngestItemHandler',
        },
      ]);
      dateToBeInRange(items[0].updated_date, timestampBeforeTest);
      expect(items[0].updated_user).toBe(DEFAULT_SYSTEM_USERNAME);
    });
  });
});
