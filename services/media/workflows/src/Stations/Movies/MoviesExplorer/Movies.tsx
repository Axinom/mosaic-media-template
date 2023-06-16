import React from 'react';
import { MovieExplorer } from '../MovieExplorerBase/MovieExplorer';
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
    />
  );
};
