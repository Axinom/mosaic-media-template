import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { assertDictionary } from '@axinom/mosaic-service-common';
import {
  camelCase,
  Plugin,
  pluralize,
  singularize,
  upperCamelCase,
} from 'graphile-build';
import { PgClass } from 'graphile-build-pg';
import { gql as gqlExtended } from 'graphile-utils';
import {
  execute,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLSchema,
} from 'graphql';
import { Table } from 'zapatos/schema';
import { getLongLivedToken } from '../../common';
import { getPkName } from '../postgraphile-utils';
import {
  ExtendedGraphQLContext,
  getValidatedExtendedContext,
} from './extended-graphql-context';

/**
 * Additional metadata about a GraphQL filter type used in a bulk action.
 */
export interface BulkFilter {
  /** Name of the table where the items are fetched. */
  tableName: string;

  /** Name of the primary key field in the data table */
  primaryKeyName: string;

  /** GraphQL filter type for filtered connections that we'll use to bulk select items. */
  filterType: GraphQLInputObjectType;

  /** Name of the query the filter type is from (originally). */
  queryName: string;

  /** Name of the GraphQL type that represents the entity in the data table. */
  entityTypeName: string;
}

/**
 * Configuration settings for the bulk mutation plugin.
 */
export interface BulkMutationSettings {
  /** Function to build the mutation name. */
  mutationNameBuilder: (filter: BulkFilter) => string;

  /** Return type for the bulk mutation  */
  outType: GraphQLObjectType;
  /** Function that will build the resolver body that will implement the actual "bulk action"  */
  resolverBodyBuilder: BulkResolverBodyBuilder;
  /** Optional additional input field definition for the bulk mutation. */
  additionalInputType?: GraphQLInputObjectType;
}

/**
 * Function builder for implementing the bulk action mutation resolver.
 */
export interface BulkResolverBodyBuilder {
  /**
   * @param ids - IDs of entities to process.
   * @param filter - Data about the filter used to create the bulk mutation.
   * @param context - PostGraphile Context object.
   * @param input - Input args to the resolver function.
   * @param token - Authentication token extracted from the incoming request.
   */
  (
    ids: number[] | string[],
    filter: BulkFilter,
    context: ExtendedGraphQLContext,
    input: { [argName: string]: unknown },
    token: string,
  ): Promise<BulkOperationResult>;
}

/**
 * Get all the database IDs from the entities that were selected via the GraphQL filter
 */
const getEntityIds = async (
  filter: BulkFilter,
  args: { [argName: string]: unknown },
  context: unknown,
  schema: GraphQLSchema,
): Promise<number[] | string[]> => {
  if (filter.queryName === undefined) {
    throw new Error(
      `No query found for the filter of type '${filter.filterType}'.`,
    );
  }
  const queryResult = await execute(
    schema,
    // the apollo-vscode extension will not parse 'dynamic' GQL Type names as used here, so disabling syntax parsing using gqlExtended
    gqlExtended`
      query getEntityIds($filter: ${filter.filterType.name}) {
        entities: ${filter.queryName}(filter: $filter) {
          nodes {
            ${filter.primaryKeyName}
          }
        }
      }
    `,
    undefined,
    context,
    args,
  );

  return queryResult?.data?.entities?.nodes.map((entity: unknown) => {
    assertDictionary(entity);
    return entity[filter.primaryKeyName];
  });
};

/**
 * Default bulk action response type.
 */
const defaultBulkActionOutType = new GraphQLObjectType({
  name: 'BulkMutationPayload',
  description: 'Bulk mutation payload type.',
  fields: () => ({
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

/**
 * Base response type for all bulk action resolvers.
 */
export interface BulkOperationResult {
  /** Array of affected item IDs. */
  affectedIds: number[] | string[];
  /** Total number of affected items. */
  totalCount: number;
}

/**
 * Default resolver body.
 * @param messagingSettings - Message type name (MessagingSettings) .
 */
const defaultResolverBodyBuilder =
  (messagingSettings: MessagingSettings): BulkResolverBodyBuilder =>
  async (ids, filter, context, input, token) => {
    const { storeInboxMessage, pgClient } =
      getValidatedExtendedContext(context);

    if (ids.length > 0) {
      const { input: additionalInput } = input;

      for (const id of ids) {
        await storeInboxMessage(
          id.toString(),
          messagingSettings,
          {
            entity_id: id,
            entity_type: filter.entityTypeName,
            primary_key_name: filter.primaryKeyName,
            table_name: filter.tableName,
            input: additionalInput,
          },
          pgClient,
          { metadata: { authToken: token } },
        );
      }
    }
    return {
      affectedIds: ids,
      totalCount: ids.length,
    };
  };

/**
 * Utility type to make all properties required but keep some optional.
 */
type SomeOptional<T, K extends keyof T> = Required<Omit<T, K>> & Partial<T>;

/**
 * Creates a valid settings object for the plugin.
 * @param settings - Input settings
 * @param messagingSettings - Published message type name. Required only if settings.resolverBodyBuilder is not specified (default resolver body builder).
 */
export const buildBulkActionSettings = (
  settings: SomeOptional<
    BulkMutationSettings,
    'additionalInputType' | 'outType' | 'resolverBodyBuilder'
  >,
  messagingSettings?: MessagingSettings,
): BulkMutationSettings => {
  if (
    settings.resolverBodyBuilder === undefined &&
    messagingSettings === undefined
  ) {
    throw new Error(
      'messagingSettings are required if no settings.resolverBodyBuilder is specified.',
    );
  }
  return {
    mutationNameBuilder: settings.mutationNameBuilder,
    additionalInputType: settings.additionalInputType,
    outType: settings.outType ?? defaultBulkActionOutType,
    resolverBodyBuilder:
      settings.resolverBodyBuilder ??
      defaultResolverBodyBuilder(messagingSettings as MessagingSettings),
  };
};

/**
 * Plugin factory to add bulk mutations based on entity *all* queries and query filters.
 * @param tableNames - Array of table names (entities) to which we should add the bulk mutation.
 * @param settings - Plugin configuration.
 */
export const BulkMutationPluginFactory = (
  tableNames: Table[],
  settings: BulkMutationSettings,
): Plugin => {
  const matchingBulkFilters: { [key: string]: BulkFilter } = {};

  return async (builder) => {
    // Register input and output types.
    builder.hook('build', (build) => {
      if (
        settings.additionalInputType !== undefined &&
        build.getTypeByName(settings.additionalInputType.name) === undefined
      ) {
        build.addType(settings.additionalInputType);
      }

      if (build.getTypeByName(settings.outType.name) === undefined) {
        build.addType(settings.outType);
      }

      return build;
    });

    // Add the bulk mutations based on what the plugin needs.
    builder.hook('GraphQLObjectType:fields', (fields, build, context) => {
      // Root query is called first - extract filter input type info from matching queries.
      if (context.scope.isRootQuery) {
        const queriesWithFilters = tableNames.map((t) =>
          camelCase(pluralize(t)),
        );

        // Only keep the "all" queries that have filters and match the tables we specified
        const matchingQueries = Object.keys(fields)
          .filter((k) => queriesWithFilters.includes(k))
          .reduce((obj, key) => {
            obj[key] = fields[key];
            return obj;
          }, {} as GraphQLFieldConfigMap<never, never>);

        for (const queryName in matchingQueries) {
          const queryField = fields[queryName];
          const filterType = queryField?.args?.filter
            ?.type as GraphQLInputObjectType; // We can assume that filters are GraphQLInputObjectType
          const entityType = build.getTypeByName(
            upperCamelCase(singularize(queryName)),
          );
          const table: PgClass =
            build.scopeByType.get(entityType).pgIntrospection;

          matchingBulkFilters[filterType.name] = {
            tableName: table.name,
            primaryKeyName: getPkName(table),
            entityTypeName: (entityType as GraphQLObjectType).name,
            filterType: filterType,
            queryName: queryName,
          };
        }
      }

      // Root mutation is called after root query - actually add mutations
      if (context.scope.isRootMutation) {
        for (const filterName in matchingBulkFilters) {
          const filter = matchingBulkFilters[filterName];

          const args: GraphQLFieldConfigArgumentMap = {
            filter: {
              description: 'Filter for bulk selecting items.',
              type: filter.filterType,
            },
            ...(settings.additionalInputType !== undefined && {
              input: {
                description: 'Additional input arguments to bulk mutation.',
                type: settings.additionalInputType,
              },
            }),
          };

          const operation = {
            type: build.getTypeByName(settings.outType.name),
            args,
            async resolve(
              _parent: unknown,
              input: { [argName: string]: unknown },
              context: ExtendedGraphQLContext,
              resolveInfo: GraphQLResolveInfo,
            ) {
              const { jwtToken, config } = getValidatedExtendedContext(context);
              const ids = await getEntityIds(
                filter,
                input,
                context,
                resolveInfo.schema,
              );

              const token = await getLongLivedToken(jwtToken, config);

              return settings.resolverBodyBuilder(
                ids,
                filter,
                context,
                input,
                token,
              );
            },
          };

          const opName = settings.mutationNameBuilder(filter);

          build.extend(fields, {
            [opName]: operation,
          });
        }
      }

      return fields;
    });
  };
};
