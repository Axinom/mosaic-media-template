import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { ActionHandler, Create, SingleLineTextField } from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  CreateSeasonMutation,
  CreateSeasonMutationVariables,
  useCreateSeasonMutation,
} from '../../../generated/graphql';

type FormData = CreateSeasonMutationVariables['input']['season'];

type SubmitResponse = CreateSeasonMutation['createSeason'];

const tvShowCreateSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>(
  {
    index: Yup.number()
      .positive('Season Index must be a positive number')
      .integer('Season Index must be an integer')
      .required('Season Index is a required field'),
  },
);

export const SeasonCreate: React.FC = () => {
  const [seasonCreate] = useCreateSeasonMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await seasonCreate({
          variables: {
            input: {
              season: {
                index: Number(formData.index),
              },
            },
          },
        })
      ).data?.createSeason;
    },
    [seasonCreate],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.season) {
        history.push(`/seasons/${submitResponse?.season.id}`);
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
      title="New Season"
      subtitle="Add new season metadata"
      validationSchema={tvShowCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/seasons"
      initialData={{
        loading: false,
      }}
    >
      <Field
        type="number"
        name="index"
        label="Season Index"
        as={SingleLineTextField}
      />
    </Create>
  );
};

export const MovieCreateCrumb: BreadcrumbResolver = () => 'Create';
