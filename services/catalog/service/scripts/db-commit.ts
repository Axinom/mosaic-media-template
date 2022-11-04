#!/usr/bin/env ts-node-script
/* eslint-disable no-console */
import { commit } from 'graphile-migrate';
import { getFullConfig, getMigrationSettings } from '../src/common';

async function main(): Promise<void> {
  const config = getFullConfig();
  const settings = await getMigrationSettings(config);
  await commit(settings);
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
