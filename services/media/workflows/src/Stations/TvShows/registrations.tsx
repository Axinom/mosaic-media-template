import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsContext } from '../../externals';
import { settingsGroupName } from '../../index';
import { MediaIconName, MediaIcons } from '../../MediaIcons';
import { TvShowCreate } from './TvShowCreate/TvShowCreate';
import { TvShowDetails } from './TvShowDetails/TvShowDetails';
import { TvShowDetailsCrumb } from './TvShowDetails/TvShowDetailsCrumb';
import { TvShowGenres } from './TvShowGenres/TvShowGenres';
import { TvShowGenresSnapshotDetails } from './TvShowGenresSnapshotDetails/TvShowGenresSnapshotDetails';
import { TvShowGenreSnapshotDetailsCrumb } from './TvShowGenresSnapshotDetails/TvShowGenresSnapshotDetailsCrumb';
import { TvShowGenresSnapshots } from './TvShowGenresSnapshots/TvShowGenresSnapshots';
import { TvShowImageManagement } from './TvShowImageManagement/TvShowImageManagement';
import { TvShowLicensing } from './TvShowLicensing/TvShowLicensing';
import { TvShowLicensingCreate } from './TvShowLicensingCreate/TvShowLicensingCreate';
import { TvShowLicensingDetails } from './TvShowLicensingDetails/TvShowLicensingDetails';
import { TvShowSeasonManagement } from './TvShowSeasonManagement/TvShowSeasonManagement';
import { TvShows } from './TvShowsExplorer/TvShows';
import { TvShowSnapshotDetails } from './TvShowSnapshotDetails/TvShowSnapshotDetails';
import { TvShowSnapshotDetailsCrumb } from './TvShowSnapshotDetails/TvShowSnapshotDetailsCrumb';
import { TvShowSnapshots } from './TvShowSnapshots/TvShowSnapshots';
import { TvShowVideoManagement } from './TvShowVideoManagement/TvShowVideoManagement';

export function register(app: PiletApi, extensions: Extensions): void {
  app.registerTile({
    kind: 'home',
    path: '/tvshows',
    label: 'TV Shows',
    icon: <MediaIcons icon={MediaIconName.TV} />,
    type: 'large',
  });

  app.registerPage('/tvshows', TvShows, {
    breadcrumb: () => 'TV Shows',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage('/tvshows/create', TvShowCreate, {
    breadcrumb: () => 'New TV Show',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/tvshows/:tvshowId',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <TvShowDetails />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: TvShowDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage('/tvshows/:tvshowId/licenses', TvShowLicensing, {
    breadcrumb: () => 'Licensing',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/tvshows/:tvshowId/licenses/create',
    TvShowLicensingCreate,
    {
      breadcrumb: () => 'New License',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/tvshows/:tvshowId/licenses/:tvshowsLicenseId',
    TvShowLicensingDetails,
    {
      breadcrumb: () => 'Licensing Details',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/tvshows/:tvshowId/videos',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <TvShowVideoManagement />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Video Management',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/tvshows/:tvshowId/images',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <TvShowImageManagement />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Image Management',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage('/tvshows/:tvshowId/seasons', TvShowSeasonManagement, {
    breadcrumb: () => 'Season Management',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerTile({
    kind: 'settings',
    groupName: settingsGroupName,
    path: '/settings/media/tvshowgenres',
    label: 'TV Show Genres',
    icon: <MediaIcons icon={MediaIconName.TvShowGenres} />,
  });

  app.registerPage('/settings/media/tvshowgenres', TvShowGenres, {
    breadcrumb: () => 'TV Show Genres',
    permissions: { 'media-service': ['SETTINGS_VIEW'] },
  });

  app.registerPage('/tvshows/:tvshowId/snapshots', TvShowSnapshots, {
    breadcrumb: () => 'Publishing Snapshots',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/tvshows/:tvshowId/snapshots/:snapshotId',
    TvShowSnapshotDetails,
    {
      breadcrumb: TvShowSnapshotDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/settings/media/tvshowgenres/snapshots',
    TvShowGenresSnapshots,
    {
      breadcrumb: () => 'Publishing Snapshots',
      permissions: {
        'media-service': ['ADMIN', 'SETTINGS_EDIT', 'SETTINGS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/settings/media/tvshowgenres/snapshots/:snapshotId',
    TvShowGenresSnapshotDetails,
    {
      breadcrumb: TvShowGenreSnapshotDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'SETTINGS_EDIT', 'SETTINGS_VIEW'],
      },
    },
  );
}
