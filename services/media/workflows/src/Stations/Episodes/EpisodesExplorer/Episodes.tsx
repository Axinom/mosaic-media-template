import React from 'react';
import { useHistory } from 'react-router-dom';
import { EpisodeExplorer } from '../EpisodeExplorerBase/EpisodeExplorer';
import { useEpisodesActions } from './Episodes.actions';

export const Episodes: React.FC = () => {
  const history = useHistory();

  const { bulkActions } = useEpisodesActions();

  return (
    <EpisodeExplorer
      kind="NavigationExplorer"
      title="Episode Explorer"
      stationKey="EpisodeExplorer"
      bulkActions={bulkActions}
      calculateNavigateUrl={(item) => `/episodes/${item.id}`}
      onCreateAction={() => history.push(`/episodes/create`)}
    />
  );
};
