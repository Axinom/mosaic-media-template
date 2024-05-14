import {
  MosaicError,
  MosaicErrorInfo,
  mosaicErrorMappingFactory,
  UnreachableCaseError,
} from '@axinom/mosaic-service-common';
import { GraphQLClient } from 'graphql-request';
import { ChannelLocalization, ProgramLocalization } from 'media-messages';
import urljoin from 'url-join';
import {
  CommonErrors,
  DEFAULT_LOCALIZATION_NAME,
  LOCALIZATION_IS_DEFAULT_LOCALE,
  LOCALIZATION_LANGUAGE_TAG,
} from '../../../common';
import {
  EntityLocalizationValidationSeverity,
  EntityLocalizationValidationStatus,
  ErrorCodesEnum,
  getSdk,
  ValidateEntityLocalizationsQuery,
} from '../../../generated/graphql/localization';
import {
  createValidationError,
  createValidationWarning,
  PublishValidationMessage,
} from '../../models';

type GqlValidationResult = NonNullable<
  ValidateEntityLocalizationsQuery['validateEntityLocalizations']
>;
export type GqlValidationMessage = GqlValidationResult['validationMessages'][0];

export interface GqlLocalization {
  '@isDefaultLocale': boolean;
  '@languageTag': string;
  title: string;
  description?: string | null;
}

const getLocalizationMappedError = mosaicErrorMappingFactory(
  (
    error: Error & { code?: string; response?: { errors?: MosaicErrorInfo[] } },
  ) => {
    if (error?.code === 'ECONNREFUSED') {
      return {
        ...CommonErrors.ServiceNotAccessible,
        messageParams: ['Localization'],
      };
    }

    if (error.response?.errors) {
      const validationError = error.response.errors.find(
        (x) =>
          x.code === ErrorCodesEnum.ValidationErrorsFound ||
          x.code === ErrorCodesEnum.ValidationHashMismatch,
      );
      if (validationError) {
        return validationError;
      }

      return {
        ...CommonErrors.UnableToGetLocalizations,
        details: {
          errors: error.response?.errors,
        },
      };
    }

    return CommonErrors.UnableToGetLocalizations;
  },
);

const mapValidationMessages = (
  { validationStatus, validationMessages }: GqlValidationResult,
  constructMessage: (message: GqlValidationMessage) => string,
): PublishValidationMessage[] => {
  if (validationStatus === EntityLocalizationValidationStatus.Ok) {
    return [];
  }

  return validationMessages.map((m) => {
    switch (m.severity) {
      case EntityLocalizationValidationSeverity.Error:
        return createValidationError(constructMessage(m), 'LOCALIZATION');

      case EntityLocalizationValidationSeverity.Warning:
        return createValidationWarning(constructMessage(m), 'LOCALIZATION');

      default:
        throw new UnreachableCaseError(m.severity);
    }
  });
};

const validateLocalizations = (
  localizations: GqlLocalization[] | undefined,
): GqlLocalization[] | undefined => {
  if (!localizations || localizations.length === 0) {
    // No locales are defined, meaning localization service is disabled.
    return undefined;
  }

  if (
    localizations.some(
      (l) =>
        l[LOCALIZATION_IS_DEFAULT_LOCALE] === undefined ||
        l[LOCALIZATION_LANGUAGE_TAG] === undefined,
    )
  ) {
    throw new MosaicError(CommonErrors.MissingKeyLocalizationProperties);
  }
  return localizations;
};

export const getValidationAndLocalizations = async (
  localizationServiceBaseUrl: string,
  authToken: string,
  entityId: string,
  entityType: string,
  serviceId: string,
): Promise<{
  localizations?: GqlLocalization[];
  validation: GqlValidationResult;
}> => {
  try {
    const client = new GraphQLClient(
      urljoin(localizationServiceBaseUrl, 'graphql'),
    );
    const {
      ValidateEntityLocalizations,
      PrepareEntityLocalizationsForPublishing,
    } = getSdk(client);
    const { data } = await ValidateEntityLocalizations(
      {
        entityId,
        entityType,
        serviceId,
      },
      { Authorization: `Bearer ${authToken}` },
    );

    let localizations: GqlLocalization[] | undefined = undefined;

    if (data.validateEntityLocalizations.validationHash) {
      const { data: publishData } =
        await PrepareEntityLocalizationsForPublishing(
          {
            entityId,
            entityType,
            serviceId,
            hash: data.validateEntityLocalizations.validationHash,
          },
          { Authorization: `Bearer ${authToken}` },
        );
      localizations =
        publishData.prepareEntityLocalizationsForPublishing.localizations;
    }

    return {
      localizations,
      validation: data.validateEntityLocalizations,
    };
  } catch (e) {
    throw getLocalizationMappedError(e);
  }
};

export const getChannelValidationAndLocalizations = async (
  localizationServiceBaseUrl: string,
  authToken: string,
  entityId: string,
  entityType: string,
  serviceId: string,
): Promise<{
  localizations: ChannelLocalization[] | undefined;
  validations: PublishValidationMessage[];
}> => {
  try {
    const { localizations, validation } = await getValidationAndLocalizations(
      localizationServiceBaseUrl,
      authToken,
      entityId,
      entityType,
      serviceId,
    );
    return {
      localizations: validateLocalizations(localizations)?.map((l) => ({
        is_default_locale: l[LOCALIZATION_IS_DEFAULT_LOCALE],
        language_tag: l[LOCALIZATION_LANGUAGE_TAG],
        title: l.title,
        description: l.description,
      })),
      validations: mapValidationMessages(
        validation,
        ({ locale, fieldName, message }: GqlValidationMessage) =>
          `${locale}${fieldName ? `, ${fieldName}:` : ':'} ${message}`,
      ),
    };
  } catch (e) {
    throw getLocalizationMappedError(e);
  }
};

export const getProgramValidationAndLocalizations = async (
  localizationServiceBaseUrl: string,
  authToken: string,
  entityId: string,
  entityType: string,
  serviceId: string,
  /**
   * When playlist is published, we can get validation messages for multiple
   * programs, so there is a need to identify which messages belong to which program.
   */
  programTitle?: string,
): Promise<{
  localizations?: ProgramLocalization[];
  validations: PublishValidationMessage[];
}> => {
  try {
    const { localizations, validation } = await getValidationAndLocalizations(
      localizationServiceBaseUrl,
      authToken,
      entityId,
      entityType,
      serviceId,
    );

    return {
      localizations: validateLocalizations(localizations)?.map((l) => ({
        is_default_locale: l[LOCALIZATION_IS_DEFAULT_LOCALE],
        language_tag: l[LOCALIZATION_LANGUAGE_TAG],
        title: l.title,
      })),
      validations: mapValidationMessages(
        validation,
        ({ message }: GqlValidationMessage) =>
          `${
            programTitle
              ? `The program "${programTitle}" is not fully localized: `
              : ''
          }${message}`,
      ),
    };
  } catch (e) {
    throw getLocalizationMappedError(e);
  }
};

export const getDefaultChannelLocalization = (
  title: string,
  description?: string | null,
): ChannelLocalization => ({
  is_default_locale: true,
  language_tag: DEFAULT_LOCALIZATION_NAME,
  title,
  description,
});
