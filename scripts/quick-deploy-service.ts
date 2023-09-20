/* eslint-disable no-console */
import { getServiceAccountToken } from '@axinom/mosaic-id-link-be';
import axios from 'axios';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { from } from 'env-var';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { prompt } from 'prompts';

/**
 * Returns a unique ID in the format of YYYYMMDD.HHMMSS.
 * This can be used as a prefix/suffix for unique names that are required.
 */
function getUniqueID(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}.${hours}${minutes}${seconds}`;
}

/**
 * Generates an access token for the Mosaic Hosting CLI service account.
 * The CLIENT_ID & CLIENT_SECRET will be fetched from the .env file on the root.
 */
async function getAccessToken(): Promise<string> {
  const env = from(process.env);

  const idServiceAuthBaseUrl = env
    .get('ID_SERVICE_AUTH_BASE_URL')
    .required()
    .asString();

  const clientID = env.get('MOSAIC_HOSTING_CLIENT_ID').required().asString();

  const clientSecret = env
    .get('MOSAIC_HOSTING_CLIENT_SECRET')
    .required()
    .asString();

  const tokenResult = await getServiceAccountToken(
    idServiceAuthBaseUrl,
    clientID,
    clientSecret,
  );

  return tokenResult.accessToken;
}

/**
 * Creates a service definition if it does not exist yet. If it exists, it silently continues.
 */
const ensureServiceDefinitionExists = async (
  accessToken: string,
  serviceId: string,
  dockerUsername: string,
): Promise<void> => {
  const env = from(process.env);

  const hostingServiceBaseUrl = env
    .get('HOSTING_SERVICE_BASE_URL')
    .required()
    .asString();

  const createServiceDefinitionResponse = await axios.post(
    new URL('graphql', hostingServiceBaseUrl).href,
    {
      query: print(gql`
        mutation CreateServiceDefinition(
          $input: CreateServiceDefinitionInput!
        ) {
          createServiceDefinition(input: $input) {
            serviceDefinition {
              id
            }
          }
        }
      `),
      variables: {
        input: {
          serviceDefinition: {
            serviceId: serviceId,
            name: serviceId,
            repositoryName: `${dockerUsername}/${serviceId}`,
          },
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (
    createServiceDefinitionResponse.data.errors &&
    createServiceDefinitionResponse.data.errors[0].message !==
      'Attempt to create or update an element failed, as it would have resulted in a duplicate element.'
  ) {
    throw new Error(createServiceDefinitionResponse.data.errors[0].message);
  }
};

/**
 * Queries the service definition ID for the given service ID.
 */
const getServiceDefinitionID = async (
  accessToken: string,
  serviceId: string,
): Promise<string> => {
  const env = from(process.env);

  const hostingServiceBaseUrl = env
    .get('HOSTING_SERVICE_BASE_URL')
    .required()
    .asString();

  const getServiceDefinitionResponse = await axios.post(
    new URL('graphql', hostingServiceBaseUrl).href,
    {
      query: print(gql`
        query GetServiceDefinition($condition: ServiceDefinitionCondition!) {
          serviceDefinitions(condition: $condition) {
            nodes {
              id
              name
            }
          }
        }
      `),
      variables: {
        condition: {
          serviceId: serviceId,
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (getServiceDefinitionResponse.data.errors) {
    throw new Error(getServiceDefinitionResponse.data.errors[0].message);
  }

  console.log(
    chalk.cyan(
      `\nService Definition for [${serviceId}] found in the environment. Continuing with the deployment.`,
    ),
  );

  return getServiceDefinitionResponse.data.data.serviceDefinitions.nodes[0].id;
};

/**
 * Validate if the deployment manifest YAML file of the service still has some variables that need to be manually adjusted.
 */
function validateDeploymentManifestIsModified(
  serviceId: 'media-service' | 'catalog-service' | 'entitlement-service',
): void {
  const servicePrefix = serviceId.split('-service')[0];

  if (serviceId === 'entitlement-service') {
    const deploymentManifestFilePath = `./services/${servicePrefix}/service/mosaic-hosting-deployment-manifest.yaml`;
    const fileContent = readFileSync(deploymentManifestFilePath).toString();
    if (fileContent.includes(`'REPLACE_WITH_VALID_`)) {
      throw new Error(
        `The deployment manifest YAML [${deploymentManifestFilePath}] of the [${serviceId}] still has some variables that need to be manually adjusted.
Please follow the service README file to understand how to generate the values, then update them accordingly in the YAML file and try again.`,
      );
    }
  }
}

function getDockerInfo(): { registry: string; username: string } {
  console.log(`\nChecking Docker Info...\n`);

  try {
    const commandResult = execSync('docker info').toString();

    const dockerInfo = commandResult.split('\n').map((line) => line.trim());

    const registry = dockerInfo
      .filter((line) => line.startsWith('Registry: '))[0]
      .split('Registry: ')[1];

    const username = dockerInfo
      .filter((line) => line.startsWith('Username: '))[0]
      .split('Username: ')[1];

    return { registry, username };
  } catch (error) {
    throw new Error(
      'Unable to determine the Docker Registry and Username. Please make sure the Docker CLI is installed and you are logged in to a Docker Registry.',
    );
  }
}

function buildDockerImageAndPush(
  username: string,
  serviceId: 'media-service' | 'catalog-service' | 'entitlement-service',
  uniqueID: string,
): void {
  const servicePrefix = serviceId.split('-service')[0];
  const imageTag = `${username}/${serviceId}:${uniqueID}`;

  const dockerBuildCommand = `docker build -t ${imageTag} --build-arg PACKAGE_ROOT=services/${servicePrefix}/service --build-arg PACKAGE_BUILD_COMMAND=build:${serviceId}:prod .`;

  console.log(
    `\nRunning Docker Build command:\n${chalk.green(dockerBuildCommand)}\n`,
  );

  execSync(dockerBuildCommand, { stdio: 'inherit' });

  const dockerPushCommand = `docker push ${imageTag}`;

  console.log(
    `\nRunning Docker Push command:\n${chalk.green(dockerPushCommand)}\n`,
  );

  execSync(dockerPushCommand, { stdio: 'inherit' });
}

function buildPiletAndRegister(serviceId: 'media-service'): void {
  const servicePrefix = serviceId.split('-service')[0];

  const piletBuildCommand = `yarn build:${servicePrefix}-workflows:prod`;

  console.log(
    `\nRunning Pilet Build command:\n${chalk.green(piletBuildCommand)}\n`,
  );

  execSync(piletBuildCommand, { stdio: 'inherit' });

  const piletRegisterCommand = `yarn util:load-vars mosaic hosting pilet register -i ${serviceId} -p ./ --overrideRegistration`;

  console.log(
    `\nRunning Pilet Register command:\n${chalk.green(piletRegisterCommand)}\n`,
  );

  execSync(piletRegisterCommand, { stdio: 'inherit' });
}

function uploadDeploymentManifest(
  serviceId: 'media-service' | 'catalog-service' | 'entitlement-service',
  uniqueID: string,
): void {
  const servicePrefix = serviceId.split('-service')[0];

  const manifestUploadCommand = `yarn util:load-vars mosaic hosting manifest upload -i ${serviceId} -p ./services/${servicePrefix}/service/mosaic-hosting-deployment-manifest.yaml -n ${serviceId}-manifest-${uniqueID}`;

  console.log(
    `\nRunning Manifest Upload command:\n${chalk.green(
      manifestUploadCommand,
    )}\n`,
  );

  execSync(manifestUploadCommand, { stdio: 'inherit' });
}

function initiateDeployment(
  serviceId: 'media-service' | 'catalog-service' | 'entitlement-service',
  dockerImageTag: string,
  uniqueID: string,
): void {
  const deployCommand = `yarn util:load-vars mosaic hosting service deploy -i ${serviceId} -t ${dockerImageTag} ${
    serviceId === 'media-service' ? '-p media-workflows@1.0.0' : ''
  } -m ${serviceId}-manifest-${uniqueID} -n ${serviceId}-deployment-${uniqueID}`;

  console.log(`\nRunning Deploy command:\n${chalk.green(deployCommand)}\n`);

  execSync(deployCommand, {
    stdio: 'inherit',
  });
}

/**
 * Prints the URL to the Mosaic Admin Portal to open up the Custom Service details station.
 */
function printAdminPortalURL(serviceDefinitionId: string): void {
  const idServiceAuthBaseUrl = from(process.env)
    .get('ID_SERVICE_AUTH_BASE_URL')
    .required()
    .asString();

  const environmentId = from(process.env)
    .get('ENVIRONMENT_ID')
    .required()
    .asString();

  const adminPortalBaseUrl = idServiceAuthBaseUrl.includes('.eu.')
    ? 'https://admin.service.eu.axinom.com'
    : idServiceAuthBaseUrl.includes('.test.')
    ? 'https://admin.service.test.axtest.net'
    : idServiceAuthBaseUrl.includes('.cb.')
    ? 'https://admin.service.cb.axtest.net'
    : 'https://admin.service.dev.axtest.net';

  const adminPortalURL = `${adminPortalBaseUrl}/env/${environmentId}/services/ax-hosting-service/config/customizable-services/${serviceDefinitionId}`;

  console.log(
    `\nSee more details at the Mosaic Admin Portal:\n${chalk.green(
      adminPortalURL,
    )}\n`,
  );
}

async function main(): Promise<void> {
  try {
    const answers = await prompt([
      {
        type: 'select',
        name: 'serviceId',
        message: 'Select the service to deploy',
        choices: [
          { title: 'Media Service', value: 'media-service' },
          { title: 'Catalog Service', value: 'catalog-service' },
          { title: 'Entitlement Service', value: 'entitlement-service' },
        ],
      },
      {
        type: 'text',
        name: 'dockerImageTag',
        message:
          'If you want to deploy a specific docker image tag that is already pushed to the registry, enter that image tag here. Leave this blank if you you are not sure.',
        initial: '',
      },
      {
        type: 'confirm',
        name: 'deploy',
        message: 'All set; start deploying the selected service now?',
        initial: true,
      },
    ]);

    if (!answers.deploy) {
      console.log('Deployment cancelled.');
      return;
    } else {
      const uniqueID = getUniqueID();

      const { registry, username } = getDockerInfo();

      console.log(`Docker Registry: ${chalk.green(registry)}`);
      console.log(`Docker Username: ${chalk.green(username)}`);

      validateDeploymentManifestIsModified(answers.serviceId);

      const token = await getAccessToken();

      await ensureServiceDefinitionExists(token, answers.serviceId, username);

      const serviceDefinitionId = await getServiceDefinitionID(
        token,
        answers.serviceId,
      );

      if (answers.dockerImageTag === '') {
        buildDockerImageAndPush(username, answers.serviceId, uniqueID);
      } else {
        console.log(
          `\nUsing the pre-built and pushed docker image [${answers.dockerImageTag}]. Skipping building the backend.`,
        );
      }

      if (answers.serviceId === 'media-service') {
        buildPiletAndRegister(answers.serviceId);
      }

      uploadDeploymentManifest(answers.serviceId, uniqueID);

      const dockerImageTag =
        answers.dockerImageTag === '' ? uniqueID : answers.dockerImageTag;
      initiateDeployment(answers.serviceId, dockerImageTag, uniqueID);

      printAdminPortalURL(serviceDefinitionId);
    }
  } catch (error) {
    console.log(error);
  }
}

main();
