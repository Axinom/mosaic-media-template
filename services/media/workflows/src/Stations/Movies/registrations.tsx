import { registerLocalizationEntryPoints } from '@axinom/mosaic-managed-workflow-integration';
import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { Extensions, ExtensionsContext } from '../../externals';
import {
  mediaManagementParentName as parentName,
  settingsGroupName,
} from '../../index';
import { MediaIconName, MediaIcons } from '../../MediaIcons';
import { AgeRatings } from './AgeRatings/AgeRatings';
import { ContentOwners } from './ContentOwners/ContentOwners';
import { LanguageCreate } from './Languages/LanguageCreate/LanguageCreate';
import { LanguageDetails } from './Languages/LanguageDetails/LanguageDetails';
import { LanguageDetailsCrumb } from './Languages/LanguageDetails/LanguageDetailsCrumb';
import { Language } from './Languages/LanguageExplorer/Language';
import { MovieCollectionAssignment } from './MovieCollectionAssignment/MovieCollectionAssignment';
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
    name: 'movies',
    path: '/movies',
    label: 'Movies',
    icon: <MediaIcons icon={MediaIconName.Movie} />,
  };

  // Generate entry points to embedded localization stations
  registerLocalizationEntryPoints(
    [
      {
        root: '/movies/:movieId',
        entityIdParam: 'movieId',
        entityType: 'movie',
      },
      {
        root: '/settings/media/moviegenres/:genreId',
        entityIdParam: 'genreId',
        entityType: 'movie_genre',
      },
    ],
    app,
  );

  app.setRouteResolver(
    'movie-details',
    (dynamicRouteSegments?: Record<string, string> | string) => {
      const movieId =
        typeof dynamicRouteSegments === 'string'
          ? dynamicRouteSegments
          : dynamicRouteSegments?.movieId;

      return movieId ? `/movies/${movieId}` : undefined;
    },
  );

  app.setRouteResolver(
    'movie_genre-details',
    (_dynamicRouteSegments?: Record<string, string> | string) =>
      '/settings/media/moviegenres',
  );

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

  app.registerPage(
    '/movies/:movieId/CollectionsToMovie',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <MovieCollectionAssignment />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: () => 'Collection Assignment',
      permissions: {
        'media-service': ['ADMIN', 'COLLECTIONS_EDIT', 'COLLECTIONS_VIEW'],
      },
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

  const movieSettingsNav = {
    name: 'movie-genres',
    path: '/settings/media/moviegenres',
    label: 'Movie Genres',
    icon: <MediaIcons icon={MediaIconName.MovieGenres} />,
  };

  app.registerTile(
    {
      ...movieSettingsNav,
      kind: 'settings',
      groupName: settingsGroupName,
    },
    false,
  );

  app.registerNavigationItem({
    ...movieSettingsNav,
    parentName: parentName,
    categoryName: 'Settings',
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

  const ageRatingSettingsNav = {
    name: 'age-ratings',
    path: '/settings/media/ageratings',
    label: 'Age Ratings',
    icon: <MediaIcons icon={MediaIconName.MovieGenres} />,
  };

  app.registerTile(
    {
      ...ageRatingSettingsNav,
      kind: 'settings',
      groupName: settingsGroupName,
    },
    false,
  );

  app.registerNavigationItem({
    ...ageRatingSettingsNav,
    parentName: parentName,
    categoryName: 'Settings',
  });

  app.registerPage('/settings/media/ageratings', AgeRatings, {
    breadcrumb: () => 'Age Ratings',
    permissions: {
      'media-service': ['ADMIN', 'SETTINGS_EDIT', 'SETTINGS_VIEW'],
    },
  });

  const contentOwnersSettingsNav = {
    name: 'content-owners',
    path: '/settings/media/contentowners',
    label: 'Content Owners',
    icon: <MediaIcons icon={MediaIconName.MovieGenres} />,
  };

  app.registerTile(
    {
      ...contentOwnersSettingsNav,
      kind: 'settings',
      groupName: settingsGroupName,
    },
    false,
  );

  app.registerNavigationItem({
    ...contentOwnersSettingsNav,
    parentName: parentName,
    categoryName: 'Settings',
  });

  app.registerPage('/settings/media/contentowners', ContentOwners, {
    breadcrumb: () => 'Content Owners',
    permissions: {
      'media-service': ['ADMIN', 'SETTINGS_EDIT', 'SETTINGS_VIEW'],
    },
  });

  const languagesSettingsNav = {
    name: 'languages',
    path: '/settings/media/languages',
    label: 'Languages',
    icon: <MediaIcons icon={MediaIconName.MovieGenres} />,
  };

  app.registerTile(
    {
      ...languagesSettingsNav,
      kind: 'settings',
      groupName: settingsGroupName,
    },
    false,
  );

  app.registerNavigationItem({
    ...languagesSettingsNav,
    parentName: parentName,
    categoryName: 'Settings',
  });

  app.registerPage('/settings/media/languages', Language, {
    breadcrumb: () => 'Languages',
    permissions: {
      'media-service': ['ADMIN', 'SETTINGS_EDIT', 'SETTINGS_VIEW'],
    },
  });

  app.registerPage('/languages/create', LanguageCreate, {
    breadcrumb: () => 'New Language',
    permissions: {
      'media-service': ['ADMIN', 'SETTINGS_EDIT', 'SETTINGS_VIEW'],
    },
  });

  app.registerPage(
    '/languages/:languageId',
    () => (
      <ExtensionsContext.Provider value={extensions}>
        <LanguageDetails />
      </ExtensionsContext.Provider>
    ),
    {
      breadcrumb: LanguageDetailsCrumb,
      permissions: {
        'media-service': ['ADMIN', 'SETTINGS_VIEW', 'SETTINGS_EDIT'],
      },
    },
  );
}
