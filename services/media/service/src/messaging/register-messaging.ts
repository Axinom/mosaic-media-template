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
  StoreInboxMessage,
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
  ImageAlreadyExistedHandler,
  ImageCreatedHandler,
  ImageFailedHandler,
  ingestMessageRetryStrategy,
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
): Promise<{
  broker: Broker;
  storeOutboxMessage: StoreOutboxMessage;
  storeInboxMessage: StoreInboxMessage;
}> => {
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

  const storeInboxMessage = setupInboxStorage(inboxConfig, inboxLogger, config);
  registerTransactionalInboxHandlers(
    config,
    inboxConfig,
    storeOutboxMessage,
    storeInboxMessage,
    inboxLogger,
    shutdownActions,
    ownerPool,
  );
  const broker = await registerRabbitMqMessaging(
    app,
    ownerPool,
    storeInboxMessage,
    config,
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

  return { broker, storeOutboxMessage, storeInboxMessage };
};

const registerTransactionalInboxHandlers = (
  config: Config,
  inboxConfig: PollingListenerConfig,
  storeOutboxMessage: StoreOutboxMessage,
  storeInboxMessage: StoreInboxMessage,
  inboxLogger: Logger,
  shutdownActions: ShutdownActionsMiddleware,
  ownerPool: OwnerPgPool,
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
    new StartIngestHandler(
      ingestProcessors,
      storeInboxMessage,
      ownerPool,
      config,
    ),
    new StartIngestItemHandler(
      ingestProcessors,
      storeInboxMessage,
      storeOutboxMessage,
      config,
    ),
    new UpdateMetadataHandler(ingestProcessors, config),
    new CheckFinishIngestDocumentHandler(storeInboxMessage, config),
    new VideoAlreadyExistedHandler(ingestProcessors, config),
    new VideoCreationStartedHandler(ingestProcessors, config),
    new VideoFailedHandler(config),
    new ImageAlreadyExistedHandler(ingestProcessors, config),
    new ImageCreatedHandler(ingestProcessors, config),
    new ImageFailedHandler(config),
    new UpsertLocalizationSourceEntityFinishedHandler(
      storeOutboxMessage,
      config,
    ),
    new UpsertLocalizationSourceEntityFailedHandler(config),
    new LocalizeEntityFinishedHandler(config),
    new LocalizeEntityFailedHandler(config),
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
    new TransactionalLogMapper(inboxLogger, config.logLevel),
    {
      // Allow the ingest tasks to be processed for longer
      messageProcessingTimeoutStrategy: (message) => {
        switch (message.messageType) {
          case MediaServiceMessagingSettings.StartIngest.messageType:
            return 600_000;
          default:
            return 15_000;
        }
      },
      messageProcessingTransactionLevelStrategy: () =>
        IsolationLevel.RepeatableRead,
      messageRetryStrategy: ingestMessageRetryStrategy(
        [...dbMessageHandlers, ...ingestMessageHandlers].map(
          (x) => x.messageType,
        ),
        inboxConfig,
      ),
    },
  );
  shutdownActions.push(shutdownInSrv);
};

const registerRabbitMqMessaging = async (
  app: Express,
  ownerPool: OwnerPgPool,
  storeInboxMessage: StoreInboxMessage,
  config: Config,
  inboxLogger: Logger,
  shutdownActions: ShutdownActionsMiddleware,
): Promise<Broker> => {
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
    ...entityPublishEventSettings.map((settings) =>
      new RascalTransactionalConfigBuilder(settings, config).publishEvent(),
    ),
  ];

  const commonBuilders: RascalConfigBuilder[] = [
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
