import { EpisodeLocalization } from 'media-messages';
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
  mapLocalizationValidationMessages,
  validateLocalizations,
} from '../../common';
import { LOCALIZATION_EPISODE_TYPE } from './constants';

export interface GqlEpisodeLocalization extends GqlLocalization {
  title: string;
  description?: string | null;
  synopsis?: string | null;
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
      result: validateLocalizations<GqlEpisodeLocalization>(localizations)?.map(
        (l) => ({
          is_default_locale: l[LOCALIZATION_IS_DEFAULT_LOCALE],
          language_tag: l[LOCALIZATION_LANGUAGE_TAG],
          title: l.title,
          description: l.description,
          synopsis: l.synopsis,
        }),
      ),
      validation: mapLocalizationValidationMessages(validation),
    };
  } catch (e) {
    throw getLocalizationMappedError(e);
  }
};
