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

    videoServiceBaseUrl: () =>
      env.get('VIDEO_SERVICE_BASE_URL').required().asUrlString(),

    imageServiceBaseUrl: () =>
      env.get('IMAGE_SERVICE_BASE_URL').required().asUrlString(),

    isLocalizationEnabled: () =>
      env.get('IS_LOCALIZATION_ENABLED').default('FALSE').asBoolStrict(),
    localizationServiceBaseUrl: function () {
      return env
        .get('LOCALIZATION_SERVICE_BASE_URL')
        .required(this.isLocalizationEnabled())
        .asUrlString();
    },

    /**
     * This value is required, but is empty in the template on purpose. This is because the
     * replication slot is created on Postgres Server level and must be unique,
     * meaning it can conflict with replication slots for other databases. Take care
     * when setting this value for deployed environments!
     *
     * During development - `yarn db:reset` would generate and fill a value in .env file.
     * For hosted scenarios - `yarn util:generate-replication-slot-name` would
     * generate and print a unique value based on your environment_id and service_id
     * to the console. You may use that value or decide to use your own custom value
     * as needed.
     *
     * If there is ever a need to change this value in a deployed environment -
     * replication slot must be re-created in db migrations to continue working as before.
     * See `000020-replication-on-localizable-tables-added.sql` for example.
     */
    dbLocalizationReplicationSlot: () =>
      env.get('DATABASE_LOCALIZATION_REPLICATION_SLOT').required().asString(),

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
