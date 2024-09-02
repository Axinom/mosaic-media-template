import React from 'react';
import { TvShowDetailsQuickEdit } from '../TvShowDetails/TvShowDetailsQuickEdit';
import { TvShowExplorer } from '../TvShowExplorerBase/TvShowExplorer';
import { TvShowImageManagementQuickEdit } from '../TvShowImageManagement/TvShowImageManagementQuickEdit';
import { TvShowSeasonManagementQuickEdit } from '../TvShowSeasonManagement/TvShowSeasonManagementQuickEdit';
import { TvShowVideoManagementQuickEdit } from '../TvShowVideoManagement/TvShowVideoManagementQuickEdit';
import { useTvShowsActions } from './TvShows.actions';

export const TvShows: React.FC = () => {
  const { bulkActions } = useTvShowsActions();

  return (
    <TvShowExplorer
      title="TV Shows"
      stationKey="TvShowExplorer"
      kind="NavigationExplorer"
      calculateNavigateUrl={(item) => `/tvshows/${item.id}`}
      onCreateAction="/tvshows/create"
      bulkActions={bulkActions}
      quickEditRegistrations={[
        { component: <TvShowDetailsQuickEdit />, label: 'TV Show Details' },
        {
          component: <TvShowSeasonManagementQuickEdit />,
          label: 'Manage Seasons',
          generateDetailsLink: (item) => `/tvshows/${item.id}/seasons`,
        },
        {
          component: <TvShowVideoManagementQuickEdit />,
          label: 'Manage Trailers',
          generateDetailsLink: (item) => `/tvshows/${item.id}/videos`,
        },
        {
          component: <TvShowImageManagementQuickEdit />,
          label: 'Manage Images',
          generateDetailsLink: (item) => `/tvshows/${item.id}/images`,
        },
      ]}
    />
  );
};
