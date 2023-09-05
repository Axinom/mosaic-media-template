import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { Dict } from '@axinom/mosaic-service-common';
import { selectOne } from 'zapatos/db';
import { tvshows_images } from 'zapatos/schema';
import { Config } from '../../../common';
import {
  assertLocalizationColumn,
  assertLocalizationData,
  getUpsertMessageData,
  ReplicationOperationHandlers,
} from '../../common';
import { LOCALIZATION_TVSHOW_TYPE } from './constants';

type LocalizableTvshowImage = Pick<
  tvshows_images.JSONSelectable,
  'tvshow_id' | 'image_id' | 'image_type'
> & { [k: string]: unknown };

const assertTvshowImage: (
  data: Dict<unknown> | undefined,
) => asserts data is LocalizableTvshowImage = (
  data: Dict<unknown> | undefined,
): asserts data is LocalizableTvshowImage => {
  assertLocalizationData(data, 'tvshows_images');
  assertLocalizationColumn(data, 'tvshow_id', 'tvshows_images');
  assertLocalizationColumn(data, 'image_id', 'tvshows_images');
  assertLocalizationColumn(data, 'image_type', 'tvshows_images');
};

const tvshowIsDeleted = async (
  tvshowImage: LocalizableTvshowImage,
  ownerPool: OwnerPgPool,
): Promise<boolean> => {
  const data = await selectOne(
    'tvshows',
    { id: tvshowImage.tvshow_id },
    { columns: ['id'] },
  ).run(ownerPool);
  return !data;
};

export const tvshowsImagesReplicationHandlers = (
  config: Config,
  ownerPool: OwnerPgPool,
): ReplicationOperationHandlers => {
  const entityType = LOCALIZATION_TVSHOW_TYPE;
  return {
    insertHandler: async (newData: Dict<unknown> | undefined) => {
      assertTvshowImage(newData);
      if (newData.image_type !== 'COVER') {
        // Ignore any changes to non-cover image relations
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.tvshow_id,
        {}, // Localizable fields are never updated on image assignment
        undefined, // Title is never updated on image assignment
        newData.image_id,
      );
    },
    updateHandler: async (newData: Dict<unknown> | undefined) => {
      assertTvshowImage(newData);
      if (newData.image_type !== 'COVER') {
        // Ignore any changes to non-cover image relations
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        newData.tvshow_id,
        {}, // Localizable fields are never updated on image relation change
        undefined, // Title is never updated on image relation change
        newData.image_id,
      );
    },
    deleteHandler: async (oldData: Dict<unknown> | undefined) => {
      assertTvshowImage(oldData);
      if (
        oldData.image_type !== 'COVER' ||
        (await tvshowIsDeleted(oldData, ownerPool))
      ) {
        // Ignore any changes to non-cover image relations
        // If image relation is deleted as part of a cascade delete of tvshow - no need to upsert
        return undefined;
      }

      return getUpsertMessageData(
        config.serviceId,
        entityType,
        oldData.tvshow_id,
        {}, // Localizable fields are never updated on image unassign
        undefined, // Title is never updated on image unassign
        null, // Explicit unassign of an image
      );
    },
  };
};
