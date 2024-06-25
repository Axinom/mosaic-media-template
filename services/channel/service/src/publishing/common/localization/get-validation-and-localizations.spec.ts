import { rejectionOf } from '@axinom/mosaic-service-common';
import { ClientError } from 'graphql-request';
import 'jest-extended';
import {
  CommonErrors,
  LOCALIZATION_CHANNEL_TYPE,
  LOCALIZATION_PROGRAM_TYPE,
} from '../../../common';
import * as localization from '../../../generated/graphql/localization';
import {
  EntityLocalizationValidationSeverity,
  EntityLocalizationValidationStatus,
} from '../../../generated/graphql/localization';
import {
  getChannelValidationAndLocalizations,
  getProgramValidationAndLocalizations,
  getValidationAndLocalizations,
  GqlLocalization,
  GqlValidationMessage,
} from './get-validation-and-localizations';

let validationResult: any = () => undefined;
let publishResult: any = () => undefined;
const mediaResult: any = () => undefined;
jest.spyOn(localization, 'getSdk').mockImplementation(() => ({
  PrepareEntityLocalizationsForPublishing: () => publishResult(),
  ValidateEntityLocalizations: () => validationResult(),
  MediaLocalizations: () => mediaResult(),
}));

describe('getValidationAndLocalizations', () => {
  const endpoint = 'http://does-not-matter-as-request-is.mocked';
  const mockedString = 'does-not-matter-as-request-is-mocked';
  const createValidationObject = (
    messages: GqlValidationMessage[],
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
  afterEach(async () => {
    validationResult = () => undefined;
  });
  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe('channel', () => {
    it('Validation returns an error -> returned localizations is undefined, returned validations are formatted', async () => {
      // Arrange
      validationResult = () => {
        return createValidationObject([
          {
            message: 'Not localized.',
            fieldName: 'title',
            locale: 'de-DE',
            severity: EntityLocalizationValidationSeverity.Error,
          },
        ]);
      };

      // Act
      const { localizations, validations } =
        await getChannelValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          LOCALIZATION_CHANNEL_TYPE,
          mockedString,
        );

      // Assert
      expect(localizations).toBeUndefined();
      expect(validations).toIncludeSameMembers([
        {
          context: 'LOCALIZATION',
          message: 'de-DE, title: Not localized.',
          severity: 'ERROR',
        },
      ]);
    });

    it('Validation returns a hash without messages -> returned localizations are filled, returned validations are empty', async () => {
      // Arrange
      validationResult = () => {
        return createValidationObject([], mockedString);
      };
      publishResult = () => {
        return createPublishObject([
          {
            '@isDefaultLocale': true,
            '@languageTag': 'en-US',
            title: 'source title',
            description: 'source desc',
          },
          {
            '@isDefaultLocale': false,
            '@languageTag': 'de-DE',
            title: 'localized title 1',
            description: 'localized desc',
          },
          {
            '@isDefaultLocale': false,
            '@languageTag': 'et-EE',
            title: 'localized title 2',
            description: null,
          },
        ]);
      };

      // Act
      const { localizations, validations } =
        await getChannelValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          LOCALIZATION_CHANNEL_TYPE,
          mockedString,
        );

      // Assert
      expect(validations).toBeEmpty();
      expect(localizations).toIncludeSameMembers([
        {
          description: 'source desc',
          is_default_locale: true,
          language_tag: 'en-US',
          title: 'source title',
        },
        {
          description: 'localized desc',
          is_default_locale: false,
          language_tag: 'de-DE',
          title: 'localized title 1',
        },
        {
          description: null,
          is_default_locale: false,
          language_tag: 'et-EE',
          title: 'localized title 2',
        },
      ]);
    });

    it('Validation returns a hash with warning message -> returned localizations are filled, returned validations are formatted', async () => {
      // Arrange
      validationResult = () => {
        return createValidationObject(
          [
            {
              message: 'Not localized.',
              fieldName: 'description',
              locale: 'et-EE',
              severity: EntityLocalizationValidationSeverity.Warning,
            },
          ],
          mockedString,
        );
      };
      publishResult = () => {
        return createPublishObject([
          {
            '@isDefaultLocale': true,
            '@languageTag': 'en-US',
            title: 'source title',
            description: 'source desc',
          },
          {
            '@isDefaultLocale': false,
            '@languageTag': 'de-DE',
            title: 'localized title 1',
            description: 'localized desc',
          },
          {
            '@isDefaultLocale': false,
            '@languageTag': 'et-EE',
            title: 'localized title 2',
            description: null,
          },
        ]);
      };

      // Act
      const { localizations, validations } =
        await getChannelValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          LOCALIZATION_CHANNEL_TYPE,
          mockedString,
        );

      // Assert
      expect(validations).toIncludeSameMembers([
        {
          context: 'LOCALIZATION',
          message: 'et-EE, description: Not localized.',
          severity: 'WARNING',
        },
      ]);
      expect(localizations).toIncludeSameMembers([
        {
          description: 'source desc',
          is_default_locale: true,
          language_tag: 'en-US',
          title: 'source title',
        },
        {
          description: 'localized desc',
          is_default_locale: false,
          language_tag: 'de-DE',
          title: 'localized title 1',
        },
        {
          description: null,
          is_default_locale: false,
          language_tag: 'et-EE',
          title: 'localized title 2',
        },
      ]);
    });

    it('Returned localizations have properties that are different from expected -> error thrown', async () => {
      // Arrange
      validationResult = () => {
        return createValidationObject([], mockedString);
      };
      publishResult = () => {
        return createPublishObject([
          {
            '@defaultLocale': true, // expected @isDefaultLocale
            '@languageCode': 'en-US', // expected @languageTag
            title: 'source title',
            description: 'source desc',
          },
          {
            '@defaultLocale': false,
            '@languageCode': 'de-DE',
            title: 'localized title 1',
            description: 'localized desc',
          },
        ] as any[]);
      };

      // Act
      const error = await rejectionOf(
        getChannelValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          mockedString,
          mockedString,
        ),
      );

      // Assert
      expect(error).toMatchObject(
        CommonErrors.MissingKeyLocalizationProperties,
      );
    });
  });

  describe('program', () => {
    it('Validation returns an error -> returned localizations is undefined, returned validations are formatted', async () => {
      // Arrange
      validationResult = () => {
        return createValidationObject([
          {
            message: `No localization value and status was found for the field "title" with the locale "de-DE".`,
            fieldName: 'title',
            locale: 'de-DE',
            severity: EntityLocalizationValidationSeverity.Error,
          },
        ]);
      };

      // Act
      const { localizations, validations } =
        await getProgramValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          LOCALIZATION_PROGRAM_TYPE,
          mockedString,
          'Awesome Program',
        );

      // Assert
      expect(localizations).toBeUndefined();
      expect(validations).toIncludeSameMembers([
        {
          context: 'LOCALIZATION',
          message:
            'The program "Awesome Program" is not fully localized (if the associated entity was localized those values will be copied which may take a bit of time): No localization value and status was found for the field "title" with the locale "de-DE".',
          severity: 'ERROR',
        },
      ]);
    });

    it('Validation returns a hash without messages -> returned localizations are filled, returned validations are empty', async () => {
      // Arrange
      validationResult = () => {
        return createValidationObject([], mockedString);
      };
      publishResult = () => {
        return createPublishObject([
          {
            '@isDefaultLocale': true,
            '@languageTag': 'en-US',
            title: 'source title',
          },
          {
            '@isDefaultLocale': false,
            '@languageTag': 'de-DE',
            title: 'localized title',
          },
        ]);
      };

      // Act
      const { localizations, validations } =
        await getProgramValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          LOCALIZATION_PROGRAM_TYPE,
          mockedString,
        );

      // Assert
      expect(validations).toBeEmpty();
      expect(localizations).toIncludeSameMembers([
        {
          is_default_locale: true,
          language_tag: 'en-US',
          title: 'source title',
        },
        {
          is_default_locale: false,
          language_tag: 'de-DE',
          title: 'localized title',
        },
      ]);
    });

    it('Validation returns a hash with warning message -> returned localizations are filled, returned validations are formatted', async () => {
      // Arrange
      validationResult = () => {
        return createValidationObject(
          [
            {
              message: `No localization value and status was found for the field "title" with the locale "de-DE".`,
              fieldName: 'title',
              locale: 'de-DE',
              severity: EntityLocalizationValidationSeverity.Warning,
            },
          ],
          mockedString,
        );
      };
      publishResult = () => {
        return createPublishObject([
          {
            '@isDefaultLocale': true,
            '@languageTag': 'en-US',
            title: 'source title',
          },
          {
            '@isDefaultLocale': false,
            '@languageTag': 'de-DE',
            title: 'localized title 1',
          },
          {
            '@isDefaultLocale': false,
            '@languageTag': 'et-EE',
            title: 'localized title 2',
          },
        ]);
      };

      // Act
      const { localizations, validations } =
        await getProgramValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          LOCALIZATION_PROGRAM_TYPE,
          mockedString,
          'Awesome Program',
        );

      // Assert
      expect(validations).toIncludeSameMembers([
        {
          context: 'LOCALIZATION',
          message:
            'The program "Awesome Program" is not fully localized (if the associated entity was localized those values will be copied which may take a bit of time): No localization value and status was found for the field "title" with the locale "de-DE".',
          severity: 'WARNING',
        },
      ]);
      expect(localizations).toIncludeSameMembers([
        {
          is_default_locale: true,
          language_tag: 'en-US',
          title: 'source title',
        },
        {
          is_default_locale: false,
          language_tag: 'de-DE',
          title: 'localized title 1',
        },
        {
          is_default_locale: false,
          language_tag: 'et-EE',
          title: 'localized title 2',
        },
      ]);
    });

    it('Returned localizations have properties that are different from expected -> error thrown', async () => {
      // Arrange
      validationResult = () => {
        return createValidationObject([], mockedString);
      };
      publishResult = () => {
        return createPublishObject([
          {
            '@defaultLocale': true, // expected @isDefaultLocale
            '@languageCode': 'en-US', // expected @languageTag
            title: 'source title',
            description: 'source desc',
          },
          {
            '@defaultLocale': false,
            '@languageCode': 'de-DE',
            title: 'localized title 1',
            description: 'localized desc',
          },
        ] as any[]);
      };

      // Act
      const error = await rejectionOf(
        getProgramValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          mockedString,
          mockedString,
        ),
      );

      // Assert
      expect(error).toMatchObject(
        CommonErrors.MissingKeyLocalizationProperties,
      );
    });
  });

  describe('common', () => {
    it('Empty localizations array is returned -> localizations returned as undefined', async () => {
      // Arrange
      validationResult = () => {
        return createValidationObject([], mockedString);
      };
      publishResult = () => {
        return createPublishObject([]);
      };

      // Act
      const { validation, localizations } = await getValidationAndLocalizations(
        endpoint,
        mockedString,
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
        getValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          mockedString,
          mockedString,
        ),
      );

      // Assert
      expect(error).toMatchObject({
        message:
          'The Localization service is not accessible. Please contact Axinom support.',
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
        getValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          mockedString,
          mockedString,
        ),
      );

      // Assert
      expect(error).toMatchObject({
        ...CommonErrors.UnableToGetLocalizations,
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
        getValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          mockedString,
          mockedString,
        ),
      );

      // Assert
      expect(error).toMatchObject({
        ...CommonErrors.UnableToGetLocalizations,
        details: { errors },
      });
    });

    it.each([
      {
        timestamp: '2021-05-25T06:23:00.923Z',
        message:
          'Unable to prepare localizations for publishing because of validation errors. Please re-validate to see the exact errors.',
        code: localization.ErrorCodesEnum.ValidationErrorsFound,
      },
      {
        timestamp: '2021-05-25T06:23:00.923Z',
        message:
          'Either the entity metadata or one of the localizations has changed since the validation was last performed. Please re-validate and try again..',
        code: localization.ErrorCodesEnum.ValidationHashMismatch,
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
          getValidationAndLocalizations(
            endpoint,
            mockedString,
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
        getValidationAndLocalizations(
          endpoint,
          mockedString,
          mockedString,
          mockedString,
          mockedString,
        ),
      );

      // Assert
      expect(error).toMatchObject({
        ...CommonErrors.UnableToGetLocalizations,
        details: undefined,
      });
    });
  });
});
