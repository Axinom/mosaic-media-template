import { Dict, isEmptyObject } from '@axinom/mosaic-service-common';
import { movies } from 'zapatos/schema';
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
import { LOCALIZATION_MOVIE_TYPE } from './constants';
import { MovieFieldDefinitions } from './get-movie-localization-entity-definitions';

type LocalizableMovie = Pick<movies.JSONSelectable, 'id' | 'title'> & {
  [k: string]: unknown;
};

const assertMovie: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableMovie = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableMovie => {
  assertLocalizationData(data, 'movies');
  assertLocalizationColumn(data, 'id', 'movies');
  assertLocalizationColumn(data, 'title', 'movies');
};

export const moviesReplicationHandlers = (
  config: Config,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_MOVIE_TYPE;
  const fieldDefinitions = MovieFieldDefinitions.filter((d) => !d.is_archived);
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertMovie(newData);

      const fields = getInsertedFields(newData, fieldDefinitions);

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.id,
        fields,
        newData.title,
        undefined, // Image is updated through movies_images changes
      );
    },
    updateHandler: async (
      newData: Dict<unknown> | undefined,
      oldData: Dict<unknown> | undefined,
    ) => {
      assertMovie(newData);
      assertMovie(oldData);

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
        undefined, // Image is updated through movie_images change
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertMovie(oldData);
      return getDeleteMessageData(config.serviceId, entityType, oldData.id);
    },
  };
};
