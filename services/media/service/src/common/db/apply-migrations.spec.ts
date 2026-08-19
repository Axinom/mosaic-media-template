import { vi } from 'vitest';
import type { Settings } from 'graphile-migrate';

vi.mock('./migration-settings', () => ({
  getMigrationSettings: vi.fn(() => {
    const settings: Settings = { connectionString: 'dummy connection' };
    return settings;
  }),
}));
vi.mock('graphile-migrate', () => ({ migrate: vi.fn() }));
vi.mock('@axinom/mosaic-db-common', async () => ({
  ...(await vi.importActual<typeof dbCommon>('@axinom/mosaic-db-common')),
  compareMigrationHashes: vi.fn(),
}));

import { MosaicErrors, rejectionOf } from '@axinom/mosaic-service-common';
import * as dbCommon from '@axinom/mosaic-db-common';
import * as graphileMigrate from 'graphile-migrate';
import { createTestConfig } from '../../tests/test-utils';
import { applyMigrations } from './apply-migrations';

const mockedMigrate = vi.mocked(graphileMigrate.migrate);
const mockedCompareMigrations = vi.mocked(dbCommon.compareMigrationHashes);

describe('Check the apply migrations logic.', () => {
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
