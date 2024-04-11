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
  LocalizationServiceMultiTenantMessagingSettings,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { ShutdownActionsMiddleware } from '@axinom/mosaic-service-common';
import {
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
  setupInboxStorage,
  setupOutboxStorage,
  setupPollingOutboxListener,
  StoreOutboxMessage,
  TransactionalLogMapper,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { MediaServiceMessagingSettings } from 'media-messages';
import {
  getInboxPollingListenerSettings,
  getOutboxPollingListenerSettings,
  initializePollingMessageListener,
  IsolationLevel,
  PollingListenerConfig,
  TransactionalMessageHandler,
} from 'pg-transactional-outbox';
import {
  LocalizableCollectionCreatedDbMessageHandler,
  LocalizableCollectionDeletedDbMessageHandler,
  LocalizableCollectionImageCreatedDbMessageHandler,
  LocalizableCollectionImageDeletedDbMessageHandler,
  LocalizableCollectionImageUpdatedDbMessageHandler,
  LocalizableCollectionUpdatedDbMessageHandler,
} from '../domains/collections';
import {
  CuePointTypesDeclaredHandler,
  CuePointTypesDeclareFailedHandler,
  DeleteEntityHandler,
  EntityDefinitionDeclareFailedHandler,
  EntityDefinitionDeclareFinishedHandler,
  EntityDefinitionDeleteFailedHandler,
  EntityDefinitionDeleteFinishedHandler,
  ImageTypesDeclaredHandler,
  ImageTypesDeclareFailedHandler,
} from '../domains/common';
import { getIngestProcessors } from '../domains/get-ingest-processors';
import {
  LocalizableMovieCreatedDbMessageHandler,
  LocalizableMovieDeletedDbMessageHandler,
  LocalizableMovieGenreCreatedDbMessageHandler,
  LocalizableMovieGenreDeletedDbMessageHandler,
  LocalizableMovieGenreUpdatedDbMessageHandler,
  LocalizableMovieImageCreatedDbMessageHandler,
  LocalizableMovieImageDeletedDbMessageHandler,
  LocalizableMovieImageUpdatedDbMessageHandler,
  LocalizableMovieUpdatedDbMessageHandler,
} from '../domains/movies';
import {
  entityPublishEventSettings,
  publishingProcessors,
} from '../domains/publishing-definition';
import {
  LocalizableEpisodeCreatedDbMessageHandler,
  LocalizableEpisodeDeletedDbMessageHandler,
  LocalizableEpisodeImageCreatedDbMessageHandler,
  LocalizableEpisodeImageDeletedDbMessageHandler,
  LocalizableEpisodeImageUpdatedDbMessageHandler,
  LocalizableEpisodeUpdatedDbMessageHandler,
  LocalizableSeasonCreatedDbMessageHandler,
  LocalizableSeasonDeletedDbMessageHandler,
  LocalizableSeasonImageCreatedDbMessageHandler,
  LocalizableSeasonImageDeletedDbMessageHandler,
  LocalizableSeasonImageUpdatedDbMessageHandler,
  LocalizableSeasonUpdatedDbMessageHandler,
  LocalizableTvshowCreatedDbMessageHandler,
  LocalizableTvshowDeletedDbMessageHandler,
  LocalizableTvshowGenreCreatedDbMessageHandler,
  LocalizableTvshowGenreDeletedDbMessageHandler,
  LocalizableTvshowGenreUpdatedDbMessageHandler,
  LocalizableTvshowImageCreatedDbMessageHandler,
  LocalizableTvshowImageDeletedDbMessageHandler,
  LocalizableTvshowImageUpdatedDbMessageHandler,
  LocalizableTvshowUpdatedDbMessageHandler,
} from '../domains/tvshows';
import {
  CheckFinishIngestDocumentHandler,
  CheckFinishIngestItemHandler,
  ImageAlreadyExistedHandler,
  ImageCreatedHandler,
  ImageFailedHandler,
  LocalizeEntityFailedHandler,
  LocalizeEntityFinishedHandler,
  StartIngestHandler,
  StartIngestItemHandler,
  UpdateMetadataHandler,
  UpsertLocalizationSourceEntityFailedHandler,
  UpsertLocalizationSourceEntityFinishedHandler,
  VideoAlreadyExistedHandler,
  VideoCreationStartedHandler,
  VideoFailedHandler,
} from '../ingest';
import {
  PublishEntityHandler,
  UnpublishEntityHandler,
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
  const ingestProcessors = getIngestProcessors(config);
  const dbMessageHandlers: TransactionalMessageHandler[] = [
    new LocalizableCollectionCreatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableCollectionUpdatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableCollectionDeletedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableCollectionImageCreatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableCollectionImageUpdatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableCollectionImageDeletedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableMovieCreatedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableMovieUpdatedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableMovieDeletedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableMovieGenreCreatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableMovieGenreUpdatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableMovieGenreDeletedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableMovieImageCreatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableMovieImageUpdatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableMovieImageDeletedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableTvshowCreatedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableTvshowUpdatedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableTvshowDeletedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableTvshowGenreCreatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableTvshowGenreUpdatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableTvshowGenreDeletedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableTvshowImageCreatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableTvshowImageUpdatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableTvshowImageDeletedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableSeasonCreatedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableSeasonUpdatedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableSeasonDeletedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableSeasonImageCreatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableSeasonImageUpdatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableSeasonImageDeletedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableEpisodeCreatedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableEpisodeUpdatedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableEpisodeDeletedDbMessageHandler(storeOutboxMessage, config),
    new LocalizableEpisodeImageCreatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableEpisodeImageUpdatedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
    new LocalizableEpisodeImageDeletedDbMessageHandler(
      storeOutboxMessage,
      config,
    ),
  ];
  const publishMessageHandlers: TransactionalMessageHandler[] = [
    new PublishEntityHandler(publishingProcessors, storeOutboxMessage, config),
    new UnpublishEntityHandler(
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
    new UpsertLocalizationSourceEntityFinishedHandler(
      storeOutboxMessage,
      config,
    ),
    new UpsertLocalizationSourceEntityFailedHandler(storeOutboxMessage, config),
    new LocalizeEntityFinishedHandler(storeOutboxMessage, config),
    new LocalizeEntityFailedHandler(storeOutboxMessage, config),
  ];
  const commonMessageHandlers: TransactionalMessageHandler[] = [
    new DeleteEntityHandler(storeOutboxMessage, config),
    new CuePointTypesDeclaredHandler(config),
    new CuePointTypesDeclareFailedHandler(config),
    new ImageTypesDeclaredHandler(config),
    new ImageTypesDeclareFailedHandler(config),
    new EntityDefinitionDeclareFailedHandler(config),
    new EntityDefinitionDeclareFinishedHandler(config),
    new EntityDefinitionDeleteFailedHandler(config),
    new EntityDefinitionDeleteFinishedHandler(config),
  ];
  const [shutdownInSrv] = initializePollingMessageListener(
    inboxConfig,
    [
      ...dbMessageHandlers,
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
  const storeInboxMessage = setupInboxStorage(inboxConfig, inboxLogger, config);

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
        LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntityFinished,
        LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntityFailed,
        LocalizationServiceMultiTenantMessagingSettings.LocalizeEntityFinished,
        LocalizationServiceMultiTenantMessagingSettings.LocalizeEntityFailed,
        LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeleteFinished,
        LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeleteFailed,
        LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeclareFinished,
        LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeclareFailed,
      ],
      customMessagePreProcessor: (message) => {
        switch (message.messagingSettings.messageType) {
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
          case LocalizationServiceMultiTenantMessagingSettings
            .EntityDefinitionDeclareFailed.messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .EntityDefinitionDeclareFinished.messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .EntityDefinitionDeleteFailed.messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .EntityDefinitionDeleteFinished.messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .UpsertLocalizationSourceEntityFinished.messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .UpsertLocalizationSourceEntityFailed.messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .LocalizeEntityFinished.messageType:
          case LocalizationServiceMultiTenantMessagingSettings
            .LocalizeEntityFailed.messageType:
            message.concurrency = 'parallel';
            break;
          default: // especially the "common" and "publish" ones are safer processed in sequential order
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

    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntityFinished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntityFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.LocalizeEntity,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.LocalizeEntityFinished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.LocalizeEntityFailed,
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
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
      config,
    ).sendCommand(),
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
