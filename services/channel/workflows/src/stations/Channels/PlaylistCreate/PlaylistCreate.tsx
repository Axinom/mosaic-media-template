import {
  ActionHandler,
  Create,
  DateTimeTextField,
  ObjectSchemaDefinition,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  CreatePlaylistMutation,
  CreatePlaylistMutationVariables,
  useCreatePlaylistMutation,
} from '../../../generated/graphql';
import { routes } from '../routes';

type FormData = Omit<
  CreatePlaylistMutationVariables['input']['playlist'],
  'channelId'
>;

type SubmitResponse = CreatePlaylistMutation['createPlaylist'];
const playlistCreateSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  title: Yup.string(),
  startDateTime: Yup.date().required(
    'Scheduled Start date and time should be set.',
  ),
  calculatedDurationInSeconds: Yup.number().min(0),
});

export const PlaylistCreate: React.FC = () => {
  const channelId = useParams<{
    channelId: string;
  }>().channelId;

  const [playlistCreate] = useCreatePlaylistMutation({
    client: client,
    fetchPolicy: 'no-cache',
  });

  const saveData = useCallback(
    async (formData: FormData): Promise<SubmitResponse> => {
      return (
        await playlistCreate({
          variables: {
            input: {
              playlist: {
                channelId: channelId,
                // Set the date component based on the editors display date (not based on UTC)
                title: formData.startDateTime.substring(0, 10),
                startDateTime: formData.startDateTime,
                // NB: by default newly created playlists have duration set to 0
                calculatedDurationInSeconds: 0,
              },
            },
          },
        })
      ).data?.createPlaylist;
    },
    [playlistCreate, channelId],
  );

  const history = useHistory();
  const onProceed = useCallback<ActionHandler<FormData, SubmitResponse>>(
    ({ submitResponse }) => {
      if (submitResponse?.playlist) {
        history.push(
          routes.generate(routes.playlistDetails, {
            channelId,
            playlistId: submitResponse?.playlist?.id,
          }),
        );
      } else {
        // The schema has the response.data properties marked as optional, since theoretically a user could have
        // permissions to mutate but not to read. In practice this can not happen on that service, so we just throw
        // an error in case we get there.
        throw new Error('Not expected');
      }
    },
    [history, channelId],
  );

  return (
    <Create<FormData, SubmitResponse>
      title="Playlist"
      subtitle="Create a new playlist for this channel"
      validationSchema={playlistCreateSchema}
      saveData={saveData}
      onProceed={onProceed}
      cancelNavigationUrl="./"
      initialData={{
        loading: false,
      }}
    >
      <Field
        name="startDateTime"
        label="Scheduled Start"
        as={DateTimeTextField}
      />
    </Create>
  );
};
