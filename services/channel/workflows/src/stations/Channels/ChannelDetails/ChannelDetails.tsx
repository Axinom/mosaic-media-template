import {
  CheckboxField,
  Details,
  DetailsProps,
  formatDateTime,
  getFormDiff,
  InfoPanel,
  ObjectSchemaDefinition,
  Paragraph,
  Section,
  SingleLineTextField,
  TextAreaField,
} from '@axinom/mosaic-ui';
import { Field, useFormikContext } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals/piralExtensions';
import {
  Channel,
  ChannelPatch,
  UpdateChannelInput,
  useChannelQuery,
} from '../../../generated/graphql';
import { useActions } from './ChannelDetails.actions';
import classes from './ChannelDetails.module.scss';
import { ChannelDetailsFormData } from './ChannelDetails.types';

const channelValidationSchema = Yup.object<
  ObjectSchemaDefinition<ChannelDetailsFormData>
>({
  title: Yup.string().required('Title is a required field').max(100),
});

interface UrlParams {
  channelId: string;
}

export const ChannelDetails: React.FC = () => {
  const { channelId } = useParams<UrlParams>();
  const loadDataMutationParams = { id: channelId } as const;
  const { loading, data, error } = useChannelQuery({
    client,
    variables: loadDataMutationParams,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: ChannelDetailsFormData,
      initialData: DetailsProps<ChannelDetailsFormData>['initialData'],
    ): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...updateDto } = getFormDiff(formData, initialData.data);
      const patch: ChannelPatch = {
        ...updateDto,
      };
      const GqlMutationDocument = gql`
        mutation UpdateChannel($input: UpdateChannelInput!) {
          updateChannel(input: $input) {
            clientMutationId
            channel {
              id
              title
            }
          }
        }
      `;

      await client.mutate<unknown, { input: UpdateChannelInput }>({
        mutation: GqlMutationDocument,
        variables: { input: { id: channelId, patch } },
      });
    },
    [channelId],
  );

  const { actions } = useActions(channelId, !!data?.channel?.publishedDate);

  return (
    <Details<ChannelDetailsFormData>
      defaultTitle="Channel"
      titleProperty="title"
      subtitle="Properties"
      actions={actions}
      validationSchema={channelValidationSchema}
      initialData={{
        data: {
          ...data?.channel,
        },
        loading,
        entityNotFound: data?.channel === null,
        error: error?.message,
      }}
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
      <Field name="description" label="Description" as={TextAreaField} />
      <Field
        name="isDrmProtected"
        label="DRM Protection"
        as={CheckboxField}
        tooltipContent="DRM protection will be applied according to the DRM Key Service configuration in the VOD-to-Live Service."
      />
    </>
  );
};

const Panel: React.FC = () => {
  const { ImageCover } = useContext(ExtensionsContext);
  const { values } = useFormikContext<Channel>();

  return (
    <InfoPanel>
      <Section>
        <ImageCover id={values?.channelImages?.nodes[0]?.imageId} />
      </Section>
      <Section title="Additional Information">
        <Paragraph title="ID">{values.id}</Paragraph>
        <Paragraph title="DASH stream URL">{values.dashStreamUrl}</Paragraph>
        <Paragraph title="HLS stream URL">{values.hlsStreamUrl}</Paragraph>
        <Paragraph title="DRM key ID">{values.keyId}</Paragraph>
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
    </InfoPanel>
  );
};
