/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  buildPgSettings,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { MosaicError } from '@axinom/mosaic-service-common';
import { Plugin } from 'graphile-build';
import { PgClass } from 'graphile-build-pg';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { GraphQLFieldConfig, GraphQLObjectType } from 'graphql';
import { capitalize } from 'inflection';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
  UnpublishEntityCommand,
} from 'media-messages';
import { IsolationLevel } from 'zapatos/db';
import { Table } from 'zapatos/schema';
import {
  CommonErrors,
  getLongLivedToken,
  getMediaMappedError,
} from '../../common';
import {
  ExtendedGraphQLContext,
  getValidatedExtendedContext,
} from '../../graphql';
import {
  createSnapshotWithRelation,
  findTable,
  generateSnapshotJobId,
  getPublishedSnapshot,
  getSnapshotPgField,
  getTableGqlType,
  gqlEntityNameToEntityType,
} from '../utils';

// TODO: Reduce code duplication across the resolvers here.

/**
 * Generates a plugin that will add publishing related endpoints to an entity: `publish{Entity}`, `unpublish{Entity}` and `create{Entity}Snapshot`.
 * @param tableName - Name of the entity table.
 */
export const EntityPublishingEndpointsPluginFactory = (
  tableName: Table,
): Plugin => {
  let table: PgClass;
  let outType: GraphQLObjectType;

  return (builder) => {
    builder.hook('init', (input, build, _context) => {
      table = findTable(build, tableName);

      outType = getTableGqlType(build, 'snapshots');
      if (build.getTypeByName(outType.name) === undefined) {
        build.newWithHooks(
          build.graphql.GraphQLObjectType,
          outType.toConfig(),
          {},
        );
      }

      return input;
    });

    builder.hook('GraphQLObjectType:fields', (fields, build, context) => {
      if (context.scope.isRootMutation) {
        const entityName = build.inflection._singularizedTableName(table);
        const capitalizedEntityName = capitalize(entityName);
        // TODO: This should match the actual PK type.
        const entityIdType = new build.graphql.GraphQLNonNull(
          build.graphql.GraphQLInt,
        );
        const idArgName = build.inflection.camelCase(`${entityName}-id`);

        const newFields: {
          [name: string]: GraphQLFieldConfig<never, never>;
        } = {
          [build.inflection.camelCase(`publish-${entityName}`)]: {
            description: `Creates a ${capitalizedEntityName} snapshot and immediately publishes it if it's valid.`,
            type: outType,
            args: {
              [idArgName]: {
                description: `ID of the ${entityName} to publish.`,
                type: entityIdType,
              },
            },
            resolve: async (
              _query: unknown,
              args: { [key: string]: number },
              context: ExtendedGraphQLContext,
              resolveInfo: unknown,
            ) => {
              const entityId = args[idArgName];
              try {
                const { jwtToken, config, pgClient, storeInboxMessage } =
                  getValidatedExtendedContext(context);

                const snapshot = await createSnapshotWithRelation(
                  gqlEntityNameToEntityType(entityName),
                  entityId,
                  generateSnapshotJobId(),
                  pgClient,
                );

                await storeInboxMessage<PublishEntityCommand>(
                  snapshot.id.toString(),
                  MediaServiceMessagingSettings.PublishEntity,
                  {
                    table_name: 'snapshots',
                    entity_id: snapshot.id,
                    publish_options: {
                      action: 'PUBLISH_NOW',
                    },
                  },
                  pgClient,
                  {
                    metadata: {
                      authToken: await getLongLivedToken(jwtToken, config),
                    },
                  },
                );

                return getSnapshotPgField(
                  snapshot.id,
                  build,
                  (resolveInfo as { graphile: GraphileHelpers<any> }).graphile,
                );
              } catch (error) {
                throw getMediaMappedError(error, {
                  message: `Attempt to publish a ${capitalizedEntityName} with ID '${entityId}' has failed.`,
                  code: CommonErrors.PublishError.code,
                });
              }
            },
          },
          [build.inflection.camelCase(`unpublish-${entityName}`)]: {
            description: `Unpublishes the currently published ${capitalizedEntityName} snapshot.`,
            type: outType,
            args: {
              [idArgName]: {
                description: `ID of the ${entityName} to unpublish.`,
                type: entityIdType,
              },
            },
            resolve: async (
              _query: unknown,
              args: { [key: string]: number },
              context: ExtendedGraphQLContext,
              resolveInfo: unknown,
            ) => {
              const entityId = args[idArgName];
              try {
                const { pgClient, jwtToken, config, storeInboxMessage } =
                  getValidatedExtendedContext(context);
                const snapshot = await getPublishedSnapshot(
                  tableName,
                  entityId,
                  pgClient,
                );

                if (!snapshot) {
                  throw new MosaicError({
                    message: `${capitalizedEntityName} with ID '${entityId}' does not have a published snapshot.`,
                    code: CommonErrors.UnpublishError.code,
                  });
                }

                await storeInboxMessage<UnpublishEntityCommand>(
                  entityId.toString(),
                  MediaServiceMessagingSettings.UnpublishEntity,
                  {
                    entity_id: entityId,
                    table_name: tableName,
                  },
                  pgClient,
                  {
                    metadata: {
                      authToken: await getLongLivedToken(jwtToken, config),
                    },
                  },
                );

                return getSnapshotPgField(
                  snapshot.id,
                  build,
                  (resolveInfo as { graphile: GraphileHelpers<any> }).graphile,
                );
              } catch (error) {
                throw getMediaMappedError(error, {
                  message: `Attempt to unpublish a ${capitalizedEntityName} with ID '${entityId}' has failed.`,
                  code: CommonErrors.UnpublishError.code,
                });
              }
            },
          },
          [build.inflection.camelCase(`create-${entityName}-snapshot`)]: {
            description: `Creates a new ${capitalizedEntityName} snapshot.`,
            type: outType,
            args: {
              [idArgName]: {
                description: `ID of the ${entityName} to create a snapshot from.`,
                type: entityIdType,
              },
            },
            resolve: async (
              _query: unknown,
              args: { [key: string]: number },
              context: ExtendedGraphQLContext,
              resolveInfo: unknown,
            ) => {
              const entityId = args[idArgName];
              try {
                const {
                  subject,
                  ownerPool,
                  jwtToken,
                  config,
                  pgClient,
                  storeInboxMessage,
                } = getValidatedExtendedContext(context);
                const pgSettings = buildPgSettings(
                  subject,
                  config.dbGqlRole,
                  config.serviceId,
                );

                // A new transaction is started and committed to make sure the snapshot
                // exists before the 'PublishEntityCommand' message is published.
                const snapshot = await transactionWithContext(
                  ownerPool,
                  IsolationLevel.Serializable,
                  pgSettings,
                  async (ctx) => {
                    return createSnapshotWithRelation(
                      gqlEntityNameToEntityType(entityName),
                      entityId,
                      generateSnapshotJobId(),
                      ctx,
                    );
                  },
                );

                await storeInboxMessage<PublishEntityCommand>(
                  snapshot.id.toString(),
                  MediaServiceMessagingSettings.PublishEntity,
                  {
                    table_name: 'snapshots',
                    entity_id: snapshot.id,
                    publish_options: {
                      action: 'NO_PUBLISH',
                    },
                  },
                  pgClient,
                  {
                    metadata: {
                      authToken: await getLongLivedToken(jwtToken, config),
                    },
                  },
                );

                return getSnapshotPgField(
                  snapshot.id,
                  build,
                  (resolveInfo as { graphile: GraphileHelpers<any> }).graphile,
                );
              } catch (error) {
                throw getMediaMappedError(error, {
                  message: `Attempt to create a snapshot for ${capitalizedEntityName} with ID '${entityId}' has failed.`,
                  code: CommonErrors.CreateSnapshotError.code,
                });
              }
            },
          },
        };

        build.extend(fields, newFields);
      }

      return fields;
    });
  };
};
