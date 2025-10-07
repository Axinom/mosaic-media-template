import { generateBulkEditMutation } from '@axinom/mosaic-ui';
import gql from 'graphql-tag';
import React from 'react';
import { client } from '../../../apolloClient';
import { SeasonDetailsQuickEdit } from '../SeasonDetails/SeasonDetailsQuickEdit';
import { SeasonEpisodeManagementQuickEdit } from '../SeasonEpisodeManagement/SeasonEpisodeManagementQuickEdit';
import { SeasonExplorer } from '../SeasonExplorerBase/SeasonExplorer';
import { useSeasonsFilters } from '../SeasonExplorerBase/SeasonExplorer.filters';
import { SeasonImageManagementQuickEdit } from '../SeasonImageManagement/SeasonImageManagementQuickEdit';
import { SeasonVideoManagementQuickEdit } from '../SeasonVideoManagement/SeasonVideoManagementQuickEdit';
import { SeasonsBulkEdit } from './BulkEdit/SeasonsBulkEdit';
import { SeasonsBulkEditConfig } from './BulkEdit/SeasonsBulkEditConfig';
import { useSeasonsActions } from './Seasons.actions';

export const Seasons: React.FC = () => {
  const { bulkActions } = useSeasonsActions();
  const { transformFilters } = useSeasonsFilters();

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
      bulkEditRegistration={{
        component: <SeasonsBulkEdit />,
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
            SeasonsBulkEditConfig,
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
