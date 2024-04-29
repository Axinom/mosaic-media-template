import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { IngestItem, UpdateMetadataCommand } from 'media-messages';
import { randomUUID } from 'node:crypto';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import {
  ingest_documents,
  ingest_items,
  ingest_item_steps,
} from 'zapatos/schema';
import { CommonErrors } from '../../common';
import { MockIngestProcessor } from '../../tests/ingest/mock-ingest-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { IngestEntityProcessor } from '../models';
import { UpdateMetadataHandler } from './update-metadata-handler';

describe('UpdateMetadataHandler', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handler: UpdateMetadataHandler;
  let processor: IngestEntityProcessor;
  let step1: ingest_item_steps.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;

  const createMessage = (
    payload: UpdateMetadataCommand,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<UpdateMetadataCommand>>({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId);
    processor = new MockIngestProcessor();
    processor.updateMetadata = jest.fn();
    handler = new UpdateMetadataHandler([processor], ctx.config);
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
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('onMessage', () => {
    it('message succeeded without errors -> message without error sent', async () => {
      // Arrange
      const payload = {
        item: { type: 'MOVIE' },
      } as unknown as UpdateMetadataCommand;
      const context = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload, context), dbCtx),
      );

      // Assert
      expect(processor.updateMetadata).toHaveBeenCalledWith(
        payload,
        expect.any(Object),
        undefined,
      );
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(step?.status).toEqual('SUCCESS');
    });

    it('message with existing LOCALIZATIONS step succeeded without errors -> message without error sent', async () => {
      // Arrange
      const item: IngestItem = {
        type: 'MOVIE',
        external_id: 'externalId',
        data: { title: 'title' },
      };
      const payload = {
        item,
      } as unknown as UpdateMetadataCommand;

      await insert('ingest_item_steps', {
        id: uuid(),
        type: 'LOCALIZATIONS',
        ingest_item_id: item1.id,
        sub_type: '',
      }).run(ctx.ownerPool);
      const context = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload, context), dbCtx),
      );

      // Assert
      expect(processor.updateMetadata).toHaveBeenCalledWith(
        payload,
        expect.any(Object),
        item1.id, // Ingest item ID is passed as ingest_correlation_id
      );
      const updatedStep = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(updatedStep?.status).toEqual('SUCCESS');
    });
  });

  describe('onMessageFailure', () => {
    it('message failed on all retries with non-ingest error -> message with ingest_item_step_id and generic errorMessage sent', async () => {
      // Arrange
      const payload: UpdateMetadataCommand = stub<UpdateMetadataCommand>({
        item: { type: 'MOVIE' },
      });
      const context = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
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
        'Unexpected error occurred while updating metadata.',
      );
      expect(step?.status).toEqual('ERROR');
    });

    it('message failed on all retries with ingest error -> message with ingest_item_step_id and genre update errorMessage sent', async () => {
      // Arrange
      const payload: UpdateMetadataCommand = stub<UpdateMetadataCommand>({
        item: { type: 'MOVIE' },
      });
      const errorMessage =
        'Metadata update has failed because following genres do not exist: Non-existent1, Non-existent2';
      const context = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleErrorMessage(
          new MosaicError({
            message: errorMessage,
            code: CommonErrors.IngestError.code,
          }),
          createMessage(payload, context),
          dbCtx,
          false,
        ),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(step?.response_message).toEqual(errorMessage);
      expect(step?.status).toEqual('ERROR');
    });
  });
});
