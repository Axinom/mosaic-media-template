import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';

/**
 * Smart tags to adjust and enhance the generated GraphQL API.
 */
export const SmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      movie: {
        description: 'Definition of the movie publish format.',
        attribute: {
          title: {
            description: 'Title of the movie.',
          },
          original_title: {
            description: 'Original title of the movie.',
          },
          synopsis: {
            description: 'Short description of the main plot elements.',
          },
          description: {
            description: 'Extended synopsis.',
          },
          studio: {
            description: 'Name of the producing studio.',
          },
          released: {
            description: 'Date of first release.',
          },
          movie_cast: {
            description: 'Cast of the movie.',
            tags: {
              name: 'cast',
            },
          },
          production_countries: {
            description: 'Array of production countries',
          },
          tags: {
            description: 'Array of tags associated with the content.',
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
          },
          path: {
            description: 'URI to the image file.',
          },
          width: {
            description: 'Width of the image in pixels.',
          },
          height: {
            description: 'Height of the image in pixels.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          movie_images_movie_id_fkey: {
            tags: {
              foreignFieldName: 'images',
            },
          },
        },
      },
      movie_licenses: {
        description:
          'Content metadata license that defines the content availability regions and time frame.',
        attribute: {
          countries: {
            description: 'Array of countries where the license applies.',
          },
          start_time: {
            description: 'Time when license becomes valid.',
          },
          end_time: {
            description: 'Time when license becomes invalid.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          movie_licenses_movie_id_fkey: {
            tags: {
              foreignFieldName: 'licenses',
            },
          },
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
          },
          duration: {
            description: 'Duration of the stream in seconds.',
          },
          audio_languages: {
            description: 'Array of audio languages available in the stream.',
          },
          subtitle_languages: {
            description: 'Array of subtitle languages available in the stream.',
          },
          caption_languages: {
            description: 'Array of caption languages available in the stream.',
          },
          dash_manifest: {
            description: 'URI to a DASH manifest.',
          },
          hls_manifest: {
            description: 'URI to an HLS manifest.',
          },
          is_protected: {
            description: 'Indicates whether a stream is protected with DRM.',
          },
          output_format: {
            description: 'Output format of the stream.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          movie_videos_movie_id_fkey: {
            tags: {
              foreignFieldName: 'videos',
            },
          },
        },
      },
      movie_video_streams: {
        description: 'Video stream DRM metadata',
        attribute: {
          drm_key_id: {
            description: 'DRM Key ID',
          },
          iv: {
            description: 'Initialization Vector of the stream',
          },
          format: {
            description: 'Packaging format of the stream',
          },
          initial_file: {
            description: 'Name of the initial file',
          },
          movie_video_id: {
            tags: {
              name: 'videoId',
            },
          },
          label: {
            description: 'Label indicating the type of stream (audio/video)',
          },
          language_code: {
            description: 'The language code for audio streams',
          },
          bandwidth_in_bps: {
            description: 'The bandwidth of the streams',
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
          foreignKey: ['(movie_genre_id) references movie_genre|@omit many'],
        },
        constraint: {
          movie_genres_relation_movie_id_fkey: {
            tags: {
              foreignFieldName: 'genres',
            },
          },
        },
      },
      movie_genre: {
        description: 'Definition of the movie genre publish format.',
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
      tvshow: {
        description: 'Definition of the TV show publish format.',
        attribute: {
          title: {
            description: 'Title of the TV show.',
          },
          original_title: {
            description: 'Original title of the TV show.',
          },
          synopsis: {
            description: 'Short description of the main plot elements.',
          },
          description: {
            description: 'Extended synopsis.',
          },
          studio: {
            description: 'Name of the producing studio.',
          },
          released: {
            description: 'Date of first release.',
          },
          tvshow_cast: {
            description: 'Cast of the TV show.',
            tags: {
              name: 'cast',
            },
          },
          production_countries: {
            description: 'Array of production countries',
          },
          tags: {
            description: 'Array of tags associated with the content.',
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
          },
          path: {
            description: 'URI to the image file.',
          },
          width: {
            description: 'Width of the image in pixels.',
          },
          height: {
            description: 'Height of the image in pixels.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          tvshow_images_tvshow_id_fkey: {
            tags: {
              foreignFieldName: 'images',
            },
          },
        },
      },
      tvshow_licenses: {
        description:
          'Content metadata license that defines the content availability regions and time frame.',
        attribute: {
          countries: {
            description: 'Array of countries where the license applies.',
          },
          start_time: {
            description: 'Time when license becomes valid.',
          },
          end_time: {
            description: 'Time when license becomes invalid.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          tvshow_licenses_tvshow_id_fkey: {
            tags: {
              foreignFieldName: 'licenses',
            },
          },
        },
      },
      tvshow_videos: {
        description: 'Video stream metadata.',
        attribute: {
          type: {
            description: 'Type of the video stream.',
          },
          title: {
            description: 'Title of the video stream',
          },
          duration: {
            description: 'Duration of the stream in seconds.',
          },
          audio_languages: {
            description: 'Array of audio languages available in the stream.',
          },
          subtitle_languages: {
            description: 'Array of subtitle languages available in the stream.',
          },
          caption_languages: {
            description: 'Array of caption languages available in the stream.',
          },
          dash_manifest: {
            description: 'URI to a DASH manifest.',
          },
          hls_manifest: {
            description: 'URI to an HLS manifest.',
          },
          is_protected: {
            description: 'Indicates whether a stream is protected with DRM.',
          },
          output_format: {
            description: 'Output format of the stream.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          tvshow_videos_tvshow_id_fkey: {
            tags: {
              foreignFieldName: 'videos',
            },
          },
        },
      },
      tvshow_video_streams: {
        description: 'Video stream DRM metadata',
        attribute: {
          drm_key_id: {
            description: 'DRM Key ID',
          },
          iv: {
            description: 'Initialization Vector of the stream',
          },
          format: {
            description: 'Packaging format of the stream',
          },
          initial_file: {
            description: 'Name of the initial file',
          },
          tvshow_video_id: {
            tags: {
              name: 'videoId',
            },
          },
          label: {
            description: 'Label indicating the type of stream (audio/video)',
          },
          language_code: {
            description: 'The language code for audio streams',
          },
          bandwidth_in_bps: {
            description: 'The bandwidth of the streams',
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
          foreignKey: ['(tvshow_genre_id) references tvshow_genre|@omit many'],
        },
        constraint: {
          tvshow_genres_relation_tvshow_id_fkey: {
            tags: {
              foreignFieldName: 'genres',
            },
          },
        },
      },
      tvshow_genre: {
        description: 'Definition of the TV show genre publish format.',
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
      season: {
        description: 'Definition of the TV show season publish format.',
        attribute: {
          index: {
            description: 'Season number',
          },
          synopsis: {
            description: 'Short description of the main plot elements.',
          },
          description: {
            description: 'Extended synopsis.',
          },
          studio: {
            description: 'Name of the producing studio.',
          },
          released: {
            description: 'Date of first release.',
          },
          season_cast: {
            description: 'Cast of the season.',
            tags: {
              name: 'cast',
            },
          },
          production_countries: {
            description: 'Array of production countries',
          },
          tags: {
            description: 'Array of tags associated with the content.',
          },
        },
        tags: {
          omit: 'create,update,delete',
          foreignKey:
            '(tvshow_id) references app_public.tvshow(id)|@fieldName tvshow',
        },
      },
      season_images: {
        description: 'Asset image metadata.',
        attribute: {
          type: {
            description: 'Type of the image.',
          },
          path: {
            description: 'URI to the image file.',
          },
          width: {
            description: 'Width of the image in pixels.',
          },
          height: {
            description: 'Height of the image in pixels.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          season_images_season_id_fkey: {
            tags: {
              foreignFieldName: 'images',
            },
          },
        },
      },
      season_licenses: {
        description:
          'Content metadata license that defines the content availability regions and time frame.',
        attribute: {
          countries: {
            description: 'Array of countries where the license applies.',
          },
          start_time: {
            description: 'Time when license becomes valid.',
          },
          end_time: {
            description: 'Time when license becomes invalid.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          season_licenses_season_id_fkey: {
            tags: {
              foreignFieldName: 'licenses',
            },
          },
        },
      },
      season_videos: {
        description: 'Video stream metadata.',
        attribute: {
          type: {
            description: 'Type of the video stream.',
          },
          title: {
            description: 'Title of the video stream',
          },
          duration: {
            description: 'Duration of the stream in seconds.',
          },
          audio_languages: {
            description: 'Array of audio languages available in the stream.',
          },
          subtitle_languages: {
            description: 'Array of subtitle languages available in the stream.',
          },
          caption_languages: {
            description: 'Array of caption languages available in the stream.',
          },
          dash_manifest: {
            description: 'URI to a DASH manifest.',
          },
          hls_manifest: {
            description: 'URI to an HLS manifest.',
          },
          is_protected: {
            description: 'Indicates whether a stream is protected with DRM.',
          },
          output_format: {
            description: 'Output format of the stream.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          season_videos_season_id_fkey: {
            tags: {
              foreignFieldName: 'videos',
            },
          },
        },
      },
      season_video_streams: {
        description: 'Video stream DRM metadata',
        attribute: {
          drm_key_id: {
            description: 'DRM Key ID',
          },
          iv: {
            description: 'Initialization Vector of the stream',
          },
          format: {
            description: 'Packaging format of the stream',
          },
          initial_file: {
            description: 'Name of the initial file',
          },
          season_video_id: {
            tags: {
              name: 'videoId',
            },
          },
          label: {
            description: 'Label indicating the type of stream (audio/video)',
          },
          language_code: {
            description: 'The language code for audio streams',
          },
          bandwidth_in_bps: {
            description: 'The bandwidth of the streams',
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
          foreignKey: ['(tvshow_genre_id) references tvshow_genre|@omit many'],
        },
        constraint: {
          season_genres_relation_season_id_fkey: {
            tags: {
              foreignFieldName: 'genres',
            },
          },
        },
      },
      episode: {
        description: 'Definition of the TV show episode publish format.',
        attribute: {
          index: {
            description: 'Episode number',
          },
          title: {
            description: 'Title of the episode.',
          },
          original_title: {
            description: 'Original title of the episode.',
          },
          synopsis: {
            description: 'Short description of the main plot elements.',
          },
          description: {
            description: 'Extended synopsis.',
          },
          studio: {
            description: 'Name of the producing studio.',
          },
          released: {
            description: 'Date of first release.',
          },
          episode_cast: {
            description: 'Cast of the episode.',
            tags: {
              name: 'cast',
            },
          },
          tags: {
            description: 'Array of tags associated with the content.',
          },
        },
        tags: {
          omit: 'create,update,delete',
          foreignKey:
            '(season_id) references app_public.season(id)|@fieldName season',
        },
      },
      episode_images: {
        description: 'Asset image metadata.',
        attribute: {
          type: {
            description: 'Type of the image.',
          },
          path: {
            description: 'URI to the image file.',
          },
          width: {
            description: 'Width of the image in pixels.',
          },
          height: {
            description: 'Height of the image in pixels.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          episode_images_episode_id_fkey: {
            tags: {
              foreignFieldName: 'images',
            },
          },
        },
      },
      episode_licenses: {
        description:
          'Content metadata license that defines the content availability regions and time frame.',
        attribute: {
          countries: {
            description: 'Array of countries where the license applies.',
          },
          start_time: {
            description: 'Time when license becomes valid.',
          },
          end_time: {
            description: 'Time when license becomes invalid.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          episode_licenses_episode_id_fkey: {
            tags: {
              foreignFieldName: 'licenses',
            },
          },
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
          },
          duration: {
            description: 'Duration of the stream in seconds.',
          },
          audio_languages: {
            description: 'Array of audio languages available in the stream.',
          },
          subtitle_languages: {
            description: 'Array of subtitle languages available in the stream.',
          },
          caption_languages: {
            description: 'Array of caption languages available in the stream.',
          },
          dash_manifest: {
            description: 'URI to a DASH manifest.',
          },
          hls_manifest: {
            description: 'URI to an HLS manifest.',
          },
          is_protected: {
            description: 'Indicates whether a stream is protected with DRM.',
          },
          output_format: {
            description: 'Output format of the stream.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          episode_videos_episode_id_fkey: {
            tags: {
              foreignFieldName: 'videos',
            },
          },
        },
      },
      episode_video_streams: {
        description: 'Video stream DRM metadata',
        attribute: {
          drm_key_id: {
            description: 'DRM Key ID',
          },
          iv: {
            description: 'Initialization Vector of the stream',
          },
          format: {
            description: 'Packaging format of the stream',
          },
          initial_file: {
            description: 'Name of the initial file',
          },
          episode_video_id: {
            tags: {
              name: 'videoId',
            },
          },
          label: {
            description: 'Label indicating the type of stream (audio/video)',
          },
          language_code: {
            description: 'The language code for audio streams',
          },
          bandwidth_in_bps: {
            description: 'The bandwidth of the streams',
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
          foreignKey: ['(tvshow_genre_id) references tvshow_genre|@omit many'],
        },
        constraint: {
          episode_genres_relation_episode_id_fkey: {
            tags: {
              foreignFieldName: 'genres',
            },
          },
        },
      },
      collection: {
        description: 'Definition of the collection publish format.',
        attribute: {
          title: {
            description: 'Title of the collection.',
          },
          synopsis: {
            description: 'Short description.',
          },
          description: {
            description: 'Longer description.',
          },
          tags: {
            description: 'Array of tags associated with the content.',
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
          },
          path: {
            description: 'URI to the image file.',
          },
          width: {
            description: 'Width of the image in pixels.',
          },
          height: {
            description: 'Height of the image in pixels.',
          },
        },
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
        },
        constraint: {
          collection_images_collection_id_fkey: {
            tags: {
              foreignFieldName: 'images',
            },
          },
        },
      },
      collection_items_relation: {
        tags: {
          omitFromQueryRoot: true,
          omit: 'create,update,delete',
          foreignKey: [
            '(movie_id) references movie|@omit many',
            '(tvshow_id) references tvshow|@omit many',
            '(season_id) references season|@omit many',
            '(episode_id) references episode|@omit many',
          ],
        },
        constraint: {
          collection_items_relation_collection_id_fkey: {
            tags: {
              foreignFieldName: 'items',
            },
          },
        },
      },
    },
  },
});
