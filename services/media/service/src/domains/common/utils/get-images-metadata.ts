import {
  MosaicError,
  mosaicErrorMappingFactory,
} from '@axinom/mosaic-service-common';
import axios from 'axios';
import urljoin from 'url-join';
import { CommonErrors } from '../../../common';
import { SnapshotValidationResult } from '../../../publishing';
import { GqlImage, ImageJSONSelectable, PublishImage } from '../models';

interface ImageApiResults {
  validation: SnapshotValidationResult[];
  result: PublishImage[];
}
export const getImagesMetadata = async (
  imageServiceBaseUrl: string,
  authToken: string,
  images: ImageJSONSelectable[],
): Promise<ImageApiResults> => {
  if (images.length === 0) {
    return { result: [], validation: [] };
  }

  try {
    const result = await axios.post(
      urljoin(imageServiceBaseUrl, 'graphql'),
      {
        query: `
          query GeImagesMetadata($filter: ImageFilter) {
            images(filter: $filter) {
              nodes { 
                id     
                height
                width
                imageTypeKey
                transformationPath
              }
            }
          }
        `,
        variables: {
          filter: { id: { in: images.map((t) => t.image_id) } },
        },
      },
      { headers: { Authorization: `Bearer ${authToken}` } },
    );

    if (result.data.errors?.length > 0) {
      throw new MosaicError({
        ...CommonErrors.PublishImagesMetadataRequestError,
        details: {
          errors: result.data.errors,
        },
      });
    }

    const validation: SnapshotValidationResult[] = [];
    const publishData = [];
    for (const imageAssignment of images) {
      const gqlImage: GqlImage = result.data.data.images.nodes.find(
        (i: GqlImage) => i.id === imageAssignment.image_id,
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
      });
    }

    return { result: publishData, validation };
  } catch (error) {
    const mapper = mosaicErrorMappingFactory(
      (error: Error & { response?: { data?: { errors?: unknown[] } } }) => {
        return {
          ...CommonErrors.PublishImagesMetadataRequestError,
          details: {
            errors: error.response?.data?.errors,
          },
        };
      },
    );
    throw mapper(error);
  }
};
