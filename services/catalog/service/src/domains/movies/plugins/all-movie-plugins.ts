import { makePluginByCombiningPlugins } from 'graphile-utils';
import { EntityLocalizationPlugin } from '../../../graphql/plugins';
import { ExtendMovieQueryWithCountryCodePlugin } from './extend-movie-query-with-country-code-plugin';

export const AllMoviePlugins = makePluginByCombiningPlugins(
  ExtendMovieQueryWithCountryCodePlugin,
  EntityLocalizationPlugin('movie', 'movie_localizations'),
  EntityLocalizationPlugin('movie_genre', 'movie_genre_localizations'),
);
