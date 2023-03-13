/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['./dist/', './legacy/'],
  setupFilesAfterEnv: ['jest-expect-message', 'jest-extended/all'],
  displayName: 'repo-scripts',
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
      },
    },
  },
};
