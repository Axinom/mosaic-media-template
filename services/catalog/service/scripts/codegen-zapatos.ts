/* eslint-disable no-console */
import { transformCustomType } from '@axinom/mosaic-db-common';
import { getValidatedConfig, pick } from '@axinom/mosaic-service-common';
import { Config as ZapatosConfig, generate } from 'zapatos/generate';
import { getConfigDefinitions } from '../src/common';

async function main(): Promise<void> {
  const isCurrent = process.argv?.[2] === 'current';
  const configDefinitions = pick(
    getConfigDefinitions(),
    'dbOwnerConnectionString',
    'dbShadowConnectionString',
    'dbOwner',
    'pgUserSuffix',
    'dbOwnerPassword',
    'pgHost',
    'pgPort',
    'dbName',
  );
  const config = getValidatedConfig(configDefinitions);
  const cfg: ZapatosConfig = {
    db: {
      connectionString: isCurrent
        ? config.dbOwnerConnectionString
        : config.dbShadowConnectionString,
    },
    outDir: './src/generated/db',
    progressListener: true,
    warningListener: true,
    schemas: {
      app_public: { include: '*', exclude: [] },
      ax_utils: { include: '*', exclude: [] },
      app_hidden: { include: '*', exclude: ['inbox'] },
      app_private: { include: '*', exclude: [] },
      public: { include: '*', exclude: [] },
    },
    customTypesTransform: transformCustomType,
  };
  await generate(cfg);
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
