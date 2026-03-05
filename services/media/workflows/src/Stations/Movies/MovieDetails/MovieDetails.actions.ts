import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import { FormActionData } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteMovieMutation,
  usePublishMovieMutation,
  useUnpublishMovieMutation,
} from '../../../generated/graphql';
import { useNotification } from '../../../Util/Notifications/NotificationContext';
import { publishNowNotification } from '../../../Util/Notifications/PublishNowNotification';
import { unpublishNotification } from '../../../Util/Notifications/UnpublishNotification';
import { MovieDetailsFormData } from './MovieDetails.types';

export function useMovieDetailsActions(id: number): {
  readonly actions: FormActionData<MovieDetailsFormData>[];
} {
  const history = useHistory();
  const showNotification = useNotification();
  const localizationPath = getLocalizationEntryPoint('movie');

  const [deleteMovieMutation] = useDeleteMovieMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [publishMovieMutation] = usePublishMovieMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishMovieMutation] = useUnpublishMovieMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteMovie = async (): Promise<void> => {
    await deleteMovieMutation({ variables: { input: { id } } });
    history.push('/movies');
  };

  const actions: FormActionData<MovieDetailsFormData>[] = [
    {
      label: 'Manage Videos',
      path: `/movies/${id}/videos`,
    },
    {
      label: 'Manage Images',
      path: `/movies/${id}/images`,
    },
    {
      label: 'Licensing',
      path: `/movies/${id}/licenses`,
    },
    ...(localizationPath
      ? [
          {
            label: 'Localizations',
            path: localizationPath.replace(':movieId', id.toString()),
          },
        ]
      : []),
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        const response = await publishMovieMutation({ variables: { id } });
        if (!response.data) return response.errors;
        showNotification(
          publishNowNotification({
            link: `/movies/${id}/snapshots/${response.data.publishMovie.id}`,
            snapshotNo: response.data.publishMovie?.snapshotNo,
          }),
        );
      },
    },
    {
      label: 'Publishing Snapshots',
      path: `/movies/${id}/snapshots`,
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        const response = await unpublishMovieMutation({ variables: { id } });
        if (!response.data) return response.errors;
        showNotification(unpublishNotification());
      },
    },
    {
      label: 'Delete',
      confirmationMode: 'Simple',
      onActionSelected: deleteMovie,
    },
  ];

  return { actions } as const;
}
