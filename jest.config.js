/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
  preset: 'ts-jest',
  testTimeout: 60000,
  modulePathIgnorePatterns: ['./dist/'],
  setupFilesAfterEnv: ['jest-expect-message', 'jest-extended/all'],
  projects: [
    '<rootDir>/scripts/jest.config.js',
    '<rootDir>/services/**/jest.config.js',
    //'<rootDir>/libs/**/jest.config.js',
  ],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.stories.tsx',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/vendor/**',
  ],
};
