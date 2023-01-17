export * from './prepare-channel-live-stream-command';
export * from './prepare-transition-live-stream-command';

export enum VodToLiveCommandsSchemas {
  PrepareChannelLiveStreamCommand = 'payloads/vod-to-live/commands/prepare-channel-live-stream-command.json',
  PrepareTransitionLiveStreamCommand = 'payloads/vod-to-live/commands/prepare-transition-live-stream-command.json'
}

export enum VodToLiveCommandsTypes {
  PrepareChannelLiveStreamCommand = 'PrepareChannelLiveStreamCommand',
  PrepareTransitionLiveStreamCommand = 'PrepareTransitionLiveStreamCommand'
}