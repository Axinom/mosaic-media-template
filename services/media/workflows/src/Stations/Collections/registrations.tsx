import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsContext } from '../../externals';
import { MediaIconName } from '../../MediaIcons';
import { MediaIcons } from '../../MediaIcons/MediaIcons';
import { CollectionCreate } from './CollectionCreate/CollectionCreate';
import { CollectionDetails } from './CollectionDetails/CollectionDetails';
import { CollectionDetailsCrumb } from './CollectionDetails/CollectionDetailsCrumb';
import { CollectionEntityManagement } from './CollectionEntityManagement/CollectionEntityManagement';
import { CollectionImageManagement } from './CollectionImageManagement/CollectionImageManagement';
import { Collections } from './CollectionsExplorer/Collections';
import { CollectionSnapshotDetails } from './CollectionSnapshotDetails/CollectionSnapshotDetails';
import { CollectionSnapshotDetailsCrumb } from './CollectionSnapshotDetails/CollectionSnapshotDetailsCrumb';
import { CollectionSnapshots } from './CollectionSnapshots/CollectionSnapshots';

export function register(app: PiletApi, extensions: Extensions): void {
  const collectionsNav = {
    name: 'collections',
    path: '/collections',
    label: 'Collections',
    icon: <MediaIcons icon={MediaIconName.Collections} />,
  };
  app.registerTile(
    {
      ...collectionsNav,
      kind: 'home',
      type: 'small',
    },
    false,
  );

  app.registerNavigationItem({
    ...collectionsNav,
    categoryName: 'Curation',
  });

  app.registerPage('/collections', Collections, {
    breadcrumb: () => 'Collections',
    permissions: {
      'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
    },
  });

  app.registerPage('/collections/create', CollectionCreate, {
    breadcrumb: () => 'New Collection',
    permissions: {
      'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
    },
  });

  app.registerPage(
    '/collections/:collectionId',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <CollectionDetails />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: CollectionDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/collections/:collectionId/images',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <CollectionImageManagement />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Image Management',
      permissions: {
        'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/collections/:collectionId/entities',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <CollectionEntityManagement />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Entity Management',
      permissions: {
        'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/collections/:collectionId/snapshots',
    CollectionSnapshots,
    {
      breadcrumb: () => 'Publishing Snapshots',
      permissions: {
        'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/collections/:collectionId/snapshots/:snapshotId',
    CollectionSnapshotDetails,
    {
      breadcrumb: CollectionSnapshotDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
      },
    },
  );
}
