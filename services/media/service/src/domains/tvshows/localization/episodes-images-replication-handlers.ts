import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { Dict } from '@axinom/mosaic-service-common';
import { selectOne } from 'zapatos/db';
import { episodes_images } from 'zapatos/schema';
import { Config } from '../../../common';
import {
  assertLocalizationColumn,
  assertLocalizationData,
  getUpsertMessageData,
  ReplicationOperationHandlers,
} from '../../common';
import { LOCALIZATION_EPISODE_TYPE } from './constants';

type LocalizableEpisodeImage = Pick<
  episodes_images.JSONSelectable,
  'episode_id' | 'image_id' | 'image_type'
> & { [k: string]: unknown };

const assertEpisodeImage: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableEpisodeImage = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableEpisodeImage => {
  assertLocalizationData(data, 'episodes_images');
  assertLocalizationColumn(data, 'episode_id', 'episodes_images');
  assertLocalizationColumn(data, 'image_id', 'episodes_images');
  assertLocalizationColumn(data, 'image_type', 'episodes_images');
};

const episodeIsDeleted = async (
  episodeImage: LocalizableEpisodeImage,
  ownerPool: OwnerPgPool,
): Promise<boolean> => {
  const data = await selectOne(
    'episodes',
    { id: episodeImage.episode_id },
    { columns: ['id'] },
  ).run(ownerPool);
  return !data;
};

export const episodesImagesReplicationHandlers = (
  config: Config,
  ownerPool: OwnerPgPool,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_EPISODE_TYPE;
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertEpisodeImage(newData);
      if (newData.image_type !== 'COVER') {
        // Ignore any changes to non-cover image relations
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.episode_id,
        {}, // Localizable fields are never updated on image assignment
        undefined, // Title is never updated on image assignment
        newData.image_id,
      );
    },
    updateHandler: async (newData: Dict<unknown> | undefined) => {
      assertEpisodeImage(newData);
      if (newData.image_type !== 'COVER') {
        // Ignore any changes to non-cover image relations
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.episode_id,
        {}, // Localizable fields are never updated on image relation change
        undefined, // Title is never updated on image relation change
        newData.image_id,
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertEpisodeImage(oldData);
      if (
        oldData.image_type !== 'COVER' ||
        (await episodeIsDeleted(oldData, ownerPool))
      ) {
        // Ignore any changes to non-cover image relations
        // If image relation is deleted as part of a cascade delete of episode - no need to upsert
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        oldData.episode_id,
        {}, // Localizable fields are never updated on image unassign
        undefined, // Title is never updated on image unassign
        null, // Explicit unassign of an image
      );
    },
  };
};
