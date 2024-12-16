import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';

export const SmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      'app_public.movies_images': {
        tags: { fieldName: 'moviesImages' },
        constraint: {
          movies_images_pkey: {
            tags: {
              omit: true,
            },
          },
          movie_id_image_type_are_unique: {
            tags: {
              fieldName: 'moviesImage',
            },
          },
        },
      },
      'app_public.movies_snapshots': {
        tags: { omit: 'all,create,update,delete' },
        constraint: {
          movies_snapshots_pkey: {
            tags: {
              omit: true,
            },
          },
        },
      },
      'app_public.movies': {
        constraint: {
          movies_age_rating_fkey: {
            tags: {
              omit: true,
            },
          },
          movies_content_owner_fkey: {
            tags: {
              omit: true,
            },
          },
        },
      },
    },
  },
});
