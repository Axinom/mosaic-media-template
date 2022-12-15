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
    length_in_seconds: 123.456,
    hls_manifest: '/path/to/manifest',
    output_format: 'DASH',
    is_protected: false,
    video_streams: createVideoStreams(),
  };
}

function createVideoStreams(): VideoStream[] {
  return [
    {
      key_id: 'drm-key-id',
      iv: 'iv-dash-0123',
      bitrate_in_kbps: 3000,
      codecs: 'H264',
      display_aspect_ratio: '16:9',
      file: 'hls/video-H264-1080-3000k.m3u8',
      file_template: 'hls/video-H264-1080-3000k_$Number$.ts',
      format: 'HLS',
      frame_rate: 60,
      height: 1080,
      label: 'HD',
      language_code: null,
      language_name: null,
      pixel_aspect_ratio: '1:1',
      sampling_rate: null,
      type: 'VIDEO',
      width: 1920,
    },
    {
      key_id: null,
      iv: null,
      bitrate_in_kbps: 0,
      codecs: null,
      display_aspect_ratio: null,
      file: 'hls/subtitle-de.m3u8',
      file_template: 'hls/subtitle-de_$Number$.vtt',
      format: 'HLS',
      frame_rate: null,
      height: null,
      label: 'subtitle',
      language_code: 'de',
      language_name: 'German',
      pixel_aspect_ratio: null,
      sampling_rate: null,
      type: 'SUBTITLE',
      width: null,
    },
    {
      key_id: 'drm-key-id',
      iv: 'iv-dash-0123',
      bitrate_in_kbps: 128,
      codecs: 'AAC',
      display_aspect_ratio: null,
      file: 'hls/audio-en.m3u8',
      file_template: 'hls/audio-en_$Number$.ts',
      format: 'HLS',
      frame_rate: null,
      height: null,
      label: 'audio',
      language_code: 'en',
      language_name: 'English',
      pixel_aspect_ratio: null,
      sampling_rate: 48000,
      type: 'AUDIO',
      width: null,
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
