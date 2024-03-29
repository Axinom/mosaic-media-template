import { optional } from '@axinom/mosaic-db-common';
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
import { Config } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import { LOCALIZATION_TVSHOW_GENRE_TYPE } from './constants';
import {
  LocalizableTvshowGenreCreatedDbMessageHandler,
  LocalizableTvshowGenreDbEvent,
  LocalizableTvshowGenreDeletedDbMessageHandler,
  LocalizableTvshowGenreUpdatedDbMessageHandler,
} from './localizable-tvshow-genre-db-message-handlers';

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

describe('Localizable Tvshow Genre DB trigger events', () => {
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

  const createMessage = (
    payload: LocalizableTvshowGenreDbEvent,
    messageContext?: unknown,
  ) =>
    stub<TypedTransactionalMessage<LocalizableTvshowGenreDbEvent>>({
      payload,
      ...optional(messageContext, () => ({ metadata: { messageContext } })),
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

  describe('LocalizableTvshowGenreCreatedDbMessageHandler', () => {
    let handler: LocalizableTvshowGenreCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableTvshowGenreCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('tvshow genre is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableTvshowGenreDbEvent = {
        id: 1,
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
            entity_type: LOCALIZATION_TVSHOW_GENRE_TYPE,
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
  });

  describe('LocalizableTvshowGenreUpdatedDbMessageHandler', () => {
    let handler: LocalizableTvshowGenreUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableTvshowGenreUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('tvshow genre is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableTvshowGenreDbEvent = {
        id: 1,
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
            entity_type: LOCALIZATION_TVSHOW_GENRE_TYPE,
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

    it('tvshow genre is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableTvshowGenreDbEvent = {
        id: 1,
        title: 'Test Title',
      };
      const context = {
        potentialContextProperty: 'test',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload, context),
        stub<ClientBase>(),
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: payload.title,
            entity_type: LOCALIZATION_TVSHOW_GENRE_TYPE,
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
            message_context: context,
          },
          options: {
            routingKey: `ax-localization-service.${config.tenantId}.${config.environmentId}.localization_source_entity.upsert`,
          },
        },
      ]);
    });
  });

  describe('LocalizableTvshowGenreDeletedDbMessageHandler', () => {
    let handler: LocalizableTvshowGenreDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableTvshowGenreDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('tvshow genre is deleted -> delete message data is sent', async () => {
      // Arrange
      const payload: LocalizableTvshowGenreDbEvent = {
        id: 1,
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_type: LOCALIZATION_TVSHOW_GENRE_TYPE,
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
