import { Dict, isEmptyObject } from '@axinom/mosaic-service-common';
import { collections } from 'zapatos/schema';
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
import { LOCALIZATION_COLLECTION_TYPE } from './constants';
import { CollectionFieldDefinitions } from './get-collection-localization-entity-definitions';

type LocalizableCollection = Pick<
  collections.JSONSelectable,
  'id' | 'title'
> & {
  [k: string]: unknown;
};

const assertCollection: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableCollection = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableCollection => {
  assertLocalizationData(data, 'collections');
  assertLocalizationColumn(data, 'id', 'collections');
  assertLocalizationColumn(data, 'title', 'collections');
};

export const collectionsReplicationHandlers = (
  config: Config,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_COLLECTION_TYPE;
  const fieldDefinitions = CollectionFieldDefinitions.filter(
    (d) => !d.is_archived,
  );
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertCollection(newData);

      const fields = getInsertedFields(newData, fieldDefinitions);

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.id,
        fields,
        newData.title,
        undefined, // Image is updated through collections_images changes
      );
    },
    updateHandler: async (
      newData: Dict<unknown> | undefined,
      oldData: Dict<unknown> | undefined,
    ) => {
      assertCollection(newData);
      assertCollection(oldData);

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
        undefined, // Image is updated through collection_images change
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertCollection(oldData);
      return getDeleteMessageData(config.serviceId, entityType, oldData.id);
    },
  };
};
