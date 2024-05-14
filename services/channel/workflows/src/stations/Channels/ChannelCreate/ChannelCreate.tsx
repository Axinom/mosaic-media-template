import {
  ActionHandler,
  Create,
  ObjectSchemaDefinition,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  CreateChannelMutation,
  CreateChannelMutationVariables,
  useCreateChannelMutation,
} from '../../../generated/graphql';
import { routes } from '../routes';

type FormData = CreateChannelMutationVariables['input']['channel'];

type SubmitResponse = CreateChannelMutation['createChannel'];

const channelCreateSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
});

export const ChannelCreate: React.FC = () => {
  const [channelCreate] = useCreateChannelMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await channelCreate({
          variables: {
            input: {
              channel: {
                title: formData.title,
              },
            },
          },
        })
      ).data?.createChannel;
    },
    [channelCreate],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.channel) {
        history.push(
          routes.generate(routes.channelDetails, {
            channelId: submitResponse?.channel?.id,
          }),
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
      title="New Channel"
      validationSchema={channelCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="./"
      initialData={{
        loading: false,
      }}
    >
      <Field name="title" label="Title" as={SingleLineTextField} />
    </Create>
  );
};
