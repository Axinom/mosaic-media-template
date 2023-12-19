import {
  BulkIdParameters,
  DefinePlugin,
  GenericBulkPluginFactory,
} from '@axinom/mosaic-graphql-common';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { Plugin } from 'graphile-build';
import * as GraphQL from 'graphql';
import { getLongLivedToken } from '../../common';
import { getValidatedExtendedContext } from './extended-graphql-context';

export const MediaBulkPluginFactory = (
  messagingSettings: MessagingSettings,
  definePlugin: DefinePlugin,
  inputType?: GraphQL.GraphQLInputObjectType,
): Plugin => {
  const callback = async ({
    graphQLContext,
    entityIds,
    entityType,
    primaryKeyName,
    tableName,
    graphQLAdditionalInput,
  }: BulkIdParameters): Promise<void> => {
    const { jwtToken, config, storeOutboxMessage, pgClient } =
      getValidatedExtendedContext(graphQLContext);

    if (entityIds.length > 0) {
      const token = await getLongLivedToken(jwtToken, config);
      for (const id of entityIds) {
        await storeOutboxMessage(
          id.toString(),
          messagingSettings,
          {
            entity_id: id,
            entity_type: entityType,
            primary_key_name: primaryKeyName,
            table_name: tableName,
            input: graphQLAdditionalInput,
          },
          pgClient,
          { auth_token: token },
        );
      }
    }
  };
  return GenericBulkPluginFactory(callback, definePlugin, inputType);
};
