import { makePluginByCombiningPlugins } from 'graphile-utils';
import { ExtendMovieQueryWithCountryCodePlugin } from './extend-movie-query-with-country-code-plugin';

export const AllMoviePlugins = makePluginByCombiningPlugins(
  ExtendMovieQueryWithCountryCodePlugin,
);
