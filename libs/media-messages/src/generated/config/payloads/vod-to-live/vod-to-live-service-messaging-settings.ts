import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class VodToLiveServiceMessagingSettings implements MessagingSettings {
  /**
   * Defines the messaging settings for the command with message type 
   * "PrepareTransitionLiveStream" and aggregate type "channel".
   * The aggregate ID field must contain the value of the "channel ID" field.
   */
  public static PrepareTransitionLiveStream = new VodToLiveServiceMessagingSettings(
    'PrepareTransitionLiveStream', 
    'transition:prepare_live_stream', 
    'transition.prepare_live_stream',
    'command',
    'channel'
    );
  /**
   * Defines the messaging settings for the command with message type 
   * "PrepareChannelLiveStream" and aggregate type "channel".
   * The aggregate ID field must contain the value of the "channel ID" field.
   */
  public static PrepareChannelLiveStream = new VodToLiveServiceMessagingSettings(
    'PrepareChannelLiveStream', 
    'channel:prepare_live_stream', 
    'channel.prepare_live_stream',
    'command',
    'channel'
    );
  /**
   * Defines the messaging settings for the command with message type 
   * "CheckChannelJobStatus" and aggregate type "channel".
   * The aggregate ID field must contain the value of the "channel ID" field.
   */
  public static CheckChannelJobStatus = new VodToLiveServiceMessagingSettings(
    'CheckChannelJobStatus', 
    'channel:check_job_status', 
    'channel.check_job_status',
    'command',
    'channel'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "LiveStreamProtectionKeyCreated" and aggregate type "channel".
   * The aggregate ID field contains the value of the "channel ID" field.
   */
  public static LiveStreamProtectionKeyCreated = new VodToLiveServiceMessagingSettings(
    'LiveStreamProtectionKeyCreated', 
    'channel:protection_key_created', 
    'channel.protection_key_created',
    'event',
    'channel'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "CheckChannelJobStatusFailed" and aggregate type "channel".
   * The aggregate ID field contains the value of the "channel ID" field.
   */
  public static CheckChannelJobStatusFailed = new VodToLiveServiceMessagingSettings(
    'CheckChannelJobStatusFailed', 
    'channel:check_job_status_failed', 
    'channel.check_job_status_failed',
    'event',
    'channel'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "CheckChannelJobStatusSucceeded" and aggregate type "channel".
   * The aggregate ID field contains the value of the "channel ID" field.
   */
  public static CheckChannelJobStatusSucceeded = new VodToLiveServiceMessagingSettings(
    'CheckChannelJobStatusSucceeded', 
    'channel:check_job_status_succeeded', 
    'channel.check_job_status_succeeded',
    'event',
    'channel'
    );
  
  public readonly serviceId = 'vod-to-live-service';
  
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