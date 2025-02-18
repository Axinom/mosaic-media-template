import { groupBy } from '@axinom/mosaic-service-common';
import { SeasonLocalization } from 'media-messages';
import {
  Config,
  LOCALIZATION_IS_DEFAULT_LOCALE,
  LOCALIZATION_LANGUAGE_TAG,
} from '../../../common';
import { SnapshotValidationResult } from '../../../publishing';
import {
  getImagesMetadata,
  getLocalizationMappedError,
  getLocalizationsMetadata,
  GqlLocalization,
  ImageJSONSelectable,
  LocalizedImageApiResults,
  mapLocalizationValidationMessages,
  validateLocalizations,
} from '../../common';
import { LOCALIZATION_SEASON_TYPE } from './constants';

export interface GqlSeasonLocalization extends GqlLocalization {
  title: string;
  description?: string | null;
  synopsis?: string | null;
  season_cover_1x1?: string | null;
  season_cover_16x9?: string | null;
  season_clean_cover_1x1?: string | null;
  season_clean_cover_16x9?: string | null;
  season_list_1x1?: string | null;
  season_list_9x13?: string | null;
}

export const getSeasonLocalizationsMetadata = async (
  config: Config,
  authToken: string,
  entityId: string,
): Promise<{
  result?: SeasonLocalization[];
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
      await getLocalizationsMetadata<GqlSeasonLocalization>(
        config,
        authToken,
        entityId,
        LOCALIZATION_SEASON_TYPE,
      );
    return {
      result: validateLocalizations<GqlSeasonLocalization>(localizations)
        ?.map((l) => ({
          is_default_locale: l[LOCALIZATION_IS_DEFAULT_LOCALE],
          language_tag: l[LOCALIZATION_LANGUAGE_TAG],
          title: l.title,
          description: l.description,
          synopsis: l.synopsis,
          season_cover_1x1: l.season_cover_1x1,
          season_cover_16x9: l.season_cover_16x9,
          season_clean_cover_1x1: l.season_clean_cover_1x1,
          season_clean_cover_16x9: l.season_clean_cover_16x9,
          season_list_1x1: l.season_list_1x1,
          season_list_9x13: l.season_list_9x13,
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
      validation: mapLocalizationValidationMessages(validation),
    };
  } catch (e) {
    throw getLocalizationMappedError(e);
  }
};

export const getSeasonLocalizedImagesMetadata = async (
  seasonId: number,
  localizations: SeasonLocalization[] | undefined,
  imageServiceBaseUrl: string,
  authToken: string,
): Promise<LocalizedImageApiResults[]> => {
  const localizedImageApiResults: LocalizedImageApiResults[] = [];
  if (!localizations) {
    return Promise.resolve([]);
  }

  const localizationsGroupedByLocale = groupBy(
    localizations.filter((localization) => !localization.is_default_locale),
    'language_tag',
  );
  for (const [locale, localization] of Object.entries(
    localizationsGroupedByLocale,
  )) {
    const images: ImageJSONSelectable[] = [];
    if (localization[0]?.season_cover_1x1) {
      images.push({
        season_id: seasonId,
        image_type: 'SEASON_COVER_1x1',
        image_id: localization[0].season_cover_1x1,
      });
    }
    if (localization[0]?.season_cover_16x9) {
      images.push({
        season_id: seasonId,
        image_type: 'SEASON_COVER_16x9',
        image_id: localization[0].season_cover_16x9,
      });
    }
    if (localization[0]?.season_clean_cover_1x1) {
      images.push({
        season_id: seasonId,
        image_type: 'SEASON_CLEAN_COVER_1x1',
        image_id: localization[0].season_clean_cover_1x1,
      });
    }
    if (localization[0]?.season_clean_cover_16x9) {
      images.push({
        season_id: seasonId,
        image_type: 'SEASON_CLEAN_COVER_16x9',
        image_id: localization[0].season_clean_cover_16x9,
      });
    }
    if (localization[0]?.season_list_1x1) {
      images.push({
        season_id: seasonId,
        image_type: 'SEASON_LIST_1x1',
        image_id: localization[0].season_list_1x1,
      });
    }
    if (localization[0]?.season_list_9x13) {
      images.push({
        season_id: seasonId,
        image_type: 'SEASON_LIST_9x13',
        image_id: localization[0].season_list_9x13,
      });
    }
    const imageApiResults = await getImagesMetadata(
      imageServiceBaseUrl,
      authToken,
      images,
    );
    localizedImageApiResults.push({
      result: imageApiResults.result,
      validation: imageApiResults.validation,
      language_tag: locale,
    });
  }
  return localizedImageApiResults;
};
