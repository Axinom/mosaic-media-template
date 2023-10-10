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
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  Mutation,
  MutationCreateEpisodesTrailerArgs,
  MutationDeleteEpisodesTrailerArgs,
  MutationUpdateEpisodeArgs,
  useEpisodeVideosQuery,
} from '../../../generated/graphql';

interface FormData {
  mainVideo: ID[];
  trailerVideos: ID[];
}

const episodeVideoManagementSchema = Yup.object().shape<
  ObjectSchemaDefinition<FormData>
>({
  mainVideo: Yup.array().of(Yup.mixed()).max(1),
  trailerVideos: Yup.array().of(Yup.mixed()),
});

export const EpisodeVideoManagement: React.FC = () => {
  const episodeId = Number(
    useParams<{
      episodeId: string;
    }>().episodeId,
  );

  const { VideoSelectField } = useContext(ExtensionsContext);

  const { loading, data, error } = useEpisodeVideosQuery({
    client,
    variables: { id: episodeId },
    fetchPolicy: 'network-only',
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
          generateUpdateGQLFragment<MutationCreateEpisodesTrailerArgs>(
            'createEpisodesTrailer',
            { input: { episodesTrailer: { videoId, episodeId } } },
          ),
        generateDeleteMutation: (videoId) =>
          generateUpdateGQLFragment<MutationDeleteEpisodesTrailerArgs>(
            'deleteEpisodesTrailer',
            { input: { episodeId, videoId } },
          ),
        prefix: 'episodeTrailers',
      });

      const mainVideoUpdateMutation =
        initialData.data?.mainVideo[0] !== formData.mainVideo[0]
          ? generateUpdateGQLFragment<MutationUpdateEpisodeArgs>(
              'updateEpisode',
              {
                input: {
                  id: episodeId,
                  patch: { mainVideoId: formData.mainVideo[0] ?? null },
                },
              },
            )
          : '';

      const GqlMutationDocument = gql`mutation UpdateEpisodeVideos {
            ${mainVideoUpdateMutation}
            ${trailerAssignmentMutations}
          }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [episodeId],
  );

  return (
    <Details<FormData>
      defaultTitle="Video Management"
      validationSchema={episodeVideoManagementSchema}
      initialData={{
        data: {
          mainVideo: data?.episode?.mainVideoId
            ? [data?.episode?.mainVideoId]
            : [],
          trailerVideos:
            data?.episode?.episodesTrailers.nodes.map(
              (trailer) => trailer.videoId,
            ) ?? [],
        },
        loading,
        entityNotFound: data?.episode === null,
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
