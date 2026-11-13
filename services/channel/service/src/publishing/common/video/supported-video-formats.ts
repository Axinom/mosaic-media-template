import { VideoOutputFormat } from 'media-messages';

/**
 * Video output formats allowed by the channel message schemas
 * (`VideoOutputFormat`).
 *
 * The Video Service can add formats before the message schemas know them.
 * Typing this as `Record<VideoOutputFormat, true>` makes the compiler fail when
 * `VideoOutputFormat` gains or loses a value and this list is not updated.
 */
const supportedVideoOutputFormats: Record<VideoOutputFormat, true> = {
  HLS: true,
  DASH: true,
  DASH_HLS: true,
  CMAF: true,
  DASH_ON_DEMAND: true,
};

/**
 * Checks at runtime whether a format coming from the Video Service is allowed
 * by the channel message schemas. Does not rely on the generated GraphQL
 * `OutputFormat` enum, which may contain more values than the message schemas.
 */
export const isSupportedVideoOutputFormat = (
  format: string,
): format is VideoOutputFormat =>
  Object.prototype.hasOwnProperty.call(supportedVideoOutputFormats, format);
