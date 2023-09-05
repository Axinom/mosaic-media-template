import { getTranslationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import { FormActionData } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteEpisodeMutation,
  usePublishEpisodeMutation,
  useUnpublishEpisodeMutation,
} from '../../../generated/graphql';
import { EpisodeDetailsFormData } from './EpisodeDetails.types';

export function useEpisodeDetailsActions(id: number): {
  readonly actions: FormActionData<EpisodeDetailsFormData>[];
} {
  const history = useHistory();
  const localizationPath = getTranslationEntryPoint('episode');

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
        await publishEpisodeMutation({ variables: { id } });
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
        await unpublishEpisodeMutation({ variables: { id } });
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
