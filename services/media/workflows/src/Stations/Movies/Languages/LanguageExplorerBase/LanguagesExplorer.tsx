import {
  ActionData,
  Column,
  DateRenderer,
  ExplorerDataProvider,
  NavigationExplorer,
  SelectionExplorer,
} from '@axinom/mosaic-ui';
import React from 'react';
import { client } from '../../../../apolloClient';
import {
  LanguagesDocument,
  LanguagesQuery,
  LanguagesQueryVariables,
} from '../../../../generated/graphql';
import { LanguageData, LanguageExplorerProps } from './LanguagesExplorer.types';

export const LanguagesExplorer: React.FC<LanguageExplorerProps> = (props) => {
  const explorerColumns: Column<LanguageData>[] = [
    { label: 'Title', propertyName: 'title', size: '2fr' },
    { label: 'Native', propertyName: 'native', size: '1fr' },
    { label: 'Code', propertyName: 'code' },
    {
      label: 'Modified',
      propertyName: 'updatedDate',
      render: DateRenderer,
    },
    { label: 'Modified By', propertyName: 'updatedUser' },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<LanguageData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      const result = await client.query<
        LanguagesQuery,
        LanguagesQueryVariables
      >({
        query: LanguagesDocument,
        variables: {},
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
  };

  const generateInlineMenuActions: (data: LanguageData) => ActionData[] = ({
    id,
  }) => {
    return [];
  };

  switch (props.kind) {
    case 'NavigationExplorer':
      return (
        <NavigationExplorer<LanguageData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
          inlineMenuActions={generateInlineMenuActions}
        />
      );
    case 'SelectionExplorer':
      return (
        <SelectionExplorer<LanguageData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
          generateItemLink={(item) => `/settings/media/languages/${item.id}`}
        />
      );
    default:
      return <div>Explorer type is not defined</div>;
  }
};
