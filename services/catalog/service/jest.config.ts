import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['./dist/', './legacy/'],
  setupFilesAfterEnv: ['jest-expect-message', 'jest-extended/all'],
  displayName: 'catalog-service',
  testTimeout: 60000,
};

export default jestConfig;
