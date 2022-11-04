/* eslint-disable no-console */
import {
  devSetupServiceAccountWithPermissions,
  getServiceAccountToken,
} from '@axinom/mosaic-id-link-be';
import { PermissionStructure } from '@axinom/mosaic-id-utils';
import { promises as fs } from 'fs';
import { join, resolve } from 'path';

async function updateEnvFile(
  clientId: string,
  clientSecret: string,
): Promise<void> {
  const envVarPath = resolve(join(process.cwd(), '.env'));
  let envFileContent = await fs.readFile(envVarPath, { encoding: 'utf8' });

  const clientIdRegex = /^SERVICE_ACCOUNT_CLIENT_ID=.*$/gm;
  const clientSecretRegex = /^SERVICE_ACCOUNT_CLIENT_SECRET=.*$/gm;

  const clientIdEnv = 'SERVICE_ACCOUNT_CLIENT_ID=' + clientId;
  const clientSecretEnv = 'SERVICE_ACCOUNT_CLIENT_SECRET=' + clientSecret;

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

export const serviceAccountSetup = async (
  idServiceAuthBaseUrl: string,
  devServiceAccountClientId: string,
  devServiceAccountClientSecret: string,
  serviceId: string,
  permissions: PermissionStructure[],
): Promise<void> => {
  const tokenResult = await getServiceAccountToken(
    idServiceAuthBaseUrl,
    devServiceAccountClientId,
    devServiceAccountClientSecret,
  );

  const serviceAccountName = `${serviceId}-account`;
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
