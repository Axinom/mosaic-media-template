import React from 'react';
import { MovieDetailsQuickEdit } from '../MovieDetails/MovieDetailsQuickEdit';
import { MovieExplorer } from '../MovieExplorerBase/MovieExplorer';
import { MovieImageManagementQuickEdit } from '../MovieImageManagement/MovieImageManagementQuickEdit';
import { MovieVideoManagementQuickEdit } from '../MovieVideoManagement/MovieVideoManagementQuickEdit';
import { useMoviesActions } from './Movies.actions';

export const Movies: React.FC = () => {
  const { bulkActions } = useMoviesActions();

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
    />
  );
};
