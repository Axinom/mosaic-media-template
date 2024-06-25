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
      'devServiceAccountClientId',
      'devServiceAccountClientSecret',
      'serviceId',
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
        serviceId: 'ax-video-service',
        permissions: ['CUE_POINT_TYPES_DECLARE'],
      },
      {
        serviceId: 'ax-localization-service',
        permissions: [
          'SOURCE_ENTITIES_EDIT',
          'ENTITY_DEFINITIONS_EDIT',
          'LOCALIZED_ENTITIES_EDIT',
          'LOCALIZED_ENTITIES_REVIEW',
        ],
      },
    ],
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
