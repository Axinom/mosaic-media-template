import { PermissionDefinition } from '@axinom/mosaic-id-guard';
import { synchronizePermissions } from '@axinom/mosaic-id-link-be';
import { Logger } from '@axinom/mosaic-service-common';
import { IngestItemTypeEnum } from 'zapatos/custom';
import { Config, requestServiceAccountToken } from '../common';
import { IngestMutateOperations, IngestReadOperations } from '../ingest';
import {
  PublishingIgnoreOperations,
  SnapshotsMutateOperations,
  SnapshotsReadOperations,
} from '../publishing';
import {
  AdministrationMutateOperations,
  AdministrationReadOperations,
} from './administration';
import {
  AgeRatingsReadOperations,
  AgeRatingsWriteOperations,
} from './ageratings';
import {
  CollectionDevOperations,
  CollectionsIgnoreOperations,
  CollectionsMutateOperations,
  CollectionsReadOperations,
  SelectEndpoints,
} from './collections';
import {
  ContentOwnersReadOperations,
  ContentOwnersWriteOperations,
} from './contentowners';
import { CountriesReadOperations, CountriesWriteOperations } from './countries';
import {
  MovieGenresMutateOperations,
  MovieGenresReadOperations,
  MovieIgnoreOperations,
  MoviesDevOperations,
  MoviesMutateOperations,
  MoviesReadOperations,
} from './movies';
import {
  EpisodesMutateOperations,
  EpisodesReadOperations,
  SeasonsMutateOperations,
  SeasonsReadOperations,
  TvShowGenresMutateOperations,
  TvShowGenresReadOperations,
  TvShowIgnoreOperations,
  TvshowsDevOperations,
  TvShowsMutateOperations,
  TvShowsReadOperations,
} from './tvshows';

/**
 * **IMPORTANT**
 *
 * This object holds the permissions which will be synchronized into the `ax-id-service` on startup.
 *
 * The `key` of the permission is used to recognize individual permissions. If the `key` doesn't already exist in the service,
 * such a permission will be created. If the service contains a `key` that is not listed in this object, it will be removed from
 * the service (including all relations of it i.e. User Roles Assignments, Service Account Assignments)
 *
 * Renaming a permission `key` is potentially a destructive operation and special care must be taken if it really needs to be changed.
 *
 * It is recommended to leave the permission `key` unchanged and use the `title` property to reflect the required name change.
 */
const permissions = [
  {
    key: 'ADMIN',
    title: 'Admin',
    gqlOperations: [
      ...MovieGenresReadOperations,
      ...MovieGenresMutateOperations,
      ...TvShowGenresReadOperations,
      ...TvShowGenresMutateOperations,
      ...MoviesReadOperations,
      ...MoviesMutateOperations,
      ...TvShowsReadOperations,
      ...TvShowsMutateOperations,
      ...SeasonsReadOperations,
      ...SeasonsMutateOperations,
      ...EpisodesReadOperations,
      ...EpisodesMutateOperations,
      ...CollectionsReadOperations,
      ...CollectionsMutateOperations,
      ...SnapshotsReadOperations,
      ...SnapshotsMutateOperations,
      ...IngestReadOperations,
      ...IngestMutateOperations,
      ...MoviesDevOperations,
      ...TvshowsDevOperations,
      ...CollectionDevOperations,
      ...AdministrationReadOperations,
      ...AdministrationMutateOperations,
    ],
  },
  {
    key: 'SETTINGS_READER',
    title: 'Settings: View',
    gqlOperations: [
      ...MovieGenresReadOperations,
      ...TvShowGenresReadOperations,
      ...AdministrationReadOperations,
    ],
  },
  {
    key: 'SETTINGS_EDITOR',
    title: 'Settings: Edit',
    gqlOperations: [
      ...MovieGenresReadOperations,
      ...MovieGenresMutateOperations,
      ...TvShowGenresReadOperations,
      ...TvShowGenresMutateOperations,
      ...AdministrationMutateOperations,
    ],
  },
  {
    key: 'MOVIE_READER',
    title: 'Movies: View',
    gqlOperations: [...MoviesReadOperations, ...SnapshotsReadOperations],
  },
  {
    key: 'MOVIE_EDITOR',
    title: 'Movies: Edit',
    gqlOperations: [
      ...MoviesReadOperations,
      ...MoviesMutateOperations,
      ...SnapshotsReadOperations,
      ...SnapshotsMutateOperations,
    ],
  },
  {
    key: 'TVSHOW_READER',
    title: 'TV Shows: View',
    gqlOperations: [
      ...TvShowsReadOperations,
      ...SeasonsReadOperations,
      ...EpisodesReadOperations,
    ],
  },
  {
    key: 'TVSHOW_EDITOR',
    title: 'TV Shows: Edit',
    gqlOperations: [
      ...TvShowsReadOperations,
      ...TvShowsMutateOperations,
      ...SeasonsReadOperations,
      ...SeasonsMutateOperations,
      ...EpisodesReadOperations,
      ...EpisodesMutateOperations,
    ],
  },
  {
    key: 'COLLECTION_READER',
    title: 'Collections: View',
    gqlOperations: [...CollectionsReadOperations],
  },
  {
    key: 'COLLECTION_EDITOR',
    title: 'Collections: Edit',
    gqlOperations: [
      ...CollectionsReadOperations,
      ...CollectionsMutateOperations,
      ...SelectEndpoints,
    ],
  },
  {
    key: 'INGEST_READER',
    title: 'Ingests: View',
    gqlOperations: [...IngestReadOperations],
  },
  {
    key: 'INGEST_EDITOR',
    title: 'Ingests: Edit',
    gqlOperations: [...IngestReadOperations, ...IngestMutateOperations],
  },
  {
    key: 'AGE_RATINGS_VIEW',
    title: 'AgeRatings: View',
    gqlOperations: [...AgeRatingsReadOperations],
  },
  {
    key: 'AGE_RATINGS_EDIT',
    title: 'AgeRatings: Edit',
    gqlOperations: [...AgeRatingsWriteOperations],
  },
  {
    key: 'CONTENT_OWNERS_VIEW',
    title: 'ContentOwners: View',
    gqlOperations: [...ContentOwnersReadOperations],
  },
  {
    key: 'CONTENT_OWNERS_EDIT',
    title: 'ContentOwners: Edit',
    gqlOperations: [...ContentOwnersWriteOperations],
  },
  {
    key: 'COUNTRIES_VIEW',
    title: 'Countries: View',
    gqlOperations: [...CountriesReadOperations],
  },
  {
    key: 'COUNTRIES_EDIT',
    title: 'Countries: Edit',
    gqlOperations: [...CountriesWriteOperations],
  },
] as const;

export const permissionDefinition: PermissionDefinition = {
  gqlOptions: {
    ignoredGqlOperations: [
      ...MovieIgnoreOperations,
      ...TvShowIgnoreOperations,
      ...CollectionsIgnoreOperations,
      ...PublishingIgnoreOperations,
    ],
  },

  permissions,
};
export type PermissionKey = typeof permissions[number]['key'];

export const ingestPermissionMappings: {
  type: IngestItemTypeEnum;
  permissions: PermissionKey[];
}[] = [
  { type: 'MOVIE', permissions: ['MOVIE_EDITOR', 'ADMIN'] },
  { type: 'TVSHOW', permissions: ['TVSHOW_EDITOR', 'ADMIN'] },
  { type: 'SEASON', permissions: ['TVSHOW_EDITOR', 'ADMIN'] },
  { type: 'EPISODE', permissions: ['TVSHOW_EDITOR', 'ADMIN'] },
];

/**
 * Synchronize service permissions with ID service
 */
export const syncPermissions = async (
  config: Pick<
    Config,
    | 'idServiceAuthBaseUrl'
    | 'serviceAccountClientId'
    | 'serviceAccountClientSecret'
    | 'serviceId'
  >,
  logger?: Logger,
): Promise<void> => {
  logger = logger ?? new Logger({ context: syncPermissions.name });
  const accessToken = await requestServiceAccountToken(config);
  const result = await synchronizePermissions(
    config.idServiceAuthBaseUrl,
    accessToken,
    config.serviceId,
    permissionDefinition,
  );

  logger.debug({
    message: 'Permissions successfully synchronized.',
    details: { ...result },
  });
};
