import React from 'react';
import { TvShowExplorer } from '../TvShowExplorerBase/TvShowExplorer';
import { useTvShowsActions } from './TvShows.actions';

export const TvShows: React.FC = () => {
  const { bulkActions } = useTvShowsActions();

  return (
    <TvShowExplorer
      title="TV Show Explorer"
      stationKey="TvShowExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/tvshows/${item.id}`}
      onCreateAction="/tvshows/create"
      bulkActions={bulkActions}
    />
  );
};
