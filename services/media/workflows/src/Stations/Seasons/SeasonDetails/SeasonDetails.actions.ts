import { ActionType, FormActionData, IconName } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteSeasonMutation,
  usePublishSeasonMutation,
  useUnpublishSeasonMutation,
} from '../../../generated/graphql';
import { SeasonDetailsFormData } from './SeasonDetails.types';

export function useSeasonDetailsActions(
  id: number,
): {
  readonly actions: FormActionData<SeasonDetailsFormData>[];
} {
  const history = useHistory();

  const [deleteSeasonMutation] = useDeleteSeasonMutation({
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

  const deleteSeason = async (): Promise<void> => {
    await deleteSeasonMutation({ variables: { input: { id } } });
    history.push('/seasons');
  };

  const actions: FormActionData<SeasonDetailsFormData>[] = [
    {
      label: 'Manage Episodes',
      onActionSelected: () => history.push(`/seasons/${id}/episodes`),
    },
    {
      label: 'Manage Trailers',
      onActionSelected: () => history.push(`/seasons/${id}/videos`),
    },
    {
      label: 'Manage Images',
      onActionSelected: () => history.push(`/seasons/${id}/images`),
    },
    {
      label: 'Licensing',
      onActionSelected: () => history.push(`/seasons/${id}/licenses`),
    },
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await publishSeasonMutation({ variables: { id } });
      },
    },
    {
      label: 'Publishing Snapshots',
      onActionSelected: () => history.push(`/seasons/${id}/snapshots`),
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await unpublishSeasonMutation({ variables: { id } });
      },
    },
    {
      label: 'Delete',
      icon: IconName.Delete,
      confirmationMode: 'Simple',
      onActionSelected: deleteSeason,
    },
  ];

  return { actions } as const;
}
