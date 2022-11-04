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
import { useEpisodesFilters } from '../EpisodeExplorerBase/EpisodeExplorer.filters';
import { EpisodeData } from '../EpisodeExplorerBase/EpisodeExplorer.types';

export function useEpisodesActions(): {
  readonly bulkActions: ExplorerBulkAction<EpisodeData>[];
} {
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
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkCreateEpisodeSnapshots({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkCreateEpisodeSnapshots({
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

  const publishNowBulkAction: ExplorerBulkAction<EpisodeData> = {
    label: 'Publish Now',
    onClick: async (arg?: ItemSelection<EpisodeData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkPublishEpisodes({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkPublishEpisodes({
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

  const unpublishNowBulkAction: ExplorerBulkAction<EpisodeData> = {
    label: 'Unpublish',
    onClick: async (arg?: ItemSelection<EpisodeData>) => {
      switch (arg?.mode) {
        case 'SELECT_ALL':
          await bulkUnpublishEpisodes({
            variables: { filter: transformFilters(arg.filters) },
          });
          break;
        case 'SINGLE_ITEMS':
          await bulkUnpublishEpisodes({
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
