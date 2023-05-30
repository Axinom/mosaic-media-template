import {
  EpisodePublishedEvent,
  MoviePublishedEvent,
  SeasonPublishedEvent,
  TvshowPublishedEvent,
} from 'media-messages';

type Licenses =
  | MoviePublishedEvent['licenses']
  | TvshowPublishedEvent['licenses']
  | SeasonPublishedEvent['licenses']
  | EpisodePublishedEvent['licenses'];

/**
 *  Convenience type to capture a single license item in published content metadata.
 */
export type License = Licenses[number];
