import { getAuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
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

  try {
    const accessToken = await requestServiceAccountToken(config);
    const subject = await getAuthenticatedManagementSubject(accessToken, {
      tenantId: config.tenantId,
      environmentId: config.environmentId,
      authEndpoint: config.idServiceAuthBaseUrl,
    });
    const localizationPermissions =
      subject.permissions['ax-localization-service'];
    if (
      localizationPermissions === undefined ||
      localizationPermissions.length === 0
    ) {
      logger.warn(
        'The configuration value states that localization should be enabled but the service account does not have permissions for the localization service. Disabling localizations until the Media Service is restarted and the checks are run again.',
      );
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
