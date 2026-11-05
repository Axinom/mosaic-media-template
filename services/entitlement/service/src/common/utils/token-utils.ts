import { getServiceAccountToken } from '@axinom/mosaic-id-link-be';
import { Config } from '../config';

type TokenConfig = Pick<
  Config,
  | 'idServiceAuthBaseUrl'
  | 'serviceAccountClientId'
  | 'serviceAccountClientSecret'
>;

// Get a new token this long before the current one expires, so a token never
// expires while a request that uses it is still running.
const refreshBeforeExpiryInMs = 60 * 1000;

let cachedToken: { accessToken: string; refreshAt: number } | undefined;
let pendingToken: Promise<string> | undefined;

/**
 * Get an access token for the service account of the Entitlement Service. The
 * token is cached until shortly before it expires, and only one token request
 * runs at a time.
 * @param config the configuration object
 */
export const requestServiceAccountToken = async (
  config: TokenConfig,
): Promise<string> => {
  if (cachedToken && Date.now() < cachedToken.refreshAt) {
    return cachedToken.accessToken;
  }

  if (!pendingToken) {
    pendingToken = getServiceAccountToken(
      config.idServiceAuthBaseUrl,
      config.serviceAccountClientId,
      config.serviceAccountClientSecret,
    )
      .then(({ accessToken, expiresInSeconds }) => {
        cachedToken = {
          accessToken,
          refreshAt:
            Date.now() + expiresInSeconds * 1000 - refreshBeforeExpiryInMs,
        };
        return accessToken;
      })
      .finally(() => {
        pendingToken = undefined;
      });
  }
  return pendingToken;
};
