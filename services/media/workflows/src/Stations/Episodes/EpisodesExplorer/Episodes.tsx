import { generateBulkEditMutation } from '@axinom/mosaic-ui';
import { gql } from 'graphql-tag';
import React from 'react';
import { client } from '../../../apolloClient';
import { EpisodeDetailsQuickEdit } from '../EpisodeDetails/EpisodeDetailsQuickEdit';
import { EpisodeExplorer } from '../EpisodeExplorerBase/EpisodeExplorer';
import { useEpisodesFilters } from '../EpisodeExplorerBase/EpisodeExplorer.filters';
import { EpisodeImageManagementQuickEdit } from '../EpisodeImageManagement/EpisodeImageManagementQuickEdit';
import { EpisodeVideoManagementQuickEdit } from '../EpisodeVideoManagement/EpisodeVideoManagementQuickEdit';
import { EpisodesBulkEdit, EpisodesBulkEditConfig } from './BulkEdit';
import { useEpisodesActions } from './Episodes.actions';

export const Episodes: React.FC = () => {
  const { bulkActions } = useEpisodesActions();
  const { transformFilters } = useEpisodesFilters();

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
      bulkEditRegistration={{
        component: <EpisodesBulkEdit />,
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
            EpisodesBulkEditConfig,
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
