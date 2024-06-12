import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class ChannelServiceMessagingSettings implements MessagingSettings {
  /**
   * Defines the messaging settings for the event with message type 
   * "ChannelPublished" and aggregate type "channel".
   * The aggregate ID field contains the value of the "channel ID" field.
   */
  public static ChannelPublished = new ChannelServiceMessagingSettings(
    'ChannelPublished', 
    'inbox', 
    'channel.published',
    'event',
    'channel'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "ChannelUnpublished" and aggregate type "channel".
   * The aggregate ID field contains the value of the "channel ID" field.
   */
  public static ChannelUnpublished = new ChannelServiceMessagingSettings(
    'ChannelUnpublished', 
    'inbox', 
    'channel.unpublished',
    'event',
    'channel'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "PlaylistPublished" and aggregate type "playlist".
   * The aggregate ID field contains the value of the "playlist ID" field.
   */
  public static PlaylistPublished = new ChannelServiceMessagingSettings(
    'PlaylistPublished', 
    'inbox', 
    'playlist.published',
    'event',
    'playlist'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "PlaylistUnpublished" and aggregate type "playlist".
   * The aggregate ID field contains the value of the "playlist ID" field.
   */
  public static PlaylistUnpublished = new ChannelServiceMessagingSettings(
    'PlaylistUnpublished', 
    'inbox', 
    'playlist.unpublished',
    'event',
    'playlist'
    );
  
  public readonly serviceId = 'channel-service';
  
  private constructor(
    public readonly messageType: string,
    public readonly queue: string,
    public readonly routingKey: string,
    public readonly action: 'command' | 'event',
    public readonly aggregateType: string,
  ) {
    
  }

  public toString = (): string => {
    return this.messageType;
  };
}