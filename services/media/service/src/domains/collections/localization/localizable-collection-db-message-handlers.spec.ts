const { serviceAccountToken } = vi.hoisted(() => ({
  serviceAccountToken: 'SERVICE_ACCOUNT_TOKEN',
}));

vi.mock('@axinom/mosaic-id-link-be', async () => {
  const originalModule = await vi.importActual<
    typeof import('@axinom/mosaic-id-link-be')
  >('@axinom/mosaic-id-link-be');
  return {
    ...originalModule,
    getServiceAccountToken: vi.fn(() =>
      Promise.resolve<TokenResult>({
        accessToken: serviceAccountToken,
        expiresInSeconds: 600,
        tokenType: SubjectType.ServiceAccount,
      }),
    ),
    generateLongLivedToken: vi.fn(() =>
      Promise.resolve<TokenResult>({
        accessToken: serviceAccountToken,
        expiresInSeconds: 600,
        tokenType: SubjectType.ServiceAccount,
      }),
    ),
  };
});

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

import { ClientBase } from 'pg';
import { PublicationConfig } from 'rascal';
import { Config } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import { LOCALIZATION_COLLECTION_TYPE } from './constants';
import {
  LocalizableCollectionCreatedDbMessageHandler,
  LocalizableCollectionDbEvent,
  LocalizableCollectionDeletedDbMessageHandler,
  LocalizableCollectionUpdatedDbMessageHandler,
} from './localizable-collection-db-message-handlers';

describe('Localizable Collection DB trigger events', () => {
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
    payload: LocalizableCollectionDbEvent,
    messageContext?: unknown,
  ) =>
    ({
      payload,
      ...optional(messageContext, () => ({ metadata: { messageContext } })),
    }) satisfies Partial<
      Omit<TypedTransactionalMessage<LocalizableCollectionDbEvent>, 'metadata'>
    > & {
      metadata?: Partial<
        TypedTransactionalMessage<LocalizableCollectionDbEvent>['metadata']
      >;
    } as unknown as TypedTransactionalMessage<LocalizableCollectionDbEvent>;

  beforeAll(() => {
    storeOutboxMessage = vi.fn(
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

  describe('LocalizableCollectionCreatedDbMessageHandler', () => {
    let handler: LocalizableCollectionCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableCollectionCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('collection is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableCollectionDbEvent = {
        id: 1,
        title: 'Test Title',
        description: 'Test Description',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: payload.title,
            entity_type: LOCALIZATION_COLLECTION_TYPE,
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

  describe('LocalizableCollectionUpdatedDbMessageHandler', () => {
    let handler: LocalizableCollectionUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableCollectionUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('collection is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableCollectionDbEvent = {
        id: 1,
        title: 'Test Title',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: payload.title,
            entity_type: LOCALIZATION_COLLECTION_TYPE,
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

    it('collection is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableCollectionDbEvent = {
        id: 1,
        title: 'Test Title',
        description: 'Test Description',
        synopsis: 'Test Synopsis',
      };
      const context = {
        ingestItemId: 4,
      };

      // Act
      await handler.handleMessage(
        createMessage(payload, context),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: payload.title,
            entity_type: LOCALIZATION_COLLECTION_TYPE,
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
            message_context: context,
          },
          options: {
            routingKey: `ax-localization-service.${config.tenantId}.${config.environmentId}.localization_source_entity.upsert`,
          },
        },
      ]);
    });
  });

  describe('LocalizableCollectionDeletedDbMessageHandler', () => {
    let handler: LocalizableCollectionDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableCollectionDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('collection is deleted -> delete message data is sent', async () => {
      // Arrange
      const payload: LocalizableCollectionDbEvent = {
        id: 1,
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_type: LOCALIZATION_COLLECTION_TYPE,
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
