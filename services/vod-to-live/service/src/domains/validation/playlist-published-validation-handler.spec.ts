import {
  ChannelServiceMultiTenantMessagingSettings,
  OutputFormat,
  PlaylistPublishedEvent,
} from '@axinom/mosaic-messages';
import { WebhookRequestMessage } from '@axinom/mosaic-service-common';
import { v4 as uuid } from 'uuid';
import { ValidationErrors } from '../../common';
import { PlaylistPublishedValidationWebhookHandler } from './playlist-published-validation-handler';

describe('PlaylistPublishedValidationWebhookHandler', () => {
  const handler = new PlaylistPublishedValidationWebhookHandler();
  const createPlaylistEvent = (): PlaylistPublishedEvent => {
    return {
      channel_id: uuid(),
      start_date_time: '2022-12-01T00:00:00+00:00',
      end_date_time: '2022-12-01T00:17:00+00:00',
      id: uuid(),
    };
  };
  describe('canHandle', () => {
    it.each`
      messageType                                                                   | expectedResult
      ${ChannelServiceMultiTenantMessagingSettings.ChannelPublished.messageType}    | ${false}
      ${ChannelServiceMultiTenantMessagingSettings.ChannelUnpublished.messageType}  | ${false}
      ${ChannelServiceMultiTenantMessagingSettings.PlaylistPublished.messageType}   | ${true}
      ${ChannelServiceMultiTenantMessagingSettings.PlaylistUnpublished.messageType} | ${false}
    `(
      'for message type %messageType, result is %expectedResult',
      ({ messageType, expectedResult }) => {
        // Arrange
        const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
          payload: createPlaylistEvent(),
          message_type: messageType,
          message_id: uuid(),
          message_version: '1.0',
          timestamp: new Date().toISOString(),
        };
        // Act
        const result = handler.canHandle(message);

        // Assert
        expect(result).toEqual(expectedResult);
      },
    );
  });
  describe('handle', () => {
    it('if playlist has no programs -> error is reported', () => {
      // Arrange
      const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
        payload: createPlaylistEvent(),
        message_type:
          ChannelServiceMultiTenantMessagingSettings.PlaylistPublished
            .messageType,
        message_id: uuid(),
        message_version: '1.0',
        timestamp: new Date().toISOString(),
      };
      // Act
      const validationResult = handler.handle(message);

      // Assert
      expect(validationResult.payload).toBeNull();
      expect(validationResult.warnings).toHaveLength(0);
      expect(validationResult.errors).toHaveLength(1);
      expect(validationResult.errors).toMatchObject([
        { ...ValidationErrors.PlaylistMissingPrograms },
      ]);
    });

    it.each([1440, 1470, 1499])(
      'if playlist duration exceeds 24 hours -> warning is reported',
      (minutesToAdd) => {
        // Arrange
        const startTime = new Date();
        const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
          payload: {
            ...createPlaylistEvent(),
            start_date_time: startTime.toISOString(),
            end_date_time: new Date(
              startTime.setMinutes(startTime.getMinutes() + minutesToAdd),
            ).toISOString(),
            programs: [
              {
                id: uuid(),
                title: 'Program 1',
                sort_index: 0,
                video_duration_in_seconds: 86400,
                entity_id: uuid(),
                entity_type: 'MOVIE',
                video: {
                  id: uuid(),
                  title: 'TEST MOVIE',
                  source_location: 'test',
                  is_archived: false,
                  videos_tags: [],
                  video_encoding: {
                    audio_languages: ['en'],
                    caption_languages: [],
                    dash_manifest_path:
                      'https://test.blob.core.windows.net/video-output/0-0/cmaf/manifest.mpd',
                    encoding_state: 'READY',
                    is_protected: false,
                    output_format: 'CMAF',
                    preview_status: 'NOT_PREVIEWED',
                    subtitle_languages: [],
                    video_streams: [
                      {
                        codecs: 'H264',
                        file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                        format: 'CMAF',
                        label: 'HD',
                        type: 'VIDEO',
                      },
                      {
                        codecs: 'AAC',
                        file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                        format: 'CMAF',
                        label: 'audio',
                        language_code: 'en',
                        language_name: 'English',
                        type: 'AUDIO',
                      },
                    ],
                  },
                },
              },
            ],
          },
          message_type:
            ChannelServiceMultiTenantMessagingSettings.PlaylistPublished
              .messageType,
          message_id: uuid(),
          message_version: '1.0',
          timestamp: new Date().toISOString(),
        };
        // Act
        const validationResult = handler.handle(message);

        // Assert
        expect(validationResult.payload).toMatchObject(message.payload);
        expect(validationResult.errors).toHaveLength(0);
        expect(validationResult.warnings).toHaveLength(1);
        expect(validationResult.warnings).toMatchObject([
          { ...ValidationErrors.PlaylistExceeds24Hours },
        ]);
      },
    );

    it.each([1500, 1800, 7200])(
      'if playlist duration exceeds 25 hours -> error is reported',
      (minutesToAdd) => {
        // Arrange
        const startTime = new Date();
        const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
          payload: {
            ...createPlaylistEvent(),
            start_date_time: startTime.toISOString(),
            end_date_time: new Date(
              startTime.setMinutes(startTime.getMinutes() + minutesToAdd),
            ).toISOString(),
            programs: [
              {
                id: uuid(),
                title: 'Program 1',
                sort_index: 0,
                video_duration_in_seconds: 86400,
                entity_id: uuid(),
                entity_type: 'MOVIE',
                video: {
                  id: uuid(),
                  title: 'TEST MOVIE',
                  source_location: 'test',
                  is_archived: false,
                  videos_tags: [],
                  video_encoding: {
                    audio_languages: ['en'],
                    caption_languages: [],
                    dash_manifest_path:
                      'https://test.blob.core.windows.net/video-output/0-0/cmaf/manifest.mpd',
                    encoding_state: 'READY',
                    is_protected: false,
                    output_format: 'CMAF',
                    preview_status: 'NOT_PREVIEWED',
                    subtitle_languages: [],
                    video_streams: [
                      {
                        codecs: 'H264',
                        file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                        format: 'CMAF',
                        label: 'HD',
                        type: 'VIDEO',
                      },
                      {
                        codecs: 'AAC',
                        file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                        format: 'CMAF',
                        label: 'audio',
                        language_code: 'en',
                        language_name: 'English',
                        type: 'AUDIO',
                      },
                    ],
                  },
                },
              },
            ],
          },
          message_type:
            ChannelServiceMultiTenantMessagingSettings.PlaylistPublished
              .messageType,
          message_id: uuid(),
          message_version: '1.0',
          timestamp: new Date().toISOString(),
        };
        // Act
        const validationResult = handler.handle(message);

        // Assert
        expect(validationResult.payload).toBeNull();
        expect(validationResult.warnings).toHaveLength(0);
        expect(validationResult.errors).toHaveLength(1);
        expect(validationResult.errors).toMatchObject([
          { ...ValidationErrors.PlaylistExceeds25Hours },
        ]);
      },
    );

    it('if playlist has videos that are protected -> errors are reported', () => {
      // Arrange
      const scheduleVideoId = uuid();
      const programVideoId = uuid();
      const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
        payload: {
          ...createPlaylistEvent(),
          programs: [
            {
              id: uuid(),
              title: 'Program 1',
              sort_index: 0,
              video_duration_in_seconds: 86400,
              entity_id: uuid(),
              entity_type: 'MOVIE',
              program_cue_points: [
                {
                  id: uuid(),
                  type: 'PRE',
                  schedules: [
                    {
                      id: uuid(),
                      type: 'VIDEO',
                      sort_index: 0,
                      duration_in_seconds: 10,
                      video: {
                        id: scheduleVideoId,
                        title: 'TEST MOVIE',
                        source_location: 'test',
                        is_archived: false,
                        videos_tags: [],
                        video_encoding: {
                          audio_languages: ['en'],
                          caption_languages: [],
                          dash_manifest_path:
                            'https://test.blob.core.windows.net/video-output/0-0/cmaf/manifest.mpd',
                          encoding_state: 'READY',
                          is_protected: true,
                          output_format: 'CMAF',
                          preview_status: 'NOT_PREVIEWED',
                          subtitle_languages: [],
                          video_streams: [
                            {
                              codecs: 'H264',
                              file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                              format: 'CMAF',
                              label: 'HD',
                              type: 'VIDEO',
                            },
                            {
                              codecs: 'AAC',
                              file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                              format: 'CMAF',
                              label: 'audio',
                              language_code: 'en',
                              language_name: 'English',
                              type: 'AUDIO',
                            },
                          ],
                        },
                      },
                    },
                    {
                      id: uuid(),
                      type: 'AD_POD',
                      sort_index: 0,
                      duration_in_seconds: 10,
                    },
                  ],
                },
              ],
              video: {
                id: programVideoId,
                title: 'TEST MOVIE',
                source_location: 'test',
                is_archived: false,
                videos_tags: [],
                video_encoding: {
                  audio_languages: ['en'],
                  caption_languages: [],
                  dash_manifest_path:
                    'https://test.blob.core.windows.net/video-output/0-0/cmaf/manifest.mpd',
                  encoding_state: 'READY',
                  is_protected: true,
                  output_format: 'CMAF',
                  preview_status: 'NOT_PREVIEWED',
                  subtitle_languages: [],
                  video_streams: [
                    {
                      codecs: 'H264',
                      file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                      format: 'CMAF',
                      label: 'HD',
                      type: 'VIDEO',
                    },
                    {
                      codecs: 'AAC',
                      file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                      format: 'CMAF',
                      label: 'audio',
                      language_code: 'en',
                      language_name: 'English',
                      type: 'AUDIO',
                    },
                  ],
                },
              },
            },
          ],
        },
        message_type:
          ChannelServiceMultiTenantMessagingSettings.PlaylistPublished
            .messageType,
        message_id: uuid(),
        message_version: '1.0',
        timestamp: new Date().toISOString(),
      };
      // Act
      const validationResult = handler.handle(message);

      // Assert
      expect(validationResult.payload).toBeNull();
      expect(validationResult.warnings).toHaveLength(0);
      expect(validationResult.errors).toHaveLength(2);
      expect(validationResult.errors).toMatchObject([
        {
          message: `Video ${programVideoId} is DRM protected.`,
          code: 'VIDEO_IS_PROTECTED',
        },
        {
          message: `Video ${scheduleVideoId} is DRM protected.`,
          code: 'VIDEO_IS_PROTECTED',
        },
      ]);
    });

    it.each(['HLS', 'DASH', 'DASH_HLS', 'DASH_ON_DEMAND'])(
      'if playlist has videos with output format %s -> errors are reported',
      (format) => {
        // Arrange
        const scheduleVideoId = uuid();
        const programVideoId = uuid();
        const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
          payload: {
            ...createPlaylistEvent(),
            programs: [
              {
                id: uuid(),
                title: 'Program 1',
                sort_index: 0,
                video_duration_in_seconds: 86400,
                entity_id: uuid(),
                entity_type: 'MOVIE',
                program_cue_points: [
                  {
                    id: uuid(),
                    type: 'PRE',
                    schedules: [
                      {
                        id: uuid(),
                        type: 'VIDEO',
                        sort_index: 0,
                        duration_in_seconds: 10,
                        video: {
                          id: scheduleVideoId,
                          title: 'TEST MOVIE',
                          source_location: 'test',
                          is_archived: false,
                          videos_tags: [],
                          video_encoding: {
                            audio_languages: ['en'],
                            caption_languages: [],
                            dash_manifest_path:
                              'https://test.blob.core.windows.net/video-output/0-0/cmaf/manifest.mpd',
                            encoding_state: 'READY',
                            is_protected: false,
                            output_format: format as OutputFormat,
                            preview_status: 'NOT_PREVIEWED',
                            subtitle_languages: [],
                            video_streams: [
                              {
                                codecs: 'H264',
                                file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                                format: 'CMAF',
                                label: 'HD',
                                type: 'VIDEO',
                              },
                              {
                                codecs: 'AAC',
                                file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                                format: 'CMAF',
                                label: 'audio',
                                language_code: 'en',
                                language_name: 'English',
                                type: 'AUDIO',
                              },
                            ],
                          },
                        },
                      },
                      {
                        id: uuid(),
                        type: 'AD_POD',
                        sort_index: 0,
                        duration_in_seconds: 10,
                      },
                    ],
                  },
                ],
                video: {
                  id: programVideoId,
                  title: 'TEST MOVIE',
                  source_location: 'test',
                  is_archived: false,
                  videos_tags: [],
                  video_encoding: {
                    audio_languages: ['en'],
                    caption_languages: [],
                    dash_manifest_path:
                      'https://test.blob.core.windows.net/video-output/0-0/cmaf/manifest.mpd',
                    encoding_state: 'READY',
                    is_protected: false,
                    output_format: format as OutputFormat,
                    preview_status: 'NOT_PREVIEWED',
                    subtitle_languages: [],
                    video_streams: [
                      {
                        codecs: 'H264',
                        file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                        format: 'CMAF',
                        label: 'HD',
                        type: 'VIDEO',
                      },
                      {
                        codecs: 'AAC',
                        file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                        format: 'CMAF',
                        label: 'audio',
                        language_code: 'en',
                        language_name: 'English',
                        type: 'AUDIO',
                      },
                    ],
                  },
                },
              },
            ],
          },
          message_type:
            ChannelServiceMultiTenantMessagingSettings.PlaylistPublished
              .messageType,
          message_id: uuid(),
          message_version: '1.0',
          timestamp: new Date().toISOString(),
        };
        // Act
        const validationResult = handler.handle(message);

        // Assert
        expect(validationResult.payload).toBeNull();
        expect(validationResult.warnings).toHaveLength(0);
        expect(validationResult.errors).toHaveLength(2);
        expect(validationResult.errors).toMatchObject([
          {
            message: `Video ${programVideoId} output format is '${format}'. Expected output format 'CMAF'`,
            code: 'WRONG_VIDEO_FORMAT',
          },
          {
            message: `Video ${scheduleVideoId} output format is '${format}'. Expected output format 'CMAF'`,
            code: 'WRONG_VIDEO_FORMAT',
          },
        ]);
      },
    );

    it('if playlist has videos that are encoded not in H264 -> errors are reported', () => {
      // Arrange
      const scheduleVideoId = uuid();
      const programVideoId = uuid();
      const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
        payload: {
          ...createPlaylistEvent(),
          programs: [
            {
              id: uuid(),
              title: 'Program 1',
              sort_index: 0,
              video_duration_in_seconds: 86400,
              entity_id: uuid(),
              entity_type: 'MOVIE',
              program_cue_points: [
                {
                  id: uuid(),
                  type: 'PRE',
                  schedules: [
                    {
                      id: uuid(),
                      type: 'VIDEO',
                      sort_index: 0,
                      duration_in_seconds: 10,
                      video: {
                        id: scheduleVideoId,
                        title: 'TEST MOVIE',
                        source_location: 'test',
                        is_archived: false,
                        videos_tags: [],
                        video_encoding: {
                          audio_languages: ['en'],
                          caption_languages: [],
                          dash_manifest_path:
                            'https://test.blob.core.windows.net/video-output/0-0/cmaf/manifest.mpd',
                          encoding_state: 'READY',
                          is_protected: false,
                          output_format: 'CMAF',
                          preview_status: 'NOT_PREVIEWED',
                          subtitle_languages: [],
                          video_streams: [
                            {
                              codecs: 'H265',
                              file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                              format: 'CMAF',
                              label: 'HD',
                              type: 'VIDEO',
                            },
                            {
                              codecs: 'AAC',
                              file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                              format: 'CMAF',
                              label: 'audio',
                              language_code: 'en',
                              language_name: 'English',
                              type: 'AUDIO',
                            },
                          ],
                        },
                      },
                    },
                    {
                      id: uuid(),
                      type: 'AD_POD',
                      sort_index: 0,
                      duration_in_seconds: 10,
                    },
                  ],
                },
              ],
              video: {
                id: programVideoId,
                title: 'TEST MOVIE',
                source_location: 'test',
                is_archived: false,
                videos_tags: [],
                video_encoding: {
                  audio_languages: ['en'],
                  caption_languages: [],
                  dash_manifest_path:
                    'https://test.blob.core.windows.net/video-output/0-0/cmaf/manifest.mpd',
                  encoding_state: 'READY',
                  is_protected: false,
                  output_format: 'CMAF',
                  preview_status: 'NOT_PREVIEWED',
                  subtitle_languages: [],
                  video_streams: [
                    {
                      codecs: 'H265',
                      file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                      format: 'CMAF',
                      label: 'HD',
                      type: 'VIDEO',
                    },
                    {
                      codecs: 'AAC',
                      file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                      format: 'CMAF',
                      label: 'audio',
                      language_code: 'en',
                      language_name: 'English',
                      type: 'AUDIO',
                    },
                  ],
                },
              },
            },
          ],
        },
        message_type:
          ChannelServiceMultiTenantMessagingSettings.PlaylistPublished
            .messageType,
        message_id: uuid(),
        message_version: '1.0',
        timestamp: new Date().toISOString(),
      };
      // Act
      const validationResult = handler.handle(message);

      // Assert
      expect(validationResult.payload).toBeNull();
      expect(validationResult.warnings).toHaveLength(0);
      expect(validationResult.errors).toHaveLength(2);
      expect(validationResult.errors).toMatchObject([
        {
          message: `Video ${programVideoId} is not encoded as 'H264'.`,
          code: 'WRONG_VIDEO_CODEC',
        },
        {
          message: `Video ${scheduleVideoId} is not encoded as 'H264'.`,
          code: 'WRONG_VIDEO_CODEC',
        },
      ]);
    });

    it('if playlist is valid -> no errors and warnings', () => {
      // Arrange
      const scheduleVideoId = uuid();
      const programVideoId = uuid();
      const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
        payload: {
          ...createPlaylistEvent(),
          programs: [
            {
              id: uuid(),
              title: 'Program 1',
              sort_index: 0,
              video_duration_in_seconds: 86400,
              entity_id: uuid(),
              entity_type: 'MOVIE',
              program_cue_points: [
                {
                  id: uuid(),
                  type: 'PRE',
                  schedules: [
                    {
                      id: uuid(),
                      type: 'VIDEO',
                      sort_index: 0,
                      duration_in_seconds: 10,
                      video: {
                        id: scheduleVideoId,
                        title: 'TEST MOVIE',
                        source_location: 'test',
                        is_archived: false,
                        videos_tags: [],
                        video_encoding: {
                          audio_languages: ['en'],
                          caption_languages: [],
                          dash_manifest_path:
                            'https://test.blob.core.windows.net/video-output/0-0/cmaf/manifest.mpd',
                          encoding_state: 'READY',
                          is_protected: false,
                          output_format: 'CMAF',
                          preview_status: 'NOT_PREVIEWED',
                          subtitle_languages: [],
                          video_streams: [
                            {
                              codecs: 'H264',
                              file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                              format: 'CMAF',
                              label: 'HD',
                              type: 'VIDEO',
                            },
                            {
                              codecs: 'AAC',
                              file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                              format: 'CMAF',
                              label: 'audio',
                              language_code: 'en',
                              language_name: 'English',
                              type: 'AUDIO',
                            },
                          ],
                        },
                      },
                    },
                    {
                      id: uuid(),
                      type: 'AD_POD',
                      sort_index: 0,
                      duration_in_seconds: 10,
                    },
                  ],
                },
              ],
              video: {
                id: programVideoId,
                title: 'TEST MOVIE',
                source_location: 'test',
                is_archived: false,
                videos_tags: [],
                video_encoding: {
                  audio_languages: ['en'],
                  caption_languages: [],
                  dash_manifest_path:
                    'https://test.blob.core.windows.net/video-output/0-0/cmaf/manifest.mpd',
                  encoding_state: 'READY',
                  is_protected: false,
                  output_format: 'CMAF',
                  preview_status: 'NOT_PREVIEWED',
                  subtitle_languages: [],
                  video_streams: [
                    {
                      codecs: 'H264',
                      file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                      format: 'CMAF',
                      label: 'HD',
                      type: 'VIDEO',
                    },
                    {
                      codecs: 'AAC',
                      file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                      format: 'CMAF',
                      label: 'audio',
                      language_code: 'en',
                      language_name: 'English',
                      type: 'AUDIO',
                    },
                  ],
                },
              },
            },
          ],
        },
        message_type:
          ChannelServiceMultiTenantMessagingSettings.PlaylistPublished
            .messageType,
        message_id: uuid(),
        message_version: '1.0',
        timestamp: new Date().toISOString(),
      };
      // Act
      const validationResult = handler.handle(message);

      // Assert
      expect(validationResult.payload).toMatchObject(message.payload);
      expect(validationResult.warnings).toHaveLength(0);
      expect(validationResult.errors).toHaveLength(0);
    });
  });
});
