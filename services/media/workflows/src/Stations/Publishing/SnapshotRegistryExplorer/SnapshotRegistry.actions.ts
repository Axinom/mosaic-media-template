import {
  ExplorerBulkAction,
  IconName,
  ItemSelection,
  PageHeaderActionType,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  useBulkDeleteSnapshotsMutation,
  useBulkPublishSnapshotsMutation,
  useBulkRecreateSnapshotsMutation,
  useBulkUnpublishSnapshotsMutation,
} from '../../../generated/graphql';
import { useSnapshotRegistryFilters } from './SnapshotRegistry.filters';
import { SnapshotData } from './SnapshotRegistry.types';

export function useSnapshotRegistryActions(): {
  readonly bulkActions: ExplorerBulkAction<SnapshotData>[];
} {
  const { transformFilters } = useSnapshotRegistryFilters();

  const [bulkDeleteSnapshots] = useBulkDeleteSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkPublishSnapshots] = useBulkPublishSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkUnpublishSnapshots] = useBulkUnpublishSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const [bulkRecreateSnapshots] = useBulkRecreateSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const snapshotBulkAction: ExplorerBulkAction<SnapshotData> = {
    label: 'Recreate Snapshot(s)',
    onClick: async (arg?: ItemSelection<SnapshotData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkRecreateSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkRecreateSnapshots({
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
    icon: IconName.Snapshot,
    reloadData: true,
  };

  const publishBulkAction: ExplorerBulkAction<SnapshotData> = {
    label: 'Publish',
    onClick: async (arg?: ItemSelection<SnapshotData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkPublishSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkPublishSnapshots({
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

  const unpublishBulkAction: ExplorerBulkAction<SnapshotData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<SnapshotData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkUnpublishSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkUnpublishSnapshots({
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

  const deleteBulkAction: ExplorerBulkAction<SnapshotData> = {
    label: 'Delete',
    onClick: async (arg?: ItemSelection<SnapshotData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkDeleteSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkDeleteSnapshots({
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
      snapshotBulkAction,
      publishBulkAction,
      unpublishBulkAction,
      deleteBulkAction,
    ],
  };
}
