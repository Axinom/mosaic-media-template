import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { Dict } from '@axinom/mosaic-service-common';
import { selectOne } from 'zapatos/db';
import { seasons_images } from 'zapatos/schema';
import { Config } from '../../../common';
import {
  assertLocalizationColumn,
  assertLocalizationData,
  getUpsertMessageData,
  ReplicationOperationHandlers,
} from '../../common';
import { LOCALIZATION_SEASON_TYPE } from './constants';

type LocalizableSeasonImage = Pick<
  seasons_images.JSONSelectable,
  'season_id' | 'image_id' | 'image_type'
> & { [k: string]: unknown };

const assertSeasonImage: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableSeasonImage = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableSeasonImage => {
  assertLocalizationData(data, 'seasons_images');
  assertLocalizationColumn(data, 'season_id', 'seasons_images');
  assertLocalizationColumn(data, 'image_id', 'seasons_images');
  assertLocalizationColumn(data, 'image_type', 'seasons_images');
};

const seasonIsDeleted = async (
  seasonImage: LocalizableSeasonImage,
  ownerPool: OwnerPgPool,
): Promise<boolean> => {
  const data = await selectOne(
    'seasons',
    { id: seasonImage.season_id },
    { columns: ['id'] },
  ).run(ownerPool);
  return !data;
};

export const seasonsImagesReplicationHandlers = (
  config: Config,
  ownerPool: OwnerPgPool,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_SEASON_TYPE;
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertSeasonImage(newData);
      if (newData.image_type !== 'COVER') {
        // Ignore any changes to non-cover image relations
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.season_id,
        {}, // Localizable fields are never updated on image assignment
        undefined, // Title is never updated on image assignment
        newData.image_id,
      );
    },
    updateHandler: async (newData: Dict<unknown> | undefined) => {
      assertSeasonImage(newData);
      if (newData.image_type !== 'COVER') {
        // Ignore any changes to non-cover image relations
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.season_id,
        {}, // Localizable fields are never updated on image relation change
        undefined, // Title is never updated on image relation change
        newData.image_id,
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertSeasonImage(oldData);
      if (
        oldData.image_type !== 'COVER' ||
        (await seasonIsDeleted(oldData, ownerPool))
      ) {
        // Ignore any changes to non-cover image relations
        // If image relation is deleted as part of a cascade delete of season - no need to upsert
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        oldData.season_id,
        {}, // Localizable fields are never updated on image unassign
        undefined, // Title is never updated on image unassign
        null, // Explicit unassign of an image
      );
    },
  };
};
