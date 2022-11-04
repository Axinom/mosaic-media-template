import { ActionType, FormActionData, IconName } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteMovieMutation,
  usePublishMovieMutation,
  useUnpublishMovieMutation,
} from '../../../generated/graphql';
import { MovieDetailsFormData } from './MovieDetails.types';

export function useMovieDetailsActions(
  id: number,
): {
  readonly actions: FormActionData<MovieDetailsFormData>[];
} {
  const history = useHistory();

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
      onActionSelected: () => history.push(`/movies/${id}/videos`),
    },
    {
      label: 'Manage Images',
      onActionSelected: () => history.push(`/movies/${id}/images`),
    },
    {
      label: 'Licensing',
      onActionSelected: () => history.push(`/movies/${id}/licenses`),
    },
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await publishMovieMutation({ variables: { id } });
      },
    },
    {
      label: 'Publishing Snapshots',
      onActionSelected: () => history.push(`/movies/${id}/snapshots`),
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await unpublishMovieMutation({ variables: { id } });
      },
    },
    {
      label: 'Delete',
      icon: IconName.Delete,
      confirmationMode: 'Simple',
      onActionSelected: deleteMovie,
    },
  ];

  return { actions } as const;
}
