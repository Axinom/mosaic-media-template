import {
  ActionData,
  ActionType,
  Column,
  ExplorerDataProvider,
  IconName,
  NavigationExplorer,
} from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  CustomerDocument,
  CustomerQuery,
  CustomerQueryVariables,
  PagedCustomers,
  SortDirection,
  SystemType,
} from '../../../generated/graphql';

import { CustomerFilters } from './CustomerExplorer.filters';
import { CustomerData } from './CustomerExplorer.types';

export const CustomerExplorer: React.FC = () => {
  const { filterOptions } = CustomerFilters();
  const history = useHistory();
  // Columns
  const explorerColumns: Column<CustomerData>[] = [
    { label: 'System', propertyName: 'system', size: '2fr' },
    { label: 'Email', propertyName: 'email', size: '2fr' },
    { label: 'Mobile', propertyName: 'mobile', size: '2fr' },
    { label: 'First Name', propertyName: 'first_name', size: '2fr' },
    { label: 'Last Name', propertyName: 'last_name', size: '2fr' },
    {
      label: 'Registration Country',
      propertyName: 'registration_country',
      size: '2fr',
    },
    { label: 'Date Created', propertyName: 'create_date', size: '2fr' },
    { label: 'Date Activated', propertyName: 'activation_date', size: '2fr' },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<CustomerData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      // if (props.excludeItems) {
      //   filterWithExclusions = { id: props.excludeItems, ...filters };
      // }

      const result = await client.query<CustomerQuery, CustomerQueryVariables>({
        query: CustomerDocument,
        variables: {
          input: {
            after: pagingInformation as string,
            filter: {
              id: filters?.id as string,
              email: filters?.email as string,
              system: filters?.system as SystemType,
              firstName: filters?.first_name as string,
              lastName: filters?.last_name as string,
              mobile: filters?.mobile as string,
              registrationCountry: filters?.registration_country as string,
            },
            sort: {
              column: sorting?.column,
              direction: sorting?.direction as SortDirection,
            },
          },
        },
        fetchPolicy: 'network-only',
      });

      const pagedCustomers = result.data.filtered as PagedCustomers;

      const maxPages = Math.ceil(
        pagedCustomers.total / pagedCustomers.page_size,
      );
      const hasMoreData = pagedCustomers.page + 1 <= maxPages;
      // const nextPage = () + 1

      return {
        data: result.data.filtered?.customers ?? [],
        totalCount: pagedCustomers.total,
        filteredCount: result.data.filtered?.total as number,
        hasMoreData: hasMoreData,
        pagingInformation: (pagedCustomers.page + 1).toString(),
      };
    },
  };

  const generateInlineMenuActions: (data: CustomerData) => ActionData[] = ({
    id,
  }) => {
    return [
      {
        label: 'Open Details',
        onActionSelected: () => history.push(`/customers/${id}`),
        actionType: ActionType.Navigation,
        icon: IconName.ChevronRight,
      },
    ];
  };
  return (
    <NavigationExplorer
      title="Customers"
      columns={explorerColumns}
      dataProvider={dataProvider}
      filterOptions={filterOptions}
      inlineMenuActions={generateInlineMenuActions}
      stationKey={'Customers'}
      calculateNavigateUrl={(item) => `/customers/${item.id}`}
      onCreateAction={() => {
        history.push('/customers/create');
      }}
    />
  );
};
