import { LoginPgPool, OwnerPgPool } from '@axinom/mosaic-db-common';
import { AuthenticationConfig } from '@axinom/mosaic-id-guard';
import {
  getHttpServer,
  getWebsocketMiddlewares,
} from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { altairExpress } from 'altair-express-middleware';
import { Express } from 'express';
import { enhanceHttpServerWithSubscriptions, postgraphile } from 'postgraphile';
import { Config } from '../common';
import { buildPostgraphileOptions } from './postgraphile-options';

export const setupPostGraphile = async (
  app: Express,
  ownerPool: OwnerPgPool,
  loginPool: LoginPgPool,
  config: Config,
  authConfig: AuthenticationConfig,
  storeOutboxMessage: StoreOutboxMessage,
): Promise<void> => {
  const websocketMiddlewares = getWebsocketMiddlewares(app);
  const options = buildPostgraphileOptions(
    config,
    ownerPool,
    storeOutboxMessage,
    websocketMiddlewares,
    authConfig,
  );

  const middleware = postgraphile(loginPool, 'app_public', options);
  app.use(middleware);

  const httpServer = getHttpServer(app);
  if (httpServer) {
    await enhanceHttpServerWithSubscriptions(httpServer, middleware);
  }

  if (config.graphqlGuiEnabled) {
    app.use('/altair', altairExpress({ endpointURL: '/graphql' }));
  }
};
