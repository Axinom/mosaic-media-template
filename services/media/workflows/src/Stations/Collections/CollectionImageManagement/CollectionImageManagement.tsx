import {
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import { ExtensionsContext } from '../../../externals';
import {
  CollectionImageType,
  CollectionsImage,
  Mutation,
  MutationCreateCollectionsImageArgs,
  MutationDeleteCollectionsImageByCollectionIdAndImageTypeArgs,
  MutationUpdateCollectionsImageByCollectionIdAndImageTypeArgs,
  useCollectionImagesQuery,
} from '../../../generated/graphql';

type ImageNodes = Pick<CollectionsImage, 'imageId' | 'imageType'> & {
  __typename: 'CollectionsImage';
};

type FormData = Record<CollectionImageType, string[]>;

const Form: React.FC<{ imageSelectField: unknown }> = ({
  imageSelectField,
}) => {
  return (
    <>
      {Object.keys(CollectionImageType).map((type) => {
        const field = CollectionImageType[type];
        return (
          <Field
            key={field}
            name={field}
            label={type}
            as={imageSelectField}
            maxItems={1}
            title="Select Image"
            imageScope="collection"
          />
        );
      })}
    </>
  );
};

export const CollectionImageManagement: React.FC = () => {
  const collectionId = Number(
    useParams<{
      collectionId: string;
    }>().collectionId,
  );

  const { loading, data, error } = useCollectionImagesQuery({
    client,
    variables: { id: collectionId },
    fetchPolicy: 'network-only',
  });

  const { initialImages } = useImageTypes(
    data?.collection?.collectionsImages.nodes as ImageNodes[],
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
        imageType: CollectionImageType,
      ): string =>
        generateUpdateGQLFragment<MutationCreateCollectionsImageArgs>(
          'createCollectionsImage',
          {
            input: {
              collectionsImage: {
                collectionId,
                imageId,
                imageType: { type: 'enum', value: imageType },
              },
            },
          },
        );

      const generateDeleteMutation = (imageType: CollectionImageType): string =>
        generateUpdateGQLFragment<MutationDeleteCollectionsImageByCollectionIdAndImageTypeArgs>(
          'deleteCollectionsImageByCollectionIdAndImageType',
          {
            input: {
              collectionId,
              imageType: { type: 'enum', value: imageType },
            },
          },
        );

      const generateUpdateMutation = (
        imageId: string,
        imageType: CollectionImageType,
      ): string =>
        generateUpdateGQLFragment<MutationUpdateCollectionsImageByCollectionIdAndImageTypeArgs>(
          'updateCollectionsImageByCollectionIdAndImageType',
          {
            input: {
              patch: { imageId },
              collectionId,
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
                imageType as CollectionImageType,
              )}`,
            );
            break;
          case initialValue !== undefined && currentValue === undefined:
            mutations.push(
              `assign${idx}:${generateDeleteMutation(
                imageType as CollectionImageType,
              )}`,
            );
            break;
          case initialValue !== currentValue:
            mutations.push(
              `assign${idx}:${generateUpdateMutation(
                currentValue,
                imageType as CollectionImageType,
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
    [collectionId],
  );

  const { ImageSelectField } = useContext(ExtensionsContext);

  return (
    <Details<FormData>
      defaultTitle="Image Management"
      initialData={{
        data: initialImages ?? {},
        loading,
        entityNotFound: data?.collection === null,
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
 * Returns an image type with an empty array(value) using the CollectionImageType enum
 */
const getImageTypes = (): FormData => {
  let types = {} as FormData;

  Object.keys(CollectionImageType).map((type) => {
    const field = CollectionImageType[type];
    types = { ...types, [field]: [] };
  });

  return types;
};
