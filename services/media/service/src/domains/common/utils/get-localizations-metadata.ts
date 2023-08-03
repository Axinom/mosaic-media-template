import {
  MosaicError,
  MosaicErrorInfo,
  mosaicErrorMappingFactory,
  UnreachableCaseError,
} from '@axinom/mosaic-service-common';
import { GraphQLClient } from 'graphql-request';
import urljoin from 'url-join';
import {
  CommonErrors,
  Config,
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
import { SnapshotValidationResult } from '../../../publishing';

type GqlValidationResult = NonNullable<
  ValidateEntityLocalizationsQuery['validateEntityLocalizations']
>;
export type GqlLocalizationValidationMessage =
  GqlValidationResult['validationMessages'][0];

export interface GqlLocalization {
  '@isDefaultLocale': boolean;
  '@languageTag': string;
}

export const defaultLocalizationMessageMapper = ({
  locale,
  fieldName,
  message,
}: GqlLocalizationValidationMessage): string =>
  `${locale}${fieldName ? `, ${fieldName}:` : ':'} ${message}`;

export const getLocalizationMappedError = mosaicErrorMappingFactory(
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
        ...CommonErrors.PublishLocalizationsMetadataRequestError,
        details: {
          errors: error.response?.errors,
        },
      };
    }

    return CommonErrors.PublishLocalizationsMetadataRequestError;
  },
);

export const mapLocalizationValidationMessages = (
  { validationStatus, validationMessages }: GqlValidationResult,
  constructMessage: (
    message: GqlLocalizationValidationMessage,
  ) => string = defaultLocalizationMessageMapper,
): SnapshotValidationResult[] => {
  if (validationStatus === EntityLocalizationValidationStatus.Ok) {
    return [];
  }

  return validationMessages.map((m) => {
    switch (m.severity) {
      case EntityLocalizationValidationSeverity.Error:
        return {
          context: 'LOCALIZATION',
          message: constructMessage(m),
          severity: 'ERROR',
        };

      case EntityLocalizationValidationSeverity.Warning:
        return {
          context: 'LOCALIZATION',
          message: constructMessage(m),
          severity: 'WARNING',
        };

      default:
        throw new UnreachableCaseError(m.severity);
    }
  });
};

export const validateLocalizations = <TGqlLocalization extends GqlLocalization>(
  localizations: TGqlLocalization[] | undefined,
): TGqlLocalization[] | undefined => {
  if (!localizations || localizations.length === 0) {
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

export const getLocalizationsMetadata = async <
  TGqlLocalization extends GqlLocalization,
>(
  { localizationServiceBaseUrl, serviceId }: Config,
  authToken: string,
  entityId: string,
  entityType: string,
): Promise<{
  localizations?: TGqlLocalization[];
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

    let localizations: TGqlLocalization[] | undefined = undefined;

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
