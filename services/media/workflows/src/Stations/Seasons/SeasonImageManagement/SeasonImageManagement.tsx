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
  MutationCreateSeasonsImageArgs,
  MutationDeleteSeasonsImageBySeasonIdAndImageTypeArgs,
  MutationUpdateSeasonsImageBySeasonIdAndImageTypeArgs,
  SeasonImageType,
  SeasonsImage,
  useSeasonImagesQuery,
} from '../../../generated/graphql';

type ImageNodes = Pick<SeasonsImage, 'imageId' | 'imageType'> & {
  __typename: 'SeasonsImage';
};

type FormData = Record<SeasonImageType, string[]>;

const Form: React.FC<{ imageSelectField: unknown }> = ({
  imageSelectField,
}) => {
  return (
    <>
      {Object.keys(SeasonImageType).map((type) => {
        const field = SeasonImageType[type];
        return (
          <Field
            key={field}
            name={field}
            label={type}
            as={imageSelectField}
            maxItems={1}
            title="Select Image"
            imageScope="season"
          />
        );
      })}
    </>
  );
};

export const SeasonImageManagement: React.FC = () => {
  const seasonId = Number(
    useParams<{
      seasonId: string;
    }>().seasonId,
  );

  const { loading, data, error } = useSeasonImagesQuery({
    client,
    variables: { id: seasonId },
    fetchPolicy: 'no-cache',
  });

  const { initialImages } = useImageTypes(
    data?.season?.seasonsImages.nodes as ImageNodes[],
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
        imageType: SeasonImageType,
      ): string =>
        generateUpdateGQLFragment<MutationCreateSeasonsImageArgs>(
          'createSeasonsImage',
          {
            input: {
              seasonsImage: {
                seasonId,
                imageId,
                imageType: { type: 'enum', value: imageType },
              },
            },
          },
        );

      const generateDeleteMutation = (imageType: SeasonImageType): string =>
        generateUpdateGQLFragment<
          MutationDeleteSeasonsImageBySeasonIdAndImageTypeArgs
        >('deleteSeasonsImageBySeasonIdAndImageType', {
          input: { seasonId, imageType: { type: 'enum', value: imageType } },
        });

      const generateUpdateMutation = (
        imageId: string,
        imageType: SeasonImageType,
      ): string =>
        generateUpdateGQLFragment<
          MutationUpdateSeasonsImageBySeasonIdAndImageTypeArgs
        >('updateSeasonsImageBySeasonIdAndImageType', {
          input: {
            patch: { imageId },
            seasonId,
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
                imageType as SeasonImageType,
              )}`,
            );
            break;
          case initialValue !== undefined && currentValue === undefined:
            mutations.push(
              `assign${idx}:${generateDeleteMutation(
                imageType as SeasonImageType,
              )}`,
            );
            break;
          case initialValue !== currentValue:
            mutations.push(
              `assign${idx}:${generateUpdateMutation(
                currentValue,
                imageType as SeasonImageType,
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
    [seasonId],
  );

  const { ImageSelectField } = useContext(ExtensionsContext);

  return (
    <Details<FormData>
      defaultTitle="Image Management"
      initialData={{
        data: initialImages ?? {},
        loading,
        entityNotFound: data?.season === null,
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
 * Returns an image type with an empty array(value) using the SeasonImageType enum
 */
const getImageTypes = (): FormData => {
  let types = {} as FormData;

  Object.keys(SeasonImageType).map((type) => {
    const field = SeasonImageType[type];
    types = { ...types, [field]: [] };
  });

  return types;
};
