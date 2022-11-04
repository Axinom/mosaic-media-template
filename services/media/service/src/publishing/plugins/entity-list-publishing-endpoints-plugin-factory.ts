/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  buildPgSettings,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { MosaicError } from '@axinom/mosaic-service-common';
import { Plugin } from 'graphile-build';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { GraphQLFieldConfig, GraphQLObjectType } from 'graphql';
import { humanize } from 'inflection';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
  UnpublishEntityCommand,
} from 'media-messages';
import { Client } from 'pg';
import { IsolationLevel, selectOne } from 'zapatos/db';
import {
  CommonErrors,
  getLongLivedToken,
  getMediaMappedError,
} from '../../common';
import { ExtendedGraphQLContext } from '../../graphql';
import { EntityListInfo } from '../models';
import {
  createListSnapshot,
  generateSnapshotJobId,
  getSnapshotPgField,
  getTableGqlType,
} from '../utils';

/**
 * Generates a plugin that will add publishing related endpoints for an entity type, allowing publishing all entities ot said type as a list: `publish{Entities}`, `unpublish{Entities}` and `create{Entities}Snapshot`.
 * @param tableName - Name of the entity table.
 */
export const EntityListPublishingEndpointsPluginFactory = (
  info: EntityListInfo,
): Plugin => {
  let outType: GraphQLObjectType;

  return (builder) => {
    builder.hook('init', (input, build, _context) => {
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
        const entityType = humanize(info.table);

        const newFields: {
          [name: string]: GraphQLFieldConfig<never, never>;
        } = {
          [build.inflection.camelCase(`publish-${info.table}`)]: {
            description: `Creates a ${entityType} snapshot and immediately publishes it if it's valid.`,
            type: outType,
            resolve: async (
              _query: unknown,
              _args: unknown,
              context: ExtendedGraphQLContext,
              resolveInfo: unknown,
            ) => {
              try {
                const pgSettings = buildPgSettings(
                  context.subject,
                  context.config.dbGqlRole,
                  context.config.serviceId,
                );

                // A new transaction is started and committed to make sure the snapshot
                // exists before the 'PublishEntityCommand' message is published.
                const snapshot = await transactionWithContext(
                  context.ownerPool,
                  IsolationLevel.Serializable,
                  pgSettings,
                  async (ctx) => {
                    return createListSnapshot(
                      info,
                      generateSnapshotJobId(),
                      ctx,
                    );
                  },
                );

                await context.messagingBroker.publish<PublishEntityCommand>(
                  MediaServiceMessagingSettings.PublishEntity.messageType,
                  {
                    table_name: 'snapshots',
                    entity_id: snapshot.id,
                    publish_options: {
                      action: 'PUBLISH_NOW',
                    },
                  },
                  {
                    auth_token: await getLongLivedToken(
                      context.jwtToken ?? '',
                      context.config,
                    ),
                  },
                );

                return getSnapshotPgField(
                  snapshot.id,
                  build,
                  (resolveInfo as { graphile: GraphileHelpers<any> }).graphile,
                );
              } catch (error) {
                throw getMediaMappedError(error, {
                  message: `Attempt to publish a ${entityType} list has failed.`,
                  code: CommonErrors.PublishError.code,
                });
              }
            },
          },
          [build.inflection.camelCase(`unpublish-${info.table}`)]: {
            description: `Unpublishes the currently published ${entityType} snapshot.`,
            type: outType,
            resolve: async (
              _query: unknown,
              _args: unknown,
              context: ExtendedGraphQLContext,
              resolveInfo: unknown,
            ) => {
              try {
                const snapshot = await selectOne('snapshots', {
                  entity_type: info.type,
                  snapshot_state: 'PUBLISHED',
                }).run(context.pgClient as Client);

                if (!snapshot) {
                  throw new MosaicError({
                    message: `${entityType} list does not have a published snapshot.`,
                    code: CommonErrors.UnpublishError.code,
                  });
                }

                await context.messagingBroker.publish<UnpublishEntityCommand>(
                  MediaServiceMessagingSettings.UnpublishEntity.messageType,
                  {
                    entity_id: snapshot.id,
                    table_name: 'snapshots',
                  },
                  {
                    auth_token: await getLongLivedToken(
                      context.jwtToken ?? '',
                      context.config,
                    ),
                  },
                );

                return getSnapshotPgField(
                  snapshot.id,
                  build,
                  (resolveInfo as { graphile: GraphileHelpers<any> }).graphile,
                );
              } catch (error) {
                throw getMediaMappedError(error, {
                  message: `Attempt to unpublish a ${entityType} list has failed.`,
                  code: CommonErrors.UnpublishError.code,
                });
              }
            },
          },
          [build.inflection.camelCase(`create-${info.table}-snapshot`)]: {
            description: `Creates a new ${entityType} snapshot.`,
            type: outType,
            resolve: async (
              _query: unknown,
              _args: unknown,
              context: ExtendedGraphQLContext,
              resolveInfo: unknown,
            ) => {
              try {
                const pgSettings = buildPgSettings(
                  context.subject,
                  context.config.dbGqlRole,
                  context.config.serviceId,
                );

                // A new transaction is started and committed to make sure the snapshot
                // exists before the 'PublishEntityCommand' message is published.
                const snapshot = await transactionWithContext(
                  context.ownerPool,
                  IsolationLevel.Serializable,
                  pgSettings,
                  async (ctx) => {
                    return createListSnapshot(
                      info,
                      generateSnapshotJobId(),
                      ctx,
                    );
                  },
                );

                await context.messagingBroker.publish<PublishEntityCommand>(
                  MediaServiceMessagingSettings.PublishEntity.messageType,
                  {
                    table_name: 'snapshots',
                    entity_id: snapshot.id,
                    publish_options: {
                      action: 'NO_PUBLISH',
                    },
                  },
                  {
                    auth_token: await getLongLivedToken(
                      context.jwtToken ?? '',
                      context.config,
                    ),
                  },
                );

                return getSnapshotPgField(
                  snapshot.id,
                  build,
                  (resolveInfo as { graphile: GraphileHelpers<any> }).graphile,
                );
              } catch (error) {
                throw getMediaMappedError(error, {
                  message: `Attempt to create a snapshot for ${entityType} list has failed.`,
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
