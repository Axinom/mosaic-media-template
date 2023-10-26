import { makePluginByCombiningPlugins } from 'graphile-utils';
import { EntityLocalizationPlugin } from '../../../graphql/plugins';
import { ExtendEpisodeQueryWithCountryCodePlugin } from './extend-episode-query-with-country-code-plugin';

export const AllTvshowPlugins = makePluginByCombiningPlugins(
  ExtendEpisodeQueryWithCountryCodePlugin,
  EntityLocalizationPlugin('tvshow', 'tvshow_localizations', [
    'title',
    'description',
    'synopsis',
  ]),
  EntityLocalizationPlugin('tvshow_genre', 'tvshow_genre_localizations', [
    'title',
  ]),
  EntityLocalizationPlugin('season', 'season_localizations', [
    'description',
    'synopsis',
  ]),
  EntityLocalizationPlugin('episode', 'episode_localizations', [
    'title',
    'description',
    'synopsis',
  ]),
);
