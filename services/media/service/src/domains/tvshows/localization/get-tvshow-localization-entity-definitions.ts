import {
  DeclareEntityDefinitionCommand,
  EntityFieldDefinition,
} from '@axinom/mosaic-messages';
import {
  LOCALIZATION_EPISODE_TYPE,
  LOCALIZATION_SEASON_TYPE,
  LOCALIZATION_TVSHOW_GENRE_TYPE,
  LOCALIZATION_TVSHOW_TYPE,
} from './constants';

export const TvshowFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title',
    description: 'The title of the TV show.',
    sort_index: 1,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'synopsis',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Synopsis',
    description: 'The synopsis of the TV show.',
    sort_index: 2,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description',
    description: 'The description of the TV show.',
    sort_index: 3,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'tvshow_cover_1x1',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized TV Show Cover 1x1 Image',
          imageType: 'tvshow_cover_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Cover 1x1',
    description: 'The cover 1x1 image of the TV show.',
    sort_index: 4,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'tvshow_cover_16x9',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized TV Show Cover 16x9 Image',
          imageType: 'tvshow_cover_16x9',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Cover 16x9',
    description: 'The cover 16x9 image of the TV show.',
    sort_index: 5,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'tvshow_clean_cover_1x1',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized TV Show Clean Cover 1x1 Image',
          imageType: 'tvshow_clean_cover_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Clean Cover 1x1',
    description: 'The clean cover 1x1 image of the TV show.',
    sort_index: 6,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'tvshow_clean_cover_16x9',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized TV Show Clean Cover 16x9 Image',
          imageType: 'tvshow_clean_cover_16x9',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Clean Cover 16x9',
    description: 'The clean cover 16x9 image of the TV show.',
    sort_index: 7,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'tvshow_list_1x1',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized TV Show List 1x1 Image',
          imageType: 'tvshow_list_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'List 1x1',
    description: 'The list 1x1 image of the TV show.',
    sort_index: 8,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'tvshow_list_9x13',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized TV Show List 9x13 Image',
          imageType: 'tvshow_list_9x13',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'List 9x13',
    description: 'The list 9x13 image of the TV show.',
    sort_index: 9,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
];

export const SeasonFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title',
    description: 'The title of the Season.',
    sort_index: 1,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'synopsis',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Synopsis',
    description: 'The synopsis of the season.',
    sort_index: 2,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description',
    description: 'The description of the season.',
    sort_index: 3,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'season_cover_1x1',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Season Cover 1x1 Image',
          imageType: 'season_cover_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Cover 1x1',
    description: 'The cover 1x1 image of the season.',
    sort_index: 4,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'season_cover_16x9',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Season Cover 16x9 Image',
          imageType: 'season_cover_16x9',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Cover 16x9',
    description: 'The cover 16x9 image of the season.',
    sort_index: 5,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'season_clean_cover_1x1',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Season Clean Cover 1x1 Image',
          imageType: 'season_clean_cover_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Clean Cover 1x1',
    description: 'The clean cover 1x1 image of the season.',
    sort_index: 6,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'season_clean_cover_16x9',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Season Clean Cover 16x9 Image',
          imageType: 'season_clean_cover_16x9',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Clean Cover 16x9',
    description: 'The clean cover 16x9 image of the season.',
    sort_index: 7,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'season_list_1x1',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Season List 1x1 Image',
          imageType: 'season_list_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'List 1x1',
    description: 'The list 1x1 image of the season.',
    sort_index: 8,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'season_list_9x13',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Season List 9x13 Image',
          imageType: 'season_list_9x13',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'List 9x13',
    description: 'The list 9x13 image of the season.',
    sort_index: 9,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
];

export const EpisodeFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title',
    description: 'The title of the episode.',
    sort_index: 1,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'synopsis',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Synopsis',
    description: 'The synopsis of the episode.',
    sort_index: 2,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description',
    description: 'The description of the episode.',
    sort_index: 3,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'episode_cover_1x1',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Episode Cover 1x1 Image',
          imageType: 'episode_cover_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Cover 1x1',
    description: 'The cover 1x1 image of the episode.',
    sort_index: 4,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'episode_cover_16x9',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Episode Cover 16x9 Image',
          imageType: 'episode_cover_16x9',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Cover 16x9',
    description: 'The cover 16x9 image of the episode.',
    sort_index: 5,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'episode_clean_cover_1x1',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Episode Clean Cover 1x1 Image',
          imageType: 'episode_clean_cover_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Clean Cover 1x1',
    description: 'The clean cover 1x1 image of the episode.',
    sort_index: 6,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'episode_clean_cover_16x9',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Episode Clean Cover 16x9 Image',
          imageType: 'episode_clean_cover_16x9',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Clean Cover 16x9',
    description: 'The clean cover 16x9 image of the episode.',
    sort_index: 7,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'episode_list_1x1',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Episode List 1x1 Image',
          imageType: 'episode_list_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'List 1x1',
    description: 'The list 1x1 image of the episode.',
    sort_index: 8,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'episode_list_9x13',
    field_type: 'STRING',
    ui_field_type: 'CUSTOM',
    ui_field_custom_definition: {
      view: {
        component: 'single-image-select-field',
        props: {
          disabled: true,
          inlineMode: true,
        },
      },
      edit: {
        component: 'single-image-select-field',
        props: {
          title: 'Select Localized Episode List 9x13 Image',
          imageType: 'episode_list_9x13',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'List 9x13',
    description: 'The list 9x13 image of the episode.',
    sort_index: 9,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
];

export const TvshowGenreFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title',
    description: 'The title of the TV show genre.',
    sort_index: 1,
    field_validation_rules: [
      {
        type: 'REQUIRED',
        settings: { isRequired: true },
        message: 'Title is required.',
        severity: 'ERROR',
      },
    ],
    approval_behavior: 'NOT_REQUIRED',
  },
];

export const getTvshowLocalizationEntityDefinitions = (
  serviceId: string,
): DeclareEntityDefinitionCommand[] => [
  {
    service_id: serviceId,
    entity_type: LOCALIZATION_TVSHOW_TYPE,
    title: 'TV Show',
    description: 'Localization entity definition for the TV show type.',
    entity_field_definitions: TvshowFieldDefinitions,
  },
  {
    service_id: serviceId,
    entity_type: LOCALIZATION_TVSHOW_GENRE_TYPE,
    title: 'TV Show Genre',
    description: 'Localization entity definition for the TV show genre type.',
    entity_field_definitions: TvshowGenreFieldDefinitions,
  },
  {
    service_id: serviceId,
    entity_type: LOCALIZATION_SEASON_TYPE,
    title: 'Season',
    description: 'Localization entity definition for the season type.',
    entity_field_definitions: SeasonFieldDefinitions,
  },
  {
    service_id: serviceId,
    entity_type: LOCALIZATION_EPISODE_TYPE,
    title: 'Episode',
    description: 'Localization entity definition for the episode type.',
    entity_field_definitions: EpisodeFieldDefinitions,
  },
];
