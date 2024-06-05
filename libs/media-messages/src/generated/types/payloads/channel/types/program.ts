import { DetailedImage } from './detailed-image';
import { DetailedVideo } from './detailed-video';
import { ProgramCuePoint } from './program-cue-point';
import { ProgramLocalization } from './program-localization';
/**
 * Video program.
 */
export interface Program {
  /**
   * Content ID of a program. Must match the pattern `^(program)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
  /**
   * Index to order by.
   */
  sort_index: number;
  /**
   * Image details.
   */
  image?: DetailedImage;
  /**
   * Video details to be used to enable live streaming.
   */
  video: DetailedVideo;
  /**
   * Duration of the video in seconds.
   */
  video_duration_in_seconds: number;
  /**
   * Content ID of a program entity reference. Must match the pattern `^(episode|movie)-([a-zA-Z0-9_-]+)$`.
   */
  entity_content_id: string;
  /**
   * Cue points of the program.
   */
  program_cue_points?: ProgramCuePoint[];
  /**
   * Localizations for every active locale.
   */
  localizations: ProgramLocalization[];
}