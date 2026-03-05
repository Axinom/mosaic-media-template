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
  TvShowsDocument,
  TvShowsMutatedDocument,
  TvShowsMutatedSubscription,
  TvshowsOrderBy,
  TvShowsQuery,
  TvShowsQueryVariables,
  TvshowsTvshowGenresConnection,
  TvshowSubscriptionEventKey,
  useCreateTvShowSnapshotMutation,
  useDeleteTvShowMutation,
  usePublishTvShowMutation,
  useUnpublishTvShowMutation,
} from '../../../generated/graphql';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { publishNowNotification } from '../../../Util/Notifications/PublishNowNotification';
import { snapshotCreateNotification } from '../../../Util/Notifications/SnapshotCreateNotification';
import { unpublishNotification } from '../../../Util/Notifications/UnpublishNotification';
import { PublishStatusStateMap } from '../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { useTvShowsFilters } from './TvShowExplorer.filters';
import { TvShowData, TvShowExplorerProps } from './TvShowExplorer.types';

export const TvShowExplorer: React.FC<TvShowExplorerProps> = (props) => {
  const showNotification = useNotification();
  const { transformFilters, filterOptions } = useTvShowsFilters();
  const [createTvShowSnapshotMutation] = useCreateTvShowSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [publishTvShowMutation] = usePublishTvShowMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [unpublishTvShowMutation] = useUnpublishTvShowMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [deleteTvShowMutation] = useDeleteTvShowMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const history = useHistory();
  // Columns
  const explorerColumns: Column<TvShowData>[] = [
    {
      propertyName: 'publishStatus',
      label: 'State',
      render: createThumbnailAndStateRenderer(
        'tvshowsImages',
        PublishStatusStateMap,
      ),
      size: '80px',
    },
    { label: 'Title', propertyName: 'title', size: '2fr' },
    { label: 'External ID', propertyName: 'externalId' },
    {
      label: 'Genres',
      sortable: false,
      propertyName: 'tvshowsTvshowGenres',
      render: createConnectionRenderer<TvshowsTvshowGenresConnection>(
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
  const dataProvider: ExplorerDataProvider<TvShowData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      let filterWithExclusions = filters;

      if (props.excludeItems) {
        filterWithExclusions = { id: props.excludeItems, ...filters };
      }

      const result = await client.query<TvShowsQuery, TvShowsQueryVariables>({
        query: TvShowsDocument,
        variables: {
          filter: transformFilters(filterWithExclusions, props.excludeItems),
          orderBy: sortToPostGraphileOrderBy(sorting, TvshowsOrderBy),
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
        .subscribe<TvShowsMutatedSubscription>({
          query: TvShowsMutatedDocument,
        })
        .subscribe((e) => {
          switch (e.data?.tvshowMutated?.eventKey) {
            case TvshowSubscriptionEventKey.TvshowChanged:
              if (e.data.tvshowMutated.tvshow) {
                change(e.data.tvshowMutated.id, e.data.tvshowMutated.tvshow);
              }
              break;
            case TvshowSubscriptionEventKey.TvshowDeleted:
              remove(e.data.tvshowMutated.id);
              break;
            case TvshowSubscriptionEventKey.TvshowCreated:
              if (e.data.tvshowMutated.tvshow) {
                add(e.data.tvshowMutated.tvshow);
              }
              break;
          }
        });

      return () => {
        subscription.unsubscribe();
      };
    },
  };

  const generateInlineMenuActions: (data: TvShowData) => ActionData[] = ({
    id,
  }) => {
    return [
      {
        label: 'Create Snapshot',
        onActionSelected: async () => {
          const response = await createTvShowSnapshotMutation({
            variables: { tvshowId: id },
          });
          if (!response.data) return response.errors;
          showNotification(
            snapshotCreateNotification({
              link: `/tvshows/${id}/snapshots/${response.data.createTvshowSnapshot.id}`,
              snapshotNo: response.data.createTvshowSnapshot?.snapshotNo,
            }),
          );
          history.push('/tvshows');
        },
        icon: IconName.Snapshot,
      },
      {
        label: 'Publish Now',
        onActionSelected: async () => {
          const response = await publishTvShowMutation({ variables: { id } });
          if (!response.data) return response.errors;
          showNotification(
            publishNowNotification({
              link: `/tvshows/${id}/snapshots/${response.data.publishTvshow.id}`,
              snapshotNo: response.data.publishTvshow?.snapshotNo,
            }),
          );
          history.push('/tvshows');
        },
        icon: IconName.Publish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Unpublish',
        onActionSelected: async () => {
          const response = await unpublishTvShowMutation({ variables: { id } });
          if (!response.data) return response.errors;
          showNotification(unpublishNotification());
          history.push('/tvshows');
        },
        icon: IconName.Unpublish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteTvShowMutation({ variables: { input: { id } } });
          history.push('/tvshows');
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: `/tvshows/${id}`,
      },
    ];
  };

  switch (props.kind) {
    case 'NavigationExplorer':
      return (
        <NavigationExplorer<TvShowData>
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
        <SelectionExplorer<TvShowData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
          generateItemLink={(item) => `/tvshows/${item.id}`}
        />
      );
    default:
      return <div>Explorer type is not defined</div>;
  }
};
