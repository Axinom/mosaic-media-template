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
  EpisodesLicensesCountriesConnection,
  EpisodesLicensesDocument,
  EpisodesLicensesOrderBy,
  EpisodesLicensesQuery,
  EpisodesLicensesQueryVariables,
  useDeleteEpisodesLicenseMutation,
} from '../../../generated/graphql';
import { getCountryName } from '../../../Util/CountryNames/CountryNames';

type EpisodesLicensesData = NonNullable<
  EpisodesLicensesQuery['episodesLicenses']
>['nodes'][number];

export const EpisodeLicensing: React.FC = () => {
  const episodeId = Number(
    useParams<{
      episodeId: string;
    }>().episodeId,
  );

  const history = useHistory();

  const [deleteEpisodesLicenseMutation] = useDeleteEpisodesLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  // Columns
  const explorerColumns: Column<EpisodesLicensesData>[] = [
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
      propertyName: 'episodesLicensesCountries',
      size: '4fr',
      render: createConnectionRenderer<EpisodesLicensesCountriesConnection>(
        (node) => getCountryName(node.code),
      ),
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<EpisodesLicensesData> = {
    loadData: async ({ pagingInformation, sorting }) => {
      const result = await client.query<
        EpisodesLicensesQuery,
        EpisodesLicensesQueryVariables
      >({
        query: EpisodesLicensesDocument,
        variables: {
          filter: { episodeId: { equalTo: episodeId } },
          orderBy: sortToPostGraphileOrderBy(sorting, EpisodesLicensesOrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'network-only',
      });

      return {
        data: result.data.episodesLicenses?.nodes ?? [],
        totalCount: result.data.episodesLicenses?.totalCount as number,
        filteredCount: result.data.episodesLicenses?.totalCount as number,
        hasMoreData:
          result.data.episodesLicenses?.pageInfo.hasNextPage || false,
        pagingInformation: result.data.episodesLicenses?.pageInfo.endCursor,
      };
    },
  };

  const generateInlineMenuActions: (
    data: EpisodesLicensesData,
  ) => ActionData[] = ({ id }) => {
    return [
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteEpisodesLicenseMutation({ variables: { input: { id } } });
          history.push(`/episodes/${episodeId}/licenses`);
        },
        actionType: ActionType.Context,
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        onActionSelected: () =>
          history.push(`/episodes/${episodeId}/licenses/${id}`),
        actionType: ActionType.Navigation,
        icon: IconName.ChevronRight,
      },
    ];
  };

  return (
    <NavigationExplorer<EpisodesLicensesData>
      title="Episode Licensing"
      stationKey="EpisodesLicenseExplorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(item) =>
        `/episodes/${episodeId}/licenses/${item.id}`
      }
      onCreateAction={() =>
        history.push(`/episodes/${episodeId}/licenses/create`)
      }
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};
