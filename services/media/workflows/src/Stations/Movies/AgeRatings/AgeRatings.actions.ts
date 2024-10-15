import { FormActionData } from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  usePublishMovieGenresMutation,
  useUnpublishMovieGenresMutation,
} from '../../../generated/graphql';
import { AgeRatingsFormData } from './AgeRatings.types';

export function useMovieGenresActions(): {
  readonly actions: FormActionData<AgeRatingsFormData>[];
} {
  const [publishMovieGenresMutation] = usePublishMovieGenresMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishMovieGenresMutation] = useUnpublishMovieGenresMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const actions: FormActionData<AgeRatingsFormData>[] = [
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        await publishMovieGenresMutation();
      },
    },
    {
      label: 'Publishing Snapshots',
      path: `/settings/media/moviegenres/snapshots`,
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        await unpublishMovieGenresMutation();
      },
    },
  ];

  return { actions } as const;
}
