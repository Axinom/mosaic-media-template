import {
  generateLongLivedToken,
  getServiceAccountToken,
} from '@axinom/mosaic-id-link-be';
import NodeCache from 'node-cache';
import { Config } from '../config';

// By default, service account token is valid for 1 hour
const cache = new NodeCache({ stdTTL: 55 * 60 });

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
  const { accessToken, expiresInSeconds } = await getServiceAccountToken(
    config.idServiceAuthBaseUrl,
    config.serviceAccountClientId,
    config.serviceAccountClientSecret,
  );
  cache.set(cacheKey, accessToken, expiresInSeconds - 5 * 60);
  return accessToken;
};

/**
 * Get a long lived token to use in long running background processes from a valid JWT user/service account token
 * @param subjectToken The original user/service account token
 * @param config The configuration object
 */
export const getLongLivedToken = async (
  subjectToken: string,
  config: Config,
): Promise<string> => {
  const accessToken = await requestServiceAccountToken(config);
  const token = await generateLongLivedToken(
    config.idServiceAuthBaseUrl,
    accessToken,
    subjectToken,
    604800,
  );
  return token.accessToken;
};
