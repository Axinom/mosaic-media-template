import {
  getOwnerPgPool,
  initMessagingCounter,
  OwnerPgPool,
} from '@axinom/mosaic-db-common';
import {
  Broker,
  MessagingRegistry,
  RascalConfigBuilder,
  setupMessagingBroker,
} from '@axinom/mosaic-message-bus';
import {
  ImageServiceMultiTenantMessagingSettings,
  LocalizationServiceMultiTenantMessagingSettings,
  MicroFrontendMessagingSettings,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import {
  Logger,
  ShutdownActionsMiddleware,
} from '@axinom/mosaic-service-common';
import {
  getServiceHealthCheckMessagingSettings,
  OutboxInboxHealthCheckHandler,
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
  setupInboxStorage,
  setupOutboxStorage,
  setupPollingOutboxListener,
  StoreOutboxMessage,
  TransactionalLogMapper,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Express } from 'express';
import {
  ChannelServiceMessagingSettings,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import {
  getInboxPollingListenerSettings,
  getOutboxPollingListenerSettings,
  initializePollingMessageListener,
  PollingListenerConfig,
  TransactionalMessageHandler,
} from 'pg-transactional-outbox';
import { Config, HEALTH_CHECK_ROUTING_KEY } from '../common';
import {
  CheckChannelJobStatusFailedEventHandler,
  CheckChannelJobStatusSucceededEventHandler,
  LiveStreamProtectionKeyCreatedEventHandler,
  LocalizableChannelCreatedDbMessageHandler,
  LocalizableChannelDeletedDbMessageHandler,
  LocalizableChannelImageCreatedDbMessageHandler,
  LocalizableChannelImageDeletedDbMessageHandler,
  LocalizableChannelImageUpdatedDbMessageHandler,
  LocalizableChannelUpdatedDbMessageHandler,
  LocalizableProgramCreatedDbMessageHandler,
  LocalizableProgramDeletedDbMessageHandler,
  LocalizableProgramUpdatedDbMessageHandler,
} from '../domains';
import {
  CuePointTypesDeclaredHandler,
  CuePointTypesDeclareFailedHandler,
  EntityDefinitionDeclareFailedHandler,
  EntityDefinitionDeclareFinishedHandler,
  EntityDefinitionDeleteFailedHandler,
  EntityDefinitionDeleteFinishedHandler,
  ImageTypesDeclaredHandler,
  ImageTypesDeclareFailedHandler,
} from './handlers';
import { getDevMessagingMiddleware } from './middleware';

const healthMessagingSettings = getServiceHealthCheckMessagingSettings(
  HEALTH_CHECK_ROUTING_KEY,
);

export const registerMessaging = async (
  app: Express,
  config: Config,
  shutdownActions: ShutdownActionsMiddleware,
): Promise<{ broker: Broker; storeOutboxMessage: StoreOutboxMessage }> => {
  const ownerPool = getOwnerPgPool(app);
  const outboxLogger = new Logger({ context: 'Transactional outbox' });
  const inboxLogger = new Logger({ context: 'Transactional inbox' });

  const outboxConfig: PollingListenerConfig = {
    outboxOrInbox: 'outbox',
    dbListenerConfig: {
      connectionString: config.dbOwnerConnectionString,
    },
    settings: getOutboxPollingListenerSettings(),
  };
  const storeOutboxMessage = setupOutboxStorage(
    outboxConfig,
    outboxLogger,
    config,
  );

  const inboxConfig: PollingListenerConfig = {
    outboxOrInbox: 'inbox',
    dbListenerConfig: {
      connectionString: config.dbOwnerConnectionString,
    },
    dbHandlerConfig: { connectionString: config.dbOwnerConnectionString },
    settings: getInboxPollingListenerSettings(),
  };

  registerTransactionalInboxHandlers(
    config,
    inboxConfig,
    storeOutboxMessage,
    ownerPool,
    inboxLogger,
    shutdownActions,
  );
  const broker = await registerRabbitMqMessaging(
    app,
    ownerPool,
    config,
    inboxConfig,
    inboxLogger,
    shutdownActions,
  );

  const shutdownOutbox = setupPollingOutboxListener(
    outboxConfig,
    broker,
    outboxLogger,
    config,
  );
  shutdownActions.push(shutdownOutbox);

  return { broker, storeOutboxMessage };
};

const registerTransactionalInboxHandlers = (
  config: Config,
  inboxConfig: PollingListenerConfig,
  storeOutboxMessage: StoreOutboxMessage,
  ownerPool: OwnerPgPool,
  inboxLogger: Logger,
  shutdownActions: ShutdownActionsMiddleware,
): void => {
  const messageHandlers: TransactionalMessageHandler[] = [
    new CheckChannelJobStatusSucceededEventHandler(config),
    new CheckChannelJobStatusFailedEventHandler(config),
    new LiveStreamProtectionKeyCreatedEventHandler(config),
    new CuePointTypesDeclaredHandler(config),
    new CuePointTypesDeclareFailedHandler(config),
    new ImageTypesDeclaredHandler(config),
    new ImageTypesDeclareFailedHandler(config),
    new OutboxInboxHealthCheckHandler(
      healthMessagingSettings,
      new Logger({ context: OutboxInboxHealthCheckHandler.name, config }),
      config,
    ),
  ];
  const localizationMessageHandlers: TransactionalMessageHandler[] =
    config.isLocalizationEnabled
      ? [
          new EntityDefinitionDeclareFinishedHandler(config),
          new EntityDefinitionDeclareFailedHandler(config),
          new EntityDefinitionDeleteFinishedHandler(config),
          new EntityDefinitionDeleteFailedHandler(config),
          new LocalizableChannelCreatedDbMessageHandler(
            storeOutboxMessage,
            config,
          ),
          new LocalizableChannelUpdatedDbMessageHandler(
            storeOutboxMessage,
            config,
          ),
          new LocalizableChannelDeletedDbMessageHandler(
            storeOutboxMessage,
            config,
          ),
          new LocalizableChannelImageCreatedDbMessageHandler(
            storeOutboxMessage,
            config,
          ),
          new LocalizableChannelImageUpdatedDbMessageHandler(
            storeOutboxMessage,
            config,
          ),
          new LocalizableChannelImageDeletedDbMessageHandler(
            storeOutboxMessage,
            config,
          ),
          new LocalizableProgramCreatedDbMessageHandler(
            storeOutboxMessage,
            config,
          ),
          new LocalizableProgramUpdatedDbMessageHandler(
            storeOutboxMessage,
            config,
          ),
          new LocalizableProgramDeletedDbMessageHandler(
            storeOutboxMessage,
            config,
          ),
        ]
      : [];

  const [shutdownInSrv] = initializePollingMessageListener(
    inboxConfig,
    [...messageHandlers, ...localizationMessageHandlers],
    new TransactionalLogMapper(inboxLogger, config.logLevel),
    {
      messageProcessingTimeoutStrategy: (message) =>
        message.messageType === healthMessagingSettings.messageType
          ? 30_000
          : 15_000,
    },
  );
  shutdownActions.push(shutdownInSrv);
};

const registerRabbitMqMessaging = async (
  app: MessagingRegistry,
  ownerPool: OwnerPgPool,
  config: Config,
  inboxConfig: PollingListenerConfig,
  inboxLogger: Logger,

  shutdownActions: ShutdownActionsMiddleware,
): Promise<Broker> => {
  const storeInboxMessage = setupInboxStorage(inboxConfig, inboxLogger, config);
  const inboxWriter = new RabbitMqInboxWriter(
    storeInboxMessage,
    ownerPool,
    inboxLogger,
    {
      customMessagePreProcessor: (message) => {
        switch (message.messagingSettings.messageType) {
          case VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclared
            .messageType:
          case VideoServiceMultiTenantMessagingSettings
            .CuePointTypesDeclareFailed.messageType:
          case ImageServiceMultiTenantMessagingSettings.ImageTypesDeclared
            .messageType:
          case ImageServiceMultiTenantMessagingSettings.ImageTypesDeclareFailed
            .messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .EntityDefinitionDeclareFinished.messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .EntityDefinitionDeclareFailed.messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .EntityDefinitionDeleteFinished.messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .EntityDefinitionDeleteFailed.messageType:
          case MicroFrontendMessagingSettings.WorkflowsEnableFinished
            .messageType:
          case MicroFrontendMessagingSettings.WorkflowsEnableFailed.messageType:
          case MicroFrontendMessagingSettings.WorkflowsDisableFinished
            .messageType:
          case MicroFrontendMessagingSettings.WorkflowsDisableFailed
            .messageType:
          case healthMessagingSettings.messageType:
            message.concurrency = 'parallel';
            break;
          default:
            message.concurrency = 'sequential';
            break;
        }
      },
    },
  );

  const builders: RascalConfigBuilder[] = [
    // Actual Business logic related

    // Channel publication
    new RascalTransactionalConfigBuilder(
      ChannelServiceMessagingSettings.ChannelPublished,
      config,
    ).publishEvent(),
    new RascalTransactionalConfigBuilder(
      ChannelServiceMessagingSettings.ChannelUnpublished,
      config,
    ).publishEvent(),

    // Playlist publication
    new RascalTransactionalConfigBuilder(
      ChannelServiceMessagingSettings.PlaylistPublished,
      config,
    ).publishEvent(),
    new RascalTransactionalConfigBuilder(
      ChannelServiceMessagingSettings.PlaylistUnpublished,
      config,
    ).publishEvent(),

    // VOD-to-Live
    new RascalTransactionalConfigBuilder(
      VodToLiveServiceMessagingSettings.CheckChannelJobStatusSucceeded,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      VodToLiveServiceMessagingSettings.CheckChannelJobStatusFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      VodToLiveServiceMessagingSettings.LiveStreamProtectionKeyCreated,
      config,
    ).subscribeForEvent(() => inboxWriter),

    // Localization sources sync
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
      config,
    ).sendCommand(),

    // Health check
    new RascalTransactionalConfigBuilder(healthMessagingSettings, config)
      .sendCommand()
      .subscribeForCommand(() => inboxWriter),
  ];
  const setupBuilders: RascalConfigBuilder[] = [
    // Workflows assignment commands
    new RascalTransactionalConfigBuilder(
      MicroFrontendMessagingSettings.WorkflowsEnable,
      config,
    ).sendCommand(),

    // Workflows assignment events
    new RascalTransactionalConfigBuilder(
      MicroFrontendMessagingSettings.WorkflowsEnableFinished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      MicroFrontendMessagingSettings.WorkflowsEnableFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),

    // Workflows un-assignment commands
    new RascalTransactionalConfigBuilder(
      MicroFrontendMessagingSettings.WorkflowsDisable,
      config,
    ).sendCommand(),

    // Workflows un-assignment events
    new RascalTransactionalConfigBuilder(
      MicroFrontendMessagingSettings.WorkflowsDisableFinished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      MicroFrontendMessagingSettings.WorkflowsDisableFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),

    // Cue point types declaration
    new RascalTransactionalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.DeclareCuePointTypes,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclareFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclared,
      config,
    ).subscribeForEvent(() => inboxWriter),

    // Image types declaration
    new RascalTransactionalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.DeclareImageTypes,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.ImageTypesDeclareFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.ImageTypesDeclared,
      config,
    ).subscribeForEvent(() => inboxWriter),

    // Localization Entity Definition declaration
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.DeclareEntityDefinition,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeclareFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeclareFinished,
      config,
    ).subscribeForEvent(() => inboxWriter),

    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.DeleteEntityDefinition,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeleteFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeleteFinished,
      config,
    ).subscribeForEvent(() => inboxWriter),

    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.LocalizeEntity,
      config,
    ).sendCommand(),
  ];

  const counter = initMessagingCounter(ownerPool);
  const rmqLogger = new Logger({ context: 'rabbitmq' });
  return setupMessagingBroker({
    app,
    config,
    builders: [...setupBuilders, ...builders],
    logger: rmqLogger,
    shutdownActions,
    onMessageMiddleware: getDevMessagingMiddleware(config, rmqLogger),
    components: { counters: { postgresCounter: counter } },
    rascalConfigExportPath: './src/generated/messaging/rascal-schema.json',
  });
};
