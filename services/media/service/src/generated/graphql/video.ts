/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './video';

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
  BigInt: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  Date: { input: any; output: any; }
  Datetime: { input: any; output: any; }
  JSON: { input: any; output: any; }
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

export enum AudioFormat {
  /** AAC */
  Aac = 'AAC',
  /** AC3 */
  Ac3 = 'AC3'
}

/** A filter to be used against AudioFormat fields. All fields are combined with a logical ‘and.’ */
export type AudioFormatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<AudioFormat>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<AudioFormat>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<AudioFormat>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<AudioFormat>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<AudioFormat>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<AudioFormat>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<AudioFormat>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<AudioFormat>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<AudioFormat>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<AudioFormat>>;
};

export enum AudioRepresentationCreate {
  /** Always */
  Always = 'ALWAYS',
  /** On Matching Sound */
  OnMatchingSound = 'ON_MATCHING_SOUND'
}

/** A filter to be used against AudioRepresentationCreate fields. All fields are combined with a logical ‘and.’ */
export type AudioRepresentationCreateFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<AudioRepresentationCreate>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<AudioRepresentationCreate>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<AudioRepresentationCreate>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<AudioRepresentationCreate>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<AudioRepresentationCreate>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<AudioRepresentationCreate>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<AudioRepresentationCreate>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<AudioRepresentationCreate>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<AudioRepresentationCreate>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<AudioRepresentationCreate>>;
};

export enum AudioRepresentationSound {
  /** 5.1 */
  FivePointOne = 'FIVE_POINT_ONE',
  /** Mono */
  Mono = 'MONO',
  /** Stereo */
  Stereo = 'STEREO'
}

/** A filter to be used against AudioRepresentationSound fields. All fields are combined with a logical ‘and.’ */
export type AudioRepresentationSoundFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<AudioRepresentationSound>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<AudioRepresentationSound>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<AudioRepresentationSound>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<AudioRepresentationSound>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<AudioRepresentationSound>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<AudioRepresentationSound>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<AudioRepresentationSound>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<AudioRepresentationSound>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<AudioRepresentationSound>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<AudioRepresentationSound>>;
};

/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export type BigIntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigInt']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigInt']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigInt']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigInt']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  region?: InputMaybe<Scalars['String']['input']>;
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

export type CheckPublishingAmazonS3Input = {
  accessKeyId: Scalars['String']['input'];
  bucketName: Scalars['String']['input'];
  region: AmazonS3Region;
  secretAccessKey?: InputMaybe<Scalars['String']['input']>;
};

export type CheckPublishingAzureBlobInput = {
  accountKey?: InputMaybe<Scalars['String']['input']>;
  accountName: Scalars['String']['input'];
  containerName: Scalars['String']['input'];
};

export type CheckPublishingS3CompatibleInput = {
  accessKeyId: Scalars['String']['input'];
  bucketName: Scalars['String']['input'];
  region?: InputMaybe<Scalars['String']['input']>;
  s3Endpoint: Scalars['String']['input'];
  secretAccessKey?: InputMaybe<Scalars['String']['input']>;
};

export type CheckPublishingStorageConnectionInput = {
  amazonS3?: InputMaybe<CheckPublishingAmazonS3Input>;
  azureBlob?: InputMaybe<CheckPublishingAzureBlobInput>;
  hostingAzure?: InputMaybe<CheckPublishingAzureBlobInput>;
  /**
   * When provided, stored credentials for this profile are used when a
   * secret field is omitted from the input (e.g. editing an existing
   * profile without retyping the secret).
   */
  profileId?: InputMaybe<Scalars['UUID']['input']>;
  provider: StorageProvider;
  s3Compatible?: InputMaybe<CheckPublishingS3CompatibleInput>;
};

export type CheckSourceLocationInput = {
  acquisitionProfileId?: InputMaybe<Scalars['UUID']['input']>;
  path: Scalars['String']['input'];
};

export type CheckSourceLocationPayload = {
  __typename?: 'CheckSourceLocationPayload';
  exists: Scalars['Boolean']['output'];
  query?: Maybe<Query>;
};

export type CheckStorageConnectionPayload = {
  __typename?: 'CheckStorageConnectionPayload';
  errorCode?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  query?: Maybe<Query>;
};

export enum ClosedCaptionPlacement {
  /** Default */
  Default = 'DEFAULT',
  /** In-Stream */
  InStream = 'IN_STREAM',
  /** Sidecar */
  Sidecar = 'SIDECAR'
}

/** A filter to be used against ClosedCaptionPlacement fields. All fields are combined with a logical ‘and.’ */
export type ClosedCaptionPlacementFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<ClosedCaptionPlacement>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<ClosedCaptionPlacement>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<ClosedCaptionPlacement>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<ClosedCaptionPlacement>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<ClosedCaptionPlacement>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<ClosedCaptionPlacement>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<ClosedCaptionPlacement>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<ClosedCaptionPlacement>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<ClosedCaptionPlacement>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<ClosedCaptionPlacement>>;
};

/**
 * All input for the create `CuePoint` mutation.
 * @permissions: VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type CreateCuePointInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `CuePoint` to be created by this mutation. */
  cuePoint: CuePointInput;
};

/** An input for a single cue point to be created by the `createCuePoints` mutation. */
export type CreateCuePointItemInput = {
  cuePointTypeKey: Scalars['String']['input'];
  timeInSeconds: Scalars['Float']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `CuePoint` mutation. */
export type CreateCuePointPayload = {
  __typename?: 'CreateCuePointPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `CuePoint` that was created by this mutation. */
  cuePoint?: Maybe<CuePoint>;
  /** An edge for our `CuePoint`. May be used by Relay 1. */
  cuePointEdge?: Maybe<CuePointsEdge>;
  /** Reads a single `CuePointType` that is related to this `CuePoint`. */
  cuePointType?: Maybe<CuePointType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Video` that is related to this `CuePoint`. */
  video?: Maybe<Video>;
};


/** The output of our create `CuePoint` mutation. */
export type CreateCuePointPayloadCuePointEdgeArgs = {
  orderBy?: InputMaybe<Array<CuePointsOrderBy>>;
};

/** All input for the `createCuePoints` mutation. */
export type CreateCuePointsInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The cue points to be created by this mutation. */
  cuePoints: Array<CreateCuePointItemInput>;
  /** The `Video` the cue points should be created for. */
  videoId: Scalars['UUID']['input'];
};

/** The output of our `createCuePoints` mutation. */
export type CreateCuePointsPayload = {
  __typename?: 'CreateCuePointsPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `CuePoint`s that were created by this mutation. */
  cuePoints?: Maybe<Array<CuePoint>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export type CreateCustomVideoInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The custom `Video` to be created by this mutation. */
  video: CustomVideoInput;
};

export type CreateCustomVideoPayload = {
  __typename?: 'CreateCustomVideoPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The custom `Video` that was created by this mutation. */
  video?: Maybe<Video>;
};

/**
 * All input for the create `EncodingAudioRepresentation` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type CreateEncodingAudioRepresentationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `EncodingAudioRepresentation` to be created by this mutation. */
  encodingAudioRepresentation: EncodingAudioRepresentationInput;
};

/** The output of our create `EncodingAudioRepresentation` mutation. */
export type CreateEncodingAudioRepresentationPayload = {
  __typename?: 'CreateEncodingAudioRepresentationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingAudioRepresentation` that was created by this mutation. */
  encodingAudioRepresentation?: Maybe<EncodingAudioRepresentation>;
  /** An edge for our `EncodingAudioRepresentation`. May be used by Relay 1. */
  encodingAudioRepresentationEdge?: Maybe<EncodingAudioRepresentationsEdge>;
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingAudioRepresentation`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EncodingAudioRepresentation` mutation. */
export type CreateEncodingAudioRepresentationPayloadEncodingAudioRepresentationEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingAudioRepresentationsOrderBy>>;
};

/**
 * All input for the create `EncodingDrmProfile` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type CreateEncodingDrmProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `EncodingDrmProfile` to be created by this mutation. */
  encodingDrmProfile: EncodingDrmProfileInput;
};

/** The output of our create `EncodingDrmProfile` mutation. */
export type CreateEncodingDrmProfilePayload = {
  __typename?: 'CreateEncodingDrmProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingDrmProfile` that was created by this mutation. */
  encodingDrmProfile?: Maybe<EncodingDrmProfile>;
  /** An edge for our `EncodingDrmProfile`. May be used by Relay 1. */
  encodingDrmProfileEdge?: Maybe<EncodingDrmProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EncodingDrmProfile` mutation. */
export type CreateEncodingDrmProfilePayloadEncodingDrmProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingDrmProfilesOrderBy>>;
};

/**
 * All input for the create `EncodingEmbeddedCaptionChannel` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type CreateEncodingEmbeddedCaptionChannelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `EncodingEmbeddedCaptionChannel` to be created by this mutation. */
  encodingEmbeddedCaptionChannel: EncodingEmbeddedCaptionChannelInput;
};

/** The output of our create `EncodingEmbeddedCaptionChannel` mutation. */
export type CreateEncodingEmbeddedCaptionChannelPayload = {
  __typename?: 'CreateEncodingEmbeddedCaptionChannelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingEmbeddedCaptionChannel` that was created by this mutation. */
  encodingEmbeddedCaptionChannel?: Maybe<EncodingEmbeddedCaptionChannel>;
  /** An edge for our `EncodingEmbeddedCaptionChannel`. May be used by Relay 1. */
  encodingEmbeddedCaptionChannelEdge?: Maybe<EncodingEmbeddedCaptionChannelsEdge>;
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingEmbeddedCaptionChannel`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EncodingEmbeddedCaptionChannel` mutation. */
export type CreateEncodingEmbeddedCaptionChannelPayloadEncodingEmbeddedCaptionChannelEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingEmbeddedCaptionChannelsOrderBy>>;
};

/**
 * All input for the create `EncodingProcessingProfile` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type CreateEncodingProcessingProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `EncodingProcessingProfile` to be created by this mutation. */
  encodingProcessingProfile: EncodingProcessingProfileInput;
};

/** The output of our create `EncodingProcessingProfile` mutation. */
export type CreateEncodingProcessingProfilePayload = {
  __typename?: 'CreateEncodingProcessingProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingProcessingProfile` that was created by this mutation. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** An edge for our `EncodingProcessingProfile`. May be used by Relay 1. */
  encodingProcessingProfileEdge?: Maybe<EncodingProcessingProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EncodingProcessingProfile` mutation. */
export type CreateEncodingProcessingProfilePayloadEncodingProcessingProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingProcessingProfilesOrderBy>>;
};

/**
 * All input for the create `EncodingVideoRepresentation` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type CreateEncodingVideoRepresentationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `EncodingVideoRepresentation` to be created by this mutation. */
  encodingVideoRepresentation: EncodingVideoRepresentationInput;
};

/** The output of our create `EncodingVideoRepresentation` mutation. */
export type CreateEncodingVideoRepresentationPayload = {
  __typename?: 'CreateEncodingVideoRepresentationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingVideoRepresentation`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** The `EncodingVideoRepresentation` that was created by this mutation. */
  encodingVideoRepresentation?: Maybe<EncodingVideoRepresentation>;
  /** An edge for our `EncodingVideoRepresentation`. May be used by Relay 1. */
  encodingVideoRepresentationEdge?: Maybe<EncodingVideoRepresentationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EncodingVideoRepresentation` mutation. */
export type CreateEncodingVideoRepresentationPayloadEncodingVideoRepresentationEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingVideoRepresentationsOrderBy>>;
};

/**
 * All input for the create `EncodingWatermarkProfile` mutation.
 * @permissions: ADMIN
 */
export type CreateEncodingWatermarkProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `EncodingWatermarkProfile` to be created by this mutation. */
  encodingWatermarkProfile: EncodingWatermarkProfileInput;
};

/** The output of our create `EncodingWatermarkProfile` mutation. */
export type CreateEncodingWatermarkProfilePayload = {
  __typename?: 'CreateEncodingWatermarkProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingWatermarkProfile` that was created by this mutation. */
  encodingWatermarkProfile?: Maybe<EncodingWatermarkProfile>;
  /** An edge for our `EncodingWatermarkProfile`. May be used by Relay 1. */
  encodingWatermarkProfileEdge?: Maybe<EncodingWatermarkProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EncodingWatermarkProfile` mutation. */
export type CreateEncodingWatermarkProfilePayloadEncodingWatermarkProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingWatermarkProfilesOrderBy>>;
};

/**
 * All input for the create `VideosTag` mutation.
 * @permissions: VIDEOS_ENCODE,VIDEOS_EDIT,ADMIN
 */
export type CreateVideosTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `VideosTag` to be created by this mutation. */
  videosTag: VideosTagInput;
};

/** The output of our create `VideosTag` mutation. */
export type CreateVideosTagPayload = {
  __typename?: 'CreateVideosTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Video` that is related to this `VideosTag`. */
  video?: Maybe<Video>;
  /** The `VideosTag` that was created by this mutation. */
  videosTag?: Maybe<VideosTag>;
  /** An edge for our `VideosTag`. May be used by Relay 1. */
  videosTagEdge?: Maybe<VideosTagsEdge>;
};


/** The output of our create `VideosTag` mutation. */
export type CreateVideosTagPayloadVideosTagEdgeArgs = {
  orderBy?: InputMaybe<Array<VideosTagsOrderBy>>;
};

/**
 * All input for the create `VideoStream` mutation.
 * @permissions: VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type CreateVideoStreamInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `VideoStream` to be created by this mutation. */
  videoStream: VideoStreamInput;
};

/** The output of our create `VideoStream` mutation. */
export type CreateVideoStreamPayload = {
  __typename?: 'CreateVideoStreamPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Video` that is related to this `VideoStream`. */
  video?: Maybe<Video>;
  /** The `VideoStream` that was created by this mutation. */
  videoStream?: Maybe<VideoStream>;
  /** An edge for our `VideoStream`. May be used by Relay 1. */
  videoStreamEdge?: Maybe<VideoStreamsEdge>;
};


/** The output of our create `VideoStream` mutation. */
export type CreateVideoStreamPayloadVideoStreamEdgeArgs = {
  orderBy?: InputMaybe<Array<VideoStreamsOrderBy>>;
};

/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type CuePoint = {
  __typename?: 'CuePoint';
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `CuePointType` that is related to this `CuePoint`. */
  cuePointType?: Maybe<CuePointType>;
  cuePointTypeKey: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  timeInSeconds: Scalars['Float']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Video` that is related to this `CuePoint`. */
  video?: Maybe<Video>;
  videoId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `CuePoint` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CuePointCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `cuePointTypeKey` field. */
  cuePointTypeKey?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `timeInSeconds` field. */
  timeInSeconds?: InputMaybe<Scalars['Float']['input']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `value` field. */
  value?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A filter to be used against `CuePoint` object types. All fields are combined with a logical ‘and.’ */
export type CuePointFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CuePointFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `cuePointType` relation. */
  cuePointType?: InputMaybe<CuePointTypeFilter>;
  /** Filter by the object’s `cuePointTypeKey` field. */
  cuePointTypeKey?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CuePointFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CuePointFilter>>;
  /** Filter by the object’s `timeInSeconds` field. */
  timeInSeconds?: InputMaybe<FloatFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `value` field. */
  value?: InputMaybe<StringFilter>;
  /** Filter by the object’s `video` relation. */
  video?: InputMaybe<VideoFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `CuePoint` */
export type CuePointInput = {
  cuePointTypeKey: Scalars['String']['input'];
  timeInSeconds: Scalars['Float']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
  videoId: Scalars['UUID']['input'];
};

/** Represents an update to a `CuePoint`. Fields that are set will be updated. */
export type CuePointPatch = {
  cuePointTypeKey?: InputMaybe<Scalars['String']['input']>;
  timeInSeconds?: InputMaybe<Scalars['Float']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A connection to a list of `CuePoint` values.
 * @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type CuePointsConnection = {
  __typename?: 'CuePointsConnection';
  /** A list of edges which contains the `CuePoint` and cursor to aid in pagination. */
  edges: Array<CuePointsEdge>;
  /** A list of `CuePoint` objects. */
  nodes: Array<CuePoint>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CuePoint` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `CuePoint` edge in the connection. */
export type CuePointsEdge = {
  __typename?: 'CuePointsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `CuePoint` at the end of the edge. */
  node: CuePoint;
};

/** Methods to use when ordering `CuePoint`. */
export enum CuePointsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  CuePointTypeKeyAsc = 'CUE_POINT_TYPE_KEY_ASC',
  CuePointTypeKeyDesc = 'CUE_POINT_TYPE_KEY_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TimeInSecondsAsc = 'TIME_IN_SECONDS_ASC',
  TimeInSecondsDesc = 'TIME_IN_SECONDS_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUE_POINT_TYPES_DECLARE,ADMIN */
export type CuePointType = {
  __typename?: 'CuePointType';
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `CuePoint`. */
  cuePoints: CuePointsConnection;
  isArchived: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  serviceId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUE_POINT_TYPES_DECLARE,ADMIN */
export type CuePointTypeCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CuePointCondition>;
  filter?: InputMaybe<CuePointFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CuePointsOrderBy>>;
};

/**
 * A condition to be used against `CuePointType` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CuePointTypeCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Checks for equality with the object’s `key` field.
   * @isTrimmed()
   * @notEmpty()
   */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `serviceId` field. */
  serviceId?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `title` field.
   * @isTrimmed()
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `CuePointType` object types. All fields are combined with a logical ‘and.’ */
export type CuePointTypeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CuePointTypeFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `cuePoints` relation. */
  cuePoints?: InputMaybe<CuePointTypeToManyCuePointFilter>;
  /** Some related `cuePoints` exist. */
  cuePointsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `isArchived` field. */
  isArchived?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `key` field. */
  key?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CuePointTypeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CuePointTypeFilter>>;
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
 * A connection to a list of `CuePointType` values.
 * @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUE_POINT_TYPES_DECLARE,ADMIN
 */
export type CuePointTypesConnection = {
  __typename?: 'CuePointTypesConnection';
  /** A list of edges which contains the `CuePointType` and cursor to aid in pagination. */
  edges: Array<CuePointTypesEdge>;
  /** A list of `CuePointType` objects. */
  nodes: Array<CuePointType>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CuePointType` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `CuePointType` edge in the connection. */
export type CuePointTypesEdge = {
  __typename?: 'CuePointTypesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `CuePointType` at the end of the edge. */
  node: CuePointType;
};

/** Methods to use when ordering `CuePointType`. */
export enum CuePointTypesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  IsArchivedAsc = 'IS_ARCHIVED_ASC',
  IsArchivedDesc = 'IS_ARCHIVED_DESC',
  KeyAsc = 'KEY_ASC',
  KeyDesc = 'KEY_DESC',
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

/** A filter to be used against many `CuePoint` object types. All fields are combined with a logical ‘and.’ */
export type CuePointTypeToManyCuePointFilter = {
  /** Every related `CuePoint` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CuePointFilter>;
  /** No related `CuePoint` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CuePointFilter>;
  /** Some related `CuePoint` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CuePointFilter>;
};

export type CustomVideoInput = {
  audioLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  captionLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cmafSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  customId?: InputMaybe<Scalars['String']['input']>;
  dashManifestPath?: InputMaybe<Scalars['String']['input']>;
  dashSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  errorHint?: InputMaybe<Scalars['String']['input']>;
  finishedDate?: InputMaybe<Scalars['Datetime']['input']>;
  hlsManifestPath?: InputMaybe<Scalars['String']['input']>;
  hlsSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  isProtected?: InputMaybe<Scalars['Boolean']['input']>;
  lengthInSeconds?: InputMaybe<Scalars['Float']['input']>;
  outputFormat?: InputMaybe<OutputFormat>;
  processingProfileId?: InputMaybe<Scalars['UUID']['input']>;
  sourceFileExtension?: InputMaybe<Scalars['String']['input']>;
  sourceFileName?: InputMaybe<Scalars['String']['input']>;
  sourceLocation: Scalars['String']['input'];
  sourceSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  subtitleLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  thumbnailsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  thumbnailsVttPath?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  videoBitrates?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type CustomVideoPatch = {
  audioLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  captionLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cmafSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  customId?: InputMaybe<Scalars['String']['input']>;
  dashManifestPath?: InputMaybe<Scalars['String']['input']>;
  dashSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  encodingState?: InputMaybe<EncodingState>;
  errorHint?: InputMaybe<Scalars['String']['input']>;
  finishedDate?: InputMaybe<Scalars['Datetime']['input']>;
  hlsManifestPath?: InputMaybe<Scalars['String']['input']>;
  hlsSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  isProtected?: InputMaybe<Scalars['Boolean']['input']>;
  lengthInSeconds?: InputMaybe<Scalars['Float']['input']>;
  outputFormat?: InputMaybe<OutputFormat>;
  sourceFileExtension?: InputMaybe<Scalars['String']['input']>;
  sourceFileName?: InputMaybe<Scalars['String']['input']>;
  sourceLocation?: InputMaybe<Scalars['String']['input']>;
  sourceSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  subtitleLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  thumbnailsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  thumbnailsVttPath?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  videoBitrates?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
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
 * All input for the `deleteCuePoint` mutation.
 * @permissions: VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type DeleteCuePointInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `CuePoint` mutation. */
export type DeleteCuePointPayload = {
  __typename?: 'DeleteCuePointPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `CuePoint` that was deleted by this mutation. */
  cuePoint?: Maybe<CuePoint>;
  /** An edge for our `CuePoint`. May be used by Relay 1. */
  cuePointEdge?: Maybe<CuePointsEdge>;
  /** Reads a single `CuePointType` that is related to this `CuePoint`. */
  cuePointType?: Maybe<CuePointType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Video` that is related to this `CuePoint`. */
  video?: Maybe<Video>;
};


/** The output of our delete `CuePoint` mutation. */
export type DeleteCuePointPayloadCuePointEdgeArgs = {
  orderBy?: InputMaybe<Array<CuePointsOrderBy>>;
};

/**
 * All input for the `deleteEncodingAcquisitionProfile` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteEncodingAcquisitionProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `EncodingAcquisitionProfile` mutation. */
export type DeleteEncodingAcquisitionProfilePayload = {
  __typename?: 'DeleteEncodingAcquisitionProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingAcquisitionProfile` that was deleted by this mutation. */
  encodingAcquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  /** An edge for our `EncodingAcquisitionProfile`. May be used by Relay 1. */
  encodingAcquisitionProfileEdge?: Maybe<EncodingAcquisitionProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EncodingAcquisitionProfile` mutation. */
export type DeleteEncodingAcquisitionProfilePayloadEncodingAcquisitionProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingAcquisitionProfilesOrderBy>>;
};

/**
 * All input for the `deleteEncodingAudioRepresentation` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteEncodingAudioRepresentationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `EncodingAudioRepresentation` mutation. */
export type DeleteEncodingAudioRepresentationPayload = {
  __typename?: 'DeleteEncodingAudioRepresentationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingAudioRepresentation` that was deleted by this mutation. */
  encodingAudioRepresentation?: Maybe<EncodingAudioRepresentation>;
  /** An edge for our `EncodingAudioRepresentation`. May be used by Relay 1. */
  encodingAudioRepresentationEdge?: Maybe<EncodingAudioRepresentationsEdge>;
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingAudioRepresentation`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EncodingAudioRepresentation` mutation. */
export type DeleteEncodingAudioRepresentationPayloadEncodingAudioRepresentationEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingAudioRepresentationsOrderBy>>;
};

/**
 * All input for the `deleteEncodingEmbeddedCaptionChannel` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteEncodingEmbeddedCaptionChannelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `EncodingEmbeddedCaptionChannel` mutation. */
export type DeleteEncodingEmbeddedCaptionChannelPayload = {
  __typename?: 'DeleteEncodingEmbeddedCaptionChannelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingEmbeddedCaptionChannel` that was deleted by this mutation. */
  encodingEmbeddedCaptionChannel?: Maybe<EncodingEmbeddedCaptionChannel>;
  /** An edge for our `EncodingEmbeddedCaptionChannel`. May be used by Relay 1. */
  encodingEmbeddedCaptionChannelEdge?: Maybe<EncodingEmbeddedCaptionChannelsEdge>;
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingEmbeddedCaptionChannel`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EncodingEmbeddedCaptionChannel` mutation. */
export type DeleteEncodingEmbeddedCaptionChannelPayloadEncodingEmbeddedCaptionChannelEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingEmbeddedCaptionChannelsOrderBy>>;
};

/**
 * All input for the `deleteEncodingProcessingProfile` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteEncodingProcessingProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `EncodingProcessingProfile` mutation. */
export type DeleteEncodingProcessingProfilePayload = {
  __typename?: 'DeleteEncodingProcessingProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingProcessingProfile` that was deleted by this mutation. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** An edge for our `EncodingProcessingProfile`. May be used by Relay 1. */
  encodingProcessingProfileEdge?: Maybe<EncodingProcessingProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EncodingProcessingProfile` mutation. */
export type DeleteEncodingProcessingProfilePayloadEncodingProcessingProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingProcessingProfilesOrderBy>>;
};

/**
 * All input for the `deleteEncodingPublishingProfile` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteEncodingPublishingProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `EncodingPublishingProfile` mutation. */
export type DeleteEncodingPublishingProfilePayload = {
  __typename?: 'DeleteEncodingPublishingProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingPublishingProfile` that was deleted by this mutation. */
  encodingPublishingProfile?: Maybe<EncodingPublishingProfile>;
  /** An edge for our `EncodingPublishingProfile`. May be used by Relay 1. */
  encodingPublishingProfileEdge?: Maybe<EncodingPublishingProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EncodingPublishingProfile` mutation. */
export type DeleteEncodingPublishingProfilePayloadEncodingPublishingProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingPublishingProfilesOrderBy>>;
};

/**
 * All input for the `deleteEncodingVideoRepresentation` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteEncodingVideoRepresentationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `EncodingVideoRepresentation` mutation. */
export type DeleteEncodingVideoRepresentationPayload = {
  __typename?: 'DeleteEncodingVideoRepresentationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingVideoRepresentation`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** The `EncodingVideoRepresentation` that was deleted by this mutation. */
  encodingVideoRepresentation?: Maybe<EncodingVideoRepresentation>;
  /** An edge for our `EncodingVideoRepresentation`. May be used by Relay 1. */
  encodingVideoRepresentationEdge?: Maybe<EncodingVideoRepresentationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EncodingVideoRepresentation` mutation. */
export type DeleteEncodingVideoRepresentationPayloadEncodingVideoRepresentationEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingVideoRepresentationsOrderBy>>;
};

/**
 * All input for the `deleteEncodingWatermarkProfile` mutation.
 * @permissions: ADMIN
 */
export type DeleteEncodingWatermarkProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `EncodingWatermarkProfile` mutation. */
export type DeleteEncodingWatermarkProfilePayload = {
  __typename?: 'DeleteEncodingWatermarkProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingWatermarkProfile` that was deleted by this mutation. */
  encodingWatermarkProfile?: Maybe<EncodingWatermarkProfile>;
  /** An edge for our `EncodingWatermarkProfile`. May be used by Relay 1. */
  encodingWatermarkProfileEdge?: Maybe<EncodingWatermarkProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EncodingWatermarkProfile` mutation. */
export type DeleteEncodingWatermarkProfilePayloadEncodingWatermarkProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingWatermarkProfilesOrderBy>>;
};

export type DeleteEntitlementWebhookConfigurationPayload = {
  __typename?: 'DeleteEntitlementWebhookConfigurationPayload';
  deleted: Scalars['Boolean']['output'];
  query?: Maybe<Query>;
};

export type DeleteManifestWebhookConfigurationPayload = {
  __typename?: 'DeleteManifestWebhookConfigurationPayload';
  deleted: Scalars['Boolean']['output'];
  query?: Maybe<Query>;
};

/**
 * All input for the `deleteVideo` mutation.
 * @permissions: VIDEOS_ENCODE,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,ADMIN
 */
export type DeleteVideoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `Video` mutation. */
export type DeleteVideoPayload = {
  __typename?: 'DeleteVideoPayload';
  /** Reads a single `EncodingAcquisitionProfile` that is related to this `Video`. */
  acquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `EncodingProcessingProfile` that is related to this `Video`. */
  processingProfile?: Maybe<EncodingProcessingProfile>;
  /** Reads a single `EncodingPublishingProfile` that is related to this `Video`. */
  publishingProfile?: Maybe<EncodingPublishingProfile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Video` that was deleted by this mutation. */
  video?: Maybe<Video>;
  /** An edge for our `Video`. May be used by Relay 1. */
  videoEdge?: Maybe<VideosEdge>;
};


/** The output of our delete `Video` mutation. */
export type DeleteVideoPayloadVideoEdgeArgs = {
  orderBy?: InputMaybe<Array<VideosOrderBy>>;
};

/**
 * All input for the `deleteVideosTag` mutation.
 * @permissions: VIDEOS_ENCODE,VIDEOS_EDIT,ADMIN
 */
export type DeleteVideosTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** @notEmpty() */
  name: Scalars['String']['input'];
  videoId: Scalars['UUID']['input'];
};

/** The output of our delete `VideosTag` mutation. */
export type DeleteVideosTagPayload = {
  __typename?: 'DeleteVideosTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Video` that is related to this `VideosTag`. */
  video?: Maybe<Video>;
  /** The `VideosTag` that was deleted by this mutation. */
  videosTag?: Maybe<VideosTag>;
  /** An edge for our `VideosTag`. May be used by Relay 1. */
  videosTagEdge?: Maybe<VideosTagsEdge>;
};


/** The output of our delete `VideosTag` mutation. */
export type DeleteVideosTagPayloadVideosTagEdgeArgs = {
  orderBy?: InputMaybe<Array<VideosTagsOrderBy>>;
};

/**
 * All input for the `deleteCustomVideoStream` mutation.
 * @permissions: VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type DeleteVideoStreamInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `VideoStream` mutation. */
export type DeleteVideoStreamPayload = {
  __typename?: 'DeleteVideoStreamPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Video` that is related to this `VideoStream`. */
  video?: Maybe<Video>;
  /** The `VideoStream` that was deleted by this mutation. */
  videoStream?: Maybe<VideoStream>;
  /** An edge for our `VideoStream`. May be used by Relay 1. */
  videoStreamEdge?: Maybe<VideoStreamsEdge>;
};


/** The output of our delete `VideoStream` mutation. */
export type DeleteVideoStreamPayloadVideoStreamEdgeArgs = {
  orderBy?: InputMaybe<Array<VideoStreamsOrderBy>>;
};

export enum DrmProtection {
  /** Multiple Keys */
  MultipleKeys = 'MULTIPLE_KEYS',
  /** None */
  None = 'NONE',
  /** Single Key */
  SingleKey = 'SINGLE_KEY'
}

/** A filter to be used against DrmProtection fields. All fields are combined with a logical ‘and.’ */
export type DrmProtectionFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<DrmProtection>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<DrmProtection>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<DrmProtection>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<DrmProtection>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<DrmProtection>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<DrmProtection>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<DrmProtection>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<DrmProtection>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<DrmProtection>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<DrmProtection>>;
};

export type EncodeVideoInput = {
  acquisitionProfileId?: InputMaybe<Scalars['UUID']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  processingProfileId: Scalars['UUID']['input'];
  publishingProfileId?: InputMaybe<Scalars['UUID']['input']>;
  videoRelativePath: Scalars['String']['input'];
  watermarkProfileIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

export type EncodeVideoPayload = {
  __typename?: 'EncodeVideoPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  query?: Maybe<Query>;
  video?: Maybe<Video>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingAcquisitionAmazonS3Setting = {
  __typename?: 'EncodingAcquisitionAmazonS3Setting';
  accessKeyId: Scalars['String']['output'];
  bucketName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingAcquisitionProfile` that is related to this `EncodingAcquisitionAmazonS3Setting`. */
  encodingAcquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  encodingAcquisitionProfileId: Scalars['UUID']['output'];
  fullSourcePath: Scalars['String']['output'];
  managementSecretAccessKeyIsSet: Scalars['Boolean']['output'];
  region: AmazonS3Region;
  rootFolderPath?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** A filter to be used against `EncodingAcquisitionAmazonS3Setting` object types. All fields are combined with a logical ‘and.’ */
export type EncodingAcquisitionAmazonS3SettingFilter = {
  /** Filter by the object’s `accessKeyId` field. */
  accessKeyId?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingAcquisitionAmazonS3SettingFilter>>;
  /** Filter by the object’s `bucketName` field. */
  bucketName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `encodingAcquisitionProfile` relation. */
  encodingAcquisitionProfile?: InputMaybe<EncodingAcquisitionProfileFilter>;
  /** Filter by the object’s `encodingAcquisitionProfileId` field. */
  encodingAcquisitionProfileId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingAcquisitionAmazonS3SettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingAcquisitionAmazonS3SettingFilter>>;
  /** Filter by the object’s `region` field. */
  region?: InputMaybe<AmazonS3RegionFilter>;
  /** Filter by the object’s `rootFolderPath` field. */
  rootFolderPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingAcquisitionAzureBlobSetting = {
  __typename?: 'EncodingAcquisitionAzureBlobSetting';
  accountName: Scalars['String']['output'];
  containerName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingAcquisitionProfile` that is related to this `EncodingAcquisitionAzureBlobSetting`. */
  encodingAcquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  encodingAcquisitionProfileId: Scalars['UUID']['output'];
  fullSourcePath: Scalars['String']['output'];
  managementSasTokenIsSet: Scalars['Boolean']['output'];
  rootFolderPath?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** A filter to be used against `EncodingAcquisitionAzureBlobSetting` object types. All fields are combined with a logical ‘and.’ */
export type EncodingAcquisitionAzureBlobSettingFilter = {
  /** Filter by the object’s `accountName` field. */
  accountName?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingAcquisitionAzureBlobSettingFilter>>;
  /** Filter by the object’s `containerName` field. */
  containerName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `encodingAcquisitionProfile` relation. */
  encodingAcquisitionProfile?: InputMaybe<EncodingAcquisitionProfileFilter>;
  /** Filter by the object’s `encodingAcquisitionProfileId` field. */
  encodingAcquisitionProfileId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingAcquisitionAzureBlobSettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingAcquisitionAzureBlobSettingFilter>>;
  /** Filter by the object’s `rootFolderPath` field. */
  rootFolderPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingAcquisitionHostingAzureSetting = {
  __typename?: 'EncodingAcquisitionHostingAzureSetting';
  accountName: Scalars['String']['output'];
  containerName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingAcquisitionProfile` that is related to this `EncodingAcquisitionHostingAzureSetting`. */
  encodingAcquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  encodingAcquisitionProfileId: Scalars['UUID']['output'];
  fullSourcePath: Scalars['String']['output'];
  managementSasTokenIsSet: Scalars['Boolean']['output'];
  /** @deprecated This field is deprecated and will be removed in a future release. Please check 'https://docs.axinom.com/general/mosaic-deprecations' for more details. */
  managementSasTokenValidUntil: Scalars['Date']['output'];
  rootFolderPath?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** A filter to be used against `EncodingAcquisitionHostingAzureSetting` object types. All fields are combined with a logical ‘and.’ */
export type EncodingAcquisitionHostingAzureSettingFilter = {
  /** Filter by the object’s `accountName` field. */
  accountName?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingAcquisitionHostingAzureSettingFilter>>;
  /** Filter by the object’s `containerName` field. */
  containerName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `encodingAcquisitionProfile` relation. */
  encodingAcquisitionProfile?: InputMaybe<EncodingAcquisitionProfileFilter>;
  /** Filter by the object’s `encodingAcquisitionProfileId` field. */
  encodingAcquisitionProfileId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `managementSasTokenValidUntil` field. */
  managementSasTokenValidUntil?: InputMaybe<DateFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingAcquisitionHostingAzureSettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingAcquisitionHostingAzureSettingFilter>>;
  /** Filter by the object’s `rootFolderPath` field. */
  rootFolderPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingAcquisitionProfile = {
  __typename?: 'EncodingAcquisitionProfile';
  /** Reads a single `EncodingAcquisitionAmazonS3Setting` that is related to this `EncodingAcquisitionProfile`. */
  amazonS3Setting?: Maybe<EncodingAcquisitionAmazonS3Setting>;
  /** Reads a single `EncodingAcquisitionAzureBlobSetting` that is related to this `EncodingAcquisitionProfile`. */
  azureBlobSetting?: Maybe<EncodingAcquisitionAzureBlobSetting>;
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingAcquisitionHostingAzureSetting` that is related to this `EncodingAcquisitionProfile`. */
  hostingAzureSetting?: Maybe<EncodingAcquisitionHostingAzureSetting>;
  id: Scalars['UUID']['output'];
  /** True if this profile is the default for its tenant/environment. Exactly one profile per tenant/env is the default whenever any profile exists. Maintained by triggers. */
  isDefault: Scalars['Boolean']['output'];
  provider: StorageProvider;
  /** Reads a single `EncodingAcquisitionS3CompatibleSetting` that is related to this `EncodingAcquisitionProfile`. */
  s3CompatibleSetting?: Maybe<EncodingAcquisitionS3CompatibleSetting>;
  title: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/**
 * A condition to be used against `EncodingAcquisitionProfile` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingAcquisitionProfileCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `isDefault` field. */
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
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

/** A filter to be used against `EncodingAcquisitionProfile` object types. All fields are combined with a logical ‘and.’ */
export type EncodingAcquisitionProfileFilter = {
  /** Filter by the object’s `amazonS3Setting` relation. */
  amazonS3Setting?: InputMaybe<EncodingAcquisitionAmazonS3SettingFilter>;
  /** A related `amazonS3Setting` exists. */
  amazonS3SettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingAcquisitionProfileFilter>>;
  /** Filter by the object’s `azureBlobSetting` relation. */
  azureBlobSetting?: InputMaybe<EncodingAcquisitionAzureBlobSettingFilter>;
  /** A related `azureBlobSetting` exists. */
  azureBlobSettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `hostingAzureSetting` relation. */
  hostingAzureSetting?: InputMaybe<EncodingAcquisitionHostingAzureSettingFilter>;
  /** A related `hostingAzureSetting` exists. */
  hostingAzureSettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `isDefault` field. */
  isDefault?: InputMaybe<BooleanFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingAcquisitionProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingAcquisitionProfileFilter>>;
  /** Filter by the object’s `provider` field. */
  provider?: InputMaybe<StorageProviderFilter>;
  /** Filter by the object’s `s3CompatibleSetting` relation. */
  s3CompatibleSetting?: InputMaybe<EncodingAcquisitionS3CompatibleSettingFilter>;
  /** A related `s3CompatibleSetting` exists. */
  s3CompatibleSettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `videosByAcquisitionProfileId` relation. */
  videosByAcquisitionProfileId?: InputMaybe<EncodingAcquisitionProfileToManyVideoFilter>;
  /** Some related `videosByAcquisitionProfileId` exist. */
  videosByAcquisitionProfileIdExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * A connection to a list of `EncodingAcquisitionProfile` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type EncodingAcquisitionProfilesConnection = {
  __typename?: 'EncodingAcquisitionProfilesConnection';
  /** A list of edges which contains the `EncodingAcquisitionProfile` and cursor to aid in pagination. */
  edges: Array<EncodingAcquisitionProfilesEdge>;
  /** A list of `EncodingAcquisitionProfile` objects. */
  nodes: Array<EncodingAcquisitionProfile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EncodingAcquisitionProfile` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EncodingAcquisitionProfile` edge in the connection. */
export type EncodingAcquisitionProfilesEdge = {
  __typename?: 'EncodingAcquisitionProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EncodingAcquisitionProfile` at the end of the edge. */
  node: EncodingAcquisitionProfile;
};

/** Methods to use when ordering `EncodingAcquisitionProfile`. */
export enum EncodingAcquisitionProfilesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsDefaultAsc = 'IS_DEFAULT_ASC',
  IsDefaultDesc = 'IS_DEFAULT_DESC',
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

/** A filter to be used against many `Video` object types. All fields are combined with a logical ‘and.’ */
export type EncodingAcquisitionProfileToManyVideoFilter = {
  /** Every related `Video` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<VideoFilter>;
  /** No related `Video` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<VideoFilter>;
  /** Some related `Video` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<VideoFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingAcquisitionS3CompatibleSetting = {
  __typename?: 'EncodingAcquisitionS3CompatibleSetting';
  accessKeyId: Scalars['String']['output'];
  bucketName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingAcquisitionProfile` that is related to this `EncodingAcquisitionS3CompatibleSetting`. */
  encodingAcquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  encodingAcquisitionProfileId: Scalars['UUID']['output'];
  fullSourcePath: Scalars['String']['output'];
  managementSecretAccessKeyIsSet: Scalars['Boolean']['output'];
  region?: Maybe<Scalars['String']['output']>;
  rootFolderPath?: Maybe<Scalars['String']['output']>;
  s3Endpoint: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** A filter to be used against `EncodingAcquisitionS3CompatibleSetting` object types. All fields are combined with a logical ‘and.’ */
export type EncodingAcquisitionS3CompatibleSettingFilter = {
  /** Filter by the object’s `accessKeyId` field. */
  accessKeyId?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingAcquisitionS3CompatibleSettingFilter>>;
  /** Filter by the object’s `bucketName` field. */
  bucketName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `encodingAcquisitionProfile` relation. */
  encodingAcquisitionProfile?: InputMaybe<EncodingAcquisitionProfileFilter>;
  /** Filter by the object’s `encodingAcquisitionProfileId` field. */
  encodingAcquisitionProfileId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingAcquisitionS3CompatibleSettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingAcquisitionS3CompatibleSettingFilter>>;
  /** Filter by the object’s `region` field. */
  region?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rootFolderPath` field. */
  rootFolderPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `s3Endpoint` field. */
  s3Endpoint?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingAudioRepresentation = {
  __typename?: 'EncodingAudioRepresentation';
  audioFormat: AudioFormat;
  bitrateInKbps?: Maybe<Scalars['Int']['output']>;
  createCondition: AudioRepresentationCreate;
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingAudioRepresentation`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  encodingProcessingProfileId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  sound: AudioRepresentationSound;
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/**
 * A condition to be used against `EncodingAudioRepresentation` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingAudioRepresentationCondition = {
  /** Checks for equality with the object’s `audioFormat` field. */
  audioFormat?: InputMaybe<AudioFormat>;
  /** Checks for equality with the object’s `bitrateInKbps` field. */
  bitrateInKbps?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `createCondition` field. */
  createCondition?: InputMaybe<AudioRepresentationCreate>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `encodingProcessingProfileId` field. */
  encodingProcessingProfileId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `sound` field. */
  sound?: InputMaybe<AudioRepresentationSound>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `EncodingAudioRepresentation` object types. All fields are combined with a logical ‘and.’ */
export type EncodingAudioRepresentationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingAudioRepresentationFilter>>;
  /** Filter by the object’s `audioFormat` field. */
  audioFormat?: InputMaybe<AudioFormatFilter>;
  /** Filter by the object’s `bitrateInKbps` field. */
  bitrateInKbps?: InputMaybe<IntFilter>;
  /** Filter by the object’s `createCondition` field. */
  createCondition?: InputMaybe<AudioRepresentationCreateFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `encodingProcessingProfile` relation. */
  encodingProcessingProfile?: InputMaybe<EncodingProcessingProfileFilter>;
  /** Filter by the object’s `encodingProcessingProfileId` field. */
  encodingProcessingProfileId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingAudioRepresentationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingAudioRepresentationFilter>>;
  /** Filter by the object’s `sound` field. */
  sound?: InputMaybe<AudioRepresentationSoundFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `EncodingAudioRepresentation` */
export type EncodingAudioRepresentationInput = {
  audioFormat: AudioFormat;
  bitrateInKbps?: InputMaybe<Scalars['Int']['input']>;
  createCondition: AudioRepresentationCreate;
  encodingProcessingProfileId: Scalars['UUID']['input'];
  sound: AudioRepresentationSound;
};

/**
 * A connection to a list of `EncodingAudioRepresentation` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type EncodingAudioRepresentationsConnection = {
  __typename?: 'EncodingAudioRepresentationsConnection';
  /** A list of edges which contains the `EncodingAudioRepresentation` and cursor to aid in pagination. */
  edges: Array<EncodingAudioRepresentationsEdge>;
  /** A list of `EncodingAudioRepresentation` objects. */
  nodes: Array<EncodingAudioRepresentation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EncodingAudioRepresentation` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EncodingAudioRepresentation` edge in the connection. */
export type EncodingAudioRepresentationsEdge = {
  __typename?: 'EncodingAudioRepresentationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EncodingAudioRepresentation` at the end of the edge. */
  node: EncodingAudioRepresentation;
};

/** Methods to use when ordering `EncodingAudioRepresentation`. */
export enum EncodingAudioRepresentationsOrderBy {
  AudioFormatAsc = 'AUDIO_FORMAT_ASC',
  AudioFormatDesc = 'AUDIO_FORMAT_DESC',
  BitrateInKbpsAsc = 'BITRATE_IN_KBPS_ASC',
  BitrateInKbpsDesc = 'BITRATE_IN_KBPS_DESC',
  CreateConditionAsc = 'CREATE_CONDITION_ASC',
  CreateConditionDesc = 'CREATE_CONDITION_DESC',
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  EncodingProcessingProfileIdAsc = 'ENCODING_PROCESSING_PROFILE_ID_ASC',
  EncodingProcessingProfileIdDesc = 'ENCODING_PROCESSING_PROFILE_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SoundAsc = 'SOUND_ASC',
  SoundDesc = 'SOUND_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingDrmProfile = {
  __typename?: 'EncodingDrmProfile';
  apiUrl: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  tenantKey: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/**
 * A condition to be used against `EncodingDrmProfile` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EncodingDrmProfileCondition = {
  /**
   * Checks for equality with the object’s `apiUrl` field.
   * @isTrimmed()
   * @isUrl()
   * @notEmpty()
   */
  apiUrl?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /**
   * Checks for equality with the object’s `tenantKey` field.
   * @isTrimmed()
   * @maxLength(36)
   * @minLength(36)
   * @notEmpty()
   */
  tenantKey?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `EncodingDrmProfile` object types. All fields are combined with a logical ‘and.’ */
export type EncodingDrmProfileFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingDrmProfileFilter>>;
  /** Filter by the object’s `apiUrl` field. */
  apiUrl?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingDrmProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingDrmProfileFilter>>;
  /** Filter by the object’s `tenantKey` field. */
  tenantKey?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `EncodingDrmProfile` */
export type EncodingDrmProfileInput = {
  /**
   * @isTrimmed()
   * @isUrl()
   * @notEmpty()
   */
  apiUrl: Scalars['String']['input'];
  /**
   * @isBase64()
   * @notEmpty()
   */
  keySeedId: Scalars['String']['input'];
  /**
   * @isBase64()
   * @notEmpty()
   */
  managementKey: Scalars['String']['input'];
  /**
   * @isTrimmed()
   * @maxLength(36)
   * @minLength(36)
   * @notEmpty()
   */
  tenantKey: Scalars['String']['input'];
};

/** Represents an update to a `EncodingDrmProfile`. Fields that are set will be updated. */
export type EncodingDrmProfilePatch = {
  /**
   * @isTrimmed()
   * @isUrl()
   * @notEmpty()
   */
  apiUrl?: InputMaybe<Scalars['String']['input']>;
  /**
   * @isBase64()
   * @notEmpty()
   */
  keySeedId?: InputMaybe<Scalars['String']['input']>;
  /**
   * @isBase64()
   * @notEmpty()
   */
  managementKey?: InputMaybe<Scalars['String']['input']>;
  /**
   * @isTrimmed()
   * @maxLength(36)
   * @minLength(36)
   * @notEmpty()
   */
  tenantKey?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A connection to a list of `EncodingDrmProfile` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type EncodingDrmProfilesConnection = {
  __typename?: 'EncodingDrmProfilesConnection';
  /** A list of edges which contains the `EncodingDrmProfile` and cursor to aid in pagination. */
  edges: Array<EncodingDrmProfilesEdge>;
  /** A list of `EncodingDrmProfile` objects. */
  nodes: Array<EncodingDrmProfile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EncodingDrmProfile` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EncodingDrmProfile` edge in the connection. */
export type EncodingDrmProfilesEdge = {
  __typename?: 'EncodingDrmProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EncodingDrmProfile` at the end of the edge. */
  node: EncodingDrmProfile;
};

/** Methods to use when ordering `EncodingDrmProfile`. */
export enum EncodingDrmProfilesOrderBy {
  ApiUrlAsc = 'API_URL_ASC',
  ApiUrlDesc = 'API_URL_DESC',
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TenantKeyAsc = 'TENANT_KEY_ASC',
  TenantKeyDesc = 'TENANT_KEY_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingEmbeddedCaptionChannel = {
  __typename?: 'EncodingEmbeddedCaptionChannel';
  channel: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingEmbeddedCaptionChannel`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  encodingProcessingProfileId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  language: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/**
 * A condition to be used against `EncodingEmbeddedCaptionChannel` object types.
 * All fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingEmbeddedCaptionChannelCondition = {
  /**
   * Checks for equality with the object’s `channel` field.
   * @matchesPattern()
   */
  channel?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `encodingProcessingProfileId` field. */
  encodingProcessingProfileId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /**
   * Checks for equality with the object’s `language` field.
   * @matchesPattern()
   * @maxLength(10)
   */
  language?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `EncodingEmbeddedCaptionChannel` object types. All fields are combined with a logical ‘and.’ */
export type EncodingEmbeddedCaptionChannelFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingEmbeddedCaptionChannelFilter>>;
  /** Filter by the object’s `channel` field. */
  channel?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `encodingProcessingProfile` relation. */
  encodingProcessingProfile?: InputMaybe<EncodingProcessingProfileFilter>;
  /** Filter by the object’s `encodingProcessingProfileId` field. */
  encodingProcessingProfileId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `language` field. */
  language?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingEmbeddedCaptionChannelFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingEmbeddedCaptionChannelFilter>>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `EncodingEmbeddedCaptionChannel` */
export type EncodingEmbeddedCaptionChannelInput = {
  /** @matchesPattern() */
  channel: Scalars['String']['input'];
  encodingProcessingProfileId: Scalars['UUID']['input'];
  /**
   * @matchesPattern()
   * @maxLength(10)
   */
  language: Scalars['String']['input'];
};

/** Represents an update to a `EncodingEmbeddedCaptionChannel`. Fields that are set will be updated. */
export type EncodingEmbeddedCaptionChannelPatch = {
  /** @matchesPattern() */
  channel?: InputMaybe<Scalars['String']['input']>;
  /**
   * @matchesPattern()
   * @maxLength(10)
   */
  language?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A connection to a list of `EncodingEmbeddedCaptionChannel` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type EncodingEmbeddedCaptionChannelsConnection = {
  __typename?: 'EncodingEmbeddedCaptionChannelsConnection';
  /** A list of edges which contains the `EncodingEmbeddedCaptionChannel` and cursor to aid in pagination. */
  edges: Array<EncodingEmbeddedCaptionChannelsEdge>;
  /** A list of `EncodingEmbeddedCaptionChannel` objects. */
  nodes: Array<EncodingEmbeddedCaptionChannel>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EncodingEmbeddedCaptionChannel` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EncodingEmbeddedCaptionChannel` edge in the connection. */
export type EncodingEmbeddedCaptionChannelsEdge = {
  __typename?: 'EncodingEmbeddedCaptionChannelsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EncodingEmbeddedCaptionChannel` at the end of the edge. */
  node: EncodingEmbeddedCaptionChannel;
};

/** Methods to use when ordering `EncodingEmbeddedCaptionChannel`. */
export enum EncodingEmbeddedCaptionChannelsOrderBy {
  ChannelAsc = 'CHANNEL_ASC',
  ChannelDesc = 'CHANNEL_DESC',
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  EncodingProcessingProfileIdAsc = 'ENCODING_PROCESSING_PROFILE_ID_ASC',
  EncodingProcessingProfileIdDesc = 'ENCODING_PROCESSING_PROFILE_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LanguageAsc = 'LANGUAGE_ASC',
  LanguageDesc = 'LANGUAGE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/**
 * A connection to a list of `EncodingHistory` values.
 * @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type EncodingHistoriesConnection = {
  __typename?: 'EncodingHistoriesConnection';
  /** A list of edges which contains the `EncodingHistory` and cursor to aid in pagination. */
  edges: Array<EncodingHistoriesEdge>;
  /** A list of `EncodingHistory` objects. */
  nodes: Array<EncodingHistory>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EncodingHistory` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EncodingHistory` edge in the connection. */
export type EncodingHistoriesEdge = {
  __typename?: 'EncodingHistoriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EncodingHistory` at the end of the edge. */
  node: EncodingHistory;
};

/** Methods to use when ordering `EncodingHistory`. */
export enum EncodingHistoriesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  EnqueuedDateAsc = 'ENQUEUED_DATE_ASC',
  EnqueuedDateDesc = 'ENQUEUED_DATE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MessageBodyAsc = 'MESSAGE_BODY_ASC',
  MessageBodyDesc = 'MESSAGE_BODY_DESC',
  MessageTypeAsc = 'MESSAGE_TYPE_ASC',
  MessageTypeDesc = 'MESSAGE_TYPE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingHistory = {
  __typename?: 'EncodingHistory';
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  enqueuedDate: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  messageBody: Scalars['JSON']['output'];
  messageType: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
  /** Reads a single `Video` that is related to this `EncodingHistory`. */
  video?: Maybe<Video>;
  videoId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `EncodingHistory` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EncodingHistoryCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `enqueuedDate` field. */
  enqueuedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `messageBody` field. */
  messageBody?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `messageType` field. */
  messageType?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A filter to be used against `EncodingHistory` object types. All fields are combined with a logical ‘and.’ */
export type EncodingHistoryFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingHistoryFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `enqueuedDate` field. */
  enqueuedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `messageBody` field. */
  messageBody?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `messageType` field. */
  messageType?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingHistoryFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingHistoryFilter>>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `video` relation. */
  video?: InputMaybe<VideoFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
};

export enum EncodingMode {
  /** Default */
  Default = 'DEFAULT',
  /** PerScene */
  PerScene = 'PER_SCENE'
}

/** A filter to be used against EncodingMode fields. All fields are combined with a logical ‘and.’ */
export type EncodingModeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<EncodingMode>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<EncodingMode>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<EncodingMode>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<EncodingMode>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<EncodingMode>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<EncodingMode>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<EncodingMode>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<EncodingMode>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<EncodingMode>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<EncodingMode>>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingProcessingProfile = {
  __typename?: 'EncodingProcessingProfile';
  archiveOutputName?: Maybe<Scalars['String']['output']>;
  audioChunksPattern?: Maybe<Scalars['String']['output']>;
  audioFileLanguageExpression?: Maybe<Scalars['String']['output']>;
  captionFileLanguageExpression?: Maybe<Scalars['String']['output']>;
  checksumFileName?: Maybe<Scalars['String']['output']>;
  closedCaptionChunksPattern?: Maybe<Scalars['String']['output']>;
  closedCaptionPlacement: ClosedCaptionPlacement;
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  dashManifestName?: Maybe<Scalars['String']['output']>;
  defaultAudioLanguages: Array<Maybe<Scalars['String']['output']>>;
  defaultTextLanguages: Array<Maybe<Scalars['String']['output']>>;
  deleteFilesFromSourceWhenDone: Scalars['Boolean']['output'];
  descriptiveAudioFileLanguageExpression?: Maybe<Scalars['String']['output']>;
  drmProtection: DrmProtection;
  /** Reads and enables pagination through a set of `EncodingAudioRepresentation`. */
  encodingAudioRepresentations: EncodingAudioRepresentationsConnection;
  /** Reads and enables pagination through a set of `EncodingEmbeddedCaptionChannel`. */
  encodingEmbeddedCaptionChannels: EncodingEmbeddedCaptionChannelsConnection;
  encodingMode: EncodingMode;
  /** Reads and enables pagination through a set of `EncodingVideoRepresentation`. */
  encodingVideoRepresentations: EncodingVideoRepresentationsConnection;
  explicitIv?: Maybe<Scalars['String']['output']>;
  extractAndApplyHdr: Scalars['Boolean']['output'];
  extractAndApplyHdr10Plus: Scalars['Boolean']['output'];
  failOnIgnoredFiles: Scalars['Boolean']['output'];
  failOnIgnoredTracks: Scalars['Boolean']['output'];
  failOnNoAudioTracks: Scalars['Boolean']['output'];
  failOnNoCaptionTracks: Scalars['Boolean']['output'];
  failOnNoDescriptiveAudioTracks: Scalars['Boolean']['output'];
  failOnNoSubtitleTracks: Scalars['Boolean']['output'];
  failOnNoVideoTracks: Scalars['Boolean']['output'];
  failOnUnrecognizedLanguageCodes: Scalars['Boolean']['output'];
  fallbackLanguageCode?: Maybe<Scalars['String']['output']>;
  forceAspectRatioToStandard: Scalars['Boolean']['output'];
  forcePixelAspectRatioTo1: Scalars['Boolean']['output'];
  forensicWatermarking?: Maybe<ForensicWatermarking>;
  hlsManifestName?: Maybe<Scalars['String']['output']>;
  hlsSessionKeyEnabled: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  manifestName?: Maybe<Scalars['String']['output']>;
  manifestVersion: ManifestVersion;
  mediaDetection: MediaDetection;
  normalizeAudio: Scalars['Boolean']['output'];
  optimizeFor: OptimizeFor;
  outputFormat: OutputFormat;
  searchForOptimalNearbyResolutions: Scalars['Boolean']['output'];
  segmentFormat: SegmentFormat;
  subtitleChunksPattern?: Maybe<Scalars['String']['output']>;
  subtitleContainer: SubtitleContainer;
  subtitleFileLanguageExpression?: Maybe<Scalars['String']['output']>;
  targetVmafScore: Scalars['Int']['output'];
  tarMode: TarMode;
  textLanguageSameAsAudioLanguage: Scalars['Boolean']['output'];
  thumbDurationInSeconds?: Maybe<Scalars['Int']['output']>;
  thumbGenerate: Scalars['Boolean']['output'];
  thumbHeight?: Maybe<Scalars['Int']['output']>;
  thumbMaxHorizontalTiles?: Maybe<Scalars['Int']['output']>;
  thumbMaxVerticalTiles?: Maybe<Scalars['Int']['output']>;
  thumbWidth?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
  useHighestPossibleBitrate: Scalars['Boolean']['output'];
  useNativeLanguageNames: Scalars['Boolean']['output'];
  videoChunksPattern?: Maybe<Scalars['String']['output']>;
  videoFormat: VideoFormat;
  videoStreamExpression?: Maybe<Scalars['String']['output']>;
  videoSyncMethod: VideoSyncMethod;
};


/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingProcessingProfileEncodingAudioRepresentationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingAudioRepresentationCondition>;
  filter?: InputMaybe<EncodingAudioRepresentationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingAudioRepresentationsOrderBy>>;
};


/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingProcessingProfileEncodingEmbeddedCaptionChannelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingEmbeddedCaptionChannelCondition>;
  filter?: InputMaybe<EncodingEmbeddedCaptionChannelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingEmbeddedCaptionChannelsOrderBy>>;
};


/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingProcessingProfileEncodingVideoRepresentationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingVideoRepresentationCondition>;
  filter?: InputMaybe<EncodingVideoRepresentationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingVideoRepresentationsOrderBy>>;
};

/**
 * A condition to be used against `EncodingProcessingProfile` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingProcessingProfileCondition = {
  /**
   * Checks for equality with the object’s `archiveOutputName` field.
   * @matchesPattern()
   */
  archiveOutputName?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `audioChunksPattern` field.
   * @matchesPattern()
   */
  audioChunksPattern?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `audioFileLanguageExpression` field.
   * @isTrimmed()
   */
  audioFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `captionFileLanguageExpression` field.
   * @isTrimmed()
   */
  captionFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `checksumFileName` field.
   * @matchesPattern()
   */
  checksumFileName?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `closedCaptionChunksPattern` field.
   * @matchesPattern()
   */
  closedCaptionChunksPattern?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `closedCaptionPlacement` field. */
  closedCaptionPlacement?: InputMaybe<ClosedCaptionPlacement>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `dashManifestName` field.
   * @matchesPattern()
   */
  dashManifestName?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `defaultAudioLanguages` field. */
  defaultAudioLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Checks for equality with the object’s `defaultTextLanguages` field. */
  defaultTextLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Checks for equality with the object’s `deleteFilesFromSourceWhenDone` field. */
  deleteFilesFromSourceWhenDone?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Checks for equality with the object’s `descriptiveAudioFileLanguageExpression` field.
   * @isTrimmed()
   */
  descriptiveAudioFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `drmProtection` field. */
  drmProtection?: InputMaybe<DrmProtection>;
  /** Checks for equality with the object’s `encodingMode` field. */
  encodingMode?: InputMaybe<EncodingMode>;
  /**
   * Checks for equality with the object’s `explicitIv` field.
   * @matchesPattern()
   * @maxLength(32)
   * @minLength(32)
   */
  explicitIv?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `extractAndApplyHdr` field. */
  extractAndApplyHdr?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `extractAndApplyHdr10Plus` field. */
  extractAndApplyHdr10Plus?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `failOnIgnoredFiles` field. */
  failOnIgnoredFiles?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `failOnIgnoredTracks` field. */
  failOnIgnoredTracks?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `failOnNoAudioTracks` field. */
  failOnNoAudioTracks?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `failOnNoCaptionTracks` field. */
  failOnNoCaptionTracks?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `failOnNoDescriptiveAudioTracks` field. */
  failOnNoDescriptiveAudioTracks?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `failOnNoSubtitleTracks` field. */
  failOnNoSubtitleTracks?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `failOnNoVideoTracks` field. */
  failOnNoVideoTracks?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `failOnUnrecognizedLanguageCodes` field. */
  failOnUnrecognizedLanguageCodes?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Checks for equality with the object’s `fallbackLanguageCode` field.
   * @maxLength(10)
   */
  fallbackLanguageCode?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `forceAspectRatioToStandard` field. */
  forceAspectRatioToStandard?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `forcePixelAspectRatioTo1` field. */
  forcePixelAspectRatioTo1?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `forensicWatermarking` field. */
  forensicWatermarking?: InputMaybe<ForensicWatermarking>;
  /**
   * Checks for equality with the object’s `hlsManifestName` field.
   * @matchesPattern()
   */
  hlsManifestName?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `hlsSessionKeyEnabled` field. */
  hlsSessionKeyEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /**
   * Checks for equality with the object’s `manifestName` field.
   * @matchesPattern()
   */
  manifestName?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `manifestVersion` field. */
  manifestVersion?: InputMaybe<ManifestVersion>;
  /** Checks for equality with the object’s `mediaDetection` field. */
  mediaDetection?: InputMaybe<MediaDetection>;
  /** Checks for equality with the object’s `normalizeAudio` field. */
  normalizeAudio?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `optimizeFor` field. */
  optimizeFor?: InputMaybe<OptimizeFor>;
  /** Checks for equality with the object’s `outputFormat` field. */
  outputFormat?: InputMaybe<OutputFormat>;
  /** Checks for equality with the object’s `searchForOptimalNearbyResolutions` field. */
  searchForOptimalNearbyResolutions?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `segmentFormat` field. */
  segmentFormat?: InputMaybe<SegmentFormat>;
  /**
   * Checks for equality with the object’s `subtitleChunksPattern` field.
   * @matchesPattern()
   */
  subtitleChunksPattern?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `subtitleContainer` field. */
  subtitleContainer?: InputMaybe<SubtitleContainer>;
  /**
   * Checks for equality with the object’s `subtitleFileLanguageExpression` field.
   * @isTrimmed()
   */
  subtitleFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `targetVmafScore` field. */
  targetVmafScore?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `tarMode` field. */
  tarMode?: InputMaybe<TarMode>;
  /** Checks for equality with the object’s `textLanguageSameAsAudioLanguage` field. */
  textLanguageSameAsAudioLanguage?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `thumbDurationInSeconds` field. */
  thumbDurationInSeconds?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `thumbGenerate` field. */
  thumbGenerate?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `thumbHeight` field. */
  thumbHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `thumbMaxHorizontalTiles` field. */
  thumbMaxHorizontalTiles?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `thumbMaxVerticalTiles` field. */
  thumbMaxVerticalTiles?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `thumbWidth` field. */
  thumbWidth?: InputMaybe<Scalars['Int']['input']>;
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
  /** Checks for equality with the object’s `useHighestPossibleBitrate` field. */
  useHighestPossibleBitrate?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `useNativeLanguageNames` field. */
  useNativeLanguageNames?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Checks for equality with the object’s `videoChunksPattern` field.
   * @matchesPattern()
   */
  videoChunksPattern?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `videoFormat` field. */
  videoFormat?: InputMaybe<VideoFormat>;
  /**
   * Checks for equality with the object’s `videoStreamExpression` field.
   * @isTrimmed()
   * @notEmpty()
   */
  videoStreamExpression?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `videoSyncMethod` field. */
  videoSyncMethod?: InputMaybe<VideoSyncMethod>;
};

/** A filter to be used against `EncodingProcessingProfile` object types. All fields are combined with a logical ‘and.’ */
export type EncodingProcessingProfileFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingProcessingProfileFilter>>;
  /** Filter by the object’s `archiveOutputName` field. */
  archiveOutputName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `audioChunksPattern` field. */
  audioChunksPattern?: InputMaybe<StringFilter>;
  /** Filter by the object’s `audioFileLanguageExpression` field. */
  audioFileLanguageExpression?: InputMaybe<StringFilter>;
  /** Filter by the object’s `captionFileLanguageExpression` field. */
  captionFileLanguageExpression?: InputMaybe<StringFilter>;
  /** Filter by the object’s `checksumFileName` field. */
  checksumFileName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `closedCaptionChunksPattern` field. */
  closedCaptionChunksPattern?: InputMaybe<StringFilter>;
  /** Filter by the object’s `closedCaptionPlacement` field. */
  closedCaptionPlacement?: InputMaybe<ClosedCaptionPlacementFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `dashManifestName` field. */
  dashManifestName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `defaultAudioLanguages` field. */
  defaultAudioLanguages?: InputMaybe<StringListFilter>;
  /** Filter by the object’s `defaultTextLanguages` field. */
  defaultTextLanguages?: InputMaybe<StringListFilter>;
  /** Filter by the object’s `deleteFilesFromSourceWhenDone` field. */
  deleteFilesFromSourceWhenDone?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `descriptiveAudioFileLanguageExpression` field. */
  descriptiveAudioFileLanguageExpression?: InputMaybe<StringFilter>;
  /** Filter by the object’s `drmProtection` field. */
  drmProtection?: InputMaybe<DrmProtectionFilter>;
  /** Filter by the object’s `encodingAudioRepresentations` relation. */
  encodingAudioRepresentations?: InputMaybe<EncodingProcessingProfileToManyEncodingAudioRepresentationFilter>;
  /** Some related `encodingAudioRepresentations` exist. */
  encodingAudioRepresentationsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `encodingEmbeddedCaptionChannels` relation. */
  encodingEmbeddedCaptionChannels?: InputMaybe<EncodingProcessingProfileToManyEncodingEmbeddedCaptionChannelFilter>;
  /** Some related `encodingEmbeddedCaptionChannels` exist. */
  encodingEmbeddedCaptionChannelsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `encodingMode` field. */
  encodingMode?: InputMaybe<EncodingModeFilter>;
  /** Filter by the object’s `encodingVideoRepresentations` relation. */
  encodingVideoRepresentations?: InputMaybe<EncodingProcessingProfileToManyEncodingVideoRepresentationFilter>;
  /** Some related `encodingVideoRepresentations` exist. */
  encodingVideoRepresentationsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `explicitIv` field. */
  explicitIv?: InputMaybe<StringFilter>;
  /** Filter by the object’s `extractAndApplyHdr` field. */
  extractAndApplyHdr?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `extractAndApplyHdr10Plus` field. */
  extractAndApplyHdr10Plus?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `failOnIgnoredFiles` field. */
  failOnIgnoredFiles?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `failOnIgnoredTracks` field. */
  failOnIgnoredTracks?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `failOnNoAudioTracks` field. */
  failOnNoAudioTracks?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `failOnNoCaptionTracks` field. */
  failOnNoCaptionTracks?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `failOnNoDescriptiveAudioTracks` field. */
  failOnNoDescriptiveAudioTracks?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `failOnNoSubtitleTracks` field. */
  failOnNoSubtitleTracks?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `failOnNoVideoTracks` field. */
  failOnNoVideoTracks?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `failOnUnrecognizedLanguageCodes` field. */
  failOnUnrecognizedLanguageCodes?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `fallbackLanguageCode` field. */
  fallbackLanguageCode?: InputMaybe<StringFilter>;
  /** Filter by the object’s `forceAspectRatioToStandard` field. */
  forceAspectRatioToStandard?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `forcePixelAspectRatioTo1` field. */
  forcePixelAspectRatioTo1?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `forensicWatermarking` field. */
  forensicWatermarking?: InputMaybe<ForensicWatermarkingFilter>;
  /** Filter by the object’s `hlsManifestName` field. */
  hlsManifestName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `hlsSessionKeyEnabled` field. */
  hlsSessionKeyEnabled?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `manifestName` field. */
  manifestName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `manifestVersion` field. */
  manifestVersion?: InputMaybe<ManifestVersionFilter>;
  /** Filter by the object’s `mediaDetection` field. */
  mediaDetection?: InputMaybe<MediaDetectionFilter>;
  /** Filter by the object’s `normalizeAudio` field. */
  normalizeAudio?: InputMaybe<BooleanFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingProcessingProfileFilter>;
  /** Filter by the object’s `optimizeFor` field. */
  optimizeFor?: InputMaybe<OptimizeForFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingProcessingProfileFilter>>;
  /** Filter by the object’s `outputFormat` field. */
  outputFormat?: InputMaybe<OutputFormatFilter>;
  /** Filter by the object’s `searchForOptimalNearbyResolutions` field. */
  searchForOptimalNearbyResolutions?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `segmentFormat` field. */
  segmentFormat?: InputMaybe<SegmentFormatFilter>;
  /** Filter by the object’s `subtitleChunksPattern` field. */
  subtitleChunksPattern?: InputMaybe<StringFilter>;
  /** Filter by the object’s `subtitleContainer` field. */
  subtitleContainer?: InputMaybe<SubtitleContainerFilter>;
  /** Filter by the object’s `subtitleFileLanguageExpression` field. */
  subtitleFileLanguageExpression?: InputMaybe<StringFilter>;
  /** Filter by the object’s `targetVmafScore` field. */
  targetVmafScore?: InputMaybe<IntFilter>;
  /** Filter by the object’s `tarMode` field. */
  tarMode?: InputMaybe<TarModeFilter>;
  /** Filter by the object’s `textLanguageSameAsAudioLanguage` field. */
  textLanguageSameAsAudioLanguage?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `thumbDurationInSeconds` field. */
  thumbDurationInSeconds?: InputMaybe<IntFilter>;
  /** Filter by the object’s `thumbGenerate` field. */
  thumbGenerate?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `thumbHeight` field. */
  thumbHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `thumbMaxHorizontalTiles` field. */
  thumbMaxHorizontalTiles?: InputMaybe<IntFilter>;
  /** Filter by the object’s `thumbMaxVerticalTiles` field. */
  thumbMaxVerticalTiles?: InputMaybe<IntFilter>;
  /** Filter by the object’s `thumbWidth` field. */
  thumbWidth?: InputMaybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `useHighestPossibleBitrate` field. */
  useHighestPossibleBitrate?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `useNativeLanguageNames` field. */
  useNativeLanguageNames?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `videoChunksPattern` field. */
  videoChunksPattern?: InputMaybe<StringFilter>;
  /** Filter by the object’s `videoFormat` field. */
  videoFormat?: InputMaybe<VideoFormatFilter>;
  /** Filter by the object’s `videosByProcessingProfileId` relation. */
  videosByProcessingProfileId?: InputMaybe<EncodingProcessingProfileToManyVideoFilter>;
  /** Some related `videosByProcessingProfileId` exist. */
  videosByProcessingProfileIdExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `videoStreamExpression` field. */
  videoStreamExpression?: InputMaybe<StringFilter>;
  /** Filter by the object’s `videoSyncMethod` field. */
  videoSyncMethod?: InputMaybe<VideoSyncMethodFilter>;
};

/** An input for mutations affecting `EncodingProcessingProfile` */
export type EncodingProcessingProfileInput = {
  /** @matchesPattern() */
  archiveOutputName?: InputMaybe<Scalars['String']['input']>;
  /** @matchesPattern() */
  audioChunksPattern?: InputMaybe<Scalars['String']['input']>;
  /** @isTrimmed() */
  audioFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  /** @isTrimmed() */
  captionFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  /** @matchesPattern() */
  checksumFileName?: InputMaybe<Scalars['String']['input']>;
  /** @matchesPattern() */
  closedCaptionChunksPattern?: InputMaybe<Scalars['String']['input']>;
  closedCaptionPlacement?: InputMaybe<ClosedCaptionPlacement>;
  /** @matchesPattern() */
  dashManifestName?: InputMaybe<Scalars['String']['input']>;
  defaultAudioLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  defaultTextLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  deleteFilesFromSourceWhenDone?: InputMaybe<Scalars['Boolean']['input']>;
  /** @isTrimmed() */
  descriptiveAudioFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  drmProtection?: InputMaybe<DrmProtection>;
  encodingMode?: InputMaybe<EncodingMode>;
  /**
   * @matchesPattern()
   * @maxLength(32)
   * @minLength(32)
   */
  explicitIv?: InputMaybe<Scalars['String']['input']>;
  extractAndApplyHdr?: InputMaybe<Scalars['Boolean']['input']>;
  extractAndApplyHdr10Plus?: InputMaybe<Scalars['Boolean']['input']>;
  failOnIgnoredFiles?: InputMaybe<Scalars['Boolean']['input']>;
  failOnIgnoredTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnNoAudioTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnNoCaptionTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnNoDescriptiveAudioTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnNoSubtitleTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnNoVideoTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnUnrecognizedLanguageCodes?: InputMaybe<Scalars['Boolean']['input']>;
  /** @maxLength(10) */
  fallbackLanguageCode?: InputMaybe<Scalars['String']['input']>;
  forceAspectRatioToStandard?: InputMaybe<Scalars['Boolean']['input']>;
  forcePixelAspectRatioTo1?: InputMaybe<Scalars['Boolean']['input']>;
  forensicWatermarking?: InputMaybe<ForensicWatermarking>;
  /** @matchesPattern() */
  hlsManifestName?: InputMaybe<Scalars['String']['input']>;
  hlsSessionKeyEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** @matchesPattern() */
  manifestName?: InputMaybe<Scalars['String']['input']>;
  manifestVersion?: InputMaybe<ManifestVersion>;
  mediaDetection?: InputMaybe<MediaDetection>;
  normalizeAudio?: InputMaybe<Scalars['Boolean']['input']>;
  optimizeFor?: InputMaybe<OptimizeFor>;
  outputFormat?: InputMaybe<OutputFormat>;
  searchForOptimalNearbyResolutions?: InputMaybe<Scalars['Boolean']['input']>;
  segmentFormat?: InputMaybe<SegmentFormat>;
  /** @matchesPattern() */
  subtitleChunksPattern?: InputMaybe<Scalars['String']['input']>;
  subtitleContainer?: InputMaybe<SubtitleContainer>;
  /** @isTrimmed() */
  subtitleFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  targetVmafScore?: InputMaybe<Scalars['Int']['input']>;
  tarMode?: InputMaybe<TarMode>;
  textLanguageSameAsAudioLanguage?: InputMaybe<Scalars['Boolean']['input']>;
  thumbDurationInSeconds?: InputMaybe<Scalars['Int']['input']>;
  thumbGenerate?: InputMaybe<Scalars['Boolean']['input']>;
  thumbHeight?: InputMaybe<Scalars['Int']['input']>;
  thumbMaxHorizontalTiles?: InputMaybe<Scalars['Int']['input']>;
  thumbMaxVerticalTiles?: InputMaybe<Scalars['Int']['input']>;
  thumbWidth?: InputMaybe<Scalars['Int']['input']>;
  /**
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  title: Scalars['String']['input'];
  useHighestPossibleBitrate?: InputMaybe<Scalars['Boolean']['input']>;
  useNativeLanguageNames?: InputMaybe<Scalars['Boolean']['input']>;
  /** @matchesPattern() */
  videoChunksPattern?: InputMaybe<Scalars['String']['input']>;
  videoFormat?: InputMaybe<VideoFormat>;
  /**
   * @isTrimmed()
   * @notEmpty()
   */
  videoStreamExpression?: InputMaybe<Scalars['String']['input']>;
  videoSyncMethod?: InputMaybe<VideoSyncMethod>;
};

/** Represents an update to a `EncodingProcessingProfile`. Fields that are set will be updated. */
export type EncodingProcessingProfilePatch = {
  /** @matchesPattern() */
  archiveOutputName?: InputMaybe<Scalars['String']['input']>;
  /** @matchesPattern() */
  audioChunksPattern?: InputMaybe<Scalars['String']['input']>;
  /** @isTrimmed() */
  audioFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  /** @isTrimmed() */
  captionFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  /** @matchesPattern() */
  checksumFileName?: InputMaybe<Scalars['String']['input']>;
  /** @matchesPattern() */
  closedCaptionChunksPattern?: InputMaybe<Scalars['String']['input']>;
  closedCaptionPlacement?: InputMaybe<ClosedCaptionPlacement>;
  /** @matchesPattern() */
  dashManifestName?: InputMaybe<Scalars['String']['input']>;
  defaultAudioLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  defaultTextLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  deleteFilesFromSourceWhenDone?: InputMaybe<Scalars['Boolean']['input']>;
  /** @isTrimmed() */
  descriptiveAudioFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  drmProtection?: InputMaybe<DrmProtection>;
  encodingMode?: InputMaybe<EncodingMode>;
  /**
   * @matchesPattern()
   * @maxLength(32)
   * @minLength(32)
   */
  explicitIv?: InputMaybe<Scalars['String']['input']>;
  extractAndApplyHdr?: InputMaybe<Scalars['Boolean']['input']>;
  extractAndApplyHdr10Plus?: InputMaybe<Scalars['Boolean']['input']>;
  failOnIgnoredFiles?: InputMaybe<Scalars['Boolean']['input']>;
  failOnIgnoredTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnNoAudioTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnNoCaptionTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnNoDescriptiveAudioTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnNoSubtitleTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnNoVideoTracks?: InputMaybe<Scalars['Boolean']['input']>;
  failOnUnrecognizedLanguageCodes?: InputMaybe<Scalars['Boolean']['input']>;
  /** @maxLength(10) */
  fallbackLanguageCode?: InputMaybe<Scalars['String']['input']>;
  forceAspectRatioToStandard?: InputMaybe<Scalars['Boolean']['input']>;
  forcePixelAspectRatioTo1?: InputMaybe<Scalars['Boolean']['input']>;
  forensicWatermarking?: InputMaybe<ForensicWatermarking>;
  /** @matchesPattern() */
  hlsManifestName?: InputMaybe<Scalars['String']['input']>;
  hlsSessionKeyEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** @matchesPattern() */
  manifestName?: InputMaybe<Scalars['String']['input']>;
  manifestVersion?: InputMaybe<ManifestVersion>;
  mediaDetection?: InputMaybe<MediaDetection>;
  normalizeAudio?: InputMaybe<Scalars['Boolean']['input']>;
  optimizeFor?: InputMaybe<OptimizeFor>;
  outputFormat?: InputMaybe<OutputFormat>;
  searchForOptimalNearbyResolutions?: InputMaybe<Scalars['Boolean']['input']>;
  segmentFormat?: InputMaybe<SegmentFormat>;
  /** @matchesPattern() */
  subtitleChunksPattern?: InputMaybe<Scalars['String']['input']>;
  subtitleContainer?: InputMaybe<SubtitleContainer>;
  /** @isTrimmed() */
  subtitleFileLanguageExpression?: InputMaybe<Scalars['String']['input']>;
  targetVmafScore?: InputMaybe<Scalars['Int']['input']>;
  tarMode?: InputMaybe<TarMode>;
  textLanguageSameAsAudioLanguage?: InputMaybe<Scalars['Boolean']['input']>;
  thumbDurationInSeconds?: InputMaybe<Scalars['Int']['input']>;
  thumbGenerate?: InputMaybe<Scalars['Boolean']['input']>;
  thumbHeight?: InputMaybe<Scalars['Int']['input']>;
  thumbMaxHorizontalTiles?: InputMaybe<Scalars['Int']['input']>;
  thumbMaxVerticalTiles?: InputMaybe<Scalars['Int']['input']>;
  thumbWidth?: InputMaybe<Scalars['Int']['input']>;
  /**
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']['input']>;
  useHighestPossibleBitrate?: InputMaybe<Scalars['Boolean']['input']>;
  useNativeLanguageNames?: InputMaybe<Scalars['Boolean']['input']>;
  /** @matchesPattern() */
  videoChunksPattern?: InputMaybe<Scalars['String']['input']>;
  videoFormat?: InputMaybe<VideoFormat>;
  /**
   * @isTrimmed()
   * @notEmpty()
   */
  videoStreamExpression?: InputMaybe<Scalars['String']['input']>;
  videoSyncMethod?: InputMaybe<VideoSyncMethod>;
};

/**
 * A connection to a list of `EncodingProcessingProfile` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type EncodingProcessingProfilesConnection = {
  __typename?: 'EncodingProcessingProfilesConnection';
  /** A list of edges which contains the `EncodingProcessingProfile` and cursor to aid in pagination. */
  edges: Array<EncodingProcessingProfilesEdge>;
  /** A list of `EncodingProcessingProfile` objects. */
  nodes: Array<EncodingProcessingProfile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EncodingProcessingProfile` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EncodingProcessingProfile` edge in the connection. */
export type EncodingProcessingProfilesEdge = {
  __typename?: 'EncodingProcessingProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EncodingProcessingProfile` at the end of the edge. */
  node: EncodingProcessingProfile;
};

/** Methods to use when ordering `EncodingProcessingProfile`. */
export enum EncodingProcessingProfilesOrderBy {
  ArchiveOutputNameAsc = 'ARCHIVE_OUTPUT_NAME_ASC',
  ArchiveOutputNameDesc = 'ARCHIVE_OUTPUT_NAME_DESC',
  AudioChunksPatternAsc = 'AUDIO_CHUNKS_PATTERN_ASC',
  AudioChunksPatternDesc = 'AUDIO_CHUNKS_PATTERN_DESC',
  AudioFileLanguageExpressionAsc = 'AUDIO_FILE_LANGUAGE_EXPRESSION_ASC',
  AudioFileLanguageExpressionDesc = 'AUDIO_FILE_LANGUAGE_EXPRESSION_DESC',
  CaptionFileLanguageExpressionAsc = 'CAPTION_FILE_LANGUAGE_EXPRESSION_ASC',
  CaptionFileLanguageExpressionDesc = 'CAPTION_FILE_LANGUAGE_EXPRESSION_DESC',
  ChecksumFileNameAsc = 'CHECKSUM_FILE_NAME_ASC',
  ChecksumFileNameDesc = 'CHECKSUM_FILE_NAME_DESC',
  ClosedCaptionChunksPatternAsc = 'CLOSED_CAPTION_CHUNKS_PATTERN_ASC',
  ClosedCaptionChunksPatternDesc = 'CLOSED_CAPTION_CHUNKS_PATTERN_DESC',
  ClosedCaptionPlacementAsc = 'CLOSED_CAPTION_PLACEMENT_ASC',
  ClosedCaptionPlacementDesc = 'CLOSED_CAPTION_PLACEMENT_DESC',
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DashManifestNameAsc = 'DASH_MANIFEST_NAME_ASC',
  DashManifestNameDesc = 'DASH_MANIFEST_NAME_DESC',
  DefaultAudioLanguagesAsc = 'DEFAULT_AUDIO_LANGUAGES_ASC',
  DefaultAudioLanguagesDesc = 'DEFAULT_AUDIO_LANGUAGES_DESC',
  DefaultTextLanguagesAsc = 'DEFAULT_TEXT_LANGUAGES_ASC',
  DefaultTextLanguagesDesc = 'DEFAULT_TEXT_LANGUAGES_DESC',
  DeleteFilesFromSourceWhenDoneAsc = 'DELETE_FILES_FROM_SOURCE_WHEN_DONE_ASC',
  DeleteFilesFromSourceWhenDoneDesc = 'DELETE_FILES_FROM_SOURCE_WHEN_DONE_DESC',
  DescriptiveAudioFileLanguageExpressionAsc = 'DESCRIPTIVE_AUDIO_FILE_LANGUAGE_EXPRESSION_ASC',
  DescriptiveAudioFileLanguageExpressionDesc = 'DESCRIPTIVE_AUDIO_FILE_LANGUAGE_EXPRESSION_DESC',
  DrmProtectionAsc = 'DRM_PROTECTION_ASC',
  DrmProtectionDesc = 'DRM_PROTECTION_DESC',
  EncodingModeAsc = 'ENCODING_MODE_ASC',
  EncodingModeDesc = 'ENCODING_MODE_DESC',
  ExplicitIvAsc = 'EXPLICIT_IV_ASC',
  ExplicitIvDesc = 'EXPLICIT_IV_DESC',
  ExtractAndApplyHdrAsc = 'EXTRACT_AND_APPLY_HDR_ASC',
  ExtractAndApplyHdrDesc = 'EXTRACT_AND_APPLY_HDR_DESC',
  ExtractAndApplyHdr10PlusAsc = 'EXTRACT_AND_APPLY_HDR10PLUS_ASC',
  ExtractAndApplyHdr10PlusDesc = 'EXTRACT_AND_APPLY_HDR10PLUS_DESC',
  FailOnIgnoredFilesAsc = 'FAIL_ON_IGNORED_FILES_ASC',
  FailOnIgnoredFilesDesc = 'FAIL_ON_IGNORED_FILES_DESC',
  FailOnIgnoredTracksAsc = 'FAIL_ON_IGNORED_TRACKS_ASC',
  FailOnIgnoredTracksDesc = 'FAIL_ON_IGNORED_TRACKS_DESC',
  FailOnNoAudioTracksAsc = 'FAIL_ON_NO_AUDIO_TRACKS_ASC',
  FailOnNoAudioTracksDesc = 'FAIL_ON_NO_AUDIO_TRACKS_DESC',
  FailOnNoCaptionTracksAsc = 'FAIL_ON_NO_CAPTION_TRACKS_ASC',
  FailOnNoCaptionTracksDesc = 'FAIL_ON_NO_CAPTION_TRACKS_DESC',
  FailOnNoDescriptiveAudioTracksAsc = 'FAIL_ON_NO_DESCRIPTIVE_AUDIO_TRACKS_ASC',
  FailOnNoDescriptiveAudioTracksDesc = 'FAIL_ON_NO_DESCRIPTIVE_AUDIO_TRACKS_DESC',
  FailOnNoSubtitleTracksAsc = 'FAIL_ON_NO_SUBTITLE_TRACKS_ASC',
  FailOnNoSubtitleTracksDesc = 'FAIL_ON_NO_SUBTITLE_TRACKS_DESC',
  FailOnNoVideoTracksAsc = 'FAIL_ON_NO_VIDEO_TRACKS_ASC',
  FailOnNoVideoTracksDesc = 'FAIL_ON_NO_VIDEO_TRACKS_DESC',
  FailOnUnrecognizedLanguageCodesAsc = 'FAIL_ON_UNRECOGNIZED_LANGUAGE_CODES_ASC',
  FailOnUnrecognizedLanguageCodesDesc = 'FAIL_ON_UNRECOGNIZED_LANGUAGE_CODES_DESC',
  FallbackLanguageCodeAsc = 'FALLBACK_LANGUAGE_CODE_ASC',
  FallbackLanguageCodeDesc = 'FALLBACK_LANGUAGE_CODE_DESC',
  ForceAspectRatioToStandardAsc = 'FORCE_ASPECT_RATIO_TO_STANDARD_ASC',
  ForceAspectRatioToStandardDesc = 'FORCE_ASPECT_RATIO_TO_STANDARD_DESC',
  ForcePixelAspectRatioTo_1Asc = 'FORCE_PIXEL_ASPECT_RATIO_TO_1_ASC',
  ForcePixelAspectRatioTo_1Desc = 'FORCE_PIXEL_ASPECT_RATIO_TO_1_DESC',
  ForensicWatermarkingAsc = 'FORENSIC_WATERMARKING_ASC',
  ForensicWatermarkingDesc = 'FORENSIC_WATERMARKING_DESC',
  HlsManifestNameAsc = 'HLS_MANIFEST_NAME_ASC',
  HlsManifestNameDesc = 'HLS_MANIFEST_NAME_DESC',
  HlsSessionKeyEnabledAsc = 'HLS_SESSION_KEY_ENABLED_ASC',
  HlsSessionKeyEnabledDesc = 'HLS_SESSION_KEY_ENABLED_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ManifestNameAsc = 'MANIFEST_NAME_ASC',
  ManifestNameDesc = 'MANIFEST_NAME_DESC',
  ManifestVersionAsc = 'MANIFEST_VERSION_ASC',
  ManifestVersionDesc = 'MANIFEST_VERSION_DESC',
  MediaDetectionAsc = 'MEDIA_DETECTION_ASC',
  MediaDetectionDesc = 'MEDIA_DETECTION_DESC',
  Natural = 'NATURAL',
  NormalizeAudioAsc = 'NORMALIZE_AUDIO_ASC',
  NormalizeAudioDesc = 'NORMALIZE_AUDIO_DESC',
  OptimizeForAsc = 'OPTIMIZE_FOR_ASC',
  OptimizeForDesc = 'OPTIMIZE_FOR_DESC',
  OutputFormatAsc = 'OUTPUT_FORMAT_ASC',
  OutputFormatDesc = 'OUTPUT_FORMAT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SearchForOptimalNearbyResolutionsAsc = 'SEARCH_FOR_OPTIMAL_NEARBY_RESOLUTIONS_ASC',
  SearchForOptimalNearbyResolutionsDesc = 'SEARCH_FOR_OPTIMAL_NEARBY_RESOLUTIONS_DESC',
  SegmentFormatAsc = 'SEGMENT_FORMAT_ASC',
  SegmentFormatDesc = 'SEGMENT_FORMAT_DESC',
  SubtitleChunksPatternAsc = 'SUBTITLE_CHUNKS_PATTERN_ASC',
  SubtitleChunksPatternDesc = 'SUBTITLE_CHUNKS_PATTERN_DESC',
  SubtitleContainerAsc = 'SUBTITLE_CONTAINER_ASC',
  SubtitleContainerDesc = 'SUBTITLE_CONTAINER_DESC',
  SubtitleFileLanguageExpressionAsc = 'SUBTITLE_FILE_LANGUAGE_EXPRESSION_ASC',
  SubtitleFileLanguageExpressionDesc = 'SUBTITLE_FILE_LANGUAGE_EXPRESSION_DESC',
  TarModeAsc = 'TAR_MODE_ASC',
  TarModeDesc = 'TAR_MODE_DESC',
  TargetVmafScoreAsc = 'TARGET_VMAF_SCORE_ASC',
  TargetVmafScoreDesc = 'TARGET_VMAF_SCORE_DESC',
  TextLanguageSameAsAudioLanguageAsc = 'TEXT_LANGUAGE_SAME_AS_AUDIO_LANGUAGE_ASC',
  TextLanguageSameAsAudioLanguageDesc = 'TEXT_LANGUAGE_SAME_AS_AUDIO_LANGUAGE_DESC',
  ThumbDurationInSecondsAsc = 'THUMB_DURATION_IN_SECONDS_ASC',
  ThumbDurationInSecondsDesc = 'THUMB_DURATION_IN_SECONDS_DESC',
  ThumbGenerateAsc = 'THUMB_GENERATE_ASC',
  ThumbGenerateDesc = 'THUMB_GENERATE_DESC',
  ThumbHeightAsc = 'THUMB_HEIGHT_ASC',
  ThumbHeightDesc = 'THUMB_HEIGHT_DESC',
  ThumbMaxHorizontalTilesAsc = 'THUMB_MAX_HORIZONTAL_TILES_ASC',
  ThumbMaxHorizontalTilesDesc = 'THUMB_MAX_HORIZONTAL_TILES_DESC',
  ThumbMaxVerticalTilesAsc = 'THUMB_MAX_VERTICAL_TILES_ASC',
  ThumbMaxVerticalTilesDesc = 'THUMB_MAX_VERTICAL_TILES_DESC',
  ThumbWidthAsc = 'THUMB_WIDTH_ASC',
  ThumbWidthDesc = 'THUMB_WIDTH_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  UseHighestPossibleBitrateAsc = 'USE_HIGHEST_POSSIBLE_BITRATE_ASC',
  UseHighestPossibleBitrateDesc = 'USE_HIGHEST_POSSIBLE_BITRATE_DESC',
  UseNativeLanguageNamesAsc = 'USE_NATIVE_LANGUAGE_NAMES_ASC',
  UseNativeLanguageNamesDesc = 'USE_NATIVE_LANGUAGE_NAMES_DESC',
  VideoChunksPatternAsc = 'VIDEO_CHUNKS_PATTERN_ASC',
  VideoChunksPatternDesc = 'VIDEO_CHUNKS_PATTERN_DESC',
  VideoFormatAsc = 'VIDEO_FORMAT_ASC',
  VideoFormatDesc = 'VIDEO_FORMAT_DESC',
  VideoStreamExpressionAsc = 'VIDEO_STREAM_EXPRESSION_ASC',
  VideoStreamExpressionDesc = 'VIDEO_STREAM_EXPRESSION_DESC',
  VideoSyncMethodAsc = 'VIDEO_SYNC_METHOD_ASC',
  VideoSyncMethodDesc = 'VIDEO_SYNC_METHOD_DESC'
}

/** A filter to be used against many `EncodingAudioRepresentation` object types. All fields are combined with a logical ‘and.’ */
export type EncodingProcessingProfileToManyEncodingAudioRepresentationFilter = {
  /** Every related `EncodingAudioRepresentation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EncodingAudioRepresentationFilter>;
  /** No related `EncodingAudioRepresentation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EncodingAudioRepresentationFilter>;
  /** Some related `EncodingAudioRepresentation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EncodingAudioRepresentationFilter>;
};

/** A filter to be used against many `EncodingEmbeddedCaptionChannel` object types. All fields are combined with a logical ‘and.’ */
export type EncodingProcessingProfileToManyEncodingEmbeddedCaptionChannelFilter = {
  /** Every related `EncodingEmbeddedCaptionChannel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EncodingEmbeddedCaptionChannelFilter>;
  /** No related `EncodingEmbeddedCaptionChannel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EncodingEmbeddedCaptionChannelFilter>;
  /** Some related `EncodingEmbeddedCaptionChannel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EncodingEmbeddedCaptionChannelFilter>;
};

/** A filter to be used against many `EncodingVideoRepresentation` object types. All fields are combined with a logical ‘and.’ */
export type EncodingProcessingProfileToManyEncodingVideoRepresentationFilter = {
  /** Every related `EncodingVideoRepresentation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EncodingVideoRepresentationFilter>;
  /** No related `EncodingVideoRepresentation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EncodingVideoRepresentationFilter>;
  /** Some related `EncodingVideoRepresentation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EncodingVideoRepresentationFilter>;
};

/** A filter to be used against many `Video` object types. All fields are combined with a logical ‘and.’ */
export type EncodingProcessingProfileToManyVideoFilter = {
  /** Every related `Video` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<VideoFilter>;
  /** No related `Video` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<VideoFilter>;
  /** Some related `Video` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<VideoFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingPublishingAmazonS3Setting = {
  __typename?: 'EncodingPublishingAmazonS3Setting';
  accessKeyId: Scalars['String']['output'];
  bucketName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingPublishingProfile` that is related to this `EncodingPublishingAmazonS3Setting`. */
  encodingPublishingProfile?: Maybe<EncodingPublishingProfile>;
  encodingPublishingProfileId: Scalars['UUID']['output'];
  fullTargetPath: Scalars['String']['output'];
  region: AmazonS3Region;
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** A filter to be used against `EncodingPublishingAmazonS3Setting` object types. All fields are combined with a logical ‘and.’ */
export type EncodingPublishingAmazonS3SettingFilter = {
  /** Filter by the object’s `accessKeyId` field. */
  accessKeyId?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingPublishingAmazonS3SettingFilter>>;
  /** Filter by the object’s `bucketName` field. */
  bucketName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `encodingPublishingProfile` relation. */
  encodingPublishingProfile?: InputMaybe<EncodingPublishingProfileFilter>;
  /** Filter by the object’s `encodingPublishingProfileId` field. */
  encodingPublishingProfileId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingPublishingAmazonS3SettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingPublishingAmazonS3SettingFilter>>;
  /** Filter by the object’s `region` field. */
  region?: InputMaybe<AmazonS3RegionFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingPublishingAzureBlobSetting = {
  __typename?: 'EncodingPublishingAzureBlobSetting';
  accountName: Scalars['String']['output'];
  containerName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingPublishingProfile` that is related to this `EncodingPublishingAzureBlobSetting`. */
  encodingPublishingProfile?: Maybe<EncodingPublishingProfile>;
  encodingPublishingProfileId: Scalars['UUID']['output'];
  fullTargetPath: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** A filter to be used against `EncodingPublishingAzureBlobSetting` object types. All fields are combined with a logical ‘and.’ */
export type EncodingPublishingAzureBlobSettingFilter = {
  /** Filter by the object’s `accountName` field. */
  accountName?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingPublishingAzureBlobSettingFilter>>;
  /** Filter by the object’s `containerName` field. */
  containerName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `encodingPublishingProfile` relation. */
  encodingPublishingProfile?: InputMaybe<EncodingPublishingProfileFilter>;
  /** Filter by the object’s `encodingPublishingProfileId` field. */
  encodingPublishingProfileId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingPublishingAzureBlobSettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingPublishingAzureBlobSettingFilter>>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingPublishingHostingAzureSetting = {
  __typename?: 'EncodingPublishingHostingAzureSetting';
  accountName: Scalars['String']['output'];
  containerName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingPublishingProfile` that is related to this `EncodingPublishingHostingAzureSetting`. */
  encodingPublishingProfile?: Maybe<EncodingPublishingProfile>;
  encodingPublishingProfileId: Scalars['UUID']['output'];
  fullTargetPath: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** A filter to be used against `EncodingPublishingHostingAzureSetting` object types. All fields are combined with a logical ‘and.’ */
export type EncodingPublishingHostingAzureSettingFilter = {
  /** Filter by the object’s `accountName` field. */
  accountName?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingPublishingHostingAzureSettingFilter>>;
  /** Filter by the object’s `containerName` field. */
  containerName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `encodingPublishingProfile` relation. */
  encodingPublishingProfile?: InputMaybe<EncodingPublishingProfileFilter>;
  /** Filter by the object’s `encodingPublishingProfileId` field. */
  encodingPublishingProfileId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingPublishingHostingAzureSettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingPublishingHostingAzureSettingFilter>>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingPublishingProfile = {
  __typename?: 'EncodingPublishingProfile';
  /** Reads a single `EncodingPublishingAmazonS3Setting` that is related to this `EncodingPublishingProfile`. */
  amazonS3Setting?: Maybe<EncodingPublishingAmazonS3Setting>;
  /** Reads a single `EncodingPublishingAzureBlobSetting` that is related to this `EncodingPublishingProfile`. */
  azureBlobSetting?: Maybe<EncodingPublishingAzureBlobSetting>;
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingPublishingHostingAzureSetting` that is related to this `EncodingPublishingProfile`. */
  hostingAzureSetting?: Maybe<EncodingPublishingHostingAzureSetting>;
  id: Scalars['UUID']['output'];
  /** True if this profile is the default for its tenant/environment. Exactly one profile per tenant/env is the default whenever any profile exists. Maintained by triggers. */
  isDefault: Scalars['Boolean']['output'];
  provider: StorageProvider;
  /** Reads a single `EncodingPublishingS3CompatibleSetting` that is related to this `EncodingPublishingProfile`. */
  s3CompatibleSetting?: Maybe<EncodingPublishingS3CompatibleSetting>;
  title: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/**
 * A condition to be used against `EncodingPublishingProfile` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingPublishingProfileCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `isDefault` field. */
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
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

/** A filter to be used against `EncodingPublishingProfile` object types. All fields are combined with a logical ‘and.’ */
export type EncodingPublishingProfileFilter = {
  /** Filter by the object’s `amazonS3Setting` relation. */
  amazonS3Setting?: InputMaybe<EncodingPublishingAmazonS3SettingFilter>;
  /** A related `amazonS3Setting` exists. */
  amazonS3SettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingPublishingProfileFilter>>;
  /** Filter by the object’s `azureBlobSetting` relation. */
  azureBlobSetting?: InputMaybe<EncodingPublishingAzureBlobSettingFilter>;
  /** A related `azureBlobSetting` exists. */
  azureBlobSettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `hostingAzureSetting` relation. */
  hostingAzureSetting?: InputMaybe<EncodingPublishingHostingAzureSettingFilter>;
  /** A related `hostingAzureSetting` exists. */
  hostingAzureSettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `isDefault` field. */
  isDefault?: InputMaybe<BooleanFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingPublishingProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingPublishingProfileFilter>>;
  /** Filter by the object’s `provider` field. */
  provider?: InputMaybe<StorageProviderFilter>;
  /** Filter by the object’s `s3CompatibleSetting` relation. */
  s3CompatibleSetting?: InputMaybe<EncodingPublishingS3CompatibleSettingFilter>;
  /** A related `s3CompatibleSetting` exists. */
  s3CompatibleSettingExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `videosByPublishingProfileId` relation. */
  videosByPublishingProfileId?: InputMaybe<EncodingPublishingProfileToManyVideoFilter>;
  /** Some related `videosByPublishingProfileId` exist. */
  videosByPublishingProfileIdExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * A connection to a list of `EncodingPublishingProfile` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type EncodingPublishingProfilesConnection = {
  __typename?: 'EncodingPublishingProfilesConnection';
  /** A list of edges which contains the `EncodingPublishingProfile` and cursor to aid in pagination. */
  edges: Array<EncodingPublishingProfilesEdge>;
  /** A list of `EncodingPublishingProfile` objects. */
  nodes: Array<EncodingPublishingProfile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EncodingPublishingProfile` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EncodingPublishingProfile` edge in the connection. */
export type EncodingPublishingProfilesEdge = {
  __typename?: 'EncodingPublishingProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EncodingPublishingProfile` at the end of the edge. */
  node: EncodingPublishingProfile;
};

/** Methods to use when ordering `EncodingPublishingProfile`. */
export enum EncodingPublishingProfilesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsDefaultAsc = 'IS_DEFAULT_ASC',
  IsDefaultDesc = 'IS_DEFAULT_DESC',
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

/** A filter to be used against many `Video` object types. All fields are combined with a logical ‘and.’ */
export type EncodingPublishingProfileToManyVideoFilter = {
  /** Every related `Video` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<VideoFilter>;
  /** No related `Video` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<VideoFilter>;
  /** Some related `Video` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<VideoFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingPublishingS3CompatibleSetting = {
  __typename?: 'EncodingPublishingS3CompatibleSetting';
  accessKeyId: Scalars['String']['output'];
  bucketName: Scalars['String']['output'];
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads a single `EncodingPublishingProfile` that is related to this `EncodingPublishingS3CompatibleSetting`. */
  encodingPublishingProfile?: Maybe<EncodingPublishingProfile>;
  encodingPublishingProfileId: Scalars['UUID']['output'];
  fullTargetPath: Scalars['String']['output'];
  region?: Maybe<Scalars['String']['output']>;
  s3Endpoint: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
};

/** A filter to be used against `EncodingPublishingS3CompatibleSetting` object types. All fields are combined with a logical ‘and.’ */
export type EncodingPublishingS3CompatibleSettingFilter = {
  /** Filter by the object’s `accessKeyId` field. */
  accessKeyId?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingPublishingS3CompatibleSettingFilter>>;
  /** Filter by the object’s `bucketName` field. */
  bucketName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `encodingPublishingProfile` relation. */
  encodingPublishingProfile?: InputMaybe<EncodingPublishingProfileFilter>;
  /** Filter by the object’s `encodingPublishingProfileId` field. */
  encodingPublishingProfileId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingPublishingS3CompatibleSettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingPublishingS3CompatibleSettingFilter>>;
  /** Filter by the object’s `region` field. */
  region?: InputMaybe<StringFilter>;
  /** Filter by the object’s `s3Endpoint` field. */
  s3Endpoint?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

export enum EncodingState {
  /** Error */
  Error = 'ERROR',
  /** In progress */
  InProgress = 'IN_PROGRESS',
  /** Initializing */
  Initializing = 'INITIALIZING',
  /** Not started */
  NotStarted = 'NOT_STARTED',
  /** Ready */
  Ready = 'READY',
  /** Waiting */
  Waiting = 'WAITING'
}

/** A filter to be used against EncodingState fields. All fields are combined with a logical ‘and.’ */
export type EncodingStateFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<EncodingState>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<EncodingState>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<EncodingState>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<EncodingState>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<EncodingState>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<EncodingState>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<EncodingState>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<EncodingState>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<EncodingState>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<EncodingState>>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingVideoRepresentation = {
  __typename?: 'EncodingVideoRepresentation';
  bitrateInKbps: Scalars['Int']['output'];
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingVideoRepresentation`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  encodingProcessingProfileId: Scalars['UUID']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['UUID']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `EncodingVideoRepresentation` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingVideoRepresentationCondition = {
  /** Checks for equality with the object’s `bitrateInKbps` field. */
  bitrateInKbps?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `encodingProcessingProfileId` field. */
  encodingProcessingProfileId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `height` field. */
  height?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `width` field. */
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `EncodingVideoRepresentation` object types. All fields are combined with a logical ‘and.’ */
export type EncodingVideoRepresentationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingVideoRepresentationFilter>>;
  /** Filter by the object’s `bitrateInKbps` field. */
  bitrateInKbps?: InputMaybe<IntFilter>;
  /** Filter by the object’s `encodingProcessingProfile` relation. */
  encodingProcessingProfile?: InputMaybe<EncodingProcessingProfileFilter>;
  /** Filter by the object’s `encodingProcessingProfileId` field. */
  encodingProcessingProfileId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `height` field. */
  height?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingVideoRepresentationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingVideoRepresentationFilter>>;
  /** Filter by the object’s `width` field. */
  width?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `EncodingVideoRepresentation` */
export type EncodingVideoRepresentationInput = {
  bitrateInKbps: Scalars['Int']['input'];
  encodingProcessingProfileId: Scalars['UUID']['input'];
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents an update to a `EncodingVideoRepresentation`. Fields that are set will be updated. */
export type EncodingVideoRepresentationPatch = {
  bitrateInKbps?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * A connection to a list of `EncodingVideoRepresentation` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type EncodingVideoRepresentationsConnection = {
  __typename?: 'EncodingVideoRepresentationsConnection';
  /** A list of edges which contains the `EncodingVideoRepresentation` and cursor to aid in pagination. */
  edges: Array<EncodingVideoRepresentationsEdge>;
  /** A list of `EncodingVideoRepresentation` objects. */
  nodes: Array<EncodingVideoRepresentation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EncodingVideoRepresentation` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EncodingVideoRepresentation` edge in the connection. */
export type EncodingVideoRepresentationsEdge = {
  __typename?: 'EncodingVideoRepresentationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EncodingVideoRepresentation` at the end of the edge. */
  node: EncodingVideoRepresentation;
};

/** Methods to use when ordering `EncodingVideoRepresentation`. */
export enum EncodingVideoRepresentationsOrderBy {
  BitrateInKbpsAsc = 'BITRATE_IN_KBPS_ASC',
  BitrateInKbpsDesc = 'BITRATE_IN_KBPS_DESC',
  EncodingProcessingProfileIdAsc = 'ENCODING_PROCESSING_PROFILE_ID_ASC',
  EncodingProcessingProfileIdDesc = 'ENCODING_PROCESSING_PROFILE_ID_DESC',
  HeightAsc = 'HEIGHT_ASC',
  HeightDesc = 'HEIGHT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  WidthAsc = 'WIDTH_ASC',
  WidthDesc = 'WIDTH_DESC'
}

/** @permissions: VIDEOS_ENCODE,ADMIN */
export type EncodingWatermarkProfile = {
  __typename?: 'EncodingWatermarkProfile';
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  endTime?: Maybe<Scalars['String']['output']>;
  fadeInDuration?: Maybe<Scalars['Int']['output']>;
  fadeOutDuration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['UUID']['output'];
  imageId: Scalars['UUID']['output'];
  opacity: Scalars['Int']['output'];
  positionX: Scalars['Int']['output'];
  positionY: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  startTime?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
  useByDefault: Scalars['Boolean']['output'];
};

/**
 * A condition to be used against `EncodingWatermarkProfile` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingWatermarkProfileCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `endTime` field.
   * @matchesPattern()
   */
  endTime?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `fadeInDuration` field. */
  fadeInDuration?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `fadeOutDuration` field. */
  fadeOutDuration?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `opacity` field. */
  opacity?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `positionX` field. */
  positionX?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `positionY` field. */
  positionY?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `size` field. */
  size?: InputMaybe<Scalars['Int']['input']>;
  /**
   * Checks for equality with the object’s `startTime` field.
   * @matchesPattern()
   */
  startTime?: InputMaybe<Scalars['String']['input']>;
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
  /** Checks for equality with the object’s `useByDefault` field. */
  useByDefault?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A filter to be used against `EncodingWatermarkProfile` object types. All fields are combined with a logical ‘and.’ */
export type EncodingWatermarkProfileFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingWatermarkProfileFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `endTime` field. */
  endTime?: InputMaybe<StringFilter>;
  /** Filter by the object’s `fadeInDuration` field. */
  fadeInDuration?: InputMaybe<IntFilter>;
  /** Filter by the object’s `fadeOutDuration` field. */
  fadeOutDuration?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `imageId` field. */
  imageId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingWatermarkProfileFilter>;
  /** Filter by the object’s `opacity` field. */
  opacity?: InputMaybe<IntFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingWatermarkProfileFilter>>;
  /** Filter by the object’s `positionX` field. */
  positionX?: InputMaybe<IntFilter>;
  /** Filter by the object’s `positionY` field. */
  positionY?: InputMaybe<IntFilter>;
  /** Filter by the object’s `size` field. */
  size?: InputMaybe<IntFilter>;
  /** Filter by the object’s `startTime` field. */
  startTime?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `useByDefault` field. */
  useByDefault?: InputMaybe<BooleanFilter>;
};

/** An input for mutations affecting `EncodingWatermarkProfile` */
export type EncodingWatermarkProfileInput = {
  /** @matchesPattern() */
  endTime?: InputMaybe<Scalars['String']['input']>;
  fadeInDuration?: InputMaybe<Scalars['Int']['input']>;
  fadeOutDuration?: InputMaybe<Scalars['Int']['input']>;
  imageId: Scalars['UUID']['input'];
  opacity?: InputMaybe<Scalars['Int']['input']>;
  positionX?: InputMaybe<Scalars['Int']['input']>;
  positionY?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  /** @matchesPattern() */
  startTime?: InputMaybe<Scalars['String']['input']>;
  /**
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  title: Scalars['String']['input'];
  useByDefault?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Represents an update to a `EncodingWatermarkProfile`. Fields that are set will be updated. */
export type EncodingWatermarkProfilePatch = {
  /** @matchesPattern() */
  endTime?: InputMaybe<Scalars['String']['input']>;
  fadeInDuration?: InputMaybe<Scalars['Int']['input']>;
  fadeOutDuration?: InputMaybe<Scalars['Int']['input']>;
  imageId?: InputMaybe<Scalars['UUID']['input']>;
  opacity?: InputMaybe<Scalars['Int']['input']>;
  positionX?: InputMaybe<Scalars['Int']['input']>;
  positionY?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  /** @matchesPattern() */
  startTime?: InputMaybe<Scalars['String']['input']>;
  /**
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']['input']>;
  useByDefault?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * A connection to a list of `EncodingWatermarkProfile` values.
 * @permissions: VIDEOS_ENCODE,ADMIN
 */
export type EncodingWatermarkProfilesConnection = {
  __typename?: 'EncodingWatermarkProfilesConnection';
  /** A list of edges which contains the `EncodingWatermarkProfile` and cursor to aid in pagination. */
  edges: Array<EncodingWatermarkProfilesEdge>;
  /** A list of `EncodingWatermarkProfile` objects. */
  nodes: Array<EncodingWatermarkProfile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EncodingWatermarkProfile` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EncodingWatermarkProfile` edge in the connection. */
export type EncodingWatermarkProfilesEdge = {
  __typename?: 'EncodingWatermarkProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EncodingWatermarkProfile` at the end of the edge. */
  node: EncodingWatermarkProfile;
};

/** Methods to use when ordering `EncodingWatermarkProfile`. */
export enum EncodingWatermarkProfilesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  EndTimeAsc = 'END_TIME_ASC',
  EndTimeDesc = 'END_TIME_DESC',
  FadeInDurationAsc = 'FADE_IN_DURATION_ASC',
  FadeInDurationDesc = 'FADE_IN_DURATION_DESC',
  FadeOutDurationAsc = 'FADE_OUT_DURATION_ASC',
  FadeOutDurationDesc = 'FADE_OUT_DURATION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  Natural = 'NATURAL',
  OpacityAsc = 'OPACITY_ASC',
  OpacityDesc = 'OPACITY_DESC',
  PositionXAsc = 'POSITION_X_ASC',
  PositionXDesc = 'POSITION_X_DESC',
  PositionYAsc = 'POSITION_Y_ASC',
  PositionYDesc = 'POSITION_Y_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SizeAsc = 'SIZE_ASC',
  SizeDesc = 'SIZE_DESC',
  StartTimeAsc = 'START_TIME_ASC',
  StartTimeDesc = 'START_TIME_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  UseByDefaultAsc = 'USE_BY_DEFAULT_ASC',
  UseByDefaultDesc = 'USE_BY_DEFAULT_DESC'
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
  /** The acquisition profile was not found. */
  AcquisitionProfileNotFound = 'ACQUISITION_PROFILE_NOT_FOUND',
  /** The acquisition settings were not found. */
  AcquisitionSettingsNotFound = 'ACQUISITION_SETTINGS_NOT_FOUND',
  /** Unable to update Acquisition Profile because the current storage provider is %s and not AMAZON_S3. */
  AcquisitionUpdateForNonAmazonS3Provider = 'ACQUISITION_UPDATE_FOR_NON_AMAZON_S3_PROVIDER',
  /** Unable to update Acquisition Profile because the current storage provider is %s and not AZURE_BLOB. */
  AcquisitionUpdateForNonAzureBlobProvider = 'ACQUISITION_UPDATE_FOR_NON_AZURE_BLOB_PROVIDER',
  /** Unable to update Acquisition Profile because the current storage provider is %s and not S3_COMPATIBLE. */
  AcquisitionUpdateForNonS3CompatibleProvider = 'ACQUISITION_UPDATE_FOR_NON_S3_COMPATIBLE_PROVIDER',
  /** Unable to generate Amazon S3 URL for %s. Bucket Name is empty. */
  AmazonS3BucketNameNotProvided = 'AMAZON_S3_BUCKET_NAME_NOT_PROVIDED',
  /** The Bucket Name from Acquisition Profile is invalid. */
  AmazonS3InvalidBucketName = 'AMAZON_S3_INVALID_BUCKET_NAME',
  /** The Region from Acquisition Profile is invalid. Please make sure it matches the account details. */
  AmazonS3InvalidRegion = 'AMAZON_S3_INVALID_REGION',
  /** Either Region or Access Key Id from Acquisition Profile is invalid. */
  AmazonS3InvalidRegionOrAccessKeyId = 'AMAZON_S3_INVALID_REGION_OR_ACCESS_KEY_ID',
  /** The Management Access Key from Acquisition Profile is invalid. */
  AmazonS3InvalidSecretAccessKeyId = 'AMAZON_S3_INVALID_SECRET_ACCESS_KEY_ID',
  /** Management secret access key must be set to enable management operations. */
  AmazonS3ManagementSecretAccessKeyNotSet = 'AMAZON_S3_MANAGEMENT_SECRET_ACCESS_KEY_NOT_SET',
  /** Unable to generate Amazon S3 URL for %s. Path is empty. */
  AmazonS3PathNotProvided = 'AMAZON_S3_PATH_NOT_PROVIDED',
  /** Unable to generate Amazon S3 URL for %s. Region is empty. */
  AmazonS3RegionNotProvided = 'AMAZON_S3_REGION_NOT_PROVIDED',
  /** The assertion check for the identifier %s failed. */
  AssertionFailed = 'ASSERTION_FAILED',
  /** Auth config is invalid. */
  AuthConfigInvalid = 'AUTH_CONFIG_INVALID',
  /** Could not extract the authentication token from the received message. */
  AuthTokenNotFound = 'AUTH_TOKEN_NOT_FOUND',
  /** Authenticated End User not found. */
  AuthenticatedEndUserNotFound = 'AUTHENTICATED_END_USER_NOT_FOUND',
  /** Authenticated Management Subject not found. */
  AuthenticatedManagementSubjectNotFound = 'AUTHENTICATED_MANAGEMENT_SUBJECT_NOT_FOUND',
  /** A Permission Definition or an EndUserAuthorizationConfig was not found to be passed into Postgraphile build options. This is a development time issue. */
  AuthorizationOptionsMisconfigured = 'AUTHORIZATION_OPTIONS_MISCONFIGURED',
  /** Unable to generate Azure Blob URL for %s. Account name is empty. */
  AzureBlobAccountNameNotProvided = 'AZURE_BLOB_ACCOUNT_NAME_NOT_PROVIDED',
  /** Unable to authenticate access to the Azure Blob Storage. The SAS token from Acquisition Profile might be invalid. */
  AzureBlobAuthenticationFailed = 'AZURE_BLOB_AUTHENTICATION_FAILED',
  /** Unable to generate Azure Blob URL for %s. Container name is empty. */
  AzureBlobContainerNameNotProvided = 'AZURE_BLOB_CONTAINER_NAME_NOT_PROVIDED',
  /** The configured Acquisition Storage container does not exist. Please make sure, that the acquisition storage container name value is correct. */
  AzureBlobContainerNotFound = 'AZURE_BLOB_CONTAINER_NOT_FOUND',
  /** The SAS token from Acquisition Profile is either expired or not yet active. */
  AzureBlobInactiveSas = 'AZURE_BLOB_INACTIVE_SAS',
  /** The SAS token from Acquisition Profile is invalid. It's possible that it was filled incompletely. */
  AzureBlobIncompleteSas = 'AZURE_BLOB_INCOMPLETE_SAS',
  /** The account name in Acquisition profile is invalid. */
  AzureBlobInvalidAccountName = 'AZURE_BLOB_INVALID_ACCOUNT_NAME',
  /** Acquisition profile is invalid. Please make sure that all values are filled correctly. */
  AzureBlobInvalidSasOrContainerName = 'AZURE_BLOB_INVALID_SAS_OR_CONTAINER_NAME',
  /** Management SAS token must be set to enable management operations. */
  AzureBlobManagementSasTokenNotSet = 'AZURE_BLOB_MANAGEMENT_SAS_TOKEN_NOT_SET',
  /** The SAS token from Acquisition Profile is invalid. Please make sure that 'Container' and 'Object' options are selected from 'Allowed resource types' when generating the SAS token. */
  AzureBlobNoContainerOrObjectPermission = 'AZURE_BLOB_NO_CONTAINER_OR_OBJECT_PERMISSION',
  /** The SAS token from Acquisition Profile is invalid. Please make sure that 'List' option is selected from 'Allowed permissions' when generating the SAS token. */
  AzureBlobNoListPermission = 'AZURE_BLOB_NO_LIST_PERMISSION',
  /** The SAS token from Acquisition Profile is invalid. Please make sure that 'Blob' option is selected from 'Allowed services' when generating the SAS token. */
  AzureBlobNoSasBlobPermission = 'AZURE_BLOB_NO_SAS_BLOB_PERMISSION',
  /** Unable to generate Azure Blob URL for %s. Path or SAS Token is empty. */
  AzureBlobPathOrSasTokenNotProvided = 'AZURE_BLOB_PATH_OR_SAS_TOKEN_NOT_PROVIDED',
  /** Archived videos cannot be re-encoded. */
  CannotReEncodeArchivedVideos = 'CANNOT_RE_ENCODE_ARCHIVED_VIDEOS',
  /** Custom videos cannot be re-encoded. */
  CannotReEncodeCustomVideos = 'CANNOT_RE_ENCODE_CUSTOM_VIDEOS',
  /** The previous encoding attempt is (likely) still in progress. */
  CannotReEncodeProcessingVideos = 'CANNOT_RE_ENCODE_PROCESSING_VIDEOS',
  /** Encoding already succeeded. */
  CannotReEncodeSucceededVideos = 'CANNOT_RE_ENCODE_SUCCEEDED_VIDEOS',
  /** The cue point was not found. */
  CuePointNotFound = 'CUE_POINT_NOT_FOUND',
  /** The cue point time cannot exceed the length of the video. */
  CuePointTimeGtVideoLength = 'CUE_POINT_TIME_GT_VIDEO_LENGTH',
  /** Cue points can only be created for videos where the length field is already filled. */
  CuePointVideoLengthNotSet = 'CUE_POINT_VIDEO_LENGTH_NOT_SET',
  /** A database operation has failed because of a lock timeout. */
  DatabaseLockTimeoutError = 'DATABASE_LOCK_TIMEOUT_ERROR',
  /** An authorization database error has occurred. The user might not have enough permissions. */
  DatabasePermissionsCheckFailed = 'DATABASE_PERMISSIONS_CHECK_FAILED',
  /** An expected and handled database constraint error has occurred. The actual message will have more information. */
  DatabaseValidationFailed = 'DATABASE_VALIDATION_FAILED',
  /** Unable to declare cue point types as at least one other cue point type is already used by a different service. Please check the error details for the list of already declared cue point types and their service IDs. */
  DeclareCuePointTypesDuplicate = 'DECLARE_CUE_POINT_TYPES_DUPLICATE',
  /** No default acquisition profile is set. Please mark one profile as the default. */
  DefaultAcquisitionProfileNotSet = 'DEFAULT_ACQUISITION_PROFILE_NOT_SET',
  /** Default entitlement service initialization has failed. Please contact Axinom support. */
  DefaultEntitlementServiceInitializationFailed = 'DEFAULT_ENTITLEMENT_SERVICE_INITIALIZATION_FAILED',
  /** No default publishing profile is set. Please mark one profile as the default. */
  DefaultPublishingProfileNotSet = 'DEFAULT_PUBLISHING_PROFILE_NOT_SET',
  /** The DRM settings profile was not found */
  DrmProfileNotFound = 'DRM_PROFILE_NOT_FOUND',
  /** DRM service not enabled. Please check and try again */
  DrmServiceNotEnabled = 'DRM_SERVICE_NOT_ENABLED',
  /** An attempt to generate a webhook response has failed. If payload is empty, at least one error must be provided. */
  EmptyWebhookResponse = 'EMPTY_WEBHOOK_RESPONSE',
  /** The webhook request validation has failed because the provided webhook secret is empty. */
  EmptyWebhookSecret = 'EMPTY_WEBHOOK_SECRET',
  /** Axinom Encoding Service authorization failed. This might be an issue with the service configuration. Please contact Axinom Support. */
  EncoderAuthorizationFailed = 'ENCODER_AUTHORIZATION_FAILED',
  /** A job request to the Axinom Encoding Service was sent, but failed with a Bad Request error. Its possible that values from the Video Encoding Settings are encrypted incorrectly or have invalid values. */
  EncoderBadRequest = 'ENCODER_BAD_REQUEST',
  /** The previous encoding job creation attempt failed with the following reason: %s */
  EncoderJobCreationFailed = 'ENCODER_JOB_CREATION_FAILED',
  /** A job with this ID is still being created by the encoder. If this issue persists, use retryEncodeVideo to start a new attempt. */
  EncoderJobCreationPending = 'ENCODER_JOB_CREATION_PENDING',
  /** The request to start the encoding process has failed. */
  EncoderJobRequestFailed = 'ENCODER_JOB_REQUEST_FAILED',
  /** The message type "%s" received from the encoder is not supported. */
  EncoderMessageTypeNotSupported = 'ENCODER_MESSAGE_TYPE_NOT_SUPPORTED',
  /** The output format '%s' received from the encoder is not supported. */
  EncoderOutputFormatNotSupported = 'ENCODER_OUTPUT_FORMAT_NOT_SUPPORTED',
  /** Axinom Encoding Service forbidden. Job exists for the same JobId belonging to a different tenant. Trying with a different jobId might help. */
  EncoderRequestForbidden = 'ENCODER_REQUEST_FORBIDDEN',
  /** A request to the Axinom Encoding Service has failed with an 404 error code. This might be an issue with the service configuration. Please contact Axinom Support. */
  EncoderRequestNotFound = 'ENCODER_REQUEST_NOT_FOUND',
  /** The request to the Axinom Encoding Service has failed with an 405 error code. This might be an issue with the service configuration. Please contact Axinom Support. */
  EncoderRequestWrongApi = 'ENCODER_REQUEST_WRONG_API',
  /** Request to the Encoder-API storagefolders endpoint failed. */
  EncoderStorageFoldersRequestFailed = 'ENCODER_STORAGE_FOLDERS_REQUEST_FAILED',
  /** The Axinom Encoding Service validation failed with the following messages: %s */
  EncoderValidationFailed = 'ENCODER_VALIDATION_FAILED',
  /** Encoding certificate endpoint is not accessible. Please contact Axinom support. */
  EncodingCertEndpointNotAccessible = 'ENCODING_CERT_ENDPOINT_NOT_ACCESSIBLE',
  /** Unable to start the encoding process as there was an authorization issue. Please contact Axinom Support. */
  EncodingJwtNotFound = 'ENCODING_JWT_NOT_FOUND',
  /** This is a wrapper error for the original unhandled error of unsupported type. */
  ErrorWrapper = 'ERROR_WRAPPER',
  /** A GraphQL validation error has occurred. Please make sure that the GraphQL request is made with correct syntax or parameters. */
  GraphqlValidationFailed = 'GRAPHQL_VALIDATION_FAILED',
  /** The Hosting service is not accessible. Please contact Axinom support. */
  HostingServiceNotAccessible = 'HOSTING_SERVICE_NOT_ACCESSIBLE',
  /** The request to the ID Service failed. Please make sure the ID Service is accessible and try again. */
  IdServiceRequestFailed = 'ID_SERVICE_REQUEST_FAILED',
  /** The Identity service is not accessible. Please contact Axinom support. */
  IdentityServiceNotAccessible = 'IDENTITY_SERVICE_NOT_ACCESSIBLE',
  /** The request to the Image service failed. Please try again or contact Axinom support. */
  ImageServiceNotAccessible = 'IMAGE_SERVICE_NOT_ACCESSIBLE',
  /** The request to the Image service failed due to unauthorized access. Please make sure that you have at least 'IMAGES_VIEW' permissions on the Image Service. */
  ImageServiceUnauthorized = 'IMAGE_SERVICE_UNAUTHORIZED',
  /** An unhandled and unexpected error has occurred. Please contact the service support. */
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  /** An attempt to generate a webhook response has failed. If payload is provided, errors cannot be provided. Use 'warnings' instead. */
  InvalidWebhookResponse = 'INVALID_WEBHOOK_RESPONSE',
  /** The webhook request signature does not match the one calculated from the webhook body and the corresponding webhook secret. */
  InvalidWebhookSignature = 'INVALID_WEBHOOK_SIGNATURE',
  /** Error occurred while trying to fetch signing keys from the JWKS endpoint for the Tenant/Environment/Application. */
  JwksError = 'JWKS_ERROR',
  /** Passed JWT is not a Mosaic End-User Token. Cannot be verified. */
  JwtIsNotMosaicToken = 'JWT_IS_NOT_MOSAIC_TOKEN',
  /** Malformed access token received */
  MalformedToken = 'MALFORMED_TOKEN',
  /** The maximum number of acquisition profiles (%s) has been reached. */
  MaxAcquisitionProfilesReached = 'MAX_ACQUISITION_PROFILES_REACHED',
  /** Could not find the subject in the message. */
  MessageSubjectNotFound = 'MESSAGE_SUBJECT_NOT_FOUND',
  /** Missing required acquisition settings for %s storage. */
  MissingRequiredAcquisitionSettings = 'MISSING_REQUIRED_ACQUISITION_SETTINGS',
  /** Missing required param %s for storage Location API request */
  MissingRequiredParam = 'MISSING_REQUIRED_PARAM',
  /** Multiple acquisition profiles exist. Please specify an acquisition profile. */
  MultipleAcquisitionProfilesExist = 'MULTIPLE_ACQUISITION_PROFILES_EXIST',
  /** Multiple publishing profiles exist. Please specify a publishing profile. */
  MultiplePublishingProfilesExist = 'MULTIPLE_PUBLISHING_PROFILES_EXIST',
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
  /** The webhook message was generated too long ago (%s seconds) and should not be accepted anymore for security reasons. */
  OutdatedWebhookRequest = 'OUTDATED_WEBHOOK_REQUEST',
  /** The following profiles are not set up: %s */
  ProfilesNotSetUp = 'PROFILES_NOT_SET_UP',
  /** The publishing profile was not found. */
  PublishingProfileNotFound = 'PUBLISHING_PROFILE_NOT_FOUND',
  /** The publishing settings were not found. */
  PublishingSettingsNotFound = 'PUBLISHING_SETTINGS_NOT_FOUND',
  /** Unable to update Publishing Profile because the current storage provider is %s and not AMAZON_S3. */
  PublishingUpdateForNonAmazonS3Provider = 'PUBLISHING_UPDATE_FOR_NON_AMAZON_S3_PROVIDER',
  /** Unable to update Publishing Profile because the current storage provider is %s and not AZURE_BLOB. */
  PublishingUpdateForNonAzureBlobProvider = 'PUBLISHING_UPDATE_FOR_NON_AZURE_BLOB_PROVIDER',
  /** Unable to update Publishing Profile because the current storage provider is %s and not S3_COMPATIBLE. */
  PublishingUpdateForNonS3CompatibleProvider = 'PUBLISHING_UPDATE_FOR_NON_S3_COMPATIBLE_PROVIDER',
  /** Unable to set the general settings because no input values were provided. */
  SetSettingsInputIsEmpty = 'SET_SETTINGS_INPUT_IS_EMPTY',
  /** Could not find a matching signing key to verify the access token. The signing key used to create the token may have been revoked or the Tenant/Environment/Application configuration is erroneous. */
  SigningKeyNotFound = 'SIGNING_KEY_NOT_FOUND',
  /** The source location '%s' was not found in the acquisition profile '%s'. Please verify the path and the selected acquisition profile. */
  SourceLocationNotFoundInAcquisitionProfile = 'SOURCE_LOCATION_NOT_FOUND_IN_ACQUISITION_PROFILE',
  /** An application startup error has occurred. The actual message will have more information. */
  StartupError = 'STARTUP_ERROR',
  /** User is authenticated, but subject information was not found. Please contact Axinom Support. */
  SubjectInformationNotFound = 'SUBJECT_INFORMATION_NOT_FOUND',
  /** User is authenticated, but subject information was not found. Please contact Axinom Support. */
  SubjectNotFound = 'SUBJECT_NOT_FOUND',
  /** An unexpected error has happened. Please try again. */
  TransientError = 'TRANSIENT_ERROR',
  /** Unable to get the %s secret. Please contact Axinom Support. */
  UnableToGetSecret = 'UNABLE_TO_GET_SECRET',
  /** Unable to playback video because encoding is still in progress. */
  UnableToPlaybackStillEncodingVideo = 'UNABLE_TO_PLAYBACK_STILL_ENCODING_VIDEO',
  /** Unable to playback video because encoding has failed. */
  UnableToPlaybackVideoWithFailedEncoding = 'UNABLE_TO_PLAYBACK_VIDEO_WITH_FAILED_ENCODING',
  /** Unable to set the %s secret. Please contact Axinom Support. */
  UnableToSetSecret = 'UNABLE_TO_SET_SECRET',
  /** The subject has no permissions. */
  Unauthorized = 'UNAUTHORIZED',
  /** Unexpected null or undefined value received. */
  UnexpectedNullUndefined = 'UNEXPECTED_NULL_UNDEFINED',
  /** Unexpected response format from %s storage folders API. */
  UnexpectedResponseFormat = 'UNEXPECTED_RESPONSE_FORMAT',
  /** An unhandled database-related error has occurred. Please contact the service support. */
  UnhandledDatabaseError = 'UNHANDLED_DATABASE_ERROR',
  /** An unhandled error has occurred. Please contact the service support. */
  UnhandledError = 'UNHANDLED_ERROR',
  /** Attempt to create or update an element failed, as it would have resulted in a duplicate element. */
  UniqueConstraintError = 'UNIQUE_CONSTRAINT_ERROR',
  /** Unrecognized CMAF encoding [%s] found. */
  UnrecognizedCmafEncoding = 'UNRECOGNIZED_CMAF_ENCODING',
  /** Unsupported storage provider */
  UnsupportedStorageProvider = 'UNSUPPORTED_STORAGE_PROVIDER',
  /** Unable to update the profile because no update values were provided. */
  UpdateProfileInputIsEmpty = 'UPDATE_PROFILE_INPUT_IS_EMPTY',
  /** User is not authorized to access the operation. */
  UserNotAuthorized = 'USER_NOT_AUTHORIZED',
  /** The User service is not accessible. Please contact Axinom support. */
  UserServiceNotAccessible = 'USER_SERVICE_NOT_ACCESSIBLE',
  /** The %s is not an object. */
  ValueIsNotObject = 'VALUE_IS_NOT_OBJECT',
  /** The selected source video was already processed. */
  VideoAlreadyProcessed = 'VIDEO_ALREADY_PROCESSED',
  /** Unable to find the video to delete as both video ID and source location are not specified. */
  VideoIdentifiersNotProvided = 'VIDEO_IDENTIFIERS_NOT_PROVIDED',
  /** The video was not found. */
  VideoNotFound = 'VIDEO_NOT_FOUND',
  /** Unable to create a video because provided relative path is empty. */
  VideoRelativePathEmpty = 'VIDEO_RELATIVE_PATH_EMPTY',
  /** The Video Representation must have width and/or height defined. */
  VideoRepresentationDimensionsNotSet = 'VIDEO_REPRESENTATION_DIMENSIONS_NOT_SET',
  /** Could not find the watermark image(s) with ID %s. */
  WatermarkImageNotFound = 'WATERMARK_IMAGE_NOT_FOUND',
  /** The watermark profile was not found. */
  WatermarkProfileNotFound = 'WATERMARK_PROFILE_NOT_FOUND',
  /** Unable to make a request to the webhook URL '%s'. Please make sure that the endpoint is correct and reachable. */
  WebhookEndpointNotReachable = 'WEBHOOK_ENDPOINT_NOT_REACHABLE',
  /** Validation of webhook payload has failed. */
  WebhookPayloadValidationFailed = 'WEBHOOK_PAYLOAD_VALIDATION_FAILED',
  /** A webhook request has failed. A more concrete error message will be returned with this code. */
  WebhookRequestFailure = 'WEBHOOK_REQUEST_FAILURE',
  /** Generation of a webhook request has failed. */
  WebhookRequestGenerationFailed = 'WEBHOOK_REQUEST_GENERATION_FAILED',
  /** The webhook for the URL '%s' responded with error(s): %s */
  WebhookRespondedWithErrors = 'WEBHOOK_RESPONDED_WITH_ERRORS',
  /** The request to get the %s secret succeeded, but the secret was not found. Please contact Axinom Support. */
  WebhookSecretNotFound = 'WEBHOOK_SECRET_NOT_FOUND',
  /** The %s secret is not set. Please call an appropriate mutation to generate it. */
  WebhookSecretNotSet = 'WEBHOOK_SECRET_NOT_SET',
  /** Generation of a webhook signature has failed. */
  WebhookSignatureGenerationFailed = 'WEBHOOK_SIGNATURE_GENERATION_FAILED',
  /** Websocket not found in ExtendedGraphQLContext. This is a development time issue. A reference to the websocket must be included in Postgraphile build options. */
  WebsocketNotFound = 'WEBSOCKET_NOT_FOUND'
}

/** A filter to be used against Float fields. All fields are combined with a logical ‘and.’ */
export type FloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Float']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Float']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Float']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Float']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Float']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Float']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Float']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export enum ForensicWatermarking {
  /** Content Armor */
  ContentArmor = 'CONTENT_ARMOR'
}

/** A filter to be used against ForensicWatermarking fields. All fields are combined with a logical ‘and.’ */
export type ForensicWatermarkingFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<ForensicWatermarking>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<ForensicWatermarking>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<ForensicWatermarking>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<ForensicWatermarking>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<ForensicWatermarking>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<ForensicWatermarking>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<ForensicWatermarking>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<ForensicWatermarking>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<ForensicWatermarking>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<ForensicWatermarking>>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type GeneralSetting = {
  __typename?: 'GeneralSetting';
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  entitlementWebhookSecretIsSet: Scalars['Boolean']['output'];
  entitlementWebhookUrl?: Maybe<Scalars['String']['output']>;
  managedEntitlementServiceInUse: Scalars['Boolean']['output'];
  manifestWebhookSecretIsSet: Scalars['Boolean']['output'];
  manifestWebhookUrl?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
  videoPlaybackEnabled: Scalars['Boolean']['output'];
};

export type GenerateEntitlementWebhookSecretPayload = {
  __typename?: 'GenerateEntitlementWebhookSecretPayload';
  query?: Maybe<Query>;
  secret: Scalars['String']['output'];
};

export type GenerateManifestWebhookSecretPayload = {
  __typename?: 'GenerateManifestWebhookSecretPayload';
  query?: Maybe<Query>;
  secret: Scalars['String']['output'];
};

/** A `String` edge in the connection. */
export type GetVideosTagsValueEdge = {
  __typename?: 'GetVideosTagsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of `String` values. */
export type GetVideosTagsValuesConnection = {
  __typename?: 'GetVideosTagsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetVideosTagsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']['output']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
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

/** A filter to be used against Int List fields. All fields are combined with a logical ‘and.’ */
export type IntListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['Int']['input']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['Int']['input']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contained by the specified JSON. */
  containedBy?: InputMaybe<Scalars['JSON']['input']>;
  /** Contains the specified JSON. */
  contains?: InputMaybe<Scalars['JSON']['input']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified key. */
  containsKey?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['JSON']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['JSON']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['JSON']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['JSON']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['JSON']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['JSON']['input']>>;
};

export enum ManifestVersion {
  /** V1 */
  V1 = 'V1',
  /** V2 (Beta) */
  V2 = 'V2'
}

/** A filter to be used against ManifestVersion fields. All fields are combined with a logical ‘and.’ */
export type ManifestVersionFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<ManifestVersion>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<ManifestVersion>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<ManifestVersion>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<ManifestVersion>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<ManifestVersion>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<ManifestVersion>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<ManifestVersion>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<ManifestVersion>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<ManifestVersion>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<ManifestVersion>>;
};

export enum MediaDetection {
  /** File Naming Convention */
  Convention = 'CONVENTION',
  /** Regex */
  Regex = 'REGEX'
}

/** A filter to be used against MediaDetection fields. All fields are combined with a logical ‘and.’ */
export type MediaDetectionFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<MediaDetection>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<MediaDetection>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<MediaDetection>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<MediaDetection>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<MediaDetection>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<MediaDetection>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<MediaDetection>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<MediaDetection>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<MediaDetection>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<MediaDetection>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  archiveVideos?: Maybe<BulkMutationUuidPayload>;
  checkAcquisitionStorageConnection: CheckStorageConnectionPayload;
  checkPublishingStorageConnection: CheckStorageConnectionPayload;
  /** Creates a single `CuePoint`. */
  createCuePoint?: Maybe<CreateCuePointPayload>;
  /** Creates multiple `CuePoint`s for a single `Video`. */
  createCuePoints?: Maybe<CreateCuePointsPayload>;
  /** Creates a single custom `Video`. */
  createCustomVideo?: Maybe<CreateCustomVideoPayload>;
  /** Creates a single `VideoStream`. */
  createCustomVideoStream?: Maybe<CreateVideoStreamPayload>;
  /** Creates a single `EncodingAudioRepresentation`. */
  createEncodingAudioRepresentation?: Maybe<CreateEncodingAudioRepresentationPayload>;
  /** Creates a single `EncodingDrmProfile`. */
  createEncodingDrmProfile?: Maybe<CreateEncodingDrmProfilePayload>;
  /** Creates a single `EncodingEmbeddedCaptionChannel`. */
  createEncodingEmbeddedCaptionChannel?: Maybe<CreateEncodingEmbeddedCaptionChannelPayload>;
  /** Creates a single `EncodingProcessingProfile`. */
  createEncodingProcessingProfile?: Maybe<CreateEncodingProcessingProfilePayload>;
  /** Creates a single `EncodingVideoRepresentation`. */
  createEncodingVideoRepresentation?: Maybe<CreateEncodingVideoRepresentationPayload>;
  /** Creates a single `EncodingWatermarkProfile`. */
  createEncodingWatermarkProfile?: Maybe<CreateEncodingWatermarkProfilePayload>;
  /** Creates a single `VideosTag`. */
  createVideosTag?: Maybe<CreateVideosTagPayload>;
  /** Deletes a single `CuePoint` using a unique key. */
  deleteCuePoint?: Maybe<DeleteCuePointPayload>;
  /** Deletes a single `VideoStream` using a unique key. */
  deleteCustomVideoStream?: Maybe<DeleteVideoStreamPayload>;
  /** Deletes a single `EncodingAcquisitionProfile` using a unique key. */
  deleteEncodingAcquisitionProfile?: Maybe<DeleteEncodingAcquisitionProfilePayload>;
  /** Deletes a single `EncodingAudioRepresentation` using a unique key. */
  deleteEncodingAudioRepresentation?: Maybe<DeleteEncodingAudioRepresentationPayload>;
  /** Deletes a single `EncodingEmbeddedCaptionChannel` using a unique key. */
  deleteEncodingEmbeddedCaptionChannel?: Maybe<DeleteEncodingEmbeddedCaptionChannelPayload>;
  /** Deletes a single `EncodingProcessingProfile` using a unique key. */
  deleteEncodingProcessingProfile?: Maybe<DeleteEncodingProcessingProfilePayload>;
  /** Deletes a single `EncodingPublishingProfile` using a unique key. */
  deleteEncodingPublishingProfile?: Maybe<DeleteEncodingPublishingProfilePayload>;
  /** Deletes a single `EncodingVideoRepresentation` using a unique key. */
  deleteEncodingVideoRepresentation?: Maybe<DeleteEncodingVideoRepresentationPayload>;
  /** Deletes a single `EncodingWatermarkProfile` using a unique key. */
  deleteEncodingWatermarkProfile?: Maybe<DeleteEncodingWatermarkProfilePayload>;
  deleteEntitlementWebhookConfiguration: DeleteEntitlementWebhookConfigurationPayload;
  deleteManifestWebhookConfiguration: DeleteManifestWebhookConfigurationPayload;
  /** Deletes a single `Video` using a unique key. */
  deleteVideo?: Maybe<DeleteVideoPayload>;
  /** Deletes a single `VideosTag` using a unique key. */
  deleteVideosTag?: Maybe<DeleteVideosTagPayload>;
  encodeVideo?: Maybe<EncodeVideoPayload>;
  generateEntitlementWebhookSecret: GenerateEntitlementWebhookSecretPayload;
  generateManifestWebhookSecret: GenerateManifestWebhookSecretPayload;
  retryEncodeVideo?: Maybe<RetryEncodeVideoPayload>;
  setAmazonS3AcquisitionProfile: EncodingAcquisitionProfile;
  setAmazonS3PublishingProfile: EncodingPublishingProfile;
  setAzureBlobAcquisitionProfile: EncodingAcquisitionProfile;
  setAzureBlobPublishingProfile: EncodingPublishingProfile;
  setGeneralSettings: GeneralSetting;
  setHostingAzureAcquisitionProfile: EncodingAcquisitionProfile;
  setHostingAzurePublishingProfile: EncodingPublishingProfile;
  setS3CompatibleAcquisitionProfile: EncodingAcquisitionProfile;
  setS3CompatiblePublishingProfile: EncodingPublishingProfile;
  startVideosDeletion?: Maybe<BulkMutationUuidPayload>;
  unarchiveVideos?: Maybe<BulkMutationUuidPayload>;
  updateAmazonS3AcquisitionProfile: EncodingAcquisitionProfile;
  updateAmazonS3PublishingProfile: EncodingPublishingProfile;
  updateAzureBlobAcquisitionProfile: EncodingAcquisitionProfile;
  updateAzureBlobPublishingProfile: EncodingPublishingProfile;
  /** Updates a single `CuePoint` using a unique key and a patch. */
  updateCuePoint?: Maybe<UpdateCuePointPayload>;
  /** Updates a single custom `Video` using a unique key and a patch. */
  updateCustomVideo?: Maybe<UpdateCustomVideoPayload>;
  /** Updates a single `VideoStream` using a unique key and a patch. */
  updateCustomVideoStream?: Maybe<UpdateVideoStreamPayload>;
  /** Updates a single `EncodingDrmProfile` using a unique key and a patch. */
  updateEncodingDrmProfile?: Maybe<UpdateEncodingDrmProfilePayload>;
  /** Updates a single `EncodingEmbeddedCaptionChannel` using a unique key and a patch. */
  updateEncodingEmbeddedCaptionChannel?: Maybe<UpdateEncodingEmbeddedCaptionChannelPayload>;
  /** Updates a single `EncodingProcessingProfile` using a unique key and a patch. */
  updateEncodingProcessingProfile?: Maybe<UpdateEncodingProcessingProfilePayload>;
  /** Updates a single `EncodingVideoRepresentation` using a unique key and a patch. */
  updateEncodingVideoRepresentation?: Maybe<UpdateEncodingVideoRepresentationPayload>;
  /** Updates a single `EncodingWatermarkProfile` using a unique key and a patch. */
  updateEncodingWatermarkProfile?: Maybe<UpdateEncodingWatermarkProfilePayload>;
  updateHostingAzureAcquisitionProfile: EncodingAcquisitionProfile;
  updateHostingAzurePublishingProfile: EncodingPublishingProfile;
  updateS3CompatibleAcquisitionProfile: EncodingAcquisitionProfile;
  updateS3CompatiblePublishingProfile: EncodingPublishingProfile;
  /** Updates a single `Video` using a unique key and a patch. */
  updateVideo?: Maybe<UpdateVideoPayload>;
  /** Updates a single `VideosTag` using a unique key and a patch. */
  updateVideosTag?: Maybe<UpdateVideosTagPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationArchiveVideosArgs = {
  filter?: InputMaybe<VideoFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCheckAcquisitionStorageConnectionArgs = {
  input: CheckAcquisitionStorageConnectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCheckPublishingStorageConnectionArgs = {
  input: CheckPublishingStorageConnectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCuePointArgs = {
  input: CreateCuePointInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCuePointsArgs = {
  input: CreateCuePointsInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCustomVideoArgs = {
  input: CreateCustomVideoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCustomVideoStreamArgs = {
  input: CreateVideoStreamInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEncodingAudioRepresentationArgs = {
  input: CreateEncodingAudioRepresentationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEncodingDrmProfileArgs = {
  input: CreateEncodingDrmProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEncodingEmbeddedCaptionChannelArgs = {
  input: CreateEncodingEmbeddedCaptionChannelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEncodingProcessingProfileArgs = {
  input: CreateEncodingProcessingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEncodingVideoRepresentationArgs = {
  input: CreateEncodingVideoRepresentationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEncodingWatermarkProfileArgs = {
  input: CreateEncodingWatermarkProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateVideosTagArgs = {
  input: CreateVideosTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCuePointArgs = {
  input: DeleteCuePointInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCustomVideoStreamArgs = {
  input: DeleteVideoStreamInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEncodingAcquisitionProfileArgs = {
  input: DeleteEncodingAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEncodingAudioRepresentationArgs = {
  input: DeleteEncodingAudioRepresentationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEncodingEmbeddedCaptionChannelArgs = {
  input: DeleteEncodingEmbeddedCaptionChannelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEncodingProcessingProfileArgs = {
  input: DeleteEncodingProcessingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEncodingPublishingProfileArgs = {
  input: DeleteEncodingPublishingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEncodingVideoRepresentationArgs = {
  input: DeleteEncodingVideoRepresentationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEncodingWatermarkProfileArgs = {
  input: DeleteEncodingWatermarkProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteVideoArgs = {
  input: DeleteVideoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteVideosTagArgs = {
  input: DeleteVideosTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationEncodeVideoArgs = {
  input: EncodeVideoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationRetryEncodeVideoArgs = {
  input: RetryEncodeVideoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetAmazonS3AcquisitionProfileArgs = {
  input: SetAmazonS3AcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetAmazonS3PublishingProfileArgs = {
  input: SetAmazonS3PublishingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetAzureBlobAcquisitionProfileArgs = {
  input: SetAzureBlobAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetAzureBlobPublishingProfileArgs = {
  input: SetAzureBlobPublishingProfileInput;
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
export type MutationSetHostingAzurePublishingProfileArgs = {
  input: SetHostingAzurePublishingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetS3CompatibleAcquisitionProfileArgs = {
  input: SetS3CompatibleAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetS3CompatiblePublishingProfileArgs = {
  input: SetS3CompatiblePublishingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationStartVideosDeletionArgs = {
  filter?: InputMaybe<VideoFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnarchiveVideosArgs = {
  filter?: InputMaybe<VideoFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAmazonS3AcquisitionProfileArgs = {
  input: UpdateAmazonS3AcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAmazonS3PublishingProfileArgs = {
  input: UpdateAmazonS3PublishingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAzureBlobAcquisitionProfileArgs = {
  input: UpdateAzureBlobAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAzureBlobPublishingProfileArgs = {
  input: UpdateAzureBlobPublishingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCuePointArgs = {
  input: UpdateCuePointInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCustomVideoArgs = {
  input: UpdateCustomVideoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCustomVideoStreamArgs = {
  input: UpdateVideoStreamInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEncodingDrmProfileArgs = {
  input: UpdateEncodingDrmProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEncodingEmbeddedCaptionChannelArgs = {
  input: UpdateEncodingEmbeddedCaptionChannelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEncodingProcessingProfileArgs = {
  input: UpdateEncodingProcessingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEncodingVideoRepresentationArgs = {
  input: UpdateEncodingVideoRepresentationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEncodingWatermarkProfileArgs = {
  input: UpdateEncodingWatermarkProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateHostingAzureAcquisitionProfileArgs = {
  input: UpdateHostingAzureAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateHostingAzurePublishingProfileArgs = {
  input: UpdateHostingAzurePublishingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateS3CompatibleAcquisitionProfileArgs = {
  input: UpdateS3CompatibleAcquisitionProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateS3CompatiblePublishingProfileArgs = {
  input: UpdateS3CompatiblePublishingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVideoArgs = {
  input: UpdateVideoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVideosTagArgs = {
  input: UpdateVideosTagInput;
};

export enum OptimizeFor {
  /** Balance */
  Balance = 'BALANCE',
  /** Quality */
  Quality = 'QUALITY',
  /** Speed */
  Speed = 'SPEED'
}

/** A filter to be used against OptimizeFor fields. All fields are combined with a logical ‘and.’ */
export type OptimizeForFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<OptimizeFor>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<OptimizeFor>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<OptimizeFor>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<OptimizeFor>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<OptimizeFor>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<OptimizeFor>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<OptimizeFor>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<OptimizeFor>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<OptimizeFor>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<OptimizeFor>>;
};

export enum OutputFormat {
  /** CMAF */
  Cmaf = 'CMAF',
  /** DASH */
  Dash = 'DASH',
  /** DASH & HLS */
  DashHls = 'DASH_HLS',
  /** DASH On Demand */
  DashOnDemand = 'DASH_ON_DEMAND',
  /** HLS */
  Hls = 'HLS',
  /** MPEG-2 TS */
  Mpeg2Ts = 'MPEG2_TS'
}

/** A filter to be used against OutputFormat fields. All fields are combined with a logical ‘and.’ */
export type OutputFormatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<OutputFormat>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<OutputFormat>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<OutputFormat>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<OutputFormat>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<OutputFormat>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<OutputFormat>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<OutputFormat>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<OutputFormat>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<OutputFormat>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<OutputFormat>>;
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

export type PlaybackVideoInput = {
  videoId: Scalars['UUID']['input'];
};

export type PlaybackVideoPayload = {
  __typename?: 'PlaybackVideoPayload';
  dashManifestUrl?: Maybe<Scalars['String']['output']>;
  entitlementMessageJwt?: Maybe<Scalars['String']['output']>;
  fairplayLicenseServiceUrl?: Maybe<Scalars['String']['output']>;
  fairplayStreamingCertificateUrl?: Maybe<Scalars['String']['output']>;
  hlsManifestUrl?: Maybe<Scalars['String']['output']>;
  playreadyLicenseServiceUrl?: Maybe<Scalars['String']['output']>;
  thumbnailsVttUrl?: Maybe<Scalars['String']['output']>;
  widevineLicenseServiceUrl?: Maybe<Scalars['String']['output']>;
};

export enum PreviewStatus {
  /** Approved */
  Approved = 'APPROVED',
  /** Not Approved */
  NotApproved = 'NOT_APPROVED',
  /** Not Previewed */
  NotPreviewed = 'NOT_PREVIEWED'
}

/** A filter to be used against PreviewStatus fields. All fields are combined with a logical ‘and.’ */
export type PreviewStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<PreviewStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<PreviewStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<PreviewStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<PreviewStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<PreviewStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<PreviewStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<PreviewStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<PreviewStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<PreviewStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<PreviewStatus>>;
};

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  checkSourceLocationExists?: Maybe<CheckSourceLocationPayload>;
  cuePoint?: Maybe<CuePoint>;
  /** Reads and enables pagination through a set of `CuePoint`. */
  cuePoints?: Maybe<CuePointsConnection>;
  cuePointType?: Maybe<CuePointType>;
  /** Reads and enables pagination through a set of `CuePointType`. */
  cuePointTypes?: Maybe<CuePointTypesConnection>;
  encodingAcquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  /** Reads and enables pagination through a set of `EncodingAcquisitionProfile`. */
  encodingAcquisitionProfiles?: Maybe<EncodingAcquisitionProfilesConnection>;
  encodingAudioRepresentation?: Maybe<EncodingAudioRepresentation>;
  /** Reads and enables pagination through a set of `EncodingAudioRepresentation`. */
  encodingAudioRepresentations?: Maybe<EncodingAudioRepresentationsConnection>;
  encodingDrmProfile?: Maybe<EncodingDrmProfile>;
  /** Reads and enables pagination through a set of `EncodingDrmProfile`. */
  encodingDrmProfiles?: Maybe<EncodingDrmProfilesConnection>;
  encodingEmbeddedCaptionChannel?: Maybe<EncodingEmbeddedCaptionChannel>;
  /** Reads and enables pagination through a set of `EncodingEmbeddedCaptionChannel`. */
  encodingEmbeddedCaptionChannels?: Maybe<EncodingEmbeddedCaptionChannelsConnection>;
  /** Reads and enables pagination through a set of `EncodingHistory`. */
  encodingHistories?: Maybe<EncodingHistoriesConnection>;
  encodingHistory?: Maybe<EncodingHistory>;
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** Reads and enables pagination through a set of `EncodingProcessingProfile`. */
  encodingProcessingProfiles?: Maybe<EncodingProcessingProfilesConnection>;
  encodingPublishingProfile?: Maybe<EncodingPublishingProfile>;
  /** Reads and enables pagination through a set of `EncodingPublishingProfile`. */
  encodingPublishingProfiles?: Maybe<EncodingPublishingProfilesConnection>;
  encodingVideoRepresentation?: Maybe<EncodingVideoRepresentation>;
  /** Reads and enables pagination through a set of `EncodingVideoRepresentation`. */
  encodingVideoRepresentations?: Maybe<EncodingVideoRepresentationsConnection>;
  encodingWatermarkProfile?: Maybe<EncodingWatermarkProfile>;
  /** Reads and enables pagination through a set of `EncodingWatermarkProfile`. */
  encodingWatermarkProfiles?: Maybe<EncodingWatermarkProfilesConnection>;
  getGeneralSettings?: Maybe<GeneralSetting>;
  getVideosTagsValues?: Maybe<GetVideosTagsValuesConnection>;
  playbackVideo: PlaybackVideoPayload;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  sourceVideos?: Maybe<SourceVideoPayload>;
  video?: Maybe<Video>;
  /** Reads and enables pagination through a set of `Video`. */
  videos?: Maybe<VideosConnection>;
  videosTag?: Maybe<VideosTag>;
  /** Reads and enables pagination through a set of `VideosTag`. */
  videosTags?: Maybe<VideosTagsConnection>;
  videoStream?: Maybe<VideoStream>;
  /** Reads and enables pagination through a set of `VideoStream`. */
  videoStreams?: Maybe<VideoStreamsConnection>;
  videoWatermarkProfile?: Maybe<VideoWatermarkProfile>;
  /** Reads and enables pagination through a set of `VideoWatermarkProfile`. */
  videoWatermarkProfiles?: Maybe<VideoWatermarkProfilesConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCheckSourceLocationExistsArgs = {
  input: CheckSourceLocationInput;
};


/** The root query type which gives access points into the data universe. */
export type QueryCuePointArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CuePointCondition>;
  filter?: InputMaybe<CuePointFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CuePointsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCuePointTypeArgs = {
  key: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCuePointTypesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CuePointTypeCondition>;
  filter?: InputMaybe<CuePointTypeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CuePointTypesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingAcquisitionProfileArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingAcquisitionProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingAcquisitionProfileCondition>;
  filter?: InputMaybe<EncodingAcquisitionProfileFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingAcquisitionProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingAudioRepresentationArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingAudioRepresentationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingAudioRepresentationCondition>;
  filter?: InputMaybe<EncodingAudioRepresentationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingAudioRepresentationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingDrmProfileArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingDrmProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingDrmProfileCondition>;
  filter?: InputMaybe<EncodingDrmProfileFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingDrmProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingEmbeddedCaptionChannelArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingEmbeddedCaptionChannelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingEmbeddedCaptionChannelCondition>;
  filter?: InputMaybe<EncodingEmbeddedCaptionChannelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingEmbeddedCaptionChannelsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingHistoriesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingHistoryCondition>;
  filter?: InputMaybe<EncodingHistoryFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingHistoriesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingHistoryArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingProcessingProfileArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingProcessingProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingProcessingProfileCondition>;
  filter?: InputMaybe<EncodingProcessingProfileFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingProcessingProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingPublishingProfileArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingPublishingProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingPublishingProfileCondition>;
  filter?: InputMaybe<EncodingPublishingProfileFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingPublishingProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingVideoRepresentationArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingVideoRepresentationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingVideoRepresentationCondition>;
  filter?: InputMaybe<EncodingVideoRepresentationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingVideoRepresentationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingWatermarkProfileArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingWatermarkProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingWatermarkProfileCondition>;
  filter?: InputMaybe<EncodingWatermarkProfileFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingWatermarkProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetVideosTagsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPlaybackVideoArgs = {
  input: PlaybackVideoInput;
};


/** The root query type which gives access points into the data universe. */
export type QuerySourceVideosArgs = {
  input?: InputMaybe<SourceVideoInput>;
};


/** The root query type which gives access points into the data universe. */
export type QueryVideoArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVideosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<VideoCondition>;
  filter?: InputMaybe<VideoFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<VideosOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryVideosTagArgs = {
  name: Scalars['String']['input'];
  videoId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVideosTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<VideosTagCondition>;
  filter?: InputMaybe<VideosTagFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<VideosTagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryVideoStreamArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVideoStreamsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<VideoStreamCondition>;
  filter?: InputMaybe<VideoStreamFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<VideoStreamsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryVideoWatermarkProfileArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVideoWatermarkProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<VideoWatermarkProfileCondition>;
  filter?: InputMaybe<VideoWatermarkProfileFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<VideoWatermarkProfilesOrderBy>>;
};

export type RetryEncodeVideoInput = {
  processingProfileId: Scalars['UUID']['input'];
  videoId: Scalars['UUID']['input'];
  watermarkProfileIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

export type RetryEncodeVideoPayload = {
  __typename?: 'RetryEncodeVideoPayload';
  query?: Maybe<Query>;
  video?: Maybe<Video>;
};

export enum SegmentFormat {
  /** Automatic */
  Automatic = 'AUTOMATIC',
  /** Byte Range */
  ByteRange = 'BYTE_RANGE',
  /** File */
  File = 'FILE'
}

/** A filter to be used against SegmentFormat fields. All fields are combined with a logical ‘and.’ */
export type SegmentFormatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<SegmentFormat>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<SegmentFormat>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<SegmentFormat>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<SegmentFormat>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<SegmentFormat>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<SegmentFormat>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<SegmentFormat>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<SegmentFormat>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<SegmentFormat>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<SegmentFormat>>;
};

export type SetAmazonS3AcquisitionProfileInput = {
  accessKeyId: Scalars['String']['input'];
  bucketName: Scalars['String']['input'];
  managementSecretAccessKey?: InputMaybe<Scalars['String']['input']>;
  region: AmazonS3Region;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  secretAccessKeyEncrypted: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SetAmazonS3PublishingProfileInput = {
  accessKeyId: Scalars['String']['input'];
  bucketName: Scalars['String']['input'];
  region: AmazonS3Region;
  secretAccessKeyEncrypted: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SetAzureBlobAcquisitionProfileInput = {
  accountKeyEncrypted: Scalars['String']['input'];
  accountName: Scalars['String']['input'];
  containerName: Scalars['String']['input'];
  managementSasToken?: InputMaybe<Scalars['String']['input']>;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type SetAzureBlobPublishingProfileInput = {
  accountKeyEncrypted: Scalars['String']['input'];
  accountName: Scalars['String']['input'];
  containerName: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SetGeneralSettingsInput = {
  entitlementWebhookUrl?: InputMaybe<Scalars['String']['input']>;
  managedEntitlementServiceInUse?: InputMaybe<Scalars['Boolean']['input']>;
  manifestWebhookUrl?: InputMaybe<Scalars['String']['input']>;
  videoPlaybackEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SetHostingAzureAcquisitionProfileInput = {
  accountName: Scalars['String']['input'];
  containerName: Scalars['String']['input'];
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type SetHostingAzurePublishingProfileInput = {
  accountName: Scalars['String']['input'];
  containerName: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SetS3CompatibleAcquisitionProfileInput = {
  accessKeyId: Scalars['String']['input'];
  bucketName: Scalars['String']['input'];
  managementSecretAccessKey?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  s3Endpoint: Scalars['String']['input'];
  secretAccessKeyEncrypted: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SetS3CompatiblePublishingProfileInput = {
  accessKeyId: Scalars['String']['input'];
  bucketName: Scalars['String']['input'];
  region?: InputMaybe<Scalars['String']['input']>;
  s3Endpoint: Scalars['String']['input'];
  secretAccessKeyEncrypted: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SourceFile = {
  __typename?: 'SourceFile';
  path: Scalars['String']['output'];
  sizeInBytes?: Maybe<Scalars['BigInt']['output']>;
};

export type SourceVideo = {
  __typename?: 'SourceVideo';
  isEncoded: Scalars['Boolean']['output'];
  path: Scalars['String']['output'];
};

export type SourceVideoFilter = {
  path?: InputMaybe<SourceVideoStringFilter>;
};

export type SourceVideoInput = {
  acquisitionProfileId?: InputMaybe<Scalars['UUID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SourceVideoFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type SourceVideoPageInfo = {
  __typename?: 'SourceVideoPageInfo';
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type SourceVideoPayload = {
  __typename?: 'SourceVideoPayload';
  files: Array<Maybe<SourceFile>>;
  nodes: Array<Maybe<SourceVideo>>;
  pageInfo?: Maybe<SourceVideoPageInfo>;
  query?: Maybe<Query>;
};

export type SourceVideoStringFilter = {
  startsWith?: InputMaybe<Scalars['String']['input']>;
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

/** A filter to be used against String List fields. All fields are combined with a logical ‘and.’ */
export type StringListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type Subscription = {
  __typename?: 'Subscription';
  /** Triggered when a Video is mutated (insert, update or delete).  */
  videoMutated?: Maybe<VideoSubscriptionPayload>;
};

export enum SubtitleContainer {
  /** Default */
  Default = 'DEFAULT',
  /** Plain (WebVTT) */
  Plain = 'PLAIN',
  /** Wrapped (fMP4) */
  Wrapped = 'WRAPPED'
}

/** A filter to be used against SubtitleContainer fields. All fields are combined with a logical ‘and.’ */
export type SubtitleContainerFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<SubtitleContainer>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<SubtitleContainer>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<SubtitleContainer>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<SubtitleContainer>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<SubtitleContainer>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<SubtitleContainer>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<SubtitleContainer>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<SubtitleContainer>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<SubtitleContainer>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<SubtitleContainer>>;
};

export enum TarMode {
  /** Flat Tar */
  FlatTar = 'FLAT_TAR',
  /** None */
  None = 'NONE',
  /** Single Tar */
  SingleTar = 'SINGLE_TAR',
  /** Split Tar */
  SplitTar = 'SPLIT_TAR',
  /** Tar */
  Tar = 'TAR'
}

/** A filter to be used against TarMode fields. All fields are combined with a logical ‘and.’ */
export type TarModeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<TarMode>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<TarMode>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<TarMode>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<TarMode>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<TarMode>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<TarMode>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<TarMode>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<TarMode>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<TarMode>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<TarMode>>;
};

export type UpdateAmazonS3AcquisitionProfileInput = {
  accessKeyId?: InputMaybe<Scalars['String']['input']>;
  bucketName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  managementSecretAccessKey?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<AmazonS3Region>;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  secretAccessKeyEncrypted?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAmazonS3PublishingProfileInput = {
  accessKeyId?: InputMaybe<Scalars['String']['input']>;
  bucketName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  region?: InputMaybe<AmazonS3Region>;
  secretAccessKeyEncrypted?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAzureBlobAcquisitionProfileInput = {
  accountKeyEncrypted?: InputMaybe<Scalars['String']['input']>;
  accountName?: InputMaybe<Scalars['String']['input']>;
  containerName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  managementSasToken?: InputMaybe<Scalars['String']['input']>;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAzureBlobPublishingProfileInput = {
  accountKeyEncrypted?: InputMaybe<Scalars['String']['input']>;
  accountName?: InputMaybe<Scalars['String']['input']>;
  containerName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/**
 * All input for the `updateCuePoint` mutation.
 * @permissions: VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type UpdateCuePointInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `CuePoint` being updated. */
  patch: CuePointPatch;
};

/** The output of our update `CuePoint` mutation. */
export type UpdateCuePointPayload = {
  __typename?: 'UpdateCuePointPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `CuePoint` that was updated by this mutation. */
  cuePoint?: Maybe<CuePoint>;
  /** An edge for our `CuePoint`. May be used by Relay 1. */
  cuePointEdge?: Maybe<CuePointsEdge>;
  /** Reads a single `CuePointType` that is related to this `CuePoint`. */
  cuePointType?: Maybe<CuePointType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Video` that is related to this `CuePoint`. */
  video?: Maybe<Video>;
};


/** The output of our update `CuePoint` mutation. */
export type UpdateCuePointPayloadCuePointEdgeArgs = {
  orderBy?: InputMaybe<Array<CuePointsOrderBy>>;
};

export type UpdateCustomVideoInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the custom `Video` being updated. */
  patch: CustomVideoPatch;
};

export type UpdateCustomVideoPayload = {
  __typename?: 'UpdateCustomVideoPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The custom `Video` that was updated by this mutation. */
  video?: Maybe<Video>;
};

/**
 * All input for the `updateEncodingDrmProfile` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type UpdateEncodingDrmProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `EncodingDrmProfile` being updated. */
  patch: EncodingDrmProfilePatch;
};

/** The output of our update `EncodingDrmProfile` mutation. */
export type UpdateEncodingDrmProfilePayload = {
  __typename?: 'UpdateEncodingDrmProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingDrmProfile` that was updated by this mutation. */
  encodingDrmProfile?: Maybe<EncodingDrmProfile>;
  /** An edge for our `EncodingDrmProfile`. May be used by Relay 1. */
  encodingDrmProfileEdge?: Maybe<EncodingDrmProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EncodingDrmProfile` mutation. */
export type UpdateEncodingDrmProfilePayloadEncodingDrmProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingDrmProfilesOrderBy>>;
};

/**
 * All input for the `updateEncodingEmbeddedCaptionChannel` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type UpdateEncodingEmbeddedCaptionChannelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `EncodingEmbeddedCaptionChannel` being updated. */
  patch: EncodingEmbeddedCaptionChannelPatch;
};

/** The output of our update `EncodingEmbeddedCaptionChannel` mutation. */
export type UpdateEncodingEmbeddedCaptionChannelPayload = {
  __typename?: 'UpdateEncodingEmbeddedCaptionChannelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingEmbeddedCaptionChannel` that was updated by this mutation. */
  encodingEmbeddedCaptionChannel?: Maybe<EncodingEmbeddedCaptionChannel>;
  /** An edge for our `EncodingEmbeddedCaptionChannel`. May be used by Relay 1. */
  encodingEmbeddedCaptionChannelEdge?: Maybe<EncodingEmbeddedCaptionChannelsEdge>;
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingEmbeddedCaptionChannel`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EncodingEmbeddedCaptionChannel` mutation. */
export type UpdateEncodingEmbeddedCaptionChannelPayloadEncodingEmbeddedCaptionChannelEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingEmbeddedCaptionChannelsOrderBy>>;
};

/**
 * All input for the `updateEncodingProcessingProfile` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type UpdateEncodingProcessingProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `EncodingProcessingProfile` being updated. */
  patch: EncodingProcessingProfilePatch;
};

/** The output of our update `EncodingProcessingProfile` mutation. */
export type UpdateEncodingProcessingProfilePayload = {
  __typename?: 'UpdateEncodingProcessingProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingProcessingProfile` that was updated by this mutation. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** An edge for our `EncodingProcessingProfile`. May be used by Relay 1. */
  encodingProcessingProfileEdge?: Maybe<EncodingProcessingProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EncodingProcessingProfile` mutation. */
export type UpdateEncodingProcessingProfilePayloadEncodingProcessingProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingProcessingProfilesOrderBy>>;
};

/**
 * All input for the `updateEncodingVideoRepresentation` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type UpdateEncodingVideoRepresentationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `EncodingVideoRepresentation` being updated. */
  patch: EncodingVideoRepresentationPatch;
};

/** The output of our update `EncodingVideoRepresentation` mutation. */
export type UpdateEncodingVideoRepresentationPayload = {
  __typename?: 'UpdateEncodingVideoRepresentationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingVideoRepresentation`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  /** The `EncodingVideoRepresentation` that was updated by this mutation. */
  encodingVideoRepresentation?: Maybe<EncodingVideoRepresentation>;
  /** An edge for our `EncodingVideoRepresentation`. May be used by Relay 1. */
  encodingVideoRepresentationEdge?: Maybe<EncodingVideoRepresentationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EncodingVideoRepresentation` mutation. */
export type UpdateEncodingVideoRepresentationPayloadEncodingVideoRepresentationEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingVideoRepresentationsOrderBy>>;
};

/**
 * All input for the `updateEncodingWatermarkProfile` mutation.
 * @permissions: ADMIN
 */
export type UpdateEncodingWatermarkProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `EncodingWatermarkProfile` being updated. */
  patch: EncodingWatermarkProfilePatch;
};

/** The output of our update `EncodingWatermarkProfile` mutation. */
export type UpdateEncodingWatermarkProfilePayload = {
  __typename?: 'UpdateEncodingWatermarkProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `EncodingWatermarkProfile` that was updated by this mutation. */
  encodingWatermarkProfile?: Maybe<EncodingWatermarkProfile>;
  /** An edge for our `EncodingWatermarkProfile`. May be used by Relay 1. */
  encodingWatermarkProfileEdge?: Maybe<EncodingWatermarkProfilesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EncodingWatermarkProfile` mutation. */
export type UpdateEncodingWatermarkProfilePayloadEncodingWatermarkProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<EncodingWatermarkProfilesOrderBy>>;
};

export type UpdateHostingAzureAcquisitionProfileInput = {
  accountName?: InputMaybe<Scalars['String']['input']>;
  containerName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateHostingAzurePublishingProfileInput = {
  accountName?: InputMaybe<Scalars['String']['input']>;
  containerName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateS3CompatibleAcquisitionProfileInput = {
  accessKeyId?: InputMaybe<Scalars['String']['input']>;
  bucketName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  managementSecretAccessKey?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  rootFolderPath?: InputMaybe<Scalars['String']['input']>;
  s3Endpoint?: InputMaybe<Scalars['String']['input']>;
  secretAccessKeyEncrypted?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateS3CompatiblePublishingProfileInput = {
  accessKeyId?: InputMaybe<Scalars['String']['input']>;
  bucketName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  s3Endpoint?: InputMaybe<Scalars['String']['input']>;
  secretAccessKeyEncrypted?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/**
 * All input for the `updateVideo` mutation.
 * @permissions: VIDEOS_ENCODE,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,ADMIN
 */
export type UpdateVideoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `Video` being updated. */
  patch: VideoPatch;
};

/** The output of our update `Video` mutation. */
export type UpdateVideoPayload = {
  __typename?: 'UpdateVideoPayload';
  /** Reads a single `EncodingAcquisitionProfile` that is related to this `Video`. */
  acquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `EncodingProcessingProfile` that is related to this `Video`. */
  processingProfile?: Maybe<EncodingProcessingProfile>;
  /** Reads a single `EncodingPublishingProfile` that is related to this `Video`. */
  publishingProfile?: Maybe<EncodingPublishingProfile>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Video` that was updated by this mutation. */
  video?: Maybe<Video>;
  /** An edge for our `Video`. May be used by Relay 1. */
  videoEdge?: Maybe<VideosEdge>;
};


/** The output of our update `Video` mutation. */
export type UpdateVideoPayloadVideoEdgeArgs = {
  orderBy?: InputMaybe<Array<VideosOrderBy>>;
};

/**
 * All input for the `updateVideosTag` mutation.
 * @permissions: VIDEOS_ENCODE,VIDEOS_EDIT,ADMIN
 */
export type UpdateVideosTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** @notEmpty() */
  name: Scalars['String']['input'];
  /** An object where the defined keys will be set on the `VideosTag` being updated. */
  patch: VideosTagPatch;
  videoId: Scalars['UUID']['input'];
};

/** The output of our update `VideosTag` mutation. */
export type UpdateVideosTagPayload = {
  __typename?: 'UpdateVideosTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Video` that is related to this `VideosTag`. */
  video?: Maybe<Video>;
  /** The `VideosTag` that was updated by this mutation. */
  videosTag?: Maybe<VideosTag>;
  /** An edge for our `VideosTag`. May be used by Relay 1. */
  videosTagEdge?: Maybe<VideosTagsEdge>;
};


/** The output of our update `VideosTag` mutation. */
export type UpdateVideosTagPayloadVideosTagEdgeArgs = {
  orderBy?: InputMaybe<Array<VideosTagsOrderBy>>;
};

/**
 * All input for the `updateCustomVideoStream` mutation.
 * @permissions: VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type UpdateVideoStreamInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `VideoStream` being updated. */
  patch: VideoStreamPatch;
};

/** The output of our update `VideoStream` mutation. */
export type UpdateVideoStreamPayload = {
  __typename?: 'UpdateVideoStreamPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Video` that is related to this `VideoStream`. */
  video?: Maybe<Video>;
  /** The `VideoStream` that was updated by this mutation. */
  videoStream?: Maybe<VideoStream>;
  /** An edge for our `VideoStream`. May be used by Relay 1. */
  videoStreamEdge?: Maybe<VideoStreamsEdge>;
};


/** The output of our update `VideoStream` mutation. */
export type UpdateVideoStreamPayloadVideoStreamEdgeArgs = {
  orderBy?: InputMaybe<Array<VideoStreamsOrderBy>>;
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

/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type Video = {
  __typename?: 'Video';
  /** The acquisition profile used to ingest the source media for this video. NULL for custom videos. */
  acquisitionProfileId?: Maybe<Scalars['UUID']['output']>;
  acquisitionProgress?: Maybe<Scalars['Int']['output']>;
  /** Encoding attempt number for the same source location and processing profile. Used for de-duplication and retry logic. */
  attempt: Scalars['Int']['output'];
  audioLanguages: Array<Maybe<Scalars['String']['output']>>;
  /** This is a calculated property that has an effect on the response time so request it with care. */
  canBeReEncoded: Scalars['Boolean']['output'];
  captionLanguages: Array<Maybe<Scalars['String']['output']>>;
  cmafSizeInBytes?: Maybe<Scalars['BigInt']['output']>;
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `CuePoint`. */
  cuePoints: CuePointsConnection;
  customId?: Maybe<Scalars['String']['output']>;
  dashManifestPath?: Maybe<Scalars['String']['output']>;
  dashSizeInBytes?: Maybe<Scalars['BigInt']['output']>;
  /** Reads and enables pagination through a set of `EncodingHistory`. */
  encodingHistories: EncodingHistoriesConnection;
  encodingProgress?: Maybe<Scalars['Int']['output']>;
  encodingState: EncodingState;
  errorHint?: Maybe<Scalars['String']['output']>;
  finishedDate?: Maybe<Scalars['Datetime']['output']>;
  fullSourcePath?: Maybe<Scalars['String']['output']>;
  fullTargetPath?: Maybe<Scalars['String']['output']>;
  hlsManifestPath?: Maybe<Scalars['String']['output']>;
  hlsSizeInBytes?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['UUID']['output'];
  /** Unique identifier for encoding attempts based on source_location, processing_profile_id, tenant_id, environment_id, and attempt. Used for de-duplication and retry logic. */
  idempotencyKey: Scalars['String']['output'];
  isArchived: Scalars['Boolean']['output'];
  isProtected: Scalars['Boolean']['output'];
  jobId?: Maybe<Scalars['String']['output']>;
  lengthInSeconds?: Maybe<Scalars['Float']['output']>;
  manifestVersion: ManifestVersion;
  mediaDetection: MediaDetection;
  mpeg2TsSizeInBytes?: Maybe<Scalars['BigInt']['output']>;
  outputFormat: OutputFormat;
  outputLocation: Scalars['String']['output'];
  overallProgress: Scalars['Float']['output'];
  previewComment?: Maybe<Scalars['String']['output']>;
  previewStatus: PreviewStatus;
  processingProfileId?: Maybe<Scalars['UUID']['output']>;
  /** The publishing profile used to deliver the encoded media for this video. NULL for custom videos. */
  publishingProfileId?: Maybe<Scalars['UUID']['output']>;
  segmentFormat: SegmentFormat;
  sourceFileExtension?: Maybe<Scalars['String']['output']>;
  sourceFileName?: Maybe<Scalars['String']['output']>;
  sourceFullFileName?: Maybe<Scalars['String']['output']>;
  sourceLocation: Scalars['String']['output'];
  sourceSizeInBytes?: Maybe<Scalars['BigInt']['output']>;
  subtitleLanguages: Array<Maybe<Scalars['String']['output']>>;
  thumbnailsEnabled: Scalars['Boolean']['output'];
  thumbnailsVttPath?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
  videoBitrates: Array<Maybe<Scalars['Int']['output']>>;
  videoEncoder: VideoEncoder;
  /** Reads and enables pagination through a set of `VideosTag`. */
  videosTags: VideosTagsConnection;
  /** Reads and enables pagination through a set of `VideoStream`. */
  videoStreams: VideoStreamsConnection;
  /** Reads and enables pagination through a set of `VideoWatermarkProfile`. */
  videoWatermarkProfiles: VideoWatermarkProfilesConnection;
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CuePointCondition>;
  filter?: InputMaybe<CuePointFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CuePointsOrderBy>>;
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoEncodingHistoriesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EncodingHistoryCondition>;
  filter?: InputMaybe<EncodingHistoryFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EncodingHistoriesOrderBy>>;
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoVideosTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<VideosTagCondition>;
  filter?: InputMaybe<VideosTagFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<VideosTagsOrderBy>>;
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoVideoStreamsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<VideoStreamCondition>;
  filter?: InputMaybe<VideoStreamFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<VideoStreamsOrderBy>>;
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoVideoWatermarkProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<VideoWatermarkProfileCondition>;
  filter?: InputMaybe<VideoWatermarkProfileFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<VideoWatermarkProfilesOrderBy>>;
};

/** A condition to be used against `Video` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type VideoCondition = {
  /** Checks for equality with the object’s `acquisitionProfileId` field. */
  acquisitionProfileId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `acquisitionProgress` field. */
  acquisitionProgress?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `attempt` field. */
  attempt?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `audioLanguages` field. */
  audioLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Checks for equality with the object’s `captionLanguages` field. */
  captionLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Checks for equality with the object’s `cmafSizeInBytes` field. */
  cmafSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `customId` field. */
  customId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `dashManifestPath` field. */
  dashManifestPath?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `dashSizeInBytes` field. */
  dashSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `encodingProgress` field. */
  encodingProgress?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `encodingState` field. */
  encodingState?: InputMaybe<EncodingState>;
  /** Checks for equality with the object’s `errorHint` field. */
  errorHint?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `finishedDate` field. */
  finishedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `fullSourcePath` field. */
  fullSourcePath?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `fullTargetPath` field. */
  fullTargetPath?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `hlsManifestPath` field. */
  hlsManifestPath?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `hlsSizeInBytes` field. */
  hlsSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `idempotencyKey` field. */
  idempotencyKey?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `isProtected` field. */
  isProtected?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `jobId` field. */
  jobId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `lengthInSeconds` field. */
  lengthInSeconds?: InputMaybe<Scalars['Float']['input']>;
  /** Checks for equality with the object’s `manifestVersion` field. */
  manifestVersion?: InputMaybe<ManifestVersion>;
  /** Checks for equality with the object’s `mediaDetection` field. */
  mediaDetection?: InputMaybe<MediaDetection>;
  /** Checks for equality with the object’s `mpeg2TsSizeInBytes` field. */
  mpeg2TsSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `outputFormat` field. */
  outputFormat?: InputMaybe<OutputFormat>;
  /** Checks for equality with the object’s `previewComment` field. */
  previewComment?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `previewStatus` field. */
  previewStatus?: InputMaybe<PreviewStatus>;
  /** Checks for equality with the object’s `processingProfileId` field. */
  processingProfileId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `publishingProfileId` field. */
  publishingProfileId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `segmentFormat` field. */
  segmentFormat?: InputMaybe<SegmentFormat>;
  /** Checks for equality with the object’s `sourceFileExtension` field. */
  sourceFileExtension?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sourceFileName` field. */
  sourceFileName?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sourceLocation` field. */
  sourceLocation?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sourceSizeInBytes` field. */
  sourceSizeInBytes?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `subtitleLanguages` field. */
  subtitleLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Checks for equality with the object’s `thumbnailsEnabled` field. */
  thumbnailsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `thumbnailsVttPath` field. */
  thumbnailsVttPath?: InputMaybe<Scalars['String']['input']>;
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
  /** Checks for equality with the object’s `videoBitrates` field. */
  videoBitrates?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Checks for equality with the object’s `videoEncoder` field. */
  videoEncoder?: InputMaybe<VideoEncoder>;
};

export enum VideoEncoder {
  /** Custom */
  Custom = 'CUSTOM',
  /** Default */
  Default = 'DEFAULT'
}

/** A filter to be used against VideoEncoder fields. All fields are combined with a logical ‘and.’ */
export type VideoEncoderFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<VideoEncoder>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<VideoEncoder>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<VideoEncoder>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<VideoEncoder>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<VideoEncoder>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<VideoEncoder>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<VideoEncoder>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<VideoEncoder>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<VideoEncoder>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<VideoEncoder>>;
};

/** A filter to be used against `Video` object types. All fields are combined with a logical ‘and.’ */
export type VideoFilter = {
  /** Filter by the object’s `acquisitionProfile` relation. */
  acquisitionProfile?: InputMaybe<EncodingAcquisitionProfileFilter>;
  /** A related `acquisitionProfile` exists. */
  acquisitionProfileExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `acquisitionProfileId` field. */
  acquisitionProfileId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `acquisitionProgress` field. */
  acquisitionProgress?: InputMaybe<IntFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<VideoFilter>>;
  /** Filter by the object’s `attempt` field. */
  attempt?: InputMaybe<IntFilter>;
  /** Filter by the object’s `audioLanguages` field. */
  audioLanguages?: InputMaybe<StringListFilter>;
  /** Filter by the object’s `captionLanguages` field. */
  captionLanguages?: InputMaybe<StringListFilter>;
  /** Filter by the object’s `cmafSizeInBytes` field. */
  cmafSizeInBytes?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `cuePoints` relation. */
  cuePoints?: InputMaybe<VideoToManyCuePointFilter>;
  /** Some related `cuePoints` exist. */
  cuePointsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `customId` field. */
  customId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `dashManifestPath` field. */
  dashManifestPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `dashSizeInBytes` field. */
  dashSizeInBytes?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `encodingHistories` relation. */
  encodingHistories?: InputMaybe<VideoToManyEncodingHistoryFilter>;
  /** Some related `encodingHistories` exist. */
  encodingHistoriesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `encodingProgress` field. */
  encodingProgress?: InputMaybe<IntFilter>;
  /** Filter by the object’s `encodingState` field. */
  encodingState?: InputMaybe<EncodingStateFilter>;
  /** Filter by the object’s `errorHint` field. */
  errorHint?: InputMaybe<StringFilter>;
  /** Filter by the object’s `finishedDate` field. */
  finishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `fullSourcePath` field. */
  fullSourcePath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `fullTargetPath` field. */
  fullTargetPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `hlsManifestPath` field. */
  hlsManifestPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `hlsSizeInBytes` field. */
  hlsSizeInBytes?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `idempotencyKey` field. */
  idempotencyKey?: InputMaybe<StringFilter>;
  /** Filter by the object’s `isArchived` field. */
  isArchived?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `isProtected` field. */
  isProtected?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `jobId` field. */
  jobId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `lengthInSeconds` field. */
  lengthInSeconds?: InputMaybe<FloatFilter>;
  /** Filter by the object’s `manifestVersion` field. */
  manifestVersion?: InputMaybe<ManifestVersionFilter>;
  /** Filter by the object’s `mediaDetection` field. */
  mediaDetection?: InputMaybe<MediaDetectionFilter>;
  /** Filter by the object’s `mpeg2TsSizeInBytes` field. */
  mpeg2TsSizeInBytes?: InputMaybe<BigIntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<VideoFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<VideoFilter>>;
  /** Filter by the object’s `outputFormat` field. */
  outputFormat?: InputMaybe<OutputFormatFilter>;
  /** Filter by the object’s `previewComment` field. */
  previewComment?: InputMaybe<StringFilter>;
  /** Filter by the object’s `previewStatus` field. */
  previewStatus?: InputMaybe<PreviewStatusFilter>;
  /** Filter by the object’s `processingProfile` relation. */
  processingProfile?: InputMaybe<EncodingProcessingProfileFilter>;
  /** A related `processingProfile` exists. */
  processingProfileExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `processingProfileId` field. */
  processingProfileId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `publishingProfile` relation. */
  publishingProfile?: InputMaybe<EncodingPublishingProfileFilter>;
  /** A related `publishingProfile` exists. */
  publishingProfileExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `publishingProfileId` field. */
  publishingProfileId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `segmentFormat` field. */
  segmentFormat?: InputMaybe<SegmentFormatFilter>;
  /** Filter by the object’s `sourceFileExtension` field. */
  sourceFileExtension?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sourceFileName` field. */
  sourceFileName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sourceFullFileName` field. */
  sourceFullFileName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sourceLocation` field. */
  sourceLocation?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sourceSizeInBytes` field. */
  sourceSizeInBytes?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `subtitleLanguages` field. */
  subtitleLanguages?: InputMaybe<StringListFilter>;
  /** Filter by the object’s `thumbnailsEnabled` field. */
  thumbnailsEnabled?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `thumbnailsVttPath` field. */
  thumbnailsVttPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `videoBitrates` field. */
  videoBitrates?: InputMaybe<IntListFilter>;
  /** Filter by the object’s `videoEncoder` field. */
  videoEncoder?: InputMaybe<VideoEncoderFilter>;
  /** Filter by the object’s `videosTags` relation. */
  videosTags?: InputMaybe<VideoToManyVideosTagFilter>;
  /** Some related `videosTags` exist. */
  videosTagsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `videoStreams` relation. */
  videoStreams?: InputMaybe<VideoToManyVideoStreamFilter>;
  /** Some related `videoStreams` exist. */
  videoStreamsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `videoWatermarkProfiles` relation. */
  videoWatermarkProfiles?: InputMaybe<VideoToManyVideoWatermarkProfileFilter>;
  /** Some related `videoWatermarkProfiles` exist. */
  videoWatermarkProfilesExist?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum VideoFormat {
  /** Do Not Encode */
  DoNotEncode = 'DO_NOT_ENCODE',
  /** H264 */
  H264 = 'H264',
  /** H265 */
  H265 = 'H265'
}

/** A filter to be used against VideoFormat fields. All fields are combined with a logical ‘and.’ */
export type VideoFormatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<VideoFormat>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<VideoFormat>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<VideoFormat>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<VideoFormat>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<VideoFormat>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<VideoFormat>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<VideoFormat>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<VideoFormat>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<VideoFormat>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<VideoFormat>>;
};

/** Represents an update to a `Video`. Fields that are set will be updated. */
export type VideoPatch = {
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  mediaDetection?: InputMaybe<MediaDetection>;
  previewComment?: InputMaybe<Scalars['String']['input']>;
  previewStatus?: InputMaybe<PreviewStatus>;
  segmentFormat?: InputMaybe<SegmentFormat>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']['input']>;
  updatedDate?: InputMaybe<Scalars['Datetime']['input']>;
};

/**
 * A connection to a list of `Video` values.
 * @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type VideosConnection = {
  __typename?: 'VideosConnection';
  /** A list of edges which contains the `Video` and cursor to aid in pagination. */
  edges: Array<VideosEdge>;
  /** A list of `Video` objects. */
  nodes: Array<Video>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Video` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Video` edge in the connection. */
export type VideosEdge = {
  __typename?: 'VideosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Video` at the end of the edge. */
  node: Video;
};

/** Methods to use when ordering `Video`. */
export enum VideosOrderBy {
  AcquisitionProfileIdAsc = 'ACQUISITION_PROFILE_ID_ASC',
  AcquisitionProfileIdDesc = 'ACQUISITION_PROFILE_ID_DESC',
  AcquisitionProgressAsc = 'ACQUISITION_PROGRESS_ASC',
  AcquisitionProgressDesc = 'ACQUISITION_PROGRESS_DESC',
  AttemptAsc = 'ATTEMPT_ASC',
  AttemptDesc = 'ATTEMPT_DESC',
  AudioLanguagesAsc = 'AUDIO_LANGUAGES_ASC',
  AudioLanguagesDesc = 'AUDIO_LANGUAGES_DESC',
  CaptionLanguagesAsc = 'CAPTION_LANGUAGES_ASC',
  CaptionLanguagesDesc = 'CAPTION_LANGUAGES_DESC',
  CmafSizeInBytesAsc = 'CMAF_SIZE_IN_BYTES_ASC',
  CmafSizeInBytesDesc = 'CMAF_SIZE_IN_BYTES_DESC',
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  CustomIdAsc = 'CUSTOM_ID_ASC',
  CustomIdDesc = 'CUSTOM_ID_DESC',
  DashManifestPathAsc = 'DASH_MANIFEST_PATH_ASC',
  DashManifestPathDesc = 'DASH_MANIFEST_PATH_DESC',
  DashSizeInBytesAsc = 'DASH_SIZE_IN_BYTES_ASC',
  DashSizeInBytesDesc = 'DASH_SIZE_IN_BYTES_DESC',
  EncodingProgressAsc = 'ENCODING_PROGRESS_ASC',
  EncodingProgressDesc = 'ENCODING_PROGRESS_DESC',
  EncodingStateAsc = 'ENCODING_STATE_ASC',
  EncodingStateDesc = 'ENCODING_STATE_DESC',
  ErrorHintAsc = 'ERROR_HINT_ASC',
  ErrorHintDesc = 'ERROR_HINT_DESC',
  FinishedDateAsc = 'FINISHED_DATE_ASC',
  FinishedDateDesc = 'FINISHED_DATE_DESC',
  FullSourcePathAsc = 'FULL_SOURCE_PATH_ASC',
  FullSourcePathDesc = 'FULL_SOURCE_PATH_DESC',
  FullTargetPathAsc = 'FULL_TARGET_PATH_ASC',
  FullTargetPathDesc = 'FULL_TARGET_PATH_DESC',
  HlsManifestPathAsc = 'HLS_MANIFEST_PATH_ASC',
  HlsManifestPathDesc = 'HLS_MANIFEST_PATH_DESC',
  HlsSizeInBytesAsc = 'HLS_SIZE_IN_BYTES_ASC',
  HlsSizeInBytesDesc = 'HLS_SIZE_IN_BYTES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IdempotencyKeyAsc = 'IDEMPOTENCY_KEY_ASC',
  IdempotencyKeyDesc = 'IDEMPOTENCY_KEY_DESC',
  IsArchivedAsc = 'IS_ARCHIVED_ASC',
  IsArchivedDesc = 'IS_ARCHIVED_DESC',
  IsProtectedAsc = 'IS_PROTECTED_ASC',
  IsProtectedDesc = 'IS_PROTECTED_DESC',
  JobIdAsc = 'JOB_ID_ASC',
  JobIdDesc = 'JOB_ID_DESC',
  LengthInSecondsAsc = 'LENGTH_IN_SECONDS_ASC',
  LengthInSecondsDesc = 'LENGTH_IN_SECONDS_DESC',
  ManifestVersionAsc = 'MANIFEST_VERSION_ASC',
  ManifestVersionDesc = 'MANIFEST_VERSION_DESC',
  MediaDetectionAsc = 'MEDIA_DETECTION_ASC',
  MediaDetectionDesc = 'MEDIA_DETECTION_DESC',
  Mpeg2TsSizeInBytesAsc = 'MPEG2TS_SIZE_IN_BYTES_ASC',
  Mpeg2TsSizeInBytesDesc = 'MPEG2TS_SIZE_IN_BYTES_DESC',
  Natural = 'NATURAL',
  OutputFormatAsc = 'OUTPUT_FORMAT_ASC',
  OutputFormatDesc = 'OUTPUT_FORMAT_DESC',
  PreviewCommentAsc = 'PREVIEW_COMMENT_ASC',
  PreviewCommentDesc = 'PREVIEW_COMMENT_DESC',
  PreviewStatusAsc = 'PREVIEW_STATUS_ASC',
  PreviewStatusDesc = 'PREVIEW_STATUS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProcessingProfileIdAsc = 'PROCESSING_PROFILE_ID_ASC',
  ProcessingProfileIdDesc = 'PROCESSING_PROFILE_ID_DESC',
  PublishingProfileIdAsc = 'PUBLISHING_PROFILE_ID_ASC',
  PublishingProfileIdDesc = 'PUBLISHING_PROFILE_ID_DESC',
  SegmentFormatAsc = 'SEGMENT_FORMAT_ASC',
  SegmentFormatDesc = 'SEGMENT_FORMAT_DESC',
  SourceFileExtensionAsc = 'SOURCE_FILE_EXTENSION_ASC',
  SourceFileExtensionDesc = 'SOURCE_FILE_EXTENSION_DESC',
  SourceFileNameAsc = 'SOURCE_FILE_NAME_ASC',
  SourceFileNameDesc = 'SOURCE_FILE_NAME_DESC',
  SourceFullFileNameAsc = 'SOURCE_FULL_FILE_NAME_ASC',
  SourceFullFileNameDesc = 'SOURCE_FULL_FILE_NAME_DESC',
  SourceLocationAsc = 'SOURCE_LOCATION_ASC',
  SourceLocationDesc = 'SOURCE_LOCATION_DESC',
  SourceSizeInBytesAsc = 'SOURCE_SIZE_IN_BYTES_ASC',
  SourceSizeInBytesDesc = 'SOURCE_SIZE_IN_BYTES_DESC',
  SubtitleLanguagesAsc = 'SUBTITLE_LANGUAGES_ASC',
  SubtitleLanguagesDesc = 'SUBTITLE_LANGUAGES_DESC',
  ThumbnailsEnabledAsc = 'THUMBNAILS_ENABLED_ASC',
  ThumbnailsEnabledDesc = 'THUMBNAILS_ENABLED_DESC',
  ThumbnailsVttPathAsc = 'THUMBNAILS_VTT_PATH_ASC',
  ThumbnailsVttPathDesc = 'THUMBNAILS_VTT_PATH_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  VideoBitratesAsc = 'VIDEO_BITRATES_ASC',
  VideoBitratesDesc = 'VIDEO_BITRATES_DESC',
  VideoEncoderAsc = 'VIDEO_ENCODER_ASC',
  VideoEncoderDesc = 'VIDEO_ENCODER_DESC'
}

/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideosTag = {
  __typename?: 'VideosTag';
  name: Scalars['String']['output'];
  /** Reads a single `Video` that is related to this `VideosTag`. */
  video?: Maybe<Video>;
  videoId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `VideosTag` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type VideosTagCondition = {
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A filter to be used against `VideosTag` object types. All fields are combined with a logical ‘and.’ */
export type VideosTagFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<VideosTagFilter>>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<VideosTagFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<VideosTagFilter>>;
  /** Filter by the object’s `video` relation. */
  video?: InputMaybe<VideoFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `VideosTag` */
export type VideosTagInput = {
  /** @notEmpty() */
  name: Scalars['String']['input'];
  videoId: Scalars['UUID']['input'];
};

/** Represents an update to a `VideosTag`. Fields that are set will be updated. */
export type VideosTagPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A connection to a list of `VideosTag` values.
 * @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type VideosTagsConnection = {
  __typename?: 'VideosTagsConnection';
  /** A list of edges which contains the `VideosTag` and cursor to aid in pagination. */
  edges: Array<VideosTagsEdge>;
  /** A list of `VideosTag` objects. */
  nodes: Array<VideosTag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `VideosTag` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `VideosTag` edge in the connection. */
export type VideosTagsEdge = {
  __typename?: 'VideosTagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `VideosTag` at the end of the edge. */
  node: VideosTag;
};

/** Methods to use when ordering `VideosTag`. */
export enum VideosTagsOrderBy {
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoStream = {
  __typename?: 'VideoStream';
  bitrateInKbps?: Maybe<Scalars['Int']['output']>;
  codecs?: Maybe<Scalars['String']['output']>;
  displayAspectRatio?: Maybe<Scalars['String']['output']>;
  file?: Maybe<Scalars['String']['output']>;
  fileTemplate?: Maybe<Scalars['String']['output']>;
  format: OutputFormat;
  frameRate?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['UUID']['output'];
  iv?: Maybe<Scalars['String']['output']>;
  keyId?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  languageCode?: Maybe<Scalars['String']['output']>;
  languageName?: Maybe<Scalars['String']['output']>;
  pixelAspectRatio?: Maybe<Scalars['String']['output']>;
  samplingRate?: Maybe<Scalars['Int']['output']>;
  type: VideoStreamType;
  /** Reads a single `Video` that is related to this `VideoStream`. */
  video?: Maybe<Video>;
  videoId: Scalars['UUID']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `VideoStream` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type VideoStreamCondition = {
  /** Checks for equality with the object’s `bitrateInKbps` field. */
  bitrateInKbps?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `codecs` field. */
  codecs?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `displayAspectRatio` field. */
  displayAspectRatio?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `file` field. */
  file?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `fileTemplate` field. */
  fileTemplate?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `format` field. */
  format?: InputMaybe<OutputFormat>;
  /** Checks for equality with the object’s `frameRate` field. */
  frameRate?: InputMaybe<Scalars['Float']['input']>;
  /** Checks for equality with the object’s `height` field. */
  height?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `iv` field. */
  iv?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `keyId` field. */
  keyId?: InputMaybe<Scalars['String']['input']>;
  /**
   * Checks for equality with the object’s `label` field.
   * @notEmpty()
   */
  label?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `languageCode` field. */
  languageCode?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `languageName` field. */
  languageName?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `pixelAspectRatio` field. */
  pixelAspectRatio?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `samplingRate` field. */
  samplingRate?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<VideoStreamType>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `width` field. */
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `VideoStream` object types. All fields are combined with a logical ‘and.’ */
export type VideoStreamFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<VideoStreamFilter>>;
  /** Filter by the object’s `bitrateInKbps` field. */
  bitrateInKbps?: InputMaybe<IntFilter>;
  /** Filter by the object’s `codecs` field. */
  codecs?: InputMaybe<StringFilter>;
  /** Filter by the object’s `displayAspectRatio` field. */
  displayAspectRatio?: InputMaybe<StringFilter>;
  /** Filter by the object’s `file` field. */
  file?: InputMaybe<StringFilter>;
  /** Filter by the object’s `fileTemplate` field. */
  fileTemplate?: InputMaybe<StringFilter>;
  /** Filter by the object’s `format` field. */
  format?: InputMaybe<OutputFormatFilter>;
  /** Filter by the object’s `frameRate` field. */
  frameRate?: InputMaybe<FloatFilter>;
  /** Filter by the object’s `height` field. */
  height?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `iv` field. */
  iv?: InputMaybe<StringFilter>;
  /** Filter by the object’s `keyId` field. */
  keyId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `label` field. */
  label?: InputMaybe<StringFilter>;
  /** Filter by the object’s `languageCode` field. */
  languageCode?: InputMaybe<StringFilter>;
  /** Filter by the object’s `languageName` field. */
  languageName?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<VideoStreamFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<VideoStreamFilter>>;
  /** Filter by the object’s `pixelAspectRatio` field. */
  pixelAspectRatio?: InputMaybe<StringFilter>;
  /** Filter by the object’s `samplingRate` field. */
  samplingRate?: InputMaybe<IntFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<VideoStreamTypeFilter>;
  /** Filter by the object’s `video` relation. */
  video?: InputMaybe<VideoFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `width` field. */
  width?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `VideoStream` */
export type VideoStreamInput = {
  bitrateInKbps?: InputMaybe<Scalars['Int']['input']>;
  codecs?: InputMaybe<Scalars['String']['input']>;
  displayAspectRatio?: InputMaybe<Scalars['String']['input']>;
  file?: InputMaybe<Scalars['String']['input']>;
  fileTemplate?: InputMaybe<Scalars['String']['input']>;
  format: OutputFormat;
  frameRate?: InputMaybe<Scalars['Float']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  iv?: InputMaybe<Scalars['String']['input']>;
  keyId?: InputMaybe<Scalars['String']['input']>;
  /** @notEmpty() */
  label: Scalars['String']['input'];
  languageCode?: InputMaybe<Scalars['String']['input']>;
  languageName?: InputMaybe<Scalars['String']['input']>;
  pixelAspectRatio?: InputMaybe<Scalars['String']['input']>;
  samplingRate?: InputMaybe<Scalars['Int']['input']>;
  type: VideoStreamType;
  videoId: Scalars['UUID']['input'];
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents an update to a `VideoStream`. Fields that are set will be updated. */
export type VideoStreamPatch = {
  bitrateInKbps?: InputMaybe<Scalars['Int']['input']>;
  codecs?: InputMaybe<Scalars['String']['input']>;
  displayAspectRatio?: InputMaybe<Scalars['String']['input']>;
  file?: InputMaybe<Scalars['String']['input']>;
  fileTemplate?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<OutputFormat>;
  frameRate?: InputMaybe<Scalars['Float']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  iv?: InputMaybe<Scalars['String']['input']>;
  keyId?: InputMaybe<Scalars['String']['input']>;
  /** @notEmpty() */
  label?: InputMaybe<Scalars['String']['input']>;
  languageCode?: InputMaybe<Scalars['String']['input']>;
  languageName?: InputMaybe<Scalars['String']['input']>;
  pixelAspectRatio?: InputMaybe<Scalars['String']['input']>;
  samplingRate?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<VideoStreamType>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * A connection to a list of `VideoStream` values.
 * @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type VideoStreamsConnection = {
  __typename?: 'VideoStreamsConnection';
  /** A list of edges which contains the `VideoStream` and cursor to aid in pagination. */
  edges: Array<VideoStreamsEdge>;
  /** A list of `VideoStream` objects. */
  nodes: Array<VideoStream>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `VideoStream` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `VideoStream` edge in the connection. */
export type VideoStreamsEdge = {
  __typename?: 'VideoStreamsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `VideoStream` at the end of the edge. */
  node: VideoStream;
};

/** Methods to use when ordering `VideoStream`. */
export enum VideoStreamsOrderBy {
  BitrateInKbpsAsc = 'BITRATE_IN_KBPS_ASC',
  BitrateInKbpsDesc = 'BITRATE_IN_KBPS_DESC',
  CodecsAsc = 'CODECS_ASC',
  CodecsDesc = 'CODECS_DESC',
  DisplayAspectRatioAsc = 'DISPLAY_ASPECT_RATIO_ASC',
  DisplayAspectRatioDesc = 'DISPLAY_ASPECT_RATIO_DESC',
  FileAsc = 'FILE_ASC',
  FileDesc = 'FILE_DESC',
  FileTemplateAsc = 'FILE_TEMPLATE_ASC',
  FileTemplateDesc = 'FILE_TEMPLATE_DESC',
  FormatAsc = 'FORMAT_ASC',
  FormatDesc = 'FORMAT_DESC',
  FrameRateAsc = 'FRAME_RATE_ASC',
  FrameRateDesc = 'FRAME_RATE_DESC',
  HeightAsc = 'HEIGHT_ASC',
  HeightDesc = 'HEIGHT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IvAsc = 'IV_ASC',
  IvDesc = 'IV_DESC',
  KeyIdAsc = 'KEY_ID_ASC',
  KeyIdDesc = 'KEY_ID_DESC',
  LabelAsc = 'LABEL_ASC',
  LabelDesc = 'LABEL_DESC',
  LanguageCodeAsc = 'LANGUAGE_CODE_ASC',
  LanguageCodeDesc = 'LANGUAGE_CODE_DESC',
  LanguageNameAsc = 'LANGUAGE_NAME_ASC',
  LanguageNameDesc = 'LANGUAGE_NAME_DESC',
  Natural = 'NATURAL',
  PixelAspectRatioAsc = 'PIXEL_ASPECT_RATIO_ASC',
  PixelAspectRatioDesc = 'PIXEL_ASPECT_RATIO_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SamplingRateAsc = 'SAMPLING_RATE_ASC',
  SamplingRateDesc = 'SAMPLING_RATE_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC',
  WidthAsc = 'WIDTH_ASC',
  WidthDesc = 'WIDTH_DESC'
}

export enum VideoStreamType {
  /** Audio */
  Audio = 'AUDIO',
  /** Closed caption */
  ClosedCaption = 'CLOSED_CAPTION',
  /** Descriptive Audio */
  DescriptiveAudio = 'DESCRIPTIVE_AUDIO',
  /** Subtitle */
  Subtitle = 'SUBTITLE',
  /** Video */
  Video = 'VIDEO'
}

/** A filter to be used against VideoStreamType fields. All fields are combined with a logical ‘and.’ */
export type VideoStreamTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<VideoStreamType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<VideoStreamType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<VideoStreamType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<VideoStreamType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<VideoStreamType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<VideoStreamType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<VideoStreamType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<VideoStreamType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<VideoStreamType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<VideoStreamType>>;
};

export enum VideoSubscriptionEventKey {
  CuePointChanged = 'CUE_POINT_CHANGED',
  CuePointCreated = 'CUE_POINT_CREATED',
  CuePointDeleted = 'CUE_POINT_DELETED',
  VideoChanged = 'VIDEO_CHANGED',
  VideoCreated = 'VIDEO_CREATED',
  VideoDeleted = 'VIDEO_DELETED',
  VideoTagChanged = 'VIDEO_TAG_CHANGED',
  VideoTagCreated = 'VIDEO_TAG_CREATED',
  VideoTagDeleted = 'VIDEO_TAG_DELETED'
}

export type VideoSubscriptionPayload = {
  __typename?: 'VideoSubscriptionPayload';
  /** @deprecated Use 'eventKey' instead. */
  event?: Maybe<Scalars['String']['output']>;
  eventKey?: Maybe<VideoSubscriptionEventKey>;
  id: Scalars['UUID']['output'];
  video?: Maybe<Video>;
};

export enum VideoSyncMethod {
  /** Auto */
  Auto = 'AUTO',
  /** CFR */
  Cfr = 'CFR',
  /** Pass Through */
  PassThrough = 'PASS_THROUGH',
  /** VFR */
  Vfr = 'VFR'
}

/** A filter to be used against VideoSyncMethod fields. All fields are combined with a logical ‘and.’ */
export type VideoSyncMethodFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<VideoSyncMethod>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<VideoSyncMethod>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<VideoSyncMethod>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<VideoSyncMethod>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<VideoSyncMethod>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<VideoSyncMethod>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<VideoSyncMethod>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<VideoSyncMethod>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<VideoSyncMethod>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<VideoSyncMethod>>;
};

/** A filter to be used against many `CuePoint` object types. All fields are combined with a logical ‘and.’ */
export type VideoToManyCuePointFilter = {
  /** Every related `CuePoint` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CuePointFilter>;
  /** No related `CuePoint` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CuePointFilter>;
  /** Some related `CuePoint` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CuePointFilter>;
};

/** A filter to be used against many `EncodingHistory` object types. All fields are combined with a logical ‘and.’ */
export type VideoToManyEncodingHistoryFilter = {
  /** Every related `EncodingHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EncodingHistoryFilter>;
  /** No related `EncodingHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EncodingHistoryFilter>;
  /** Some related `EncodingHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EncodingHistoryFilter>;
};

/** A filter to be used against many `VideosTag` object types. All fields are combined with a logical ‘and.’ */
export type VideoToManyVideosTagFilter = {
  /** Every related `VideosTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<VideosTagFilter>;
  /** No related `VideosTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<VideosTagFilter>;
  /** Some related `VideosTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<VideosTagFilter>;
};

/** A filter to be used against many `VideoStream` object types. All fields are combined with a logical ‘and.’ */
export type VideoToManyVideoStreamFilter = {
  /** Every related `VideoStream` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<VideoStreamFilter>;
  /** No related `VideoStream` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<VideoStreamFilter>;
  /** Some related `VideoStream` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<VideoStreamFilter>;
};

/** A filter to be used against many `VideoWatermarkProfile` object types. All fields are combined with a logical ‘and.’ */
export type VideoToManyVideoWatermarkProfileFilter = {
  /** Every related `VideoWatermarkProfile` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<VideoWatermarkProfileFilter>;
  /** No related `VideoWatermarkProfile` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<VideoWatermarkProfileFilter>;
  /** Some related `VideoWatermarkProfile` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<VideoWatermarkProfileFilter>;
};

export type VideoWatermarkProfile = {
  __typename?: 'VideoWatermarkProfile';
  createdDate: Scalars['Datetime']['output'];
  createdUser: Scalars['String']['output'];
  environmentId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  tenantId: Scalars['UUID']['output'];
  updatedDate: Scalars['Datetime']['output'];
  updatedUser: Scalars['String']['output'];
  /** Reads a single `Video` that is related to this `VideoWatermarkProfile`. */
  video?: Maybe<Video>;
  videoId: Scalars['UUID']['output'];
  watermarkProfileId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `VideoWatermarkProfile` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type VideoWatermarkProfileCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']['input']>;
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
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `watermarkProfileId` field. */
  watermarkProfileId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A filter to be used against `VideoWatermarkProfile` object types. All fields are combined with a logical ‘and.’ */
export type VideoWatermarkProfileFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<VideoWatermarkProfileFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `environmentId` field. */
  environmentId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<VideoWatermarkProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<VideoWatermarkProfileFilter>>;
  /** Filter by the object’s `tenantId` field. */
  tenantId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `video` relation. */
  video?: InputMaybe<VideoFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `watermarkProfileId` field. */
  watermarkProfileId?: InputMaybe<UuidFilter>;
};

/** A connection to a list of `VideoWatermarkProfile` values. */
export type VideoWatermarkProfilesConnection = {
  __typename?: 'VideoWatermarkProfilesConnection';
  /** A list of edges which contains the `VideoWatermarkProfile` and cursor to aid in pagination. */
  edges: Array<VideoWatermarkProfilesEdge>;
  /** A list of `VideoWatermarkProfile` objects. */
  nodes: Array<VideoWatermarkProfile>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `VideoWatermarkProfile` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `VideoWatermarkProfile` edge in the connection. */
export type VideoWatermarkProfilesEdge = {
  __typename?: 'VideoWatermarkProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `VideoWatermarkProfile` at the end of the edge. */
  node: VideoWatermarkProfile;
};

/** Methods to use when ordering `VideoWatermarkProfile`. */
export enum VideoWatermarkProfilesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
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
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC',
  WatermarkProfileIdAsc = 'WATERMARK_PROFILE_ID_ASC',
  WatermarkProfileIdDesc = 'WATERMARK_PROFILE_ID_DESC'
}

export type GetVideosQueryVariables = Exact<{
  filter?: Types.VideoFilter | null | undefined;
  cuePointFilter?: Types.CuePointFilter | null | undefined;
}>;


export type GetVideosQuery = { videos: { nodes: Array<{ id: any, title: string, lengthInSeconds: number | null, audioLanguages: Array<string | null>, captionLanguages: Array<string | null>, subtitleLanguages: Array<string | null>, dashManifestPath: string | null, hlsManifestPath: string | null, isProtected: boolean, outputFormat: Types.OutputFormat, previewStatus: Types.PreviewStatus, encodingState: Types.EncodingState, videosTags: { nodes: Array<{ name: string }> }, videoStreams: { nodes: Array<{ keyId: string | null, label: string, format: Types.OutputFormat, file: string | null, iv: string | null, languageCode: string | null, bitrateInKbps: number | null, type: Types.VideoStreamType, fileTemplate: string | null, codecs: string | null, frameRate: number | null, height: number | null, width: number | null, displayAspectRatio: string | null, pixelAspectRatio: string | null, samplingRate: number | null, languageName: string | null }> }, cuePoints: { nodes: Array<{ timeInSeconds: number, cuePointTypeKey: string, value: string | null }> } }> } | null };


export const GetVideosDocument = gql`
    query GetVideos($filter: VideoFilter, $cuePointFilter: CuePointFilter) {
  videos(filter: $filter) {
    nodes {
      id
      title
      lengthInSeconds
      audioLanguages
      captionLanguages
      subtitleLanguages
      dashManifestPath
      hlsManifestPath
      isProtected
      outputFormat
      previewStatus
      encodingState
      videosTags {
        nodes {
          name
        }
      }
      videoStreams {
        nodes {
          keyId
          label
          format
          file
          iv
          languageCode
          bitrateInKbps
          type
          fileTemplate
          codecs
          frameRate
          height
          width
          displayAspectRatio
          pixelAspectRatio
          samplingRate
          languageName
        }
      }
      cuePoints(filter: $cuePointFilter) {
        nodes {
          timeInSeconds
          cuePointTypeKey
          value
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();
const GetVideosDocumentString = print(GetVideosDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetVideos(variables?: GetVideosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetVideosQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetVideosQuery>(GetVideosDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetVideos', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;