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
  setupManifestWebhookEndpoint,
  syncClaimDefinitions,
} from './domains';
import { setupPostGraphile } from './graphql/postgraphile-middleware';
import { registerMessaging } from './messaging/register-messaging';
import { updateGeoDatabase } from './update-geo-database';

const logger = new Logger({ context: 'bootstrap' });

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

  // Register service health endpoint
  setupServiceHealthEndpoint(app);

  await applyMigrations(config);

  const shutdownActions = setupShutdownActions(app, logger);
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

  await syncClaimDefinitions(storeOutboxMessage, ownerPgPool, config);

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

    readiness.setState(true);
  });

  shutdownActions.push(closeHttpServer(server, logger));
}

// Start the application or crash and burn.
bootstrap().catch((error) => {
  logger.fatal(error, { details: { code: MosaicErrors.StartupError.code } });
  process.exit(-1);
});
