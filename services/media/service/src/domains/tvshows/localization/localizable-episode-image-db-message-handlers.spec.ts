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
import { LOCALIZATION_EPISODE_TYPE } from './constants';
import {
  LocalizableEpisodeImageCreatedDbMessageHandler,
  LocalizableEpisodeImageDbEvent,
  LocalizableEpisodeImageDeletedDbMessageHandler,
  LocalizableEpisodeImageUpdatedDbMessageHandler,
} from './localizable-episode-image-db-message-handlers';

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

describe('Localizable Episode Image DB trigger events', () => {
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
    payload: LocalizableEpisodeImageDbEvent,
    messageContext?: unknown,
  ) =>
    stub<TypedTransactionalMessage<LocalizableEpisodeImageDbEvent>>({
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

  describe('LocalizableEpisodeImageCreatedDbMessageHandler', () => {
    let handler: LocalizableEpisodeImageCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableEpisodeImageCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('episode cover is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableEpisodeImageDbEvent = {
        episode_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.episode_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_EPISODE_TYPE,
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

    it('episode teaser is inserted -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableEpisodeImageDbEvent = {
        episode_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });
  });

  describe('LocalizableEpisodeImageUpdatedDbMessageHandler', () => {
    let handler: LocalizableEpisodeImageUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableEpisodeImageUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('episode cover is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableEpisodeImageDbEvent = {
        episode_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.episode_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_EPISODE_TYPE,
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

    it('episode teaser is updated -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableEpisodeImageDbEvent = {
        episode_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });

    it('episode cover is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableEpisodeImageDbEvent = {
        episode_id: 1,
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
            entity_id: payload.episode_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_EPISODE_TYPE,
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

  describe('LocalizableEpisodeImageDeletedDbMessageHandler', () => {
    let handler: LocalizableEpisodeImageDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableEpisodeImageDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('episode cover is deleted and episode still exists -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableEpisodeImageDbEvent = {
        episode_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      jest
        .spyOn(handler, 'episodeIsDeleted')
        .mockImplementation(async () => false);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.episode_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_EPISODE_TYPE,
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

    it('episode cover is deleted as part of episode cascade delete -> message not sent as episode delete message is enough', async () => {
      // Arrange
      const payload: LocalizableEpisodeImageDbEvent = {
        episode_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      jest
        .spyOn(handler, 'episodeIsDeleted')
        .mockImplementation(async () => true);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });

    it('episode teaser is deleted and episode still exists -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableEpisodeImageDbEvent = {
        episode_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      jest
        .spyOn(handler, 'episodeIsDeleted')
        .mockImplementation(async () => false);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });
  });
});
