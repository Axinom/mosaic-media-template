/**
 * Cue point metadata.
 */
export interface CuePoint {
  /**
   * Key of the cue point type.
   */
  cue_point_type_key: string;
  /**
   * Time in seconds at which the cue point is triggered within the video.
   */
  time_in_seconds: number;
  /**
   * Additional data associated with the cue point.
   */
  value?: string | null;
}