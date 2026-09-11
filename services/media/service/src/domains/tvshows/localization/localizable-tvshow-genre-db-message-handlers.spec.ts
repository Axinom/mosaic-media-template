import type { TokenResult } from '@axinom/mosaic-id-link-be';
import type { MessageEnvelopeOverrides } from '@axinom/mosaic-message-bus';
import type { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import type {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';

import type { ClientBase } from 'pg';
import type { PublicationConfig } from 'rascal';
import type { Config } from '../../../common';

const serviceAccountToken = vi.hoisted(() => 'SERVICE_ACCOUNT_TOKEN');
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
        tokenType: 'ServiceAccount',
      }),
    ),
    generateLongLivedToken: vi.fn(() =>
      Promise.resolve<TokenResult>({
        accessToken: serviceAccountToken,
        expiresInSeconds: 600,
        tokenType: 'ServiceAccount',
      }),
    ),
  };
});

import { optional } from '@axinom/mosaic-db-common';
import {
  DeleteLocalizationSourceEntityCommand,
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
} from '@axinom/mosaic-messages';
import { createTestConfig } from '../../../tests/test-utils';
import { LOCALIZATION_TVSHOW_GENRE_TYPE } from './constants';
import {
  LocalizableTvshowGenreCreatedDbMessageHandler,
  LocalizableTvshowGenreDbEvent,
  LocalizableTvshowGenreDeletedDbMessageHandler,
  LocalizableTvshowGenreUpdatedDbMessageHandler,
} from './localizable-tvshow-genre-db-message-handlers';

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
    ({
      payload,
      ...optional(messageContext, () => ({ metadata: { messageContext } })),
    }) satisfies Partial<
      Omit<TypedTransactionalMessage<LocalizableTvshowGenreDbEvent>, 'metadata'>
    > & {
      metadata?: Partial<
        TypedTransactionalMessage<LocalizableTvshowGenreDbEvent>['metadata']
      >;
    } as unknown as TypedTransactionalMessage<LocalizableTvshowGenreDbEvent>;

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
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
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
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

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
