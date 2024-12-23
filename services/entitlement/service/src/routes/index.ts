import cors from 'cors';
import { Express, json } from 'express';
import bearerTokenExtractor from 'express-bearer-token';
import {
  CountryRequestHandling,
  EntitlementRequestHandling,
  PreviewEntitlementRequestHandling
} from '../domains/controllers';

export function setupRestEndpoints(app: Express): void {
  app.use(cors());
  app.use(bearerTokenExtractor(), json());

  app.post('/v4/entitlement', EntitlementRequestHandling);
  app.post('/v4/preview', PreviewEntitlementRequestHandling);
  app.get('/v2/country', CountryRequestHandling);
}
