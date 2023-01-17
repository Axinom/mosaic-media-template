import { CuePointSchedule, DetailedVideo } from '@axinom/mosaic-messages';
import { URL } from 'url';
import {
  createEventStream,
  createParallel,
  createReference,
  transformSecondsToWallClock,
} from '../models';
import {
  createAdPlaceholders,
  createPlaylistEventStream,
  videoToSmilParallelReferences,
} from './utils';

describe('smil-utils', () => {
  describe('createPlaylistEventStream', () => {
    it('getting out of network -> changes indicator to 1 and increases splice id', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 0; //in network
      const newOutOfNetworkIndicator = 1; //jump out of network
      const previousSpliceId = 0;
      const eventDuration = 60; // duration of the event 60 sec
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
        eventDuration,
      );
      // Assert
      expect(result.eventStream).not.toBeUndefined();
      expect(result.eventStream).toMatchObject(
        createEventStream(
          newOutOfNetworkIndicator,
          eventDuration,
          `${previousSpliceId + 1}`,
        ),
      );
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId + 1);
    });
    it('getting in to network -> changes indicator to 0 and does not increases splice id', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 1; //out of network
      const newOutOfNetworkIndicator = 0; //jump into network
      const previousSpliceId = 0;
      const eventDuration = 0;
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
        eventDuration,
      );
      // Assert
      expect(result.eventStream).not.toBeUndefined();
      expect(result.eventStream).toMatchObject(
        createEventStream(
          newOutOfNetworkIndicator,
          eventDuration,
          `${previousSpliceId}`,
        ),
      );
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId);
    });
    it('staying in network -> does not generate event stream', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 0; //in network
      const newOutOfNetworkIndicator = 0; //staying in network
      const previousSpliceId = 0;
      const eventDuration = 300;
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
        eventDuration,
      );
      // Assert
      expect(result.eventStream).toBeUndefined();
      expect(result.outOfNetworkIndicator).toEqual(newOutOfNetworkIndicator);
      expect(result.spliceEventId).toEqual(previousSpliceId);
    });
    it('staying out of network -> does not generate event stream', () => {
      // Arrange
      const previousOutOfNetworkIndicator = 1; // out of network
      const newOutOfNetworkIndicator = 1; //staying out of network
      const previousSpliceId = 0;
      const eventDuration = 100;
      // Act
      const result = createPlaylistEventStream(
        newOutOfNetworkIndicator,
        previousOutOfNetworkIndicator,
        previousSpliceId,
        eventDuration,
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
        createEventStream(1, schedule.duration_in_seconds, `1`),
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
        clipEndOfLastParallel: transformSecondsToWallClock(),
      },
      {
        adPodDuration: 20,
        expectedParallels: 2,
        clipEndOfLastParallel: transformSecondsToWallClock(),
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
          createEventStream(1, schedule.duration_in_seconds, `1`),
        );
        // Assert
        expect(result).toHaveLength(expectedParallels);

        // first parallel has event stream object
        const firstParallel = result.shift();
        expect(firstParallel?.EventStream).not.toBeUndefined();

        // last parallel has `clipEnd` timing, if required
        const lastParallel = result.pop();
        expect(lastParallel?.['@clipEnd']).toEqual(clipEndOfLastParallel);

        // all parallels, except last one do not have @clipEnd and @clipBegin set
        result.forEach((parallel) => {
          expect(parallel).toMatchObject({
            '@clipEnd': undefined,
            '@clipBegin': undefined,
          });
        });
      },
    );
  });

  describe('videoToSmilParallelReferences', () => {
    const createValidDetailedVideo = (): DetailedVideo => {
      return {
        id: '3a8e5dc9-5c91-4d61-bf95-c4e719b705f2',
        is_archived: false,
        source_file_extension: '.mp4',
        source_file_name: '1min_loop_mosaic',
        source_full_file_name: '1min_loop_mosaic.mp4',
        source_location: 'vod2live-ad-placeholder',
        source_size_in_bytes: 80788234,
        title: 'Mosaic Placeholder Video (with logo)',
        video_encoding: {
          audio_languages: ['en'],
          caption_languages: [],
          cmaf_size_in_bytes: 128070139,
          dash_manifest_path:
            'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/cmaf/manifest.mpd',
          dash_size_in_bytes: null,
          length_in_seconds: 62,
          encoding_state: 'READY',
          finished_date: '2022-11-25T12:26:41.396001+00:00',
          hls_manifest_path:
            'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/cmaf/manifest.m3u8',
          hls_size_in_bytes: null,
          is_protected: false,
          output_format: 'CMAF',
          output_location: '8EPGt6rB2D4oJbJqb1tw3o',
          preview_comment: null,
          preview_status: 'NOT_PREVIEWED',
          subtitle_languages: [],
          title: 'Mosaic Placeholder Video (with logo)',
          video_streams: [
            {
              bitrate_in_kbps: 2100,
              codecs: 'H264',
              display_aspect_ratio: '16:9',
              file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
              file_template: null,
              format: 'CMAF',
              frame_rate: 30,
              height: 720,
              iv: null,
              key_id: null,
              label: 'HD',
              language_code: null,
              language_name: null,
              pixel_aspect_ratio: '1:1',
              sampling_rate: null,
              type: 'VIDEO',
              width: 1280,
            },
            {
              bitrate_in_kbps: 400,
              codecs: 'H264',
              display_aspect_ratio: '16:9',
              file: 'cmaf/video-H264-288-400k-video-avc1.mp4',
              file_template: null,
              format: 'CMAF',
              frame_rate: 30,
              height: 288,
              iv: null,
              key_id: null,
              label: 'SD',
              language_code: null,
              language_name: null,
              pixel_aspect_ratio: '1:1',
              sampling_rate: null,
              type: 'VIDEO',
              width: 512,
            },
            {
              bitrate_in_kbps: 3000,
              codecs: 'H264',
              display_aspect_ratio: '16:9',
              file: 'cmaf/video-H264-1080-3000k-video-avc1.mp4',
              file_template: null,
              format: 'CMAF',
              frame_rate: 30,
              height: 1080,
              iv: null,
              key_id: null,
              label: 'HD',
              language_code: null,
              language_name: null,
              pixel_aspect_ratio: '1:1',
              sampling_rate: null,
              type: 'VIDEO',
              width: 1920,
            },
            {
              bitrate_in_kbps: 300,
              codecs: 'H264',
              display_aspect_ratio: '16:9',
              file: 'cmaf/video-H264-216-300k-video-avc1.mp4',
              file_template: null,
              format: 'CMAF',
              frame_rate: 30,
              height: 216,
              iv: null,
              key_id: null,
              label: 'SD',
              language_code: null,
              language_name: null,
              pixel_aspect_ratio: '1:1',
              sampling_rate: null,
              type: 'VIDEO',
              width: 384,
            },
            {
              bitrate_in_kbps: 128,
              codecs: 'AAC',
              display_aspect_ratio: null,
              file: 'cmaf/audio-en-audio-en-mp4a.mp4',
              file_template: null,
              format: 'CMAF',
              frame_rate: null,
              height: null,
              iv: null,
              key_id: null,
              label: 'audio',
              language_code: 'en',
              language_name: 'English',
              pixel_aspect_ratio: null,
              sampling_rate: 48000,
              type: 'AUDIO',
              width: null,
            },
            {
              bitrate_in_kbps: 6000,
              codecs: 'H264',
              display_aspect_ratio: '16:9',
              file: 'cmaf/video-H264-2160-6000k-video-avc1.mp4',
              file_template: null,
              format: 'CMAF',
              frame_rate: 30,
              height: 2160,
              iv: null,
              key_id: null,
              label: 'UHD1',
              language_code: null,
              language_name: null,
              pixel_aspect_ratio: '1:1',
              sampling_rate: null,
              type: 'VIDEO',
              width: 3840,
            },
            {
              bitrate_in_kbps: 1200,
              codecs: 'H264',
              display_aspect_ratio: '16:9',
              file: 'cmaf/video-H264-576-1200k-video-avc1.mp4',
              file_template: null,
              format: 'CMAF',
              frame_rate: 30,
              height: 576,
              iv: null,
              key_id: null,
              label: 'SD',
              language_code: null,
              language_name: null,
              pixel_aspect_ratio: '1:1',
              sampling_rate: null,
              type: 'VIDEO',
              width: 1024,
            },
            {
              bitrate_in_kbps: 4500,
              codecs: 'H264',
              display_aspect_ratio: '16:9',
              file: 'cmaf/video-H264-1440-4500k-video-avc1.mp4',
              file_template: null,
              format: 'CMAF',
              frame_rate: 30,
              height: 1440,
              iv: null,
              key_id: null,
              label: 'UHD1',
              language_code: null,
              language_name: null,
              pixel_aspect_ratio: '1:1',
              sampling_rate: null,
              type: 'VIDEO',
              width: 2560,
            },
            {
              bitrate_in_kbps: 800,
              codecs: 'H264',
              display_aspect_ratio: '16:9',
              file: 'cmaf/video-H264-360-800k-video-avc1.mp4',
              file_template: null,
              format: 'CMAF',
              frame_rate: 30,
              height: 360,
              iv: null,
              key_id: null,
              label: 'SD',
              language_code: null,
              language_name: null,
              pixel_aspect_ratio: '1:1',
              sampling_rate: null,
              type: 'VIDEO',
              width: 640,
            },
          ],
        },
        videos_tags: ['vod2live'],
      };
    };
    it('parallel references are generated', () => {
      // Arrange
      const testVideo = createValidDetailedVideo();
      // Act
      const result = videoToSmilParallelReferences(testVideo);
      // Assert
      expect(result).not.toBeNull();
      expect(result.audio).toHaveLength(
        testVideo.video_encoding.video_streams.filter((s) => s.type === 'AUDIO')
          .length,
      );
      expect(result.video).toHaveLength(
        testVideo.video_encoding.video_streams.filter((s) => s.type === 'VIDEO')
          .length,
      );
      const expectedReferences = testVideo.video_encoding.video_streams
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
    });
  });
});
