import {
  createPostgresPoolConnectivityMetric,
  setupLoginPgPool,
  setupOwnerPgPool,
} from '@axinom/mosaic-db-common';
import {
  AuthenticationConfig,
  IdGuardErrors,
  setupManagementAuthentication,
  setupManagementGQLSubscriptionAuthentication,
} from '@axinom/mosaic-id-guard';
import { getServiceAccountToken } from '@axinom/mosaic-id-link-be';
import { createRabbitMQConnectivityMetric } from '@axinom/mosaic-message-bus';
import {
  closeHttpServer,
  handleGlobalErrors,
  isServiceAvailable,
  Logger,
  MosaicError,
  MosaicErrors,
  mosaicFavicon,
  setupGlobalConsoleOverride,
  setupGlobalLogMiddleware,
  setupGlobalSkipMaskMiddleware,
  setupHttpServerWithWebsockets,
  setupLivenessAndReadiness,
  setupMonitoring,
  setupServiceHealthEndpoint,
  setupShutdownActions,
  tenantEnvironmentIdsLogMiddleware,
  trimErrorsSkipMaskMiddleware,
} from '@axinom/mosaic-service-common';
import { createMessagingMetric } from '@axinom/mosaic-transactional-inbox-outbox';
import express from 'express';
import helmet from 'helmet';
import { PoolConfig } from 'pg';
import {
  applyMigrations,
  getFullConfig,
  HEALTH_CHECK_ROUTING_KEY,
  setIsLocalizationEnabledDbFunction,
  updateConfigWithActualLocalizationAvailability,
} from './common';
import { registerTypes, syncPermissions } from './domains';
import { setupPostGraphile } from './graphql';
import { registerMessaging } from './messaging';

const logger = new Logger({ context: bootstrap.name });

async function bootstrap(): Promise<void> {
  handleGlobalErrors(logger);
  setupGlobalSkipMaskMiddleware(trimErrorsSkipMaskMiddleware);
  setupGlobalConsoleOverride(logger);
  const app = express();
  const config = getFullConfig();
  setupGlobalLogMiddleware([tenantEnvironmentIdsLogMiddleware(config)]);

  // Create a HTTP server with all WebSocket middleware registered, needed for GQL subscriptions.
  const authConfig: AuthenticationConfig = {
    tenantId: config.tenantId,
    environmentId: config.environmentId,
    authEndpoint: config.idServiceAuthBaseUrl,
  };
  const httpServer = setupHttpServerWithWebsockets(
    app,
    logger,
    setupManagementGQLSubscriptionAuthentication(authConfig),
  );
  const { readiness } = setupLivenessAndReadiness(config);

  // Check ID service is available
  if (!(await isServiceAvailable(config.idServiceAuthBaseUrl))) {
    throw new MosaicError(IdGuardErrors.IdentityServiceNotAccessible);
  }

  await updateConfigWithActualLocalizationAvailability(config, logger);

  // Register service health endpoint
  setupServiceHealthEndpoint(app);

  app.use(mosaicFavicon);

  // Add helmet middleware to improve security.
  app.use(helmet());

  // Run database migrations to the latest committed state.
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
  await setIsLocalizationEnabledDbFunction(
    config.isLocalizationEnabled,
    ownerPgPool,
  );
  const loginPgPool = setupLoginPgPool(
    app,
    config.dbLoginConnectionString,
    logger,
    shutdownActions,
    poolConfig,
  );

  await syncPermissions(config, logger);

  const { broker, storeOutboxMessage } = await registerMessaging(
    app,
    config,
    shutdownActions,
  );

  await registerTypes(storeOutboxMessage, loginPgPool, config);

  setupMonitoring(config, {
    metrics: [
      createPostgresPoolConnectivityMetric(logger, loginPgPool, 'loginPool'),
      createRabbitMQConnectivityMetric(broker),
      createMessagingMetric(
        HEALTH_CHECK_ROUTING_KEY,
        storeOutboxMessage,
        async () =>
          (
            await getServiceAccountToken(
              config.idServiceAuthBaseUrl,
              config.serviceAccountClientId,
              config.serviceAccountClientSecret,
            )
          ).accessToken,
        ownerPgPool,
      ),
    ],
  });

  setupManagementAuthentication(app, ['/graphql'], authConfig);

  await setupPostGraphile(
    app,
    ownerPgPool,
    loginPgPool,
    config,
    authConfig,
    storeOutboxMessage,
  );

  httpServer.addListener('request', app);

  httpServer.listen(config.port, () => {
    if (config.isDev) {
      logger.log(`🚀 Server ready at http://localhost:${config.port}/graphiql`);
    } else {
      logger.log('App is ready!');
    }
    readiness.setState(true);
  });

  shutdownActions.push(closeHttpServer(httpServer, logger));
}

bootstrap().catch((error) => {
  logger.fatal(error, { details: { code: MosaicErrors.StartupError.code } });
  process.exit(-1);
});
