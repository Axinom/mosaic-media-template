import { rejectionOf } from '@axinom/mosaic-service-common';
import { ClientError } from 'graphql-request';
import 'jest-extended';
import { CommonErrors } from '../../../common';
import * as video from '../../../generated/graphql/video';
import { createValidationError, createValidationWarning } from '../../models';
import {
  getValidationAndVideos,
  GqlVideo,
  toDetailedVideo,
} from './get-validation-and-videos';

let result: any = () => undefined;
jest.spyOn(video, 'getSdk').mockImplementation(() => ({
  GetVideos: () => result(),
}));

describe('getValidationAndVideos', () => {
  const videoId1 = 'valid-uuid-but-does-not-matter-here';
  const videoId2 = 'valid-uuid-but-does-not-matter-here-2';
  const createGqlVideo = (id: string): GqlVideo => {
    return {
      id: id,
      title: `Video ${id}`,
      sourceFileName: `source-${id}`,
      sourceLocation: `_ingest/default/${id}`,
      isArchived: false,
      isProtected: false,
      videosTags: {
        nodes: [{ name: 'MAIN' }],
      },
      outputLocation: `_output/default/${id}`,
      audioLanguages: [],
      captionLanguages: [],
      subtitleLanguages: [],
      previewStatus: video.PreviewStatus.Approved,
      outputFormat: video.OutputFormat.Cmaf,
      encodingState: video.EncodingState.Ready,
      videoStreams: {
        nodes: [
          {
            label: 'audio',
            format: video.OutputFormat.Cmaf,
            file: 'audio-en_init.mp4',
            languageCode: 'en',
            bitrateInKbps: 64,
            type: video.VideoStreamType.Audio,
          },
          {
            label: 'SD',
            format: video.OutputFormat.Cmaf,
            file: 'video-H264-288-400k.m3u8',
            bitrateInKbps: 400,
            type: video.VideoStreamType.Video,
          },
        ],
      },
    };
  };
  const endpoint = 'http://does-not-matter-as-request-is.mocked';
  const authToken = 'does-not-matter-as-request-is-mocked';
  const createApiObject = (nodes: GqlVideo[]) => {
    return { data: { videos: { nodes } } };
  };

  it('Empty input array -> empty array with validation warning returned', async () => {
    // Act
    const { videos, validations } = await getValidationAndVideos(
      endpoint,
      authToken,
      [],
      true,
    );

    // Assert
    expect(videos).toHaveLength(0);
    expect(validations).toHaveLength(1);
    const error = validations[0];
    expect(error).toMatchObject(
      createValidationError('No video assigned.', 'VIDEOS'),
    );
  });

  it('Empty input array for single video -> empty array with validation warning returned', async () => {
    // Act
    const { videos, validations } = await getValidationAndVideos(
      endpoint,
      authToken,
      [],
      false,
    );

    // Assert
    expect(videos).toHaveLength(0);
    expect(validations).toHaveLength(1);
    const warning = validations[0];
    expect(warning).toMatchObject(
      createValidationWarning('No videos assigned.', 'VIDEOS'),
    );
  });

  it('video not found in Video Service -> validation errors are returned', async () => {
    // Arrange
    result = () => {
      return createApiObject([]);
    };

    // Act
    const { videos, validations } = await getValidationAndVideos(
      endpoint,
      authToken,
      [{ videoId: videoId1 }],
      true,
    );

    // Assert
    expect(videos).toHaveLength(0);
    expect(validations).toHaveLength(1);
    const error = validations[0];
    expect(error).toMatchObject(
      createValidationError(
        "Details for the video with ID 'valid-uuid-but-does-not-matter-here' were not found.",
        'VIDEOS',
      ),
    );
  });

  it('Single video with matching gql video returned', async () => {
    // Arrange
    const video1: GqlVideo = createGqlVideo(videoId1);
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const { videos, validations } = await getValidationAndVideos(
      endpoint,
      authToken,
      [{ videoId: videoId1 }],
      true,
    );

    // Assert
    expect(videos).toEqual([toDetailedVideo(video1)]);
    expect(validations).toHaveLength(0);
  });

  it('Two videos with two matching gql videos returned -> valid details without warning', async () => {
    // Arrange
    const video1: GqlVideo = createGqlVideo(videoId1);
    const video2: GqlVideo = createGqlVideo(videoId2);
    result = () => {
      return createApiObject([video1, video2]);
    };

    // Act
    const { videos, validations } = await getValidationAndVideos(
      endpoint,
      authToken,
      [{ videoId: videoId1 }, { videoId: videoId2 }],
      false,
    );

    // Assert
    expect(videos).toEqual([toDetailedVideo(video1), toDetailedVideo(video2)]);
    expect(validations).toHaveLength(0);
  });

  it('Error thrown because video service is not available -> error thrown', async () => {
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
      getValidationAndVideos(endpoint, authToken, [{ videoId: '1' }], true),
    );

    // Assert
    expect(error).toMatchObject({
      message:
        'The Video service is not accessible. Please contact Axinom support.',
      code: CommonErrors.ServiceNotAccessible.code,
    });
  });

  it('Error thrown by video service because api changed -> error with details is thrown', async () => {
    // Arrange
    const errors = [
      {
        timestamp: '2021-05-25T06:23:00.923Z',
        message: 'Cannot query field "obsolete_field" on type "Video".',
        code: 'GRAPHQL_VALIDATION_FAILED',
      },
    ];
    result = () => {
      throw new ClientError(
        { data: { videos: null }, errors, status: 400 },
        { query: '' },
      );
    };

    // Act
    const error = await rejectionOf(
      getValidationAndVideos(endpoint, authToken, [{ videoId: '1' }], true),
    );

    // Assert
    expect(error).toMatchObject({
      ...CommonErrors.UnableRetrieveVideoDetails,
      details: { errors },
    });
  });
  //
  it('Error not thrown, but errors array returned with null videos -> error with details is thrown', async () => {
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
        { data: { videos: null }, errors, status: 401 },
        { query: '' },
      );
    };

    // Act
    const error = await rejectionOf(
      getValidationAndVideos(endpoint, authToken, [{ videoId: '1' }], true),
    );

    // Assert
    expect(error).toMatchObject({
      ...CommonErrors.UnableRetrieveVideoDetails,
      details: { errors },
    });
  });
});
