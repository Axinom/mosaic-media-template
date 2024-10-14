import {
  MosaicError,
  mosaicErrorMappingFactory,
} from '@axinom/mosaic-service-common';
import { GraphQLClient } from 'graphql-request';
import urljoin from 'url-join';
import { CommonErrors } from '../../../common';
import { getSdk } from '../../../generated/graphql/image';
import { SnapshotValidationResult } from '../../../publishing';
import { ImageJSONSelectable, PublishImage } from '../models';

interface ImageApiResults {
  validation: SnapshotValidationResult[];
  result: PublishImage[];
}

const getMappedError = mosaicErrorMappingFactory(
  (error: Error & { code?: string; response?: { errors?: unknown[] } }) => {
    if (error?.code === 'ECONNREFUSED') {
      return {
        ...CommonErrors.ServiceNotAccessible,
        messageParams: ['Image'],
      };
    }

    if (error.response?.errors) {
      return {
        ...CommonErrors.PublishImagesMetadataRequestError,
        details: {
          errors: error.response?.errors,
        },
      };
    }
    return CommonErrors.PublishImagesMetadataRequestError;
  },
);

export const getImagesMetadata = async (
  imageServiceBaseUrl: string,
  authToken: string,
  images: ImageJSONSelectable[],
): Promise<ImageApiResults> => {
  if (images.length === 0) {
    return { result: [], validation: [] };
  }

  try {
    const client = new GraphQLClient(urljoin(imageServiceBaseUrl, 'graphql'));
    const { GetImages } = getSdk(client);
    const { data } = await GetImages(
      { filter: { id: { in: images.map((t) => t.image_id) } } },
      { Authorization: `Bearer ${authToken}` },
    );

    if (!data.images?.nodes) {
      throw new MosaicError({
        ...CommonErrors.PublishImagesMetadataRequestError,
        logInfo: {
          reason:
            'The request to the Image Service succeeded, but no images were returned and an explicit error was not thrown.',
        },
      });
    }

    const validation: SnapshotValidationResult[] = [];
    const publishData: PublishImage[] = [];
    for (const imageAssignment of images) {
      const gqlImage = data.images.nodes.find(
        (i) => i.id === imageAssignment.image_id,
      );
      if (!gqlImage) {
        validation.push({
          context: 'IMAGE',
          message: `Image with id '${imageAssignment.image_id}' no longer exists.`,
          severity: 'WARNING',
        });
        continue;
      }

      if (
        !gqlImage.imageTypeKey
          .toLowerCase()
          .includes(imageAssignment.image_type.toLowerCase())
      ) {
        validation.push({
          context: 'IMAGE',
          message: `Possible image type mismatch! Image with type '${gqlImage.imageTypeKey}' is assigned as '${imageAssignment.image_type}'.`,
          severity: 'WARNING',
        });
      }

      publishData.push({
        width: gqlImage.width,
        height: gqlImage.height,
        type: imageAssignment.image_type,
        path: gqlImage.transformationPath,
        alt_text: gqlImage.altText,
      });
    }

    return { result: publishData, validation };
  } catch (error) {
    // Throwing an actual error instead of returning a validation error because
    // this usually gets called in context of a message handler and there is a
    // chance to recover using the message retry strategy.
    throw getMappedError(error);
  }
};
