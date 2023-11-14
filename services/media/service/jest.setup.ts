import { url as debugUrl } from 'inspector';

//TODO: Move this to jest.config.js as `testTimeout` property when this issue is
//resolved: https://github.com/facebook/jest/issues/9696
if (debugUrl() !== undefined) {
  jest.setTimeout(900_000); // wait for longer when debugging a test
} else {
  jest.setTimeout(120_000); // media service has some long-running tests compared to other services
}
