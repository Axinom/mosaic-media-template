import {
  AuthenticationConfig,
  setupManagementAuthentication,
  setupManagementGQLSubscriptionAuthentication,
} from '@axinom/mosaic-id-guard';
import {
  closeHttpServer,
  handleGlobalErrors,
  Logger,
  MosaicErrors,
  setupGlobalConsoleOverride,
  setupGlobalLogMiddleware,
  setupGlobalSkipMaskMiddleware,
  setupHttpServerWithWebsockets,
  setupLivenessAndReadiness,
  setupShutdownActions,
  tenantEnvironmentIdsLogMiddleware,
  trimErrorsSkipMaskMiddleware,
} from '@axinom/mosaic-service-common';
import { ApolloServer } from 'apollo-server-express';
import axios from 'axios';
import express from 'express';
import { getFullConfig } from './common';
import { syncPermissions } from './common/auth/permission-definitions';

import { CheckAuthorizationDirectiveTransformer } from './common/auth/check-authorization';
import { Schema } from './common/utils/apollo-utils/schema';

// Create the default logger instance to log the application bootstrap sequence and pass to downstream components (where it makes sense).
const logger = new Logger({ context: 'bootstrap' });

// Entry point for the service. Here you configure and register all middleware and other subsystems.
async function bootstrap(): Promise<void> {
  // Adds `on` handlers for `uncaughtExcl FATAL, exiting the node process with code 1.
  handleGlobalErrors(logger);
  // Enable a global logging middleware that skips certain logs from having their log values masked (skip false positives).
  // A different middleware can be used  in every logger instance where needed.
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

  // Register shutdown actions. These actions will be performed on service shutdown; in the order of registration.
  const shutdownActions = setupShutdownActions(app, logger);
  syncPermissions(config, logger);
  // Enable authentication middleware for all requests to /graphql.
  setupManagementAuthentication(app, ['/graphql'], authConfig);
  // Authorization need to be handel separately.

  // Add a request interceptor
  axios.interceptors.request.use(function (configuration) {
    const token = `cms ${config.getUserServiceAPIKey}`;
    if (!configuration.headers) {
      configuration.headers = {};
    }
    configuration.headers.Authorization = token;
    configuration.headers.accept = 'application/json';
    configuration.headers['Content-Type'] = 'application/json';
    configuration.baseURL = config.getUserServiceAPIURL;
    return configuration;
  });

  const modifiedSchema = CheckAuthorizationDirectiveTransformer(
    config,
    'checkPermission',
  )(Schema());

  const apolloServer: ApolloServer = new ApolloServer({
    schema: modifiedSchema,
    context: ({ req }) => {
      //ToDo, can check authentication and block user from this point. Currently this check will done in later stage.
      return req;
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  // Add our (already configured) application to the HTTP server.
  httpServer.addListener('request', app);

  // Start the HTTP server.
  httpServer.listen(config.port, () => {
    if (config.isDev) {
      logger.log({
        message: 'Altair client can be used to upload files',
        details: {
          graphiql: `http://localhost:${config.port}/graphql`,
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
