import {
  generateLongLivedToken,
  getServiceAccountToken,
  TokenResult,
} from '@axinom/mosaic-id-link-be';
import { Config } from '../config';

/**
 * Get the access token for the service account of the media service
 * @param config the configuration object
 */
export const requestServiceAccountToken = async (
  config: Config,
): Promise<TokenResult> =>
  // TODO: cache this token in memory until it expires
  getServiceAccountToken(
    config.idServiceAuthBaseUrl,
    config.serviceAccountClientId,
    config.serviceAccountClientSecret,
  );

/**
 * Get a long lived token to use in long running background processes from a valid JWT user/service account token
 * @param subjectToken The original user/service account token
 * @param config The configuration object
 */
export const getLongLivedToken = async (
  subjectToken: string,
  config: Config,
): Promise<string> => {
  const serviceAccountToken = await requestServiceAccountToken(config);
  const token = await generateLongLivedToken(
    config.idServiceAuthBaseUrl,
    serviceAccountToken.accessToken,
    subjectToken ?? '',
    604800,
  );
  return token.accessToken;
};
