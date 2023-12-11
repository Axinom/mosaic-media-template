import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { Dict, isEmptyObject } from '@axinom/mosaic-service-common';
import { parent, selectOne } from 'zapatos/db';
import { episodes } from 'zapatos/schema';
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
import { LOCALIZATION_EPISODE_TYPE } from './constants';
import { EpisodeFieldDefinitions } from './get-tvshow-localization-entity-definitions';

type LocalizableEpisode = Pick<
  episodes.JSONSelectable,
  'id' | 'title' | 'index' | 'season_id'
> & {
  [k: string]: unknown;
};

const assertEpisode: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableEpisode = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableEpisode => {
  assertLocalizationData(data, 'episodes');
  assertLocalizationColumn(data, 'id', 'episodes');
  assertLocalizationColumn(data, 'title', 'episodes');
  assertLocalizationColumn(data, 'index', 'episodes');
};

const getEntityTitle = async (
  episode: LocalizableEpisode,
  ownerPool: OwnerPgPool,
): Promise<string> => {
  const season = episode.season_id
    ? await selectOne(
        'seasons',
        { id: episode.season_id },
        {
          columns: ['tvshow_id', 'index'],
          lateral: {
            tvshow: selectOne(
              'tvshows',
              { id: parent('tvshow_id') },
              { columns: ['title'] },
            ),
          },
        },
      ).run(ownerPool)
    : undefined;
  return buildDisplayTitle('EPISODE', episode, season, season?.tvshow);
};

export const episodesReplicationHandlers = (
  config: Config,
  ownerPool: OwnerPgPool,
  messageContext?: unknown,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_EPISODE_TYPE;
  const fieldDefinitions = EpisodeFieldDefinitions.filter(
    (d) => !d.is_archived,
  );
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertEpisode(newData);

      const fields = getInsertedFields(newData, fieldDefinitions);

      const entityTitle = await getEntityTitle(newData, ownerPool);
      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.id,
        fields,
        entityTitle,
        undefined, // Image is updated through episodes_images changes
      );
    },
    updateHandler: async (
      newData: Dict<unknown> | undefined,
      oldData: Dict<unknown> | undefined,
    ) => {
      assertEpisode(newData);
      assertEpisode(oldData);

      const fields = getChangedFields(newData, oldData, fieldDefinitions);
      if (
        isEmptyObject(fields) &&
        newData.season_id === oldData.season_id &&
        !messageContext
      ) {
        return undefined;
      }

      // Message is send if at least one field is updated, or if parent season has
      // changed, or if update happened in context of ingest.
      const entityTitle = await getEntityTitle(newData, ownerPool);
      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.id,
        fields,
        entityTitle,
        undefined, // Image is updated through episode_images change
        messageContext,
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertEpisode(oldData);
      return getDeleteMessageData(config.serviceId, entityType, oldData.id);
    },
  };
};
