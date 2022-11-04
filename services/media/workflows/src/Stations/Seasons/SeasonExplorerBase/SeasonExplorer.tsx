import {
  ActionData,
  ActionType,
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
import { getThumbnailAndStateRenderer } from '../../../externals';
import {
  SeasonsDocument,
  SeasonsMutatedDocument,
  SeasonsMutatedSubscription,
  SeasonsOrderBy,
  SeasonsQuery,
  SeasonsQueryVariables,
  SeasonsTvshowGenresConnection,
  useCreateSeasonSnapshotMutation,
  useDeleteSeasonMutation,
  usePublishSeasonMutation,
  useUnpublishSeasonMutation,
} from '../../../generated/graphql';
import { PublishStatusStateMap } from '../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { useSeasonsFilters } from './SeasonExplorer.filters';
import { SeasonData, SeasonExplorerProps } from './SeasonExplorer.types';

export const SeasonExplorer: React.FC<SeasonExplorerProps> = (props) => {
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
      render: getThumbnailAndStateRenderer()(
        'seasonsImages',
        PublishStatusStateMap,
      ),
      size: '80px',
    },
    { label: 'Season Index', propertyName: 'index' },
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
          switch (e.data?.seasonMutated?.event) {
            case 'SeasonChanged':
              if (e.data.seasonMutated.season) {
                change(e.data.seasonMutated.id, e.data.seasonMutated.season);
              }
              break;
            case 'SeasonDeleted':
              remove(e.data.seasonMutated.id);
              break;
            case 'SeasonCreated':
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
  }) => {
    return [
      {
        label: 'Create Snapshot',
        onActionSelected: async () => {
          await createSeasonSnapshotMutation({
            variables: { seasonId: id },
          });
          history.push('/seasons');
        },
        actionType: ActionType.Context,
        icon: IconName.Snapshot,
      },
      {
        label: 'Publish Now',
        onActionSelected: async () => {
          await publishSeasonMutation({ variables: { id } });
          history.push('/seasons');
        },
        actionType: ActionType.Context,
        icon: IconName.Publish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Unpublish',
        onActionSelected: async () => {
          await unpublishSeasonMutation({ variables: { id } });
          history.push('/seasons');
        },
        actionType: ActionType.Context,
        icon: IconName.Unpublish,
        confirmationMode: 'Simple',
      },
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteSeasonMutation({ variables: { input: { id } } });
          history.push('/seasons');
        },
        actionType: ActionType.Context,
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        onActionSelected: () => history.push(`/seasons/${id}`),
        actionType: ActionType.Navigation,
        icon: IconName.ChevronRight,
      },
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
        />
      );
    default:
      return <div>Explorer type is not defined</div>;
  }
};
