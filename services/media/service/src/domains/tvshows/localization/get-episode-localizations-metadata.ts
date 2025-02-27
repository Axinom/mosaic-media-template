import { groupBy } from '@axinom/mosaic-service-common';
import { EpisodeLocalization } from 'media-messages';
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
import { LOCALIZATION_EPISODE_TYPE } from './constants';

export interface GqlEpisodeLocalization extends GqlLocalization {
  title: string;
  description?: string | null;
  synopsis?: string | null;
  episode_cover?: string | null;
  episode_cover_1x1?: string | null;
  episode_cover_16x9?: string | null;
  episode_clean_cover?: string | null;
  episode_clean_cover_1x1?: string | null;
  episode_clean_cover_16x9?: string | null;
  episode_list?: string | null;
  episode_list_1x1?: string | null;
  episode_list_9x13?: string | null;
}

export const getEpisodeLocalizationsMetadata = async (
  config: Config,
  authToken: string,
  entityId: string,
): Promise<{
  result?: EpisodeLocalization[];
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
      await getLocalizationsMetadata<GqlEpisodeLocalization>(
        config,
        authToken,
        entityId,
        LOCALIZATION_EPISODE_TYPE,
      );
    return {
      result: validateLocalizations<GqlEpisodeLocalization>(localizations)
        ?.map((l) => ({
          is_default_locale: l[LOCALIZATION_IS_DEFAULT_LOCALE],
          language_tag: l[LOCALIZATION_LANGUAGE_TAG],
          title: l.title,
          description: l.description,
          synopsis: l.synopsis,
          episode_cover: l.episode_cover,
          episode_cover_1x1: l.episode_cover_1x1,
          episode_cover_16x9: l.episode_cover_16x9,
          episode_clean_cover: l.episode_clean_cover,
          episode_clean_cover_1x1: l.episode_clean_cover_1x1,
          episode_clean_cover_16x9: l.episode_clean_cover_16x9,
          episode_list: l.episode_list,
          episode_list_1x1: l.episode_list_1x1,
          episode_list_9x13: l.episode_list_9x13,
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

export const getEpisodeLocalizedImagesMetadata = async (
  episode: number,
  localizations: EpisodeLocalization[] | undefined,
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
    if (localization[0]?.episode_cover) {
      images.push({
        episode_id: episode,
        image_type: 'EPISODE_COVER',
        image_id: localization[0].episode_cover,
      });
    }
    if (localization[0]?.episode_cover_1x1) {
      images.push({
        episode_id: episode,
        image_type: 'EPISODE_COVER_1x1',
        image_id: localization[0].episode_cover_1x1,
      });
    }
    if (localization[0]?.episode_cover_16x9) {
      images.push({
        episode_id: episode,
        image_type: 'EPISODE_COVER_16x9',
        image_id: localization[0].episode_cover_16x9,
      });
    }
    if (localization[0]?.episode_clean_cover_1x1) {
      images.push({
        episode_id: episode,
        image_type: 'EPISODE_CLEAN_COVER_1x1',
        image_id: localization[0].episode_clean_cover_1x1,
      });
    }
    if (localization[0]?.episode_clean_cover_1x1) {
      images.push({
        episode_id: episode,
        image_type: 'EPISODE_CLEAN_COVER_1x1',
        image_id: localization[0].episode_clean_cover_1x1,
      });
    }
    if (localization[0]?.episode_clean_cover_16x9) {
      images.push({
        episode_id: episode,
        image_type: 'EPISODE_CLEAN_COVER_16x9',
        image_id: localization[0].episode_clean_cover_16x9,
      });
    }
    if (localization[0]?.episode_list) {
      images.push({
        episode_id: episode,
        image_type: 'EPISODE_LIST',
        image_id: localization[0].episode_list,
      });
    }
    if (localization[0]?.episode_list_1x1) {
      images.push({
        episode_id: episode,
        image_type: 'EPISODE_LIST_1x1',
        image_id: localization[0].episode_list_1x1,
      });
    }
    if (localization[0]?.episode_list_9x13) {
      images.push({
        episode_id: episode,
        image_type: 'EPISODE_LIST_9x13',
        image_id: localization[0].episode_list_9x13,
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
