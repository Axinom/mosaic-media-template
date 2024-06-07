import {
  ActionData,
  Column,
  DateRenderer,
  ExplorerDataProvider,
  IconName,
  NavigationExplorer,
  sortToPostGraphileOrderBy,
} from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EntityType,
  SnapshotsDocument,
  SnapshotsMutatedDocument,
  SnapshotsMutatedSubscription,
  SnapshotsOrderBy,
  SnapshotsQuery,
  SnapshotsQueryVariables,
  SnapshotSubscriptionEventKey,
  useBulkRecreateSnapshotsMutation,
  useDeleteSnapshotMutation,
  usePublishSnapshotMutation,
  useUnpublishSnapshotMutation,
} from '../../../generated/graphql';
import { ValidationResultsRenderer } from '../../../Util/PublishingSnapshots/ValidationResultsRenderer/ValidationResultsRenderer';
import { StringEnumRenderer } from '../../../Util/StringEnumRenderer/StringEnumRenderer';
import { useSnapshotRegistryActions } from './SnapshotRegistry.actions';
import { useSnapshotRegistryFilters } from './SnapshotRegistry.filters';
import { SnapshotData } from './SnapshotRegistry.types';

export const SnapshotRegistry: React.FC = () => {
  const { filterOptions, transformFilters } = useSnapshotRegistryFilters();
  const { bulkActions } = useSnapshotRegistryActions();

  // TODO: introduce a separate mutation for recreate snapshots for individual items
  const [bulkRecreateSnapshots] = useBulkRecreateSnapshotsMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });
  const [publishSnapshotMutation] = usePublishSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [unpublishSnapshotMutation] = useUnpublishSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [deleteSnapshotMutation] = useDeleteSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const history = useHistory();

  // Columns
  const explorerColumns: Column<SnapshotData>[] = [
    {
      propertyName: 'entityType',
      label: 'Entity Type',
      render: StringEnumRenderer,
    },
    { propertyName: 'entityTitle', label: 'Title' },
    { propertyName: 'jobId', label: 'Operation Id' },
    {
      propertyName: 'createdDate',
      label: 'Created At',
      render: DateRenderer,
    },
    { propertyName: 'createdUser', label: 'Created By' },
    {
      propertyName: 'snapshotValidationResults',
      label: 'Validation Result',
      size: '2fr',
      sortable: false,
      render: ValidationResultsRenderer,
    },
    {
      propertyName: 'snapshotState',
      label: 'Snapshot State',
      render: StringEnumRenderer,
    },
    {
      propertyName: 'updatedDate',
      label: 'State Changed At',
      render: DateRenderer,
    },
    { propertyName: 'updatedUser', label: 'State Changed By' },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<SnapshotData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      const result = await client.query<
        SnapshotsQuery,
        SnapshotsQueryVariables
      >({
        query: SnapshotsDocument,
        variables: {
          filter: transformFilters(filters),
          orderBy: sortToPostGraphileOrderBy(sorting, SnapshotsOrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'network-only',
      });

      return {
        data: result.data.filtered?.nodes ?? [],
        totalCount: result.data.nonFiltered?.totalCount as number,
        filteredCount: result.data.filtered?.totalCount as number,
        hasMoreData: result.data.filtered?.pageInfo.hasNextPage || false,
        pagingInformation: result.data.filtered?.pageInfo.endCursor,
      };
    },
    connect: ({ change, add, remove }) => {
      const subscription = client
        .subscribe<SnapshotsMutatedSubscription>({
          query: SnapshotsMutatedDocument,
        })
        .subscribe((e) => {
          switch (e.data?.snapshotMutated?.eventKey) {
            case SnapshotSubscriptionEventKey.SnapshotChanged:
              if (e.data.snapshotMutated.snapshot) {
                change(
                  e.data.snapshotMutated.id,
                  e.data.snapshotMutated.snapshot,
                );
              }
              break;
            case SnapshotSubscriptionEventKey.SnapshotDeleted:
              remove(e.data.snapshotMutated.id);
              break;
            case SnapshotSubscriptionEventKey.SnapshotCreated:
              if (e.data.snapshotMutated.snapshot) {
                add(e.data.snapshotMutated.snapshot);
              }
              break;
          }
        });

      return () => {
        subscription.unsubscribe();
      };
    },
  };

  const generateInlineMenuActions: (data: SnapshotData) => ActionData[] = (
    data,
  ) => {
    return [
      {
        label: 'Recreate Snapshot',
        onActionSelected: async () => {
          await bulkRecreateSnapshots({
            variables: {
              filter: {
                id: { in: [data.id] },
              },
            },
          });
          history.push('/snapshots');
        },
        icon: IconName.Snapshot,
      },
      {
        label: 'Publish Now',
        onActionSelected: async () => {
          await publishSnapshotMutation({ variables: { id: data.id } });
          history.push('/snapshots');
        },
        icon: IconName.Publish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Unpublish',
        onActionSelected: async () => {
          await unpublishSnapshotMutation({ variables: { id: data.id } });
          history.push('/snapshots');
        },
        icon: IconName.Unpublish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteSnapshotMutation({
            variables: { input: { id: data.id } },
          });
          history.push('/snapshots');
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: calculateNavigateUrl(data),
      },
    ];
  };

  return (
    <NavigationExplorer<SnapshotData>
      title="Snapshot Registry"
      stationKey="SnapshotRegistry"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={calculateNavigateUrl}
      bulkActions={bulkActions}
      filterOptions={filterOptions}
      defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};

function calculateNavigateUrl(item: SnapshotData): string {
  switch (item.entityType) {
    case EntityType.Movie:
      return `/movies/${item.entityId}/snapshots/${item.id}`;
    case EntityType.Episode:
      return `/episodes/${item.entityId}/snapshots/${item.id}`;
    case EntityType.Season:
      return `/seasons/${item.entityId}/snapshots/${item.id}`;
    case EntityType.Tvshow:
      return `/tvshows/${item.entityId}/snapshots/${item.id}`;
    case EntityType.Collection:
      return `/collections/${item.entityId}/snapshots/${item.id}`;
    case EntityType.MovieGenre:
      return `/settings/media/moviegenres/snapshots/${item.id}`;
    case EntityType.TvshowGenre:
      return `/settings/media/tvshowgenres/snapshots/${item.id}`;
    default:
      return '';
  }
}
