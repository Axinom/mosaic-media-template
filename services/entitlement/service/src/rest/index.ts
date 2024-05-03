import { AuthenticationConfig } from '@axinom/mosaic-id-guard';
import cors from 'cors';
import { Express, json } from 'express';
import bearerTokenExtractor from 'express-bearer-token';
import { Config } from '../common';
import { setupEntitlementRequestHandling } from '../domains/entitlement/entitlement-handling-middleware';

export function setupRestEndpoints(
  app: Express,
  config: Config,
  authConfig: AuthenticationConfig,
): void {
  app.use(cors());
  app.use(
    ['/v4/entitlement'],
    bearerTokenExtractor(),
    //jwtValidateManagementPermission(authConfig, config, permissionsMap),
    json(),
  );
  setupEntitlementRequestHandling(app, '/v4/entitlement', config);
}
