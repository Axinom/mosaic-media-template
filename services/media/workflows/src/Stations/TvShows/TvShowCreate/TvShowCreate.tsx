import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { ActionHandler, Create, SingleLineTextField } from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  CreateTvShowMutation,
  CreateTvShowMutationVariables,
  useCreateTvShowMutation,
} from '../../../generated/graphql';

type FormData = CreateTvShowMutationVariables['input']['tvshow'];

type SubmitResponse = CreateTvShowMutation['createTvshow'];

const tvShowCreateSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>(
  {
    title: Yup.string()
      .required('Title is a required field')
      .max(100),
  },
);

export const TvShowCreate: React.FC = () => {
  const [tvShowCreate] = useCreateTvShowMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await tvShowCreate({
          variables: {
            input: {
              tvshow: {
                title: formData.title,
              },
            },
          },
        })
      ).data?.createTvshow;
    },
    [tvShowCreate],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.tvshow) {
        history.push(`/tvshows/${submitResponse?.tvshow.id}`);
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
      title="New TV Show"
      subtitle="Add new TV show metadata"
      validationSchema={tvShowCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/tvshows"
      initialData={{
        loading: false,
      }}
    >
      <Field name="title" label="Title" as={SingleLineTextField} />
    </Create>
  );
};

export const MovieCreateCrumb: BreadcrumbResolver = () => 'Create';
