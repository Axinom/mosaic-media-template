import {
  ExplorerBulkAction,
  IconName,
  ItemSelection,
  PageHeaderActionType,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  useBulkCreateSeasonSnapshotsMutation,
  useBulkDeleteSeasonsMutation,
  useBulkPublishSeasonsMutation,
  useBulkUnpublishSeasonsMutation,
} from '../../../generated/graphql';
import { bulkPublishNowNotification } from '../../../Util/Notifications/BulkPublishNowNotification';
import { bulkSnapshotCreateNotification } from '../../../Util/Notifications/BulkSnapshotCreateNotification';
import { bulkUnpublishNotification } from '../../../Util/Notifications/BulkUnpublishNotification';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { useSeasonsFilters } from '../SeasonExplorerBase/SeasonExplorer.filters';
import { SeasonData } from '../SeasonExplorerBase/SeasonExplorer.types';

export function useSeasonsActions(): {
  readonly bulkActions: ExplorerBulkAction<SeasonData>[];
} {
  const showNotification = useNotification();
  const { transformFilters } = useSeasonsFilters();

  const [bulkDeleteSeasons] = useBulkDeleteSeasonsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkPublishSeasons] = useBulkPublishSeasonsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkUnpublishSeasons] = useBulkUnpublishSeasonsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkCreateSeasonSnapshots] = useBulkCreateSeasonSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const createSnapshotsBulkAction: ExplorerBulkAction<SeasonData> = {
    label: 'Create Snapshot(s)',
    onClick: async (arg?: ItemSelection<SeasonData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkCreateSeasonSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkCreateSeasonSnapshots({
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
          response.data.createSeasonSnapshots?.affectedIds?.length ?? 0;
        showNotification(bulkSnapshotCreateNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    icon: IconName.Snapshot,
    reloadData: true,
    showStartedNotification: false,
  };

  const publishNowBulkAction: ExplorerBulkAction<SeasonData> = {
    label: 'Publish Now',
    onClick: async (arg?: ItemSelection<SeasonData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkPublishSeasons({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkPublishSeasons({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
      if (response?.data) {
        const count = response.data.publishSeasons?.affectedIds?.length ?? 0;
        showNotification(bulkPublishNowNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Publish,
    reloadData: true,
    showStartedNotification: false,
  };

  const unpublishNowBulkAction: ExplorerBulkAction<SeasonData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<SeasonData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkUnpublishSeasons({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkUnpublishSeasons({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
      if (response?.data) {
        const count = response.data.unpublishSeasons?.affectedIds?.length ?? 0;
        showNotification(bulkUnpublishNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Unpublish,
    reloadData: true,
    showStartedNotification: false,
  };

  const deleteBulkAction: ExplorerBulkAction<SeasonData> = {
    label: 'Delete',
    onClick: async (arg?: ItemSelection<SeasonData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkDeleteSeasons({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkDeleteSeasons({
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
