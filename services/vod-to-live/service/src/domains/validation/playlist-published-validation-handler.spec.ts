import {
  ChannelServiceMultiTenantMessagingSettings,
  OutputFormat,
  PlaylistPublishedEvent,
} from '@axinom/mosaic-messages';
import { WebhookRequestMessage } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import {
  Config,
  DAY_IN_SECONDS,
  SECOND_IN_MILLISECONDS,
  ValidationErrors,
} from '../../common';
import { createTestVideo } from '../../tests';
import { PlaylistPublishedValidationWebhookHandler } from './playlist-published-validation-handler';

describe('PlaylistPublishedValidationWebhookHandler', () => {
  const mockConfig = stub<Config>({
    prolongPlaylistTo24Hours: true,
  });
  const handler = new PlaylistPublishedValidationWebhookHandler(mockConfig);
  const createPlaylistEvent = (
    startDate?: Date,
    endDate?: Date,
  ): PlaylistPublishedEvent => {
    return {
      channel_id: uuid(),
      start_date_time: startDate
        ? startDate.toISOString()
        : '2022-12-01T00:00:00+00:00',
      end_date_time: endDate
        ? endDate.toISOString()
        : '2022-12-01T00:00:00+00:00',
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
        payload: createPlaylistEvent(new Date(), new Date()),
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

    it.each([1441, 1470, 1499])(
      'if playlist duration exceeds 24 hours (%s minutes) -> warning is reported',
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
                video_duration_in_seconds: DAY_IN_SECONDS,
                entity_id: uuid(),
                entity_type: 'MOVIE',
                video: createTestVideo(false),
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

    it.each([720, 1439, 60])(
      'if playlist duration is under 24 hours (%s minutes) -> prolongation warning is reported',
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
                video_duration_in_seconds: DAY_IN_SECONDS,
                entity_id: uuid(),
                entity_type: 'MOVIE',
                video: createTestVideo(false),
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
          { ...ValidationErrors.PlaylistProlongation },
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
                video_duration_in_seconds: DAY_IN_SECONDS,
                entity_id: uuid(),
                entity_type: 'MOVIE',
                video: createTestVideo(false),
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

    it('if playlist has videos that are DRM protected, but stream keys are missing -> errors are reported', () => {
      // Arrange
      const scheduleVideoId = uuid();
      const programVideoId = uuid();
      const startDate = new Date();
      const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
        payload: {
          ...createPlaylistEvent(
            startDate,
            new Date(
              startDate.getTime() + DAY_IN_SECONDS * SECOND_IN_MILLISECONDS,
            ),
          ),
          programs: [
            {
              id: uuid(),
              title: 'Program 1',
              sort_index: 0,
              video_duration_in_seconds: DAY_IN_SECONDS,
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
          message: `Video ${programVideoId} is missing key ids.`,
          code: 'MISSING_DRM_KEYS',
        },
        {
          message: `Video ${scheduleVideoId} is missing key ids.`,
          code: 'MISSING_DRM_KEYS',
        },
      ]);
    });

    it.each(['HLS', 'DASH', 'DASH_HLS', 'DASH_ON_DEMAND'])(
      'if playlist has videos with output format %s -> errors are reported',
      (format) => {
        // Arrange
        const scheduleVideoId = uuid();
        const programVideoId = uuid();
        const startDate = new Date();
        const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
          payload: {
            ...createPlaylistEvent(
              startDate,
              new Date(
                startDate.getTime() + DAY_IN_SECONDS * SECOND_IN_MILLISECONDS,
              ),
            ),
            programs: [
              {
                id: uuid(),
                title: 'Program 1',
                sort_index: 0,
                video_duration_in_seconds: DAY_IN_SECONDS,
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

    it.each([1500, 1800, 7200, 1440])(
      'if playlist start date is older than 24 hours -> error is reported',
      (minutesToAdd) => {
        // Arrange
        const now = new Date();
        const startDate = new Date(
          now.setMinutes(now.getMinutes() - minutesToAdd),
        );
        const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
          payload: {
            ...createPlaylistEvent(),
            start_date_time: startDate.toISOString(),
            end_date_time: new Date(
              startDate.setMinutes(startDate.getMinutes() + 1440),
            ).toISOString(),
            programs: [
              {
                id: uuid(),
                title: 'Program 1',
                sort_index: 0,
                video_duration_in_seconds: DAY_IN_SECONDS,
                entity_id: uuid(),
                entity_type: 'MOVIE',
                video: createTestVideo(false),
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
          { ...ValidationErrors.PlaylistIsTooOld },
        ]);
      },
    );

    it('if playlist has videos that are encoded not in H264 -> errors are reported', () => {
      // Arrange
      const scheduleVideoId = uuid();
      const programVideoId = uuid();
      const startDate = new Date();
      const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
        payload: {
          ...createPlaylistEvent(
            startDate,
            new Date(
              startDate.getTime() + DAY_IN_SECONDS * SECOND_IN_MILLISECONDS,
            ),
          ),
          programs: [
            {
              id: uuid(),
              title: 'Program 1',
              sort_index: 0,
              video_duration_in_seconds: DAY_IN_SECONDS,
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

    it('if playlist has videos that are missing AUDIO streams -> errors are reported', () => {
      // Arrange
      const scheduleVideoId = uuid();
      const programVideoId = uuid();
      const startDate = new Date();
      const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
        payload: {
          ...createPlaylistEvent(
            startDate,
            new Date(
              startDate.getTime() + DAY_IN_SECONDS * SECOND_IN_MILLISECONDS,
            ),
          ),
          programs: [
            {
              id: uuid(),
              title: 'Program 1',
              sort_index: 0,
              video_duration_in_seconds: DAY_IN_SECONDS,
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
          message: `Video ${programVideoId} is missing AUDIO stream.`,
          code: 'MISSING_AUDIO_STREAM',
        },
        {
          message: `Video ${scheduleVideoId} is missing AUDIO stream.`,
          code: 'MISSING_AUDIO_STREAM',
        },
      ]);
    });

    it.each([true, false])(
      'if playlist is valid -> no errors and warnings',
      (isDrmProtected: boolean) => {
        // Arrange
        const scheduleVideoId = uuid();
        const programVideoId = uuid();
        const startDate = new Date();
        const message: WebhookRequestMessage<PlaylistPublishedEvent> = {
          payload: {
            ...createPlaylistEvent(
              startDate,
              new Date(
                startDate.getTime() + DAY_IN_SECONDS * SECOND_IN_MILLISECONDS,
              ),
            ),
            programs: [
              {
                id: uuid(),
                title: 'Program 1',
                sort_index: 0,
                video_duration_in_seconds: DAY_IN_SECONDS,
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
                        video: createTestVideo(isDrmProtected, scheduleVideoId),
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
                video: createTestVideo(isDrmProtected, programVideoId),
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
      },
    );
  });
});
