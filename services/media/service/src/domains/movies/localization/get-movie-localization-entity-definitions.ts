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
    title: 'Title field',
    description: 'The title of the movie.',
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
    description: 'The synopsis of the movie.',
    sort_index: 2,
    field_validation_rules: [],
  },
  {
    field_name: 'description',
    field_type: 'STRING',
    ui_field_type: 'TEXTAREA',
    title: 'Description field',
    description: 'The description of the movie.',
    sort_index: 3,
    field_validation_rules: [],
  },
];

export const MovieGenreFieldDefinitions: EntityFieldDefinition[] = [
  {
    field_name: 'title',
    field_type: 'STRING',
    ui_field_type: 'TEXTBOX',
    title: 'Title field',
    description: 'The title of the movie genre.',
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
