import { ChannelPublishedEvent } from 'media-messages';

export interface ChannelMetadataModel extends ChannelPublishedEvent {
  key_id?: string;
}
