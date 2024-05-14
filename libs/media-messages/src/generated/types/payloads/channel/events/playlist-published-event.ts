import { Program } from '../types/program';
/**
 * Publish format for playlist.
 */
export interface PlaylistPublishedEvent {
  /**
   * Content ID of a playlist. Must match the pattern `^(playlist)-([a-zA-Z0-9_-]+)$`.
   */
  content_id: string;
  /**
   * Content ID of a channel. Must match the pattern`^(channel)-([a-zA-Z0-9_-]+)$.`
   */
  channel_id: string;
  /**
   * Start date and time of the playlist.
   */
  start_date_time: string;
  /**
   * End date and time of the playlist.
   */
  end_date_time: string;
  /**
   * List of programs associated with the playlist.
   */
  programs: Program[];
}