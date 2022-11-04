import { makePluginByCombiningPlugins } from 'graphile-utils';
import { BulkDeletePluginFactory } from '../../graphql';
import { BulkPublishingPluginFactory } from './bulk-publishing-plugin-factory';
import { BulkUnpublishingPluginFactory } from './bulk-unpublishing-plugin-factory';
import { RecreateSnapshotsPlugin } from './recreate-snapshots-plugin';
import { SmartTagsPlugin } from './smart-tags-plugin';
import { SnapshotEndpointsPlugin } from './snapshot-endpoints-plugin';

export const AllPublishingPlugins = makePluginByCombiningPlugins(
  SmartTagsPlugin,
  RecreateSnapshotsPlugin,
  SnapshotEndpointsPlugin,
  BulkPublishingPluginFactory('snapshots'),
  BulkUnpublishingPluginFactory('snapshots'),
  BulkDeletePluginFactory('SnapshotFilter'),
);
