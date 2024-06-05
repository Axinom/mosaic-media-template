import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Cursor: any;
  Datetime: any;
  UUID: any;
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

/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type Channel = {
  __typename?: 'Channel';
  /** Reads and enables pagination through a set of `ChannelImage`. */
  channelImages: ChannelImagesConnection;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  dashStreamUrl?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  hlsStreamUrl?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  isDrmProtected: Scalars['Boolean'];
  keyId?: Maybe<Scalars['String']>;
  placeholderVideoId?: Maybe<Scalars['UUID']>;
  /** Reads and enables pagination through a set of `Playlist`. */
  playlists: PlaylistsConnection;
  publicationState: PublicationState;
  publishedDate?: Maybe<Scalars['Datetime']>;
  publishedUser?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type ChannelChannelImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ChannelImageCondition>;
  filter?: InputMaybe<ChannelImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ChannelImagesOrderBy>>;
};


/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type ChannelPlaylistsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<PlaylistCondition>;
  filter?: InputMaybe<PlaylistFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PlaylistsOrderBy>>;
};

/** A condition to be used against `Channel` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ChannelCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `dashStreamUrl` field. */
  dashStreamUrl?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `hlsStreamUrl` field. */
  hlsStreamUrl?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `isDrmProtected` field. */
  isDrmProtected?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `keyId` field. */
  keyId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `placeholderVideoId` field. */
  placeholderVideoId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `publicationState` field. */
  publicationState?: InputMaybe<PublicationState>;
  /** Checks for equality with the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `Channel` object types. All fields are combined with a logical ‘and.’ */
export type ChannelFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ChannelFilter>>;
  /** Filter by the object’s `channelImages` relation. */
  channelImages?: InputMaybe<ChannelToManyChannelImageFilter>;
  /** Some related `channelImages` exist. */
  channelImagesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `dashStreamUrl` field. */
  dashStreamUrl?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `hlsStreamUrl` field. */
  hlsStreamUrl?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `isDrmProtected` field. */
  isDrmProtected?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `keyId` field. */
  keyId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ChannelFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ChannelFilter>>;
  /** Filter by the object’s `placeholderVideoId` field. */
  placeholderVideoId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `playlists` relation. */
  playlists?: InputMaybe<ChannelToManyPlaylistFilter>;
  /** Some related `playlists` exist. */
  playlistsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `publicationState` field. */
  publicationState?: InputMaybe<PublicationStateFilter>;
  /** Filter by the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type ChannelImage = {
  __typename?: 'ChannelImage';
  /** Reads a single `Channel` that is related to this `ChannelImage`. */
  channel?: Maybe<Channel>;
  channelId: Scalars['UUID'];
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  imageId: Scalars['UUID'];
  imageType: ChannelImageType;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};

/**
 * A condition to be used against `ChannelImage` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ChannelImageCondition = {
  /** Checks for equality with the object’s `channelId` field. */
  channelId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `imageType` field. */
  imageType?: InputMaybe<ChannelImageType>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `ChannelImage` object types. All fields are combined with a logical ‘and.’ */
export type ChannelImageFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ChannelImageFilter>>;
  /** Filter by the object’s `channel` relation. */
  channel?: InputMaybe<ChannelFilter>;
  /** Filter by the object’s `channelId` field. */
  channelId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `imageId` field. */
  imageId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `imageType` field. */
  imageType?: InputMaybe<ChannelImageTypeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ChannelImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ChannelImageFilter>>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `ChannelImage` */
export type ChannelImageInput = {
  channelId: Scalars['UUID'];
  imageId: Scalars['UUID'];
  imageType?: InputMaybe<ChannelImageType>;
};

/** Represents an update to a `ChannelImage`. Fields that are set will be updated. */
export type ChannelImagePatch = {
  imageId?: InputMaybe<Scalars['UUID']>;
};

/**
 * A connection to a list of `ChannelImage` values.
 * @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW
 */
export type ChannelImagesConnection = {
  __typename?: 'ChannelImagesConnection';
  /** A list of edges which contains the `ChannelImage` and cursor to aid in pagination. */
  edges: Array<ChannelImagesEdge>;
  /** A list of `ChannelImage` objects. */
  nodes: Array<ChannelImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ChannelImage` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ChannelImage` edge in the connection. */
export type ChannelImagesEdge = {
  __typename?: 'ChannelImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ChannelImage` at the end of the edge. */
  node: ChannelImage;
};

/** Methods to use when ordering `ChannelImage`. */
export enum ChannelImagesOrderBy {
  ChannelIdAsc = 'CHANNEL_ID_ASC',
  ChannelIdDesc = 'CHANNEL_ID_DESC',
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  ImageTypeAsc = 'IMAGE_TYPE_ASC',
  ImageTypeDesc = 'IMAGE_TYPE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

export enum ChannelImageType {
  /** Logo */
  Logo = 'LOGO'
}

/** A filter to be used against ChannelImageType fields. All fields are combined with a logical ‘and.’ */
export type ChannelImageTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<ChannelImageType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<ChannelImageType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<ChannelImageType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<ChannelImageType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<ChannelImageType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<ChannelImageType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<ChannelImageType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<ChannelImageType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<ChannelImageType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<ChannelImageType>>;
};

/** An input for mutations affecting `Channel` */
export type ChannelInput = {
  description?: InputMaybe<Scalars['String']>;
  isDrmProtected?: InputMaybe<Scalars['Boolean']>;
  placeholderVideoId?: InputMaybe<Scalars['UUID']>;
  title: Scalars['String'];
};

/** Represents an update to a `Channel`. Fields that are set will be updated. */
export type ChannelPatch = {
  description?: InputMaybe<Scalars['String']>;
  isDrmProtected?: InputMaybe<Scalars['Boolean']>;
  placeholderVideoId?: InputMaybe<Scalars['UUID']>;
  title?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `Channel` values.
 * @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW
 */
export type ChannelsConnection = {
  __typename?: 'ChannelsConnection';
  /** A list of edges which contains the `Channel` and cursor to aid in pagination. */
  edges: Array<ChannelsEdge>;
  /** A list of `Channel` objects. */
  nodes: Array<Channel>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Channel` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Channel` edge in the connection. */
export type ChannelsEdge = {
  __typename?: 'ChannelsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Channel` at the end of the edge. */
  node: Channel;
};

/** Methods to use when ordering `Channel`. */
export enum ChannelsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DashStreamUrlAsc = 'DASH_STREAM_URL_ASC',
  DashStreamUrlDesc = 'DASH_STREAM_URL_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  HlsStreamUrlAsc = 'HLS_STREAM_URL_ASC',
  HlsStreamUrlDesc = 'HLS_STREAM_URL_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsDrmProtectedAsc = 'IS_DRM_PROTECTED_ASC',
  IsDrmProtectedDesc = 'IS_DRM_PROTECTED_DESC',
  KeyIdAsc = 'KEY_ID_ASC',
  KeyIdDesc = 'KEY_ID_DESC',
  Natural = 'NATURAL',
  PlaceholderVideoIdAsc = 'PLACEHOLDER_VIDEO_ID_ASC',
  PlaceholderVideoIdDesc = 'PLACEHOLDER_VIDEO_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PublicationStateAsc = 'PUBLICATION_STATE_ASC',
  PublicationStateDesc = 'PUBLICATION_STATE_DESC',
  PublishedDateAsc = 'PUBLISHED_DATE_ASC',
  PublishedDateDesc = 'PUBLISHED_DATE_DESC',
  PublishedUserAsc = 'PUBLISHED_USER_ASC',
  PublishedUserDesc = 'PUBLISHED_USER_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

export enum ChannelSubscriptionEventKey {
  ChannelChanged = 'CHANNEL_CHANGED',
  ChannelCreated = 'CHANNEL_CREATED',
  ChannelDeleted = 'CHANNEL_DELETED',
  ChannelImageChanged = 'CHANNEL_IMAGE_CHANGED',
  ChannelImageCreated = 'CHANNEL_IMAGE_CREATED',
  ChannelImageDeleted = 'CHANNEL_IMAGE_DELETED'
}

export type ChannelSubscriptionPayload = {
  __typename?: 'ChannelSubscriptionPayload';
  channel?: Maybe<Channel>;
  /** @deprecated Use 'eventKey' instead. */
  event?: Maybe<Scalars['String']>;
  eventKey?: Maybe<ChannelSubscriptionEventKey>;
  id: Scalars['UUID'];
};

/** A filter to be used against many `ChannelImage` object types. All fields are combined with a logical ‘and.’ */
export type ChannelToManyChannelImageFilter = {
  /** Every related `ChannelImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ChannelImageFilter>;
  /** No related `ChannelImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ChannelImageFilter>;
  /** Some related `ChannelImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ChannelImageFilter>;
};

/** A filter to be used against many `Playlist` object types. All fields are combined with a logical ‘and.’ */
export type ChannelToManyPlaylistFilter = {
  /** Every related `Playlist` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PlaylistFilter>;
  /** No related `Playlist` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PlaylistFilter>;
  /** Some related `Playlist` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PlaylistFilter>;
};

/** All input for the `createAdCuePointSchedule` mutation. */
export type CreateAdCuePointScheduleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  durationInSeconds?: InputMaybe<Scalars['Float']>;
  programCuePointId?: InputMaybe<Scalars['UUID']>;
  sortIndex?: InputMaybe<Scalars['Int']>;
};

/** The output of our `createAdCuePointSchedule` mutation. */
export type CreateAdCuePointSchedulePayload = {
  __typename?: 'CreateAdCuePointSchedulePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  cuePointSchedule?: Maybe<CuePointSchedule>;
  /** An edge for our `CuePointSchedule`. May be used by Relay 1. */
  cuePointScheduleEdge?: Maybe<CuePointSchedulesEdge>;
  /** Reads a single `ProgramCuePoint` that is related to this `CuePointSchedule`. */
  programCuePoint?: Maybe<ProgramCuePoint>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our `createAdCuePointSchedule` mutation. */
export type CreateAdCuePointSchedulePayloadCuePointScheduleEdgeArgs = {
  orderBy?: InputMaybe<Array<CuePointSchedulesOrderBy>>;
};

/**
 * All input for the create `ChannelImage` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type CreateChannelImageInput = {
  /** The `ChannelImage` to be created by this mutation. */
  channelImage: ChannelImageInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our create `ChannelImage` mutation. */
export type CreateChannelImagePayload = {
  __typename?: 'CreateChannelImagePayload';
  /** Reads a single `Channel` that is related to this `ChannelImage`. */
  channel?: Maybe<Channel>;
  /** The `ChannelImage` that was created by this mutation. */
  channelImage?: Maybe<ChannelImage>;
  /** An edge for our `ChannelImage`. May be used by Relay 1. */
  channelImageEdge?: Maybe<ChannelImagesEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ChannelImage` mutation. */
export type CreateChannelImagePayloadChannelImageEdgeArgs = {
  orderBy?: InputMaybe<Array<ChannelImagesOrderBy>>;
};

/**
 * All input for the create `Channel` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type CreateChannelInput = {
  /** The `Channel` to be created by this mutation. */
  channel: ChannelInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our create `Channel` mutation. */
export type CreateChannelPayload = {
  __typename?: 'CreateChannelPayload';
  /** The `Channel` that was created by this mutation. */
  channel?: Maybe<Channel>;
  /** An edge for our `Channel`. May be used by Relay 1. */
  channelEdge?: Maybe<ChannelsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Channel` mutation. */
export type CreateChannelPayloadChannelEdgeArgs = {
  orderBy?: InputMaybe<Array<ChannelsOrderBy>>;
};

/**
 * All input for the create `Playlist` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type CreatePlaylistInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Playlist` to be created by this mutation. */
  playlist: PlaylistInput;
};

/** The output of our create `Playlist` mutation. */
export type CreatePlaylistPayload = {
  __typename?: 'CreatePlaylistPayload';
  /** Reads a single `Channel` that is related to this `Playlist`. */
  channel?: Maybe<Channel>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Playlist` that was created by this mutation. */
  playlist?: Maybe<Playlist>;
  /** An edge for our `Playlist`. May be used by Relay 1. */
  playlistEdge?: Maybe<PlaylistsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Playlist` mutation. */
export type CreatePlaylistPayloadPlaylistEdgeArgs = {
  orderBy?: InputMaybe<Array<PlaylistsOrderBy>>;
};

/**
 * All input for the create `ProgramCuePoint` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type CreateProgramCuePointInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `ProgramCuePoint` to be created by this mutation. */
  programCuePoint: ProgramCuePointInput;
};

/** The output of our create `ProgramCuePoint` mutation. */
export type CreateProgramCuePointPayload = {
  __typename?: 'CreateProgramCuePointPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Program` that is related to this `ProgramCuePoint`. */
  program?: Maybe<Program>;
  /** The `ProgramCuePoint` that was created by this mutation. */
  programCuePoint?: Maybe<ProgramCuePoint>;
  /** An edge for our `ProgramCuePoint`. May be used by Relay 1. */
  programCuePointEdge?: Maybe<ProgramCuePointsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ProgramCuePoint` mutation. */
export type CreateProgramCuePointPayloadProgramCuePointEdgeArgs = {
  orderBy?: InputMaybe<Array<ProgramCuePointsOrderBy>>;
};

/**
 * All input for the create `Program` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type CreateProgramInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Program` to be created by this mutation. */
  program: ProgramInput;
};

/** The output of our create `Program` mutation. */
export type CreateProgramPayload = {
  __typename?: 'CreateProgramPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Playlist` that is related to this `Program`. */
  playlist?: Maybe<Playlist>;
  /** The `Program` that was created by this mutation. */
  program?: Maybe<Program>;
  /** An edge for our `Program`. May be used by Relay 1. */
  programEdge?: Maybe<ProgramsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Program` mutation. */
export type CreateProgramPayloadProgramEdgeArgs = {
  orderBy?: InputMaybe<Array<ProgramsOrderBy>>;
};

/** All input for the `createVideoCuePointSchedule` mutation. */
export type CreateVideoCuePointScheduleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  durationInSeconds?: InputMaybe<Scalars['Float']>;
  programCuePointId?: InputMaybe<Scalars['UUID']>;
  sortIndex?: InputMaybe<Scalars['Int']>;
  videoId?: InputMaybe<Scalars['UUID']>;
};

/** The output of our `createVideoCuePointSchedule` mutation. */
export type CreateVideoCuePointSchedulePayload = {
  __typename?: 'CreateVideoCuePointSchedulePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  cuePointSchedule?: Maybe<CuePointSchedule>;
  /** An edge for our `CuePointSchedule`. May be used by Relay 1. */
  cuePointScheduleEdge?: Maybe<CuePointSchedulesEdge>;
  /** Reads a single `ProgramCuePoint` that is related to this `CuePointSchedule`. */
  programCuePoint?: Maybe<ProgramCuePoint>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our `createVideoCuePointSchedule` mutation. */
export type CreateVideoCuePointSchedulePayloadCuePointScheduleEdgeArgs = {
  orderBy?: InputMaybe<Array<CuePointSchedulesOrderBy>>;
};

/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type CuePointSchedule = {
  __typename?: 'CuePointSchedule';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  durationInSeconds: Scalars['Float'];
  id: Scalars['UUID'];
  /** Reads a single `ProgramCuePoint` that is related to this `CuePointSchedule`. */
  programCuePoint?: Maybe<ProgramCuePoint>;
  programCuePointId: Scalars['UUID'];
  sortIndex: Scalars['Int'];
  type: CuePointScheduleType;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  videoId?: Maybe<Scalars['UUID']>;
};

/**
 * A condition to be used against `CuePointSchedule` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CuePointScheduleCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /**
   * Checks for equality with the object’s `durationInSeconds` field.
   * @minValue()
   */
  durationInSeconds?: InputMaybe<Scalars['Float']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `programCuePointId` field. */
  programCuePointId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `sortIndex` field. */
  sortIndex?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<CuePointScheduleType>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `CuePointSchedule` object types. All fields are combined with a logical ‘and.’ */
export type CuePointScheduleFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CuePointScheduleFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `durationInSeconds` field. */
  durationInSeconds?: InputMaybe<FloatFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CuePointScheduleFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CuePointScheduleFilter>>;
  /** Filter by the object’s `programCuePoint` relation. */
  programCuePoint?: InputMaybe<ProgramCuePointFilter>;
  /** Filter by the object’s `programCuePointId` field. */
  programCuePointId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `sortIndex` field. */
  sortIndex?: InputMaybe<IntFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<CuePointScheduleTypeFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
};

/**
 * A connection to a list of `CuePointSchedule` values.
 * @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW
 */
export type CuePointSchedulesConnection = {
  __typename?: 'CuePointSchedulesConnection';
  /** A list of edges which contains the `CuePointSchedule` and cursor to aid in pagination. */
  edges: Array<CuePointSchedulesEdge>;
  /** A list of `CuePointSchedule` objects. */
  nodes: Array<CuePointSchedule>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CuePointSchedule` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `CuePointSchedule` edge in the connection. */
export type CuePointSchedulesEdge = {
  __typename?: 'CuePointSchedulesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `CuePointSchedule` at the end of the edge. */
  node: CuePointSchedule;
};

/** Methods to use when ordering `CuePointSchedule`. */
export enum CuePointSchedulesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DurationInSecondsAsc = 'DURATION_IN_SECONDS_ASC',
  DurationInSecondsDesc = 'DURATION_IN_SECONDS_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProgramCuePointIdAsc = 'PROGRAM_CUE_POINT_ID_ASC',
  ProgramCuePointIdDesc = 'PROGRAM_CUE_POINT_ID_DESC',
  SortIndexAsc = 'SORT_INDEX_ASC',
  SortIndexDesc = 'SORT_INDEX_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

export enum CuePointScheduleType {
  /** Ad pod */
  AdPod = 'AD_POD',
  /** Video */
  Video = 'VIDEO'
}

/** A filter to be used against CuePointScheduleType fields. All fields are combined with a logical ‘and.’ */
export type CuePointScheduleTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<CuePointScheduleType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<CuePointScheduleType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<CuePointScheduleType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<CuePointScheduleType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<CuePointScheduleType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<CuePointScheduleType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<CuePointScheduleType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<CuePointScheduleType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<CuePointScheduleType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<CuePointScheduleType>>;
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
 * All input for the `deleteChannelImage` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type DeleteChannelImageByChannelIdAndImageTypeInput = {
  channelId: Scalars['UUID'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageType: ChannelImageType;
};

/**
 * All input for the `deleteChannelImageByIds` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type DeleteChannelImageInput = {
  channelId: Scalars['UUID'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageId: Scalars['UUID'];
};

/** The output of our delete `ChannelImage` mutation. */
export type DeleteChannelImagePayload = {
  __typename?: 'DeleteChannelImagePayload';
  /** Reads a single `Channel` that is related to this `ChannelImage`. */
  channel?: Maybe<Channel>;
  /** The `ChannelImage` that was deleted by this mutation. */
  channelImage?: Maybe<ChannelImage>;
  /** An edge for our `ChannelImage`. May be used by Relay 1. */
  channelImageEdge?: Maybe<ChannelImagesEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ChannelImage` mutation. */
export type DeleteChannelImagePayloadChannelImageEdgeArgs = {
  orderBy?: InputMaybe<Array<ChannelImagesOrderBy>>;
};

/**
 * All input for the `deleteChannel` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type DeleteChannelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `Channel` mutation. */
export type DeleteChannelPayload = {
  __typename?: 'DeleteChannelPayload';
  /** The `Channel` that was deleted by this mutation. */
  channel?: Maybe<Channel>;
  /** An edge for our `Channel`. May be used by Relay 1. */
  channelEdge?: Maybe<ChannelsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Channel` mutation. */
export type DeleteChannelPayloadChannelEdgeArgs = {
  orderBy?: InputMaybe<Array<ChannelsOrderBy>>;
};

/**
 * All input for the `deleteCuePointSchedule` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type DeleteCuePointScheduleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `CuePointSchedule` mutation. */
export type DeleteCuePointSchedulePayload = {
  __typename?: 'DeleteCuePointSchedulePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `CuePointSchedule` that was deleted by this mutation. */
  cuePointSchedule?: Maybe<CuePointSchedule>;
  /** An edge for our `CuePointSchedule`. May be used by Relay 1. */
  cuePointScheduleEdge?: Maybe<CuePointSchedulesEdge>;
  /** Reads a single `ProgramCuePoint` that is related to this `CuePointSchedule`. */
  programCuePoint?: Maybe<ProgramCuePoint>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `CuePointSchedule` mutation. */
export type DeleteCuePointSchedulePayloadCuePointScheduleEdgeArgs = {
  orderBy?: InputMaybe<Array<CuePointSchedulesOrderBy>>;
};

/**
 * All input for the `deletePlaylist` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type DeletePlaylistInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `Playlist` mutation. */
export type DeletePlaylistPayload = {
  __typename?: 'DeletePlaylistPayload';
  /** Reads a single `Channel` that is related to this `Playlist`. */
  channel?: Maybe<Channel>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Playlist` that was deleted by this mutation. */
  playlist?: Maybe<Playlist>;
  /** An edge for our `Playlist`. May be used by Relay 1. */
  playlistEdge?: Maybe<PlaylistsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Playlist` mutation. */
export type DeletePlaylistPayloadPlaylistEdgeArgs = {
  orderBy?: InputMaybe<Array<PlaylistsOrderBy>>;
};

/**
 * All input for the `deleteProgramCuePoint` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type DeleteProgramCuePointInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `ProgramCuePoint` mutation. */
export type DeleteProgramCuePointPayload = {
  __typename?: 'DeleteProgramCuePointPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Program` that is related to this `ProgramCuePoint`. */
  program?: Maybe<Program>;
  /** The `ProgramCuePoint` that was deleted by this mutation. */
  programCuePoint?: Maybe<ProgramCuePoint>;
  /** An edge for our `ProgramCuePoint`. May be used by Relay 1. */
  programCuePointEdge?: Maybe<ProgramCuePointsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ProgramCuePoint` mutation. */
export type DeleteProgramCuePointPayloadProgramCuePointEdgeArgs = {
  orderBy?: InputMaybe<Array<ProgramCuePointsOrderBy>>;
};

/**
 * All input for the `deleteProgram` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type DeleteProgramInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
};

/** The output of our delete `Program` mutation. */
export type DeleteProgramPayload = {
  __typename?: 'DeleteProgramPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Playlist` that is related to this `Program`. */
  playlist?: Maybe<Playlist>;
  /** The `Program` that was deleted by this mutation. */
  program?: Maybe<Program>;
  /** An edge for our `Program`. May be used by Relay 1. */
  programEdge?: Maybe<ProgramsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Program` mutation. */
export type DeleteProgramPayloadProgramEdgeArgs = {
  orderBy?: InputMaybe<Array<ProgramsOrderBy>>;
};

export enum EntityType {
  /** Episode */
  Episode = 'EPISODE',
  /** Movie */
  Movie = 'MOVIE'
}

/** A filter to be used against EntityType fields. All fields are combined with a logical ‘and.’ */
export type EntityTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<EntityType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<EntityType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<EntityType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<EntityType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<EntityType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<EntityType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<EntityType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<EntityType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<EntityType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<EntityType>>;
};

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
  createAdCuePointSchedule?: Maybe<CreateAdCuePointSchedulePayload>;
  /** Creates a single `Channel`. */
  createChannel?: Maybe<CreateChannelPayload>;
  /** Creates a single `ChannelImage`. */
  createChannelImage?: Maybe<CreateChannelImagePayload>;
  /** Creates a single `Playlist`. */
  createPlaylist?: Maybe<CreatePlaylistPayload>;
  /** Creates a single `Program`. */
  createProgram?: Maybe<CreateProgramPayload>;
  /** Creates a single `ProgramCuePoint`. */
  createProgramCuePoint?: Maybe<CreateProgramCuePointPayload>;
  createVideoCuePointSchedule?: Maybe<CreateVideoCuePointSchedulePayload>;
  /** Deletes a single `Channel` using a unique key. */
  deleteChannel?: Maybe<DeleteChannelPayload>;
  /** Deletes a single `ChannelImage` using a unique key. */
  deleteChannelImage?: Maybe<DeleteChannelImagePayload>;
  /** Deletes a single `ChannelImage` using a unique key. */
  deleteChannelImageByIds?: Maybe<DeleteChannelImagePayload>;
  /** Deletes a single `CuePointSchedule` using a unique key. */
  deleteCuePointSchedule?: Maybe<DeleteCuePointSchedulePayload>;
  /** Deletes a single `Playlist` using a unique key. */
  deletePlaylist?: Maybe<DeletePlaylistPayload>;
  /** Deletes a single `Program` using a unique key. */
  deleteProgram?: Maybe<DeleteProgramPayload>;
  /** Deletes a single `ProgramCuePoint` using a unique key. */
  deleteProgramCuePoint?: Maybe<DeleteProgramCuePointPayload>;
  /** Publish a channel. */
  publishChannel: PublishChannelPayload;
  /** Publish a playlist. */
  publishPlaylist: PublishPlaylistPayload;
  /** Unpublish a channel. The channel must be published. */
  unpublishChannel?: Maybe<UnpublishChannelPayload>;
  /** Unpublish a playlist. The playlist must be published. */
  unpublishPlaylist?: Maybe<UnpublishPlaylistPayload>;
  updateAdCuePointSchedule?: Maybe<UpdateAdCuePointSchedulePayload>;
  /** Updates a single `Channel` using a unique key and a patch. */
  updateChannel?: Maybe<UpdateChannelPayload>;
  /** Updates a single `ChannelImage` using a unique key and a patch. */
  updateChannelImage?: Maybe<UpdateChannelImagePayload>;
  /** Updates a single `ChannelImage` using a unique key and a patch. */
  updateChannelImageByIds?: Maybe<UpdateChannelImagePayload>;
  /** Updates a single `Playlist` using a unique key and a patch. */
  updatePlaylist?: Maybe<UpdatePlaylistPayload>;
  /** Updates a single `Program` using a unique key and a patch. */
  updateProgram?: Maybe<UpdateProgramPayload>;
  /** Updates a single `ProgramCuePoint` using a unique key and a patch. */
  updateProgramCuePoint?: Maybe<UpdateProgramCuePointPayload>;
  updateVideoCuePointSchedule?: Maybe<UpdateVideoCuePointSchedulePayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAdCuePointScheduleArgs = {
  input: CreateAdCuePointScheduleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateChannelArgs = {
  input: CreateChannelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateChannelImageArgs = {
  input: CreateChannelImageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePlaylistArgs = {
  input: CreatePlaylistInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProgramArgs = {
  input: CreateProgramInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProgramCuePointArgs = {
  input: CreateProgramCuePointInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateVideoCuePointScheduleArgs = {
  input: CreateVideoCuePointScheduleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChannelArgs = {
  input: DeleteChannelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChannelImageArgs = {
  input: DeleteChannelImageByChannelIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChannelImageByIdsArgs = {
  input: DeleteChannelImageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCuePointScheduleArgs = {
  input: DeleteCuePointScheduleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePlaylistArgs = {
  input: DeletePlaylistInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProgramArgs = {
  input: DeleteProgramInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProgramCuePointArgs = {
  input: DeleteProgramCuePointInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishChannelArgs = {
  input: PublishChannelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishPlaylistArgs = {
  input: PublishPlaylistInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishChannelArgs = {
  input: UnpublishChannelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishPlaylistArgs = {
  input: UnpublishPlaylistInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAdCuePointScheduleArgs = {
  input: UpdateAdCuePointScheduleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChannelArgs = {
  input: UpdateChannelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChannelImageArgs = {
  input: UpdateChannelImageByChannelIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChannelImageByIdsArgs = {
  input: UpdateChannelImageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePlaylistArgs = {
  input: UpdatePlaylistInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProgramArgs = {
  input: UpdateProgramInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProgramCuePointArgs = {
  input: UpdateProgramCuePointInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVideoCuePointScheduleArgs = {
  input: UpdateVideoCuePointScheduleInput;
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

/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type Playlist = {
  __typename?: 'Playlist';
  calculatedDurationInSeconds: Scalars['Float'];
  calculatedEndDateTime?: Maybe<Scalars['Datetime']>;
  /** Reads a single `Channel` that is related to this `Playlist`. */
  channel?: Maybe<Channel>;
  channelId: Scalars['UUID'];
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  id: Scalars['UUID'];
  /** Reads and enables pagination through a set of `Program`. */
  programs: ProgramsConnection;
  publicationState: PublicationState;
  publishedDate?: Maybe<Scalars['Datetime']>;
  publishedUser?: Maybe<Scalars['String']>;
  startDateTime: Scalars['Datetime'];
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type PlaylistProgramsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ProgramCondition>;
  filter?: InputMaybe<ProgramFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ProgramsOrderBy>>;
};

/**
 * A condition to be used against `Playlist` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PlaylistCondition = {
  /** Checks for equality with the object’s `calculatedDurationInSeconds` field. */
  calculatedDurationInSeconds?: InputMaybe<Scalars['Float']>;
  /** Checks for equality with the object’s `channelId` field. */
  channelId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `publicationState` field. */
  publicationState?: InputMaybe<PublicationState>;
  /** Checks for equality with the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `startDateTime` field. */
  startDateTime?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `Playlist` object types. All fields are combined with a logical ‘and.’ */
export type PlaylistFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PlaylistFilter>>;
  /** Filter by the object’s `calculatedDurationInSeconds` field. */
  calculatedDurationInSeconds?: InputMaybe<FloatFilter>;
  /** Filter by the object’s `calculatedEndDateTime` field. */
  calculatedEndDateTime?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `channel` relation. */
  channel?: InputMaybe<ChannelFilter>;
  /** Filter by the object’s `channelId` field. */
  channelId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PlaylistFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<PlaylistFilter>>;
  /** Filter by the object’s `programs` relation. */
  programs?: InputMaybe<PlaylistToManyProgramFilter>;
  /** Some related `programs` exist. */
  programsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `publicationState` field. */
  publicationState?: InputMaybe<PublicationStateFilter>;
  /** Filter by the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `startDateTime` field. */
  startDateTime?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Playlist` */
export type PlaylistInput = {
  calculatedDurationInSeconds: Scalars['Float'];
  channelId: Scalars['UUID'];
  startDateTime: Scalars['Datetime'];
  title: Scalars['String'];
};

/** Represents an update to a `Playlist`. Fields that are set will be updated. */
export type PlaylistPatch = {
  calculatedDurationInSeconds?: InputMaybe<Scalars['Float']>;
  startDateTime?: InputMaybe<Scalars['Datetime']>;
  title?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `Playlist` values.
 * @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW
 */
export type PlaylistsConnection = {
  __typename?: 'PlaylistsConnection';
  /** A list of edges which contains the `Playlist` and cursor to aid in pagination. */
  edges: Array<PlaylistsEdge>;
  /** A list of `Playlist` objects. */
  nodes: Array<Playlist>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Playlist` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Playlist` edge in the connection. */
export type PlaylistsEdge = {
  __typename?: 'PlaylistsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Playlist` at the end of the edge. */
  node: Playlist;
};

/** Methods to use when ordering `Playlist`. */
export enum PlaylistsOrderBy {
  CalculatedDurationInSecondsAsc = 'CALCULATED_DURATION_IN_SECONDS_ASC',
  CalculatedDurationInSecondsDesc = 'CALCULATED_DURATION_IN_SECONDS_DESC',
  ChannelIdAsc = 'CHANNEL_ID_ASC',
  ChannelIdDesc = 'CHANNEL_ID_DESC',
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PublicationStateAsc = 'PUBLICATION_STATE_ASC',
  PublicationStateDesc = 'PUBLICATION_STATE_DESC',
  PublishedDateAsc = 'PUBLISHED_DATE_ASC',
  PublishedDateDesc = 'PUBLISHED_DATE_DESC',
  PublishedUserAsc = 'PUBLISHED_USER_ASC',
  PublishedUserDesc = 'PUBLISHED_USER_DESC',
  StartDateTimeAsc = 'START_DATE_TIME_ASC',
  StartDateTimeDesc = 'START_DATE_TIME_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

export enum PlaylistSubscriptionEventKey {
  PlaylistChanged = 'PLAYLIST_CHANGED',
  PlaylistCreated = 'PLAYLIST_CREATED',
  PlaylistDeleted = 'PLAYLIST_DELETED',
  PlaylistProgramChanged = 'PLAYLIST_PROGRAM_CHANGED',
  PlaylistProgramCreated = 'PLAYLIST_PROGRAM_CREATED',
  PlaylistProgramDeleted = 'PLAYLIST_PROGRAM_DELETED'
}

export type PlaylistSubscriptionPayload = {
  __typename?: 'PlaylistSubscriptionPayload';
  /** @deprecated Use 'eventKey' instead. */
  event?: Maybe<Scalars['String']>;
  eventKey?: Maybe<PlaylistSubscriptionEventKey>;
  id: Scalars['UUID'];
  playlist?: Maybe<Playlist>;
};

/** A filter to be used against many `Program` object types. All fields are combined with a logical ‘and.’ */
export type PlaylistToManyProgramFilter = {
  /** Every related `Program` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ProgramFilter>;
  /** No related `Program` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ProgramFilter>;
  /** Some related `Program` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ProgramFilter>;
};

/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type Program = {
  __typename?: 'Program';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  entityId: Scalars['String'];
  entityType: EntityType;
  id: Scalars['UUID'];
  imageId?: Maybe<Scalars['UUID']>;
  /** Reads a single `Playlist` that is related to this `Program`. */
  playlist?: Maybe<Playlist>;
  playlistId: Scalars['UUID'];
  /** Reads and enables pagination through a set of `ProgramCuePoint`. */
  programCuePoints: ProgramCuePointsConnection;
  sortIndex: Scalars['Int'];
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  videoDurationInSeconds: Scalars['Float'];
  videoId: Scalars['UUID'];
};


/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type ProgramProgramCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ProgramCuePointCondition>;
  filter?: InputMaybe<ProgramCuePointFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ProgramCuePointsOrderBy>>;
};

export enum ProgramBreakType {
  /** Mid */
  Mid = 'MID',
  /** Post */
  Post = 'POST',
  /** Pre */
  Pre = 'PRE'
}

/** A filter to be used against ProgramBreakType fields. All fields are combined with a logical ‘and.’ */
export type ProgramBreakTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<ProgramBreakType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<ProgramBreakType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<ProgramBreakType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<ProgramBreakType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<ProgramBreakType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<ProgramBreakType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<ProgramBreakType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<ProgramBreakType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<ProgramBreakType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<ProgramBreakType>>;
};

/** A condition to be used against `Program` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProgramCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `entityId` field. */
  entityId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `entityType` field. */
  entityType?: InputMaybe<EntityType>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `playlistId` field. */
  playlistId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `sortIndex` field. */
  sortIndex?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `videoDurationInSeconds` field. */
  videoDurationInSeconds?: InputMaybe<Scalars['Float']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']>;
};

/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type ProgramCuePoint = {
  __typename?: 'ProgramCuePoint';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads and enables pagination through a set of `CuePointSchedule`. */
  cuePointSchedules: CuePointSchedulesConnection;
  id: Scalars['UUID'];
  /** Reads a single `Program` that is related to this `ProgramCuePoint`. */
  program?: Maybe<Program>;
  programId: Scalars['UUID'];
  timeInSeconds?: Maybe<Scalars['Float']>;
  type: ProgramBreakType;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  value?: Maybe<Scalars['String']>;
  videoCuePointId?: Maybe<Scalars['UUID']>;
};


/** @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW */
export type ProgramCuePointCuePointSchedulesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CuePointScheduleCondition>;
  filter?: InputMaybe<CuePointScheduleFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CuePointSchedulesOrderBy>>;
};

/**
 * A condition to be used against `ProgramCuePoint` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ProgramCuePointCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `programId` field. */
  programId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `timeInSeconds` field. */
  timeInSeconds?: InputMaybe<Scalars['Float']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<ProgramBreakType>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `value` field. */
  value?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `videoCuePointId` field. */
  videoCuePointId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `ProgramCuePoint` object types. All fields are combined with a logical ‘and.’ */
export type ProgramCuePointFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProgramCuePointFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `cuePointSchedules` relation. */
  cuePointSchedules?: InputMaybe<ProgramCuePointToManyCuePointScheduleFilter>;
  /** Some related `cuePointSchedules` exist. */
  cuePointSchedulesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProgramCuePointFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProgramCuePointFilter>>;
  /** Filter by the object’s `program` relation. */
  program?: InputMaybe<ProgramFilter>;
  /** Filter by the object’s `programId` field. */
  programId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `timeInSeconds` field. */
  timeInSeconds?: InputMaybe<FloatFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<ProgramBreakTypeFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `value` field. */
  value?: InputMaybe<StringFilter>;
  /** Filter by the object’s `videoCuePointId` field. */
  videoCuePointId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `ProgramCuePoint` */
export type ProgramCuePointInput = {
  programId: Scalars['UUID'];
  timeInSeconds?: InputMaybe<Scalars['Float']>;
  type: ProgramBreakType;
  value?: InputMaybe<Scalars['String']>;
  videoCuePointId?: InputMaybe<Scalars['UUID']>;
};

/** Represents an update to a `ProgramCuePoint`. Fields that are set will be updated. */
export type ProgramCuePointPatch = {
  programId?: InputMaybe<Scalars['UUID']>;
  timeInSeconds?: InputMaybe<Scalars['Float']>;
  type?: InputMaybe<ProgramBreakType>;
  value?: InputMaybe<Scalars['String']>;
  videoCuePointId?: InputMaybe<Scalars['UUID']>;
};

/**
 * A connection to a list of `ProgramCuePoint` values.
 * @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW
 */
export type ProgramCuePointsConnection = {
  __typename?: 'ProgramCuePointsConnection';
  /** A list of edges which contains the `ProgramCuePoint` and cursor to aid in pagination. */
  edges: Array<ProgramCuePointsEdge>;
  /** A list of `ProgramCuePoint` objects. */
  nodes: Array<ProgramCuePoint>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ProgramCuePoint` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ProgramCuePoint` edge in the connection. */
export type ProgramCuePointsEdge = {
  __typename?: 'ProgramCuePointsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ProgramCuePoint` at the end of the edge. */
  node: ProgramCuePoint;
};

/** Methods to use when ordering `ProgramCuePoint`. */
export enum ProgramCuePointsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProgramIdAsc = 'PROGRAM_ID_ASC',
  ProgramIdDesc = 'PROGRAM_ID_DESC',
  TimeInSecondsAsc = 'TIME_IN_SECONDS_ASC',
  TimeInSecondsDesc = 'TIME_IN_SECONDS_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC',
  VideoCuePointIdAsc = 'VIDEO_CUE_POINT_ID_ASC',
  VideoCuePointIdDesc = 'VIDEO_CUE_POINT_ID_DESC'
}

/** A filter to be used against many `CuePointSchedule` object types. All fields are combined with a logical ‘and.’ */
export type ProgramCuePointToManyCuePointScheduleFilter = {
  /** Every related `CuePointSchedule` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CuePointScheduleFilter>;
  /** No related `CuePointSchedule` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CuePointScheduleFilter>;
  /** Some related `CuePointSchedule` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CuePointScheduleFilter>;
};

/** A filter to be used against `Program` object types. All fields are combined with a logical ‘and.’ */
export type ProgramFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProgramFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `entityId` field. */
  entityId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `entityType` field. */
  entityType?: InputMaybe<EntityTypeFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `imageId` field. */
  imageId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProgramFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProgramFilter>>;
  /** Filter by the object’s `playlist` relation. */
  playlist?: InputMaybe<PlaylistFilter>;
  /** Filter by the object’s `playlistId` field. */
  playlistId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `programCuePoints` relation. */
  programCuePoints?: InputMaybe<ProgramToManyProgramCuePointFilter>;
  /** Some related `programCuePoints` exist. */
  programCuePointsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `sortIndex` field. */
  sortIndex?: InputMaybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `videoDurationInSeconds` field. */
  videoDurationInSeconds?: InputMaybe<FloatFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Program` */
export type ProgramInput = {
  entityId: Scalars['String'];
  entityType: EntityType;
  imageId?: InputMaybe<Scalars['UUID']>;
  playlistId: Scalars['UUID'];
  sortIndex: Scalars['Int'];
  title: Scalars['String'];
  videoDurationInSeconds: Scalars['Float'];
  videoId: Scalars['UUID'];
};

/** Represents an update to a `Program`. Fields that are set will be updated. */
export type ProgramPatch = {
  sortIndex?: InputMaybe<Scalars['Int']>;
  title?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `Program` values.
 * @permissions: ADMIN,CHANNELS_EDIT,CHANNELS_VIEW
 */
export type ProgramsConnection = {
  __typename?: 'ProgramsConnection';
  /** A list of edges which contains the `Program` and cursor to aid in pagination. */
  edges: Array<ProgramsEdge>;
  /** A list of `Program` objects. */
  nodes: Array<Program>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Program` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Program` edge in the connection. */
export type ProgramsEdge = {
  __typename?: 'ProgramsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Program` at the end of the edge. */
  node: Program;
};

/** Methods to use when ordering `Program`. */
export enum ProgramsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  EntityIdAsc = 'ENTITY_ID_ASC',
  EntityIdDesc = 'ENTITY_ID_DESC',
  EntityTypeAsc = 'ENTITY_TYPE_ASC',
  EntityTypeDesc = 'ENTITY_TYPE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  Natural = 'NATURAL',
  PlaylistIdAsc = 'PLAYLIST_ID_ASC',
  PlaylistIdDesc = 'PLAYLIST_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SortIndexAsc = 'SORT_INDEX_ASC',
  SortIndexDesc = 'SORT_INDEX_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  VideoDurationInSecondsAsc = 'VIDEO_DURATION_IN_SECONDS_ASC',
  VideoDurationInSecondsDesc = 'VIDEO_DURATION_IN_SECONDS_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** A filter to be used against many `ProgramCuePoint` object types. All fields are combined with a logical ‘and.’ */
export type ProgramToManyProgramCuePointFilter = {
  /** Every related `ProgramCuePoint` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ProgramCuePointFilter>;
  /** No related `ProgramCuePoint` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ProgramCuePointFilter>;
  /** Some related `ProgramCuePoint` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ProgramCuePointFilter>;
};

export enum PublicationState {
  /** Changed */
  Changed = 'CHANGED',
  /** Not Published */
  NotPublished = 'NOT_PUBLISHED',
  /** Published */
  Published = 'PUBLISHED'
}

/** A filter to be used against PublicationState fields. All fields are combined with a logical ‘and.’ */
export type PublicationStateFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<PublicationState>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<PublicationState>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<PublicationState>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<PublicationState>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<PublicationState>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<PublicationState>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<PublicationState>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<PublicationState>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<PublicationState>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<PublicationState>>;
};

/** The input details to publish the channel. */
export type PublishChannelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Unique Identifier of the channel to publish. */
  id: Scalars['UUID'];
  /** A publish hash to ensure no changes have occurred since the publish validation. */
  publishHash: Scalars['String'];
};

/** The published channel. */
export type PublishChannelPayload = {
  __typename?: 'PublishChannelPayload';
  /** The published channel. */
  channel: Channel;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  query?: Maybe<Query>;
};

/** The input details to publish playlist. */
export type PublishPlaylistInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Unique Identifier of the playlist to publish. */
  id: Scalars['UUID'];
  /** A publish hash to ensure no changes have occurred since validation. */
  publishHash: Scalars['String'];
};

/** The playlist published in defined format. */
export type PublishPlaylistPayload = {
  __typename?: 'PublishPlaylistPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The published playlist. */
  playlist: Playlist;
  query?: Maybe<Query>;
};

export enum PublishValidationContext {
  Images = 'IMAGES',
  Localization = 'LOCALIZATION',
  Metadata = 'METADATA',
  Videos = 'VIDEOS'
}

export type PublishValidationMessage = {
  __typename?: 'PublishValidationMessage';
  context: PublishValidationContext;
  message: Scalars['String'];
  severity: PublishValidationSeverity;
};

export enum PublishValidationSeverity {
  Error = 'ERROR',
  Warning = 'WARNING'
}

export enum PublishValidationStatus {
  Errors = 'ERRORS',
  Ok = 'OK',
  Warnings = 'WARNINGS'
}

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  channel?: Maybe<Channel>;
  channelImage?: Maybe<ChannelImage>;
  /** Reads and enables pagination through a set of `ChannelImage`. */
  channelImages?: Maybe<ChannelImagesConnection>;
  /** Reads and enables pagination through a set of `Channel`. */
  channels?: Maybe<ChannelsConnection>;
  cuePointSchedule?: Maybe<CuePointSchedule>;
  /** Reads and enables pagination through a set of `CuePointSchedule`. */
  cuePointSchedules?: Maybe<CuePointSchedulesConnection>;
  playlist?: Maybe<Playlist>;
  /** Reads and enables pagination through a set of `Playlist`. */
  playlists?: Maybe<PlaylistsConnection>;
  program?: Maybe<Program>;
  programCuePoint?: Maybe<ProgramCuePoint>;
  /** Reads and enables pagination through a set of `ProgramCuePoint`. */
  programCuePoints?: Maybe<ProgramCuePointsConnection>;
  /** Reads and enables pagination through a set of `Program`. */
  programs?: Maybe<ProgramsConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Validate a channel prior to publication. */
  validateChannel?: Maybe<ValidationChannelPayload>;
  /** Validate a playlist prior to publication. */
  validatePlaylist?: Maybe<ValidationPlaylistPayload>;
};


/** The root query type which gives access points into the data universe. */
export type QueryChannelArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryChannelImageArgs = {
  channelId: Scalars['UUID'];
  imageType: ChannelImageType;
};


/** The root query type which gives access points into the data universe. */
export type QueryChannelImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ChannelImageCondition>;
  filter?: InputMaybe<ChannelImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ChannelImagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryChannelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ChannelCondition>;
  filter?: InputMaybe<ChannelFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ChannelsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCuePointScheduleArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCuePointSchedulesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CuePointScheduleCondition>;
  filter?: InputMaybe<CuePointScheduleFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CuePointSchedulesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPlaylistArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPlaylistsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<PlaylistCondition>;
  filter?: InputMaybe<PlaylistFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PlaylistsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryProgramArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProgramCuePointArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProgramCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ProgramCuePointCondition>;
  filter?: InputMaybe<ProgramCuePointFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ProgramCuePointsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryProgramsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ProgramCondition>;
  filter?: InputMaybe<ProgramFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ProgramsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryValidateChannelArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryValidatePlaylistArgs = {
  id: Scalars['UUID'];
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
  /** Triggered when a Channel is mutated (insert, update or delete).  */
  channelMutated?: Maybe<ChannelSubscriptionPayload>;
  /** Triggered when a Playlist is mutated (insert, update or delete).  */
  playlistMutated?: Maybe<PlaylistSubscriptionPayload>;
};

/** The input details to unpublish the channel. */
export type UnpublishChannelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Unique Identifier of the channel to unpublish. */
  id: Scalars['UUID'];
};

export type UnpublishChannelPayload = {
  __typename?: 'UnpublishChannelPayload';
  /** The unpublished channel. */
  channel?: Maybe<Channel>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  query?: Maybe<Query>;
};

/** The input details to unpublish playlist. */
export type UnpublishPlaylistInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** Unique Identifier of the playlist to unpublish. */
  id: Scalars['UUID'];
};

export type UnpublishPlaylistPayload = {
  __typename?: 'UnpublishPlaylistPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The unpublished playlist. */
  playlist?: Maybe<Playlist>;
  query?: Maybe<Query>;
};

/** All input for the `updateAdCuePointSchedule` mutation. */
export type UpdateAdCuePointScheduleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  durationInSeconds?: InputMaybe<Scalars['Float']>;
  id?: InputMaybe<Scalars['UUID']>;
  programCuePointId?: InputMaybe<Scalars['UUID']>;
  sortIndex?: InputMaybe<Scalars['Int']>;
};

/** The output of our `updateAdCuePointSchedule` mutation. */
export type UpdateAdCuePointSchedulePayload = {
  __typename?: 'UpdateAdCuePointSchedulePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  cuePointSchedule?: Maybe<CuePointSchedule>;
  /** An edge for our `CuePointSchedule`. May be used by Relay 1. */
  cuePointScheduleEdge?: Maybe<CuePointSchedulesEdge>;
  /** Reads a single `ProgramCuePoint` that is related to this `CuePointSchedule`. */
  programCuePoint?: Maybe<ProgramCuePoint>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our `updateAdCuePointSchedule` mutation. */
export type UpdateAdCuePointSchedulePayloadCuePointScheduleEdgeArgs = {
  orderBy?: InputMaybe<Array<CuePointSchedulesOrderBy>>;
};

/**
 * All input for the `updateChannelImage` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type UpdateChannelImageByChannelIdAndImageTypeInput = {
  channelId: Scalars['UUID'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageType: ChannelImageType;
  /** An object where the defined keys will be set on the `ChannelImage` being updated. */
  patch: ChannelImagePatch;
};

/**
 * All input for the `updateChannelImageByIds` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type UpdateChannelImageInput = {
  channelId: Scalars['UUID'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageId: Scalars['UUID'];
  /** An object where the defined keys will be set on the `ChannelImage` being updated. */
  patch: ChannelImagePatch;
};

/** The output of our update `ChannelImage` mutation. */
export type UpdateChannelImagePayload = {
  __typename?: 'UpdateChannelImagePayload';
  /** Reads a single `Channel` that is related to this `ChannelImage`. */
  channel?: Maybe<Channel>;
  /** The `ChannelImage` that was updated by this mutation. */
  channelImage?: Maybe<ChannelImage>;
  /** An edge for our `ChannelImage`. May be used by Relay 1. */
  channelImageEdge?: Maybe<ChannelImagesEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ChannelImage` mutation. */
export type UpdateChannelImagePayloadChannelImageEdgeArgs = {
  orderBy?: InputMaybe<Array<ChannelImagesOrderBy>>;
};

/**
 * All input for the `updateChannel` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type UpdateChannelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** An object where the defined keys will be set on the `Channel` being updated. */
  patch: ChannelPatch;
};

/** The output of our update `Channel` mutation. */
export type UpdateChannelPayload = {
  __typename?: 'UpdateChannelPayload';
  /** The `Channel` that was updated by this mutation. */
  channel?: Maybe<Channel>;
  /** An edge for our `Channel`. May be used by Relay 1. */
  channelEdge?: Maybe<ChannelsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Channel` mutation. */
export type UpdateChannelPayloadChannelEdgeArgs = {
  orderBy?: InputMaybe<Array<ChannelsOrderBy>>;
};

/**
 * All input for the `updatePlaylist` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type UpdatePlaylistInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** An object where the defined keys will be set on the `Playlist` being updated. */
  patch: PlaylistPatch;
};

/** The output of our update `Playlist` mutation. */
export type UpdatePlaylistPayload = {
  __typename?: 'UpdatePlaylistPayload';
  /** Reads a single `Channel` that is related to this `Playlist`. */
  channel?: Maybe<Channel>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Playlist` that was updated by this mutation. */
  playlist?: Maybe<Playlist>;
  /** An edge for our `Playlist`. May be used by Relay 1. */
  playlistEdge?: Maybe<PlaylistsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Playlist` mutation. */
export type UpdatePlaylistPayloadPlaylistEdgeArgs = {
  orderBy?: InputMaybe<Array<PlaylistsOrderBy>>;
};

/**
 * All input for the `updateProgramCuePoint` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type UpdateProgramCuePointInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** An object where the defined keys will be set on the `ProgramCuePoint` being updated. */
  patch: ProgramCuePointPatch;
};

/** The output of our update `ProgramCuePoint` mutation. */
export type UpdateProgramCuePointPayload = {
  __typename?: 'UpdateProgramCuePointPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Program` that is related to this `ProgramCuePoint`. */
  program?: Maybe<Program>;
  /** The `ProgramCuePoint` that was updated by this mutation. */
  programCuePoint?: Maybe<ProgramCuePoint>;
  /** An edge for our `ProgramCuePoint`. May be used by Relay 1. */
  programCuePointEdge?: Maybe<ProgramCuePointsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ProgramCuePoint` mutation. */
export type UpdateProgramCuePointPayloadProgramCuePointEdgeArgs = {
  orderBy?: InputMaybe<Array<ProgramCuePointsOrderBy>>;
};

/**
 * All input for the `updateProgram` mutation.
 * @permissions: ADMIN,CHANNELS_EDIT
 */
export type UpdateProgramInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** An object where the defined keys will be set on the `Program` being updated. */
  patch: ProgramPatch;
};

/** The output of our update `Program` mutation. */
export type UpdateProgramPayload = {
  __typename?: 'UpdateProgramPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Playlist` that is related to this `Program`. */
  playlist?: Maybe<Playlist>;
  /** The `Program` that was updated by this mutation. */
  program?: Maybe<Program>;
  /** An edge for our `Program`. May be used by Relay 1. */
  programEdge?: Maybe<ProgramsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Program` mutation. */
export type UpdateProgramPayloadProgramEdgeArgs = {
  orderBy?: InputMaybe<Array<ProgramsOrderBy>>;
};

/** All input for the `updateVideoCuePointSchedule` mutation. */
export type UpdateVideoCuePointScheduleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['UUID']>;
  programCuePointId?: InputMaybe<Scalars['UUID']>;
  sortIndex?: InputMaybe<Scalars['Int']>;
};

/** The output of our `updateVideoCuePointSchedule` mutation. */
export type UpdateVideoCuePointSchedulePayload = {
  __typename?: 'UpdateVideoCuePointSchedulePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  cuePointSchedule?: Maybe<CuePointSchedule>;
  /** An edge for our `CuePointSchedule`. May be used by Relay 1. */
  cuePointScheduleEdge?: Maybe<CuePointSchedulesEdge>;
  /** Reads a single `ProgramCuePoint` that is related to this `CuePointSchedule`. */
  programCuePoint?: Maybe<ProgramCuePoint>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our `updateVideoCuePointSchedule` mutation. */
export type UpdateVideoCuePointSchedulePayloadCuePointScheduleEdgeArgs = {
  orderBy?: InputMaybe<Array<CuePointSchedulesOrderBy>>;
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

export type ValidationChannelPayload = {
  __typename?: 'ValidationChannelPayload';
  /** Hash of the channel payload for publication. */
  publishHash?: Maybe<Scalars['String']>;
  query?: Maybe<Query>;
  /** List of validation messages. */
  validationMessages: Array<PublishValidationMessage>;
  /** Status of channel validation. */
  validationStatus: PublishValidationStatus;
};

export type ValidationPlaylistPayload = {
  __typename?: 'ValidationPlaylistPayload';
  /** Hash of the playlist payload for publication. */
  publishHash?: Maybe<Scalars['String']>;
  query?: Maybe<Query>;
  /** List of validation messages. */
  validationMessages: Array<PublishValidationMessage>;
  /** Status of playlist validation. */
  validationStatus: PublishValidationStatus;
};

export type CreateChannelMutationVariables = Exact<{
  input: CreateChannelInput;
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', createChannel?: { __typename?: 'CreateChannelPayload', channel?: { __typename?: 'Channel', id: any, title: string } | null } | null };

export type ChannelQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ChannelQuery = { __typename?: 'Query', channel?: { __typename?: 'Channel', id: any, title: string, description?: string | null, dashStreamUrl?: string | null, hlsStreamUrl?: string | null, keyId?: string | null, isDrmProtected: boolean, updatedDate: any, updatedUser: string, createdDate: any, createdUser: string, publicationState: PublicationState, publishedDate?: any | null, publishedUser?: string | null, channelImages: { __typename?: 'ChannelImagesConnection', nodes: Array<{ __typename?: 'ChannelImage', imageId: any, imageType: ChannelImageType }> } } | null };

export type ChannelTitleQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ChannelTitleQuery = { __typename?: 'Query', channel?: { __typename?: 'Channel', id: any, title: string } | null };

export type UpdateChannelMutationVariables = Exact<{
  input: UpdateChannelInput;
}>;


export type UpdateChannelMutation = { __typename?: 'Mutation', updateChannel?: { __typename?: 'UpdateChannelPayload', channel?: { __typename?: 'Channel', id: any } | null } | null };

export type DeleteChannelMutationVariables = Exact<{
  input: DeleteChannelInput;
}>;


export type DeleteChannelMutation = { __typename?: 'Mutation', deleteChannel?: { __typename?: 'DeleteChannelPayload', channel?: { __typename?: 'Channel', id: any } | null } | null };

export type UnpublishChannelMutationVariables = Exact<{
  input: UnpublishChannelInput;
}>;


export type UnpublishChannelMutation = { __typename?: 'Mutation', unpublishChannel?: { __typename?: 'UnpublishChannelPayload', channel?: { __typename?: 'Channel', id: any } | null } | null };

export type ChannelImagesQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ChannelImagesQuery = { __typename?: 'Query', channel?: { __typename?: 'Channel', id: any, channelImages: { __typename?: 'ChannelImagesConnection', nodes: Array<{ __typename?: 'ChannelImage', imageType: ChannelImageType, imageId: any }> } } | null };

export type ValidateChannelQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ValidateChannelQuery = { __typename?: 'Query', validateChannel?: { __typename?: 'ValidationChannelPayload', publishHash?: string | null, validationStatus: PublishValidationStatus, validationMessages: Array<{ __typename?: 'PublishValidationMessage', context: PublishValidationContext, message: string, severity: PublishValidationSeverity }> } | null };

export type PublishChannelMutationVariables = Exact<{
  id: Scalars['UUID'];
  publishHash: Scalars['String'];
}>;


export type PublishChannelMutation = { __typename?: 'Mutation', publishChannel: { __typename?: 'PublishChannelPayload', channel: { __typename?: 'Channel', id: any } } };

export type ChannelVideoQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ChannelVideoQuery = { __typename?: 'Query', channel?: { __typename?: 'Channel', placeholderVideoId?: any | null } | null };

export type ChannelsQueryVariables = Exact<{
  filter?: InputMaybe<ChannelFilter>;
  orderBy?: InputMaybe<Array<ChannelsOrderBy> | ChannelsOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type ChannelsQuery = { __typename?: 'Query', filtered?: { __typename?: 'ChannelsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'Channel', id: any, title: string, createdDate: any, updatedDate: any, publicationState: PublicationState, publishedDate?: any | null, channelImages: { __typename?: 'ChannelImagesConnection', nodes: Array<{ __typename?: 'ChannelImage', imageId: any, imageType: ChannelImageType }> } }> } | null, nonFiltered?: { __typename?: 'ChannelsConnection', totalCount: number } | null };

export type CreatePlaylistMutationVariables = Exact<{
  input: CreatePlaylistInput;
}>;


export type CreatePlaylistMutation = { __typename?: 'Mutation', createPlaylist?: { __typename?: 'CreatePlaylistPayload', playlist?: { __typename?: 'Playlist', id: any, channelId: any, startDateTime: any } | null } | null };

export type PlaylistQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type PlaylistQuery = { __typename?: 'Query', playlist?: { __typename?: 'Playlist', id: any, title: string, startDateTime: any, calculatedDurationInSeconds: number, calculatedEndDateTime?: any | null, createdDate: any, createdUser: string, updatedDate: any, updatedUser: string, publishedDate?: any | null, publishedUser?: string | null, publicationState: PublicationState, programs: { __typename?: 'ProgramsConnection', nodes: Array<{ __typename?: 'Program', entityType: EntityType }> } } | null };

export type UpdatePlaylistMutationVariables = Exact<{
  input: UpdatePlaylistInput;
}>;


export type UpdatePlaylistMutation = { __typename?: 'Mutation', updatePlaylist?: { __typename?: 'UpdatePlaylistPayload', playlist?: { __typename?: 'Playlist', id: any } | null } | null };

export type DeletePlaylistMutationVariables = Exact<{
  input: DeletePlaylistInput;
}>;


export type DeletePlaylistMutation = { __typename?: 'Mutation', deletePlaylist?: { __typename?: 'DeletePlaylistPayload', playlist?: { __typename?: 'Playlist', id: any } | null } | null };

export type UnpublishPlaylistMutationVariables = Exact<{
  input: UnpublishPlaylistInput;
}>;


export type UnpublishPlaylistMutation = { __typename?: 'Mutation', unpublishPlaylist?: { __typename?: 'UnpublishPlaylistPayload', playlist?: { __typename?: 'Playlist', id: any } | null } | null };

export type PlaylistTitleQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type PlaylistTitleQuery = { __typename?: 'Query', playlist?: { __typename?: 'Playlist', title: string } | null };

export type ValidatePlaylistQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ValidatePlaylistQuery = { __typename?: 'Query', validatePlaylist?: { __typename?: 'ValidationPlaylistPayload', publishHash?: string | null, validationStatus: PublishValidationStatus, validationMessages: Array<{ __typename?: 'PublishValidationMessage', context: PublishValidationContext, message: string, severity: PublishValidationSeverity }> } | null };

export type PublishPlaylistMutationVariables = Exact<{
  id: Scalars['UUID'];
  publishHash: Scalars['String'];
}>;


export type PublishPlaylistMutation = { __typename?: 'Mutation', publishPlaylist: { __typename?: 'PublishPlaylistPayload', playlist: { __typename?: 'Playlist', id: any } } };

export type PlaylistsQueryVariables = Exact<{
  filter?: InputMaybe<PlaylistFilter>;
  orderBy?: InputMaybe<Array<PlaylistsOrderBy> | PlaylistsOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
  channelId: Scalars['UUID'];
}>;


export type PlaylistsQuery = { __typename?: 'Query', filtered?: { __typename?: 'PlaylistsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'Playlist', id: any, startDateTime: any, calculatedDurationInSeconds: number, createdDate: any, updatedDate: any, publicationState: PublicationState, publishedDate?: any | null, programs: { __typename?: 'ProgramsConnection', totalCount: number } }> } | null, nonFiltered?: { __typename?: 'PlaylistsConnection', totalCount: number } | null };

export type ProgramQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ProgramQuery = { __typename?: 'Query', program?: { __typename?: 'Program', id: any, title: string, updatedDate: any, updatedUser: string, createdDate: any, createdUser: string, imageId?: any | null } | null };

export type ProgramTitleQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ProgramTitleQuery = { __typename?: 'Query', program?: { __typename?: 'Program', id: any, title: string } | null };

export type UpdateProgramMutationVariables = Exact<{
  input: UpdateProgramInput;
}>;


export type UpdateProgramMutation = { __typename?: 'Mutation', updateProgram?: { __typename?: 'UpdateProgramPayload', program?: { __typename?: 'Program', id: any } | null } | null };

export type ProgramDetailsRootPathParamsQueryVariables = Exact<{
  programId: Scalars['UUID'];
}>;


export type ProgramDetailsRootPathParamsQuery = { __typename?: 'Query', program?: { __typename?: 'Program', playlist?: { __typename?: 'Playlist', id: any, channel?: { __typename?: 'Channel', id: any } | null } | null } | null };

export type PlaylistProgramsQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type PlaylistProgramsQuery = { __typename?: 'Query', playlist?: { __typename?: 'Playlist', startDateTime: any, calculatedEndDateTime?: any | null, calculatedDurationInSeconds: number, programs: { __typename?: 'ProgramsConnection', nodes: Array<{ __typename?: 'Program', id: any, sortIndex: number, title: string, entityId: string, entityType: EntityType, videoDurationInSeconds: number, imageId?: any | null, videoId: any, programCuePoints: { __typename?: 'ProgramCuePointsConnection', nodes: Array<{ __typename?: 'ProgramCuePoint', id: any, videoCuePointId?: any | null, type: ProgramBreakType, timeInSeconds?: number | null, cuePointSchedules: { __typename?: 'CuePointSchedulesConnection', nodes: Array<{ __typename?: 'CuePointSchedule', id: any, type: CuePointScheduleType, durationInSeconds: number, videoId?: any | null, sortIndex: number, programCuePointId: any }> } }> } }> } } | null, channel?: { __typename?: 'Playlist', channelId: any } | null };


export const CreateChannelDocument = gql`
    mutation CreateChannel($input: CreateChannelInput!) {
  createChannel(input: $input) {
    channel {
      id
      title
    }
  }
}
    `;
export type CreateChannelMutationFn = Apollo.MutationFunction<CreateChannelMutation, CreateChannelMutationVariables>;

/**
 * __useCreateChannelMutation__
 *
 * To run a mutation, you first call `useCreateChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChannelMutation, { data, loading, error }] = useCreateChannelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateChannelMutation(baseOptions?: Apollo.MutationHookOptions<CreateChannelMutation, CreateChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, options);
      }
export type CreateChannelMutationHookResult = ReturnType<typeof useCreateChannelMutation>;
export type CreateChannelMutationResult = Apollo.MutationResult<CreateChannelMutation>;
export type CreateChannelMutationOptions = Apollo.BaseMutationOptions<CreateChannelMutation, CreateChannelMutationVariables>;
export const ChannelDocument = gql`
    query Channel($id: UUID!) {
  channel(id: $id) {
    id
    title
    description
    dashStreamUrl
    hlsStreamUrl
    keyId
    isDrmProtected
    updatedDate
    updatedUser
    createdDate
    createdUser
    publicationState
    publishedDate
    publishedUser
    channelImages {
      nodes {
        imageId
        imageType
      }
    }
  }
}
    `;

/**
 * __useChannelQuery__
 *
 * To run a query within a React component, call `useChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChannelQuery(baseOptions: Apollo.QueryHookOptions<ChannelQuery, ChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChannelQuery, ChannelQueryVariables>(ChannelDocument, options);
      }
export function useChannelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChannelQuery, ChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChannelQuery, ChannelQueryVariables>(ChannelDocument, options);
        }
export type ChannelQueryHookResult = ReturnType<typeof useChannelQuery>;
export type ChannelLazyQueryHookResult = ReturnType<typeof useChannelLazyQuery>;
export type ChannelQueryResult = Apollo.QueryResult<ChannelQuery, ChannelQueryVariables>;
export const ChannelTitleDocument = gql`
    query ChannelTitle($id: UUID!) {
  channel(id: $id) {
    id
    title
  }
}
    `;

/**
 * __useChannelTitleQuery__
 *
 * To run a query within a React component, call `useChannelTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChannelTitleQuery(baseOptions: Apollo.QueryHookOptions<ChannelTitleQuery, ChannelTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChannelTitleQuery, ChannelTitleQueryVariables>(ChannelTitleDocument, options);
      }
export function useChannelTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChannelTitleQuery, ChannelTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChannelTitleQuery, ChannelTitleQueryVariables>(ChannelTitleDocument, options);
        }
export type ChannelTitleQueryHookResult = ReturnType<typeof useChannelTitleQuery>;
export type ChannelTitleLazyQueryHookResult = ReturnType<typeof useChannelTitleLazyQuery>;
export type ChannelTitleQueryResult = Apollo.QueryResult<ChannelTitleQuery, ChannelTitleQueryVariables>;
export const UpdateChannelDocument = gql`
    mutation UpdateChannel($input: UpdateChannelInput!) {
  updateChannel(input: $input) {
    channel {
      id
    }
  }
}
    `;
export type UpdateChannelMutationFn = Apollo.MutationFunction<UpdateChannelMutation, UpdateChannelMutationVariables>;

/**
 * __useUpdateChannelMutation__
 *
 * To run a mutation, you first call `useUpdateChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChannelMutation, { data, loading, error }] = useUpdateChannelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateChannelMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChannelMutation, UpdateChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChannelMutation, UpdateChannelMutationVariables>(UpdateChannelDocument, options);
      }
export type UpdateChannelMutationHookResult = ReturnType<typeof useUpdateChannelMutation>;
export type UpdateChannelMutationResult = Apollo.MutationResult<UpdateChannelMutation>;
export type UpdateChannelMutationOptions = Apollo.BaseMutationOptions<UpdateChannelMutation, UpdateChannelMutationVariables>;
export const DeleteChannelDocument = gql`
    mutation DeleteChannel($input: DeleteChannelInput!) {
  deleteChannel(input: $input) {
    channel {
      id
    }
  }
}
    `;
export type DeleteChannelMutationFn = Apollo.MutationFunction<DeleteChannelMutation, DeleteChannelMutationVariables>;

/**
 * __useDeleteChannelMutation__
 *
 * To run a mutation, you first call `useDeleteChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChannelMutation, { data, loading, error }] = useDeleteChannelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteChannelMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChannelMutation, DeleteChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChannelMutation, DeleteChannelMutationVariables>(DeleteChannelDocument, options);
      }
export type DeleteChannelMutationHookResult = ReturnType<typeof useDeleteChannelMutation>;
export type DeleteChannelMutationResult = Apollo.MutationResult<DeleteChannelMutation>;
export type DeleteChannelMutationOptions = Apollo.BaseMutationOptions<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const UnpublishChannelDocument = gql`
    mutation UnpublishChannel($input: UnpublishChannelInput!) {
  unpublishChannel(input: $input) {
    channel {
      id
    }
  }
}
    `;
export type UnpublishChannelMutationFn = Apollo.MutationFunction<UnpublishChannelMutation, UnpublishChannelMutationVariables>;

/**
 * __useUnpublishChannelMutation__
 *
 * To run a mutation, you first call `useUnpublishChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishChannelMutation, { data, loading, error }] = useUnpublishChannelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUnpublishChannelMutation(baseOptions?: Apollo.MutationHookOptions<UnpublishChannelMutation, UnpublishChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpublishChannelMutation, UnpublishChannelMutationVariables>(UnpublishChannelDocument, options);
      }
export type UnpublishChannelMutationHookResult = ReturnType<typeof useUnpublishChannelMutation>;
export type UnpublishChannelMutationResult = Apollo.MutationResult<UnpublishChannelMutation>;
export type UnpublishChannelMutationOptions = Apollo.BaseMutationOptions<UnpublishChannelMutation, UnpublishChannelMutationVariables>;
export const ChannelImagesDocument = gql`
    query ChannelImages($id: UUID!) {
  channel(id: $id) {
    id
    channelImages {
      nodes {
        imageType
        imageId
      }
    }
  }
}
    `;

/**
 * __useChannelImagesQuery__
 *
 * To run a query within a React component, call `useChannelImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelImagesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChannelImagesQuery(baseOptions: Apollo.QueryHookOptions<ChannelImagesQuery, ChannelImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChannelImagesQuery, ChannelImagesQueryVariables>(ChannelImagesDocument, options);
      }
export function useChannelImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChannelImagesQuery, ChannelImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChannelImagesQuery, ChannelImagesQueryVariables>(ChannelImagesDocument, options);
        }
export type ChannelImagesQueryHookResult = ReturnType<typeof useChannelImagesQuery>;
export type ChannelImagesLazyQueryHookResult = ReturnType<typeof useChannelImagesLazyQuery>;
export type ChannelImagesQueryResult = Apollo.QueryResult<ChannelImagesQuery, ChannelImagesQueryVariables>;
export const ValidateChannelDocument = gql`
    query ValidateChannel($id: UUID!) {
  validateChannel(id: $id) {
    publishHash
    validationStatus
    validationMessages {
      context
      message
      severity
    }
  }
}
    `;

/**
 * __useValidateChannelQuery__
 *
 * To run a query within a React component, call `useValidateChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidateChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidateChannelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useValidateChannelQuery(baseOptions: Apollo.QueryHookOptions<ValidateChannelQuery, ValidateChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ValidateChannelQuery, ValidateChannelQueryVariables>(ValidateChannelDocument, options);
      }
export function useValidateChannelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ValidateChannelQuery, ValidateChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ValidateChannelQuery, ValidateChannelQueryVariables>(ValidateChannelDocument, options);
        }
export type ValidateChannelQueryHookResult = ReturnType<typeof useValidateChannelQuery>;
export type ValidateChannelLazyQueryHookResult = ReturnType<typeof useValidateChannelLazyQuery>;
export type ValidateChannelQueryResult = Apollo.QueryResult<ValidateChannelQuery, ValidateChannelQueryVariables>;
export const PublishChannelDocument = gql`
    mutation PublishChannel($id: UUID!, $publishHash: String!) {
  publishChannel(input: {id: $id, publishHash: $publishHash}) {
    channel {
      id
    }
  }
}
    `;
export type PublishChannelMutationFn = Apollo.MutationFunction<PublishChannelMutation, PublishChannelMutationVariables>;

/**
 * __usePublishChannelMutation__
 *
 * To run a mutation, you first call `usePublishChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishChannelMutation, { data, loading, error }] = usePublishChannelMutation({
 *   variables: {
 *      id: // value for 'id'
 *      publishHash: // value for 'publishHash'
 *   },
 * });
 */
export function usePublishChannelMutation(baseOptions?: Apollo.MutationHookOptions<PublishChannelMutation, PublishChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishChannelMutation, PublishChannelMutationVariables>(PublishChannelDocument, options);
      }
export type PublishChannelMutationHookResult = ReturnType<typeof usePublishChannelMutation>;
export type PublishChannelMutationResult = Apollo.MutationResult<PublishChannelMutation>;
export type PublishChannelMutationOptions = Apollo.BaseMutationOptions<PublishChannelMutation, PublishChannelMutationVariables>;
export const ChannelVideoDocument = gql`
    query ChannelVideo($id: UUID!) {
  channel(id: $id) {
    placeholderVideoId
  }
}
    `;

/**
 * __useChannelVideoQuery__
 *
 * To run a query within a React component, call `useChannelVideoQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelVideoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelVideoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChannelVideoQuery(baseOptions: Apollo.QueryHookOptions<ChannelVideoQuery, ChannelVideoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChannelVideoQuery, ChannelVideoQueryVariables>(ChannelVideoDocument, options);
      }
export function useChannelVideoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChannelVideoQuery, ChannelVideoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChannelVideoQuery, ChannelVideoQueryVariables>(ChannelVideoDocument, options);
        }
export type ChannelVideoQueryHookResult = ReturnType<typeof useChannelVideoQuery>;
export type ChannelVideoLazyQueryHookResult = ReturnType<typeof useChannelVideoLazyQuery>;
export type ChannelVideoQueryResult = Apollo.QueryResult<ChannelVideoQuery, ChannelVideoQueryVariables>;
export const ChannelsDocument = gql`
    query Channels($filter: ChannelFilter, $orderBy: [ChannelsOrderBy!], $after: Cursor) {
  filtered: channels(filter: $filter, orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      title
      createdDate
      updatedDate
      publicationState
      publishedDate
      channelImages(condition: {imageType: LOGO}) {
        nodes {
          imageId
          imageType
        }
      }
    }
  }
  nonFiltered: channels {
    totalCount
  }
}
    `;

/**
 * __useChannelsQuery__
 *
 * To run a query within a React component, call `useChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useChannelsQuery(baseOptions?: Apollo.QueryHookOptions<ChannelsQuery, ChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChannelsQuery, ChannelsQueryVariables>(ChannelsDocument, options);
      }
export function useChannelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChannelsQuery, ChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChannelsQuery, ChannelsQueryVariables>(ChannelsDocument, options);
        }
export type ChannelsQueryHookResult = ReturnType<typeof useChannelsQuery>;
export type ChannelsLazyQueryHookResult = ReturnType<typeof useChannelsLazyQuery>;
export type ChannelsQueryResult = Apollo.QueryResult<ChannelsQuery, ChannelsQueryVariables>;
export const CreatePlaylistDocument = gql`
    mutation CreatePlaylist($input: CreatePlaylistInput!) {
  createPlaylist(input: $input) {
    playlist {
      id
      channelId
      startDateTime
    }
  }
}
    `;
export type CreatePlaylistMutationFn = Apollo.MutationFunction<CreatePlaylistMutation, CreatePlaylistMutationVariables>;

/**
 * __useCreatePlaylistMutation__
 *
 * To run a mutation, you first call `useCreatePlaylistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePlaylistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPlaylistMutation, { data, loading, error }] = useCreatePlaylistMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePlaylistMutation(baseOptions?: Apollo.MutationHookOptions<CreatePlaylistMutation, CreatePlaylistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePlaylistMutation, CreatePlaylistMutationVariables>(CreatePlaylistDocument, options);
      }
export type CreatePlaylistMutationHookResult = ReturnType<typeof useCreatePlaylistMutation>;
export type CreatePlaylistMutationResult = Apollo.MutationResult<CreatePlaylistMutation>;
export type CreatePlaylistMutationOptions = Apollo.BaseMutationOptions<CreatePlaylistMutation, CreatePlaylistMutationVariables>;
export const PlaylistDocument = gql`
    query Playlist($id: UUID!) {
  playlist(id: $id) {
    id
    title
    startDateTime
    calculatedDurationInSeconds
    calculatedEndDateTime
    createdDate
    createdUser
    updatedDate
    updatedUser
    publishedDate
    publishedUser
    publicationState
    programs {
      nodes {
        entityType
      }
    }
  }
}
    `;

/**
 * __usePlaylistQuery__
 *
 * To run a query within a React component, call `usePlaylistQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaylistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaylistQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePlaylistQuery(baseOptions: Apollo.QueryHookOptions<PlaylistQuery, PlaylistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlaylistQuery, PlaylistQueryVariables>(PlaylistDocument, options);
      }
export function usePlaylistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaylistQuery, PlaylistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlaylistQuery, PlaylistQueryVariables>(PlaylistDocument, options);
        }
export type PlaylistQueryHookResult = ReturnType<typeof usePlaylistQuery>;
export type PlaylistLazyQueryHookResult = ReturnType<typeof usePlaylistLazyQuery>;
export type PlaylistQueryResult = Apollo.QueryResult<PlaylistQuery, PlaylistQueryVariables>;
export const UpdatePlaylistDocument = gql`
    mutation UpdatePlaylist($input: UpdatePlaylistInput!) {
  updatePlaylist(input: $input) {
    playlist {
      id
    }
  }
}
    `;
export type UpdatePlaylistMutationFn = Apollo.MutationFunction<UpdatePlaylistMutation, UpdatePlaylistMutationVariables>;

/**
 * __useUpdatePlaylistMutation__
 *
 * To run a mutation, you first call `useUpdatePlaylistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePlaylistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePlaylistMutation, { data, loading, error }] = useUpdatePlaylistMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePlaylistMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePlaylistMutation, UpdatePlaylistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePlaylistMutation, UpdatePlaylistMutationVariables>(UpdatePlaylistDocument, options);
      }
export type UpdatePlaylistMutationHookResult = ReturnType<typeof useUpdatePlaylistMutation>;
export type UpdatePlaylistMutationResult = Apollo.MutationResult<UpdatePlaylistMutation>;
export type UpdatePlaylistMutationOptions = Apollo.BaseMutationOptions<UpdatePlaylistMutation, UpdatePlaylistMutationVariables>;
export const DeletePlaylistDocument = gql`
    mutation DeletePlaylist($input: DeletePlaylistInput!) {
  deletePlaylist(input: $input) {
    playlist {
      id
    }
  }
}
    `;
export type DeletePlaylistMutationFn = Apollo.MutationFunction<DeletePlaylistMutation, DeletePlaylistMutationVariables>;

/**
 * __useDeletePlaylistMutation__
 *
 * To run a mutation, you first call `useDeletePlaylistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePlaylistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePlaylistMutation, { data, loading, error }] = useDeletePlaylistMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeletePlaylistMutation(baseOptions?: Apollo.MutationHookOptions<DeletePlaylistMutation, DeletePlaylistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePlaylistMutation, DeletePlaylistMutationVariables>(DeletePlaylistDocument, options);
      }
export type DeletePlaylistMutationHookResult = ReturnType<typeof useDeletePlaylistMutation>;
export type DeletePlaylistMutationResult = Apollo.MutationResult<DeletePlaylistMutation>;
export type DeletePlaylistMutationOptions = Apollo.BaseMutationOptions<DeletePlaylistMutation, DeletePlaylistMutationVariables>;
export const UnpublishPlaylistDocument = gql`
    mutation UnpublishPlaylist($input: UnpublishPlaylistInput!) {
  unpublishPlaylist(input: $input) {
    playlist {
      id
    }
  }
}
    `;
export type UnpublishPlaylistMutationFn = Apollo.MutationFunction<UnpublishPlaylistMutation, UnpublishPlaylistMutationVariables>;

/**
 * __useUnpublishPlaylistMutation__
 *
 * To run a mutation, you first call `useUnpublishPlaylistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishPlaylistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishPlaylistMutation, { data, loading, error }] = useUnpublishPlaylistMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUnpublishPlaylistMutation(baseOptions?: Apollo.MutationHookOptions<UnpublishPlaylistMutation, UnpublishPlaylistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpublishPlaylistMutation, UnpublishPlaylistMutationVariables>(UnpublishPlaylistDocument, options);
      }
export type UnpublishPlaylistMutationHookResult = ReturnType<typeof useUnpublishPlaylistMutation>;
export type UnpublishPlaylistMutationResult = Apollo.MutationResult<UnpublishPlaylistMutation>;
export type UnpublishPlaylistMutationOptions = Apollo.BaseMutationOptions<UnpublishPlaylistMutation, UnpublishPlaylistMutationVariables>;
export const PlaylistTitleDocument = gql`
    query PlaylistTitle($id: UUID!) {
  playlist(id: $id) {
    title
  }
}
    `;

/**
 * __usePlaylistTitleQuery__
 *
 * To run a query within a React component, call `usePlaylistTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaylistTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaylistTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePlaylistTitleQuery(baseOptions: Apollo.QueryHookOptions<PlaylistTitleQuery, PlaylistTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlaylistTitleQuery, PlaylistTitleQueryVariables>(PlaylistTitleDocument, options);
      }
export function usePlaylistTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaylistTitleQuery, PlaylistTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlaylistTitleQuery, PlaylistTitleQueryVariables>(PlaylistTitleDocument, options);
        }
export type PlaylistTitleQueryHookResult = ReturnType<typeof usePlaylistTitleQuery>;
export type PlaylistTitleLazyQueryHookResult = ReturnType<typeof usePlaylistTitleLazyQuery>;
export type PlaylistTitleQueryResult = Apollo.QueryResult<PlaylistTitleQuery, PlaylistTitleQueryVariables>;
export const ValidatePlaylistDocument = gql`
    query ValidatePlaylist($id: UUID!) {
  validatePlaylist(id: $id) {
    publishHash
    validationStatus
    validationMessages {
      context
      message
      severity
    }
  }
}
    `;

/**
 * __useValidatePlaylistQuery__
 *
 * To run a query within a React component, call `useValidatePlaylistQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidatePlaylistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidatePlaylistQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useValidatePlaylistQuery(baseOptions: Apollo.QueryHookOptions<ValidatePlaylistQuery, ValidatePlaylistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ValidatePlaylistQuery, ValidatePlaylistQueryVariables>(ValidatePlaylistDocument, options);
      }
export function useValidatePlaylistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ValidatePlaylistQuery, ValidatePlaylistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ValidatePlaylistQuery, ValidatePlaylistQueryVariables>(ValidatePlaylistDocument, options);
        }
export type ValidatePlaylistQueryHookResult = ReturnType<typeof useValidatePlaylistQuery>;
export type ValidatePlaylistLazyQueryHookResult = ReturnType<typeof useValidatePlaylistLazyQuery>;
export type ValidatePlaylistQueryResult = Apollo.QueryResult<ValidatePlaylistQuery, ValidatePlaylistQueryVariables>;
export const PublishPlaylistDocument = gql`
    mutation PublishPlaylist($id: UUID!, $publishHash: String!) {
  publishPlaylist(input: {id: $id, publishHash: $publishHash}) {
    playlist {
      id
    }
  }
}
    `;
export type PublishPlaylistMutationFn = Apollo.MutationFunction<PublishPlaylistMutation, PublishPlaylistMutationVariables>;

/**
 * __usePublishPlaylistMutation__
 *
 * To run a mutation, you first call `usePublishPlaylistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishPlaylistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishPlaylistMutation, { data, loading, error }] = usePublishPlaylistMutation({
 *   variables: {
 *      id: // value for 'id'
 *      publishHash: // value for 'publishHash'
 *   },
 * });
 */
export function usePublishPlaylistMutation(baseOptions?: Apollo.MutationHookOptions<PublishPlaylistMutation, PublishPlaylistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishPlaylistMutation, PublishPlaylistMutationVariables>(PublishPlaylistDocument, options);
      }
export type PublishPlaylistMutationHookResult = ReturnType<typeof usePublishPlaylistMutation>;
export type PublishPlaylistMutationResult = Apollo.MutationResult<PublishPlaylistMutation>;
export type PublishPlaylistMutationOptions = Apollo.BaseMutationOptions<PublishPlaylistMutation, PublishPlaylistMutationVariables>;
export const PlaylistsDocument = gql`
    query Playlists($filter: PlaylistFilter, $orderBy: [PlaylistsOrderBy!], $after: Cursor, $channelId: UUID!) {
  filtered: playlists(
    filter: $filter
    orderBy: $orderBy
    first: 30
    after: $after
    condition: {channelId: $channelId}
  ) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      startDateTime
      calculatedDurationInSeconds
      programs {
        totalCount
      }
      createdDate
      updatedDate
      publicationState
      publishedDate
    }
  }
  nonFiltered: playlists(condition: {channelId: $channelId}) {
    totalCount
  }
}
    `;

/**
 * __usePlaylistsQuery__
 *
 * To run a query within a React component, call `usePlaylistsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaylistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaylistsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function usePlaylistsQuery(baseOptions: Apollo.QueryHookOptions<PlaylistsQuery, PlaylistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlaylistsQuery, PlaylistsQueryVariables>(PlaylistsDocument, options);
      }
export function usePlaylistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaylistsQuery, PlaylistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlaylistsQuery, PlaylistsQueryVariables>(PlaylistsDocument, options);
        }
export type PlaylistsQueryHookResult = ReturnType<typeof usePlaylistsQuery>;
export type PlaylistsLazyQueryHookResult = ReturnType<typeof usePlaylistsLazyQuery>;
export type PlaylistsQueryResult = Apollo.QueryResult<PlaylistsQuery, PlaylistsQueryVariables>;
export const ProgramDocument = gql`
    query Program($id: UUID!) {
  program(id: $id) {
    id
    title
    updatedDate
    updatedUser
    createdDate
    createdUser
    imageId
  }
}
    `;

/**
 * __useProgramQuery__
 *
 * To run a query within a React component, call `useProgramQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProgramQuery(baseOptions: Apollo.QueryHookOptions<ProgramQuery, ProgramQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, options);
      }
export function useProgramLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramQuery, ProgramQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, options);
        }
export type ProgramQueryHookResult = ReturnType<typeof useProgramQuery>;
export type ProgramLazyQueryHookResult = ReturnType<typeof useProgramLazyQuery>;
export type ProgramQueryResult = Apollo.QueryResult<ProgramQuery, ProgramQueryVariables>;
export const ProgramTitleDocument = gql`
    query ProgramTitle($id: UUID!) {
  program(id: $id) {
    id
    title
  }
}
    `;

/**
 * __useProgramTitleQuery__
 *
 * To run a query within a React component, call `useProgramTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProgramTitleQuery(baseOptions: Apollo.QueryHookOptions<ProgramTitleQuery, ProgramTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgramTitleQuery, ProgramTitleQueryVariables>(ProgramTitleDocument, options);
      }
export function useProgramTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramTitleQuery, ProgramTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgramTitleQuery, ProgramTitleQueryVariables>(ProgramTitleDocument, options);
        }
export type ProgramTitleQueryHookResult = ReturnType<typeof useProgramTitleQuery>;
export type ProgramTitleLazyQueryHookResult = ReturnType<typeof useProgramTitleLazyQuery>;
export type ProgramTitleQueryResult = Apollo.QueryResult<ProgramTitleQuery, ProgramTitleQueryVariables>;
export const UpdateProgramDocument = gql`
    mutation UpdateProgram($input: UpdateProgramInput!) {
  updateProgram(input: $input) {
    program {
      id
    }
  }
}
    `;
export type UpdateProgramMutationFn = Apollo.MutationFunction<UpdateProgramMutation, UpdateProgramMutationVariables>;

/**
 * __useUpdateProgramMutation__
 *
 * To run a mutation, you first call `useUpdateProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProgramMutation, { data, loading, error }] = useUpdateProgramMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProgramMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProgramMutation, UpdateProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProgramMutation, UpdateProgramMutationVariables>(UpdateProgramDocument, options);
      }
export type UpdateProgramMutationHookResult = ReturnType<typeof useUpdateProgramMutation>;
export type UpdateProgramMutationResult = Apollo.MutationResult<UpdateProgramMutation>;
export type UpdateProgramMutationOptions = Apollo.BaseMutationOptions<UpdateProgramMutation, UpdateProgramMutationVariables>;
export const ProgramDetailsRootPathParamsDocument = gql`
    query ProgramDetailsRootPathParams($programId: UUID!) {
  program(id: $programId) {
    playlist {
      id
      channel {
        id
      }
    }
  }
}
    `;

/**
 * __useProgramDetailsRootPathParamsQuery__
 *
 * To run a query within a React component, call `useProgramDetailsRootPathParamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramDetailsRootPathParamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramDetailsRootPathParamsQuery({
 *   variables: {
 *      programId: // value for 'programId'
 *   },
 * });
 */
export function useProgramDetailsRootPathParamsQuery(baseOptions: Apollo.QueryHookOptions<ProgramDetailsRootPathParamsQuery, ProgramDetailsRootPathParamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgramDetailsRootPathParamsQuery, ProgramDetailsRootPathParamsQueryVariables>(ProgramDetailsRootPathParamsDocument, options);
      }
export function useProgramDetailsRootPathParamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramDetailsRootPathParamsQuery, ProgramDetailsRootPathParamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgramDetailsRootPathParamsQuery, ProgramDetailsRootPathParamsQueryVariables>(ProgramDetailsRootPathParamsDocument, options);
        }
export type ProgramDetailsRootPathParamsQueryHookResult = ReturnType<typeof useProgramDetailsRootPathParamsQuery>;
export type ProgramDetailsRootPathParamsLazyQueryHookResult = ReturnType<typeof useProgramDetailsRootPathParamsLazyQuery>;
export type ProgramDetailsRootPathParamsQueryResult = Apollo.QueryResult<ProgramDetailsRootPathParamsQuery, ProgramDetailsRootPathParamsQueryVariables>;
export const PlaylistProgramsDocument = gql`
    query PlaylistPrograms($id: UUID!) {
  playlist(id: $id) {
    startDateTime
    calculatedEndDateTime
    calculatedDurationInSeconds
    programs(orderBy: SORT_INDEX_ASC) {
      nodes {
        id
        sortIndex
        title
        entityId
        entityType
        videoDurationInSeconds
        imageId
        videoId
        programCuePoints {
          nodes {
            id
            videoCuePointId
            type
            timeInSeconds
            cuePointSchedules(orderBy: SORT_INDEX_ASC) {
              nodes {
                id
                type
                durationInSeconds
                videoId
                sortIndex
                programCuePointId
              }
            }
          }
        }
      }
    }
  }
  channel: playlist(id: $id) {
    channelId
  }
}
    `;

/**
 * __usePlaylistProgramsQuery__
 *
 * To run a query within a React component, call `usePlaylistProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaylistProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaylistProgramsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePlaylistProgramsQuery(baseOptions: Apollo.QueryHookOptions<PlaylistProgramsQuery, PlaylistProgramsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlaylistProgramsQuery, PlaylistProgramsQueryVariables>(PlaylistProgramsDocument, options);
      }
export function usePlaylistProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaylistProgramsQuery, PlaylistProgramsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlaylistProgramsQuery, PlaylistProgramsQueryVariables>(PlaylistProgramsDocument, options);
        }
export type PlaylistProgramsQueryHookResult = ReturnType<typeof usePlaylistProgramsQuery>;
export type PlaylistProgramsLazyQueryHookResult = ReturnType<typeof usePlaylistProgramsLazyQuery>;
export type PlaylistProgramsQueryResult = Apollo.QueryResult<PlaylistProgramsQuery, PlaylistProgramsQueryVariables>;