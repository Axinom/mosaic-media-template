import { ensureError, Logger } from '@axinom/mosaic-service-common';
import { Config } from '../config';
import { requestServiceAccountToken } from './token-utils';

/**
 * The media service has the `config.isLocalizationEnabled`. If it is true, we
 * check if the service account has any localization permissions meaning the
 * service is enabled. If there are no permissions the
 * `config.isLocalizationEnabled` is set to false.
 * @param config The service configuration object
 * @param logger Service setup logger
 */
export const updateConfigWithActualLocalizationAvailability = async (
  config: Config,
  logger: Logger,
): Promise<void> => {
  if (!config.isLocalizationEnabled) {
    return;
  }

  const accessToken = await requestServiceAccountToken(config);
  try {
    // Check if the token contains the localization service as a permission
    const parsed = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString(),
    );
    const localizationPermissions: string[] | undefined =
      parsed.permissions['ax-localization-service'];
    if (
      localizationPermissions === undefined ||
      localizationPermissions.length === 0
    ) {
      config.isLocalizationEnabled = false;
    }
  } catch (e) {
    const error = ensureError(e);
    logger.warn(
      error,
      'Could not get the service account token to check if the localization service is enabled.',
    );
  }
};
