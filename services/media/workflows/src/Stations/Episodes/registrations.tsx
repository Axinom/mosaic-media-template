import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsContext } from '../../externals';
import { MediaIconName, MediaIcons } from '../../MediaIcons';
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
  app.registerTile({
    kind: 'home',
    path: '/episodes',
    label: 'Episodes',
    icon: <MediaIcons icon={MediaIconName.Episodes} />,
    type: 'large',
  });

  app.registerPage('/episodes', Episodes, {
    breadcrumb: () => 'Episodes',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage('/episodes/create', EpisodeCreate, {
    breadcrumb: () => 'New Episode',
    permissions: { 'media-service': ['ADMIN', 'TVSHOWS_EDIT', 'TVSHOWS_VIEW'] },
  });

  app.registerPage(
    '/episodes/:episodeId',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <EpisodeDetails />
      </ExtensionsContext.Provider>
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
      <ExtensionsContext.Provider value={extensions}>
        <EpisodeImageManagement />
      </ExtensionsContext.Provider>
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
      <ExtensionsContext.Provider value={extensions}>
        <EpisodeVideoManagement />
      </ExtensionsContext.Provider>
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
