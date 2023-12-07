import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { LocalizeEntityFinishedEvent } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand } from 'media-messages';
import { Config } from '../../common';
import { createTestConfig } from '../../tests/test-utils';
import { LocalizeEntityFinishedHandler } from './localize-entity-finished-handler';

describe('LocalizeEntityFinishedHandler', () => {
  let handler: LocalizeEntityFinishedHandler;
  let messages: CheckFinishIngestItemCommand[] = [];
  let config: Config;

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
    config = createTestConfig();
    handler = new LocalizeEntityFinishedHandler(broker, config);
  });

  afterEach(async () => {
    messages = [];
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message received -> check ingest item message without error sent', async () => {
      // Arrange
      const content: LocalizeEntityFinishedEvent = {
        service_id: config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
        skipped_language_tags: [],
        processed_language_tags: ['de-DE'],
      };
      const message = createMessage({
        ingestItemStepId: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingestItemId: 1,
        imageType: 'MAIN',
      });

      // Act
      await handler.onMessage(content, message);

      // Assert
      expect(messages).toHaveLength(1);
      expect(messages[0]).toEqual<CheckFinishIngestItemCommand>({
        ingest_item_step_id: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingest_item_id: 1,
      });
    });
  });
});
