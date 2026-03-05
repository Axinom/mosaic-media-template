import {
  ExplorerBulkAction,
  IconName,
  ItemSelection,
  PageHeaderActionType,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  useBulkCreateTvShowSnapshotsMutation,
  useBulkDeleteTvShowsMutation,
  useBulkPublishTvShowsMutation,
  useBulkUnpublishTvShowsMutation,
} from '../../../generated/graphql';
import { bulkPublishNowNotification } from '../../../Util/Notifications/BulkPublishNowNotification';
import { bulkSnapshotCreateNotification } from '../../../Util/Notifications/BulkSnapshotCreateNotification';
import { bulkUnpublishNotification } from '../../../Util/Notifications/BulkUnpublishNotification';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { useTvShowsFilters } from '../TvShowExplorerBase/TvShowExplorer.filters';
import { TvShowData } from '../TvShowExplorerBase/TvShowExplorer.types';

export function useTvShowsActions(): {
  readonly bulkActions: ExplorerBulkAction<TvShowData>[];
} {
  const showNotification = useNotification();
  const { transformFilters } = useTvShowsFilters();

  const [bulkDeleteTvShows] = useBulkDeleteTvShowsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkPublishTvShows] = useBulkPublishTvShowsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkUnpublishTvShows] = useBulkUnpublishTvShowsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkCreateTvShowSnapshots] = useBulkCreateTvShowSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const createSnapshotsBulkAction: ExplorerBulkAction<TvShowData> = {
    label: 'Create Snapshot(s)',
    onClick: async (arg?: ItemSelection<TvShowData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkCreateTvShowSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkCreateTvShowSnapshots({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
      if (response?.data) {
        const count = response.data.createTvShowSnapshots?.affectedIds?.length ?? 0;
        showNotification(bulkSnapshotCreateNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    icon: IconName.Snapshot,
    reloadData: true,
    showStartedNotification: false,
  };

  const publishNowBulkAction: ExplorerBulkAction<TvShowData> = {
    label: 'Publish Now',
    onClick: async (arg?: ItemSelection<TvShowData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkPublishTvShows({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkPublishTvShows({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
      if (response?.data) {
        const count = response.data.publishTvShows?.affectedIds?.length ?? 0;
        showNotification(bulkPublishNowNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Publish,
    reloadData: true,
    showStartedNotification: false,
  };

  const unpublishNowBulkAction: ExplorerBulkAction<TvShowData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<TvShowData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkUnpublishTvShows({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkUnpublishTvShows({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
      if (response?.data) {
        const count = response.data.unpublishTvShows?.affectedIds?.length ?? 0;
        showNotification(bulkUnpublishNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Unpublish,
    reloadData: true,
    showStartedNotification: false,
  };

  const deleteBulkAction: ExplorerBulkAction<TvShowData> = {
    label: 'Delete',
    onClick: async (arg?: ItemSelection<TvShowData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkDeleteTvShows({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkDeleteTvShows({
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
