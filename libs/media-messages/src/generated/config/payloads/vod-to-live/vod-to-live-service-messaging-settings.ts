import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class VodToLiveServiceMessagingSettings implements MessagingSettings {
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