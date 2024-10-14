import {
  ActionData,
  Column,
  createStateRenderer,
  DateRenderer,
  ExplorerDataProvider,
  formatSecondsToTimestamp,
  IconName,
  NavigationExplorer,
  sortToPostGraphileOrderBy,
} from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import { client } from '../../../apolloClient';
import {
  PlaylistsDocument,
  PlaylistsOrderBy,
  PlaylistsQuery,
  PlaylistsQueryVariables,
  ProgramsConnection,
  useDeletePlaylistMutation,
  useUnpublishPlaylistMutation,
} from '../../../generated/graphql';
import { publicationStateMap } from '../../../util/Publishing/publicationStateMap';
import { routes } from '../routes';
import { filterOptions, transformFilters } from './Playlists.filters';
import classes from './Playlists.module.scss';
import { PlaylistsData } from './Playlists.types';

export const Playlists: React.FC = () => {
  const [deletePlaylistMutation] = useDeletePlaylistMutation({
    client,
  });
  const [unpublishPlaylistMutation] = useUnpublishPlaylistMutation({
    client,
  });

  const channelId = useParams<{ channelId: string }>().channelId;

  const dataProvider: ExplorerDataProvider<PlaylistsData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      const result = await client.query<
        PlaylistsQuery,
        PlaylistsQueryVariables
      >({
        query: PlaylistsDocument,
        variables: {
          channelId: channelId,
          filter: transformFilters(filters),
          orderBy: sortToPostGraphileOrderBy(sorting, PlaylistsOrderBy),
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
  };

  const explorerColumns: Column<PlaylistsData>[] = [
    {
      propertyName: 'publicationState',
      size: '20px',
      label: '',
      render: createStateRenderer(publicationStateMap),
    },
    {
      propertyName: 'startDateTime',
      size: '1.5fr',
      label: 'Scheduled Start',
      render: DateRenderer,
    },
    {
      propertyName: 'title',
      size: '1.5fr',
      label: 'Title',
    },
    {
      propertyName: 'programs',
      size: '0.8fr',
      label: 'Programs',
      sortable: false,
      render: (v) =>
        (v as Pick<ProgramsConnection, 'totalCount'>)?.totalCount ?? 0,
    },
    {
      propertyName: 'calculatedDurationInSeconds',
      size: '0.8fr',
      label: 'Duration',
      render: (v) => formatSecondsToTimestamp(v as number),
    },
    {
      propertyName: 'updatedDate',
      size: '1fr',
      label: 'Last Modified At',
      render: DateRenderer,
    },
  ];

  const history = useHistory();

  const generateInlineMenuActions: (data: PlaylistsData) => ActionData[] = ({
    id: playlistId,
    publishedDate,
  }) => {
    return [
      {
        label: 'Open Details',
        path: routes.generate(routes.playlistDetails, {
          channelId,
          playlistId,
        }),
      },
      {
        label: 'Publishing',
        path: routes.generate(routes.playlistPublishing, {
          channelId,
          playlistId,
        }),
      },
      {
        label: 'Unpublish',
        confirmationMode: 'Advanced',
        onActionSelected: async () => {
          await unpublishPlaylistMutation({
            variables: { input: { id: playlistId } },
          });
          history.push(routes.generate(routes.playlists, { channelId }));
        },
        isDisabled: !publishedDate,
        confirmationConfig: {
          body: (
            <>
              <p>Are you sure you want to unpublish the playlist?</p>
            </>
          ),
        },
      },
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deletePlaylistMutation({
            variables: { input: { id: playlistId } },
          });
          history.push(
            routes.generate(routes.playlists, {
              channelId,
            }),
          );
        },
        isDisabled: !!publishedDate,
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
    ];
  };

  return (
    <NavigationExplorer<PlaylistsData>
      title="Playlists"
      stationKey="playlists"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(rowData) =>
        routes.generate(routes.playlistDetails, {
          channelId,
          playlistId: rowData.id,
        })
      }
      defaultSortOrder={{ column: 'startDateTime', direction: 'asc' }}
      filterOptions={filterOptions}
      onCreateAction={routes.generate(routes.playlistCreate, {
        channelId,
      })}
      defaultFilterValues={{
        startDateTime: 'upcoming',
      }}
      className={classes.explorer}
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};
