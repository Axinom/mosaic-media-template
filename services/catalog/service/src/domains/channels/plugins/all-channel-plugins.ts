import { makePluginByCombiningPlugins } from 'graphile-utils';
import { AssetLocalizationPlugin } from '../../../graphql/plugins';

export const AllChannelPlugins = makePluginByCombiningPlugins(
  AssetLocalizationPlugin('channel', 'channel_localizations'),
);
