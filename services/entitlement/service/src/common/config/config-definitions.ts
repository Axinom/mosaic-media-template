/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  getBasicConfigDefinitions,
  getBasicCustomizableConfigDefinitions,
  getBasicDbConfigDefinitions,
  getBasicMetricsEndpointDefinitions,
  getConfigType,
  getValidatedConfig,
} from '@axinom/mosaic-service-common';
import { from } from 'env-var';

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
    ...getBasicDbConfigDefinitions(variables),
    ...getBasicCustomizableConfigDefinitions(variables),

    port: () => env.get('PORT').default(10200).asPortNumber(),

    catalogServiceBaseUrl: () =>
      env.get('CATALOG_SERVICE_BASE_URL').required().asUrlString(),

    drmLicenseCommunicationKeyId: () =>
      env.get('DRM_LICENSE_COMMUNICATION_KEY_ID').required().asString(),

    drmLicenseCommunicationKey: () =>
      env.get('DRM_LICENSE_COMMUNICATION_KEY').required().asString(),

    drmLicenseCommunicationKeyBuffer: function () {
      return Buffer.from(this.drmLicenseCommunicationKey(), 'base64');
    },

    widevineLicenseServiceUrl: () =>
      env.get('WIDEVINE_LICENSE_SERVICE_URL').required().asString(),

    playreadyLicenseServiceUrl: () =>
      env.get('PLAYREADY_LICENSE_SERVICE_URL').required().asString(),

    fairPlayLicenseServiceUrl: () =>
      env.get('FAIRPLAY_LICENSE_SERVICE_URL').required().asString(),

    fairplayStreamingCertificateUrl: () =>
      env.get('FAIRPLAY_STREAMING_CERTIFICATE_URL').required().asString(),

    entitlementWebhookSecret: () => 
      env.get('ENTITLEMENT_WEBHOOK_SECRET').required().asString(),

    userSessionPublicKey: () =>
      env.get('USER_SESSION_PUBLIC_KEY').required().asString(),
    userSessionPublicKeyRSA: function () {
      return `-----BEGIN PUBLIC KEY-----\n${this.userSessionPublicKey()}\n-----END PUBLIC KEY-----`;
    },
    recurlyEntitlementApiUrl: () =>
      env.get('RECURLY_ENTITLEMENT_API_URL').asUrlString() ||
      'MISSING_RECURLY_ENTITLEMENT_API_URL',
    recurlyEntitlementPlaybackPermission: () =>
      env.get('RECURLY_ENTITLEMENT_PLAYBACK_PERMISSION').asString() ||
      'MISSING_RECURLY_ENTITLEMENT_PLAYBACK_PERMISSION',
    recurlyEntitlementApiKey: () =>
      env.get('RECURLY_ENTITLEMENT_API_KEY').asString() ||
      'MISSING_RECURLY_ENTITLEMENT_API_KEY',

    clientIPHeaderName: () => env.get('CLIENT_IP_HEADER_NAME').asString(),

    geoIP2SASToken: () =>
      env.get('GEOIP2_BLOB_SAS_TOKEN').required().asString() ||
      'MISSING_GEOIP2_BLOB_SAS_TOKEN',
    geoIP2StorageAccount: () =>
      env.get('GEOIP2_BLOB_STORAGE_ACCOUNT').required().asString() ||
      'MISSING_GEOIP2_BLOB_STORAGE_ACCOUNT',
    geoIP2BlobContainer: () =>
      env.get('GEOIP2_BLOB_CONTAINER').required().asString() ||
      'MISSING_GEOIP2_BLOB_CONTAINER',
    geoIP2DatabaseFile: () =>
      env.get('GEOIP2_DATABASE_FILE').required().asString() ||
      'MISSING_GEOIP2_DATABASE_FILE',

    geoIP2BlobStorageURL: function () {
      return `https://${this.geoIP2StorageAccount()}.blob.core.windows.net/?${this.geoIP2SASToken()}`;
    },

    geoIP2UpdateSchedule: () =>
      env.get('GEOIP2_UPDATE_SCHEDULE').required().asString(),
    geoBlockingFeatureSwitch: () =>
      env.get('GEO_BLOCKING_FEATURE_SWITCH').asString(),

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
