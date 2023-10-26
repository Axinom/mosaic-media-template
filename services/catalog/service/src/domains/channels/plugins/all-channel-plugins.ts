import { makePluginByCombiningPlugins } from 'graphile-utils';
import { EntityLocalizationPlugin } from '../../../graphql/plugins';

export const AllChannelPlugins = makePluginByCombiningPlugins(
  EntityLocalizationPlugin('channel', 'channel_localizations', [
    'title',
    'description',
  ]),
);
