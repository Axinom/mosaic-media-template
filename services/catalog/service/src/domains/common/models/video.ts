import {
  EpisodePublishedEvent,
  MoviePublishedEvent,
  SeasonPublishedEvent,
  TvshowPublishedEvent,
} from 'media-messages';

type Videos =
  | MoviePublishedEvent['videos']
  | TvshowPublishedEvent['videos']
  | SeasonPublishedEvent['videos']
  | EpisodePublishedEvent['videos'];

/**
 *  Convenience type to capture a single video stream item in published content metadata.
 */
export type Video = Exclude<Videos, undefined>[number];
