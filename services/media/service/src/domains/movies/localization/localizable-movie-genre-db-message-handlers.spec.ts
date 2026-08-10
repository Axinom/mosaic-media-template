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
import { LOCALIZATION_MOVIE_GENRE_TYPE } from './constants';
import {
  LocalizableMovieGenreCreatedDbMessageHandler,
  LocalizableMovieGenreDbEvent,
  LocalizableMovieGenreDeletedDbMessageHandler,
  LocalizableMovieGenreUpdatedDbMessageHandler,
} from './localizable-movie-genre-db-message-handlers';

describe('Localizable Movie Genre DB trigger events', () => {
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
    payload: LocalizableMovieGenreDbEvent,
    messageContext?: unknown,
  ) =>
    ({
      payload,
      ...optional(messageContext, () => ({ metadata: { messageContext } })),
    }) satisfies Partial<
      Omit<TypedTransactionalMessage<LocalizableMovieGenreDbEvent>, 'metadata'>
    > & {
      metadata?: Partial<
        TypedTransactionalMessage<LocalizableMovieGenreDbEvent>['metadata']
      >;
    } as unknown as TypedTransactionalMessage<LocalizableMovieGenreDbEvent>;

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

  describe('LocalizableMovieGenreCreatedDbMessageHandler', () => {
    let handler: LocalizableMovieGenreCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableMovieGenreCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('movie genre is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableMovieGenreDbEvent = {
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
            entity_type: LOCALIZATION_MOVIE_GENRE_TYPE,
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

  describe('LocalizableMovieGenreUpdatedDbMessageHandler', () => {
    let handler: LocalizableMovieGenreUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableMovieGenreUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('movie genre is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableMovieGenreDbEvent = {
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
            entity_type: LOCALIZATION_MOVIE_GENRE_TYPE,
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

    it('movie genre is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableMovieGenreDbEvent = {
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
            entity_type: LOCALIZATION_MOVIE_GENRE_TYPE,
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

  describe('LocalizableMovieGenreDeletedDbMessageHandler', () => {
    let handler: LocalizableMovieGenreDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableMovieGenreDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('movie genre is deleted -> delete message data is sent', async () => {
      // Arrange
      const payload: LocalizableMovieGenreDbEvent = {
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
            entity_type: LOCALIZATION_MOVIE_GENRE_TYPE,
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
