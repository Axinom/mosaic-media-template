import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class ChannelServiceMessagingSettings implements MessagingSettings {
  public static ChannelPublished = new ChannelServiceMessagingSettings(
    'ChannelPublished', 
    'inbox', 
    'channel.published',
    'event',
    'channel'
    );
  public static ChannelUnpublished = new ChannelServiceMessagingSettings(
    'ChannelUnpublished', 
    'inbox', 
    'channel.unpublished',
    'event',
    'channel'
    );
  public static PlaylistPublished = new ChannelServiceMessagingSettings(
    'PlaylistPublished', 
    'inbox', 
    'playlist.published',
    'event',
    'playlist'
    );
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