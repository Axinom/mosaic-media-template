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

const tvshowSelectResult = vi.hoisted(() => ({
  value: (() => undefined) as () => unknown,
}));

vi.mock('zapatos/db', async () => {
  return {
    ...((await vi.importActual<typeof import('zapatos/db')>(
      'zapatos/db',
    )) as object),
    selectOne: vi.fn().mockImplementation(() => {
      return {
        run: vi.fn().mockImplementation(() => {
          return tvshowSelectResult.value();
        }),
      } satisfies Partial<SQLFragment> as unknown as SQLFragment;
    }),
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
    ({
      payload,
      ...optional(messageContext, () => ({ metadata: { messageContext } })),
    }) satisfies Partial<
      Omit<TypedTransactionalMessage<LocalizableSeasonDbEvent>, 'metadata'>
    > & {
      metadata?: Partial<
        TypedTransactionalMessage<LocalizableSeasonDbEvent>['metadata']
      >;
    } as unknown as TypedTransactionalMessage<LocalizableSeasonDbEvent>;

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
    tvshowSelectResult.value = () => undefined;
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
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

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
      tvshowSelectResult.value = () => ({ title: 'The Title of the TV Show' });

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
      tvshowSelectResult.value = () => ({ title: 'The Title of the TV Show' });

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
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
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
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as unknown as ClientBase,
      );

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
