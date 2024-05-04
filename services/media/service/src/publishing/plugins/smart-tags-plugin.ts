import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';

export const SmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      'app_public.snapshots': {
        description:
          'Snapshots have custom RLS filtering, showing only snapshots of appropriate types based on user permissions.',
        tags: { omit: 'create,update' },
      },
      'app_public.snapshot_validation_results': {
        tags: { omit: 'all,create,update,delete' },
      },
    },
  },
});
