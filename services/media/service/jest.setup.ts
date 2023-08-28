//TODO: Move this to jest.config.js as `testTimeout` property when this issue is
//resolved: https://github.com/facebook/jest/issues/9696
//media service has some long-running tests compared to other services
jest.setTimeout(60000);
