import {
  getLocalizationEntryPoint,
  registerLocalizationEntryPoints,
} from '@axinom/mosaic-managed-workflow-integration';
import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsProvider } from '../../externals';
import { NotificationProvider } from '../../Util/Notifications/NotificationContext';
import { MediaIconName, MediaIcons } from '../../MediaIcons';
import { piletConfig } from '../../piletConfig';
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
  const seasonsNav = {
    name: 'seasons',
    path: '/seasons',
    label: 'Seasons',
    icon: <MediaIcons icon={MediaIconName.Seasons} />,
  };

  // Generate entry points to embedded localization stations
  if (piletConfig.isLocalizationEnabled) {
    registerLocalizationEntryPoints([
      {
        root: '/seasons/:seasonId',
        entityIdParam: 'seasonId',
        entityType: 'season',
      },
    ]);
  }

  app.setRouteResolver('season-localizations', (dynamicRouteSegments) => {
    const localizationPath = getLocalizationEntryPoint('season');
    const seasonId =
      typeof dynamicRouteSegments === 'string'
        ? dynamicRouteSegments
        : dynamicRouteSegments?.seasonId;

    return seasonId
      ? localizationPath?.replace(/:seasonId/g, String(seasonId))
      : undefined;
  });

  app.setRouteResolver(
    'season-details',
    (dynamicRouteSegments?: Record<string, string> | string) => {
      const dynamicRouteSegmentsString =
        typeof dynamicRouteSegments === 'string'
          ? dynamicRouteSegments
          : dynamicRouteSegments?.seasonId;

      return dynamicRouteSegmentsString
        ? `/seasons/${dynamicRouteSegmentsString}`
        : undefined;
    },
  );

  app.registerTile(
    {
      ...seasonsNav,
      kind: 'home',
      type: 'large',
    },
    false,
  );

  app.registerNavigationItem({
    ...seasonsNav,
    categoryName: 'Content',
  });

  app.registerPage(
    '/seasons',
    () => (
      <ExtensionsProvider value={extensions}>
        <NotificationProvider value={app.showNotification}>
          <Seasons />
        </NotificationProvider>
      </ExtensionsProvider>
    ),
    {
      breadcrumb: () => 'Seasons',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage('/seasons/create', SeasonCreate, {
    breadcrumb: () => 'New Season',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/seasons/:seasonId',
    () => (
      <ExtensionsProvider value={extensions}>
        <NotificationProvider value={app.showNotification}>
          <SeasonDetails />
        </NotificationProvider>
      </ExtensionsProvider>
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
      <ExtensionsProvider value={extensions}>
        <SeasonVideoManagement />
      </ExtensionsProvider>
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
      <ExtensionsProvider value={extensions}>
        <SeasonImageManagement />
      </ExtensionsProvider>
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
