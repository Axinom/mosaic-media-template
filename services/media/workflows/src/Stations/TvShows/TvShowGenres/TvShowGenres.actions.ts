import { FormActionData } from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import {
  usePublishTvShowGenresMutation,
  useUnpublishTvShowGenresMutation,
} from '../../../generated/graphql';
import { TvShowGenresFormData } from './TvShowGenres.types';

export function useTvShowGenresActions(): {
  readonly actions: FormActionData<TvShowGenresFormData>[];
} {
  const [publishTvShowGenresMutation] = usePublishTvShowGenresMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishTvShowGenresMutation] = useUnpublishTvShowGenresMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const actions: FormActionData<TvShowGenresFormData>[] = [
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        await publishTvShowGenresMutation();
      },
    },
    {
      label: 'Publishing Snapshots',
      path: `/settings/media/tvshowgenres/snapshots`,
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        await unpublishTvShowGenresMutation();
      },
    },
  ];

  return { actions } as const;
}
