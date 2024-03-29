import { DetailedVideo } from '@axinom/mosaic-messages';
import { WebhookValidationMessage } from '@axinom/mosaic-service-common';
import { Config, HOUR_IN_SECONDS } from '../../common';
import { getPlaylistDurationInSeconds } from '../common';

export interface ValidationResult {
  errors: WebhookValidationMessage[];
  warnings: WebhookValidationMessage[];
}
export const validateVideo = (
  video: DetailedVideo,
  config: Config,
): ValidationResult => {
  const validationResult: ValidationResult = {
    errors: [],
    warnings: [],
  };
  if (video.video_encoding.is_protected) {
    if (config.isDrmEnabled) {
      if (
        video.video_encoding.video_streams
          .filter((s) => s.type !== 'SUBTITLE' && s.type !== 'CLOSED_CAPTION')
          .find((s) => !s.key_id)
      ) {
        validationResult.errors.push({
          message: `Video ${video.id} is missing key ids.`,
          code: 'MISSING_DRM_KEYS',
        });
      }
    } else {
      validationResult.errors.push({
        message: `Video ${video.id} is DRM protected.`,
        code: 'VIDEO_IS_DRM_PROTECTED',
      });
    }
  }

  if (video.video_encoding.output_format !== 'CMAF') {
    validationResult.errors.push({
      message: `Video ${video.id} output format is '${video.video_encoding.output_format}'. Expected output format 'CMAF'`,
      code: 'WRONG_VIDEO_FORMAT',
    });
  }

  if (!video.video_encoding.video_streams.find((s) => s.type === 'AUDIO')) {
    validationResult.errors.push({
      message: `Video ${video.id} is missing AUDIO stream(s).`,
      code: 'MISSING_AUDIO_STREAM',
    });
  }

  if (
    video.video_encoding.video_streams.find(
      (s) => s.type === 'VIDEO' && s.codecs !== 'H264',
    )
  ) {
    validationResult.errors.push({
      message: `Video ${video.id} is not encoded as 'H264'.`,
      code: 'WRONG_VIDEO_CODEC',
    });
  }

  return validationResult;
};

export const getHoursDifference = (
  startDate: string,
  endDate: string,
): number => {
  return getPlaylistDurationInSeconds(startDate, endDate) / HOUR_IN_SECONDS;
};
