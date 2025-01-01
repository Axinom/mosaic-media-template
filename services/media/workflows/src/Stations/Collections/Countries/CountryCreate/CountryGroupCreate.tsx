import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { ActionHandler, Create, SingleLineTextField } from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../../apolloClient';
import {
  CreateCountryGroupMutation,
  MutationCreateCountryGroupArgs,
  useCreateCountryGroupMutation,
} from '../../../../generated/graphql';

type FormData = MutationCreateCountryGroupArgs['input']['countryGroup'];

type SubmitResponse = CreateCountryGroupMutation['createCountryGroup'];

const countryGroupDetailSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  name: Yup.string().required('Name is a required field').max(100),
});

export const CountryGroupCreate: React.FC = () => {
  const [countryGroupCreate] = useCreateCountryGroupMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await countryGroupCreate({
          variables: {
            input: {
              countryGroup: {
                name: formData.name,
              },
            },
          },
        })
      ).data?.createCountryGroup;
    },
    [countryGroupCreate],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.countryGroup) {
        history.push(
          `/settings/media/countries/${submitResponse?.countryGroup.id}`,
        );
      } else {
        // The schema has the response.data properties marked as optional, since theoretically a user could have
        // permissions to mutate but not to read. In practice this can not happen on that service, so we just throw
        // an error in case we get there.
        throw new Error('Not expected');
      }
    },
    [history],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="New Country Group"
      subtitle="Add new country group"
      validationSchema={countryGroupDetailSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/settings/media/countries"
      initialData={{
        loading: false,
      }}
    >
      <Field name="name" label="Name" as={SingleLineTextField} />
    </Create>
  );
};

export const CountryCreateCrumb: BreadcrumbResolver = () => 'Create';
