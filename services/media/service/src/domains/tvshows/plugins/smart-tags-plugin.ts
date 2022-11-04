import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';

export const SmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      'app_public.tvshows_images': {
        tags: { fieldName: 'tvshowsImages' },
        constraint: {
          tvshows_images_pkey: {
            tags: {
              omit: true,
            },
          },
          tvshow_id_image_type_are_unique: {
            tags: {
              fieldName: 'tvshowsImage',
            },
          },
        },
      },
      'app_public.seasons_images': {
        tags: { fieldName: 'seasonsImages' },
        constraint: {
          seasons_images_pkey: {
            tags: {
              omit: true,
            },
          },
          season_id_image_type_are_unique: {
            tags: {
              fieldName: 'seasonsImage',
            },
          },
        },
      },
      'app_public.episodes_images': {
        tags: { fieldName: 'episodesImages' },
        constraint: {
          episodes_images_pkey: {
            tags: {
              omit: true,
            },
          },
          episode_id_image_type_are_unique: {
            tags: {
              fieldName: 'episodesImage',
            },
          },
        },
      },
      'app_public.tvshows_snapshots': {
        tags: { omit: 'all,create,update,delete' },
        constraint: {
          tvshows_snapshots_pkey: {
            tags: {
              omit: true,
            },
          },
        },
      },
      'app_public.seasons_snapshots': {
        tags: { omit: 'all,create,update,delete' },
        constraint: {
          seasons_snapshots_pkey: {
            tags: {
              omit: true,
            },
          },
        },
      },
      'app_public.episodes_snapshots': {
        tags: { omit: 'all,create,update,delete' },
        constraint: {
          episodes_snapshots_pkey: {
            tags: {
              omit: true,
            },
          },
        },
      },
    },
  },
});
