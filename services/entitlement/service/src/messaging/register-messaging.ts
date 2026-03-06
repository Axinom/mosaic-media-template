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

import { ShutdownActionsMiddleware } from '@axinom/mosaic-service-common';
import {
  RabbitMqInboxWriter,
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

  /*
  // Uncomment when there is a need to handle messages arriving in the inbox.
  // calling `registerTransactionalInboxHandlers` without any `messageHandlers` is not allowed.

  const logMapper = new TransactionalLogMapper(inboxLogger, config.logLevel);

  registerTransactionalInboxHandlers(
    config,
    inboxConfig,
    logMapper,
    shutdownActions,
  );
  */

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

// eslint-disable-next-line unused-imports/no-unused-vars
const registerTransactionalInboxHandlers = (
  config: Config,
  inboxConfig: PollingListenerConfig,
  logMapper: TransactionalLogMapper,
  shutdownActions: ShutdownActionsMiddleware,
): void => {
  const messageHandlers: TransactionalMessageHandler[] = [];

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
  shutdownActions: ShutdownActionsMiddleware,
): Promise<Broker> => {
  const storeInboxMessage = setupInboxStorage(inboxConfig, inboxLogger, config);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const inboxWriter = new RabbitMqInboxWriter(
    storeInboxMessage,
    ownerPool,
    inboxLogger,
    {
      customMessagePreProcessor: (message) => {
        switch (message.messagingSettings.messageType) {
          default:
            message.concurrency = 'parallel';
            break;
        }
      },
    },
  );

  const rascalBuilders: RascalConfigBuilder[] = [];

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
