import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['./dist/', './legacy/'],
  setupFilesAfterEnv: [
    'jest-expect-message',
    'jest-extended/all',
    '<rootDir>/jest.setup.ts',
  ],
  displayName: 'channel-service',
  workerIdleMemoryLimit: '1GB',
};

export default jestConfig;
