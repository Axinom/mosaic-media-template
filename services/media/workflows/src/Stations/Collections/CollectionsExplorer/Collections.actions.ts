import {
  ExplorerBulkAction,
  IconName,
  ItemSelection,
  PageHeaderActionType,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  useBulkCreateCollectionSnapshotsMutation,
  useBulkDeleteCollectionsMutation,
  useBulkPublishCollectionsMutation,
  useBulkUnpublishCollectionsMutation,
} from '../../../generated/graphql';
import { bulkPublishNowNotification } from '../../../Util/Notifications/BulkPublishNowNotification';
import { bulkSnapshotCreateNotification } from '../../../Util/Notifications/BulkSnapshotCreateNotification';
import { bulkUnpublishNotification } from '../../../Util/Notifications/BulkUnpublishNotification';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { useCollectionsFilters } from './Collections.filters';
import { CollectionData } from './Collections.types';

export function useCollectionsActions(): {
  readonly bulkActions: ExplorerBulkAction<CollectionData>[];
} {
  const showNotification = useNotification();
  const { transformFilters } = useCollectionsFilters();

  const [bulkDeleteCollections] = useBulkDeleteCollectionsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkPublishCollections] = useBulkPublishCollectionsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkUnpublishCollections] = useBulkUnpublishCollectionsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkCreateCollectionSnapshots] =
    useBulkCreateCollectionSnapshotsMutation({
      client: client,
      fetchPolicy: 'no-cache',
    });

  const createSnapshotsBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Create Snapshot(s)',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkCreateCollectionSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkCreateCollectionSnapshots({
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
          response.data.createCollectionSnapshots?.affectedIds?.length ?? 0;
        showNotification(bulkSnapshotCreateNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    icon: IconName.Snapshot,
    reloadData: true,
    showStartedNotification: false
  };

  const publishNowBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Publish Now',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkPublishCollections({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkPublishCollections({
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
          response.data.publishCollections?.affectedIds?.length ?? 0;
        showNotification(bulkPublishNowNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Publish,
    reloadData: true,
    showStartedNotification: false
  };

  const unpublishNowBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      let response;
      switch (arg?.mode) {
        case 'SELECT_ALL':
          response = await bulkUnpublishCollections({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          response = await bulkUnpublishCollections({
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
          response.data.unpublishCollections?.affectedIds?.length ?? 0;
        showNotification(bulkUnpublishNotification(count));
      }
    },
    actionType: PageHeaderActionType.Context,
    confirmationMode: 'Simple',
    icon: IconName.Unpublish,
    reloadData: true,
    showStartedNotification: false
  };

  const deleteBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Delete',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkDeleteCollections({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkDeleteCollections({
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
