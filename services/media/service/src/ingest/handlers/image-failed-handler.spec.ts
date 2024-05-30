import { EnsureImageExistsFailedEvent } from '@axinom/mosaic-messages';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand } from 'media-messages';
import { ClientBase } from 'pg';
import { createTestConfig } from '../../tests/test-utils';
import { ImageFailedHandler } from './image-failed-handler';

describe('ImageFailedHandler', () => {
  let handler: ImageFailedHandler;
  let messages: CheckFinishIngestItemCommand[] = [];

  const createMessage = (
    payload: EnsureImageExistsFailedEvent,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<EnsureImageExistsFailedEvent>>({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(async () => {
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, _messagingSettings, message) => {
        messages.push(message as CheckFinishIngestItemCommand);
      },
    );
    handler = new ImageFailedHandler(storeOutboxMessage, createTestConfig());
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
      const payload: EnsureImageExistsFailedEvent = {
        message: 'Test error message',
        image_location: 'Test',
        image_type: 'movie_cover',
      };
      const context = {
        ingestItemStepId: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingestItemId: 1,
        imageType: 'MAIN',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload, context),
        stub<ClientBase>(),
      );

      // Assert
      expect(messages).toHaveLength(1);
      expect(messages[0]).toEqual<CheckFinishIngestItemCommand>({
        ingest_item_step_id: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingest_item_id: 1,
        error_message: 'Test error message',
      });
    });
  });
});
