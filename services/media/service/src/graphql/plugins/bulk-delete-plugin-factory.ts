import { Plugin } from 'graphile-build';
import { MediaServiceMessagingSettings } from 'media-messages';
import pluralize from 'pluralize';
import { MediaBulkPluginFactory } from './media-bulk-plugin-factory';

export const BulkDeletePluginFactory = (
  ...filterTypeNames: string[]
): Plugin => {
  return MediaBulkPluginFactory(
    MediaServiceMessagingSettings.DeleteEntity.messageType,
    (filter) => {
      if (
        filterTypeNames.some((filterName) => filterName === filter.filterName)
      ) {
        return {
          graphQLEndpointName: 'delete' + pluralize(filter.typeName),
        };
      }
      return;
    },
  );
};
