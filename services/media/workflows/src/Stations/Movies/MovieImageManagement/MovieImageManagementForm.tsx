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
  MovieImageType,
  MoviesImage,
  Mutation,
  MutationCreateMoviesImageArgs,
  MutationDeleteMoviesImageByMovieIdAndImageTypeArgs,
  MutationUpdateMoviesImageByMovieIdAndImageTypeArgs,
  useMovieImagesQuery,
} from '../../../generated/graphql';

interface MovieImageManagementFormProps {
  movieId: number;
}

type ImageNodes = Pick<MoviesImage, 'imageId' | 'imageType'> & {
  __typename: 'MoviesImage';
};

type FormData = Record<MovieImageType, string[]>;

const Form: React.FC<{ imageSelectField: unknown }> = ({
  imageSelectField,
}) => {
  return (
    <>
      {Object.keys(MovieImageType).map((type) => {
        const field = MovieImageType[type];
        return (
          <Field
            key={field}
            name={field}
            label={type}
            as={imageSelectField}
            maxItems={1}
            title="Select Image"
            imageScope="movie"
          />
        );
      })}
    </>
  );
};

export const MovieImageManagementForm: React.FC<
  MovieImageManagementFormProps
> = ({ movieId }) => {
  const { loading, data, error } = useMovieImagesQuery({
    client,
    variables: { id: movieId },
    fetchPolicy: 'network-only',
  });

  const { initialImages } = useImageTypes(
    data?.movie?.moviesImages.nodes as ImageNodes[],
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
        imageType: MovieImageType,
      ): string =>
        generateUpdateGQLFragment<MutationCreateMoviesImageArgs>(
          'createMoviesImage',
          {
            input: {
              moviesImage: {
                movieId,
                imageId,
                imageType: { type: 'enum', value: imageType },
              },
            },
          },
        );

      const generateDeleteMutation = (imageType: MovieImageType): string =>
        generateUpdateGQLFragment<MutationDeleteMoviesImageByMovieIdAndImageTypeArgs>(
          'deleteMoviesImageByMovieIdAndImageType',
          {
            input: { movieId, imageType: { type: 'enum', value: imageType } },
          },
        );

      const generateUpdateMutation = (
        imageId: string,
        imageType: MovieImageType,
      ): string =>
        generateUpdateGQLFragment<MutationUpdateMoviesImageByMovieIdAndImageTypeArgs>(
          'updateMoviesImageByMovieIdAndImageType',
          {
            input: {
              patch: { imageId },
              movieId,
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
                imageType as MovieImageType,
              )}`,
            );
            break;
          case initialValue !== undefined && currentValue === undefined:
            mutations.push(
              `assign${idx}:${generateDeleteMutation(
                imageType as MovieImageType,
              )}`,
            );
            break;
          case initialValue !== currentValue:
            mutations.push(
              `assign${idx}:${generateUpdateMutation(
                currentValue,
                imageType as MovieImageType,
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
    [movieId],
  );

  const { ImageSelectField } = useContext(ExtensionsContext);

  return (
    <Details<FormData>
      defaultTitle="Image Management"
      initialData={{
        data: initialImages ?? {},
        loading,
        entityNotFound: data?.movie === null,
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
 * Returns an image type with an empty array(value) using the MovieImageType enum
 */
const getImageTypes = (): FormData => {
  let types = {} as FormData;

  Object.keys(MovieImageType).map((type) => {
    const field = MovieImageType[type];
    types = { ...types, [field]: [] };
  });

  return types;
};
