import { IndexedSearchPluginFactory } from '@axinom/mosaic-graphql-common';
import { makePluginByCombiningPlugins } from 'graphile-utils';
import { BulkDeletePluginFactory } from '../../../graphql';
import {
  BulkCreateSnapshotsPluginFactory,
  BulkPublishingPluginFactory,
  BulkUnpublishingPluginFactory,
  EntityListPublishingEndpointsPluginFactory,
  EntityPublishingEndpointsPluginFactory,
} from '../../../publishing';
import { PopulateEndpointPlugin } from './populate-endpoint-plugin';
import { SmartTagsPlugin } from './smart-tags-plugin';

export const AllTvshowPlugins = makePluginByCombiningPlugins(
  SmartTagsPlugin,
  IndexedSearchPluginFactory([
    { table: 'tvshows', column: 'title' },
    { table: 'tvshows', column: 'original_title' },
    { table: 'tvshows_tags', column: 'name' },
    { table: 'tvshows_casts', column: 'name' },
    { table: 'tvshows_production_countries', column: 'name' },
    { table: 'seasons_tags', column: 'name' },
    { table: 'seasons_casts', column: 'name' },
    { table: 'seasons_production_countries', column: 'name' },
    { table: 'episodes', column: 'title' },
    { table: 'episodes', column: 'original_title' },
    { table: 'episodes_tags', column: 'name' },
    { table: 'episodes_casts', column: 'name' },
    { table: 'episodes_production_countries', column: 'name' },
  ]),
  BulkCreateSnapshotsPluginFactory('tvshows', 'seasons', 'episodes'),
  BulkPublishingPluginFactory('tvshows', 'seasons', 'episodes'),
  BulkUnpublishingPluginFactory('tvshows', 'seasons', 'episodes'),
  EntityPublishingEndpointsPluginFactory('tvshows'),
  EntityPublishingEndpointsPluginFactory('seasons'),
  EntityPublishingEndpointsPluginFactory('episodes'),
  BulkDeletePluginFactory(
    'TvshowGenreFilter',
    'TvshowFilter',
    'TvshowsLicenseFilter',
    'SeasonFilter',
    'SeasonsLicenseFilter',
    'EpisodeFilter',
    'EpisodesLicenseFilter',
  ),
  EntityListPublishingEndpointsPluginFactory({
    id: 0,
    title: 'TV Show Genres',
    table: 'tvshow_genres',
    type: 'TVSHOW_GENRE',
  }),
);

export const AllTvshowDevPlugins = makePluginByCombiningPlugins(
  PopulateEndpointPlugin,
);
