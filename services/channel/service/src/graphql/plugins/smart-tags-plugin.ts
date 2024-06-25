import { makeJSONPgSmartTagsPlugin } from 'graphile-utils';

export const SmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      'app_public.programs': {
        constraint: {
          programs_sort_index_is_unique: {
            tags: {
              omit: true,
            },
          },
        },
      },
      'app_public.channel_images': {
        constraint: {
          channel_id_image_type_are_unique: {
            tags: {
              fieldName: 'channelImage',
            },
          },
        },
      },
      'app_public.cue_point_schedules': {
        attribute: {},
        constraint: {
          cue_point_schedules_sort_index_is_unique: {
            tags: {
              omit: true,
            },
          },
        },
        tags: {
          omit: 'create,update',
        },
      },
    },
  },
});
