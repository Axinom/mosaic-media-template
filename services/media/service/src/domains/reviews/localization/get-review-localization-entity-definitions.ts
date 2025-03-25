import {
  DeclareEntityDefinitionCommand,
  EntityFieldDefinition,
} from '@axinom/mosaic-messages';
import { LOCALIZATION_REVIEW_TYPE } from './constants';

export const ReviewFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title',
    description: 'The title of the review.',
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
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description',
    description: 'The description of the review.',
    sort_index: 2,
    field_validation_rules: [
      {
        type: 'REQUIRED',
        settings: { isRequired: true },
        message: 'Description is required.',
        severity: 'ERROR',
      },
    ],
  },
];

export const getReviewLocalizationEntityDefinitions = (
  serviceId: string,
): DeclareEntityDefinitionCommand[] => [
  {
    service_id: serviceId,
    entity_type: LOCALIZATION_REVIEW_TYPE,
    title: 'Review',
    description: 'Localization entity definition for the review type.',
    entity_field_definitions: ReviewFieldDefinitions,
  },
];
