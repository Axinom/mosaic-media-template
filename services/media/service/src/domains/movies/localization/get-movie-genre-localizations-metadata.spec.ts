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
  getMovieGenreLocalizationsMetadata,
  GqlMovieGenreLocalization,
} from './get-movie-genre-localizations-metadata';

let validationResult: any = () => undefined;
let publishResult: any = () => undefined;
jest.spyOn(localization, 'getSdk').mockImplementation(() => ({
  PrepareEntityLocalizationsForPublishing: () => publishResult(),
  ValidateEntityLocalizations: () => validationResult(),
}));

describe('getMovieGenreLocalizationsMetadata', () => {
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
  const createPublishObject = (localizations: GqlMovieGenreLocalization[]) => {
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
          message: 'Not localized.',
          fieldName: 'title',
          locale: 'de-DE',
          severity: EntityLocalizationValidationSeverity.Error,
        },
      ]);
    };

    // Act
    const { result, validation } = await getMovieGenreLocalizationsMetadata(
      config,
      mockedString,
      mockedString,
      'Drama',
    );

    // Assert
    expect(result).toBeUndefined();
    expect(validation).toIncludeSameMembers([
      {
        code: undefined,
        context: 'LOCALIZATION',
        message: 'de-DE, title: Not localized. (Drama)',
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
    const { result, validation } = await getMovieGenreLocalizationsMetadata(
      config,
      mockedString,
      mockedString,
      'Adventure',
    );

    // Assert
    expect(validation).toBeEmpty();
    expect(result).toIncludeSameMembers([
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

  it('Validation returns a hash with warning message -> returned localizations are filled, returned validations are formatted', async () => {
    // Arrange
    validationResult = () => {
      return createValidationObject(
        [
          {
            message: 'Not approved.',
            fieldName: 'title',
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
    const { result, validation } = await getMovieGenreLocalizationsMetadata(
      config,
      mockedString,
      mockedString,
      'Action',
    );

    // Assert
    expect(validation).toIncludeSameMembers([
      {
        code: undefined,
        context: 'LOCALIZATION',
        message: 'et-EE, title: Not approved. (Action)',
        severity: 'WARNING',
      },
    ]);
    expect(result).toIncludeSameMembers([
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

  it('If localization is disabled in service config, even if localization service would return something -> undefined result is returned', async () => {
    // Arrange
    validationResult = () => {
      return createValidationObject(
        [
          {
            message: 'Not approved.',
            fieldName: 'title',
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
    const { result, validation } = await getMovieGenreLocalizationsMetadata(
      {
        localizationServiceBaseUrl: 'mocked-value',
        serviceId: 'mocked-value',
        isLocalizationEnabled: false,
      } as Config,
      mockedString,
      mockedString,
      'Romance',
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
          title: 'source title',
        },
        {
          '@defaultLocale': false,
          '@languageCode': 'de-DE',
          title: 'localized title 1',
        },
      ] as any[]);
    };

    // Act
    const error = await rejectionOf(
      getMovieGenreLocalizationsMetadata(
        config,
        mockedString,
        mockedString,
        'Comedy',
      ),
    );

    // Assert
    expect(error).toMatchObject(CommonErrors.MissingKeyLocalizationProperties);
  });
});
