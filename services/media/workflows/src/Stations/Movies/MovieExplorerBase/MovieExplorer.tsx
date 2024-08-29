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
  MoviesCastsConnection,
  MoviesDocument,
  MoviesMovieGenresConnection,
  MoviesMutatedDocument,
  MoviesMutatedSubscription,
  MoviesOrderBy,
  MoviesQuery,
  MoviesQueryVariables,
  MovieSubscriptionEventKey,
  useCreateMovieSnapshotMutation,
  useDeleteMovieMutation,
  usePublishMovieMutation,
  useUnpublishMovieMutation,
} from '../../../generated/graphql';
import { PublishStatusStateMap } from '../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { MovieDetailsQuickEdit } from '../MovieDetails/MovieDetailsQuickEdit';
import { useMoviesFilters } from './MovieExplorer.filters';
import { MovieData, MovieExplorerProps } from './MovieExplorer.types';

export const MovieExplorer: React.FC<MovieExplorerProps> = (props) => {
  const { transformFilters, filterOptions } = useMoviesFilters();
  const [createMovieSnapshotMutation] = useCreateMovieSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [publishMovieMutation] = usePublishMovieMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [unpublishMovieMutation] = useUnpublishMovieMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [deleteMovieMutation] = useDeleteMovieMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const history = useHistory();
  // Columns
  const explorerColumns: Column<MovieData>[] = [
    {
      propertyName: 'publishStatus',
      label: 'State',
      render: createThumbnailAndStateRenderer(
        'moviesImages',
        PublishStatusStateMap,
      ),
      size: '80px',
    },
    { label: 'Title', propertyName: 'title', size: '2fr' },
    { label: 'External ID', propertyName: 'externalId' },
    {
      label: 'Cast',
      propertyName: 'moviesCasts',
      sortable: false,
      render: createConnectionRenderer<MoviesCastsConnection>((node) => {
        return node.name;
      }),
    },
    {
      label: 'Genres',
      propertyName: 'moviesMovieGenres',
      sortable: false,
      render: createConnectionRenderer<MoviesMovieGenresConnection>((node) => {
        return node.movieGenres?.title;
      }),
    },
    { label: 'Released', propertyName: 'released' },
    { label: 'Created At', propertyName: 'createdDate', render: DateRenderer },
    {
      label: 'Last Modified At',
      propertyName: 'updatedDate',
      render: DateRenderer,
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<MovieData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      let filterWithExclusions = filters;

      if (props.excludeItems) {
        filterWithExclusions = { id: props.excludeItems, ...filters };
      }

      const result = await client.query<MoviesQuery, MoviesQueryVariables>({
        query: MoviesDocument,
        variables: {
          filter: transformFilters(filterWithExclusions, props.excludeItems),
          orderBy: sortToPostGraphileOrderBy(sorting, MoviesOrderBy),
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
        .subscribe<MoviesMutatedSubscription>({
          query: MoviesMutatedDocument,
        })
        .subscribe((e) => {
          switch (e.data?.movieMutated?.eventKey) {
            case MovieSubscriptionEventKey.MovieChanged:
              if (e.data.movieMutated.movie) {
                change(e.data.movieMutated.id, e.data.movieMutated.movie);
              }
              break;
            case MovieSubscriptionEventKey.MovieDeleted:
              remove(e.data.movieMutated.id);
              break;
            case MovieSubscriptionEventKey.MovieCreated:
              if (e.data.movieMutated.movie) {
                add(e.data.movieMutated.movie);
              }
              break;
          }
        });

      return () => {
        subscription.unsubscribe();
      };
    },
  };

  const generateInlineMenuActions: (data: MovieData) => ActionData[] = ({
    id,
  }) => {
    return [
      {
        label: 'Create Snapshot',
        onActionSelected: async () => {
          await createMovieSnapshotMutation({
            variables: { movieId: id },
          });
          history.push('/movies');
        },
        icon: IconName.Snapshot,
      },
      {
        label: 'Publish Now',
        onActionSelected: async () => {
          await publishMovieMutation({ variables: { id } });
          history.push('/movies');
        },
        icon: IconName.Publish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Unpublish',
        onActionSelected: async () => {
          await unpublishMovieMutation({ variables: { id } });
          history.push('/movies');
        },
        icon: IconName.Unpublish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteMovieMutation({ variables: { input: { id } } });
          history.push('/movies');
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: `/movies/${id}`,
      },
    ];
  };

  switch (props.kind) {
    case 'NavigationExplorer':
      return (
        <NavigationExplorer<MovieData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
          inlineMenuActions={generateInlineMenuActions}
          quickEditRegistrations={[
            { component: <MovieDetailsQuickEdit />, label: 'Movie Details' },
          ]}
        />
      );
    case 'SelectionExplorer':
      return (
        <SelectionExplorer<MovieData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
          generateItemLink={(item) => `/movies/${item.id}`}
        />
      );
    default:
      return <div>Explorer type is not defined</div>;
  }
};
