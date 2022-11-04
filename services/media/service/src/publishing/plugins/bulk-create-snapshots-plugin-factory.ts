import { camelCase, Plugin } from 'graphile-build';
import { singularize } from 'inflection';
import { Table } from 'zapatos/schema';
import {
  buildBulkActionSettings,
  BulkMutationPluginFactory,
} from '../../graphql';
import {
  bulkPublishingPayload,
  bulkPublishingResolverBodyBuilder,
} from '../utils';

/**
 * A factory for creating a bulk mutations plugin for creating snapshots.
 */
export const BulkCreateSnapshotsPluginFactory = (
  ...tableNames: Table[]
): Plugin => {
  return BulkMutationPluginFactory(
    tableNames,
    buildBulkActionSettings({
      mutationNameBuilder: (filter) =>
        camelCase(`create-${singularize(filter.entityTypeName)}-snapshots`),
      outType: bulkPublishingPayload,
      resolverBodyBuilder: bulkPublishingResolverBodyBuilder('NO_PUBLISH'),
    }),
  );
};
