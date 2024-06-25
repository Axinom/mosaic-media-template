import { CuePointScheduleType } from './cue-point-schedule-type';
import { DetailedVideo } from './detailed-video';
/**
 * Schedule item for a cue point.
 */
export interface CuePointSchedule {
  /**
   * A UUID.
   */
  id: string;
  /**
   * Index to order by.
   */
  sort_index: number;
  /**
   * Duration in seconds of the video or ad pod.
   */
  duration_in_seconds: number;
  /**
   * Video details to be used to enable live streaming.
   */
  video?: DetailedVideo;
  /**
   * Type of the schedule.
   */
  type: CuePointScheduleType;
}