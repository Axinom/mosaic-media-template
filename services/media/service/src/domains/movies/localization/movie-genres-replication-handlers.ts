import { Dict, isEmptyObject } from '@axinom/mosaic-service-common';
import { movie_genres } from 'zapatos/schema';
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
import { LOCALIZATION_MOVIE_GENRE_TYPE } from './constants';
import { MovieGenreFieldDefinitions } from './get-movie-localization-entity-definitions';

type LocalizableMovieGenre = Pick<
  movie_genres.JSONSelectable,
  'id' | 'title'
> & { [k: string]: unknown };

const assertMovieGenre: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableMovieGenre = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableMovieGenre => {
  assertLocalizationData(data, 'movie_genres');
  assertLocalizationColumn(data, 'id', 'movie_genres');
  assertLocalizationColumn(data, 'title', 'movie_genres');
};

export const movieGenresReplicationHandlers = (
  config: Config,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_MOVIE_GENRE_TYPE;
  const fieldDefinitions = MovieGenreFieldDefinitions.filter(
    (d) => !d.is_archived,
  );
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertMovieGenre(newData);

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
      assertMovieGenre(newData);
      assertMovieGenre(oldData);

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
      assertMovieGenre(oldData);
      return getDeleteMessageData(config.serviceId, entityType, oldData.id);
    },
  };
};
