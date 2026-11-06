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

export const AllMoviePlugins = makePluginByCombiningPlugins(
  SmartTagsPlugin,
  IndexedSearchPluginFactory([
    { table: 'movies', column: 'title' },
    { table: 'movies', column: 'original_title' },
    { table: 'movies_tags', column: 'name' },
    { table: 'movies_casts', column: 'name' },
    { table: 'movies_production_countries', column: 'name' },
  ]),
  BulkCreateSnapshotsPluginFactory('movies'),
  BulkPublishingPluginFactory('movies'),
  BulkUnpublishingPluginFactory('movies'),
  EntityPublishingEndpointsPluginFactory('movies'),
  BulkDeletePluginFactory(
    'MovieGenreFilter',
    'MovieFilter',
    'MoviesLicenseFilter',
  ),
  EntityListPublishingEndpointsPluginFactory({
    id: 0,
    title: 'Movie Genres',
    table: 'movie_genres',
    type: 'MOVIE_GENRE',
  }),
);

export const AllMovieDevPlugins = makePluginByCombiningPlugins(
  PopulateEndpointPlugin,
);
