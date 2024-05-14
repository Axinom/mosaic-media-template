import { ChannelLocalization } from '../types/channel-localization';
import { DetailedImage } from '../types/detailed-image';
import { DetailedVideo } from '../types/detailed-video';
/**
 * Publish format for channel.
 */
export interface ChannelPublishedEvent {
  /**
   * Content ID of a channel. Must match the pattern`^(channel)-([a-zA-Z0-9_-]+)$.`
   */
  content_id: string;
  /**
   * Apply DRM protection on the output stream.
   */
  is_drm_protected: boolean;
  /**
   * Images defined for the channel.
   */
  images: DetailedImage[];
  /**
   * Video details to be used to enable live streaming.
   */
  placeholder_video: DetailedVideo;
  /**
   * Localizations for every active locale.
   */
  localizations: ChannelLocalization[];
}