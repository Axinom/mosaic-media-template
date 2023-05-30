import {
  ActionData,
  ActionType,
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
  MoviesLicensesCountriesConnection,
  MoviesLicensesDocument,
  MoviesLicensesOrderBy,
  MoviesLicensesQuery,
  MoviesLicensesQueryVariables,
  useDeleteMoviesLicenseMutation,
} from '../../../generated/graphql';
import { getCountryName } from '../../../Util/CountryNames/CountryNames';

type MoviesLicensesData = NonNullable<
  MoviesLicensesQuery['moviesLicenses']
>['nodes'][number];

export const MovieLicensing: React.FC = () => {
  const movieId = Number(
    useParams<{
      movieId: string;
    }>().movieId,
  );

  const history = useHistory();

  const [deleteMoviesLicenseMutation] = useDeleteMoviesLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  // Columns
  const explorerColumns: Column<MoviesLicensesData>[] = [
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
      propertyName: 'moviesLicensesCountries',
      size: '4fr',
      sortable: false,
      render: createConnectionRenderer<MoviesLicensesCountriesConnection>(
        (node) => getCountryName(node.code),
      ),
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<MoviesLicensesData> = {
    loadData: async ({ pagingInformation, sorting }) => {
      const result = await client.query<
        MoviesLicensesQuery,
        MoviesLicensesQueryVariables
      >({
        query: MoviesLicensesDocument,
        variables: {
          filter: { movieId: { equalTo: movieId } },
          orderBy: sortToPostGraphileOrderBy(sorting, MoviesLicensesOrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'network-only',
      });

      return {
        data: result.data.moviesLicenses?.nodes ?? [],
        totalCount: result.data.moviesLicenses?.totalCount as number,
        filteredCount: result.data.moviesLicenses?.totalCount as number,
        hasMoreData: result.data.moviesLicenses?.pageInfo.hasNextPage || false,
        pagingInformation: result.data.moviesLicenses?.pageInfo.endCursor,
      };
    },
  };

  const generateInlineMenuActions: (
    data: MoviesLicensesData,
  ) => ActionData[] = ({ id }) => {
    return [
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteMoviesLicenseMutation({ variables: { input: { id } } });
          history.push(`/movies/${movieId}/licenses`);
        },
        actionType: ActionType.Context,
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        onActionSelected: () =>
          history.push(`/movies/${movieId}/licenses/${id}`),
        actionType: ActionType.Navigation,
        icon: IconName.ChevronRight,
      },
    ];
  };

  return (
    <NavigationExplorer<MoviesLicensesData>
      title="Movie Licensing"
      stationKey="MoviesLicenseExplorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(item) => `/movies/${movieId}/licenses/${item.id}`}
      onCreateAction={() => history.push(`/movies/${movieId}/licenses/create`)}
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};
