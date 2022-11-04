import { camelCase, Plugin, pluralize } from 'graphile-build';
import { MediaServiceMessagingSettings } from 'media-messages';
import { Table } from 'zapatos/schema';
import {
  buildBulkActionSettings,
  BulkMutationPluginFactory,
} from '../../graphql';

/**
 * A factory for creating a bulk mutations plugin for unpublishing content metadata.
 */
export const BulkUnpublishingPluginFactory = (
  ...tableNames: Table[]
): Plugin => {
  return BulkMutationPluginFactory(
    tableNames,
    buildBulkActionSettings(
      {
        mutationNameBuilder: (filter) =>
          camelCase(`unpublish-${pluralize(filter.entityTypeName)}`),
      },
      MediaServiceMessagingSettings.UnpublishEntity.messageType,
    ),
  );
};
