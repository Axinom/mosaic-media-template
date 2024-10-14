import { mosaicErrorMappingFactory } from '@axinom/mosaic-service-common';
import { GraphQLClient } from 'graphql-request';
import { DetailedImage } from 'media-messages';
import urljoin from 'url-join';
import { CommonErrors } from '../../../common';
import { GetImagesQuery, getSdk } from '../../../generated/graphql/image';
import {
  createValidationWarning,
  PublishValidationMessage,
} from '../../models';

export type GqlImage = NonNullable<GetImagesQuery['images']>['nodes'][0];

export const getValidationAndImages = async (
  imageServiceBaseUrl: string,
  authToken: string,
  imageIds: string[],
  expectSingleImage: boolean,
): Promise<{
  images: DetailedImage[];
  validations: PublishValidationMessage[];
}> => {
  if (imageIds.length === 0) {
    return {
      images: [],
      validations: [
        createValidationWarning(
          `No ${expectSingleImage ? 'image' : 'images'} assigned.`,
          'IMAGES',
        ),
      ],
    };
  }
  try {
    const validations: PublishValidationMessage[] = [];
    const client = new GraphQLClient(urljoin(imageServiceBaseUrl, 'graphql'));
    const { GetImages } = getSdk(client);
    const { data } = await GetImages(
      {
        filter: { id: { in: imageIds } },
      },
      { Authorization: `Bearer ${authToken}` },
    );

    const imagesDetails = [];
    for (const imageAssignment of imageIds) {
      const gqlImage = data?.images?.nodes.find(
        (i: GqlImage) => i.id === imageAssignment,
      );
      if (!gqlImage) {
        validations.push(
          createValidationWarning(
            `Image with id '${imageAssignment}' no longer exists.`,
            'IMAGES',
          ),
        );
        continue;
      }

      imagesDetails.push(toDetailedImage(gqlImage));
    }

    return {
      images: imagesDetails,
      validations,
    };
  } catch (e) {
    throw getCustomMappedError(e);
  }
};

export const toDetailedImage = (image: GqlImage): DetailedImage => {
  return {
    id: image.id,
    width: image.width,
    height: image.height,
    type: image.imageTypeKey,
    path: image.transformationPath,
    alt_text: image.altText,
  };
};

const getCustomMappedError = mosaicErrorMappingFactory(
  (
    error: Error & {
      code?: string;
      response?: { errors?: unknown[] };
    },
  ) => {
    if (error?.code === 'ECONNREFUSED') {
      return {
        ...CommonErrors.ServiceNotAccessible,
        messageParams: ['Image'],
      };
    }

    if (error.response?.errors) {
      return {
        ...CommonErrors.UnableRetrieveImageDetails,
        details: {
          errors: error.response?.errors,
        },
      };
    }

    return {
      ...CommonErrors.ImageDetailsRequestFailed,
      details: {
        error: error.message,
      },
    };
  },
);
