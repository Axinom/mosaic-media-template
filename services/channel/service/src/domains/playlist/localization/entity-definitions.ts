import {
  DeclareEntityDefinitionCommand,
  EntityFieldDefinition,
} from '@axinom/mosaic-messages';
import { LOCALIZATION_PROGRAM_TYPE } from '../../..//common';

const ProgramFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title',
    description: 'The title of the program.',
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
];

export const getProgramLocalizationEntityDefinitions = (
  serviceId: string,
): DeclareEntityDefinitionCommand[] => [
  {
    service_id: serviceId,
    entity_type: LOCALIZATION_PROGRAM_TYPE,
    title: 'Program',
    description: 'Localization entity definition for the program type.',
    entity_field_definitions: ProgramFieldDefinitions,
  },
];
