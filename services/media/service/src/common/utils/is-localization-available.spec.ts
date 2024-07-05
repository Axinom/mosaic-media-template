import { getAuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../config';
import { updateConfigWithActualLocalizationAvailability } from './is-localization-available';
import { requestServiceAccountToken } from './token-utils';

jest.mock('./token-utils', () => ({
  requestServiceAccountToken: jest.fn(),
}));

jest.mock('@axinom/mosaic-id-guard', () => ({
  getAuthenticatedManagementSubject: jest.fn().mockReturnValue({}),
}));

describe('localizationAvailableCheck', () => {
  let mockConfig: Config;
  let logger: Logger;

  beforeEach(() => {
    mockConfig = {
      isLocalizationEnabled: true,
    } as unknown as Config;

    logger = { warn: jest.fn() } as unknown as Logger;
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    (getAuthenticatedManagementSubject as jest.Mock).mockResolvedValue({
      permissions: {
        'ax-localization-service': ['ENTITY_DEFINITIONS_EDIT'],
      },
    });

    // Act
    await updateConfigWithActualLocalizationAvailability(mockConfig, logger);

    // Assert
    expect(requestServiceAccountToken).toHaveBeenCalledWith(mockConfig);
    expect(mockConfig.isLocalizationEnabled).toBe(true);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should set isLocalizationEnabled to false if the service account does not have localization permission', async () => {
    // Arrange
    (getAuthenticatedManagementSubject as jest.Mock).mockResolvedValue({
      permissions: {
        'ax-other-service': ['SOME_PERMISSION'],
      },
    });
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
    (getAuthenticatedManagementSubject as jest.Mock).mockRejectedValue(
      mockError,
    );

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
