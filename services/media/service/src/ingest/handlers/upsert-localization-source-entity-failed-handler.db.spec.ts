import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { UpsertLocalizationSourceEntityFailedEvent } from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import {
  StoreInboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand, IngestItem } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { all, insert, select } from 'zapatos/db';
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
import { UpsertLocalizationSourceEntityFailedHandler } from './upsert-localization-source-entity-failed-handler';

describe('UpsertLocalizationSourceEntityFailedHandler', () => {
  let ctx: ITestContext;
  let handler: UpsertLocalizationSourceEntityFailedHandler;
  let step1: ingest_item_steps.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;
  let payloads: CheckFinishIngestItemCommand[] = [];
  let user: AuthenticatedManagementSubject;

  const createMessage = (
    payload: UpsertLocalizationSourceEntityFailedEvent,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<UpsertLocalizationSourceEntityFailedEvent>>({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    const storeInboxMessage: StoreInboxMessage = jest.fn(
      async (_aggregateId, _messagingSettings, payload) => {
        payloads.push(payload as CheckFinishIngestItemCommand);
      },
    );
    user = createTestUser(ctx.config.serviceId);
    handler = new UpsertLocalizationSourceEntityFailedHandler(
      storeInboxMessage,
      ctx.config,
    );
  });

  beforeEach(async () => {
    const item: IngestItem = {
      type: 'MOVIE',
      external_id: 'externalId',
      data: {
        title: 'title',
      },
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
    step1 = await insert('ingest_item_steps', {
      id: uuid(),
      type: 'LOCALIZATIONS',
      ingest_item_id: item1.id,
      sub_type: '',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
    payloads = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message succeeded without errors -> localize entity message sent', async () => {
      // Arrange
      const payload: UpsertLocalizationSourceEntityFailedEvent = {
        service_id: ctx.config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
        message: 'Something broke...',
      };
      const context = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload, context), dbCtx),
      );

      // Assert
      expect(payloads).toHaveLength(1);
      expect(payloads[0]).toEqual<CheckFinishIngestItemCommand>({
        ingest_item_step_id: step1.id,
        ingest_item_id: item1.id,
        error_message: payload.message,
      });
    });
  });

  describe('onMessageFailure', () => {
    it('message failed on all retries -> message with error sent', async () => {
      // Arrange
      const payload: UpsertLocalizationSourceEntityFailedEvent = {
        service_id: ctx.config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
        message: 'Something broke...',
      };
      const context = {
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: item1.id,
      };
      const error = new MosaicError({
        message:
          'An error occurred while trying to process a response event from the localization service.',
        code: CommonErrors.IngestError.code,
      });

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
          message: error.message,
          source: 'UpsertLocalizationSourceEntityFailedHandler',
        },
      ]);
    });
  });
});
