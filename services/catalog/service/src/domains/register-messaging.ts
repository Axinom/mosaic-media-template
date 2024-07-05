import { envelopeLoggingMiddleware } from '@axinom/mosaic-message-bus';
import { Express } from 'express';
import { Config } from '../common';
import {
  registerChannelsHandlers,
  registerChannelsMessaging,
} from './channels/register-channels-messaging';
import {
  registerCollectionsHandlers,
  registerCollectionsMessaging,
} from './collections/register-collections-messaging';
import {
  registerMoviesHandlers,
  registerMoviesMessaging,
} from './movies/register-movies-messaging';
import {
  registerTvshowsHandlers,
  registerTvshowsMessaging,
} from './tvshows/register-tvshows-messaging';

import { initMessagingCounter, OwnerPgPool } from '@axinom/mosaic-db-common';
import { Broker, setupMessagingBroker } from '@axinom/mosaic-message-bus';
import { Logger } from '@axinom/mosaic-service-common';

import { ShutdownActionsMiddleware } from '@axinom/mosaic-service-common';
import {
  RabbitMqInboxWriter,
  setupInboxStorage,
  TransactionalLogMapper,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  getInboxPollingListenerSettings,
  initializePollingMessageListener,
  PollingListenerConfig,
} from 'pg-transactional-outbox';

export const registerMessaging = async (
  app: Express,
  ownerPool: OwnerPgPool,
  config: Config,
  shutdownActions: ShutdownActionsMiddleware,
): Promise<Broker> => {
  const inboxLogger = new Logger({ context: 'Transactional inbox' });
  const logMapper = new TransactionalLogMapper(inboxLogger, config.logLevel);
  const inboxConfig: PollingListenerConfig = {
    outboxOrInbox: 'inbox',
    dbListenerConfig: {
      connectionString: config.dbOwnerConnectionString,
    },
    dbHandlerConfig: { connectionString: config.dbOwnerConnectionString },
    settings: getInboxPollingListenerSettings(),
  };

  const storeInboxMessage = setupInboxStorage(inboxConfig, inboxLogger, config);
  const inboxWriter = new RabbitMqInboxWriter(
    storeInboxMessage,
    ownerPool,
    inboxLogger,
    {
      customMessagePreProcessor: (message) => {
        message.concurrency = 'parallel';
      },
    },
  );

  const counter = initMessagingCounter(ownerPool);
  const broker = await setupMessagingBroker({
    app,
    config,
    builders: [
      ...registerMoviesMessaging(inboxWriter, config),
      ...registerTvshowsMessaging(inboxWriter, config),
      ...registerCollectionsMessaging(inboxWriter, config),
      ...registerChannelsMessaging(inboxWriter, config),
    ],
    logger: inboxLogger,
    shutdownActions,
    onMessageMiddleware: [envelopeLoggingMiddleware(inboxLogger)],
    components: { counters: { postgresCounter: counter } },
    rascalConfigExportPath: './src/generated/messaging/rascal-schema.json',
  });

  const [shutdownInSrv] = initializePollingMessageListener(
    inboxConfig,
    [
      ...registerMoviesHandlers(config),
      ...registerTvshowsHandlers(config),
      ...registerCollectionsHandlers(config),
      ...registerChannelsHandlers(config),
    ],
    logMapper,
  );
  shutdownActions.push(shutdownInSrv);

  return broker;
};
