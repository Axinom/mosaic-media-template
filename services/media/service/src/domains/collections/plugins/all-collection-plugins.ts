import { IndexedSearchPluginFactory } from '@axinom/mosaic-graphql-common';
import { makePluginByCombiningPlugins } from 'graphile-utils';
import { BulkDeletePluginFactory } from '../../../graphql';
import {
  BulkCreateSnapshotsPluginFactory,
  BulkPublishingPluginFactory,
  BulkUnpublishingPluginFactory,
  EntityPublishingEndpointsPluginFactory,
} from '../../../publishing';
import { PopulateEndpointPlugin } from './populate-endpoint-plugin';
import { SmartTagsPlugin } from './smart-tags-plugin';

export const AllCollectionPlugins = makePluginByCombiningPlugins(
  SmartTagsPlugin,
  IndexedSearchPluginFactory([
    { table: 'collections', column: 'title' },
    { table: 'collections_tags', column: 'name' },
  ]),
  BulkCreateSnapshotsPluginFactory('collections'),
  BulkPublishingPluginFactory('collections'),
  BulkUnpublishingPluginFactory('collections'),
  EntityPublishingEndpointsPluginFactory('collections'),
  BulkDeletePluginFactory('CollectionRelationFilter', 'CollectionFilter'),
);

export const AllCollectionDevPlugins = makePluginByCombiningPlugins(
  PopulateEndpointPlugin,
);
