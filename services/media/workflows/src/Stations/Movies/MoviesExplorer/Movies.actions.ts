import {
  ExplorerBulkAction,
  IconName,
  ItemSelection,
  PageHeaderActionType,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  useBulkCreateMovieSnapshotsMutation,
  useBulkDeleteMoviesMutation,
  useBulkPublishMoviesMutation,
  useBulkUnpublishMoviesMutation,
} from '../../../generated/graphql';
import { useMoviesFilters } from '../MovieExplorerBase/MovieExplorer.filters';
import { MovieData } from '../MovieExplorerBase/MovieExplorer.types';

export function useMoviesActions(): {
  readonly bulkActions: ExplorerBulkAction<MovieData>[];
} {
  const { transformFilters } = useMoviesFilters();

  const [bulkDeleteMovies] = useBulkDeleteMoviesMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkPublishMovies] = useBulkPublishMoviesMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkUnpublishMovies] = useBulkUnpublishMoviesMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkCreateMovieSnapshots] = useBulkCreateMovieSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const createSnapshotsBulkAction: ExplorerBulkAction<MovieData> = {
    label: 'Create Snapshot(s)',
    onClick: async (arg?: ItemSelection<MovieData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkCreateMovieSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkCreateMovieSnapshots({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
    },
    actionType: PageHeaderActionType.Context,
    icon: IconName.Snapshot,
    reloadData: true,
  };

  const publishNowBulkAction: ExplorerBulkAction<MovieData> = {
    label: 'Publish Now',
    onClick: async (arg?: ItemSelection<MovieData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkPublishMovies({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkPublishMovies({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Publish,
    reloadData: true,
  };

  const unpublishNowBulkAction: ExplorerBulkAction<MovieData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<MovieData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkUnpublishMovies({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkUnpublishMovies({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Unpublish,
    reloadData: true,
  };

  const deleteBulkAction: ExplorerBulkAction<MovieData> = {
    label: 'Delete',
    onClick: async (arg?: ItemSelection<MovieData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkDeleteMovies({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkDeleteMovies({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Delete,
    reloadData: true,
  };

  return {
    bulkActions: [
      createSnapshotsBulkAction,
      publishNowBulkAction,
      unpublishNowBulkAction,
      deleteBulkAction,
    ],
  };
}
