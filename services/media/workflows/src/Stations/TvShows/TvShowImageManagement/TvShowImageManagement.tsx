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
  Mutation,
  MutationCreateTvshowsImageArgs,
  MutationDeleteTvshowsImageByTvshowIdAndImageTypeArgs,
  MutationUpdateTvshowsImageByTvshowIdAndImageTypeArgs,
  TvshowImageType,
  TvshowsImage,
  useTvshowImagesQuery,
} from '../../../generated/graphql';

type ImageNodes = Pick<TvshowsImage, 'imageId' | 'imageType'> & {
  __typename: 'TvshowsImage';
};

type FormData = Record<TvshowImageType, string[]>;

const Form: React.FC<{ imageSelectField: unknown }> = ({
  imageSelectField,
}) => {
  return (
    <>
      {Object.keys(TvshowImageType).map((type) => {
        const field = TvshowImageType[type];
        return (
          <Field
            key={field}
            name={field}
            label={type}
            as={imageSelectField}
            maxItems={1}
            title="Select Image"
            imageScope="tvshow"
          />
        );
      })}
    </>
  );
};

export const TvShowImageManagement: React.FC = () => {
  const tvshowId = Number(
    useParams<{
      tvshowId: string;
    }>().tvshowId,
  );

  const { loading, data, error } = useTvshowImagesQuery({
    client,
    variables: { id: tvshowId },
    fetchPolicy: 'no-cache',
  });

  const { initialImages } = useImageTypes(
    data?.tvshow?.tvshowsImages.nodes as ImageNodes[],
  );

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment = createUpdateGQLFragmentGenerator<
        Mutation
      >();

      const mutations: string[] = [];

      const generateCreateMutation = (
        imageId: string,
        imageType: TvshowImageType,
      ): string =>
        generateUpdateGQLFragment<MutationCreateTvshowsImageArgs>(
          'createTvshowsImage',
          {
            input: {
              tvshowsImage: {
                tvshowId,
                imageId,
                imageType: { type: 'enum', value: imageType },
              },
            },
          },
        );

      const generateDeleteMutation = (imageType: TvshowImageType): string =>
        generateUpdateGQLFragment<
          MutationDeleteTvshowsImageByTvshowIdAndImageTypeArgs
        >('deleteTvshowsImageByTvshowIdAndImageType', {
          input: { tvshowId, imageType: { type: 'enum', value: imageType } },
        });

      const generateUpdateMutation = (
        imageId: string,
        imageType: TvshowImageType,
      ): string =>
        generateUpdateGQLFragment<
          MutationUpdateTvshowsImageByTvshowIdAndImageTypeArgs
        >('updateTvshowsImageByTvshowIdAndImageType', {
          input: {
            patch: { imageId },
            tvshowId,
            imageType: { type: 'enum', value: imageType },
          },
        });

      Object.entries(formData ?? {}).forEach(([imageType, imageId], idx) => {
        const [imgId] = imageId;
        const [initialValue] = initialData?.data?.[imageType];
        const [currentValue] = formData[imageType];

        switch (true) {
          case initialValue === undefined && currentValue !== undefined:
            mutations.push(
              `assign${idx}:${generateCreateMutation(
                imgId,
                imageType as TvshowImageType,
              )}`,
            );
            break;
          case initialValue !== undefined && currentValue === undefined:
            mutations.push(
              `assign${idx}:${generateDeleteMutation(
                imageType as TvshowImageType,
              )}`,
            );
            break;
          case initialValue !== currentValue:
            mutations.push(
              `assign${idx}:${generateUpdateMutation(
                currentValue,
                imageType as TvshowImageType,
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
    [tvshowId],
  );

  const { ImageSelectField } = useContext(ExtensionsContext);

  return (
    <Details<FormData>
      defaultTitle="Image Management"
      initialData={{
        data: initialImages ?? {},
        loading,
        entityNotFound: data?.tvshow === null,
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
 * Returns an image type with an empty array(value) using the TvshowImageType enum
 */
const getImageTypes = (): FormData => {
  let types = {} as FormData;

  Object.keys(TvshowImageType).map((type) => {
    const field = TvshowImageType[type];
    types = { ...types, [field]: [] };
  });

  return types;
};
