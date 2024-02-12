import { setupLoginPgPool, setupOwnerPgPool } from '@axinom/mosaic-db-common';
import {
  AuthenticationConfig,
  IdGuardErrors,
  setupManagementAuthentication,
  setupManagementGQLSubscriptionAuthentication,
} from '@axinom/mosaic-id-guard';
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
  setupHttpServerWithWebsockets,
  setupLivenessAndReadiness,
  setupMonitoring,
  setupServiceHealthEndpoint,
  setupShutdownActions,
  tenantEnvironmentIdsLogMiddleware,
  trimErrorsSkipMaskMiddleware,
} from '@axinom/mosaic-service-common';
import {
  setupOutboxStorage,
  setupTransactionalOutboxListener,
} from '@axinom/mosaic-transactional-inbox-outbox';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { PoolConfig } from 'pg';
import { applyMigrations, getFullConfig } from './common';
import { syncPermissions } from './domains/permission-definition';
import { populateSeedData } from './domains/populate-seed-data';
import { registerTypes } from './domains/register-types';
import { setupPostGraphile } from './graphql/postgraphile-middleware';
import { registerMessaging } from './messaging/register-messaging';

// Create the default logger instance to log the application bootstrap sequence and pass to downstream components (where it makes sense).
const logger = new Logger({ context: 'bootstrap' });

// Entry point for the service. Here you configure and register all middlewares and other subsystems.
async function bootstrap(): Promise<void> {
  // Adds `on` handlers for `uncaughtException` and `unhandledRejection` events of node process.
  // Logs all caught errors with log level FATAL, exiting the node process with code 1.
  handleGlobalErrors(logger);
  // Enable a global logging middleware that skips certain logs from having their log values masked (skip false positives).
  // A different middleware can be used in every logger instance where needed.
  setupGlobalSkipMaskMiddleware(trimErrorsSkipMaskMiddleware);
  // Override console calls (mainly from other 3-d party libs) to log them using mosaic logger in a JSON format.
  setupGlobalConsoleOverride(logger);
  // Create an Express application instance that will be running this service.
  const app = express();
  // Create a config object.
  const config = getFullConfig();

  // Set middleware that modifies resulting log object, e.g. adding tenantId and
  // environmentId to details
  setupGlobalLogMiddleware([tenantEnvironmentIdsLogMiddleware(config)]);
  const authConfig: AuthenticationConfig = {
    tenantId: config.tenantId,
    environmentId: config.environmentId,
    authEndpoint: config.idServiceAuthBaseUrl,
  };
  // Create a HTTP server with all WebSocket middleware registered, needed for GQL subscriptions.
  const httpServer = setupHttpServerWithWebsockets(
    app,
    logger,
    setupManagementGQLSubscriptionAuthentication(authConfig),
  );
  // Set up liveness and readiness probe endpoints for Kubernetes.
  const { readiness } = setupLivenessAndReadiness(config);

  // Check ID service is available
  if (!(await isServiceAvailable(config.idServiceAuthBaseUrl))) {
    throw new MosaicError(IdGuardErrors.IdentityServiceNotAccessible);
  }

  // Register service health endpoint
  setupServiceHealthEndpoint(app);

  // Enable multipart request support for GQL to support file upload.
  app.use(graphqlUploadExpress());
  // Run database migrations to the latest committed state.
  await applyMigrations(config);

  // Register shutdown actions. These actions will be performed on service shutdown; in the order of registration.
  const shutdownActions = setupShutdownActions(app, logger);
  const poolConfig: PoolConfig = { max: config.pgPoolMaxConnections };
  // Create environment owner connection pool (internal use).
  const ownerPgPool = setupOwnerPgPool(
    app,
    config.dbOwnerConnectionString,
    logger,
    shutdownActions,
    poolConfig,
  );
  // Create login connection pool (used by service components, including PostGraphile).
  const loginPgPool = setupLoginPgPool(
    app,
    config.dbLoginConnectionString,
    logger,
    shutdownActions,
    poolConfig,
  );

  // Populate the DB with some initial seed data and sync defined permissions to the ID service.
  await Promise.all([
    populateSeedData(ownerPgPool, logger),
    syncPermissions(config, logger),
  ]);

  // Configure messaging: subscribe to topics, create queues, register handlers, start transactional outbox/inbox listeners
  const storeOutboxMessage = setupOutboxStorage(config);
  const broker = await registerMessaging(
    app,
    ownerPgPool,
    config,
    storeOutboxMessage,
    logger,
    shutdownActions,
  );
  const shutdownOutbox = await setupTransactionalOutboxListener(
    config,
    broker,
    logger,
  );
  shutdownActions.push(shutdownOutbox);

  // Configure metrics endpoint for Prometheus.
  setupMonitoring(config, {
    metrics: [
      CreatePostgresPoolConnectivityMetric(loginPgPool, 'loginPool'),
      CreateRabbitMQConnectivityMetric(broker),
    ],
  });

  await registerTypes(storeOutboxMessage, loginPgPool, config);

  // Enable authentication middleware for all requests to /graphql.
  setupManagementAuthentication(app, ['/graphql'], authConfig);

  // Configure the PostGraphile middleware. PostGraphile generates a GraphQL API from the underlying Postgres DB.
  await setupPostGraphile(
    app,
    ownerPgPool,
    loginPgPool,
    config,
    authConfig,
    storeOutboxMessage,
  );

  // Add our (already configured) application to the HTTP server.
  httpServer.addListener('request', app);

  // Start the HTTP server.
  httpServer.listen(config.port, () => {
    if (config.isDev) {
      logger.log({
        message:
          '🚀 Server ready and the following endpoints can be used (altair for file uploads)',
        details: {
          graphiql: `http://localhost:${config.port}/graphiql`,
          altair: `http://localhost:${config.port}/altair`,
        },
      });
    } else {
      logger.log('App is ready!');
    }

    // If we got this far we can probably conclude that the service is ready to receive requests.
    readiness.setState(true);
  });

  // The last shutdown action should be closing the HTTP server.
  shutdownActions.push(closeHttpServer(httpServer, logger));
}

// Start the application or crash and burn.
bootstrap().catch((error) => {
  logger.fatal(error, { details: { code: MosaicErrors.StartupError.code } });
  process.exit(-1);
});
