/* eslint-disable no-console */
import { uncommit } from 'graphile-migrate';
import { getFullConfig, getMigrationSettings } from '../src/common';

async function main(): Promise<void> {
  const config = getFullConfig();
  const settings = await getMigrationSettings(config);
  await uncommit(settings);
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
