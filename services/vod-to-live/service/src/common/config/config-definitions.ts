/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  asOptionalUrlString,
  getBasicConfigDefinitions,
  getBasicCustomizableConfigDefinitions,
  getBasicGraphQlConfigDefinitions,
  getBasicMetricsEndpointDefinitions,
  getBasicRabbitMqConfigDefinitions,
  getConfigType,
  getValidatedConfig,
  pick,
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
  const env = from(variables, { asOptionalUrlString });
  const basicCustomizableConfigs = pick(
    getBasicCustomizableConfigDefinitions(variables),
    'tenantId',
    'environmentId',
    'idServiceAuthBaseUrl',
  );
  return {
    ...getBasicConfigDefinitions(variables),
    ...getBasicMetricsEndpointDefinitions(variables),
    ...getBasicGraphQlConfigDefinitions(11900, variables),
    ...getBasicRabbitMqConfigDefinitions(variables),
    ...basicCustomizableConfigs,
    // secret
    prePublishingWebhookSecret: () =>
      env.get('PRE_PUBLISHING_WEBHOOK_SECRET').required().asString(),
    virtualChannelManagementApiBaseUrl: () =>
      env
        .get('VIRTUAL_CHANNEL_MANAGEMENT_API_BASE_URL')
        .required()
        .asUrlString(),
    virtualChannelManagementApiKey: () =>
      env.get('VIRTUAL_CHANNEL_MANAGEMENT_API_KEY').asString(),
    virtualChannelOriginBaseUrl: () =>
      env.get('VIRTUAL_CHANNEL_ORIGIN_BASE_URL').required().asUrlString(),

    // Azure Storage
    azureStorageConnection: () =>
      env.get('AZURE_STORAGE_CONNECTION').required().asString(),
    azureBlobContainerName: () =>
      env.get('AZURE_BLOB_CONTAINER_NAME').required().asString(),

    // Key Service Management API
    keyServiceApiBaseUrl: () =>
      env.get('KEY_SERVICE_API_BASE_URL').asOptionalUrlString(),
    keyServiceTenantId: () => env.get('KEY_SERVICE_TENANT_ID').asString(),
    keyServiceManagementKey: () =>
      env.get('KEY_SERVICE_MANAGEMENT_KEY').asString(),
    drmKeySeedId: () => env.get('DRM_KEY_SEED_ID').asString(),

    isDrmEnabled: function () {
      return this.keyServiceApiBaseUrl() &&
        this.keyServiceTenantId() &&
        this.keyServiceManagementKey() &&
        this.drmKeySeedId()
        ? true
        : false;
    },
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
     * Optional Channel Service GraphQL Endpoint, used to setup webhook url and
     * secret during development
     */
    devChannelServiceBaseUrl: () =>
      env.get('DEV_CHANNEL_SERVICE_BASE_URL').asUrlString(),
    /**
     * Added to the playlist transition time, when playlist start date is in the PAST.
     * This time frame is added in consideration for playlist videos processing required to create live stream from VOD.
     * Defaults to 1 hour (60 minutes)
     */
    /**
     * If `PROLONG_PLAYLIST_TO_24_HOURS` is set to true, this duration is added on top of the 24h mark for smoother transition between playlists.
     * If `PROLONG_PLAYLIST_TO_24_HOURS` is set to false, the catch up duration is added to the playlist transition time, when playlist start date is in the PAST.
     * Defaults to 1 hour (60 minutes)
     */
    catchUpDurationInMinutes: () =>
      env.get('CATCH_UP_DURATION_IN_MINUTES').default(60).asIntPositive(),

    /**
     * Feature flag. When turned on every playlist with duration under 24 hours
     * will be automatically prolonged to hit 24 hour duration.
     * Defaults to TRUE
     */
    prolongPlaylistTo24Hours: () =>
      env.get('PROLONG_PLAYLIST_TO_24_HOURS').default('FALSE').asBoolStrict(),

    /**
     * Defines the amount of time service will wait for Virtual Channel to finish processing the channel SMIL.
     * Defaults to 10 minutes (600 sec)
     */
    channelProcessingWaitTimeInSeconds: () =>
      env
        .get('CHANNEL_PROCESSING_WAIT_TIME_IN_SECONDS')
        .default('600')
        .asIntPositive(),

    /**
     * Sets the body size limit for the webhook requests, since playlists can be
     * quite large. Default is 50mb. Examples: https://github.com/visionmedia/bytes.js#bytesparsestringnumber-value-numbernull
     */
    webhookBodySizeLimit: () =>
      env.get('WEBHOOK_BODY_SIZE_LIMIT').default('50mb').asString(),
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
