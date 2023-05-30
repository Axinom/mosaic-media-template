import {
  CollectionPublishedEvent,
  EpisodePublishedEvent,
  MoviePublishedEvent,
  SeasonPublishedEvent,
  TvshowPublishedEvent,
} from 'media-messages';

type Images =
  | MoviePublishedEvent['images']
  | TvshowPublishedEvent['images']
  | SeasonPublishedEvent['images']
  | EpisodePublishedEvent['images']
  | CollectionPublishedEvent['images'];

/**
 * Convenience type to capture a single image item in published content metadata.
 */
export type Image = Exclude<Images, undefined>[number];
