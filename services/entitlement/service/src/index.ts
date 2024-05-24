import {
  createPostgresPoolConnectivityMetric,
  getLoginPgPool,
  setupLoginPgPool,
  setupOwnerPgPool,
} from '@axinom/mosaic-db-common';
import { IdGuardErrors } from '@axinom/mosaic-id-guard';
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
import { applyMigrations, GeoIPService, getFullConfig } from './common';
// import {
//   setupEntitlementWebhookEndpoint,
//   setupManifestWebhookEndpoint,
// } from './domains';
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

  // // intentionally not doing await because this can run for ~1 min
  // updateGeoDatabase(config);

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
      createPostgresPoolConnectivityMetric(getLoginPgPool(app), 'loginPool'),
    ],
  });

  // const authConfig: AuthenticationConfig = {
  //   tenantId: config.tenantId,
  //   environmentId: config.environmentId,
  //   authEndpoint: config.userServiceAuthBaseUrl,
  // };
  // // setupEndUserAuthentication(app, ['/graphql'], authConfig);
  // // setupEntitlementWebhookEndpoint(app, config);
  // // setupManifestWebhookEndpoint(app, config);

  // await setupPostGraphile(app, config, authConfig);

  // Configure REST endpoints additionally to GraphQL (auxiliary needs such as file download)

  await GeoIPService.getInstance().startDatabaseUpdater();
  app.set('trust proxy', true); // trust first proxy and enable req.ip / req.ips

  setupRestEndpoints(app);

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

// Start the application or crash and burn.
bootstrap().catch((error) => {
  logger.fatal(error, { details: { code: MosaicErrors.StartupError.code } });
  process.exit(-1);
});
