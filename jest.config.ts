import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['./dist/'],
  setupFilesAfterEnv: ['jest-expect-message', 'jest-extended/all'],
  projects: [
    '<rootDir>/scripts/jest.config.ts',
    '<rootDir>/services/!(vod-to-live)/**/jest.config.ts',
    //'<rootDir>/libs/**/jest.config.ts',
  ],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.stories.tsx',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/vendor/**',
  ],
  workerIdleMemoryLimit: '1GB',
};

export default jestConfig;
