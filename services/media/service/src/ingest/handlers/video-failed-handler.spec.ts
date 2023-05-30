import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { EnsureVideoExistsFailedEvent } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand } from 'media-messages';
import { createTestConfig } from '../../tests/test-utils';
import { VideoFailedHandler } from './video-failed-handler';

describe('VideoFailedHandler', () => {
  let handler: VideoFailedHandler;
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

  beforeAll(() => {
    const broker = stub<Broker>({
      publish: (_key: string, message: CheckFinishIngestItemCommand) => {
        messages.push(message);
      },
    });
    handler = new VideoFailedHandler(broker, createTestConfig());
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
      const content: EnsureVideoExistsFailedEvent = {
        message: 'Test error message',
        video_location: 'Test',
        video_profile: 'DEFAULT',
      };
      const message = createMessage({
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: 1,
        videoType: 'MAIN',
      });

      // Act
      await handler.onMessage(content, message);

      // Assert
      expect(messages[0]).toEqual<CheckFinishIngestItemCommand>({
        ingest_item_step_id: '8331d916-575e-4555-99da-ac820d456a7b',
        ingest_item_id: 1,
        error_message: 'Test error message',
      });
    });
  });
});
