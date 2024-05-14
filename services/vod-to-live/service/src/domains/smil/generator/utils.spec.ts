import { DetailedVideo, Stream } from '@axinom/mosaic-messages';
import { CuePointSchedule } from 'media-messages';
import { URL } from 'url';
import { v4 as uuid } from 'uuid';
import { createTestVideo, getTestMutualStreamParams } from '../../../tests';
import {
  createEventStream,
  createParallel,
  createReference,
  transformSecondsToWallClock,
} from '../models';
import {
  createAdPlaceholders,
  createPlaylistEventStream,
  extractSharedVideoStreamFormats,
  StreamParams,
  videoToSmilParallelReferences,
} from './utils';

describe('smil-utils', () => {
  describe('createPlaylistEventStream', () => {
    it('getting out of network -> changes indicator to 1 and increases splice id', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 0; // in network
      const newOutOfNetworkIndicator = 1; // jump out of network
      const previousSpliceId = 0;
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
      );
      // Assert
      expect(result.eventStream).not.toBeUndefined();
      expect(result.eventStream).toMatchObject(
        createEventStream(newOutOfNetworkIndicator, `${previousSpliceId + 1}`),
      );
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId + 1);
    });
    it('getting in to network -> changes indicator to 0 and does not increases splice id', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 1; // out of network
      const newOutOfNetworkIndicator = 0; // jump into network
      const previousSpliceId = 0;
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
      );
      // Assert
      expect(result.eventStream).not.toBeUndefined();
      expect(result.eventStream).toMatchObject(
        createEventStream(newOutOfNetworkIndicator, `${previousSpliceId}`),
      );
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId);
    });
    it('staying in network -> does not generate event stream', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 0; // in network
      const newOutOfNetworkIndicator = 0; // staying in network
      const previousSpliceId = 0;
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
      );
      // Assert
      expect(result.eventStream).toBeUndefined();
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId);
    });
    it('staying out of network -> does not generate event stream', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 1; // out of network
      const newOutOfNetworkIndicator = 1; // staying out of network
      const previousSpliceId = 0;
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
      );
      // Assert
      expect(result.eventStream).toBeUndefined();
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId);
    });
  });

  describe('createAdPlaceholders', () => {
    const PLACEHOLDER_VIDEO_LENGTH = 10;
    const PLACEHOLDER_PARALLEL = createParallel({
      audio: [createReference('test/path/to/placeholder/video_audio.mp4')],
      video: [createReference('test/path/to/placeholder/video.mp4')],
    });

    it('if `AD_POD` duration is less than placeholder length -> one parallel with clipEnd is created', () => {
      // Arrange
      const schedule: CuePointSchedule = {
        type: 'AD_POD',
        duration_in_seconds: 3,
        sort_index: 0,
        id: '1',
      };
      // Act
      const result = createAdPlaceholders(
        schedule,
        PLACEHOLDER_PARALLEL,
        PLACEHOLDER_VIDEO_LENGTH,
        createEventStream(1, `1`),
      );
      // Assert
      expect(result).toHaveLength(1);
      const parallel = result[0];
      expect(parallel['@clipEnd']).toEqual(transformSecondsToWallClock(3));
      expect(parallel.EventStream).not.toBeUndefined();
    });

    it.each([
      {
        adPodDuration: 10,
        expectedParallels: 1,
        clipEndOfLastParallel: transformSecondsToWallClock(10),
      },
      {
        adPodDuration: 20,
        expectedParallels: 2,
        clipEndOfLastParallel: transformSecondsToWallClock(10),
      },
      {
        adPodDuration: 53,
        expectedParallels: 6,
        clipEndOfLastParallel: transformSecondsToWallClock(3),
      },
      {
        adPodDuration: 157,
        expectedParallels: 16,
        clipEndOfLastParallel: transformSecondsToWallClock(7),
      },
    ])(
      'if `AD_POD` duration is bigger than placeholder length -> placeholder is looped to fill the schedule duration',
      ({ adPodDuration, expectedParallels, clipEndOfLastParallel }) => {
        // Arrange
        const schedule: CuePointSchedule = {
          type: 'AD_POD',
          duration_in_seconds: adPodDuration,
          sort_index: 0,
          id: '1',
        };
        // Act
        const result = createAdPlaceholders(
          schedule,
          PLACEHOLDER_PARALLEL,
          PLACEHOLDER_VIDEO_LENGTH,
          createEventStream(1, `1`),
        );
        // Assert
        expect(result).toHaveLength(expectedParallels);

        expect(result[0]?.EventStream).not.toBeUndefined();
        for (let i = 0; i < result.length; i++) {
          let expectedClipEnd = transformSecondsToWallClock(10);
          if (i + 1 === result.length) {
            expectedClipEnd = clipEndOfLastParallel;
          }
          expect(result[i]).toMatchObject({
            '@clipEnd': expectedClipEnd,
            '@clipBegin': undefined,
          });
        }
      },
    );
  });

  describe('videoToSmilParallelReferences', () => {
    it.each([true, false])(
      'parallel references are generated',
      (isDrmProtected: boolean) => {
        // Arrange
        const testVideo = createTestVideo(isDrmProtected);
        // Act
        const result = videoToSmilParallelReferences(
          testVideo,
          getTestMutualStreamParams(),
        );
        // Assert
        expect(result).not.toBeNull();
        const testAudios = testVideo.video_encoding.video_streams.filter(
          (s) => s.type === 'AUDIO',
        );
        expect(result.audio).toHaveLength(testAudios.length);
        const testVideos = testVideo.video_encoding.video_streams.filter(
          (s) => s.type === 'VIDEO',
        );
        expect(result.video).toHaveLength(testVideos.length);
        const expectedReferences = [...testAudios, ...testVideos]
          .map((s) =>
            new URL(
              s.file!,
              'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/',
            ).toString(),
          )
          .sort();
        const retrievedReferences = [
          ...result.audio.map((a) => a['@src']),
          ...result.video.map((a) => a['@src']),
        ].sort();

        expect(retrievedReferences).toMatchObject(expectedReferences);
      },
    );
  });

  describe('extractSharedVideoStreamFormats', () => {
    const createTestVideoStream = (streamParams: StreamParams): Stream => {
      return {
        ...streamParams,
        type: 'VIDEO',
        format: 'CMAF',
        label: 'video',
      };
    };
    const createTestVideo = (streamParams: StreamParams[]): DetailedVideo => {
      const id = uuid();
      return {
        id: id,
        is_archived: false,
        custom_id: null,
        source_file_extension: '.mp4',
        source_file_name: `source_${id}`,
        source_full_file_name: `source_${id}.mp4`,
        source_location: 'test',
        source_size_in_bytes: 80788234,
        title: `Test Video ${id}`,
        video_encoding: {
          audio_languages: ['en'],
          caption_languages: [],
          cmaf_size_in_bytes: 128070139,
          dash_manifest_path:
            'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/cmaf/manifest.mpd',
          dash_size_in_bytes: null,
          length_in_seconds: 1000,
          encoding_state: 'READY',
          finished_date: '2022-11-25T12:26:41.396001+00:00',
          hls_manifest_path:
            'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/cmaf/manifest.m3u8',
          hls_size_in_bytes: null,
          is_protected: true,
          output_format: 'CMAF',
          output_location: '8EPGt6rB2D4oJbJqb1tw3o',
          preview_comment: null,
          preview_status: 'NOT_PREVIEWED',
          subtitle_languages: [],
          title: `Test Video ${id}`,
          video_streams: streamParams.map((s) => createTestVideoStream(s)),
        },
        videos_tags: ['vod2live'],
      };
    };
    it('if no videos are passed-> returned empty array of streams', () => {
      // Arrange & Act
      const result = extractSharedVideoStreamFormats([]);
      // Assert
      expect(result).toHaveLength(0);
    });

    it('if one video is passed-> all video formats are returned', () => {
      // Arrange
      const streamParams = [
        {
          width: 512,
          height: 288,
          bitrate_in_kbps: 400,
          frame_rate: 60,
        },
        {
          width: 384,
          height: 216,
          bitrate_in_kbps: 300,
          frame_rate: 60,
        },
        {
          width: 1920,
          height: 1080,
          bitrate_in_kbps: 3000,
          frame_rate: 60,
        },
      ];
      const videos = [createTestVideo(streamParams)];
      // Act
      const result = extractSharedVideoStreamFormats(videos);

      // Assert
      expect(result).toHaveLength(3);
      expect(result).toMatchObject(streamParams);
    });

    it('if multiple videos with mutual formats are passed-> mutual formats are returned', () => {
      // Arrange
      const mutualFormat = {
        width: 384,
        height: 216,
        bitrate_in_kbps: 300,
        frame_rate: 60,
      };
      const videos = [
        createTestVideo([
          mutualFormat,
          {
            width: 1920,
            height: 1080,
            bitrate_in_kbps: 3000,
            frame_rate: 60,
          },
        ]),
        createTestVideo([mutualFormat]),
        createTestVideo([
          mutualFormat,
          {
            width: 512,
            height: 288,
            bitrate_in_kbps: 400,
            frame_rate: 60,
          },
        ]),
      ];
      // Act
      const result = extractSharedVideoStreamFormats(videos);

      // Assert
      expect(result).toHaveLength(1);
      expect(result).toMatchObject([mutualFormat]);
    });

    it('if multiple videos are  passed with no mutual formats -> empty array is returned', () => {
      // Arrange
      const videos = [
        createTestVideo([
          {
            width: 1920,
            height: 1080,
            bitrate_in_kbps: 3000,
            frame_rate: 60,
          },
        ]),
        createTestVideo([
          {
            width: 384,
            height: 216,
            bitrate_in_kbps: 300,
            frame_rate: 60,
          },
        ]),
        createTestVideo([
          {
            width: 512,
            height: 288,
            bitrate_in_kbps: 400,
            frame_rate: 60,
          },
        ]),
      ];
      // Act
      const result = extractSharedVideoStreamFormats(videos);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toMatchObject([]);
    });
  });
});
