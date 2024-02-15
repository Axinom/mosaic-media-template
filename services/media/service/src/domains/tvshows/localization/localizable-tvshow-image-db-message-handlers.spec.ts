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
import { LOCALIZATION_TVSHOW_TYPE } from './constants';
import {
  LocalizableTvshowImageCreatedDbMessageHandler,
  LocalizableTvshowImageDbEvent,
  LocalizableTvshowImageDeletedDbMessageHandler,
  LocalizableTvshowImageUpdatedDbMessageHandler,
} from './localizable-tvshow-image-db-message-handlers';

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

describe('Localizable Tvshow Image DB trigger events', () => {
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
    payload: LocalizableTvshowImageDbEvent,
    messageContext?: unknown,
  ) =>
    stub<TransactionalInboxMessage<LocalizableTvshowImageDbEvent>>({
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

  describe('LocalizableTvshowImageCreatedDbMessageHandler', () => {
    let handler: LocalizableTvshowImageCreatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableTvshowImageCreatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('tvshow cover is inserted -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableTvshowImageDbEvent = {
        tvshow_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.tvshow_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_TVSHOW_TYPE,
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

    it('tvshow teaser is inserted -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableTvshowImageDbEvent = {
        tvshow_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });
  });

  describe('LocalizableTvshowImageUpdatedDbMessageHandler', () => {
    let handler: LocalizableTvshowImageUpdatedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableTvshowImageUpdatedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('tvshow cover is updated -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableTvshowImageDbEvent = {
        tvshow_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.tvshow_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_TVSHOW_TYPE,
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

    it('tvshow teaser is updated -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableTvshowImageDbEvent = {
        tvshow_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });

    it('tvshow cover is updated with context -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableTvshowImageDbEvent = {
        tvshow_id: 1,
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
            entity_id: payload.tvshow_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_TVSHOW_TYPE,
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

  describe('LocalizableTvshowImageDeletedDbMessageHandler', () => {
    let handler: LocalizableTvshowImageDeletedDbMessageHandler;

    beforeAll(() => {
      handler = new LocalizableTvshowImageDeletedDbMessageHandler(
        storeOutboxMessage,
        config,
      );
    });

    it('tvshow cover is deleted and tvshow still exists -> upsert message data is sent', async () => {
      // Arrange
      const payload: LocalizableTvshowImageDbEvent = {
        tvshow_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      jest
        .spyOn(handler, 'tvshowIsDeleted')
        .mockImplementation(async () => false);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([
        {
          payload: {
            entity_id: payload.tvshow_id.toString(),
            entity_title: undefined,
            entity_type: LOCALIZATION_TVSHOW_TYPE,
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

    it('tvshow cover is deleted as part of tvshow cascade delete -> message not sent as tvshow delete message is enough', async () => {
      // Arrange
      const payload: LocalizableTvshowImageDbEvent = {
        tvshow_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'COVER',
      };

      jest
        .spyOn(handler, 'tvshowIsDeleted')
        .mockImplementation(async () => true);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });

    it('tvshow teaser is deleted and tvshow still exists -> message not sent as only cover is relevant', async () => {
      // Arrange
      const payload: LocalizableTvshowImageDbEvent = {
        tvshow_id: 1,
        image_id: '00000000-0000-0000-0000-000000000001',
        image_type: 'TEASER',
      };

      jest
        .spyOn(handler, 'tvshowIsDeleted')
        .mockImplementation(async () => false);

      // Act
      await handler.handleMessage(createMessage(payload), stub<ClientBase>());

      // Assert
      expect(messages).toEqual([]);
    });
  });
});
