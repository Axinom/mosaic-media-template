import { SubjectType } from '@axinom/mosaic-id-guard';
import { TokenResult } from '@axinom/mosaic-id-link-be';
import { MessageEnvelopeOverrides } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import {
  DeleteLocalizationSourceEntityCommand,
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
} from '@axinom/mosaic-messages';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { ClientBase } from 'pg';
import { PublicationConfig } from 'rascal';
import { Config, LOCALIZATION_CHANNEL_TYPE } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import {
  LocalizableChannelCreatedDbMessageHandler,
  LocalizableChannelDbEvent,
  LocalizableChannelDeletedDbMessageHandler,
  LocalizableChannelUpdatedDbMessageHandler,
} from './localizable-channel-db-message-handlers';

const serviceAccountToken = 'SERVICE_ACCOUNT_TOKEN';
jest.mock('@axinom/mosaic-id-link-be', () => {
  const originalModule = jest.requireActual('@axinom/mosaic-id-link-be');
  return {
    __esModule: true,
    ...originalModule,
    getServiceAccountToken: jest.fn(() =>
      Promise.resolve<TokenResult>({
        accessToken: serviceAccountToken,
        expiresInSeconds: 600,
        tokenType: SubjectType.ManagedServiceAccount,
      }),
    ),
  };
});

describe('Localizable Channel DB trigger events', () => {
  let messages: {
    payload:
      | DeleteLocalizationSourceEntityCommand
      | UpsertLocalizationSourceEntityCommand;
    settings: Pick<MessagingSettings, 'aggregateType' | 'messageType'>;
    overrides: MessageEnvelopeOverrides | undefined;
    options: PublicationConfig | undefined;
  }[] = [];
  let storeOutboxMessage: StoreOutboxMessage;
  let config: Config;

  const createMessage = (payload: LocalizableChannelDbEvent) =>
    stub<TypedTransactionalMessage<LocalizableChannelDbEvent>>({
      payload,
    });

  beforeAll(() => {
    storeOutboxMessage = jest.fn(
      async (_aggregateId, messagingSettings, message, _client, data) => {
        messages.push({
          payload: message as
            | DeleteLocalizationSourceEntityCommand
            | UpsertLocalizationSourceEntityCommand,
          settings: messagingSettings,
          overrides: data?.envelopeOverrides,
          options: data?.options,
        });
      },
    );
    config = createTestConfig();
  });

  afterEach(async () => {
    messages = [];
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe('LocalizableChannelCreatedDbMessageHandler', () => {
    let handler: LocalizableChannelCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableChannelCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('channel is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableChannelDbEvent = {
        id: '00000000-0000-0000-0000-000000000009',
        title: 'Test Title',
        description: 'Test Description',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: payload.title,
            entity_type: LOCALIZATION_CHANNEL_TYPE,
            fields: {
              description: payload.description,
              title: payload.title,
            },
            image_id: undefined,
            service_id: config.serviceId,
          },
          settings:
            LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
          overrides: {
            auth_token: serviceAccountToken,
          },
          options: {
            routingKey: `ax-localization-service.${config.tenantId}.${config.environmentId}.localization_source_entity.upsert`,
          },
        },
      ]);
    });
  });

  describe('LocalizableChannelUpdatedDbMessageHandler', () => {
    let handler: LocalizableChannelUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableChannelUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('channel is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableChannelDbEvent = {
        id: '00000000-0000-0000-0000-000000000009',
        title: 'Test Title',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: payload.title,
            entity_type: LOCALIZATION_CHANNEL_TYPE,
            fields: {
              title: payload.title,
            },
            image_id: undefined,
            service_id: config.serviceId,
          },
          settings:
            LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
          overrides: {
            auth_token: serviceAccountToken,
          },
          options: {
            routingKey: `ax-localization-service.${config.tenantId}.${config.environmentId}.localization_source_entity.upsert`,
          },
        },
      ]);
    });

    it('channel is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableChannelDbEvent = {
        id: '00000000-0000-0000-0000-000000000009',
        title: 'Test Title',
        description: 'Test Description',
        synopsis: 'Test Synopsis',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: payload.title,
            entity_type: LOCALIZATION_CHANNEL_TYPE,
            fields: {
              title: payload.title,
              synopsis: payload.synopsis,
              description: payload.description,
            },
            image_id: undefined,
            service_id: config.serviceId,
          },
          settings:
            LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
          overrides: {
            auth_token: serviceAccountToken,
          },
          options: {
            routingKey: `ax-localization-service.${config.tenantId}.${config.environmentId}.localization_source_entity.upsert`,
          },
        },
      ]);
    });
  });

  describe('LocalizableChannelDeletedDbMessageHandler', () => {
    let handler: LocalizableChannelDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableChannelDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('channel is deleted -> delete message data is sent', async () => {
      // Arrange
      const payload: LocalizableChannelDbEvent = {
        id: '00000000-0000-0000-0000-000000000009',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_type: LOCALIZATION_CHANNEL_TYPE,
            service_id: config.serviceId,
          },
          settings:
            LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
          overrides: {
            auth_token: serviceAccountToken,
          },
          options: {
            routingKey: `ax-localization-service.${config.tenantId}.${config.environmentId}.localization_source_entity.delete`,
          },
        },
      ]);
    });
  });
});
