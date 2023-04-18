import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['./dist/', './legacy/'],
  setupFilesAfterEnv: ['jest-expect-message', 'jest-extended/all'],
  displayName: 'repo-scripts',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        esModuleInterop: true,
      },
    ],
  },
};

export default jestConfig;
