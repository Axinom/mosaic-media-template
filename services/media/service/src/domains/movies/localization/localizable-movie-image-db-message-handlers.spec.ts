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
import { LOCALIZATION_MOVIE_TYPE } from './constants';
import {
  LocalizableMovieImageCreatedDbMessageHandler,
  LocalizableMovieImageDbEvent,
  LocalizableMovieImageDeletedDbMessageHandler,
  LocalizableMovieImageUpdatedDbMessageHandler,
} from './localizable-movie-image-db-message-handlers';

describe('Localizable Movie Image DB trigger events', () => {
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
    payload: LocalizableMovieImageDbEvent,
    messageContext?: unknown,
  ) =>
    ({
      payload,
      ...optional(messageContext, () => ({ metadata: { messageContext } })),
    }) satisfies Partial<
      Omit<TypedTransactionalMessage<LocalizableMovieImageDbEvent>, 'metadata'>
    > & {
      metadata?: Partial<
        TypedTransactionalMessage<LocalizableMovieImageDbEvent>['metadata']
      >;
    } as unknown as TypedTransactionalMessage<LocalizableMovieImageDbEvent>;

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

  describe('LocalizableMovieImageCreatedDbMessageHandler', () => {
    let handler: LocalizableMovieImageCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableMovieImageCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('movie cover is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableMovieImageDbEvent = {
        movie_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
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
            entity_id: payload.movie_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_MOVIE_TYPE,
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

    it('movie teaser is inserted -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableMovieImageDbEvent = {
        movie_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

      // Assert
      expect(messages).toEqual([]);
    });
  });

  describe('LocalizableMovieImageUpdatedDbMessageHandler', () => {
    let handler: LocalizableMovieImageUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableMovieImageUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('movie cover is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableMovieImageDbEvent = {
        movie_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
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
            entity_id: payload.movie_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_MOVIE_TYPE,
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

    it('movie teaser is updated -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableMovieImageDbEvent = {
        movie_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

      // Assert
      expect(messages).toEqual([]);
    });

    it('movie cover is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableMovieImageDbEvent = {
        movie_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
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
            entity_id: payload.movie_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_MOVIE_TYPE,
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

  describe('LocalizableMovieImageDeletedDbMessageHandler', () => {
    let handler: LocalizableMovieImageDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableMovieImageDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('movie cover is deleted and movie still exists -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableMovieImageDbEvent = {
        movie_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      vi.spyOn(handler, 'movieIsDeleted').mockImplementation(async () => false);

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.movie_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_MOVIE_TYPE,
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

    it('movie cover is deleted as part of movie cascade delete -> message not sent as movie delete message is enough', async () => {
      // Arrange
      const payload: LocalizableMovieImageDbEvent = {
        movie_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      vi.spyOn(handler, 'movieIsDeleted').mockImplementation(async () => true);

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

      // Assert
      expect(messages).toEqual([]);
    });

    it('movie teaser is deleted and movie still exists -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableMovieImageDbEvent = {
        movie_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      vi.spyOn(handler, 'movieIsDeleted').mockImplementation(async () => false);

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

      // Assert
      expect(messages).toEqual([]);
    });
  });
});
