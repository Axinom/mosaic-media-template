/* eslint-disable no-console */
import {
  getConfig,
  isNullOrWhitespace,
  pick,
} from '@axinom/mosaic-service-common';
import readline from 'readline';
import hash from 'short-hash';
import { getConfigDefinitions } from '../src/common';

const green = (text: string): string => `\u001b[32m${text}\u001b[39m`;
const red = (text: string): string => `\u001b[31m${text}\u001b[39m`;

async function main(): Promise<void> {
  const config = getConfig(
    pick(getConfigDefinitions(), 'serviceId', 'environmentId'),
  );
  const { serviceId, environmentId } = config.values;
  if (isNullOrWhitespace(serviceId)) {
    console.log(
      red(
        `The SERVICE_ID configuration value is not defined in the .env file.`,
      ),
    );

    process.exit(-1);
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const def = !isNullOrWhitespace(environmentId)
    ? ` (Default: ${environmentId})`
    : '';
  rl.question(
    `> Please enter your environment ID to generate a replication slot name that is unique to it and '${serviceId}'${def}:\n`,
    (inputValue) => {
      const sanitizedValue = (
        isNullOrWhitespace(inputValue) ? environmentId : inputValue
      )?.trim();
      if (isNullOrWhitespace(sanitizedValue)) {
        console.log(
          red(
            `The provided environment ID value must not be empty or must be present in the Root .env file.`,
          ),
        );

        process.exit(-1);
      }
      const slotName = `media_service_localization_slot_${hash(
        `${sanitizedValue}_${serviceId}`,
      )}`;
      console.log(
        `The value is generated using environment ID "${sanitizedValue}" and service ID "${serviceId}":`,
      );
      console.log(green(slotName));

      rl.close();
    },
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
