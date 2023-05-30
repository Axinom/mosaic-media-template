import React from 'react';
import { useHistory } from 'react-router-dom';
import { SeasonExplorer } from '../SeasonExplorerBase/SeasonExplorer';
import { useSeasonsActions } from './Seasons.actions';

export const Seasons: React.FC = () => {
  const history = useHistory();
  const { bulkActions } = useSeasonsActions();

  return (
    <SeasonExplorer
      kind="NavigationExplorer"
      title="Season Explorer"
      stationKey="SeasonExplorer"
      bulkActions={bulkActions}
      calculateNavigateUrl={(item) => `/seasons/${item.id}`}
      onCreateAction={() => history.push(`/seasons/create`)}
    />
  );
};
