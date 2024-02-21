import { PiletApi } from '@axinom/mosaic-portal';
import { initializeUi } from '@axinom/mosaic-ui';
import React from 'react';
import { initializeApolloClient } from './apolloClient/apolloClient';
import { bindExtensions } from './externals/piralExtensions';
import './global.scss';
import { MediaIconName, MediaIcons } from './MediaIcons';
import { initializeConfig, piletConfig } from './piletConfig';
import { register as registerFASTProviders } from './providers/registrations';
import { sortTiles } from './sortTiles/sortTiles';
import { register as registerCollections } from './Stations/Collections/registrations';
import { register as registerEpisodes } from './Stations/Episodes/registrations';
import { register as registerIngest } from './Stations/Ingest/registrations';
import { register as registerMovies } from './Stations/Movies/registrations';
import { register as registerSnapshotRegistry } from './Stations/Publishing/registrations';
import { register as registerSeasons } from './Stations/Seasons/registrations';
import { register as registerTvShows } from './Stations/TvShows/registrations';
import {
  transformNavigationItems,
  transformNavigationTree,
} from './transformNavigation/transformNavigation';

export const settingsGroupName = 'Media Management';
export const mediaManagementParentName = 'media-management';

export function setup(app: PiletApi): void {
  initializeConfig(app.meta.custom);

  // Provide the PiletAPI to the UI components (e.g. for raising toast notifications)
  initializeUi(app);

  // Initializing the GraphQL clients
  initializeApolloClient(
    app.getToken,
    piletConfig.mediaManagementHost,
    piletConfig.mediaManagementHttpProtocol,
  );

  // Making all required extensions available
  const extensions = bindExtensions(app);

  app.setHomeTileSorter(sortTiles);

  app.setNavigationItemsTransformer(transformNavigationItems);

  app.setNavigationTreeTransformer(transformNavigationTree);

  app.registerNavigationItem({
    icon: <MediaIcons icon={MediaIconName.Movie} />,
    label: settingsGroupName,
    name: mediaManagementParentName,
    categoryName: 'Settings',
  });

  // Registering all items (Pages, Tiles, Extensions,...) this pilet provides
  registerMovies(app, extensions);
  registerTvShows(app, extensions);
  registerSeasons(app, extensions);
  registerEpisodes(app, extensions);
  registerIngest(app, extensions);
  registerSnapshotRegistry(app, extensions);
  registerCollections(app, extensions);
  registerFASTProviders(app);
}
