import {
  ChannelLocalization,
  ChannelPublishedEvent,
  DetailedImage,
  DetailedVideo,
} from 'media-messages';
import { buildPublishingId } from '../../../publishing';
import { ChannelPublishDto } from './aggregate-channel-publish-dto';

/**
 * Creates the publish payload with channel information.
 * @param dto - dto with channel properties from the database.
 * @param images - extended information about the channel images.
 * @param video - extended information about the channel placeholder video.
 * @param localizations - an array of localizations for channel properties.
 * @returns - published event.
 */
export const createChannelPublishPayload = (
  { id, is_drm_protected }: ChannelPublishDto,
  images: DetailedImage[],
  video: DetailedVideo,
  localizations: ChannelLocalization[],
): ChannelPublishedEvent => {
  return {
    content_id: buildPublishingId('CHANNEL', id),
    is_drm_protected,
    images,
    placeholder_video: video,
    localizations,
  };
};
