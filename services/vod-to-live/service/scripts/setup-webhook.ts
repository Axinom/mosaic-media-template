/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
import {
  getValidatedConfig,
  mosaicErrorMappingFactory,
  pick,
} from '@axinom/mosaic-service-common';
import axios from 'axios';
import { promises as fs } from 'fs';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { join, resolve } from 'path';
import urljoin from 'url-join';
import { getIdToken } from '../../../../scripts/helpers';
import { getConfigDefinitions } from '../src/common';

const mapAndLogError = mosaicErrorMappingFactory(
  (error: Error & { code?: string; config?: { url?: string } }) => {
    if (error?.code === 'ECONNREFUSED') {
      console.log(
        'Unable to make a request to the following URL because the service is not accessible:',
        error?.config?.url,
      );
      return undefined;
    }
    console.log(
      'An unhandled error has occurred. Please inspect the thrown error for more information:',
      error,
    );
    return undefined;
  },
);

async function updateEnvFile(webhookSecret: string): Promise<void> {
  const envVarPath = resolve(join(process.cwd(), '.env'));
  let envFileContent = await fs.readFile(envVarPath, { encoding: 'utf8' });

  const prePublishingRegex = /^PRE_PUBLISHING_WEBHOOK_SECRET=.*$/gm;

  const prePublishingEnv = 'PRE_PUBLISHING_WEBHOOK_SECRET=' + webhookSecret;

  if (envFileContent.match(prePublishingRegex) !== null) {
    envFileContent = envFileContent.replace(
      prePublishingRegex,
      prePublishingEnv,
    );
  } else {
    envFileContent += '\n' + prePublishingEnv;
  }

  await fs.writeFile(envVarPath, envFileContent, 'utf8');
}

async function main(): Promise<void> {
  const config = getValidatedConfig(
    pick(
      getConfigDefinitions(),
      'devServiceAccountClientId',
      'devServiceAccountClientSecret',
      'idServiceAuthBaseUrl',
      'devChannelServiceBaseUrl',
      'port',
    ),
  );
  if (!config.devChannelServiceBaseUrl) {
    console.log(
      `Please define 'DEV_CHANNEL_SERVICE_BASE_URL' env variable in .env file.`,
    );
    process.exit(-1);
  }
  try {
    const idJwt = await getIdToken(
      './scripts/resources/dev-user.json',
      config.devServiceAccountClientId,
      config.devServiceAccountClientSecret,
      config.idServiceAuthBaseUrl,
    );
    const endpointUrl = urljoin(config.devChannelServiceBaseUrl, 'graphql');
    await axios.post(
      endpointUrl,
      {
        query: print(gql`
          mutation SetWebhookUrl($input: SetGeneralSettingsInput!) {
            setGeneralSettings(input: $input) {
              generalSetting {
                prePublishingWebhookUrl
              }
            }
          }
        `),
        variables: {
          input: {
            prePublishingWebhookUrlVal: `http://localhost:${config.port}/pre-publishing`,
          },
        },
      },
      { headers: { Authorization: `Bearer ${idJwt}` } },
    );
    const result = await axios.post(
      endpointUrl,
      {
        query: print(gql`
          mutation SetupWebhookSecret {
            generatePrePublishingWebhookSecret {
              secret
            }
          }
        `),
      },
      { headers: { Authorization: `Bearer ${idJwt}` } },
    );
    if (result.data?.data?.generatePrePublishingWebhookSecret?.secret) {
      await updateEnvFile(
        result.data.data.generatePrePublishingWebhookSecret.secret,
      );
      console.log(
        `Webhook url is set and new webhook secret generated. The following variable was updated in the .env file.`,
      );
      console.log(
        `PRE_PUBLISHING_WEBHOOK_SECRET=${result.data?.data?.generatePrePublishingWebhookSecret?.secret}`,
      );
    } else {
      console.log(result.data?.errors);
    }
  } catch (error) {
    mapAndLogError(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
