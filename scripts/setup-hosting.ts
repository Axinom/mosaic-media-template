/* eslint-disable no-console */
import {
  devSetupServiceAccountWithPermissions,
  getServiceAccountToken,
} from '@axinom/mosaic-id-link-be';
import { PermissionStructure } from '@axinom/mosaic-id-utils';
import {
  getBasicCustomizableConfigDefinitions,
  getValidatedConfig,
  isNullOrWhitespace,
  pick,
} from '@axinom/mosaic-service-common';
import { from } from 'env-var';
import { updateEnvFile } from './helpers';

async function main(): Promise<void> {
  const env = from(process.env);

  const config = getValidatedConfig(
    pick(
      getBasicCustomizableConfigDefinitions(),
      'idServiceAuthBaseUrl',
      'tenantId',
      'environmentId',
    ),
  );

  const devServiceAccountClientId = env
    .get('DEV_SERVICE_ACCOUNT_CLIENT_ID')
    .asString();

  const devServiceAccountClientSecret = env
    .get('DEV_SERVICE_ACCOUNT_CLIENT_SECRET')
    .asString();

  if (
    isNullOrWhitespace(devServiceAccountClientId) ||
    isNullOrWhitespace(devServiceAccountClientSecret)
  ) {
    throw new Error(
      'Please ensure the root environment variables [DEV_SERVICE_ACCOUNT_CLIENT_ID] & [DEV_SERVICE_ACCOUNT_CLIENT_SECRET] have been configured.',
    );
  }

  await serviceAccountSetup(
    config.idServiceAuthBaseUrl,
    devServiceAccountClientId,
    devServiceAccountClientSecret,
    [
      {
        serviceId: 'ax-hosting-service',
        permissions: [
          'CONFIGURATIONS_VIEW',
          'SERVICE_DEFINITIONS_VIEW',
          'CONTAINER_REGISTRY_CONNECTIONS_VIEW',
          'SERVICE_PILET_ARTIFACTS_EDIT',
          'SERVICE_DEPLOYMENT_CONFIG_EDIT',
          'SERVICE_DEPLOYMENTS_EDIT',
        ],
      },
      {
        serviceId: 'ax-micro-frontend-service',
        permissions: ['PILETS_REGISTER'],
      },
    ],
  );
}

const serviceAccountSetup = async (
  idServiceAuthBaseUrl: string,
  devServiceAccountClientId: string,
  devServiceAccountClientSecret: string,
  permissions: PermissionStructure[],
): Promise<void> => {
  const tokenResult = await getServiceAccountToken(
    idServiceAuthBaseUrl,
    devServiceAccountClientId,
    devServiceAccountClientSecret,
  );

  const serviceAccountName = `hosting-CLI-service-account`;
  const serviceAccount = await devSetupServiceAccountWithPermissions(
    idServiceAuthBaseUrl,
    tokenResult.accessToken,
    serviceAccountName,
    permissions,
  );

  await updateEnvFile({
    MOSAIC_HOSTING_CLIENT_ID: serviceAccount.clientId,
    MOSAIC_HOSTING_CLIENT_SECRET: serviceAccount.clientSecret,
  });

  console.log({
    message: `Service account "${serviceAccountName}" successfully created and its credentials added to the .env file.`,
    ...serviceAccount,
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
