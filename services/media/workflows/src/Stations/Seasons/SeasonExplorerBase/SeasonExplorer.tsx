import { createThumbnailAndStateRenderer } from '@axinom/mosaic-managed-workflow-integration';
import {
  ActionData,
  Column,
  createConnectionRenderer,
  DateRenderer,
  ExplorerDataProvider,
  IconName,
  NavigationExplorer,
  SelectionExplorer,
  sortToPostGraphileOrderBy,
} from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  SeasonsDocument,
  SeasonsMutatedDocument,
  SeasonsMutatedSubscription,
  SeasonsOrderBy,
  SeasonsQuery,
  SeasonsQueryVariables,
  SeasonsTvshowGenresConnection,
  SeasonSubscriptionEventKey,
  useCreateSeasonSnapshotMutation,
  useDeleteSeasonMutation,
  usePublishSeasonMutation,
  useUnpublishSeasonMutation,
} from '../../../generated/graphql';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { publishNowNotification } from '../../../Util/Notifications/PublishNowNotification';
import { snapshotCreateNotification } from '../../../Util/Notifications/SnapshotCreateNotification';
import { unpublishNotification } from '../../../Util/Notifications/UnpublishNotification';
import { PublishStatusStateMap } from '../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { SeasonIndexRenderer } from './renderers/SeasonIndexRenderer';
import { SeasonParentRenderer } from './renderers/SeasonParentRenderer';
import { useSeasonsFilters } from './SeasonExplorer.filters';
import { SeasonData, SeasonExplorerProps } from './SeasonExplorer.types';

export const SeasonExplorer: React.FC<SeasonExplorerProps> = (props) => {
  const showNotification = useNotification();
  const { filterOptions, transformFilters } = useSeasonsFilters();
  const [createSeasonSnapshotMutation] = useCreateSeasonSnapshotMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [publishSeasonMutation] = usePublishSeasonMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [unpublishSeasonMutation] = useUnpublishSeasonMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const [deleteSeasonMutation] = useDeleteSeasonMutation({
    client,
    fetchPolicy: 'no-cache',
  });
  const history = useHistory();

  // Columns
  const explorerColumns: Column<SeasonData>[] = [
    {
      propertyName: 'publishStatus',
      label: 'State',
      render: createThumbnailAndStateRenderer(
        'seasonsImages',
        PublishStatusStateMap,
      ),
      size: '80px',
    },
    { label: 'Index', propertyName: 'index', render: SeasonIndexRenderer },
    {
      label: 'TV Show',
      propertyName: 'tvshow',
      render: SeasonParentRenderer,
      sortable: false,
    },
    { label: 'External ID', propertyName: 'externalId' },
    {
      label: 'Genres',
      propertyName: 'seasonsTvshowGenres',
      sortable: false,
      render: createConnectionRenderer<SeasonsTvshowGenresConnection>(
        (node) => {
          return node.tvshowGenres?.title;
        },
      ),
    },
    { label: 'Created At', propertyName: 'createdDate', render: DateRenderer },
    {
      label: 'Last Modified At',
      propertyName: 'updatedDate',
      render: DateRenderer,
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<SeasonData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      let filterWithExclusions = filters;

      if (props.excludeItems) {
        filterWithExclusions = { id: props.excludeItems, ...filters };
      }

      const result = await client.query<SeasonsQuery, SeasonsQueryVariables>({
        query: SeasonsDocument,
        variables: {
          filter: transformFilters(filterWithExclusions, props.excludeItems),
          orderBy: sortToPostGraphileOrderBy(sorting, SeasonsOrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'network-only',
      });

      return {
        data: result.data.filtered?.nodes ?? [],
        totalCount: result.data.nonFiltered?.totalCount as number,
        filteredCount: result.data.filtered?.totalCount as number,
        hasMoreData: result.data.filtered?.pageInfo.hasNextPage || false,
        pagingInformation: result.data.filtered?.pageInfo.endCursor,
      };
    },
    connect: ({ change, add, remove }) => {
      const subscription = client
        .subscribe<SeasonsMutatedSubscription>({
          query: SeasonsMutatedDocument,
        })
        .subscribe((e) => {
          switch (e.data?.seasonMutated?.eventKey) {
            case SeasonSubscriptionEventKey.SeasonChanged:
              if (e.data.seasonMutated.season) {
                change(e.data.seasonMutated.id, e.data.seasonMutated.season);
              }
              break;
            case SeasonSubscriptionEventKey.SeasonDeleted:
              remove(e.data.seasonMutated.id);
              break;
            case SeasonSubscriptionEventKey.SeasonCreated:
              if (e.data.seasonMutated.season) {
                add(e.data.seasonMutated.season);
              }
              break;
          }
        });

      return () => {
        subscription.unsubscribe();
      };
    },
  };

  const generateInlineMenuActions: (data: SeasonData) => ActionData[] = ({
    id,
    tvshow,
  }) => {
    return [
      {
        label: 'Create Snapshot',
        onActionSelected: async () => {
          const response = await createSeasonSnapshotMutation({
            variables: { seasonId: id },
          });
          if (!response.data) return response.errors;
          showNotification(
            snapshotCreateNotification({
              link: `/seasons/${id}/snapshots/${response.data.createSeasonSnapshot.id}`,
              snapshotNo: response.data.createSeasonSnapshot?.snapshotNo,
            }),
          );
          history.push('/seasons');
        },
        icon: IconName.Snapshot,
      },
      {
        label: 'Publish Now',
        onActionSelected: async () => {
          const response = await publishSeasonMutation({ variables: { id } });
          if (!response.data) return response.errors;
          showNotification(
            publishNowNotification({
              link: `/seasons/${id}/snapshots/${response.data.publishSeason.id}`,
              snapshotNo: response.data.publishSeason?.snapshotNo,
            }),
          );
          history.push('/seasons');
        },
        icon: IconName.Publish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Unpublish',
        onActionSelected: async () => {
          const response = await unpublishSeasonMutation({ variables: { id } });
          if (!response.data) return response.errors;
          showNotification(unpublishNotification());
          history.push('/seasons');
        },
        icon: IconName.Unpublish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteSeasonMutation({ variables: { input: { id } } });
          history.push('/seasons');
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: `/seasons/${id}`,
      },
      ...(tvshow
        ? [
            {
              label: 'Open Parent Entity',
              path: `/tvshows/${tvshow?.id}`,
              openInNewTab: true,
            },
          ]
        : []),
    ];
  };

  switch (props.kind) {
    case 'NavigationExplorer':
      return (
        <NavigationExplorer<SeasonData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
          inlineMenuActions={generateInlineMenuActions}
        />
      );
    case 'SelectionExplorer':
      return (
        <SelectionExplorer<SeasonData>
          {...props}
          columns={explorerColumns}
          dataProvider={dataProvider}
          filterOptions={filterOptions}
          defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
          generateItemLink={(item) => `/seasons/${item.id}`}
        />
      );
    default:
      return <div>Explorer type is not defined</div>;
  }
};
