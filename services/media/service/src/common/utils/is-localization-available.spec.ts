import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../config';
import { updateConfigWithActualLocalizationAvailability } from './is-localization-available';
import { requestServiceAccountToken } from './token-utils';

jest.mock('./token-utils', () => ({
  requestServiceAccountToken: jest.fn(),
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

  it('should keep isLocalizationEnabled as true if the service account token has localization permission', async () => {
    // Arrange - fake signed token contains permissions for the localization service
    (requestServiceAccountToken as jest.Mock).mockResolvedValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6eyJheC1sb2NhbGl6YXRpb24tc2VydmljZSI6WyJFTlRJVFlfREVGSU5JVElPTlNfRURJVCJdfSwiaWF0IjoxNzEwNzcyNTk4fQ.z6WfHLgtpsDr_dFQpaULMZGPzSAhvB8g2AUZ-nmqCk8',
    );

    // Act
    await updateConfigWithActualLocalizationAvailability(mockConfig, logger);

    // Assert
    expect(requestServiceAccountToken).toHaveBeenCalledWith(mockConfig);
    expect(mockConfig.isLocalizationEnabled).toBe(true);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should set isLocalizationEnabled to false if the service account token does not have localization permission', async () => {
    // Arrange - fake signed token does not contain permissions for the localization service
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6e30sImlhdCI6MTcxMDc3MjYzMX0.FUgks4EvGilaqdTUvzo3eyU5NqV5vt9aZP63vo3XJck';
    (requestServiceAccountToken as jest.Mock).mockResolvedValue(mockToken);

    // Act
    await updateConfigWithActualLocalizationAvailability(mockConfig, logger);

    // Assert
    expect(requestServiceAccountToken).toHaveBeenCalledWith(mockConfig);
    expect(mockConfig.isLocalizationEnabled).toBe(false);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should keep isLocalizationEnabled true if an error is thrown', async () => {
    // Arrange
    const mockError = new Error('Token parsing error');
    (requestServiceAccountToken as jest.Mock).mockResolvedValue('in.val.id');
    jest.spyOn(JSON, 'parse').mockImplementationOnce(() => {
      throw mockError;
    });

    // Act
    await updateConfigWithActualLocalizationAvailability(mockConfig, logger);

    // Assert
    expect(requestServiceAccountToken).toHaveBeenCalledWith(mockConfig);
    expect(mockConfig.isLocalizationEnabled).toBe(true);
    expect(logger.warn).toHaveBeenCalled();
  });
});
