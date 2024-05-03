import { getLoginPgPool, getOwnerPgPool } from '@axinom/mosaic-db-common';
import { AuthenticationConfig } from '@axinom/mosaic-id-guard';
import { Express } from 'express';
import { postgraphile } from 'postgraphile';
import { Config } from '../common';
import { buildPostgraphileOptions } from './postgraphile-options';

export const setupPostGraphile = async (
  app: Express,
  config: Config,
  authConfig: AuthenticationConfig,
): Promise<void> => {
  const ownerPool = getOwnerPgPool(app);
  const loginPool = getLoginPgPool(app);
  const options = buildPostgraphileOptions(config, ownerPool, authConfig);

  const middleware = postgraphile(loginPool, 'app_public', options);

  // The req.ip and req.ips values are populated based on the socket address and X-Forwarded-For header, starting at the first untrusted address.
  // This must be aligned with deployed environment configuration.
  app.set('trust proxy', true);
  app.use(middleware);
};
