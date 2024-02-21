import { initMessagingCounter, OwnerPgPool } from '@axinom/mosaic-db-common';
import {
  Broker,
  RascalConfigBuilder,
  setupMessagingBroker,
} from '@axinom/mosaic-message-bus';
import { Logger } from '@axinom/mosaic-service-common';
import { Express } from 'express';
import { Config } from '../common';
import { getMessagingMiddleware } from './middleware';

import {
  ImageServiceMultiTenantMessagingSettings,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { ShutdownActionsMiddleware } from '@axinom/mosaic-service-common';
import {
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
  setupOutboxStorage,
  setupPollingOutboxListener,
  StoreOutboxMessage,
  TransactionalLogMapper,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { MediaServiceMessagingSettings } from 'media-messages';
import {
  getInboxPollingListenerSettings,
  getOutboxPollingListenerSettings,
  initializeMessageStorage,
  initializePollingMessageListener,
  IsolationLevel,
  PollingListenerConfig,
  TransactionalMessageHandler,
} from 'pg-transactional-outbox';
import {
  CuePointTypesDeclaredHandler,
  CuePointTypesDeclareFailedHandler,
  DeleteEntityHandler,
  ImageTypesDeclaredHandler,
  ImageTypesDeclareFailedHandler,
} from '../domains/common';
import { ingestProcessors } from '../domains/ingest-processors';
import {
  entityPublishEventSettings,
  publishingProcessors,
} from '../domains/publishing-definition';
import {
  CheckFinishIngestDocumentHandler,
  CheckFinishIngestItemHandler,
  ImageAlreadyExistedHandler,
  ImageCreatedHandler,
  ImageFailedHandler,
  StartIngestHandler,
  StartIngestItemHandler,
  UpdateMetadataHandler,
  VideoAlreadyExistedHandler,
  VideoCreationStartedHandler,
  VideoFailedHandler,
} from '../ingest';
import {
  PublishEntityHandler,
  UnpublishEntityCommandHandler,
} from '../publishing/handlers';

export const registerMessaging = async (
  app: Express,
  ownerPool: OwnerPgPool,
  config: Config,
  shutdownActions: ShutdownActionsMiddleware,
): Promise<{ broker: Broker; storeOutboxMessage: StoreOutboxMessage }> => {
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

  const logMapper = new TransactionalLogMapper(inboxLogger, config.logLevel);
  registerTransactionalInboxHandlers(
    config,
    inboxConfig,
    storeOutboxMessage,
    logMapper,
    shutdownActions,
  );
  const broker = await registerRabbitMqMessaging(
    app,
    ownerPool,
    config,
    inboxConfig,
    inboxLogger,
    logMapper,
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
  logMapper: TransactionalLogMapper,
  shutdownActions: ShutdownActionsMiddleware,
): void => {
  const publishMessageHandlers: TransactionalMessageHandler[] = [
    new PublishEntityHandler(publishingProcessors, storeOutboxMessage, config),
    new UnpublishEntityCommandHandler(
      publishingProcessors,
      storeOutboxMessage,
      config,
    ),
  ];
  const ingestMessageHandlers: TransactionalMessageHandler[] = [
    new StartIngestHandler(ingestProcessors, storeOutboxMessage, config),
    new StartIngestItemHandler(ingestProcessors, storeOutboxMessage, config),
    new UpdateMetadataHandler(ingestProcessors, storeOutboxMessage, config),
    new CheckFinishIngestItemHandler(config),
    new CheckFinishIngestDocumentHandler(storeOutboxMessage, config),
    new VideoAlreadyExistedHandler(
      ingestProcessors,
      storeOutboxMessage,
      config,
    ),
    new VideoCreationStartedHandler(
      ingestProcessors,
      storeOutboxMessage,
      config,
    ),
    new VideoFailedHandler(storeOutboxMessage, config),
    new ImageAlreadyExistedHandler(
      ingestProcessors,
      storeOutboxMessage,
      config,
    ),
    new ImageCreatedHandler(ingestProcessors, storeOutboxMessage, config),
    new ImageFailedHandler(storeOutboxMessage, config),
  ];
  const commonMessageHandlers: TransactionalMessageHandler[] = [
    new DeleteEntityHandler(storeOutboxMessage, config),
    new CuePointTypesDeclaredHandler(config),
    new CuePointTypesDeclareFailedHandler(config),
    new ImageTypesDeclaredHandler(config),
    new ImageTypesDeclareFailedHandler(config),
  ];
  const [shutdownInSrv] = initializePollingMessageListener(
    inboxConfig,
    [
      ...publishMessageHandlers,
      ...ingestMessageHandlers,
      ...commonMessageHandlers,
    ],
    logMapper,
    {
      // Allow the ingest start to be processed a bit longer
      messageProcessingTimeoutStrategy: (message) =>
        message.messageType ===
        MediaServiceMessagingSettings.StartIngest.messageType
          ? 30_000
          : 10_000,
      messageProcessingTransactionLevelStrategy: (message) => {
        if (
          message.messageType ===
          MediaServiceMessagingSettings.CheckFinishIngestItem.messageType
        ) {
          // Ensure no "parallel" updates on the ingest items
          return IsolationLevel.Serializable;
        }
        return IsolationLevel.RepeatableRead;
      },
    },
  );
  shutdownActions.push(shutdownInSrv);
};

const registerRabbitMqMessaging = async (
  app: Express,
  ownerPool: OwnerPgPool,
  config: Config,
  inboxConfig: PollingListenerConfig,
  inboxLogger: Logger,
  logMapper: TransactionalLogMapper,
  shutdownActions: ShutdownActionsMiddleware,
): Promise<Broker> => {
  const storeInboxMessage = initializeMessageStorage(inboxConfig, logMapper);

  const inboxWriter = new RabbitMqInboxWriter(
    storeInboxMessage,
    ownerPool,
    inboxLogger,
    {
      // temporary backward compatibility until all your services are updated and all current messages are processed
      acceptedMessageSettings: [
        MediaServiceMessagingSettings.StartIngest,
        MediaServiceMessagingSettings.StartIngestItem,
        MediaServiceMessagingSettings.UpdateMetadata,
        MediaServiceMessagingSettings.CheckFinishIngestItem,
        MediaServiceMessagingSettings.CheckFinishIngestDocument,
        VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsAlreadyExisted,
        VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsCreationStarted,
        VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsFailed,
        ImageServiceMultiTenantMessagingSettings.EnsureImageExistsAlreadyExisted,
        ImageServiceMultiTenantMessagingSettings.EnsureImageExistsImageCreated,
        ImageServiceMultiTenantMessagingSettings.EnsureImageExistsFailed,
      ],
      customMessagePreProcessor: (message) => {
        switch (message.messageType) {
          case MediaServiceMessagingSettings.StartIngest.messageType:
          case MediaServiceMessagingSettings.StartIngestItem.messageType:
          case MediaServiceMessagingSettings.UpdateMetadata.messageType:
          case MediaServiceMessagingSettings.CheckFinishIngestItem.messageType:
          case MediaServiceMessagingSettings.CheckFinishIngestDocument
            .messageType:
          case VideoServiceMultiTenantMessagingSettings
            .EnsureVideoExistsAlreadyExisted.messageType:
          case VideoServiceMultiTenantMessagingSettings
            .EnsureVideoExistsCreationStarted.messageType:
          case VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsFailed
            .messageType:
          case ImageServiceMultiTenantMessagingSettings
            .EnsureImageExistsAlreadyExisted.messageType:
          case ImageServiceMultiTenantMessagingSettings
            .EnsureImageExistsImageCreated.messageType:
          case ImageServiceMultiTenantMessagingSettings.EnsureImageExistsFailed
            .messageType:
          case MediaServiceMessagingSettings.DeleteEntity.messageType:
          case ImageServiceMultiTenantMessagingSettings.ImageTypesDeclared
            .messageType:
          case ImageServiceMultiTenantMessagingSettings.ImageTypesDeclareFailed
            .messageType:
          case VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclared
            .messageType:
          case VideoServiceMultiTenantMessagingSettings
            .CuePointTypesDeclareFailed.messageType:
            message.concurrency = 'parallel';
            break;
          default: // especially the "common" and "publish" ones are safer with a mutex
            message.concurrency = 'sequential';
            break;
        }
      },
    },
  );

  const ingestBuilders: RascalConfigBuilder[] = [
    new RascalTransactionalConfigBuilder(
      MediaServiceMessagingSettings.StartIngest,
      config,
    )
      .sendCommand()
      .subscribeForCommand(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      MediaServiceMessagingSettings.StartIngestItem,
      config,
    )
      .sendCommand()
      .subscribeForCommand(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      MediaServiceMessagingSettings.UpdateMetadata,
      config,
    )
      .sendCommand()
      .subscribeForCommand(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      config,
    )
      .sendCommand()
      .subscribeForCommand(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      MediaServiceMessagingSettings.CheckFinishIngestDocument,
      config,
    )
      .sendCommand()
      .subscribeForCommand(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExists,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsAlreadyExisted,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsCreationStarted,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.EnsureImageExists,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsAlreadyExisted,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsImageCreated,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
  ];

  const publishingBuilders: RascalConfigBuilder[] = [
    new RascalTransactionalConfigBuilder(
      MediaServiceMessagingSettings.PublishEntity,
      config,
    )
      .sendCommand()
      .subscribeForCommand(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      MediaServiceMessagingSettings.UnpublishEntity,
      config,
    )
      .sendCommand()
      .subscribeForCommand(() => inboxWriter),
    ...entityPublishEventSettings.map((settings) =>
      new RascalTransactionalConfigBuilder(settings, config).publishEvent(),
    ),
  ];

  const commonBuilders: RascalConfigBuilder[] = [
    new RascalTransactionalConfigBuilder(
      MediaServiceMessagingSettings.DeleteEntity,
      config,
    )
      .sendCommand()
      .subscribeForCommand(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.DeclareImageTypes,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.ImageTypesDeclared,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.ImageTypesDeclareFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      MediaServiceMessagingSettings.EntityDeleted,
      config,
    ).publishEvent(),
    new RascalTransactionalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.DeclareCuePointTypes,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclared,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclareFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
  ];

  const counter = initMessagingCounter(ownerPool);
  return setupMessagingBroker({
    app,
    config,
    builders: [...ingestBuilders, ...publishingBuilders, ...commonBuilders],
    logger: inboxLogger,
    shutdownActions,
    onMessageMiddleware: getMessagingMiddleware(config, inboxLogger),
    components: { counters: { postgresCounter: counter } },
    rascalConfigExportPath: './src/generated/messaging/rascal-schema.json',
  });
};
