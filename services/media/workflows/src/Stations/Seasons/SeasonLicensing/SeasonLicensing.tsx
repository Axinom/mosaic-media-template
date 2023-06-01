import {
  ActionData,
  Column,
  createConnectionRenderer,
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
  SeasonsLicensesCountriesConnection,
  SeasonsLicensesDocument,
  SeasonsLicensesOrderBy,
  SeasonsLicensesQuery,
  SeasonsLicensesQueryVariables,
  useDeleteSeasonsLicenseMutation,
} from '../../../generated/graphql';
import { getCountryName } from '../../../Util/CountryNames/CountryNames';

type SeasonsLicensesData = NonNullable<
  SeasonsLicensesQuery['seasonsLicenses']
>['nodes'][number];

export const SeasonLicensing: React.FC = () => {
  const seasonId = Number(
    useParams<{
      seasonId: string;
    }>().seasonId,
  );

  const history = useHistory();

  const [deleteSeasonsLicenseMutation] = useDeleteSeasonsLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  // Columns
  const explorerColumns: Column<SeasonsLicensesData>[] = [
    {
      propertyName: 'licenseStart',
      label: 'From',
      render: DateRenderer,
    },
    {
      propertyName: 'licenseEnd',
      label: 'Until',
      render: DateRenderer,
    },
    {
      label: 'Licensing Countries',
      propertyName: 'seasonsLicensesCountries',
      size: '4fr',
      sortable: false,
      render: createConnectionRenderer<SeasonsLicensesCountriesConnection>(
        (node) => getCountryName(node.code),
      ),
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<SeasonsLicensesData> = {
    loadData: async ({ pagingInformation, sorting }) => {
      const result = await client.query<
        SeasonsLicensesQuery,
        SeasonsLicensesQueryVariables
      >({
        query: SeasonsLicensesDocument,
        variables: {
          filter: { seasonId: { equalTo: seasonId } },
          orderBy: sortToPostGraphileOrderBy(sorting, SeasonsLicensesOrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'network-only',
      });

      return {
        data: result.data.seasonsLicenses?.nodes ?? [],
        totalCount: result.data.seasonsLicenses?.totalCount as number,
        filteredCount: result.data.seasonsLicenses?.totalCount as number,
        hasMoreData: result.data.seasonsLicenses?.pageInfo.hasNextPage || false,
        pagingInformation: result.data.seasonsLicenses?.pageInfo.endCursor,
      };
    },
  };

  const generateInlineMenuActions: (
    data: SeasonsLicensesData,
  ) => ActionData[] = ({ id }) => {
    return [
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteSeasonsLicenseMutation({ variables: { input: { id } } });
          history.push(`/seasons/${seasonId}/licenses`);
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: `/seasons/${seasonId}/licenses/${id}`,
      },
    ];
  };

  return (
    <NavigationExplorer<SeasonsLicensesData>
      title="Season Licensing"
      stationKey="SeasonsLicenseExplorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(item) =>
        `/seasons/${seasonId}/licenses/${item.id}`
      }
      onCreateAction={`/seasons/${seasonId}/licenses/create`}
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};
