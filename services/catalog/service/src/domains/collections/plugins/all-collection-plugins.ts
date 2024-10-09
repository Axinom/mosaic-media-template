import { makePluginByCombiningPlugins } from 'graphile-utils';
import { ExtendCollectionQueryWithCountryCodePlugin } from './extend-collection-query-with-country-code-plugin';

export const AllCollectionPlugins = makePluginByCombiningPlugins(
  ExtendCollectionQueryWithCountryCodePlugin,
);
