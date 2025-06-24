import { isNullOrWhitespace } from '@axinom/mosaic-service-common';
import { TvshowGenreLocalization } from 'media-messages';
import {
  Config,
  LOCALIZATION_IS_DEFAULT_LOCALE,
  LOCALIZATION_LANGUAGE_TAG,
} from '../../../common';
import { SnapshotValidationResult } from '../../../publishing';
import {
  getLocalizationMappedError,
  getLocalizationsMetadata,
  GqlLocalization,
  GqlLocalizationValidationMessage,
  mapLocalizationValidationMessages,
  validateLocalizations,
} from '../../common';
import { LOCALIZATION_TVSHOW_GENRE_TYPE } from './constants';

export interface GqlTvshowGenreLocalization extends GqlLocalization {
  title: string;
}

export const getTvshowGenreLocalizationsMetadata = async (
  config: Config,
  authToken: string,
  entityId: string,
  genreTitle: string,
): Promise<{
  result?: TvshowGenreLocalization[];
  validation: SnapshotValidationResult[];
}> => {
  if (!config.isLocalizationEnabled) {
    return {
      result: undefined,
      validation: [],
    };
  }
  try {
    const { localizations, validation } =
      await getLocalizationsMetadata<GqlTvshowGenreLocalization>(
        config,
        authToken,
        entityId,
        LOCALIZATION_TVSHOW_GENRE_TYPE,
      );
    return {
      result: validateLocalizations<GqlTvshowGenreLocalization>(localizations)
        ?.map((l) => ({
          is_default_locale: l[LOCALIZATION_IS_DEFAULT_LOCALE],
          language_tag: l[LOCALIZATION_LANGUAGE_TAG],
          title: isNullOrWhitespace(l.title) ? genreTitle : l.title,
        })) // If there are locales with no values set for any of its fields, we filter them out
        ?.filter(
          (loc) =>
            loc.is_default_locale ||
            Object.entries(loc)
              .filter(
                ([key]) => !['is_default_locale', 'language_tag'].includes(key),
              )
              .some(([_, value]) => value !== null && value !== undefined),
        ),
      validation: mapLocalizationValidationMessages(
        validation,
        ({ locale, fieldName, message }: GqlLocalizationValidationMessage) =>
          `${locale}${
            fieldName ? `, ${fieldName}:` : ':'
          } ${message} (${genreTitle})`,
      ),
    };
  } catch (e) {
    throw getLocalizationMappedError(e);
  }
};
