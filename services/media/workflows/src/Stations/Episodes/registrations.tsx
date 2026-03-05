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
import { EpisodeCreate } from './EpisodeCreate/EpisodeCreate';
import { EpisodeDetails } from './EpisodeDetails/EpisodeDetails';
import { EpisodeDetailsCrumb } from './EpisodeDetails/EpisodeDetailsCrumb';
import { EpisodeImageManagement } from './EpisodeImageManagement/EpisodeImageManagement';
import { EpisodeLicensing } from './EpisodeLicensing/EpisodeLicensing';
import { EpisodeLicensingCreate } from './EpisodeLicensingCreate/EpisodeLicensingCreate';
import { EpisodeLicensingDetails } from './EpisodeLicensingDetails/EpisodeLicensingDetails';
import { Episodes } from './EpisodesExplorer/Episodes';
import { EpisodeSnapshotDetails } from './EpisodeSnapshotDetails/EpisodeSnapshotDetails';
import { EpisodeSnapshotDetailsCrumb } from './EpisodeSnapshotDetails/EpisodeSnapshotDetailsCrumb';
import { EpisodeSnapshots } from './EpisodeSnapshots/EpisodeSnapshots';
import { EpisodeVideoManagement } from './EpisodeVideoManagement/EpisodeVideoManagement';

export function register(app: PiletApi, extensions: Extensions): void {
  const episodesNav = {
    name: 'episodes',
    path: '/episodes',
    label: 'Episodes',
    icon: <MediaIcons icon={MediaIconName.Episodes} />,
  };

  // Generate entry points to embedded localization stations
  if (piletConfig.isLocalizationEnabled) {
    registerLocalizationEntryPoints([
      {
        root: '/episodes/:episodeId',
        entityIdParam: 'episodeId',
        entityType: 'episode',
      },
    ]);
  }

  app.setRouteResolver('episode-localizations', (dynamicRouteSegments) => {
    const localizationPath = getLocalizationEntryPoint('episode');
    const episodeId =
      typeof dynamicRouteSegments === 'string'
        ? dynamicRouteSegments
        : dynamicRouteSegments?.episodeId;

    return episodeId
      ? localizationPath?.replace(/:episodeId/g, String(episodeId))
      : undefined;
  });

  app.setRouteResolver(
    'episode-details',
    (
      dynamicRouteSegments?: Record<string, string> | string,
    ): string | undefined => {
      const episodeId =
        typeof dynamicRouteSegments === 'string'
          ? dynamicRouteSegments
          : dynamicRouteSegments?.episodeId;

      return episodeId ? `/episodes/${episodeId}` : undefined;
    },
  );

  app.registerTile(
    {
      ...episodesNav,
      kind: 'home',
      type: 'large',
    },
    false,
  );

  app.registerNavigationItem({
    ...episodesNav,
    categoryName: 'Content',
  });

  app.registerPage(
    '/episodes',
    () => (
      <ExtensionsProvider value={extensions}>
        <NotificationProvider value={app.showNotification}>
          <Episodes />
        </NotificationProvider>
      </ExtensionsProvider>
    ),
    {
      breadcrumb: () => 'Episodes',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage('/episodes/create', EpisodeCreate, {
    breadcrumb: () => 'New Episode',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/episodes/:episodeId',
    () => (
      <ExtensionsProvider value={extensions}>
        <NotificationProvider value={app.showNotification}>
          <EpisodeDetails />
        </NotificationProvider>
      </ExtensionsProvider>
    ),
    {
      breadcrumb: EpisodeDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage('/episodes/:episodeId/licenses', EpisodeLicensing, {
    breadcrumb: () => 'Licensing',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/episodes/:episodeId/images',
    () => (
      <ExtensionsProvider value={extensions}>
        <EpisodeImageManagement />
      </ExtensionsProvider>
    ),
    {
      breadcrumb: () => 'Image Management',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/episodes/:episodeId/licenses/create',
    EpisodeLicensingCreate,
    {
      breadcrumb: () => 'New License',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/episodes/:episodeId/licenses/:episodesLicenseId',
    EpisodeLicensingDetails,
    {
      breadcrumb: () => 'Licensing Details',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/episodes/:episodeId/videos',
    () => (
      <ExtensionsProvider value={extensions}>
        <EpisodeVideoManagement />
      </ExtensionsProvider>
    ),
    {
      breadcrumb: () => 'Video Management',
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );

  app.registerPage('/episodes/:episodeId/snapshots', EpisodeSnapshots, {
    breadcrumb: () => 'Publishing Snapshots',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/episodes/:episodeId/snapshots/:snapshotId',
    EpisodeSnapshotDetails,
    {
      breadcrumb: EpisodeSnapshotDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'],
      },
    },
  );
}
