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
  CollectionDevOperations,
  CollectionsIgnoreOperations,
  CollectionsMutateOperations,
  CollectionsReadOperations,
  SelectEndpoints,
} from './collections';
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
    ],
  },
  {
    key: 'SETTINGS_VIEW',
    title: 'Settings: View',
    gqlOperations: [
      ...MovieGenresReadOperations,
      ...TvShowGenresReadOperations,
    ],
  },
  {
    key: 'SETTINGS_EDIT',
    title: 'Settings: Edit',
    gqlOperations: [
      ...MovieGenresReadOperations,
      ...MovieGenresMutateOperations,
      ...TvShowGenresReadOperations,
      ...TvShowGenresMutateOperations,
    ],
  },
  {
    key: 'MOVIES_VIEW',
    title: 'Movies: View',
    gqlOperations: [...MoviesReadOperations, ...SnapshotsReadOperations],
  },
  {
    key: 'MOVIES_EDIT',
    title: 'Movies: Edit',
    gqlOperations: [
      ...MoviesReadOperations,
      ...MoviesMutateOperations,
      ...SnapshotsReadOperations,
      ...SnapshotsMutateOperations,
    ],
  },
  {
    key: 'TVSHOWS_VIEW',
    title: 'TV Shows: View',
    gqlOperations: [
      ...TvShowsReadOperations,
      ...SeasonsReadOperations,
      ...EpisodesReadOperations,
    ],
  },
  {
    key: 'TVSHOWS_EDIT',
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
    key: 'COLLECTIONS_VIEW',
    title: 'Collections: View',
    gqlOperations: [...CollectionsReadOperations],
  },
  {
    key: 'COLLECTIONS_EDIT',
    title: 'Collections: Edit',
    gqlOperations: [
      ...CollectionsReadOperations,
      ...CollectionsMutateOperations,
      ...SelectEndpoints,
    ],
  },
  {
    key: 'INGESTS_VIEW',
    title: 'Ingests: View',
    gqlOperations: [...IngestReadOperations],
  },
  {
    key: 'INGESTS_EDIT',
    title: 'Ingests: Edit',
    gqlOperations: [...IngestReadOperations, ...IngestMutateOperations],
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
  { type: 'MOVIE', permissions: ['MOVIES_EDIT', 'ADMIN'] },
  { type: 'TVSHOW', permissions: ['TVSHOWS_EDIT', 'ADMIN'] },
  { type: 'SEASON', permissions: ['TVSHOWS_EDIT', 'ADMIN'] },
  { type: 'EPISODE', permissions: ['TVSHOWS_EDIT', 'ADMIN'] },
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
