import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { Build } from 'postgraphile';

/**
 * Get a channel for the Postgraphile based response.
 * The GraphQL payload type must be marked with `@pgField` e.g.:
 * `channel: Channel! @pgField`
 * @param channelId The ID of the channel
 * @param build The Graphile build context
 * @param graphile The Graphile helpers object
 * @returns a database row of the found channel
 */
export const getChannelPgField = async (
  channelId: string,
  { pgSql }: Build,
  graphile: GraphileHelpers<unknown>,
): Promise<unknown> => {
  const [row] = await graphile.selectGraphQLResultFromTable(
    pgSql.fragment`app_public.channels`,
    (tableAlias, queryBuilder) => {
      queryBuilder.where(
        pgSql.fragment`${tableAlias}.id = ${pgSql.value(channelId)}`,
      );
    },
  );
  return row;
};
