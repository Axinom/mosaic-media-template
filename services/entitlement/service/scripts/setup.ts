/* eslint-disable no-console */
import {
  getValidatedConfig,
  isNullOrWhitespace,
  pick,
} from '@axinom/mosaic-service-common';
import { serviceAccountSetup } from '../../../../scripts/helpers';
import { getConfigDefinitions } from '../src/common';
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
  await serviceAccountSetup(
    config.idServiceAuthBaseUrl,
    config.devServiceAccountClientId,
    config.devServiceAccountClientSecret,
    config.serviceId,
    [
      {
        serviceId: 'ax-monetization-grants-service',
        permissions: ['CLAIM_DEFINITIONS_SYNCHRONIZE'],
      },
    ],
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
