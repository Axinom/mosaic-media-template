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
    id: 1,
    title: 'Movie Genres',
    table: 'movie_genres',
    type: 'MOVIE_GENRE',
  }),
);

export const AllMovieDevPlugins = makePluginByCombiningPlugins(
  PopulateEndpointPlugin,
);
