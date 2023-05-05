import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class VodToLiveServiceMessagingSettings implements MessagingSettings {
  public static PrepareTransitionLiveStream = new VodToLiveServiceMessagingSettings(
    'PrepareTransitionLiveStream', 
    'transition:prepare_live_stream', 
    'transition.prepare_live_stream'
    );
  public static PrepareChannelLiveStream = new VodToLiveServiceMessagingSettings(
    'PrepareChannelLiveStream', 
    'channel:prepare_live_stream', 
    'channel.prepare_live_stream'
    );
  public static EnsureChannelLive = new VodToLiveServiceMessagingSettings(
    'EnsureChannelLive', 
    'channel:ensure_channel_live', 
    'channel.ensure_channel_live'
    );
  public static LiveStreamProtectionKeyCreated = new VodToLiveServiceMessagingSettings(
    'LiveStreamProtectionKeyCreated', 
    'channel:protection_key_created', 
    'channel.protection_key_created'
    );
  public static EnsureChannelLiveFailed = new VodToLiveServiceMessagingSettings(
    'EnsureChannelLiveFailed', 
    'channel:ensure_channel_live_failed', 
    'channel.ensure_channel_live_failed'
    );
  public static EnsureChannelLiveReady = new VodToLiveServiceMessagingSettings(
    'EnsureChannelLiveReady', 
    'channel:ensure_channel_live_ready', 
    'channel.ensure_channel_live_ready'
    );
  
  public readonly serviceId = 'vod-to-live-service';
  
  private constructor(
    public readonly messageType: string,
    public readonly queue: string,
    public readonly routingKey: string,
  ) {
    
  }

  public toString = (): string => {
    return this.messageType;
  };
}