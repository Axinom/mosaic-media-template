module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['./dist/', './legacy/'],
  setupFilesAfterEnv: ['jest-expect-message'],
  displayName: 'vod-to-live-service',
  testTimeout: 60000,
};
