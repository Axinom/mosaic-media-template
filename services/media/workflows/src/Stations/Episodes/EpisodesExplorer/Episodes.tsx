import React from 'react';
import { EpisodeDetailsQuickEdit } from '../EpisodeDetails/EpisodeDetailsQuickEdit';
import { EpisodeExplorer } from '../EpisodeExplorerBase/EpisodeExplorer';
import { EpisodeImageManagementQuickEdit } from '../EpisodeImageManagement/EpisodeImageManagementQuickEdit';
import { EpisodeVideoManagementQuickEdit } from '../EpisodeVideoManagement/EpisodeVideoManagementQuickEdit';
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
      quickEditRegistrations={[
        {
          component: <EpisodeDetailsQuickEdit />,
          label: 'Episode Details',
        },
        {
          component: <EpisodeVideoManagementQuickEdit />,
          label: 'Manage Videos',
          generateDetailsLink: (item) => `/episodes/${item.id}/videos`,
        },
        {
          component: <EpisodeImageManagementQuickEdit />,
          label: 'Manage Images',
          generateDetailsLink: (item) => `/episodes/${item.id}/images`,
        },
      ]}
    />
  );
};
