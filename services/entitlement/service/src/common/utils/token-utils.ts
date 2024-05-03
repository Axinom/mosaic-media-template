import { getServiceAccountToken, TokenResult } from '@axinom/mosaic-id-link-be';
import { Config } from '../config';

/**
 * Get the access token for the service account of the entitlement service
 * @param config the configuration object
 */
export const requestServiceAccountToken = async (
  config: Config,
): Promise<TokenResult> =>
  getServiceAccountToken(
    config.idServiceAuthBaseUrl,
    config.serviceAccountClientId,
    config.serviceAccountClientSecret,
  );
