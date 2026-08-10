const { serviceAccountToken } = vi.hoisted(() => ({
  serviceAccountToken: 'SERVICE_ACCOUNT_TOKEN',
}));

vi.mock('@axinom/mosaic-id-link-be', async () => {
  const originalModule = await vi.importActual<typeof MosaicIdLinkBe>(
    '@axinom/mosaic-id-link-be',
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

import { optional } from '@axinom/mosaic-db-common';
import { SubjectType } from '@axinom/mosaic-id-guard';
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
import { Config, LOCALIZATION_CHANNEL_TYPE } from '../../../common';
import { createTestConfig } from '../../../tests/test-utils';
import {
  LocalizableChannelImageCreatedDbMessageHandler,
  LocalizableChannelImageDbEvent,
  LocalizableChannelImageDeletedDbMessageHandler,
  LocalizableChannelImageUpdatedDbMessageHandler,
} from './localizable-channel-image-db-message-handlers';

describe('Localizable Channel Image DB trigger events', () => {
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
    payload: LocalizableChannelImageDbEvent,
    messageContext?: unknown,
  ) =>
    ({
      payload,
      ...optional(messageContext, () => ({ metadata: { messageContext } })),
    }) satisfies Partial<
      TypedTransactionalMessage<LocalizableChannelImageDbEvent>
    > as TypedTransactionalMessage<LocalizableChannelImageDbEvent>;

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

  afterAll(async () => {
    vi.restoreAllMocks();
  });

  describe('LocalizableChannelImageCreatedDbMessageHandler', () => {
    let handler: LocalizableChannelImageCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableChannelImageCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('channel logo is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableChannelImageDbEvent = {
        channel_id: '00000000-0000-0000-0000-000000000009',
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'LOGO',
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
            entity_id: payload.channel_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_CHANNEL_TYPE,
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

    it('channel teaser is inserted -> message not sent as only logo is relevant', async () => {
      // Arrange
      const payload: LocalizableChannelImageDbEvent = {
        channel_id: '00000000-0000-0000-0000-000000000009',
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as ClientBase,
      );

      // Assert
      expect(messages).toEqual([]);
    });
  });

  describe('LocalizableChannelImageUpdatedDbMessageHandler', () => {
    let handler: LocalizableChannelImageUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableChannelImageUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('channel logo is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableChannelImageDbEvent = {
        channel_id: '00000000-0000-0000-0000-000000000009',
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'LOGO',
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
            entity_id: payload.channel_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_CHANNEL_TYPE,
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

    it('channel teaser is updated -> message not sent as only logo is relevant', async () => {
      // Arrange
      const payload: LocalizableChannelImageDbEvent = {
        channel_id: '00000000-0000-0000-0000-000000000009',
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as ClientBase,
      );

      // Assert
      expect(messages).toEqual([]);
    });
  });

  describe('LocalizableChannelImageDeletedDbMessageHandler', () => {
    let handler: LocalizableChannelImageDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableChannelImageDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('channel logo is deleted and channel still exists -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableChannelImageDbEvent = {
        channel_id: '00000000-0000-0000-0000-000000000009',
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'LOGO',
      };

      vi.spyOn(handler, 'channelIsDeleted').mockImplementation(
        async () => false,
      );

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as ClientBase,
      );

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.channel_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_CHANNEL_TYPE,
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

    it('channel logo is deleted as part of channel cascade delete -> message not sent as channel delete message is enough', async () => {
      // Arrange
      const payload: LocalizableChannelImageDbEvent = {
        channel_id: '00000000-0000-0000-0000-000000000009',
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'LOGO',
      };

      vi.spyOn(handler, 'channelIsDeleted').mockImplementation(
        async () => true,
      );

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as ClientBase,
      );

      // Assert
      expect(messages).toEqual([]);
    });

    it('channel teaser is deleted and channel still exists -> message not sent as only logo is relevant', async () => {
      // Arrange
      const payload: LocalizableChannelImageDbEvent = {
        channel_id: '00000000-0000-0000-0000-000000000009',
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      vi.spyOn(handler, 'channelIsDeleted').mockImplementation(
        async () => false,
      );

      // Act
      await handler.handleMessage(
        createMessage(payload),
        {} satisfies Partial<ClientBase> as ClientBase,
      );

      // Assert
      expect(messages).toEqual([]);
    });
  });
});
