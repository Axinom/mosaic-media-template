module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['./dist/', './legacy/'],
  setupFilesAfterEnv: ['jest-expect-message'],
  displayName: 'catalog-service',
  testTimeout: 60000,
};
