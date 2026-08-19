import type * as MosaicIdGuard from '@axinom/mosaic-id-guard';

const { serviceAccountToken } = vi.hoisted(() => ({
  serviceAccountToken: 'SERVICE_ACCOUNT_TOKEN',
}));

vi.mock('@axinom/mosaic-id-link-be', async () => {
  const originalModule = await vi.importActual<typeof MosaicIdLinkBe>(
    '@axinom/mosaic-id-link-be',
  );
  const { SubjectType } = await vi.importActual<typeof MosaicIdGuard>(
    '@axinom/mosaic-id-guard',
  );
  return {
    ...originalModule,
    getServiceAccountToken: vi.fn(() =>
      Promise.resolve<MosaicIdLinkBe.TokenResult>({
        accessToken: serviceAccountToken,
        expiresInSeconds: 600,
        tokenType: SubjectType.ManagedServiceAccount,
      }),
    ),
  };
});

import type * as MosaicIdLinkBe from '@axinom/mosaic-id-link-be';
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
import { Config, LOCALIZATION_PROGRAM_TYPE } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import {
  LocalizableProgramCreatedDbMessageHandler,
  LocalizableProgramDbEvent,
  LocalizableProgramDeletedDbMessageHandler,
  LocalizableProgramUpdatedDbMessageHandler,
} from './localizable-program-db-message-handlers';

class TestLocalizableProgramCreatedDbMessageHandler extends LocalizableProgramCreatedDbMessageHandler {
  override additionalWork(): Promise<void> {
    return Promise.resolve();
  }
  override getSourceTitle(): Promise<string> {
    return Promise.resolve('unit test title');
  }
}

class TestLocalizableProgramUpdatedDbMessageHandler extends LocalizableProgramUpdatedDbMessageHandler {
  override additionalWork(): Promise<void> {
    return Promise.resolve();
  }
  override getSourceTitle(): Promise<string> {
    return Promise.resolve('unit test title');
  }
}

describe('Localizable Program DB trigger events', () => {
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

  const createMessage = (payload: LocalizableProgramDbEvent) =>
    ({ payload }) satisfies Partial<
      TypedTransactionalMessage<LocalizableProgramDbEvent>
    > as TypedTransactionalMessage<LocalizableProgramDbEvent>;

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

  describe('LocalizableProgramCreatedDbMessageHandler', () => {
    let handler: LocalizableProgramCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new TestLocalizableProgramCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('program is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableProgramDbEvent = {
        id: '00000000-0000-0000-0000-000000000009',
        title: 'Test program title',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as ClientBase,
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: 'unit test title',
            entity_type: LOCALIZATION_PROGRAM_TYPE,
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

  describe('LocalizableProgramUpdatedDbMessageHandler', () => {
    let handler: TestLocalizableProgramUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new TestLocalizableProgramUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('program is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableProgramDbEvent = {
        id: '00000000-0000-0000-0000-000000000009',
        title: 'Test Title',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as ClientBase,
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: 'unit test title',
            entity_type: LOCALIZATION_PROGRAM_TYPE,
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

    it('program is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableProgramDbEvent = {
        id: '00000000-0000-0000-0000-000000000009',
        title: 'Test program title',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as ClientBase,
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_title: 'unit test title',
            entity_type: LOCALIZATION_PROGRAM_TYPE,
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

  describe('LocalizableProgramDeletedDbMessageHandler', () => {
    let handler: LocalizableProgramDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableProgramDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('program is deleted -> delete message data is sent', async () => {
      // Arrange
      const payload: LocalizableProgramDbEvent = {
        id: '00000000-0000-0000-0000-000000000009',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as ClientBase,
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.id.toString(),
            entity_type: LOCALIZATION_PROGRAM_TYPE,
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
