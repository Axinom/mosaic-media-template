export interface ChannelEntry {
  name: string;
  uri: string;
}

export interface ChannelResponse {
  task_id: string;
  status_url: string;
  errorMessage?: string;
}

export interface DetailedTransitionEntry {
  status: string;
  smil: string;
}

export interface ChannelTransitionResponse {
  transitions: {
    [k: string]: DetailedTransitionEntry;
  };
}

export type ChannelStatus = 'Pending' | 'In Progress' | 'Success' | 'Failed';
export interface ChannelStatusResponse {
  status: ChannelStatus;
  origin_url: string;
  details: ChannelStatusDetailResponse[];
}

export interface ChannelStatusDetailResponse {
  name: string;
  status: ChannelStatus;
  time: string;
  details: string;
}
