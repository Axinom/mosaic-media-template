export * from './check-channel-job-status-failed-event';
export * from './check-channel-job-status-succeeded-event';
export * from './live-stream-protection-key-created-event';

export enum VodToLiveEventsSchemas {
  CheckChannelJobStatusFailedEvent = 'payloads/vod-to-live/events/check-channel-job-status-failed-event.json',
  CheckChannelJobStatusSucceededEvent = 'payloads/vod-to-live/events/check-channel-job-status-succeeded-event.json',
  LiveStreamProtectionKeyCreatedEvent = 'payloads/vod-to-live/events/live-stream-protection-key-created-event.json'
}

export enum VodToLiveEventsTypes {
  CheckChannelJobStatusFailedEvent = 'CheckChannelJobStatusFailedEvent',
  CheckChannelJobStatusSucceededEvent = 'CheckChannelJobStatusSucceededEvent',
  LiveStreamProtectionKeyCreatedEvent = 'LiveStreamProtectionKeyCreatedEvent'
}