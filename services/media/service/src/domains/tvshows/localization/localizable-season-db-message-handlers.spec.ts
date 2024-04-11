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
import { SQLFragment } from 'zapatos/db';
import { Config } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import { LOCALIZATION_SEASON_TYPE } from './constants';
import {
  LocalizableSeasonCreatedDbMessageHandler,
  LocalizableSeasonDbEvent,
  LocalizableSeasonDeletedDbMessageHandler,
  LocalizableSeasonUpdatedDbMessageHandler,
} from './localizable-season-db-message-handlers';

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

let tvshowSelectResult: () => unknown = () => undefined;
jest.mock('zapatos/db', () => {
  return {
    ...jest.requireActual('zapatos/db'),
    selectOne: jest.fn().mockImplementation(() => {
      return stub<SQLFragment>({
        run: jest.fn().mockImplementation(() => {
          return tvshowSelectResult();
        }),
      });
    }),
  };
});

describe('Localizable Season DB trigger events', () => {
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
    payload: LocalizableSeasonDbEvent,
    messageContext?: unknown,
  ) =>
    stub<TypedTransactionalMessage<LocalizableSeasonDbEvent>>({
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
    tvshowSelectResult = () => undefined;
    jest.restoreAllMocks();
  });

  describe('LocalizableSeasonCreatedDbMessageHandler', () => {
    let handler: LocalizableSeasonCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableSeasonCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('season is inserted without tvshow relation -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableSeasonDbEvent = {
        id: 1,
        index: 2,
        description: 'Test Description',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: `Season ${payload.index}`,
            entity_type: LOCALIZATION_SEASON_TYPE,
            fields: {
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

    it('season is inserted with tvshow relation -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableSeasonDbEvent = {
        id: 1,
        index: 2,
        tvshow_id: 3,
        description: 'Test Description',
      };
      tvshowSelectResult = () => ({ title: 'The Title of the TV Show' });

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: `Season ${payload.index} (The Title of the TV Show)`,
            entity_type: LOCALIZATION_SEASON_TYPE,
            fields: {
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

  describe('LocalizableSeasonUpdatedDbMessageHandler', () => {
    let handler: LocalizableSeasonUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableSeasonUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('season is updated with tvshow relation -> upsert message data is sent with empty fields', async () => {
      // Arrange
      const payload: LocalizableSeasonDbEvent = {
        id: 1,
        index: 2,
        tvshow_id: 3,
      };
      tvshowSelectResult = () => ({ title: 'The Title of the TV Show' });

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: `Season ${payload.index} (The Title of the TV Show)`,
            entity_type: LOCALIZATION_SEASON_TYPE,
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

    it('season is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableSeasonDbEvent = {
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
            entity_title: `Season ${payload.index}`,
            entity_type: LOCALIZATION_SEASON_TYPE,
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

  describe('LocalizableSeasonDeletedDbMessageHandler', () => {
    let handler: LocalizableSeasonDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableSeasonDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('season is deleted -> delete message data is sent', async () => {
      // Arrange
      const payload: LocalizableSeasonDbEvent = {
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
            entity_type: LOCALIZATION_SEASON_TYPE,
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
