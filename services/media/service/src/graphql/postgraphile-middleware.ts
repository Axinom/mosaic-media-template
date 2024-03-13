import { getLoginPgPool, getOwnerPgPool } from '@axinom/mosaic-db-common';
import { forwardToGraphiQl } from '@axinom/mosaic-graphql-common';
import { AuthenticationConfig } from '@axinom/mosaic-id-guard';
import { getMessagingBroker } from '@axinom/mosaic-message-bus';
import {
  getHttpServer,
  getWebsocketMiddlewares,
} from '@axinom/mosaic-service-common';
import { altairExpress } from 'altair-express-middleware';
import { Express } from 'express';
import { enhanceHttpServerWithSubscriptions, postgraphile } from 'postgraphile';
import { Config } from '../common';
import { buildPostgraphileOptions } from './postgraphile-options';

export const setupPostGraphile = async (
  app: Express,
  config: Config,
  authConfig: AuthenticationConfig,
): Promise<void> => {
  const websocketMiddlewares = getWebsocketMiddlewares(app);
  const broker = getMessagingBroker(app);
  const ownerPool = getOwnerPgPool(app);
  const loginPool = getLoginPgPool(app);
  const options = buildPostgraphileOptions(
    config,
    ownerPool,
    broker,
    websocketMiddlewares,
    authConfig,
  );

  if (config.graphqlGuiEnabled) {
    app.use(forwardToGraphiQl());
    app.use('/altair', altairExpress({ endpointURL: '/graphql' }));
  }

  const middleware = postgraphile(loginPool, 'app_public', options);
  app.use(middleware);

  const httpServer = getHttpServer(app);
  if (httpServer) {
    await enhanceHttpServerWithSubscriptions(httpServer, middleware);
  }
};
