import { FormActionData } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../../apolloClient';
import { useDeleteLanguageMutation } from '../../../../generated/graphql';
import { LanguageDetailsFormData } from './LanguageDetails.types';

export function useLanguageDetailsActions(id: number): {
  readonly actions: FormActionData<LanguageDetailsFormData>[];
} {
  const history = useHistory();
  const [deleteLanguageMutation] = useDeleteLanguageMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteLanguage = async (): Promise<void> => {
    await deleteLanguageMutation({ variables: { input: { id } } });
    history.push('/settings/media/languages');
  };

  const actions: FormActionData<LanguageDetailsFormData>[] = [
    {
      label: 'Delete',
      confirmationMode: 'Simple',
      onActionSelected: deleteLanguage,
    },
  ];

  return { actions } as const;
}
