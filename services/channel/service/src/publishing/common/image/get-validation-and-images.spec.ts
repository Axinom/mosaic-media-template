import { rejectionOf } from '@axinom/mosaic-service-common';
import { ClientError } from 'graphql-request';
import 'jest-extended';
import { CommonErrors } from '../../../common';
import * as image from '../../../generated/graphql/image';
import { createValidationWarning } from '../../models';
import { getValidationAndImages, GqlImage } from './get-validation-and-images';

let result: any = () => undefined;
jest.spyOn(image, 'getSdk').mockImplementation(() => ({
  GetImages: () => result(),
}));

describe('getValidationAndImages', () => {
  const imageId1 = 'valid-uuid-but-does-not-matter-here';
  const imageId2 = 'valid-uuid-but-does-not-matter-here-2';
  const endpoint = 'http://does-not-matter-as-request-is.mocked';
  const authToken = 'does-not-matter-as-request-is-mocked';
  const createApiObject = (nodes: GqlImage[]) => {
    return { data: { images: { nodes } } };
  };
  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('Empty input array -> empty result array with validation warning', async () => {
    // Act
    const { images, validations } = await getValidationAndImages(
      endpoint,
      authToken,
      [],
      true,
    );

    // Assert
    expect(images).toHaveLength(0);
    expect(validations).toHaveLength(1);
    expect(validations[0]).toMatchObject(
      createValidationWarning('No image assigned.', 'IMAGES'),
    );
  });

  it('Empty input array for single image -> empty result array with validation warning', async () => {
    // Act
    const { images, validations } = await getValidationAndImages(
      endpoint,
      authToken,
      [],
      true,
    );

    // Assert
    expect(images).toHaveLength(0);
    expect(validations).toHaveLength(1);
    expect(validations[0]).toMatchObject(
      createValidationWarning('No image assigned.', 'IMAGES'),
    );
  });

  it('Single image with empty array returned -> valid details with validation warning', async () => {
    // Arrange
    result = () => {
      return createApiObject([]);
    };

    // Act
    const { images, validations } = await getValidationAndImages(
      endpoint,
      authToken,
      [imageId1],
      true,
    );

    // Assert
    expect(images).toEqual([]);
    expect(validations).toHaveLength(1);
    const warning = validations[0];
    expect(warning).toMatchObject(
      createValidationWarning(
        `Image with id '${imageId1}' no longer exists.`,
        'IMAGES',
      ),
    );
  });

  it('Single image with matching gql image returned -> valid details without validation warning', async () => {
    // Arrange
    const image1: GqlImage = {
      id: imageId1,
      width: 111,
      height: 222,
      imageTypeKey: 'LOGO',
      transformationPath: '/some/path.png',
      altText: 'some alt text',
    };
    result = () => {
      return createApiObject([image1]);
    };

    // Act
    const { images, validations } = await getValidationAndImages(
      endpoint,
      authToken,
      [imageId1],
      true,
    );

    // Assert
    expect(images).toEqual([
      {
        id: image1.id,
        width: image1.width,
        height: image1.height,
        type: 'LOGO',
        path: image1.transformationPath,
        alt_text: image1.altText,
      },
    ]);
    expect(validations).toHaveLength(0);
  });

  it('Two images with no matching gql images returned -> no details with validation warnings', async () => {
    // Arrange
    result = () => {
      return createApiObject([]);
    };

    // Act
    const { images, validations } = await getValidationAndImages(
      endpoint,
      authToken,
      [imageId1, imageId2],
      false,
    );

    // Assert
    expect(images).toHaveLength(0);
    expect(validations).toHaveLength(2);
    expect(validations).toMatchObject([
      createValidationWarning(
        `Image with id '${imageId1}' no longer exists.`,
        'IMAGES',
      ),
      createValidationWarning(
        `Image with id '${imageId2}' no longer exists.`,
        'IMAGES',
      ),
    ]);
  });

  it('Two images with one matching gql image returned -> one details with validation warning', async () => {
    // Arrange
    const image1: GqlImage = {
      id: imageId1,
      width: 111,
      height: 222,
      imageTypeKey: 'movie_cover',
      transformationPath: '/some/path.png',
      altText: 'some alt text',
    };
    result = () => {
      return createApiObject([image1]);
    };

    // Act
    const { images, validations } = await getValidationAndImages(
      endpoint,
      authToken,
      [imageId1, imageId2],
      false,
    );

    // Assert
    expect(images).toHaveLength(1);
    expect(images).toEqual([
      {
        id: image1.id,
        width: image1.width,
        height: image1.height,
        type: 'movie_cover',
        path: image1.transformationPath,
        alt_text: image1.altText,
      },
    ]);
    expect(validations).toHaveLength(1);
    const warning = validations[0];
    expect(warning).toMatchObject(
      createValidationWarning(
        `Image with id '${imageId2}' no longer exists.`,
        'IMAGES',
      ),
    );
  });

  it('Two images with two matching gql images returned -> valid details without warning', async () => {
    // Arrange
    const image1: GqlImage = {
      id: imageId1,
      width: 111,
      height: 222,
      imageTypeKey: 'episode_cover',
      transformationPath: '/some/path.png',
      altText: 'some alt text',
    };
    const image2: GqlImage = {
      id: imageId2,
      width: 333,
      height: 444,
      imageTypeKey: 'movie_cover',
      transformationPath: '/some/path.png',
      altText: 'some other alt text',
    };
    result = () => {
      return createApiObject([image1, image2]);
    };

    // Act
    const { images, validations } = await getValidationAndImages(
      endpoint,
      authToken,
      [imageId1, imageId2],
      false,
    );

    // Assert
    expect(images).toEqual([
      {
        id: image1.id,
        width: image1.width,
        height: image1.height,
        type: image1.imageTypeKey,
        path: image1.transformationPath,
        alt_text: image1.altText,
      },
      {
        id: image2.id,
        width: image2.width,
        height: image2.height,
        type: image2.imageTypeKey,
        path: image2.transformationPath,
        alt_text: image2.altText,
      },
    ]);
    expect(validations).toHaveLength(0);
  });

  it('Error thrown because image service is not available -> error thrown', async () => {
    // Arrange
    result = () => {
      const error = new Error(
        'connect ECONNREFUSED 127.0.0.1:10400',
      ) as Error & { code?: string };
      error.code = 'ECONNREFUSED';
      throw error;
    };

    // Act
    const error = await rejectionOf(
      getValidationAndImages(endpoint, authToken, ['1'], false),
    );

    // Assert
    expect(error).toMatchObject({
      message:
        'The Image service is not accessible. Please contact Axinom support.',
      code: CommonErrors.ServiceNotAccessible.code,
    });
  });

  it('Error thrown by image service because api changed -> error with details is thrown', async () => {
    // Arrange
    const errors = [
      {
        timestamp: '2021-05-25T06:23:00.923Z',
        message: 'Cannot query field "obsolete_field" on type "Image".',
        code: 'GRAPHQL_VALIDATION_FAILED',
      },
    ];
    result = () => {
      throw new ClientError(
        { data: { images: null }, errors, status: 400 },
        { query: '' },
      );
    };
    // Act
    const error = await rejectionOf(
      getValidationAndImages(endpoint, authToken, ['1'], false),
    );

    // Assert
    expect(error).toMatchObject({
      ...CommonErrors.UnableRetrieveImageDetails,
      details: { errors },
    });
  });

  it('Error not thrown, but errors array returned with null images -> error with details is thrown', async () => {
    // Arrange
    const errors = [
      {
        timestamp: '2021-05-25T06:23:00.923Z',
        message: 'Access token verification failed',
        code: 'ACCESS_TOKEN_VERIFICATION_FAILED',
      },
    ];
    result = () => {
      throw new ClientError(
        { data: { images: null }, errors, status: 401 },
        { query: '' },
      );
    };

    // Act
    const error = await rejectionOf(
      getValidationAndImages(endpoint, authToken, ['1'], false),
    );

    // Assert
    expect(error.message).toBe('Unable to retrieve images details.');
    expect(error.details.errors).toMatchObject(errors);
  });
});
