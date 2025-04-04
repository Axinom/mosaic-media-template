import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
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
  TvshowGenresPublishedEvent,
  TvshowLocalization,
  TvshowPublishedEvent,
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
    /*localizations: [
      {
        cover: '10tulsa_cover_756333203.jpg',
        language_tag: 'default',
        description:
          'Tommy Colston is een marine-veteraan met zijn eigen gevechten. Wanneer Tommy zich realiseert dat hij een 9-jarige dochter heeft, Tulsa, laat Tommy haar tegen zijn zin in zijn huis, waar haar sterke geloof in Christus hun beide levens begint te veranderen. Maar wanneer een ongeluk het leven van Tommy en Tulsa op zijn kop zet, moet Tommy leren zijn gevechten met verslaving en verlies te overwinnen om de vader te worden die zijn dochter altijd had wilde hebben.',
        synopsis:
          'Wanneer een ongeluk het leven van Tommy en Tulsa op zijn kop zet, moet Tommy leren zijn gevechten met verslaving en verlies te overwinnen om de beste vader te worden voor zijn dochter.',
        is_default_locale: true,
        list: '10tulsa_list_2051675077.jpg',
        title: 'Tulsa',
        clean_cover: '10tulsa_cleanco_1643328565.jpg',
      },
      {
        language_tag: 'SV',
        description:
          'Tulsa är en 9-årig flicka som har flyttat från fosterhem till fosterhem. Det enda hon riktigt har kvar är sin tro på Gud. När hon än en gång måste flytta hamnar hon hos sin far, Tommy. Hon börjar direkt att förändra hans liv och livet för andra omkring henne.',
        synopsis:
          'Tulsa är en 9-årig flicka som har flyttat från fosterhem till fosterhem. Det enda hon riktigt har kvar är sin tro på Gud.',
        is_default_locale: false,
        title: 'Tulsa',
      },
      {
        cover: '10runningforever_list_nl.jpg',
        language_tag: 'NL',
        description:
          'Tommy Colston is een marine-veteraan met zijn eigen gevechten. Wanneer Tommy zich realiseert dat hij een 9-jarige dochter heeft, Tulsa, laat Tommy haar tegen zijn zin in zijn huis, waar haar sterke geloof in Christus hun beide levens begint te veranderen. Maar wanneer een ongeluk het leven van Tommy en Tulsa op zijn kop zet, moet Tommy leren zijn gevechten met verslaving en verlies te overwinnen om de vader te worden die zijn dochter altijd had wilde hebben.',
        synopsis:
          'Wanneer een ongeluk het leven van Tommy en Tulsa op zijn kop zet, moet Tommy leren zijn gevechten met verslaving en verlies te overwinnen om de beste vader te worden voor zijn dochter.',
        is_default_locale: false,
        title: 'Tulsa',
      },
      {
        language_tag: 'EN',
        description:
          "Tommy Colston is a Marine veteran with his own battles to face. Upon realizing he has a 9-year-old daughter, Tulsa, Tommy unwillingly allows her into his home, where her devout faith in Christ begins to change both of their lives. But when an accident turns Tommy and Tulsa's life upside down, Tommy must learn to overcome his battles with addiction and loss to become the father his daughter always wanted.",
        synopsis:
          "When an accident turns Tommy and Tulsa's life upside down, Tommy must learn to overcome his battles with addiction and loss to become the father his daughter always wanted.",
        is_default_locale: false,
        title: 'Tulsa',
      },
      {
        language_tag: 'NB',
        description:
          'Tulsa er en 9 år gammel jente som har flyttet fra fosterhjem til fosterhjem. Det eneste hun virkelig har beholdt er nestekjærligheten og troen på Gud. \nDa hun igjen må flytte, havner hun i fanget på sin fortapte far. Fra første stund begynner hun å forandre livene til de rundt seg, og snur opp ned på livet til sin far Tommy, som selv har litt av hvert å stri med.',
        synopsis:
          'Tulsa er en 9 år gammel jente som har flyttet fra fosterhjem til fosterhjem. Det eneste hun virkelig har beholdt er nestekjærligheten og troen på Gud.',
        title: 'Tulsa',
        is_default_locale: false,
      },
    ],*/
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
      title: 'source title',
      synopsis: 'source synopsis',
      description: 'source description',
      language_tag: 'en-US',
      is_default_locale: true,
    },
    {
      title: 'localized title DE',
      synopsis: 'localized synopsis',
      description: 'localized description',
      language_tag: 'de-DE',
      is_default_locale: false,
    },
    {
      title: 'localized title EE',
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
