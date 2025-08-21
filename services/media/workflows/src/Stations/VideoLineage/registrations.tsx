import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsContext } from '../../externals';
import { MediaIconName, MediaIcons } from '../../MediaIcons';
import { VideoLineageAnalyzer } from './VideoLineageAnalyzer';

export function register(app: PiletApi, extensions: Extensions): void {
  const videoLineageNav = {
    name: 'video-lineage',
    path: '/video-lineage',
    label: 'Video Lineage',
    icon: <MediaIcons icon={MediaIconName.Movie} />,
  };

  // Register navigation tile
  app.registerTile(
    {
      ...videoLineageNav,
      kind: 'home',
      type: 'large',
    },
    false,
  );

  // Register navigation item
  app.registerNavigationItem({
    ...videoLineageNav,
    categoryName: 'Analysis',
  });

  // Register main video lineage page
  app.registerPage(
    '/video-lineage',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <VideoLineageAnalyzer />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Video Lineage Analysis',
      permissions: { 'media-service': ['ADMIN', 'MOVIES_VIEW', 'MOVIES_EDIT'] },
    },
  );

  // Register video-specific lineage analysis page
  app.registerPage(
    '/video-lineage/:videoId',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <VideoLineageAnalyzer />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Video Analysis',
      permissions: { 'media-service': ['ADMIN', 'MOVIES_VIEW', 'MOVIES_EDIT'] },
    },
  );

  // Set route resolver for video lineage
  app.setRouteResolver(
    'video-lineage',
    (dynamicRouteSegments?: Record<string, string> | string) => {
      const videoId =
        typeof dynamicRouteSegments === 'string'
          ? dynamicRouteSegments
          : dynamicRouteSegments?.videoId;

      return videoId ? `/video-lineage/${videoId}` : '/video-lineage';
    },
  );
}
