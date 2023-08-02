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
  BigInt: any;
  Cursor: any;
  Datetime: any;
  JSON: any;
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

/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export type BigIntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigInt']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigInt']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigInt']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigInt']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigInt']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigInt']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigInt']>>;
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
 * All input for the create `CuePoint` mutation.
 * @permissions: VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type CreateCuePointInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `CuePoint` to be created by this mutation. */
  cuePoint: CuePointInput;
};

/** The output of our create `CuePoint` mutation. */
export type CreateCuePointPayload = {
  __typename?: 'CreateCuePointPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
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

export type CreateCustomVideoInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The custom `Video` to be created by this mutation. */
  video: CustomVideoInput;
};

export type CreateCustomVideoPayload = {
  __typename?: 'CreateCustomVideoPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The custom `Video` that was created by this mutation. */
  video?: Maybe<Video>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: Maybe<Scalars['String']>;
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
 * All input for the create `EncodingProcessingProfile` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type CreateEncodingProcessingProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: Maybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: Maybe<Scalars['String']>;
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
 * All input for the create `VideosTag` mutation.
 * @permissions: VIDEOS_ENCODE,VIDEOS_EDIT,ADMIN
 */
export type CreateVideosTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: Maybe<Scalars['String']>;
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
 * @permissions: CUSTOM_VIDEOS_EDIT,ADMIN
 */
export type CreateVideoStreamInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: Maybe<Scalars['String']>;
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
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads a single `CuePointType` that is related to this `CuePoint`. */
  cuePointType?: Maybe<CuePointType>;
  cuePointTypeKey: Scalars['String'];
  id: Scalars['UUID'];
  timeInSeconds: Scalars['Float'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  value?: Maybe<Scalars['String']>;
  /** Reads a single `Video` that is related to this `CuePoint`. */
  video?: Maybe<Video>;
  videoId: Scalars['UUID'];
};

/**
 * A condition to be used against `CuePoint` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CuePointCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `cuePointTypeKey` field. */
  cuePointTypeKey?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `timeInSeconds` field. */
  timeInSeconds?: InputMaybe<Scalars['Float']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `value` field. */
  value?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']>;
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
  cuePointTypeKey: Scalars['String'];
  timeInSeconds: Scalars['Float'];
  value?: InputMaybe<Scalars['String']>;
  videoId: Scalars['UUID'];
};

/** Represents an update to a `CuePoint`. Fields that are set will be updated. */
export type CuePointPatch = {
  cuePointTypeKey?: InputMaybe<Scalars['String']>;
  timeInSeconds?: InputMaybe<Scalars['Float']>;
  value?: InputMaybe<Scalars['String']>;
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
  totalCount: Scalars['Int'];
};

/** A `CuePoint` edge in the connection. */
export type CuePointsEdge = {
  __typename?: 'CuePointsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
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
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads and enables pagination through a set of `CuePoint`. */
  cuePoints: CuePointsConnection;
  isArchived: Scalars['Boolean'];
  key: Scalars['String'];
  serviceId: Scalars['String'];
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,CUE_POINT_TYPES_DECLARE,ADMIN */
export type CuePointTypeCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CuePointCondition>;
  filter?: InputMaybe<CuePointFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CuePointsOrderBy>>;
};

/**
 * A condition to be used against `CuePointType` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CuePointTypeCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']>;
  /**
   * Checks for equality with the object’s `key` field.
   * @isTrimmed()
   * @notEmpty()
   */
  key?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `serviceId` field. */
  serviceId?: InputMaybe<Scalars['String']>;
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
  cuePointsExist?: InputMaybe<Scalars['Boolean']>;
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
  totalCount: Scalars['Int'];
};

/** A `CuePointType` edge in the connection. */
export type CuePointTypesEdge = {
  __typename?: 'CuePointTypesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
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
  audioLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  captionLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cmafSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  customId?: InputMaybe<Scalars['String']>;
  dashManifestPath?: InputMaybe<Scalars['String']>;
  dashSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  finishedDate?: InputMaybe<Scalars['Datetime']>;
  hlsManifestPath?: InputMaybe<Scalars['String']>;
  hlsSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  isProtected?: InputMaybe<Scalars['Boolean']>;
  lengthInSeconds?: InputMaybe<Scalars['Float']>;
  outputFormat?: InputMaybe<OutputFormat>;
  sourceFileExtension?: InputMaybe<Scalars['String']>;
  sourceFileName?: InputMaybe<Scalars['String']>;
  sourceLocation: Scalars['String'];
  sourceSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  subtitleLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title: Scalars['String'];
  videoBitrates?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type CustomVideoPatch = {
  audioLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  captionLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cmafSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  customId?: InputMaybe<Scalars['String']>;
  dashManifestPath?: InputMaybe<Scalars['String']>;
  dashSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  encodingState?: InputMaybe<EncodingState>;
  finishedDate?: InputMaybe<Scalars['Datetime']>;
  hlsManifestPath?: InputMaybe<Scalars['String']>;
  hlsSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  isProtected?: InputMaybe<Scalars['Boolean']>;
  lengthInSeconds?: InputMaybe<Scalars['Float']>;
  outputFormat?: InputMaybe<OutputFormat>;
  sourceFileExtension?: InputMaybe<Scalars['String']>;
  sourceFileName?: InputMaybe<Scalars['String']>;
  sourceLocation?: InputMaybe<Scalars['String']>;
  sourceSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  subtitleLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title?: InputMaybe<Scalars['String']>;
  videoBitrates?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
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
 * All input for the `deleteCuePoint` mutation.
 * @permissions: VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
 */
export type DeleteCuePointInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `CuePoint` mutation. */
export type DeleteCuePointPayload = {
  __typename?: 'DeleteCuePointPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `CuePoint` that was deleted by this mutation. */
  cuePoint?: Maybe<CuePoint>;
  /** An edge for our `CuePoint`. May be used by Relay 1. */
  cuePointEdge?: Maybe<CuePointsEdge>;
  /** Reads a single `CuePointType` that is related to this `CuePoint`. */
  cuePointType?: Maybe<CuePointType>;
  /** @deprecated The field is obsolete. */
  deletedCuePointNodeId?: Maybe<Scalars['ID']>;
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
 * All input for the `deleteEncodingProcessingProfile` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteEncodingProcessingProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `EncodingProcessingProfile` mutation. */
export type DeleteEncodingProcessingProfilePayload = {
  __typename?: 'DeleteEncodingProcessingProfilePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** @deprecated The field is obsolete. */
  deletedEncodingProcessingProfileNodeId?: Maybe<Scalars['ID']>;
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
 * All input for the `deleteEncodingVideoRepresentation` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteEncodingVideoRepresentationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `EncodingVideoRepresentation` mutation. */
export type DeleteEncodingVideoRepresentationPayload = {
  __typename?: 'DeleteEncodingVideoRepresentationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** @deprecated The field is obsolete. */
  deletedEncodingVideoRepresentationNodeId?: Maybe<Scalars['ID']>;
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

export type DeleteEntitlementWebhookConfigurationPayload = {
  __typename?: 'DeleteEntitlementWebhookConfigurationPayload';
  deleted: Scalars['Boolean'];
  query?: Maybe<Query>;
};

export type DeleteManifestWebhookConfigurationPayload = {
  __typename?: 'DeleteManifestWebhookConfigurationPayload';
  deleted: Scalars['Boolean'];
  query?: Maybe<Query>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  videoId: Scalars['UUID'];
};

/** The output of our delete `VideosTag` mutation. */
export type DeleteVideosTagPayload = {
  __typename?: 'DeleteVideosTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** @deprecated The field is obsolete. */
  deletedVideosTagNodeId?: Maybe<Scalars['ID']>;
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
 * @permissions: CUSTOM_VIDEOS_EDIT,ADMIN
 */
export type DeleteVideoStreamInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `VideoStream` mutation. */
export type DeleteVideoStreamPayload = {
  __typename?: 'DeleteVideoStreamPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** @deprecated The field is obsolete. */
  deletedVideoStreamNodeId?: Maybe<Scalars['ID']>;
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  processingProfileId: Scalars['UUID'];
  videoRelativePath: Scalars['String'];
};

export type EncodeVideoPayload = {
  __typename?: 'EncodeVideoPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  query?: Maybe<Query>;
  video?: Maybe<Video>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingAcquisitionAmazonS3Setting = {
  __typename?: 'EncodingAcquisitionAmazonS3Setting';
  accessKeyId: Scalars['String'];
  bucketName: Scalars['String'];
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads a single `EncodingAcquisitionProfile` that is related to this `EncodingAcquisitionAmazonS3Setting`. */
  encodingAcquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  encodingAcquisitionProfileId: Scalars['UUID'];
  fullSourcePath: Scalars['String'];
  managementSecretAccessKeyIsSet: Scalars['Boolean'];
  region: AmazonS3Region;
  rootFolderPath?: Maybe<Scalars['String']>;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
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
  accountName: Scalars['String'];
  containerName: Scalars['String'];
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads a single `EncodingAcquisitionProfile` that is related to this `EncodingAcquisitionAzureBlobSetting`. */
  encodingAcquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  encodingAcquisitionProfileId: Scalars['UUID'];
  fullSourcePath: Scalars['String'];
  managementSasTokenIsSet: Scalars['Boolean'];
  rootFolderPath?: Maybe<Scalars['String']>;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
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
export type EncodingAcquisitionProfile = {
  __typename?: 'EncodingAcquisitionProfile';
  /** Reads a single `EncodingAcquisitionAmazonS3Setting` that is related to this `EncodingAcquisitionProfile`. */
  amazonS3Setting?: Maybe<EncodingAcquisitionAmazonS3Setting>;
  /** Reads a single `EncodingAcquisitionAzureBlobSetting` that is related to this `EncodingAcquisitionProfile`. */
  azureBlobSetting?: Maybe<EncodingAcquisitionAzureBlobSetting>;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  id: Scalars['UUID'];
  provider: StorageProvider;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};

/**
 * A condition to be used against `EncodingAcquisitionProfile` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingAcquisitionProfileCondition = {
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

/** A filter to be used against `EncodingAcquisitionProfile` object types. All fields are combined with a logical ‘and.’ */
export type EncodingAcquisitionProfileFilter = {
  /** Filter by the object’s `amazonS3Setting` relation. */
  amazonS3Setting?: InputMaybe<EncodingAcquisitionAmazonS3SettingFilter>;
  /** A related `amazonS3Setting` exists. */
  amazonS3SettingExists?: InputMaybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingAcquisitionProfileFilter>>;
  /** Filter by the object’s `azureBlobSetting` relation. */
  azureBlobSetting?: InputMaybe<EncodingAcquisitionAzureBlobSettingFilter>;
  /** A related `azureBlobSetting` exists. */
  azureBlobSettingExists?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingAcquisitionProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingAcquisitionProfileFilter>>;
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
  totalCount: Scalars['Int'];
};

/** A `EncodingAcquisitionProfile` edge in the connection. */
export type EncodingAcquisitionProfilesEdge = {
  __typename?: 'EncodingAcquisitionProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
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

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingDrmProfile = {
  __typename?: 'EncodingDrmProfile';
  apiUrl: Scalars['String'];
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  id: Scalars['UUID'];
  tenantKey: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
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
  apiUrl?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /**
   * Checks for equality with the object’s `tenantKey` field.
   * @isTrimmed()
   * @maxLength(36)
   * @minLength(36)
   * @notEmpty()
   */
  tenantKey?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
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
  apiUrl: Scalars['String'];
  /**
   * @isBase64()
   * @notEmpty()
   */
  keySeedId: Scalars['String'];
  /**
   * @isBase64()
   * @notEmpty()
   */
  managementKey: Scalars['String'];
  /**
   * @isTrimmed()
   * @maxLength(36)
   * @minLength(36)
   * @notEmpty()
   */
  tenantKey: Scalars['String'];
};

/** Represents an update to a `EncodingDrmProfile`. Fields that are set will be updated. */
export type EncodingDrmProfilePatch = {
  /**
   * @isTrimmed()
   * @isUrl()
   * @notEmpty()
   */
  apiUrl?: InputMaybe<Scalars['String']>;
  /**
   * @isBase64()
   * @notEmpty()
   */
  keySeedId?: InputMaybe<Scalars['String']>;
  /**
   * @isBase64()
   * @notEmpty()
   */
  managementKey?: InputMaybe<Scalars['String']>;
  /**
   * @isTrimmed()
   * @maxLength(36)
   * @minLength(36)
   * @notEmpty()
   */
  tenantKey?: InputMaybe<Scalars['String']>;
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
  totalCount: Scalars['Int'];
};

/** A `EncodingDrmProfile` edge in the connection. */
export type EncodingDrmProfilesEdge = {
  __typename?: 'EncodingDrmProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
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
  totalCount: Scalars['Int'];
};

/** A `EncodingHistory` edge in the connection. */
export type EncodingHistoriesEdge = {
  __typename?: 'EncodingHistoriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
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
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  enqueuedDate: Scalars['Datetime'];
  id: Scalars['UUID'];
  messageBody: Scalars['JSON'];
  messageType: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  /** Reads a single `Video` that is related to this `EncodingHistory`. */
  video?: Maybe<Video>;
  videoId: Scalars['UUID'];
};

/**
 * A condition to be used against `EncodingHistory` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EncodingHistoryCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `enqueuedDate` field. */
  enqueuedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `messageBody` field. */
  messageBody?: InputMaybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `messageType` field. */
  messageType?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']>;
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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
  audioFileLanguageExpression?: Maybe<Scalars['String']>;
  captionFileLanguageExpression?: Maybe<Scalars['String']>;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  deleteFilesFromSourceWhenDone: Scalars['Boolean'];
  drmProtection: DrmProtection;
  encodingMode: EncodingMode;
  /** Reads and enables pagination through a set of `EncodingVideoRepresentation`. */
  encodingVideoRepresentations: EncodingVideoRepresentationsConnection;
  forceAspectRatioToStandard: Scalars['Boolean'];
  forcePixelAspectRatioTo1: Scalars['Boolean'];
  id: Scalars['UUID'];
  outputFormat: OutputFormat;
  searchForOptimalNearbyResolutions: Scalars['Boolean'];
  subtitleFileLanguageExpression?: Maybe<Scalars['String']>;
  tarMode: TarMode;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  useNativeLanguageNames: Scalars['Boolean'];
  videoStreamExpression?: Maybe<Scalars['String']>;
};


/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingProcessingProfileEncodingVideoRepresentationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EncodingVideoRepresentationCondition>;
  filter?: InputMaybe<EncodingVideoRepresentationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EncodingVideoRepresentationsOrderBy>>;
};

/**
 * A condition to be used against `EncodingProcessingProfile` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingProcessingProfileCondition = {
  /**
   * Checks for equality with the object’s `audioFileLanguageExpression` field.
   * @isTrimmed()
   */
  audioFileLanguageExpression?: InputMaybe<Scalars['String']>;
  /**
   * Checks for equality with the object’s `captionFileLanguageExpression` field.
   * @isTrimmed()
   */
  captionFileLanguageExpression?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `deleteFilesFromSourceWhenDone` field. */
  deleteFilesFromSourceWhenDone?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `drmProtection` field. */
  drmProtection?: InputMaybe<DrmProtection>;
  /** Checks for equality with the object’s `encodingMode` field. */
  encodingMode?: InputMaybe<EncodingMode>;
  /** Checks for equality with the object’s `forceAspectRatioToStandard` field. */
  forceAspectRatioToStandard?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `forcePixelAspectRatioTo1` field. */
  forcePixelAspectRatioTo1?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `outputFormat` field. */
  outputFormat?: InputMaybe<OutputFormat>;
  /** Checks for equality with the object’s `searchForOptimalNearbyResolutions` field. */
  searchForOptimalNearbyResolutions?: InputMaybe<Scalars['Boolean']>;
  /**
   * Checks for equality with the object’s `subtitleFileLanguageExpression` field.
   * @isTrimmed()
   */
  subtitleFileLanguageExpression?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `tarMode` field. */
  tarMode?: InputMaybe<TarMode>;
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
  /** Checks for equality with the object’s `useNativeLanguageNames` field. */
  useNativeLanguageNames?: InputMaybe<Scalars['Boolean']>;
  /**
   * Checks for equality with the object’s `videoStreamExpression` field.
   * @isTrimmed()
   * @notEmpty()
   */
  videoStreamExpression?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `EncodingProcessingProfile` object types. All fields are combined with a logical ‘and.’ */
export type EncodingProcessingProfileFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingProcessingProfileFilter>>;
  /** Filter by the object’s `audioFileLanguageExpression` field. */
  audioFileLanguageExpression?: InputMaybe<StringFilter>;
  /** Filter by the object’s `captionFileLanguageExpression` field. */
  captionFileLanguageExpression?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `deleteFilesFromSourceWhenDone` field. */
  deleteFilesFromSourceWhenDone?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `drmProtection` field. */
  drmProtection?: InputMaybe<DrmProtectionFilter>;
  /** Filter by the object’s `encodingMode` field. */
  encodingMode?: InputMaybe<EncodingModeFilter>;
  /** Filter by the object’s `encodingVideoRepresentations` relation. */
  encodingVideoRepresentations?: InputMaybe<EncodingProcessingProfileToManyEncodingVideoRepresentationFilter>;
  /** Some related `encodingVideoRepresentations` exist. */
  encodingVideoRepresentationsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `forceAspectRatioToStandard` field. */
  forceAspectRatioToStandard?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `forcePixelAspectRatioTo1` field. */
  forcePixelAspectRatioTo1?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingProcessingProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingProcessingProfileFilter>>;
  /** Filter by the object’s `outputFormat` field. */
  outputFormat?: InputMaybe<OutputFormatFilter>;
  /** Filter by the object’s `searchForOptimalNearbyResolutions` field. */
  searchForOptimalNearbyResolutions?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `subtitleFileLanguageExpression` field. */
  subtitleFileLanguageExpression?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tarMode` field. */
  tarMode?: InputMaybe<TarModeFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `useNativeLanguageNames` field. */
  useNativeLanguageNames?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `videoStreamExpression` field. */
  videoStreamExpression?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `EncodingProcessingProfile` */
export type EncodingProcessingProfileInput = {
  /** @isTrimmed() */
  audioFileLanguageExpression?: InputMaybe<Scalars['String']>;
  /** @isTrimmed() */
  captionFileLanguageExpression?: InputMaybe<Scalars['String']>;
  deleteFilesFromSourceWhenDone?: InputMaybe<Scalars['Boolean']>;
  drmProtection?: InputMaybe<DrmProtection>;
  encodingMode?: InputMaybe<EncodingMode>;
  forceAspectRatioToStandard?: InputMaybe<Scalars['Boolean']>;
  forcePixelAspectRatioTo1?: InputMaybe<Scalars['Boolean']>;
  outputFormat?: InputMaybe<OutputFormat>;
  searchForOptimalNearbyResolutions?: InputMaybe<Scalars['Boolean']>;
  /** @isTrimmed() */
  subtitleFileLanguageExpression?: InputMaybe<Scalars['String']>;
  tarMode?: InputMaybe<TarMode>;
  /**
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  title: Scalars['String'];
  useNativeLanguageNames?: InputMaybe<Scalars['Boolean']>;
  /**
   * @isTrimmed()
   * @notEmpty()
   */
  videoStreamExpression?: InputMaybe<Scalars['String']>;
};

/** Represents an update to a `EncodingProcessingProfile`. Fields that are set will be updated. */
export type EncodingProcessingProfilePatch = {
  /** @isTrimmed() */
  audioFileLanguageExpression?: InputMaybe<Scalars['String']>;
  /** @isTrimmed() */
  captionFileLanguageExpression?: InputMaybe<Scalars['String']>;
  deleteFilesFromSourceWhenDone?: InputMaybe<Scalars['Boolean']>;
  drmProtection?: InputMaybe<DrmProtection>;
  encodingMode?: InputMaybe<EncodingMode>;
  forceAspectRatioToStandard?: InputMaybe<Scalars['Boolean']>;
  forcePixelAspectRatioTo1?: InputMaybe<Scalars['Boolean']>;
  outputFormat?: InputMaybe<OutputFormat>;
  searchForOptimalNearbyResolutions?: InputMaybe<Scalars['Boolean']>;
  /** @isTrimmed() */
  subtitleFileLanguageExpression?: InputMaybe<Scalars['String']>;
  tarMode?: InputMaybe<TarMode>;
  /**
   * @isTrimmed()
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
  useNativeLanguageNames?: InputMaybe<Scalars['Boolean']>;
  /**
   * @isTrimmed()
   * @notEmpty()
   */
  videoStreamExpression?: InputMaybe<Scalars['String']>;
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
  totalCount: Scalars['Int'];
};

/** A `EncodingProcessingProfile` edge in the connection. */
export type EncodingProcessingProfilesEdge = {
  __typename?: 'EncodingProcessingProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EncodingProcessingProfile` at the end of the edge. */
  node: EncodingProcessingProfile;
};

/** Methods to use when ordering `EncodingProcessingProfile`. */
export enum EncodingProcessingProfilesOrderBy {
  AudioFileLanguageExpressionAsc = 'AUDIO_FILE_LANGUAGE_EXPRESSION_ASC',
  AudioFileLanguageExpressionDesc = 'AUDIO_FILE_LANGUAGE_EXPRESSION_DESC',
  CaptionFileLanguageExpressionAsc = 'CAPTION_FILE_LANGUAGE_EXPRESSION_ASC',
  CaptionFileLanguageExpressionDesc = 'CAPTION_FILE_LANGUAGE_EXPRESSION_DESC',
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DeleteFilesFromSourceWhenDoneAsc = 'DELETE_FILES_FROM_SOURCE_WHEN_DONE_ASC',
  DeleteFilesFromSourceWhenDoneDesc = 'DELETE_FILES_FROM_SOURCE_WHEN_DONE_DESC',
  DrmProtectionAsc = 'DRM_PROTECTION_ASC',
  DrmProtectionDesc = 'DRM_PROTECTION_DESC',
  EncodingModeAsc = 'ENCODING_MODE_ASC',
  EncodingModeDesc = 'ENCODING_MODE_DESC',
  ForceAspectRatioToStandardAsc = 'FORCE_ASPECT_RATIO_TO_STANDARD_ASC',
  ForceAspectRatioToStandardDesc = 'FORCE_ASPECT_RATIO_TO_STANDARD_DESC',
  ForcePixelAspectRatioTo_1Asc = 'FORCE_PIXEL_ASPECT_RATIO_TO_1_ASC',
  ForcePixelAspectRatioTo_1Desc = 'FORCE_PIXEL_ASPECT_RATIO_TO_1_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OutputFormatAsc = 'OUTPUT_FORMAT_ASC',
  OutputFormatDesc = 'OUTPUT_FORMAT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SearchForOptimalNearbyResolutionsAsc = 'SEARCH_FOR_OPTIMAL_NEARBY_RESOLUTIONS_ASC',
  SearchForOptimalNearbyResolutionsDesc = 'SEARCH_FOR_OPTIMAL_NEARBY_RESOLUTIONS_DESC',
  SubtitleFileLanguageExpressionAsc = 'SUBTITLE_FILE_LANGUAGE_EXPRESSION_ASC',
  SubtitleFileLanguageExpressionDesc = 'SUBTITLE_FILE_LANGUAGE_EXPRESSION_DESC',
  TarModeAsc = 'TAR_MODE_ASC',
  TarModeDesc = 'TAR_MODE_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  UseNativeLanguageNamesAsc = 'USE_NATIVE_LANGUAGE_NAMES_ASC',
  UseNativeLanguageNamesDesc = 'USE_NATIVE_LANGUAGE_NAMES_DESC',
  VideoStreamExpressionAsc = 'VIDEO_STREAM_EXPRESSION_ASC',
  VideoStreamExpressionDesc = 'VIDEO_STREAM_EXPRESSION_DESC'
}

/** A filter to be used against many `EncodingVideoRepresentation` object types. All fields are combined with a logical ‘and.’ */
export type EncodingProcessingProfileToManyEncodingVideoRepresentationFilter = {
  /** Every related `EncodingVideoRepresentation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EncodingVideoRepresentationFilter>;
  /** No related `EncodingVideoRepresentation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EncodingVideoRepresentationFilter>;
  /** Some related `EncodingVideoRepresentation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EncodingVideoRepresentationFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,VIDEOS_ENCODE,ADMIN */
export type EncodingPublishingAmazonS3Setting = {
  __typename?: 'EncodingPublishingAmazonS3Setting';
  accessKeyId: Scalars['String'];
  bucketName: Scalars['String'];
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads a single `EncodingPublishingProfile` that is related to this `EncodingPublishingAmazonS3Setting`. */
  encodingPublishingProfile?: Maybe<EncodingPublishingProfile>;
  encodingPublishingProfileId: Scalars['UUID'];
  fullTargetPath: Scalars['String'];
  region: AmazonS3Region;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
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
  accountName: Scalars['String'];
  containerName: Scalars['String'];
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads a single `EncodingPublishingProfile` that is related to this `EncodingPublishingAzureBlobSetting`. */
  encodingPublishingProfile?: Maybe<EncodingPublishingProfile>;
  encodingPublishingProfileId: Scalars['UUID'];
  fullTargetPath: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
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
export type EncodingPublishingProfile = {
  __typename?: 'EncodingPublishingProfile';
  /** Reads a single `EncodingPublishingAmazonS3Setting` that is related to this `EncodingPublishingProfile`. */
  amazonS3Setting?: Maybe<EncodingPublishingAmazonS3Setting>;
  /** Reads a single `EncodingPublishingAzureBlobSetting` that is related to this `EncodingPublishingProfile`. */
  azureBlobSetting?: Maybe<EncodingPublishingAzureBlobSetting>;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  id: Scalars['UUID'];
  provider: StorageProvider;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};

/**
 * A condition to be used against `EncodingPublishingProfile` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingPublishingProfileCondition = {
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

/** A filter to be used against `EncodingPublishingProfile` object types. All fields are combined with a logical ‘and.’ */
export type EncodingPublishingProfileFilter = {
  /** Filter by the object’s `amazonS3Setting` relation. */
  amazonS3Setting?: InputMaybe<EncodingPublishingAmazonS3SettingFilter>;
  /** A related `amazonS3Setting` exists. */
  amazonS3SettingExists?: InputMaybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EncodingPublishingProfileFilter>>;
  /** Filter by the object’s `azureBlobSetting` relation. */
  azureBlobSetting?: InputMaybe<EncodingPublishingAzureBlobSettingFilter>;
  /** A related `azureBlobSetting` exists. */
  azureBlobSettingExists?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EncodingPublishingProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EncodingPublishingProfileFilter>>;
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
  totalCount: Scalars['Int'];
};

/** A `EncodingPublishingProfile` edge in the connection. */
export type EncodingPublishingProfilesEdge = {
  __typename?: 'EncodingPublishingProfilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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
  bitrateInKbps: Scalars['Int'];
  /** Reads a single `EncodingProcessingProfile` that is related to this `EncodingVideoRepresentation`. */
  encodingProcessingProfile?: Maybe<EncodingProcessingProfile>;
  encodingProcessingProfileId: Scalars['UUID'];
  height?: Maybe<Scalars['Int']>;
  id: Scalars['UUID'];
  width?: Maybe<Scalars['Int']>;
};

/**
 * A condition to be used against `EncodingVideoRepresentation` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EncodingVideoRepresentationCondition = {
  /** Checks for equality with the object’s `bitrateInKbps` field. */
  bitrateInKbps?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `encodingProcessingProfileId` field. */
  encodingProcessingProfileId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `height` field. */
  height?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `width` field. */
  width?: InputMaybe<Scalars['Int']>;
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
  bitrateInKbps: Scalars['Int'];
  encodingProcessingProfileId: Scalars['UUID'];
  height?: InputMaybe<Scalars['Int']>;
  width?: InputMaybe<Scalars['Int']>;
};

/** Represents an update to a `EncodingVideoRepresentation`. Fields that are set will be updated. */
export type EncodingVideoRepresentationPatch = {
  bitrateInKbps?: InputMaybe<Scalars['Int']>;
  height?: InputMaybe<Scalars['Int']>;
  width?: InputMaybe<Scalars['Int']>;
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
  totalCount: Scalars['Int'];
};

/** A `EncodingVideoRepresentation` edge in the connection. */
export type EncodingVideoRepresentationsEdge = {
  __typename?: 'EncodingVideoRepresentationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
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
  /** An authorization database error has occurred. The user might not have enough permissions. */
  DatabasePermissionsCheckFailed = 'DATABASE_PERMISSIONS_CHECK_FAILED',
  /** An expected and handled database constraint error has occurred. The actual message will have more information. */
  DatabaseValidationFailed = 'DATABASE_VALIDATION_FAILED',
  /** Unable to declare cue point types as at least one other cue point type is already used by a different service. Please check the error details for the list of already declared cue point types and their service IDs. */
  DeclareCuePointTypesDuplicate = 'DECLARE_CUE_POINT_TYPES_DUPLICATE',
  /** The DRM settings profile was not found */
  DrmProfileNotFound = 'DRM_PROFILE_NOT_FOUND',
  /** An attempt to generate a webhook response has failed. If payload is empty, at least one error must be provided. */
  EmptyWebhookResponse = 'EMPTY_WEBHOOK_RESPONSE',
  /** The webhook request validation has failed because the provided webhook secret is empty. */
  EmptyWebhookSecret = 'EMPTY_WEBHOOK_SECRET',
  /** Encoder authorization failed. This might be an issue with service configuration. Please contact Axinom Support. */
  EncoderAuthorizationFailed = 'ENCODER_AUTHORIZATION_FAILED',
  /** Encoding service job request sent, but failed with Bad Request error. Its possible that values from Video Encoding Settings are encrypted incorrectly or have invalid values. */
  EncoderBadRequest = 'ENCODER_BAD_REQUEST',
  /** The request to start the encoding process has failed. */
  EncoderJobRequestFailed = 'ENCODER_JOB_REQUEST_FAILED',
  /** The message type "%s" received from the encoder is not supported. */
  EncoderMessageTypeNotSupported = 'ENCODER_MESSAGE_TYPE_NOT_SUPPORTED',
  /** The output format '%s' received from the encoder is not supported. */
  EncoderOutputFormatNotSupported = 'ENCODER_OUTPUT_FORMAT_NOT_SUPPORTED',
  /** Request to the encoder has failed with a code 404. This might be an issue with service configuration. Please contact Axinom Support. */
  EncoderRequestNotFound = 'ENCODER_REQUEST_NOT_FOUND',
  /** Request to the encoder has failed with a code 405. This might be an issue with service configuration. Please contact Axinom Support. */
  EncoderRequestWrongApi = 'ENCODER_REQUEST_WRONG_API',
  /** Encoder validation failed with following messages: %s */
  EncoderValidationFailed = 'ENCODER_VALIDATION_FAILED',
  /** Unable to start the encoding process as there was an authorization issue. Please contact Axinom Support. */
  EncodingJwtNotFound = 'ENCODING_JWT_NOT_FOUND',
  /** This is a wrapper error for the original unhandled error of unsupported type. */
  ErrorWrapper = 'ERROR_WRAPPER',
  /** A GraphQL validation error has occurred. Please make sure that the GraphQL request is made with correct syntax or parameters. */
  GraphqlValidationFailed = 'GRAPHQL_VALIDATION_FAILED',
  /** The Hosting service is not accessible. Please contact Axinom support. */
  HostingServiceNotAccessible = 'HOSTING_SERVICE_NOT_ACCESSIBLE',
  /** The Identity service is not accessible. Please contact Axinom support. */
  IdentityServiceNotAccessible = 'IDENTITY_SERVICE_NOT_ACCESSIBLE',
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
  /** Could not find the subject in the message. */
  MessageSubjectNotFound = 'MESSAGE_SUBJECT_NOT_FOUND',
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
  /** Unable to set the general settings because no input values were provided. */
  SetSettingsInputIsEmpty = 'SET_SETTINGS_INPUT_IS_EMPTY',
  /** Could not find a matching signing key to verify the access token. The signing key used to create the token may have been revoked or the Tenant/Environment/Application configuration is erroneous. */
  SigningKeyNotFound = 'SIGNING_KEY_NOT_FOUND',
  /** An application startup error has occurred. The actual message will have more information. */
  StartupError = 'STARTUP_ERROR',
  /** User is authenticated, but subject information was not found. Please contact Axinom Support. */
  SubjectInformationNotFound = 'SUBJECT_INFORMATION_NOT_FOUND',
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
  /** An unhandled database-related error has occurred. Please contact the service support. */
  UnhandledDatabaseError = 'UNHANDLED_DATABASE_ERROR',
  /** An unhandled error has occurred. Please contact the service support. */
  UnhandledError = 'UNHANDLED_ERROR',
  /** Unrecognized CMAF encoding [%s] found. */
  UnrecognizedCmafEncoding = 'UNRECOGNIZED_CMAF_ENCODING',
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
  /** The video was not found. */
  VideoNotFound = 'VIDEO_NOT_FOUND',
  /** Unable to create a video because provided relative path is empty. */
  VideoRelativePathEmpty = 'VIDEO_RELATIVE_PATH_EMPTY',
  /** The Video Representation must have width and/or height defined. */
  VideoRepresentationDimensionsNotSet = 'VIDEO_REPRESENTATION_DIMENSIONS_NOT_SET',
  /** Unable to make a request to the webhook URL '%s'. Please make sure that the endpoint is reachable. */
  WebhookEndpointNotReachable = 'WEBHOOK_ENDPOINT_NOT_REACHABLE',
  /** Validation of webhook payload has failed. */
  WebhookPayloadValidationFailed = 'WEBHOOK_PAYLOAD_VALIDATION_FAILED',
  /** A webhook request has failed. A more concrete error message will be returned with this code. */
  WebhookRequestFailure = 'WEBHOOK_REQUEST_FAILURE',
  /** Generation of a webhook request has failed. */
  WebhookRequestGenerationFailed = 'WEBHOOK_REQUEST_GENERATION_FAILED',
  /** The webhook for the URL '%s' responded with error(s). Please check the details for more information. */
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
  distinctFrom?: InputMaybe<Scalars['Float']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Float']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Float']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Float']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Float']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Float']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Float']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Float']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Float']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Float']>>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type GeneralSetting = {
  __typename?: 'GeneralSetting';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  entitlementWebhookSecretIsSet: Scalars['Boolean'];
  entitlementWebhookUrl?: Maybe<Scalars['String']>;
  manifestWebhookSecretIsSet: Scalars['Boolean'];
  manifestWebhookUrl?: Maybe<Scalars['String']>;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  videoPlaybackEnabled: Scalars['Boolean'];
};

export type GenerateEntitlementWebhookSecretPayload = {
  __typename?: 'GenerateEntitlementWebhookSecretPayload';
  query?: Maybe<Query>;
  secret: Scalars['String'];
};

export type GenerateManifestWebhookSecretPayload = {
  __typename?: 'GenerateManifestWebhookSecretPayload';
  query?: Maybe<Query>;
  secret: Scalars['String'];
};

/** A `String` edge in the connection. */
export type GetVideosTagsValueEdge = {
  __typename?: 'GetVideosTagsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetVideosTagsValuesConnection = {
  __typename?: 'GetVideosTagsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetVideosTagsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
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

/** A filter to be used against Int List fields. All fields are combined with a logical ‘and.’ */
export type IntListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['Int']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['Int']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['Int']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['Int']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contained by the specified JSON. */
  containedBy?: InputMaybe<Scalars['JSON']>;
  /** Contains the specified JSON. */
  contains?: InputMaybe<Scalars['JSON']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: InputMaybe<Array<Scalars['String']>>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified key. */
  containsKey?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['JSON']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['JSON']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['JSON']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['JSON']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['JSON']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['JSON']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['JSON']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['JSON']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['JSON']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['JSON']>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  archiveVideos?: Maybe<BulkMutationUuidPayload>;
  /** Creates a single `CuePoint`. */
  createCuePoint?: Maybe<CreateCuePointPayload>;
  /** Creates a single custom `Video`. */
  createCustomVideo?: Maybe<CreateCustomVideoPayload>;
  /** Creates a single `VideoStream`. */
  createCustomVideoStream?: Maybe<CreateVideoStreamPayload>;
  /** Creates a single `EncodingDrmProfile`. */
  createEncodingDrmProfile?: Maybe<CreateEncodingDrmProfilePayload>;
  /** Creates a single `EncodingProcessingProfile`. */
  createEncodingProcessingProfile?: Maybe<CreateEncodingProcessingProfilePayload>;
  /** Creates a single `EncodingVideoRepresentation`. */
  createEncodingVideoRepresentation?: Maybe<CreateEncodingVideoRepresentationPayload>;
  /** Creates a single `VideosTag`. */
  createVideosTag?: Maybe<CreateVideosTagPayload>;
  /** Deletes a single `CuePoint` using a unique key. */
  deleteCuePoint?: Maybe<DeleteCuePointPayload>;
  /** Deletes a single `VideoStream` using a unique key. */
  deleteCustomVideoStream?: Maybe<DeleteVideoStreamPayload>;
  /** Deletes a single `EncodingProcessingProfile` using a unique key. */
  deleteEncodingProcessingProfile?: Maybe<DeleteEncodingProcessingProfilePayload>;
  /** Deletes a single `EncodingVideoRepresentation` using a unique key. */
  deleteEncodingVideoRepresentation?: Maybe<DeleteEncodingVideoRepresentationPayload>;
  deleteEntitlementWebhookConfiguration: DeleteEntitlementWebhookConfigurationPayload;
  deleteManifestWebhookConfiguration: DeleteManifestWebhookConfigurationPayload;
  /** Deletes a single `VideosTag` using a unique key. */
  deleteVideosTag?: Maybe<DeleteVideosTagPayload>;
  encodeVideo?: Maybe<EncodeVideoPayload>;
  generateEntitlementWebhookSecret: GenerateEntitlementWebhookSecretPayload;
  generateManifestWebhookSecret: GenerateManifestWebhookSecretPayload;
  populateVideos?: Maybe<PopulatePayload>;
  retryEncodeVideo?: Maybe<RetryEncodeVideoPayload>;
  setAmazonS3AcquisitionProfile: EncodingAcquisitionProfile;
  setAmazonS3PublishingProfile: EncodingPublishingProfile;
  setAzureBlobAcquisitionProfile: EncodingAcquisitionProfile;
  setAzureBlobPublishingProfile: EncodingPublishingProfile;
  setGeneralSettings: GeneralSetting;
  truncateVideos?: Maybe<TruncateVideosPayload>;
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
  /** Updates a single `EncodingProcessingProfile` using a unique key and a patch. */
  updateEncodingProcessingProfile?: Maybe<UpdateEncodingProcessingProfilePayload>;
  /** Updates a single `EncodingVideoRepresentation` using a unique key and a patch. */
  updateEncodingVideoRepresentation?: Maybe<UpdateEncodingVideoRepresentationPayload>;
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
export type MutationCreateCuePointArgs = {
  input: CreateCuePointInput;
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
export type MutationCreateEncodingDrmProfileArgs = {
  input: CreateEncodingDrmProfileInput;
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
export type MutationDeleteEncodingProcessingProfileArgs = {
  input: DeleteEncodingProcessingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEncodingVideoRepresentationArgs = {
  input: DeleteEncodingVideoRepresentationInput;
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
export type MutationPopulateVideosArgs = {
  input: PopulateInput;
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
export type MutationUpdateEncodingProcessingProfileArgs = {
  input: UpdateEncodingProcessingProfileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEncodingVideoRepresentationArgs = {
  input: UpdateEncodingVideoRepresentationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVideoArgs = {
  input: UpdateVideoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVideosTagArgs = {
  input: UpdateVideosTagInput;
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
  Hls = 'HLS'
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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
  endCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type PlaybackVideoInput = {
  videoId: Scalars['UUID'];
};

export type PlaybackVideoPayload = {
  __typename?: 'PlaybackVideoPayload';
  dashManifestUrl?: Maybe<Scalars['String']>;
  entitlementMessageJwt?: Maybe<Scalars['String']>;
  fairplayLicenseServiceUrl?: Maybe<Scalars['String']>;
  fairplayStreamingCertificateUrl?: Maybe<Scalars['String']>;
  hlsManifestUrl?: Maybe<Scalars['String']>;
  playreadyLicenseServiceUrl?: Maybe<Scalars['String']>;
  widevineLicenseServiceUrl?: Maybe<Scalars['String']>;
};

export type PopulateInput = {
  count: Scalars['Int'];
  includeCuePoints?: InputMaybe<Scalars['Boolean']>;
  includeHistories?: InputMaybe<Scalars['Boolean']>;
  includeStreams?: InputMaybe<Scalars['Boolean']>;
  includeTags?: InputMaybe<Scalars['Boolean']>;
};

export type PopulatePayload = {
  __typename?: 'PopulatePayload';
  count: Scalars['Int'];
  query?: Maybe<Query>;
};

export enum PreviewStatus {
  /** Approved */
  Approved = 'APPROVED',
  /** Not approved */
  NotApproved = 'NOT_APPROVED',
  /** Not previewed */
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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

export type QualityLevel = {
  __typename?: 'QualityLevel';
  height: Scalars['Int'];
  kbps: Scalars['Int'];
  name: Scalars['String'];
  width: Scalars['Int'];
};

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  cuePoint?: Maybe<CuePoint>;
  /** Reads and enables pagination through a set of `CuePoint`. */
  cuePoints?: Maybe<CuePointsConnection>;
  cuePointType?: Maybe<CuePointType>;
  /** Reads and enables pagination through a set of `CuePointType`. */
  cuePointTypes?: Maybe<CuePointTypesConnection>;
  encodingAcquisitionProfile?: Maybe<EncodingAcquisitionProfile>;
  /** Reads and enables pagination through a set of `EncodingAcquisitionProfile`. */
  encodingAcquisitionProfiles?: Maybe<EncodingAcquisitionProfilesConnection>;
  encodingDrmProfile?: Maybe<EncodingDrmProfile>;
  /** Reads and enables pagination through a set of `EncodingDrmProfile`. */
  encodingDrmProfiles?: Maybe<EncodingDrmProfilesConnection>;
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
};


/** The root query type which gives access points into the data universe. */
export type QueryCuePointArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CuePointCondition>;
  filter?: InputMaybe<CuePointFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CuePointsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCuePointTypeArgs = {
  key: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCuePointTypesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CuePointTypeCondition>;
  filter?: InputMaybe<CuePointTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CuePointTypesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingAcquisitionProfileArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingAcquisitionProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EncodingAcquisitionProfileCondition>;
  filter?: InputMaybe<EncodingAcquisitionProfileFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EncodingAcquisitionProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingDrmProfileArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingDrmProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EncodingDrmProfileCondition>;
  filter?: InputMaybe<EncodingDrmProfileFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EncodingDrmProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingHistoriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EncodingHistoryCondition>;
  filter?: InputMaybe<EncodingHistoryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EncodingHistoriesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingHistoryArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingProcessingProfileArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingProcessingProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EncodingProcessingProfileCondition>;
  filter?: InputMaybe<EncodingProcessingProfileFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EncodingProcessingProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingPublishingProfileArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingPublishingProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EncodingPublishingProfileCondition>;
  filter?: InputMaybe<EncodingPublishingProfileFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EncodingPublishingProfilesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingVideoRepresentationArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEncodingVideoRepresentationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EncodingVideoRepresentationCondition>;
  filter?: InputMaybe<EncodingVideoRepresentationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EncodingVideoRepresentationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetVideosTagsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
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
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVideosArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<VideoCondition>;
  filter?: InputMaybe<VideoFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<VideosOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryVideosTagArgs = {
  name: Scalars['String'];
  videoId: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVideosTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<VideosTagCondition>;
  filter?: InputMaybe<VideosTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<VideosTagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryVideoStreamArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVideoStreamsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<VideoStreamCondition>;
  filter?: InputMaybe<VideoStreamFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<VideoStreamsOrderBy>>;
};

export type RetryEncodeVideoInput = {
  processingProfileId: Scalars['UUID'];
  videoId: Scalars['UUID'];
};

export type RetryEncodeVideoPayload = {
  __typename?: 'RetryEncodeVideoPayload';
  query?: Maybe<Query>;
  video?: Maybe<Video>;
};

export type SetAmazonS3AcquisitionProfileInput = {
  accessKeyId: Scalars['String'];
  bucketName: Scalars['String'];
  managementSecretAccessKey?: InputMaybe<Scalars['String']>;
  region: AmazonS3Region;
  rootFolderPath?: InputMaybe<Scalars['String']>;
  secretAccessKeyEncrypted: Scalars['String'];
  title: Scalars['String'];
};

export type SetAmazonS3PublishingProfileInput = {
  accessKeyId: Scalars['String'];
  bucketName: Scalars['String'];
  region: AmazonS3Region;
  secretAccessKeyEncrypted: Scalars['String'];
  title: Scalars['String'];
};

export type SetAzureBlobAcquisitionProfileInput = {
  accountKeyEncrypted: Scalars['String'];
  accountName: Scalars['String'];
  containerName: Scalars['String'];
  managementSasToken?: InputMaybe<Scalars['String']>;
  rootFolderPath?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type SetAzureBlobPublishingProfileInput = {
  accountKeyEncrypted: Scalars['String'];
  accountName: Scalars['String'];
  containerName: Scalars['String'];
  title: Scalars['String'];
};

export type SetGeneralSettingsInput = {
  entitlementWebhookUrl?: InputMaybe<Scalars['String']>;
  manifestWebhookUrl?: InputMaybe<Scalars['String']>;
  videoPlaybackEnabled?: InputMaybe<Scalars['Boolean']>;
};

export type SourceVideo = {
  __typename?: 'SourceVideo';
  isEncoded: Scalars['Boolean'];
  path: Scalars['String'];
};

export type SourceVideoFilter = {
  path?: InputMaybe<SourceVideoStringFilter>;
};

export type SourceVideoInput = {
  after?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<SourceVideoFilter>;
  first?: InputMaybe<Scalars['Int']>;
};

export type SourceVideoPageInfo = {
  __typename?: 'SourceVideoPageInfo';
  endCursor?: Maybe<Scalars['Cursor']>;
  hasNextPage: Scalars['Boolean'];
};

export type SourceVideoPayload = {
  __typename?: 'SourceVideoPayload';
  nodes: Array<Maybe<SourceVideo>>;
  pageInfo?: Maybe<SourceVideoPageInfo>;
  query?: Maybe<Query>;
};

export type SourceVideoStringFilter = {
  startsWith?: InputMaybe<Scalars['String']>;
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

/** A filter to be used against String List fields. All fields are combined with a logical ‘and.’ */
export type StringListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['String']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['String']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['String']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['String']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type Subscription = {
  __typename?: 'Subscription';
  /** Triggered when a Video is mutated (insert, update or delete).  */
  videoMutated?: Maybe<VideoSubscriptionPayload>;
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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

export type TruncateVideosPayload = {
  __typename?: 'TruncateVideosPayload';
  completed: Scalars['Boolean'];
};

export type UpdateAmazonS3AcquisitionProfileInput = {
  accessKeyId?: InputMaybe<Scalars['String']>;
  bucketName?: InputMaybe<Scalars['String']>;
  managementSecretAccessKey?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<AmazonS3Region>;
  rootFolderPath?: InputMaybe<Scalars['String']>;
  secretAccessKeyEncrypted?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateAmazonS3PublishingProfileInput = {
  accessKeyId?: InputMaybe<Scalars['String']>;
  bucketName?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<AmazonS3Region>;
  secretAccessKeyEncrypted?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateAzureBlobAcquisitionProfileInput = {
  accountKeyEncrypted?: InputMaybe<Scalars['String']>;
  accountName?: InputMaybe<Scalars['String']>;
  containerName?: InputMaybe<Scalars['String']>;
  managementSasToken?: InputMaybe<Scalars['String']>;
  rootFolderPath?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateAzureBlobPublishingProfileInput = {
  accountKeyEncrypted?: InputMaybe<Scalars['String']>;
  accountName?: InputMaybe<Scalars['String']>;
  containerName?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
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
  clientMutationId?: Maybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** An object where the defined keys will be set on the custom `Video` being updated. */
  patch: CustomVideoPatch;
};

export type UpdateCustomVideoPayload = {
  __typename?: 'UpdateCustomVideoPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
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
  clientMutationId?: Maybe<Scalars['String']>;
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
 * All input for the `updateEncodingProcessingProfile` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type UpdateEncodingProcessingProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
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
  clientMutationId?: Maybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
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
  clientMutationId?: Maybe<Scalars['String']>;
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
 * All input for the `updateVideo` mutation.
 * @permissions: VIDEOS_ENCODE,VIDEOS_EDIT,CUSTOM_VIDEOS_EDIT,ADMIN
 */
export type UpdateVideoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** An object where the defined keys will be set on the `Video` being updated. */
  patch: VideoPatch;
};

/** The output of our update `Video` mutation. */
export type UpdateVideoPayload = {
  __typename?: 'UpdateVideoPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `VideosTag` being updated. */
  patch: VideosTagPatch;
  videoId: Scalars['UUID'];
};

/** The output of our update `VideosTag` mutation. */
export type UpdateVideosTagPayload = {
  __typename?: 'UpdateVideosTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
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
 * @permissions: CUSTOM_VIDEOS_EDIT,ADMIN
 */
export type UpdateVideoStreamInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
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
  clientMutationId?: Maybe<Scalars['String']>;
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

/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type Video = {
  __typename?: 'Video';
  acquisitionProgress?: Maybe<Scalars['Int']>;
  audioLanguages: Array<Maybe<Scalars['String']>>;
  /** This is a calculated property that has an effect on the response time so request it with care. */
  canBeReEncoded: Scalars['Boolean'];
  captionLanguages: Array<Maybe<Scalars['String']>>;
  cmafSizeInBytes?: Maybe<Scalars['BigInt']>;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads and enables pagination through a set of `CuePoint`. */
  cuePoints: CuePointsConnection;
  customId?: Maybe<Scalars['String']>;
  dashManifestPath?: Maybe<Scalars['String']>;
  dashSizeInBytes?: Maybe<Scalars['BigInt']>;
  /** @deprecated Use `keyId` in `VideoStreams` instead */
  drmKeyIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** @deprecated Use `lengthInSeconds` instead */
  durationInSeconds?: Maybe<Scalars['Int']>;
  /** Reads and enables pagination through a set of `EncodingHistory`. */
  encodingHistories: EncodingHistoriesConnection;
  encodingProgress?: Maybe<Scalars['Int']>;
  encodingState: EncodingState;
  finishedDate?: Maybe<Scalars['Datetime']>;
  hlsManifestPath?: Maybe<Scalars['String']>;
  hlsSizeInBytes?: Maybe<Scalars['BigInt']>;
  id: Scalars['UUID'];
  isArchived: Scalars['Boolean'];
  isProtected: Scalars['Boolean'];
  jobId?: Maybe<Scalars['String']>;
  lengthInSeconds?: Maybe<Scalars['Float']>;
  outputFormat: OutputFormat;
  outputLocation: Scalars['String'];
  overallProgress: Scalars['Float'];
  previewComment?: Maybe<Scalars['String']>;
  previewStatus: PreviewStatus;
  qualityLevels?: Maybe<Array<Maybe<QualityLevel>>>;
  sourceFileExtension?: Maybe<Scalars['String']>;
  sourceFileName?: Maybe<Scalars['String']>;
  sourceFullFileName?: Maybe<Scalars['String']>;
  sourceLocation: Scalars['String'];
  sourceSizeInBytes?: Maybe<Scalars['BigInt']>;
  subtitleLanguages: Array<Maybe<Scalars['String']>>;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  videoBitrates: Array<Maybe<Scalars['Int']>>;
  videoEncoder: VideoEncoder;
  /** Reads and enables pagination through a set of `VideosTag`. */
  videosTags: VideosTagsConnection;
  /** Reads and enables pagination through a set of `VideoStream`. */
  videoStreams: VideoStreamsConnection;
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CuePointCondition>;
  filter?: InputMaybe<CuePointFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CuePointsOrderBy>>;
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoEncodingHistoriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EncodingHistoryCondition>;
  filter?: InputMaybe<EncodingHistoryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EncodingHistoriesOrderBy>>;
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoVideosTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<VideosTagCondition>;
  filter?: InputMaybe<VideosTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<VideosTagsOrderBy>>;
};


/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoVideoStreamsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<VideoStreamCondition>;
  filter?: InputMaybe<VideoStreamFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<VideoStreamsOrderBy>>;
};

/** A condition to be used against `Video` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type VideoCondition = {
  /** Checks for equality with the object’s `acquisitionProgress` field. */
  acquisitionProgress?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `audioLanguages` field. */
  audioLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Checks for equality with the object’s `captionLanguages` field. */
  captionLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Checks for equality with the object’s `cmafSizeInBytes` field. */
  cmafSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `customId` field. */
  customId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `dashManifestPath` field. */
  dashManifestPath?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `dashSizeInBytes` field. */
  dashSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  drmKeyIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Checks for equality with the object’s `durationInSeconds` field. */
  durationInSeconds?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `encodingProgress` field. */
  encodingProgress?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `encodingState` field. */
  encodingState?: InputMaybe<EncodingState>;
  /** Checks for equality with the object’s `finishedDate` field. */
  finishedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `hlsManifestPath` field. */
  hlsManifestPath?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `hlsSizeInBytes` field. */
  hlsSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `isProtected` field. */
  isProtected?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `jobId` field. */
  jobId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `lengthInSeconds` field. */
  lengthInSeconds?: InputMaybe<Scalars['Float']>;
  /** Checks for equality with the object’s `outputFormat` field. */
  outputFormat?: InputMaybe<OutputFormat>;
  /** Checks for equality with the object’s `previewComment` field. */
  previewComment?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `previewStatus` field. */
  previewStatus?: InputMaybe<PreviewStatus>;
  /** Checks for equality with the object’s `qualityLevels` field. */
  qualityLevels?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Checks for equality with the object’s `sourceFileExtension` field. */
  sourceFileExtension?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `sourceFileName` field. */
  sourceFileName?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `sourceLocation` field. */
  sourceLocation?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `sourceSizeInBytes` field. */
  sourceSizeInBytes?: InputMaybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `subtitleLanguages` field. */
  subtitleLanguages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  /** Checks for equality with the object’s `videoBitrates` field. */
  videoBitrates?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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
  /** Filter by the object’s `acquisitionProgress` field. */
  acquisitionProgress?: InputMaybe<IntFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<VideoFilter>>;
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
  cuePointsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `customId` field. */
  customId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `dashManifestPath` field. */
  dashManifestPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `dashSizeInBytes` field. */
  dashSizeInBytes?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `drmKeyIds` field. */
  drmKeyIds?: InputMaybe<StringListFilter>;
  /** Filter by the object’s `durationInSeconds` field. */
  durationInSeconds?: InputMaybe<IntFilter>;
  /** Filter by the object’s `encodingHistories` relation. */
  encodingHistories?: InputMaybe<VideoToManyEncodingHistoryFilter>;
  /** Some related `encodingHistories` exist. */
  encodingHistoriesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `encodingProgress` field. */
  encodingProgress?: InputMaybe<IntFilter>;
  /** Filter by the object’s `encodingState` field. */
  encodingState?: InputMaybe<EncodingStateFilter>;
  /** Filter by the object’s `finishedDate` field. */
  finishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `hlsManifestPath` field. */
  hlsManifestPath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `hlsSizeInBytes` field. */
  hlsSizeInBytes?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `isArchived` field. */
  isArchived?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `isProtected` field. */
  isProtected?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `jobId` field. */
  jobId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `lengthInSeconds` field. */
  lengthInSeconds?: InputMaybe<FloatFilter>;
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
  videosTagsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `videoStreams` relation. */
  videoStreams?: InputMaybe<VideoToManyVideoStreamFilter>;
  /** Some related `videoStreams` exist. */
  videoStreamsExist?: InputMaybe<Scalars['Boolean']>;
};

/** Represents an update to a `Video`. Fields that are set will be updated. */
export type VideoPatch = {
  isArchived?: InputMaybe<Scalars['Boolean']>;
  previewComment?: InputMaybe<Scalars['String']>;
  previewStatus?: InputMaybe<PreviewStatus>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `Video` values.
 * @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
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
  totalCount: Scalars['Int'];
};

/** A `Video` edge in the connection. */
export type VideosEdge = {
  __typename?: 'VideosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Video` at the end of the edge. */
  node: Video;
};

/** Methods to use when ordering `Video`. */
export enum VideosOrderBy {
  AcquisitionProgressAsc = 'ACQUISITION_PROGRESS_ASC',
  AcquisitionProgressDesc = 'ACQUISITION_PROGRESS_DESC',
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
  DrmKeyIdsAsc = 'DRM_KEY_IDS_ASC',
  DrmKeyIdsDesc = 'DRM_KEY_IDS_DESC',
  DurationInSecondsAsc = 'DURATION_IN_SECONDS_ASC',
  DurationInSecondsDesc = 'DURATION_IN_SECONDS_DESC',
  EncodingProgressAsc = 'ENCODING_PROGRESS_ASC',
  EncodingProgressDesc = 'ENCODING_PROGRESS_DESC',
  EncodingStateAsc = 'ENCODING_STATE_ASC',
  EncodingStateDesc = 'ENCODING_STATE_DESC',
  FinishedDateAsc = 'FINISHED_DATE_ASC',
  FinishedDateDesc = 'FINISHED_DATE_DESC',
  HlsManifestPathAsc = 'HLS_MANIFEST_PATH_ASC',
  HlsManifestPathDesc = 'HLS_MANIFEST_PATH_DESC',
  HlsSizeInBytesAsc = 'HLS_SIZE_IN_BYTES_ASC',
  HlsSizeInBytesDesc = 'HLS_SIZE_IN_BYTES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsArchivedAsc = 'IS_ARCHIVED_ASC',
  IsArchivedDesc = 'IS_ARCHIVED_DESC',
  IsProtectedAsc = 'IS_PROTECTED_ASC',
  IsProtectedDesc = 'IS_PROTECTED_DESC',
  JobIdAsc = 'JOB_ID_ASC',
  JobIdDesc = 'JOB_ID_DESC',
  LengthInSecondsAsc = 'LENGTH_IN_SECONDS_ASC',
  LengthInSecondsDesc = 'LENGTH_IN_SECONDS_DESC',
  Natural = 'NATURAL',
  OutputFormatAsc = 'OUTPUT_FORMAT_ASC',
  OutputFormatDesc = 'OUTPUT_FORMAT_DESC',
  PreviewCommentAsc = 'PREVIEW_COMMENT_ASC',
  PreviewCommentDesc = 'PREVIEW_COMMENT_DESC',
  PreviewStatusAsc = 'PREVIEW_STATUS_ASC',
  PreviewStatusDesc = 'PREVIEW_STATUS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  QualityLevelsAsc = 'QUALITY_LEVELS_ASC',
  QualityLevelsDesc = 'QUALITY_LEVELS_DESC',
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
  name: Scalars['String'];
  /** Reads a single `Video` that is related to this `VideosTag`. */
  video?: Maybe<Video>;
  videoId: Scalars['UUID'];
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
  name?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']>;
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
  name: Scalars['String'];
  videoId: Scalars['UUID'];
};

/** Represents an update to a `VideosTag`. Fields that are set will be updated. */
export type VideosTagPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
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
  totalCount: Scalars['Int'];
};

/** A `VideosTag` edge in the connection. */
export type VideosTagsEdge = {
  __typename?: 'VideosTagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
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

/** @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN */
export type VideoStream = {
  __typename?: 'VideoStream';
  /** @deprecated Use `bitrateInKbps` instead */
  bandwidthInBps?: Maybe<Scalars['Int']>;
  bitrateInKbps?: Maybe<Scalars['Int']>;
  codecs?: Maybe<Scalars['String']>;
  displayAspectRatio?: Maybe<Scalars['String']>;
  file?: Maybe<Scalars['String']>;
  fileTemplate?: Maybe<Scalars['String']>;
  format: OutputFormat;
  frameRate?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Int']>;
  id: Scalars['UUID'];
  /** @deprecated Use `file` instead */
  initialFile?: Maybe<Scalars['String']>;
  iv?: Maybe<Scalars['String']>;
  keyId?: Maybe<Scalars['String']>;
  label: Scalars['String'];
  languageCode?: Maybe<Scalars['String']>;
  languageName?: Maybe<Scalars['String']>;
  pixelAspectRatio?: Maybe<Scalars['String']>;
  samplingRate?: Maybe<Scalars['Int']>;
  type: VideoStreamType;
  /** Reads a single `Video` that is related to this `VideoStream`. */
  video?: Maybe<Video>;
  videoId: Scalars['UUID'];
  width?: Maybe<Scalars['Int']>;
};

/**
 * A condition to be used against `VideoStream` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type VideoStreamCondition = {
  /** Checks for equality with the object’s `bandwidthInBps` field. */
  bandwidthInBps?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `bitrateInKbps` field. */
  bitrateInKbps?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `codecs` field. */
  codecs?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `displayAspectRatio` field. */
  displayAspectRatio?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `file` field. */
  file?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `fileTemplate` field. */
  fileTemplate?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `format` field. */
  format?: InputMaybe<OutputFormat>;
  /** Checks for equality with the object’s `frameRate` field. */
  frameRate?: InputMaybe<Scalars['Float']>;
  /** Checks for equality with the object’s `height` field. */
  height?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `initialFile` field. */
  initialFile?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `iv` field. */
  iv?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `keyId` field. */
  keyId?: InputMaybe<Scalars['String']>;
  /**
   * Checks for equality with the object’s `label` field.
   * @notEmpty()
   */
  label?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `languageCode` field. */
  languageCode?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `languageName` field. */
  languageName?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `pixelAspectRatio` field. */
  pixelAspectRatio?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `samplingRate` field. */
  samplingRate?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<VideoStreamType>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `width` field. */
  width?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `VideoStream` object types. All fields are combined with a logical ‘and.’ */
export type VideoStreamFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<VideoStreamFilter>>;
  /** Filter by the object’s `bandwidthInBps` field. */
  bandwidthInBps?: InputMaybe<IntFilter>;
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
  /** Filter by the object’s `initialFile` field. */
  initialFile?: InputMaybe<StringFilter>;
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
  bitrateInKbps?: InputMaybe<Scalars['Int']>;
  codecs?: InputMaybe<Scalars['String']>;
  displayAspectRatio?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['String']>;
  fileTemplate?: InputMaybe<Scalars['String']>;
  format: OutputFormat;
  frameRate?: InputMaybe<Scalars['Float']>;
  height?: InputMaybe<Scalars['Int']>;
  iv?: InputMaybe<Scalars['String']>;
  keyId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  label: Scalars['String'];
  languageCode?: InputMaybe<Scalars['String']>;
  languageName?: InputMaybe<Scalars['String']>;
  pixelAspectRatio?: InputMaybe<Scalars['String']>;
  samplingRate?: InputMaybe<Scalars['Int']>;
  type: VideoStreamType;
  videoId: Scalars['UUID'];
  width?: InputMaybe<Scalars['Int']>;
};

/** Represents an update to a `VideoStream`. Fields that are set will be updated. */
export type VideoStreamPatch = {
  bitrateInKbps?: InputMaybe<Scalars['Int']>;
  codecs?: InputMaybe<Scalars['String']>;
  displayAspectRatio?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['String']>;
  fileTemplate?: InputMaybe<Scalars['String']>;
  format?: InputMaybe<OutputFormat>;
  frameRate?: InputMaybe<Scalars['Float']>;
  height?: InputMaybe<Scalars['Int']>;
  iv?: InputMaybe<Scalars['String']>;
  keyId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  label?: InputMaybe<Scalars['String']>;
  languageCode?: InputMaybe<Scalars['String']>;
  languageName?: InputMaybe<Scalars['String']>;
  pixelAspectRatio?: InputMaybe<Scalars['String']>;
  samplingRate?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<VideoStreamType>;
  width?: InputMaybe<Scalars['Int']>;
};

/**
 * A connection to a list of `VideoStream` values.
 * @permissions: VIDEOS_VIEW,VIDEOS_EDIT,VIDEOS_ENCODE,ADMIN
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
  totalCount: Scalars['Int'];
};

/** A `VideoStream` edge in the connection. */
export type VideoStreamsEdge = {
  __typename?: 'VideoStreamsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `VideoStream` at the end of the edge. */
  node: VideoStream;
};

/** Methods to use when ordering `VideoStream`. */
export enum VideoStreamsOrderBy {
  BandwidthInBpsAsc = 'BANDWIDTH_IN_BPS_ASC',
  BandwidthInBpsDesc = 'BANDWIDTH_IN_BPS_DESC',
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
  InitialFileAsc = 'INITIAL_FILE_ASC',
  InitialFileDesc = 'INITIAL_FILE_DESC',
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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

export type VideoSubscriptionPayload = {
  __typename?: 'VideoSubscriptionPayload';
  event?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  video?: Maybe<Video>;
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

export type GetVideosQueryVariables = Exact<{
  filter?: InputMaybe<VideoFilter>;
  cuePointFilter?: InputMaybe<CuePointFilter>;
}>;


export type GetVideosQuery = { __typename?: 'Query', videos?: { __typename?: 'VideosConnection', nodes: Array<{ __typename?: 'Video', id: any, title: string, lengthInSeconds?: number | null, audioLanguages: Array<string | null>, captionLanguages: Array<string | null>, subtitleLanguages: Array<string | null>, dashManifestPath?: string | null, hlsManifestPath?: string | null, isProtected: boolean, outputFormat: OutputFormat, previewStatus: PreviewStatus, encodingState: EncodingState, videosTags: { __typename?: 'VideosTagsConnection', nodes: Array<{ __typename?: 'VideosTag', name: string }> }, videoStreams: { __typename?: 'VideoStreamsConnection', nodes: Array<{ __typename?: 'VideoStream', keyId?: string | null, label: string, format: OutputFormat, file?: string | null, iv?: string | null, languageCode?: string | null, bitrateInKbps?: number | null, type: VideoStreamType, fileTemplate?: string | null, codecs?: string | null, frameRate?: number | null, height?: number | null, width?: number | null, displayAspectRatio?: string | null, pixelAspectRatio?: string | null, samplingRate?: number | null, languageName?: string | null }> }, cuePoints: { __typename?: 'CuePointsConnection', nodes: Array<{ __typename?: 'CuePoint', timeInSeconds: number, cuePointTypeKey: string, value?: string | null }> } }> } | null };


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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetVideosDocumentString = print(GetVideosDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetVideos(variables?: GetVideosQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: GetVideosQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetVideosQuery>(GetVideosDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetVideos', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;