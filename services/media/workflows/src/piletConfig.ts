import { PiletApi } from '@axinom/mosaic-portal';

export const piletConfig = {
  mediaManagementHost: 'MEDIA_MANAGEMENT_HOST_NOT_CONFIGURED',
  mediaManagementHttpProtocol: 'MEDIA_MANAGEMENT_HTTP_PROTOCOL_NOT_CONFIGURED',
};

export const initializeConfig = (
  customConfig?: PiletApi['meta']['custom'],
): void => {
  // Retrieve config from pilet metadata
  // For dev environments, env variables are used.
  piletConfig.mediaManagementHost =
    customConfig?.MEDIA_MANAGEMENT_HOST ??
    process.env.MEDIA_MANAGEMENT_HOST ??
    piletConfig.mediaManagementHost;

  piletConfig.mediaManagementHttpProtocol =
    customConfig?.MEDIA_MANAGEMENT_HTTP_PROTOCOL ??
    process.env.MEDIA_MANAGEMENT_HTTP_PROTOCOL ??
    piletConfig.mediaManagementHttpProtocol;
};
