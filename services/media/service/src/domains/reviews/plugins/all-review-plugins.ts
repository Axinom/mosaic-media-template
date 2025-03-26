import { makePluginByCombiningPlugins } from 'graphile-utils';
import {
  BulkCreateSnapshotsPluginFactory,
  BulkPublishingPluginFactory,
  BulkUnpublishingPluginFactory,
  EntityPublishingEndpointsPluginFactory,
} from '../../../publishing';
import { SmartTagsPlugin } from './smart-tags-plugin';

export const AllReviewPlugins = makePluginByCombiningPlugins(
  SmartTagsPlugin,
  BulkCreateSnapshotsPluginFactory('reviews'),
  BulkPublishingPluginFactory('reviews'),
  BulkUnpublishingPluginFactory('reviews'),
  EntityPublishingEndpointsPluginFactory('reviews'),
);
