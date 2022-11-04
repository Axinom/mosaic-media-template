import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions } from '../../externals';
import { MediaIconName } from '../../MediaIcons';
import { MediaIcons } from '../../MediaIcons/MediaIcons';
import { SnapshotRegistry } from './SnapshotRegistryExplorer/SnapshotRegistry';

export function register(app: PiletApi, _extensions: Extensions): void {
  app.registerTile({
    kind: 'home',
    path: '/snapshots',
    label: 'Snapshot Registry',
    icon: <MediaIcons icon={MediaIconName.Snapshots} />,
    type: 'small',
  });

  app.registerPage('/snapshots', SnapshotRegistry, {
    breadcrumb: () => 'Snapshot Registry',
    permissions: {
      'media-service': ['MOVIES_VIEW', 'TVSHOWS_VIEW', 'COLLECTIONS_VIEW'],
    },
  });
}
