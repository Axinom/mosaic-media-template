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

interface GqlVideosTags {
  nodes: {
    name: string;
  }[];
}

interface GqlVideoStreams {
  nodes: {
    keyId?: string;
    iv?: string;
    format?: PublishVideo['output_format'];
    initialFile?: string;
    label?: string;
    languageCode?: string;
    bandwidthInBps?: number;
  }[];
}

export interface GqlVideo {
  id: string;
  title: string;
  audioLanguages?: string[] | null;
  subtitleLanguages?: string[] | null;
  captionLanguages?: string[] | null;
  hlsManifestPath?: string | null;
  dashManifestPath?: string | null;
  durationInSeconds?: number | null;
  isProtected: boolean;
  outputFormat: PublishVideo['output_format'];
  videosTags: GqlVideosTags;
  videoStreams: GqlVideoStreams;
  previewStatus?: string;
  encodingState?: string;
}
export interface GqlImage {
  id: string;
  height: number;
  width: number;
  imageTypeKey: string;
  transformationPath: string;
}
