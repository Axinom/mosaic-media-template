import {
  CreateRabbitMQConnectivityMetric,
  envelopeLoggingMiddleware,
  setupMessagingBroker,
} from '@axinom/mosaic-message-bus';
import {
  closeHttpServer,
  handleGlobalErrors,
  Logger,
  MosaicErrors,
  setupGlobalConsoleOverride,
  setupGlobalLogMiddleware,
  setupGlobalSkipMaskMiddleware,
  setupLivenessAndReadiness,
  setupMonitoring,
  setupShutdownActions,
  tenantEnvironmentIdsLogMiddleware,
  trimErrorsSkipMaskMiddleware,
} from '@axinom/mosaic-service-common';
import bodyParser from 'body-parser';
import express from 'express';
import { getFullConfig } from './common';
import {
  AzureStorage,
  KeyServiceApi,
  setupPrePublishingValidationWebhook,
  VirtualChannelApi,
} from './domains';
import { registerMessaging } from './messaging/register-messaging';

const logger = new Logger({ context: 'bootstrap' });

// Entry point for the service. For annotated version please see /services/media/service/src/index.ts.
async function bootstrap(): Promise<void> {
  handleGlobalErrors(logger);
  setupGlobalSkipMaskMiddleware(trimErrorsSkipMaskMiddleware);
  setupGlobalConsoleOverride(logger);
  const app = express();
  app.use(
    bodyParser.json({
      limit: '50mb',
    }),
  );
  const config = getFullConfig();
  setupGlobalLogMiddleware([tenantEnvironmentIdsLogMiddleware(config)]);

  const { readiness } = setupLivenessAndReadiness(config);

  const shutdownActions = setupShutdownActions(app, logger);

  const storage = new AzureStorage(
    config.azureStorageConnection,
    config.azureBlobContainerName,
  );

  const virtualChannelApi = new VirtualChannelApi(
    config.virtualChannelApiBaseUrl,
  );

  const keyServiceApi = new KeyServiceApi(
    config.keyServiceApiBaseUrl,
    config.keyServiceTenantId,
    config.keyServiceManagementKey,
    config.drmKeySeedId,
  );
  const broker = await setupMessagingBroker({
    app,
    config,
    builders: registerMessaging(
      app,
      config,
      storage,
      virtualChannelApi,
      keyServiceApi,
    ),
    logger,
    shutdownActions,
    onMessageMiddleware: [envelopeLoggingMiddleware(logger)],
    rascalConfigExportPath: './src/generated/messaging/rascal-schema.json',
  });

  setupMonitoring(config, {
    metrics: [CreateRabbitMQConnectivityMetric(broker)],
  });

  setupPrePublishingValidationWebhook(app, config, storage);

  const server = app.listen(config.port, () => {
    if (config.isDev) {
      logger.log(`http://localhost:${config.port}`);
    } else {
      logger.log('App is ready!');
    }

    readiness.setState(true);
  });

  shutdownActions.push(closeHttpServer(server, logger));
}

// Start the application or crash and burn.
bootstrap().catch((error) => {
  logger.fatal(error, { details: { code: MosaicErrors.StartupError.code } });
  process.exit(-1);
});
