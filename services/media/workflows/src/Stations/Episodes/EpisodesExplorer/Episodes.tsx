import React from 'react';
import { EpisodeExplorer } from '../EpisodeExplorerBase/EpisodeExplorer';
import { useEpisodesActions } from './Episodes.actions';

export const Episodes: React.FC = () => {
  const { bulkActions } = useEpisodesActions();

  return (
    <EpisodeExplorer
      kind="NavigationExplorer"
      title="Episodes"
      stationKey="EpisodeExplorer"
      bulkActions={bulkActions}
      calculateNavigateUrl={(item) => `/episodes/${item.id}`}
      onCreateAction="/episodes/create"
    />
  );
};
