/* eslint-disable no-console */
import { getDevAccessToken } from '@axinom/mosaic-cli';
import { isNullOrWhitespace } from '@axinom/mosaic-service-common';

export const getIdToken = async (
  permissionsFile: string,
  clientId?: string,
  clientSecret?: string,
  authEndpoint?: string,
): Promise<string> => {
  if (
    isNullOrWhitespace(clientId) ||
    isNullOrWhitespace(clientSecret) ||
    isNullOrWhitespace(authEndpoint)
  ) {
    throw new Error(
      'Please ensure the root environment variables [DEV_SERVICE_ACCOUNT_CLIENT_ID], [DEV_SERVICE_ACCOUNT_CLIENT_SECRET] and [ID_SERVICE_AUTH_BASE_URL] have been configured.',
    );
  }

  const result = await getDevAccessToken({
    authEndpoint,
    clientId,
    clientSecret,
    permissionsFile,
  });
  return result.accessToken;
};
