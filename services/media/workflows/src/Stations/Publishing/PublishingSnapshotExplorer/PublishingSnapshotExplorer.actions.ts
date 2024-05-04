import {
  ExplorerBulkAction,
  IconName,
  ItemSelection,
  PageHeaderActionType,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  EntityType,
  useBulkDeleteSnapshotsMutation,
} from '../../../generated/graphql';
import { usePublishingSnapshotFilters } from './PublishingSnapshotExplorer.filter';
import { SnapshotData } from './PublishingSnapshotExplorer.types';

export function usePublishingSnapshotActions(
  entityType: EntityType,
  entityId?: number,
): {
  readonly bulkActions: ExplorerBulkAction<SnapshotData>[];
} {
  const { transformFilters } = usePublishingSnapshotFilters();

  const [bulkDeleteSnapshots] = useBulkDeleteSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const deleteBulkAction: ExplorerBulkAction<SnapshotData> = {
    label: 'Delete',
    onClick: async (arg?: ItemSelection<SnapshotData>) => {
      const handeSelectAll = async (filters): Promise<void> => {
        const filter = {
          entityType: { equalTo: entityType },
          ...transformFilters(filters),
        };
        if (entityId !== undefined) {
          filter.entityId = { equalTo: entityId };
        }
        await bulkDeleteSnapshots({
          variables: {
            filter,
          },
        });
      };
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await handeSelectAll(arg.filters);
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
    bulkActions: [deleteBulkAction],
  };
}
