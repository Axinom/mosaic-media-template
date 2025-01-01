import React from 'react';
import { CountryGroupExplorer } from '../CountryGroupExplorerBase/CountryGroupsExplorer';

export const CountryGroup: React.FC = () => {
  return (
    <CountryGroupExplorer
      title="Country Groups"
      stationKey="CountryExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/settings/media/countries/${item.id}`}
      onCreateAction="/settings/media/countries/create"
    />
  );
};
