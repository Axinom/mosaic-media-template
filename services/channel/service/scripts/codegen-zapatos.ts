/* eslint-disable no-console */
import { transformCustomType } from '@axinom/mosaic-db-common';
import { Config as ZapatosConfig, generate } from 'zapatos/generate';
import { getFullConfig } from '../src/common';

async function main(): Promise<void> {
  const isCurrent = process.argv?.[2] === 'current';
  const config = getFullConfig();
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
      app_hidden: { include: '*', exclude: ['inbox', 'outbox'] }, // excluding the 'inbox' and 'outbox' storages
      app_private: { include: '*', exclude: ['messaging_health'] },
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
