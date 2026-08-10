import {
  ExplorerBulkAction,
  IconName,
  ItemSelection,
  PageHeaderActionType,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  useBulkCreateEpisodeSnapshotsMutation,
  useBulkDeleteEpisodesMutation,
  useBulkPublishEpisodesMutation,
  useBulkUnpublishEpisodesMutation,
} from '../../../generated/graphql';
import { bulkPublishNowNotification } from '../../../Util/Notifications/BulkPublishNowNotification';
import { bulkSnapshotCreateNotification } from '../../../Util/Notifications/BulkSnapshotCreateNotification';
import { bulkUnpublishNotification } from '../../../Util/Notifications/BulkUnpublishNotification';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { useEpisodesFilters } from '../EpisodeExplorerBase/EpisodeExplorer.filters';
import { EpisodeData } from '../EpisodeExplorerBase/EpisodeExplorer.types';

export function useEpisodesActions(): {
  readonly bulkActions: ExplorerBulkAction<EpisodeData>[];
} {
  const showNotification = useNotification();
  const { transformFilters } = useEpisodesFilters();

  const [bulkDeleteEpisodes] = useBulkDeleteEpisodesMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkPublishEpisodes] = useBulkPublishEpisodesMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkUnpublishEpisodes] = useBulkUnpublishEpisodesMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkCreateEpisodeSnapshots] = useBulkCreateEpisodeSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const createSnapshotsBulkAction: ExplorerBulkAction<EpisodeData> = {
    label: 'Create Snapshot(s)',
    onClick: async (arg?: ItemSelection<EpisodeData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkCreateEpisodeSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkCreateEpisodeSnapshots({
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
          response.data.createEpisodeSnapshots?.affectedIds?.length ?? 0;
        showNotification(bulkSnapshotCreateNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    icon: IconName.Snapshot,
    reloadData: true,
    showStartedNotification: false,
  };

  const publishNowBulkAction: ExplorerBulkAction<EpisodeData> = {
    label: 'Publish Now',
    onClick: async (arg?: ItemSelection<EpisodeData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkPublishEpisodes({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkPublishEpisodes({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
      if (response?.data) {
        const count = response.data.publishEpisodes?.affectedIds?.length ?? 0;
        showNotification(bulkPublishNowNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Publish,
    reloadData: true,
    showStartedNotification: false,
  };

  const unpublishNowBulkAction: ExplorerBulkAction<EpisodeData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<EpisodeData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkUnpublishEpisodes({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkUnpublishEpisodes({
            variables: {
              filter: {
                id: { in: arg.items?.map((item) => item.id) },
              },
            },
          });
          break;
      }
      if (response?.data) {
        const count = response.data.unpublishEpisodes?.affectedIds?.length ?? 0;
        showNotification(bulkUnpublishNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Unpublish,
    reloadData: true,
    showStartedNotification: false,
  };

  const deleteBulkAction: ExplorerBulkAction<EpisodeData> = {
    label: 'Delete',
    onClick: async (arg?: ItemSelection<EpisodeData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkDeleteEpisodes({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkDeleteEpisodes({
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
