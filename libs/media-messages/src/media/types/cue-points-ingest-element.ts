export interface IngestCuePoints {
  cue_point_type: string;
  time_in_seconds: number;
  value?: string;
}

export interface CuePointsIngestElement {
  cue_points?: IngestCuePoints[];
}
