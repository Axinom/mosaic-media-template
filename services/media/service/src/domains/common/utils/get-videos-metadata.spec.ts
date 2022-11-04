import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { GqlVideo } from '../models';
import { getVideosMetadata } from './get-videos-metadata';

let result: any = () => undefined;
jest.mock('axios', () => ({
  post: () => result(),
}));

describe('getVideosMetadata', () => {
  const videoId1 = 'valid-uuid-but-does-not-matter-here';
  const videoId2 = 'valid-uuid-but-does-not-matter-here-2';
  const endpoint = 'does-not-matter-as-request-is-mocked';
  const authToken = 'does-not-matter-as-request-is-mocked';
  const createApiObject = (nodes: GqlVideo[]) => {
    return { data: { data: { videos: { nodes } } } };
  };

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('Empty input array -> empty result array', async () => {
    // Act
    const meta = await getVideosMetadata(endpoint, authToken, null, []);

    // Assert
    expect(meta).toEqual({
      result: [],
      validation: [],
    });
  });

  it('Main video with empty array returned -> valid meta with warning', async () => {
    // Arrange
    result = () => {
      return createApiObject([]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, videoId1, []);

    // Assert
    expect(meta).toEqual({
      result: [],
      validation: [
        {
          context: 'VIDEO',
          message: `Main video with id '${videoId1}' no longer exists.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Trailer video with empty array returned -> valid meta with warning', async () => {
    // Arrange
    result = () => {
      return createApiObject([]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, null, [
      { video_id: videoId1, movie_id: 1 },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [],
      validation: [
        {
          context: 'VIDEO',
          message: `Trailer video with id '${videoId1}' no longer exists.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Trailer and main videos with empty array returned -> valid meta with warning', async () => {
    // Arrange
    result = () => {
      return createApiObject([]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, videoId1, [
      { video_id: videoId2, movie_id: 1 },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [],
      validation: [
        {
          context: 'VIDEO',
          message: `Main video with id '${videoId1}' no longer exists.`,
          severity: 'WARNING',
        },
        {
          context: 'VIDEO',
          message: `Trailer video with id '${videoId2}' no longer exists.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Main video with full metadata with matching gql video returned -> valid meta without warning', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video',
      outputFormat: 'DASH',
      isProtected: true,
      durationInSeconds: 123,
      audioLanguages: ['EN', 'de'],
      subtitleLanguages: ['en', 'de', 'ru'],
      captionLanguages: ['en', 'de', 'jp'],
      hlsManifestPath: 'some/path/manifest.mpd',
      dashManifestPath: 'some/other/path/manifest.mpd',
      videosTags: { nodes: [{ name: 'RandomTag' }] },
      encodingState: 'READY',
      previewStatus: 'APPROVED',
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            initialFile: 'video-H264-240-300k.m3u8',
            format: 'HLS',
            bandwidthInBps: 400000,
            label: 'HD',
          },
        ],
      },
    };
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, videoId1, []);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'MAIN',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: video1.audioLanguages,
          subtitle_languages: video1.subtitleLanguages,
          caption_languages: video1.captionLanguages,
          dash_manifest: video1.dashManifestPath,
          hls_manifest: video1.hlsManifestPath,
          duration: video1.durationInSeconds,
          video_streams: [
            {
              drm_key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              initial_file: video1.videoStreams.nodes[0].initialFile,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bandwidth_in_bps: video1.videoStreams.nodes[0].bandwidthInBps,
              language_code: video1.videoStreams.nodes[0].languageCode,
            },
          ],
        },
      ],
      validation: [],
    });
  });

  it('Main video with matching gql video returned -> valid meta without warning', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video',
      outputFormat: 'DASH_HLS',
      isProtected: true,
      videosTags: { nodes: [] },
      encodingState: 'READY',
      previewStatus: 'APPROVED',
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            initialFile: 'video-H264-240-300k.m3u8',
            format: 'HLS',
            bandwidthInBps: 400000,
            label: 'HD',
          },
        ],
      },
    };
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, videoId1, []);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'MAIN',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          duration: undefined,
          video_streams: [
            {
              drm_key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              initial_file: video1.videoStreams.nodes[0].initialFile,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bandwidth_in_bps: video1.videoStreams.nodes[0].bandwidthInBps,
              language_code: video1.videoStreams.nodes[0].languageCode,
            },
          ],
        },
      ],
      validation: [],
    });
  });

  it('Trailer video with matching gql video returned -> valid meta without warning', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video',
      outputFormat: 'DASH_HLS',
      isProtected: true,
      videosTags: { nodes: [{ name: 'trailer' }] },
      encodingState: 'READY',
      previewStatus: 'APPROVED',
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            initialFile: 'video-H264-240-300k.m3u8',
            format: 'HLS',
            bandwidthInBps: 400000,
            label: 'HD',
          },
        ],
      },
    };
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, null, [
      { video_id: videoId1, movie_id: 1 },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'TRAILER',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          duration: undefined,
          video_streams: [
            {
              drm_key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              initial_file: video1.videoStreams.nodes[0].initialFile,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bandwidth_in_bps: video1.videoStreams.nodes[0].bandwidthInBps,
              language_code: video1.videoStreams.nodes[0].languageCode,
            },
          ],
        },
      ],
      validation: [],
    });
  });

  it('Trailer and main videos with matching gql videos returned -> valid meta with warning', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video 1',
      outputFormat: 'DASH_HLS',
      isProtected: true,
      videosTags: { nodes: [{ name: 'MAIN' }] },
      encodingState: 'READY',
      previewStatus: 'APPROVED',
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            initialFile: 'video-H264-240-300k.m3u8',
            format: 'HLS',
            bandwidthInBps: 400000,
            label: 'HD',
          },
        ],
      },
    };
    const video2: GqlVideo = {
      id: videoId2,
      title: 'Test Video 2',
      outputFormat: 'CMAF',
      isProtected: false,
      videosTags: { nodes: [{ name: 'trailer' }] },
      encodingState: 'READY',
      previewStatus: 'APPROVED',
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            initialFile: 'video-H264-240-300k.m3u8',
            format: 'HLS',
            bandwidthInBps: 400000,
            label: 'HD',
          },
        ],
      },
    };
    result = () => {
      return createApiObject([video1, video2]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, videoId1, [
      { video_id: 'missing-id', movie_id: 1 },
      { video_id: videoId2, movie_id: 2 },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'MAIN',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          drm_key_ids: undefined,
          duration: undefined,
          video_streams: [
            {
              drm_key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              initial_file: video1.videoStreams.nodes[0].initialFile,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bandwidth_in_bps: video1.videoStreams.nodes[0].bandwidthInBps,
              language_code: video1.videoStreams.nodes[0].languageCode,
            },
          ],
        },
        {
          type: 'TRAILER',
          title: video2.title,
          is_protected: video2.isProtected,
          output_format: video2.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          duration: undefined,
          video_streams: [
            {
              drm_key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              initial_file: video1.videoStreams.nodes[0].initialFile,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bandwidth_in_bps: video1.videoStreams.nodes[0].bandwidthInBps,
              language_code: video1.videoStreams.nodes[0].languageCode,
            },
          ],
        },
      ],
      validation: [
        {
          context: 'VIDEO',
          message: `Trailer video with id 'missing-id' no longer exists.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Main video with matching gql video and different type tag returned -> valid meta with warning', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video 1',
      outputFormat: 'DASH_HLS',
      isProtected: true,
      videosTags: { nodes: [{ name: 'Trailer' }] },
      encodingState: 'READY',
      previewStatus: 'APPROVED',
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            initialFile: 'video-H264-240-300k.m3u8',
            format: 'HLS',
            bandwidthInBps: 400000,
            label: 'HD',
          },
        ],
      },
    };
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, videoId1, []);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'MAIN',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          duration: undefined,
          video_streams: [
            {
              drm_key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              initial_file: video1.videoStreams.nodes[0].initialFile,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bandwidth_in_bps: video1.videoStreams.nodes[0].bandwidthInBps,
              language_code: video1.videoStreams.nodes[0].languageCode,
            },
          ],
        },
      ],
      validation: [
        {
          context: 'VIDEO',
          message: `Possible video type mismatch! Video with type tag 'TRAILER' is assigned as Main video.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Trailer video with matching gql video and different type tag returned -> valid meta with warning', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video 1',
      outputFormat: 'DASH_HLS',
      isProtected: true,
      videosTags: { nodes: [{ name: 'MAIN' }] },
      encodingState: 'READY',
      previewStatus: 'APPROVED',
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            initialFile: 'video-H264-240-300k.m3u8',
            format: 'HLS',
            bandwidthInBps: 400000,
            label: 'HD',
          },
        ],
      },
    };
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, null, [
      { video_id: videoId1, movie_id: 2 },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'TRAILER',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          duration: undefined,
          video_streams: [
            {
              drm_key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              initial_file: video1.videoStreams.nodes[0].initialFile,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bandwidth_in_bps: video1.videoStreams.nodes[0].bandwidthInBps,
              language_code: video1.videoStreams.nodes[0].languageCode,
            },
          ],
        },
      ],
      validation: [
        {
          context: 'VIDEO',
          message: `Possible video type mismatch! Video with type tag 'MAIN' is assigned as Trailer video.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Trailer video with matching gql video and both type tags returned -> valid meta with warning', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video 1',
      outputFormat: 'DASH_HLS',
      isProtected: true,
      videosTags: { nodes: [{ name: 'MAIN' }, { name: 'Trailer' }] },
      encodingState: 'READY',
      previewStatus: 'APPROVED',
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            initialFile: 'video-H264-240-300k.m3u8',
            format: 'HLS',
            bandwidthInBps: 400000,
            label: 'HD',
          },
        ],
      },
    };
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, null, [
      { video_id: videoId1, movie_id: 2 },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'TRAILER',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          duration: undefined,
          video_streams: [
            {
              drm_key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              initial_file: video1.videoStreams.nodes[0].initialFile,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bandwidth_in_bps: video1.videoStreams.nodes[0].bandwidthInBps,
              language_code: video1.videoStreams.nodes[0].languageCode,
            },
          ],
        },
      ],
      validation: [
        {
          context: 'VIDEO',
          message: `Possible video type mismatch! Video with type tag 'MAIN' is assigned as Trailer video.`,
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Main video with matching gql video and not in ready encoding state -> valid meta with error', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video 1',
      outputFormat: 'DASH_HLS',
      isProtected: true,
      videosTags: { nodes: [{ name: 'MAIN' }] },
      encodingState: 'ENCODING',
      previewStatus: 'APPROVED',
      videoStreams: {
        nodes: [],
      },
    };
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, videoId1, []);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'MAIN',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          duration: undefined,
          video_streams: undefined,
        },
      ],
      validation: [
        {
          context: 'VIDEO',
          message: 'Main video has not finished encoding.',
          severity: 'ERROR',
        },
      ],
    });
  });

  it('Trailer video with matching gql video and not in ready encoding state -> valid meta with error', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video 1',
      outputFormat: 'DASH_HLS',
      isProtected: true,
      videosTags: { nodes: [{ name: 'TRAILER' }] },
      encodingState: 'WAITING',
      previewStatus: 'APPROVED',
      videoStreams: {
        nodes: [],
      },
    };
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, null, [
      { video_id: videoId1, movie_id: 2 },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'TRAILER',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          duration: undefined,
          video_streams: undefined,
        },
      ],
      validation: [
        {
          context: 'VIDEO',
          message: 'Trailer video has not finished encoding.',
          severity: 'ERROR',
        },
      ],
    });
  });

  it('Main video with matching gql video that has not been approved -> valid meta with error', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video 1',
      outputFormat: 'DASH_HLS',
      isProtected: true,
      videosTags: { nodes: [{ name: 'MAIN' }] },
      encodingState: 'READY',
      previewStatus: 'NOT_APPROVED',
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            initialFile: 'video-H264-240-300k.m3u8',
            format: 'HLS',
            bandwidthInBps: 400000,
            label: 'HD',
          },
        ],
      },
    };
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, videoId1, []);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'MAIN',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          duration: undefined,
          video_streams: [
            {
              drm_key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              initial_file: video1.videoStreams.nodes[0].initialFile,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bandwidth_in_bps: video1.videoStreams.nodes[0].bandwidthInBps,
              language_code: video1.videoStreams.nodes[0].languageCode,
            },
          ],
        },
      ],
      validation: [
        {
          context: 'VIDEO',
          message: 'Main video was not approved by Quality Assurance.',
          severity: 'ERROR',
        },
      ],
    });
  });

  it('Trailer video with matching gql video that has not been approved -> valid meta with warning', async () => {
    // Arrange
    const video1: GqlVideo = {
      id: videoId1,
      title: 'Test Video 1',
      outputFormat: 'DASH_HLS',
      isProtected: true,
      videosTags: { nodes: [{ name: 'TRAILER' }] },
      encodingState: 'READY',
      previewStatus: 'NOT_PREVIEWED',
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            initialFile: 'video-H264-240-300k.m3u8',
            format: 'HLS',
            bandwidthInBps: 400000,
            label: 'HD',
          },
        ],
      },
    };
    result = () => {
      return createApiObject([video1]);
    };

    // Act
    const meta = await getVideosMetadata(endpoint, authToken, null, [
      { video_id: videoId1, movie_id: 2 },
    ]);

    // Assert
    expect(meta).toEqual({
      result: [
        {
          type: 'TRAILER',
          title: video1.title,
          is_protected: video1.isProtected,
          output_format: video1.outputFormat,
          audio_languages: undefined,
          subtitle_languages: undefined,
          caption_languages: undefined,
          dash_manifest: undefined,
          hls_manifest: undefined,
          duration: undefined,
          video_streams: [
            {
              drm_key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              initial_file: video1.videoStreams.nodes[0].initialFile,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bandwidth_in_bps: video1.videoStreams.nodes[0].bandwidthInBps,
              language_code: video1.videoStreams.nodes[0].languageCode,
            },
          ],
        },
      ],
      validation: [
        {
          context: 'VIDEO',
          message: 'Trailer video was not approved by Quality Assurance.',
          severity: 'WARNING',
        },
      ],
    });
  });

  it('Error thrown because video service is not available -> error re-thrown to support message retries', async () => {
    // Arrange
    const errorMessage = 'connect ECONNREFUSED 127.0.0.1:10400';
    result = () => {
      throw new Error(errorMessage);
    };

    // Act
    const error = await rejectionOf(
      getVideosMetadata(endpoint, authToken, null, [
        { video_id: videoId1, season_id: 1 },
      ]),
    );

    // Assert
    expect(error.message).toBe('Unable to retrieve videos metadata.');
    expect(error.stack).toContain(errorMessage);
    expect(error.details).toEqual({ errors: undefined });
  });

  it('Error thrown by video service because api changed -> error with details is re-thrown to support message retries', async () => {
    // Arrange
    const errors = [
      {
        timestamp: '2021-05-25T06:23:00.923Z',
        message: 'Cannot query field "obsolete_field" on type "Video".',
        code: 'GRAPHQL_VALIDATION_FAILED',
      },
    ];
    result = () => {
      const error = new Error('Bad Request');
      (error as any).response = { data: { errors } };
      throw error;
    };

    // Act
    const error = await rejectionOf(
      getVideosMetadata(endpoint, authToken, null, [
        { video_id: videoId1, season_id: 1 },
      ]),
    );

    // Assert
    expect(error.message).toBe('Unable to retrieve videos metadata.');
    expect(error.details.errors).toMatchObject(errors);
  });

  it('Error not thrown, but errors array returned with null videos -> error with details is re-thrown to support message retries', async () => {
    // Arrange
    const errors = [
      {
        timestamp: '2021-05-25T06:23:00.923Z',
        message: 'Access token verification failed',
        code: 'ACCESS_TOKEN_VERIFICATION_FAILED',
      },
    ];
    result = () => {
      return { data: { data: { videos: null }, errors } };
    };

    // Act
    const error = await rejectionOf(
      getVideosMetadata(endpoint, authToken, null, [
        { video_id: videoId1, movie_id: 2 },
      ]),
    );

    // Assert
    expect(error.message).toBe('Unable to retrieve videos metadata.');
    expect(error.details.errors).toMatchObject(errors);
  });
});
