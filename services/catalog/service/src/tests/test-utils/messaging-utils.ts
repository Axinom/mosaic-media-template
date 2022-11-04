import {
  CollectionPublishedEvent,
  EpisodePublishedEvent,
  MovieGenresPublishedEvent,
  MoviePublishedEvent,
  SeasonPublishedEvent,
  TvshowGenresPublishedEvent,
  TvshowPublishedEvent,
  VideoStream,
} from 'media-messages';
import { Image, License, Video } from '../../domains/common';

export function createMoviePublishedEvent(
  contentId: string,
): MoviePublishedEvent {
  return {
    content_id: contentId,
    title: 'Movie title',
    description: 'A pretty long description.',
    synopsis: 'A bit shorter description.',
    original_title: 'Movie title',
    tags: ['tag1', 'tag2'],
    cast: ['Actor One', 'Actor Two'],
    genre_ids: ['movie_genre-1', 'movie_genre-2'],
    production_countries: ['US', 'DK'],
    released: '1999-10-15T00:00:00+00:00',
    studio: 'WB',
    licenses: [createLicense()],
    images: [createImage()],
    videos: [createVideo()],
  };
}

export function createTvshowPublishedEvent(
  contentId: string,
): TvshowPublishedEvent {
  return {
    content_id: contentId,
    title: 'TV show title',
    description: 'A pretty long description.',
    synopsis: 'A bit shorter description.',
    original_title: 'TV show title',
    tags: ['tag1', 'tag2'],
    cast: ['Actor One', 'Actor Two'],
    genre_ids: ['movie_genre-1', 'movie_genre-2'],
    production_countries: ['US', 'DK'],
    released: '1999-10-15T00:00:00+00:00',
    studio: 'WB',
    licenses: [createLicense()],
    images: [createImage()],
    videos: [createVideo()],
  };
}

export function createSeasonPublishedEvent(
  contentId: string,
): SeasonPublishedEvent {
  return {
    content_id: contentId,
    tvshow_id: 'tvshow-1',
    index: 0,
    description: 'A pretty long description.',
    synopsis: 'A bit shorter description.',
    tags: ['tag1', 'tag2'],
    cast: ['Actor One', 'Actor Two'],
    genre_ids: ['movie_genre-1', 'movie_genre-2'],
    production_countries: ['US', 'DK'],
    released: '1999-10-15T00:00:00+00:00',
    studio: 'WB',
    licenses: [createLicense()],
    images: [createImage()],
    videos: [createVideo()],
  };
}

export function createEpisodePublishedEvent(
  contentId: string,
): EpisodePublishedEvent {
  return {
    content_id: contentId,
    season_id: 'season-1',
    title: 'Episode title',
    original_title: 'Episode title',
    tags: ['tag1', 'tag2'],
    cast: ['Actor One', 'Actor Two'],
    production_countries: ['US', 'DK'],
    genre_ids: ['movie_genre-1', 'movie_genre-2'],
    released: '1999-10-15T00:00:00+00:00',
    studio: 'WB',
    index: 0,
    description: 'A pretty long description.',
    synopsis: 'A bit shorter description.',
    licenses: [createLicense()],
    images: [createImage()],
    videos: [createVideo()],
  };
}

export function createGenrePublishedEvent(
  contentId: string,
  title = 'Generic genre',
): MovieGenresPublishedEvent | TvshowGenresPublishedEvent {
  return {
    genres: [
      {
        content_id: contentId,
        title: title,
        order_no: 0,
      },
    ],
  };
}

export function createCollectionPublishedEvent(
  contentId: string,
): CollectionPublishedEvent {
  return {
    content_id: contentId,
    title: 'A collection, yay',
    description: 'This collection is a pretty big one.',
    synopsis: 'Pretty big.',
    images: [
      {
        type: 'COVER',
        width: 480,
        height: 320,
        path: '/some/image/path.png',
      },
    ],
    tags: ['tag1', 'tag2'],
    related_items: [
      { movie_id: 'movie-1', order_no: 1, relation_type: 'MOVIE' },
      { tvshow_id: 'tvshow-1', order_no: 2, relation_type: 'TVSHOW' },
      { season_id: 'season-1', order_no: 3, relation_type: 'SEASON' },
      { episode_id: 'episode-1', order_no: 4, relation_type: 'EPISODE' },
    ],
  };
}

function createImage(): Image {
  return {
    type: 'COVER',
    width: 480,
    height: 320,
    path: '/some/image/path.png',
  };
}

function createVideo(): Video {
  return {
    title: 'Video stream 1',
    type: 'MAIN',
    duration: 123,
    hls_manifest: '/path/to/manifest',
    output_format: 'DASH',
    is_protected: false,
    video_streams: createVideoStreams(),
  };
}

function createVideoStreams(): VideoStream[] {
  return [
    {
      drm_key_id: 'drm-key-id',
      iv: 'iv-dash-0123',
      format: 'HLS',
      initial_file: 'audio-en.m3u8',
      label: 'audio',
      language_code: 'en',
    },
    {
      drm_key_id: 'drm-key-id',
      iv: 'iv-dash-0123',
      format: 'HLS',
      initial_file: 'video-H264-240-300k.m3u8',
      label: 'HD',
      bandwidth_in_bps: 400000,
    },
  ];
}

function createLicense(): License {
  return {
    countries: ['US'],
    start_time: '2019-11-13T20:20:39+00:00',
    end_time: '2021-11-13T20:20:39+00:00',
  };
}
