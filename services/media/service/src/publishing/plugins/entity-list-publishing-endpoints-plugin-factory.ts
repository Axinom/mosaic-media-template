/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  buildPgSettings,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { MosaicError } from '@axinom/mosaic-service-common';
import { Plugin } from 'graphile-build';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import {
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLNullableType,
} from 'graphql';
import { humanize } from 'inflection';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
  UnpublishEntityCommand,
} from 'media-messages';
import { IsolationLevel, selectOne } from 'zapatos/db';
import {
  CommonErrors,
  getLongLivedToken,
  getMediaMappedError,
} from '../../common';
import {
  ExtendedGraphQLContext,
  getValidatedExtendedContext,
} from '../../graphql';
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
  let outType: GraphQLNonNull<GraphQLNullableType>;

  return (builder) => {
    builder.hook('init', (input, build, _context) => {
      const nullableType = getTableGqlType(build, 'snapshots');
      outType = new GraphQLNonNull(nullableType as GraphQLNullableType);
      if (build.getTypeByName(nullableType.name) === undefined) {
        build.newWithHooks(
          build.graphql.GraphQLObjectType,
          nullableType.toConfig(),
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
                const {
                  subject,
                  ownerPool,
                  jwtToken,
                  config,
                  storeOutboxMessage,
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
                    const snapshot = await createListSnapshot(
                      info,
                      generateSnapshotJobId(),
                      ctx,
                    );
                    await storeOutboxMessage<PublishEntityCommand>(
                      snapshot.id.toString(),
                      MediaServiceMessagingSettings.PublishEntity,
                      {
                        table_name: 'snapshots',
                        entity_id: snapshot.id,
                        publish_options: {
                          action: 'PUBLISH_NOW',
                        },
                      },
                      ctx,
                      {
                        envelopeOverrides: {
                          auth_token: await getLongLivedToken(jwtToken, config),
                        },
                      },
                    );
                    return snapshot;
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
                const { pgClient, jwtToken, config, storeOutboxMessage } =
                  getValidatedExtendedContext(context);
                const snapshot = await selectOne('snapshots', {
                  entity_type: info.type,
                  snapshot_state: 'PUBLISHED',
                }).run(pgClient);

                if (!snapshot) {
                  throw new MosaicError({
                    message: `${entityType} list does not have a published snapshot.`,
                    code: CommonErrors.UnpublishError.code,
                  });
                }

                await storeOutboxMessage<UnpublishEntityCommand>(
                  snapshot.id.toString(),
                  MediaServiceMessagingSettings.UnpublishEntity,
                  {
                    entity_id: snapshot.id,
                    table_name: 'snapshots',
                  },
                  pgClient,
                  {
                    envelopeOverrides: {
                      auth_token: await getLongLivedToken(jwtToken, config),
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
                const { jwtToken, config, pgClient, storeOutboxMessage } =
                  getValidatedExtendedContext(context);
                const snapshot = await createListSnapshot(
                  info,
                  generateSnapshotJobId(),
                  pgClient,
                );

                await storeOutboxMessage<PublishEntityCommand>(
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
                    envelopeOverrides: {
                      auth_token: await getLongLivedToken(jwtToken, config),
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
