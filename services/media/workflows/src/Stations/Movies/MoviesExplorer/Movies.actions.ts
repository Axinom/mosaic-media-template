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
import { bulkPublishNowNotification } from '../../../Util/Notifications/BulkPublishNowNotification';
import { bulkSnapshotCreateNotification } from '../../../Util/Notifications/BulkSnapshotCreateNotification';
import { bulkUnpublishNotification } from '../../../Util/Notifications/BulkUnpublishNotification';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { useMoviesFilters } from '../MovieExplorerBase/MovieExplorer.filters';
import { MovieData } from '../MovieExplorerBase/MovieExplorer.types';

export function useMoviesActions(): {
  readonly bulkActions: ExplorerBulkAction<MovieData>[];
} {
  const showNotification = useNotification();
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
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkCreateMovieSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkCreateMovieSnapshots({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
      if (response?.data) {
        const count =
          response.data.createMovieSnapshots?.affectedIds?.length ?? 0;
        showNotification(bulkSnapshotCreateNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    icon: IconName.Snapshot,
    reloadData: true,
    showStartedNotification: false,
  };

  const publishNowBulkAction: ExplorerBulkAction<MovieData> = {
    label: 'Publish Now',
    onClick: async (arg?: ItemSelection<MovieData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkPublishMovies({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkPublishMovies({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
      if (response?.data) {
        const count = response.data.publishMovies?.affectedIds?.length ?? 0;
        showNotification(bulkPublishNowNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Publish,
    reloadData: true,
    showStartedNotification: false,
  };

  const unpublishNowBulkAction: ExplorerBulkAction<MovieData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<MovieData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkUnpublishMovies({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkUnpublishMovies({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
      if (response?.data) {
        const count = response.data.unpublishMovies?.affectedIds?.length ?? 0;
        showNotification(bulkUnpublishNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Unpublish,
    reloadData: true,
    showStartedNotification: false,
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
