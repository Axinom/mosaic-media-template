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
import { useHistory, useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  PublishingSnapshotMutatedDocument,
  PublishingSnapshotMutatedSubscription,
  PublishingSnapshotsDocument,
  PublishingSnapshotsQuery,
  PublishingSnapshotsQueryVariables,
  SnapshotsOrderBy,
  SnapshotSubscriptionEventKey,
  useDeleteSnapshotMutation,
} from '../../../generated/graphql';
import { ValidationResultsRenderer } from '../../../Util/PublishingSnapshots/ValidationResultsRenderer/ValidationResultsRenderer';
import { StringEnumRenderer } from '../../../Util/StringEnumRenderer/StringEnumRenderer';
import { usePublishingSnapshotActions } from './PublishingSnapshotExplorer.actions';
import { usePublishingSnapshotFilters } from './PublishingSnapshotExplorer.filter';
import {
  PublishingSnapshotExplorerProps,
  SnapshotData,
} from './PublishingSnapshotExplorer.types';

export const PublishingSnapshotExplorer: React.FC<
  PublishingSnapshotExplorerProps
> = ({ entityId, entityType, ...props }) => {
  const movieId = Number(
    useParams<{
      movieId: string;
    }>().movieId,
  );
  const history = useHistory();

  const [deleteSnapshotMutation] = useDeleteSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const { transformFilters, filterOptions } = usePublishingSnapshotFilters();
  const { bulkActions } = usePublishingSnapshotActions(entityType, entityId);

  const explorerColumns: Column<SnapshotData>[] = [
    { propertyName: 'snapshotNo', label: 'No.', size: '60px' },
    { propertyName: 'createdDate', label: 'Created At', render: DateRenderer },
    { propertyName: 'createdUser', label: 'Created By' },
    {
      propertyName: 'snapshotValidationResults',
      label: 'Validation Results',
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
        PublishingSnapshotsQuery,
        PublishingSnapshotsQueryVariables
      >({
        query: PublishingSnapshotsDocument,
        variables: {
          entityId,
          entityType,
          filter: transformFilters(filters),
          orderBy: sortToPostGraphileOrderBy(sorting, SnapshotsOrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'no-cache',
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
        .subscribe<PublishingSnapshotMutatedSubscription>({
          query: PublishingSnapshotMutatedDocument,
        })
        .subscribe((e) => {
          {
            switch (e.data?.snapshotMutated?.eventKey) {
              case SnapshotSubscriptionEventKey.SnapshotChanged:
                if (
                  e.data?.snapshotMutated.snapshot &&
                  e.data?.snapshotMutated?.snapshot?.entityId === entityId &&
                  e.data?.snapshotMutated?.snapshot?.entityType === entityType
                ) {
                  change(
                    e.data?.snapshotMutated.id,
                    e.data?.snapshotMutated.snapshot,
                  );
                }
                break;
              case SnapshotSubscriptionEventKey.SnapshotDeleted:
                remove(e.data?.snapshotMutated.id);
                break;
              case SnapshotSubscriptionEventKey.SnapshotCreated:
                if (
                  e.data?.snapshotMutated.snapshot &&
                  e.data?.snapshotMutated?.snapshot?.entityId === entityId &&
                  e.data?.snapshotMutated?.snapshot?.entityType === entityType
                ) {
                  add(e.data?.snapshotMutated.snapshot);
                }
                break;
            }
          }
        });

      return () => {
        subscription.unsubscribe();
      };
    },
  };

  const generateInlineMenuActions: (data: SnapshotData) => ActionData[] = ({
    id,
  }) => {
    return [
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteSnapshotMutation({
            variables: { input: { id } },
          });
          history.push(`/movies/${movieId}/snapshots`);
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: `/movies/${movieId}/snapshots/${id}`,
      },
    ];
  };

  return (
    <NavigationExplorer<SnapshotData>
      {...props}
      bulkActions={bulkActions}
      columns={explorerColumns}
      filterOptions={filterOptions}
      dataProvider={dataProvider}
      defaultSortOrder={{ column: 'createdDate', direction: 'desc' }}
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};
