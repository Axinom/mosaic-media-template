import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { Dict, isEmptyObject } from '@axinom/mosaic-service-common';
import { selectOne } from 'zapatos/db';
import { seasons } from 'zapatos/schema';
import { Config } from '../../../common';
import {
  assertLocalizationColumn,
  assertLocalizationData,
  buildDisplayTitle,
  getChangedFields,
  getDeleteMessageData,
  getInsertedFields,
  getUpsertMessageData,
  ReplicationOperationHandlers,
} from '../../common';
import { LOCALIZATION_SEASON_TYPE } from './constants';
import { SeasonFieldDefinitions } from './get-tvshow-localization-entity-definitions';

type LocalizableSeason = Pick<
  seasons.JSONSelectable,
  'id' | 'index' | 'tvshow_id'
> & {
  [k: string]: unknown;
};

const assertSeason: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableSeason = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableSeason => {
  assertLocalizationData(data, 'seasons');
  assertLocalizationColumn(data, 'id', 'seasons');
  assertLocalizationColumn(data, 'index', 'seasons');
};

const getEntityTitle = async (
  season: LocalizableSeason,
  ownerPool: OwnerPgPool,
): Promise<string> => {
  const tvshow = season.tvshow_id
    ? await selectOne(
        'tvshows',
        { id: season.tvshow_id },
        { columns: ['title'] },
      ).run(ownerPool)
    : undefined;
  return buildDisplayTitle('SEASON', season, tvshow);
};

export const seasonsReplicationHandlers = (
  config: Config,
  ownerPool: OwnerPgPool,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_SEASON_TYPE;
  const fieldDefinitions = SeasonFieldDefinitions.filter((d) => !d.is_archived);
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertSeason(newData);

      const fields = getInsertedFields(newData, fieldDefinitions);

      const entityTitle = await getEntityTitle(newData, ownerPool);
      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.id,
        fields,
        entityTitle,
        undefined, // Image is updated through seasons_images changes
      );
    },
    updateHandler: async (
      newData: Dict<unknown> | undefined,
      oldData: Dict<unknown> | undefined,
    ) => {
      assertSeason(newData);
      assertSeason(oldData);

      const fields = getChangedFields(newData, oldData, fieldDefinitions);
      if (isEmptyObject(fields) && newData.tvshow_id === oldData.tvshow_id) {
        return undefined; // Do not send a message if no localizable fields have changed and parent tvshow remains the same
      }

      const entityTitle = await getEntityTitle(newData, ownerPool);
      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.id,
        fields,
        entityTitle,
        undefined, // Image is updated through season_images change
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertSeason(oldData);
      return getDeleteMessageData(config.serviceId, entityType, oldData.id);
    },
  };
};
