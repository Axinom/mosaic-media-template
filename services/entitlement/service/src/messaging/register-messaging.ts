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
  MonetizationGrantsServiceMultiTenantMessagingSettings,
  SubscriptionMonetizationServiceMultiTenantMessagingSettings,
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
import {
  getInboxPollingListenerSettings,
  getOutboxPollingListenerSettings,
  initializePollingMessageListener,
  PollingListenerConfig,
  TransactionalMessageHandler,
} from 'pg-transactional-outbox';
import {
  ClaimSetPublishedHandler,
  SubscriptionPlanPublishedHandler,
  SyncClaimDefinitionsFailedHandler,
  SyncClaimDefinitionsFinishedHandler,
} from './handlers';

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
  logMapper: TransactionalLogMapper,
  shutdownActions: ShutdownActionsMiddleware,
): void => {
  const messageHandlers: TransactionalMessageHandler[] = [
    new SyncClaimDefinitionsFinishedHandler(config),
    new SyncClaimDefinitionsFailedHandler(config),
    new ClaimSetPublishedHandler(config),
    new SubscriptionPlanPublishedHandler(config),
  ];

  const [shutdownInSrv] = initializePollingMessageListener(
    inboxConfig,
    [...messageHandlers],
    logMapper,
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

  const grantsSettings = MonetizationGrantsServiceMultiTenantMessagingSettings;
  const planSettings =
    SubscriptionMonetizationServiceMultiTenantMessagingSettings;
  const inboxWriter = new RabbitMqInboxWriter(
    storeInboxMessage,
    ownerPool,
    inboxLogger,
    {
      // temporary backward compatibility until all your services are updated and all current messages are processed
      acceptedMessageSettings: [
        grantsSettings.SynchronizeClaimDefinitionsFinished,
        grantsSettings.SynchronizeClaimDefinitionsFailed,
        grantsSettings.ClaimSetPublished,
        planSettings.SubscriptionPlanPublished,
      ],
      customMessagePreProcessor: (message) => {
        switch (message.messagingSettings.messageType) {
          case grantsSettings.SynchronizeClaimDefinitionsFinished.messageType:
          case grantsSettings.SynchronizeClaimDefinitionsFailed.messageType:
            message.concurrency = 'parallel';
            break;
          default:
            message.concurrency = 'sequential';
            break;
        }
      },
    },
  );

  const rascalBuilders: RascalConfigBuilder[] = [
    new RascalTransactionalConfigBuilder(
      MonetizationGrantsServiceMultiTenantMessagingSettings.SynchronizeClaimDefinitions,
      config,
    ).sendCommand(),
    new RascalTransactionalConfigBuilder(
      MonetizationGrantsServiceMultiTenantMessagingSettings.SynchronizeClaimDefinitionsFinished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      MonetizationGrantsServiceMultiTenantMessagingSettings.SynchronizeClaimDefinitionsFailed,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      MonetizationGrantsServiceMultiTenantMessagingSettings.ClaimSetPublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      SubscriptionMonetizationServiceMultiTenantMessagingSettings.SubscriptionPlanPublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
  ];

  const counter = initMessagingCounter(ownerPool);
  return setupMessagingBroker({
    app,
    config,
    builders: [...rascalBuilders],
    logger: inboxLogger,
    shutdownActions,
    onMessageMiddleware: getMessagingMiddleware(config, inboxLogger),
    components: { counters: { postgresCounter: counter } },
    rascalConfigExportPath: './src/generated/messaging/rascal-schema.json',
  });
};
