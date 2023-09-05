import { Dict, isEmptyObject } from '@axinom/mosaic-service-common';
import { tvshows } from 'zapatos/schema';
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
import { LOCALIZATION_TVSHOW_TYPE } from './constants';
import { TvshowFieldDefinitions } from './get-tvshow-localization-entity-definitions';

type LocalizableTvshow = Pick<tvshows.JSONSelectable, 'id' | 'title'> & {
  [k: string]: unknown;
};

const assertTvshow: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableTvshow = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableTvshow => {
  assertLocalizationData(data, 'tvshows');
  assertLocalizationColumn(data, 'id', 'tvshows');
  assertLocalizationColumn(data, 'title', 'tvshows');
};

export const tvshowsReplicationHandlers = (
  config: Config,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_TVSHOW_TYPE;
  const fieldDefinitions = TvshowFieldDefinitions.filter((d) => !d.is_archived);
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertTvshow(newData);

      const fields = getInsertedFields(newData, fieldDefinitions);

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.id,
        fields,
        newData.title,
        undefined, // Image is updated through tvshows_images changes
      );
    },
    updateHandler: async (
      newData: Dict<unknown> | undefined,
      oldData: Dict<unknown> | undefined,
    ) => {
      assertTvshow(newData);
      assertTvshow(oldData);

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
        undefined, // Image is updated through tvshow_images change
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertTvshow(oldData);
      return getDeleteMessageData(config.serviceId, entityType, oldData.id);
    },
  };
};
