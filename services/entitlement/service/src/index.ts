import {
  createPostgresPoolConnectivityMetric,
  getLoginPgPool,
  setupLoginPgPool,
  setupOwnerPgPool,
} from '@axinom/mosaic-db-common';
import {
  AuthenticationConfig,
  IdGuardErrors,
  setupEndUserAuthentication,
} from '@axinom/mosaic-id-guard';
import { createRabbitMQConnectivityMetric } from '@axinom/mosaic-message-bus';
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
import { PoolConfig } from 'pg';
import { applyMigrations, getFullConfig } from './common';
import {
  setupEntitlementWebhookEndpoint,
  startDrmSettingsRefresh,
  stopDrmSettingsRefresh,
  waitForDrmSettings,
  setupManifestWebhookEndpoint,
} from './domains';
import { setupPostGraphile } from './graphql/postgraphile-middleware';
import { registerMessaging } from './messaging/register-messaging';
import { updateGeoDatabase } from './update-geo-database';

const logger = new Logger({ context: 'bootstrap' });

/** Longest time the readiness waits for the first DRM settings load. */
const DRM_SETTINGS_READINESS_TIMEOUT_IN_MS = 15 * 1000;

// Entry point for the service. For annotated version please see /services/media/service/src/index.ts.
async function bootstrap(): Promise<void> {
  handleGlobalErrors(logger);
  setupGlobalSkipMaskMiddleware(trimErrorsSkipMaskMiddleware);
  setupGlobalConsoleOverride(logger);
  const app = express();
  const config = getFullConfig();
  setupGlobalLogMiddleware([tenantEnvironmentIdsLogMiddleware(config)]);

  // intentionally not doing await because this can run for ~1 min
  updateGeoDatabase(config);

  const { readiness } = setupLivenessAndReadiness(config);

  // Check ID service is available
  if (!(await isServiceAvailable(config.idServiceAuthBaseUrl))) {
    throw new MosaicError(IdGuardErrors.IdentityServiceNotAccessible);
  }

  // Load and refresh the DRM settings in the background (doesn't block or fail the startup)
  startDrmSettingsRefresh(config);

  // Register service health endpoint
  setupServiceHealthEndpoint(app);

  await applyMigrations(config);

  const shutdownActions = setupShutdownActions(app, logger);
  shutdownActions.push(stopDrmSettingsRefresh);
  const poolConfig: PoolConfig = { max: config.pgPoolMaxConnections };
  const ownerPgPool = setupOwnerPgPool(
    app,
    config.dbOwnerConnectionString,
    logger,
    shutdownActions,
    poolConfig,
  );
  setupLoginPgPool(
    app,
    config.dbLoginConnectionString,
    logger,
    shutdownActions,
    poolConfig,
  );

  // Configure messaging: subscribe to topics, create queues, register handlers, start transactional outbox/inbox listeners
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { broker, storeOutboxMessage } = await registerMessaging(
    app,
    ownerPgPool,
    config,
    shutdownActions,
  );

  setupMonitoring(config, {
    metrics: [
      createPostgresPoolConnectivityMetric(
        logger,
        getLoginPgPool(app),
        'loginPool',
      ),
      createRabbitMQConnectivityMetric(broker),
    ],
  });

  // await syncClaimDefinitions(storeOutboxMessage, ownerPgPool, config);

  const authConfig: AuthenticationConfig = {
    tenantId: config.tenantId,
    environmentId: config.environmentId,
    authEndpoint: config.userServiceAuthBaseUrl,
  };
  setupEndUserAuthentication(app, ['/graphql'], authConfig);
  setupEntitlementWebhookEndpoint(app, config);
  setupManifestWebhookEndpoint(app, config);

  await setupPostGraphile(app, config, authConfig);

  const server = app.listen(config.port, () => {
    if (config.isDev) {
      logger.log({
        message: `🚀 Server ready at http://localhost:${config.port}`,
        context: 'entitlementAppEndpoint',
      });
    } else {
      logger.log('App is ready!');
    }

    // Become ready once the DRM settings are loaded, so new instances of a
    // rolling deployment can sign entitlement messages right away. Become
    // ready anyway after the timeout: the DRM Service may not be enabled for
    // the environment yet, and clear content doesn't need it.
    void waitForDrmSettings(config, DRM_SETTINGS_READINESS_TIMEOUT_IN_MS).then(
      (loaded) => {
        if (!loaded) {
          logger.warn(
            `The DRM settings were not loaded within ${DRM_SETTINGS_READINESS_TIMEOUT_IN_MS} ms. The service is ready anyway and keeps loading them in the background.`,
          );
        }
        readiness.setState(true);
      },
    );
  });

  shutdownActions.push(closeHttpServer(server, logger));
}

// Start the application or crash and burn.
bootstrap().catch((error) => {
  logger.fatal(error, { details: { code: MosaicErrors.StartupError.code } });
  process.exit(-1);
});
