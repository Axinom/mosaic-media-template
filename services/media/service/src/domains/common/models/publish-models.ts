import {
  CollectionPublishedEvent,
  EpisodePublishedEvent,
  MoviePublishedEvent,
  SeasonPublishedEvent,
  TvshowPublishedEvent,
} from 'media-messages';
import {
  collections_images,
  episodes_images,
  episodes_trailers,
  movies_images,
  movies_trailers,
  seasons_images,
  seasons_trailers,
  tvshows_images,
  tvshows_trailers,
} from 'zapatos/schema';

type Videos =
  | MoviePublishedEvent['videos']
  | TvshowPublishedEvent['videos']
  | SeasonPublishedEvent['videos']
  | EpisodePublishedEvent['videos'];

export type PublishVideo = Exclude<Videos, undefined>[number];

type Images =
  | MoviePublishedEvent['images']
  | TvshowPublishedEvent['images']
  | SeasonPublishedEvent['images']
  | EpisodePublishedEvent['images']
  | CollectionPublishedEvent['images'];

export type PublishImage = Exclude<Images, undefined>[number];

export type TrailerJSONSelectable =
  | movies_trailers.JSONSelectable
  | tvshows_trailers.JSONSelectable
  | seasons_trailers.JSONSelectable
  | episodes_trailers.JSONSelectable;

export type ImageJSONSelectable =
  | movies_images.JSONSelectable
  | tvshows_images.JSONSelectable
  | seasons_images.JSONSelectable
  | episodes_images.JSONSelectable
  | collections_images.JSONSelectable;
