/* eslint-disable no-console */
import {
  devSetupServiceAccountWithPermissions,
  getServiceAccountToken,
  ServiceAccountResult,
} from '@axinom/mosaic-id-link-be';
import { PermissionStructure } from '@axinom/mosaic-id-utils';
import { updateEnvFile } from './update-env-file';

export const serviceAccountSetup = async (
  idServiceAuthBaseUrl: string,
  devServiceAccountClientId: string,
  devServiceAccountClientSecret: string,
  serviceId: string,
  permissions: PermissionStructure[],
): Promise<ServiceAccountResult> => {
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

  await updateEnvFile({
    SERVICE_ACCOUNT_CLIENT_ID: serviceAccount.clientId,
    SERVICE_ACCOUNT_CLIENT_SECRET: serviceAccount.clientSecret,
  });

  console.log({
    message: `Service account "${serviceAccountName}" successfully created and its credentials added to the .env file.`,
    ...serviceAccount,
  });
  return serviceAccount;
};
