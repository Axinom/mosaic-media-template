import { config as loadDotEnvFile } from 'dotenv';
import { url as debugUrl } from 'inspector';
import { resolve } from 'path';

// Because tests can be ran from different locations, we need to explicitly load
// .env files from both monorepo root and service root, and env-cmd cannot be
// used in some scenarios, e.g. when running a single test using Jest Runner
// VSCode extension
process.chdir(resolve(__dirname, '../../../'));
loadDotEnvFile();
process.chdir(resolve(__dirname));
loadDotEnvFile();

//TODO: Move this to jest.config.js as `testTimeout` property when this issue is
//resolved: https://github.com/facebook/jest/issues/9696
if (debugUrl() !== undefined) {
  jest.setTimeout(60000); // wait for longer when debugging a test
} else {
  jest.setTimeout(30000); // if 30 seconds are not enough for slow machines/build server we have to remove it again
}
