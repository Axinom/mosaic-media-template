import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';

const disableFilterAndOrder = { tags: { omit: 'filter,order' } };

/**
 * Smart tags to adjust and enhance the generated GraphQL API.
 */
export const SmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      movie_view: {
        description: 'Definition of the movie entity.',
        attribute: {
          title: {
            description: 'Title of the movie.',
          },
          original_title: {
            description: 'Original title of the movie.',
            ...disableFilterAndOrder,
          },
          synopsis: {
            description: 'Short description of the main plot elements.',
            ...disableFilterAndOrder,
          },
          description: {
            description: 'Extended synopsis.',
            ...disableFilterAndOrder,
          },
          studio: {
            description: 'Name of the producing studio.',
            ...disableFilterAndOrder,
          },
          released: {
            description: 'Date of first release.',
            ...disableFilterAndOrder,
          },
          movie_cast: {
            description: 'Cast of the movie.',
            tags: {
              name: 'cast',
              omit: 'filter,order',
            },
          },
          production_countries: {
            description: 'Array of production countries',
            ...disableFilterAndOrder,
          },
          tags: {
            description: 'Array of tags associated with the content.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omit: 'create,update,delete',
        },
      },
      movie_images: {
        description: 'Asset image metadata.',
        attribute: {
          type: {
            description: 'Type of the image.',
            ...disableFilterAndOrder,
          },
          path: {
            description: 'URI to the image file.',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the image in pixels.',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the image in pixels.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(movie_id) references app_public.movie_view (id)|@foreignFieldName images',
          ],
        },
      },
      movie_licenses: {
        description:
          'Content metadata license that defines the content availability regions and time frame.',
        attribute: {
          countries: {
            description: 'Array of countries where the license applies.',
            ...disableFilterAndOrder,
          },
          start_time: {
            description: 'Time when license becomes valid.',
            ...disableFilterAndOrder,
          },
          end_time: {
            description: 'Time when license becomes invalid.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(movie_id) references app_public.movie_view (id)|@foreignFieldName licenses',
          ],
        },
      },
      movie_videos: {
        description: 'Video stream metadata.',
        attribute: {
          type: {
            description: 'Type of the video stream.',
          },
          title: {
            description: 'Title of the video stream',
            ...disableFilterAndOrder,
          },
          length_in_seconds: {
            description: 'Length of the stream in seconds.',
            ...disableFilterAndOrder,
          },
          audio_languages: {
            description: 'Array of audio languages available in the stream.',
            ...disableFilterAndOrder,
          },
          subtitle_languages: {
            description: 'Array of subtitle languages available in the stream.',
            ...disableFilterAndOrder,
          },
          caption_languages: {
            description: 'Array of caption languages available in the stream.',
            ...disableFilterAndOrder,
          },
          dash_manifest: {
            description: 'URI to a DASH manifest.',
            ...disableFilterAndOrder,
          },
          hls_manifest: {
            description: 'URI to an HLS manifest.',
            ...disableFilterAndOrder,
          },
          is_protected: {
            description: 'Indicates whether a stream is protected with DRM.',
            ...disableFilterAndOrder,
          },
          output_format: {
            description: 'Output format of the stream.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(movie_id) references app_public.movie_view (id)|@foreignFieldName videos',
          ],
        },
      },
      movie_video_cue_points: {
        description: 'Video cue point metadata',
        attribute: {
          cue_point_type_key: {
            description: 'Type of the cue point',
            ...disableFilterAndOrder,
          },
          time_in_seconds: {
            description:
              'Time in seconds at which the cue point is set within the video',
            ...disableFilterAndOrder,
          },
          value: {
            description: 'Additional information associated with the cue point',
            ...disableFilterAndOrder,
          },
          movie_video_id: {
            tags: {
              name: 'videoId',
            },
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          movie_video_cue_points_movie_video_id_fkey: {
            tags: {
              foreignFieldName: 'cuePoints',
              fieldName: 'video',
            },
          },
        },
      },
      movie_video_streams: {
        description: 'Video stream DRM metadata',
        attribute: {
          key_id: {
            description: 'DRM Key ID',
            ...disableFilterAndOrder,
          },
          iv: {
            description: 'Initialization Vector of the stream',
            ...disableFilterAndOrder,
          },
          format: {
            description: 'Packaging format of the stream',
            ...disableFilterAndOrder,
          },
          file: {
            description: 'File path to the initialization segment',
            ...disableFilterAndOrder,
          },
          movie_video_id: {
            tags: {
              name: 'videoId',
            },
          },
          label: {
            description: 'Label indicating the type of stream (audio/video)',
            ...disableFilterAndOrder,
          },
          language_code: {
            description: 'The language code for audio streams',
            ...disableFilterAndOrder,
          },
          bitrate_in_kbps: {
            description: 'Bitrate in kilobits per second',
            ...disableFilterAndOrder,
          },
          type: {
            description: 'Stream type',
          },
          file_template: {
            description: 'File Template',
            ...disableFilterAndOrder,
          },
          codecs: {
            description: 'Codecs',
            ...disableFilterAndOrder,
          },
          frame_rate: {
            description: 'Frame rate of the video stream',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the video stream',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the video stream',
            ...disableFilterAndOrder,
          },
          display_aspect_ratio: {
            description: 'Display aspect ratio for video streams',
            ...disableFilterAndOrder,
          },
          pixel_aspect_ratio: {
            description: 'Pixel aspect ratio for video streams',
            ...disableFilterAndOrder,
          },
          sampling_rate: {
            description: 'Sampling rate for audio streams',
            ...disableFilterAndOrder,
          },
          language_name: {
            description:
              'Language name for audio, subtitle, or caption streams',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          movie_video_streams_movie_video_id_fkey: {
            tags: {
              foreignFieldName: 'videoStreams',
              fieldName: 'video',
            },
          },
        },
      },
      movie_genres_relation: {
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(movie_genre_id) references app_public.movie_genre_view (id)|@omit many',
            '(movie_id) references app_public.movie_view (id)|@foreignFieldName genres',
          ],
        },
      },
      movie_genre_view: {
        description: 'Definition of the movie genre entity.',
        attribute: {
          title: {
            description: 'Title of the genre.',
          },
          order_no: {
            description: 'Global ordering number for the genre.',
          },
        },
        tags: {
          omit: 'create,update,delete',
        },
      },
      tvshow_view: {
        description: 'Definition of the TV show entity.',
        attribute: {
          title: {
            description: 'Title of the TV show.',
          },
          synopsis: {
            description: 'Short description of the main plot elements.',
            ...disableFilterAndOrder,
          },
          description: {
            description: 'Extended synopsis.',
            ...disableFilterAndOrder,
          },
          original_title: {
            description: 'Original title of the TV show.',
            ...disableFilterAndOrder,
          },
          studio: {
            description: 'Name of the producing studio.',
            ...disableFilterAndOrder,
          },
          released: {
            description: 'Date of first release.',
            ...disableFilterAndOrder,
          },
          tvshow_cast: {
            description: 'Cast of the TV show.',
            tags: {
              name: 'cast',
              omit: 'filter,order',
            },
          },
          production_countries: {
            description: 'Array of production countries',
            ...disableFilterAndOrder,
          },
          tags: {
            description: 'Array of tags associated with the content.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omit: 'create,update,delete',
        },
      },
      tvshow_images: {
        description: 'Asset image metadata.',
        attribute: {
          type: {
            description: 'Type of the image.',
            ...disableFilterAndOrder,
          },
          path: {
            description: 'URI to the image file.',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the image in pixels.',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the image in pixels.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(tvshow_id) references app_public.tvshow_view (id)|@foreignFieldName images',
          ],
        },
      },
      tvshow_licenses: {
        description:
          'Content metadata license that defines the content availability regions and time frame.',
        attribute: {
          countries: {
            description: 'Array of countries where the license applies.',
            ...disableFilterAndOrder,
          },
          start_time: {
            description: 'Time when license becomes valid.',
            ...disableFilterAndOrder,
          },
          end_time: {
            description: 'Time when license becomes invalid.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(tvshow_id) references app_public.tvshow_view (id)|@foreignFieldName licenses',
          ],
        },
      },
      tvshow_videos: {
        description: 'Video stream metadata.',
        attribute: {
          type: {
            description: 'Type of the video stream.',
            ...disableFilterAndOrder,
          },
          title: {
            description: 'Title of the video stream',
            ...disableFilterAndOrder,
          },
          length_in_seconds: {
            description: 'Length of the stream in seconds.',
            ...disableFilterAndOrder,
          },
          audio_languages: {
            description: 'Array of audio languages available in the stream.',
            ...disableFilterAndOrder,
          },
          subtitle_languages: {
            description: 'Array of subtitle languages available in the stream.',
            ...disableFilterAndOrder,
          },
          caption_languages: {
            description: 'Array of caption languages available in the stream.',
            ...disableFilterAndOrder,
          },
          dash_manifest: {
            description: 'URI to a DASH manifest.',
            ...disableFilterAndOrder,
          },
          hls_manifest: {
            description: 'URI to an HLS manifest.',
            ...disableFilterAndOrder,
          },
          is_protected: {
            description: 'Indicates whether a stream is protected with DRM.',
            ...disableFilterAndOrder,
          },
          output_format: {
            description: 'Output format of the stream.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(tvshow_id) references app_public.tvshow_view (id)|@foreignFieldName videos',
          ],
        },
      },
      tvshow_video_cue_points: {
        description: 'Video cue point metadata',
        attribute: {
          cue_point_type_key: {
            description: 'Type of the cue point',
            ...disableFilterAndOrder,
          },
          time_in_seconds: {
            description:
              'Time in seconds at which the cue point is set within the video',
            ...disableFilterAndOrder,
          },
          value: {
            description: 'Additional information associated with the cue point',
            ...disableFilterAndOrder,
          },
          tvshow_video_id: {
            tags: {
              name: 'videoId',
            },
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          tvshow_video_cue_points_tvshow_video_id_fkey: {
            tags: {
              foreignFieldName: 'cuePoints',
              fieldName: 'video',
            },
          },
        },
      },
      tvshow_video_streams: {
        description: 'Video stream DRM metadata',
        attribute: {
          key_id: {
            description: 'DRM Key ID',
            ...disableFilterAndOrder,
          },
          iv: {
            description: 'Initialization Vector of the stream',
            ...disableFilterAndOrder,
          },
          format: {
            description: 'Packaging format of the stream',
            ...disableFilterAndOrder,
          },
          file: {
            description: 'File path to the initialization segment',
            ...disableFilterAndOrder,
          },
          tvshow_video_id: {
            tags: {
              name: 'videoId',
            },
          },
          label: {
            description: 'Label indicating the type of stream (audio/video)',
            ...disableFilterAndOrder,
          },
          language_code: {
            description: 'The language code for audio streams',
            ...disableFilterAndOrder,
          },
          bitrate_in_kbps: {
            description: 'Bitrate in kilobits per second',
            ...disableFilterAndOrder,
          },
          type: {
            description: 'Stream type',
          },
          file_template: {
            description: 'File Template',
            ...disableFilterAndOrder,
          },
          codecs: {
            description: 'Codecs',
            ...disableFilterAndOrder,
          },
          frame_rate: {
            description: 'Frame rate of the video stream',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the video stream',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the video stream',
            ...disableFilterAndOrder,
          },
          display_aspect_ratio: {
            description: 'Display aspect ratio for video streams',
            ...disableFilterAndOrder,
          },
          pixel_aspect_ratio: {
            description: 'Pixel aspect ratio for video streams',
            ...disableFilterAndOrder,
          },
          sampling_rate: {
            description: 'Sampling rate for audio streams',
            ...disableFilterAndOrder,
          },
          language_name: {
            description:
              'Language name for audio, subtitle, or caption streams',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          tvshow_video_streams_tvshow_video_id_fkey: {
            tags: {
              foreignFieldName: 'videoStreams',
              fieldName: 'video',
            },
          },
        },
      },
      tvshow_genres_relation: {
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(tvshow_genre_id) references tvshow_genre_view|@omit many',
            '(tvshow_id) references app_public.tvshow_view (id)|@foreignFieldName genres',
          ],
        },
      },
      tvshow_genre_view: {
        description: 'Definition of the TV show genre entity.',
        attribute: {
          title: {
            description: 'Title of the genre.',
          },
          order_no: {
            description: 'Global ordering number for the genre.',
          },
        },
        tags: {
          omit: 'create,update,delete',
        },
      },
      season_view: {
        description: 'Definition of the TV show season entity.',
        attribute: {
          synopsis: {
            description: 'Short description of the main plot elements.',
            ...disableFilterAndOrder,
          },
          description: {
            description: 'Extended synopsis.',
            ...disableFilterAndOrder,
          },
          index: {
            description: 'Season number',
            ...disableFilterAndOrder,
          },
          studio: {
            description: 'Name of the producing studio.',
            ...disableFilterAndOrder,
          },
          released: {
            description: 'Date of first release.',
            ...disableFilterAndOrder,
          },
          season_cast: {
            description: 'Cast of the season.',
            tags: {
              name: 'cast',
              omit: 'filter,order',
            },
          },
          production_countries: {
            description: 'Array of production countries',
            ...disableFilterAndOrder,
          },
          tags: {
            description: 'Array of tags associated with the content.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omit: 'create,update,delete',
          foreignKey:
            '(tvshow_id) references app_public.tvshow_view (id)|@fieldName tvshow|@foreignFieldName seasons',
        },
      },
      season_images: {
        description: 'Asset image metadata.',
        attribute: {
          type: {
            description: 'Type of the image.',
            ...disableFilterAndOrder,
          },
          path: {
            description: 'URI to the image file.',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the image in pixels.',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the image in pixels.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(season_id) references app_public.season_view (id)|@foreignFieldName images',
          ],
        },
      },
      season_licenses: {
        description:
          'Content metadata license that defines the content availability regions and time frame.',
        attribute: {
          countries: {
            description: 'Array of countries where the license applies.',
            ...disableFilterAndOrder,
          },
          start_time: {
            description: 'Time when license becomes valid.',
            ...disableFilterAndOrder,
          },
          end_time: {
            description: 'Time when license becomes invalid.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(season_id) references app_public.season_view (id)|@foreignFieldName licenses',
          ],
        },
      },
      season_videos: {
        description: 'Video stream metadata.',
        attribute: {
          type: {
            description: 'Type of the video stream.',
            ...disableFilterAndOrder,
          },
          title: {
            description: 'Title of the video stream',
            ...disableFilterAndOrder,
          },
          length_in_seconds: {
            description: 'Length of the stream in seconds.',
            ...disableFilterAndOrder,
          },
          audio_languages: {
            description: 'Array of audio languages available in the stream.',
            ...disableFilterAndOrder,
          },
          subtitle_languages: {
            description: 'Array of subtitle languages available in the stream.',
            ...disableFilterAndOrder,
          },
          caption_languages: {
            description: 'Array of caption languages available in the stream.',
            ...disableFilterAndOrder,
          },
          dash_manifest: {
            description: 'URI to a DASH manifest.',
            ...disableFilterAndOrder,
          },
          hls_manifest: {
            description: 'URI to an HLS manifest.',
            ...disableFilterAndOrder,
          },
          is_protected: {
            description: 'Indicates whether a stream is protected with DRM.',
            ...disableFilterAndOrder,
          },
          output_format: {
            description: 'Output format of the stream.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(season_id) references app_public.season_view (id)|@foreignFieldName videos',
          ],
        },
      },
      season_video_cue_points: {
        description: 'Video cue point metadata',
        attribute: {
          cue_point_type_key: {
            description: 'Type of the cue point',
            ...disableFilterAndOrder,
          },
          time_in_seconds: {
            description:
              'Time in seconds at which the cue point is set within the video',
            ...disableFilterAndOrder,
          },
          value: {
            description: 'Additional information associated with the cue point',
            ...disableFilterAndOrder,
          },
          season_video_id: {
            tags: {
              name: 'videoId',
            },
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          season_video_cue_points_season_video_id_fkey: {
            tags: {
              foreignFieldName: 'cuePoints',
              fieldName: 'video',
            },
          },
        },
      },
      season_video_streams: {
        description: 'Video stream DRM metadata',
        attribute: {
          key_id: {
            description: 'DRM Key ID',
            ...disableFilterAndOrder,
          },
          iv: {
            description: 'Initialization Vector of the stream',
            ...disableFilterAndOrder,
          },
          format: {
            description: 'Packaging format of the stream',
            ...disableFilterAndOrder,
          },
          file: {
            description: 'File path to the initialization segment',
            ...disableFilterAndOrder,
          },
          season_video_id: {
            tags: {
              name: 'videoId',
            },
          },
          label: {
            description: 'Label indicating the type of stream (audio/video)',
            ...disableFilterAndOrder,
          },
          language_code: {
            description: 'The language code for audio streams',
            ...disableFilterAndOrder,
          },
          bitrate_in_kbps: {
            description: 'Bitrate in kilobits per second',
            ...disableFilterAndOrder,
          },
          type: {
            description: 'Stream type',
          },
          file_template: {
            description: 'File Template',
            ...disableFilterAndOrder,
          },
          codecs: {
            description: 'Codecs',
            ...disableFilterAndOrder,
          },
          frame_rate: {
            description: 'Frame rate of the video stream',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the video stream',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the video stream',
            ...disableFilterAndOrder,
          },
          display_aspect_ratio: {
            description: 'Display aspect ratio for video streams',
            ...disableFilterAndOrder,
          },
          pixel_aspect_ratio: {
            description: 'Pixel aspect ratio for video streams',
            ...disableFilterAndOrder,
          },
          sampling_rate: {
            description: 'Sampling rate for audio streams',
            ...disableFilterAndOrder,
          },
          language_name: {
            description:
              'Language name for audio, subtitle, or caption streams',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          season_video_streams_season_video_id_fkey: {
            tags: {
              foreignFieldName: 'videoStreams',
              fieldName: 'video',
            },
          },
        },
      },
      season_genres_relation: {
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(tvshow_genre_id) references tvshow_genre_view|@omit many',
            '(season_id) references app_public.season_view (id)|@foreignFieldName genres',
          ],
        },
      },
      episode_view: {
        description: 'Definition of the TV show episode entity.',
        attribute: {
          title: {
            description: 'Title of the episode.',
          },
          synopsis: {
            description: 'Short description of the main plot elements.',
            ...disableFilterAndOrder,
          },
          description: {
            description: 'Extended synopsis.',
            ...disableFilterAndOrder,
          },
          index: {
            description: 'Episode number',
            ...disableFilterAndOrder,
          },
          original_title: {
            description: 'Original title of the episode.',
            ...disableFilterAndOrder,
          },
          studio: {
            description: 'Name of the producing studio.',
            ...disableFilterAndOrder,
          },
          released: {
            description: 'Date of first release.',
            ...disableFilterAndOrder,
          },
          episode_cast: {
            description: 'Cast of the episode.',
            tags: {
              name: 'cast',
              omit: 'filter,order',
            },
          },
          production_countries: {
            description: 'Array of production countries',
            ...disableFilterAndOrder,
          },
          tags: {
            description: 'Array of tags associated with the content.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omit: 'create,update,delete',
          foreignKey:
            '(season_id) references app_public.season_view (id)|@fieldName season|@foreignFieldName episodes',
        },
      },
      episode_images: {
        description: 'Asset image metadata.',
        attribute: {
          type: {
            description: 'Type of the image.',
            ...disableFilterAndOrder,
          },
          path: {
            description: 'URI to the image file.',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the image in pixels.',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the image in pixels.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(episode_id) references app_public.episode_view (id)|@foreignFieldName images',
          ],
        },
      },
      episode_licenses: {
        description:
          'Content metadata license that defines the content availability regions and time frame.',
        attribute: {
          countries: {
            description: 'Array of countries where the license applies.',
            ...disableFilterAndOrder,
          },
          start_time: {
            description: 'Time when license becomes valid.',
            ...disableFilterAndOrder,
          },
          end_time: {
            description: 'Time when license becomes invalid.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(episode_id) references app_public.episode_view (id)|@foreignFieldName licenses',
          ],
        },
      },
      episode_videos: {
        description: 'Video stream metadata.',
        attribute: {
          type: {
            description: 'Type of the video stream.',
          },
          title: {
            description: 'Title of the video stream',
            ...disableFilterAndOrder,
          },
          length_in_seconds: {
            description: 'Length of the stream in seconds.',
            ...disableFilterAndOrder,
          },
          audio_languages: {
            description: 'Array of audio languages available in the stream.',
            ...disableFilterAndOrder,
          },
          subtitle_languages: {
            description: 'Array of subtitle languages available in the stream.',
            ...disableFilterAndOrder,
          },
          caption_languages: {
            description: 'Array of caption languages available in the stream.',
            ...disableFilterAndOrder,
          },
          dash_manifest: {
            description: 'URI to a DASH manifest.',
            ...disableFilterAndOrder,
          },
          hls_manifest: {
            description: 'URI to an HLS manifest.',
            ...disableFilterAndOrder,
          },
          is_protected: {
            description: 'Indicates whether a stream is protected with DRM.',
            ...disableFilterAndOrder,
          },
          output_format: {
            description: 'Output format of the stream.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(episode_id) references app_public.episode_view (id)|@foreignFieldName videos',
          ],
        },
      },
      episode_video_cue_points: {
        description: 'Video cue point metadata',
        attribute: {
          cue_point_type_key: {
            description: 'Type of the cue point',
            ...disableFilterAndOrder,
          },
          time_in_seconds: {
            description:
              'Time in seconds at which the cue point is set within the video',
            ...disableFilterAndOrder,
          },
          value: {
            description: 'Additional information associated with the cue point',
            ...disableFilterAndOrder,
          },
          episode_video_id: {
            tags: {
              name: 'videoId',
            },
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          episode_video_cue_points_episode_video_id_fkey: {
            tags: {
              foreignFieldName: 'cuePoints',
              fieldName: 'video',
            },
          },
        },
      },
      episode_video_streams: {
        description: 'Video stream DRM metadata',
        attribute: {
          key_id: {
            description: 'DRM Key ID',
            ...disableFilterAndOrder,
          },
          iv: {
            description: 'Initialization Vector of the stream',
            ...disableFilterAndOrder,
          },
          format: {
            description: 'Packaging format of the stream',
            ...disableFilterAndOrder,
          },
          file: {
            description: 'File path to the initialization segment',
            ...disableFilterAndOrder,
          },
          episode_video_id: {
            tags: {
              name: 'videoId',
            },
          },
          label: {
            description: 'Label indicating the type of stream (audio/video)',
            ...disableFilterAndOrder,
          },
          language_code: {
            description: 'The language code for audio streams',
            ...disableFilterAndOrder,
          },
          bitrate_in_kbps: {
            description: 'Bitrate in kilobits per second',
            ...disableFilterAndOrder,
          },
          type: {
            description: 'Stream type',
          },
          file_template: {
            description: 'File Template',
            ...disableFilterAndOrder,
          },
          codecs: {
            description: 'Codecs',
            ...disableFilterAndOrder,
          },
          frame_rate: {
            description: 'Frame rate of the video stream',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the video stream',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the video stream',
            ...disableFilterAndOrder,
          },
          display_aspect_ratio: {
            description: 'Display aspect ratio for video streams',
            ...disableFilterAndOrder,
          },
          pixel_aspect_ratio: {
            description: 'Pixel aspect ratio for video streams',
            ...disableFilterAndOrder,
          },
          sampling_rate: {
            description: 'Sampling rate for audio streams',
            ...disableFilterAndOrder,
          },
          language_name: {
            description:
              'Language name for audio, subtitle, or caption streams',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          episode_video_streams_episode_video_id_fkey: {
            tags: {
              foreignFieldName: 'videoStreams',
              fieldName: 'video',
            },
          },
        },
      },
      episode_genres_relation: {
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(tvshow_genre_id) references tvshow_genre_view|@omit many',
            '(episode_id) references app_public.episode_view (id)|@foreignFieldName genres',
          ],
        },
      },
      collection_view: {
        description: 'Definition of the collection entity.',
        attribute: {
          title: {
            description: 'Title of the collection.',
          },
          synopsis: {
            description: 'Short description.',
            ...disableFilterAndOrder,
          },
          description: {
            description: 'Longer description.',
            ...disableFilterAndOrder,
          },
          tags: {
            description: 'Array of tags associated with the content.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omit: 'create,update,delete',
        },
      },
      collection_images: {
        description: 'Asset image metadata.',
        attribute: {
          type: {
            description: 'Type of the image.',
            ...disableFilterAndOrder,
          },
          path: {
            description: 'URI to the image file.',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the image in pixels.',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the image in pixels.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(collection_id) references app_public.collection_view (id)|@foreignFieldName images',
          ],
        },
      },
      collection_items_relation: {
        attribute: {
          relation_type: {
            description: 'Type of the relation.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(movie_id) references movie_view|@omit many',
            '(tvshow_id) references tvshow_view|@omit many',
            '(season_id) references season_view|@omit many',
            '(episode_id) references episode_view|@omit many',
            '(collection_id) references app_public.collection_view (id)|@foreignFieldName items',
          ],
        },
      },
      channel_view: {
        description: 'Definition of the channel entity.',
        attribute: {
          title: {
            description: 'Title of the channel.',
          },
          description: {
            description: 'Description of the channel.',
            ...disableFilterAndOrder,
          },
          hls_stream_url: {
            description: 'HLS stream URL of the channel.',
            ...disableFilterAndOrder,
          },
          dash_stream_url: {
            description: 'DASH stream URL of the channel.',
            ...disableFilterAndOrder,
          },
          key_id: {
            description: 'Key identifier for DRM protected streams.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omit: 'create,update,delete',
        },
      },
      channel_images: {
        description: 'Asset image metadata.',
        attribute: {
          type: {
            description: 'Type of the image.',
            ...disableFilterAndOrder,
          },
          path: {
            description: 'URI to the image file.',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the image in pixels.',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the image in pixels.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(channel_id) references app_public.channel_view (id)|@foreignFieldName images',
          ],
        },
      },
      playlist: {
        description: 'Definition of the playlist entity.',
        attribute: {
          channel_id: {
            description: 'The channel ID.',
            ...disableFilterAndOrder,
          },
          start_date_time: {
            description: 'Start date of the playlist.',
            tags: { omit: 'filter' },
          },
          end_date_time: {
            description: 'End date of the playlist.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omit: 'create,update,delete',
          foreignKey: [
            '(channel_id) references app_public.channel_view (id)|@foreignFieldName playlists',
          ],
        },
      },
      program_view: {
        description: 'Definition of the program object.',
        attribute: {
          title: {
            description: 'Title of the program.',
          },
          sort_index: {
            description: 'The sort index of the program.',
            tags: { omit: 'filter' },
          },
          movie_id: {
            description: 'The movie ID.',
            ...disableFilterAndOrder,
          },
          episode_id: {
            description: 'The episode ID.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(playlist_id) references app_public.playlist (id)|@foreignFieldName programs',
            '(movie_id) references app_public.movie_view (id)|@omit many',
            '(episode_id) references app_public.episode_view (id)|@omit many',
          ],
        },
      },
      program_images: {
        description: 'Asset image metadata.',
        attribute: {
          type: {
            description: 'Type of the image.',
            ...disableFilterAndOrder,
          },
          path: {
            description: 'URI to the image file.',
            ...disableFilterAndOrder,
          },
          width: {
            description: 'Width of the image in pixels.',
            ...disableFilterAndOrder,
          },
          height: {
            description: 'Height of the image in pixels.',
            ...disableFilterAndOrder,
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(program_id) references app_public.program_view (id)|@foreignFieldName images',
          ],
        },
      },
    },
  },
});
