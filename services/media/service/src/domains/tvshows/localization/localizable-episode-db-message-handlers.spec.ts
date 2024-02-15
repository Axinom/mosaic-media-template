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
  TransactionalInboxMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { ClientBase } from 'pg';
import { PublicationConfig } from 'rascal';
import { SQLFragment } from 'zapatos/db';
import { Config } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import { LOCALIZATION_EPISODE_TYPE } from './constants';
import {
  LocalizableEpisodeCreatedDbMessageHandler,
  LocalizableEpisodeDbEvent,
  LocalizableEpisodeDeletedDbMessageHandler,
  LocalizableEpisodeUpdatedDbMessageHandler,
} from './localizable-episode-db-message-handlers';

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

let seasonSelectResult: () => unknown = () => undefined;
jest.mock('zapatos/db', () => {
  return {
    ...jest.requireActual('zapatos/db'),
    selectOne: jest.fn().mockImplementation(() => {
      return stub<SQLFragment>({
        run: jest.fn().mockImplementation(() => {
          return seasonSelectResult();
        }),
      });
    }),
  };
});

describe('Localizable Episode DB trigger events', () => {
  let messages: {
    payload:
      | DeleteLocalizationSourceEntityCommand
      | UpsertLocalizationSourceEntityCommand;
    settings: MessagingSettings;
    overrides: MessageEnvelopeOverrides | undefined;
    options: PublicationConfig | undefined;
  }[] = [];
  let storeOutboxMessage: StoreOutboxMessage;
  let config: Config;

  const createMessage = (
    payload: LocalizableEpisodeDbEvent,
    messageContext?: unknown,
  ) =>
    stub<TransactionalInboxMessage<LocalizableEpisodeDbEvent>>({
      payload,
      ...optional(messageContext, () => ({ metadata: { messageContext } })),
    });

  beforeAll(() => {
    storeOutboxMessage = jest.fn(
      async (
        _aggregateId,
        messagingSettings,
        message,
        _client,
        envelopeOverrides,
        options,
      ) => {
        messages.push({
          payload: message as
            | DeleteLocalizationSourceEntityCommand
            | UpsertLocalizationSourceEntityCommand,
          settings: messagingSettings,
          overrides: envelopeOverrides,
          options,
        });
        return Promise.resolve(stub<any>()); // TODO: Change any to TransactionalMessage when mosaic libs are updated
      },
    );
    config = createTestConfig();
  });

  afterEach(async () => {
    messages = [];
    seasonSelectResult = () => undefined;
    jest.restoreAllMocks();
  });

  describe('LocalizableEpisodeCreatedDbMessageHandler', () => {
    let handler: LocalizableEpisodeCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableEpisodeCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('episode is inserted without season relation -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableEpisodeDbEvent = {
        id: 1,
        index: 2,
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
            entity_title: `Episode ${payload.index}: ${payload.title}`,
            entity_type: LOCALIZATION_EPISODE_TYPE,
            fields: {
              title: payload.title,
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

    it('episode is inserted with season relation -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableEpisodeDbEvent = {
        id: 1,
        index: 2,
        season_id: 3,
        title: 'Test Title',
        description: 'Test Description',
      };
      seasonSelectResult = () => ({ index: 4 });

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: `Episode ${payload.index}: ${payload.title} (Season 4)`,
            entity_type: LOCALIZATION_EPISODE_TYPE,
            fields: {
              title: payload.title,
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

    it('episode is inserted with season and tvshow relation -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableEpisodeDbEvent = {
        id: 1,
        index: 2,
        season_id: 3,
        title: 'Test Title',
        description: 'Test Description',
      };
      seasonSelectResult = () => ({
        index: 4,
        tvshow: { title: 'The Title of the TV Show' },
      });

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: `Episode ${payload.index}: ${payload.title} (Season 4, The Title of the TV Show)`,
            entity_type: LOCALIZATION_EPISODE_TYPE,
            fields: {
              title: payload.title,
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

  describe('LocalizableEpisodeUpdatedDbMessageHandler', () => {
    let handler: LocalizableEpisodeUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableEpisodeUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('episode is updated with season relation -> upsert message data is sent with empty fields', async () => {
      // Arrange
      const payload: LocalizableEpisodeDbEvent = {
        id: 1,
        index: 2,
        season_id: 3,
      };
      seasonSelectResult = () => ({ index: 4 });

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: `Episode ${payload.index} (Season 4)`,
            entity_type: LOCALIZATION_EPISODE_TYPE,
            fields: {},
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

    it('episode is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableEpisodeDbEvent = {
        id: 1,
        index: 2,
        description: 'Test Description',
        synopsis: 'Test Synopsis',
      };
      const context = {
        ingestItemId: 4,
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
            entity_title: `Episode ${payload.index}`,
            entity_type: LOCALIZATION_EPISODE_TYPE,
            fields: {
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
            message_context: context,
          },
          options: {
            routingKey: `ax-localization-service.${config.tenantId}.${config.environmentId}.localization_source_entity.upsert`,
          },
        },
      ]);
    });
  });

  describe('LocalizableEpisodeDeletedDbMessageHandler', () => {
    let handler: LocalizableEpisodeDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableEpisodeDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('episode is deleted -> delete message data is sent', async () => {
      // Arrange
      const payload: LocalizableEpisodeDbEvent = {
        id: 1,
        index: 2,
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_type: LOCALIZATION_EPISODE_TYPE,
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
