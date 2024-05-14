import { ClientBase } from 'pg';
import {
  LateralResult,
  parent,
  select,
  selectOne,
  SQLFragment,
} from 'zapatos/db';
import { channels, channel_images } from 'zapatos/schema';

export type ChannelPublishDto = channels.JSONSelectable &
  LateralResult<{
    images: SQLFragment<channel_images.JSONSelectable[], never>;
  }>;

/**
 * Collects the required properties from the database as a channel publish DTO
 * @param id - channel unique identifier.
 * @param queryable - database client, or pool.
 * @returns - object containing channel properties required for publication.
 */
export const aggregateChannelPublishDto = async (
  id: string,
  gqlClient: ClientBase,
): Promise<ChannelPublishDto | undefined> =>
  selectOne(
    'channels',
    { id },
    {
      lateral: {
        images: select('channel_images', {
          channel_id: parent('id'),
        }),
      },
    },
  ).run(gqlClient);
