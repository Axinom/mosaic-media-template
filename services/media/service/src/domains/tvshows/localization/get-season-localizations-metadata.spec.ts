import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { CommonErrors, Config } from '../../../common';
import * as localization from '../../../generated/graphql/localization';
import {
  EntityLocalizationValidationSeverity,
  EntityLocalizationValidationStatus,
} from '../../../generated/graphql/localization';
import { createTestConfig } from '../../../tests/test-utils';
import { GqlLocalizationValidationMessage } from '../../common';
import {
  getSeasonLocalizationsMetadata,
  GqlSeasonLocalization,
} from './get-season-localizations-metadata';

let validationResult: any = () => undefined;
let publishResult: any = () => undefined;
jest.spyOn(localization, 'getSdk').mockImplementation(() => ({
  PrepareEntityLocalizationsForPublishing: () => publishResult(),
  ValidateEntityLocalizations: () => validationResult(),
}));

describe('getSeasonLocalizationsMetadata', () => {
  const mockedString = 'does-not-matter-as-request-is-mocked';
  let config: Config;
  beforeAll(async () => {
    config = createTestConfig();
  });

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
  const createPublishObject = (localizations: GqlSeasonLocalization[]) => {
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

  it('Validation returns an error -> returned localizations is undefined, returned validations are formatted', async () => {
    // Arrange
    validationResult = () => {
      return createValidationObject([
        {
          message: 'Not approved.',
          fieldName: 'description',
          locale: 'de-DE',
          severity: EntityLocalizationValidationSeverity.Error,
        },
      ]);
    };

    // Act
    const { result, validation } = await getSeasonLocalizationsMetadata(
      config,
      mockedString,
      mockedString,
    );

    // Assert
    expect(result).toBeUndefined();
    expect(validation).toIncludeSameMembers([
      {
        code: undefined,
        context: 'LOCALIZATION',
        message: 'de-DE, description: Not approved.',
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
          description: 'source description',
          synopsis: 'source synopsis',
        },
        {
          '@isDefaultLocale': false,
          '@languageTag': 'de-DE',
          description: 'localized description',
          synopsis: 'localized synopsis',
        },
        {
          '@isDefaultLocale': false,
          '@languageTag': 'et-EE',
          description: null,
          synopsis: null,
        },
      ]);
    };

    // Act
    const { result, validation } = await getSeasonLocalizationsMetadata(
      config,
      mockedString,
      mockedString,
    );

    // Assert
    expect(validation).toBeEmpty();
    expect(result).toIncludeSameMembers([
      {
        is_default_locale: true,
        language_tag: 'en-US',
        description: 'source description',
        synopsis: 'source synopsis',
      },
      {
        is_default_locale: false,
        language_tag: 'de-DE',
        description: 'localized description',
        synopsis: 'localized synopsis',
      },
      {
        is_default_locale: false,
        language_tag: 'et-EE',
        description: null,
        synopsis: null,
      },
    ]);
  });

  it('Validation returns a hash with warning message -> returned localizations are filled, returned validations are formatted', async () => {
    // Arrange
    validationResult = () => {
      return createValidationObject(
        [
          {
            message: 'Not approved.',
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
          description: 'source desc',
        },
        {
          '@isDefaultLocale': false,
          '@languageTag': 'de-DE',
          description: 'localized desc',
        },
        {
          '@isDefaultLocale': false,
          '@languageTag': 'et-EE',
          description: null,
        },
      ]);
    };

    // Act
    const { result, validation } = await getSeasonLocalizationsMetadata(
      config,
      mockedString,
      mockedString,
    );

    // Assert
    expect(validation).toIncludeSameMembers([
      {
        code: undefined,
        context: 'LOCALIZATION',
        message: 'et-EE, description: Not approved.',
        severity: 'WARNING',
      },
    ]);
    expect(result).toIncludeSameMembers([
      {
        description: 'source desc',
        is_default_locale: true,
        language_tag: 'en-US',
      },
      {
        description: 'localized desc',
        is_default_locale: false,
        language_tag: 'de-DE',
      },
      {
        description: null,
        is_default_locale: false,
        language_tag: 'et-EE',
      },
    ]);
  });

  it('If localization is disabled in service config, even if localization service would return something -> undefined result is returned', async () => {
    // Arrange
    validationResult = () => {
      return createValidationObject(
        [
          {
            message: 'Not approved.',
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
          description: 'source desc',
        },
        {
          '@isDefaultLocale': false,
          '@languageTag': 'de-DE',
          description: 'localized desc',
        },
        {
          '@isDefaultLocale': false,
          '@languageTag': 'et-EE',
          description: null,
        },
      ]);
    };

    // Act
    const { result, validation } = await getSeasonLocalizationsMetadata(
      {
        localizationServiceBaseUrl: 'mocked-value',
        serviceId: 'mocked-value',
        isLocalizationEnabled: false,
      } as Config,
      mockedString,
      mockedString,
    );

    // Assert
    expect(validation).toEqual([]);
    expect(result).toBeUndefined();
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
          description: 'source desc',
        },
        {
          '@defaultLocale': false,
          '@languageCode': 'de-DE',
          description: 'localized desc',
        },
      ] as any[]);
    };

    // Act
    const error = await rejectionOf(
      getSeasonLocalizationsMetadata(config, mockedString, mockedString),
    );

    // Assert
    expect(error).toMatchObject(CommonErrors.MissingKeyLocalizationProperties);
  });
});
