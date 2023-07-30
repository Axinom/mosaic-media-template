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
import { promises as fs } from 'fs';
import { join, resolve } from 'path';

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

  await updateEnvFile(serviceAccount.clientId, serviceAccount.clientSecret);

  console.log({
    message: `Service account "${serviceAccountName}" successfully created and its credentials added to the .env file.`,
    ...serviceAccount,
  });
};

async function updateEnvFile(
  clientId: string,
  clientSecret: string,
): Promise<void> {
  const envVarPath = resolve(join(process.cwd(), '.env'));
  let envFileContent = await fs.readFile(envVarPath, { encoding: 'utf8' });

  const clientIdRegex = /^MOSAIC_HOSTING_CLIENT_ID=.*$/gm;
  const clientSecretRegex = /^MOSAIC_HOSTING_CLIENT_SECRET=.*$/gm;

  const clientIdEnv = 'MOSAIC_HOSTING_CLIENT_ID=' + clientId;
  const clientSecretEnv = 'MOSAIC_HOSTING_CLIENT_SECRET=' + clientSecret;

  if (envFileContent.match(clientIdRegex) !== null) {
    envFileContent = envFileContent.replace(clientIdRegex, clientIdEnv);
  } else {
    envFileContent += '\n' + clientIdEnv;
  }

  if (envFileContent.match(clientSecretRegex) !== null) {
    envFileContent = envFileContent.replace(clientSecretRegex, clientSecretEnv);
  } else {
    envFileContent += '\n' + clientSecretEnv;
  }

  await fs.writeFile(envVarPath, envFileContent, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
