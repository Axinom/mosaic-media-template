import { ActionData, ActionType, IconName } from '@axinom/mosaic-ui';
import { useMemo } from 'react';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteCollectionMutation,
  usePublishCollectionMutation,
  useUnpublishCollectionMutation,
} from '../../../generated/graphql';

export function useCollectionDetailsActions(
  id: number,
): {
  readonly actions: ActionData[];
} {
  const history = useHistory();

  const [deleteCollectionMutation] = useDeleteCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [publishCollectionMutation] = usePublishCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishCollectionMutation] = useUnpublishCollectionMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  return useMemo(() => {
    const deleteCollection = async (): Promise<void> => {
      await deleteCollectionMutation({ variables: { input: { id } } });
      history.push('/collections');
    };

    const actions: ActionData[] = [
      {
        label: 'Manage Entities',
        onActionSelected: () => history.push(`/collections/${id}/entities`),
      },
      {
        label: 'Manage Cover Image',
        onActionSelected: () => history.push(`/collections/${id}/images`),
      },
      {
        label: 'Publish Now',
        confirmationMode: 'Simple',
        actionType: ActionType.Context,
        onActionSelected: async () => {
          await publishCollectionMutation({ variables: { id } });
        },
      },
      {
        label: 'Publishing Snapshots',
        onActionSelected: () => history.push(`/collections/${id}/snapshots`),
      },
      {
        label: 'Unpublish',
        confirmationMode: 'Simple',
        actionType: ActionType.Context,
        onActionSelected: async () => {
          await unpublishCollectionMutation({ variables: { id } });
        },
      },
      {
        label: 'Delete',
        confirmationMode: 'Simple',
        icon: IconName.Delete,
        onActionSelected: deleteCollection,
      },
    ];

    return { actions } as const;
  }, [
    deleteCollectionMutation,
    history,
    id,
    publishCollectionMutation,
    unpublishCollectionMutation,
  ]);
}
