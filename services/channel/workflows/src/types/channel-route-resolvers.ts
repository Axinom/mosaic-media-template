export type ChannelDetailsStationDynamicSegments =
  | (Record<string, string> & { channelId: string })
  | string;

export type ProgramDetailsStationDynamicSegments =
  | { programId: string }
  | { playlistId: string; channelId?: string }
  | string;
