import { PiletApi } from '@axinom/mosaic-portal';

export const piletConfig = {
  mediaManagementHost: 'MANAGEMENT_HOST_NOT_CONFIGURED',
  mediaManagementHttpProtocol: 'MANAGEMENT_HTTP_PROTOCOL_NOT_CONFIGURED',
};

export const initializeConfig = (
  customConfig?: PiletApi['meta']['custom'],
): void => {
  // Retrieve config from pilet metadata
  // For dev environments, env variables are used.
  piletConfig.mediaManagementHost =
    customConfig?.MANAGEMENT_HOST ??
    process.env.MANAGEMENT_HOST ??
    piletConfig.mediaManagementHost;

  piletConfig.mediaManagementHttpProtocol =
    customConfig?.MANAGEMENT_HTTP_PROTOCOL ??
    process.env.MANAGEMENT_HTTP_PROTOCOL ??
    piletConfig.mediaManagementHttpProtocol;
};
