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
  BigFloat: any;
  Cursor: any;
  Datetime: any;
  Upload: any;
  UUID: any;
};

export enum AmazonS3Region {
  /** Africa (Cape Town) af-south-1 */
  AfSouth_1 = 'AF_SOUTH_1',
  /** Asia Pacific (Hong Kong) ap-east-1 */
  ApEast_1 = 'AP_EAST_1',
  /** Asia Pacific (Tokyo) ap-northeast-1 */
  ApNortheast_1 = 'AP_NORTHEAST_1',
  /** Asia Pacific (Seoul) ap-northeast-2 */
  ApNortheast_2 = 'AP_NORTHEAST_2',
  /** Asia Pacific (Osaka) ap-northeast-3 */
  ApNortheast_3 = 'AP_NORTHEAST_3',
  /** Asia Pacific (Mumbai) ap-south-1 */
  ApSouth_1 = 'AP_SOUTH_1',
  /** Asia Pacific (Singapore) ap-southeast-1 */
  ApSoutheast_1 = 'AP_SOUTHEAST_1',
  /** Asia Pacific (Sydney) ap-southeast-2 */
  ApSoutheast_2 = 'AP_SOUTHEAST_2',
  /** Asia Pacific (Jakarta) ap-southeast-3 */
  ApSoutheast_3 = 'AP_SOUTHEAST_3',
  /** Canada (Central) ca-central-1 */
  CaCentral_1 = 'CA_CENTRAL_1',
  /** China (Beijing) cn-north-1 */
  CnNorth_1 = 'CN_NORTH_1',
  /** China (Ningxia) cn-northwest-1 */
  CnNorthwest_1 = 'CN_NORTHWEST_1',
  /** Europe (Frankfurt) eu-central-1 */
  EuCentral_1 = 'EU_CENTRAL_1',
  /** Europe (Stockholm) eu-north-1 */
  EuNorth_1 = 'EU_NORTH_1',
  /** Europe (Milan) eu-south-1 */
  EuSouth_1 = 'EU_SOUTH_1',
  /** Europe (Ireland) eu-west-1 */
  EuWest_1 = 'EU_WEST_1',
  /** Europe (London) eu-west-2 */
  EuWest_2 = 'EU_WEST_2',
  /** Europe (Paris) eu-west-3 */
  EuWest_3 = 'EU_WEST_3',
  /** Middle East (Bahrain) me-south-1 */
  MeSouth_1 = 'ME_SOUTH_1',
  /** South America (São Paulo) sa-east-1 */
  SaEast_1 = 'SA_EAST_1',
  /** US East (N. Virginia) us-east-1 */
  UsEast_1 = 'US_EAST_1',
  /** US East (Ohio) us-east-2 */
  UsEast_2 = 'US_EAST_2',
  /** AWS GovCloud (US-East) us-gov-east-1 */
  UsGovEast_1 = 'US_GOV_EAST_1',
  /** AWS GovCloud (US-West) us-gov-west-1 */
  UsGovWest_1 = 'US_GOV_WEST_1',
  /** US West (N. California) us-west-1 */
  UsWest_1 = 'US_WEST_1',
  /** US West (Oregon) us-west-2 */
  UsWest_2 = 'US_WEST_2'
}

/** A filter to be used against AmazonS3Region fields. All fields are combined with a logical ‘and.’ */
export type AmazonS3RegionFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<AmazonS3Region>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<AmazonS3Region>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<AmazonS3Region>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<AmazonS3Region>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<AmazonS3Region>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<AmazonS3Region>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<AmazonS3Region>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<AmazonS3Region>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<AmazonS3Region>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<AmazonS3Region>>;
};

/** A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’ */
export type BigFloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigFloat']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigFloat']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigFloat']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigFloat']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigFloat']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigFloat']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigFloat']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigFloat']>>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Boolean']>;
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
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Boolean']>>;
};

/** Bulk mutation payload type. */
export type BulkMutationUuidPayload = {
  __typename?: 'BulkMutationUuidPayload';
  affectedIds?: Maybe<Array<Maybe<Scalars['UUID']>>>;
  totalCount?: Maybe<Scalars['Int']>;
};

/**
 * All input for the create `ImagesTag` mutation.
 * @permissions: IMAGES_EDIT,ADMIN
 */
export type CreateImagesTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `ImagesTag` to be created by this mutation. */
  imagesTag: ImagesTagInput;
};

/** The output of our create `ImagesTag` mutation. */
export type CreateImagesTagPayload = {
  __typename?: 'CreateImagesTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Image` that is related to this `ImagesTag`. */
  image?: Maybe<Image>;
  /** The `ImagesTag` that was created by this mutation. */
  imagesTag?: Maybe<ImagesTag>;
  /** An edge for our `ImagesTag`. May be used by Relay 1. */
  imagesTagEdge?: Maybe<ImagesTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ImagesTag` mutation. */
export type CreateImagesTagPayloadImagesTagEdgeArgs = {
  orderBy?: InputMaybe<Array<ImagesTagsOrderBy>>;
};

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']>;
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
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']>>;
};

/**
 * All input for the `deleteImagesTag` mutation.
 * @permissions: IMAGES_EDIT,ADMIN
 */
export type DeleteImagesTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageId: Scalars['UUID'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** The output of our delete `ImagesTag` mutation. */
export type DeleteImagesTagPayload = {
  __typename?: 'DeleteImagesTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** @deprecated The field is obsolete. */
  deletedImagesTagNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Image` that is related to this `ImagesTag`. */
  image?: Maybe<Image>;
  /** The `ImagesTag` that was deleted by this mutation. */
  imagesTag?: Maybe<ImagesTag>;
  /** An edge for our `ImagesTag`. May be used by Relay 1. */
  imagesTagEdge?: Maybe<ImagesTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ImagesTag` mutation. */
export type DeleteImagesTagPayloadImagesTagEdgeArgs = {
  orderBy?: InputMaybe<Array<ImagesTagsOrderBy>>;
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
  /** The acquisition profile was not found. */
  AcquisitionProfileNotFound = 'ACQUISITION_PROFILE_NOT_FOUND',
  /** The acquisition settings were not found. */
  AcquisitionSettingsNotFound = 'ACQUISITION_SETTINGS_NOT_FOUND',
  /** Unable to update Acquisition Profile because the current storage provider is %s and not AMAZON_S3. */
  AcquisitionUpdateForNonAmazonS3Provider = 'ACQUISITION_UPDATE_FOR_NON_AMAZON_S3_PROVIDER',
  /** Unable to update Acquisition Profile because the current storage provider is %s and not AZURE_BLOB. */
  AcquisitionUpdateForNonAzureBlobProvider = 'ACQUISITION_UPDATE_FOR_NON_AZURE_BLOB_PROVIDER',
  /** The Bucket Name from Acquisition Profile is invalid. */
  AmazonS3InvalidBucketName = 'AMAZON_S3_INVALID_BUCKET_NAME',
  /** The image was not found in acquisition storage. Please confirm that the image file exists and that path is correct. Amazon S3 storage paths are case sensitive. */
  AmazonS3InvalidImagePath = 'AMAZON_S3_INVALID_IMAGE_PATH',
  /** The Region from Acquisition Profile is invalid. Please make sure it matches the account details. */
  AmazonS3InvalidRegion = 'AMAZON_S3_INVALID_REGION',
  /** Either Region or Access Key Id from Acquisition Profile is invalid. */
  AmazonS3InvalidRegionOrAccessKeyId = 'AMAZON_S3_INVALID_REGION_OR_ACCESS_KEY_ID',
  /** The Secret Access Key from Acquisition Profile is invalid. */
  AmazonS3InvalidSecretAccessKeyId = 'AMAZON_S3_INVALID_SECRET_ACCESS_KEY_ID',
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
  /** Unable to authenticate access to the Azure Blob Storage. The Account Key from Acquisition Profile might be invalid. */
  AzureBlobAuthenticationFailed = 'AZURE_BLOB_AUTHENTICATION_FAILED',
  /** The image was not found in acquisition storage. Please confirm that the image file exists and that path is correct. Azure blob storage paths are case sensitive. */
  AzureBlobBlobNotFound = 'AZURE_BLOB_BLOB_NOT_FOUND',
  /** The creation of the blob storage container has failed. Please contact Axinom support. */
  AzureBlobContainerCreationFailed = 'AZURE_BLOB_CONTAINER_CREATION_FAILED',
  /** The deletion of the blob storage container has failed. */
  AzureBlobContainerDeletionFailed = 'AZURE_BLOB_CONTAINER_DELETION_FAILED',
  /** The configured Acquisition Storage container does not exist. Please make sure, that the acquisition storage container name value is correct. */
  AzureBlobContainerNotFound = 'AZURE_BLOB_CONTAINER_NOT_FOUND',
  /** Unable to download image from Azure Blob storage. Please contact Axinom support. */
  AzureBlobImageDownloadFailed = 'AZURE_BLOB_IMAGE_DOWNLOAD_FAILED',
  /** The account name in Acquisition profile is invalid. */
  AzureBlobInvalidAccountName = 'AZURE_BLOB_INVALID_ACCOUNT_NAME',
  /** Unable to download the image from the Azure ingest blob storage. This is likely due to an Azure service outage that prevents the image to be downloaded in a reasonable time frame. */
  AzureBlobOperationAborted = 'AZURE_BLOB_OPERATION_ABORTED',
  /** An authorization database error has occurred. The user might not have enough permissions. */
  DatabasePermissionsCheckFailed = 'DATABASE_PERMISSIONS_CHECK_FAILED',
  /** An expected and handled database constraint error has occurred. The actual message will have more information. */
  DatabaseValidationFailed = 'DATABASE_VALIDATION_FAILED',
  /** Unable to declare image types as at least one other image type is already used by a different service. Please check the error details for the list of already declared image types and their service IDs. */
  DeclareImageTypesDuplicate = 'DECLARE_IMAGE_TYPES_DUPLICATE',
  /** Could not process the ensure image exists command after multiple retries. */
  EnsureImageExistsFailed = 'ENSURE_IMAGE_EXISTS_FAILED',
  /** This is a wrapper error for the original unhandled error of unsupported type. */
  ErrorWrapper = 'ERROR_WRAPPER',
  /** A GraphQL validation error has occurred. Please make sure that the GraphQL request is made with correct syntax or parameters. */
  GraphqlValidationFailed = 'GRAPHQL_VALIDATION_FAILED',
  /** The Identity service is not accessible. Please contact Axinom support. */
  IdentityServiceNotAccessible = 'IDENTITY_SERVICE_NOT_ACCESSIBLE',
  /** Unable to download image from Amazon S3 storage. Please contact Axinom support. */
  ImageDownloadFromAcquisitionStorageFailed = 'IMAGE_DOWNLOAD_FROM_ACQUISITION_STORAGE_FAILED',
  /** The image path is invalid. */
  ImageInvalidPath = 'IMAGE_INVALID_PATH',
  /** Could not read the image file to get the image metadata. */
  ImageMetadataReadingError = 'IMAGE_METADATA_READING_ERROR',
  /** The image was not found. */
  ImageNotFound = 'IMAGE_NOT_FOUND',
  /** The provided image type was not found. */
  ImageTypeIncorrect = 'IMAGE_TYPE_INCORRECT',
  /** An image for the specified path already exists with an image type "%s" different to the expected image type "%s". */
  ImageTypeMismatch = 'IMAGE_TYPE_MISMATCH',
  /** The image processing has failed. */
  ImageUnableToProcess = 'IMAGE_UNABLE_TO_PROCESS',
  /** The image codec is not supported. */
  ImageUnsupportedCodec = 'IMAGE_UNSUPPORTED_CODEC',
  /** The image format is not supported. */
  ImageUnsupportedFormat = 'IMAGE_UNSUPPORTED_FORMAT',
  /** The upload the image and preview files has failed. Please contact Axinom support. */
  ImageUploadError = 'IMAGE_UPLOAD_ERROR',
  /** An unhandled and unexpected error has occurred. Please contact the service support. */
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  /** Unable to decode tenantId or environmentId values. */
  InvalidEncodedUserInfo = 'INVALID_ENCODED_USER_INFO',
  /** The source image root folder name must be in the format "base36-base36". */
  InvalidImageRootFolderFormat = 'INVALID_IMAGE_ROOT_FOLDER_FORMAT',
  /** The user must contain a valid tenant and environment ID. */
  InvalidUserInfo = 'INVALID_USER_INFO',
  /** Error occurred while trying to fetch signing keys from the JWKS endpoint for the Tenant/Environment/Application. */
  JwksError = 'JWKS_ERROR',
  /** Passed JWT is not a Mosaic End-User Token. Cannot be verified. */
  JwtIsNotMosaicToken = 'JWT_IS_NOT_MOSAIC_TOKEN',
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
  SubjectInformationNotFound = 'SUBJECT_INFORMATION_NOT_FOUND',
  /** An unhandled database-related error has occurred. Please contact the service support. */
  UnhandledDatabaseError = 'UNHANDLED_DATABASE_ERROR',
  /** An unhandled error has occurred. Please contact the service support. */
  UnhandledError = 'UNHANDLED_ERROR',
  /** Unable to update the profile because no update values were provided. */
  UpdateInputIsEmpty = 'UPDATE_INPUT_IS_EMPTY',
  /** User is not authorized to access the operation. */
  UserNotAuthorized = 'USER_NOT_AUTHORIZED',
  /** The User service is not accessible. Please contact Axinom support. */
  UserServiceNotAccessible = 'USER_SERVICE_NOT_ACCESSIBLE',
  /** The %s is not an object. */
  ValueIsNotObject = 'VALUE_IS_NOT_OBJECT',
  /** Websocket not found in ExtendedGraphQLContext. This is a development time issue. A reference to the websocket must be included in Postgraphile build options. */
  WebsocketNotFound = 'WEBSOCKET_NOT_FOUND'
}

/** A `String` edge in the connection. */
export type GetImagesTagsValueEdge = {
  __typename?: 'GetImagesTagsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetImagesTagsValuesConnection = {
  __typename?: 'GetImagesTagsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetImagesTagsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN */
export type Image = {
  __typename?: 'Image';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  filename: Scalars['String'];
  fileSizeInBytes?: Maybe<Scalars['Int']>;
  focalX?: Maybe<Scalars['BigFloat']>;
  focalY?: Maybe<Scalars['BigFloat']>;
  height?: Maybe<Scalars['Int']>;
  id: Scalars['UUID'];
  /** Reads and enables pagination through a set of `ImagesTag`. */
  imagesTags: ImagesTagsConnection;
  /** Reads a single `ImageType` that is related to this `Image`. */
  imageType?: Maybe<ImageType>;
  imageTypeKey: Scalars['String'];
  isArchived: Scalars['Boolean'];
  originalSourceLocation?: Maybe<Scalars['String']>;
  previewPath: Scalars['String'];
  sourceFileName: Scalars['String'];
  sourceFileType: Scalars['String'];
  thumbnailPath: Scalars['String'];
  title: Scalars['String'];
  transformationPath: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
};


/** @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN */
export type ImageImagesTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ImagesTagCondition>;
  filter?: InputMaybe<ImagesTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ImagesTagsOrderBy>>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,IMAGES_EDIT,ADMIN */
export type ImageAcquisitionAmazonS3Setting = {
  __typename?: 'ImageAcquisitionAmazonS3Setting';
  accessKeyId: Scalars['String'];
  bucketName: Scalars['String'];
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads a single `ImageAcquisitionProfile` that is related to this `ImageAcquisitionAmazonS3Setting`. */
  imageAcquisitionProfile?: Maybe<ImageAcquisitionProfile>;
  imageAcquisitionProfileId: Scalars['UUID'];
  region: AmazonS3Region;
  rootFolderPath?: Maybe<Scalars['String']>;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};

/** A filter to be used against `ImageAcquisitionAmazonS3Setting` object types. All fields are combined with a logical ‘and.’ */
export type ImageAcquisitionAmazonS3SettingFilter = {
  /** Filter by the object’s `accessKeyId` field. */
  accessKeyId?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ImageAcquisitionAmazonS3SettingFilter>>;
  /** Filter by the object’s `bucketName` field. */
  bucketName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `imageAcquisitionProfile` relation. */
  imageAcquisitionProfile?: InputMaybe<ImageAcquisitionProfileFilter>;
  /** Filter by the object’s `imageAcquisitionProfileId` field. */
  imageAcquisitionProfileId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ImageAcquisitionAmazonS3SettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ImageAcquisitionAmazonS3SettingFilter>>;
  /** Filter by the object’s `region` field. */
  region?: InputMaybe<AmazonS3RegionFilter>;
  /** Filter by the object’s `rootFolderPath` field. */
  rootFolderPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,IMAGES_EDIT,ADMIN */
export type ImageAcquisitionAzureBlobSetting = {
  __typename?: 'ImageAcquisitionAzureBlobSetting';
  accountName: Scalars['String'];
  containerName: Scalars['String'];
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads a single `ImageAcquisitionProfile` that is related to this `ImageAcquisitionAzureBlobSetting`. */
  imageAcquisitionProfile?: Maybe<ImageAcquisitionProfile>;
  imageAcquisitionProfileId: Scalars['UUID'];
  rootFolderPath?: Maybe<Scalars['String']>;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};

/** A filter to be used against `ImageAcquisitionAzureBlobSetting` object types. All fields are combined with a logical ‘and.’ */
export type ImageAcquisitionAzureBlobSettingFilter = {
  /** Filter by the object’s `accountName` field. */
  accountName?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ImageAcquisitionAzureBlobSettingFilter>>;
  /** Filter by the object’s `containerName` field. */
  containerName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `imageAcquisitionProfile` relation. */
  imageAcquisitionProfile?: InputMaybe<ImageAcquisitionProfileFilter>;
  /** Filter by the object’s `imageAcquisitionProfileId` field. */
  imageAcquisitionProfileId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ImageAcquisitionAzureBlobSettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ImageAcquisitionAzureBlobSettingFilter>>;
  /** Filter by the object’s `rootFolderPath` field. */
  rootFolderPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,IMAGES_EDIT,ADMIN */
export type ImageAcquisitionProfile = {
  __typename?: 'ImageAcquisitionProfile';
  /** Reads a single `ImageAcquisitionAmazonS3Setting` that is related to this `ImageAcquisitionProfile`. */
  amazonS3Setting?: Maybe<ImageAcquisitionAmazonS3Setting>;
  /** Reads a single `ImageAcquisitionAzureBlobSetting` that is related to this `ImageAcquisitionProfile`. */
  azureBlobSetting?: Maybe<ImageAcquisitionAzureBlobSetting>;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  id: Scalars['UUID'];
  provider: StorageProvider;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};

/**
 * A condition to be used against `ImageAcquisitionProfile` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type ImageAcquisitionProfileCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `provider` field. */
  provider?: InputMaybe<StorageProvider>;
  /**
   * Checks for equality with the object’s `title` field.
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `ImageAcquisitionProfile` object types. All fields are combined with a logical ‘and.’ */
export type ImageAcquisitionProfileFilter = {
  /** Filter by the object’s `amazonS3Setting` relation. */
  amazonS3Setting?: InputMaybe<ImageAcquisitionAmazonS3SettingFilter>;
  /** A related `amazonS3Setting` exists. */
  amazonS3SettingExists?: InputMaybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ImageAcquisitionProfileFilter>>;
  /** Filter by the object’s `azureBlobSetting` relation. */
  azureBlobSetting?: InputMaybe<ImageAcquisitionAzureBlobSettingFilter>;
  /** A related `azureBlobSetting` exists. */
  azureBlobSettingExists?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ImageAcquisitionProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ImageAcquisitionProfileFilter>>;
  /** Filter by the object’s `provider` field. */
  provider?: InputMaybe<StorageProviderFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/**
 * A connection to a list of `ImageAcquisitionProfile` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,IMAGES_EDIT,ADMIN
 */
export type ImageAcquisitionProfilesConnection = {
  __typename?: 'ImageAcquisitionProfilesConnection';
  /** A list of edges which contains the `ImageAcquisitionProfile` and cursor to aid in pagination. */
  edges: Array<ImageAcquisitionProfilesEdge>;
  /** A list of `ImageAcquisitionProfile` objects. */
  nodes: Array<ImageAcquisitionProfile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ImageAcquisitionProfile` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ImageAcquisitionProfile` edge in the connection. */
export type ImageAcquisitionProfilesEdge = {
  __typename?: 'ImageAcquisitionProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ImageAcquisitionProfile` at the end of the edge. */
  node: ImageAcquisitionProfile;
};

/** Methods to use when ordering `ImageAcquisitionProfile`. */
export enum ImageAcquisitionProfilesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdAccessKeyIdAsc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ACCESS_KEY_ID_ASC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdAccessKeyIdDesc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ACCESS_KEY_ID_DESC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdBucketNameAsc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__BUCKET_NAME_ASC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdBucketNameDesc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__BUCKET_NAME_DESC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdCreatedDateAsc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_DATE_ASC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdCreatedDateDesc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_DATE_DESC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdCreatedUserAsc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_USER_ASC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdCreatedUserDesc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_USER_DESC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdImageAcquisitionProfileIdAsc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__IMAGE_ACQUISITION_PROFILE_ID_ASC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdImageAcquisitionProfileIdDesc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__IMAGE_ACQUISITION_PROFILE_ID_DESC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdRegionAsc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__REGION_ASC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdRegionDesc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__REGION_DESC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdRootFolderPathAsc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ROOT_FOLDER_PATH_ASC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdRootFolderPathDesc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ROOT_FOLDER_PATH_DESC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdSecretAccessKeyAsc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__SECRET_ACCESS_KEY_ASC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdSecretAccessKeyDesc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__SECRET_ACCESS_KEY_DESC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdUpdatedDateAsc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_DATE_ASC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdUpdatedDateDesc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_DATE_DESC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdUpdatedUserAsc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_USER_ASC',
  ImageAcquisitionAmazonS3SettingByImageAcquisitionProfileIdUpdatedUserDesc = 'IMAGE_ACQUISITION_AMAZON_S3_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_USER_DESC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdAccountKeyAsc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ACCOUNT_KEY_ASC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdAccountKeyDesc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ACCOUNT_KEY_DESC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdAccountNameAsc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ACCOUNT_NAME_ASC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdAccountNameDesc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ACCOUNT_NAME_DESC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdContainerNameAsc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CONTAINER_NAME_ASC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdContainerNameDesc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CONTAINER_NAME_DESC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdCreatedDateAsc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_DATE_ASC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdCreatedDateDesc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_DATE_DESC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdCreatedUserAsc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_USER_ASC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdCreatedUserDesc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_USER_DESC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdImageAcquisitionProfileIdAsc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__IMAGE_ACQUISITION_PROFILE_ID_ASC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdImageAcquisitionProfileIdDesc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__IMAGE_ACQUISITION_PROFILE_ID_DESC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdRootFolderPathAsc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ROOT_FOLDER_PATH_ASC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdRootFolderPathDesc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ROOT_FOLDER_PATH_DESC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdUpdatedDateAsc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_DATE_ASC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdUpdatedDateDesc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_DATE_DESC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdUpdatedUserAsc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_USER_ASC',
  ImageAcquisitionAzureBlobSettingByImageAcquisitionProfileIdUpdatedUserDesc = 'IMAGE_ACQUISITION_AZURE_BLOB_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_USER_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProviderAsc = 'PROVIDER_ASC',
  ProviderDesc = 'PROVIDER_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** A condition to be used against `Image` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ImageCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `filename` field. */
  filename?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `fileSizeInBytes` field. */
  fileSizeInBytes?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `focalX` field. */
  focalX?: InputMaybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `focalY` field. */
  focalY?: InputMaybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `height` field. */
  height?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `imageTypeKey` field. */
  imageTypeKey?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `originalSourceLocation` field. */
  originalSourceLocation?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `sourceFileName` field. */
  sourceFileName?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `sourceFileType` field. */
  sourceFileType?: InputMaybe<Scalars['String']>;
  /**
   * Checks for equality with the object’s `title` field.
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `width` field. */
  width?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `Image` object types. All fields are combined with a logical ‘and.’ */
export type ImageFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ImageFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `filename` field. */
  filename?: InputMaybe<StringFilter>;
  /** Filter by the object’s `fileSizeInBytes` field. */
  fileSizeInBytes?: InputMaybe<IntFilter>;
  /** Filter by the object’s `focalX` field. */
  focalX?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `focalY` field. */
  focalY?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `height` field. */
  height?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `imagesTags` relation. */
  imagesTags?: InputMaybe<ImageToManyImagesTagFilter>;
  /** Some related `imagesTags` exist. */
  imagesTagsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `imageType` relation. */
  imageType?: InputMaybe<ImageTypeFilter>;
  /** Filter by the object’s `imageTypeKey` field. */
  imageTypeKey?: InputMaybe<StringFilter>;
  /** Filter by the object’s `isArchived` field. */
  isArchived?: InputMaybe<BooleanFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ImageFilter>>;
  /** Filter by the object’s `originalSourceLocation` field. */
  originalSourceLocation?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sourceFileName` field. */
  sourceFileName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sourceFileType` field. */
  sourceFileType?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `width` field. */
  width?: InputMaybe<IntFilter>;
};

/** Represents an update to a `Image`. Fields that are set will be updated. */
export type ImagePatch = {
  focalX?: InputMaybe<Scalars['BigFloat']>;
  focalY?: InputMaybe<Scalars['BigFloat']>;
  isArchived?: InputMaybe<Scalars['Boolean']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `Image` values.
 * @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN
 */
export type ImagesConnection = {
  __typename?: 'ImagesConnection';
  /** A list of edges which contains the `Image` and cursor to aid in pagination. */
  edges: Array<ImagesEdge>;
  /** A list of `Image` objects. */
  nodes: Array<Image>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Image` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Image` edge in the connection. */
export type ImagesEdge = {
  __typename?: 'ImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Image` at the end of the edge. */
  node: Image;
};

/** Methods to use when ordering `Image`. */
export enum ImagesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  FileSizeInBytesAsc = 'FILE_SIZE_IN_BYTES_ASC',
  FileSizeInBytesDesc = 'FILE_SIZE_IN_BYTES_DESC',
  FilenameAsc = 'FILENAME_ASC',
  FilenameDesc = 'FILENAME_DESC',
  FocalXAsc = 'FOCAL_X_ASC',
  FocalXDesc = 'FOCAL_X_DESC',
  FocalYAsc = 'FOCAL_Y_ASC',
  FocalYDesc = 'FOCAL_Y_DESC',
  HeightAsc = 'HEIGHT_ASC',
  HeightDesc = 'HEIGHT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ImageTypeByImageTypeKeyCreatedDateAsc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__CREATED_DATE_ASC',
  ImageTypeByImageTypeKeyCreatedDateDesc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__CREATED_DATE_DESC',
  ImageTypeByImageTypeKeyCreatedUserAsc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__CREATED_USER_ASC',
  ImageTypeByImageTypeKeyCreatedUserDesc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__CREATED_USER_DESC',
  ImageTypeByImageTypeKeyImageTypeAsc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__IMAGE_TYPE_ASC',
  ImageTypeByImageTypeKeyImageTypeDesc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__IMAGE_TYPE_DESC',
  ImageTypeByImageTypeKeyIsArchivedAsc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__IS_ARCHIVED_ASC',
  ImageTypeByImageTypeKeyIsArchivedDesc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__IS_ARCHIVED_DESC',
  ImageTypeByImageTypeKeyServiceIdAsc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__SERVICE_ID_ASC',
  ImageTypeByImageTypeKeyServiceIdDesc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__SERVICE_ID_DESC',
  ImageTypeByImageTypeKeyTitleAsc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__TITLE_ASC',
  ImageTypeByImageTypeKeyTitleDesc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__TITLE_DESC',
  ImageTypeByImageTypeKeyUpdatedDateAsc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__UPDATED_DATE_ASC',
  ImageTypeByImageTypeKeyUpdatedDateDesc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__UPDATED_DATE_DESC',
  ImageTypeByImageTypeKeyUpdatedUserAsc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__UPDATED_USER_ASC',
  ImageTypeByImageTypeKeyUpdatedUserDesc = 'IMAGE_TYPE_BY_IMAGE_TYPE_KEY__UPDATED_USER_DESC',
  ImageTypeKeyAsc = 'IMAGE_TYPE_KEY_ASC',
  ImageTypeKeyDesc = 'IMAGE_TYPE_KEY_DESC',
  ImagesTagsByImageIdCountAsc = 'IMAGES_TAGS_BY_IMAGE_ID__COUNT_ASC',
  ImagesTagsByImageIdCountDesc = 'IMAGES_TAGS_BY_IMAGE_ID__COUNT_DESC',
  IsArchivedAsc = 'IS_ARCHIVED_ASC',
  IsArchivedDesc = 'IS_ARCHIVED_DESC',
  Natural = 'NATURAL',
  OriginalSourceLocationAsc = 'ORIGINAL_SOURCE_LOCATION_ASC',
  OriginalSourceLocationDesc = 'ORIGINAL_SOURCE_LOCATION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SourceFileNameAsc = 'SOURCE_FILE_NAME_ASC',
  SourceFileNameDesc = 'SOURCE_FILE_NAME_DESC',
  SourceFileTypeAsc = 'SOURCE_FILE_TYPE_ASC',
  SourceFileTypeDesc = 'SOURCE_FILE_TYPE_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  WidthAsc = 'WIDTH_ASC',
  WidthDesc = 'WIDTH_DESC'
}

/** @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN */
export type ImagesTag = {
  __typename?: 'ImagesTag';
  /** Reads a single `Image` that is related to this `ImagesTag`. */
  image?: Maybe<Image>;
  imageId: Scalars['UUID'];
  name: Scalars['String'];
};

/**
 * A condition to be used against `ImagesTag` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type ImagesTagCondition = {
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']>;
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `ImagesTag` object types. All fields are combined with a logical ‘and.’ */
export type ImagesTagFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ImagesTagFilter>>;
  /** Filter by the object’s `image` relation. */
  image?: InputMaybe<ImageFilter>;
  /** Filter by the object’s `imageId` field. */
  imageId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ImagesTagFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ImagesTagFilter>>;
};

/** An input for mutations affecting `ImagesTag` */
export type ImagesTagInput = {
  imageId: Scalars['UUID'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** Represents an update to a `ImagesTag`. Fields that are set will be updated. */
export type ImagesTagPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `ImagesTag` values.
 * @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN
 */
export type ImagesTagsConnection = {
  __typename?: 'ImagesTagsConnection';
  /** A list of edges which contains the `ImagesTag` and cursor to aid in pagination. */
  edges: Array<ImagesTagsEdge>;
  /** A list of `ImagesTag` objects. */
  nodes: Array<ImagesTag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ImagesTag` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ImagesTag` edge in the connection. */
export type ImagesTagsEdge = {
  __typename?: 'ImagesTagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ImagesTag` at the end of the edge. */
  node: ImagesTag;
};

/** Methods to use when ordering `ImagesTag`. */
export enum ImagesTagsOrderBy {
  ImageByImageIdCreatedDateAsc = 'IMAGE_BY_IMAGE_ID__CREATED_DATE_ASC',
  ImageByImageIdCreatedDateDesc = 'IMAGE_BY_IMAGE_ID__CREATED_DATE_DESC',
  ImageByImageIdCreatedUserAsc = 'IMAGE_BY_IMAGE_ID__CREATED_USER_ASC',
  ImageByImageIdCreatedUserDesc = 'IMAGE_BY_IMAGE_ID__CREATED_USER_DESC',
  ImageByImageIdFileSizeInBytesAsc = 'IMAGE_BY_IMAGE_ID__FILE_SIZE_IN_BYTES_ASC',
  ImageByImageIdFileSizeInBytesDesc = 'IMAGE_BY_IMAGE_ID__FILE_SIZE_IN_BYTES_DESC',
  ImageByImageIdFilenameAsc = 'IMAGE_BY_IMAGE_ID__FILENAME_ASC',
  ImageByImageIdFilenameDesc = 'IMAGE_BY_IMAGE_ID__FILENAME_DESC',
  ImageByImageIdFocalXAsc = 'IMAGE_BY_IMAGE_ID__FOCAL_X_ASC',
  ImageByImageIdFocalXDesc = 'IMAGE_BY_IMAGE_ID__FOCAL_X_DESC',
  ImageByImageIdFocalYAsc = 'IMAGE_BY_IMAGE_ID__FOCAL_Y_ASC',
  ImageByImageIdFocalYDesc = 'IMAGE_BY_IMAGE_ID__FOCAL_Y_DESC',
  ImageByImageIdHeightAsc = 'IMAGE_BY_IMAGE_ID__HEIGHT_ASC',
  ImageByImageIdHeightDesc = 'IMAGE_BY_IMAGE_ID__HEIGHT_DESC',
  ImageByImageIdIdAsc = 'IMAGE_BY_IMAGE_ID__ID_ASC',
  ImageByImageIdIdDesc = 'IMAGE_BY_IMAGE_ID__ID_DESC',
  ImageByImageIdImageTypeKeyAsc = 'IMAGE_BY_IMAGE_ID__IMAGE_TYPE_KEY_ASC',
  ImageByImageIdImageTypeKeyDesc = 'IMAGE_BY_IMAGE_ID__IMAGE_TYPE_KEY_DESC',
  ImageByImageIdIsArchivedAsc = 'IMAGE_BY_IMAGE_ID__IS_ARCHIVED_ASC',
  ImageByImageIdIsArchivedDesc = 'IMAGE_BY_IMAGE_ID__IS_ARCHIVED_DESC',
  ImageByImageIdOriginalSourceLocationAsc = 'IMAGE_BY_IMAGE_ID__ORIGINAL_SOURCE_LOCATION_ASC',
  ImageByImageIdOriginalSourceLocationDesc = 'IMAGE_BY_IMAGE_ID__ORIGINAL_SOURCE_LOCATION_DESC',
  ImageByImageIdSourceFileNameAsc = 'IMAGE_BY_IMAGE_ID__SOURCE_FILE_NAME_ASC',
  ImageByImageIdSourceFileNameDesc = 'IMAGE_BY_IMAGE_ID__SOURCE_FILE_NAME_DESC',
  ImageByImageIdSourceFileTypeAsc = 'IMAGE_BY_IMAGE_ID__SOURCE_FILE_TYPE_ASC',
  ImageByImageIdSourceFileTypeDesc = 'IMAGE_BY_IMAGE_ID__SOURCE_FILE_TYPE_DESC',
  ImageByImageIdTitleAsc = 'IMAGE_BY_IMAGE_ID__TITLE_ASC',
  ImageByImageIdTitleDesc = 'IMAGE_BY_IMAGE_ID__TITLE_DESC',
  ImageByImageIdUpdatedDateAsc = 'IMAGE_BY_IMAGE_ID__UPDATED_DATE_ASC',
  ImageByImageIdUpdatedDateDesc = 'IMAGE_BY_IMAGE_ID__UPDATED_DATE_DESC',
  ImageByImageIdUpdatedUserAsc = 'IMAGE_BY_IMAGE_ID__UPDATED_USER_ASC',
  ImageByImageIdUpdatedUserDesc = 'IMAGE_BY_IMAGE_ID__UPDATED_USER_DESC',
  ImageByImageIdWidthAsc = 'IMAGE_BY_IMAGE_ID__WIDTH_ASC',
  ImageByImageIdWidthDesc = 'IMAGE_BY_IMAGE_ID__WIDTH_DESC',
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type ImageSubscriptionPayload = {
  __typename?: 'ImageSubscriptionPayload';
  event?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  image?: Maybe<Image>;
};

/** A filter to be used against many `ImagesTag` object types. All fields are combined with a logical ‘and.’ */
export type ImageToManyImagesTagFilter = {
  /** Every related `ImagesTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ImagesTagFilter>;
  /** No related `ImagesTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ImagesTagFilter>;
  /** Some related `ImagesTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ImagesTagFilter>;
};

/** @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN,IMAGE_TYPES_DECLARE */
export type ImageType = {
  __typename?: 'ImageType';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads and enables pagination through a set of `Image`. */
  images: ImagesConnection;
  imageType: Scalars['String'];
  isArchived: Scalars['Boolean'];
  serviceId: Scalars['String'];
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN,IMAGE_TYPES_DECLARE */
export type ImageTypeImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ImageCondition>;
  filter?: InputMaybe<ImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
};

/**
 * A condition to be used against `ImageType` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type ImageTypeCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /**
   * Checks for equality with the object’s `imageType` field.
   * @isTrimmed()
   * @notEmpty()
   */
  imageType?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `serviceId` field. */
  serviceId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `ImageType` object types. All fields are combined with a logical ‘and.’ */
export type ImageTypeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ImageTypeFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `images` relation. */
  images?: InputMaybe<ImageTypeToManyImageFilter>;
  /** Some related `images` exist. */
  imagesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `imageType` field. */
  imageType?: InputMaybe<StringFilter>;
  /** Filter by the object’s `isArchived` field. */
  isArchived?: InputMaybe<BooleanFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ImageTypeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ImageTypeFilter>>;
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
 * A connection to a list of `ImageType` values.
 * @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN,IMAGE_TYPES_DECLARE
 */
export type ImageTypesConnection = {
  __typename?: 'ImageTypesConnection';
  /** A list of edges which contains the `ImageType` and cursor to aid in pagination. */
  edges: Array<ImageTypesEdge>;
  /** A list of `ImageType` objects. */
  nodes: Array<ImageType>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ImageType` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ImageType` edge in the connection. */
export type ImageTypesEdge = {
  __typename?: 'ImageTypesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ImageType` at the end of the edge. */
  node: ImageType;
};

/** Methods to use when ordering `ImageType`. */
export enum ImageTypesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  ImageTypeAsc = 'IMAGE_TYPE_ASC',
  ImageTypeDesc = 'IMAGE_TYPE_DESC',
  ImagesByImageTypeKeyCountAsc = 'IMAGES_BY_IMAGE_TYPE_KEY__COUNT_ASC',
  ImagesByImageTypeKeyCountDesc = 'IMAGES_BY_IMAGE_TYPE_KEY__COUNT_DESC',
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

/** A filter to be used against many `Image` object types. All fields are combined with a logical ‘and.’ */
export type ImageTypeToManyImageFilter = {
  /** Every related `Image` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ImageFilter>;
  /** No related `Image` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ImageFilter>;
  /** Some related `Image` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ImageFilter>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  archiveImages?: Maybe<BulkMutationUuidPayload>;
  /** Creates a single `ImagesTag`. */
  createImagesTag?: Maybe<CreateImagesTagPayload>;
  /** Deletes a single `ImagesTag` using a unique key. */
  deleteImagesTag?: Maybe<DeleteImagesTagPayload>;
  populateImages?: Maybe<PopulatePayload>;
  populateImageTypes?: Maybe<PopulatePayload>;
  setAmazonS3AcquisitionProfile: ImageAcquisitionProfile;
  setAzureBlobAcquisitionProfile: ImageAcquisitionProfile;
  truncateImages?: Maybe<TruncateImagesPayload>;
  updateAmazonS3AcquisitionProfile: ImageAcquisitionProfile;
  updateAzureBlobAcquisitionProfile: ImageAcquisitionProfile;
  /** Updates a single `Image` using a unique key and a patch. */
  updateImage?: Maybe<UpdateImagePayload>;
  /** Updates a single `ImagesTag` using a unique key and a patch. */
  updateImagesTag?: Maybe<UpdateImagesTagPayload>;
  uploadImage?: Maybe<UploadImagePayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationArchiveImagesArgs = {
  filter?: InputMaybe<ImageFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateImagesTagArgs = {
  input: CreateImagesTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteImagesTagArgs = {
  input: DeleteImagesTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPopulateImagesArgs = {
  input: PopulateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetAmazonS3AcquisitionProfileArgs = {
  input: SetAmazonS3AcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetAzureBlobAcquisitionProfileArgs = {
  input: SetAzureBlobAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAmazonS3AcquisitionProfileArgs = {
  input: UpdateAmazonS3AcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAzureBlobAcquisitionProfileArgs = {
  input: UpdateAzureBlobAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateImageArgs = {
  input: UpdateImageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateImagesTagArgs = {
  input: UpdateImagesTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUploadImageArgs = {
  input: UploadImageInput;
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

export type PopulateInput = {
  count: Scalars['Int'];
  includeImageFiles?: InputMaybe<Scalars['Boolean']>;
  includeTags?: InputMaybe<Scalars['Boolean']>;
};

export type PopulatePayload = {
  __typename?: 'PopulatePayload';
  count: Scalars['Int'];
  query?: Maybe<Query>;
};

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  getImagesTagsValues?: Maybe<GetImagesTagsValuesConnection>;
  image?: Maybe<Image>;
  imageAcquisitionProfile?: Maybe<ImageAcquisitionProfile>;
  /** Reads and enables pagination through a set of `ImageAcquisitionProfile`. */
  imageAcquisitionProfiles?: Maybe<ImageAcquisitionProfilesConnection>;
  /** Reads and enables pagination through a set of `Image`. */
  images?: Maybe<ImagesConnection>;
  imagesTag?: Maybe<ImagesTag>;
  /** Reads and enables pagination through a set of `ImagesTag`. */
  imagesTags?: Maybe<ImagesTagsConnection>;
  imageType?: Maybe<ImageType>;
  /** Reads and enables pagination through a set of `ImageType`. */
  imageTypes?: Maybe<ImageTypesConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetImagesTagsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryImageArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryImageAcquisitionProfileArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryImageAcquisitionProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ImageAcquisitionProfileCondition>;
  filter?: InputMaybe<ImageAcquisitionProfileFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ImageAcquisitionProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ImageCondition>;
  filter?: InputMaybe<ImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryImagesTagArgs = {
  imageId: Scalars['UUID'];
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryImagesTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ImagesTagCondition>;
  filter?: InputMaybe<ImagesTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ImagesTagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryImageTypeArgs = {
  imageType: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryImageTypesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ImageTypeCondition>;
  filter?: InputMaybe<ImageTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ImageTypesOrderBy>>;
};

export type SetAmazonS3AcquisitionProfileInput = {
  accessKeyId: Scalars['String'];
  bucketName: Scalars['String'];
  region: AmazonS3Region;
  rootFolderPath?: InputMaybe<Scalars['String']>;
  secretAccessKey: Scalars['String'];
  title: Scalars['String'];
};

export type SetAzureBlobAcquisitionProfileInput = {
  accountKey: Scalars['String'];
  accountName: Scalars['String'];
  containerName: Scalars['String'];
  rootFolderPath?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export enum StorageProvider {
  /** Amazon S3 */
  AmazonS3 = 'AMAZON_S3',
  /** Azure Blob */
  AzureBlob = 'AZURE_BLOB'
}

/** A filter to be used against StorageProvider fields. All fields are combined with a logical ‘and.’ */
export type StorageProviderFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<StorageProvider>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<StorageProvider>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<StorageProvider>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<StorageProvider>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<StorageProvider>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<StorageProvider>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<StorageProvider>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<StorageProvider>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<StorageProvider>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<StorageProvider>>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']>;
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
  /** Triggered when a Image is mutated (insert, update or delete).  */
  imageMutated?: Maybe<ImageSubscriptionPayload>;
};

export type TruncateImagesPayload = {
  __typename?: 'TruncateImagesPayload';
  completed: Scalars['Boolean'];
};

export type UpdateAmazonS3AcquisitionProfileInput = {
  accessKeyId?: InputMaybe<Scalars['String']>;
  bucketName?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<AmazonS3Region>;
  rootFolderPath?: InputMaybe<Scalars['String']>;
  secretAccessKey?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateAzureBlobAcquisitionProfileInput = {
  accountKey?: InputMaybe<Scalars['String']>;
  accountName?: InputMaybe<Scalars['String']>;
  containerName?: InputMaybe<Scalars['String']>;
  rootFolderPath?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

/**
 * All input for the `updateImage` mutation.
 * @permissions: IMAGES_EDIT,ADMIN
 */
export type UpdateImageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** An object where the defined keys will be set on the `Image` being updated. */
  patch: ImagePatch;
};

/** The output of our update `Image` mutation. */
export type UpdateImagePayload = {
  __typename?: 'UpdateImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Image` that was updated by this mutation. */
  image?: Maybe<Image>;
  /** An edge for our `Image`. May be used by Relay 1. */
  imageEdge?: Maybe<ImagesEdge>;
  /** Reads a single `ImageType` that is related to this `Image`. */
  imageType?: Maybe<ImageType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Image` mutation. */
export type UpdateImagePayloadImageEdgeArgs = {
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
};

/**
 * All input for the `updateImagesTag` mutation.
 * @permissions: IMAGES_EDIT,ADMIN
 */
export type UpdateImagesTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageId: Scalars['UUID'];
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `ImagesTag` being updated. */
  patch: ImagesTagPatch;
};

/** The output of our update `ImagesTag` mutation. */
export type UpdateImagesTagPayload = {
  __typename?: 'UpdateImagesTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Image` that is related to this `ImagesTag`. */
  image?: Maybe<Image>;
  /** The `ImagesTag` that was updated by this mutation. */
  imagesTag?: Maybe<ImagesTag>;
  /** An edge for our `ImagesTag`. May be used by Relay 1. */
  imagesTagEdge?: Maybe<ImagesTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ImagesTag` mutation. */
export type UpdateImagesTagPayloadImagesTagEdgeArgs = {
  orderBy?: InputMaybe<Array<ImagesTagsOrderBy>>;
};

export type UploadImageInput = {
  file: Scalars['Upload'];
  imageType: Scalars['String'];
};

export type UploadImagePayload = {
  __typename?: 'UploadImagePayload';
  image?: Maybe<Image>;
  query?: Maybe<Query>;
};

/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export type UuidFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['UUID']>;
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
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['UUID']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['UUID']>>;
};

export type GetImagesQueryVariables = Exact<{
  filter?: InputMaybe<ImageFilter>;
}>;


export type GetImagesQuery = { __typename?: 'Query', images?: { __typename?: 'ImagesConnection', nodes: Array<{ __typename?: 'Image', id: any, height?: number | null, width?: number | null, imageTypeKey: string, transformationPath: string }> } | null };


export const GetImagesDocument = gql`
    query GetImages($filter: ImageFilter) {
  images(filter: $filter) {
    nodes {
      id
      height
      width
      imageTypeKey
      transformationPath
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetImagesDocumentString = print(GetImagesDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetImages(variables?: GetImagesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: GetImagesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetImagesQuery>(GetImagesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetImages', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;