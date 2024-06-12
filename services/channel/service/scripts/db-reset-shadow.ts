/* eslint-disable no-console */
import {
  getBasicDbConfigDefinitions,
  getValidatedConfig,
} from '@axinom/mosaic-service-common';
import { reset } from 'graphile-migrate';
import { getMigrationSettings } from '../src/common';

async function main(): Promise<void> {
  const config = getValidatedConfig(getBasicDbConfigDefinitions());
  const settings = await getMigrationSettings(config);
  await reset(settings, true);
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
