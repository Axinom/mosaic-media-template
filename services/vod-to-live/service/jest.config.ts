import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['./dist/', './legacy/'],
  setupFilesAfterEnv: ['jest-expect-message'],
  displayName: 'vod-to-live-service',
  testTimeout: 60000,
};

export default jestConfig;
