export * from './ensure-channel-live-failed-event';
export * from './ensure-channel-live-ready-event';
export * from './live-stream-protection-key-created-event';

export enum VodToLiveEventsSchemas {
  EnsureChannelLiveFailedEvent = 'payloads/vod-to-live/events/ensure-channel-live-failed-event.json',
  EnsureChannelLiveReadyEvent = 'payloads/vod-to-live/events/ensure-channel-live-ready-event.json',
  LiveStreamProtectionKeyCreatedEvent = 'payloads/vod-to-live/events/live-stream-protection-key-created-event.json'
}

export enum VodToLiveEventsTypes {
  EnsureChannelLiveFailedEvent = 'EnsureChannelLiveFailedEvent',
  EnsureChannelLiveReadyEvent = 'EnsureChannelLiveReadyEvent',
  LiveStreamProtectionKeyCreatedEvent = 'LiveStreamProtectionKeyCreatedEvent'
}