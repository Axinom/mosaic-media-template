/* eslint-disable no-console */
import { getValidatedConfig, pick } from '@axinom/mosaic-service-common';
import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import urljoin from 'url-join';
import { getIdToken } from '../../../../scripts/helpers';
import { getConfigDefinitions } from '../src/common';
import { defaultDevAppName } from './resources';

async function main(): Promise<void> {
  const config = getValidatedConfig(
    pick(
      getConfigDefinitions(),
      'devUserServiceBaseUrl',
      'devApplicationName',
      'devEndUserId',
      'devServiceAccountClientId',
      'devServiceAccountClientSecret',
      'idServiceAuthBaseUrl',
    ),
  );
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

  console.log('- Trying to get DEV Application ID...');

  const endpointUrl = urljoin(
    config.devUserServiceBaseUrl,
    'graphql-management',
  );
  const getAppIdResult = await axios.post(
    endpointUrl,
    {
      query: print(gql`
        query DevGetApplications($filter: ApplicationFilter) {
          applications(filter: $filter) {
            nodes {
              id
            }
          }
        }
      `),
      variables: {
        filter: { name: { equalTo: devAppName } },
      },
    },
    { headers: { Authorization: `Bearer ${idJwt}` } },
  );
  const applicationId = getAppIdResult.data.data?.applications?.nodes?.[0]?.id;

  if (!applicationId) {
    console.log(
      'Unable to get Application ID. Please make sure that ID and User services are running, local ID-related configuration is valid and execute `yarn setup` if it was not already.',
    );
    if (getAppIdResult.data.errors) {
      console.log(getAppIdResult.data.errors);
    }
    process.exit(-1);
  }

  console.log(
    `- Application ID '${applicationId}' retrieved. Generating User Service DEV token...`,
  );
  const userTokenResult = await axios.post(
    endpointUrl,
    {
      query: print(gql`
        mutation DevGenerateEndUserToken(
          $input: DevGenerateEndUserAccessTokenInput!
        ) {
          devGenerateEndUserAccessToken(input: $input) {
            accessToken
          }
        }
      `),
      variables: {
        input: {
          applicationId,
          userId: config.devEndUserId,
        },
      },
    },
    { headers: { Authorization: `Bearer ${idJwt}` } },
  );

  if (userTokenResult.data.errors) {
    console.log(userTokenResult.data.errors);
  } else {
    console.log(userTokenResult.data.data.devGenerateEndUserAccessToken);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
