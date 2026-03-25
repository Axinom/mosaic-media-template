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
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { publishNowNotification } from '../../../Util/Notifications/PublishNowNotification';
import { unpublishNotification } from '../../../Util/Notifications/UnpublishNotification';

export function useCollectionDetailsActions(
  id: number,
): {
  readonly actions: ActionData[];
} {
  const history = useHistory();
  const showNotification = useNotification();
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
          const response = await publishCollectionMutation({
            variables: { id },
          });
          if (!response.data) {
            return response.errors;
          }
          showNotification(
            publishNowNotification({
              link: `/collections/${id}/snapshots/${response.data.publishCollection.id}`,
              snapshotNo: response.data.publishCollection?.snapshotNo,
            }),
          );
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
          const response = await unpublishCollectionMutation({
            variables: { id },
          });
          if (!response.data) {
            return response.errors;
          }
          showNotification(unpublishNotification());
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
    id,
    localizationPath,
    deleteCollectionMutation,
    history,
    publishCollectionMutation,
    showNotification,
    unpublishCollectionMutation,
  ]);
}
