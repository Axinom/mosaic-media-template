import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { EnsureImageExistsImageCreatedEvent } from '@axinom/mosaic-messages';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { all, insert, select, selectOne } from 'zapatos/db';
import {
  ingest_documents,
  ingest_items,
  ingest_item_steps,
  movies,
} from 'zapatos/schema';
import { MockIngestProcessor } from '../../tests/ingest/mock-ingest-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { ImageCreatedHandler } from './image-created-handler';

// These tests cover logic for both ImageAlreadyExisted and ImageCreated handlers
describe('ImageSucceededHandler', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handler: ImageCreatedHandler;
  let step1: ingest_item_steps.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;
  let movie1: movies.JSONSelectable;
  let messages: CheckFinishIngestItemCommand[] = [];

  const createMessage = (
    payload: EnsureImageExistsImageCreatedEvent,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<EnsureImageExistsImageCreatedEvent>>({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, _messagingSettings, message) => {
        messages.push(message as CheckFinishIngestItemCommand);
      },
    );
    user = createTestUser(ctx.config.serviceId);
    handler = new ImageCreatedHandler(
      [new MockIngestProcessor()],
      storeOutboxMessage,
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
    movie1 = await insert('movies', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
    item1 = await insert('ingest_items', {
      ingest_document_id: doc1.id,
      external_id: 'externalId',
      entity_id: movie1.id,
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
      type: 'IMAGE',
      ingest_item_id: item1.id,
      sub_type: 'COVER',
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
    it('message succeeded without errors -> message without error sent and step updated', async () => {
      // Arrange
      const payload: EnsureImageExistsImageCreatedEvent = {
        image_id: '11e1d903-49ed-4d70-8b24-90d0824741d0',
      };
      const metadata = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
        imageType: 'COVER',
      };

      // Act
      await ctx.executeGqlSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload, metadata), dbCtx),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);

      expect(step?.entity_id).toEqual(payload.image_id);

      expect(messages).toEqual<CheckFinishIngestItemCommand[]>([
        {
          ingest_item_step_id: step1.id,
          ingest_item_id: item1.id,
        },
      ]);
    });
  });

  describe('onMessageFailure', () => {
    it('message failed on all retries -> message with error ingestItemStepId sent', async () => {
      // Arrange
      const payload: EnsureImageExistsImageCreatedEvent = {
        image_id: '11e1d903-49ed-4d70-8b24-90d0824741d0',
      };
      const context = {
        ingestItemStepId: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingestItemId: item1.id,
        imageType: 'COVER',
      };

      // Act
      await ctx.executeGqlSql(user, async (dbCtx) =>
        handler.handleErrorMessage(
          new Error('test error'),
          createMessage(payload, context),
          dbCtx,
          false,
        ),
      );

      // Assert
      const movies = await select('movies', all).run(ctx.ownerPool);

      expect(movies).toHaveLength(1);
      expect(movies[0]).toEqual(movie1);

      expect(messages[0]).toEqual<CheckFinishIngestItemCommand>({
        ingest_item_step_id: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingest_item_id: item1.id,
        error_message:
          'An unexpected error occurred while trying to update image relations.',
      });
    });
  });
});
