/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './image';

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
  BigFloat: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  Date: { input: any; output: any; }
  Datetime: { input: any; output: any; }
  Upload: { input: any; output: any; }
  UUID: { input: any; output: any; }
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
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
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
  distinctFrom?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Boolean']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export type BulkEditAsyncImageAddImagesTagInput = {
  /** @notEmpty() */
  name: Scalars['String']['input'];
};

export type BulkEditAsyncImageAddInput = {
  imagesTags?: InputMaybe<Array<InputMaybe<BulkEditAsyncImageAddImagesTagInput>>>;
};

export type BulkEditAsyncImageClearInput = {
  imagesTags?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BulkEditAsyncImageRemoveImagesTagInput = {
  /** @notEmpty() */
  name: Scalars['String']['input'];
};

export type BulkEditAsyncImageRemoveInput = {
  imagesTags?: InputMaybe<Array<InputMaybe<BulkEditAsyncImageRemoveImagesTagInput>>>;
};

export type BulkEditAsyncPayloadType = {
  __typename?: 'BulkEditAsyncPayloadType';
  filterMatchedIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** Bulk mutation payload type. */
export type BulkMutationUuidPayload = {
  __typename?: 'BulkMutationUuidPayload';
  affectedIds?: Maybe<Array<Maybe<Scalars['UUID']['output']>>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type CheckAcquisitionAmazonS3Input = {
  accessKeyId: Scalars['String']['input'];
  bucketName: Scalars['String']['input'];
  region: AmazonS3Region;
  secretAccessKey?: InputMaybe<Scalars['String']['input']>;
};

export type CheckAcquisitionAzureBlobInput = {
  accountKey?: InputMaybe<Scalars['String']['input']>;
  accountName: Scalars['String']['input'];
  containerName: Scalars['String']['input'];
};

export type CheckAcquisitionS3CompatibleInput = {
  accessKeyId: Scalars['String']['input'];
  bucketName: Scalars['String']['input'];
  s3Endpoint: Scalars['String']['input'];
  secretAccessKey?: InputMaybe<Scalars['String']['input']>;
};

export type CheckAcquisitionStorageConnectionInput = {
  amazonS3?: InputMaybe<CheckAcquisitionAmazonS3Input>;
  azureBlob?: InputMaybe<CheckAcquisitionAzureBlobInput>;
  hostingAzure?: InputMaybe<CheckAcquisitionAzureBlobInput>;
  /**
   * When provided, stored credentials for this profile are used when a
   * secret field is omitted from the input (e.g. editing an existing
   * profile without retyping the secret).
   */
  profileId?: InputMaybe<Scalars['UUID']['input']>;
  provider: StorageProvider;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  s3Compatible?: InputMaybe<CheckAcquisitionS3CompatibleInput>;
};

export type CheckStorageConnectionPayload = {
  __typename?: 'CheckStorageConnectionPayload';
  errorCode?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  query?: Maybe<Query>;
};

/** The deleted image upload webhook signing secret. */
export type ClearImageUploadWebhookSecretPayload = {
  __typename?: 'ClearImageUploadWebhookSecretPayload';
  /** Boolean indicating if the secret was deleted */
  deleted: Scalars['Boolean']['output'];
  query?: Maybe<Query>;
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
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
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
  clientMutationId?: Maybe<Scalars['String']['output']>;
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

/** A filter to be used against Date fields. All fields are combined with a logical ‘and.’ */
export type DateFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Date']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Date']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Date']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Date']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Date']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Date']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Date']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Date']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Date']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Date']['input']>>;
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

/**
 * All input for the `deleteImage` mutation.
 * @permissions: IMAGES_EDIT,ADMIN
 */
export type DeleteImageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `Image` mutation. */
export type DeleteImagePayload = {
  __typename?: 'DeleteImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Image` that was deleted by this mutation. */
  image?: Maybe<Image>;
  /** An edge for our `Image`. May be used by Relay 1. */
  imageEdge?: Maybe<ImagesEdge>;
  /** Reads a single `ImageType` that is related to this `Image`. */
  imageType?: Maybe<ImageType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Image` mutation. */
export type DeleteImagePayloadImageEdgeArgs = {
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
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
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  imageId: Scalars['UUID']['input'];
  /** @notEmpty() */
  name: Scalars['String']['input'];
};

/** The output of our delete `ImagesTag` mutation. */
export type DeleteImagesTagPayload = {
  __typename?: 'DeleteImagesTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
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

/** Response when an image upload webhook configuration is deleted. */
export type DeleteImageUploadWebhookConfigurationPayload = {
  __typename?: 'DeleteImageUploadWebhookConfigurationPayload';
  deleted: Scalars['Boolean']['output'];
  query?: Maybe<Query>;
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
  /** The Access Key from Acquisition Profile is invalid. */
  AmazonS3InvalidAccessKey = 'AMAZON_S3_INVALID_ACCESS_KEY',
  /** The Bucket Name from Acquisition Profile is invalid. */
  AmazonS3InvalidBucketName = 'AMAZON_S3_INVALID_BUCKET_NAME',
  /** The image in path [%s] was not found in acquisition storage. Please confirm that the image file exists and that path is correct. Amazon S3 storage paths are case sensitive. */
  AmazonS3InvalidImagePath = 'AMAZON_S3_INVALID_IMAGE_PATH',
  /** The Region from Acquisition Profile is invalid. Please make sure it matches the account details. */
  AmazonS3InvalidRegion = 'AMAZON_S3_INVALID_REGION',
  /** The Access Key ID or the Region from Acquisition Profile is invalid. Please make sure they match your account details. */
  AmazonS3InvalidRegionOrAccessKeyId = 'AMAZON_S3_INVALID_REGION_OR_ACCESS_KEY_ID',
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
  /** Unable to authenticate the Storage Account. Please check if the Storage Account Key is correct. */
  AzureBlobAuthenticationFailed = 'AZURE_BLOB_AUTHENTICATION_FAILED',
  /** The image in path [%s] was not found in acquisition storage. Please confirm that the image file exists and that path is correct. Azure blob storage paths are case sensitive. */
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
  /** A database operation has failed because of a lock timeout. */
  DatabaseLockTimeoutError = 'DATABASE_LOCK_TIMEOUT_ERROR',
  /** An authorization database error has occurred. The user might not have enough permissions. */
  DatabasePermissionsCheckFailed = 'DATABASE_PERMISSIONS_CHECK_FAILED',
  /** An expected and handled database constraint error has occurred. The actual message will have more information. */
  DatabaseValidationFailed = 'DATABASE_VALIDATION_FAILED',
  /** Unable to declare image types as at least one other image type is already used by a different service. Please check the error details for the list of already declared image types and their service IDs. */
  DeclareImageTypesDuplicate = 'DECLARE_IMAGE_TYPES_DUPLICATE',
  /** Could not process the ensure image exists command after multiple retries. */
  EnsureImageExistsFailed = 'ENSURE_IMAGE_EXISTS_FAILED',
  /** Unknown error occurred while calling the image upload webhook. */
  ErrorCallingImageUploadWebhook = 'ERROR_CALLING_IMAGE_UPLOAD_WEBHOOK',
  /** This is a wrapper error for the original unhandled error of unsupported type. */
  ErrorWrapper = 'ERROR_WRAPPER',
  /** Unable to generate image upload webhook secret. */
  FailedGenerateImageUploadWebhookSecret = 'FAILED_GENERATE_IMAGE_UPLOAD_WEBHOOK_SECRET',
  /** A GraphQL validation error has occurred. Please make sure that the GraphQL request is made with correct syntax or parameters. */
  GraphqlValidationFailed = 'GRAPHQL_VALIDATION_FAILED',
  /** The Identity service is not accessible. Please contact Axinom support. */
  IdentityServiceNotAccessible = 'IDENTITY_SERVICE_NOT_ACCESSIBLE',
  /** Unable to download image from Amazon S3 storage. Please contact Axinom support. */
  ImageDownloadFromAcquisitionStorageFailed = 'IMAGE_DOWNLOAD_FROM_ACQUISITION_STORAGE_FAILED',
  /** Unable to find the image to delete as both image ID and original source location are not specified. */
  ImageIdentifiersNotProvided = 'IMAGE_IDENTIFIERS_NOT_PROVIDED',
  /** The image path is invalid. */
  ImageInvalidPath = 'IMAGE_INVALID_PATH',
  /** Could not read the image file to get the image metadata. */
  ImageMetadataReadingError = 'IMAGE_METADATA_READING_ERROR',
  /** The image was not found. */
  ImageNotFound = 'IMAGE_NOT_FOUND',
  /** The image resolution exceeds the maximum pixel count of %s. Please retry with a smaller resolution. */
  ImageResolutionExceeded = 'IMAGE_RESOLUTION_EXCEEDED',
  /** The image size exceeds %sMB. Please retry with a smaller image. */
  ImageSizeExceeded = 'IMAGE_SIZE_EXCEEDED',
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
  /** At least one of the following permissions is required to perform this action: %s. */
  InsufficientPermissions = 'INSUFFICIENT_PERMISSIONS',
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
  /** The Access Key ID from Acquisition Profile is invalid. Please make sure it matches your account details. */
  S3CompatibleInvalidAccessKeyId = 'S3_COMPATIBLE_INVALID_ACCESS_KEY_ID',
  /** The S3 Endpoint from Acquisition Profile is invalid. Please make sure it is correct. */
  S3CompatibleInvalidEndpoint = 'S3_COMPATIBLE_INVALID_ENDPOINT',
  /** Unable to set the general settings because no input values were provided. */
  SetSettingsInputIsEmpty = 'SET_SETTINGS_INPUT_IS_EMPTY',
  /** Could not find a matching signing key to verify the access token. The signing key used to create the token may have been revoked or the Tenant/Environment/Application configuration is erroneous. */
  SigningKeyNotFound = 'SIGNING_KEY_NOT_FOUND',
  /** An application startup error has occurred. The actual message will have more information. */
  StartupError = 'STARTUP_ERROR',
  /** User is authenticated, but subject information was not found. Please contact Axinom Support. */
  SubjectInformationNotFound = 'SUBJECT_INFORMATION_NOT_FOUND',
  /** User is authenticated, but subject information was not found. Please contact Axinom Support. */
  SubjectNotFound = 'SUBJECT_NOT_FOUND',
  /** An unexpected error has happened. Please try again. */
  TransientError = 'TRANSIENT_ERROR',
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
  /** Unable to update the profile because no update values were provided. */
  UpdateInputIsEmpty = 'UPDATE_INPUT_IS_EMPTY',
  /** The image upload webhook returned errors. */
  UploadImageWebhookError = 'UPLOAD_IMAGE_WEBHOOK_ERROR',
  /** User is not authorized to access the operation. */
  UserNotAuthorized = 'USER_NOT_AUTHORIZED',
  /** The User service is not accessible. Please contact Axinom support. */
  UserServiceNotAccessible = 'USER_SERVICE_NOT_ACCESSIBLE',
  /** The %s is not an object. */
  ValueIsNotObject = 'VALUE_IS_NOT_OBJECT',
  /** Websocket not found in ExtendedGraphQLContext. This is a development time issue. A reference to the websocket must be included in Postgraphile build options. */
  WebsocketNotFound = 'WEBSOCKET_NOT_FOUND'
}

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type GeneralSetting = {
  __typename?: 'GeneralSetting';
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  imageUploadWebhookSecretIsSet: Scalars['Boolean']['output'];
  imageUploadWebhookUrl?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** The generated image upload webhook signing secret. */
export type GenerateImageUploadWebhookSecretPayload = {
  __typename?: 'GenerateImageUploadWebhookSecretPayload';
  query?: Maybe<Query>;
  /** Generated secret. */
  secret: Scalars['String']['output'];
};

/** A `String` edge in the connection. */
export type GetImagesTagsValueEdge = {
  __typename?: 'GetImagesTagsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of `String` values. */
export type GetImagesTagsValuesConnection = {
  __typename?: 'GetImagesTagsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetImagesTagsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']['output']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN */
export type Image = {
  __typename?: 'Image';
  altText?: Maybe<Scalars['String']['output']>;
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  fileSizeInBytes?: Maybe<Scalars['Int']['output']>;
  focalX?: Maybe<Scalars['BigFloat']['output']>;
  focalY?: Maybe<Scalars['BigFloat']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `ImagesTag`. */
  imagesTags: ImagesTagsConnection;
  /** Reads a single `ImageType` that is related to this `Image`. */
  imageType?: Maybe<ImageType>;
  imageTypeKey: Scalars['String']['output'];
  isArchived: Scalars['Boolean']['output'];
  originalSourceLocation?: Maybe<Scalars['String']['output']>;
  previewPath: Scalars['String']['output'];
  sourceFileName: Scalars['String']['output'];
  sourceFileType: Scalars['String']['output'];
  thumbnailPath: Scalars['String']['output'];
  title: Scalars['String']['output'];
  transformationPath: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};


/** @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN */
export type ImageImagesTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ImagesTagCondition>;
  filter?: InputMaybe<ImagesTagFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ImagesTagsOrderBy>>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,IMAGES_EDIT,ADMIN */
export type ImageAcquisitionAmazonS3Setting = {
  __typename?: 'ImageAcquisitionAmazonS3Setting';
  accessKeyId: Scalars['String']['output'];
  bucketName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `ImageAcquisitionProfile` that is related to this `ImageAcquisitionAmazonS3Setting`. */
  imageAcquisitionProfile?: Maybe<ImageAcquisitionProfile>;
  imageAcquisitionProfileId: Scalars['UUID']['output'];
  region: AmazonS3Region;
  rootFolderPath?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
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
  accountName: Scalars['String']['output'];
  containerName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `ImageAcquisitionProfile` that is related to this `ImageAcquisitionAzureBlobSetting`. */
  imageAcquisitionProfile?: Maybe<ImageAcquisitionProfile>;
  imageAcquisitionProfileId: Scalars['UUID']['output'];
  rootFolderPath?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
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

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type ImageAcquisitionHostingAzureSetting = {
  __typename?: 'ImageAcquisitionHostingAzureSetting';
  accountName: Scalars['String']['output'];
  containerName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `ImageAcquisitionProfile` that is related to this `ImageAcquisitionHostingAzureSetting`. */
  imageAcquisitionProfile?: Maybe<ImageAcquisitionProfile>;
  imageAcquisitionProfileId: Scalars['UUID']['output'];
  readSasToken: Scalars['String']['output'];
  readSasTokenValidUntil: Scalars['Date']['output'];
  rootFolderPath?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** A filter to be used against `ImageAcquisitionHostingAzureSetting` object types. All fields are combined with a logical ‘and.’ */
export type ImageAcquisitionHostingAzureSettingFilter = {
  /** Filter by the object’s `accountName` field. */
  accountName?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ImageAcquisitionHostingAzureSettingFilter>>;
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
  not?: InputMaybe<ImageAcquisitionHostingAzureSettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ImageAcquisitionHostingAzureSettingFilter>>;
  /** Filter by the object’s `readSasToken` field. */
  readSasToken?: InputMaybe<StringFilter>;
  /** Filter by the object’s `readSasTokenValidUntil` field. */
  readSasTokenValidUntil?: InputMaybe<DateFilter>;
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
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `ImageAcquisitionHostingAzureSetting` that is related to this `ImageAcquisitionProfile`. */
  hostingAzureSetting?: Maybe<ImageAcquisitionHostingAzureSetting>;
  id: Scalars['UUID']['output'];
  provider: StorageProvider;
  /** Reads a single `ImageAcquisitionS3CompatibleSetting` that is related to this `ImageAcquisitionProfile`. */
  S3CompatibleSetting?: Maybe<ImageAcquisitionS3CompatibleSetting>;
  title: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/**
 * A condition to be used against `ImageAcquisitionProfile` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type ImageAcquisitionProfileCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `provider` field. */
  provider?: InputMaybe<StorageProvider>;
  /**
   * Checks for equality with the object’s `title` field.
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `ImageAcquisitionProfile` object types. All fields are combined with a logical ‘and.’ */
export type ImageAcquisitionProfileFilter = {
  /** Filter by the object’s `amazonS3Setting` relation. */
  amazonS3Setting?: InputMaybe<ImageAcquisitionAmazonS3SettingFilter>;
  /** A related `amazonS3Setting` exists. */
  amazonS3SettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ImageAcquisitionProfileFilter>>;
  /** Filter by the object’s `azureBlobSetting` relation. */
  azureBlobSetting?: InputMaybe<ImageAcquisitionAzureBlobSettingFilter>;
  /** A related `azureBlobSetting` exists. */
  azureBlobSettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `hostingAzureSetting` relation. */
  hostingAzureSetting?: InputMaybe<ImageAcquisitionHostingAzureSettingFilter>;
  /** A related `hostingAzureSetting` exists. */
  hostingAzureSettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ImageAcquisitionProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ImageAcquisitionProfileFilter>>;
  /** Filter by the object’s `provider` field. */
  provider?: InputMaybe<StorageProviderFilter>;
  /** Filter by the object’s `S3CompatibleSetting` relation. */
  S3CompatibleSetting?: InputMaybe<ImageAcquisitionS3CompatibleSettingFilter>;
  /** A related `S3CompatibleSetting` exists. */
  S3CompatibleSettingExists?: InputMaybe<Scalars['Boolean']['input']>;
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
  totalCount: Scalars['Int']['output'];
};

/** A `ImageAcquisitionProfile` edge in the connection. */
export type ImageAcquisitionProfilesEdge = {
  __typename?: 'ImageAcquisitionProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
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
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdAccountNameAsc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ACCOUNT_NAME_ASC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdAccountNameDesc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ACCOUNT_NAME_DESC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdContainerNameAsc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CONTAINER_NAME_ASC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdContainerNameDesc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CONTAINER_NAME_DESC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdCreatedDateAsc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_DATE_ASC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdCreatedDateDesc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_DATE_DESC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdCreatedUserAsc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_USER_ASC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdCreatedUserDesc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_USER_DESC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdImageAcquisitionProfileIdAsc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__IMAGE_ACQUISITION_PROFILE_ID_ASC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdImageAcquisitionProfileIdDesc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__IMAGE_ACQUISITION_PROFILE_ID_DESC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdReadSasTokenAsc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__READ_SAS_TOKEN_ASC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdReadSasTokenDesc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__READ_SAS_TOKEN_DESC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdReadSasTokenValidUntilAsc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__READ_SAS_TOKEN_VALID_UNTIL_ASC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdReadSasTokenValidUntilDesc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__READ_SAS_TOKEN_VALID_UNTIL_DESC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdRootFolderPathAsc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ROOT_FOLDER_PATH_ASC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdRootFolderPathDesc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ROOT_FOLDER_PATH_DESC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdUpdatedDateAsc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_DATE_ASC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdUpdatedDateDesc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_DATE_DESC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdUpdatedUserAsc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_USER_ASC',
  ImageAcquisitionHostingAzureSettingByImageAcquisitionProfileIdUpdatedUserDesc = 'IMAGE_ACQUISITION_HOSTING_AZURE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_USER_DESC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdAccessKeyIdAsc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ACCESS_KEY_ID_ASC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdAccessKeyIdDesc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ACCESS_KEY_ID_DESC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdBucketNameAsc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__BUCKET_NAME_ASC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdBucketNameDesc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__BUCKET_NAME_DESC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdCreatedDateAsc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_DATE_ASC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdCreatedDateDesc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_DATE_DESC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdCreatedUserAsc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_USER_ASC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdCreatedUserDesc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__CREATED_USER_DESC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdImageAcquisitionProfileIdAsc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__IMAGE_ACQUISITION_PROFILE_ID_ASC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdImageAcquisitionProfileIdDesc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__IMAGE_ACQUISITION_PROFILE_ID_DESC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdRootFolderPathAsc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ROOT_FOLDER_PATH_ASC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdRootFolderPathDesc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__ROOT_FOLDER_PATH_DESC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdS3EndpointAsc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__S3_ENDPOINT_ASC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdS3EndpointDesc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__S3_ENDPOINT_DESC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdSecretAccessKeyAsc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__SECRET_ACCESS_KEY_ASC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdSecretAccessKeyDesc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__SECRET_ACCESS_KEY_DESC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdUpdatedDateAsc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_DATE_ASC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdUpdatedDateDesc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_DATE_DESC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdUpdatedUserAsc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_USER_ASC',
  ImageAcquisitionS3CompatibleSettingByImageAcquisitionProfileIdUpdatedUserDesc = 'IMAGE_ACQUISITION_S3_COMPATIBLE_SETTING_BY_IMAGE_ACQUISITION_PROFILE_ID__UPDATED_USER_DESC',
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

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,IMAGES_EDIT,ADMIN */
export type ImageAcquisitionS3CompatibleSetting = {
  __typename?: 'ImageAcquisitionS3CompatibleSetting';
  accessKeyId: Scalars['String']['output'];
  bucketName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `ImageAcquisitionProfile` that is related to this `ImageAcquisitionS3CompatibleSetting`. */
  imageAcquisitionProfile?: Maybe<ImageAcquisitionProfile>;
  imageAcquisitionProfileId: Scalars['UUID']['output'];
  rootFolderPath?: Maybe<Scalars['String']['output']>;
  s3Endpoint: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** A filter to be used against `ImageAcquisitionS3CompatibleSetting` object types. All fields are combined with a logical ‘and.’ */
export type ImageAcquisitionS3CompatibleSettingFilter = {
  /** Filter by the object’s `accessKeyId` field. */
  accessKeyId?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ImageAcquisitionS3CompatibleSettingFilter>>;
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
  not?: InputMaybe<ImageAcquisitionS3CompatibleSettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ImageAcquisitionS3CompatibleSettingFilter>>;
  /** Filter by the object’s `rootFolderPath` field. */
  rootFolderPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `s3Endpoint` field. */
  s3Endpoint?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** A condition to be used against `Image` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ImageCondition = {
  /**
   * Checks for equality with the object’s `altText` field.
   * @maxLength(1000)
   */
  altText?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `filename` field. */
  filename?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `fileSizeInBytes` field. */
  fileSizeInBytes?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `focalX` field. */
  focalX?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Checks for equality with the object’s `focalY` field. */
  focalY?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Checks for equality with the object’s `height` field. */
  height?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `imageTypeKey` field. */
  imageTypeKey?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `originalSourceLocation` field. */
  originalSourceLocation?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sourceFileName` field. */
  sourceFileName?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sourceFileType` field. */
  sourceFileType?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `title` field.
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `width` field. */
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `Image` object types. All fields are combined with a logical ‘and.’ */
export type ImageFilter = {
  /** Filter by the object’s `altText` field. */
  altText?: InputMaybe<StringFilter>;
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
  imagesTagsExist?: InputMaybe<Scalars['Boolean']['input']>;
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
  /** @maxLength(1000) */
  altText?: InputMaybe<Scalars['String']['input']>;
  focalX?: InputMaybe<Scalars['BigFloat']['input']>;
  focalY?: InputMaybe<Scalars['BigFloat']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']['input']>;
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
  totalCount: Scalars['Int']['output'];
};

/** A `Image` edge in the connection. */
export type ImagesEdge = {
  __typename?: 'ImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Image` at the end of the edge. */
  node: Image;
};

/** Methods to use when ordering `Image`. */
export enum ImagesOrderBy {
  AltTextAsc = 'ALT_TEXT_ASC',
  AltTextDesc = 'ALT_TEXT_DESC',
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
  imageId: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

/**
 * A condition to be used against `ImagesTag` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type ImagesTagCondition = {
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']['input']>;
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']['input']>;
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
  imageId: Scalars['UUID']['input'];
  /** @notEmpty() */
  name: Scalars['String']['input'];
};

/** Represents an update to a `ImagesTag`. Fields that are set will be updated. */
export type ImagesTagPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']['input']>;
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
  totalCount: Scalars['Int']['output'];
};

/** A `ImagesTag` edge in the connection. */
export type ImagesTagsEdge = {
  __typename?: 'ImagesTagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ImagesTag` at the end of the edge. */
  node: ImagesTag;
};

/** Methods to use when ordering `ImagesTag`. */
export enum ImagesTagsOrderBy {
  ImageByImageIdAltTextAsc = 'IMAGE_BY_IMAGE_ID__ALT_TEXT_ASC',
  ImageByImageIdAltTextDesc = 'IMAGE_BY_IMAGE_ID__ALT_TEXT_DESC',
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

export enum ImageSubscriptionEventKey {
  ImageChanged = 'IMAGE_CHANGED',
  ImageCreated = 'IMAGE_CREATED',
  ImageDeleted = 'IMAGE_DELETED',
  ImageTagChanged = 'IMAGE_TAG_CHANGED',
  ImageTagCreated = 'IMAGE_TAG_CREATED',
  ImageTagDeleted = 'IMAGE_TAG_DELETED'
}

export type ImageSubscriptionPayload = {
  __typename?: 'ImageSubscriptionPayload';
  /** @deprecated Use 'eventKey' instead. */
  event?: Maybe<Scalars['String']['output']>;
  eventKey?: Maybe<ImageSubscriptionEventKey>;
  id: Scalars['UUID']['output'];
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
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Image`. */
  images: ImagesConnection;
  imageType: Scalars['String']['output'];
  isArchived: Scalars['Boolean']['output'];
  serviceId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};


/** @permissions: IMAGES_VIEW,IMAGES_EDIT,ADMIN,IMAGE_TYPES_DECLARE */
export type ImageTypeImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ImageCondition>;
  filter?: InputMaybe<ImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
};

/**
 * A condition to be used against `ImageType` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type ImageTypeCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `imageType` field.
   * @isTrimmed()
   * @notEmpty()
   */
  imageType?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `serviceId` field. */
  serviceId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']['input']>;
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
  imagesExist?: InputMaybe<Scalars['Boolean']['input']>;
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
  totalCount: Scalars['Int']['output'];
};

/** A `ImageType` edge in the connection. */
export type ImageTypesEdge = {
  __typename?: 'ImageTypesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
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
  distinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  archiveImages?: Maybe<BulkMutationUuidPayload>;
  bulkEditImagesAsync?: Maybe<BulkEditAsyncPayloadType>;
  checkAcquisitionStorageConnection: CheckStorageConnectionPayload;
  /** Clear image upload webhook secret for signing. */
  clearImageUploadWebhookSecret: ClearImageUploadWebhookSecretPayload;
  /** Creates a single `ImagesTag`. */
  createImagesTag?: Maybe<CreateImagesTagPayload>;
  /** Deletes a single `Image` using a unique key. */
  deleteImage?: Maybe<DeleteImagePayload>;
  /** Deletes a single `ImagesTag` using a unique key. */
  deleteImagesTag?: Maybe<DeleteImagesTagPayload>;
  /** Mutation do delete an existing image upload webhook configuration. */
  deleteImageUploadWebhookConfiguration: DeleteImageUploadWebhookConfigurationPayload;
  /** Generate a new image upload webhook secret for signing. */
  generateImageUploadWebhookSecret: GenerateImageUploadWebhookSecretPayload;
  setAmazonS3AcquisitionProfile: ImageAcquisitionProfile;
  setAzureBlobAcquisitionProfile: ImageAcquisitionProfile;
  /** Mutation to set General Settings in Image Service. */
  setGeneralSettings: GeneralSetting;
  setHostingAzureAcquisitionProfile: ImageAcquisitionProfile;
  setS3CompatibleAcquisitionProfile: ImageAcquisitionProfile;
  startImagesDeletion?: Maybe<BulkMutationUuidPayload>;
  unarchiveImages?: Maybe<BulkMutationUuidPayload>;
  updateAmazonS3AcquisitionProfile: ImageAcquisitionProfile;
  updateAzureBlobAcquisitionProfile: ImageAcquisitionProfile;
  updateHostingAzureAcquisitionProfile: ImageAcquisitionProfile;
  /** Updates a single `Image` using a unique key and a patch. */
  updateImage?: Maybe<UpdateImagePayload>;
  /** Updates a single `ImagesTag` using a unique key and a patch. */
  updateImagesTag?: Maybe<UpdateImagesTagPayload>;
  updateS3CompatibleAcquisitionProfile: ImageAcquisitionProfile;
  uploadImage?: Maybe<UploadImagePayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationArchiveImagesArgs = {
  filter?: InputMaybe<ImageFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationBulkEditImagesAsyncArgs = {
  filter?: InputMaybe<ImageFilter>;
  relatedEntitiesToAdd?: InputMaybe<BulkEditAsyncImageAddInput>;
  relatedEntitiesToClear?: InputMaybe<BulkEditAsyncImageClearInput>;
  relatedEntitiesToRemove?: InputMaybe<BulkEditAsyncImageRemoveInput>;
  set?: InputMaybe<ImagePatch>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCheckAcquisitionStorageConnectionArgs = {
  input: CheckAcquisitionStorageConnectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateImagesTagArgs = {
  input: CreateImagesTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteImageArgs = {
  input: DeleteImageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteImagesTagArgs = {
  input: DeleteImagesTagInput;
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
export type MutationSetGeneralSettingsArgs = {
  input: SetGeneralSettingsInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetHostingAzureAcquisitionProfileArgs = {
  input: SetHostingAzureAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetS3CompatibleAcquisitionProfileArgs = {
  input: SetS3CompatibleAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationStartImagesDeletionArgs = {
  filter?: InputMaybe<ImageFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnarchiveImagesArgs = {
  filter?: InputMaybe<ImageFilter>;
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
export type MutationUpdateHostingAzureAcquisitionProfileArgs = {
  input: UpdateHostingAzureAcquisitionProfileInput;
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
export type MutationUpdateS3CompatibleAcquisitionProfileArgs = {
  input: UpdateS3CompatibleAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUploadImageArgs = {
  input: UploadImageInput;
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
  getGeneralSettings?: Maybe<GeneralSetting>;
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
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryImageArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryImageAcquisitionProfileArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryImageAcquisitionProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ImageAcquisitionProfileCondition>;
  filter?: InputMaybe<ImageAcquisitionProfileFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ImageAcquisitionProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ImageCondition>;
  filter?: InputMaybe<ImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryImagesTagArgs = {
  imageId: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryImagesTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ImagesTagCondition>;
  filter?: InputMaybe<ImagesTagFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ImagesTagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryImageTypeArgs = {
  imageType: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryImageTypesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ImageTypeCondition>;
  filter?: InputMaybe<ImageTypeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ImageTypesOrderBy>>;
};

export type SetAmazonS3AcquisitionProfileInput = {
  accessKeyId: Scalars['String']['input'];
  bucketName: Scalars['String']['input'];
  region: AmazonS3Region;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  secretAccessKey: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SetAzureBlobAcquisitionProfileInput = {
  accountKey: Scalars['String']['input'];
  accountName: Scalars['String']['input'];
  containerName: Scalars['String']['input'];
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

/** Input for setting General Settings in Image Service. */
export type SetGeneralSettingsInput = {
  imageUploadWebhookUrl?: InputMaybe<Scalars['String']['input']>;
};

export type SetHostingAzureAcquisitionProfileInput = {
  accountName: Scalars['String']['input'];
  containerName: Scalars['String']['input'];
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type SetS3CompatibleAcquisitionProfileInput = {
  accessKeyId: Scalars['String']['input'];
  bucketName: Scalars['String']['input'];
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  s3Endpoint: Scalars['String']['input'];
  secretAccessKey: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export enum StorageProvider {
  /** Amazon S3 */
  AmazonS3 = 'AMAZON_S3',
  /** Azure Blob */
  AzureBlob = 'AZURE_BLOB',
  /** Mosaic Hosting Service - Azure */
  HostingServiceAzure = 'HOSTING_SERVICE_AZURE',
  /** S3 Compatible */
  S3Compatible = 'S3_COMPATIBLE'
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
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
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

/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type Subscription = {
  __typename?: 'Subscription';
  /** Triggered when a Image is mutated (insert, update or delete).  */
  imageMutated?: Maybe<ImageSubscriptionPayload>;
};

export type UpdateAmazonS3AcquisitionProfileInput = {
  accessKeyId?: InputMaybe<Scalars['String']['input']>;
  bucketName?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<AmazonS3Region>;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  secretAccessKey?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAzureBlobAcquisitionProfileInput = {
  accountKey?: InputMaybe<Scalars['String']['input']>;
  accountName?: InputMaybe<Scalars['String']['input']>;
  containerName?: InputMaybe<Scalars['String']['input']>;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateHostingAzureAcquisitionProfileInput = {
  containerName?: InputMaybe<Scalars['String']['input']>;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
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
  clientMutationId?: Maybe<Scalars['String']['output']>;
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
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  imageId: Scalars['UUID']['input'];
  /** @notEmpty() */
  name: Scalars['String']['input'];
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
  clientMutationId?: Maybe<Scalars['String']['output']>;
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

export type UpdateS3CompatibleAcquisitionProfileInput = {
  accessKeyId?: InputMaybe<Scalars['String']['input']>;
  bucketName?: InputMaybe<Scalars['String']['input']>;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  s3Endpoint?: InputMaybe<Scalars['String']['input']>;
  secretAccessKey?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UploadImageInput = {
  file: Scalars['Upload']['input'];
  imageType: Scalars['String']['input'];
};

export type UploadImagePayload = {
  __typename?: 'UploadImagePayload';
  image?: Maybe<Image>;
  query?: Maybe<Query>;
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

export type GetImagesQueryVariables = Exact<{
  filter?: Types.ImageFilter | null | undefined;
}>;


export type GetImagesQuery = { images: { nodes: Array<{ id: any, height: number | null, width: number | null, imageTypeKey: string, transformationPath: string, altText: string | null }> } | null };


export const GetImagesDocument = gql`
    query GetImages($filter: ImageFilter) {
  images(filter: $filter) {
    nodes {
      id
      height
      width
      imageTypeKey
      transformationPath
      altText
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();
const GetImagesDocumentString = print(GetImagesDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetImages(variables?: GetImagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetImagesQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetImagesQuery>(GetImagesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetImages', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;