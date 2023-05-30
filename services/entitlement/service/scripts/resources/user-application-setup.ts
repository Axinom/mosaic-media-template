/* eslint-disable no-console */
import { isNullOrWhitespace } from '@axinom/mosaic-service-common';
import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import urljoin from 'url-join';
import { getIdToken } from '../../../../../scripts/helpers';
import { Config } from '../../src/common';
import { defaultDevAppName } from './constants';

export const userApplicationSetup = async (
  config: Partial<Config>,
): Promise<void> => {
  if (!config.devUserServiceBaseUrl) {
    console.log(
      `Please define 'DEV_USER_SERVICE_MANAGEMENT_BASE_URL' env variable in .env file.`,
    );
    process.exit(-1);
  }

  const devAppName = config.devApplicationName || defaultDevAppName;
  const idJwt = await getIdToken(
    './scripts/resources/dev-user.json',
    config.devServiceAccountClientId,
    config.devServiceAccountClientSecret,
    config.idServiceAuthBaseUrl,
  );

  console.log(`- Creating new Application with name '${devAppName}' ...`);

  const endpointUrl = urljoin(
    config.devUserServiceBaseUrl,
    'graphql-management',
  );
  const result = await axios.post(
    endpointUrl,
    {
      query: print(gql`
        mutation DevCreateApplication($input: CreateApplicationInput!) {
          createApplication(input: $input) {
            application {
              id
            }
          }
        }
      `),
      variables: {
        input: {
          application: {
            name: devAppName,
            applicationPlatform: 'WEB',
            allowedOrigins: ['http://localhost'],
            allowedProxyUrls: ['http://localhost'],
          },
        },
      },
    },
    { headers: { Authorization: `Bearer ${idJwt}` } },
  );
  const applicationId = result.data.data?.createApplication?.application?.id;
  if (!isNullOrWhitespace(applicationId)) {
    // Enable the dev application.
    await enableApplication(applicationId, endpointUrl, idJwt);
    console.log(
      `- Application with name '${devAppName}' and ID '${applicationId}' successfully created!'`,
    );
  } else if (
    result.data.errors[0].message ===
    'Attempt to create or update an element failed, as it would have resulted in a duplicate element.'
  ) {
    const existingApplication = await getDevAppId(
      devAppName,
      endpointUrl,
      idJwt,
    );
    if (existingApplication !== undefined && !existingApplication.enabled) {
      await enableApplication(
        existingApplication.applicationId,
        endpointUrl,
        idJwt,
      );
    }

    console.log('- Dev Application already exists.');
  } else {
    console.log(result.data.errors);
  }
};

const getDevAppId = async (
  devAppName: string,
  devUserServiceEndpointUrl: string,
  idJwt: string,
): Promise<{ applicationId: string; enabled: boolean } | undefined> => {
  const devApplication = await axios.post(
    devUserServiceEndpointUrl,
    {
      query: print(gql`
        query GetDevApplicationId($appName: String!) {
          applications(filter: { name: { equalTo: $appName } }) {
            nodes {
              id
              enabled
            }
          }
        }
      `),
      variables: {
        appName: devAppName,
      },
    },
    { headers: { Authorization: `Bearer ${idJwt}` } },
  );

  if (devApplication.data.errors !== undefined) {
    console.log('Error while querying the existing Dev Application.');
    console.log(devApplication.data.errors);
    return undefined;
  } else {
    return {
      applicationId: devApplication.data.data.applications.nodes[0].id,
      enabled: devApplication.data.data.applications.nodes[0].enabled,
    };
  }
};

// Enable a User Service Application
const enableApplication = async (
  applicationId: string,
  devUserServiceEndpointUrl: string,
  idJwt: string,
): Promise<void> => {
  // Enable the application
  const updateResult = await axios.post(
    devUserServiceEndpointUrl,
    {
      query: print(gql`
        mutation DevEnableApplication($input: UpdateApplicationInput!) {
          updateApplication(input: $input) {
            application {
              id
            }
          }
        }
      `),
      variables: {
        input: {
          patch: {
            enabled: true,
            allowedOrigins: ['http://localhost'],
            allowedProxyUrls: ['http://localhost'],
          },
          id: applicationId,
        },
      },
    },
    { headers: { Authorization: `Bearer ${idJwt}` } },
  );
  if (updateResult.data.errors !== undefined) {
    console.log(
      `Error while enabling the Application: ${JSON.stringify(
        updateResult.data.errors,
      )}`,
    );
  }
};
