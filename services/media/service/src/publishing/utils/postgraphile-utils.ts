import { Build } from 'graphile-build';
import { PgClass, PgIntrospectionResultsByKind } from 'graphile-build-pg';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
} from 'media-messages';
import { Table } from 'zapatos/schema';
import { BulkOperationResult, BulkResolverBodyBuilder } from '../../graphql';
import { generateSnapshotJobId, PublishAction } from './publishing-common';

/**
 * Returns a GraphQL type corresponding to a table.
 * @param build - PG's Build object.
 * @param tableName - Table name.
 */
export function getTableGqlType(
  build: Build,
  tableName: Table,
): GraphQLObjectType {
  const table = findTable(build, tableName);

  if (table === undefined) {
    // This should never happen as tableName comes from zapatos.
    throw new Error(`Could not find table ${tableName}.`);
  }

  return build.pgGetGqlTypeByTypeIdAndModifier(table.type.id, null);
}

/**
 * Finds and returns a `PgClass` instance matching `tableName` from PG introspection results.
 * @param build - PG's Build object.
 * @param tableName - Table name.
 */
export function findTable(build: Build, tableName: Table): PgClass {
  const introspection: PgIntrospectionResultsByKind =
    build.pgIntrospectionResultsByKind;

  const table = introspection.class.find(
    (cls) => cls.name === tableName && cls.classKind === 'r',
  );

  if (table === undefined) {
    // This should never happen as tableName comes from zapatos.
    throw new Error(`Table ${tableName} does not exist.`);
  }

  return table;
}

export interface BulkPublishingResult extends BulkOperationResult {
  publishingJobId: string;
}

export const bulkPublishingPayload = new GraphQLObjectType({
  name: 'BulkPublishingPayload',
  description: 'Bulk mutation payload type.',
  fields: () => ({
    publishingJobId: {
      description:
        'Publish job ID that will be assigned to all snapshots created in this bulk operation.',
      type: GraphQLString,
    },
    affectedIds: {
      description: 'Array of affected item IDs',
      type: GraphQLList(GraphQLInt),
    },
    totalCount: {
      description: 'Total number of affected items.',
      type: GraphQLInt,
    },
  }),
});

export const bulkPublishingResolverBodyBuilder =
  (publishAction: PublishAction): BulkResolverBodyBuilder =>
  async (
    ids,
    filter,
    context,
    _input,
    token,
  ): Promise<BulkPublishingResult> => {
    const jobId = generateSnapshotJobId();

    for (const id of ids) {
      await context.messagingBroker.publish<PublishEntityCommand>(
        MediaServiceMessagingSettings.PublishEntity.messageType,
        {
          table_name: filter.tableName,
          entity_id: id as number,
          job_id: jobId,
          publish_options: {
            action: publishAction,
          },
        },
        { auth_token: token },
      );
    }

    return {
      publishingJobId: jobId,
      affectedIds: ids,
      totalCount: ids.length,
    };
  };

/**
 * Retrieves a snapshot to be returned as a GraphQL API response in a correct format.
 * Respects graphql properties selection and auto-generated values, e.g. nodeId.
 */
export const getSnapshotPgField = async (
  id: number,
  { pgSql }: Build,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  graphile: GraphileHelpers<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const [row] = await graphile.selectGraphQLResultFromTable(
    pgSql.fragment`app_public.snapshots`,
    (tableAlias, queryBuilder) => {
      queryBuilder.where(pgSql.fragment`${tableAlias}.id = ${pgSql.value(id)}`);
    },
  );
  return row;
};
