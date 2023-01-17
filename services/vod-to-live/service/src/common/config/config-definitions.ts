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
  const env = from(variables);
  const basicCustomizableConfigs = pick(
    getBasicCustomizableConfigDefinitions(variables),
    'tenantId',
    'environmentId',
    'idServiceAuthBaseUrl',
  );
  return {
    ...getBasicConfigDefinitions(variables),
    ...getBasicMetricsEndpointDefinitions(variables),
    ...getBasicGraphQlConfigDefinitions(10200, variables),
    ...getBasicRabbitMqConfigDefinitions(variables),
    ...basicCustomizableConfigs,
    // secret
    prePublishingWebhookSecret: () =>
      env.get('PRE_PUBLISHING_WEBHOOK_SECRET').required().asString(),
    virtualChannelApiBaseUrl: () =>
      env.get('VIRTUAL_CHANNEL_API_BASE_URL').required().asUrlString(),

    // Azure Storage
    azureStorageConnection: () =>
      env.get('AZURE_STORAGE_CONNECTION').required().asString(),
    azureBlobContainerName: () =>
      env.get('AZURE_BLOB_CONTAINER_NAME').required().asString(),

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
