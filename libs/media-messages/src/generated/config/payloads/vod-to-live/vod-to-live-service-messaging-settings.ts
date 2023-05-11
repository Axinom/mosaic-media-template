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
  public static CheckChannelJobStatus = new VodToLiveServiceMessagingSettings(
    'CheckChannelJobStatus', 
    'channel:check_job_status', 
    'channel.check_job_status'
    );
  public static LiveStreamProtectionKeyCreated = new VodToLiveServiceMessagingSettings(
    'LiveStreamProtectionKeyCreated', 
    'channel:protection_key_created', 
    'channel.protection_key_created'
    );
  public static CheckChannelJobStatusFailed = new VodToLiveServiceMessagingSettings(
    'CheckChannelJobStatusFailed', 
    'channel:check_job_status_failed', 
    'channel.check_job_status_failed'
    );
  public static CheckChannelJobStatusSucceeded = new VodToLiveServiceMessagingSettings(
    'CheckChannelJobStatusSucceeded', 
    'channel:check_job_status_succeeded', 
    'channel.check_job_status_succeeded'
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