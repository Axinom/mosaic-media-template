import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsContext } from '../../externals';
import { MediaIconName, MediaIcons } from '../../MediaIcons';
import { SeasonCreate } from './SeasonCreate/SeasonCreate';
import { SeasonDetails } from './SeasonDetails/SeasonDetails';
import { SeasonDetailsCrumb } from './SeasonDetails/SeasonDetailsCrumb';
import { SeasonEpisodeManagement } from './SeasonEpisodeManagement/SeasonEpisodeManagement';
import { SeasonImageManagement } from './SeasonImageManagement/SeasonImageManagement';
import { SeasonLicensing } from './SeasonLicensing/SeasonLicensing';
import { SeasonLicensingCreate } from './SeasonLicensingCreate/SeasonLicensingCreate';
import { SeasonLicensingDetails } from './SeasonLicensingDetails/SeasonLicensingDetails';
import { Seasons } from './SeasonsExplorer/Seasons';
import { SeasonSnapshotDetails } from './SeasonSnapshotDetails/SeasonSnapshotDetails';
import { SeasonSnapshotDetailsCrumb } from './SeasonSnapshotDetails/SeasonSnapshotDetailsCrumb';
import { SeasonSnapshots } from './SeasonSnapshots/SeasonSnapshots';
import { SeasonVideoManagement } from './SeasonVideoManagement/SeasonVideoManagement';

export function register(app: PiletApi, extensions: Extensions): void {
  app.registerTile({
    kind: 'home',
    path: '/seasons',
    label: 'Seasons',
    icon: <MediaIcons icon={MediaIconName.Seasons} />,
    type: 'large',
  });

  app.registerPage('/seasons', Seasons, {
    breadcrumb: () => 'Seasons',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage('/seasons/create', SeasonCreate, {
    breadcrumb: () => 'New Season',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/seasons/:seasonId',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <SeasonDetails />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: SeasonDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage('/seasons/:seasonId/licenses', SeasonLicensing, {
    breadcrumb: () => 'Licensing',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/seasons/:seasonId/videos',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <SeasonVideoManagement />
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
    '/seasons/:seasonId/images',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <SeasonImageManagement />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Image Management',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage('/seasons/:seasonId/episodes', SeasonEpisodeManagement, {
    breadcrumb: () => 'Episode Management',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/seasons/:seasonId/licenses/create',
    SeasonLicensingCreate,
    {
      breadcrumb: () => 'New License',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/seasons/:seasonId/licenses/:seasonsLicenseId',
    SeasonLicensingDetails,
    {
      breadcrumb: () => 'Licensing Details',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage('/seasons/:seasonId/snapshots', SeasonSnapshots, {
    breadcrumb: () => 'Publishing Snapshots',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/seasons/:seasonId/snapshots/:snapshotId',
    SeasonSnapshotDetails,
    {
      breadcrumb: SeasonSnapshotDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );
}
