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
  TvShowsDocument,
  TvShowsMutatedDocument,
  TvShowsMutatedSubscription,
  TvshowsOrderBy,
  TvShowsQuery,
  TvShowsQueryVariables,
  TvshowsTvshowGenresConnection,
  useCreateTvShowSnapshotMutation,
  useDeleteTvShowMutation,
  usePublishTvShowMutation,
  useUnpublishTvShowMutation,
} from '../../../generated/graphql';
import { PublishStatusStateMap } from '../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { useTvShowsFilters } from './TvShowExplorer.filters';
import { TvShowData, TvShowExplorerProps } from './TvShowExplorer.types';

export const TvShowExplorer: React.FC<TvShowExplorerProps> = (props) => {
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
      render: getThumbnailAndStateRenderer()(
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
          switch (e.data?.tvshowMutated?.event) {
            case 'TvshowChanged':
              if (e.data.tvshowMutated.tvshow) {
                change(e.data.tvshowMutated.id, e.data.tvshowMutated.tvshow);
              }
              break;
            case 'TvshowDeleted':
              remove(e.data.tvshowMutated.id);
              break;
            case 'TvshowCreated':
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
          await createTvShowSnapshotMutation({
            variables: { tvshowId: id },
          });
          history.push('/tvshows');
        },
        icon: IconName.Snapshot,
      },
      {
        label: 'Publish Now',
        onActionSelected: async () => {
          await publishTvShowMutation({ variables: { id } });
          history.push('/tvshows');
        },
        icon: IconName.Publish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Unpublish',
        onActionSelected: async () => {
          await unpublishTvShowMutation({ variables: { id } });
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
        />
      );
    default:
      return <div>Explorer type is not defined</div>;
  }
};
