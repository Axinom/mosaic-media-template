import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { ActionHandler, Create, SingleLineTextField } from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  CreateMovieMutation,
  CreateMovieMutationVariables,
  useCreateMovieMutation,
} from '../../../generated/graphql';

type FormData = CreateMovieMutationVariables['input']['movie'];

type SubmitResponse = CreateMovieMutation['createMovie'];

const movieCreateSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>({
  title: Yup.string()
    .required('Title is a required field')
    .max(100),
});

export const MovieCreate: React.FC = () => {
  const [movieCreate] = useCreateMovieMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await movieCreate({
          variables: {
            input: {
              movie: {
                title: formData.title,
              },
            },
          },
        })
      ).data?.createMovie;
    },
    [movieCreate],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.movie) {
        history.push(`/movies/${submitResponse?.movie.id}`);
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
      title="New Movie"
      subtitle="Add new movie metadata"
      validationSchema={movieCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/movies"
      initialData={{
        loading: false,
      }}
    >
      <Field name="title" label="Title" as={SingleLineTextField} />
    </Create>
  );
};

export const MovieCreateCrumb: BreadcrumbResolver = () => 'Create';
