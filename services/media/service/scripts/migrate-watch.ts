/* eslint-disable no-console */
import { compareMigrationHashes } from '@axinom/mosaic-db-common';
import { watch } from 'graphile-migrate';
import { getFullConfig, getMigrationSettings } from '../src/common';

/**
 * Wrapper script around `graphile-migrate watch` to run it in a separate process from `tsc -w` during development watch mode.
 */
async function main(): Promise<void> {
  const config = getFullConfig();
  const settings = await getMigrationSettings(config);
  await compareMigrationHashes(settings);
  await watch(settings);
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
