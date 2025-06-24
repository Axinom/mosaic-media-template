import {
  ActionData,
  Column,
  DateRenderer,
  ExplorerDataProvider,
  FilterType,
  FilterTypes,
  IconName,
  NavigationExplorer,
  NavigationExplorerProps,
  SelectionExplorer,
  SelectionExplorerProps,
} from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Gravatar } from '../../../../Components/Gravatar/Gravatar';
import { axiosInstance } from '../../../axios/axios';
import { Constants } from '../../../constants';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';

interface CustomerData {
  id: string;
  system: string;
  email?: string;
  mobile?: string;
  first_name?: string;
  last_name: string;
  last_login: string;
  gender: string;
  create_date: string;
  activation_date: string;
  registration_country: string;
  state: number;
}

type CustomerExplorerProps =
  | CustomerSelectionExplorerProps
  | CustomerNavigationExplorerProps;

interface CustomerSelectionExplorerProps
  extends Omit<
    SelectionExplorerProps<CustomerData>,
    'columns' | 'dataProvider' | 'filterOptions'
  > {
  /** Type Tag */
  kind: 'SelectionExplorer';
}

interface CustomerNavigationExplorerProps
  extends Omit<
    NavigationExplorerProps<CustomerData>,
    'columns' | 'dataProvider' | 'filterOptions'
  > {
  /** Type Tag */
  kind: 'NavigationExplorer';
}

export const CustomersExplorer: React.FC<CustomerExplorerProps> = (props) => {
  //const { filterOptions } = useMoviesFilters();
  const filterOptions: FilterType<CustomerData>[] = [
    {
      type: FilterTypes.FreeText,
      label: Constants.CustomersExplorer.Labels.ID,
      property: 'id',
    },
    {
      type: FilterTypes.FreeText,
      label: Constants.CustomersExplorer.Labels.FirstName,
      property: 'first_name',
    },
    {
      type: FilterTypes.FreeText,
      label: Constants.CustomersExplorer.Labels.LastName,
      property: 'last_name',
    },
    // {
    //   type: FilterTypes.Options,
    //   label: 'System',
    //   property: 'system',
    //   options: [{ label: 'Internal', value: 'Internal' }],
    // },
    {
      type: FilterTypes.FreeText,
      label: Constants.CustomersExplorer.Labels.Email,
      property: 'email',
    },
    {
      type: FilterTypes.FreeText,
      label: Constants.CustomersExplorer.Labels.Mobile,
      property: 'mobile',
    },
    {
      type: FilterTypes.SearcheableOptions,
      label: Constants.CustomersExplorer.Labels.Country,
      property: 'registration_country',
      optionsProvider: (text) => {
        return CountryNames.filter((country) =>
          country.label.toLowerCase().startsWith(text.toLowerCase()),
        ).map((country) => ({
          label: country.label,
          value: country.value,
        }));
      },
      //options: CountryNames,
    },
  ];

  const history = useHistory();
  // Columns
  const explorerColumns: Column<CustomerData>[] = [
    //{ label: 'System', propertyName: 'system' },
    {
      label: '',
      propertyName: 'id',
      size: '40px',
      sortable: false,
      render: (_value, data) => (
        <Gravatar email={data.email as string} size={40} />
      ),
    },
    { label: Constants.CustomersExplorer.Labels.Email, propertyName: 'email' },
    {
      label: Constants.CustomersExplorer.Labels.Mobile,
      propertyName: 'mobile',
      sortable: false,
    },
    {
      label: Constants.CustomersExplorer.Labels.FirstName,
      propertyName: 'first_name',
    },
    {
      label: Constants.CustomersExplorer.Labels.LastName,
      propertyName: 'last_name',
    },
    {
      label: Constants.CustomersExplorer.Labels.RegistrationCountry,
      propertyName: 'registration_country',
      sortable: false,
    },
    {
      label: Constants.CustomersExplorer.Labels.DateCreated,
      propertyName: 'create_date',
      render: DateRenderer,
      sortable: false,
    },
    {
      label: Constants.CustomersExplorer.Labels.DateActivated,
      propertyName: 'activation_date',
      render: DateRenderer,
      sortable: false,
    },
    {
      label: Constants.CustomersExplorer.Labels.LastLogin,
      propertyName: 'last_login',
      render: DateRenderer,
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<CustomerData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      // Build query parameters for pagination, sorting and filtering
      const params = new URLSearchParams();

      if (pagingInformation) {
        params.append('page', ((pagingInformation as number) + 1).toString());
      }

      if (sorting) {
        params.append('sort_by_field', sorting.column.replace(/_/g, ''));
        params.append('sort_order', sorting.direction);
      }

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value as string);
          }
        });
      }

      const [customersResponse, totalResponse] = await Promise.all([
        axiosInstance.get<{
          total: number;
          page: number;
          page_size: number;
          customers: CustomerData[];
        }>('/v1/manage/customer', {
          params,
        }),
        axiosInstance.get<{
          total: number;
        }>('/v1/manage/customer', {
          params: {
            page_size: 1,
          },
        }),
      ]);

      const { data } = customersResponse;
      const { total } = totalResponse.data;

      return {
        data: data.customers ?? [],
        totalCount: total as number,
        hasMoreData: data.page * data.page_size < data.total || false,
        filteredCount: data.total,
        pagingInformation: data.page,
      };
    },
  };

  const generateInlineMenuActions: (data: CustomerData) => ActionData[] = ({
    id,
  }) => {
    return [
      {
        label: Constants.CustomersExplorer.Actions.Delete,
        onActionSelected: async () => {
          await axiosInstance.delete(`/v1/manage/customer/${id}`);
          history.push('/customers');
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: Constants.CustomersExplorer.Actions.OpenDetails,
        path: `/customers/${id}`,
      },
    ];
  };

  switch (props.kind) {
    case 'NavigationExplorer':
      return (
        <NavigationExplorer<CustomerData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          //defaultSortOrder={{ column: 'create_date', direction: 'desc' }}
          inlineMenuActions={generateInlineMenuActions}
        />
      );
    case 'SelectionExplorer':
      return (
        <SelectionExplorer<CustomerData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          //defaultSortOrder={{ column: 'create_date', direction: 'desc' }}
          generateItemLink={(item) => `/customers/${item.id}`}
        />
      );
    default:
      return (
        <div>{Constants.CustomersExplorer.Messages.ExplorerTypeNotDefined}</div>
      );
  }
};
