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
import { useCollectionsFilters } from './Collections.filters';
import { CollectionData } from './Collections.types';

export function useCollectionsActions(): {
  readonly bulkActions: ExplorerBulkAction<CollectionData>[];
} {
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

  const [
    bulkCreateCollectionSnapshots,
  ] = useBulkCreateCollectionSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const createSnapshotsBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Create Snapshot(s)',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkCreateCollectionSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkCreateCollectionSnapshots({
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

  const publishNowBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Publish Now',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkPublishCollections({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkPublishCollections({
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

  const unpublishNowBulkAction: ExplorerBulkAction<CollectionData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<CollectionData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkUnpublishCollections({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkUnpublishCollections({
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
