export interface ChannelEntry {
  name: string;
  uri: string;
}

export interface ChannelResponse {
  task_id: string;
  status_url: string;
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

export interface ChannelStatusResponse {
  status: string;
  origin_url: string;
  details: ChannelStatusDetailResponse[];
}

export interface ChannelStatusDetailResponse {
  name: string;
  status: string;
  time: string;
  details: string;
}
