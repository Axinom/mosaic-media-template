import {
  DeclareEntityDefinitionCommand,
  EntityFieldDefinition,
} from '@axinom/mosaic-messages';
import {
  LOCALIZATION_MOVIE_GENRE_TYPE,
  LOCALIZATION_MOVIE_TYPE,
} from './constants';

export const MovieFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title',
    description: 'The title of the movie.',
    sort_index: 1,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'synopsis',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Synopsis',
    description: 'The synopsis of the movie.',
    sort_index: 2,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description',
    description: 'The description of the movie.',
    sort_index: 3,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'movie_cover_1x1',
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
          title: 'Select Localized Movie Cover 1x1 Image',
          imageType: 'movie_cover_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Cover 1x1',
    description: 'The cover 1x1 image of the movie.',
    sort_index: 4,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'movie_cover_16x9',
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
          title: 'Select Localized Movie Cover 16x9 Image',
          imageType: 'movie_cover_16x9',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Cover 16x9',
    description: 'The cover 16x9 image of the movie.',
    sort_index: 5,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'movie_clean_cover_1x1',
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
          title: 'Select Localized Movie Clean Cover 1x1 Image',
          imageType: 'movie_clean_cover_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Clean Cover 1x1',
    description: 'The clean cover 1x1 image of the movie.',
    sort_index: 6,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'movie_clean_cover_16x9',
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
          title: 'Select Localized Movie Clean Cover 16x9 Image',
          imageType: 'movie_clean_cover_16x9',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Clean Cover 16x9',
    description: 'The clean cover 16x9 image of the movie.',
    sort_index: 7,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'movie_list_1x1',
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
          title: 'Select Localized Movie Cover Image',
          imageType: 'movie_list_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'List 1x1',
    description: 'The list 1x1 image of the movie.',
    sort_index: 8,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
  {
    field_name: 'movie_list_9x13',
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
          title: 'Select Localized Movie Cover Image',
          imageType: 'movie_list_9x13',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'List 9x13',
    description: 'The list 9x13 image of the movie.',
    sort_index: 9,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
];

export const MovieGenreFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title',
    description: 'The title of the movie genre.',
    sort_index: 1,
    field_validation_rules: [],
    approval_behavior: 'NOT_REQUIRED',
  },
];

export const getMovieLocalizationEntityDefinitions = (
  serviceId: string,
): DeclareEntityDefinitionCommand[] => [
  {
    service_id: serviceId,
    entity_type: LOCALIZATION_MOVIE_TYPE,
    title: 'Movie',
    description: 'Localization entity definition for the movie type.',
    entity_field_definitions: MovieFieldDefinitions,
  },
  {
    service_id: serviceId,
    entity_type: LOCALIZATION_MOVIE_GENRE_TYPE,
    title: 'Movie Genre',
    description: 'Localization entity definition for the movie genre type.',
    entity_field_definitions: MovieGenreFieldDefinitions,
  },
];
