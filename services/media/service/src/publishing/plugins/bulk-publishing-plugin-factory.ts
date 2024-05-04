import { camelCase, Plugin, pluralize } from 'graphile-build';
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
 * A factory for creating a bulk mutations plugin that implement the "publish now" functionality.
 */
export const BulkPublishingPluginFactory = (...tableNames: Table[]): Plugin => {
  return BulkMutationPluginFactory(
    tableNames,
    buildBulkActionSettings({
      mutationNameBuilder: (filter) =>
        camelCase(`publish-${pluralize(filter.entityTypeName)}`),
      outType: bulkPublishingPayload,
      resolverBodyBuilder: bulkPublishingResolverBodyBuilder('PUBLISH_NOW'),
    }),
  );
};
