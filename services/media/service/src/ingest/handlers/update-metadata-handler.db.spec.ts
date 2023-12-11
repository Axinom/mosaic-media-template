import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { MosaicError } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  CheckFinishIngestItemCommand,
  IngestItem,
  UpdateMetadataCommand,
} from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert } from 'zapatos/db';
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
  let handler: UpdateMetadataHandler;
  let messages: CheckFinishIngestItemCommand[] = [];
  let processor: IngestEntityProcessor;
  let user: AuthenticatedManagementSubject;

  const createMessage = (messageContext: unknown = {}): MessageInfo => {
    return stub<MessageInfo>({
      envelope: {
        auth_token:
          'some token value which is not used because we are substituting getPgSettings method and using a stub user',
        message_context: messageContext,
      },
    });
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    const broker = stub<Broker>({
      publish: (
        _id: string,
        _settings: unknown,
        message: CheckFinishIngestItemCommand,
      ) => {
        messages.push(message);
      },
    });
    user = createTestUser(ctx.config.serviceId);
    processor = new MockIngestProcessor();
    processor.updateMetadata = jest.fn();
    handler = new UpdateMetadataHandler(
      [processor],
      broker,
      ctx.loginPool,
      ctx.config,
    );
  });

  beforeEach(async () => {
    jest
      .spyOn<any, string>(handler, 'getSubject')
      .mockImplementation(() => user);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
    messages = [];
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('onMessage', () => {
    it('message succeeded without errors -> message without error sent', async () => {
      // Arrange
      const content = {
        item: { type: 'MOVIE' },
      } as UpdateMetadataCommand;
      const message = createMessage({
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: 1,
      });

      // Act
      await handler.onMessage(content, message);

      // Assert
      expect(messages).toEqual<CheckFinishIngestItemCommand[]>([
        {
          ingest_item_step_id: '8331d916-575e-4555-99da-ac820d456a7b',
          ingest_item_id: 1,
        },
      ]);
      expect(processor.updateMetadata).toHaveBeenCalledWith(
        content,
        expect.any(Object),
        undefined,
      );
    });

    it('message with existing LOCALIZATIONS step succeeded without errors -> message without error sent', async () => {
      // Arrange
      const item: IngestItem = {
        type: 'MOVIE',
        external_id: 'externalId',
        data: { title: 'title' },
      };
      const content = {
        item,
      } as UpdateMetadataCommand;
      const doc = await insert('ingest_documents', {
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
      const ingestItem = await insert('ingest_items', {
        ingest_document_id: doc.id,
        external_id: 'externalId',
        entity_id: 1,
        type: 'MOVIE',
        exists_status: 'CREATED',
        display_title: 'title',
        item,
      }).run(ctx.ownerPool);

      const step = await insert('ingest_item_steps', {
        id: uuid(),
        type: 'LOCALIZATIONS',
        ingest_item_id: ingestItem.id,
        sub_type: '',
      }).run(ctx.ownerPool);
      const message = createMessage({
        ingestItemStepId: step.id,
        ingestItemId: ingestItem.id,
      });

      // Act
      await handler.onMessage(content, message);

      // Assert
      expect(messages).toEqual<CheckFinishIngestItemCommand[]>([
        {
          ingest_item_step_id: step.id,
          ingest_item_id: ingestItem.id,
        },
      ]);
      expect(processor.updateMetadata).toHaveBeenCalledWith(
        content,
        expect.any(Object),
        ingestItem.id,
      );
    });
  });

  describe('onMessageFailure', () => {
    it('message failed on all retries with non-ingest error -> message with ingest_item_step_id and generic errorMessage sent', async () => {
      // Arrange
      const content: UpdateMetadataCommand = stub<UpdateMetadataCommand>({
        item: { type: 'MOVIE' },
      });
      const message = createMessage({
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: 1,
      });

      // Act
      await handler.onMessageFailure(content, message, new Error('test error'));

      // Assert
      expect(messages).toEqual<CheckFinishIngestItemCommand[]>([
        {
          ingest_item_step_id: '8331d916-575e-4555-99da-ac820d456a7b',
          ingest_item_id: 1,
          error_message: 'Unexpected error occurred while updating metadata.',
        },
      ]);
    });
    it('message failed on all retries with ingest error -> message with ingest_item_step_id and genre update errorMessage sent', async () => {
      // Arrange
      const content: UpdateMetadataCommand = stub<UpdateMetadataCommand>({
        item: { type: 'MOVIE' },
      });
      const errorMessage =
        'Metadata update has failed because following genres do not exist: Non-existent1, Non-existent2';
      const message = createMessage({
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: 1,
      });

      // Act
      await handler.onMessageFailure(
        content,
        message,
        new MosaicError({
          message: errorMessage,
          code: CommonErrors.IngestError.code,
        }),
      );

      // Assert
      expect(messages).toEqual<CheckFinishIngestItemCommand[]>([
        {
          ingest_item_step_id: '8331d916-575e-4555-99da-ac820d456a7b',
          ingest_item_id: 1,
          error_message: errorMessage,
        },
      ]);
    });
  });
});
