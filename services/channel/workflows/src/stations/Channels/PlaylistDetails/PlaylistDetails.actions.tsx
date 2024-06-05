import { FormActionData } from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  PlaylistPatch,
  useDeletePlaylistMutation,
  useUnpublishPlaylistMutation,
} from '../../../generated/graphql';
import { routes } from '../routes';

export function useActions(
  channelId: string,
  playlistId: string,
  isPublished: boolean,
): {
  readonly actions: FormActionData<PlaylistPatch>[];
} {
  const history = useHistory();

  const [deletePlaylistMutation] = useDeletePlaylistMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishPlaylistMutation] = useUnpublishPlaylistMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deletePlaylist = async (): Promise<void> => {
    await deletePlaylistMutation({ variables: { input: { id: playlistId } } });
    history.push(
      routes.generate(routes.playlists, {
        channelId,
      }),
    );
  };

  const actions: FormActionData<PlaylistPatch>[] = [
    {
      label: 'Programs',
      path: routes.generate(routes.programs, {
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
    isPublished
      ? {
          label: 'Unpublish',
          confirmationMode: 'Advanced',
          onActionSelected: async () => {
            await unpublishPlaylistMutation({
              variables: { input: { id: playlistId } },
            });
            history.push(
              routes.generate(routes.playlistDetails, {
                channelId,
                playlistId,
              }),
            );
          },
          confirmationConfig: {
            body: (
              <>
                <p>Are you sure you want to unpublish the playlist?</p>
              </>
            ),
          },
        }
      : {
          label: 'Delete',
          confirmationMode: 'Simple',
          onActionSelected: deletePlaylist,
        },
  ];

  return { actions } as const;
}
