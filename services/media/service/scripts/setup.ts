/* eslint-disable no-console */
import {
  getValidatedConfig,
  isNullOrWhitespace,
  pick,
} from '@axinom/mosaic-service-common';
import { serviceAccountSetup } from '../../../../scripts/helpers';
import { getConfigDefinitions } from '../src/common';

async function main(): Promise<void> {
  const config = getValidatedConfig(
    pick(
      getConfigDefinitions(),
      'idServiceAuthBaseUrl',
      'serviceId',
      'tenantId',
      'environmentId',
      'devServiceAccountClientId',
      'devServiceAccountClientSecret',
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

  await serviceAccountSetup(
    config.idServiceAuthBaseUrl,
    config.devServiceAccountClientId,
    config.devServiceAccountClientSecret,
    config.serviceId,
    [
      {
        serviceId: 'ax-id-service',
        permissions: [
          'PERMISSIONS_SYNCHRONIZE',
          'ACCESS_TOKENS_GENERATE_LONG_LIVED_TOKEN',
        ],
      },
      {
        serviceId: 'ax-image-service',
        permissions: ['IMAGE_TYPES_DECLARE'],
      },
      {
        serviceId: 'ax-encoding-service',
        permissions: ['CUE_POINT_TYPES_DECLARE'],
      },
    ],
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
