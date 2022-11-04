import { ActionType, FormActionData } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  usePublishTvShowGenresMutation,
  useUnpublishTvShowGenresMutation,
} from '../../../generated/graphql';
import { TvShowGenresFormData } from './TvShowGenres.types';

export function useTvShowGenresActions(): {
  readonly actions: FormActionData<TvShowGenresFormData>[];
} {
  const history = useHistory();

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
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await publishTvShowGenresMutation();
      },
    },
    {
      label: 'Publishing Snapshots',
      onActionSelected: () =>
        history.push(`/settings/media/tvshowgenres/snapshots`),
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      actionType: ActionType.Context,
      onActionSelected: async () => {
        await unpublishTvShowGenresMutation();
      },
    },
  ];

  return { actions } as const;
}
