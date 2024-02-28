import {
  createPostgresPoolConnectivityMetric,
  getLoginPgPool,
  getOwnerPgPool,
  initMessagingCounter,
  setupLoginPgPool,
  setupOwnerPgPool,
} from '@axinom/mosaic-db-common';
import { forwardToGraphiQl } from '@axinom/mosaic-graphql-common';
import {
  createRabbitMQConnectivityMetric,
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
  setupLivenessAndReadiness,
  setupMonitoring,
  setupServiceHealthEndpoint,
  setupShutdownActions,
  tenantEnvironmentIdsLogMiddleware,
} from '@axinom/mosaic-service-common';
import express from 'express';
import { PoolConfig } from 'pg';
import { postgraphile } from 'postgraphile';
import { applyMigrations, getFullConfig } from './common';
import { registerMessaging } from './domains/register-messaging';
import { buildPostgraphileOptions } from './graphql/postgraphile-options';

const logger = new Logger({ context: 'bootstrap' });

// Entry point for the service. For annotated version please see /services/media/service/src/index.ts.
async function bootstrap(): Promise<void> {
  handleGlobalErrors(logger);
  setupGlobalConsoleOverride(logger);
  const config = getFullConfig();
  setupGlobalLogMiddleware([tenantEnvironmentIdsLogMiddleware(config)]);
  const app = express();

  const { readiness } = setupLivenessAndReadiness(config);

  // Register service health endpoint
  setupServiceHealthEndpoint(app);

  await applyMigrations(config);
  const shutdownActions = setupShutdownActions(app, logger);
  const poolConfig: PoolConfig = { max: config.pgPoolMaxConnections };
  setupOwnerPgPool(
    app,
    config.dbOwnerConnectionString,
    logger,
    shutdownActions,
    poolConfig,
  );
  const loginPool = setupLoginPgPool(
    app,
    config.dbLoginConnectionString,
    logger,
    shutdownActions,
    poolConfig,
  );
  const counter = initMessagingCounter(getOwnerPgPool(app));
  const broker = await setupMessagingBroker({
    app,
    config,
    builders: registerMessaging(app, config),
    logger,
    shutdownActions,
    onMessageMiddleware: [envelopeLoggingMiddleware(logger)],
    components: { counters: { postgresCounter: counter } },
    rascalConfigExportPath: './src/generated/messaging/rascal-schema.json',
  });

  setupMonitoring(config, {
    metrics: [
      createPostgresPoolConnectivityMetric(getLoginPgPool(app), 'loginPool'),
      createRabbitMQConnectivityMetric(broker),
    ],
  });

  if (config.graphqlGuiEnabled) {
    app.use(forwardToGraphiQl());
  }

  app.use(
    postgraphile(loginPool, 'app_public', buildPostgraphileOptions(config)),
  );

  const server = app.listen(config.port, () => {
    if (config.isDev) {
      logger.log(`http://localhost:${config.port}/graphiql`);
    } else {
      logger.log('App is ready!');
    }

    readiness.setState(true);
  });

  shutdownActions.push(closeHttpServer(server, logger));
}

bootstrap().catch((error) => {
  logger.fatal(error, { details: { code: MosaicErrors.StartupError.code } });
  process.exit(-1);
});
