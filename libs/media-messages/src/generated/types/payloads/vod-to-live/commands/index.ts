export * from './check-channel-job-status-command';
export * from './prepare-channel-live-stream-command';
export * from './prepare-transition-live-stream-command';

export enum VodToLiveCommandsSchemas {
  CheckChannelJobStatusCommand = 'payloads/vod-to-live/commands/check-channel-job-status-command.json',
  PrepareChannelLiveStreamCommand = 'payloads/vod-to-live/commands/prepare-channel-live-stream-command.json',
  PrepareTransitionLiveStreamCommand = 'payloads/vod-to-live/commands/prepare-transition-live-stream-command.json'
}

export enum VodToLiveCommandsTypes {
  CheckChannelJobStatusCommand = 'CheckChannelJobStatusCommand',
  PrepareChannelLiveStreamCommand = 'PrepareChannelLiveStreamCommand',
  PrepareTransitionLiveStreamCommand = 'PrepareTransitionLiveStreamCommand'
}