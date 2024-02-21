import React from 'react';
import { SeasonExplorer } from '../SeasonExplorerBase/SeasonExplorer';
import { useSeasonsActions } from './Seasons.actions';

export const Seasons: React.FC = () => {
  const { bulkActions } = useSeasonsActions();

  return (
    <SeasonExplorer
      kind="NavigationExplorer"
      title="Season Explorer"
      stationKey="SeasonExplorer"
      bulkActions={bulkActions}
      calculateNavigateUrl={(item) => `/seasons/${item.id}`}
      onCreateAction="/seasons/create"
    />
  );
};
