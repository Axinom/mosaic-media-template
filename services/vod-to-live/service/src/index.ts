import { IdGuardErrors } from '@axinom/mosaic-id-guard';
import {
  createRabbitMQConnectivityMetric,
  envelopeLoggingMiddleware,
  setupMessagingBroker,
} from '@axinom/mosaic-message-bus';
import {
  closeHttpServer,
  handleGlobalErrors,
  isServiceAvailable,
  Logger,
  MosaicError,
  MosaicErrors,
  setupGlobalConsoleOverride,
  setupGlobalLogMiddleware,
  setupGlobalSkipMaskMiddleware,
  setupLivenessAndReadiness,
  setupMonitoring,
  setupServiceHealthEndpoint,
  setupShutdownActions,
  tenantEnvironmentIdsLogMiddleware,
  trimErrorsSkipMaskMiddleware,
} from '@axinom/mosaic-service-common';
import express from 'express';
import { getFullConfig } from './common';
import { AzureStorage, KeyServiceApi, VirtualChannelApi } from './domains';
import { registerMessaging } from './messaging/register-messaging';

const logger = new Logger({ context: 'bootstrap' });

// Entry point for the service. For annotated version please see /services/media/service/src/index.ts.
async function bootstrap(): Promise<void> {
  handleGlobalErrors(logger);
  setupGlobalSkipMaskMiddleware(trimErrorsSkipMaskMiddleware);
  setupGlobalConsoleOverride(logger);
  const config = getFullConfig();
  const app = express();
  setupGlobalLogMiddleware([tenantEnvironmentIdsLogMiddleware(config)]);

  const { readiness } = setupLivenessAndReadiness(config);

  // Check ID service is available
  if (!(await isServiceAvailable(config.idServiceAuthBaseUrl))) {
    throw new MosaicError(IdGuardErrors.IdentityServiceNotAccessible);
  }

  // Register service health endpoint
  setupServiceHealthEndpoint(app);

  const shutdownActions = setupShutdownActions(app, logger);

  const storage = new AzureStorage(
    config.azureStorageConnection,
    config.azureBlobContainerName,
  );

  const virtualChannelApi = new VirtualChannelApi(
    config.virtualChannelManagementApiBaseUrl,
    config.virtualChannelManagementApiKey,
  );

  const keyServiceApi = new KeyServiceApi(config);
  const broker = await setupMessagingBroker({
    app,
    config,
    builders: registerMessaging(
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
    metrics: [createRabbitMQConnectivityMetric(broker)],
  });

  const server = app.listen(config.port, () => {
    if (config.isDev) {
      logger.log({
        message: `🚀 Server ready at http://localhost:${config.port}`,
        context: 'vodToLiveAppEndpoint',
      });
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
