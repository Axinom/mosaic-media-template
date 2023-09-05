import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { Dict } from '@axinom/mosaic-service-common';
import { selectOne } from 'zapatos/db';
import { movies_images } from 'zapatos/schema';
import { Config } from '../../../common';
import {
  assertLocalizationColumn,
  assertLocalizationData,
  getUpsertMessageData,
  ReplicationOperationHandlers,
} from '../../common';
import { LOCALIZATION_MOVIE_TYPE } from './constants';

type LocalizableMovieImage = Pick<
  movies_images.JSONSelectable,
  'movie_id' | 'image_id' | 'image_type'
> & { [k: string]: unknown };

const assertMovieImage: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableMovieImage = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableMovieImage => {
  assertLocalizationData(data, 'movies_images');
  assertLocalizationColumn(data, 'movie_id', 'movies_images');
  assertLocalizationColumn(data, 'image_id', 'movies_images');
  assertLocalizationColumn(data, 'image_type', 'movies_images');
};

const movieIsDeleted = async (
  movieImage: LocalizableMovieImage,
  ownerPool: OwnerPgPool,
): Promise<boolean> => {
  const data = await selectOne(
    'movies',
    { id: movieImage.movie_id },
    { columns: ['id'] },
  ).run(ownerPool);
  return !data;
};

export const moviesImagesReplicationHandlers = (
  config: Config,
  ownerPool: OwnerPgPool,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_MOVIE_TYPE;
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertMovieImage(newData);
      if (newData.image_type !== 'COVER') {
        // Ignore any changes to non-cover image relations
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.movie_id,
        {}, // Localizable fields are never updated on image assignment
        undefined, // Title is never updated on image assignment
        newData.image_id,
      );
    },
    updateHandler: async (newData: Dict<unknown> | undefined) => {
      assertMovieImage(newData);
      if (newData.image_type !== 'COVER') {
        // Ignore any changes to non-cover image relations
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.movie_id,
        {}, // Localizable fields are never updated on image relation change
        undefined, // Title is never updated on image relation change
        newData.image_id,
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertMovieImage(oldData);
      if (
        oldData.image_type !== 'COVER' ||
        (await movieIsDeleted(oldData, ownerPool))
      ) {
        // Ignore any changes to non-cover image relations
        // If image relation is deleted as part of a cascade delete of movie - no need to upsert
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        oldData.movie_id,
        {}, // Localizable fields are never updated on image unassign
        undefined, // Title is never updated on image unassign
        null, // Explicit unassign of an image
      );
    },
  };
};
