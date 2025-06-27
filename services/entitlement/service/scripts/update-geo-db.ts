/* eslint-disable no-console */
import { getFullConfig } from '../src/common'; // adjust path if needed
import { updateGeoDatabase } from '../src/update-geo-database';

async function main(): Promise<void> {
  const config = getFullConfig();
  await updateGeoDatabase(config);
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
