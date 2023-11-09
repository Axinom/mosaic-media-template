import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { EnsureImageExistsFailedEvent } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand } from 'media-messages';
import { createTestConfig } from '../../tests/test-utils';
import { ImageFailedHandler } from './image-failed-handler';

describe('ImageFailedHandler', () => {
  let handler: ImageFailedHandler;
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
    const broker = stub<Broker>({
      publish: (
        _id: string,
        _settings: unknown,
        message: CheckFinishIngestItemCommand,
      ) => {
        messages.push(message);
      },
    });
    handler = new ImageFailedHandler(broker, createTestConfig());
  });

  afterEach(async () => {
    messages = [];
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message received -> message with error ingestItemStepId sent', async () => {
      // Arrange
      const content: EnsureImageExistsFailedEvent = {
        message: 'Test error message',
        image_location: 'Test',
        image_type: 'movie_cover',
      };
      const message = createMessage({
        ingestItemStepId: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingestItemId: 1,
        imageType: 'MAIN',
      });

      // Act
      await handler.onMessage(content, message);

      // Assert
      expect(messages[0]).toEqual<CheckFinishIngestItemCommand>({
        ingest_item_step_id: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingest_item_id: 1,
        error_message: 'Test error message',
      });
    });
  });
});
