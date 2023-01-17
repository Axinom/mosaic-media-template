import { ChannelPublishedEvent } from '@axinom/mosaic-messages';
import { createHeaderMetadata, HeaderMetadataNames } from '../models';
import { ChannelSmilGenerator } from './channel-smil-generator';
import { videoToSmilParallelReferences } from './utils';

describe('ChannelSmilGenerator', () => {
  const channelWithPlaceholderVideo: ChannelPublishedEvent = {
    description: null,
    id: 'adbff5f4-fc18-4f4d-818c-91f37ba131ee',
    images: [
      {
        height: 646,
        id: 'db561b84-1e78-4f4d-9a3f-446e34db40de',
        path: '/transform/0-0/U5uZEHhwrXGde33yxwVHx9.png',
        type: 'channel_logo',
        width: 860,
      },
    ],
    placeholder_video: {
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
    },
    title: 'Discovery++',
  };
  const channelWithoutPlaceholderVideo: ChannelPublishedEvent = {
    description: null,
    id: 'adbff5f4-fc18-4f4d-818c-91f37ba131ee',
    images: [
      {
        height: 646,
        id: 'db561b84-1e78-4f4d-9a3f-446e34db40de',
        path: '/transform/0-0/U5uZEHhwrXGde33yxwVHx9.png',
        type: 'channel_logo',
        width: 860,
      },
    ],
    title: 'Discovery++',
  };

  it('created SMIL object with channel placeholder video', () => {
    // Arrange
    const generator = new ChannelSmilGenerator();
    // Act
    const resultSmil = generator.generate(channelWithPlaceholderVideo);
    // Assert
    expect(resultSmil).not.toBeNull();
    const headerMetadata = resultSmil.smil.head.meta;
    expect(headerMetadata).toHaveLength(3);
    expect(headerMetadata).toMatchObject([
      createHeaderMetadata(HeaderMetadataNames.Vod2Live, true),
      { '@name': HeaderMetadataNames.Vod2LiveStartTime },
      createHeaderMetadata(
        HeaderMetadataNames.MosaicChannelId,
        channelWithPlaceholderVideo.id,
      ),
    ]);
    const parallels = resultSmil.smil.body.seq.par;
    expect(parallels).toHaveLength(1);
    expect(parallels).toMatchObject([
      videoToSmilParallelReferences(
        channelWithPlaceholderVideo.placeholder_video!,
      ),
    ]);
  });

  it('error is thrown if placeholder video is not defined', async () => {
    // Arrange
    const generator = new ChannelSmilGenerator();
    // Act & Assert
    expect(() => {
      generator.generate(channelWithoutPlaceholderVideo);
    }).toThrow(
      `Channel ${channelWithoutPlaceholderVideo.id} is missing placeholder video. Virtual Channel cannot be created.`,
    );
  });
});
