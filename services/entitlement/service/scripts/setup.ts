/* eslint-disable no-console */
import {
  getValidatedConfig,
  isNullOrWhitespace,
  pick,
} from '@axinom/mosaic-service-common';
import { serviceAccountSetup } from '../../../../scripts/helpers';
import { getConfigDefinitions } from '../src/common';
import { loadDrmSettings } from '../src/domains/drm';
import { userApplicationSetup } from './resources';

async function main(): Promise<void> {
  const config = getValidatedConfig(
    pick(
      getConfigDefinitions(),
      // Common
      'idServiceAuthBaseUrl',
      'devServiceAccountClientId',
      'devServiceAccountClientSecret',

      // userApplicationSetup
      'devUserServiceBaseUrl',
      'devApplicationName',

      // serviceAccountSetup
      'serviceId',
      'tenantId',
      'environmentId',

      // checkDrmService
      'drmServiceBaseUrl',
    ),
  );

  if (
    isNullOrWhitespace(config.devServiceAccountClientId) ||
    isNullOrWhitespace(config.devServiceAccountClientSecret)
  ) {
    throw new Error(
      'Please ensure the root environment variables [DEV_SERVICE_ACCOUNT_CLIENT_ID] & [DEV_SERVICE_ACCOUNT_CLIENT_SECRET] have been configured.',
    );
  }

  await userApplicationSetup(config);

  // The service account reads the communication key, DRM tenant and FairPlay
  // settings of the environment from the DRM Service at runtime.
  const serviceAccount = await serviceAccountSetup(
    config.idServiceAuthBaseUrl,
    config.devServiceAccountClientId,
    config.devServiceAccountClientSecret,
    config.serviceId,
    [{ serviceId: 'ax-drm-service', permissions: ['ADMIN'] }],
  );

  await checkDrmService({
    drmServiceBaseUrl: config.drmServiceBaseUrl,
    idServiceAuthBaseUrl: config.idServiceAuthBaseUrl,
    serviceAccountClientId: serviceAccount.clientId,
    serviceAccountClientSecret: serviceAccount.clientSecret,
  });
}

/**
 * Makes sure that the DRM Service is enabled for the environment, so a missing
 * DRM Service shows up now and not with the first playback.
 */
const checkDrmService = async (
  config: Parameters<typeof loadDrmSettings>[0],
): Promise<void> => {
  let settings;
  try {
    settings = await loadDrmSettings(config);
  } catch (error) {
    throw new Error(
      `The DRM settings could not be read from the DRM Service at '${config.drmServiceBaseUrl}'. Please make sure that the DRM Service is enabled for this environment in the Management System (Settings / DRM Service). Error: ${(error as Error).message}`,
    );
  }

  if (!settings.drmTenantId) {
    throw new Error(
      'The DRM Service returned no DRM tenant. Please make sure that the DRM Service is enabled for this environment in the Management System (Settings / DRM Service).',
    );
  }

  if (settings.communicationKeys.length === 0) {
    console.warn(
      'The DRM Service is enabled, but has no communication key yet. Create one in the Management System under Settings / DRM Service / Communication Keys, otherwise protected content cannot be played.',
    );
  } else {
    console.log('The DRM Service is enabled and has a communication key.');
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
