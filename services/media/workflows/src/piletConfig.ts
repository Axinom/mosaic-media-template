import { PiletApi } from '@axinom/mosaic-portal';

export const piletConfig = {
  mediaManagementHost: 'MEDIA_MANAGEMENT_HOST_NOT_CONFIGURED',
  mediaManagementHttpProtocol: 'MEDIA_MANAGEMENT_HTTP_PROTOCOL_NOT_CONFIGURED',
  isLocalizationEnabled: true,
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

  const isLocalizationEnabled =
    customConfig?.IS_LOCALIZATION_ENABLED ??
    process.env.IS_LOCALIZATION_ENABLED;
  piletConfig.isLocalizationEnabled =
    isLocalizationEnabled === undefined
      ? piletConfig.isLocalizationEnabled
      : isLocalizationEnabled.toLowerCase() === 'true';
};
