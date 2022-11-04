import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import {
  ActionHandler,
  Create,
  Nullable,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { number, object, string } from 'yup';
import { client } from '../../../apolloClient';
import {
  CreateEpisodeMutation,
  CreateEpisodeMutationVariables,
  useCreateEpisodeMutation,
} from '../../../generated/graphql';

type FormData = CreateEpisodeMutationVariables['input']['episode'];

type SubmitResponse = Nullable<CreateEpisodeMutation['createEpisode']>;

const episodeCreateSchema = object<ObjectSchemaDefinition<FormData>>({
  title: string()
    .required('Title is a required field')
    .max(100),
  index: number()
    .positive('Episode Index must be a positive number')
    .integer('Episode Index must be an integer')
    .required('Episode Index is a required field'),
});

export const EpisodeCreate: React.FC = () => {
  const [episodeCreate] = useCreateEpisodeMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await episodeCreate({
          variables: {
            input: {
              episode: {
                title: formData.title,
                index: Number(formData.index),
              },
            },
          },
        })
      ).data?.createEpisode;
    },
    [episodeCreate],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.episode) {
        history.push(`/episodes/${submitResponse?.episode.id}`);
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
      title="New Episode"
      subtitle="Add new episode metadata"
      validationSchema={episodeCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="/episodes"
      initialData={{
        loading: false,
      }}
    >
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field
        type="number"
        name="index"
        label="Episode Index"
        as={SingleLineTextField}
      />
    </Create>
  );
};

export const MovieCreateCrumb: BreadcrumbResolver = () => 'Create';
