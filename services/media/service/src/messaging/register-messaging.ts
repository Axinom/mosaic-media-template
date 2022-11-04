import { getOwnerPgPool, initMessagingCounter } from '@axinom/mosaic-db-common';
import { Broker, setupMessagingBroker } from '@axinom/mosaic-message-bus';
import { getShutdownActions, Logger } from '@axinom/mosaic-service-common';
import { Express } from 'express';
import { Config } from '../common';
import { registerCommonMessaging } from '../domains/common/register-messaging';
import { ingestProcessors } from '../domains/ingest-processors';
import {
  entityPublishEventSettings,
  publishingProcessors,
} from '../domains/register-publishing';
import { registerIngestMessaging } from '../ingest/register-ingest-messaging';
import { registerPublishingMessaging } from '../publishing/register-publishing-messaging';
import { getMessagingMiddleware } from './middleware';

export const registerMessaging = async (
  app: Express,
  config: Config,
  logger?: Logger,
): Promise<Broker> => {
  logger = logger ?? new Logger({ context: registerMessaging.name });
  const ingest = registerIngestMessaging(ingestProcessors, app, config);
  const counter = initMessagingCounter(getOwnerPgPool(app));
  const publishing = registerPublishingMessaging(
    entityPublishEventSettings,
    publishingProcessors,
    app,
    config,
  );
  const common = registerCommonMessaging(app, config);
  return setupMessagingBroker({
    app,
    config,
    builders: [...ingest, ...publishing, ...common],
    logger,
    shutdownActions: getShutdownActions(app),
    onMessageMiddleware: getMessagingMiddleware(config, logger),
    components: { counters: { postgresCounter: counter } },
    rascalConfigExportPath: './src/generated/messaging/rascal-schema.json',
  });
};
