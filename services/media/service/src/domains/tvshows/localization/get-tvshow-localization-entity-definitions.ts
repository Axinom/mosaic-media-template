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
    description: 'The synopsis of the TV show.',
    sort_index: 2,
    field_validation_rules: [],
  },
  {
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description',
    description: 'The description of the TV show.',
    sort_index: 3,
    field_validation_rules: [],
  },
];

export const SeasonFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'synopsis',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Synopsis',
    description: 'The synopsis of the season.',
    sort_index: 2,
    field_validation_rules: [],
  },
  {
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description',
    description: 'The description of the season.',
    sort_index: 3,
    field_validation_rules: [],
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
    description: 'The synopsis of the episode.',
    sort_index: 2,
    field_validation_rules: [],
  },
  {
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description',
    description: 'The description of the episode.',
    sort_index: 3,
    field_validation_rules: [],
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
