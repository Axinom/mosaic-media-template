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
import { AzureStorage } from '../azure';
import { PlaylistPublishedValidationWebhookHandler } from './playlist-published-validation-handler';

describe('PlaylistPublishedValidationWebhookHandler', () => {
  const mockConfig = stub<Config>({
    prolongPlaylistTo24Hours: true,
    isDrmEnabled: true,
  });
  const mockAzureStorage = stub<AzureStorage>({
    getFileContent: async () => {
      return JSON.stringify({
        description: null,
        id: 'test-id',
        images: [
          {
            height: 646,
            id: 'db561b84-1e78-4f4d-9a3f-446e34db40de',
            path: '/transform/0-0/U5uZEHhwrXGde33yxwVHx9.png',
            type: 'channel_logo',
            width: 860,
          },
        ],
        placeholder_video: createTestVideo(
          true,
          '3a8e5dc9-5c91-4d61-bf95-c4e719b705f2',
          62,
        ),
        title: 'Discovery++',
      });
    },
  });
  const handler = new PlaylistPublishedValidationWebhookHandler(
    mockConfig,
    mockAzureStorage,
  );
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
      async ({ messageType, expectedResult }) => {
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
    it('if playlist has no programs -> error is reported', async () => {
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
      const validationResult = await handler.handle(message);

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
      async (minutesToAdd) => {
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
        const validationResult = await handler.handle(message);

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
      async (minutesToAdd) => {
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
        const validationResult = await handler.handle(message);

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
      async (minutesToAdd) => {
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
        const validationResult = await handler.handle(message);

        // Assert
        expect(validationResult.payload).toBeNull();
        expect(validationResult.warnings).toHaveLength(0);
        expect(validationResult.errors).toHaveLength(1);
        expect(validationResult.errors).toMatchObject([
          { ...ValidationErrors.PlaylistExceeds25Hours },
        ]);
      },
    );

    it('if playlist has videos that are DRM protected, but stream keys are missing -> errors are reported', async () => {
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
                              width: 384,
                              frame_rate: 30,
                              height: 216,
                              bitrate_in_kbps: 300,
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
                      width: 384,
                      frame_rate: 30,
                      height: 216,
                      bitrate_in_kbps: 300,
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
      const validationResult = await handler.handle(message);

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
      async (format) => {
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
                                width: 384,
                                frame_rate: 30,
                                height: 216,
                                bitrate_in_kbps: 300,
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
                        width: 384,
                        frame_rate: 30,
                        height: 216,
                        bitrate_in_kbps: 300,
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
        const validationResult = await handler.handle(message);

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
      async (minutesToAdd) => {
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
        const validationResult = await handler.handle(message);

        // Assert
        expect(validationResult.payload).toBeNull();
        expect(validationResult.warnings).toHaveLength(0);
        expect(validationResult.errors).toHaveLength(1);
        expect(validationResult.errors).toMatchObject([
          { ...ValidationErrors.PlaylistIsTooOld },
        ]);
      },
    );

    it('if playlist has videos that are encoded not in H264 -> errors are reported', async () => {
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
                              width: 384,
                              frame_rate: 30,
                              height: 216,
                              bitrate_in_kbps: 300,
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
                      width: 384,
                      frame_rate: 30,
                      height: 216,
                      bitrate_in_kbps: 300,
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
      const validationResult = await handler.handle(message);

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

    it('if playlist has videos that are missing AUDIO streams -> errors are reported', async () => {
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
                              width: 384,
                              frame_rate: 30,
                              height: 216,
                              bitrate_in_kbps: 300,
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
                      width: 384,
                      frame_rate: 30,
                      height: 216,
                      bitrate_in_kbps: 300,
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
      const validationResult = await handler.handle(message);

      // Assert
      expect(validationResult.payload).toBeNull();
      expect(validationResult.warnings).toHaveLength(0);
      expect(validationResult.errors).toHaveLength(2);
      expect(validationResult.errors).toMatchObject([
        {
          message: `Video ${programVideoId} is missing AUDIO stream(s).`,
          code: 'MISSING_AUDIO_STREAM',
        },
        {
          message: `Video ${scheduleVideoId} is missing AUDIO stream(s).`,
          code: 'MISSING_AUDIO_STREAM',
        },
      ]);
    });

    it('if playlist has no mutual video streams-> error is reported', async () => {
      // Arrange
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
                      type: 'AD_POD',
                      sort_index: 0,
                      duration_in_seconds: 10,
                    },
                  ],
                },
              ],
              video: {
                ...createTestVideo(false),
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

      message.payload.programs![0].video.video_encoding.video_streams = [
        {
          bitrate_in_kbps: 300,
          codecs: 'H264',
          display_aspect_ratio: '16:9',
          file: 'cmaf/video-H264-216-300k-video-avc1.mp4',
          file_template: null,
          format: 'CMAF',
          frame_rate: 60,
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
      ];
      // Act
      const validationResult = await handler.handle(message);

      // Assert
      expect(validationResult.payload).toBeNull();
      expect(validationResult.warnings).toHaveLength(0);
      expect(validationResult.errors).toHaveLength(1);
      expect(validationResult.errors).toMatchObject([
        ValidationErrors.PlaceholderAndPlaylistVideosHaveNoMutualStreams,
      ]);
    });

    it('if playlist starts and ends with an "AD_POD" -> error is reported', async () => {
      // Arrange
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
                      type: 'AD_POD',
                      sort_index: 0,
                      duration_in_seconds: 10,
                    },
                  ],
                },
                {
                  id: uuid(),
                  type: 'POST',
                  schedules: [
                    {
                      id: uuid(),
                      type: 'AD_POD',
                      sort_index: 0,
                      duration_in_seconds: 10,
                    },
                  ],
                },
              ],
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
      const validationResult = await handler.handle(message);

      // Assert
      expect(validationResult.payload).toBeNull();
      expect(validationResult.warnings).toHaveLength(0);
      expect(validationResult.errors).toHaveLength(1);
      expect(validationResult.errors).toMatchObject([
        ValidationErrors.PlaylistCannotStartAndEndWithAdPod,
      ]);
    });

    it('if playlist has drm protected videos, but drm is disabled -> error is reported', async () => {
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
                      video: createTestVideo(true, scheduleVideoId),
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
              video: createTestVideo(true, programVideoId),
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
      const testHandler = new PlaylistPublishedValidationWebhookHandler(
        stub<Config>({
          isDrmEnabled: false,
        }),
        mockAzureStorage,
      );
      const validationResult = await testHandler.handle(message);

      // Assert
      expect(validationResult.payload).toBeNull();
      expect(validationResult.warnings).toHaveLength(0);
      expect(validationResult.errors).toHaveLength(2);
      expect(validationResult.errors).toMatchObject([
        {
          code: 'VIDEO_IS_DRM_PROTECTED',
          message: `Video ${programVideoId} is DRM protected.`,
        },
        {
          code: 'VIDEO_IS_DRM_PROTECTED',
          message: `Video ${scheduleVideoId} is DRM protected.`,
        },
      ]);
    });

    it.each([true, false])(
      'if playlist is valid -> no errors and warnings',
      async (isDrmProtected: boolean) => {
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
        const validationResult = await handler.handle(message);

        // Assert
        expect(validationResult.payload).toMatchObject(message.payload);
        expect(validationResult.warnings).toHaveLength(0);
        expect(validationResult.errors).toHaveLength(0);
      },
    );
  });
});
