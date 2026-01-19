import {
  createPostgresPoolConnectivityMetric,
  getLoginPgPool,
  setupLoginPgPool,
  setupOwnerPgPool,
} from '@axinom/mosaic-db-common';
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
  setupServiceHealthEndpoint,
  setupShutdownActions,
  tenantEnvironmentIdsLogMiddleware,
  trimErrorsSkipMaskMiddleware,
} from '@axinom/mosaic-service-common';
import express from 'express';
import { PoolConfig } from 'pg';
import { applyMigrations, GeoIPService, getFullConfig } from './common';

import { setupRestEndpoints } from './routes';

import 'reflect-metadata';

const logger = new Logger({ context: 'bootstrap' });

// Entry point for the service. For annotated version please see /services/media/service/src/index.ts.
async function bootstrap(): Promise<void> {
  handleGlobalErrors(logger);
  setupGlobalSkipMaskMiddleware(trimErrorsSkipMaskMiddleware);
  setupGlobalConsoleOverride(logger);
  const app = express();
  const config = getFullConfig();
  setupGlobalLogMiddleware([tenantEnvironmentIdsLogMiddleware(config)]);

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
  setupLoginPgPool(
    app,
    config.dbLoginConnectionString,
    logger,
    shutdownActions,
    poolConfig,
  );

  setupMonitoring(config, {
    metrics: [
      createPostgresPoolConnectivityMetric(
        logger,
        getLoginPgPool(app),
        'loginPool',
      ),
    ],
  });

  await GeoIPService.getInstance().startDatabaseUpdater();
  app.set('trust proxy', true); // trust first proxy and enable req.ip / req.ips

  setupRestEndpoints(app);

  if (config.recurlyEntitlementMockRequest) {
    logger.warn(
      'Recurly entitlement mock request is enabled in the configuration (RECURLY_ENTITLEMENT_MOCK_REQUEST).',
    );
  }

  const server = app.listen(config.port, () => {
    if (config.isDev) {
      logger.log(`App is ready! Listening on port ${config.port}`);
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
