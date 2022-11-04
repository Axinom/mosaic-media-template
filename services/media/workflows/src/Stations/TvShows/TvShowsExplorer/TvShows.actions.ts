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
import { useTvShowsFilters } from '../TvShowExplorerBase/TvShowExplorer.filters';
import { TvShowData } from '../TvShowExplorerBase/TvShowExplorer.types';

export function useTvShowsActions(): {
  readonly bulkActions: ExplorerBulkAction<TvShowData>[];
} {
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
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkCreateTvShowSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkCreateTvShowSnapshots({
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

  const publishNowBulkAction: ExplorerBulkAction<TvShowData> = {
    label: 'Publish Now',
    onClick: async (arg?: ItemSelection<TvShowData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkPublishTvShows({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkPublishTvShows({
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

  const unpublishNowBulkAction: ExplorerBulkAction<TvShowData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<TvShowData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkUnpublishTvShows({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkUnpublishTvShows({
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
