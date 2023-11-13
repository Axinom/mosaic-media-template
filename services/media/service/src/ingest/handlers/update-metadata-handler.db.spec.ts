import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { MosaicError } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  CheckFinishIngestItemCommand,
  UpdateMetadataCommand,
} from 'media-messages';
import { CommonErrors } from '../../common';
import { MockIngestProcessor } from '../../tests/ingest/mock-ingest-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { UpdateMetadataHandler } from './update-metadata-handler';

describe('UpdateMetadataHandler', () => {
  let ctx: ITestContext;
  let handler: UpdateMetadataHandler;
  let messages: CheckFinishIngestItemCommand[] = [];

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
    const user = createTestUser(ctx.config.serviceId);
    handler = new UpdateMetadataHandler(
      [new MockIngestProcessor()],
      broker,
      ctx.loginPool,
      ctx.config,
    );

    jest
      .spyOn<any, string>(handler, 'getSubject')
      .mockImplementation(() => user);
  });

  afterEach(async () => {
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message succeeded without errors -> message without error sent', async () => {
      // Arrange
      const content: UpdateMetadataCommand = stub<UpdateMetadataCommand>({
        item: { type: 'MOVIE' },
      });
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
