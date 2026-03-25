import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import { FormActionData } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteEpisodeMutation,
  usePublishEpisodeMutation,
  useUnpublishEpisodeMutation,
} from '../../../generated/graphql';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { publishNowNotification } from '../../../Util/Notifications/PublishNowNotification';
import { unpublishNotification } from '../../../Util/Notifications/UnpublishNotification';
import { EpisodeDetailsFormData } from './EpisodeDetails.types';

export function useEpisodeDetailsActions(id: number): {
  readonly actions: FormActionData<EpisodeDetailsFormData>[];
} {
  const history = useHistory();
  const showNotification = useNotification();
  const localizationPath = getLocalizationEntryPoint('episode');

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
      path: `/episodes/${id}/videos`,
    },
    {
      label: 'Manage Images',
      path: `/episodes/${id}/images`,
    },
    {
      label: 'Licensing',
      path: `/episodes/${id}/licenses`,
    },
    ...(localizationPath
      ? [
          {
            label: 'Localizations',
            path: localizationPath.replace(':episodeId', id.toString()),
          },
        ]
      : []),
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        const response = await publishEpisodeMutation({ variables: { id } });
        if (!response.data) {
          return response.errors;
        }
        showNotification(
          publishNowNotification({
            link: `/episodes/${id}/snapshots/${response.data.publishEpisode.id}`,
            snapshotNo: response.data.publishEpisode?.snapshotNo,
          }),
        );
      },
    },
    {
      label: 'Publishing Snapshots',
      path: `/episodes/${id}/snapshots`,
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        const response = await unpublishEpisodeMutation({ variables: { id } });
        if (!response.data) {
          return response.errors;
        }
        showNotification(unpublishNotification());
      },
    },
    {
      label: 'Delete',
      confirmationMode: 'Simple',
      onActionSelected: deleteEpisode,
    },
  ];

  return { actions } as const;
}
