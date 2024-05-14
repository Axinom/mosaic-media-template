import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { Build } from 'postgraphile';

/**
 * Get a playlist for the Postgraphile based response.
 * The GraphQL payload type must be marked with `@pgField` e.g.:
 * `playlist: Playlist! @pgField`
 * @param playlistId The ID of the playlist
 * @param build The Graphile build context
 * @param graphile The Graphile helpers object
 * @returns a database row of the found playlist
 */
export const getPlaylistPgField = async (
  playlistId: string,
  { pgSql }: Build,
  graphile: GraphileHelpers<unknown>,
): Promise<unknown> => {
  const [row] = await graphile.selectGraphQLResultFromTable(
    pgSql.fragment`app_public.playlists`,
    (tableAlias, queryBuilder) => {
      queryBuilder.where(
        pgSql.fragment`${tableAlias}.id = ${pgSql.value(playlistId)}`,
      );
    },
  );
  return row;
};
