import {
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  EpisodeImageType,
  EpisodesImage,
  Mutation,
  MutationCreateEpisodesImageArgs,
  MutationDeleteEpisodesImageByEpisodeIdAndImageTypeArgs,
  MutationUpdateEpisodesImageByEpisodeIdAndImageTypeArgs,
  useEpisodeImagesQuery,
} from '../../../generated/graphql';

interface EpisodeImageManagementFormProps {
  episodeId: number;
}

type ImageNodes = Pick<EpisodesImage, 'imageId' | 'imageType'> & {
  __typename: 'EpisodesImage';
};

type FormData = Record<EpisodeImageType, string[]>;

const Form: React.FC<{ imageSelectField: unknown }> = ({
  imageSelectField,
}) => {
  return (
    <>
      {Object.keys(EpisodeImageType).map((type) => {
        const field = EpisodeImageType[type];
        return (
          <Field
            key={field}
            name={field}
            label={type}
            as={imageSelectField}
            maxItems={1}
            title="Select Image"
            imageScope="episode"
          />
        );
      })}
    </>
  );
};

export const EpisodeImageManagementForm: React.FC<
  EpisodeImageManagementFormProps
> = ({ episodeId }) => {
  const { loading, data, error } = useEpisodeImagesQuery({
    client,
    variables: { id: episodeId },
    fetchPolicy: 'network-only',
  });

  const { initialImages } = useImageTypes(
    data?.episode?.episodesImages.nodes as ImageNodes[],
  );

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const mutations: string[] = [];

      const generateCreateMutation = (
        imageId: string,
        imageType: EpisodeImageType,
      ): string =>
        generateUpdateGQLFragment<MutationCreateEpisodesImageArgs>(
          'createEpisodesImage',
          {
            input: {
              episodesImage: {
                episodeId,
                imageId,
                imageType: { type: 'enum', value: imageType },
              },
            },
          },
        );

      const generateDeleteMutation = (imageType: EpisodeImageType): string =>
        generateUpdateGQLFragment<MutationDeleteEpisodesImageByEpisodeIdAndImageTypeArgs>(
          'deleteEpisodesImageByEpisodeIdAndImageType',
          {
            input: { episodeId, imageType: { type: 'enum', value: imageType } },
          },
        );

      const generateUpdateMutation = (
        imageId: string,
        imageType: EpisodeImageType,
      ): string =>
        generateUpdateGQLFragment<MutationUpdateEpisodesImageByEpisodeIdAndImageTypeArgs>(
          'updateEpisodesImageByEpisodeIdAndImageType',
          {
            input: {
              patch: { imageId },
              episodeId,
              imageType: { type: 'enum', value: imageType },
            },
          },
        );

      Object.entries(formData ?? {}).forEach(([imageType, imageId], idx) => {
        const [imgId] = imageId;
        const [initialValue] = initialData?.data?.[imageType];
        const [currentValue] = formData[imageType];

        switch (true) {
          case initialValue === undefined && currentValue !== undefined:
            mutations.push(
              `assign${idx}:${generateCreateMutation(
                imgId,
                imageType as EpisodeImageType,
              )}`,
            );
            break;
          case initialValue !== undefined && currentValue === undefined:
            mutations.push(
              `assign${idx}:${generateDeleteMutation(
                imageType as EpisodeImageType,
              )}`,
            );
            break;
          case initialValue !== currentValue:
            mutations.push(
              `assign${idx}:${generateUpdateMutation(
                currentValue,
                imageType as EpisodeImageType,
              )}`,
            );
            break;
          default:
            break;
        }
      });

      const GqlDoc = gql`mutation ImageAssignments {
          ${mutations}
        }`;

      await client.mutate({ mutation: GqlDoc });
    },
    [episodeId],
  );

  const { ImageSelectField } = useContext(ExtensionsContext);

  return (
    <Details<FormData>
      defaultTitle="Image Management"
      initialData={{
        data: initialImages ?? {},
        loading,
        entityNotFound: data?.episode === null,
        error: error?.message,
      }}
      saveData={onSubmit}
    >
      <Form imageSelectField={ImageSelectField} />
    </Details>
  );
};

/**
 * Creates the initial image type values
 * @param nodes data nodes
 */
const useImageTypes = (
  nodes: ImageNodes[] = [],
): {
  readonly initialImages: FormData;
} => {
  const [initialImages, setInitialImages] = useState<FormData>(getImageTypes());

  // set all currently assigned images on the server
  useEffect(() => {
    if (nodes.length > 0) {
      let temp = {} as FormData;

      for (const { imageType, imageId } of nodes) {
        temp = { ...temp, [imageType]: [imageId] };
      }

      setInitialImages((prevState) => {
        return { ...prevState, ...temp };
      });
    }
  }, [nodes]);

  return { initialImages } as const;
};

/**
 * Returns an image type with an empty array(value) using the EpisodeImageType enum
 */
const getImageTypes = (): FormData => {
  let types = {} as FormData;

  Object.keys(EpisodeImageType).map((type) => {
    const field = EpisodeImageType[type];
    types = { ...types, [field]: [] };
  });

  return types;
};
