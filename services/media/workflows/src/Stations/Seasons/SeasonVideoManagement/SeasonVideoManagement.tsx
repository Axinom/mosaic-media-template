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
  MutationCreateSeasonsTrailerArgs,
  MutationDeleteSeasonsTrailerArgs,
  useSeasonVideosQuery,
} from '../../../generated/graphql';

interface FormData {
  trailerVideos: VideoID[];
}

const seasonVideoManagementSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  trailerVideos: Yup.array().of(Yup.mixed()),
});

export const SeasonVideoManagement: React.FC = () => {
  const seasonId = Number(
    useParams<{
      seasonId: string;
    }>().seasonId,
  );

  const { VideoSelectField } = useContext(ExtensionsContext);

  const { loading, data, error } = useSeasonVideosQuery({
    client,
    variables: { id: seasonId },
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment = createUpdateGQLFragmentGenerator<
        Mutation
      >();

      const trailerAssignmentMutations = generateArrayMutations({
        current: formData.trailerVideos,
        original: initialData.data?.trailerVideos,
        generateCreateMutation: (videoId) =>
          generateUpdateGQLFragment<MutationCreateSeasonsTrailerArgs>(
            'createSeasonsTrailer',
            { input: { seasonsTrailer: { videoId, seasonId } } },
          ),
        generateDeleteMutation: (videoId) =>
          generateUpdateGQLFragment<MutationDeleteSeasonsTrailerArgs>(
            'deleteSeasonsTrailer',
            { input: { seasonId, videoId } },
          ),
      });
      const GqlMutationDocument = gql`mutation UpdateSeasonVideos {
        ${trailerAssignmentMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [seasonId],
  );

  return (
    <Details<FormData>
      defaultTitle="Video Management"
      validationSchema={seasonVideoManagementSchema}
      initialData={{
        data: {
          trailerVideos:
            data?.season?.seasonsTrailers.nodes.map(
              (trailer) => trailer.videoId,
            ) ?? [],
        },
        loading,
        entityNotFound: data?.season === null,
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
