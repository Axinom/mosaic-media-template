import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['./dist/', './legacy/'],
  setupFilesAfterEnv: ['jest-expect-message', '<rootDir>/jest.setup.ts'],
  displayName: 'vod-to-live-service',
  workerIdleMemoryLimit: '1GB',
};

export default jestConfig;
