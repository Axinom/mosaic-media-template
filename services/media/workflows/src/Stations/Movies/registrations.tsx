import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsContext } from '../../externals';
import { settingsGroupName } from '../../index';
import { MediaIconName, MediaIcons } from '../../MediaIcons';
import { MovieCreate } from './MovieCreate/MovieCreate';
import { MovieDetails } from './MovieDetails/MovieDetails';
import { MovieDetailsCrumb } from './MovieDetails/MovieDetailsCrumb';
import { MovieGenres } from './MovieGenres/MovieGenres';
import { MovieGenresSnapshotDetails } from './MovieGenresSnapshotDetails/MovieGenresSnapshotDetails';
import { MovieGenreSnapshotDetailsCrumb } from './MovieGenresSnapshotDetails/MovieGenresSnapshotDetailsCrumb';
import { MovieGenresSnapshots } from './MovieGenresSnapshots/MovieGenresSnapshots';
import { MovieImageManagement } from './MovieImageManagement/MovieImageManagement';
import { MovieLicensing } from './MovieLicensing/MovieLicensing';
import { MovieLicensingCreate } from './MovieLicensingCreate/MovieLicensingCreate';
import { MovieLicensingDetails } from './MovieLicensingDetails/MovieLicensingDetails';
import { Movies } from './MoviesExplorer/Movies';
import { MovieSnapshotDetails } from './MovieSnapshotDetails/MovieSnapshotDetails';
import { MovieSnapshotDetailsCrumb } from './MovieSnapshotDetails/MovieSnapshotDetailsCrumb';
import { MovieSnapshots } from './MovieSnapshots/MovieSnapshots';
import { MovieVideoManagement } from './MovieVideoManagement/MovieVideoManagement';

export function register(app: PiletApi, extensions: Extensions): void {
  const moviesNav = {
    path: '/movies',
    label: 'Movies',
    icon: <MediaIcons icon={MediaIconName.Movie} />,
  };

  app.registerTile(
    {
      ...moviesNav,
      kind: 'home',
      type: 'large',
    },
    false,
  );

  app.registerNavigationItem({
    ...moviesNav,
    categoryName: 'Content',
  });

  app.registerPage('/movies', Movies, {
    breadcrumb: () => 'Movies',
    permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
  });
  app.registerPage('/movies/create', MovieCreate, {
    breadcrumb: () => 'New Movie',
    permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
  });

  app.registerPage(
    '/movies/:movieId',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <MovieDetails />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: MovieDetailsCrumb,
      permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
    },
  );

  app.registerPage('/movies/:movieId/licenses', MovieLicensing, {
    breadcrumb: () => 'Licensing',
    permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
  });

  app.registerPage('/movies/:movieId/licenses/create', MovieLicensingCreate, {
    breadcrumb: () => 'New License',
    permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
  });

  app.registerPage(
    '/movies/:movieId/licenses/:moviesLicenseId',
    MovieLicensingDetails,
    {
      breadcrumb: () => 'Licensing Details',
      permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
    },
  );

  app.registerPage(
    '/movies/:movieId/videos',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <MovieVideoManagement />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Video Management',
      permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
    },
  );

  app.registerPage(
    '/movies/:movieId/images',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <MovieImageManagement />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Image Management',
      permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
    },
  );

  app.registerPage('/movies/:movieId/snapshots', MovieSnapshots, {
    breadcrumb: () => 'Publishing Snapshots',
    permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
  });

  app.registerPage(
    '/movies/:movieId/snapshots/:snapshotId',
    MovieSnapshotDetails,
    {
      breadcrumb: MovieSnapshotDetailsCrumb,
      permissions: { 'media-service': ['ADMIN', 'MOVIES_EDIT', 'MOVIES_VIEW'] },
    },
  );

  app.registerTile({
    kind: 'settings',
    groupName: settingsGroupName,
    path: '/settings/media/moviegenres',
    label: 'Movie Genres',
    icon: <MediaIcons icon={MediaIconName.MovieGenres} />,
  });

  app.registerPage('/settings/media/moviegenres', MovieGenres, {
    breadcrumb: () => 'Movie Genres',
    permissions: {
      'media-service': ['ADMIN', 'SETTINGS_EDIT', 'SETTINGS_VIEW'],
    },
  });

  app.registerPage(
    '/settings/media/moviegenres/snapshots',
    MovieGenresSnapshots,
    {
      breadcrumb: () => 'Publishing Snapshots',
      permissions: {
        'media-service': ['ADMIN', 'SETTINGS_EDIT', 'SETTINGS_VIEW'],
      },
    },
  );

  app.registerPage(
    '/settings/media/moviegenres/snapshots/:snapshotId',
    MovieGenresSnapshotDetails,
    {
      breadcrumb: MovieGenreSnapshotDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'SETTINGS_EDIT', 'SETTINGS_VIEW'],
      },
    },
  );
}
