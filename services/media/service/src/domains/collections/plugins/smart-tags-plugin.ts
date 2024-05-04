import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';

export const SmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      'app_public.collections_images': {
        tags: { fieldName: 'collectionsImages' },
        constraint: {
          collections_images_pkey: {
            tags: {
              omit: true,
            },
          },
          collection_id_image_type_are_unique: {
            tags: {
              fieldName: 'collectionsImage',
            },
          },
        },
      },
      'app_public.collection_relations': {
        constraint: {
          unique_movie_per_collection: {
            tags: {
              omit: true,
            },
          },
          unique_tvshow_per_collection: {
            tags: {
              omit: true,
            },
          },
          unique_season_per_collection: {
            tags: {
              omit: true,
            },
          },
          unique_episode_per_collection: {
            tags: {
              omit: true,
            },
          },
        },
      },
      'app_public.collections_snapshots': {
        tags: { omit: 'all,create,update,delete' },
        constraint: {
          collections_snapshots_pkey: {
            tags: {
              omit: true,
            },
          },
        },
      },
    },
  },
});
