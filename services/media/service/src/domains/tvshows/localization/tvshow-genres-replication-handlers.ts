import { Dict, isEmptyObject } from '@axinom/mosaic-service-common';
import { tvshow_genres } from 'zapatos/schema';
import { Config } from '../../../common';
import {
  assertLocalizationColumn,
  assertLocalizationData,
  getChangedFields,
  getDeleteMessageData,
  getInsertedFields,
  getUpsertMessageData,
  ReplicationOperationHandlers,
} from '../../common';
import { LOCALIZATION_TVSHOW_GENRE_TYPE } from './constants';
import { TvshowGenreFieldDefinitions } from './get-tvshow-localization-entity-definitions';

type LocalizableTvshowGenre = Pick<
  tvshow_genres.JSONSelectable,
  'id' | 'title'
> & { [k: string]: unknown };

const assertTvshowGenre: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableTvshowGenre = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableTvshowGenre => {
  assertLocalizationData(data, 'tvshow_genres');
  assertLocalizationColumn(data, 'id', 'tvshow_genres');
  assertLocalizationColumn(data, 'title', 'tvshow_genres');
};

export const tvshowGenresReplicationHandlers = (
  config: Config,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_TVSHOW_GENRE_TYPE;
  const fieldDefinitions = TvshowGenreFieldDefinitions.filter(
    (d) => !d.is_archived,
  );
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertTvshowGenre(newData);

      const fields = getInsertedFields(newData, fieldDefinitions);

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.id,
        fields,
        newData.title,
        undefined, // Genres have no image relations
      );
    },
    updateHandler: async (
      newData: Dict<unknown> | undefined,
      oldData: Dict<unknown> | undefined,
    ) => {
      assertTvshowGenre(newData);
      assertTvshowGenre(oldData);

      const fields = getChangedFields(newData, oldData, fieldDefinitions);
      if (isEmptyObject(fields)) {
        return undefined; // Do not send a message if no localizable fields have changed
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.id,
        fields,
        newData.title,
        undefined, // Genres have no image relations
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertTvshowGenre(oldData);
      return getDeleteMessageData(config.serviceId, entityType, oldData.id);
    },
  };
};
