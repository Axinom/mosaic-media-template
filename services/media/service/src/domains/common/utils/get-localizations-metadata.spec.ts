import { rejectionOf } from '@axinom/mosaic-service-common';
import { ClientError } from 'graphql-request';
import 'jest-extended';
import { CommonErrors, Config } from '../../../common';
import * as localization from '../../../generated/graphql/localization';
import {
  EntityLocalizationValidationSeverity,
  EntityLocalizationValidationStatus,
  ErrorCodesEnum,
} from '../../../generated/graphql/localization';
import { createTestConfig } from '../../../tests/test-utils';
import {
  getLocalizationsMetadata,
  GqlLocalization,
  GqlLocalizationValidationMessage,
} from './get-localizations-metadata';

let validationResult: any = () => undefined;
let publishResult: any = () => undefined;
jest.spyOn(localization, 'getSdk').mockImplementation(() => ({
  PrepareEntityLocalizationsForPublishing: () => publishResult(),
  ValidateEntityLocalizations: () => validationResult(),
}));

describe('GetLocalizationsMetadata', () => {
  const mockedString = 'does-not-matter-as-request-is-mocked';
  let config: Config;
  const createValidationObject = (
    messages: GqlLocalizationValidationMessage[],
    hash?: string,
  ) => {
    return {
      data: {
        validateEntityLocalizations: {
          validationHash: hash,
          validationMessages: messages,
          validationStatus:
            hash && messages.length === 0
              ? EntityLocalizationValidationStatus.Ok
              : messages.some(
                  (x) =>
                    x.severity === EntityLocalizationValidationSeverity.Error,
                )
              ? EntityLocalizationValidationStatus.Errors
              : EntityLocalizationValidationStatus.Warnings,
        },
      },
    };
  };
  const createPublishObject = (localizations: GqlLocalization[]) => {
    return {
      data: {
        prepareEntityLocalizationsForPublishing: {
          localizations,
        },
      },
    };
  };

  beforeAll(async () => {
    config = createTestConfig();
  });

  afterEach(async () => {
    validationResult = () => undefined;
  });
  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('Empty localizations array is returned -> empty localizations array', async () => {
    // Arrange
    validationResult = () => {
      return createValidationObject([], mockedString);
    };
    publishResult = () => {
      return createPublishObject([]);
    };

    // Act
    const { validation, localizations } = await getLocalizationsMetadata(
      config,
      mockedString,
      mockedString,
      mockedString,
    );

    // Assert
    expect(validation).toEqual({
      validationHash: 'does-not-matter-as-request-is-mocked',
      validationMessages: [],
      validationStatus: 'OK',
    });
    expect(localizations).toEqual([]);
  });

  it('Error thrown because service is not available -> error thrown', async () => {
    // Arrange
    validationResult = () => {
      const error = new Error(
        'connect ECONNREFUSED 127.0.0.1:10400',
      ) as Error & { code?: string };
      error.code = 'ECONNREFUSED';
      throw error;
    };

    // Act
    const error = await rejectionOf(
      getLocalizationsMetadata(
        config,
        mockedString,
        mockedString,
        mockedString,
      ),
    );

    // Assert
    expect(error).toMatchObject({
      message:
        'The Localization service is not accessible. Please contact the service support.',
      code: CommonErrors.ServiceNotAccessible.code,
    });
  });

  it('Error thrown by service because api changed -> error with details is thrown', async () => {
    // Arrange
    const errors = [
      {
        timestamp: '2021-05-25T06:23:00.923Z',
        message:
          'Cannot query field "obsolete_field" on type "MockLocalization".',
        code: 'GRAPHQL_VALIDATION_FAILED',
      },
    ];
    validationResult = () => {
      throw new ClientError(
        { data: { validateEntityLocalizations: null }, errors, status: 400 },
        { query: '' },
      );
    };
    // Act
    const error = await rejectionOf(
      getLocalizationsMetadata(
        config,
        mockedString,
        mockedString,
        mockedString,
      ),
    );

    // Assert
    expect(error).toMatchObject({
      ...CommonErrors.PublishLocalizationsMetadataRequestError,
      details: { errors },
    });
  });

  it('Error not thrown, but errors array returned with null response -> error with details is thrown', async () => {
    // Arrange
    const errors = [
      {
        timestamp: '2021-05-25T06:23:00.923Z',
        message: 'Access token verification failed',
        code: 'ACCESS_TOKEN_VERIFICATION_FAILED',
      },
    ];
    validationResult = () => {
      throw new ClientError(
        {
          data: { prepareEntityLocalizationsForPublishing: null },
          errors,
          status: 401,
        },
        { query: '' },
      );
    };

    // Act
    const error = await rejectionOf(
      getLocalizationsMetadata(
        config,
        mockedString,
        mockedString,
        mockedString,
      ),
    );

    // Assert
    expect(error).toMatchObject({
      ...CommonErrors.PublishLocalizationsMetadataRequestError,
      details: { errors },
    });
  });

  it.each([
    {
      timestamp: '2021-05-25T06:23:00.923Z',
      message:
        'Unable to prepare localizations for publishing because of validation errors. Please re-validate to see the exact errors.',
      code: ErrorCodesEnum.ValidationErrorsFound,
    },
    {
      timestamp: '2021-05-25T06:23:00.923Z',
      message:
        'Either the entity metadata or one of the localizations has changed since the validation was last performed. Please re-validate and try again..',
      code: ErrorCodesEnum.ValidationHashMismatch,
    },
  ])(
    'Error not thrown, but errors array returned with validation error -> error with details is thrown',
    async (errorInfo) => {
      // Arrange
      const errors = [errorInfo];
      validationResult = () => {
        throw new ClientError(
          {
            data: { prepareEntityLocalizationsForPublishing: null },
            errors,
            status: 401,
          },
          { query: '' },
        );
      };

      // Act
      const error = await rejectionOf(
        getLocalizationsMetadata(
          config,
          mockedString,
          mockedString,
          mockedString,
        ),
      );

      // Assert
      expect(error).toMatchObject({
        message: errorInfo.message,
        code: errorInfo.code,
      });
    },
  );

  it('Unhandled error thrown -> error without details is thrown', async () => {
    // Arrange
    validationResult = () => {
      throw new Error('Unhandled error.');
    };

    // Act
    const error = await rejectionOf(
      getLocalizationsMetadata(
        config,
        mockedString,
        mockedString,
        mockedString,
      ),
    );

    // Assert
    expect(error).toMatchObject({
      ...CommonErrors.PublishLocalizationsMetadataRequestError,
      details: undefined,
    });
  });
});
