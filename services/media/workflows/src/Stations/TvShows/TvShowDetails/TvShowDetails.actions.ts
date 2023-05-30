import { ActionType, FormActionData, IconName } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteTvShowMutation,
  usePublishTvShowMutation,
  useUnpublishTvShowMutation,
} from '../../../generated/graphql';
import { TvShowDetailsFormData } from './TvShowDetails.types';

export function useTvShowDetailsActions(
  id: number,
): {
  readonly actions: FormActionData<TvShowDetailsFormData>[];
} {
  const history = useHistory();

  const [deleteTvShowMutation] = useDeleteTvShowMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [publishTvShowMutation] = usePublishTvShowMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishTvShowMutation] = useUnpublishTvShowMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteTvShow = async (): Promise<void> => {
    await deleteTvShowMutation({ variables: { input: { id } } });
    history.push('/tvshows');
  };

  const actions: FormActionData<TvShowDetailsFormData>[] = [
    {
      label: 'Manage Seasons',
      onActionSelected: () => history.push(`/tvshows/${id}/seasons`),
    },
    {
      label: 'Manage Trailers',
      onActionSelected: () => history.push(`/tvshows/${id}/videos`),
    },
    {
      label: 'Manage Images',
      onActionSelected: () => history.push(`/tvshows/${id}/images`),
    },
    {
      label: 'Licensing',
      onActionSelected: () => history.push(`/tvshows/${id}/licenses`),
    },
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await publishTvShowMutation({ variables: { id } });
      },
    },
    {
      label: 'Publishing Snapshots',
      onActionSelected: () => history.push(`/tvshows/${id}/snapshots`),
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await unpublishTvShowMutation({ variables: { id } });
      },
    },
    {
      label: 'Delete',
      icon: IconName.Delete,
      confirmationMode: 'Simple',
      onActionSelected: deleteTvShow,
    },
  ];

  return { actions } as const;
}
