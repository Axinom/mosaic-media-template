import {
  ActionData,
  Column,
  DateRenderer,
  ExplorerDataProvider,
  NavigationExplorer,
  sortToPostGraphileOrderBy,
} from '@axinom/mosaic-ui';
import React from 'react';
import { client } from '../../../apolloClient';
import {
  IngestDocumentsDocument,
  IngestDocumentsMutatedDocument,
  IngestDocumentsMutatedSubscription,
  IngestDocumentsOrderBy,
  IngestDocumentsQuery,
  IngestDocumentsQueryVariables,
} from '../../../generated/graphql';
import { IngestStatusRenderer } from './IngestStatusRenderer/IngestStatusRenderer';

type IngestDocumentsData = NonNullable<
  IngestDocumentsQuery['filtered']
>['nodes'][number];

export const IngestDocuments: React.FC = () => {
  // Columns
  const explorerColumns: Column<IngestDocumentsData>[] = [
    {
      propertyName: 'title',
      label: 'Title',
      size: '4fr',
    },
    {
      propertyName: 'status',
      label: 'Status',
      render: IngestStatusRenderer,
      tooltip: false,
    },
    {
      propertyName: 'itemsCount',
      label: 'Total',
    },
    { propertyName: 'errorCount', label: 'Failed' },
    { propertyName: 'successCount', label: 'Succeeded' },
    { propertyName: 'inProgressCount', label: 'In Progress' },
    {
      propertyName: 'createdDate',
      label: 'Created Date',
      render: DateRenderer,
      size: '2fr',
    },
    {
      propertyName: 'updatedDate',
      label: 'Updated Date',
      render: DateRenderer,
      size: '2fr',
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<IngestDocumentsData> = {
    loadData: async ({ pagingInformation, sorting }) => {
      const result = await client.query<
        IngestDocumentsQuery,
        IngestDocumentsQueryVariables
      >({
        query: IngestDocumentsDocument,
        variables: {
          orderBy: sortToPostGraphileOrderBy(sorting, IngestDocumentsOrderBy),
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
        .subscribe<IngestDocumentsMutatedSubscription>({
          query: IngestDocumentsMutatedDocument,
        })
        .subscribe((e) => {
          switch (e.data?.ingestDocumentMutated?.event) {
            case 'IngestDocumentChanged':
              if (e.data.ingestDocumentMutated.ingestDocument) {
                change(
                  e.data.ingestDocumentMutated.id,
                  e.data.ingestDocumentMutated.ingestDocument,
                );
              }
              break;
            case 'IngestDocumentDeleted':
              remove(e.data.ingestDocumentMutated.id);
              break;
            case 'IngestDocumentCreated':
              if (e.data.ingestDocumentMutated.ingestDocument) {
                add(e.data.ingestDocumentMutated.ingestDocument);
              }
              break;
          }
        });

      return () => {
        subscription.unsubscribe();
      };
    },
  };

  const generateInlineMenuActions: (
    data: IngestDocumentsData,
  ) => ActionData[] = ({ id }) => {
    return [
      {
        label: 'Open Details',
        path: `/ingest/${id}`,
      },
    ];
  };

  return (
    <NavigationExplorer<IngestDocumentsData>
      title="Ingest Explorer"
      stationKey="IngestExplorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(item) => `/ingest/${item.id}`}
      defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
      onCreateAction="/ingest/upload"
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};
