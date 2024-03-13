import { EnsureVideoExistsFailedEvent } from '@axinom/mosaic-messages';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand } from 'media-messages';
import { ClientBase } from 'pg';
import { createTestConfig } from '../../tests/test-utils';
import { VideoFailedHandler } from './video-failed-handler';

describe('VideoFailedHandler', () => {
  let handler: VideoFailedHandler;
  let messages: CheckFinishIngestItemCommand[] = [];

  const createMessage = (
    payload: EnsureVideoExistsFailedEvent,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<EnsureVideoExistsFailedEvent>>({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(() => {
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, _messagingSettings, message) => {
        messages.push(message as CheckFinishIngestItemCommand);
      },
    );

    handler = new VideoFailedHandler(storeOutboxMessage, createTestConfig());
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
      const payload: EnsureVideoExistsFailedEvent = {
        message: 'Test error message',
        video_location: 'Test',
        video_profile: 'DEFAULT',
      };
      const context = {
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: 1,
        videoType: 'MAIN',
      };

      // Act
      handler.handleMessage(
        createMessage(payload, context),
        stub<ClientBase>(),
      );

      // Assert
      expect(messages[0]).toEqual<CheckFinishIngestItemCommand>({
        ingest_item_step_id: '8331d916-575e-4555-99da-ac820d456a7b',
        ingest_item_id: 1,
        error_message: 'Test error message',
      });
    });
  });
});
