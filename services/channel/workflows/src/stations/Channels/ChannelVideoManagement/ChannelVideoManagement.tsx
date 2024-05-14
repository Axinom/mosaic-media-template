import {
  EncodingState,
  ID,
  OutputFormat,
  PreviewStatus,
  Video,
} from '@axinom/mosaic-managed-workflow-integration';
import {
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
  FilterValues,
  ObjectSchemaDefinition,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  Mutation,
  MutationUpdateChannelArgs,
  useChannelVideoQuery,
} from '../../../generated/graphql';

interface FormData {
  placeholderVideo: ID[];
}

const channelVideoManagementSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  placeholderVideo: Yup.array().of(Yup.mixed()).max(1),
});

export const ChannelVideoManagement: React.FC = () => {
  const { VideoSelectField } = useContext(ExtensionsContext);

  const channelId = String(
    useParams<{
      channelId: string;
    }>().channelId,
  );

  const { loading, data, error } = useChannelVideoQuery({
    client,
    variables: { id: channelId },
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const videoUpdateMutation =
        initialData.data?.placeholderVideo[0] !== formData.placeholderVideo[0]
          ? generateUpdateGQLFragment<MutationUpdateChannelArgs>(
              'updateChannel',
              {
                input: {
                  id: channelId,
                  patch: {
                    placeholderVideoId: formData.placeholderVideo[0] ?? null,
                  },
                },
              },
            )
          : '';

      const GqlMutationDocument = gql`mutation UpdateChannelVideo {
            ${videoUpdateMutation}
          }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [channelId],
  );

  return (
    <Details<FormData>
      defaultTitle="Placeholder Video Management"
      validationSchema={channelVideoManagementSchema}
      initialData={{
        data: {
          placeholderVideo: data?.channel?.placeholderVideoId
            ? [data?.channel?.placeholderVideoId]
            : [],
        },
        loading,
        entityNotFound: data?.channel === null,
        error: error?.message,
      }}
      saveData={onSubmit}
    >
      <Form videoSelectField={VideoSelectField} />
    </Details>
  );
};

const Form: React.FC<{ videoSelectField: unknown }> = ({
  videoSelectField,
}) => {
  const predefinedFilters: FilterValues<Video> = {
    encodingState: EncodingState.Ready,
    outputFormat: OutputFormat.Cmaf,
    previewStatus: PreviewStatus.Approved,
  };
  return (
    <>
      <Field
        name="placeholderVideo"
        label="Placeholder Video"
        as={videoSelectField}
        maxItems={1}
        title="Select Video"
        predefinedFilterValues={predefinedFilters}
      />
    </>
  );
};
