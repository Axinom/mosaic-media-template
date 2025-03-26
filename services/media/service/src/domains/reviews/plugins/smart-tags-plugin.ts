import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';

export const SmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      'app_public.reviews_snapshots': {
        tags: { omit: 'all,create,update,delete' },
        constraint: {
          reviews_snapshots_pkey: {
            tags: {
              omit: true,
            },
          },
        },
      },
    },
  },
});
