/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  getBasicConfigDefinitions,
  getBasicCustomizableConfigDefinitions,
  getBasicDbConfigDefinitions,
  getBasicGraphQlConfigDefinitions,
  getBasicMetricsEndpointDefinitions,
  getBasicRabbitMqConfigDefinitions,
  getBasicTransactionalInboxOutboxConfigDefinitions,
  getConfigType,
  getValidatedConfig,
} from '@axinom/mosaic-service-common';
import { from } from 'env-var';

/**
 * Get an object that contains all the configuration declaration functions to
 * load and validate the environment configurations.
 * @param variables `undefined` to use the process environment - or provide custom variables
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
    ...getBasicTransactionalInboxOutboxConfigDefinitions(variables),

    videoServiceBaseUrl: () =>
      env.get('VIDEO_SERVICE_BASE_URL').required().asUrlString(),

    imageServiceBaseUrl: () =>
      env.get('IMAGE_SERVICE_BASE_URL').required().asUrlString(),

    /**
     * Optional Service Account Client ID, used to get ID service token during development
     */
    devServiceAccountClientId: () =>
      env.get('DEV_SERVICE_ACCOUNT_CLIENT_ID').asString(),
    /**
     * Optional Service Account Client Secret, used to get ID service token during development
     */
    devServiceAccountClientSecret: () =>
      env.get('DEV_SERVICE_ACCOUNT_CLIENT_SECRET').asString(),

    /**
     * Optional blob storage connection string, only required for running `util:ingest-gen` script during development to generate semi-realistic test ingest files.
     * Must match blob storage information from Image Acquisition Profile.
     */
    devImageBlobStorageConnectionString: () =>
      env.get('DEV_IMAGE_BLOB_STORAGE_CONNECTION_STRING').asString(),

    /**
     * Optional blob storage container name, only required for running `util:ingest-gen` script during development to generate semi-realistic test ingest files.
     * Must match blob storage information from Image Acquisition Profile.
     */
    devImageBlobStorageContainer: () =>
      env.get('DEV_IMAGE_BLOB_STORAGE_CONTAINER').asString(),

    /**
     * Optional blob storage connection string, only required for running `util:ingest-gen` script during development to generate semi-realistic test ingest files.
     * Must match blob storage information from Video Acquisition Profile.
     */
    devVideoBlobStorageConnectionString: () =>
      env.get('DEV_VIDEO_BLOB_STORAGE_CONNECTION_STRING').asString(),

    /**
     * Optional blob storage container name, only required for running `util:ingest-gen` script during development to generate semi-realistic test ingest files.
     * Must match blob storage information from Image Acquisition Profile.
     */
    devVideoBlobStorageContainer: () =>
      env.get('DEV_VIDEO_BLOB_STORAGE_CONTAINER').asString(),
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
