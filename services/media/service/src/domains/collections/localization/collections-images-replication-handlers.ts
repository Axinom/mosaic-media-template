import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { Dict } from '@axinom/mosaic-service-common';
import { selectOne } from 'zapatos/db';
import { collections_images } from 'zapatos/schema';
import { Config } from '../../../common';
import {
  assertLocalizationColumn,
  assertLocalizationData,
  getUpsertMessageData,
  ReplicationOperationHandlers,
} from '../../common';
import { LOCALIZATION_COLLECTION_TYPE } from './constants';

type LocalizableCollectionImage = Pick<
  collections_images.JSONSelectable,
  'collection_id' | 'image_id' | 'image_type'
> & { [k: string]: unknown };

const assertCollectionImage: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableCollectionImage = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableCollectionImage => {
  assertLocalizationData(data, 'collections_images');
  assertLocalizationColumn(data, 'collection_id', 'collections_images');
  assertLocalizationColumn(data, 'image_id', 'collections_images');
  assertLocalizationColumn(data, 'image_type', 'collections_images');
};

const collectionIsDeleted = async (
  collectionImage: LocalizableCollectionImage,
  ownerPool: OwnerPgPool,
): Promise<boolean> => {
  const data = await selectOne(
    'collections',
    { id: collectionImage.collection_id },
    { columns: ['id'] },
  ).run(ownerPool);
  return !data;
};

export const collectionsImagesReplicationHandlers = (
  config: Config,
  ownerPool: OwnerPgPool,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_COLLECTION_TYPE;
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertCollectionImage(newData);
      if (newData.image_type !== 'COVER') {
        // Ignore any changes to non-cover image relations
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.collection_id,
        {}, // Localizable fields are never updated on image assignment
        undefined, // Title is never updated on image assignment
        newData.image_id,
      );
    },
    updateHandler: async (newData: Dict<unknown> | undefined) => {
      assertCollectionImage(newData);
      if (newData.image_type !== 'COVER') {
        // Ignore any changes to non-cover image relations
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.collection_id,
        {}, // Localizable fields are never updated on image relation change
        undefined, // Title is never updated on image relation change
        newData.image_id,
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertCollectionImage(oldData);
      if (
        oldData.image_type !== 'COVER' ||
        (await collectionIsDeleted(oldData, ownerPool))
      ) {
        // Ignore any changes to non-cover image relations
        // If image relation is deleted as part of a cascade delete of collection - no need to upsert
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        oldData.collection_id,
        {}, // Localizable fields are never updated on image unassign
        undefined, // Title is never updated on image unassign
        null, // Explicit unassign of an image
      );
    },
  };
};
