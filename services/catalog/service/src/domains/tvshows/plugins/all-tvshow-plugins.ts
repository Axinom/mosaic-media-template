import { makePluginByCombiningPlugins } from 'graphile-utils';
import { ExtendEpisodeQueryWithCountryCodePlugin } from './extend-episode-query-with-country-code-plugin';

export const AllTvshowPlugins = makePluginByCombiningPlugins(
  ExtendEpisodeQueryWithCountryCodePlugin,
);
