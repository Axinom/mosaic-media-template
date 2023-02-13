import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
  OutputFormat,
} from '@axinom/mosaic-messages';
import { WebhookRequestMessage } from '@axinom/mosaic-service-common';
import { v4 as uuid } from 'uuid';
import { ValidationErrors } from '../../common';
import { ChannelPublishedValidationWebhookHandler } from './channel-published-validation-handler';

describe('ChannelPublishedValidationWebhookHandler', () => {
  const handler = new ChannelPublishedValidationWebhookHandler();
  const createChannelEvent = (): ChannelPublishedEvent => {
    return {
      id: uuid(),
      title: 'Test Channel',
    };
  };
  describe('canHandle', () => {
    it.each`
      messageType                                                                   | expectedResult
      ${ChannelServiceMultiTenantMessagingSettings.ChannelPublished.messageType}    | ${true}
      ${ChannelServiceMultiTenantMessagingSettings.ChannelUnpublished.messageType}  | ${false}
      ${ChannelServiceMultiTenantMessagingSettings.PlaylistPublished.messageType}   | ${false}
      ${ChannelServiceMultiTenantMessagingSettings.PlaylistUnpublished.messageType} | ${false}
    `(
      'for message type %messageType, result is %expectedResult',
      ({ messageType, expectedResult }) => {
        // Arrange
        const message: WebhookRequestMessage<ChannelPublishedEvent> = {
          payload: createChannelEvent(),
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
    it('if channel missing the placeholder video -> error is reported', () => {
      // Arrange
      const message: WebhookRequestMessage<ChannelPublishedEvent> = {
        payload: createChannelEvent(),
        message_type:
          ChannelServiceMultiTenantMessagingSettings.ChannelPublished
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
        { ...ValidationErrors.ChannelMissingPlaceholderVideo },
      ]);
    });

    it('if channel placeholder video is protected -> error is reported', () => {
      // Arrange
      const message: WebhookRequestMessage<ChannelPublishedEvent> = {
        payload: {
          ...createChannelEvent(),
          placeholder_video: {
            id: uuid(),
            title: 'Channel Spinning LOGO',
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
        message_type:
          ChannelServiceMultiTenantMessagingSettings.ChannelPublished
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
        {
          message: `Video ${
            message.payload.placeholder_video!.id
          } is DRM protected.`,
          code: 'VIDEO_IS_PROTECTED',
        },
      ]);
    });

    it.each(['HLS', 'DASH', 'DASH_HLS', 'DASH_ON_DEMAND'])(
      'if channel placeholder video has format %s -> error is reported',
      (format) => {
        // Arrange
        const message: WebhookRequestMessage<ChannelPublishedEvent> = {
          payload: {
            ...createChannelEvent(),
            placeholder_video: {
              id: uuid(),
              title: 'Channel Spinning LOGO',
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
                    format: format as OutputFormat,
                    label: 'HD',
                    type: 'VIDEO',
                  },
                  {
                    codecs: 'AAC',
                    file: 'cmaf/audio-en-audio-en-mp4a.mp4',
                    format: format as OutputFormat,
                    label: 'audio',
                    language_code: 'en',
                    language_name: 'English',
                    type: 'AUDIO',
                  },
                ],
              },
            },
          },
          message_type:
            ChannelServiceMultiTenantMessagingSettings.ChannelPublished
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
          {
            message: `Video ${
              message.payload.placeholder_video!.id
            } output format is '${format}'. Expected output format 'CMAF'`,
            code: 'WRONG_VIDEO_FORMAT',
          },
        ]);
      },
    );

    it('if channel placeholder video is encoded not in H264 -> error is reported', () => {
      // Arrange
      const message: WebhookRequestMessage<ChannelPublishedEvent> = {
        payload: {
          ...createChannelEvent(),
          placeholder_video: {
            id: uuid(),
            title: 'Channel Spinning LOGO',
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
        message_type:
          ChannelServiceMultiTenantMessagingSettings.ChannelPublished
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
        {
          message: `Video ${
            message.payload.placeholder_video!.id
          } is not encoded as 'H264'.`,
          code: 'WRONG_VIDEO_CODEC',
        },
      ]);
    });

    it('if channel placeholder video is correct -> no errors and warnings', () => {
      // Arrange
      const message: WebhookRequestMessage<ChannelPublishedEvent> = {
        payload: {
          ...createChannelEvent(),
          placeholder_video: {
            id: uuid(),
            title: 'Channel Spinning LOGO',
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
        message_type:
          ChannelServiceMultiTenantMessagingSettings.ChannelPublished
            .messageType,
        message_id: uuid(),
        message_version: '1.0',
        timestamp: new Date().toISOString(),
      };
      // Act
      const validationResult = handler.handle(message);

      // Assert
      expect(validationResult.warnings).toHaveLength(0);
      expect(validationResult.errors).toHaveLength(0);
      expect(validationResult.payload).toMatchObject(message.payload);
    });
  });
});
