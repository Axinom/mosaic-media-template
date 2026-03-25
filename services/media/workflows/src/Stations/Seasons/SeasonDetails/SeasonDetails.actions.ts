import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import { FormActionData } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteSeasonMutation,
  usePublishSeasonMutation,
  useUnpublishSeasonMutation,
} from '../../../generated/graphql';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { publishNowNotification } from '../../../Util/Notifications/PublishNowNotification';
import { unpublishNotification } from '../../../Util/Notifications/UnpublishNotification';
import { SeasonDetailsFormData } from './SeasonDetails.types';

export function useSeasonDetailsActions(id: number): {
  readonly actions: FormActionData<SeasonDetailsFormData>[];
} {
  const history = useHistory();
  const showNotification = useNotification();
  const localizationPath = getLocalizationEntryPoint('season');

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
      path: `/seasons/${id}/episodes`,
    },
    {
      label: 'Manage Trailers',
      path: `/seasons/${id}/videos`,
    },
    {
      label: 'Manage Images',
      path: `/seasons/${id}/images`,
    },
    {
      label: 'Licensing',
      path: `/seasons/${id}/licenses`,
    },
    ...(localizationPath
      ? [
          {
            label: 'Localizations',
            path: localizationPath.replace(':seasonId', id.toString()),
          },
        ]
      : []),
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        const response = await publishSeasonMutation({ variables: { id } });
        if (!response.data) return response.errors;
        showNotification(
          publishNowNotification({
            link: `/seasons/${id}/snapshots/${response.data.publishSeason.id}`,
            snapshotNo: response.data.publishSeason?.snapshotNo,
          }),
        );
      },
    },
    {
      label: 'Publishing Snapshots',
      path: `/seasons/${id}/snapshots`,
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        const response = await unpublishSeasonMutation({ variables: { id } });
        if (!response.data) return response.errors;
        showNotification(unpublishNotification());
      },
    },
    {
      label: 'Delete',
      confirmationMode: 'Simple',
      onActionSelected: deleteSeason,
    },
  ];

  return { actions } as const;
}
