import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { LocalizeEntityFailedEvent } from '@axinom/mosaic-messages';
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
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { LocalizeEntityFailedHandler } from './localize-entity-failed-handler';

describe('LocalizeEntityFailedHandler', () => {
  let ctx: ITestContext;
  let handler: LocalizeEntityFailedHandler;
  let user: AuthenticatedManagementSubject;
  let step1: ingest_item_steps.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;

  const createMessage = (
    payload: LocalizeEntityFailedEvent,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<LocalizeEntityFailedEvent>>({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId);
    handler = new LocalizeEntityFailedHandler(ctx.config);
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
    it('message received -> message with error ingestItemStepId sent', async () => {
      // Arrange
      const payload: LocalizeEntityFailedEvent = {
        message: 'Test error message',
        service_id: ctx.config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
      };
      const context = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
        imageType: 'MAIN',
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload, context), dbCtx),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(step?.response_message).toEqual(payload.message);
      expect(step?.status).toEqual('ERROR');
    });
  });
});
