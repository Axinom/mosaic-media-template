import { Format } from 'media-messages';

/**
 * Video output formats allowed by the publish message schemas (`Format`).
 *
 * The Video Service can add formats before the message schemas know them.
 * Typing this as `Record<Format, true>` makes the compiler fail when `Format`
 * gains or loses a value and this list is not updated.
 */
const supportedPublishFormats: Record<Format, true> = {
  DASH: true,
  HLS: true,
  DASH_HLS: true,
  CMAF: true,
  DASH_ON_DEMAND: true,
};

/**
 * Checks at runtime whether a format coming from the Video Service is allowed
 * by the publish message schemas. Does not rely on the generated GraphQL
 * `OutputFormat` enum, which may contain more values than the message schemas.
 */
export const isSupportedPublishFormat = (format: string): format is Format =>
  Object.prototype.hasOwnProperty.call(supportedPublishFormats, format);
