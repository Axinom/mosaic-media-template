/* eslint-disable no-console */
import hash from 'short-hash';
import { updateEnvFile } from '../../../../scripts/helpers';

async function main(): Promise<void> {
  const slotName = `media_service_localization_slot_${hash(
    new Date().toISOString(),
  )}`;
  await updateEnvFile({
    DATABASE_LOCALIZATION_REPLICATION_SLOT: slotName,
  });
  console.log(
    'The .env file is updated with the following variable:\n',
    `DATABASE_LOCALIZATION_REPLICATION_SLOT=${slotName}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
