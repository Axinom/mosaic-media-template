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
