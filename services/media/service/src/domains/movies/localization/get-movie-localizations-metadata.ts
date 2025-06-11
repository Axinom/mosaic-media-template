import { groupBy, isNullOrWhitespace } from '@axinom/mosaic-service-common';
import { MovieLocalization } from 'media-messages';
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
import { LOCALIZATION_MOVIE_TYPE } from './constants';

export interface GqlMovieLocalization extends GqlLocalization {
  title: string;
  description?: string | null;
  synopsis?: string | null;
  movie_cover?: string | null;
  movie_cover_1x1?: string | null;
  movie_cover_16x9?: string | null;
  movie_clean_cover?: string | null;
  movie_clean_cover_1x1?: string | null;
  movie_clean_cover_16x9?: string | null;
  movie_list?: string | null;
  movie_list_1x1?: string | null;
  movie_list_9x13?: string | null;
}

export const getMovieLocalizationsMetadata = async (
  config: Config,
  authToken: string,
  entityId: string,
): Promise<{
  result?: MovieLocalization[];
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
      await getLocalizationsMetadata<GqlMovieLocalization>(
        config,
        authToken,
        entityId,
        LOCALIZATION_MOVIE_TYPE,
      );

    const result = validateLocalizations<GqlMovieLocalization>(localizations)
      ?.map((l) => ({
        is_default_locale: l[LOCALIZATION_IS_DEFAULT_LOCALE],
        language_tag: l[LOCALIZATION_LANGUAGE_TAG],
        title: isNullOrWhitespace(l.title) ? null : l.title,
        description: isNullOrWhitespace(l.description) ? null : l.description,
        synopsis: isNullOrWhitespace(l.synopsis) ? null : l.synopsis,
        movie_cover: l.movie_cover,
        movie_cover_1x1: l.movie_cover_1x1,
        movie_cover_16x9: l.movie_cover_16x9,
        movie_clean_cover: l.movie_clean_cover,
        movie_clean_cover_1x1: l.movie_clean_cover_1x1,
        movie_clean_cover_16x9: l.movie_clean_cover_16x9,
        movie_list: l.movie_list,
        movie_list_1x1: l.movie_list_1x1,
        movie_list_9x13: l.movie_list_9x13,
      }))
      // If there are locales with no values set for any of its fields, we filter them out
      ?.filter(
        (loc) =>
          loc.is_default_locale ||
          Object.entries(loc)
            .filter(
              ([key]) => !['is_default_locale', 'language_tag'].includes(key),
            )
            .some(([_, value]) => value !== null && value !== undefined),
      );

    const validationResults = mapLocalizationValidationMessages(validation);
    return {
      result,
      validation: validationResults,
    };
  } catch (e) {
    throw getLocalizationMappedError(e);
  }
};

export const getLocalizedImagesMetadata = async (
  movieId: number,
  localizations: MovieLocalization[] | undefined,
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
    if (localization[0]?.movie_cover) {
      images.push({
        movie_id: movieId,
        image_type: 'MOVIE_COVER',
        image_id: localization[0].movie_cover,
      });
    }
    if (localization[0]?.movie_cover_1x1) {
      images.push({
        movie_id: movieId,
        image_type: 'MOVIE_COVER_1x1',
        image_id: localization[0].movie_cover_1x1,
      });
    }
    if (localization[0]?.movie_cover_16x9) {
      images.push({
        movie_id: movieId,
        image_type: 'MOVIE_COVER_16x9',
        image_id: localization[0].movie_cover_16x9,
      });
    }
    if (localization[0]?.movie_clean_cover) {
      images.push({
        movie_id: movieId,
        image_type: 'MOVIE_CLEAN_COVER',
        image_id: localization[0].movie_clean_cover,
      });
    }
    if (localization[0]?.movie_clean_cover_1x1) {
      images.push({
        movie_id: movieId,
        image_type: 'MOVIE_CLEAN_COVER_1x1',
        image_id: localization[0].movie_clean_cover_1x1,
      });
    }
    if (localization[0]?.movie_clean_cover_16x9) {
      images.push({
        movie_id: movieId,
        image_type: 'MOVIE_CLEAN_COVER_16x9',
        image_id: localization[0].movie_clean_cover_16x9,
      });
    }
    if (localization[0]?.movie_list) {
      images.push({
        movie_id: movieId,
        image_type: 'MOVIE_LIST',
        image_id: localization[0].movie_list,
      });
    }
    if (localization[0]?.movie_list_1x1) {
      images.push({
        movie_id: movieId,
        image_type: 'MOVIE_LIST_1x1',
        image_id: localization[0].movie_list_1x1,
      });
    }
    if (localization[0]?.movie_list_9x13) {
      images.push({
        movie_id: movieId,
        image_type: 'MOVIE_LIST_9x13',
        image_id: localization[0].movie_list_9x13,
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
