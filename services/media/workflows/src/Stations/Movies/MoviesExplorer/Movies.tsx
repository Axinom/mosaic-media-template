import React from 'react';
import { useHistory } from 'react-router-dom';
import { MovieExplorer } from '../MovieExplorerBase/MovieExplorer';
import { useMoviesActions } from './Movies.actions';

export const Movies: React.FC = () => {
  const history = useHistory();
  const { bulkActions } = useMoviesActions();

  return (
    <MovieExplorer
      title="Movies"
      stationKey="MoviesExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/movies/${item.id}`}
      onCreateAction={() => history.push(`/movies/create`)}
      bulkActions={bulkActions}
    />
  );
};
