import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { LocalizeEntityFinishedEvent } from '@axinom/mosaic-messages';
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
import { LocalizeEntityFinishedHandler } from './localize-entity-finished-handler';

describe('LocalizeEntityFinishedHandler', () => {
  let ctx: ITestContext;
  let handler: LocalizeEntityFinishedHandler;
  let user: AuthenticatedManagementSubject;
  let step1: ingest_item_steps.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;

  const createMessage = (
    payload: LocalizeEntityFinishedEvent,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<LocalizeEntityFinishedEvent>>({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId);
    handler = new LocalizeEntityFinishedHandler(ctx.config);
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

  describe('onMessage', () => {
    it('message received -> check ingest item message without error sent', async () => {
      // Arrange
      const payload: LocalizeEntityFinishedEvent = {
        service_id: ctx.config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
        skipped_language_tags: [],
        processed_language_tags: ['de-DE'],
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
      expect(step?.status).toEqual('SUCCESS');
    });
  });
});
