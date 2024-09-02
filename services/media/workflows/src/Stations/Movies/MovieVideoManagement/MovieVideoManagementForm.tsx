import { ID } from '@axinom/mosaic-managed-workflow-integration';
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
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  Mutation,
  MutationCreateMoviesTrailerArgs,
  MutationDeleteMoviesTrailerArgs,
  MutationUpdateMovieArgs,
  useMovieVideosQuery,
} from '../../../generated/graphql';

interface FormData {
  mainVideo: ID[];
  trailerVideos: ID[];
}

interface MovieVideoManagementFormProps {
  movieId: number;
}

const movieVideoManagementSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  mainVideo: Yup.array().of(Yup.mixed()).max(1),
  trailerVideos: Yup.array().of(Yup.mixed()),
});

export const MovieVideoManagementForm: React.FC<
  MovieVideoManagementFormProps
> = ({ movieId }) => {
  const { VideoSelectField } = useContext(ExtensionsContext);

  const { loading, data, error } = useMovieVideosQuery({
    client,
    variables: { id: movieId },
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
          generateUpdateGQLFragment<MutationCreateMoviesTrailerArgs>(
            'createMoviesTrailer',
            { input: { moviesTrailer: { videoId, movieId } } },
          ),
        generateDeleteMutation: (videoId) =>
          generateUpdateGQLFragment<MutationDeleteMoviesTrailerArgs>(
            'deleteMoviesTrailer',
            { input: { movieId, videoId } },
          ),
        prefix: 'movieTrailers',
      });

      const mainVideoUpdateMutation =
        initialData.data?.mainVideo[0] !== formData.mainVideo[0]
          ? generateUpdateGQLFragment<MutationUpdateMovieArgs>('updateMovie', {
              input: {
                id: movieId,
                patch: { mainVideoId: formData.mainVideo[0] ?? null },
              },
            })
          : '';

      const GqlMutationDocument = gql`mutation UpdateMovieVideos {
            ${mainVideoUpdateMutation}
            ${trailerAssignmentMutations}
          }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [movieId],
  );

  return (
    <Details<FormData>
      defaultTitle="Video Management"
      validationSchema={movieVideoManagementSchema}
      initialData={{
        data: {
          mainVideo: data?.movie?.mainVideoId ? [data?.movie?.mainVideoId] : [],
          trailerVideos:
            data?.movie?.moviesTrailers.nodes.map(
              (trailer) => trailer.videoId,
            ) ?? [],
        },
        loading,
        entityNotFound: data?.movie === null,
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
        name="mainVideo"
        label="Main Video"
        as={videoSelectField}
        maxItems={1}
        defaultFilterTag="MAIN"
        title="Select Main Video"
      />
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
