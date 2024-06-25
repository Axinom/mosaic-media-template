import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import { FormActionData } from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  ChannelPatch,
  useDeleteChannelMutation,
  useUnpublishChannelMutation,
} from '../../../generated/graphql';
import { routes } from '../routes';

export function useActions(
  channelId: string,
  isPublished: boolean,
): {
  readonly actions: FormActionData<ChannelPatch>[];
} {
  const history = useHistory();

  const [deleteChannelMutation] = useDeleteChannelMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const translationPath = getLocalizationEntryPoint('channel');

  const [unpublishChannelMutation] = useUnpublishChannelMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const actions: FormActionData<ChannelPatch>[] = [
    {
      label: 'Playlists',
      path: routes.generate(routes.playlists, {
        channelId,
      }),
    },
    {
      label: 'Manage Logo',
      path: routes.generate(routes.channelLogo, {
        channelId,
      }),
    },
    {
      label: 'Manage Placeholder Video',
      path: routes.generate(routes.channelVideos, {
        channelId,
      }),
    },
    {
      label: 'Publishing',
      path: routes.generate(routes.channelPublishing, {
        channelId,
      }),
    },
    ...(translationPath
      ? [
          {
            label: 'Localizations',
            path: routes.generate(translationPath, {
              channelId,
            }),
          },
        ]
      : []),
    isPublished
      ? {
          label: 'Unpublish',
          confirmationMode: 'Advanced',
          onActionSelected: async () => {
            await unpublishChannelMutation({
              variables: { input: { id: channelId } },
            });
            history.push(
              routes.generate(routes.channelDetails, {
                channelId,
              }),
            );
          },
          confirmationConfig: {
            body: (
              <>
                <p>Are you sure you want to unpublish the channel?</p>
              </>
            ),
          },
        }
      : {
          label: 'Delete',
          confirmationMode: 'Simple',
          onActionSelected: async () => {
            await deleteChannelMutation({
              variables: { input: { id: channelId } },
            });
            history.push(routes.channels);
          },
        },
  ];
  return { actions } as const;
}
