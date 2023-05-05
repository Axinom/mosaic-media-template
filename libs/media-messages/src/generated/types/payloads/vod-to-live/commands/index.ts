export * from './ensure-channel-live-command';
export * from './prepare-channel-live-stream-command';
export * from './prepare-transition-live-stream-command';

export enum VodToLiveCommandsSchemas {
  EnsureChannelLiveCommand = 'payloads/vod-to-live/commands/ensure-channel-live-command.json',
  PrepareChannelLiveStreamCommand = 'payloads/vod-to-live/commands/prepare-channel-live-stream-command.json',
  PrepareTransitionLiveStreamCommand = 'payloads/vod-to-live/commands/prepare-transition-live-stream-command.json'
}

export enum VodToLiveCommandsTypes {
  EnsureChannelLiveCommand = 'EnsureChannelLiveCommand',
  PrepareChannelLiveStreamCommand = 'PrepareChannelLiveStreamCommand',
  PrepareTransitionLiveStreamCommand = 'PrepareTransitionLiveStreamCommand'
}