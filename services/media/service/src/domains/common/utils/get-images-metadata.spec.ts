import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { CommonErrors } from '../../../common';
import * as image from '../../../generated/graphql/image';
import { GetImagesQuery } from '../../../generated/graphql/image';
import { getImagesMetadata } from './get-images-metadata';

type GqlImage = NonNullable<GetImagesQuery['images']>['nodes'][0];

let result: any = () => undefined;
jest.spyOn(image, 'getSdk').mockImplementation(() => ({
  GetImages: () => result(),
}));

describe('getImagesMetadata', () => {
  const imageId1 = 'valid-uuid-but-does-not-matter-here';
  const imageId2 = 'valid-uuid-but-does-not-matter-here-2';
  const endpoint = 'does-not-matter-as-request-is-mocked';
  const authToken = 'does-not-matter-as-request-is-mocked';
  const createApiObject = (nodes: GqlImage[]) => {
    return { data: { images: { nodes } } };
  };

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('Empty input array -> empty result array', async () => {
    // Act
    const meta = await getImagesMetadata(endpoint, authToken, []);

    // Assert
    expect(meta).toEqual({
      result: [],
      validation: [],
    });
  });

  it('Single image with empty array returned -> valid meta with warning', async () => {
    // Arrange
    result = () => {
      return createApiObject([]);
    };

    // Act
    const meta = await getImagesMetadata(endpoint, authToken, [
      {
        image_id: imageId1,
        season_id: 1,
        image_type: 'COVER',
      },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [],
      validation: [
        {
          context: 'IMAGE',
          message: `Image with id '${imageId1}' no longer exists.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Single image with matching gql image returned -> valid meta without warning', async () => {
    // Arrange
    const image1: GqlImage = {
      id: imageId1,
      width: 111,
      height: 222,
      imageTypeKey: 'movie_cover',
      transformationPath: '/some/path.png',
    };
    result = () => {
      return createApiObject([image1]);
    };

    // Act
    const meta = await getImagesMetadata(endpoint, authToken, [
      {
        image_id: imageId1,
        season_id: 1,
        image_type: 'COVER',
      },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          width: image1.width,
          height: image1.height,
          type: 'COVER',
          path: image1.transformationPath,
        },
      ],
      validation: [],
    });
  });

  it('Single image with matching gql image and different image_type returned -> valid meta with warning', async () => {
    // Arrange
    const image1: GqlImage = {
      id: imageId1,
      width: 111,
      height: 222,
      imageTypeKey: 'movie_teaser',
      transformationPath: '/some/path.png',
    };
    result = () => {
      return createApiObject([image1]);
    };

    // Act
    const meta = await getImagesMetadata(endpoint, authToken, [
      {
        image_id: imageId1,
        tvshow_id: 1,
        image_type: 'COVER',
      },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          width: image1.width,
          height: image1.height,
          type: 'COVER',
          path: image1.transformationPath,
        },
      ],
      validation: [
        {
          context: 'IMAGE',
          message: `Possible image type mismatch! Image with type '${image1.imageTypeKey}' is assigned as 'COVER'.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Two images with no matching gql images returned -> valid meta with warnings', async () => {
    // Arrange
    result = () => {
      return createApiObject([]);
    };

    // Act
    const meta = await getImagesMetadata(endpoint, authToken, [
      {
        image_id: imageId1,
        episode_id: 1,
        image_type: 'COVER',
      },
      {
        image_id: imageId2,
        episode_id: 1,
        image_type: 'TEASER',
      },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [],
      validation: [
        {
          context: 'IMAGE',
          message: `Image with id '${imageId1}' no longer exists.`,
          severity: 'WARNING',
        },
        {
          context: 'IMAGE',
          message: `Image with id '${imageId2}' no longer exists.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Two images with one matching gql image returned -> valid meta with warning', async () => {
    // Arrange
    const image1: GqlImage = {
      id: imageId1,
      width: 111,
      height: 222,
      imageTypeKey: 'movie_cover',
      transformationPath: '/some/path.png',
    };
    result = () => {
      return createApiObject([image1]);
    };

    // Act
    const meta = await getImagesMetadata(endpoint, authToken, [
      {
        image_id: imageId1,
        movie_id: 1,
        image_type: 'COVER',
      },
      {
        image_id: imageId2,
        movie_id: 1,
        image_type: 'TEASER',
      },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          width: image1.width,
          height: image1.height,
          type: 'COVER',
          path: image1.transformationPath,
        },
      ],
      validation: [
        {
          context: 'IMAGE',
          message: `Image with id '${imageId2}' no longer exists.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Two images with two matching gql images returned -> valid meta without warning', async () => {
    // Arrange
    const image1: GqlImage = {
      id: imageId1,
      width: 111,
      height: 222,
      imageTypeKey: 'movie_cover',
      transformationPath: '/some/path.png',
    };
    const image2: GqlImage = {
      id: imageId2,
      width: 333,
      height: 444,
      imageTypeKey: 'movie_teaser',
      transformationPath: '/some/path.png',
    };
    result = () => {
      return createApiObject([image1, image2]);
    };

    // Act
    const meta = await getImagesMetadata(endpoint, authToken, [
      {
        image_id: imageId1,
        season_id: 1,
        image_type: 'COVER',
      },
      {
        image_id: imageId2,
        season_id: 1,
        image_type: 'TEASER',
      },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          width: image1.width,
          height: image1.height,
          type: 'COVER',
          path: image1.transformationPath,
        },
        {
          width: image2.width,
          height: image2.height,
          type: 'TEASER',
          path: image2.transformationPath,
        },
      ],
      validation: [],
    });
  });

  it('Error thrown because image service is not available -> error re-thrown to support message retries', async () => {
    // Arrange
    const errorMessage = 'connect ECONNREFUSED 127.0.0.1:10400';
    result = () => {
      const error = new Error(errorMessage) as Error & { code?: string };
      error.code = 'ECONNREFUSED';
      throw error;
    };

    // Act
    const error = await rejectionOf(
      getImagesMetadata(endpoint, authToken, [
        { image_id: '1', season_id: 1, image_type: 'COVER' },
      ]),
    );

    // Assert
    expect(error).toMatchObject({
      message:
        'The Image service is not accessible. Please contact the service support.',
      code: CommonErrors.ServiceNotAccessible.code,
    });
    expect(error.stack).toContain(errorMessage);
    expect(error.details).toBeUndefined();
  });

  it('Error thrown by image service because api changed -> error with details is re-thrown to support message retries', async () => {
    // Arrange
    const errors = [
      {
        timestamp: '2021-05-25T06:23:00.923Z',
        message: 'Cannot query field "obsolete_field" on type "Image".',
        code: 'GRAPHQL_VALIDATION_FAILED',
      },
    ];
    result = () => {
      const error = new Error('Bad Request');
      (error as any).response = { data: { images: null }, errors };
      throw error;
    };

    // Act
    const error = await rejectionOf(
      getImagesMetadata(endpoint, authToken, [
        { image_id: '1', season_id: 1, image_type: 'COVER' },
      ]),
    );

    // Assert
    expect(error).toMatchObject(CommonErrors.PublishImagesMetadataRequestError);
    expect(error.details.errors).toMatchObject(errors);
  });

  // This case is probably impossible with the current implementation, but
  // typing of returned API response suggests there is a possibility
  it('Error not thrown, but no images returned -> error is thrown', async () => {
    // Arrange
    result = () => {
      return { data: { images: null } };
    };

    // Act
    const error = await rejectionOf(
      getImagesMetadata(endpoint, authToken, [
        { image_id: '1', season_id: 1, image_type: 'COVER' },
      ]),
    );

    // Assert
    expect(error).toMatchObject(CommonErrors.PublishImagesMetadataRequestError);
    expect(error.details).toBeFalsy();
  });
});
