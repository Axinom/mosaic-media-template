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
import { Config } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import { LOCALIZATION_COLLECTION_TYPE } from './constants';
import {
  LocalizableCollectionImageCreatedDbMessageHandler,
  LocalizableCollectionImageDbEvent,
  LocalizableCollectionImageDeletedDbMessageHandler,
  LocalizableCollectionImageUpdatedDbMessageHandler,
} from './localizable-collection-image-db-message-handlers';

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

describe('Localizable Collection Image DB trigger events', () => {
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
    payload: LocalizableCollectionImageDbEvent,
    messageContext?: unknown,
  ) =>
    stub<TransactionalInboxMessage<LocalizableCollectionImageDbEvent>>({
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
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe('LocalizableCollectionImageCreatedDbMessageHandler', () => {
    let handler: LocalizableCollectionImageCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableCollectionImageCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('collection cover is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableCollectionImageDbEvent = {
        collection_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.collection_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_COLLECTION_TYPE,
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

    it('collection teaser is inserted -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableCollectionImageDbEvent = {
        collection_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });
  });

  describe('LocalizableCollectionImageUpdatedDbMessageHandler', () => {
    let handler: LocalizableCollectionImageUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableCollectionImageUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('collection cover is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableCollectionImageDbEvent = {
        collection_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.collection_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_COLLECTION_TYPE,
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

    it('collection teaser is updated -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableCollectionImageDbEvent = {
        collection_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });

    it('collection cover is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableCollectionImageDbEvent = {
        collection_id: 1,
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
            entity_id: payload.collection_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_COLLECTION_TYPE,
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

  describe('LocalizableCollectionImageDeletedDbMessageHandler', () => {
    let handler: LocalizableCollectionImageDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableCollectionImageDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('collection cover is deleted and collection still exists -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableCollectionImageDbEvent = {
        collection_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      jest
        .spyOn(handler, 'collectionIsDeleted')
        .mockImplementation(async () => false);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.collection_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_COLLECTION_TYPE,
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

    it('collection cover is deleted as part of collection cascade delete -> message not sent as collection delete message is enough', async () => {
      // Arrange
      const payload: LocalizableCollectionImageDbEvent = {
        collection_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      jest
        .spyOn(handler, 'collectionIsDeleted')
        .mockImplementation(async () => true);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });

    it('collection teaser is deleted and collection still exists -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableCollectionImageDbEvent = {
        collection_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      jest
        .spyOn(handler, 'collectionIsDeleted')
        .mockImplementation(async () => false);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });
  });
});
