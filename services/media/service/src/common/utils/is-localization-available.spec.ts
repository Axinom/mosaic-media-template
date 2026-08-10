import type { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import type { Logger } from '@axinom/mosaic-service-common';
import type { Config } from '../config';

vi.mock('./token-utils', () => ({
  requestServiceAccountToken: vi.fn(),
}));

vi.mock('@axinom/mosaic-id-guard', () => ({
  getAuthenticatedManagementSubject: vi.fn().mockReturnValue({}),
}));

import { getAuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { updateConfigWithActualLocalizationAvailability } from './is-localization-available';
import { requestServiceAccountToken } from './token-utils';

describe('localizationAvailableCheck', () => {
  let mockConfig: Config;
  let logger: Logger;

  beforeEach(() => {
    mockConfig = {
      isLocalizationEnabled: true,
    } as unknown as Config;

    logger = { warn: vi.fn() } as unknown as Logger;
  });

  it('keep isLocalizationEnabled as false if isLocalizationEnabled is already false', async () => {
    // Arrange
    mockConfig.isLocalizationEnabled = false;

    // Act
    await updateConfigWithActualLocalizationAvailability(mockConfig, logger);

    // Assert
    expect(mockConfig.isLocalizationEnabled).toBe(false);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should keep isLocalizationEnabled as true if the service account has localization permission', async () => {
    // Arrange
    vi.mocked(getAuthenticatedManagementSubject).mockResolvedValue({
      permissions: {
        'ax-localization-service': ['ENTITY_DEFINITIONS_EDIT'],
      },
    } as unknown as AuthenticatedManagementSubject);

    // Act
    await updateConfigWithActualLocalizationAvailability(mockConfig, logger);

    // Assert
    expect(requestServiceAccountToken).toHaveBeenCalledWith(mockConfig);
    expect(mockConfig.isLocalizationEnabled).toBe(true);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should set isLocalizationEnabled to false if the service account does not have localization permission', async () => {
    // Arrange
    vi.mocked(getAuthenticatedManagementSubject).mockResolvedValue({
      permissions: {
        'ax-other-service': ['SOME_PERMISSION'],
      },
    } as unknown as AuthenticatedManagementSubject);
    // Act
    await updateConfigWithActualLocalizationAvailability(mockConfig, logger);

    // Assert
    expect(requestServiceAccountToken).toHaveBeenCalledWith(mockConfig);
    expect(mockConfig.isLocalizationEnabled).toBe(false);
    expect(logger.warn).toHaveBeenCalledWith(
      'The configuration value states that localization should be enabled but the service account does not have permissions for the localization service. Disabling localizations until the Media Service is restarted and the checks are run again.',
    );
  });

  it('should keep isLocalizationEnabled true if an error is thrown', async () => {
    // Arrange
    const mockError = new Error('Token parsing error');
    vi.mocked(getAuthenticatedManagementSubject).mockRejectedValue(mockError);

    // Act
    await updateConfigWithActualLocalizationAvailability(mockConfig, logger);

    // Assert
    expect(requestServiceAccountToken).toHaveBeenCalledWith(mockConfig);
    expect(mockConfig.isLocalizationEnabled).toBe(true);
    expect(logger.warn).toHaveBeenCalledWith(
      mockError,
      'Could not get the service account token to check if the localization service is enabled.',
    );
  });
});
