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
  messageContext?: unknown,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_MOVIE_TYPE;
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertMovie(newData);

      const fields = getInsertedFields(newData, MovieFieldDefinitions);

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

      const fields = getChangedFields(newData, oldData, MovieFieldDefinitions);
      if (isEmptyObject(fields) && !messageContext) {
        return undefined;
      }

      // Message is send if at least one field is updated or if update happened
      // in context of ingest.
      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.id,
        fields,
        newData.title,
        undefined, // Image is updated through movie_images change
        messageContext,
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertMovie(oldData);
      return getDeleteMessageData(config.serviceId, entityType, oldData.id);
    },
  };
};
