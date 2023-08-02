import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { CommonErrors } from '../../../common';
import * as video from '../../../generated/graphql/video';
import {
  EncodingState,
  OutputFormat,
  PreviewStatus,
  VideoStreamType,
} from '../../../generated/graphql/video';
import { getVideosMetadata, GqlVideo } from './get-videos-metadata';

let result: any = () => undefined;
jest.spyOn(video, 'getSdk').mockImplementation(() => ({
  GetVideos: () => result(),
}));

describe('getVideosMetadata', () => {
  const videoId1 = 'valid-uuid-but-does-not-matter-here';
  const videoId2 = 'valid-uuid-but-does-not-matter-here-2';
  const endpoint = 'does-not-matter-as-request-is-mocked';
  const authToken = 'does-not-matter-as-request-is-mocked';
  const createApiObject = (nodes: GqlVideo[]) => {
    return { data: { videos: { nodes } } };
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
      isProtected: true,
      outputFormat: OutputFormat.Dash,
      encodingState: EncodingState.Ready,
      previewStatus: PreviewStatus.Approved,
      lengthInSeconds: 123,
      audioLanguages: ['EN', 'de'],
      subtitleLanguages: ['en', 'de', 'ru'],
      captionLanguages: ['en', 'de', 'jp'],
      hlsManifestPath: 'some/path/manifest.mpd',
      dashManifestPath: 'some/other/path/manifest.mpd',
      videosTags: { nodes: [{ name: 'RandomTag' }] },
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            bitrateInKbps: 3000,
            codecs: 'H264',
            displayAspectRatio: '16:9',
            file: 'hls/video-H264-1080-3000k.m3u8',
            fileTemplate: 'hls/video-H264-1080-3000k_$Number$.ts',
            frameRate: 60,
            height: 1080,
            label: 'HD',
            languageCode: null,
            languageName: null,
            pixelAspectRatio: '1:1',
            samplingRate: null,
            width: 1920,
            format: OutputFormat.Hls,
            type: VideoStreamType.Video,
          },
          {
            keyId: 'key-1',
            iv: 'iv',
            bitrateInKbps: 128,
            codecs: 'AAC',
            displayAspectRatio: null,
            file: 'hls/audio-en.m3u8',
            fileTemplate: 'hls/audio-en_$Number$.ts',
            frameRate: null,
            height: null,
            label: 'audio',
            languageCode: 'en',
            languageName: 'English',
            pixelAspectRatio: null,
            samplingRate: 48000,
            width: null,
            format: OutputFormat.Hls,
            type: VideoStreamType.Audio,
          },
          {
            iv: null,
            keyId: null,
            bitrateInKbps: 0,
            codecs: null,
            displayAspectRatio: null,
            file: 'hls/subtitle-de.m3u8',
            fileTemplate: 'hls/subtitle-de_$Number$.vtt',
            frameRate: null,
            height: null,
            label: 'subtitle',
            languageCode: 'de',
            languageName: 'German',
            pixelAspectRatio: null,
            samplingRate: null,
            width: null,
            format: OutputFormat.Hls,
            type: VideoStreamType.Subtitle,
          },
        ],
      },
      cuePoints: {
        nodes: [
          {
            timeInSeconds: 10,
            cuePointTypeKey: 'OUTRO_IN',
            value: '',
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
          length_in_seconds: video1.lengthInSeconds,
          video_streams: [
            {
              key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              file: video1.videoStreams.nodes[0].file,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bitrate_in_kbps: video1.videoStreams.nodes[0].bitrateInKbps,
              language_code: video1.videoStreams.nodes[0].languageCode,
              codecs: video1.videoStreams.nodes[0].codecs,
              display_aspect_ratio:
                video1.videoStreams.nodes[0].displayAspectRatio,
              file_template: video1.videoStreams.nodes[0].fileTemplate,
              frame_rate: video1.videoStreams.nodes[0].frameRate,
              height: video1.videoStreams.nodes[0].height,
              language_name: video1.videoStreams.nodes[0].languageName,
              pixel_aspect_ratio: video1.videoStreams.nodes[0].pixelAspectRatio,
              sampling_rate: video1.videoStreams.nodes[0].samplingRate,
              type: video1.videoStreams.nodes[0].type,
              width: video1.videoStreams.nodes[0].width,
            },
            {
              key_id: video1.videoStreams.nodes[1].keyId,
              iv: video1.videoStreams.nodes[1].iv,
              file: video1.videoStreams.nodes[1].file,
              format: video1.videoStreams.nodes[1].format,
              label: video1.videoStreams.nodes[1].label,
              bitrate_in_kbps: video1.videoStreams.nodes[1].bitrateInKbps,
              language_code: video1.videoStreams.nodes[1].languageCode,
              codecs: video1.videoStreams.nodes[1].codecs,
              display_aspect_ratio:
                video1.videoStreams.nodes[1].displayAspectRatio,
              file_template: video1.videoStreams.nodes[1].fileTemplate,
              frame_rate: video1.videoStreams.nodes[1].frameRate,
              height: video1.videoStreams.nodes[1].height,
              language_name: video1.videoStreams.nodes[1].languageName,
              pixel_aspect_ratio: video1.videoStreams.nodes[1].pixelAspectRatio,
              sampling_rate: video1.videoStreams.nodes[1].samplingRate,
              type: video1.videoStreams.nodes[1].type,
              width: video1.videoStreams.nodes[1].width,
            },
            {
              key_id: video1.videoStreams.nodes[2].keyId,
              iv: video1.videoStreams.nodes[2].iv,
              file: video1.videoStreams.nodes[2].file,
              format: video1.videoStreams.nodes[2].format,
              label: video1.videoStreams.nodes[2].label,
              bitrate_in_kbps: video1.videoStreams.nodes[2].bitrateInKbps,
              language_code: video1.videoStreams.nodes[2].languageCode,
              codecs: video1.videoStreams.nodes[2].codecs,
              display_aspect_ratio:
                video1.videoStreams.nodes[2].displayAspectRatio,
              file_template: video1.videoStreams.nodes[2].fileTemplate,
              frame_rate: video1.videoStreams.nodes[2].frameRate,
              height: video1.videoStreams.nodes[2].height,
              language_name: video1.videoStreams.nodes[2].languageName,
              pixel_aspect_ratio: video1.videoStreams.nodes[2].pixelAspectRatio,
              sampling_rate: video1.videoStreams.nodes[2].samplingRate,
              type: video1.videoStreams.nodes[2].type,
              width: video1.videoStreams.nodes[2].width,
            },
          ],
          cue_points: [
            {
              time_in_seconds: 10,
              cue_point_type_key: 'OUTRO_IN',
              value: '',
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
      outputFormat: OutputFormat.DashHls,
      encodingState: EncodingState.Ready,
      previewStatus: PreviewStatus.Approved,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: true,
      videosTags: { nodes: [] },
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            file: 'video-H264-240-300k.m3u8',
            bitrateInKbps: 400000,
            label: 'HD',
            format: OutputFormat.Hls,
            type: VideoStreamType.Video,
          },
        ],
      },
      cuePoints: {
        nodes: [
          {
            timeInSeconds: 10,
            cuePointTypeKey: 'OUTRO_IN',
            value: '',
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
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          length_in_seconds: undefined,
          video_streams: [
            {
              key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              file: video1.videoStreams.nodes[0].file,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bitrate_in_kbps: video1.videoStreams.nodes[0].bitrateInKbps,
              language_code: video1.videoStreams.nodes[0].languageCode,
              type: video1.videoStreams.nodes[0].type,
              codecs: undefined,
              display_aspect_ratio: undefined,
              file_template: undefined,
              frame_rate: undefined,
              height: undefined,
              language_name: undefined,
              pixel_aspect_ratio: undefined,
              sampling_rate: undefined,
              width: undefined,
            },
          ],
          cue_points: [
            {
              time_in_seconds: 10,
              cue_point_type_key: 'OUTRO_IN',
              value: '',
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
      outputFormat: OutputFormat.DashHls,
      encodingState: EncodingState.Ready,
      previewStatus: PreviewStatus.Approved,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: true,
      videosTags: { nodes: [{ name: 'trailer' }] },
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            file: 'video-H264-240-300k.m3u8',
            bitrateInKbps: 400000,
            label: 'HD',
            format: OutputFormat.Hls,
            type: VideoStreamType.Video,
          },
        ],
      },
      cuePoints: {
        nodes: [
          {
            timeInSeconds: 10,
            cuePointTypeKey: 'OUTRO_IN',
            value: '',
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
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          length_in_seconds: undefined,
          video_streams: [
            {
              key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              file: video1.videoStreams.nodes[0].file,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bitrate_in_kbps: video1.videoStreams.nodes[0].bitrateInKbps,
              language_code: video1.videoStreams.nodes[0].languageCode,
              type: video1.videoStreams.nodes[0].type,
              codecs: undefined,
              display_aspect_ratio: undefined,
              file_template: undefined,
              frame_rate: undefined,
              height: undefined,
              language_name: undefined,
              pixel_aspect_ratio: undefined,
              sampling_rate: undefined,
              width: undefined,
            },
          ],
          cue_points: [
            {
              time_in_seconds: 10,
              cue_point_type_key: 'OUTRO_IN',
              value: '',
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
      outputFormat: OutputFormat.DashHls,
      encodingState: EncodingState.Ready,
      previewStatus: PreviewStatus.Approved,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: true,
      videosTags: { nodes: [{ name: 'MAIN' }] },
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            file: 'video-H264-240-300k.m3u8',
            bitrateInKbps: 400000,
            label: 'HD',
            format: OutputFormat.Hls,
            type: VideoStreamType.Video,
          },
        ],
      },
      cuePoints: {
        nodes: [
          {
            timeInSeconds: 10,
            cuePointTypeKey: 'OUTRO_IN',
            value: '',
          },
        ],
      },
    };
    const video2: GqlVideo = {
      id: videoId2,
      title: 'Test Video 2',
      outputFormat: OutputFormat.Cmaf,
      encodingState: EncodingState.Ready,
      previewStatus: PreviewStatus.Approved,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: false,
      videosTags: { nodes: [{ name: 'trailer' }] },
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            file: 'video-H264-240-300k.m3u8',
            bitrateInKbps: 400000,
            label: 'HD',
            format: OutputFormat.Hls,
            type: VideoStreamType.Video,
          },
        ],
      },
      cuePoints: {
        nodes: [
          {
            timeInSeconds: 10,
            cuePointTypeKey: 'OUTRO_IN',
            value: '',
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
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          key_ids: undefined,
          length_in_seconds: undefined,
          video_streams: [
            {
              key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              file: video1.videoStreams.nodes[0].file,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bitrate_in_kbps: video1.videoStreams.nodes[0].bitrateInKbps,
              language_code: video1.videoStreams.nodes[0].languageCode,
              type: video1.videoStreams.nodes[0].type,
              codecs: undefined,
              display_aspect_ratio: undefined,
              file_template: undefined,
              frame_rate: undefined,
              height: undefined,
              language_name: undefined,
              pixel_aspect_ratio: undefined,
              sampling_rate: undefined,
              width: undefined,
            },
          ],
          cue_points: [
            {
              time_in_seconds: 10,
              cue_point_type_key: 'OUTRO_IN',
              value: '',
            },
          ],
        },
        {
          type: 'TRAILER',
          title: video2.title,
          is_protected: video2.isProtected,
          output_format: video2.outputFormat,
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          length_in_seconds: undefined,
          video_streams: [
            {
              key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              file: video1.videoStreams.nodes[0].file,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bitrate_in_kbps: video1.videoStreams.nodes[0].bitrateInKbps,
              language_code: video1.videoStreams.nodes[0].languageCode,
              type: video1.videoStreams.nodes[0].type,
              codecs: undefined,
              display_aspect_ratio: undefined,
              file_template: undefined,
              frame_rate: undefined,
              height: undefined,
              language_name: undefined,
              pixel_aspect_ratio: undefined,
              sampling_rate: undefined,
              width: undefined,
            },
          ],
          cue_points: [
            {
              time_in_seconds: 10,
              cue_point_type_key: 'OUTRO_IN',
              value: '',
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
      outputFormat: OutputFormat.DashHls,
      encodingState: EncodingState.Ready,
      previewStatus: PreviewStatus.Approved,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: true,
      videosTags: { nodes: [{ name: 'Trailer' }] },
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            file: 'video-H264-240-300k.m3u8',
            bitrateInKbps: 400000,
            label: 'HD',
            format: OutputFormat.Hls,
            type: VideoStreamType.Video,
          },
        ],
      },
      cuePoints: {
        nodes: [
          {
            timeInSeconds: 10,
            cuePointTypeKey: 'OUTRO_IN',
            value: '',
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
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          length_in_seconds: undefined,
          video_streams: [
            {
              key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              file: video1.videoStreams.nodes[0].file,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bitrate_in_kbps: video1.videoStreams.nodes[0].bitrateInKbps,
              language_code: video1.videoStreams.nodes[0].languageCode,
              type: video1.videoStreams.nodes[0].type,
              codecs: undefined,
              display_aspect_ratio: undefined,
              file_template: undefined,
              frame_rate: undefined,
              height: undefined,
              language_name: undefined,
              pixel_aspect_ratio: undefined,
              sampling_rate: undefined,
              width: undefined,
            },
          ],
          cue_points: [
            {
              time_in_seconds: 10,
              cue_point_type_key: 'OUTRO_IN',
              value: '',
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
      outputFormat: OutputFormat.DashHls,
      encodingState: EncodingState.Ready,
      previewStatus: PreviewStatus.Approved,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: true,
      videosTags: { nodes: [{ name: 'MAIN' }] },
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            file: 'video-H264-240-300k.m3u8',
            bitrateInKbps: 400000,
            label: 'HD',
            format: OutputFormat.Hls,
            type: VideoStreamType.Video,
          },
        ],
      },
      cuePoints: {
        nodes: [
          {
            timeInSeconds: 10,
            cuePointTypeKey: 'OUTRO_IN',
            value: '',
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
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          length_in_seconds: undefined,
          video_streams: [
            {
              key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              file: video1.videoStreams.nodes[0].file,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bitrate_in_kbps: video1.videoStreams.nodes[0].bitrateInKbps,
              language_code: video1.videoStreams.nodes[0].languageCode,
              type: video1.videoStreams.nodes[0].type,
              codecs: undefined,
              display_aspect_ratio: undefined,
              file_template: undefined,
              frame_rate: undefined,
              height: undefined,
              language_name: undefined,
              pixel_aspect_ratio: undefined,
              sampling_rate: undefined,
              width: undefined,
            },
          ],
          cue_points: [
            {
              time_in_seconds: 10,
              cue_point_type_key: 'OUTRO_IN',
              value: '',
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
      outputFormat: OutputFormat.DashHls,
      encodingState: EncodingState.Ready,
      previewStatus: PreviewStatus.Approved,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: true,
      videosTags: { nodes: [{ name: 'MAIN' }, { name: 'Trailer' }] },
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            file: 'video-H264-240-300k.m3u8',
            bitrateInKbps: 400000,
            label: 'HD',
            format: OutputFormat.Hls,
            type: VideoStreamType.Video,
          },
        ],
      },
      cuePoints: {
        nodes: [
          {
            timeInSeconds: 10,
            cuePointTypeKey: 'OUTRO_IN',
            value: '',
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
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          length_in_seconds: undefined,
          video_streams: [
            {
              key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              file: video1.videoStreams.nodes[0].file,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bitrate_in_kbps: video1.videoStreams.nodes[0].bitrateInKbps,
              language_code: video1.videoStreams.nodes[0].languageCode,
              type: video1.videoStreams.nodes[0].type,
              codecs: undefined,
              display_aspect_ratio: undefined,
              file_template: undefined,
              frame_rate: undefined,
              height: undefined,
              language_name: undefined,
              pixel_aspect_ratio: undefined,
              sampling_rate: undefined,
              width: undefined,
            },
          ],
          cue_points: [
            {
              time_in_seconds: 10,
              cue_point_type_key: 'OUTRO_IN',
              value: '',
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
      outputFormat: OutputFormat.DashHls,
      encodingState: EncodingState.InProgress,
      previewStatus: PreviewStatus.Approved,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: true,
      videosTags: { nodes: [{ name: 'MAIN' }] },
      videoStreams: {
        nodes: [],
      },
      cuePoints: {
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
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          length_in_seconds: undefined,
          video_streams: [],
          cue_points: [],
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
      outputFormat: OutputFormat.DashHls,
      encodingState: EncodingState.Waiting,
      previewStatus: PreviewStatus.Approved,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: true,
      videosTags: { nodes: [{ name: 'TRAILER' }] },
      videoStreams: {
        nodes: [],
      },
      cuePoints: {
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
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          length_in_seconds: undefined,
          video_streams: [],
          cue_points: [],
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
      outputFormat: OutputFormat.DashHls,
      encodingState: EncodingState.Ready,
      previewStatus: PreviewStatus.NotApproved,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: true,
      videosTags: { nodes: [{ name: 'MAIN' }] },
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            file: 'video-H264-240-300k.m3u8',
            bitrateInKbps: 400000,
            label: 'HD',
            format: OutputFormat.Hls,
            type: VideoStreamType.Video,
          },
        ],
      },
      cuePoints: {
        nodes: [
          {
            timeInSeconds: 10,
            cuePointTypeKey: 'OUTRO_IN',
            value: '',
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
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          length_in_seconds: undefined,
          video_streams: [
            {
              key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              file: video1.videoStreams.nodes[0].file,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bitrate_in_kbps: video1.videoStreams.nodes[0].bitrateInKbps,
              language_code: video1.videoStreams.nodes[0].languageCode,
              type: video1.videoStreams.nodes[0].type,
              codecs: undefined,
              display_aspect_ratio: undefined,
              file_template: undefined,
              frame_rate: undefined,
              height: undefined,
              language_name: undefined,
              pixel_aspect_ratio: undefined,
              sampling_rate: undefined,
              width: undefined,
            },
          ],
          cue_points: [
            {
              time_in_seconds: 10,
              cue_point_type_key: 'OUTRO_IN',
              value: '',
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
      outputFormat: OutputFormat.DashHls,
      encodingState: EncodingState.Ready,
      previewStatus: PreviewStatus.NotPreviewed,
      audioLanguages: [],
      subtitleLanguages: [],
      captionLanguages: [],
      isProtected: true,
      videosTags: { nodes: [{ name: 'TRAILER' }] },
      videoStreams: {
        nodes: [
          {
            keyId: 'key-1',
            iv: 'iv',
            file: 'video-H264-240-300k.m3u8',
            bitrateInKbps: 400000,
            label: 'HD',
            format: OutputFormat.Hls,
            type: VideoStreamType.Video,
          },
        ],
      },
      cuePoints: {
        nodes: [
          {
            timeInSeconds: 10,
            cuePointTypeKey: 'OUTRO_IN',
            value: '',
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
          audio_languages: [],
          subtitle_languages: [],
          caption_languages: [],
          dash_manifest: undefined,
          hls_manifest: undefined,
          length_in_seconds: undefined,
          video_streams: [
            {
              key_id: video1.videoStreams.nodes[0].keyId,
              iv: video1.videoStreams.nodes[0].iv,
              file: video1.videoStreams.nodes[0].file,
              format: video1.videoStreams.nodes[0].format,
              label: video1.videoStreams.nodes[0].label,
              bitrate_in_kbps: video1.videoStreams.nodes[0].bitrateInKbps,
              language_code: video1.videoStreams.nodes[0].languageCode,
              type: video1.videoStreams.nodes[0].type,
              codecs: undefined,
              display_aspect_ratio: undefined,
              file_template: undefined,
              frame_rate: undefined,
              height: undefined,
              language_name: undefined,
              pixel_aspect_ratio: undefined,
              sampling_rate: undefined,
              width: undefined,
            },
          ],
          cue_points: [
            {
              time_in_seconds: 10,
              cue_point_type_key: 'OUTRO_IN',
              value: '',
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
    expect(error).toMatchObject(CommonErrors.PublishVideosMetadataRequestError);
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
        path: ['videos'],
      },
    ];
    result = () => {
      const error = new Error('Bad Request');
      (error as any).response = { data: { videos: null }, errors };
      throw error;
    };

    // Act
    const error = await rejectionOf(
      getVideosMetadata(endpoint, authToken, null, [
        { video_id: videoId1, season_id: 1 },
      ]),
    );

    // Assert
    expect(error).toMatchObject(CommonErrors.PublishVideosMetadataRequestError);
    expect(error.details.errors).toMatchObject(errors);
  });

  // This case is probably impossible with the current implementation, but
  // typing of returned API response suggests there is a possibility
  it('Error not thrown, but no videos returned -> error is thrown', async () => {
    // Arrange
    result = () => {
      return { data: { videos: null } };
    };

    // Act
    const error = await rejectionOf(
      getVideosMetadata(endpoint, authToken, null, [
        { video_id: videoId1, movie_id: 2 },
      ]),
    );

    // Assert
    expect(error).toMatchObject(CommonErrors.PublishVideosMetadataRequestError);
    expect(error.details).toBeFalsy();
  });
});
