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
};

export type AuthenticateManagedServiceAccountInput = {
  /** Managed Service Account ID. */
  clientId: Scalars['String'];
  /** Managed Service Account Password. */
  clientSecret: Scalars['String'];
  /** Environment ID to be used in resulting AccessToken. If not provided, Root Environment ID will be used. */
  targetEnvironmentId?: InputMaybe<Scalars['String']>;
  /** Tenant ID to be used in resulting AccessToken. If not provided, Root Tenant ID will be used. */
  targetTenantId?: InputMaybe<Scalars['String']>;
};

export type AuthenticateManagedServiceAccountPayload = {
  __typename?: 'AuthenticateManagedServiceAccountPayload';
  /** Access Token containing permissions of the Service Account */
  accessToken: Scalars['String'];
  /** Access Token expiration timeout */
  expiresInSeconds: Scalars['Int'];
  /** Access Token type to use when making client requests */
  tokenType: Scalars['String'];
};

export type AuthenticateManagedServiceAccountWithEnvironmentScopeInput = {
  /** Managed Service Account ID. */
  clientId: Scalars['String'];
  /** Managed Service Account Password. */
  clientSecret: Scalars['String'];
  /**
   * A Management JWT authenticated by the Mosaic ID Service.
   * The Tenant and Environment IDs in this JWT is used to scope
   * the Managed Service Account Token to a specific Environment.
   */
  managementJWT: Scalars['String'];
};

export type AuthenticateServiceAccountInput = {
  /** Service Account ID. */
  clientId: Scalars['String'];
  /** Service Account Password. */
  clientSecret: Scalars['String'];
};

export type AuthenticateServiceAccountPayload = {
  __typename?: 'AuthenticateServiceAccountPayload';
  /** Access Token containing permissions of the Service Account */
  accessToken: Scalars['String'];
  /** Access Token expiration timeout */
  expiresInSeconds: Scalars['Int'];
  /** Access Token type to use when making client requests */
  tokenType: Scalars['String'];
};

export type CreateDevServiceAccountInput = {
  /** Optional Environment ID to use for service account. If not specified will default to configured dev value. */
  environmentId?: InputMaybe<Scalars['String']>;
  /**
   * Example:
   *
   * permissionStructure: [
   *   {
   *     serviceId: "media-service",
   *     permissions: ["ADMIN", "MOVIES_EDIT"]
   *   },
   *   {
   *     serviceId: "ax-video-service",
   *     permissions: ["ADMIN", "VIDEOS_EDIT"]
   *   }
   * ]
   */
  permissionStructure: Array<InputMaybe<DevPermissionStructureInput>>;
  /** Service account name. */
  serviceAccountName: Scalars['String'];
  /** Optional tenant ID to use for service account. If not specified will default to configured dev value. */
  tenantId?: InputMaybe<Scalars['String']>;
};

export type CreateDevServiceAccountPayload = {
  __typename?: 'CreateDevServiceAccountPayload';
  clientId: Scalars['String'];
  clientSecret: Scalars['String'];
  environmentId: Scalars['String'];
  serviceAccountName: Scalars['String'];
  tenantId: Scalars['String'];
};

export type DevDeleteServiceAccountInput = {
  /** Client ID of the Service Account to be deleted */
  clientId: Scalars['String'];
};

export type DevDeleteServiceAccountPayload = {
  __typename?: 'DevDeleteServiceAccountPayload';
  /** Indicates if the permission structure was deleted successfully */
  isSuccess: Scalars['Boolean'];
};

export type DevGenerateUserAccessTokenWithPermissionsInput = {
  /**
   * Email address the user token will be generated against.
   * If not given, a pseudo user with following metadata data will be used for generating the token.
   *
   * name: **DEV**
   * email: dev@domain.local
   * id: 00000000-0000-0000-0000-000000000000
   */
  email?: InputMaybe<Scalars['String']>;
  /**
   * If set to true, the permissions will be validated against existing permissions.
   * If any invalid permissions exist, the setup operation will be aborted.
   */
  enforceValidPermissionStructure?: InputMaybe<Scalars['Boolean']>;
  /**
   * Permission Structure for the new account.
   * This is an array of shape {serviceId: String!, permissions: [String!]}
   */
  permissionStructure?: InputMaybe<Array<InputMaybe<PermissionStructure>>>;
  /** Token Expiration time in seconds. If not given, this will be defaulted to 30 days. */
  tokenExpirationInSeconds?: InputMaybe<Scalars['Int']>;
};

export type DevGenerateUserAccessTokenWithPermissionsPayload = {
  __typename?: 'DevGenerateUserAccessTokenWithPermissionsPayload';
  /** Access token with requested permissions. */
  accessToken: Scalars['String'];
  expiresInSeconds: Scalars['Int'];
  tokenType: Scalars['String'];
};

export type DevPermissionStructureInput = {
  permissions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  serviceId: Scalars['String'];
};

export type DevSetupServiceAccountWithPermissionsInput = {
  /**
   * If set to true, the permissions will be validated against existing permissions.
   * If any invalid permissions exist, the setup operation will be aborted.
   */
  enforceValidPermissionStructure?: InputMaybe<Scalars['Boolean']>;
  /**
   * Permission Structure for the new account.
   * This is an array of shape {serviceId: String!, permissions: [String!]}
   */
  permissionStructure?: InputMaybe<Array<InputMaybe<PermissionStructure>>>;
  /** Service Account Name */
  serviceAccountName: Scalars['String'];
};

export type DevSetupServiceAccountWithPermissionsPayload = {
  __typename?: 'DevSetupServiceAccountWithPermissionsPayload';
  /** Client ID of the created service account. */
  clientId: Scalars['String'];
  /** Client Secret of the created service account. */
  clientSecret: Scalars['String'];
};

export type DevUpdateServiceAccountPermissionStructureInput = {
  /** Client ID of the Service Account to be updated */
  clientId: Scalars['String'];
  /**
   * If set to true, the permissions will be validated against existing permissions.
   * If any invalid permissions exist, the setup operation will be aborted.
   */
  enforceValidPermissionStructure?: InputMaybe<Scalars['Boolean']>;
  /**
   * Permission Structure for the new account.
   * This is an array of shape {serviceId: String!, permissions: [String!]}
   */
  permissionStructure?: InputMaybe<Array<InputMaybe<PermissionStructure>>>;
};

export type DevUpdateServiceAccountPermissionStructurePayload = {
  __typename?: 'DevUpdateServiceAccountPermissionStructurePayload';
  /** Indicates if the permission structure was updated successfully */
  isSuccess: Scalars['Boolean'];
};

export type EnabledManagedServicesPayload = {
  __typename?: 'EnabledManagedServicesPayload';
  /** Enabled Managed Service Name */
  name: Scalars['String'];
  /** Enabled Managed Service ID */
  serviceId: Scalars['String'];
};

/** Exposes all error codes and messages for errors that a service requests can throw. In some cases, messages that are actually thrown can be different, since they can include more details or a single code can used for different errors of the same type. */
export enum ErrorCodesEnum {
  /** Access Token has expired. */
  AccessTokenExpired = 'ACCESS_TOKEN_EXPIRED',
  /** Access Token is invalid */
  AccessTokenInvalid = 'ACCESS_TOKEN_INVALID',
  /** Access Token Lifetime must be greater than or equal to 30. */
  AccessTokenLifetimeInsufficient = 'ACCESS_TOKEN_LIFETIME_INSUFFICIENT',
  /** Access token not received during idp token refresh in idpTokenMiddleware. */
  AccessTokenNotReceived = 'ACCESS_TOKEN_NOT_RECEIVED',
  /** Error while refreshing the IDP access token using the IDP refresh token. */
  AccessTokenRefreshError = 'ACCESS_TOKEN_REFRESH_ERROR',
  /** Access Token is not provided */
  AccessTokenRequired = 'ACCESS_TOKEN_REQUIRED',
  /** Access token verification failed */
  AccessTokenVerificationFailed = 'ACCESS_TOKEN_VERIFICATION_FAILED',
  /** The email has not yet been verified for use. Please check your inbox for verification instructions. */
  AccountNotVerified = 'ACCOUNT_NOT_VERIFIED',
  /** An active signing key already exists for the application. */
  ActiveSigningKeyExists = 'ACTIVE_SIGNING_KEY_EXISTS',
  /** The assertion check for the identifier %s failed. */
  AssertionFailed = 'ASSERTION_FAILED',
  /** Auth Callback Error */
  AuthCallbackError = 'AUTH_CALLBACK_ERROR',
  /** Auth config is invalid. */
  AuthConfigInvalid = 'AUTH_CONFIG_INVALID',
  /** Authenticated End User not found. */
  AuthenticatedEndUserNotFound = 'AUTHENTICATED_END_USER_NOT_FOUND',
  /** Authenticated Management Subject not found. */
  AuthenticatedManagementSubjectNotFound = 'AUTHENTICATED_MANAGEMENT_SUBJECT_NOT_FOUND',
  /** A Permission Definition or an EndUserAuthorizationConfig was not found to be passed into Postgraphile build options. This is a development time issue. */
  AuthorizationOptionsMisconfigured = 'AUTHORIZATION_OPTIONS_MISCONFIGURED',
  /** Permission synchronization is allowed for Service IDs that start with `ax-` only with Managed Service Accounts. */
  AxServicePermissionSyncNotAllowed = 'AX_SERVICE_PERMISSION_SYNC_NOT_ALLOWED',
  /** Bad Request */
  BadRequest = 'BAD_REQUEST',
  /** Basic Data has not been setup. Please run the [_DEV_setupIdBasicData] mutation. */
  BasicDataNotSetup = 'BASIC_DATA_NOT_SETUP',
  /** Cannot change the state while the service [%s] has a pending state change. No action was performed. */
  CannotChangeStateWhenPending = 'CANNOT_CHANGE_STATE_WHEN_PENDING',
  /** Cannot change the state for the service [%s] when it has a failed state change attempt, please retry the previous action. No action was performed. */
  CannotChangeStateWithError = 'CANNOT_CHANGE_STATE_WITH_ERROR',
  /** Service [%s] is a core-service and cannot be disabled. No action was performed. */
  CannotDisableCoreService = 'CANNOT_DISABLE_CORE_SERVICE',
  /** Unable to enable Tenant as there are currently no Tenant Administrators in active state. */
  CannotEnableTenant = 'CANNOT_ENABLE_TENANT',
  /** Client ID and Client Secret are required to enable the identity provider. */
  ClientIdSecretRequired = 'CLIENT_ID_SECRET_REQUIRED',
  /** Error updating service account client secret. */
  ClientSecretUpdateFailed = 'CLIENT_SECRET_UPDATE_FAILED',
  /** The service [%s] does not support the [%s] command. */
  CommandNotSupported = 'COMMAND_NOT_SUPPORTED',
  /** Contains invalid permissions. */
  ContainsInvalidPermissions = 'CONTAINS_INVALID_PERMISSIONS',
  /** Custom branding is not allowed for this identity provider. */
  CustomBrandingNotAllowed = 'CUSTOM_BRANDING_NOT_ALLOWED',
  /** customStepFunctionName missing in orchestration step. */
  CustomStepFunctionNameMissing = 'CUSTOM_STEP_FUNCTION_NAME_MISSING',
  /** A database operation has failed because of a lock timeout. */
  DatabaseLockTimeoutError = 'DATABASE_LOCK_TIMEOUT_ERROR',
  /** An authorization database error has occurred. The user might not have enough permissions. */
  DatabasePermissionsCheckFailed = 'DATABASE_PERMISSIONS_CHECK_FAILED',
  /** An expected and handled database constraint error has occurred. The actual message will have more information. */
  DatabaseValidationFailed = 'DATABASE_VALIDATION_FAILED',
  /** Error accessing database. */
  DbAccessError = 'DB_ACCESS_ERROR',
  /** The account is not activated. Please contact another Tenant Administrator or Axinom Support to activate the account. */
  EnvAdminAccountNotActive = 'ENV_ADMIN_ACCOUNT_NOT_ACTIVE',
  /** Either the account or the tenant is not enabled for usage. */
  EnvAdminOrTenantNotActive = 'ENV_ADMIN_OR_TENANT_NOT_ACTIVE',
  /** Cannot enable the environment when the initialization status is not [Completed]. */
  EnvInitializationNotCompleted = 'ENV_INITIALIZATION_NOT_COMPLETED',
  /** Environment [%s] is not enabled for use. */
  EnvironmentNotActive = 'ENVIRONMENT_NOT_ACTIVE',
  /** The environment is not enabled for use. Please contact your Tenant Administrator or Axinom Support. */
  EnvironmentNotEnabled = 'ENVIRONMENT_NOT_ENABLED',
  /** Environment [%s] not found. */
  EnvironmentNotFound = 'ENVIRONMENT_NOT_FOUND',
  /** An error occurred while generating long lived token. */
  ErrorGeneratingLongLivedToken = 'ERROR_GENERATING_LONG_LIVED_TOKEN',
  /** Error occurred generating a service account secret. */
  ErrorGeneratingServiceAccountSecret = 'ERROR_GENERATING_SERVICE_ACCOUNT_SECRET',
  /** Error while retrieving the enabled managed services. */
  ErrorRetrievingEnabledManagedServices = 'ERROR_RETRIEVING_ENABLED_MANAGED_SERVICES',
  /** An error occurred while attempting to retrieve token signing key details. */
  ErrorRetrievingSigningKeys = 'ERROR_RETRIEVING_SIGNING_KEYS',
  /** This is a wrapper error for the original unhandled error of unsupported type. */
  ErrorWrapper = 'ERROR_WRAPPER',
  /** A GraphQL validation error has occurred. Please make sure that the GraphQL request is made with correct syntax or parameters. */
  GraphqlValidationFailed = 'GRAPHQL_VALIDATION_FAILED',
  /** The Identity service is not accessible. Please contact Axinom support. */
  IdentityServiceNotAccessible = 'IDENTITY_SERVICE_NOT_ACCESSIBLE',
  /** An error occurred while generating IDP authorization URL. */
  IdpAuthUrlGenerationError = 'IDP_AUTH_URL_GENERATION_ERROR',
  /** IDP configuration does not exist. */
  IdpConfigDoesNotExist = 'IDP_CONFIG_DOES_NOT_EXIST',
  /** Invalid IDP Configuration. */
  IdpConfigInvalid = 'IDP_CONFIG_INVALID',
  /** Built in IDP configuration is only available for Google IDP. */
  IdpConfigOnlyAvailableForGoogle = 'IDP_CONFIG_ONLY_AVAILABLE_FOR_GOOGLE',
  /** An error occurred while validating IDP Configuration. */
  IdpConfigValidationError = 'IDP_CONFIG_VALIDATION_ERROR',
  /** The requested Identity Provider is disabled for the environment. Please retry logging in using a different Identity Provider. */
  IdpDisabled = 'IDP_DISABLED',
  /** The requested Identity Provider is not configured for the environment. Please retry logging in using a different Identity Provider. */
  IdpNotConfigured = 'IDP_NOT_CONFIGURED',
  /** Error while requesting IDP Tokens */
  IdpTokenRequestError = 'IDP_TOKEN_REQUEST_ERROR',
  /** The value for initDefaults does not match its schema. */
  InitDefaultsSchemaMismatch = 'INIT_DEFAULTS_SCHEMA_MISMATCH',
  /** An unhandled and unexpected error has occurred. Please contact the service support. */
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  /** Invalid Client ID or Client Secret */
  InvalidClientIdSecret = 'INVALID_CLIENT_ID_SECRET',
  /** Invalid email or password. */
  InvalidCredentials = 'INVALID_CREDENTIALS',
  /** Email format is invalid. */
  InvalidEmailFormat = 'INVALID_EMAIL_FORMAT',
  /** Invalid email or tenant not enabled for usage. */
  InvalidEmailOrTenantInactive = 'INVALID_EMAIL_OR_TENANT_INACTIVE',
  /** Email Whitelist Pattern is not valid */
  InvalidEmailWhitelistPattern = 'INVALID_EMAIL_WHITELIST_PATTERN',
  /** Invalid Environment ID. */
  InvalidEnvironmentId = 'INVALID_ENVIRONMENT_ID',
  /** Unrecognized state change was attempted and an error was logged. */
  InvalidEnvironmentState = 'INVALID_ENVIRONMENT_STATE',
  /** Error occurred while trying to fetch signing keys from the JWKS endpoint for the Tenant/Environment/Application. */
  JwksError = 'JWKS_ERROR',
  /** Passed JWT is not a Mosaic End-User Token. Cannot be verified. */
  JwtIsNotMosaicToken = 'JWT_IS_NOT_MOSAIC_TOKEN',
  /** Missing required property %s in Identity Provider user token. */
  JwtMissingRequiredProp = 'JWT_MISSING_REQUIRED_PROP',
  /** The Management JWT is not valid. Cannot generate Managed Service Account token. */
  JwtNotValid = 'JWT_NOT_VALID',
  /** Please disable the tenant before deactivating the last active Tenant Administrator. */
  LastTenantAdminActiveTenantDeactivate = 'LAST_TENANT_ADMIN_ACTIVE_TENANT_DEACTIVATE',
  /** Please disable the tenant before deleting the last active Tenant Administrator. */
  LastTenantAdminActiveTenantDelete = 'LAST_TENANT_ADMIN_ACTIVE_TENANT_DELETE',
  /** Malformed access token received */
  MalformedToken = 'MALFORMED_TOKEN',
  /** Service [%s] is already disabled for this environment. No action was performed. */
  ManagedServiceAlreadyDisabled = 'MANAGED_SERVICE_ALREADY_DISABLED',
  /** Service [%s] is already enabled for this environment. No action was performed. */
  ManagedServiceAlreadyEnabled = 'MANAGED_SERVICE_ALREADY_ENABLED',
  /** Managed service [%s] not found in environment [%s]. */
  ManagedServiceNotFound = 'MANAGED_SERVICE_NOT_FOUND',
  /** Management super admin account not found. */
  ManagementSuperAdminAccountNotFound = 'MANAGEMENT_SUPER_ADMIN_ACCOUNT_NOT_FOUND',
  /** No active token signing keys found for the environment [%s]. */
  NoActiveSigningKey = 'NO_ACTIVE_SIGNING_KEY',
  /** Token does not contain an email. */
  NoEmailInToken = 'NO_EMAIL_IN_TOKEN',
  /** A caught error does not contain an error code. */
  NoErrorCodeFound = 'NO_ERROR_CODE_FOUND',
  /** The token is not an Authenticated End-User */
  NotAuthenticatedEndUser = 'NOT_AUTHENTICATED_END_USER',
  /** The object is not a AuthenticatedManagementSubject */
  NotAuthenticatedManagementSubject = 'NOT_AUTHENTICATED_MANAGEMENT_SUBJECT',
  /** The object is not a AuthenticatedRequest */
  NotAuthenticatedRequest = 'NOT_AUTHENTICATED_REQUEST',
  /** A caught error is not an AxiosError. */
  NotAxiosError = 'NOT_AXIOS_ERROR',
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
  /** The user [%s] can only use Single Sign-On mode for tenant [%s]. */
  OnlySsoAllowed = 'ONLY_SSO_ALLOWED',
  /** The environment's first orchestration step must have message-params. */
  OrchestrationParamsMissing = 'ORCHESTRATION_PARAMS_MISSING',
  /** Dynamic orchestration step resolution failed. */
  OrchestrationStepResolutionFailed = 'ORCHESTRATION_STEP_RESOLUTION_FAILED',
  /** Error generating the password. */
  PasswordGeneartionError = 'PASSWORD_GENEARTION_ERROR',
  /** The new password does not meet the minimum policy requirements. */
  PasswordPolicyMismatch = 'PASSWORD_POLICY_MISMATCH',
  /** Payload not found in pg-notification. */
  PayloadNotFound = 'PAYLOAD_NOT_FOUND',
  /** Error occurred trying to purge permissions. */
  PermissionPurgeError = 'PERMISSION_PURGE_ERROR',
  /** Purging permissions for Service IDs that start with `ax-` is not allowed. */
  PermissionPurgeNotAllowedForAxServices = 'PERMISSION_PURGE_NOT_ALLOWED_FOR_AX_SERVICES',
  /** Error occurred trying to synchronize permissions. */
  PermissionSyncError = 'PERMISSION_SYNC_ERROR',
  /** Root environment not found. */
  RootEnvNotFound = 'ROOT_ENV_NOT_FOUND',
  /** Root Tenant not found. */
  RootTenantNotFound = 'ROOT_TENANT_NOT_FOUND',
  /** No Service Account exists for Client ID [%s]. */
  ServiceAccountDoesNotExist = 'SERVICE_ACCOUNT_DOES_NOT_EXIST',
  /** Service Account does not exist. */
  ServiceAccountNotExists = 'SERVICE_ACCOUNT_NOT_EXISTS',
  /** The service-id is required for service-state-change-events. */
  ServiceIdNotFound = 'SERVICE_ID_NOT_FOUND',
  /** Sign in with credentials failed with an error message: [%s]. */
  SignInWithCredentialsAuthFlowError = 'SIGN_IN_WITH_CREDENTIALS_AUTH_FLOW_ERROR',
  /** Sign In With Credentials call failed. */
  SignInWithCredentialsFailed = 'SIGN_IN_WITH_CREDENTIALS_FAILED',
  /** Invalid username or password. Please try again. */
  SignInWithCredentialsInvalidCredentials = 'SIGN_IN_WITH_CREDENTIALS_INVALID_CREDENTIALS',
  /** Could not find a matching signing key to verify the access token. The signing key used to create the token may have been revoked or the Tenant/Environment/Application configuration is erroneous. */
  SigningKeyNotFound = 'SIGNING_KEY_NOT_FOUND',
  /** An error occurred while rotating signing keys. */
  SigningKeyRotateError = 'SIGNING_KEY_ROTATE_ERROR',
  /** Error validating SSO Token. */
  SsoTokenValidationError = 'SSO_TOKEN_VALIDATION_ERROR',
  /** An application startup error has occurred. The actual message will have more information. */
  StartupError = 'STARTUP_ERROR',
  /** Orchestration error. Step function [%s] not found. */
  StepFuncNotFound = 'STEP_FUNC_NOT_FOUND',
  /** Step function [%s] is not found in the mapping. */
  StepFunctionNotFoundInMapping = 'STEP_FUNCTION_NOT_FOUND_IN_MAPPING',
  /** User is authenticated, but subject information was not found. Please contact Axinom Support. */
  SubjectNotFound = 'SUBJECT_NOT_FOUND',
  /** Could not complete authentication. targetTenantId is missing. */
  TargetTenantMissing = 'TARGET_TENANT_MISSING',
  /** The linked Environment Administration Portal account [%s] is not active. Please contact Axinom Support. */
  TenantAdminNotActive = 'TENANT_ADMIN_NOT_ACTIVE',
  /** Tenant Admin does not exist. */
  TenantAdminNotExists = 'TENANT_ADMIN_NOT_EXISTS',
  /** Tenant Admin [%s] not found. */
  TenantAdminNotFound = 'TENANT_ADMIN_NOT_FOUND',
  /** The Environment Administration Portal is not linked to your Axinom Portal account [%s]. Please contact Axinom Support. */
  TenantAdminNotLinkedToAxPortal = 'TENANT_ADMIN_NOT_LINKED_TO_AX_PORTAL',
  /** The tenant [%s] is not active. Please contact Axinom Support. */
  TenantNotActive = 'TENANT_NOT_ACTIVE',
  /** Tenant does not exist. */
  TenantNotExists = 'TENANT_NOT_EXISTS',
  /** Tenant [%s] not found. */
  TenantNotFound = 'TENANT_NOT_FOUND',
  /** Token validity duration cannot exceed [%s] seconds. */
  TokenValidityDurationExceeded = 'TOKEN_VALIDITY_DURATION_EXCEEDED',
  /** Could not decode User Token in generateLongLivedToken. */
  UnableToDecodeJwt = 'UNABLE_TO_DECODE_JWT',
  /** The subject has no permissions. */
  Unauthorized = 'UNAUTHORIZED',
  /** Unexpected null or undefined value received. */
  UnexpectedNullUndefined = 'UNEXPECTED_NULL_UNDEFINED',
  /** Unhandled Axios error. */
  UnhandledAxiosError = 'UNHANDLED_AXIOS_ERROR',
  /** An unhandled database-related error has occurred. Please contact the service support. */
  UnhandledDatabaseError = 'UNHANDLED_DATABASE_ERROR',
  /** An unhandled error has occurred. Please contact the service support. */
  UnhandledError = 'UNHANDLED_ERROR',
  /** Attempt to create or update an element failed, as it would have resulted in a duplicate element. */
  UniqueConstraintError = 'UNIQUE_CONSTRAINT_ERROR',
  /** Environment created with an unsupported template [%s]. */
  UnsupportedTemplate = 'UNSUPPORTED_TEMPLATE',
  /** Unsupported token type received to generateLongLivedToken. The token must be a JWT type. */
  UnsupportedTokenType = 'UNSUPPORTED_TOKEN_TYPE',
  /** User with [%s] does not exist. Please ensure an user account exists for the given email. */
  UserDoesNotExist = 'USER_DOES_NOT_EXIST',
  /** User is not authorized to access the operation. */
  UserNotAuthorized = 'USER_NOT_AUTHORIZED',
  /** The User service is not accessible. Please contact Axinom support. */
  UserServiceNotAccessible = 'USER_SERVICE_NOT_ACCESSIBLE',
  /** The %s is not an object. */
  ValueIsNotObject = 'VALUE_IS_NOT_OBJECT',
  /** Websocket not found in ExtendedGraphQLContext. This is a development time issue. A reference to the websocket must be included in Postgraphile build options. */
  WebsocketNotFound = 'WEBSOCKET_NOT_FOUND',
  /** An error occurred while resolving the well-known-config URLs. */
  WellKnownConfigUrlResolveError = 'WELL_KNOWN_CONFIG_URL_RESOLVE_ERROR'
}

export type GenerateDevAccessTokenInput = {
  /** Optional Environment ID to use for service account. If not specified will default to configured dev value. */
  environmentId?: InputMaybe<Scalars['String']>;
  /**
   * Example:
   *
   * permissionStructure: [
   *   {
   *     serviceId: "media-service",
   *     permissions: ["ADMIN", "MOVIES_EDIT"]
   *   },
   *   {
   *     serviceId: "ax-video-service",
   *     permissions: ["ADMIN", "VIDEOS_EDIT"]
   *   }
   * ]
   */
  permissionStructure?: InputMaybe<Array<InputMaybe<DevPermissionStructureInput>>>;
  /**
   * Example:
   *
   * tags: ["LK_MANAGER", "DE_MANAGER"]
   */
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Optional tenant ID to use for service account. If not specified will default to configured dev value. */
  tenantId?: InputMaybe<Scalars['String']>;
};

export type GenerateDevAccessTokenPayload = {
  __typename?: 'GenerateDevAccessTokenPayload';
  accessToken: Scalars['String'];
  expiresInSeconds: Scalars['Int'];
  tokenType: Scalars['String'];
};

export type GenerateLongLivedTokenInput = {
  /** User access token to extend the validity period for. */
  userToken: Scalars['String'];
  /** Validity duration from time of invocation. Defaults to 30 days if unspecified. */
  validityDurationInSeconds?: InputMaybe<Scalars['Int']>;
};

export type GenerateLongLivedTokenPayload = {
  __typename?: 'GenerateLongLivedTokenPayload';
  /** Long lived access token */
  accessToken: Scalars['String'];
  /** Access Token expiration timeout in seconds */
  expiresInSeconds: Scalars['Int'];
  /** Access Token type to use when making client requests */
  tokenType: Scalars['String'];
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a development-time service account with SYNCHRONIZE_PERMISSIONS granted. */
  _DEV_createServiceAccount?: Maybe<CreateDevServiceAccountPayload>;
  /** Generates development-time user access tokens with specified PERMISSIONS. */
  _DEV_generateUserAccessToken?: Maybe<GenerateDevAccessTokenPayload>;
  /** Creates development-time tenant, environment & idp-configuration basic data. Re-running will reset all data. */
  _DEV_setupIdBasicData?: Maybe<SetupDevBasicDataPayload>;
  /** Authenticates a Managed Service Account */
  authenticateManagedServiceAccount: AuthenticateManagedServiceAccountPayload;
  /**
   * Authenticates a Managed Service Account With the Environment Scope.
   * This mutation will validate the management JWT and then derive the
   * Environment ID to scope the Managed Service Account Token.
   */
  authenticateManagedServiceAccountWithEnvironmentScope: AuthenticateManagedServiceAccountPayload;
  /** Authenticates a Service Account */
  authenticateServiceAccount: AuthenticateServiceAccountPayload;
  /** Delete a Service Account */
  devDeleteServiceAccount: DevDeleteServiceAccountPayload;
  /** Setup a Service Account with the given permission structure. */
  devGenerateUserAccessTokenWithPermissions?: Maybe<DevGenerateUserAccessTokenWithPermissionsPayload>;
  /** Setup a Service Account with the given permission structure. */
  devSetupServiceAccountWithPermissions?: Maybe<DevSetupServiceAccountWithPermissionsPayload>;
  /** Update the Permission Structure of an existing Service Account. */
  devUpdateServiceAccountPermissionStructure?: Maybe<DevUpdateServiceAccountPermissionStructurePayload>;
  /** Generate a long lived access token for a user access token */
  generateLongLivedToken: GenerateLongLivedTokenPayload;
  /** Update Service Account Name */
  updateServiceAccount: UpdateServiceAccountPayload;
};


/** The root mutation type which contains root level fields which mutate data. */
export type Mutation_Dev_CreateServiceAccountArgs = {
  input: CreateDevServiceAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type Mutation_Dev_GenerateUserAccessTokenArgs = {
  input: GenerateDevAccessTokenInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type Mutation_Dev_SetupIdBasicDataArgs = {
  input: SetupDevBasicDataInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationAuthenticateManagedServiceAccountArgs = {
  input?: InputMaybe<AuthenticateManagedServiceAccountInput>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationAuthenticateManagedServiceAccountWithEnvironmentScopeArgs = {
  input?: InputMaybe<AuthenticateManagedServiceAccountWithEnvironmentScopeInput>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationAuthenticateServiceAccountArgs = {
  input?: InputMaybe<AuthenticateServiceAccountInput>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDevDeleteServiceAccountArgs = {
  input: DevDeleteServiceAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDevGenerateUserAccessTokenWithPermissionsArgs = {
  input: DevGenerateUserAccessTokenWithPermissionsInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDevSetupServiceAccountWithPermissionsArgs = {
  input: DevSetupServiceAccountWithPermissionsInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDevUpdateServiceAccountPermissionStructureArgs = {
  input: DevUpdateServiceAccountPermissionStructureInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationGenerateLongLivedTokenArgs = {
  input: GenerateLongLivedTokenInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateServiceAccountArgs = {
  input: UpdateServiceAccountInput;
};

export type PermissionStructure = {
  permissions: Array<InputMaybe<Scalars['String']>>;
  serviceId: Scalars['String'];
};

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  /** Retrieve enabled managed services for an environment */
  enabledManagedServices: Array<EnabledManagedServicesPayload>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
};

export type SetupDevBasicDataInput = {
  /** Email given here will be setup as the tenant administrator email, as well as user administrator email. */
  adminEmail: Scalars['String'];
  /** Password given here will be setup as the tenant administrator password. */
  adminPassword: Scalars['String'];
  /** Optional Environment ID to generate basic data with. If not specified will default to configured dev value. */
  environmentId?: InputMaybe<Scalars['String']>;
  /** environmentTemplateId */
  environmentTemplateId: Scalars['String'];
  /** Google IDP Configuration - Client ID. */
  googleClientId: Scalars['String'];
  /** Google IDP Configuration - Client Secret. */
  googleClientSecret: Scalars['String'];
  /** Optional tenant ID to generate basic data with. If not specified will default to configured dev value. */
  tenantId?: InputMaybe<Scalars['String']>;
};

export type SetupDevBasicDataPayload = {
  __typename?: 'SetupDevBasicDataPayload';
  /** Development Environment ID to be used in ID Service integration. */
  environmentId: Scalars['String'];
  /** Development Tenant ID to be used in ID Service integration. */
  tenantId: Scalars['String'];
};

export type UpdateServiceAccountInput = {
  /** Client ID of the Service Account to be updated */
  clientId: Scalars['String'];
  /** Update Service Account Patch */
  patch: UpdateServiceAccountInputPatch;
};

export type UpdateServiceAccountInputPatch = {
  /** Name to be updated */
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateServiceAccountPayload = {
  __typename?: 'UpdateServiceAccountPayload';
  /** Indicates if service account name was updated successfully */
  isSuccess: Scalars['Boolean'];
};

export type GetEnabledManagedServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEnabledManagedServicesQuery = { __typename?: 'Query', enabledManagedServices: Array<{ __typename?: 'EnabledManagedServicesPayload', serviceId: string }> };


export const GetEnabledManagedServicesDocument = gql`
    query GetEnabledManagedServices {
  enabledManagedServices {
    serviceId
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetEnabledManagedServicesDocumentString = print(GetEnabledManagedServicesDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetEnabledManagedServices(variables?: GetEnabledManagedServicesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: GetEnabledManagedServicesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEnabledManagedServicesQuery>(GetEnabledManagedServicesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEnabledManagedServices', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;