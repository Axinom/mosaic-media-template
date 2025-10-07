import { generateBulkEditMutation } from '@axinom/mosaic-ui';
import { gql } from 'graphql-tag';
import React from 'react';
import { client } from '../../../apolloClient';
import { MovieDetailsQuickEdit } from '../MovieDetails/MovieDetailsQuickEdit';
import { MovieExplorer } from '../MovieExplorerBase/MovieExplorer';
import { useMoviesFilters } from '../MovieExplorerBase/MovieExplorer.filters';
import { MovieImageManagementQuickEdit } from '../MovieImageManagement/MovieImageManagementQuickEdit';
import { MovieVideoManagementQuickEdit } from '../MovieVideoManagement/MovieVideoManagementQuickEdit';
import { MoviesBulkEdit } from './BulkEdit/MoviesBulkEdit';
import { MoviesBulkEditConfig } from './BulkEdit/MoviesBulkEditConfig';
import { useMoviesActions } from './Movies.actions';

export const Movies: React.FC = () => {
  const { bulkActions } = useMoviesActions();
  const { transformFilters } = useMoviesFilters();

  return (
    <MovieExplorer
      title="Movies"
      stationKey="MoviesExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/movies/${item.id}`}
      onCreateAction="/movies/create"
      bulkActions={bulkActions}
      quickEditRegistrations={[
        { component: <MovieDetailsQuickEdit />, label: 'Movie Details' },
        {
          component: <MovieVideoManagementQuickEdit />,
          label: 'Manage Videos',
          generateDetailsLink: (item) => `/movies/${item.id}/videos`,
        },
        {
          component: <MovieImageManagementQuickEdit />,
          label: 'Manage Images',
          generateDetailsLink: (item) => `/movies/${item.id}/images`,
        },
      ]}
      bulkEditRegistration={{
        component: <MoviesBulkEdit />,
        saveData: async (data, items) => {
          let filter = undefined as Record<string, unknown> | undefined;
          if (
            items.mode === 'SINGLE_ITEMS' &&
            items.items &&
            items.items.length > 0
          ) {
            filter = { id: { in: items.items.map((item) => item.id) } };
          }

          if (items.mode === 'SELECT_ALL') {
            filter = transformFilters(items.filters);
          }

          const mutation = generateBulkEditMutation(
            MoviesBulkEditConfig,
            data,
            filter,
          );

          await client.mutate({
            mutation: gql`
              ${mutation}
            `,
          });
        },
      }}
    />
  );
};
