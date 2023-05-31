import { PiletApi } from '@axinom/mosaic-portal';

export const piletConfig = {
  customerManagementHost: 'CUSTOMER_MANAGEMENT_HOST_NOT_CONFIGURED',
  customerManagementHttpProtocol:
    'CUSTOMER_MANAGEMENT_HTTP_PROTOCOL_NOT_CONFIGURED',
};

export const initializeConfig = (
  customConfig?: PiletApi['meta']['custom'],
): void => {
  // Retrieve config from pilet metadata
  // For dev environments, env variables are used.
  piletConfig.customerManagementHost =
    customConfig?.CUSTOMER_MANAGEMENT_HOST ??
    process.env.CUSTOMER_MANAGEMENT_HOST ??
    piletConfig.customerManagementHost;

  piletConfig.customerManagementHttpProtocol =
    customConfig?.CUSTOMER_MANAGEMENT_HTTP_PROTOCOL ??
    process.env.CUSTOMER_MANAGEMENT_HTTP_PROTOCOL ??
    piletConfig.customerManagementHttpProtocol;
};
