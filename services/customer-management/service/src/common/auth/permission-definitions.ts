import {
  getServiceAccountToken,
  synchronizePermissions,
  TokenResult,
} from '@axinom/mosaic-id-link-be';
import { PermissionDefinition } from '@axinom/mosaic-id-utils';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '..';

export const permissions = [
  {
    key: 'Customer-Management-Service-Admin',
    title: 'Customer Service Admin Role',
    gqlOperations: [
      'getCustomers',
      'getCustomer',
      'createCustomer',
      'updateCustomer',
      'deleteCustomer',
      'resetPassword',
      'resendActivation',
    ],
  },
] as const;

export const permissionDefinition: PermissionDefinition = {
  permissions,
};

export const requestServiceAccountToken = async (
  config: Config,
): Promise<TokenResult> =>
  // TODO: cache this token in memory until it expires

  getServiceAccountToken(
    config.idServiceAuthBaseUrl,
    config.serviceAccountClientId,
    config.serviceAccountClientSecret,
  );

export const syncPermissions = async (
  config: Config,
  logger: Logger,
): Promise<void> => {
  const token = await requestServiceAccountToken(config);
  const result = await synchronizePermissions(
    config.idServiceAuthBaseUrl,
    token.accessToken,
    config.serviceId,
    permissionDefinition,
  );

  logger.debug({
    message: 'Permissions successfully synchronized.',
    details: { ...result },
  });
};

export type PermissionKey = typeof permissions[number]['key'];
