import { DetailedVideo } from '@axinom/mosaic-messages';
import { StreamParams } from 'src/domains';
import { v4 as uuid } from 'uuid';

export const getTestMutualStreamParams = (): StreamParams[] => {
  return [
    {
      width: 384,
      height: 216,
      bitrate_in_kbps: 300,
      frame_rate: 30,
    },
  ];
};
/**
 * Create an instance of Detailed Video for testing. Video instance contains one video stream and one audio stream.
 * @param isDrmProtected - is the video DRM protected, or not
 * @param id - id unique identifier, if not set - defaults to random UUID
 * @param duration - duration of the video in seconds, if not set - defaults to 60 sec
 * @returns
 */
export const createTestVideo = (
  isDrmProtected: boolean,
  id?: string,
  duration?: number,
): DetailedVideo => {
  id = id ?? uuid();
  duration = duration ?? 60;
  return {
    id: id,
    is_archived: false,
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
      length_in_seconds: duration,
      encoding_state: 'READY',
      finished_date: '2022-11-25T12:26:41.396001+00:00',
      hls_manifest_path:
        'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/cmaf/manifest.m3u8',
      hls_size_in_bytes: null,
      is_protected: isDrmProtected,
      output_format: 'CMAF',
      output_location: '8EPGt6rB2D4oJbJqb1tw3o',
      preview_comment: null,
      preview_status: 'NOT_PREVIEWED',
      subtitle_languages: [],
      title: `Test Video ${id}`,
      video_streams: [
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
          key_id: isDrmProtected ? uuid() : null,
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
          key_id: isDrmProtected ? uuid() : null,
          label: 'audio',
          language_code: 'en',
          language_name: 'English',
          pixel_aspect_ratio: null,
          sampling_rate: 48000,
          type: 'AUDIO',
          width: null,
        },
      ],
    },
    videos_tags: ['vod2live'],
  };
};
