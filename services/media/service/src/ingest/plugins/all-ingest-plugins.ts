import { makePluginByCombiningPlugins } from 'graphile-utils';
import { SmartTagsPlugin } from './smart-tags-plugin';
import { StartIngestEndpointPlugin } from './start-ingest-endpoint-plugin';
import { IngestedAssetsPlugin } from './ingested-assets-endpoint-plugin';

export const AllIngestPlugins = makePluginByCombiningPlugins(
  SmartTagsPlugin,
  StartIngestEndpointPlugin,
  IngestedAssetsPlugin
);
