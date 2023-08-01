import {
  ActionData,
  Column,
  createConnectionRenderer,
  DateRenderer,
  ExplorerDataProvider,
  IconName,
  NavigationExplorer,
  SelectionExplorer,
  sortToPostGraphileOrderBy,
} from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import { getThumbnailAndStateRenderer } from '../../../externals';
import {
  EpisodesDocument,
  EpisodesMutatedDocument,
  EpisodesMutatedSubscription,
  EpisodesOrderBy,
  EpisodesQuery,
  EpisodesQueryVariables,
  EpisodesTvshowGenresConnection,
  useCreateEpisodeSnapshotMutation,
  useDeleteEpisodeMutation,
  usePublishEpisodeMutation,
  useUnpublishEpisodeMutation,
} from '../../../generated/graphql';
import { PublishStatusStateMap } from '../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { useEpisodesFilters } from './EpisodeExplorer.filters';
import { EpisodeData, EpisodeExplorerProps } from './EpisodeExplorer.types';
import { ExplorerIndexRenderer } from './renderers/ExplorerIndexRenderer';
import { ExplorerParentRenderer } from './renderers/ExplorerParentRenderer';

export const EpisodeExplorer: React.FC<EpisodeExplorerProps> = (props) => {
  const { filterOptions, transformFilters } = useEpisodesFilters();
  const [createEpisodeSnapshotMutation] = useCreateEpisodeSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [publishEpisodeMutation] = usePublishEpisodeMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [unpublishEpisodeMutation] = useUnpublishEpisodeMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [deleteEpisodeMutation] = useDeleteEpisodeMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const history = useHistory();

  // Columns
  const explorerColumns: Column<EpisodeData>[] = [
    {
      propertyName: 'publishStatus',
      label: 'State',
      render: getThumbnailAndStateRenderer()(
        'episodesImages',
        PublishStatusStateMap,
      ),
      size: '80px',
    },
    { label: 'Title', propertyName: 'title', size: '2fr' },
    { label: 'Index', propertyName: 'index', render: ExplorerIndexRenderer },
    {
      label: 'Parent Entity',
      propertyName: 'season',
      render: ExplorerParentRenderer,
      sortable: false,
    },
    { label: 'External ID', propertyName: 'externalId' },
    {
      label: 'Genres',
      propertyName: 'episodesTvshowGenres',
      sortable: false,
      render: createConnectionRenderer<EpisodesTvshowGenresConnection>(
        (node) => {
          return node.tvshowGenres?.title;
        },
      ),
    },
    { label: 'Created At', propertyName: 'createdDate', render: DateRenderer },
    {
      label: 'Last Modified At',
      propertyName: 'updatedDate',
      render: DateRenderer,
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<EpisodeData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      let filterWithExclusions = filters;

      if (props.excludeItems) {
        filterWithExclusions = { id: props.excludeItems, ...filters };
      }

      const result = await client.query<EpisodesQuery, EpisodesQueryVariables>({
        query: EpisodesDocument,
        variables: {
          filter: transformFilters(filterWithExclusions, props.excludeItems),
          orderBy: sortToPostGraphileOrderBy(sorting, EpisodesOrderBy),
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
        .subscribe<EpisodesMutatedSubscription>({
          query: EpisodesMutatedDocument,
        })
        .subscribe((e) => {
          console.log(e);
          switch (e.data?.episodeMutated?.event) {
            case 'EpisodeChanged':
              if (e.data.episodeMutated.episode) {
                change(e.data.episodeMutated.id, e.data.episodeMutated.episode);
              }
              break;
            case 'EpisodeDeleted':
              remove(e.data.episodeMutated.id);
              break;
            case 'EpisodeCreated':
              if (e.data.episodeMutated.episode) {
                add(e.data.episodeMutated.episode);
              }
              break;
          }
        });

      return () => {
        subscription.unsubscribe();
      };
    },
  };

  const generateInlineMenuActions: (data: EpisodeData) => ActionData[] = ({
    id,
    season,
  }) => {
    return [
      {
        label: 'Create Snapshot',
        onActionSelected: async () => {
          await createEpisodeSnapshotMutation({
            variables: { episodeId: id },
          });
          history.push('/episodes');
        },
        icon: IconName.Snapshot,
      },
      {
        label: 'Publish Now',
        onActionSelected: async () => {
          await publishEpisodeMutation({ variables: { id } });
          history.push('/episodes');
        },
        icon: IconName.Publish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Unpublish',
        onActionSelected: async () => {
          await unpublishEpisodeMutation({ variables: { id } });
          history.push('/episodes');
        },
        icon: IconName.Unpublish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteEpisodeMutation({ variables: { input: { id } } });
          history.push('/episodes');
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: `/episodes/${id}`,
      },
      ...(season
        ? [
            {
              label: 'Open Parent Entity',
              path: `/seasons/${season?.id}`,
              openInNewTab: true,
            },
          ]
        : []),
    ];
  };

  switch (props.kind) {
    case 'NavigationExplorer':
      return (
        <NavigationExplorer<EpisodeData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
          inlineMenuActions={generateInlineMenuActions}
        />
      );
    case 'SelectionExplorer':
      return (
        <SelectionExplorer<EpisodeData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
          generateItemLink={(item) => `/episodes/${item.id}`}
        />
      );
    default:
      return <div>Explorer type is not defined</div>;
  }
};
