import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';

export const SmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      'app_public.country_groups_countries': {
        tags: { omit: 'create' },
      },
    },
  },
});
