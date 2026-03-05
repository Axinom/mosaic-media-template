import { createThumbnailAndStateRenderer } from '@axinom/mosaic-managed-workflow-integration';
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
import {
  EpisodesDocument,
  EpisodesMutatedDocument,
  EpisodesMutatedSubscription,
  EpisodesOrderBy,
  EpisodesQuery,
  EpisodesQueryVariables,
  EpisodesTvshowGenresConnection,
  EpisodeSubscriptionEventKey,
  useCreateEpisodeSnapshotMutation,
  useDeleteEpisodeMutation,
  usePublishEpisodeMutation,
  useUnpublishEpisodeMutation,
} from '../../../generated/graphql';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { publishNowNotification } from '../../../Util/Notifications/PublishNowNotification';
import { snapshotCreateNotification } from '../../../Util/Notifications/SnapshotCreateNotification';
import { unpublishNotification } from '../../../Util/Notifications/UnpublishNotification';
import { PublishStatusStateMap } from '../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { useEpisodesFilters } from './EpisodeExplorer.filters';
import { EpisodeData, EpisodeExplorerProps } from './EpisodeExplorer.types';
import { ExplorerIndexRenderer } from './renderers/ExplorerIndexRenderer';
import { ExplorerParentRenderer } from './renderers/ExplorerParentRenderer';

export const EpisodeExplorer: React.FC<EpisodeExplorerProps> = (props) => {
  const showNotification = useNotification();
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
      render: createThumbnailAndStateRenderer(
        'episodesImages',
        PublishStatusStateMap,
      ),
      size: '80px',
    },
    { label: 'Title', propertyName: 'title', size: '2fr' },
    { label: 'Index', propertyName: 'index', render: ExplorerIndexRenderer },
    {
      label: 'Season',
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
          // eslint-disable-next-line no-console
          console.log(e);
          switch (e.data?.episodeMutated?.eventKey) {
            case EpisodeSubscriptionEventKey.EpisodeChanged:
              if (e.data.episodeMutated.episode) {
                change(e.data.episodeMutated.id, e.data.episodeMutated.episode);
              }
              break;
            case EpisodeSubscriptionEventKey.EpisodeDeleted:
              remove(e.data.episodeMutated.id);
              break;
            case EpisodeSubscriptionEventKey.EpisodeCreated:
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
          const response = await createEpisodeSnapshotMutation({
            variables: { episodeId: id },
          });
          if (!response.data) return response.errors;
          showNotification(
            snapshotCreateNotification({
              link: `/episodes/${id}/snapshots/${response.data.createEpisodeSnapshot.id}`,
              snapshotNo: response.data.createEpisodeSnapshot?.snapshotNo,
            }),
          );
          history.push('/episodes');
        },
        icon: IconName.Snapshot,
      },
      {
        label: 'Publish Now',
        onActionSelected: async () => {
          const response = await publishEpisodeMutation({ variables: { id } });
          if (!response.data) return response.errors;
          showNotification(
            publishNowNotification({
              link: `/episodes/${id}/snapshots/${response.data.publishEpisode.id}`,
              snapshotNo: response.data.publishEpisode?.snapshotNo,
            }),
          );
          history.push('/episodes');
        },
        icon: IconName.Publish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Unpublish',
        onActionSelected: async () => {
          const response = await unpublishEpisodeMutation({ variables: { id } });
          if (!response.data) return response.errors;
          showNotification(unpublishNotification());
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
