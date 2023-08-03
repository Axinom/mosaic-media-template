/* eslint-disable no-console */
import { getValidatedConfig, pick } from '@axinom/mosaic-service-common';
import { reset } from 'graphile-migrate';
import { initializePgPool, runResetQueries } from '../../../../scripts/helpers';
import { getConfigDefinitions, getMigrationSettings } from '../src/common';

async function main(): Promise<void> {
  console.log('1. Validating Config...');
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
  console.log('2. Initializing ROOT Database Connection...');
  const rootPgPool = await initializePgPool(config.pgRootConnectionString);

  console.log('3. Running Reset/Initialization Queries...');
  await runResetQueries(
    rootPgPool,
    config.dbName,
    config.dbGqlRole,
    config.dbLogin,
    config.dbLoginPassword,
    config.dbOwner,
    config.dbOwnerPassword,
    undefined,
    true,
  );

  console.log('4. Closing ROOT Database Connection...');
  await rootPgPool.end();

  console.log(`5. Running Graphile-Migrate 'reset' command`);
  const settings = await getMigrationSettings(config);
  await reset(settings);
  await reset(settings, true);

  console.log('6. Database Reset/Initialization Completed!');
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
