/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  getBasicConfigDefinitions,
  getBasicCustomizableConfigDefinitions,
  getBasicDbConfigDefinitions,
  getBasicGraphQlConfigDefinitions,
  getBasicMetricsEndpointDefinitions,
  getBasicRabbitMqConfigDefinitions,
  getConfigType,
  getValidatedConfig,
} from '@axinom/mosaic-service-common';
import { from } from 'env-var';

export const GEOLITE2_LICENSE_KEY = 'GEOLITE2_LICENSE_KEY';
export const GEOLITE2_DOWNLOAD_URL = 'GEOLITE2_DOWNLOAD_URL';

/**
 * Get an object that contains all the configuration declaration functions to
 * load and validate the environment configurations.
 * @param variables `undefined` to use the process environment - or provide
 * custom variables
 */
export const getConfigDefinitions = (
  variables: NodeJS.ProcessEnv = process.env,
) => {
  const env = from(variables);
  return {
    ...getBasicConfigDefinitions(variables),
    ...getBasicMetricsEndpointDefinitions(variables),
    ...getBasicGraphQlConfigDefinitions(10200, variables),
    ...getBasicDbConfigDefinitions(variables),
    ...getBasicRabbitMqConfigDefinitions(variables),
    ...getBasicCustomizableConfigDefinitions(variables),

    userServiceAuthBaseUrl: () =>
      env.get('USER_SERVICE_AUTH_BASE_URL').required().asUrlString(),

    catalogServiceBaseUrl: () =>
      env.get('CATALOG_SERVICE_BASE_URL').required().asUrlString(),

    billingServiceBaseUrl: () =>
      env.get('BILLING_SERVICE_BASE_URL').required().asUrlString(),

    drmLicenseCommunicationKeyId: () =>
      env.get('DRM_LICENSE_COMMUNICATION_KEY_ID').required().asString(),

    drmLicenseCommunicationKey: () =>
      env.get('DRM_LICENSE_COMMUNICATION_KEY').required().asString(),

    mosaicTestingIpEnabled: () =>
      env.get('MOSAIC_TESTING_IP_ENABLED').default('false').asBoolStrict(),

    geolite2LicenseKey: function () {
      return env.get(GEOLITE2_LICENSE_KEY).required(!this.isDev()).asString();
    },
    geolite2DownloadUrl: () => env.get(GEOLITE2_DOWNLOAD_URL).asString(),

    drmLicenseCommunicationKeyBuffer: function () {
      return Buffer.from(this.drmLicenseCommunicationKey(), 'base64');
    },

    entitlementWebhookSecret: () =>
      env.get('ENTITLEMENT_WEBHOOK_SECRET').asString(),

    manifestWebhookSecret: () => env.get('MANIFEST_WEBHOOK_SECRET').asString(),

    widevineLicenseServiceUrl: () =>
      env.get('WIDEVINE_LICENSE_SERVICE_URL').asUrlString(),
    playreadyLicenseServiceUrl: () =>
      env.get('PLAYREADY_LICENSE_SERVICE_URL').asUrlString(),
    fairplayLicenseServiceUrl: () =>
      env.get('FAIRPLAY_LICENSE_SERVICE_URL').asUrlString(),
    fairplayStreamingCertificateUrl: () =>
      env.get('FAIRPLAY_STREAMING_CERTIFICATE_URL').asUrlString(),

    /**
     * Optional User Service GraphQL Endpoint, used to get user auth token
     * during development
     */
    devUserServiceBaseUrl: () =>
      env.get('DEV_USER_SERVICE_MANAGEMENT_BASE_URL').asUrlString(),

    /**
     * Optional Video Service GraphQL Endpoint, used to setup webhook urls and
     * secrets during development
     */
    devVideoServiceBaseUrl: () =>
      env.get('DEV_VIDEO_SERVICE_BASE_URL').asUrlString(),

    /**
     * Optional User Service Application name, used to create an Application
     * that is required to create user auth token during development
     */
    devApplicationName: () => env.get('DEV_APPLICATION_NAME').asString(),

    /**
     * Optional End User ID, used to create user auth token during
     * development, so it would match id of user who performed the subscriptions
     */
    devEndUserId: () => env.get('DEV_END_USER_ID').asString(),

    /**
     * Optional Service Account Client ID, used to get ID service token that is
     * required to get User auth token during development
     */
    devServiceAccountClientId: () =>
      env.get('DEV_SERVICE_ACCOUNT_CLIENT_ID').asString(),
    /**
     * Optional Service Account Client Secret, used to get ID service token that
     * is required to get User auth token during development
     */
    devServiceAccountClientSecret: () =>
      env.get('DEV_SERVICE_ACCOUNT_CLIENT_SECRET').asString(),
    /**
     * Optional flag for turning on DEMO mode for Entitlement Service.
     */
    demoMode: () => env.get('DEMO_MODE').default('false').asBoolStrict(),
  };
};

/**
 * Get the full, validated configuration object.
 */
export const getFullConfig = (
  variables: NodeJS.ProcessEnv = process.env,
): Config => {
  return getValidatedConfig(getConfigDefinitions(variables));
};

const config = getConfigType(getConfigDefinitions());
/**
 * The full Configuration type
 */
export type Config = typeof config;

const dbConfig = getConfigType(getBasicDbConfigDefinitions());
/**
 * The Database related Configuration type
 */
export type DbConfig = typeof dbConfig;
