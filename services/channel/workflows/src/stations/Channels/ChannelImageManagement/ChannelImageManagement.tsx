import {
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
  generateArrayMutationsWithUpdates,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  ChannelImage,
  ChannelImageType,
  Mutation,
  MutationCreateChannelImageArgs,
  MutationDeleteChannelImageArgs,
  MutationUpdateChannelImageArgs,
  useChannelImagesQuery,
} from '../../../generated/graphql';

type FormData = Record<ChannelImageType, string[]>;

const Form: React.FC<{ imageSelectField: unknown }> = ({
  imageSelectField,
}) => {
  return (
    <>
      {Object.keys(ChannelImageType).map((typeName) => {
        const type = ChannelImageType[typeName];
        return (
          <Field
            key={type}
            name={type}
            label="Logo Image"
            as={imageSelectField}
            maxItems={1}
            title="Select Logo Image"
            imageScope="channel"
          />
        );
      })}
    </>
  );
};

export const ChannelImageManagement: React.FC = () => {
  const channelId = String(
    useParams<{
      channelId: string;
    }>().channelId,
  );

  const { loading, data, error } = useChannelImagesQuery({
    client,
    variables: { id: channelId },
    fetchPolicy: 'network-only',
  });

  const { initialImages } = useImageTypes(
    data?.channel?.channelImages.nodes as ChannelImage[],
  );

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const flattenFormData = (
        formData: FormData,
      ): { imageType: string; imageId: string }[] =>
        Object.entries(formData ?? {})
          .filter(([_, imageIds]) => imageIds.length > 0)
          .map(([imageType, imageIds]) => ({
            imageType,
            imageId: imageIds[0],
          }));

      const imageUpdateMutations = generateArrayMutationsWithUpdates({
        current: flattenFormData(formData),
        original: initialData.data ? flattenFormData(initialData.data) : [],
        generateCreateMutation: ({ imageId, imageType }) =>
          generateUpdateGQLFragment<MutationCreateChannelImageArgs>(
            'createChannelImage',
            {
              input: {
                channelImage: {
                  channelId,
                  imageId,
                  imageType: { type: 'enum', value: imageType },
                },
              },
            },
          ),
        generateUpdateMutation: ({ imageId, imageType }) =>
          generateUpdateGQLFragment<MutationUpdateChannelImageArgs>(
            'updateChannelImage',
            {
              input: {
                channelId,
                imageType: { type: 'enum', value: imageType },
                patch: {
                  imageId,
                },
              },
            },
          ),
        generateDeleteMutation: ({ imageType }) =>
          generateUpdateGQLFragment<MutationDeleteChannelImageArgs>(
            'deleteChannelImage',
            {
              input: {
                channelId,
                imageType: { type: 'enum', value: imageType },
              },
            },
          ),
        prefix: 'channelImage',
        key: 'imageType',
      });

      const GqlMutationDocument = gql`mutation UpdateChannelImage {
        ${imageUpdateMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [channelId],
  );

  const { ImageSelectField } = useContext(ExtensionsContext);
  return (
    <Details<FormData>
      defaultTitle="Manage Logo Image"
      initialData={{
        data: initialImages ?? {},
        loading,
        entityNotFound: data?.channel === null,
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
  nodes: ChannelImage[] = [],
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
 * Returns an image type with an empty array(value) using the ChannelImageType enum
 */
const getImageTypes = (): FormData => {
  let types = {} as FormData;

  Object.keys(ChannelImageType).map((type) => {
    const field = ChannelImageType[type];
    types = { ...types, [field]: [] };
  });

  return types;
};
