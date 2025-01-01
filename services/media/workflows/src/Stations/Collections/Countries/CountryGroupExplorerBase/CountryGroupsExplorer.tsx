import {
  Column,
  createConnectionRenderer,
  ExplorerDataProvider,
  NavigationExplorer,
  SelectionExplorer,
} from '@axinom/mosaic-ui';
import React from 'react';
import { client } from '../../../../apolloClient';
import {
  CountryGroupsCountriesConnection,
  CountryGroupsDocument,
  CountryGroupsQuery,
  CountryGroupsQueryVariables,
} from '../../../../generated/graphql';
import { getCountryName } from '../../../../Util/CountryNames/CountryNames';
import { useCountriesFilters } from './CountryGroupExplorer.filters';
import {
  CountryGroupData,
  CountryGroupExplorerProps,
} from './CountryGroupsExplorer.types';

export const CountryGroupExplorer: React.FC<CountryGroupExplorerProps> = (
  props,
) => {
  const { transformFilters, filterOptions } = useCountriesFilters();

  // Data provider
  const dataProvider: ExplorerDataProvider<CountryGroupData> = {
    loadData: async ({ filters }) => {
      let filterWithExclusions = filters;
      if (props.excludeItems) {
        filterWithExclusions = { id: props.excludeItems, ...filters };
      }
      const result = await client.query<
        CountryGroupsQuery,
        CountryGroupsQueryVariables
      >({
        query: CountryGroupsDocument,
        variables: {
          filter: transformFilters(filterWithExclusions, props.excludeItems),
          // orderBy: sortToPostGraphileOrderBy(sorting, MoviesOrderBy),
          // after: pagingInformation,
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
  };

  const explorerColumns: Column<CountryGroupData>[] = [
    {
      label: 'Name',
      propertyName: 'name',
      size: '2fr',
    },
    {
      label: 'Countries',
      propertyName: 'countryGroupsCountriesByGroupId',
      size: '4fr',
      sortable: false,
      render: createConnectionRenderer<CountryGroupsCountriesConnection>(
        (node) => getCountryName(node.countryId),
      ),
    },
  ];

  switch (props.kind) {
    case 'NavigationExplorer':
      return (
        <NavigationExplorer<CountryGroupData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
        />
      );
    case 'SelectionExplorer':
      return (
        <SelectionExplorer<CountryGroupData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
          generateItemLink={(item) => `/countries/${item.id}`}
        />
      );
    default:
      return <div>Explorer type is not defined</div>;
  }
};
