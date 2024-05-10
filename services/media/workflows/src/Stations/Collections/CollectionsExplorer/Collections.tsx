import { createThumbnailAndStateRenderer } from '@axinom/mosaic-managed-workflow-integration';
import {
  ActionData,
  Column,
  createConnectionRenderer,
  DateRenderer,
  ExplorerDataProvider,
  generateBulkEditMutation,
  IconName,
  NavigationExplorer,
  sortToPostGraphileOrderBy,
} from '@axinom/mosaic-ui';
import gql from 'graphql-tag';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  CollectionsDocument,
  CollectionsMutatedDocument,
  CollectionsMutatedSubscription,
  CollectionsOrderBy,
  CollectionsQuery,
  CollectionsQueryVariables,
  CollectionsTagsConnection,
  CollectionSubscriptionEventKey,
  useCreateCollectionSnapshotMutation,
  useDeleteCollectionMutation,
  usePublishCollectionMutation,
  useUnpublishCollectionMutation,
} from '../../../generated/graphql';
import { publishNowNotification } from '../../../Util/Notifications/PublishNowNotification';
import { snapshotCreateNotification } from '../../../Util/Notifications/SnapshotCreateNotification';
import { unpublishNotification } from '../../../Util/Notifications/UnpublishNotification';
import { PublishStatusStateMap } from '../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { CollectionDetailsQuickEdit } from '../CollectionDetails/CollectionDetailsQuickEdit';
import { CollectionEntityManagementQuickEdit } from '../CollectionEntityManagement/CollectionEntityManagementQuickEdit';
import { CollectionImageManagementQuickEdit } from '../CollectionImageManagement/CollectionImageManagementQuickEdit';
import { CollectionsBulkEdit, CollectionsBulkEditConfig } from './BulkEdit';
import { useCollectionsActions } from './Collections.actions';
import { useCollectionsFilters } from './Collections.filters';
import { CollectionData } from './Collections.types';
import { PiletApi } from '@axinom/mosaic-portal';

interface CollectionProps {
  showNotification: PiletApi['showNotification'];
}

export const Collections: React.FC<CollectionProps> = ({
  showNotification,
}) => {
  const history = useHistory();
  const { transformFilters, filterOptions } = useCollectionsFilters();
  const { bulkActions } = useCollectionsActions();
  const [createCollectionSnapshotMutation] =
    useCreateCollectionSnapshotMutation({
      client,
      fetchPolicy: 'no-cache',
    });
  const [publishCollectionMutation] = usePublishCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [unpublishCollectionMutation] = useUnpublishCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [deleteCollectionMutation] = useDeleteCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  // Columns
  const explorerColumns: Column<CollectionData>[] = [
    {
      propertyName: 'publishStatus',
      label: 'State',
      render: createThumbnailAndStateRenderer(
        'collectionsImages',
        PublishStatusStateMap,
      ),
      size: '80px',
    },
    { label: 'Title', propertyName: 'title', size: '2fr' },
    { label: 'External ID', propertyName: 'externalId' },
    {
      label: 'Tags',
      propertyName: 'collectionsTags',
      sortable: false,
      render: createConnectionRenderer<CollectionsTagsConnection>((node) => {
        return node.name;
      }),
    },
    { label: 'Created At', propertyName: 'createdDate', render: DateRenderer },
    {
      label: 'Last Modified At',
      propertyName: 'updatedDate',
      render: DateRenderer,
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<CollectionData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      const result = await client.query<
        CollectionsQuery,
        CollectionsQueryVariables
      >({
        query: CollectionsDocument,
        variables: {
          filter: transformFilters(filters),
          orderBy: sortToPostGraphileOrderBy(sorting, CollectionsOrderBy),
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
        .subscribe<CollectionsMutatedSubscription>({
          query: CollectionsMutatedDocument,
        })
        .subscribe((e) => {
          switch (e.data?.collectionMutated?.eventKey) {
            case CollectionSubscriptionEventKey.CollectionChanged:
              if (e.data.collectionMutated.collection) {
                change(
                  e.data.collectionMutated.id,
                  e.data.collectionMutated.collection,
                );
              }
              break;
            case CollectionSubscriptionEventKey.CollectionDeleted:
              remove(e.data.collectionMutated.id);
              break;
            case CollectionSubscriptionEventKey.CollectionCreated:
              if (e.data.collectionMutated.collection) {
                add(e.data.collectionMutated.collection);
              }
              break;
          }
        });

      return () => {
        subscription.unsubscribe();
      };
    },
  };

  const generateInlineMenuActions: (data: CollectionData) => ActionData[] = ({
    id,
  }) => {
    return [
      {
        label: 'Create Snapshot',
        onActionSelected: async () => {
          const response = await createCollectionSnapshotMutation({
            variables: { collectionId: id },
          });
          if (!response.data) {
            return response.errors;
          }
          showNotification(
            snapshotCreateNotification({
              link: `/collections/${id}/snapshots/${response.data.createCollectionSnapshot.id}`,
              snapshotNo: response.data.createCollectionSnapshot?.snapshotNo,
            }),
          );
          history.push('/collections');
        },
        icon: IconName.Snapshot,
      },
      {
        label: 'Publish Now',
        onActionSelected: async () => {
          const response = await publishCollectionMutation({
            variables: { id },
          });
          if (!response.data) {
            return response.errors;
          }
          showNotification(
            publishNowNotification({
              link: `/collections/${id}/snapshots/${response.data.publishCollection.id}`,
              snapshotNo: response.data.publishCollection?.snapshotNo,
            }),
          );
          history.push('/collections');
        },
        icon: IconName.Publish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Unpublish',
        onActionSelected: async () => {
          await unpublishCollectionMutation({ variables: { id } });
          showNotification(unpublishNotification());
          history.push('/collections');
        },
        icon: IconName.Unpublish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteCollectionMutation({ variables: { input: { id } } });
          history.push('/collections');
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: `/collections/${id}`,
      },
    ];
  };

  return (
    <NavigationExplorer<CollectionData>
      title="Collections"
      stationKey="CollectionsExplorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(item) => `/collections/${item.id}`}
      onCreateAction="/collections/create"
      bulkActions={bulkActions}
      filterOptions={filterOptions}
      defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
      inlineMenuActions={generateInlineMenuActions}
      quickEditRegistrations={[
        {
          component: <CollectionDetailsQuickEdit />,
          label: 'Collection Details',
        },
        {
          component: <CollectionEntityManagementQuickEdit />,
          label: 'Manage Entities',
          generateDetailsLink: (item) => `/collections/${item.id}/entities`,
        },
        {
          component: <CollectionImageManagementQuickEdit />,
          label: 'Manage Images',
          generateDetailsLink: (item) => `/collections/${item.id}/images`,
        },
      ]}
      bulkEditRegistration={{
        component: <CollectionsBulkEdit />,
        saveData: async (data, items) => {
          let filter = undefined as Record<string, unknown> | undefined;
          if (
            items.mode === 'SINGLE_ITEMS' &&
            items.items &&
            items.items.length > 0
          ) {
            filter = { id: { in: items.items.map((item) => item.id) } };
          }

          if (items.mode === 'SELECT_ALL') {
            filter = transformFilters(items.filters);
          }

          const mutation = generateBulkEditMutation(
            CollectionsBulkEditConfig,
            data,
            filter,
          );

          await client.mutate({
            mutation: gql`
              ${mutation}
            `,
          });
        },
      }}
    />
  );
};
