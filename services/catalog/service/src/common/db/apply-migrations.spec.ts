import * as dbCommon from '@axinom/mosaic-db-common';
import { MosaicErrors, rejectionOf } from '@axinom/mosaic-service-common';
import * as graphileMigrate from 'graphile-migrate';
import { Settings } from 'graphile-migrate';
import { createTestConfig } from '../../tests/test-utils';
import { applyMigrations } from './apply-migrations';

jest.mock('./migration-settings.ts', () => {
  return {
    getMigrationSettings: jest.fn().mockImplementation(() => {
      const settings: Settings = { connectionString: 'dummy connection' };
      return settings;
    }),
  };
});

jest.mock('graphile-migrate');
const mockedMigrate = jest.spyOn(graphileMigrate, 'migrate');
jest.mock('@axinom/mosaic-db-common');
const mockedCompareMigrations = jest.spyOn(dbCommon, 'compareMigrationHashes');

describe('Check the apply migrations logic.', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get migration settings and apply migrations.', async () => {
    // Arrange
    const config = createTestConfig({ NODE_ENV: 'production' });
    mockedMigrate.mockImplementation(async () => {
      return;
    });
    mockedCompareMigrations.mockImplementation(async () => {
      return;
    });

    // Act
    await applyMigrations(config);

    // Assert
    expect(mockedMigrate).toHaveBeenCalledWith({
      connectionString: 'dummy connection',
    });
  });

  it('Throw an error on failed migration.', async () => {
    // Arrange
    const config = createTestConfig({ NODE_ENV: 'production' });
    mockedMigrate.mockImplementation(async () => {
      throw new Error('Something went wrong...');
    });
    mockedCompareMigrations.mockImplementation(async () => {
      return;
    });

    // Act
    const error = await rejectionOf(applyMigrations(config));

    expect(error).toMatchObject({
      message: 'An error occurred while trying to apply migrations.',
      code: MosaicErrors.StartupError.code,
    });

    // Assert
    expect(mockedMigrate).toHaveBeenCalledWith({
      connectionString: 'dummy connection',
    });
  });

  it('Do not apply migrations in development.', async () => {
    // Arrange
    const config = createTestConfig({ NODE_ENV: 'development' });
    mockedMigrate.mockImplementation(async () => {
      throw new Error('Something went wrong...');
    });
    mockedCompareMigrations.mockImplementation(async () => {
      return;
    });

    // Act
    await applyMigrations(config);

    // Assert
    expect(mockedMigrate).not.toHaveBeenCalled();
  });
});
