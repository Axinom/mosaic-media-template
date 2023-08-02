/* eslint-disable no-console */
import { getValidatedConfig, pick } from '@axinom/mosaic-service-common';
import { reset } from 'graphile-migrate';
import { getConfigDefinitions, getMigrationSettings } from '../src/common';

async function main(): Promise<void> {
  const config = getValidatedConfig(
    pick(
      getConfigDefinitions(),
      'pgRootConnectionString',
      'dbOwnerConnectionString',
      'dbShadowConnectionString',
      'dbLoginConnectionString',
      'dbName',
      'dbGqlRole',
      'dbLogin',
      'dbLoginPassword',
      'dbOwner',
      'dbOwnerPassword',
      'pgHost',
      'pgPort',
      'pgUserSuffix',
      'pgSSLMode',
      'pgRoot',
      'pgRootPassword',
      'dbLocalizationReplicationSlot',
    ),
  );
  const settings = await getMigrationSettings(config);
  await reset(settings, true);
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
