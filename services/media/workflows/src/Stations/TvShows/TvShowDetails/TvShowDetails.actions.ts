import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import { FormActionData } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteTvShowMutation,
  usePublishTvShowMutation,
  useUnpublishTvShowMutation,
} from '../../../generated/graphql';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { publishNowNotification } from '../../../Util/Notifications/PublishNowNotification';
import { unpublishNotification } from '../../../Util/Notifications/UnpublishNotification';
import { TvShowDetailsFormData } from './TvShowDetails.types';

export function useTvShowDetailsActions(id: number): {
  readonly actions: FormActionData<TvShowDetailsFormData>[];
} {
  const history = useHistory();
  const showNotification = useNotification();
  const localizationPath = getLocalizationEntryPoint('tv_show');

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
      path: `/tvshows/${id}/seasons`,
    },
    {
      label: 'Manage Trailers',
      path: `/tvshows/${id}/videos`,
    },
    {
      label: 'Manage Images',
      path: `/tvshows/${id}/images`,
    },
    {
      label: 'Licensing',
      path: `/tvshows/${id}/licenses`,
    },
    ...(localizationPath
      ? [
          {
            label: 'Localizations',
            path: localizationPath.replace(':tvshowId', id.toString()),
          },
        ]
      : []),
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        const response = await publishTvShowMutation({ variables: { id } });
        if (!response.data) return response.errors;
        showNotification(
          publishNowNotification({
            link: `/tvshows/${id}/snapshots/${response.data.publishTvshow.id}`,
            snapshotNo: response.data.publishTvshow?.snapshotNo,
          }),
        );
      },
    },
    {
      label: 'Publishing Snapshots',
      path: `/tvshows/${id}/snapshots`,
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        const response = await unpublishTvShowMutation({ variables: { id } });
        if (!response.data) return response.errors;
        showNotification(unpublishNotification());
      },
    },
    {
      label: 'Delete',
      confirmationMode: 'Simple',
      onActionSelected: deleteTvShow,
    },
  ];

  return { actions } as const;
}
