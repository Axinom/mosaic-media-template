import {
  DeclareEntityDefinitionCommand,
  EntityFieldDefinition,
} from '@axinom/mosaic-messages';
import { LOCALIZATION_CHANNEL_TYPE } from '../../..//common';

const ChannelFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title',
    description: 'The title of the channel.',
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
    description: 'The description of the channel.',
    sort_index: 2,
    field_validation_rules: [],
  },
];

export const getChannelLocalizationEntityDefinitions = (
  serviceId: string,
): DeclareEntityDefinitionCommand[] => [
  {
    service_id: serviceId,
    entity_type: LOCALIZATION_CHANNEL_TYPE,
    title: 'Channel',
    description: 'Localization entity definition for the channel type.',
    entity_field_definitions: ChannelFieldDefinitions,
  },
];
