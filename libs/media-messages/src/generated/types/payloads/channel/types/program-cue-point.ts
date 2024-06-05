import { CuePointSchedule } from './cue-point-schedule';
/**
 * Cue point for an insert in a program.
 */
export interface ProgramCuePoint {
  /**
   * A UUID.
   */
  id: string;
  /**
   * Number of seconds from the beginning of the program, when the cue point is inserted.
   */
  time_in_seconds?: number | null;
  /**
   * Type of the cue point.
   */
  type: string;
  /**
   * Additional information about cue point.
   */
  value?: string | null;
  /**
   * Scheduled inserts defined for the cue point.
   */
  schedules?: CuePointSchedule[];
}