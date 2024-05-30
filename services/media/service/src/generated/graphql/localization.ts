import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Cursor: any;
  Datetime: any;
  JSON: any;
  UUID: any;
};

export type ActivateLocaleInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  languageTag: Scalars['String'];
};

export type ActivateLocalePayload = {
  __typename?: 'ActivateLocalePayload';
  clientMutationId?: Maybe<Scalars['String']>;
  locale?: Maybe<Locale>;
  query?: Maybe<Query>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Boolean']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Boolean']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Boolean']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Boolean']>>;
};

/**
 * All input for the create `Locale` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type CreateLocaleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Locale` to be created by this mutation. */
  locale: LocaleInput;
};

/** The output of our create `Locale` mutation. */
export type CreateLocalePayload = {
  __typename?: 'CreateLocalePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Locale` that was created by this mutation. */
  locale?: Maybe<Locale>;
  /** An edge for our `Locale`. May be used by Relay 1. */
  localeEdge?: Maybe<LocalesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Locale` mutation. */
export type CreateLocalePayloadLocaleEdgeArgs = {
  orderBy?: InputMaybe<Array<LocalesOrderBy>>;
};

export enum CreateLocaleState {
  /** Active */
  Active = 'ACTIVE',
  /** Inactive */
  Inactive = 'INACTIVE'
}

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']>>;
};

export type DeactivateLocaleInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  languageTag: Scalars['String'];
};

export type DeactivateLocalePayload = {
  __typename?: 'DeactivateLocalePayload';
  clientMutationId?: Maybe<Scalars['String']>;
  locale?: Maybe<Locale>;
  query?: Maybe<Query>;
};

/**
 * All input for the `deleteLocale` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteLocaleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /**
   * @isIdentifierKey()
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  languageTag: Scalars['String'];
};

/** The output of our delete `Locale` mutation. */
export type DeleteLocalePayload = {
  __typename?: 'DeleteLocalePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Locale` that was deleted by this mutation. */
  locale?: Maybe<Locale>;
  /** An edge for our `Locale`. May be used by Relay 1. */
  localeEdge?: Maybe<LocalesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Locale` mutation. */
export type DeleteLocalePayloadLocaleEdgeArgs = {
  orderBy?: InputMaybe<Array<LocalesOrderBy>>;
};

/**
 * All input for the `deleteLocalizationSourceEntity` mutation.
 * @permissions: SOURCE_ENTITIES_EDIT,ADMIN
 */
export type DeleteLocalizationSourceEntityInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `LocalizationSourceEntity` mutation. */
export type DeleteLocalizationSourceEntityPayload = {
  __typename?: 'DeleteLocalizationSourceEntityPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `EntityDefinition` that is related to this `LocalizationSourceEntity`. */
  entityDefinition?: Maybe<EntityDefinition>;
  /** The `LocalizationSourceEntity` that was deleted by this mutation. */
  localizationSourceEntity?: Maybe<LocalizationSourceEntity>;
  /** An edge for our `LocalizationSourceEntity`. May be used by Relay 1. */
  localizationSourceEntityEdge?: Maybe<LocalizationSourceEntitiesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `LocalizationSourceEntity` mutation. */
export type DeleteLocalizationSourceEntityPayloadLocalizationSourceEntityEdgeArgs = {
  orderBy?: InputMaybe<Array<LocalizationSourceEntitiesOrderBy>>;
};

/** @permissions: ENTITY_DEFINITIONS_VIEW,ENTITY_DEFINITIONS_EDIT,SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,ADMIN */
export type EntityDefinition = {
  __typename?: 'EntityDefinition';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  entityType: Scalars['String'];
  /** Reads and enables pagination through a set of `EntityFieldDefinition`. */
  fieldDefinitions: EntityFieldDefinitionsConnection;
  id: Scalars['UUID'];
  isArchived: Scalars['Boolean'];
  /** Reads and enables pagination through a set of `LocalizationSourceEntity`. */
  localizationSourceEntities: LocalizationSourceEntitiesConnection;
  serviceId: Scalars['String'];
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: ENTITY_DEFINITIONS_VIEW,ENTITY_DEFINITIONS_EDIT,SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,ADMIN */
export type EntityDefinitionFieldDefinitionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EntityFieldDefinitionCondition>;
  filter?: InputMaybe<EntityFieldDefinitionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EntityFieldDefinitionsOrderBy>>;
};


/** @permissions: ENTITY_DEFINITIONS_VIEW,ENTITY_DEFINITIONS_EDIT,SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,ADMIN */
export type EntityDefinitionLocalizationSourceEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<LocalizationSourceEntityCondition>;
  filter?: InputMaybe<LocalizationSourceEntityFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LocalizationSourceEntitiesOrderBy>>;
};

/**
 * A condition to be used against `EntityDefinition` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EntityDefinitionCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /**
   * Checks for equality with the object’s `entityType` field.
   * @isTrimmed()
   * @notEmpty()
   */
  entityType?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']>;
  /**
   * Checks for equality with the object’s `serviceId` field.
   * @isTrimmed()
   * @notEmpty()
   */
  serviceId?: InputMaybe<Scalars['String']>;
  /**
   * Checks for equality with the object’s `title` field.
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `EntityDefinition` object types. All fields are combined with a logical ‘and.’ */
export type EntityDefinitionFilter = {
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `entityType` field. */
  entityType?: InputMaybe<StringFilter>;
  /** Filter by the object’s `fieldDefinitions` relation. */
  fieldDefinitions?: InputMaybe<EntityDefinitionToManyEntityFieldDefinitionFilter>;
  /** Some related `fieldDefinitions` exist. */
  fieldDefinitionsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `isArchived` field. */
  isArchived?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `localizationSourceEntities` relation. */
  localizationSourceEntities?: InputMaybe<EntityDefinitionToManyLocalizationSourceEntityFilter>;
  /** Some related `localizationSourceEntities` exist. */
  localizationSourceEntitiesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `serviceId` field. */
  serviceId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/**
 * A connection to a list of `EntityDefinition` values.
 * @permissions: ENTITY_DEFINITIONS_VIEW,ENTITY_DEFINITIONS_EDIT,SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,ADMIN
 */
export type EntityDefinitionsConnection = {
  __typename?: 'EntityDefinitionsConnection';
  /** A list of edges which contains the `EntityDefinition` and cursor to aid in pagination. */
  edges: Array<EntityDefinitionsEdge>;
  /** A list of `EntityDefinition` objects. */
  nodes: Array<EntityDefinition>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EntityDefinition` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EntityDefinition` edge in the connection. */
export type EntityDefinitionsEdge = {
  __typename?: 'EntityDefinitionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EntityDefinition` at the end of the edge. */
  node: EntityDefinition;
};

/** Methods to use when ordering `EntityDefinition`. */
export enum EntityDefinitionsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  EntityTypeAsc = 'ENTITY_TYPE_ASC',
  EntityTypeDesc = 'ENTITY_TYPE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsArchivedAsc = 'IS_ARCHIVED_ASC',
  IsArchivedDesc = 'IS_ARCHIVED_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ServiceIdAsc = 'SERVICE_ID_ASC',
  ServiceIdDesc = 'SERVICE_ID_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** A filter to be used against many `EntityFieldDefinition` object types. All fields are combined with a logical ‘and.’ */
export type EntityDefinitionToManyEntityFieldDefinitionFilter = {
  /** Every related `EntityFieldDefinition` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EntityFieldDefinitionFilter>;
  /** No related `EntityFieldDefinition` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EntityFieldDefinitionFilter>;
  /** Some related `EntityFieldDefinition` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EntityFieldDefinitionFilter>;
};

/** A filter to be used against many `LocalizationSourceEntity` object types. All fields are combined with a logical ‘and.’ */
export type EntityDefinitionToManyLocalizationSourceEntityFilter = {
  /** Every related `LocalizationSourceEntity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<LocalizationSourceEntityFilter>;
  /** No related `LocalizationSourceEntity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<LocalizationSourceEntityFilter>;
  /** Some related `LocalizationSourceEntity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<LocalizationSourceEntityFilter>;
};

/** @permissions: ENTITY_DEFINITIONS_VIEW,ENTITY_DEFINITIONS_EDIT,SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,ADMIN */
export type EntityFieldDefinition = {
  __typename?: 'EntityFieldDefinition';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** Reads a single `EntityDefinition` that is related to this `EntityFieldDefinition`. */
  entityDefinition?: Maybe<EntityDefinition>;
  entityDefinitionId: Scalars['UUID'];
  fieldName: Scalars['String'];
  fieldType: FieldType;
  isActive: Scalars['Boolean'];
  sortIndex: Scalars['Int'];
  title: Scalars['String'];
  uiFieldType: UiFieldType;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  /** Reads and enables pagination through a set of `EntityFieldValidationRule`. */
  validationRules: EntityFieldValidationRulesConnection;
};


/** @permissions: ENTITY_DEFINITIONS_VIEW,ENTITY_DEFINITIONS_EDIT,SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,ADMIN */
export type EntityFieldDefinitionValidationRulesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EntityFieldValidationRuleCondition>;
  filter?: InputMaybe<EntityFieldValidationRuleFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EntityFieldValidationRulesOrderBy>>;
};

/**
 * A condition to be used against `EntityFieldDefinition` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type EntityFieldDefinitionCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `entityDefinitionId` field. */
  entityDefinitionId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `fieldName` field. */
  fieldName?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `fieldType` field. */
  fieldType?: InputMaybe<FieldType>;
  /** Checks for equality with the object’s `isActive` field. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `sortIndex` field. */
  sortIndex?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `title` field.
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `uiFieldType` field. */
  uiFieldType?: InputMaybe<UiFieldType>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `EntityFieldDefinition` object types. All fields are combined with a logical ‘and.’ */
export type EntityFieldDefinitionFilter = {
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `entityDefinition` relation. */
  entityDefinition?: InputMaybe<EntityDefinitionFilter>;
  /** Filter by the object’s `entityDefinitionId` field. */
  entityDefinitionId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `fieldName` field. */
  fieldName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `fieldType` field. */
  fieldType?: InputMaybe<FieldTypeFilter>;
  /** Filter by the object’s `isActive` field. */
  isActive?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `uiFieldType` field. */
  uiFieldType?: InputMaybe<UiFieldTypeFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `validationRules` relation. */
  validationRules?: InputMaybe<EntityFieldDefinitionToManyEntityFieldValidationRuleFilter>;
  /** Some related `validationRules` exist. */
  validationRulesExist?: InputMaybe<Scalars['Boolean']>;
};

/**
 * A connection to a list of `EntityFieldDefinition` values.
 * @permissions: ENTITY_DEFINITIONS_VIEW,ENTITY_DEFINITIONS_EDIT,SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,ADMIN
 */
export type EntityFieldDefinitionsConnection = {
  __typename?: 'EntityFieldDefinitionsConnection';
  /** A list of edges which contains the `EntityFieldDefinition` and cursor to aid in pagination. */
  edges: Array<EntityFieldDefinitionsEdge>;
  /** A list of `EntityFieldDefinition` objects. */
  nodes: Array<EntityFieldDefinition>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EntityFieldDefinition` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EntityFieldDefinition` edge in the connection. */
export type EntityFieldDefinitionsEdge = {
  __typename?: 'EntityFieldDefinitionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EntityFieldDefinition` at the end of the edge. */
  node: EntityFieldDefinition;
};

/** Methods to use when ordering `EntityFieldDefinition`. */
export enum EntityFieldDefinitionsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  EntityDefinitionIdAsc = 'ENTITY_DEFINITION_ID_ASC',
  EntityDefinitionIdDesc = 'ENTITY_DEFINITION_ID_DESC',
  FieldNameAsc = 'FIELD_NAME_ASC',
  FieldNameDesc = 'FIELD_NAME_DESC',
  FieldTypeAsc = 'FIELD_TYPE_ASC',
  FieldTypeDesc = 'FIELD_TYPE_DESC',
  IsActiveAsc = 'IS_ACTIVE_ASC',
  IsActiveDesc = 'IS_ACTIVE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SortIndexAsc = 'SORT_INDEX_ASC',
  SortIndexDesc = 'SORT_INDEX_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UiFieldTypeAsc = 'UI_FIELD_TYPE_ASC',
  UiFieldTypeDesc = 'UI_FIELD_TYPE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** A filter to be used against many `EntityFieldValidationRule` object types. All fields are combined with a logical ‘and.’ */
export type EntityFieldDefinitionToManyEntityFieldValidationRuleFilter = {
  /** Every related `EntityFieldValidationRule` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EntityFieldValidationRuleFilter>;
  /** No related `EntityFieldValidationRule` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EntityFieldValidationRuleFilter>;
  /** Some related `EntityFieldValidationRule` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EntityFieldValidationRuleFilter>;
};

/** @permissions: ENTITY_DEFINITIONS_VIEW,ENTITY_DEFINITIONS_EDIT,SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,ADMIN */
export type EntityFieldValidationRule = {
  __typename?: 'EntityFieldValidationRule';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  entityDefinitionId: Scalars['UUID'];
  /** Reads a single `EntityFieldDefinition` that is related to this `EntityFieldValidationRule`. */
  fieldDefinition?: Maybe<EntityFieldDefinition>;
  fieldName: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  settings?: Maybe<Scalars['JSON']>;
  severity: ValidationSeverity;
  type: FieldValidationRule;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};

/**
 * A condition to be used against `EntityFieldValidationRule` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EntityFieldValidationRuleCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `entityDefinitionId` field. */
  entityDefinitionId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `fieldName` field. */
  fieldName?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `message` field. */
  message?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `settings` field. */
  settings?: InputMaybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `severity` field. */
  severity?: InputMaybe<ValidationSeverity>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<FieldValidationRule>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `EntityFieldValidationRule` object types. All fields are combined with a logical ‘and.’ */
export type EntityFieldValidationRuleFilter = {
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `entityDefinitionId` field. */
  entityDefinitionId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `fieldDefinition` relation. */
  fieldDefinition?: InputMaybe<EntityFieldDefinitionFilter>;
  /** Filter by the object’s `fieldName` field. */
  fieldName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `message` field. */
  message?: InputMaybe<StringFilter>;
  /** Filter by the object’s `severity` field. */
  severity?: InputMaybe<ValidationSeverityFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<FieldValidationRuleFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/**
 * A connection to a list of `EntityFieldValidationRule` values.
 * @permissions: ENTITY_DEFINITIONS_VIEW,ENTITY_DEFINITIONS_EDIT,SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,ADMIN
 */
export type EntityFieldValidationRulesConnection = {
  __typename?: 'EntityFieldValidationRulesConnection';
  /** A list of edges which contains the `EntityFieldValidationRule` and cursor to aid in pagination. */
  edges: Array<EntityFieldValidationRulesEdge>;
  /** A list of `EntityFieldValidationRule` objects. */
  nodes: Array<EntityFieldValidationRule>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EntityFieldValidationRule` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EntityFieldValidationRule` edge in the connection. */
export type EntityFieldValidationRulesEdge = {
  __typename?: 'EntityFieldValidationRulesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EntityFieldValidationRule` at the end of the edge. */
  node: EntityFieldValidationRule;
};

/** Methods to use when ordering `EntityFieldValidationRule`. */
export enum EntityFieldValidationRulesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  EntityDefinitionIdAsc = 'ENTITY_DEFINITION_ID_ASC',
  EntityDefinitionIdDesc = 'ENTITY_DEFINITION_ID_DESC',
  FieldNameAsc = 'FIELD_NAME_ASC',
  FieldNameDesc = 'FIELD_NAME_DESC',
  MessageAsc = 'MESSAGE_ASC',
  MessageDesc = 'MESSAGE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SettingsAsc = 'SETTINGS_ASC',
  SettingsDesc = 'SETTINGS_DESC',
  SeverityAsc = 'SEVERITY_ASC',
  SeverityDesc = 'SEVERITY_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** The details of a failed validation of a source entity localization. */
export type EntityLocalizationValidationMessage = {
  __typename?: 'EntityLocalizationValidationMessage';
  fieldName?: Maybe<Scalars['String']>;
  locale: Scalars['String'];
  message: Scalars['String'];
  severity: EntityLocalizationValidationSeverity;
  type: EntityLocalizationValidationType;
};

/** The severity of a single failed validation of a localization field. */
export enum EntityLocalizationValidationSeverity {
  Error = 'ERROR',
  Warning = 'WARNING'
}

/** The overall status of the source entity localizations validation. */
export enum EntityLocalizationValidationStatus {
  Errors = 'ERRORS',
  Ok = 'OK',
  Warnings = 'WARNINGS'
}

/** The validation type for the source entity localization. */
export enum EntityLocalizationValidationType {
  DataTypeMismatch = 'DATA_TYPE_MISMATCH',
  DefinitionInactive = 'DEFINITION_INACTIVE',
  DefinitionMissing = 'DEFINITION_MISSING',
  FieldsForInactiveLocaleFound = 'FIELDS_FOR_INACTIVE_LOCALE_FOUND',
  Length = 'LENGTH',
  LocalizationMissing = 'LOCALIZATION_MISSING',
  LocalizationSourceMissing = 'LOCALIZATION_SOURCE_MISSING',
  NotApproved = 'NOT_APPROVED',
  Regex = 'REGEX',
  Required = 'REQUIRED'
}

/** Exposes all error codes and messages for errors that a service requests can throw. In some cases, messages that are actually thrown can be different, since they can include more details or a single code can used for different errors of the same type. */
export enum ErrorCodesEnum {
  /** Access Token has expired. */
  AccessTokenExpired = 'ACCESS_TOKEN_EXPIRED',
  /** Access Token is invalid */
  AccessTokenInvalid = 'ACCESS_TOKEN_INVALID',
  /** Access Token is not provided */
  AccessTokenRequired = 'ACCESS_TOKEN_REQUIRED',
  /** Access token verification failed */
  AccessTokenVerificationFailed = 'ACCESS_TOKEN_VERIFICATION_FAILED',
  /** The assertion check for the identifier %s failed. */
  AssertionFailed = 'ASSERTION_FAILED',
  /** Auth config is invalid. */
  AuthConfigInvalid = 'AUTH_CONFIG_INVALID',
  /** Authenticated End User not found. */
  AuthenticatedEndUserNotFound = 'AUTHENTICATED_END_USER_NOT_FOUND',
  /** Authenticated Management Subject not found. */
  AuthenticatedManagementSubjectNotFound = 'AUTHENTICATED_MANAGEMENT_SUBJECT_NOT_FOUND',
  /** A Permission Definition or an EndUserAuthorizationConfig was not found to be passed into Postgraphile build options. This is a development time issue. */
  AuthorizationOptionsMisconfigured = 'AUTHORIZATION_OPTIONS_MISCONFIGURED',
  /** Cannot change the state of the default locale (tried to update "%s" to "%s"). */
  CannotChangeStateOfDefaultLocale = 'CANNOT_CHANGE_STATE_OF_DEFAULT_LOCALE',
  /** Cannot delete an active locale (tried to delete "%s"). */
  CannotDeleteActiveLocale = 'CANNOT_DELETE_ACTIVE_LOCALE',
  /** Cannot delete the default locale when there are still other non-default locales (tried to delete "%s"). */
  CannotDeleteDefaultLocale = 'CANNOT_DELETE_DEFAULT_LOCALE',
  /** A database operation has failed because of a lock timeout. */
  DatabaseLockTimeoutError = 'DATABASE_LOCK_TIMEOUT_ERROR',
  /** An authorization database error has occurred. The user might not have enough permissions. */
  DatabasePermissionsCheckFailed = 'DATABASE_PERMISSIONS_CHECK_FAILED',
  /** An expected and handled database constraint error has occurred. The actual message will have more information. */
  DatabaseValidationFailed = 'DATABASE_VALIDATION_FAILED',
  /** The entity definition was not found. */
  EntityDefinitionNotFound = 'ENTITY_DEFINITION_NOT_FOUND',
  /** All entity field definitions that were found are inactive. Please activate at least one field definition to enable publishing. */
  EntityFieldDefinitionsInactive = 'ENTITY_FIELD_DEFINITIONS_INACTIVE',
  /** The entity field definitions were not found. */
  EntityFieldDefinitionsNotFound = 'ENTITY_FIELD_DEFINITIONS_NOT_FOUND',
  /** The entity field validation rule is not valid. */
  EntityFieldValidationRuleInvalid = 'ENTITY_FIELD_VALIDATION_RULE_INVALID',
  /** This is a wrapper error for the original unhandled error of unsupported type. */
  ErrorWrapper = 'ERROR_WRAPPER',
  /** A GraphQL validation error has occurred. Please make sure that the GraphQL request is made with correct syntax or parameters. */
  GraphqlValidationFailed = 'GRAPHQL_VALIDATION_FAILED',
  /** The Identity service is not accessible. Please contact Axinom support. */
  IdentityServiceNotAccessible = 'IDENTITY_SERVICE_NOT_ACCESSIBLE',
  /** An unhandled and unexpected error has occurred. Please contact the service support. */
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  /** Error occurred while trying to fetch signing keys from the JWKS endpoint for the Tenant/Environment/Application. */
  JwksError = 'JWKS_ERROR',
  /** Passed JWT is not a Mosaic End-User Token. Cannot be verified. */
  JwtIsNotMosaicToken = 'JWT_IS_NOT_MOSAIC_TOKEN',
  /** The locale is already being deleted (tried to delete "%s"). */
  LocaleAlreadyBeingDeleted = 'LOCALE_ALREADY_BEING_DELETED',
  /** The locale was not found. */
  LocaleNotFound = 'LOCALE_NOT_FOUND',
  /** The localization source entity was not found. */
  LocalizationSourceEntityNotFound = 'LOCALIZATION_SOURCE_ENTITY_NOT_FOUND',
  /** Malformed access token received */
  MalformedToken = 'MALFORMED_TOKEN',
  /** The token is not an Authenticated End-User */
  NotAuthenticatedEndUser = 'NOT_AUTHENTICATED_END_USER',
  /** The object is not a AuthenticatedManagementSubject */
  NotAuthenticatedManagementSubject = 'NOT_AUTHENTICATED_MANAGEMENT_SUBJECT',
  /** The object is not a AuthenticatedRequest */
  NotAuthenticatedRequest = 'NOT_AUTHENTICATED_REQUEST',
  /** The token is not an End-User Application */
  NotEndUserApplication = 'NOT_END_USER_APPLICATION',
  /** The object is not an EndUserAuthenticationContext */
  NotEndUserAuthenticationContext = 'NOT_END_USER_AUTHENTICATION_CONTEXT',
  /** The object is not a GenericAuthenticatedSubject */
  NotGenericAuthenticatedSubject = 'NOT_GENERIC_AUTHENTICATED_SUBJECT',
  /** The object is not a ManagementAuthenticationContext */
  NotManagementAuthenticationContext = 'NOT_MANAGEMENT_AUTHENTICATION_CONTEXT',
  /** The %s is missing required properties: %s. */
  ObjectIsMissingProperties = 'OBJECT_IS_MISSING_PROPERTIES',
  /** Could not find a matching signing key to verify the access token. The signing key used to create the token may have been revoked or the Tenant/Environment/Application configuration is erroneous. */
  SigningKeyNotFound = 'SIGNING_KEY_NOT_FOUND',
  /** An application startup error has occurred. The actual message will have more information. */
  StartupError = 'STARTUP_ERROR',
  /** User is authenticated, but subject information was not found. Please contact Axinom Support. */
  SubjectNotFound = 'SUBJECT_NOT_FOUND',
  /** The subject has no permissions. */
  Unauthorized = 'UNAUTHORIZED',
  /** Unexpected null or undefined value received. */
  UnexpectedNullUndefined = 'UNEXPECTED_NULL_UNDEFINED',
  /** An unhandled database-related error has occurred. Please contact the service support. */
  UnhandledDatabaseError = 'UNHANDLED_DATABASE_ERROR',
  /** An unhandled error has occurred. Please contact the service support. */
  UnhandledError = 'UNHANDLED_ERROR',
  /** User is not authorized to access the operation. */
  UserNotAuthorized = 'USER_NOT_AUTHORIZED',
  /** The User service is not accessible. Please contact Axinom support. */
  UserServiceNotAccessible = 'USER_SERVICE_NOT_ACCESSIBLE',
  /** Unable to prepare localizations for publishing because of validation errors. Please re-validate to see the exact errors. */
  ValidationErrorsFound = 'VALIDATION_ERRORS_FOUND',
  /** Either the entity metadata or one of the localizations has changed since the validation was last performed. Please re-validate and try again. */
  ValidationHashMismatch = 'VALIDATION_HASH_MISMATCH',
  /** The %s is not an object. */
  ValueIsNotObject = 'VALUE_IS_NOT_OBJECT',
  /** Websocket not found in ExtendedGraphQLContext. This is a development time issue. A reference to the websocket must be included in Postgraphile build options. */
  WebsocketNotFound = 'WEBSOCKET_NOT_FOUND'
}

export enum FieldType {
  /** string */
  String = 'STRING'
}

/** A filter to be used against FieldType fields. All fields are combined with a logical ‘and.’ */
export type FieldTypeFilter = {
  /** Equal to the specified value. */
  equalTo?: InputMaybe<FieldType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<FieldType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<FieldType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<FieldType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<FieldType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<FieldType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<FieldType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<FieldType>>;
};

export enum FieldValidationRule {
  /** Length */
  Length = 'LENGTH',
  /** RegEx */
  Regex = 'REGEX',
  /** Required */
  Required = 'REQUIRED'
}

/** A filter to be used against FieldValidationRule fields. All fields are combined with a logical ‘and.’ */
export type FieldValidationRuleFilter = {
  /** Equal to the specified value. */
  equalTo?: InputMaybe<FieldValidationRule>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<FieldValidationRule>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<FieldValidationRule>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<FieldValidationRule>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<FieldValidationRule>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<FieldValidationRule>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<FieldValidationRule>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<FieldValidationRule>>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,ADMIN */
export type Locale = {
  __typename?: 'Locale';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  isDefault: Scalars['Boolean'];
  languageTag: Scalars['String'];
  /** Reads and enables pagination through a set of `LocalizedEntity`. */
  localizedEntities: LocalizedEntitiesConnection;
  state: LocaleState;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,ADMIN */
export type LocaleLocalizedEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<LocalizedEntityCondition>;
  filter?: InputMaybe<LocalizedEntityFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LocalizedEntitiesOrderBy>>;
};

/** A condition to be used against `Locale` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type LocaleCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `isDefault` field. */
  isDefault?: InputMaybe<Scalars['Boolean']>;
  /**
   * Checks for equality with the object’s `languageTag` field.
   * @isIdentifierKey()
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  languageTag?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `state` field. */
  state?: InputMaybe<LocaleState>;
  /**
   * Checks for equality with the object’s `title` field.
   * @isTrimmed()
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `Locale` object types. All fields are combined with a logical ‘and.’ */
export type LocaleFilter = {
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `isDefault` field. */
  isDefault?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `languageTag` field. */
  languageTag?: InputMaybe<StringFilter>;
  /** Filter by the object’s `localizedEntities` relation. */
  localizedEntities?: InputMaybe<LocaleToManyLocalizedEntityFilter>;
  /** Some related `localizedEntities` exist. */
  localizedEntitiesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `state` field. */
  state?: InputMaybe<LocaleStateFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Locale` */
export type LocaleInput = {
  isDefault: Scalars['Boolean'];
  /**
   * @isIdentifierKey()
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  languageTag: Scalars['String'];
  state?: InputMaybe<CreateLocaleState>;
  /**
   * @isTrimmed()
   * @notEmpty()
   */
  title: Scalars['String'];
};

/** Represents an update to a `Locale`. Fields that are set will be updated. */
export type LocalePatch = {
  /**
   * Updating the Language Tag value is only allowed for the default language!
   * @isIdentifierKey()
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  languageTag?: InputMaybe<Scalars['String']>;
  /**
   * @isTrimmed()
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `Locale` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,ADMIN
 */
export type LocalesConnection = {
  __typename?: 'LocalesConnection';
  /** A list of edges which contains the `Locale` and cursor to aid in pagination. */
  edges: Array<LocalesEdge>;
  /** A list of `Locale` objects. */
  nodes: Array<Locale>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Locale` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Locale` edge in the connection. */
export type LocalesEdge = {
  __typename?: 'LocalesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Locale` at the end of the edge. */
  node: Locale;
};

/** Methods to use when ordering `Locale`. */
export enum LocalesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  IsDefaultAsc = 'IS_DEFAULT_ASC',
  IsDefaultDesc = 'IS_DEFAULT_DESC',
  LanguageTagAsc = 'LANGUAGE_TAG_ASC',
  LanguageTagDesc = 'LANGUAGE_TAG_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  StateAsc = 'STATE_ASC',
  StateDesc = 'STATE_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

export enum LocaleState {
  /** Active */
  Active = 'ACTIVE',
  /** Deleting */
  Deleting = 'DELETING',
  /** Inactive */
  Inactive = 'INACTIVE'
}

/** A filter to be used against LocaleState fields. All fields are combined with a logical ‘and.’ */
export type LocaleStateFilter = {
  /** Equal to the specified value. */
  equalTo?: InputMaybe<LocaleState>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<LocaleState>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<LocaleState>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<LocaleState>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<LocaleState>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<LocaleState>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<LocaleState>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<LocaleState>>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type LocaleSuggestion = {
  __typename?: 'LocaleSuggestion';
  languageTag: Scalars['String'];
  title?: Maybe<Scalars['String']>;
};

/**
 * A condition to be used against `LocaleSuggestion` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type LocaleSuggestionCondition = {
  /** Checks for equality with the object’s `languageTag` field. */
  languageTag?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `LocaleSuggestion` object types. All fields are combined with a logical ‘and.’ */
export type LocaleSuggestionFilter = {
  /** Filter by the object’s `languageTag` field. */
  languageTag?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/**
 * A connection to a list of `LocaleSuggestion` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN
 */
export type LocaleSuggestionsConnection = {
  __typename?: 'LocaleSuggestionsConnection';
  /** A list of edges which contains the `LocaleSuggestion` and cursor to aid in pagination. */
  edges: Array<LocaleSuggestionsEdge>;
  /** A list of `LocaleSuggestion` objects. */
  nodes: Array<LocaleSuggestion>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `LocaleSuggestion` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `LocaleSuggestion` edge in the connection. */
export type LocaleSuggestionsEdge = {
  __typename?: 'LocaleSuggestionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `LocaleSuggestion` at the end of the edge. */
  node: LocaleSuggestion;
};

/** Methods to use when ordering `LocaleSuggestion`. */
export enum LocaleSuggestionsOrderBy {
  LanguageTagAsc = 'LANGUAGE_TAG_ASC',
  LanguageTagDesc = 'LANGUAGE_TAG_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

/** A filter to be used against many `LocalizedEntity` object types. All fields are combined with a logical ‘and.’ */
export type LocaleToManyLocalizedEntityFilter = {
  /** Every related `LocalizedEntity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<LocalizedEntityFilter>;
  /** No related `LocalizedEntity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<LocalizedEntityFilter>;
  /** Some related `LocalizedEntity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<LocalizedEntityFilter>;
};

/**
 * A connection to a list of `LocalizationSourceEntity` values.
 * @permissions: SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,SETTINGS_EDIT,ADMIN
 */
export type LocalizationSourceEntitiesConnection = {
  __typename?: 'LocalizationSourceEntitiesConnection';
  /** A list of edges which contains the `LocalizationSourceEntity` and cursor to aid in pagination. */
  edges: Array<LocalizationSourceEntitiesEdge>;
  /** A list of `LocalizationSourceEntity` objects. */
  nodes: Array<LocalizationSourceEntity>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `LocalizationSourceEntity` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `LocalizationSourceEntity` edge in the connection. */
export type LocalizationSourceEntitiesEdge = {
  __typename?: 'LocalizationSourceEntitiesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `LocalizationSourceEntity` at the end of the edge. */
  node: LocalizationSourceEntity;
};

/** Methods to use when ordering `LocalizationSourceEntity`. */
export enum LocalizationSourceEntitiesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  EntityDefinitionIdAsc = 'ENTITY_DEFINITION_ID_ASC',
  EntityDefinitionIdDesc = 'ENTITY_DEFINITION_ID_DESC',
  EntityIdAsc = 'ENTITY_ID_ASC',
  EntityIdDesc = 'ENTITY_ID_DESC',
  FieldsAsc = 'FIELDS_ASC',
  FieldsDesc = 'FIELDS_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** @permissions: SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,SETTINGS_EDIT,ADMIN */
export type LocalizationSourceEntity = {
  __typename?: 'LocalizationSourceEntity';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads a single `EntityDefinition` that is related to this `LocalizationSourceEntity`. */
  entityDefinition?: Maybe<EntityDefinition>;
  entityDefinitionId: Scalars['UUID'];
  entityId: Scalars['String'];
  fields?: Maybe<Array<Maybe<LocalizationSourceEntityField>>>;
  id: Scalars['UUID'];
  imageId?: Maybe<Scalars['UUID']>;
  /** Reads and enables pagination through a set of `LocalizedEntity`. */
  localizedEntities: LocalizedEntitiesConnection;
  title?: Maybe<Scalars['String']>;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: SOURCE_ENTITIES_VIEW,SOURCE_ENTITIES_EDIT,LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,SETTINGS_EDIT,ADMIN */
export type LocalizationSourceEntityLocalizedEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<LocalizedEntityCondition>;
  filter?: InputMaybe<LocalizedEntityFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LocalizedEntitiesOrderBy>>;
};

/**
 * A condition to be used against `LocalizationSourceEntity` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type LocalizationSourceEntityCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `entityDefinitionId` field. */
  entityDefinitionId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `entityId` field. */
  entityId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

export type LocalizationSourceEntityField = {
  __typename?: 'LocalizationSourceEntityField';
  fieldName: Scalars['String'];
  fieldValue?: Maybe<Scalars['JSON']>;
};

/** A filter to be used against `LocalizationSourceEntity` object types. All fields are combined with a logical ‘and.’ */
export type LocalizationSourceEntityFilter = {
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `entityDefinition` relation. */
  entityDefinition?: InputMaybe<EntityDefinitionFilter>;
  /** Filter by the object’s `entityDefinitionId` field. */
  entityDefinitionId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `entityId` field. */
  entityId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `imageId` field. */
  imageId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `localizedEntities` relation. */
  localizedEntities?: InputMaybe<LocalizationSourceEntityToManyLocalizedEntityFilter>;
  /** Some related `localizedEntities` exist. */
  localizedEntitiesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** Represents an update to a `LocalizationSourceEntity`. Fields that are set will be updated. */
export type LocalizationSourceEntityPatch = {
  imageId?: InputMaybe<Scalars['UUID']>;
  title?: InputMaybe<Scalars['String']>;
};

export enum LocalizationSourceEntitySubscriptionEventKey {
  LocalizationSourceEntityChanged = 'LOCALIZATION_SOURCE_ENTITY_CHANGED',
  LocalizationSourceEntityCreated = 'LOCALIZATION_SOURCE_ENTITY_CREATED',
  LocalizationSourceEntityDeleted = 'LOCALIZATION_SOURCE_ENTITY_DELETED'
}

export type LocalizationSourceEntitySubscriptionPayload = {
  __typename?: 'LocalizationSourceEntitySubscriptionPayload';
  /** @deprecated Use 'eventKey' instead. */
  event?: Maybe<Scalars['String']>;
  eventKey?: Maybe<LocalizationSourceEntitySubscriptionEventKey>;
  id: Scalars['UUID'];
  localizationSourceEntity?: Maybe<LocalizationSourceEntity>;
};

/** A filter to be used against many `LocalizedEntity` object types. All fields are combined with a logical ‘and.’ */
export type LocalizationSourceEntityToManyLocalizedEntityFilter = {
  /** Every related `LocalizedEntity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<LocalizedEntityFilter>;
  /** No related `LocalizedEntity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<LocalizedEntityFilter>;
  /** Some related `LocalizedEntity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<LocalizedEntityFilter>;
};

/**
 * A connection to a list of `LocalizedEntity` values.
 * @permissions: LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,SOURCE_ENTITIES_EDIT,SETTINGS_EDIT,ADMIN
 */
export type LocalizedEntitiesConnection = {
  __typename?: 'LocalizedEntitiesConnection';
  /** A list of edges which contains the `LocalizedEntity` and cursor to aid in pagination. */
  edges: Array<LocalizedEntitiesEdge>;
  /** A list of `LocalizedEntity` objects. */
  nodes: Array<LocalizedEntity>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `LocalizedEntity` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `LocalizedEntity` edge in the connection. */
export type LocalizedEntitiesEdge = {
  __typename?: 'LocalizedEntitiesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `LocalizedEntity` at the end of the edge. */
  node: LocalizedEntity;
};

/** Methods to use when ordering `LocalizedEntity`. */
export enum LocalizedEntitiesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  EntityDefinitionEntityTypeAsc = 'ENTITY_DEFINITION_ENTITY_TYPE_ASC',
  EntityDefinitionEntityTypeDesc = 'ENTITY_DEFINITION_ENTITY_TYPE_DESC',
  EntityDefinitionServiceIdAsc = 'ENTITY_DEFINITION_SERVICE_ID_ASC',
  EntityDefinitionServiceIdDesc = 'ENTITY_DEFINITION_SERVICE_ID_DESC',
  EntityDefinitionTitleAsc = 'ENTITY_DEFINITION_TITLE_ASC',
  EntityDefinitionTitleDesc = 'ENTITY_DEFINITION_TITLE_DESC',
  FieldsAsc = 'FIELDS_ASC',
  FieldsDesc = 'FIELDS_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LanguageTagAsc = 'LANGUAGE_TAG_ASC',
  LanguageTagDesc = 'LANGUAGE_TAG_DESC',
  LocalizationSourceEntityIdAsc = 'LOCALIZATION_SOURCE_ENTITY_ID_ASC',
  LocalizationSourceEntityIdDesc = 'LOCALIZATION_SOURCE_ENTITY_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RequiresLocalizationAsc = 'REQUIRES_LOCALIZATION_ASC',
  RequiresLocalizationDesc = 'REQUIRES_LOCALIZATION_DESC',
  RequiresReviewAsc = 'REQUIRES_REVIEW_ASC',
  RequiresReviewDesc = 'REQUIRES_REVIEW_DESC',
  SourceEntityTitleAsc = 'SOURCE_ENTITY_TITLE_ASC',
  SourceEntityTitleDesc = 'SOURCE_ENTITY_TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** @permissions: LOCALIZED_ENTITIES_VIEW,LOCALIZED_ENTITIES_EDIT,LOCALIZED_ENTITIES_REVIEW,SOURCE_ENTITIES_EDIT,SETTINGS_EDIT,ADMIN */
export type LocalizedEntity = {
  __typename?: 'LocalizedEntity';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  fields?: Maybe<Array<Maybe<LocalizedEntityField>>>;
  id: Scalars['UUID'];
  languageTag: Scalars['String'];
  /** Reads a single `Locale` that is related to this `LocalizedEntity`. */
  locale?: Maybe<Locale>;
  /** Reads a single `LocalizationSourceEntity` that is related to this `LocalizedEntity`. */
  localizationSourceEntity?: Maybe<LocalizationSourceEntity>;
  localizationSourceEntityId: Scalars['UUID'];
  requiresLocalization: Scalars['Boolean'];
  requiresReview: Scalars['Boolean'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};

/**
 * A condition to be used against `LocalizedEntity` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type LocalizedEntityCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `languageTag` field. */
  languageTag?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `localizationSourceEntityId` field. */
  localizationSourceEntityId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `requiresLocalization` field. */
  requiresLocalization?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `requiresReview` field. */
  requiresReview?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

export type LocalizedEntityField = {
  __typename?: 'LocalizedEntityField';
  fieldName: Scalars['String'];
  fieldValue?: Maybe<Scalars['JSON']>;
  state?: Maybe<LocalizedStateEnum>;
};

/** A filter to be used against `LocalizedEntity` object types. All fields are combined with a logical ‘and.’ */
export type LocalizedEntityFilter = {
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `languageTag` field. */
  languageTag?: InputMaybe<StringFilter>;
  /** Filter by the object’s `locale` relation. */
  locale?: InputMaybe<LocaleFilter>;
  /** Filter by the object’s `localizationSourceEntity` relation. */
  localizationSourceEntity?: InputMaybe<LocalizationSourceEntityFilter>;
  /** Filter by the object’s `localizationSourceEntityId` field. */
  localizationSourceEntityId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `requiresLocalization` field. */
  requiresLocalization?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `requiresReview` field. */
  requiresReview?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

export enum LocalizedEntitySubscriptionEventKey {
  LocalizedEntityChanged = 'LOCALIZED_ENTITY_CHANGED',
  LocalizedEntityCreated = 'LOCALIZED_ENTITY_CREATED',
  LocalizedEntityDeleted = 'LOCALIZED_ENTITY_DELETED'
}

export type LocalizedEntitySubscriptionPayload = {
  __typename?: 'LocalizedEntitySubscriptionPayload';
  /** @deprecated Use 'eventKey' instead. */
  event?: Maybe<Scalars['String']>;
  eventKey?: Maybe<LocalizedEntitySubscriptionEventKey>;
  id: Scalars['UUID'];
  localizedEntity?: Maybe<LocalizedEntity>;
};

/** An input for mutations affecting `LocalizedField` */
export type LocalizedFieldInput = {
  fieldName?: InputMaybe<Scalars['String']>;
  fieldValue?: InputMaybe<Scalars['JSON']>;
  state?: InputMaybe<LocalizedStateEnum>;
};

export enum LocalizedStateEnum {
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  ReviewPending = 'REVIEW_PENDING',
  Untranslated = 'UNTRANSLATED'
}

/** All input for the `localizeEntity` mutation. */
export type LocalizeEntityInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  fields?: InputMaybe<Array<InputMaybe<LocalizedFieldInput>>>;
  localizedEntityId?: InputMaybe<Scalars['UUID']>;
};

/** The output of our `localizeEntity` mutation. */
export type LocalizeEntityPayload = {
  __typename?: 'LocalizeEntityPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Locale` that is related to this `LocalizedEntity`. */
  locale?: Maybe<Locale>;
  /** Reads a single `LocalizationSourceEntity` that is related to this `LocalizedEntity`. */
  localizationSourceEntity?: Maybe<LocalizationSourceEntity>;
  localizedEntity?: Maybe<LocalizedEntity>;
  /** An edge for our `LocalizedEntity`. May be used by Relay 1. */
  localizedEntityEdge?: Maybe<LocalizedEntitiesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our `localizeEntity` mutation. */
export type LocalizeEntityPayloadLocalizedEntityEdgeArgs = {
  orderBy?: InputMaybe<Array<LocalizedEntitiesOrderBy>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  activateLocale?: Maybe<ActivateLocalePayload>;
  /** Creates a single `Locale`. */
  createLocale?: Maybe<CreateLocalePayload>;
  deactivateLocale?: Maybe<DeactivateLocalePayload>;
  /** Deletes a single `Locale` using a unique key. */
  deleteLocale?: Maybe<DeleteLocalePayload>;
  /** Deletes a single `LocalizationSourceEntity` using a unique key. */
  deleteLocalizationSourceEntity?: Maybe<DeleteLocalizationSourceEntityPayload>;
  localizeEntity?: Maybe<LocalizeEntityPayload>;
  populateLocalizations?: Maybe<PopulatePayload>;
  truncateLocalizations?: Maybe<TruncateLocalizationsPayload>;
  /** Updates a single `Locale` using a unique key and a patch. */
  updateLocale?: Maybe<UpdateLocalePayload>;
  /** Updates a single `LocalizationSourceEntity` using a unique key and a patch. */
  updateLocalizationSourceEntity?: Maybe<UpdateLocalizationSourceEntityPayload>;
  upsertLocalizationSourceEntity?: Maybe<UpsertLocalizationSourceEntityPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationActivateLocaleArgs = {
  input: ActivateLocaleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateLocaleArgs = {
  input: CreateLocaleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeactivateLocaleArgs = {
  input: DeactivateLocaleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLocaleArgs = {
  input: DeleteLocaleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLocalizationSourceEntityArgs = {
  input: DeleteLocalizationSourceEntityInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationLocalizeEntityArgs = {
  input: LocalizeEntityInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPopulateLocalizationsArgs = {
  input: PopulateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLocaleArgs = {
  input: UpdateLocaleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLocalizationSourceEntityArgs = {
  input: UpdateLocalizationSourceEntityInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpsertLocalizationSourceEntityArgs = {
  input: UpsertLocalizationSourceEntityInput;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
};

/** Populate Localizations input type */
export type PopulateInput = {
  /** Define how many entity definitions with fields should be created. */
  entityDefinitionsCount?: InputMaybe<Scalars['Int']>;
  /** Define how many locales should be created (if any). No matter the count it will always ensure there is one default locale creating en-US if none exists. */
  localesCount?: InputMaybe<Scalars['Int']>;
  /** Define how many source entities should be created. This would also create the corresponding localized entities and fields. */
  sourceEntitiesCount?: InputMaybe<Scalars['Int']>;
};

export type PopulatePayload = {
  __typename?: 'PopulatePayload';
  entityDefinitionsCount: Scalars['Int'];
  localesCount: Scalars['Int'];
  localizedEntitiesCount: Scalars['Int'];
  query?: Maybe<Query>;
  sourceEntitiesCount: Scalars['Int'];
};

/** The input to prepare localizations of a specific entity for publishing. */
export type PrepareEntityLocalizationsForPublishingInput = {
  /** The ID of an entity whose localizations will be prepared for publishing. */
  entityId: Scalars['String'];
  /** The type name of an entity whose localizations will be prepared for publishing. */
  entityType: Scalars['String'];
  /** The validation hash retrieved by calling the "validateEntityLocalizations" query. */
  hash: Scalars['String'];
  /** The ID of a service to which a source entity belongs. */
  serviceId: Scalars['String'];
};

/** The localizations and metadata of a source entity that are prepared for publishing. */
export type PrepareEntityLocalizationsForPublishingPayload = {
  __typename?: 'PrepareEntityLocalizationsForPublishingPayload';
  /** The ID of an entity whose localizations are prepared for publishing. */
  entityId: Scalars['String'];
  /** The type name of an entity whose localizations are prepared for publishing. */
  entityType: Scalars['String'];
  /**
   * Localizations of a specific source entity that are prepared for publishing. Example:
   *
   * ```json
   * "localizations": [
   *   {
   *     "@isDefaultLocale": true,
   *     "@languageTag": "en-US",
   *     "title": "title source value",
   *     "description": "description source value"
   *   },
   *   {
   *     "@isDefaultLocale": false,
   *     "@languageTag": "de-DE",
   *     "title": "title translated value",
   *     "description": "description translated value"
   *   }
   * ]
   * ```
   */
  localizations: Array<Scalars['JSON']>;
  /** The ID of a service to which a source entity belongs. */
  serviceId: Scalars['String'];
};

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  entityDefinition?: Maybe<EntityDefinition>;
  /** Reads and enables pagination through a set of `EntityDefinition`. */
  entityDefinitions?: Maybe<EntityDefinitionsConnection>;
  locale?: Maybe<Locale>;
  /** Reads and enables pagination through a set of `Locale`. */
  locales?: Maybe<LocalesConnection>;
  /** Reads and enables pagination through a set of `LocaleSuggestion`. */
  localeSuggestions?: Maybe<LocaleSuggestionsConnection>;
  /** Reads and enables pagination through a set of `LocalizationSourceEntity`. */
  localizationSourceEntities?: Maybe<LocalizationSourceEntitiesConnection>;
  localizationSourceEntity?: Maybe<LocalizationSourceEntity>;
  /** Reads and enables pagination through a set of `LocalizedEntity`. */
  localizedEntities?: Maybe<LocalizedEntitiesConnection>;
  localizedEntity?: Maybe<LocalizedEntity>;
  /** Prepares localizations for specific source entity that can be used during publishing. */
  prepareEntityLocalizationsForPublishing: PrepareEntityLocalizationsForPublishingPayload;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Validate all localizations for a specific entity prior to using the data in "prepareEntityLocalizationsForPublishing". */
  validateEntityLocalizations: ValidateEntityLocalizationsPayload;
};


/** The root query type which gives access points into the data universe. */
export type QueryEntityDefinitionArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEntityDefinitionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EntityDefinitionCondition>;
  filter?: InputMaybe<EntityDefinitionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EntityDefinitionsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryLocaleArgs = {
  languageTag: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryLocalesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<LocaleCondition>;
  filter?: InputMaybe<LocaleFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LocalesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryLocaleSuggestionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<LocaleSuggestionCondition>;
  filter?: InputMaybe<LocaleSuggestionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LocaleSuggestionsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryLocalizationSourceEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<LocalizationSourceEntityCondition>;
  filter?: InputMaybe<LocalizationSourceEntityFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LocalizationSourceEntitiesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryLocalizationSourceEntityArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryLocalizedEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<LocalizedEntityCondition>;
  filter?: InputMaybe<LocalizedEntityFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<LocalizedEntitiesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryLocalizedEntityArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPrepareEntityLocalizationsForPublishingArgs = {
  input: PrepareEntityLocalizationsForPublishingInput;
};


/** The root query type which gives access points into the data universe. */
export type QueryValidateEntityLocalizationsArgs = {
  input: ValidateEntityLocalizationsInput;
};

/** An input for mutations affecting `SourceField` */
export type SourceFieldInput = {
  fieldName?: InputMaybe<Scalars['String']>;
  fieldValue?: InputMaybe<Scalars['JSON']>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']>;
};

/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type Subscription = {
  __typename?: 'Subscription';
  /** Triggered when a LocalizationSourceEntity is mutated (insert, update or delete).  */
  localizationSourceEntityMutated?: Maybe<LocalizationSourceEntitySubscriptionPayload>;
  /** Triggered when a LocalizedEntity is mutated (insert, update or delete).  */
  localizedEntityMutated?: Maybe<LocalizedEntitySubscriptionPayload>;
};

export type TruncateLocalizationsPayload = {
  __typename?: 'TruncateLocalizationsPayload';
  completed: Scalars['Boolean'];
};

export enum UiFieldType {
  /** Textarea */
  Textarea = 'TEXTAREA',
  /** Textbox */
  Textbox = 'TEXTBOX'
}

/** A filter to be used against UiFieldType fields. All fields are combined with a logical ‘and.’ */
export type UiFieldTypeFilter = {
  /** Equal to the specified value. */
  equalTo?: InputMaybe<UiFieldType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<UiFieldType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<UiFieldType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<UiFieldType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<UiFieldType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<UiFieldType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<UiFieldType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<UiFieldType>>;
};

/**
 * All input for the `updateLocale` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type UpdateLocaleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /**
   * @isIdentifierKey()
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  languageTag: Scalars['String'];
  /** An object where the defined keys will be set on the `Locale` being updated. */
  patch: LocalePatch;
};

/** The output of our update `Locale` mutation. */
export type UpdateLocalePayload = {
  __typename?: 'UpdateLocalePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Locale` that was updated by this mutation. */
  locale?: Maybe<Locale>;
  /** An edge for our `Locale`. May be used by Relay 1. */
  localeEdge?: Maybe<LocalesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Locale` mutation. */
export type UpdateLocalePayloadLocaleEdgeArgs = {
  orderBy?: InputMaybe<Array<LocalesOrderBy>>;
};

/**
 * All input for the `updateLocalizationSourceEntity` mutation.
 * @permissions: SOURCE_ENTITIES_EDIT,ADMIN
 */
export type UpdateLocalizationSourceEntityInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** An object where the defined keys will be set on the `LocalizationSourceEntity` being updated. */
  patch: LocalizationSourceEntityPatch;
};

/** The output of our update `LocalizationSourceEntity` mutation. */
export type UpdateLocalizationSourceEntityPayload = {
  __typename?: 'UpdateLocalizationSourceEntityPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `EntityDefinition` that is related to this `LocalizationSourceEntity`. */
  entityDefinition?: Maybe<EntityDefinition>;
  /** The `LocalizationSourceEntity` that was updated by this mutation. */
  localizationSourceEntity?: Maybe<LocalizationSourceEntity>;
  /** An edge for our `LocalizationSourceEntity`. May be used by Relay 1. */
  localizationSourceEntityEdge?: Maybe<LocalizationSourceEntitiesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `LocalizationSourceEntity` mutation. */
export type UpdateLocalizationSourceEntityPayloadLocalizationSourceEntityEdgeArgs = {
  orderBy?: InputMaybe<Array<LocalizationSourceEntitiesOrderBy>>;
};

/** All input for the `upsertLocalizationSourceEntity` mutation. */
export type UpsertLocalizationSourceEntityInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  entityId: Scalars['String'];
  entityTitle?: InputMaybe<Scalars['String']>;
  entityType: Scalars['String'];
  fields: Array<InputMaybe<SourceFieldInput>>;
  imageId?: InputMaybe<Scalars['UUID']>;
  serviceId: Scalars['String'];
};

/** The output of our `upsertLocalizationSourceEntity` mutation. */
export type UpsertLocalizationSourceEntityPayload = {
  __typename?: 'UpsertLocalizationSourceEntityPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `EntityDefinition` that is related to this `LocalizationSourceEntity`. */
  entityDefinition?: Maybe<EntityDefinition>;
  localizationSourceEntity?: Maybe<LocalizationSourceEntity>;
  /** An edge for our `LocalizationSourceEntity`. May be used by Relay 1. */
  localizationSourceEntityEdge?: Maybe<LocalizationSourceEntitiesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our `upsertLocalizationSourceEntity` mutation. */
export type UpsertLocalizationSourceEntityPayloadLocalizationSourceEntityEdgeArgs = {
  orderBy?: InputMaybe<Array<LocalizationSourceEntitiesOrderBy>>;
};

/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export type UuidFilter = {
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['UUID']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['UUID']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['UUID']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['UUID']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['UUID']>>;
};

/** The input to validate localizations for a specific entity. */
export type ValidateEntityLocalizationsInput = {
  /** The ID of an entity whose localizations will be validated. */
  entityId: Scalars['String'];
  /** The type name of an entity whose localizations will be validated. */
  entityType: Scalars['String'];
  /** The ID of a service to which a validated entity belongs. */
  serviceId: Scalars['String'];
};

/** The validation result of the source entity localizations. */
export type ValidateEntityLocalizationsPayload = {
  __typename?: 'ValidateEntityLocalizationsPayload';
  query?: Maybe<Query>;
  /** Hash of the source entity localizations to be used during the call to "prepareEntityLocalizationsForPublishing". */
  validationHash?: Maybe<Scalars['String']>;
  /** List of validation messages. */
  validationMessages: Array<EntityLocalizationValidationMessage>;
  /** Validation status of the source entity localizations. */
  validationStatus: EntityLocalizationValidationStatus;
};

export enum ValidationSeverity {
  /** Error */
  Error = 'ERROR',
  /** Warning */
  Warning = 'WARNING'
}

/** A filter to be used against ValidationSeverity fields. All fields are combined with a logical ‘and.’ */
export type ValidationSeverityFilter = {
  /** Equal to the specified value. */
  equalTo?: InputMaybe<ValidationSeverity>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<ValidationSeverity>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<ValidationSeverity>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<ValidationSeverity>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<ValidationSeverity>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<ValidationSeverity>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<ValidationSeverity>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<ValidationSeverity>>;
};

export type PrepareEntityLocalizationsForPublishingQueryVariables = Exact<{
  serviceId: Scalars['String'];
  hash: Scalars['String'];
  entityType: Scalars['String'];
  entityId: Scalars['String'];
}>;


export type PrepareEntityLocalizationsForPublishingQuery = { __typename?: 'Query', prepareEntityLocalizationsForPublishing: { __typename?: 'PrepareEntityLocalizationsForPublishingPayload', localizations: Array<any> } };

export type ValidateEntityLocalizationsQueryVariables = Exact<{
  entityId: Scalars['String'];
  entityType: Scalars['String'];
  serviceId: Scalars['String'];
}>;


export type ValidateEntityLocalizationsQuery = { __typename?: 'Query', validateEntityLocalizations: { __typename?: 'ValidateEntityLocalizationsPayload', validationHash?: string | null, validationStatus: EntityLocalizationValidationStatus, validationMessages: Array<{ __typename?: 'EntityLocalizationValidationMessage', fieldName?: string | null, locale: string, message: string, severity: EntityLocalizationValidationSeverity }> } };


export const PrepareEntityLocalizationsForPublishingDocument = gql`
    query PrepareEntityLocalizationsForPublishing($serviceId: String!, $hash: String!, $entityType: String!, $entityId: String!) {
  prepareEntityLocalizationsForPublishing(
    input: {entityId: $entityId, entityType: $entityType, serviceId: $serviceId, hash: $hash}
  ) {
    localizations
  }
}
    `;
export const ValidateEntityLocalizationsDocument = gql`
    query ValidateEntityLocalizations($entityId: String!, $entityType: String!, $serviceId: String!) {
  validateEntityLocalizations(
    input: {entityId: $entityId, entityType: $entityType, serviceId: $serviceId}
  ) {
    validationHash
    validationStatus
    validationMessages {
      fieldName
      locale
      message
      severity
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const PrepareEntityLocalizationsForPublishingDocumentString = print(PrepareEntityLocalizationsForPublishingDocument);
const ValidateEntityLocalizationsDocumentString = print(ValidateEntityLocalizationsDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    PrepareEntityLocalizationsForPublishing(variables: PrepareEntityLocalizationsForPublishingQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: PrepareEntityLocalizationsForPublishingQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<PrepareEntityLocalizationsForPublishingQuery>(PrepareEntityLocalizationsForPublishingDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PrepareEntityLocalizationsForPublishing', 'query');
    },
    ValidateEntityLocalizations(variables: ValidateEntityLocalizationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: ValidateEntityLocalizationsQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<ValidateEntityLocalizationsQuery>(ValidateEntityLocalizationsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ValidateEntityLocalizations', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;