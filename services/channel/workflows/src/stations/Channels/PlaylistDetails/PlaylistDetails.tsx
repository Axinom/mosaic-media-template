import {
  DateTimeTextField,
  Details,
  DetailsProps,
  formatDateTime,
  formatSecondsToTimestamp,
  getFormDiff,
  InfoPanel,
  ObjectSchemaDefinition,
  Paragraph,
  ReadOnlyField,
  Section,
  SingleLineTextField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  Playlist,
  PlaylistPatch,
  UpdatePlaylistInput,
  usePlaylistQuery,
} from '../../../generated/graphql';
import { useActions } from './PlaylistDetails.actions';
import classes from './PlaylistDetails.module.scss';
import { PlaylistDetailsFormData } from './PlaylistDetails.types';

const playlistValidationSchema = Yup.object().shape<ObjectSchemaDefinition>({
  title: Yup.string().required('Title is a required field'),
  startDateTime: Yup.date().required(
    'Scheduled Start date and time should be set.',
  ),
});

interface UrlParams {
  channelId: string;
  playlistId: string;
}

export const PlaylistDetails: React.FC = () => {
  const { channelId, playlistId } = useParams<UrlParams>();
  const loadDataMutationParams = { id: playlistId } as const;
  const { loading, data, error } = usePlaylistQuery({
    client,
    variables: loadDataMutationParams,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: PlaylistDetailsFormData,
      initialData: DetailsProps<PlaylistDetailsFormData>['initialData'],
    ): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...updateDto } = getFormDiff(formData, initialData.data);
      const patch: PlaylistPatch = {
        ...updateDto,
      };
      const GqlMutationDocument = gql`
        mutation UpdatePlaylist($input: UpdatePlaylistInput!) {
          updatePlaylist(input: $input) {
            clientMutationId
            playlist {
              id
              title
            }
          }
        }
      `;

      await client.mutate<unknown, { input: UpdatePlaylistInput }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: playlistId, patch } },
      });
    },
    [playlistId],
  );

  const { actions } = useActions(
    channelId,
    playlistId,
    !!data?.playlist?.publishedDate,
  );

  return (
    <Details<PlaylistDetailsFormData>
      defaultTitle="Playlist"
      titleProperty="title"
      subtitle="Properties"
      validationSchema={playlistValidationSchema}
      initialData={{
        data: {
          ...data?.playlist,
        },
        loading,
        entityNotFound: data?.playlist === null,
        error: error?.message,
      }}
      actions={actions}
      saveData={onSubmit}
      infoPanel={<Panel />}
      edgeToEdgeContent={true}
    >
      <div className={classes.content}>
        <Form />
      </div>
    </Details>
  );
};

const Form: React.FC = () => {
  return (
    <>
      <Field name="title" label="Title" as={SingleLineTextField} />
      <Field name="startDateTime" label="Start Time" as={DateTimeTextField} />
      <Field
        name="calculatedDurationInSeconds"
        label="Duration"
        as={ReadOnlyField}
        transform={formatSecondsToTimestamp}
      />
      <Field
        name="calculatedEndDateTime"
        label="End Time"
        as={ReadOnlyField}
        transform={formatDateTime}
      />
    </>
  );
};

const Panel: React.FC = () => {
  const { values } = useFormikContext<
    Playlist & {
      programs: { nodes: { entityType: string } };
    }
  >();

  const programCount = values.programs?.nodes.reduce(
    (acc, program) => ({
      ...acc,
      [program.entityType]: (acc[program.entityType] || 0) + 1,
    }),
    {},
  );

  return (
    <InfoPanel>
      <Section title="Additional Information">
        <Paragraph title="ID">{values.id}</Paragraph>
        <Paragraph title="Created">
          {formatDateTime(values.createdDate)} by {values.createdUser}
        </Paragraph>
        <Paragraph title="Last Modified">
          {formatDateTime(values.updatedDate)} by {values.updatedUser}
        </Paragraph>
        <Paragraph title="Publication State">
          {values.publicationState}
        </Paragraph>
        {values.publishedDate && (
          <Paragraph title="Last Published">
            {formatDateTime(values.publishedDate)} by {values.publishedUser}
          </Paragraph>
        )}
      </Section>
      {programCount && (
        <Section title="Programs">
          <div className={classes.datalist}>
            {Object.keys(programCount).map((program) => (
              <React.Fragment key={program}>
                <Paragraph>
                  <div>
                    {/* TODO: Correct styling */}
                    {program}: {programCount[program]}
                  </div>
                </Paragraph>
              </React.Fragment>
            ))}
          </div>
        </Section>
      )}
    </InfoPanel>
  );
};
