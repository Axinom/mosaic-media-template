/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
import {
  getValidatedConfig,
  mosaicErrorMappingFactory,
  pick,
} from '@axinom/mosaic-service-common';
import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import urljoin from 'url-join';
import { getIdToken, updateEnvFile } from '../../../../scripts/helpers';
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

async function main(): Promise<void> {
  const config = getValidatedConfig(
    pick(
      getConfigDefinitions(),
      'devServiceAccountClientId',
      'devServiceAccountClientSecret',
      'idServiceAuthBaseUrl',
      'devVideoServiceBaseUrl',
      'port',
    ),
  );
  if (!config.devVideoServiceBaseUrl) {
    console.log(
      `Please define 'DEV_VIDEO_SERVICE_BASE_URL' env variable in .env file.`,
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
    const endpointUrl = urljoin(config.devVideoServiceBaseUrl, 'graphql');
    const result = await axios.post(
      endpointUrl,
      {
        query: print(gql`
          mutation SetupWebhooks($input: SetGeneralSettingsInput!) {
            setGeneralSettings(input: $input) {
              entitlementWebhookUrl
              manifestWebhookUrl
            }
            generateEntitlementWebhookSecret {
              secret
            }
            generateManifestWebhookSecret {
              secret
            }
          }
        `),
        variables: {
          input: {
            entitlementWebhookUrl: `http://localhost:${config.port}/entitlement`,
            manifestWebhookUrl: `http://localhost:${config.port}/manifest`,
          },
        },
      },
      { headers: { Authorization: `Bearer ${idJwt}` } },
    );
    if (
      result.data?.data?.generateEntitlementWebhookSecret?.secret &&
      result.data?.data?.generateManifestWebhookSecret?.secret
    ) {
      await updateEnvFile({
        ENTITLEMENT_WEBHOOK_SECRET:
          result.data.data.generateEntitlementWebhookSecret.secret,
        MANIFEST_WEBHOOK_SECRET:
          result.data.data.generateManifestWebhookSecret.secret,
      });
      console.log(
        `Webhook urls are set and new webhook secrets generated. The following variables are updated in the .env file.`,
      );
      console.log(
        `ENTITLEMENT_WEBHOOK_SECRET=${result.data.data.generateEntitlementWebhookSecret.secret}`,
      );
      console.log(
        `MANIFEST_WEBHOOK_SECRET=${result.data.data.generateManifestWebhookSecret.secret}`,
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
