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
    title: 'Title field',
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
    title: 'Synopsis field',
    description: 'The synopsis of the collection.',
    sort_index: 2,
    field_validation_rules: [],
  },
  {
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description field',
    description: 'The description of the collection.',
    sort_index: 3,
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
