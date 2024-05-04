import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import { FormActionData } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  useDeleteSeasonMutation,
  usePublishSeasonMutation,
  useUnpublishSeasonMutation,
} from '../../../generated/graphql';
import { SeasonDetailsFormData } from './SeasonDetails.types';

export function useSeasonDetailsActions(id: number): {
  readonly actions: FormActionData<SeasonDetailsFormData>[];
} {
  const history = useHistory();
  const localizationPath = getLocalizationEntryPoint('season');

  const [deleteSeasonMutation] = useDeleteSeasonMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [publishSeasonMutation] = usePublishSeasonMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const [unpublishSeasonMutation] = useUnpublishSeasonMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteSeason = async (): Promise<void> => {
    await deleteSeasonMutation({ variables: { input: { id } } });
    history.push('/seasons');
  };

  const actions: FormActionData<SeasonDetailsFormData>[] = [
    {
      label: 'Manage Episodes',
      path: `/seasons/${id}/episodes`,
    },
    {
      label: 'Manage Trailers',
      path: `/seasons/${id}/videos`,
    },
    {
      label: 'Manage Images',
      path: `/seasons/${id}/images`,
    },
    {
      label: 'Licensing',
      path: `/seasons/${id}/licenses`,
    },
    ...(localizationPath
      ? [
          {
            label: 'Localizations',
            path: localizationPath.replace(':seasonId', id.toString()),
          },
        ]
      : []),
    {
      label: 'Publish Now',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        await publishSeasonMutation({ variables: { id } });
      },
    },
    {
      label: 'Publishing Snapshots',
      path: `/seasons/${id}/snapshots`,
    },
    {
      label: 'Unpublish',
      confirmationMode: 'Simple',
      onActionSelected: async () => {
        await unpublishSeasonMutation({ variables: { id } });
      },
    },
    {
      label: 'Delete',
      confirmationMode: 'Simple',
      onActionSelected: deleteSeason,
    },
  ];

  return { actions } as const;
}
