import { FormActionData } from '@axinom/mosaic-ui';
import { useHistory } from 'react-router';
import { client } from '../../../../apolloClient';
import { useDeleteCountryGroupMutation } from '../../../../generated/graphql';
import { CountryGroupDetailsFormData } from './CountryGroupDetails.types';

export function useCountryGroupDetailsActions(id: string): {
  readonly actions: FormActionData<CountryGroupDetailsFormData>[];
} {
  const history = useHistory();
  const [deleteCountryGroupMutation] = useDeleteCountryGroupMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteCountryGroup = async (): Promise<void> => {
    await deleteCountryGroupMutation({ variables: { input: { id } } });
    history.push('/settings/media/countries');
  };

  const actions: FormActionData<CountryGroupDetailsFormData>[] = [
    {
      label: 'Delete',
      confirmationMode: 'Simple',
      onActionSelected: deleteCountryGroup,
    },
  ];

  return { actions } as const;
}
