import { getTranslationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import { FormActionData, IconName } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteTvShowMutation,
  usePublishTvShowMutation,
  useUnpublishTvShowMutation,
} from '../../../generated/graphql';
import { TvShowDetailsFormData } from './TvShowDetails.types';

export function useTvShowDetailsActions(id: number): {
  readonly actions: FormActionData<TvShowDetailsFormData>[];
} {
  const history = useHistory();
  const localizationPath = getTranslationEntryPoint('tv_show');

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
        await publishTvShowMutation({ variables: { id } });
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
        await unpublishTvShowMutation({ variables: { id } });
      },
    },
    {
      label: 'Delete',
      icon: IconName.Delete,
      confirmationMode: 'Simple',
      onActionSelected: deleteTvShow,
    },
  ];

  return { actions } as const;
}
