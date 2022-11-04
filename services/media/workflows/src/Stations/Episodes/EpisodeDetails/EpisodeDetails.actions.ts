import { ActionType, FormActionData, IconName } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteEpisodeMutation,
  usePublishEpisodeMutation,
  useUnpublishEpisodeMutation,
} from '../../../generated/graphql';
import { EpisodeDetailsFormData } from './EpisodeDetails.types';

export function useEpisodeDetailsActions(
  id: number,
): {
  readonly actions: FormActionData<EpisodeDetailsFormData>[];
} {
  const history = useHistory();

  const [deleteEpisodeMutation] = useDeleteEpisodeMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [publishEpisodeMutation] = usePublishEpisodeMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishEpisodeMutation] = useUnpublishEpisodeMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteEpisode = async (): Promise<void> => {
    await deleteEpisodeMutation({ variables: { input: { id } } });
    history.push('/episodes');
  };

  const actions: FormActionData<EpisodeDetailsFormData>[] = [
    {
      label: 'Manage Videos',
      onActionSelected: () => history.push(`/episodes/${id}/videos`),
    },
    {
      label: 'Manage Images',
      onActionSelected: () => history.push(`/episodes/${id}/images`),
    },
    {
      label: 'Licensing',
      onActionSelected: () => history.push(`/episodes/${id}/licenses`),
    },
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await publishEpisodeMutation({ variables: { id } });
      },
    },
    {
      label: 'Publishing Snapshots',
      onActionSelected: () => history.push(`/episodes/${id}/snapshots`),
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await unpublishEpisodeMutation({ variables: { id } });
      },
    },
    {
      label: 'Delete',
      icon: IconName.Delete,
      confirmationMode: 'Simple',
      onActionSelected: deleteEpisode,
    },
  ];

  return { actions } as const;
}
