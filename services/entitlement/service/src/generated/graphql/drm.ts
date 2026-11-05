/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { GraphQLClient, type RequestOptions } from 'graphql-request';
import { GraphQLError, print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Cursor: { input: any; output: any; }
  Datetime: { input: any; output: any; }
  Upload: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type CommunicationKey = {
  __typename?: 'CommunicationKey';
  created?: Maybe<Scalars['String']['output']>;
  data: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updated?: Maybe<Scalars['String']['output']>;
};

export type CreateCommunicationKeyInput = {
  data?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateFairPlayDatasetInput = {
  applicationCertificate: Scalars['Upload']['input'];
  applicationSecretKey: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  privateKey: Scalars['Upload']['input'];
  privateKeyPassword?: InputMaybe<Scalars['String']['input']>;
};

export type CreateFairPlayDatasetPayload = {
  __typename?: 'CreateFairPlayDatasetPayload';
  certificateHash: Scalars['String']['output'];
  created: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updated?: Maybe<Scalars['String']['output']>;
};

export type CreateKeySeedInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateWidevineProtectionInfoCredentialInput = {
  providerName: Scalars['String']['input'];
  signingIv?: InputMaybe<Scalars['String']['input']>;
  signingKey?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']['input']>>;
};

export type DeleteCommunicationKeyPayload = {
  __typename?: 'DeleteCommunicationKeyPayload';
  id: Scalars['UUID']['output'];
};

export type DeleteFairPlayDatasetPayload = {
  __typename?: 'DeleteFairPlayDatasetPayload';
  id: Scalars['UUID']['output'];
};

export type DeleteKeySeedPayload = {
  __typename?: 'DeleteKeySeedPayload';
  id: Scalars['UUID']['output'];
};

export type DeleteWidevineProtectionInfoCredentialPayload = {
  __typename?: 'DeleteWidevineProtectionInfoCredentialPayload';
  id: Scalars['UUID']['output'];
};

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
  /** A database operation has failed because of a lock timeout. */
  DatabaseLockTimeoutError = 'DATABASE_LOCK_TIMEOUT_ERROR',
  /** An authorization database error has occurred. The user might not have enough permissions. */
  DatabasePermissionsCheckFailed = 'DATABASE_PERMISSIONS_CHECK_FAILED',
  /** An expected and handled database constraint error has occurred. The actual message will have more information. */
  DatabaseValidationFailed = 'DATABASE_VALIDATION_FAILED',
  /** This is a wrapper error for the original unhandled error of unsupported type. */
  ErrorWrapper = 'ERROR_WRAPPER',
  /** Application Secret Key must be exactly 32 hexadecimal characters (0-9, a-f, A-F). */
  FairplayInvalidApplicationSecretKey = 'FAIRPLAY_INVALID_APPLICATION_SECRET_KEY',
  /** A GraphQL validation error has occurred. Please make sure that the GraphQL request is made with correct syntax or parameters. */
  GraphqlValidationFailed = 'GRAPHQL_VALIDATION_FAILED',
  /** Failed to retrieve data from the ID service. */
  IdServiceRequestFailed = 'ID_SERVICE_REQUEST_FAILED',
  /** The Identity service is not accessible. Please contact Axinom support. */
  IdentityServiceNotAccessible = 'IDENTITY_SERVICE_NOT_ACCESSIBLE',
  /** An unhandled and unexpected error has occurred. Please contact the service support. */
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  /** Error occurred while trying to fetch signing keys from the JWKS endpoint for the Tenant/Environment/Application. */
  JwksError = 'JWKS_ERROR',
  /** Passed JWT is not a Mosaic End-User Token. Cannot be verified. */
  JwtIsNotMosaicToken = 'JWT_IS_NOT_MOSAIC_TOKEN',
  /** Malformed access token received */
  MalformedToken = 'MALFORMED_TOKEN',
  /** No DRM configuration found for the given environment. Please contact Axinom Support. */
  NoDrmConfigurationFound = 'NO_DRM_CONFIGURATION_FOUND',
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
  /** You must be a super user to perform this action. */
  SuperuserPermissionRequired = 'SUPERUSER_PERMISSION_REQUIRED',
  /** The subject has no permissions. */
  Unauthorized = 'UNAUTHORIZED',
  /** Unexpected null or undefined value received. */
  UnexpectedNullUndefined = 'UNEXPECTED_NULL_UNDEFINED',
  /** An unhandled database-related error has occurred. Please contact the service support. */
  UnhandledDatabaseError = 'UNHANDLED_DATABASE_ERROR',
  /** An unhandled error has occurred. Please contact the service support. */
  UnhandledError = 'UNHANDLED_ERROR',
  /** Attempt to create or update an element failed, as it would have resulted in a duplicate element. */
  UniqueConstraintError = 'UNIQUE_CONSTRAINT_ERROR',
  /** User is not authorized to access the operation. */
  UserNotAuthorized = 'USER_NOT_AUTHORIZED',
  /** The User service is not accessible. Please contact Axinom support. */
  UserServiceNotAccessible = 'USER_SERVICE_NOT_ACCESSIBLE',
  /** The %s is not an object. */
  ValueIsNotObject = 'VALUE_IS_NOT_OBJECT',
  /** Websocket not found in ExtendedGraphQLContext. This is a development time issue. A reference to the websocket must be included in Postgraphile build options. */
  WebsocketNotFound = 'WEBSOCKET_NOT_FOUND'
}

export type ExtendAxinomInternalFpCertificateInput = {
  numberOfDays?: InputMaybe<Scalars['Int']['input']>;
};

export type ExtendAxinomInternalFpCertificatePayload = {
  __typename?: 'ExtendAxinomInternalFPCertificatePayload';
  axinomFairPlayCertificateUsageExpires?: Maybe<Scalars['String']['output']>;
};

export type FairPlayDataset = {
  __typename?: 'FairPlayDataset';
  certificateHash: Scalars['String']['output'];
  created: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updated?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type KeySeed = {
  __typename?: 'KeySeed';
  created: Scalars['String']['output'];
  generated: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  madeDefault?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated?: Maybe<Scalars['String']['output']>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  createCommunicationKey: CommunicationKey;
  createFairPlayDataset: CreateFairPlayDatasetPayload;
  createKeySeed: KeySeed;
  createWidevineProtectionInfoCredential: WidevineProtectionInfoCredential;
  deleteCommunicationKey: DeleteCommunicationKeyPayload;
  deleteFairPlayDataset: DeleteFairPlayDatasetPayload;
  deleteKeySeed: DeleteKeySeedPayload;
  deleteWidevineProtectionInfoCredential: DeleteWidevineProtectionInfoCredentialPayload;
  updateCommunicationKey: CommunicationKey;
  updateFairPlayDataset: FairPlayDataset;
  updateKeySeed: KeySeed;
  updateWidevineProtectionInfoConfiguration: WidevineProtectionInfoConfiguration;
  updateWidevineProtectionInfoCredential: WidevineProtectionInfoCredential;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCommunicationKeyArgs = {
  input: CreateCommunicationKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateFairPlayDatasetArgs = {
  input: CreateFairPlayDatasetInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateKeySeedArgs = {
  input: CreateKeySeedInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateWidevineProtectionInfoCredentialArgs = {
  input: CreateWidevineProtectionInfoCredentialInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCommunicationKeyArgs = {
  id: Scalars['UUID']['input'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFairPlayDatasetArgs = {
  id: Scalars['UUID']['input'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteKeySeedArgs = {
  id: Scalars['UUID']['input'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWidevineProtectionInfoCredentialArgs = {
  id: Scalars['UUID']['input'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCommunicationKeyArgs = {
  id: Scalars['UUID']['input'];
  input: UpdateCommunicationKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFairPlayDatasetArgs = {
  id: Scalars['UUID']['input'];
  input: UpdateFairPlayDatasetInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateKeySeedArgs = {
  id: Scalars['UUID']['input'];
  input: UpdateKeySeedInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWidevineProtectionInfoConfigurationArgs = {
  input: UpdateWidevineProtectionInfoConfigurationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWidevineProtectionInfoCredentialArgs = {
  id: Scalars['UUID']['input'];
  input: UpdateWidevineProtectionInfoCredentialInput;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  communicationKey?: Maybe<CommunicationKey>;
  communicationKeys: Array<CommunicationKey>;
  fairPlayDataset?: Maybe<FairPlayDataset>;
  fairPlayDatasets: Array<FairPlayDataset>;
  keySeed?: Maybe<KeySeed>;
  keySeeds: Array<KeySeed>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  serviceConfiguration?: Maybe<ServiceConfiguration>;
  /** Reads and enables pagination through a set of `ServiceConfiguration`. */
  serviceConfigurations?: Maybe<ServiceConfigurationsConnection>;
  widevineProtectionInfoConfiguration: WidevineProtectionInfoConfiguration;
  widevineProtectionInfoCredential: WidevineProtectionInfoCredential;
  widevineProtectionInfoCredentials: Array<WidevineProtectionInfoCredential>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCommunicationKeyArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFairPlayDatasetArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryKeySeedArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryServiceConfigurationArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryServiceConfigurationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ServiceConfigurationCondition>;
  filter?: InputMaybe<ServiceConfigurationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ServiceConfigurationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryWidevineProtectionInfoCredentialArgs = {
  id: Scalars['UUID']['input'];
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type ServiceConfiguration = {
  __typename?: 'ServiceConfiguration';
  axinomFairPlayCertificateUsageExpires?: Maybe<Scalars['String']['output']>;
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  drmTenantId: Scalars['UUID']['output'];
  environmentId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  tenantId: Scalars['UUID']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/**
 * A condition to be used against `ServiceConfiguration` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type ServiceConfigurationCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `drmTenantId` field. */
  drmTenantId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `environmentId` field. */
  environmentId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `tenantId` field. */
  tenantId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `ServiceConfiguration` object types. All fields are combined with a logical ‘and.’ */
export type ServiceConfigurationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ServiceConfigurationFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `drmTenantId` field. */
  drmTenantId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `environmentId` field. */
  environmentId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ServiceConfigurationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ServiceConfigurationFilter>>;
  /** Filter by the object’s `tenantId` field. */
  tenantId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/**
 * A connection to a list of `ServiceConfiguration` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN
 */
export type ServiceConfigurationsConnection = {
  __typename?: 'ServiceConfigurationsConnection';
  /** A list of edges which contains the `ServiceConfiguration` and cursor to aid in pagination. */
  edges: Array<ServiceConfigurationsEdge>;
  /** A list of `ServiceConfiguration` objects. */
  nodes: Array<ServiceConfiguration>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ServiceConfiguration` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `ServiceConfiguration` edge in the connection. */
export type ServiceConfigurationsEdge = {
  __typename?: 'ServiceConfigurationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ServiceConfiguration` at the end of the edge. */
  node: ServiceConfiguration;
};

/** Methods to use when ordering `ServiceConfiguration`. */
export enum ServiceConfigurationsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DrmTenantIdAsc = 'DRM_TENANT_ID_ASC',
  DrmTenantIdDesc = 'DRM_TENANT_ID_DESC',
  EnvironmentIdAsc = 'ENVIRONMENT_ID_ASC',
  EnvironmentIdDesc = 'ENVIRONMENT_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TenantIdAsc = 'TENANT_ID_ASC',
  TenantIdDesc = 'TENANT_ID_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCommunicationKeyInput = {
  data: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFairPlayDatasetInput = {
  applicationCertificate: Scalars['Upload']['input'];
  applicationSecretKey: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  privateKey: Scalars['Upload']['input'];
  privateKeyPassword?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateKeySeedInput = {
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateWidevineProtectionInfoConfigurationInput = {
  playReadyLaUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWidevineProtectionInfoCredentialInput = {
  providerName: Scalars['String']['input'];
  signingIv: Scalars['String']['input'];
  signingKey: Scalars['String']['input'];
};

/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export type UuidFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

export type WidevineProtectionInfoConfiguration = {
  __typename?: 'WidevineProtectionInfoConfiguration';
  created?: Maybe<Scalars['String']['output']>;
  playReadyLaUrl?: Maybe<Scalars['String']['output']>;
  updated?: Maybe<Scalars['String']['output']>;
};

export type WidevineProtectionInfoCredential = {
  __typename?: 'WidevineProtectionInfoCredential';
  id: Scalars['UUID']['output'];
  providerName: Scalars['String']['output'];
  signingIv: Scalars['String']['output'];
  signingKey: Scalars['String']['output'];
};

export type GetDrmSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDrmSettingsQuery = { communicationKeys: Array<{ id: any, data: string, created: string | null }>, serviceConfigurations: { nodes: Array<{ drmTenantId: any, axinomFairPlayCertificateUsageExpires: string | null }> } | null, fairPlayDatasets: Array<{ url: string }> };


export const GetDrmSettingsDocument = gql`
    query GetDrmSettings {
  communicationKeys {
    id
    data
    created
  }
  serviceConfigurations {
    nodes {
      drmTenantId
      axinomFairPlayCertificateUsageExpires
    }
  }
  fairPlayDatasets {
    url
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();
const GetDrmSettingsDocumentString = print(GetDrmSettingsDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetDrmSettings(variables?: GetDrmSettingsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetDrmSettingsQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetDrmSettingsQuery>(GetDrmSettingsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetDrmSettings', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;