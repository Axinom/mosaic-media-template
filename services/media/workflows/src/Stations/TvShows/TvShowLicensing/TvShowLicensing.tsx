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
  TvshowsLicensesCountriesConnection,
  TvshowsLicensesDocument,
  TvshowsLicensesOrderBy,
  TvshowsLicensesQuery,
  TvshowsLicensesQueryVariables,
  useDeleteTvshowsLicenseMutation,
} from '../../../generated/graphql';
import { getCountryName } from '../../../Util/CountryNames/CountryNames';

type TvshowsLicensesData = NonNullable<
  TvshowsLicensesQuery['tvshowsLicenses']
>['nodes'][number];

export const TvShowLicensing: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  const history = useHistory();

  const [deleteTvShowsLicenseMutation] = useDeleteTvshowsLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  // Columns
  const explorerColumns: Column<TvshowsLicensesData>[] = [
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
      propertyName: 'tvshowsLicensesCountries',
      size: '4fr',
      sortable: false,
      render: createConnectionRenderer<TvshowsLicensesCountriesConnection>(
        (node) => getCountryName(node.code),
      ),
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<TvshowsLicensesData> = {
    loadData: async ({ pagingInformation, sorting }) => {
      const result = await client.query<
        TvshowsLicensesQuery,
        TvshowsLicensesQueryVariables
      >({
        query: TvshowsLicensesDocument,
        variables: {
          filter: { tvshowId: { equalTo: tvshowId } },
          orderBy: sortToPostGraphileOrderBy(sorting, TvshowsLicensesOrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'network-only',
      });

      return {
        data: result.data.tvshowsLicenses?.nodes ?? [],
        totalCount: result.data.tvshowsLicenses?.totalCount as number,
        filteredCount: result.data.tvshowsLicenses?.totalCount as number,
        hasMoreData: result.data.tvshowsLicenses?.pageInfo.hasNextPage || false,
        pagingInformation: result.data.tvshowsLicenses?.pageInfo.endCursor,
      };
    },
  };

  const generateInlineMenuActions: (
    data: TvshowsLicensesData,
  ) => ActionData[] = ({ id }) => {
    return [
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteTvShowsLicenseMutation({ variables: { input: { id } } });
          history.push(`/tvshows/${tvshowId}/licenses`);
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: `/tvshows/${tvshowId}/licenses/${id}`,
      },
    ];
  };

  return (
    <NavigationExplorer<TvshowsLicensesData>
      title="TV Show Licensing"
      stationKey="TvshowsLicenseExplorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(item) =>
        `/tvshows/${tvshowId}/licenses/${item.id}`
      }
      onCreateAction={`/tvshows/${tvshowId}/licenses/create`}
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};
