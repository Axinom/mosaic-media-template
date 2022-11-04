import { ActionType, FormActionData } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  usePublishMovieGenresMutation,
  useUnpublishMovieGenresMutation,
} from '../../../generated/graphql';
import { MovieGenresFormData } from './MovieGenres.types';

export function useMovieGenresActions(): {
  readonly actions: FormActionData<MovieGenresFormData>[];
} {
  const history = useHistory();

  const [publishMovieGenresMutation] = usePublishMovieGenresMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishMovieGenresMutation] = useUnpublishMovieGenresMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const actions: FormActionData<MovieGenresFormData>[] = [
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await publishMovieGenresMutation();
      },
    },
    {
      label: 'Publishing Snapshots',
      onActionSelected: () =>
        history.push(`/settings/media/moviegenres/snapshots`),
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await unpublishMovieGenresMutation();
      },
    },
  ];

  return { actions } as const;
}
