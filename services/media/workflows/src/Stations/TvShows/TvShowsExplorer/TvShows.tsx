import React from 'react';
import { useHistory } from 'react-router-dom';
import { TvShowExplorer } from '../TvShowExplorerBase/TvShowExplorer';
import { useTvShowsActions } from './TvShows.actions';

export const TvShows: React.FC = () => {
  const history = useHistory();
  const { bulkActions } = useTvShowsActions();

  return (
    <TvShowExplorer
      title="TV Show Explorer"
      stationKey="TvShowExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/tvshows/${item.id}`}
      onCreateAction={() => history.push(`/tvshows/create`)}
      bulkActions={bulkActions}
    />
  );
};
