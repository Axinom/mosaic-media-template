import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelPublishedEvent,
  CollectionLocalization,
  CollectionPublishedEvent,
  CuePoint,
  EpisodeLocalization,
  EpisodePublishedEvent,
  ImageType,
  MovieGenresPublishedEvent,
  MovieLocalization,
  MoviePublishedEvent,
  RelationType,
  SeasonLocalization,
  SeasonPublishedEvent,
  StreamType,
  TvshowGenresPublishedEvent,
  TvshowLocalization,
  TvshowPublishedEvent,
  VideoEncodingState,
  VideoOutputFormat,
  VideoPreviewStatus,
  VideoStream,
} from 'media-messages';
import { v4 as uuid } from 'uuid';
import { Image, License, Video } from '../../domains/common';

export function createMoviePublishedMessage(
  contentId: string,
): TypedTransactionalMessage<MoviePublishedEvent> {
  return createMessage({
    content_id: contentId,
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
    localizations: createGenericLocalizations(),
  });
}

export function createTvshowPublishedMessage(
  contentId: string,
): TypedTransactionalMessage<TvshowPublishedEvent> {
  return createMessage({
    content_id: contentId,
    original_title: 'TV show title',
    tags: ['tag1', 'tag2'],
    cast: ['Actor One', 'Actor Two'],
    genre_ids: ['tvshow_genre-1', 'tvshow_genre-2'],
    production_countries: ['US', 'DK'],
    released: '1999-10-15T00:00:00+00:00',
    studio: 'WB',
    licenses: [createLicense()],
    images: [createImage()],
    videos: [createVideo()],
    localizations: createGenericLocalizations(),
  });
}

export function createSeasonPublishedMessage(
  contentId: string,
): TypedTransactionalMessage<SeasonPublishedEvent> {
  return createMessage({
    content_id: contentId,
    tvshow_id: 'tvshow-1',
    index: 0,
    tags: ['tag1', 'tag2'],
    cast: ['Actor One', 'Actor Two'],
    genre_ids: ['tvshow_genre-1', 'tvshow_genre-2'],
    production_countries: ['US', 'DK'],
    released: '1999-10-15T00:00:00+00:00',
    studio: 'WB',
    licenses: [createLicense()],
    images: [createImage()],
    videos: [createVideo()],
    localizations: createSeasonLocalizations(),
  });
}

export function createEpisodePublishedMessage(
  contentId: string,
): TypedTransactionalMessage<EpisodePublishedEvent> {
  return createMessage({
    content_id: contentId,
    season_id: 'season-1',
    original_title: 'Episode title',
    tags: ['tag1', 'tag2'],
    cast: ['Actor One', 'Actor Two'],
    production_countries: ['US', 'DK'],
    genre_ids: ['tvshow_genre-1', 'tvshow_genre-2'],
    released: '1999-10-15T00:00:00+00:00',
    studio: 'WB',
    index: 0,
    licenses: [createLicense()],
    images: [createImage()],
    videos: [createVideo()],
    localizations: createGenericLocalizations(),
  });
}

export function createMovieGenresPublishedMessage(
  contentId: string,
): TypedTransactionalMessage<MovieGenresPublishedEvent> {
  return createMessage({
    genres: [
      {
        content_id: contentId,
        order_no: 0,
        localizations: createGenreLocalizations(),
      },
    ],
  });
}

export function createTvshowGenrePublishedMessage(
  contentId: string,
): TypedTransactionalMessage<TvshowGenresPublishedEvent> {
  return createMessage({
    genres: [
      {
        content_id: contentId,
        order_no: 0,
        localizations: createGenreLocalizations(),
      },
    ],
  });
}

export function createCollectionPublishedMessage(
  contentId: string,
): TypedTransactionalMessage<CollectionPublishedEvent> {
  return createMessage({
    content_id: contentId,
    images: [
      {
        type: 'COVER' as ImageType,
        width: 480,
        height: 320,
        path: '/some/image/path.png',
      },
    ],
    tags: ['tag1', 'tag2'],
    related_items: [
      {
        movie_id: 'movie-1',
        order_no: 1,
        relation_type: 'MOVIE' as RelationType,
      },
      {
        tvshow_id: 'tvshow-1',
        order_no: 2,
        relation_type: 'TVSHOW' as RelationType,
      },
      {
        season_id: 'season-1',
        order_no: 3,
        relation_type: 'SEASON' as RelationType,
      },
      {
        episode_id: 'episode-1',
        order_no: 4,
        relation_type: 'EPISODE' as RelationType,
      },
    ],
    localizations: createGenericLocalizations(),
  });
}

export function createChannelPublishedMessage(
  channelId: string,
): TypedTransactionalMessage<ChannelPublishedEvent> {
  return createMessage({
    content_id: channelId,
    is_drm_protected: false,
    placeholder_video: {
      id: '3a8e5dc9-5c91-4d61-bf95-c4e719b705f2',
      is_archived: false,
      custom_id: null,
      source_file_extension: '.mp4',
      source_file_name: '1min_loop_mosaic',
      source_full_file_name: '1min_loop_mosaic.mp4',
      source_location: 'vod2live-ad-placeholder',
      source_size_in_bytes: 80788234,
      title: 'Mosaic Placeholder Video (with logo)',
      video_encoding: {
        audio_languages: ['en'],
        caption_languages: [],
        cmaf_size_in_bytes: 128070139,
        dash_manifest_path:
          'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/cmaf/manifest.mpd',
        dash_size_in_bytes: null,
        length_in_seconds: 62,
        encoding_state: 'READY' as VideoEncodingState,
        finished_date: '2022-11-25T12:26:41.396001+00:00',
        hls_manifest_path:
          'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/cmaf/manifest.m3u8',
        hls_size_in_bytes: null,
        is_protected: false,
        output_format: 'CMAF' as VideoOutputFormat,
        output_location: '8EPGt6rB2D4oJbJqb1tw3o',
        preview_comment: null,
        preview_status: 'NOT_PREVIEWED' as VideoPreviewStatus,
        subtitle_languages: [],
        title: 'Mosaic Placeholder Video (with logo)',
        video_streams: [
          {
            bitrate_in_kbps: 300,
            codecs: 'H264',
            display_aspect_ratio: '16:9',
            file: 'cmaf/video-H264-216-300k-video-avc1.mp4',
            file_template: null,
            format: 'CMAF' as VideoOutputFormat,
            frame_rate: 30,
            height: 216,
            iv: null,
            key_id: null,
            label: 'SD',
            language_code: null,
            language_name: null,
            pixel_aspect_ratio: '1:1',
            sampling_rate: null,
            type: 'VIDEO' as StreamType,
            width: 384,
          },
          {
            bitrate_in_kbps: 128,
            codecs: 'AAC',
            display_aspect_ratio: null,
            file: 'cmaf/audio-en-audio-en-mp4a.mp4',
            file_template: null,
            format: 'CMAF' as VideoOutputFormat,
            frame_rate: null,
            height: null,
            iv: null,
            key_id: null,
            label: 'audio',
            language_code: 'en',
            language_name: 'English',
            pixel_aspect_ratio: null,
            sampling_rate: 48000,
            type: 'AUDIO' as StreamType,
            width: null,
          },
        ],
      },
      videos_tags: ['vod2live'],
    },
    images: [{ id: 'image-1', ...createImage() }],
    localizations: [
      {
        language_tag: 'en-US',
        is_default_locale: true,
        title: 'Another test channel',
        description: 'Good for testing!',
      },
      {
        language_tag: 'de-DE',
        is_default_locale: false,
        title: 'Ein weiterer Testkanal',
        description: 'Gut zum Testen!',
      },
    ],
  });
}

function createImage(): Image {
  return {
    type: 'COVER',
    width: 480,
    height: 320,
    path: '/some/image/path.png',
    alt_text: 'Some alt text',
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
    cue_points: createCuePoints(),
  };
}

function createCuePoints(): CuePoint[] {
  return [
    {
      cue_point_type_key: 'TEST_MARKER_IN',
      time_in_seconds: 0,
      value: 'Test Marker 1',
    },
    {
      cue_point_type_key: 'TEST_MARKER_OUT',
      time_in_seconds: 10,
      value: 'Test Marker 2',
    },
  ];
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

function createGenericLocalizations():
  | MovieLocalization[]
  | TvshowLocalization[]
  | EpisodeLocalization[]
  | CollectionLocalization[] {
  return [
    {
      title: 'source title',
      synopsis: 'source synopsis',
      description: 'source description',
      language_tag: 'en-US',
      is_default_locale: true,
    },
    {
      title: 'localized title 1',
      synopsis: 'localized synopsis',
      description: 'localized description',
      language_tag: 'de-DE',
      is_default_locale: false,
    },
    {
      title: 'localized title 2',
      synopsis: null,
      description: null,
      language_tag: 'et-EE',
      is_default_locale: false,
    },
  ];
}

function createSeasonLocalizations(): SeasonLocalization[] {
  return [
    {
      synopsis: 'source synopsis',
      description: 'source description',
      language_tag: 'en-US',
      is_default_locale: true,
    },
    {
      synopsis: 'localized synopsis',
      description: 'localized description',
      language_tag: 'de-DE',
      is_default_locale: false,
    },
    {
      synopsis: null,
      description: null,
      language_tag: 'et-EE',
      is_default_locale: false,
    },
  ];
}

function createGenreLocalizations(): MovieLocalization[] {
  return [
    {
      title: 'source title',
      language_tag: 'en-US',
      is_default_locale: true,
    },
    {
      title: 'localized title 1',
      language_tag: 'de-DE',
      is_default_locale: false,
    },
    {
      title: 'localized title 2',
      language_tag: 'et-EE',
      is_default_locale: false,
    },
  ];
}

function createMessage<T extends Record<string, unknown>>(
  payload: T,
): TypedTransactionalMessage<T> {
  return {
    id: uuid(),
    payload,
  } as TypedTransactionalMessage<T>;
}
