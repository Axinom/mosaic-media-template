import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';

export const SmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      'app_public.ingest_documents': {
        tags: { omit: 'create' },
        attribute: {
          in_progress_count: {
            tags: { omit: 'update' },
          },
          error_count: {
            tags: { omit: 'update' },
          },
          success_count: {
            tags: { omit: 'update' },
          },
          status: {
            tags: { omit: 'update' },
          },
          errors: {
            tags: { omit: 'update' },
          },
        },
      },
      'app_public.ingest_items': {
        tags: { omit: 'create,update' },
      },
      'app_public.ingest_item_steps': {
        tags: { omit: 'create,update' },
      },
    },
  },
});
