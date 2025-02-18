import { groupBy } from '@axinom/mosaic-service-common';
import { CollectionLocalization } from 'media-messages';
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
import { LOCALIZATION_COLLECTION_TYPE } from './constants';

export interface GqlCollectionLocalization extends GqlLocalization {
  title: string;
  description?: string | null;
  synopsis?: string | null;
  collection_cover_1x1?: string | null;
  collection_cover_4x1?: string | null;
  collection_clean_cover_1x1?: string | null;
  collection_clean_cover_4x1?: string | null;
  collection_list_1x1?: string | null;
  collection_list_15x16?: string | null;
}

export const getCollectionLocalizationsMetadata = async (
  config: Config,
  authToken: string,
  entityId: string,
): Promise<{
  result?: CollectionLocalization[];
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
      await getLocalizationsMetadata<GqlCollectionLocalization>(
        config,
        authToken,
        entityId,
        LOCALIZATION_COLLECTION_TYPE,
      );
    return {
      result: validateLocalizations<GqlCollectionLocalization>(localizations)
        ?.map((l) => ({
          is_default_locale: l[LOCALIZATION_IS_DEFAULT_LOCALE],
          language_tag: l[LOCALIZATION_LANGUAGE_TAG],
          title: l.title,
          description: l.description,
          synopsis: l.synopsis,
          collection_cover_1x1: l.collection_cover_1x1,
          collection_cover_4x1: l.collection_cover_4x1,
          collection_clean_cover_1x1: l.collection_clean_cover_1x1,
          collection_clean_cover_4x1: l.collection_clean_cover_4x1,
          collection_list_1x1: l.collection_list_1x1,
          collection_list_15x16: l.collection_list_15x16,
        }))
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

export const getLocalizedCollectionImagesMetadata = async (
  collectionId: number,
  localizations: CollectionLocalization[] | undefined,
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
    if (localization[0]?.collection_cover_1x1) {
      images.push({
        collection_id: collectionId,
        image_type: 'COLLECTION_COVER_1x1',
        image_id: localization[0].collection_cover_1x1,
      });
    }
    if (localization[0]?.collection_cover_4x1) {
      images.push({
        collection_id: collectionId,
        image_type: 'COLLECTION_COVER_4x1',
        image_id: localization[0].collection_cover_4x1,
      });
    }
    if (localization[0]?.collection_clean_cover_1x1) {
      images.push({
        collection_id: collectionId,
        image_type: 'COLLECTION_CLEAN_COVER_1x1',
        image_id: localization[0].collection_clean_cover_1x1,
      });
    }
    if (localization[0]?.collection_clean_cover_4x1) {
      images.push({
        collection_id: collectionId,
        image_type: 'COLLECTION_CLEAN_COVER_4x1',
        image_id: localization[0].collection_clean_cover_4x1,
      });
    }
    if (localization[0]?.collection_list_1x1) {
      images.push({
        collection_id: collectionId,
        image_type: 'COLLECTION_LIST_1x1',
        image_id: localization[0].collection_list_1x1,
      });
    }
    if (localization[0]?.collection_list_15x16) {
      images.push({
        collection_id: collectionId,
        image_type: 'COLLECTION_LIST_15x16',
        image_id: localization[0].collection_list_15x16,
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
