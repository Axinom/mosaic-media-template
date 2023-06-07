import { ChannelPublishedEvent } from '@axinom/mosaic-messages';

export interface ChannelMetadataModel extends ChannelPublishedEvent {
  key_id?: string;
}
