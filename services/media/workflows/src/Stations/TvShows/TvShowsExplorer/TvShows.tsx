import { generateBulkEditMutation } from '@axinom/mosaic-ui';
import gql from 'graphql-tag';
import React from 'react';
import { client } from '../../../apolloClient';
import { TvShowDetailsQuickEdit } from '../TvShowDetails/TvShowDetailsQuickEdit';
import { TvShowExplorer } from '../TvShowExplorerBase/TvShowExplorer';
import { useTvShowsFilters } from '../TvShowExplorerBase/TvShowExplorer.filters';
import { TvShowImageManagementQuickEdit } from '../TvShowImageManagement/TvShowImageManagementQuickEdit';
import { TvShowSeasonManagementQuickEdit } from '../TvShowSeasonManagement/TvShowSeasonManagementQuickEdit';
import { TvShowVideoManagementQuickEdit } from '../TvShowVideoManagement/TvShowVideoManagementQuickEdit';
import { TvShowsBulkEdit, TvShowsBulkEditConfig } from './BulkEdit';
import { useTvShowsActions } from './TvShows.actions';

export const TvShows: React.FC = () => {
  const { bulkActions } = useTvShowsActions();
  const { transformFilters } = useTvShowsFilters();

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
      bulkEditRegistration={{
        component: <TvShowsBulkEdit />,
        saveData: async (data, items) => {
          let filter = undefined as Record<string, unknown> | undefined;
          if (
            items.mode === 'SINGLE_ITEMS' &&
            items.items &&
            items.items.length > 0
          ) {
            filter = { id: { in: items.items.map((item) => item.id) } };
          }

          if (items.mode === 'SELECT_ALL') {
            filter = transformFilters(items.filters);
          }

          const mutation = generateBulkEditMutation(
            TvShowsBulkEditConfig,
            data,
            filter,
          );

          await client.mutate({
            mutation: gql`
              ${mutation}
            `,
          });
        },
      }}
    />
  );
};
