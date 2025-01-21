import {
  DeclareEntityDefinitionCommand,
  EntityFieldDefinition,
} from '@axinom/mosaic-messages';
import { LOCALIZATION_COLLECTION_TYPE } from './constants';

export const CollectionFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title',
    description: 'The title of the collection.',
    sort_index: 1,
    field_validation_rules: [
      {
        type: 'REQUIRED',
        settings: { isRequired: true },
        message: 'Title is required.',
        severity: 'ERROR',
      },
    ],
  },
  {
    field_name: 'synopsis',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Synopsis',
    description: 'The synopsis of the collection.',
    sort_index: 2,
    field_validation_rules: [],
  },
  {
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description',
    description: 'The description of the collection.',
    sort_index: 3,
    field_validation_rules: [],
  },
  {
    field_name: 'collection_cover_1x1',
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
          title: 'Select Localized Collection Cover 1x1 Image',
          imageType: 'collection_cover_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Cover 1x1',
    description: 'The cover 1x1 image of the collection.',
    sort_index: 4,
    field_validation_rules: [],
  },
  {
    field_name: 'collection_cover_4x1',
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
          title: 'Select Localized Collection Cover 4x1 Image',
          imageType: 'collection_cover_4x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Cover 4x1',
    description: 'The cover 4x1 image of the collection.',
    sort_index: 5,
    field_validation_rules: [],
  },
  {
    field_name: 'collection_clean_cover_1x1',
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
          title: 'Select Localized Collection Clean Cover 1x1 Image',
          imageType: 'collection_clean_cover_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Clean Cover 1x1',
    description: 'The clean cover 1x1 image of the collection.',
    sort_index: 6,
    field_validation_rules: [],
  },
  {
    field_name: 'collection_clean_cover_4x1',
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
          title: 'Select Localized Collection Clean Cover 4x1 Image',
          imageType: 'collection_clean_cover_4x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'Clean Cover 4x1',
    description: 'The clean cover 4x1 image of the collection.',
    sort_index: 7,
    field_validation_rules: [],
  },
  {
    field_name: 'collection_list_1x1',
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
          title: 'Select Localized Collection List 1x1 Image',
          imageType: 'collection_list_1x1',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'List 1x1',
    description: 'The list 1x1 image of the collection.',
    sort_index: 8,
    field_validation_rules: [],
  },
  {
    field_name: 'collection_list_15x16',
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
          title: 'Select Localized Collection List 15x16 Image',
          imageType: 'collection_list_15x16',
          inlineMode: true,
        },
        property_map: {
          locale: 'defaultFilterTag',
        },
      },
      fallback_type: 'TEXTBOX',
    },
    title: 'List 15x16',
    description: 'The list 15x16 image of the collection.',
    sort_index: 9,
    field_validation_rules: [],
  },
];

export const getCollectionLocalizationEntityDefinitions = (
  serviceId: string,
): DeclareEntityDefinitionCommand[] => [
  {
    service_id: serviceId,
    entity_type: LOCALIZATION_COLLECTION_TYPE,
    title: 'Collection',
    description: 'Localization entity definition for the collection type.',
    entity_field_definitions: CollectionFieldDefinitions,
  },
];
