import React from 'react';
import { SeasonDetailsQuickEdit } from '../SeasonDetails/SeasonDetailsQuickEdit';
import { SeasonEpisodeManagementQuickEdit } from '../SeasonEpisodeManagement/SeasonEpisodeManagementQuickEdit';
import { SeasonExplorer } from '../SeasonExplorerBase/SeasonExplorer';
import { SeasonImageManagementQuickEdit } from '../SeasonImageManagement/SeasonImageManagementQuickEdit';
import { SeasonVideoManagementQuickEdit } from '../SeasonVideoManagement/SeasonVideoManagementQuickEdit';
import { useSeasonsActions } from './Seasons.actions';

export const Seasons: React.FC = () => {
  const { bulkActions } = useSeasonsActions();

  return (
    <SeasonExplorer
      kind="NavigationExplorer"
      title="Seasons"
      stationKey="SeasonExplorer"
      bulkActions={bulkActions}
      calculateNavigateUrl={(item) => `/seasons/${item.id}`}
      onCreateAction="/seasons/create"
      quickEditRegistrations={[
        { component: <SeasonDetailsQuickEdit />, label: 'Season Details' },
        {
          component: <SeasonEpisodeManagementQuickEdit />,
          label: 'Manage Episodes',
          generateDetailsLink: (item) => `/seasons/${item.id}/episodes`,
        },
        {
          component: <SeasonVideoManagementQuickEdit />,
          label: 'Manage Videos',
          generateDetailsLink: (item) => `/seasons/${item.id}/videos`,
        },
        {
          component: <SeasonImageManagementQuickEdit />,
          label: 'Manage Images',
          generateDetailsLink: (item) => `/seasons/${item.id}/images`,
        },
      ]}
    />
  );
};
