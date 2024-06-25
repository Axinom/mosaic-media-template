import { PgClass, PgConstraint } from 'graphile-build-pg';
import { makeAddInflectorsPlugin } from 'postgraphile';

/**
 * Plugin that renames channel image mutations
 * The main use-case is to mutate based on the channel ID and the image type.
 * The default mutations are created based on the primary key - which is likely not used in the API too often.
 */
export const RenameImageMutationsPlugin = makeAddInflectorsPlugin(
  (inflectors) => {
    const { updateByKeys: oldUpdateByKeys, deleteByKeys: oldDeleteByKeys } =
      inflectors;
    return {
      updateByKeys(
        detailedKeys: string[],
        table: PgClass,
        constraint: PgConstraint,
      ) {
        if (table.name === 'channel_images') {
          if (constraint.type === 'p') {
            return 'updateChannelImageByIds';
          } else {
            return 'updateChannelImage';
          }
        }
        return oldUpdateByKeys.call(this, detailedKeys, table, constraint);
      },
      deleteByKeys(
        detailedKeys: string[],
        table: PgClass,
        constraint: PgConstraint,
      ) {
        if (table.name === 'channel_images') {
          if (constraint.type === 'p') {
            return 'deleteChannelImageByIds';
          } else {
            return 'deleteChannelImage';
          }
        }
        return oldDeleteByKeys.call(this, detailedKeys, table, constraint);
      },
    };
  },
  true,
);
