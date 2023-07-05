import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions } from '../../externals';
import { MediaIconName } from '../../MediaIcons';
import { MediaIcons } from '../../MediaIcons/MediaIcons';
import { SnapshotRegistry } from './SnapshotRegistryExplorer/SnapshotRegistry';

export function register(app: PiletApi, _extensions: Extensions): void {
  const snapshotsNav = {
    name: 'snapshots',
    path: '/snapshots',
    label: 'Snapshot Registry',
    icon: <MediaIcons icon={MediaIconName.Snapshots} />,
  };

  app.registerTile(
    {
      ...snapshotsNav,
      kind: 'home',
      type: 'small',
    },
    false,
  );

  app.registerNavigationItem({
    ...snapshotsNav,
    categoryName: 'Processing',
  });

  app.registerPage('/snapshots', SnapshotRegistry, {
    breadcrumb: () => 'Snapshot Registry',
    permissions: {
      'media-service': ['MOVIES_VIEW', 'TVSHOWS_VIEW', 'COLLECTIONS_VIEW'],
    },
  });
}
