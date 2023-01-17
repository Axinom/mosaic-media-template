import { DetailedVideo } from '@axinom/mosaic-messages';
import { WebhookValidationMessage } from '@axinom/mosaic-service-common';

export interface ValidationResult {
  errors: WebhookValidationMessage[];
  warnings: WebhookValidationMessage[];
}
export const validateVideo = (video: DetailedVideo): ValidationResult => {
  const validationResult: ValidationResult = {
    errors: [],
    warnings: [],
  };
  if (video.video_encoding.is_protected) {
    validationResult.errors.push({
      message: `Video ${video.id} is DRM protected.`,
      code: 'VIDEO_IS_PROTECTED',
    });
  }

  if (video.video_encoding.output_format !== 'CMAF') {
    validationResult.errors.push({
      message: `Video ${video.id} output format is '${video.video_encoding.output_format}'. Expected output format 'CMAF'`,
      code: 'WRONG_VIDEO_FORMAT',
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
