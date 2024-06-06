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
    id: -1,
    title: 'TV Show Genres',
    table: 'tvshow_genres',
    type: 'TVSHOW_GENRE',
  }),
);

export const AllTvshowDevPlugins = makePluginByCombiningPlugins(
  PopulateEndpointPlugin,
);
