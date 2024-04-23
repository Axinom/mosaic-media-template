import {
  generateLongLivedToken,
  getServiceAccountToken,
} from '@axinom/mosaic-id-link-be';
import NodeCache from 'node-cache';
import { Config } from '../config';

const tokenExpirationInSeconds = 7 * 24 * 60 * 60; // 7 days
const refreshAfterInSeconds = 60 * 60; // 1 hour

// We convert service account token to long lived token that is valid for 7 days
// But refresh it after 1 hour to account for possible permission changes
const cache = new NodeCache({ stdTTL: refreshAfterInSeconds });

/**
 * Get the access token for the service account of the media service
 * @param config the configuration object
 */
export const requestServiceAccountToken = async (
  config: Pick<
    Config,
    | 'idServiceAuthBaseUrl'
    | 'serviceAccountClientId'
    | 'serviceAccountClientSecret'
  >,
): Promise<string> => {
  const cacheKey = `serviceAccountToken`;
  const token = cache.get<string>(cacheKey);
  if (token !== undefined) {
    return token;
  }
  const sat = await getServiceAccountToken(
    config.idServiceAuthBaseUrl,
    config.serviceAccountClientId,
    config.serviceAccountClientSecret,
  );

  const { accessToken } = await generateLongLivedToken(
    config.idServiceAuthBaseUrl,
    sat.accessToken,
    sat.accessToken,
    tokenExpirationInSeconds,
  );
  cache.set(cacheKey, accessToken, refreshAfterInSeconds);
  return accessToken;
};

/**
 * Get a long lived token to use in long running background processes from a valid JWT user/service account token
 * @param subjectToken The original user/service account token
 * @param config The configuration object
 */
export const getLongLivedToken = async (
  subjectToken: string,
  config: Pick<
    Config,
    | 'idServiceAuthBaseUrl'
    | 'serviceAccountClientId'
    | 'serviceAccountClientSecret'
  >,
): Promise<string> => {
  const accessToken = await requestServiceAccountToken(config);
  const token = await generateLongLivedToken(
    config.idServiceAuthBaseUrl,
    accessToken,
    subjectToken,
    tokenExpirationInSeconds,
  );
  return token.accessToken;
};
