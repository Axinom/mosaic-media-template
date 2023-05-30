module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['./dist/', './legacy/'],
  setupFilesAfterEnv: ['jest-expect-message'],
  displayName: 'entitlement-service',
  testTimeout: 60000,
};
