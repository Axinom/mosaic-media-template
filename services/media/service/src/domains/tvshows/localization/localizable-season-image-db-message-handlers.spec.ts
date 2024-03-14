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
import { LOCALIZATION_SEASON_TYPE } from './constants';
import {
  LocalizableSeasonImageCreatedDbMessageHandler,
  LocalizableSeasonImageDbEvent,
  LocalizableSeasonImageDeletedDbMessageHandler,
  LocalizableSeasonImageUpdatedDbMessageHandler,
} from './localizable-season-image-db-message-handlers';

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

describe('Localizable Season Image DB trigger events', () => {
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
    payload: LocalizableSeasonImageDbEvent,
    messageContext?: unknown,
  ) =>
    stub<TypedTransactionalMessage<LocalizableSeasonImageDbEvent>>({
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

  describe('LocalizableSeasonImageCreatedDbMessageHandler', () => {
    let handler: LocalizableSeasonImageCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableSeasonImageCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('season cover is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableSeasonImageDbEvent = {
        season_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.season_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_SEASON_TYPE,
            fields: {},
            image_id: payload.image_id,
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

    it('season teaser is inserted -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableSeasonImageDbEvent = {
        season_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });
  });

  describe('LocalizableSeasonImageUpdatedDbMessageHandler', () => {
    let handler: LocalizableSeasonImageUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableSeasonImageUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('season cover is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableSeasonImageDbEvent = {
        season_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.season_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_SEASON_TYPE,
            fields: {},
            image_id: payload.image_id,
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

    it('season teaser is updated -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableSeasonImageDbEvent = {
        season_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });

    it('season cover is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableSeasonImageDbEvent = {
        season_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
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
            entity_id: payload.season_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_SEASON_TYPE,
            fields: {},
            image_id: payload.image_id,
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

  describe('LocalizableSeasonImageDeletedDbMessageHandler', () => {
    let handler: LocalizableSeasonImageDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableSeasonImageDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('season cover is deleted and season still exists -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableSeasonImageDbEvent = {
        season_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      jest
        .spyOn(handler, 'seasonIsDeleted')
        .mockImplementation(async () => false);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.season_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_SEASON_TYPE,
            fields: {},
            image_id: null,
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

    it('season cover is deleted as part of season cascade delete -> message not sent as season delete message is enough', async () => {
      // Arrange
      const payload: LocalizableSeasonImageDbEvent = {
        season_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      jest
        .spyOn(handler, 'seasonIsDeleted')
        .mockImplementation(async () => true);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });

    it('season teaser is deleted and season still exists -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableSeasonImageDbEvent = {
        season_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      jest
        .spyOn(handler, 'seasonIsDeleted')
        .mockImplementation(async () => false);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });
  });
});
