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

/** Definition of the channel entity. */
export type Channel = {
  __typename?: 'Channel';
  /** DASH stream URL of the channel. */
  dashStreamUrl?: Maybe<Scalars['String']['output']>;
  /** Description of the channel. */
  description?: Maybe<Scalars['String']['output']>;
  /** HLS stream URL of the channel. */
  hlsStreamUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `ChannelImage`. */
  images: ChannelImagesConnection;
  /** Key identifier for DRM protected streams. */
  keyId?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Playlist`. */
  playlists: PlaylistsConnection;
  /** Title of the channel. */
  title?: Maybe<Scalars['String']['output']>;
};


/** Definition of the channel entity. */
export type ChannelImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChannelImageCondition>;
  filter?: InputMaybe<ChannelImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChannelImagesOrderBy>>;
};


/** Definition of the channel entity. */
export type ChannelPlaylistsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PlaylistCondition>;
  filter?: InputMaybe<PlaylistFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PlaylistsOrderBy>>;
};

/** A condition to be used against `Channel` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ChannelCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Channel` object types. All fields are combined with a logical ‘and.’ */
export type ChannelFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ChannelFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ChannelFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ChannelFilter>>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** Asset image metadata. */
export type ChannelImage = {
  __typename?: 'ChannelImage';
  altText?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Channel` that is related to this `ChannelImage`. */
  channel?: Maybe<Channel>;
  channelId?: Maybe<Scalars['String']['output']>;
  /** Height of the image in pixels. */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** URI to the image file. */
  path?: Maybe<Scalars['String']['output']>;
  /** Type of the image. */
  type?: Maybe<Scalars['String']['output']>;
  /** Width of the image in pixels. */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `ChannelImage` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ChannelImageCondition = {
  /** Checks for equality with the object’s `altText` field. */
  altText?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `channelId` field. */
  channelId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `ChannelImage` object types. All fields are combined with a logical ‘and.’ */
export type ChannelImageFilter = {
  /** Filter by the object’s `altText` field. */
  altText?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ChannelImageFilter>>;
  /** Filter by the object’s `channelId` field. */
  channelId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ChannelImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ChannelImageFilter>>;
};

/** A connection to a list of `ChannelImage` values. */
export type ChannelImagesConnection = {
  __typename?: 'ChannelImagesConnection';
  /** A list of edges which contains the `ChannelImage` and cursor to aid in pagination. */
  edges: Array<ChannelImagesEdge>;
  /** A list of `ChannelImage` objects. */
  nodes: Array<ChannelImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ChannelImage` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `ChannelImage` edge in the connection. */
export type ChannelImagesEdge = {
  __typename?: 'ChannelImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ChannelImage` at the end of the edge. */
  node: ChannelImage;
};

/** Methods to use when ordering `ChannelImage`. */
export enum ChannelImagesOrderBy {
  AltTextAsc = 'ALT_TEXT_ASC',
  AltTextDesc = 'ALT_TEXT_DESC',
  ChannelIdAsc = 'CHANNEL_ID_ASC',
  ChannelIdDesc = 'CHANNEL_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `Channel` values. */
export type ChannelsConnection = {
  __typename?: 'ChannelsConnection';
  /** A list of edges which contains the `Channel` and cursor to aid in pagination. */
  edges: Array<ChannelsEdge>;
  /** A list of `Channel` objects. */
  nodes: Array<Channel>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Channel` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Channel` edge in the connection. */
export type ChannelsEdge = {
  __typename?: 'ChannelsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Channel` at the end of the edge. */
  node: Channel;
};

/** Methods to use when ordering `Channel`. */
export enum ChannelsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

/** Definition of the collection entity. */
export type Collection = {
  __typename?: 'Collection';
  /** Longer description. */
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `CollectionImage`. */
  images: CollectionImagesConnection;
  /** Reads and enables pagination through a set of `CollectionItemsRelation`. */
  items: CollectionItemsRelationsConnection;
  /** Short description. */
  synopsis?: Maybe<Scalars['String']['output']>;
  /** Array of tags associated with the content. */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Title of the collection. */
  title?: Maybe<Scalars['String']['output']>;
};


/** Definition of the collection entity. */
export type CollectionImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CollectionImageCondition>;
  filter?: InputMaybe<CollectionImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CollectionImagesOrderBy>>;
};


/** Definition of the collection entity. */
export type CollectionItemsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CollectionItemsRelationCondition>;
  filter?: InputMaybe<CollectionItemsRelationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CollectionItemsRelationsOrderBy>>;
};

/**
 * A condition to be used against `Collection` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CollectionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Collection` object types. All fields are combined with a logical ‘and.’ */
export type CollectionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CollectionFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CollectionFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CollectionFilter>>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** Asset image metadata. */
export type CollectionImage = {
  __typename?: 'CollectionImage';
  altText?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Collection` that is related to this `CollectionImage`. */
  collection?: Maybe<Collection>;
  collectionId?: Maybe<Scalars['String']['output']>;
  /** Height of the image in pixels. */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** URI to the image file. */
  path?: Maybe<Scalars['String']['output']>;
  /** Type of the image. */
  type?: Maybe<Scalars['String']['output']>;
  /** Width of the image in pixels. */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `CollectionImage` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CollectionImageCondition = {
  /** Checks for equality with the object’s `altText` field. */
  altText?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `collectionId` field. */
  collectionId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `CollectionImage` object types. All fields are combined with a logical ‘and.’ */
export type CollectionImageFilter = {
  /** Filter by the object’s `altText` field. */
  altText?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CollectionImageFilter>>;
  /** Filter by the object’s `collectionId` field. */
  collectionId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CollectionImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CollectionImageFilter>>;
};

/** A connection to a list of `CollectionImage` values. */
export type CollectionImagesConnection = {
  __typename?: 'CollectionImagesConnection';
  /** A list of edges which contains the `CollectionImage` and cursor to aid in pagination. */
  edges: Array<CollectionImagesEdge>;
  /** A list of `CollectionImage` objects. */
  nodes: Array<CollectionImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CollectionImage` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `CollectionImage` edge in the connection. */
export type CollectionImagesEdge = {
  __typename?: 'CollectionImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `CollectionImage` at the end of the edge. */
  node: CollectionImage;
};

/** Methods to use when ordering `CollectionImage`. */
export enum CollectionImagesOrderBy {
  AltTextAsc = 'ALT_TEXT_ASC',
  AltTextDesc = 'ALT_TEXT_DESC',
  CollectionIdAsc = 'COLLECTION_ID_ASC',
  CollectionIdDesc = 'COLLECTION_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type CollectionItemsRelation = {
  __typename?: 'CollectionItemsRelation';
  /** Reads a single `Collection` that is related to this `CollectionItemsRelation`. */
  collection?: Maybe<Collection>;
  collectionId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Episode` that is related to this `CollectionItemsRelation`. */
  episode?: Maybe<Episode>;
  episodeId?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** Reads a single `Movie` that is related to this `CollectionItemsRelation`. */
  movie?: Maybe<Movie>;
  movieId?: Maybe<Scalars['String']['output']>;
  orderNo: Scalars['Int']['output'];
  /** Type of the relation. */
  relationType?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Season` that is related to this `CollectionItemsRelation`. */
  season?: Maybe<Season>;
  seasonId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Tvshow` that is related to this `CollectionItemsRelation`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `CollectionItemsRelation` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type CollectionItemsRelationCondition = {
  /** Checks for equality with the object’s `collectionId` field. */
  collectionId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `orderNo` field. */
  orderNo?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `CollectionItemsRelation` object types. All fields are combined with a logical ‘and.’ */
export type CollectionItemsRelationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CollectionItemsRelationFilter>>;
  /** Filter by the object’s `collectionId` field. */
  collectionId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CollectionItemsRelationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CollectionItemsRelationFilter>>;
  /** Filter by the object’s `orderNo` field. */
  orderNo?: InputMaybe<IntFilter>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<StringFilter>;
};

/** A connection to a list of `CollectionItemsRelation` values. */
export type CollectionItemsRelationsConnection = {
  __typename?: 'CollectionItemsRelationsConnection';
  /** A list of edges which contains the `CollectionItemsRelation` and cursor to aid in pagination. */
  edges: Array<CollectionItemsRelationsEdge>;
  /** A list of `CollectionItemsRelation` objects. */
  nodes: Array<CollectionItemsRelation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CollectionItemsRelation` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `CollectionItemsRelation` edge in the connection. */
export type CollectionItemsRelationsEdge = {
  __typename?: 'CollectionItemsRelationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `CollectionItemsRelation` at the end of the edge. */
  node: CollectionItemsRelation;
};

/** Methods to use when ordering `CollectionItemsRelation`. */
export enum CollectionItemsRelationsOrderBy {
  CollectionIdAsc = 'COLLECTION_ID_ASC',
  CollectionIdDesc = 'COLLECTION_ID_DESC',
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  OrderNoAsc = 'ORDER_NO_ASC',
  OrderNoDesc = 'ORDER_NO_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/** A connection to a list of `Collection` values. */
export type CollectionsConnection = {
  __typename?: 'CollectionsConnection';
  /** A list of edges which contains the `Collection` and cursor to aid in pagination. */
  edges: Array<CollectionsEdge>;
  /** A list of `Collection` objects. */
  nodes: Array<Collection>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Collection` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Collection` edge in the connection. */
export type CollectionsEdge = {
  __typename?: 'CollectionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Collection` at the end of the edge. */
  node: Collection;
};

/** Methods to use when ordering `Collection`. */
export enum CollectionsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

/** Definition of the TV show episode entity. */
export type Episode = {
  __typename?: 'Episode';
  /** Cast of the episode. */
  cast?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Extended synopsis. */
  description?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `EpisodeGenresRelation`. */
  genres: EpisodeGenresRelationsConnection;
  id: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `EpisodeImage`. */
  images: EpisodeImagesConnection;
  /** Episode number */
  index?: Maybe<Scalars['Int']['output']>;
  /** Reads and enables pagination through a set of `EpisodeLicense`. */
  licenses: EpisodeLicensesConnection;
  /** Original title of the episode. */
  originalTitle?: Maybe<Scalars['String']['output']>;
  /** Array of production countries */
  productionCountries?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Date of first release. */
  released?: Maybe<Scalars['Datetime']['output']>;
  /** Reads a single `Season` that is related to this `Episode`. */
  season?: Maybe<Season>;
  seasonId?: Maybe<Scalars['String']['output']>;
  /** Name of the producing studio. */
  studio?: Maybe<Scalars['String']['output']>;
  /** Short description of the main plot elements. */
  synopsis?: Maybe<Scalars['String']['output']>;
  /** Array of tags associated with the content. */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Title of the episode. */
  title?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `EpisodeVideo`. */
  videos: EpisodeVideosConnection;
};


/** Definition of the TV show episode entity. */
export type EpisodeGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EpisodeGenresRelationCondition>;
  filter?: InputMaybe<EpisodeGenresRelationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EpisodeGenresRelationsOrderBy>>;
};


/** Definition of the TV show episode entity. */
export type EpisodeImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EpisodeImageCondition>;
  filter?: InputMaybe<EpisodeImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EpisodeImagesOrderBy>>;
};


/** Definition of the TV show episode entity. */
export type EpisodeLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EpisodeLicenseCondition>;
  filter?: InputMaybe<EpisodeLicenseFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EpisodeLicensesOrderBy>>;
};


/** Definition of the TV show episode entity. */
export type EpisodeVideosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EpisodeVideoCondition>;
  filter?: InputMaybe<EpisodeVideoFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EpisodeVideosOrderBy>>;
};

/** A condition to be used against `Episode` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type EpisodeCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Episode` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodeFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodeFilter>>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

export type EpisodeGenresRelation = {
  __typename?: 'EpisodeGenresRelation';
  /** Reads a single `Episode` that is related to this `EpisodeGenresRelation`. */
  episode?: Maybe<Episode>;
  episodeId?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  orderNo: Scalars['Int']['output'];
  /** Reads a single `TvshowGenre` that is related to this `EpisodeGenresRelation`. */
  tvshowGenre?: Maybe<TvshowGenre>;
  tvshowGenreId?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `EpisodeGenresRelation` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type EpisodeGenresRelationCondition = {
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `orderNo` field. */
  orderNo?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `tvshowGenreId` field. */
  tvshowGenreId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `EpisodeGenresRelation` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeGenresRelationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodeGenresRelationFilter>>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodeGenresRelationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodeGenresRelationFilter>>;
  /** Filter by the object’s `orderNo` field. */
  orderNo?: InputMaybe<IntFilter>;
  /** Filter by the object’s `tvshowGenreId` field. */
  tvshowGenreId?: InputMaybe<StringFilter>;
};

/** A connection to a list of `EpisodeGenresRelation` values. */
export type EpisodeGenresRelationsConnection = {
  __typename?: 'EpisodeGenresRelationsConnection';
  /** A list of edges which contains the `EpisodeGenresRelation` and cursor to aid in pagination. */
  edges: Array<EpisodeGenresRelationsEdge>;
  /** A list of `EpisodeGenresRelation` objects. */
  nodes: Array<EpisodeGenresRelation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodeGenresRelation` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EpisodeGenresRelation` edge in the connection. */
export type EpisodeGenresRelationsEdge = {
  __typename?: 'EpisodeGenresRelationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EpisodeGenresRelation` at the end of the edge. */
  node: EpisodeGenresRelation;
};

/** Methods to use when ordering `EpisodeGenresRelation`. */
export enum EpisodeGenresRelationsOrderBy {
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OrderNoAsc = 'ORDER_NO_ASC',
  OrderNoDesc = 'ORDER_NO_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowGenreIdAsc = 'TVSHOW_GENRE_ID_ASC',
  TvshowGenreIdDesc = 'TVSHOW_GENRE_ID_DESC'
}

/** Asset image metadata. */
export type EpisodeImage = {
  __typename?: 'EpisodeImage';
  altText?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Episode` that is related to this `EpisodeImage`. */
  episode?: Maybe<Episode>;
  episodeId?: Maybe<Scalars['String']['output']>;
  /** Height of the image in pixels. */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** URI to the image file. */
  path?: Maybe<Scalars['String']['output']>;
  /** Type of the image. */
  type?: Maybe<Scalars['String']['output']>;
  /** Width of the image in pixels. */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `EpisodeImage` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EpisodeImageCondition = {
  /** Checks for equality with the object’s `altText` field. */
  altText?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `EpisodeImage` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeImageFilter = {
  /** Filter by the object’s `altText` field. */
  altText?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodeImageFilter>>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodeImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodeImageFilter>>;
};

/** A connection to a list of `EpisodeImage` values. */
export type EpisodeImagesConnection = {
  __typename?: 'EpisodeImagesConnection';
  /** A list of edges which contains the `EpisodeImage` and cursor to aid in pagination. */
  edges: Array<EpisodeImagesEdge>;
  /** A list of `EpisodeImage` objects. */
  nodes: Array<EpisodeImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodeImage` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EpisodeImage` edge in the connection. */
export type EpisodeImagesEdge = {
  __typename?: 'EpisodeImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EpisodeImage` at the end of the edge. */
  node: EpisodeImage;
};

/** Methods to use when ordering `EpisodeImage`. */
export enum EpisodeImagesOrderBy {
  AltTextAsc = 'ALT_TEXT_ASC',
  AltTextDesc = 'ALT_TEXT_DESC',
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** Content metadata license that defines the content availability regions and time frame. */
export type EpisodeLicense = {
  __typename?: 'EpisodeLicense';
  /** Array of countries where the license applies. */
  countries?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Time when license becomes invalid. */
  endTime?: Maybe<Scalars['Datetime']['output']>;
  /** Reads a single `Episode` that is related to this `EpisodeLicense`. */
  episode?: Maybe<Episode>;
  episodeId?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** Time when license becomes valid. */
  startTime?: Maybe<Scalars['Datetime']['output']>;
};

/**
 * A condition to be used against `EpisodeLicense` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EpisodeLicenseCondition = {
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `EpisodeLicense` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeLicenseFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodeLicenseFilter>>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodeLicenseFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodeLicenseFilter>>;
};

/** A connection to a list of `EpisodeLicense` values. */
export type EpisodeLicensesConnection = {
  __typename?: 'EpisodeLicensesConnection';
  /** A list of edges which contains the `EpisodeLicense` and cursor to aid in pagination. */
  edges: Array<EpisodeLicensesEdge>;
  /** A list of `EpisodeLicense` objects. */
  nodes: Array<EpisodeLicense>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodeLicense` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EpisodeLicense` edge in the connection. */
export type EpisodeLicensesEdge = {
  __typename?: 'EpisodeLicensesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EpisodeLicense` at the end of the edge. */
  node: EpisodeLicense;
};

/** Methods to use when ordering `EpisodeLicense`. */
export enum EpisodeLicensesOrderBy {
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `Episode` values. */
export type EpisodesConnection = {
  __typename?: 'EpisodesConnection';
  /** A list of edges which contains the `Episode` and cursor to aid in pagination. */
  edges: Array<EpisodesEdge>;
  /** A list of `Episode` objects. */
  nodes: Array<Episode>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Episode` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Episode` edge in the connection. */
export type EpisodesEdge = {
  __typename?: 'EpisodesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Episode` at the end of the edge. */
  node: Episode;
};

/** Methods to use when ordering `Episode`. */
export enum EpisodesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

/** Video stream metadata. */
export type EpisodeVideo = {
  __typename?: 'EpisodeVideo';
  /** Array of audio languages available in the stream. */
  audioLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Array of caption languages available in the stream. */
  captionLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Reads and enables pagination through a set of `EpisodeVideoCuePoint`. */
  cuePoints: EpisodeVideoCuePointsConnection;
  /** URI to a DASH manifest. */
  dashManifest?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Episode` that is related to this `EpisodeVideo`. */
  episode?: Maybe<Episode>;
  episodeId?: Maybe<Scalars['String']['output']>;
  /** URI to an HLS manifest. */
  hlsManifest?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** Indicates whether a stream is protected with DRM. */
  isProtected?: Maybe<Scalars['Boolean']['output']>;
  /** Length of the stream in seconds. */
  lengthInSeconds?: Maybe<Scalars['Float']['output']>;
  /** Output format of the stream. */
  outputFormat?: Maybe<Scalars['String']['output']>;
  /** Array of subtitle languages available in the stream. */
  subtitleLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Title of the video stream */
  title?: Maybe<Scalars['String']['output']>;
  /** Type of the video stream. */
  type?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `EpisodeVideoStream`. */
  videoStreams: EpisodeVideoStreamsConnection;
};


/** Video stream metadata. */
export type EpisodeVideoCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EpisodeVideoCuePointCondition>;
  filter?: InputMaybe<EpisodeVideoCuePointFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EpisodeVideoCuePointsOrderBy>>;
};


/** Video stream metadata. */
export type EpisodeVideoVideoStreamsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EpisodeVideoStreamCondition>;
  filter?: InputMaybe<EpisodeVideoStreamFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EpisodeVideoStreamsOrderBy>>;
};

/**
 * A condition to be used against `EpisodeVideo` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EpisodeVideoCondition = {
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>;
};

/** Video cue point metadata */
export type EpisodeVideoCuePoint = {
  __typename?: 'EpisodeVideoCuePoint';
  /** Type of the cue point */
  cuePointTypeKey: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  /** Time in seconds at which the cue point is set within the video */
  timeInSeconds: Scalars['Float']['output'];
  /** Additional information associated with the cue point */
  value?: Maybe<Scalars['String']['output']>;
  /** Reads a single `EpisodeVideo` that is related to this `EpisodeVideoCuePoint`. */
  video?: Maybe<EpisodeVideo>;
  videoId?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `EpisodeVideoCuePoint` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type EpisodeVideoCuePointCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `EpisodeVideoCuePoint` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeVideoCuePointFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodeVideoCuePointFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodeVideoCuePointFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodeVideoCuePointFilter>>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<IntFilter>;
};

/** A connection to a list of `EpisodeVideoCuePoint` values. */
export type EpisodeVideoCuePointsConnection = {
  __typename?: 'EpisodeVideoCuePointsConnection';
  /** A list of edges which contains the `EpisodeVideoCuePoint` and cursor to aid in pagination. */
  edges: Array<EpisodeVideoCuePointsEdge>;
  /** A list of `EpisodeVideoCuePoint` objects. */
  nodes: Array<EpisodeVideoCuePoint>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodeVideoCuePoint` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EpisodeVideoCuePoint` edge in the connection. */
export type EpisodeVideoCuePointsEdge = {
  __typename?: 'EpisodeVideoCuePointsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EpisodeVideoCuePoint` at the end of the edge. */
  node: EpisodeVideoCuePoint;
};

/** Methods to use when ordering `EpisodeVideoCuePoint`. */
export enum EpisodeVideoCuePointsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** A filter to be used against `EpisodeVideo` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeVideoFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodeVideoFilter>>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodeVideoFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodeVideoFilter>>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>;
};

/** A connection to a list of `EpisodeVideo` values. */
export type EpisodeVideosConnection = {
  __typename?: 'EpisodeVideosConnection';
  /** A list of edges which contains the `EpisodeVideo` and cursor to aid in pagination. */
  edges: Array<EpisodeVideosEdge>;
  /** A list of `EpisodeVideo` objects. */
  nodes: Array<EpisodeVideo>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodeVideo` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EpisodeVideo` edge in the connection. */
export type EpisodeVideosEdge = {
  __typename?: 'EpisodeVideosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EpisodeVideo` at the end of the edge. */
  node: EpisodeVideo;
};

/** Methods to use when ordering `EpisodeVideo`. */
export enum EpisodeVideosOrderBy {
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC'
}

/** Video stream DRM metadata */
export type EpisodeVideoStream = {
  __typename?: 'EpisodeVideoStream';
  /** Bitrate in kilobits per second */
  bitrateInKbps?: Maybe<Scalars['Int']['output']>;
  /** Codecs */
  codecs?: Maybe<Scalars['String']['output']>;
  /** Display aspect ratio for video streams */
  displayAspectRatio?: Maybe<Scalars['String']['output']>;
  /** File path to the initialization segment */
  file?: Maybe<Scalars['String']['output']>;
  /** File Template */
  fileTemplate?: Maybe<Scalars['String']['output']>;
  /** Packaging format of the stream */
  format?: Maybe<Scalars['String']['output']>;
  /** Frame rate of the video stream */
  frameRate?: Maybe<Scalars['Float']['output']>;
  /** Height of the video stream */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** Initialization Vector of the stream */
  iv?: Maybe<Scalars['String']['output']>;
  /** DRM Key ID */
  keyId?: Maybe<Scalars['String']['output']>;
  /** Label indicating the type of stream (audio/video) */
  label?: Maybe<Scalars['String']['output']>;
  /** The language code for audio streams */
  languageCode?: Maybe<Scalars['String']['output']>;
  /** Language name for audio, subtitle, or caption streams */
  languageName?: Maybe<Scalars['String']['output']>;
  /** Pixel aspect ratio for video streams */
  pixelAspectRatio?: Maybe<Scalars['String']['output']>;
  /** Sampling rate for audio streams */
  samplingRate?: Maybe<Scalars['Int']['output']>;
  /** Stream type */
  type?: Maybe<VideoStreamType>;
  /** Reads a single `EpisodeVideo` that is related to this `EpisodeVideoStream`. */
  video?: Maybe<EpisodeVideo>;
  videoId?: Maybe<Scalars['Int']['output']>;
  /** Width of the video stream */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `EpisodeVideoStream` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EpisodeVideoStreamCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<VideoStreamType>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `EpisodeVideoStream` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeVideoStreamFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodeVideoStreamFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodeVideoStreamFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodeVideoStreamFilter>>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<VideoStreamTypeFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<IntFilter>;
};

/** A connection to a list of `EpisodeVideoStream` values. */
export type EpisodeVideoStreamsConnection = {
  __typename?: 'EpisodeVideoStreamsConnection';
  /** A list of edges which contains the `EpisodeVideoStream` and cursor to aid in pagination. */
  edges: Array<EpisodeVideoStreamsEdge>;
  /** A list of `EpisodeVideoStream` objects. */
  nodes: Array<EpisodeVideoStream>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodeVideoStream` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `EpisodeVideoStream` edge in the connection. */
export type EpisodeVideoStreamsEdge = {
  __typename?: 'EpisodeVideoStreamsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EpisodeVideoStream` at the end of the edge. */
  node: EpisodeVideoStream;
};

/** Methods to use when ordering `EpisodeVideoStream`. */
export enum EpisodeVideoStreamsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** Exposes all error codes and messages for errors that a service requests can throw. In some cases, messages that are actually thrown can be different, since they can include more details or a single code can used for different errors of the same type. */
export enum ErrorCodesEnum {
  /** The assertion check for the identifier %s failed. */
  AssertionFailed = 'ASSERTION_FAILED',
  /** A database operation has failed because of a lock timeout. */
  DatabaseLockTimeoutError = 'DATABASE_LOCK_TIMEOUT_ERROR',
  /** An authorization database error has occurred. The user might not have enough permissions. */
  DatabasePermissionsCheckFailed = 'DATABASE_PERMISSIONS_CHECK_FAILED',
  /** An expected and handled database constraint error has occurred. The actual message will have more information. */
  DatabaseValidationFailed = 'DATABASE_VALIDATION_FAILED',
  /** This is a wrapper error for the original unhandled error of unsupported type. */
  ErrorWrapper = 'ERROR_WRAPPER',
  /** A GraphQL validation error has occurred. Please make sure that the GraphQL request is made with correct syntax or parameters. */
  GraphqlValidationFailed = 'GRAPHQL_VALIDATION_FAILED',
  /** An unhandled and unexpected error has occurred. Please contact the service support. */
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  /** The %s does not have a valid license in your current country (%s) */
  LicenseIsNotValid = 'LICENSE_IS_NOT_VALID',
  /** The %s does not have a license. */
  LicenseNotFound = 'LICENSE_NOT_FOUND',
  /** The %s is missing required properties: %s. */
  ObjectIsMissingProperties = 'OBJECT_IS_MISSING_PROPERTIES',
  /** An application startup error has occurred. The actual message will have more information. */
  StartupError = 'STARTUP_ERROR',
  /** Unexpected null or undefined value received. */
  UnexpectedNullUndefined = 'UNEXPECTED_NULL_UNDEFINED',
  /** An unhandled database-related error has occurred. Please contact the service support. */
  UnhandledDatabaseError = 'UNHANDLED_DATABASE_ERROR',
  /** An unhandled error has occurred. Please contact the service support. */
  UnhandledError = 'UNHANDLED_ERROR',
  /** Attempt to create or update an element failed, as it would have resulted in a duplicate element. */
  UniqueConstraintError = 'UNIQUE_CONSTRAINT_ERROR',
  /** The %s is not an object. */
  ValueIsNotObject = 'VALUE_IS_NOT_OBJECT'
}

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

export type Locale = {
  __typename?: 'Locale';
  isDefault: Scalars['Boolean']['output'];
  locale: Scalars['String']['output'];
};

/** A condition to be used against `Locale` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type LocaleCondition = {
  /** Checks for equality with the object’s `isDefault` field. */
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `locale` field. */
  locale?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Locale` object types. All fields are combined with a logical ‘and.’ */
export type LocaleFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<LocaleFilter>>;
  /** Filter by the object’s `isDefault` field. */
  isDefault?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `locale` field. */
  locale?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<LocaleFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<LocaleFilter>>;
};

/** A connection to a list of `Locale` values. */
export type LocalesConnection = {
  __typename?: 'LocalesConnection';
  /** A list of edges which contains the `Locale` and cursor to aid in pagination. */
  edges: Array<LocalesEdge>;
  /** A list of `Locale` objects. */
  nodes: Array<Locale>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Locale` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Locale` edge in the connection. */
export type LocalesEdge = {
  __typename?: 'LocalesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Locale` at the end of the edge. */
  node: Locale;
};

/** Methods to use when ordering `Locale`. */
export enum LocalesOrderBy {
  IsDefaultAsc = 'IS_DEFAULT_ASC',
  IsDefaultDesc = 'IS_DEFAULT_DESC',
  LocaleAsc = 'LOCALE_ASC',
  LocaleDesc = 'LOCALE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** Definition of the movie entity. */
export type Movie = {
  __typename?: 'Movie';
  /** Cast of the movie. */
  cast?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Extended synopsis. */
  description?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `MovieGenresRelation`. */
  genres: MovieGenresRelationsConnection;
  id: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `MovieImage`. */
  images: MovieImagesConnection;
  /** Reads and enables pagination through a set of `MovieLicense`. */
  licenses: MovieLicensesConnection;
  /** Original title of the movie. */
  originalTitle?: Maybe<Scalars['String']['output']>;
  /** Array of production countries */
  productionCountries?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Date of first release. */
  released?: Maybe<Scalars['Datetime']['output']>;
  /** Name of the producing studio. */
  studio?: Maybe<Scalars['String']['output']>;
  /** Short description of the main plot elements. */
  synopsis?: Maybe<Scalars['String']['output']>;
  /** Array of tags associated with the content. */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Title of the movie. */
  title?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `MovieVideo`. */
  videos: MovieVideosConnection;
};


/** Definition of the movie entity. */
export type MovieGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MovieGenresRelationCondition>;
  filter?: InputMaybe<MovieGenresRelationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MovieGenresRelationsOrderBy>>;
};


/** Definition of the movie entity. */
export type MovieImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MovieImageCondition>;
  filter?: InputMaybe<MovieImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MovieImagesOrderBy>>;
};


/** Definition of the movie entity. */
export type MovieLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MovieLicenseCondition>;
  filter?: InputMaybe<MovieLicenseFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MovieLicensesOrderBy>>;
};


/** Definition of the movie entity. */
export type MovieVideosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MovieVideoCondition>;
  filter?: InputMaybe<MovieVideoFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MovieVideosOrderBy>>;
};

/** A condition to be used against `Movie` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MovieCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Movie` object types. All fields are combined with a logical ‘and.’ */
export type MovieFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MovieFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MovieFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MovieFilter>>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** Definition of the movie genre entity. */
export type MovieGenre = {
  __typename?: 'MovieGenre';
  id: Scalars['String']['output'];
  /** Global ordering number for the genre. */
  orderNo?: Maybe<Scalars['Int']['output']>;
  /** Title of the genre. */
  title?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `MovieGenre` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type MovieGenreCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `orderNo` field. */
  orderNo?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `MovieGenre` object types. All fields are combined with a logical ‘and.’ */
export type MovieGenreFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MovieGenreFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MovieGenreFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MovieGenreFilter>>;
  /** Filter by the object’s `orderNo` field. */
  orderNo?: InputMaybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** A connection to a list of `MovieGenre` values. */
export type MovieGenresConnection = {
  __typename?: 'MovieGenresConnection';
  /** A list of edges which contains the `MovieGenre` and cursor to aid in pagination. */
  edges: Array<MovieGenresEdge>;
  /** A list of `MovieGenre` objects. */
  nodes: Array<MovieGenre>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MovieGenre` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `MovieGenre` edge in the connection. */
export type MovieGenresEdge = {
  __typename?: 'MovieGenresEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `MovieGenre` at the end of the edge. */
  node: MovieGenre;
};

/** Methods to use when ordering `MovieGenre`. */
export enum MovieGenresOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OrderNoAsc = 'ORDER_NO_ASC',
  OrderNoDesc = 'ORDER_NO_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

export type MovieGenresRelation = {
  __typename?: 'MovieGenresRelation';
  id: Scalars['Int']['output'];
  /** Reads a single `Movie` that is related to this `MovieGenresRelation`. */
  movie?: Maybe<Movie>;
  /** Reads a single `MovieGenre` that is related to this `MovieGenresRelation`. */
  movieGenre?: Maybe<MovieGenre>;
  movieGenreId?: Maybe<Scalars['String']['output']>;
  movieId?: Maybe<Scalars['String']['output']>;
  orderNo: Scalars['Int']['output'];
};

/**
 * A condition to be used against `MovieGenresRelation` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type MovieGenresRelationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `movieGenreId` field. */
  movieGenreId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `orderNo` field. */
  orderNo?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `MovieGenresRelation` object types. All fields are combined with a logical ‘and.’ */
export type MovieGenresRelationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MovieGenresRelationFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `movieGenreId` field. */
  movieGenreId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MovieGenresRelationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MovieGenresRelationFilter>>;
  /** Filter by the object’s `orderNo` field. */
  orderNo?: InputMaybe<IntFilter>;
};

/** A connection to a list of `MovieGenresRelation` values. */
export type MovieGenresRelationsConnection = {
  __typename?: 'MovieGenresRelationsConnection';
  /** A list of edges which contains the `MovieGenresRelation` and cursor to aid in pagination. */
  edges: Array<MovieGenresRelationsEdge>;
  /** A list of `MovieGenresRelation` objects. */
  nodes: Array<MovieGenresRelation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MovieGenresRelation` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `MovieGenresRelation` edge in the connection. */
export type MovieGenresRelationsEdge = {
  __typename?: 'MovieGenresRelationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `MovieGenresRelation` at the end of the edge. */
  node: MovieGenresRelation;
};

/** Methods to use when ordering `MovieGenresRelation`. */
export enum MovieGenresRelationsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MovieGenreIdAsc = 'MOVIE_GENRE_ID_ASC',
  MovieGenreIdDesc = 'MOVIE_GENRE_ID_DESC',
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  OrderNoAsc = 'ORDER_NO_ASC',
  OrderNoDesc = 'ORDER_NO_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** Asset image metadata. */
export type MovieImage = {
  __typename?: 'MovieImage';
  altText?: Maybe<Scalars['String']['output']>;
  /** Height of the image in pixels. */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** Reads a single `Movie` that is related to this `MovieImage`. */
  movie?: Maybe<Movie>;
  movieId?: Maybe<Scalars['String']['output']>;
  /** URI to the image file. */
  path?: Maybe<Scalars['String']['output']>;
  /** Type of the image. */
  type?: Maybe<Scalars['String']['output']>;
  /** Width of the image in pixels. */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `MovieImage` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type MovieImageCondition = {
  /** Checks for equality with the object’s `altText` field. */
  altText?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `MovieImage` object types. All fields are combined with a logical ‘and.’ */
export type MovieImageFilter = {
  /** Filter by the object’s `altText` field. */
  altText?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MovieImageFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MovieImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MovieImageFilter>>;
};

/** A connection to a list of `MovieImage` values. */
export type MovieImagesConnection = {
  __typename?: 'MovieImagesConnection';
  /** A list of edges which contains the `MovieImage` and cursor to aid in pagination. */
  edges: Array<MovieImagesEdge>;
  /** A list of `MovieImage` objects. */
  nodes: Array<MovieImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MovieImage` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `MovieImage` edge in the connection. */
export type MovieImagesEdge = {
  __typename?: 'MovieImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `MovieImage` at the end of the edge. */
  node: MovieImage;
};

/** Methods to use when ordering `MovieImage`. */
export enum MovieImagesOrderBy {
  AltTextAsc = 'ALT_TEXT_ASC',
  AltTextDesc = 'ALT_TEXT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** Content metadata license that defines the content availability regions and time frame. */
export type MovieLicense = {
  __typename?: 'MovieLicense';
  /** Array of countries where the license applies. */
  countries?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Time when license becomes invalid. */
  endTime?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['Int']['output'];
  /** Reads a single `Movie` that is related to this `MovieLicense`. */
  movie?: Maybe<Movie>;
  movieId?: Maybe<Scalars['String']['output']>;
  /** Time when license becomes valid. */
  startTime?: Maybe<Scalars['Datetime']['output']>;
};

/**
 * A condition to be used against `MovieLicense` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type MovieLicenseCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `MovieLicense` object types. All fields are combined with a logical ‘and.’ */
export type MovieLicenseFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MovieLicenseFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MovieLicenseFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MovieLicenseFilter>>;
};

/** A connection to a list of `MovieLicense` values. */
export type MovieLicensesConnection = {
  __typename?: 'MovieLicensesConnection';
  /** A list of edges which contains the `MovieLicense` and cursor to aid in pagination. */
  edges: Array<MovieLicensesEdge>;
  /** A list of `MovieLicense` objects. */
  nodes: Array<MovieLicense>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MovieLicense` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `MovieLicense` edge in the connection. */
export type MovieLicensesEdge = {
  __typename?: 'MovieLicensesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `MovieLicense` at the end of the edge. */
  node: MovieLicense;
};

/** Methods to use when ordering `MovieLicense`. */
export enum MovieLicensesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `Movie` values. */
export type MoviesConnection = {
  __typename?: 'MoviesConnection';
  /** A list of edges which contains the `Movie` and cursor to aid in pagination. */
  edges: Array<MoviesEdge>;
  /** A list of `Movie` objects. */
  nodes: Array<Movie>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Movie` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Movie` edge in the connection. */
export type MoviesEdge = {
  __typename?: 'MoviesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Movie` at the end of the edge. */
  node: Movie;
};

/** Methods to use when ordering `Movie`. */
export enum MoviesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

/** Video stream metadata. */
export type MovieVideo = {
  __typename?: 'MovieVideo';
  /** Array of audio languages available in the stream. */
  audioLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Array of caption languages available in the stream. */
  captionLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Reads and enables pagination through a set of `MovieVideoCuePoint`. */
  cuePoints: MovieVideoCuePointsConnection;
  /** URI to a DASH manifest. */
  dashManifest?: Maybe<Scalars['String']['output']>;
  /** URI to an HLS manifest. */
  hlsManifest?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** Indicates whether a stream is protected with DRM. */
  isProtected?: Maybe<Scalars['Boolean']['output']>;
  /** Length of the stream in seconds. */
  lengthInSeconds?: Maybe<Scalars['Float']['output']>;
  /** Reads a single `Movie` that is related to this `MovieVideo`. */
  movie?: Maybe<Movie>;
  movieId?: Maybe<Scalars['String']['output']>;
  /** Output format of the stream. */
  outputFormat?: Maybe<Scalars['String']['output']>;
  /** Array of subtitle languages available in the stream. */
  subtitleLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Title of the video stream */
  title?: Maybe<Scalars['String']['output']>;
  /** Type of the video stream. */
  type?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `MovieVideoStream`. */
  videoStreams: MovieVideoStreamsConnection;
};


/** Video stream metadata. */
export type MovieVideoCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MovieVideoCuePointCondition>;
  filter?: InputMaybe<MovieVideoCuePointFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MovieVideoCuePointsOrderBy>>;
};


/** Video stream metadata. */
export type MovieVideoVideoStreamsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MovieVideoStreamCondition>;
  filter?: InputMaybe<MovieVideoStreamFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MovieVideoStreamsOrderBy>>;
};

/**
 * A condition to be used against `MovieVideo` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type MovieVideoCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>;
};

/** Video cue point metadata */
export type MovieVideoCuePoint = {
  __typename?: 'MovieVideoCuePoint';
  /** Type of the cue point */
  cuePointTypeKey: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  /** Time in seconds at which the cue point is set within the video */
  timeInSeconds: Scalars['Float']['output'];
  /** Additional information associated with the cue point */
  value?: Maybe<Scalars['String']['output']>;
  /** Reads a single `MovieVideo` that is related to this `MovieVideoCuePoint`. */
  video?: Maybe<MovieVideo>;
  videoId?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `MovieVideoCuePoint` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type MovieVideoCuePointCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `MovieVideoCuePoint` object types. All fields are combined with a logical ‘and.’ */
export type MovieVideoCuePointFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MovieVideoCuePointFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MovieVideoCuePointFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MovieVideoCuePointFilter>>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<IntFilter>;
};

/** A connection to a list of `MovieVideoCuePoint` values. */
export type MovieVideoCuePointsConnection = {
  __typename?: 'MovieVideoCuePointsConnection';
  /** A list of edges which contains the `MovieVideoCuePoint` and cursor to aid in pagination. */
  edges: Array<MovieVideoCuePointsEdge>;
  /** A list of `MovieVideoCuePoint` objects. */
  nodes: Array<MovieVideoCuePoint>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MovieVideoCuePoint` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `MovieVideoCuePoint` edge in the connection. */
export type MovieVideoCuePointsEdge = {
  __typename?: 'MovieVideoCuePointsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `MovieVideoCuePoint` at the end of the edge. */
  node: MovieVideoCuePoint;
};

/** Methods to use when ordering `MovieVideoCuePoint`. */
export enum MovieVideoCuePointsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** A filter to be used against `MovieVideo` object types. All fields are combined with a logical ‘and.’ */
export type MovieVideoFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MovieVideoFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MovieVideoFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MovieVideoFilter>>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>;
};

/** A connection to a list of `MovieVideo` values. */
export type MovieVideosConnection = {
  __typename?: 'MovieVideosConnection';
  /** A list of edges which contains the `MovieVideo` and cursor to aid in pagination. */
  edges: Array<MovieVideosEdge>;
  /** A list of `MovieVideo` objects. */
  nodes: Array<MovieVideo>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MovieVideo` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `MovieVideo` edge in the connection. */
export type MovieVideosEdge = {
  __typename?: 'MovieVideosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `MovieVideo` at the end of the edge. */
  node: MovieVideo;
};

/** Methods to use when ordering `MovieVideo`. */
export enum MovieVideosOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC'
}

/** Video stream DRM metadata */
export type MovieVideoStream = {
  __typename?: 'MovieVideoStream';
  /** Bitrate in kilobits per second */
  bitrateInKbps?: Maybe<Scalars['Int']['output']>;
  /** Codecs */
  codecs?: Maybe<Scalars['String']['output']>;
  /** Display aspect ratio for video streams */
  displayAspectRatio?: Maybe<Scalars['String']['output']>;
  /** File path to the initialization segment */
  file?: Maybe<Scalars['String']['output']>;
  /** File Template */
  fileTemplate?: Maybe<Scalars['String']['output']>;
  /** Packaging format of the stream */
  format?: Maybe<Scalars['String']['output']>;
  /** Frame rate of the video stream */
  frameRate?: Maybe<Scalars['Float']['output']>;
  /** Height of the video stream */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** Initialization Vector of the stream */
  iv?: Maybe<Scalars['String']['output']>;
  /** DRM Key ID */
  keyId?: Maybe<Scalars['String']['output']>;
  /** Label indicating the type of stream (audio/video) */
  label?: Maybe<Scalars['String']['output']>;
  /** The language code for audio streams */
  languageCode?: Maybe<Scalars['String']['output']>;
  /** Language name for audio, subtitle, or caption streams */
  languageName?: Maybe<Scalars['String']['output']>;
  /** Pixel aspect ratio for video streams */
  pixelAspectRatio?: Maybe<Scalars['String']['output']>;
  /** Sampling rate for audio streams */
  samplingRate?: Maybe<Scalars['Int']['output']>;
  /** Stream type */
  type?: Maybe<VideoStreamType>;
  /** Reads a single `MovieVideo` that is related to this `MovieVideoStream`. */
  video?: Maybe<MovieVideo>;
  videoId?: Maybe<Scalars['Int']['output']>;
  /** Width of the video stream */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `MovieVideoStream` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type MovieVideoStreamCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<VideoStreamType>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `MovieVideoStream` object types. All fields are combined with a logical ‘and.’ */
export type MovieVideoStreamFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MovieVideoStreamFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MovieVideoStreamFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MovieVideoStreamFilter>>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<VideoStreamTypeFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<IntFilter>;
};

/** A connection to a list of `MovieVideoStream` values. */
export type MovieVideoStreamsConnection = {
  __typename?: 'MovieVideoStreamsConnection';
  /** A list of edges which contains the `MovieVideoStream` and cursor to aid in pagination. */
  edges: Array<MovieVideoStreamsEdge>;
  /** A list of `MovieVideoStream` objects. */
  nodes: Array<MovieVideoStream>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MovieVideoStream` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `MovieVideoStream` edge in the connection. */
export type MovieVideoStreamsEdge = {
  __typename?: 'MovieVideoStreamsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `MovieVideoStream` at the end of the edge. */
  node: MovieVideoStream;
};

/** Methods to use when ordering `MovieVideoStream`. */
export enum MovieVideoStreamsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

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

/** Definition of the playlist entity. */
export type Playlist = {
  __typename?: 'Playlist';
  /** Reads a single `Channel` that is related to this `Playlist`. */
  channel?: Maybe<Channel>;
  /** The channel ID. */
  channelId?: Maybe<Scalars['String']['output']>;
  /** End date of the playlist. */
  endDateTime: Scalars['Datetime']['output'];
  id: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Program`. */
  programs: ProgramsConnection;
  /** Start date of the playlist. */
  startDateTime: Scalars['Datetime']['output'];
};


/** Definition of the playlist entity. */
export type PlaylistProgramsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProgramCondition>;
  filter?: InputMaybe<ProgramFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProgramsOrderBy>>;
};

/**
 * A condition to be used against `Playlist` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PlaylistCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Playlist` object types. All fields are combined with a logical ‘and.’ */
export type PlaylistFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PlaylistFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PlaylistFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<PlaylistFilter>>;
};

/** A connection to a list of `Playlist` values. */
export type PlaylistsConnection = {
  __typename?: 'PlaylistsConnection';
  /** A list of edges which contains the `Playlist` and cursor to aid in pagination. */
  edges: Array<PlaylistsEdge>;
  /** A list of `Playlist` objects. */
  nodes: Array<Playlist>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Playlist` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Playlist` edge in the connection. */
export type PlaylistsEdge = {
  __typename?: 'PlaylistsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Playlist` at the end of the edge. */
  node: Playlist;
};

/** Methods to use when ordering `Playlist`. */
export enum PlaylistsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  StartDateTimeAsc = 'START_DATE_TIME_ASC',
  StartDateTimeDesc = 'START_DATE_TIME_DESC'
}

/** Definition of the program object. */
export type Program = {
  __typename?: 'Program';
  /** Reads a single `Episode` that is related to this `Program`. */
  episode?: Maybe<Episode>;
  /** The episode ID. */
  episodeId?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** Reads and enables pagination through a set of `ProgramImage`. */
  images: ProgramImagesConnection;
  /** Reads a single `Movie` that is related to this `Program`. */
  movie?: Maybe<Movie>;
  /** The movie ID. */
  movieId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Playlist` that is related to this `Program`. */
  playlist?: Maybe<Playlist>;
  playlistId?: Maybe<Scalars['String']['output']>;
  /** The sort index of the program. */
  sortIndex?: Maybe<Scalars['Int']['output']>;
  /** Title of the program. */
  title?: Maybe<Scalars['String']['output']>;
};


/** Definition of the program object. */
export type ProgramImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProgramImageCondition>;
  filter?: InputMaybe<ProgramImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProgramImagesOrderBy>>;
};

/** A condition to be used against `Program` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProgramCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `playlistId` field. */
  playlistId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Program` object types. All fields are combined with a logical ‘and.’ */
export type ProgramFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProgramFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProgramFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProgramFilter>>;
  /** Filter by the object’s `playlistId` field. */
  playlistId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** Asset image metadata. */
export type ProgramImage = {
  __typename?: 'ProgramImage';
  altText?: Maybe<Scalars['String']['output']>;
  /** Height of the image in pixels. */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** URI to the image file. */
  path?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Program` that is related to this `ProgramImage`. */
  program?: Maybe<Program>;
  programId?: Maybe<Scalars['Int']['output']>;
  /** Type of the image. */
  type?: Maybe<Scalars['String']['output']>;
  /** Width of the image in pixels. */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `ProgramImage` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ProgramImageCondition = {
  /** Checks for equality with the object’s `altText` field. */
  altText?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `programId` field. */
  programId?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `ProgramImage` object types. All fields are combined with a logical ‘and.’ */
export type ProgramImageFilter = {
  /** Filter by the object’s `altText` field. */
  altText?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProgramImageFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProgramImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProgramImageFilter>>;
  /** Filter by the object’s `programId` field. */
  programId?: InputMaybe<IntFilter>;
};

/** A connection to a list of `ProgramImage` values. */
export type ProgramImagesConnection = {
  __typename?: 'ProgramImagesConnection';
  /** A list of edges which contains the `ProgramImage` and cursor to aid in pagination. */
  edges: Array<ProgramImagesEdge>;
  /** A list of `ProgramImage` objects. */
  nodes: Array<ProgramImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ProgramImage` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `ProgramImage` edge in the connection. */
export type ProgramImagesEdge = {
  __typename?: 'ProgramImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ProgramImage` at the end of the edge. */
  node: ProgramImage;
};

/** Methods to use when ordering `ProgramImage`. */
export enum ProgramImagesOrderBy {
  AltTextAsc = 'ALT_TEXT_ASC',
  AltTextDesc = 'ALT_TEXT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProgramIdAsc = 'PROGRAM_ID_ASC',
  ProgramIdDesc = 'PROGRAM_ID_DESC'
}

/** A connection to a list of `Program` values. */
export type ProgramsConnection = {
  __typename?: 'ProgramsConnection';
  /** A list of edges which contains the `Program` and cursor to aid in pagination. */
  edges: Array<ProgramsEdge>;
  /** A list of `Program` objects. */
  nodes: Array<Program>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Program` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Program` edge in the connection. */
export type ProgramsEdge = {
  __typename?: 'ProgramsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Program` at the end of the edge. */
  node: Program;
};

/** Methods to use when ordering `Program`. */
export enum ProgramsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PlaylistIdAsc = 'PLAYLIST_ID_ASC',
  PlaylistIdDesc = 'PLAYLIST_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SortIndexAsc = 'SORT_INDEX_ASC',
  SortIndexDesc = 'SORT_INDEX_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  channel?: Maybe<Channel>;
  /** Reads and enables pagination through a set of `Channel`. */
  channels?: Maybe<ChannelsConnection>;
  collection?: Maybe<Collection>;
  /** Reads and enables pagination through a set of `Collection`. */
  collections?: Maybe<CollectionsConnection>;
  episode?: Maybe<Episode>;
  /** Reads and enables pagination through a set of `Episode`. */
  episodes?: Maybe<EpisodesConnection>;
  locale?: Maybe<Locale>;
  /** Reads and enables pagination through a set of `Locale`. */
  locales?: Maybe<LocalesConnection>;
  movie?: Maybe<Movie>;
  movieGenre?: Maybe<MovieGenre>;
  /** Reads and enables pagination through a set of `MovieGenre`. */
  movieGenres?: Maybe<MovieGenresConnection>;
  /** Reads and enables pagination through a set of `Movie`. */
  movies?: Maybe<MoviesConnection>;
  playlist?: Maybe<Playlist>;
  /** Reads and enables pagination through a set of `Playlist`. */
  playlists?: Maybe<PlaylistsConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  season?: Maybe<Season>;
  /** Reads and enables pagination through a set of `Season`. */
  seasons?: Maybe<SeasonsConnection>;
  tvshow?: Maybe<Tvshow>;
  tvshowGenre?: Maybe<TvshowGenre>;
  /** Reads and enables pagination through a set of `TvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenresConnection>;
  /** Reads and enables pagination through a set of `Tvshow`. */
  tvshows?: Maybe<TvshowsConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryChannelArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryChannelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChannelCondition>;
  filter?: InputMaybe<ChannelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChannelsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCollectionArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCollectionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CollectionCondition>;
  filter?: InputMaybe<CollectionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CollectionsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodeArgs = {
  countryCode?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EpisodeCondition>;
  filter?: InputMaybe<EpisodeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EpisodesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryLocaleArgs = {
  locale: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryLocalesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LocaleCondition>;
  filter?: InputMaybe<LocaleFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LocalesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMovieArgs = {
  countryCode?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMovieGenreArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMovieGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MovieGenreCondition>;
  filter?: InputMaybe<MovieGenreFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MovieGenresOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MovieCondition>;
  filter?: InputMaybe<MovieFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MoviesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPlaylistArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPlaylistsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PlaylistCondition>;
  filter?: InputMaybe<PlaylistFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PlaylistsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SeasonCondition>;
  filter?: InputMaybe<SeasonFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SeasonsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowGenreArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TvshowGenreCondition>;
  filter?: InputMaybe<TvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TvshowGenresOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TvshowCondition>;
  filter?: InputMaybe<TvshowFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TvshowsOrderBy>>;
};

/** Definition of the TV show season entity. */
export type Season = {
  __typename?: 'Season';
  /** Cast of the season. */
  cast?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Extended synopsis. */
  description?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Episode`. */
  episodes: EpisodesConnection;
  /** Reads and enables pagination through a set of `SeasonGenresRelation`. */
  genres: SeasonGenresRelationsConnection;
  id: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `SeasonImage`. */
  images: SeasonImagesConnection;
  /** Season number */
  index?: Maybe<Scalars['Int']['output']>;
  /** Reads and enables pagination through a set of `SeasonLicense`. */
  licenses: SeasonLicensesConnection;
  /** Array of production countries */
  productionCountries?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Date of first release. */
  released?: Maybe<Scalars['Datetime']['output']>;
  /** Name of the producing studio. */
  studio?: Maybe<Scalars['String']['output']>;
  /** Short description of the main plot elements. */
  synopsis?: Maybe<Scalars['String']['output']>;
  /** Array of tags associated with the content. */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Reads a single `Tvshow` that is related to this `Season`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `SeasonVideo`. */
  videos: SeasonVideosConnection;
};


/** Definition of the TV show season entity. */
export type SeasonEpisodesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EpisodeCondition>;
  filter?: InputMaybe<EpisodeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EpisodesOrderBy>>;
};


/** Definition of the TV show season entity. */
export type SeasonGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SeasonGenresRelationCondition>;
  filter?: InputMaybe<SeasonGenresRelationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SeasonGenresRelationsOrderBy>>;
};


/** Definition of the TV show season entity. */
export type SeasonImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SeasonImageCondition>;
  filter?: InputMaybe<SeasonImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SeasonImagesOrderBy>>;
};


/** Definition of the TV show season entity. */
export type SeasonLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SeasonLicenseCondition>;
  filter?: InputMaybe<SeasonLicenseFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SeasonLicensesOrderBy>>;
};


/** Definition of the TV show season entity. */
export type SeasonVideosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SeasonVideoCondition>;
  filter?: InputMaybe<SeasonVideoFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SeasonVideosOrderBy>>;
};

/** A condition to be used against `Season` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SeasonCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Season` object types. All fields are combined with a logical ‘and.’ */
export type SeasonFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonFilter>>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<StringFilter>;
};

export type SeasonGenresRelation = {
  __typename?: 'SeasonGenresRelation';
  id: Scalars['Int']['output'];
  orderNo: Scalars['Int']['output'];
  /** Reads a single `Season` that is related to this `SeasonGenresRelation`. */
  season?: Maybe<Season>;
  seasonId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `TvshowGenre` that is related to this `SeasonGenresRelation`. */
  tvshowGenre?: Maybe<TvshowGenre>;
  tvshowGenreId?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `SeasonGenresRelation` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type SeasonGenresRelationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `orderNo` field. */
  orderNo?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `tvshowGenreId` field. */
  tvshowGenreId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `SeasonGenresRelation` object types. All fields are combined with a logical ‘and.’ */
export type SeasonGenresRelationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonGenresRelationFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonGenresRelationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonGenresRelationFilter>>;
  /** Filter by the object’s `orderNo` field. */
  orderNo?: InputMaybe<IntFilter>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tvshowGenreId` field. */
  tvshowGenreId?: InputMaybe<StringFilter>;
};

/** A connection to a list of `SeasonGenresRelation` values. */
export type SeasonGenresRelationsConnection = {
  __typename?: 'SeasonGenresRelationsConnection';
  /** A list of edges which contains the `SeasonGenresRelation` and cursor to aid in pagination. */
  edges: Array<SeasonGenresRelationsEdge>;
  /** A list of `SeasonGenresRelation` objects. */
  nodes: Array<SeasonGenresRelation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonGenresRelation` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `SeasonGenresRelation` edge in the connection. */
export type SeasonGenresRelationsEdge = {
  __typename?: 'SeasonGenresRelationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `SeasonGenresRelation` at the end of the edge. */
  node: SeasonGenresRelation;
};

/** Methods to use when ordering `SeasonGenresRelation`. */
export enum SeasonGenresRelationsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OrderNoAsc = 'ORDER_NO_ASC',
  OrderNoDesc = 'ORDER_NO_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC',
  TvshowGenreIdAsc = 'TVSHOW_GENRE_ID_ASC',
  TvshowGenreIdDesc = 'TVSHOW_GENRE_ID_DESC'
}

/** Asset image metadata. */
export type SeasonImage = {
  __typename?: 'SeasonImage';
  altText?: Maybe<Scalars['String']['output']>;
  /** Height of the image in pixels. */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** URI to the image file. */
  path?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Season` that is related to this `SeasonImage`. */
  season?: Maybe<Season>;
  seasonId?: Maybe<Scalars['String']['output']>;
  /** Type of the image. */
  type?: Maybe<Scalars['String']['output']>;
  /** Width of the image in pixels. */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `SeasonImage` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type SeasonImageCondition = {
  /** Checks for equality with the object’s `altText` field. */
  altText?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `SeasonImage` object types. All fields are combined with a logical ‘and.’ */
export type SeasonImageFilter = {
  /** Filter by the object’s `altText` field. */
  altText?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonImageFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonImageFilter>>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<StringFilter>;
};

/** A connection to a list of `SeasonImage` values. */
export type SeasonImagesConnection = {
  __typename?: 'SeasonImagesConnection';
  /** A list of edges which contains the `SeasonImage` and cursor to aid in pagination. */
  edges: Array<SeasonImagesEdge>;
  /** A list of `SeasonImage` objects. */
  nodes: Array<SeasonImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonImage` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `SeasonImage` edge in the connection. */
export type SeasonImagesEdge = {
  __typename?: 'SeasonImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `SeasonImage` at the end of the edge. */
  node: SeasonImage;
};

/** Methods to use when ordering `SeasonImage`. */
export enum SeasonImagesOrderBy {
  AltTextAsc = 'ALT_TEXT_ASC',
  AltTextDesc = 'ALT_TEXT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC'
}

/** Content metadata license that defines the content availability regions and time frame. */
export type SeasonLicense = {
  __typename?: 'SeasonLicense';
  /** Array of countries where the license applies. */
  countries?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Time when license becomes invalid. */
  endTime?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['Int']['output'];
  /** Reads a single `Season` that is related to this `SeasonLicense`. */
  season?: Maybe<Season>;
  seasonId?: Maybe<Scalars['String']['output']>;
  /** Time when license becomes valid. */
  startTime?: Maybe<Scalars['Datetime']['output']>;
};

/**
 * A condition to be used against `SeasonLicense` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SeasonLicenseCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `SeasonLicense` object types. All fields are combined with a logical ‘and.’ */
export type SeasonLicenseFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonLicenseFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonLicenseFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonLicenseFilter>>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<StringFilter>;
};

/** A connection to a list of `SeasonLicense` values. */
export type SeasonLicensesConnection = {
  __typename?: 'SeasonLicensesConnection';
  /** A list of edges which contains the `SeasonLicense` and cursor to aid in pagination. */
  edges: Array<SeasonLicensesEdge>;
  /** A list of `SeasonLicense` objects. */
  nodes: Array<SeasonLicense>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonLicense` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `SeasonLicense` edge in the connection. */
export type SeasonLicensesEdge = {
  __typename?: 'SeasonLicensesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `SeasonLicense` at the end of the edge. */
  node: SeasonLicense;
};

/** Methods to use when ordering `SeasonLicense`. */
export enum SeasonLicensesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC'
}

/** A connection to a list of `Season` values. */
export type SeasonsConnection = {
  __typename?: 'SeasonsConnection';
  /** A list of edges which contains the `Season` and cursor to aid in pagination. */
  edges: Array<SeasonsEdge>;
  /** A list of `Season` objects. */
  nodes: Array<Season>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Season` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Season` edge in the connection. */
export type SeasonsEdge = {
  __typename?: 'SeasonsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Season` at the end of the edge. */
  node: Season;
};

/** Methods to use when ordering `Season`. */
export enum SeasonsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/** Video stream metadata. */
export type SeasonVideo = {
  __typename?: 'SeasonVideo';
  /** Array of audio languages available in the stream. */
  audioLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Array of caption languages available in the stream. */
  captionLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Reads and enables pagination through a set of `SeasonVideoCuePoint`. */
  cuePoints: SeasonVideoCuePointsConnection;
  /** URI to a DASH manifest. */
  dashManifest?: Maybe<Scalars['String']['output']>;
  /** URI to an HLS manifest. */
  hlsManifest?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** Indicates whether a stream is protected with DRM. */
  isProtected?: Maybe<Scalars['Boolean']['output']>;
  /** Length of the stream in seconds. */
  lengthInSeconds?: Maybe<Scalars['Float']['output']>;
  /** Output format of the stream. */
  outputFormat?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Season` that is related to this `SeasonVideo`. */
  season?: Maybe<Season>;
  seasonId?: Maybe<Scalars['String']['output']>;
  /** Array of subtitle languages available in the stream. */
  subtitleLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Title of the video stream */
  title?: Maybe<Scalars['String']['output']>;
  /** Type of the video stream. */
  type?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `SeasonVideoStream`. */
  videoStreams: SeasonVideoStreamsConnection;
};


/** Video stream metadata. */
export type SeasonVideoCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SeasonVideoCuePointCondition>;
  filter?: InputMaybe<SeasonVideoCuePointFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SeasonVideoCuePointsOrderBy>>;
};


/** Video stream metadata. */
export type SeasonVideoVideoStreamsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SeasonVideoStreamCondition>;
  filter?: InputMaybe<SeasonVideoStreamFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SeasonVideoStreamsOrderBy>>;
};

/**
 * A condition to be used against `SeasonVideo` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type SeasonVideoCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['String']['input']>;
};

/** Video cue point metadata */
export type SeasonVideoCuePoint = {
  __typename?: 'SeasonVideoCuePoint';
  /** Type of the cue point */
  cuePointTypeKey: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  /** Time in seconds at which the cue point is set within the video */
  timeInSeconds: Scalars['Float']['output'];
  /** Additional information associated with the cue point */
  value?: Maybe<Scalars['String']['output']>;
  /** Reads a single `SeasonVideo` that is related to this `SeasonVideoCuePoint`. */
  video?: Maybe<SeasonVideo>;
  videoId?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `SeasonVideoCuePoint` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type SeasonVideoCuePointCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `SeasonVideoCuePoint` object types. All fields are combined with a logical ‘and.’ */
export type SeasonVideoCuePointFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonVideoCuePointFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonVideoCuePointFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonVideoCuePointFilter>>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<IntFilter>;
};

/** A connection to a list of `SeasonVideoCuePoint` values. */
export type SeasonVideoCuePointsConnection = {
  __typename?: 'SeasonVideoCuePointsConnection';
  /** A list of edges which contains the `SeasonVideoCuePoint` and cursor to aid in pagination. */
  edges: Array<SeasonVideoCuePointsEdge>;
  /** A list of `SeasonVideoCuePoint` objects. */
  nodes: Array<SeasonVideoCuePoint>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonVideoCuePoint` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `SeasonVideoCuePoint` edge in the connection. */
export type SeasonVideoCuePointsEdge = {
  __typename?: 'SeasonVideoCuePointsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `SeasonVideoCuePoint` at the end of the edge. */
  node: SeasonVideoCuePoint;
};

/** Methods to use when ordering `SeasonVideoCuePoint`. */
export enum SeasonVideoCuePointsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** A filter to be used against `SeasonVideo` object types. All fields are combined with a logical ‘and.’ */
export type SeasonVideoFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonVideoFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonVideoFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonVideoFilter>>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<StringFilter>;
};

/** A connection to a list of `SeasonVideo` values. */
export type SeasonVideosConnection = {
  __typename?: 'SeasonVideosConnection';
  /** A list of edges which contains the `SeasonVideo` and cursor to aid in pagination. */
  edges: Array<SeasonVideosEdge>;
  /** A list of `SeasonVideo` objects. */
  nodes: Array<SeasonVideo>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonVideo` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `SeasonVideo` edge in the connection. */
export type SeasonVideosEdge = {
  __typename?: 'SeasonVideosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `SeasonVideo` at the end of the edge. */
  node: SeasonVideo;
};

/** Methods to use when ordering `SeasonVideo`. */
export enum SeasonVideosOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC'
}

/** Video stream DRM metadata */
export type SeasonVideoStream = {
  __typename?: 'SeasonVideoStream';
  /** Bitrate in kilobits per second */
  bitrateInKbps?: Maybe<Scalars['Int']['output']>;
  /** Codecs */
  codecs?: Maybe<Scalars['String']['output']>;
  /** Display aspect ratio for video streams */
  displayAspectRatio?: Maybe<Scalars['String']['output']>;
  /** File path to the initialization segment */
  file?: Maybe<Scalars['String']['output']>;
  /** File Template */
  fileTemplate?: Maybe<Scalars['String']['output']>;
  /** Packaging format of the stream */
  format?: Maybe<Scalars['String']['output']>;
  /** Frame rate of the video stream */
  frameRate?: Maybe<Scalars['Float']['output']>;
  /** Height of the video stream */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** Initialization Vector of the stream */
  iv?: Maybe<Scalars['String']['output']>;
  /** DRM Key ID */
  keyId?: Maybe<Scalars['String']['output']>;
  /** Label indicating the type of stream (audio/video) */
  label?: Maybe<Scalars['String']['output']>;
  /** The language code for audio streams */
  languageCode?: Maybe<Scalars['String']['output']>;
  /** Language name for audio, subtitle, or caption streams */
  languageName?: Maybe<Scalars['String']['output']>;
  /** Pixel aspect ratio for video streams */
  pixelAspectRatio?: Maybe<Scalars['String']['output']>;
  /** Sampling rate for audio streams */
  samplingRate?: Maybe<Scalars['Int']['output']>;
  /** Stream type */
  type?: Maybe<VideoStreamType>;
  /** Reads a single `SeasonVideo` that is related to this `SeasonVideoStream`. */
  video?: Maybe<SeasonVideo>;
  videoId?: Maybe<Scalars['Int']['output']>;
  /** Width of the video stream */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `SeasonVideoStream` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SeasonVideoStreamCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<VideoStreamType>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `SeasonVideoStream` object types. All fields are combined with a logical ‘and.’ */
export type SeasonVideoStreamFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonVideoStreamFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonVideoStreamFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonVideoStreamFilter>>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<VideoStreamTypeFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<IntFilter>;
};

/** A connection to a list of `SeasonVideoStream` values. */
export type SeasonVideoStreamsConnection = {
  __typename?: 'SeasonVideoStreamsConnection';
  /** A list of edges which contains the `SeasonVideoStream` and cursor to aid in pagination. */
  edges: Array<SeasonVideoStreamsEdge>;
  /** A list of `SeasonVideoStream` objects. */
  nodes: Array<SeasonVideoStream>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonVideoStream` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `SeasonVideoStream` edge in the connection. */
export type SeasonVideoStreamsEdge = {
  __typename?: 'SeasonVideoStreamsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `SeasonVideoStream` at the end of the edge. */
  node: SeasonVideoStream;
};

/** Methods to use when ordering `SeasonVideoStream`. */
export enum SeasonVideoStreamsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
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

/** Definition of the TV show entity. */
export type Tvshow = {
  __typename?: 'Tvshow';
  /** Cast of the TV show. */
  cast?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Extended synopsis. */
  description?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `TvshowGenresRelation`. */
  genres: TvshowGenresRelationsConnection;
  id: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `TvshowImage`. */
  images: TvshowImagesConnection;
  /** Reads and enables pagination through a set of `TvshowLicense`. */
  licenses: TvshowLicensesConnection;
  /** Original title of the TV show. */
  originalTitle?: Maybe<Scalars['String']['output']>;
  /** Array of production countries */
  productionCountries?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Date of first release. */
  released?: Maybe<Scalars['Datetime']['output']>;
  /** Reads and enables pagination through a set of `Season`. */
  seasons: SeasonsConnection;
  /** Name of the producing studio. */
  studio?: Maybe<Scalars['String']['output']>;
  /** Short description of the main plot elements. */
  synopsis?: Maybe<Scalars['String']['output']>;
  /** Array of tags associated with the content. */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Title of the TV show. */
  title?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `TvshowVideo`. */
  videos: TvshowVideosConnection;
};


/** Definition of the TV show entity. */
export type TvshowGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TvshowGenresRelationCondition>;
  filter?: InputMaybe<TvshowGenresRelationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TvshowGenresRelationsOrderBy>>;
};


/** Definition of the TV show entity. */
export type TvshowImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TvshowImageCondition>;
  filter?: InputMaybe<TvshowImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TvshowImagesOrderBy>>;
};


/** Definition of the TV show entity. */
export type TvshowLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TvshowLicenseCondition>;
  filter?: InputMaybe<TvshowLicenseFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TvshowLicensesOrderBy>>;
};


/** Definition of the TV show entity. */
export type TvshowSeasonsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SeasonCondition>;
  filter?: InputMaybe<SeasonFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SeasonsOrderBy>>;
};


/** Definition of the TV show entity. */
export type TvshowVideosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TvshowVideoCondition>;
  filter?: InputMaybe<TvshowVideoFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TvshowVideosOrderBy>>;
};

/** A condition to be used against `Tvshow` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TvshowCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Tvshow` object types. All fields are combined with a logical ‘and.’ */
export type TvshowFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowFilter>>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** Definition of the TV show genre entity. */
export type TvshowGenre = {
  __typename?: 'TvshowGenre';
  id: Scalars['String']['output'];
  /** Global ordering number for the genre. */
  orderNo?: Maybe<Scalars['Int']['output']>;
  /** Title of the genre. */
  title?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `TvshowGenre` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TvshowGenreCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `orderNo` field. */
  orderNo?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `TvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type TvshowGenreFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowGenreFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowGenreFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowGenreFilter>>;
  /** Filter by the object’s `orderNo` field. */
  orderNo?: InputMaybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** A connection to a list of `TvshowGenre` values. */
export type TvshowGenresConnection = {
  __typename?: 'TvshowGenresConnection';
  /** A list of edges which contains the `TvshowGenre` and cursor to aid in pagination. */
  edges: Array<TvshowGenresEdge>;
  /** A list of `TvshowGenre` objects. */
  nodes: Array<TvshowGenre>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowGenre` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TvshowGenre` edge in the connection. */
export type TvshowGenresEdge = {
  __typename?: 'TvshowGenresEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TvshowGenre` at the end of the edge. */
  node: TvshowGenre;
};

/** Methods to use when ordering `TvshowGenre`. */
export enum TvshowGenresOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OrderNoAsc = 'ORDER_NO_ASC',
  OrderNoDesc = 'ORDER_NO_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

export type TvshowGenresRelation = {
  __typename?: 'TvshowGenresRelation';
  id: Scalars['Int']['output'];
  orderNo: Scalars['Int']['output'];
  /** Reads a single `Tvshow` that is related to this `TvshowGenresRelation`. */
  tvshow?: Maybe<Tvshow>;
  /** Reads a single `TvshowGenre` that is related to this `TvshowGenresRelation`. */
  tvshowGenre?: Maybe<TvshowGenre>;
  tvshowGenreId?: Maybe<Scalars['String']['output']>;
  tvshowId?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `TvshowGenresRelation` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type TvshowGenresRelationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `orderNo` field. */
  orderNo?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `tvshowGenreId` field. */
  tvshowGenreId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `TvshowGenresRelation` object types. All fields are combined with a logical ‘and.’ */
export type TvshowGenresRelationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowGenresRelationFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowGenresRelationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowGenresRelationFilter>>;
  /** Filter by the object’s `orderNo` field. */
  orderNo?: InputMaybe<IntFilter>;
  /** Filter by the object’s `tvshowGenreId` field. */
  tvshowGenreId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<StringFilter>;
};

/** A connection to a list of `TvshowGenresRelation` values. */
export type TvshowGenresRelationsConnection = {
  __typename?: 'TvshowGenresRelationsConnection';
  /** A list of edges which contains the `TvshowGenresRelation` and cursor to aid in pagination. */
  edges: Array<TvshowGenresRelationsEdge>;
  /** A list of `TvshowGenresRelation` objects. */
  nodes: Array<TvshowGenresRelation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowGenresRelation` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TvshowGenresRelation` edge in the connection. */
export type TvshowGenresRelationsEdge = {
  __typename?: 'TvshowGenresRelationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TvshowGenresRelation` at the end of the edge. */
  node: TvshowGenresRelation;
};

/** Methods to use when ordering `TvshowGenresRelation`. */
export enum TvshowGenresRelationsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OrderNoAsc = 'ORDER_NO_ASC',
  OrderNoDesc = 'ORDER_NO_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowGenreIdAsc = 'TVSHOW_GENRE_ID_ASC',
  TvshowGenreIdDesc = 'TVSHOW_GENRE_ID_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/** Asset image metadata. */
export type TvshowImage = {
  __typename?: 'TvshowImage';
  altText?: Maybe<Scalars['String']['output']>;
  /** Height of the image in pixels. */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** URI to the image file. */
  path?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Tvshow` that is related to this `TvshowImage`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId?: Maybe<Scalars['String']['output']>;
  /** Type of the image. */
  type?: Maybe<Scalars['String']['output']>;
  /** Width of the image in pixels. */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `TvshowImage` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TvshowImageCondition = {
  /** Checks for equality with the object’s `altText` field. */
  altText?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `TvshowImage` object types. All fields are combined with a logical ‘and.’ */
export type TvshowImageFilter = {
  /** Filter by the object’s `altText` field. */
  altText?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowImageFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowImageFilter>>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<StringFilter>;
};

/** A connection to a list of `TvshowImage` values. */
export type TvshowImagesConnection = {
  __typename?: 'TvshowImagesConnection';
  /** A list of edges which contains the `TvshowImage` and cursor to aid in pagination. */
  edges: Array<TvshowImagesEdge>;
  /** A list of `TvshowImage` objects. */
  nodes: Array<TvshowImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowImage` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TvshowImage` edge in the connection. */
export type TvshowImagesEdge = {
  __typename?: 'TvshowImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TvshowImage` at the end of the edge. */
  node: TvshowImage;
};

/** Methods to use when ordering `TvshowImage`. */
export enum TvshowImagesOrderBy {
  AltTextAsc = 'ALT_TEXT_ASC',
  AltTextDesc = 'ALT_TEXT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/** Content metadata license that defines the content availability regions and time frame. */
export type TvshowLicense = {
  __typename?: 'TvshowLicense';
  /** Array of countries where the license applies. */
  countries?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Time when license becomes invalid. */
  endTime?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['Int']['output'];
  /** Time when license becomes valid. */
  startTime?: Maybe<Scalars['Datetime']['output']>;
  /** Reads a single `Tvshow` that is related to this `TvshowLicense`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `TvshowLicense` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TvshowLicenseCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `TvshowLicense` object types. All fields are combined with a logical ‘and.’ */
export type TvshowLicenseFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowLicenseFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowLicenseFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowLicenseFilter>>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<StringFilter>;
};

/** A connection to a list of `TvshowLicense` values. */
export type TvshowLicensesConnection = {
  __typename?: 'TvshowLicensesConnection';
  /** A list of edges which contains the `TvshowLicense` and cursor to aid in pagination. */
  edges: Array<TvshowLicensesEdge>;
  /** A list of `TvshowLicense` objects. */
  nodes: Array<TvshowLicense>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowLicense` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TvshowLicense` edge in the connection. */
export type TvshowLicensesEdge = {
  __typename?: 'TvshowLicensesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TvshowLicense` at the end of the edge. */
  node: TvshowLicense;
};

/** Methods to use when ordering `TvshowLicense`. */
export enum TvshowLicensesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/** A connection to a list of `Tvshow` values. */
export type TvshowsConnection = {
  __typename?: 'TvshowsConnection';
  /** A list of edges which contains the `Tvshow` and cursor to aid in pagination. */
  edges: Array<TvshowsEdge>;
  /** A list of `Tvshow` objects. */
  nodes: Array<Tvshow>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Tvshow` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Tvshow` edge in the connection. */
export type TvshowsEdge = {
  __typename?: 'TvshowsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Tvshow` at the end of the edge. */
  node: Tvshow;
};

/** Methods to use when ordering `Tvshow`. */
export enum TvshowsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

/** Video stream metadata. */
export type TvshowVideo = {
  __typename?: 'TvshowVideo';
  /** Array of audio languages available in the stream. */
  audioLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Array of caption languages available in the stream. */
  captionLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Reads and enables pagination through a set of `TvshowVideoCuePoint`. */
  cuePoints: TvshowVideoCuePointsConnection;
  /** URI to a DASH manifest. */
  dashManifest?: Maybe<Scalars['String']['output']>;
  /** URI to an HLS manifest. */
  hlsManifest?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** Indicates whether a stream is protected with DRM. */
  isProtected?: Maybe<Scalars['Boolean']['output']>;
  /** Length of the stream in seconds. */
  lengthInSeconds?: Maybe<Scalars['Float']['output']>;
  /** Output format of the stream. */
  outputFormat?: Maybe<Scalars['String']['output']>;
  /** Array of subtitle languages available in the stream. */
  subtitleLanguages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Title of the video stream */
  title?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Tvshow` that is related to this `TvshowVideo`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId?: Maybe<Scalars['String']['output']>;
  /** Type of the video stream. */
  type?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `TvshowVideoStream`. */
  videoStreams: TvshowVideoStreamsConnection;
};


/** Video stream metadata. */
export type TvshowVideoCuePointsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TvshowVideoCuePointCondition>;
  filter?: InputMaybe<TvshowVideoCuePointFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TvshowVideoCuePointsOrderBy>>;
};


/** Video stream metadata. */
export type TvshowVideoVideoStreamsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TvshowVideoStreamCondition>;
  filter?: InputMaybe<TvshowVideoStreamFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TvshowVideoStreamsOrderBy>>;
};

/**
 * A condition to be used against `TvshowVideo` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TvshowVideoCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['String']['input']>;
};

/** Video cue point metadata */
export type TvshowVideoCuePoint = {
  __typename?: 'TvshowVideoCuePoint';
  /** Type of the cue point */
  cuePointTypeKey: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  /** Time in seconds at which the cue point is set within the video */
  timeInSeconds: Scalars['Float']['output'];
  /** Additional information associated with the cue point */
  value?: Maybe<Scalars['String']['output']>;
  /** Reads a single `TvshowVideo` that is related to this `TvshowVideoCuePoint`. */
  video?: Maybe<TvshowVideo>;
  videoId?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `TvshowVideoCuePoint` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type TvshowVideoCuePointCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `TvshowVideoCuePoint` object types. All fields are combined with a logical ‘and.’ */
export type TvshowVideoCuePointFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowVideoCuePointFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowVideoCuePointFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowVideoCuePointFilter>>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<IntFilter>;
};

/** A connection to a list of `TvshowVideoCuePoint` values. */
export type TvshowVideoCuePointsConnection = {
  __typename?: 'TvshowVideoCuePointsConnection';
  /** A list of edges which contains the `TvshowVideoCuePoint` and cursor to aid in pagination. */
  edges: Array<TvshowVideoCuePointsEdge>;
  /** A list of `TvshowVideoCuePoint` objects. */
  nodes: Array<TvshowVideoCuePoint>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowVideoCuePoint` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TvshowVideoCuePoint` edge in the connection. */
export type TvshowVideoCuePointsEdge = {
  __typename?: 'TvshowVideoCuePointsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TvshowVideoCuePoint` at the end of the edge. */
  node: TvshowVideoCuePoint;
};

/** Methods to use when ordering `TvshowVideoCuePoint`. */
export enum TvshowVideoCuePointsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** A filter to be used against `TvshowVideo` object types. All fields are combined with a logical ‘and.’ */
export type TvshowVideoFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowVideoFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowVideoFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowVideoFilter>>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<StringFilter>;
};

/** A connection to a list of `TvshowVideo` values. */
export type TvshowVideosConnection = {
  __typename?: 'TvshowVideosConnection';
  /** A list of edges which contains the `TvshowVideo` and cursor to aid in pagination. */
  edges: Array<TvshowVideosEdge>;
  /** A list of `TvshowVideo` objects. */
  nodes: Array<TvshowVideo>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowVideo` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TvshowVideo` edge in the connection. */
export type TvshowVideosEdge = {
  __typename?: 'TvshowVideosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TvshowVideo` at the end of the edge. */
  node: TvshowVideo;
};

/** Methods to use when ordering `TvshowVideo`. */
export enum TvshowVideosOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/** Video stream DRM metadata */
export type TvshowVideoStream = {
  __typename?: 'TvshowVideoStream';
  /** Bitrate in kilobits per second */
  bitrateInKbps?: Maybe<Scalars['Int']['output']>;
  /** Codecs */
  codecs?: Maybe<Scalars['String']['output']>;
  /** Display aspect ratio for video streams */
  displayAspectRatio?: Maybe<Scalars['String']['output']>;
  /** File path to the initialization segment */
  file?: Maybe<Scalars['String']['output']>;
  /** File Template */
  fileTemplate?: Maybe<Scalars['String']['output']>;
  /** Packaging format of the stream */
  format?: Maybe<Scalars['String']['output']>;
  /** Frame rate of the video stream */
  frameRate?: Maybe<Scalars['Float']['output']>;
  /** Height of the video stream */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  /** Initialization Vector of the stream */
  iv?: Maybe<Scalars['String']['output']>;
  /** DRM Key ID */
  keyId?: Maybe<Scalars['String']['output']>;
  /** Label indicating the type of stream (audio/video) */
  label?: Maybe<Scalars['String']['output']>;
  /** The language code for audio streams */
  languageCode?: Maybe<Scalars['String']['output']>;
  /** Language name for audio, subtitle, or caption streams */
  languageName?: Maybe<Scalars['String']['output']>;
  /** Pixel aspect ratio for video streams */
  pixelAspectRatio?: Maybe<Scalars['String']['output']>;
  /** Sampling rate for audio streams */
  samplingRate?: Maybe<Scalars['Int']['output']>;
  /** Stream type */
  type?: Maybe<VideoStreamType>;
  /** Reads a single `TvshowVideo` that is related to this `TvshowVideoStream`. */
  video?: Maybe<TvshowVideo>;
  videoId?: Maybe<Scalars['Int']['output']>;
  /** Width of the video stream */
  width?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `TvshowVideoStream` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TvshowVideoStreamCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<VideoStreamType>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against `TvshowVideoStream` object types. All fields are combined with a logical ‘and.’ */
export type TvshowVideoStreamFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowVideoStreamFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowVideoStreamFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowVideoStreamFilter>>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<VideoStreamTypeFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<IntFilter>;
};

/** A connection to a list of `TvshowVideoStream` values. */
export type TvshowVideoStreamsConnection = {
  __typename?: 'TvshowVideoStreamsConnection';
  /** A list of edges which contains the `TvshowVideoStream` and cursor to aid in pagination. */
  edges: Array<TvshowVideoStreamsEdge>;
  /** A list of `TvshowVideoStream` objects. */
  nodes: Array<TvshowVideoStream>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowVideoStream` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TvshowVideoStream` edge in the connection. */
export type TvshowVideoStreamsEdge = {
  __typename?: 'TvshowVideoStreamsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TvshowVideoStream` at the end of the edge. */
  node: TvshowVideoStream;
};

/** Methods to use when ordering `TvshowVideoStream`. */
export enum TvshowVideoStreamsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
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

export type GetChannelVideoQueryVariables = Exact<{
  id: string;
}>;


export type GetChannelVideoQuery = { channel: { dashStreamUrl: string | null, hlsStreamUrl: string | null, keyId: string | null } | null };

export type GetEpisodeMainVideoQueryVariables = Exact<{
  id: string;
  countryCode?: string | null | undefined;
}>;


export type GetEpisodeMainVideoQuery = { episode: { videos: { nodes: Array<{ id: number, isProtected: boolean | null, videoStreams: { nodes: Array<{ keyId: string | null }> } }> } } | null };

export type GetMovieMainVideoQueryVariables = Exact<{
  id: string;
  countryCode?: string | null | undefined;
}>;


export type GetMovieMainVideoQuery = { movie: { videos: { nodes: Array<{ id: number, isProtected: boolean | null, videoStreams: { nodes: Array<{ keyId: string | null }> } }> } } | null };


export const GetChannelVideoDocument = gql`
    query GetChannelVideo($id: String!) {
  channel(id: $id) {
    dashStreamUrl
    hlsStreamUrl
    keyId
  }
}
    `;
export const GetEpisodeMainVideoDocument = gql`
    query GetEpisodeMainVideo($id: String!, $countryCode: String) {
  episode(id: $id, countryCode: $countryCode) {
    videos(filter: {type: {equalTo: "MAIN"}}) {
      nodes {
        id
        isProtected
        videoStreams {
          nodes {
            keyId
          }
        }
      }
    }
  }
}
    `;
export const GetMovieMainVideoDocument = gql`
    query GetMovieMainVideo($id: String!, $countryCode: String) {
  movie(id: $id, countryCode: $countryCode) {
    videos(filter: {type: {equalTo: "MAIN"}}) {
      nodes {
        id
        isProtected
        videoStreams {
          nodes {
            keyId
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();
const GetChannelVideoDocumentString = print(GetChannelVideoDocument);
const GetEpisodeMainVideoDocumentString = print(GetEpisodeMainVideoDocument);
const GetMovieMainVideoDocumentString = print(GetMovieMainVideoDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetChannelVideo(variables: GetChannelVideoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetChannelVideoQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetChannelVideoQuery>(GetChannelVideoDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetChannelVideo', 'query', variables);
    },
    GetEpisodeMainVideo(variables: GetEpisodeMainVideoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetEpisodeMainVideoQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEpisodeMainVideoQuery>(GetEpisodeMainVideoDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEpisodeMainVideo', 'query', variables);
    },
    GetMovieMainVideo(variables: GetMovieMainVideoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetMovieMainVideoQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetMovieMainVideoQuery>(GetMovieMainVideoDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetMovieMainVideo', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;