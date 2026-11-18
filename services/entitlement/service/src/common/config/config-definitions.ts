/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  getBasicConfigDefinitions,
  getBasicDbConfigDefinitions,
  getBasicGraphQlConfigDefinitions,
  getBasicMetricsEndpointDefinitions,
  getBasicRabbitMqConfigDefinitions,
  getValidatedConfig,
  ValueObject,
} from '@axinom/mosaic-service-common';
import { from } from 'env-var';

export const GEOLITE2_LICENSE_KEY = 'GEOLITE2_LICENSE_KEY';
export const GEOLITE2_DOWNLOAD_URL = 'GEOLITE2_DOWNLOAD_URL';
export const MAXMIND_ACCOUNT_ID = 'MAXMIND_ACCOUNT_ID';

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

    tenantId: () => env.get('TENANT_ID').required().asString(),
    environmentId: () => env.get('ENVIRONMENT_ID').required().asString(),
    idServiceAuthBaseUrl: () =>
      env.get('ID_SERVICE_AUTH_BASE_URL').required().asUrlString(),

    userServiceAuthBaseUrl: () =>
      env.get('USER_SERVICE_AUTH_BASE_URL').required().asUrlString(),

    catalogServiceBaseUrl: () =>
      env.get('CATALOG_SERVICE_BASE_URL').required().asUrlString(),

    /**
     * Base URL of the Mosaic DRM Service. The communication key, DRM tenant and
     * FairPlay settings of the environment are read from it at runtime.
     */
    drmServiceBaseUrl: () =>
      env.get('DRM_SERVICE_BASE_URL').required().asUrlString(),

    /**
     * Service account of the Entitlement Service. It needs the
     * `ax-drm-service: ADMIN` permission to read the DRM settings.
     */
    serviceAccountClientId: () =>
      env.get('SERVICE_ACCOUNT_CLIENT_ID').required().asString(),
    serviceAccountClientSecret: () =>
      env.get('SERVICE_ACCOUNT_CLIENT_SECRET').required().asString(),

    mosaicTestingIpEnabled: () =>
      env.get('MOSAIC_TESTING_IP_ENABLED').default('false').asBoolStrict(),

    geolite2LicenseKey: function () {
      return env.get(GEOLITE2_LICENSE_KEY).required(!this.isDev()).asString();
    },
    geolite2DownloadUrl: function () {
      return env.get(GEOLITE2_DOWNLOAD_URL).required().asString();
    },
    maxmindAccountId: function () {
      return env.get(MAXMIND_ACCOUNT_ID).required(!this.isDev()).asString();
    },

    entitlementWebhookSecret: () =>
      env.get('ENTITLEMENT_WEBHOOK_SECRET').asString(),

    manifestWebhookSecret: () => env.get('MANIFEST_WEBHOOK_SECRET').asString(),

    /**
     * License Service URLs returned by the `/entitlement` webhook. The first
     * block of the environment's DRM tenant ID is put in front of the host,
     * e.g. `https://<id-prefix>.drm-widevine-licensing.axprod.net/...`.
     */
    licenseServiceWidevineUrl: () =>
      env
        .get('LICENSE_SERVICE_WIDEVINE_URL')
        .default('https://drm-widevine-licensing.axprod.net/AcquireLicense')
        .asUrlString(),
    licenseServicePlayreadyUrl: () =>
      env
        .get('LICENSE_SERVICE_PLAYREADY_URL')
        .default('https://drm-playready-licensing.axprod.net/AcquireLicense')
        .asUrlString(),
    licenseServiceFairplayUrl: () =>
      env
        .get('LICENSE_SERVICE_FAIRPLAY_URL')
        .default('https://drm-fairplay-licensing.axprod.net/AcquireLicense')
        .asUrlString(),
    /**
     * Axinom FairPlay test certificate, returned by the `/entitlement` webhook
     * while the environment has no FairPlay dataset of its own and the test
     * certificate may still be used.
     */
    fairplayTestCertUrl: () =>
      env
        .get('FAIRPLAY_TEST_CERT_URL')
        .default('https://tools.axinom.com/FPScert/fairplay.cer')
        .asUrlString(),

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

/**
 * The full Configuration type
 */
export type Config = ValueObject<ReturnType<typeof getConfigDefinitions>>;

/**
 * The Database related Configuration type
 */
export type DbConfig = ValueObject<
  ReturnType<typeof getBasicDbConfigDefinitions>
>;
