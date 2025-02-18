import { groupBy } from '@axinom/mosaic-service-common';
import { TvshowLocalization } from 'media-messages';
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
import { LOCALIZATION_TVSHOW_TYPE } from './constants';

export interface GqlTvshowLocalization extends GqlLocalization {
  title: string;
  description?: string | null;
  synopsis?: string | null;
  tvshow_cover_1x1?: string | null;
  tvshow_cover_16x9?: string | null;
  tvshow_clean_cover_1x1?: string | null;
  tvshow_clean_cover_16x9?: string | null;
  tvshow_list_1x1?: string | null;
  tvshow_list_9x13?: string | null;
}

export const getTvshowLocalizationsMetadata = async (
  config: Config,
  authToken: string,
  entityId: string,
): Promise<{
  result?: TvshowLocalization[];
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
      await getLocalizationsMetadata<GqlTvshowLocalization>(
        config,
        authToken,
        entityId,
        LOCALIZATION_TVSHOW_TYPE,
      );
    return {
      result: validateLocalizations<GqlTvshowLocalization>(localizations)
        ?.map((l) => ({
          is_default_locale: l[LOCALIZATION_IS_DEFAULT_LOCALE],
          language_tag: l[LOCALIZATION_LANGUAGE_TAG],
          title: l.title,
          description: l.description,
          synopsis: l.synopsis,
          tvshow_cover_1x1: l.tvshow_cover_1x1,
          tvshow_cover_16x9: l.tvshow_cover_16x9,
          tvshow_clean_cover_1x1: l.tvshow_clean_cover_1x1,
          tvshow_clean_cover_16x9: l.tvshow_clean_cover_16x9,
          tvshow_list_1x1: l.tvshow_list_1x1,
          tvshow_list_9x13: l.tvshow_list_9x13,
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

export const getTvShowLocalizedImagesMetadata = async (
  tvshowId: number,
  localizations: TvshowLocalization[] | undefined,
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
    if (localization[0]?.tvshow_cover_1x1) {
      images.push({
        tvshow_id: tvshowId,
        image_type: 'TVSHOW_COVER_1x1',
        image_id: localization[0].tvshow_cover_1x1,
      });
    }
    if (localization[0]?.tvshow_cover_16x9) {
      images.push({
        tvshow_id: tvshowId,
        image_type: 'TVSHOW_COVER_16x9',
        image_id: localization[0].tvshow_cover_16x9,
      });
    }
    if (localization[0]?.tvshow_clean_cover_1x1) {
      images.push({
        tvshow_id: tvshowId,
        image_type: 'TVSHOW_CLEAN_COVER_1x1',
        image_id: localization[0].tvshow_clean_cover_1x1,
      });
    }
    if (localization[0]?.tvshow_clean_cover_16x9) {
      images.push({
        tvshow_id: tvshowId,
        image_type: 'TVSHOW_CLEAN_COVER_16x9',
        image_id: localization[0].tvshow_clean_cover_16x9,
      });
    }
    if (localization[0]?.tvshow_list_1x1) {
      images.push({
        tvshow_id: tvshowId,
        image_type: 'TVSHOW_LIST_1x1',
        image_id: localization[0].tvshow_list_1x1,
      });
    }
    if (localization[0]?.tvshow_list_9x13) {
      images.push({
        tvshow_id: tvshowId,
        image_type: 'TVSHOW_LIST_9x13',
        image_id: localization[0].tvshow_list_9x13,
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
