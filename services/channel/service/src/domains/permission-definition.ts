import { PermissionDefinition } from '@axinom/mosaic-id-guard';
import { synchronizePermissions } from '@axinom/mosaic-id-link-be';
import { Logger } from '@axinom/mosaic-service-common';
import { Config, requestServiceAccountToken } from '../common';
import {
  ChannelIgnoreOperations,
  ChannelsMutateOperations,
  ChannelsReadOperations,
} from './channel';

/**
 * **IMPORTANT**
 *
 * This object holds the permissions which will be synchronized into the `ax-id-service` on startup.
 *
 * The `key` of the permission is used to recognize individual permissions. If the `key` doesn't already exist in the service,
 * such a permission will be created. If the service contains a `key` that is not listed in this object, it will be removed from
 * the service (including all relations of it i.e. User Roles Assignments, Service Account Assignments)
 *
 * Renaming a permission `key` is potentially a destructive operation and special care must be taken if it really needs to be changed.
 * It is recommended to leave the permission `key` unchanged and use the `title` property to reflect the required name change.
 */
const permissions = [
  {
    key: 'ADMIN',
    title: 'Admin',
    gqlOperations: [...ChannelsReadOperations, ...ChannelsMutateOperations],
  },
  {
    key: 'CHANNELS_VIEW',
    title: 'Channels: View',
    gqlOperations: [...ChannelsReadOperations],
  },
  {
    key: 'CHANNELS_EDIT',
    title: 'Channels: Edit',
    gqlOperations: [...ChannelsReadOperations, ...ChannelsMutateOperations],
  },
] as const;

export const permissionDefinition: PermissionDefinition = {
  gqlOptions: {
    ignoredGqlOperations: [...ChannelIgnoreOperations],
  },

  permissions,
};
export type PermissionKey = typeof permissions[number]['key'];

/**
 * Synchronize service permissions with ID service
 */
export const syncPermissions = async (
  config: Pick<
    Config,
    | 'idServiceAuthBaseUrl'
    | 'serviceAccountClientId'
    | 'serviceAccountClientSecret'
    | 'serviceId'
  >,
  logger?: Logger,
): Promise<void> => {
  logger = logger ?? new Logger({ context: syncPermissions.name });
  const accessToken = await requestServiceAccountToken(config);
  const result = await synchronizePermissions(
    config.idServiceAuthBaseUrl,
    accessToken,
    config.serviceId,
    permissionDefinition,
  );

  logger.debug({
    message: 'Permissions successfully synchronized.',
    details: { ...result },
  });
};
