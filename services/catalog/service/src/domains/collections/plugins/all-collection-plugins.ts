import { makePluginByCombiningPlugins } from 'graphile-utils';
import { EntityLocalizationPlugin } from '../../../graphql/plugins';

export const AllCollectionPlugins = makePluginByCombiningPlugins(
  EntityLocalizationPlugin('collection', 'collection_localizations'),
);
