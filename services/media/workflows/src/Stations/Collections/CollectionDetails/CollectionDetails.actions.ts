import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import { ActionData } from '@axinom/mosaic-ui';
import { useMemo } from 'react';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteCollectionMutation,
  usePublishCollectionMutation,
  useUnpublishCollectionMutation,
} from '../../../generated/graphql';

export function useCollectionDetailsActions(id: number): {
  readonly actions: ActionData[];
} {
  const history = useHistory();
  const localizationPath = getLocalizationEntryPoint('collection');

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
        path: `/collections/${id}/entities`,
      },
      {
        label: 'Manage Cover Image',
        path: `/collections/${id}/images`,
      },
      ...(localizationPath
        ? [
            {
              label: 'Localizations',
              path: localizationPath.replace(':collectionId', id.toString()),
            },
          ]
        : []),
      {
        label: 'Publish Now',
        confirmationMode: 'Simple',
        onActionSelected: async () => {
          await publishCollectionMutation({ variables: { id } });
        },
      },
      {
        label: 'Publishing Snapshots',
        path: `/collections/${id}/snapshots`,
      },
      {
        label: 'Unpublish',
        confirmationMode: 'Simple',
        onActionSelected: async () => {
          await unpublishCollectionMutation({ variables: { id } });
        },
      },
      {
        label: 'Delete',
        confirmationMode: 'Simple',
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
    localizationPath,
  ]);
}
