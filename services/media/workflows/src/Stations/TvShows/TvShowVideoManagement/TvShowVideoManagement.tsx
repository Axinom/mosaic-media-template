import {
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
  generateArrayMutations,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import gql from 'graphql-tag';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext, VideoID } from '../../../externals';
import {
  Mutation,
  MutationCreateTvshowsTrailerArgs,
  MutationDeleteTvshowsTrailerArgs,
  useTvShowVideosQuery,
} from '../../../generated/graphql';

interface FormData {
  trailerVideos: VideoID[];
}

const tvShowVideoManagementSchema = Yup.object<
  ObjectSchemaDefinition<FormData>
>({
  trailerVideos: Yup.array().of(Yup.mixed()),
});

export const TvShowVideoManagement: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  const { VideoSelectField } = useContext(ExtensionsContext);

  const { loading, data, error } = useTvShowVideosQuery({
    client,
    variables: { id: tvshowId },
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const trailerAssignmentMutations = generateArrayMutations({
        current: formData.trailerVideos,
        original: initialData.data?.trailerVideos,
        generateCreateMutation: (videoId) =>
          generateUpdateGQLFragment<MutationCreateTvshowsTrailerArgs>(
            'createTvshowsTrailer',
            { input: { tvshowsTrailer: { videoId, tvshowId } } },
          ),
        generateDeleteMutation: (videoId) =>
          generateUpdateGQLFragment<MutationDeleteTvshowsTrailerArgs>(
            'deleteTvshowsTrailer',
            { input: { tvshowId, videoId } },
          ),
      });

      const GqlMutationDocument = gql`mutation UpdateTvShowsVideos {
        ${trailerAssignmentMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [tvshowId],
  );

  return (
    <Details<FormData>
      defaultTitle="Video Management"
      validationSchema={tvShowVideoManagementSchema}
      initialData={{
        data: {
          trailerVideos:
            data?.tvshow?.tvshowsTrailers.nodes.map(
              (trailer) => trailer.videoId,
            ) ?? [],
        },
        loading,
        entityNotFound: data?.tvshow === null,
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
  return (
    <>
      <Field
        name="trailerVideos"
        label="Trailer Videos"
        as={videoSelectField}
        defaultFilterTag="TRAILER"
        title="Select Trailer Video(s)"
      />
    </>
  );
};
