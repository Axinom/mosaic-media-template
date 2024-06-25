import { PiletApi } from '@axinom/mosaic-portal';

export const piletConfig = {
  channelManagementHost: 'CHANNEL_MANAGEMENT_HOST_NOT_CONFIGURED',
  channelManagementHttpProtocol:
    'CHANNEL_MANAGEMENT_HTTP_PROTOCOL_NOT_CONFIGURED',
};

export const initializeConfig = (
  customConfig?: PiletApi['meta']['custom'],
): void => {
  // Retrieve config from pilet metadata
  // For dev environments, env variables are used.
  piletConfig.channelManagementHost =
    customConfig?.CHANNEL_MANAGEMENT_HOST ??
    process.env.CHANNEL_MANAGEMENT_HOST ??
    piletConfig.channelManagementHost;

  piletConfig.channelManagementHttpProtocol =
    customConfig?.CHANNEL_MANAGEMENT_HTTP_PROTOCOL ??
    process.env.CHANNEL_MANAGEMENT_HTTP_PROTOCOL ??
    piletConfig.channelManagementHttpProtocol;
};
