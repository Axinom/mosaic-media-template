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
  Date: any;
  Datetime: any;
  IngestDocumentObject: any;
  IngestItemObject: any;
  JSON: any;
  UUID: any;
  Upload: any;
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
export type BulkMutationIntPayload = {
  __typename?: 'BulkMutationIntPayload';
  affectedIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  totalCount?: Maybe<Scalars['Int']>;
};

/** Bulk mutation payload type. */
export type BulkMutationPayload = {
  __typename?: 'BulkMutationPayload';
  /** Array of affected item IDs */
  affectedIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** Total number of affected items. */
  totalCount?: Maybe<Scalars['Int']>;
};

/** Bulk mutation payload type. */
export type BulkPublishingPayload = {
  __typename?: 'BulkPublishingPayload';
  /** Array of affected item IDs */
  affectedIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** Publish job ID that will be assigned to all snapshots created in this bulk operation. */
  publishingJobId?: Maybe<Scalars['String']>;
  /** Total number of affected items. */
  totalCount?: Maybe<Scalars['Int']>;
};

/** @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN */
export type Collection = {
  __typename?: 'Collection';
  /** Reads and enables pagination through a set of `CollectionRelation`. */
  collectionRelations: CollectionRelationsConnection;
  /** Reads and enables pagination through a set of `CollectionsImage`. */
  collectionsImages: CollectionsImagesConnection;
  /** Reads and enables pagination through a set of `CollectionsSnapshot`. */
  collectionsSnapshots: CollectionsSnapshotsConnection;
  /** Reads and enables pagination through a set of `CollectionsTag`. */
  collectionsTags: CollectionsTagsConnection;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  externalId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  publishStatus: PublishStatus;
  publishedDate?: Maybe<Scalars['Datetime']>;
  publishedUser?: Maybe<Scalars['String']>;
  synopsis?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN */
export type CollectionCollectionRelationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionRelationCondition>;
  filter?: InputMaybe<CollectionRelationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionRelationsOrderBy>>;
};


/** @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN */
export type CollectionCollectionsImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionsImageCondition>;
  filter?: InputMaybe<CollectionsImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionsImagesOrderBy>>;
};


/** @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN */
export type CollectionCollectionsSnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionsSnapshotCondition>;
  filter?: InputMaybe<CollectionsSnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionsSnapshotsOrderBy>>;
};


/** @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN */
export type CollectionCollectionsTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionsTagCondition>;
  filter?: InputMaybe<CollectionsTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionsTagsOrderBy>>;
};

/**
 * A condition to be used against `Collection` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CollectionCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `publishStatus` field. */
  publishStatus?: InputMaybe<PublishStatus>;
  /** Checks for equality with the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `synopsis` field. */
  synopsis?: InputMaybe<Scalars['String']>;
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
};

/** A filter to be used against `Collection` object types. All fields are combined with a logical ‘and.’ */
export type CollectionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CollectionFilter>>;
  /** Filter by the object’s `collectionRelations` relation. */
  collectionRelations?: InputMaybe<CollectionToManyCollectionRelationFilter>;
  /** Some related `collectionRelations` exist. */
  collectionRelationsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `collectionsImages` relation. */
  collectionsImages?: InputMaybe<CollectionToManyCollectionsImageFilter>;
  /** Some related `collectionsImages` exist. */
  collectionsImagesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `collectionsSnapshots` relation. */
  collectionsSnapshots?: InputMaybe<CollectionToManyCollectionsSnapshotFilter>;
  /** Some related `collectionsSnapshots` exist. */
  collectionsSnapshotsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `collectionsTags` relation. */
  collectionsTags?: InputMaybe<CollectionToManyCollectionsTagFilter>;
  /** Some related `collectionsTags` exist. */
  collectionsTagsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalId` field. */
  externalId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CollectionFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CollectionFilter>>;
  /** Filter by the object’s `publishStatus` field. */
  publishStatus?: InputMaybe<PublishStatusFilter>;
  /** Filter by the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `synopsis` field. */
  synopsis?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

export enum CollectionImageType {
  /** Cover */
  Cover = 'COVER'
}

/** A filter to be used against CollectionImageType fields. All fields are combined with a logical ‘and.’ */
export type CollectionImageTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<CollectionImageType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<CollectionImageType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<CollectionImageType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<CollectionImageType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<CollectionImageType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<CollectionImageType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<CollectionImageType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<CollectionImageType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<CollectionImageType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<CollectionImageType>>;
};

/** An input for mutations affecting `Collection` */
export type CollectionInput = {
  description?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  synopsis?: InputMaybe<Scalars['String']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title: Scalars['String'];
};

/** Represents an update to a `Collection`. Fields that are set will be updated. */
export type CollectionPatch = {
  description?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  synopsis?: InputMaybe<Scalars['String']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

/** @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN */
export type CollectionRelation = {
  __typename?: 'CollectionRelation';
  /** Reads a single `Collection` that is related to this `CollectionRelation`. */
  collection?: Maybe<Collection>;
  collectionId: Scalars['Int'];
  /** Reads a single `Episode` that is related to this `CollectionRelation`. */
  episode?: Maybe<Episode>;
  episodeId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  /** Reads a single `Movie` that is related to this `CollectionRelation`. */
  movie?: Maybe<Movie>;
  movieId?: Maybe<Scalars['Int']>;
  /** Reads a single `Season` that is related to this `CollectionRelation`. */
  season?: Maybe<Season>;
  seasonId?: Maybe<Scalars['Int']>;
  sortOrder: Scalars['Int'];
  /** Reads a single `Tvshow` that is related to this `CollectionRelation`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId?: Maybe<Scalars['Int']>;
};

/**
 * A condition to be used against `CollectionRelation` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CollectionRelationCondition = {
  /** Checks for equality with the object’s `collectionId` field. */
  collectionId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `sortOrder` field. */
  sortOrder?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `CollectionRelation` object types. All fields are combined with a logical ‘and.’ */
export type CollectionRelationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CollectionRelationFilter>>;
  /** Filter by the object’s `collection` relation. */
  collection?: InputMaybe<CollectionFilter>;
  /** Filter by the object’s `collectionId` field. */
  collectionId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `episode` relation. */
  episode?: InputMaybe<EpisodeFilter>;
  /** A related `episode` exists. */
  episodeExists?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `movie` relation. */
  movie?: InputMaybe<MovieFilter>;
  /** A related `movie` exists. */
  movieExists?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CollectionRelationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CollectionRelationFilter>>;
  /** Filter by the object’s `season` relation. */
  season?: InputMaybe<SeasonFilter>;
  /** A related `season` exists. */
  seasonExists?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `sortOrder` field. */
  sortOrder?: InputMaybe<IntFilter>;
  /** Filter by the object’s `tvshow` relation. */
  tvshow?: InputMaybe<TvshowFilter>;
  /** A related `tvshow` exists. */
  tvshowExists?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `CollectionRelation` */
export type CollectionRelationInput = {
  collectionId: Scalars['Int'];
  episodeId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  movieId?: InputMaybe<Scalars['Int']>;
  seasonId?: InputMaybe<Scalars['Int']>;
  sortOrder: Scalars['Int'];
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/** Represents an update to a `CollectionRelation`. Fields that are set will be updated. */
export type CollectionRelationPatch = {
  collectionId?: InputMaybe<Scalars['Int']>;
  episodeId?: InputMaybe<Scalars['Int']>;
  movieId?: InputMaybe<Scalars['Int']>;
  seasonId?: InputMaybe<Scalars['Int']>;
  sortOrder?: InputMaybe<Scalars['Int']>;
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/**
 * A connection to a list of `CollectionRelation` values.
 * @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type CollectionRelationsConnection = {
  __typename?: 'CollectionRelationsConnection';
  /** A list of edges which contains the `CollectionRelation` and cursor to aid in pagination. */
  edges: Array<CollectionRelationsEdge>;
  /** A list of `CollectionRelation` objects. */
  nodes: Array<CollectionRelation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CollectionRelation` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `CollectionRelation` edge in the connection. */
export type CollectionRelationsEdge = {
  __typename?: 'CollectionRelationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `CollectionRelation` at the end of the edge. */
  node: CollectionRelation;
};

/** Methods to use when ordering `CollectionRelation`. */
export enum CollectionRelationsOrderBy {
  CollectionIdAsc = 'COLLECTION_ID_ASC',
  CollectionIdDesc = 'COLLECTION_ID_DESC',
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC',
  SortOrderAsc = 'SORT_ORDER_ASC',
  SortOrderDesc = 'SORT_ORDER_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

export type CollectionSubscriptionPayload = {
  __typename?: 'CollectionSubscriptionPayload';
  collection?: Maybe<Collection>;
  event?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** A filter to be used against many `CollectionRelation` object types. All fields are combined with a logical ‘and.’ */
export type CollectionToManyCollectionRelationFilter = {
  /** Every related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CollectionRelationFilter>;
  /** No related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CollectionRelationFilter>;
  /** Some related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CollectionRelationFilter>;
};

/** A filter to be used against many `CollectionsImage` object types. All fields are combined with a logical ‘and.’ */
export type CollectionToManyCollectionsImageFilter = {
  /** Every related `CollectionsImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CollectionsImageFilter>;
  /** No related `CollectionsImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CollectionsImageFilter>;
  /** Some related `CollectionsImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CollectionsImageFilter>;
};

/** A filter to be used against many `CollectionsSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type CollectionToManyCollectionsSnapshotFilter = {
  /** Every related `CollectionsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CollectionsSnapshotFilter>;
  /** No related `CollectionsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CollectionsSnapshotFilter>;
  /** Some related `CollectionsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CollectionsSnapshotFilter>;
};

/** A filter to be used against many `CollectionsTag` object types. All fields are combined with a logical ‘and.’ */
export type CollectionToManyCollectionsTagFilter = {
  /** Every related `CollectionsTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CollectionsTagFilter>;
  /** No related `CollectionsTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CollectionsTagFilter>;
  /** Some related `CollectionsTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CollectionsTagFilter>;
};

/**
 * A connection to a list of `Collection` values.
 * @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type CollectionsConnection = {
  __typename?: 'CollectionsConnection';
  /** A list of edges which contains the `Collection` and cursor to aid in pagination. */
  edges: Array<CollectionsEdge>;
  /** A list of `Collection` objects. */
  nodes: Array<Collection>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Collection` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Collection` edge in the connection. */
export type CollectionsEdge = {
  __typename?: 'CollectionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Collection` at the end of the edge. */
  node: Collection;
};

/** @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN */
export type CollectionsImage = {
  __typename?: 'CollectionsImage';
  /** Reads a single `Collection` that is related to this `CollectionsImage`. */
  collection?: Maybe<Collection>;
  collectionId: Scalars['Int'];
  imageId: Scalars['UUID'];
  imageType: CollectionImageType;
};

/**
 * A condition to be used against `CollectionsImage` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CollectionsImageCondition = {
  /** Checks for equality with the object’s `collectionId` field. */
  collectionId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `imageType` field. */
  imageType?: InputMaybe<CollectionImageType>;
};

/** A filter to be used against `CollectionsImage` object types. All fields are combined with a logical ‘and.’ */
export type CollectionsImageFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CollectionsImageFilter>>;
  /** Filter by the object’s `collection` relation. */
  collection?: InputMaybe<CollectionFilter>;
  /** Filter by the object’s `collectionId` field. */
  collectionId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `imageId` field. */
  imageId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `imageType` field. */
  imageType?: InputMaybe<CollectionImageTypeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CollectionsImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CollectionsImageFilter>>;
};

/** An input for mutations affecting `CollectionsImage` */
export type CollectionsImageInput = {
  collectionId: Scalars['Int'];
  imageId: Scalars['UUID'];
  imageType: CollectionImageType;
};

/** Represents an update to a `CollectionsImage`. Fields that are set will be updated. */
export type CollectionsImagePatch = {
  collectionId?: InputMaybe<Scalars['Int']>;
  imageId?: InputMaybe<Scalars['UUID']>;
  imageType?: InputMaybe<CollectionImageType>;
};

/**
 * A connection to a list of `CollectionsImage` values.
 * @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type CollectionsImagesConnection = {
  __typename?: 'CollectionsImagesConnection';
  /** A list of edges which contains the `CollectionsImage` and cursor to aid in pagination. */
  edges: Array<CollectionsImagesEdge>;
  /** A list of `CollectionsImage` objects. */
  nodes: Array<CollectionsImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CollectionsImage` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `CollectionsImage` edge in the connection. */
export type CollectionsImagesEdge = {
  __typename?: 'CollectionsImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `CollectionsImage` at the end of the edge. */
  node: CollectionsImage;
};

/** Methods to use when ordering `CollectionsImage`. */
export enum CollectionsImagesOrderBy {
  CollectionIdAsc = 'COLLECTION_ID_ASC',
  CollectionIdDesc = 'COLLECTION_ID_DESC',
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  ImageTypeAsc = 'IMAGE_TYPE_ASC',
  ImageTypeDesc = 'IMAGE_TYPE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** Methods to use when ordering `Collection`. */
export enum CollectionsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PublishedDateAsc = 'PUBLISHED_DATE_ASC',
  PublishedDateDesc = 'PUBLISHED_DATE_DESC',
  PublishedUserAsc = 'PUBLISHED_USER_ASC',
  PublishedUserDesc = 'PUBLISHED_USER_DESC',
  PublishStatusAsc = 'PUBLISH_STATUS_ASC',
  PublishStatusDesc = 'PUBLISH_STATUS_DESC',
  SynopsisAsc = 'SYNOPSIS_ASC',
  SynopsisDesc = 'SYNOPSIS_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN */
export type CollectionsSnapshot = {
  __typename?: 'CollectionsSnapshot';
  /** Reads a single `Collection` that is related to this `CollectionsSnapshot`. */
  collection?: Maybe<Collection>;
  collectionId: Scalars['Int'];
  /** Reads a single `Snapshot` that is related to this `CollectionsSnapshot`. */
  snapshot?: Maybe<Snapshot>;
  snapshotId: Scalars['Int'];
};

/**
 * A condition to be used against `CollectionsSnapshot` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type CollectionsSnapshotCondition = {
  /** Checks for equality with the object’s `collectionId` field. */
  collectionId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `CollectionsSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type CollectionsSnapshotFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CollectionsSnapshotFilter>>;
  /** Filter by the object’s `collection` relation. */
  collection?: InputMaybe<CollectionFilter>;
  /** Filter by the object’s `collectionId` field. */
  collectionId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CollectionsSnapshotFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CollectionsSnapshotFilter>>;
  /** Filter by the object’s `snapshot` relation. */
  snapshot?: InputMaybe<SnapshotFilter>;
  /** Filter by the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<IntFilter>;
};

/**
 * A connection to a list of `CollectionsSnapshot` values.
 * @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type CollectionsSnapshotsConnection = {
  __typename?: 'CollectionsSnapshotsConnection';
  /** A list of edges which contains the `CollectionsSnapshot` and cursor to aid in pagination. */
  edges: Array<CollectionsSnapshotsEdge>;
  /** A list of `CollectionsSnapshot` objects. */
  nodes: Array<CollectionsSnapshot>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CollectionsSnapshot` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `CollectionsSnapshot` edge in the connection. */
export type CollectionsSnapshotsEdge = {
  __typename?: 'CollectionsSnapshotsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `CollectionsSnapshot` at the end of the edge. */
  node: CollectionsSnapshot;
};

/** Methods to use when ordering `CollectionsSnapshot`. */
export enum CollectionsSnapshotsOrderBy {
  CollectionIdAsc = 'COLLECTION_ID_ASC',
  CollectionIdDesc = 'COLLECTION_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SnapshotIdAsc = 'SNAPSHOT_ID_ASC',
  SnapshotIdDesc = 'SNAPSHOT_ID_DESC'
}

/** @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN */
export type CollectionsTag = {
  __typename?: 'CollectionsTag';
  /** Reads a single `Collection` that is related to this `CollectionsTag`. */
  collection?: Maybe<Collection>;
  collectionId: Scalars['Int'];
  name: Scalars['String'];
};

/**
 * A condition to be used against `CollectionsTag` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CollectionsTagCondition = {
  /** Checks for equality with the object’s `collectionId` field. */
  collectionId?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `CollectionsTag` object types. All fields are combined with a logical ‘and.’ */
export type CollectionsTagFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CollectionsTagFilter>>;
  /** Filter by the object’s `collection` relation. */
  collection?: InputMaybe<CollectionFilter>;
  /** Filter by the object’s `collectionId` field. */
  collectionId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CollectionsTagFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CollectionsTagFilter>>;
};

/** An input for mutations affecting `CollectionsTag` */
export type CollectionsTagInput = {
  collectionId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** Represents an update to a `CollectionsTag`. Fields that are set will be updated. */
export type CollectionsTagPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `CollectionsTag` values.
 * @permissions: COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type CollectionsTagsConnection = {
  __typename?: 'CollectionsTagsConnection';
  /** A list of edges which contains the `CollectionsTag` and cursor to aid in pagination. */
  edges: Array<CollectionsTagsEdge>;
  /** A list of `CollectionsTag` objects. */
  nodes: Array<CollectionsTag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CollectionsTag` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `CollectionsTag` edge in the connection. */
export type CollectionsTagsEdge = {
  __typename?: 'CollectionsTagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `CollectionsTag` at the end of the edge. */
  node: CollectionsTag;
};

/** Methods to use when ordering `CollectionsTag`. */
export enum CollectionsTagsOrderBy {
  CollectionIdAsc = 'COLLECTION_ID_ASC',
  CollectionIdDesc = 'COLLECTION_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * All input for the create `Collection` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type CreateCollectionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Collection` to be created by this mutation. */
  collection: CollectionInput;
};

/** The output of our create `Collection` mutation. */
export type CreateCollectionPayload = {
  __typename?: 'CreateCollectionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Collection` that was created by this mutation. */
  collection?: Maybe<Collection>;
  /** An edge for our `Collection`. May be used by Relay 1. */
  collectionEdge?: Maybe<CollectionsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Collection` mutation. */
export type CreateCollectionPayloadCollectionEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionsOrderBy>>;
};

/**
 * All input for the create `CollectionRelation` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type CreateCollectionRelationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `CollectionRelation` to be created by this mutation. */
  collectionRelation: CollectionRelationInput;
};

/** The output of our create `CollectionRelation` mutation. */
export type CreateCollectionRelationPayload = {
  __typename?: 'CreateCollectionRelationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Collection` that is related to this `CollectionRelation`. */
  collection?: Maybe<Collection>;
  /** The `CollectionRelation` that was created by this mutation. */
  collectionRelation?: Maybe<CollectionRelation>;
  /** An edge for our `CollectionRelation`. May be used by Relay 1. */
  collectionRelationEdge?: Maybe<CollectionRelationsEdge>;
  /** Reads a single `Episode` that is related to this `CollectionRelation`. */
  episode?: Maybe<Episode>;
  /** Reads a single `Movie` that is related to this `CollectionRelation`. */
  movie?: Maybe<Movie>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `CollectionRelation`. */
  season?: Maybe<Season>;
  /** Reads a single `Tvshow` that is related to this `CollectionRelation`. */
  tvshow?: Maybe<Tvshow>;
};


/** The output of our create `CollectionRelation` mutation. */
export type CreateCollectionRelationPayloadCollectionRelationEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionRelationsOrderBy>>;
};

/**
 * All input for the create `CollectionsImage` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type CreateCollectionsImageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `CollectionsImage` to be created by this mutation. */
  collectionsImage: CollectionsImageInput;
};

/** The output of our create `CollectionsImage` mutation. */
export type CreateCollectionsImagePayload = {
  __typename?: 'CreateCollectionsImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Collection` that is related to this `CollectionsImage`. */
  collection?: Maybe<Collection>;
  /** The `CollectionsImage` that was created by this mutation. */
  collectionsImage?: Maybe<CollectionsImage>;
  /** An edge for our `CollectionsImage`. May be used by Relay 1. */
  collectionsImageEdge?: Maybe<CollectionsImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `CollectionsImage` mutation. */
export type CreateCollectionsImagePayloadCollectionsImageEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionsImagesOrderBy>>;
};

/**
 * All input for the create `CollectionsTag` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type CreateCollectionsTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `CollectionsTag` to be created by this mutation. */
  collectionsTag: CollectionsTagInput;
};

/** The output of our create `CollectionsTag` mutation. */
export type CreateCollectionsTagPayload = {
  __typename?: 'CreateCollectionsTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Collection` that is related to this `CollectionsTag`. */
  collection?: Maybe<Collection>;
  /** The `CollectionsTag` that was created by this mutation. */
  collectionsTag?: Maybe<CollectionsTag>;
  /** An edge for our `CollectionsTag`. May be used by Relay 1. */
  collectionsTagEdge?: Maybe<CollectionsTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `CollectionsTag` mutation. */
export type CreateCollectionsTagPayloadCollectionsTagEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionsTagsOrderBy>>;
};

/**
 * All input for the create `Episode` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateEpisodeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Episode` to be created by this mutation. */
  episode: EpisodeInput;
};

/** The output of our create `Episode` mutation. */
export type CreateEpisodePayload = {
  __typename?: 'CreateEpisodePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Episode` that was created by this mutation. */
  episode?: Maybe<Episode>;
  /** An edge for our `Episode`. May be used by Relay 1. */
  episodeEdge?: Maybe<EpisodesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `Episode`. */
  season?: Maybe<Season>;
};


/** The output of our create `Episode` mutation. */
export type CreateEpisodePayloadEpisodeEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesOrderBy>>;
};

/**
 * All input for the create `EpisodesCast` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateEpisodesCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `EpisodesCast` to be created by this mutation. */
  episodesCast: EpisodesCastInput;
};

/** The output of our create `EpisodesCast` mutation. */
export type CreateEpisodesCastPayload = {
  __typename?: 'CreateEpisodesCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesCast`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesCast` that was created by this mutation. */
  episodesCast?: Maybe<EpisodesCast>;
  /** An edge for our `EpisodesCast`. May be used by Relay 1. */
  episodesCastEdge?: Maybe<EpisodesCastsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EpisodesCast` mutation. */
export type CreateEpisodesCastPayloadEpisodesCastEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesCastsOrderBy>>;
};

/**
 * All input for the create `EpisodesImage` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateEpisodesImageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `EpisodesImage` to be created by this mutation. */
  episodesImage: EpisodesImageInput;
};

/** The output of our create `EpisodesImage` mutation. */
export type CreateEpisodesImagePayload = {
  __typename?: 'CreateEpisodesImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesImage`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesImage` that was created by this mutation. */
  episodesImage?: Maybe<EpisodesImage>;
  /** An edge for our `EpisodesImage`. May be used by Relay 1. */
  episodesImageEdge?: Maybe<EpisodesImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EpisodesImage` mutation. */
export type CreateEpisodesImagePayloadEpisodesImageEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesImagesOrderBy>>;
};

/**
 * All input for the create `EpisodesLicense` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateEpisodesLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `EpisodesLicense` to be created by this mutation. */
  episodesLicense: EpisodesLicenseInput;
};

/** The output of our create `EpisodesLicense` mutation. */
export type CreateEpisodesLicensePayload = {
  __typename?: 'CreateEpisodesLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesLicense`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesLicense` that was created by this mutation. */
  episodesLicense?: Maybe<EpisodesLicense>;
  /** An edge for our `EpisodesLicense`. May be used by Relay 1. */
  episodesLicenseEdge?: Maybe<EpisodesLicensesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EpisodesLicense` mutation. */
export type CreateEpisodesLicensePayloadEpisodesLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesLicensesOrderBy>>;
};

/**
 * All input for the create `EpisodesLicensesCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateEpisodesLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `EpisodesLicensesCountry` to be created by this mutation. */
  episodesLicensesCountry: EpisodesLicensesCountryInput;
};

/** The output of our create `EpisodesLicensesCountry` mutation. */
export type CreateEpisodesLicensesCountryPayload = {
  __typename?: 'CreateEpisodesLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `EpisodesLicense` that is related to this `EpisodesLicensesCountry`. */
  episodesLicense?: Maybe<EpisodesLicense>;
  /** The `EpisodesLicensesCountry` that was created by this mutation. */
  episodesLicensesCountry?: Maybe<EpisodesLicensesCountry>;
  /** An edge for our `EpisodesLicensesCountry`. May be used by Relay 1. */
  episodesLicensesCountryEdge?: Maybe<EpisodesLicensesCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EpisodesLicensesCountry` mutation. */
export type CreateEpisodesLicensesCountryPayloadEpisodesLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesLicensesCountriesOrderBy>>;
};

/**
 * All input for the create `EpisodesProductionCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateEpisodesProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `EpisodesProductionCountry` to be created by this mutation. */
  episodesProductionCountry: EpisodesProductionCountryInput;
};

/** The output of our create `EpisodesProductionCountry` mutation. */
export type CreateEpisodesProductionCountryPayload = {
  __typename?: 'CreateEpisodesProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesProductionCountry`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesProductionCountry` that was created by this mutation. */
  episodesProductionCountry?: Maybe<EpisodesProductionCountry>;
  /** An edge for our `EpisodesProductionCountry`. May be used by Relay 1. */
  episodesProductionCountryEdge?: Maybe<EpisodesProductionCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EpisodesProductionCountry` mutation. */
export type CreateEpisodesProductionCountryPayloadEpisodesProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesProductionCountriesOrderBy>>;
};

/**
 * All input for the create `EpisodesTag` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateEpisodesTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `EpisodesTag` to be created by this mutation. */
  episodesTag: EpisodesTagInput;
};

/** The output of our create `EpisodesTag` mutation. */
export type CreateEpisodesTagPayload = {
  __typename?: 'CreateEpisodesTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesTag`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesTag` that was created by this mutation. */
  episodesTag?: Maybe<EpisodesTag>;
  /** An edge for our `EpisodesTag`. May be used by Relay 1. */
  episodesTagEdge?: Maybe<EpisodesTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EpisodesTag` mutation. */
export type CreateEpisodesTagPayloadEpisodesTagEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesTagsOrderBy>>;
};

/**
 * All input for the create `EpisodesTrailer` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateEpisodesTrailerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `EpisodesTrailer` to be created by this mutation. */
  episodesTrailer: EpisodesTrailerInput;
};

/** The output of our create `EpisodesTrailer` mutation. */
export type CreateEpisodesTrailerPayload = {
  __typename?: 'CreateEpisodesTrailerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesTrailer`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesTrailer` that was created by this mutation. */
  episodesTrailer?: Maybe<EpisodesTrailer>;
  /** An edge for our `EpisodesTrailer`. May be used by Relay 1. */
  episodesTrailerEdge?: Maybe<EpisodesTrailersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `EpisodesTrailer` mutation. */
export type CreateEpisodesTrailerPayloadEpisodesTrailerEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesTrailersOrderBy>>;
};

/**
 * All input for the create `EpisodesTvshowGenre` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateEpisodesTvshowGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `EpisodesTvshowGenre` to be created by this mutation. */
  episodesTvshowGenre: EpisodesTvshowGenreInput;
};

/** The output of our create `EpisodesTvshowGenre` mutation. */
export type CreateEpisodesTvshowGenrePayload = {
  __typename?: 'CreateEpisodesTvshowGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesTvshowGenre`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesTvshowGenre` that was created by this mutation. */
  episodesTvshowGenre?: Maybe<EpisodesTvshowGenre>;
  /** An edge for our `EpisodesTvshowGenre`. May be used by Relay 1. */
  episodesTvshowGenreEdge?: Maybe<EpisodesTvshowGenresEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TvshowGenre` that is related to this `EpisodesTvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenre>;
};


/** The output of our create `EpisodesTvshowGenre` mutation. */
export type CreateEpisodesTvshowGenrePayloadEpisodesTvshowGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesTvshowGenresOrderBy>>;
};

/**
 * All input for the create `MovieGenre` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type CreateMovieGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `MovieGenre` to be created by this mutation. */
  movieGenre: MovieGenreInput;
};

/** The output of our create `MovieGenre` mutation. */
export type CreateMovieGenrePayload = {
  __typename?: 'CreateMovieGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `MovieGenre` that was created by this mutation. */
  movieGenre?: Maybe<MovieGenre>;
  /** An edge for our `MovieGenre`. May be used by Relay 1. */
  movieGenreEdge?: Maybe<MovieGenresEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `MovieGenre` mutation. */
export type CreateMovieGenrePayloadMovieGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<MovieGenresOrderBy>>;
};

/**
 * All input for the create `Movie` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type CreateMovieInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Movie` to be created by this mutation. */
  movie: MovieInput;
};

/** The output of our create `Movie` mutation. */
export type CreateMoviePayload = {
  __typename?: 'CreateMoviePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Movie` that was created by this mutation. */
  movie?: Maybe<Movie>;
  /** An edge for our `Movie`. May be used by Relay 1. */
  movieEdge?: Maybe<MoviesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Movie` mutation. */
export type CreateMoviePayloadMovieEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesOrderBy>>;
};

/**
 * All input for the create `MoviesCast` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type CreateMoviesCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `MoviesCast` to be created by this mutation. */
  moviesCast: MoviesCastInput;
};

/** The output of our create `MoviesCast` mutation. */
export type CreateMoviesCastPayload = {
  __typename?: 'CreateMoviesCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesCast`. */
  movie?: Maybe<Movie>;
  /** The `MoviesCast` that was created by this mutation. */
  moviesCast?: Maybe<MoviesCast>;
  /** An edge for our `MoviesCast`. May be used by Relay 1. */
  moviesCastEdge?: Maybe<MoviesCastsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `MoviesCast` mutation. */
export type CreateMoviesCastPayloadMoviesCastEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesCastsOrderBy>>;
};

/**
 * All input for the create `MoviesImage` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type CreateMoviesImageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `MoviesImage` to be created by this mutation. */
  moviesImage: MoviesImageInput;
};

/** The output of our create `MoviesImage` mutation. */
export type CreateMoviesImagePayload = {
  __typename?: 'CreateMoviesImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesImage`. */
  movie?: Maybe<Movie>;
  /** The `MoviesImage` that was created by this mutation. */
  moviesImage?: Maybe<MoviesImage>;
  /** An edge for our `MoviesImage`. May be used by Relay 1. */
  moviesImageEdge?: Maybe<MoviesImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `MoviesImage` mutation. */
export type CreateMoviesImagePayloadMoviesImageEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesImagesOrderBy>>;
};

/**
 * All input for the create `MoviesLicense` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type CreateMoviesLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `MoviesLicense` to be created by this mutation. */
  moviesLicense: MoviesLicenseInput;
};

/** The output of our create `MoviesLicense` mutation. */
export type CreateMoviesLicensePayload = {
  __typename?: 'CreateMoviesLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesLicense`. */
  movie?: Maybe<Movie>;
  /** The `MoviesLicense` that was created by this mutation. */
  moviesLicense?: Maybe<MoviesLicense>;
  /** An edge for our `MoviesLicense`. May be used by Relay 1. */
  moviesLicenseEdge?: Maybe<MoviesLicensesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `MoviesLicense` mutation. */
export type CreateMoviesLicensePayloadMoviesLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesLicensesOrderBy>>;
};

/**
 * All input for the create `MoviesLicensesCountry` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type CreateMoviesLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `MoviesLicensesCountry` to be created by this mutation. */
  moviesLicensesCountry: MoviesLicensesCountryInput;
};

/** The output of our create `MoviesLicensesCountry` mutation. */
export type CreateMoviesLicensesCountryPayload = {
  __typename?: 'CreateMoviesLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `MoviesLicense` that is related to this `MoviesLicensesCountry`. */
  moviesLicense?: Maybe<MoviesLicense>;
  /** The `MoviesLicensesCountry` that was created by this mutation. */
  moviesLicensesCountry?: Maybe<MoviesLicensesCountry>;
  /** An edge for our `MoviesLicensesCountry`. May be used by Relay 1. */
  moviesLicensesCountryEdge?: Maybe<MoviesLicensesCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `MoviesLicensesCountry` mutation. */
export type CreateMoviesLicensesCountryPayloadMoviesLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesLicensesCountriesOrderBy>>;
};

/**
 * All input for the create `MoviesMovieGenre` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type CreateMoviesMovieGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `MoviesMovieGenre` to be created by this mutation. */
  moviesMovieGenre: MoviesMovieGenreInput;
};

/** The output of our create `MoviesMovieGenre` mutation. */
export type CreateMoviesMovieGenrePayload = {
  __typename?: 'CreateMoviesMovieGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesMovieGenre`. */
  movie?: Maybe<Movie>;
  /** Reads a single `MovieGenre` that is related to this `MoviesMovieGenre`. */
  movieGenres?: Maybe<MovieGenre>;
  /** The `MoviesMovieGenre` that was created by this mutation. */
  moviesMovieGenre?: Maybe<MoviesMovieGenre>;
  /** An edge for our `MoviesMovieGenre`. May be used by Relay 1. */
  moviesMovieGenreEdge?: Maybe<MoviesMovieGenresEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `MoviesMovieGenre` mutation. */
export type CreateMoviesMovieGenrePayloadMoviesMovieGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesMovieGenresOrderBy>>;
};

/**
 * All input for the create `MoviesProductionCountry` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type CreateMoviesProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `MoviesProductionCountry` to be created by this mutation. */
  moviesProductionCountry: MoviesProductionCountryInput;
};

/** The output of our create `MoviesProductionCountry` mutation. */
export type CreateMoviesProductionCountryPayload = {
  __typename?: 'CreateMoviesProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesProductionCountry`. */
  movie?: Maybe<Movie>;
  /** The `MoviesProductionCountry` that was created by this mutation. */
  moviesProductionCountry?: Maybe<MoviesProductionCountry>;
  /** An edge for our `MoviesProductionCountry`. May be used by Relay 1. */
  moviesProductionCountryEdge?: Maybe<MoviesProductionCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `MoviesProductionCountry` mutation. */
export type CreateMoviesProductionCountryPayloadMoviesProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesProductionCountriesOrderBy>>;
};

/**
 * All input for the create `MoviesTag` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type CreateMoviesTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `MoviesTag` to be created by this mutation. */
  moviesTag: MoviesTagInput;
};

/** The output of our create `MoviesTag` mutation. */
export type CreateMoviesTagPayload = {
  __typename?: 'CreateMoviesTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesTag`. */
  movie?: Maybe<Movie>;
  /** The `MoviesTag` that was created by this mutation. */
  moviesTag?: Maybe<MoviesTag>;
  /** An edge for our `MoviesTag`. May be used by Relay 1. */
  moviesTagEdge?: Maybe<MoviesTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `MoviesTag` mutation. */
export type CreateMoviesTagPayloadMoviesTagEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesTagsOrderBy>>;
};

/**
 * All input for the create `MoviesTrailer` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type CreateMoviesTrailerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `MoviesTrailer` to be created by this mutation. */
  moviesTrailer: MoviesTrailerInput;
};

/** The output of our create `MoviesTrailer` mutation. */
export type CreateMoviesTrailerPayload = {
  __typename?: 'CreateMoviesTrailerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesTrailer`. */
  movie?: Maybe<Movie>;
  /** The `MoviesTrailer` that was created by this mutation. */
  moviesTrailer?: Maybe<MoviesTrailer>;
  /** An edge for our `MoviesTrailer`. May be used by Relay 1. */
  moviesTrailerEdge?: Maybe<MoviesTrailersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `MoviesTrailer` mutation. */
export type CreateMoviesTrailerPayloadMoviesTrailerEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesTrailersOrderBy>>;
};

/**
 * All input for the create `Review` mutation.
 * @permissions: REVIEWS_EDIT,ADMIN
 */
export type CreateReviewInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Review` to be created by this mutation. */
  review: ReviewInput;
};

/** The output of our create `Review` mutation. */
export type CreateReviewPayload = {
  __typename?: 'CreateReviewPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Review` that was created by this mutation. */
  review?: Maybe<Review>;
  /** An edge for our `Review`. May be used by Relay 1. */
  reviewEdge?: Maybe<ReviewsEdge>;
};


/** The output of our create `Review` mutation. */
export type CreateReviewPayloadReviewEdgeArgs = {
  orderBy?: InputMaybe<Array<ReviewsOrderBy>>;
};

/**
 * All input for the create `Season` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateSeasonInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Season` to be created by this mutation. */
  season: SeasonInput;
};

/** The output of our create `Season` mutation. */
export type CreateSeasonPayload = {
  __typename?: 'CreateSeasonPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Season` that was created by this mutation. */
  season?: Maybe<Season>;
  /** An edge for our `Season`. May be used by Relay 1. */
  seasonEdge?: Maybe<SeasonsEdge>;
  /** Reads a single `Tvshow` that is related to this `Season`. */
  tvshow?: Maybe<Tvshow>;
};


/** The output of our create `Season` mutation. */
export type CreateSeasonPayloadSeasonEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsOrderBy>>;
};

/**
 * All input for the create `SeasonsCast` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateSeasonsCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `SeasonsCast` to be created by this mutation. */
  seasonsCast: SeasonsCastInput;
};

/** The output of our create `SeasonsCast` mutation. */
export type CreateSeasonsCastPayload = {
  __typename?: 'CreateSeasonsCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsCast`. */
  season?: Maybe<Season>;
  /** The `SeasonsCast` that was created by this mutation. */
  seasonsCast?: Maybe<SeasonsCast>;
  /** An edge for our `SeasonsCast`. May be used by Relay 1. */
  seasonsCastEdge?: Maybe<SeasonsCastsEdge>;
};


/** The output of our create `SeasonsCast` mutation. */
export type CreateSeasonsCastPayloadSeasonsCastEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsCastsOrderBy>>;
};

/**
 * All input for the create `SeasonsImage` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateSeasonsImageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `SeasonsImage` to be created by this mutation. */
  seasonsImage: SeasonsImageInput;
};

/** The output of our create `SeasonsImage` mutation. */
export type CreateSeasonsImagePayload = {
  __typename?: 'CreateSeasonsImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsImage`. */
  season?: Maybe<Season>;
  /** The `SeasonsImage` that was created by this mutation. */
  seasonsImage?: Maybe<SeasonsImage>;
  /** An edge for our `SeasonsImage`. May be used by Relay 1. */
  seasonsImageEdge?: Maybe<SeasonsImagesEdge>;
};


/** The output of our create `SeasonsImage` mutation. */
export type CreateSeasonsImagePayloadSeasonsImageEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsImagesOrderBy>>;
};

/**
 * All input for the create `SeasonsLicense` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateSeasonsLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `SeasonsLicense` to be created by this mutation. */
  seasonsLicense: SeasonsLicenseInput;
};

/** The output of our create `SeasonsLicense` mutation. */
export type CreateSeasonsLicensePayload = {
  __typename?: 'CreateSeasonsLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsLicense`. */
  season?: Maybe<Season>;
  /** The `SeasonsLicense` that was created by this mutation. */
  seasonsLicense?: Maybe<SeasonsLicense>;
  /** An edge for our `SeasonsLicense`. May be used by Relay 1. */
  seasonsLicenseEdge?: Maybe<SeasonsLicensesEdge>;
};


/** The output of our create `SeasonsLicense` mutation. */
export type CreateSeasonsLicensePayloadSeasonsLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsLicensesOrderBy>>;
};

/**
 * All input for the create `SeasonsLicensesCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateSeasonsLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `SeasonsLicensesCountry` to be created by this mutation. */
  seasonsLicensesCountry: SeasonsLicensesCountryInput;
};

/** The output of our create `SeasonsLicensesCountry` mutation. */
export type CreateSeasonsLicensesCountryPayload = {
  __typename?: 'CreateSeasonsLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `SeasonsLicense` that is related to this `SeasonsLicensesCountry`. */
  seasonsLicense?: Maybe<SeasonsLicense>;
  /** The `SeasonsLicensesCountry` that was created by this mutation. */
  seasonsLicensesCountry?: Maybe<SeasonsLicensesCountry>;
  /** An edge for our `SeasonsLicensesCountry`. May be used by Relay 1. */
  seasonsLicensesCountryEdge?: Maybe<SeasonsLicensesCountriesEdge>;
};


/** The output of our create `SeasonsLicensesCountry` mutation. */
export type CreateSeasonsLicensesCountryPayloadSeasonsLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsLicensesCountriesOrderBy>>;
};

/**
 * All input for the create `SeasonsProductionCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateSeasonsProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `SeasonsProductionCountry` to be created by this mutation. */
  seasonsProductionCountry: SeasonsProductionCountryInput;
};

/** The output of our create `SeasonsProductionCountry` mutation. */
export type CreateSeasonsProductionCountryPayload = {
  __typename?: 'CreateSeasonsProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsProductionCountry`. */
  season?: Maybe<Season>;
  /** The `SeasonsProductionCountry` that was created by this mutation. */
  seasonsProductionCountry?: Maybe<SeasonsProductionCountry>;
  /** An edge for our `SeasonsProductionCountry`. May be used by Relay 1. */
  seasonsProductionCountryEdge?: Maybe<SeasonsProductionCountriesEdge>;
};


/** The output of our create `SeasonsProductionCountry` mutation. */
export type CreateSeasonsProductionCountryPayloadSeasonsProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsProductionCountriesOrderBy>>;
};

/**
 * All input for the create `SeasonsTag` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateSeasonsTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `SeasonsTag` to be created by this mutation. */
  seasonsTag: SeasonsTagInput;
};

/** The output of our create `SeasonsTag` mutation. */
export type CreateSeasonsTagPayload = {
  __typename?: 'CreateSeasonsTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsTag`. */
  season?: Maybe<Season>;
  /** The `SeasonsTag` that was created by this mutation. */
  seasonsTag?: Maybe<SeasonsTag>;
  /** An edge for our `SeasonsTag`. May be used by Relay 1. */
  seasonsTagEdge?: Maybe<SeasonsTagsEdge>;
};


/** The output of our create `SeasonsTag` mutation. */
export type CreateSeasonsTagPayloadSeasonsTagEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsTagsOrderBy>>;
};

/**
 * All input for the create `SeasonsTrailer` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateSeasonsTrailerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `SeasonsTrailer` to be created by this mutation. */
  seasonsTrailer: SeasonsTrailerInput;
};

/** The output of our create `SeasonsTrailer` mutation. */
export type CreateSeasonsTrailerPayload = {
  __typename?: 'CreateSeasonsTrailerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsTrailer`. */
  season?: Maybe<Season>;
  /** The `SeasonsTrailer` that was created by this mutation. */
  seasonsTrailer?: Maybe<SeasonsTrailer>;
  /** An edge for our `SeasonsTrailer`. May be used by Relay 1. */
  seasonsTrailerEdge?: Maybe<SeasonsTrailersEdge>;
};


/** The output of our create `SeasonsTrailer` mutation. */
export type CreateSeasonsTrailerPayloadSeasonsTrailerEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsTrailersOrderBy>>;
};

/**
 * All input for the create `SeasonsTvshowGenre` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateSeasonsTvshowGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `SeasonsTvshowGenre` to be created by this mutation. */
  seasonsTvshowGenre: SeasonsTvshowGenreInput;
};

/** The output of our create `SeasonsTvshowGenre` mutation. */
export type CreateSeasonsTvshowGenrePayload = {
  __typename?: 'CreateSeasonsTvshowGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsTvshowGenre`. */
  season?: Maybe<Season>;
  /** The `SeasonsTvshowGenre` that was created by this mutation. */
  seasonsTvshowGenre?: Maybe<SeasonsTvshowGenre>;
  /** An edge for our `SeasonsTvshowGenre`. May be used by Relay 1. */
  seasonsTvshowGenreEdge?: Maybe<SeasonsTvshowGenresEdge>;
  /** Reads a single `TvshowGenre` that is related to this `SeasonsTvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenre>;
};


/** The output of our create `SeasonsTvshowGenre` mutation. */
export type CreateSeasonsTvshowGenrePayloadSeasonsTvshowGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsTvshowGenresOrderBy>>;
};

/**
 * All input for the create `TvshowGenre` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type CreateTvshowGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `TvshowGenre` to be created by this mutation. */
  tvshowGenre: TvshowGenreInput;
};

/** The output of our create `TvshowGenre` mutation. */
export type CreateTvshowGenrePayload = {
  __typename?: 'CreateTvshowGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TvshowGenre` that was created by this mutation. */
  tvshowGenre?: Maybe<TvshowGenre>;
  /** An edge for our `TvshowGenre`. May be used by Relay 1. */
  tvshowGenreEdge?: Maybe<TvshowGenresEdge>;
};


/** The output of our create `TvshowGenre` mutation. */
export type CreateTvshowGenrePayloadTvshowGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowGenresOrderBy>>;
};

/**
 * All input for the create `Tvshow` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateTvshowInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Tvshow` to be created by this mutation. */
  tvshow: TvshowInput;
};

/** The output of our create `Tvshow` mutation. */
export type CreateTvshowPayload = {
  __typename?: 'CreateTvshowPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tvshow` that was created by this mutation. */
  tvshow?: Maybe<Tvshow>;
  /** An edge for our `Tvshow`. May be used by Relay 1. */
  tvshowEdge?: Maybe<TvshowsEdge>;
};


/** The output of our create `Tvshow` mutation. */
export type CreateTvshowPayloadTvshowEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsOrderBy>>;
};

/**
 * All input for the create `TvshowsCast` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateTvshowsCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `TvshowsCast` to be created by this mutation. */
  tvshowsCast: TvshowsCastInput;
};

/** The output of our create `TvshowsCast` mutation. */
export type CreateTvshowsCastPayload = {
  __typename?: 'CreateTvshowsCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsCast`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsCast` that was created by this mutation. */
  tvshowsCast?: Maybe<TvshowsCast>;
  /** An edge for our `TvshowsCast`. May be used by Relay 1. */
  tvshowsCastEdge?: Maybe<TvshowsCastsEdge>;
};


/** The output of our create `TvshowsCast` mutation. */
export type CreateTvshowsCastPayloadTvshowsCastEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsCastsOrderBy>>;
};

/**
 * All input for the create `TvshowsImage` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateTvshowsImageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `TvshowsImage` to be created by this mutation. */
  tvshowsImage: TvshowsImageInput;
};

/** The output of our create `TvshowsImage` mutation. */
export type CreateTvshowsImagePayload = {
  __typename?: 'CreateTvshowsImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsImage`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsImage` that was created by this mutation. */
  tvshowsImage?: Maybe<TvshowsImage>;
  /** An edge for our `TvshowsImage`. May be used by Relay 1. */
  tvshowsImageEdge?: Maybe<TvshowsImagesEdge>;
};


/** The output of our create `TvshowsImage` mutation. */
export type CreateTvshowsImagePayloadTvshowsImageEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsImagesOrderBy>>;
};

/**
 * All input for the create `TvshowsLicense` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateTvshowsLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `TvshowsLicense` to be created by this mutation. */
  tvshowsLicense: TvshowsLicenseInput;
};

/** The output of our create `TvshowsLicense` mutation. */
export type CreateTvshowsLicensePayload = {
  __typename?: 'CreateTvshowsLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsLicense`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsLicense` that was created by this mutation. */
  tvshowsLicense?: Maybe<TvshowsLicense>;
  /** An edge for our `TvshowsLicense`. May be used by Relay 1. */
  tvshowsLicenseEdge?: Maybe<TvshowsLicensesEdge>;
};


/** The output of our create `TvshowsLicense` mutation. */
export type CreateTvshowsLicensePayloadTvshowsLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsLicensesOrderBy>>;
};

/**
 * All input for the create `TvshowsLicensesCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateTvshowsLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `TvshowsLicensesCountry` to be created by this mutation. */
  tvshowsLicensesCountry: TvshowsLicensesCountryInput;
};

/** The output of our create `TvshowsLicensesCountry` mutation. */
export type CreateTvshowsLicensesCountryPayload = {
  __typename?: 'CreateTvshowsLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TvshowsLicense` that is related to this `TvshowsLicensesCountry`. */
  tvshowsLicense?: Maybe<TvshowsLicense>;
  /** The `TvshowsLicensesCountry` that was created by this mutation. */
  tvshowsLicensesCountry?: Maybe<TvshowsLicensesCountry>;
  /** An edge for our `TvshowsLicensesCountry`. May be used by Relay 1. */
  tvshowsLicensesCountryEdge?: Maybe<TvshowsLicensesCountriesEdge>;
};


/** The output of our create `TvshowsLicensesCountry` mutation. */
export type CreateTvshowsLicensesCountryPayloadTvshowsLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsLicensesCountriesOrderBy>>;
};

/**
 * All input for the create `TvshowsProductionCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateTvshowsProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `TvshowsProductionCountry` to be created by this mutation. */
  tvshowsProductionCountry: TvshowsProductionCountryInput;
};

/** The output of our create `TvshowsProductionCountry` mutation. */
export type CreateTvshowsProductionCountryPayload = {
  __typename?: 'CreateTvshowsProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsProductionCountry`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsProductionCountry` that was created by this mutation. */
  tvshowsProductionCountry?: Maybe<TvshowsProductionCountry>;
  /** An edge for our `TvshowsProductionCountry`. May be used by Relay 1. */
  tvshowsProductionCountryEdge?: Maybe<TvshowsProductionCountriesEdge>;
};


/** The output of our create `TvshowsProductionCountry` mutation. */
export type CreateTvshowsProductionCountryPayloadTvshowsProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsProductionCountriesOrderBy>>;
};

/**
 * All input for the create `TvshowsTag` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateTvshowsTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `TvshowsTag` to be created by this mutation. */
  tvshowsTag: TvshowsTagInput;
};

/** The output of our create `TvshowsTag` mutation. */
export type CreateTvshowsTagPayload = {
  __typename?: 'CreateTvshowsTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsTag`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsTag` that was created by this mutation. */
  tvshowsTag?: Maybe<TvshowsTag>;
  /** An edge for our `TvshowsTag`. May be used by Relay 1. */
  tvshowsTagEdge?: Maybe<TvshowsTagsEdge>;
};


/** The output of our create `TvshowsTag` mutation. */
export type CreateTvshowsTagPayloadTvshowsTagEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsTagsOrderBy>>;
};

/**
 * All input for the create `TvshowsTrailer` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateTvshowsTrailerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `TvshowsTrailer` to be created by this mutation. */
  tvshowsTrailer: TvshowsTrailerInput;
};

/** The output of our create `TvshowsTrailer` mutation. */
export type CreateTvshowsTrailerPayload = {
  __typename?: 'CreateTvshowsTrailerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsTrailer`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsTrailer` that was created by this mutation. */
  tvshowsTrailer?: Maybe<TvshowsTrailer>;
  /** An edge for our `TvshowsTrailer`. May be used by Relay 1. */
  tvshowsTrailerEdge?: Maybe<TvshowsTrailersEdge>;
};


/** The output of our create `TvshowsTrailer` mutation. */
export type CreateTvshowsTrailerPayloadTvshowsTrailerEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsTrailersOrderBy>>;
};

/**
 * All input for the create `TvshowsTvshowGenre` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type CreateTvshowsTvshowGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `TvshowsTvshowGenre` to be created by this mutation. */
  tvshowsTvshowGenre: TvshowsTvshowGenreInput;
};

/** The output of our create `TvshowsTvshowGenre` mutation. */
export type CreateTvshowsTvshowGenrePayload = {
  __typename?: 'CreateTvshowsTvshowGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsTvshowGenre`. */
  tvshow?: Maybe<Tvshow>;
  /** Reads a single `TvshowGenre` that is related to this `TvshowsTvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenre>;
  /** The `TvshowsTvshowGenre` that was created by this mutation. */
  tvshowsTvshowGenre?: Maybe<TvshowsTvshowGenre>;
  /** An edge for our `TvshowsTvshowGenre`. May be used by Relay 1. */
  tvshowsTvshowGenreEdge?: Maybe<TvshowsTvshowGenresEdge>;
};


/** The output of our create `TvshowsTvshowGenre` mutation. */
export type CreateTvshowsTvshowGenrePayloadTvshowsTvshowGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsTvshowGenresOrderBy>>;
};

/** A filter to be used against Date fields. All fields are combined with a logical ‘and.’ */
export type DateFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Date']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Date']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Date']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Date']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Date']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Date']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Date']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Date']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Date']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Date']>>;
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
 * All input for the `deleteCollectionByExternalId` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type DeleteCollectionByExternalIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalId: Scalars['String'];
};

/**
 * All input for the `deleteCollection` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type DeleteCollectionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `Collection` mutation. */
export type DeleteCollectionPayload = {
  __typename?: 'DeleteCollectionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Collection` that was deleted by this mutation. */
  collection?: Maybe<Collection>;
  /** An edge for our `Collection`. May be used by Relay 1. */
  collectionEdge?: Maybe<CollectionsEdge>;
  deletedCollectionNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Collection` mutation. */
export type DeleteCollectionPayloadCollectionEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionsOrderBy>>;
};

/**
 * All input for the `deleteCollectionRelation` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type DeleteCollectionRelationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `CollectionRelation` mutation. */
export type DeleteCollectionRelationPayload = {
  __typename?: 'DeleteCollectionRelationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Collection` that is related to this `CollectionRelation`. */
  collection?: Maybe<Collection>;
  /** The `CollectionRelation` that was deleted by this mutation. */
  collectionRelation?: Maybe<CollectionRelation>;
  /** An edge for our `CollectionRelation`. May be used by Relay 1. */
  collectionRelationEdge?: Maybe<CollectionRelationsEdge>;
  deletedCollectionRelationNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Episode` that is related to this `CollectionRelation`. */
  episode?: Maybe<Episode>;
  /** Reads a single `Movie` that is related to this `CollectionRelation`. */
  movie?: Maybe<Movie>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `CollectionRelation`. */
  season?: Maybe<Season>;
  /** Reads a single `Tvshow` that is related to this `CollectionRelation`. */
  tvshow?: Maybe<Tvshow>;
};


/** The output of our delete `CollectionRelation` mutation. */
export type DeleteCollectionRelationPayloadCollectionRelationEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionRelationsOrderBy>>;
};

/**
 * All input for the `deleteCollectionsImageByCollectionIdAndImageType` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type DeleteCollectionsImageByCollectionIdAndImageTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  collectionId: Scalars['Int'];
  imageType: CollectionImageType;
};

/** The output of our delete `CollectionsImage` mutation. */
export type DeleteCollectionsImagePayload = {
  __typename?: 'DeleteCollectionsImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Collection` that is related to this `CollectionsImage`. */
  collection?: Maybe<Collection>;
  /** The `CollectionsImage` that was deleted by this mutation. */
  collectionsImage?: Maybe<CollectionsImage>;
  /** An edge for our `CollectionsImage`. May be used by Relay 1. */
  collectionsImageEdge?: Maybe<CollectionsImagesEdge>;
  deletedCollectionsImageNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `CollectionsImage` mutation. */
export type DeleteCollectionsImagePayloadCollectionsImageEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionsImagesOrderBy>>;
};

/**
 * All input for the `deleteCollectionsTag` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type DeleteCollectionsTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  collectionId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** The output of our delete `CollectionsTag` mutation. */
export type DeleteCollectionsTagPayload = {
  __typename?: 'DeleteCollectionsTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Collection` that is related to this `CollectionsTag`. */
  collection?: Maybe<Collection>;
  /** The `CollectionsTag` that was deleted by this mutation. */
  collectionsTag?: Maybe<CollectionsTag>;
  /** An edge for our `CollectionsTag`. May be used by Relay 1. */
  collectionsTagEdge?: Maybe<CollectionsTagsEdge>;
  deletedCollectionsTagNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `CollectionsTag` mutation. */
export type DeleteCollectionsTagPayloadCollectionsTagEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionsTagsOrderBy>>;
};

/**
 * All input for the `deleteEpisodeByExternalId` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteEpisodeByExternalIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalId: Scalars['String'];
};

/**
 * All input for the `deleteEpisode` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteEpisodeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `Episode` mutation. */
export type DeleteEpisodePayload = {
  __typename?: 'DeleteEpisodePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedEpisodeNodeId?: Maybe<Scalars['ID']>;
  /** The `Episode` that was deleted by this mutation. */
  episode?: Maybe<Episode>;
  /** An edge for our `Episode`. May be used by Relay 1. */
  episodeEdge?: Maybe<EpisodesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `Episode`. */
  season?: Maybe<Season>;
};


/** The output of our delete `Episode` mutation. */
export type DeleteEpisodePayloadEpisodeEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesOrderBy>>;
};

/**
 * All input for the `deleteEpisodesCast` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteEpisodesCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  episodeId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** The output of our delete `EpisodesCast` mutation. */
export type DeleteEpisodesCastPayload = {
  __typename?: 'DeleteEpisodesCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedEpisodesCastNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Episode` that is related to this `EpisodesCast`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesCast` that was deleted by this mutation. */
  episodesCast?: Maybe<EpisodesCast>;
  /** An edge for our `EpisodesCast`. May be used by Relay 1. */
  episodesCastEdge?: Maybe<EpisodesCastsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EpisodesCast` mutation. */
export type DeleteEpisodesCastPayloadEpisodesCastEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesCastsOrderBy>>;
};

/**
 * All input for the `deleteEpisodesImageByEpisodeIdAndImageType` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteEpisodesImageByEpisodeIdAndImageTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  episodeId: Scalars['Int'];
  imageType: EpisodeImageType;
};

/** The output of our delete `EpisodesImage` mutation. */
export type DeleteEpisodesImagePayload = {
  __typename?: 'DeleteEpisodesImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedEpisodesImageNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Episode` that is related to this `EpisodesImage`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesImage` that was deleted by this mutation. */
  episodesImage?: Maybe<EpisodesImage>;
  /** An edge for our `EpisodesImage`. May be used by Relay 1. */
  episodesImageEdge?: Maybe<EpisodesImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EpisodesImage` mutation. */
export type DeleteEpisodesImagePayloadEpisodesImageEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesImagesOrderBy>>;
};

/**
 * All input for the `deleteEpisodesLicense` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteEpisodesLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `EpisodesLicense` mutation. */
export type DeleteEpisodesLicensePayload = {
  __typename?: 'DeleteEpisodesLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedEpisodesLicenseNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Episode` that is related to this `EpisodesLicense`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesLicense` that was deleted by this mutation. */
  episodesLicense?: Maybe<EpisodesLicense>;
  /** An edge for our `EpisodesLicense`. May be used by Relay 1. */
  episodesLicenseEdge?: Maybe<EpisodesLicensesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EpisodesLicense` mutation. */
export type DeleteEpisodesLicensePayloadEpisodesLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesLicensesOrderBy>>;
};

/**
 * All input for the `deleteEpisodesLicensesCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteEpisodesLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  code: IsoAlphaTwoCountryCodes;
  episodesLicenseId: Scalars['Int'];
};

/** The output of our delete `EpisodesLicensesCountry` mutation. */
export type DeleteEpisodesLicensesCountryPayload = {
  __typename?: 'DeleteEpisodesLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedEpisodesLicensesCountryNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `EpisodesLicense` that is related to this `EpisodesLicensesCountry`. */
  episodesLicense?: Maybe<EpisodesLicense>;
  /** The `EpisodesLicensesCountry` that was deleted by this mutation. */
  episodesLicensesCountry?: Maybe<EpisodesLicensesCountry>;
  /** An edge for our `EpisodesLicensesCountry`. May be used by Relay 1. */
  episodesLicensesCountryEdge?: Maybe<EpisodesLicensesCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EpisodesLicensesCountry` mutation. */
export type DeleteEpisodesLicensesCountryPayloadEpisodesLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesLicensesCountriesOrderBy>>;
};

/**
 * All input for the `deleteEpisodesProductionCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteEpisodesProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  episodeId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** The output of our delete `EpisodesProductionCountry` mutation. */
export type DeleteEpisodesProductionCountryPayload = {
  __typename?: 'DeleteEpisodesProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedEpisodesProductionCountryNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Episode` that is related to this `EpisodesProductionCountry`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesProductionCountry` that was deleted by this mutation. */
  episodesProductionCountry?: Maybe<EpisodesProductionCountry>;
  /** An edge for our `EpisodesProductionCountry`. May be used by Relay 1. */
  episodesProductionCountryEdge?: Maybe<EpisodesProductionCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EpisodesProductionCountry` mutation. */
export type DeleteEpisodesProductionCountryPayloadEpisodesProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesProductionCountriesOrderBy>>;
};

/**
 * All input for the `deleteEpisodesTag` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteEpisodesTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  episodeId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** The output of our delete `EpisodesTag` mutation. */
export type DeleteEpisodesTagPayload = {
  __typename?: 'DeleteEpisodesTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedEpisodesTagNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Episode` that is related to this `EpisodesTag`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesTag` that was deleted by this mutation. */
  episodesTag?: Maybe<EpisodesTag>;
  /** An edge for our `EpisodesTag`. May be used by Relay 1. */
  episodesTagEdge?: Maybe<EpisodesTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EpisodesTag` mutation. */
export type DeleteEpisodesTagPayloadEpisodesTagEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesTagsOrderBy>>;
};

/**
 * All input for the `deleteEpisodesTrailer` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteEpisodesTrailerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  episodeId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/** The output of our delete `EpisodesTrailer` mutation. */
export type DeleteEpisodesTrailerPayload = {
  __typename?: 'DeleteEpisodesTrailerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedEpisodesTrailerNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Episode` that is related to this `EpisodesTrailer`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesTrailer` that was deleted by this mutation. */
  episodesTrailer?: Maybe<EpisodesTrailer>;
  /** An edge for our `EpisodesTrailer`. May be used by Relay 1. */
  episodesTrailerEdge?: Maybe<EpisodesTrailersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `EpisodesTrailer` mutation. */
export type DeleteEpisodesTrailerPayloadEpisodesTrailerEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesTrailersOrderBy>>;
};

/**
 * All input for the `deleteEpisodesTvshowGenre` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteEpisodesTvshowGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  episodeId: Scalars['Int'];
  tvshowGenresId: Scalars['Int'];
};

/** The output of our delete `EpisodesTvshowGenre` mutation. */
export type DeleteEpisodesTvshowGenrePayload = {
  __typename?: 'DeleteEpisodesTvshowGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedEpisodesTvshowGenreNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Episode` that is related to this `EpisodesTvshowGenre`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesTvshowGenre` that was deleted by this mutation. */
  episodesTvshowGenre?: Maybe<EpisodesTvshowGenre>;
  /** An edge for our `EpisodesTvshowGenre`. May be used by Relay 1. */
  episodesTvshowGenreEdge?: Maybe<EpisodesTvshowGenresEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TvshowGenre` that is related to this `EpisodesTvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenre>;
};


/** The output of our delete `EpisodesTvshowGenre` mutation. */
export type DeleteEpisodesTvshowGenrePayloadEpisodesTvshowGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesTvshowGenresOrderBy>>;
};

/**
 * All input for the `deleteMovieByExternalId` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type DeleteMovieByExternalIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalId: Scalars['String'];
};

/**
 * All input for the `deleteMovieGenre` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteMovieGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `MovieGenre` mutation. */
export type DeleteMovieGenrePayload = {
  __typename?: 'DeleteMovieGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMovieGenreNodeId?: Maybe<Scalars['ID']>;
  /** The `MovieGenre` that was deleted by this mutation. */
  movieGenre?: Maybe<MovieGenre>;
  /** An edge for our `MovieGenre`. May be used by Relay 1. */
  movieGenreEdge?: Maybe<MovieGenresEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `MovieGenre` mutation. */
export type DeleteMovieGenrePayloadMovieGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<MovieGenresOrderBy>>;
};

/**
 * All input for the `deleteMovie` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type DeleteMovieInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `Movie` mutation. */
export type DeleteMoviePayload = {
  __typename?: 'DeleteMoviePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMovieNodeId?: Maybe<Scalars['ID']>;
  /** The `Movie` that was deleted by this mutation. */
  movie?: Maybe<Movie>;
  /** An edge for our `Movie`. May be used by Relay 1. */
  movieEdge?: Maybe<MoviesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Movie` mutation. */
export type DeleteMoviePayloadMovieEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesOrderBy>>;
};

/**
 * All input for the `deleteMoviesCast` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type DeleteMoviesCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  movieId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** The output of our delete `MoviesCast` mutation. */
export type DeleteMoviesCastPayload = {
  __typename?: 'DeleteMoviesCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMoviesCastNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Movie` that is related to this `MoviesCast`. */
  movie?: Maybe<Movie>;
  /** The `MoviesCast` that was deleted by this mutation. */
  moviesCast?: Maybe<MoviesCast>;
  /** An edge for our `MoviesCast`. May be used by Relay 1. */
  moviesCastEdge?: Maybe<MoviesCastsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `MoviesCast` mutation. */
export type DeleteMoviesCastPayloadMoviesCastEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesCastsOrderBy>>;
};

/**
 * All input for the `deleteMoviesImageByMovieIdAndImageType` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type DeleteMoviesImageByMovieIdAndImageTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageType: MovieImageType;
  movieId: Scalars['Int'];
};

/** The output of our delete `MoviesImage` mutation. */
export type DeleteMoviesImagePayload = {
  __typename?: 'DeleteMoviesImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMoviesImageNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Movie` that is related to this `MoviesImage`. */
  movie?: Maybe<Movie>;
  /** The `MoviesImage` that was deleted by this mutation. */
  moviesImage?: Maybe<MoviesImage>;
  /** An edge for our `MoviesImage`. May be used by Relay 1. */
  moviesImageEdge?: Maybe<MoviesImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `MoviesImage` mutation. */
export type DeleteMoviesImagePayloadMoviesImageEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesImagesOrderBy>>;
};

/**
 * All input for the `deleteMoviesLicense` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type DeleteMoviesLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `MoviesLicense` mutation. */
export type DeleteMoviesLicensePayload = {
  __typename?: 'DeleteMoviesLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMoviesLicenseNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Movie` that is related to this `MoviesLicense`. */
  movie?: Maybe<Movie>;
  /** The `MoviesLicense` that was deleted by this mutation. */
  moviesLicense?: Maybe<MoviesLicense>;
  /** An edge for our `MoviesLicense`. May be used by Relay 1. */
  moviesLicenseEdge?: Maybe<MoviesLicensesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `MoviesLicense` mutation. */
export type DeleteMoviesLicensePayloadMoviesLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesLicensesOrderBy>>;
};

/**
 * All input for the `deleteMoviesLicensesCountry` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type DeleteMoviesLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  code: IsoAlphaTwoCountryCodes;
  moviesLicenseId: Scalars['Int'];
};

/** The output of our delete `MoviesLicensesCountry` mutation. */
export type DeleteMoviesLicensesCountryPayload = {
  __typename?: 'DeleteMoviesLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMoviesLicensesCountryNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `MoviesLicense` that is related to this `MoviesLicensesCountry`. */
  moviesLicense?: Maybe<MoviesLicense>;
  /** The `MoviesLicensesCountry` that was deleted by this mutation. */
  moviesLicensesCountry?: Maybe<MoviesLicensesCountry>;
  /** An edge for our `MoviesLicensesCountry`. May be used by Relay 1. */
  moviesLicensesCountryEdge?: Maybe<MoviesLicensesCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `MoviesLicensesCountry` mutation. */
export type DeleteMoviesLicensesCountryPayloadMoviesLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesLicensesCountriesOrderBy>>;
};

/**
 * All input for the `deleteMoviesMovieGenre` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type DeleteMoviesMovieGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  movieGenresId: Scalars['Int'];
  movieId: Scalars['Int'];
};

/** The output of our delete `MoviesMovieGenre` mutation. */
export type DeleteMoviesMovieGenrePayload = {
  __typename?: 'DeleteMoviesMovieGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMoviesMovieGenreNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Movie` that is related to this `MoviesMovieGenre`. */
  movie?: Maybe<Movie>;
  /** Reads a single `MovieGenre` that is related to this `MoviesMovieGenre`. */
  movieGenres?: Maybe<MovieGenre>;
  /** The `MoviesMovieGenre` that was deleted by this mutation. */
  moviesMovieGenre?: Maybe<MoviesMovieGenre>;
  /** An edge for our `MoviesMovieGenre`. May be used by Relay 1. */
  moviesMovieGenreEdge?: Maybe<MoviesMovieGenresEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `MoviesMovieGenre` mutation. */
export type DeleteMoviesMovieGenrePayloadMoviesMovieGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesMovieGenresOrderBy>>;
};

/**
 * All input for the `deleteMoviesProductionCountry` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type DeleteMoviesProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  movieId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** The output of our delete `MoviesProductionCountry` mutation. */
export type DeleteMoviesProductionCountryPayload = {
  __typename?: 'DeleteMoviesProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMoviesProductionCountryNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Movie` that is related to this `MoviesProductionCountry`. */
  movie?: Maybe<Movie>;
  /** The `MoviesProductionCountry` that was deleted by this mutation. */
  moviesProductionCountry?: Maybe<MoviesProductionCountry>;
  /** An edge for our `MoviesProductionCountry`. May be used by Relay 1. */
  moviesProductionCountryEdge?: Maybe<MoviesProductionCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `MoviesProductionCountry` mutation. */
export type DeleteMoviesProductionCountryPayloadMoviesProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesProductionCountriesOrderBy>>;
};

/**
 * All input for the `deleteMoviesTag` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type DeleteMoviesTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  movieId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** The output of our delete `MoviesTag` mutation. */
export type DeleteMoviesTagPayload = {
  __typename?: 'DeleteMoviesTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMoviesTagNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Movie` that is related to this `MoviesTag`. */
  movie?: Maybe<Movie>;
  /** The `MoviesTag` that was deleted by this mutation. */
  moviesTag?: Maybe<MoviesTag>;
  /** An edge for our `MoviesTag`. May be used by Relay 1. */
  moviesTagEdge?: Maybe<MoviesTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `MoviesTag` mutation. */
export type DeleteMoviesTagPayloadMoviesTagEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesTagsOrderBy>>;
};

/**
 * All input for the `deleteMoviesTrailer` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type DeleteMoviesTrailerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  movieId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/** The output of our delete `MoviesTrailer` mutation. */
export type DeleteMoviesTrailerPayload = {
  __typename?: 'DeleteMoviesTrailerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedMoviesTrailerNodeId?: Maybe<Scalars['ID']>;
  /** Reads a single `Movie` that is related to this `MoviesTrailer`. */
  movie?: Maybe<Movie>;
  /** The `MoviesTrailer` that was deleted by this mutation. */
  moviesTrailer?: Maybe<MoviesTrailer>;
  /** An edge for our `MoviesTrailer`. May be used by Relay 1. */
  moviesTrailerEdge?: Maybe<MoviesTrailersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `MoviesTrailer` mutation. */
export type DeleteMoviesTrailerPayloadMoviesTrailerEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesTrailersOrderBy>>;
};

/**
 * All input for the `deleteReview` mutation.
 * @permissions: REVIEWS_EDIT,ADMIN
 */
export type DeleteReviewInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `Review` mutation. */
export type DeleteReviewPayload = {
  __typename?: 'DeleteReviewPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedReviewNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Review` that was deleted by this mutation. */
  review?: Maybe<Review>;
  /** An edge for our `Review`. May be used by Relay 1. */
  reviewEdge?: Maybe<ReviewsEdge>;
};


/** The output of our delete `Review` mutation. */
export type DeleteReviewPayloadReviewEdgeArgs = {
  orderBy?: InputMaybe<Array<ReviewsOrderBy>>;
};

/**
 * All input for the `deleteSeasonByExternalId` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSeasonByExternalIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalId: Scalars['String'];
};

/**
 * All input for the `deleteSeason` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSeasonInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `Season` mutation. */
export type DeleteSeasonPayload = {
  __typename?: 'DeleteSeasonPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedSeasonNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Season` that was deleted by this mutation. */
  season?: Maybe<Season>;
  /** An edge for our `Season`. May be used by Relay 1. */
  seasonEdge?: Maybe<SeasonsEdge>;
  /** Reads a single `Tvshow` that is related to this `Season`. */
  tvshow?: Maybe<Tvshow>;
};


/** The output of our delete `Season` mutation. */
export type DeleteSeasonPayloadSeasonEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsOrderBy>>;
};

/**
 * All input for the `deleteSeasonsCast` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSeasonsCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  seasonId: Scalars['Int'];
};

/** The output of our delete `SeasonsCast` mutation. */
export type DeleteSeasonsCastPayload = {
  __typename?: 'DeleteSeasonsCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedSeasonsCastNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsCast`. */
  season?: Maybe<Season>;
  /** The `SeasonsCast` that was deleted by this mutation. */
  seasonsCast?: Maybe<SeasonsCast>;
  /** An edge for our `SeasonsCast`. May be used by Relay 1. */
  seasonsCastEdge?: Maybe<SeasonsCastsEdge>;
};


/** The output of our delete `SeasonsCast` mutation. */
export type DeleteSeasonsCastPayloadSeasonsCastEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsCastsOrderBy>>;
};

/**
 * All input for the `deleteSeasonsImageBySeasonIdAndImageType` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSeasonsImageBySeasonIdAndImageTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageType: SeasonImageType;
  seasonId: Scalars['Int'];
};

/** The output of our delete `SeasonsImage` mutation. */
export type DeleteSeasonsImagePayload = {
  __typename?: 'DeleteSeasonsImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedSeasonsImageNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsImage`. */
  season?: Maybe<Season>;
  /** The `SeasonsImage` that was deleted by this mutation. */
  seasonsImage?: Maybe<SeasonsImage>;
  /** An edge for our `SeasonsImage`. May be used by Relay 1. */
  seasonsImageEdge?: Maybe<SeasonsImagesEdge>;
};


/** The output of our delete `SeasonsImage` mutation. */
export type DeleteSeasonsImagePayloadSeasonsImageEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsImagesOrderBy>>;
};

/**
 * All input for the `deleteSeasonsLicense` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSeasonsLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `SeasonsLicense` mutation. */
export type DeleteSeasonsLicensePayload = {
  __typename?: 'DeleteSeasonsLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedSeasonsLicenseNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsLicense`. */
  season?: Maybe<Season>;
  /** The `SeasonsLicense` that was deleted by this mutation. */
  seasonsLicense?: Maybe<SeasonsLicense>;
  /** An edge for our `SeasonsLicense`. May be used by Relay 1. */
  seasonsLicenseEdge?: Maybe<SeasonsLicensesEdge>;
};


/** The output of our delete `SeasonsLicense` mutation. */
export type DeleteSeasonsLicensePayloadSeasonsLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsLicensesOrderBy>>;
};

/**
 * All input for the `deleteSeasonsLicensesCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSeasonsLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  code: IsoAlphaTwoCountryCodes;
  seasonsLicenseId: Scalars['Int'];
};

/** The output of our delete `SeasonsLicensesCountry` mutation. */
export type DeleteSeasonsLicensesCountryPayload = {
  __typename?: 'DeleteSeasonsLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedSeasonsLicensesCountryNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `SeasonsLicense` that is related to this `SeasonsLicensesCountry`. */
  seasonsLicense?: Maybe<SeasonsLicense>;
  /** The `SeasonsLicensesCountry` that was deleted by this mutation. */
  seasonsLicensesCountry?: Maybe<SeasonsLicensesCountry>;
  /** An edge for our `SeasonsLicensesCountry`. May be used by Relay 1. */
  seasonsLicensesCountryEdge?: Maybe<SeasonsLicensesCountriesEdge>;
};


/** The output of our delete `SeasonsLicensesCountry` mutation. */
export type DeleteSeasonsLicensesCountryPayloadSeasonsLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsLicensesCountriesOrderBy>>;
};

/**
 * All input for the `deleteSeasonsProductionCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSeasonsProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  seasonId: Scalars['Int'];
};

/** The output of our delete `SeasonsProductionCountry` mutation. */
export type DeleteSeasonsProductionCountryPayload = {
  __typename?: 'DeleteSeasonsProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedSeasonsProductionCountryNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsProductionCountry`. */
  season?: Maybe<Season>;
  /** The `SeasonsProductionCountry` that was deleted by this mutation. */
  seasonsProductionCountry?: Maybe<SeasonsProductionCountry>;
  /** An edge for our `SeasonsProductionCountry`. May be used by Relay 1. */
  seasonsProductionCountryEdge?: Maybe<SeasonsProductionCountriesEdge>;
};


/** The output of our delete `SeasonsProductionCountry` mutation. */
export type DeleteSeasonsProductionCountryPayloadSeasonsProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsProductionCountriesOrderBy>>;
};

/**
 * All input for the `deleteSeasonsTag` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSeasonsTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  seasonId: Scalars['Int'];
};

/** The output of our delete `SeasonsTag` mutation. */
export type DeleteSeasonsTagPayload = {
  __typename?: 'DeleteSeasonsTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedSeasonsTagNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsTag`. */
  season?: Maybe<Season>;
  /** The `SeasonsTag` that was deleted by this mutation. */
  seasonsTag?: Maybe<SeasonsTag>;
  /** An edge for our `SeasonsTag`. May be used by Relay 1. */
  seasonsTagEdge?: Maybe<SeasonsTagsEdge>;
};


/** The output of our delete `SeasonsTag` mutation. */
export type DeleteSeasonsTagPayloadSeasonsTagEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsTagsOrderBy>>;
};

/**
 * All input for the `deleteSeasonsTrailer` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSeasonsTrailerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  seasonId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/** The output of our delete `SeasonsTrailer` mutation. */
export type DeleteSeasonsTrailerPayload = {
  __typename?: 'DeleteSeasonsTrailerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedSeasonsTrailerNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsTrailer`. */
  season?: Maybe<Season>;
  /** The `SeasonsTrailer` that was deleted by this mutation. */
  seasonsTrailer?: Maybe<SeasonsTrailer>;
  /** An edge for our `SeasonsTrailer`. May be used by Relay 1. */
  seasonsTrailerEdge?: Maybe<SeasonsTrailersEdge>;
};


/** The output of our delete `SeasonsTrailer` mutation. */
export type DeleteSeasonsTrailerPayloadSeasonsTrailerEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsTrailersOrderBy>>;
};

/**
 * All input for the `deleteSeasonsTvshowGenre` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSeasonsTvshowGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  seasonId: Scalars['Int'];
  tvshowGenresId: Scalars['Int'];
};

/** The output of our delete `SeasonsTvshowGenre` mutation. */
export type DeleteSeasonsTvshowGenrePayload = {
  __typename?: 'DeleteSeasonsTvshowGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedSeasonsTvshowGenreNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsTvshowGenre`. */
  season?: Maybe<Season>;
  /** The `SeasonsTvshowGenre` that was deleted by this mutation. */
  seasonsTvshowGenre?: Maybe<SeasonsTvshowGenre>;
  /** An edge for our `SeasonsTvshowGenre`. May be used by Relay 1. */
  seasonsTvshowGenreEdge?: Maybe<SeasonsTvshowGenresEdge>;
  /** Reads a single `TvshowGenre` that is related to this `SeasonsTvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenre>;
};


/** The output of our delete `SeasonsTvshowGenre` mutation. */
export type DeleteSeasonsTvshowGenrePayloadSeasonsTvshowGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsTvshowGenresOrderBy>>;
};

/**
 * All input for the `deleteSnapshot` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 * @permissions: MOVIES_EDIT,ADMIN
 * @permissions: SETTINGS_EDIT,ADMIN
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteSnapshotInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `Snapshot` mutation. */
export type DeleteSnapshotPayload = {
  __typename?: 'DeleteSnapshotPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedSnapshotNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Snapshot` that was deleted by this mutation. */
  snapshot?: Maybe<Snapshot>;
  /** An edge for our `Snapshot`. May be used by Relay 1. */
  snapshotEdge?: Maybe<SnapshotsEdge>;
};


/** The output of our delete `Snapshot` mutation. */
export type DeleteSnapshotPayloadSnapshotEdgeArgs = {
  orderBy?: InputMaybe<Array<SnapshotsOrderBy>>;
};

/**
 * All input for the `deleteTvshowByExternalId` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteTvshowByExternalIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalId: Scalars['String'];
};

/**
 * All input for the `deleteTvshowGenre` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type DeleteTvshowGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `TvshowGenre` mutation. */
export type DeleteTvshowGenrePayload = {
  __typename?: 'DeleteTvshowGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTvshowGenreNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TvshowGenre` that was deleted by this mutation. */
  tvshowGenre?: Maybe<TvshowGenre>;
  /** An edge for our `TvshowGenre`. May be used by Relay 1. */
  tvshowGenreEdge?: Maybe<TvshowGenresEdge>;
};


/** The output of our delete `TvshowGenre` mutation. */
export type DeleteTvshowGenrePayloadTvshowGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowGenresOrderBy>>;
};

/**
 * All input for the `deleteTvshow` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteTvshowInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `Tvshow` mutation. */
export type DeleteTvshowPayload = {
  __typename?: 'DeleteTvshowPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTvshowNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tvshow` that was deleted by this mutation. */
  tvshow?: Maybe<Tvshow>;
  /** An edge for our `Tvshow`. May be used by Relay 1. */
  tvshowEdge?: Maybe<TvshowsEdge>;
};


/** The output of our delete `Tvshow` mutation. */
export type DeleteTvshowPayloadTvshowEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsOrderBy>>;
};

/**
 * All input for the `deleteTvshowsCast` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteTvshowsCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  tvshowId: Scalars['Int'];
};

/** The output of our delete `TvshowsCast` mutation. */
export type DeleteTvshowsCastPayload = {
  __typename?: 'DeleteTvshowsCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTvshowsCastNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsCast`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsCast` that was deleted by this mutation. */
  tvshowsCast?: Maybe<TvshowsCast>;
  /** An edge for our `TvshowsCast`. May be used by Relay 1. */
  tvshowsCastEdge?: Maybe<TvshowsCastsEdge>;
};


/** The output of our delete `TvshowsCast` mutation. */
export type DeleteTvshowsCastPayloadTvshowsCastEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsCastsOrderBy>>;
};

/**
 * All input for the `deleteTvshowsImageByTvshowIdAndImageType` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteTvshowsImageByTvshowIdAndImageTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageType: TvshowImageType;
  tvshowId: Scalars['Int'];
};

/** The output of our delete `TvshowsImage` mutation. */
export type DeleteTvshowsImagePayload = {
  __typename?: 'DeleteTvshowsImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTvshowsImageNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsImage`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsImage` that was deleted by this mutation. */
  tvshowsImage?: Maybe<TvshowsImage>;
  /** An edge for our `TvshowsImage`. May be used by Relay 1. */
  tvshowsImageEdge?: Maybe<TvshowsImagesEdge>;
};


/** The output of our delete `TvshowsImage` mutation. */
export type DeleteTvshowsImagePayloadTvshowsImageEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsImagesOrderBy>>;
};

/**
 * All input for the `deleteTvshowsLicense` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteTvshowsLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** The output of our delete `TvshowsLicense` mutation. */
export type DeleteTvshowsLicensePayload = {
  __typename?: 'DeleteTvshowsLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTvshowsLicenseNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsLicense`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsLicense` that was deleted by this mutation. */
  tvshowsLicense?: Maybe<TvshowsLicense>;
  /** An edge for our `TvshowsLicense`. May be used by Relay 1. */
  tvshowsLicenseEdge?: Maybe<TvshowsLicensesEdge>;
};


/** The output of our delete `TvshowsLicense` mutation. */
export type DeleteTvshowsLicensePayloadTvshowsLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsLicensesOrderBy>>;
};

/**
 * All input for the `deleteTvshowsLicensesCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteTvshowsLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  code: IsoAlphaTwoCountryCodes;
  tvshowsLicenseId: Scalars['Int'];
};

/** The output of our delete `TvshowsLicensesCountry` mutation. */
export type DeleteTvshowsLicensesCountryPayload = {
  __typename?: 'DeleteTvshowsLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTvshowsLicensesCountryNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TvshowsLicense` that is related to this `TvshowsLicensesCountry`. */
  tvshowsLicense?: Maybe<TvshowsLicense>;
  /** The `TvshowsLicensesCountry` that was deleted by this mutation. */
  tvshowsLicensesCountry?: Maybe<TvshowsLicensesCountry>;
  /** An edge for our `TvshowsLicensesCountry`. May be used by Relay 1. */
  tvshowsLicensesCountryEdge?: Maybe<TvshowsLicensesCountriesEdge>;
};


/** The output of our delete `TvshowsLicensesCountry` mutation. */
export type DeleteTvshowsLicensesCountryPayloadTvshowsLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsLicensesCountriesOrderBy>>;
};

/**
 * All input for the `deleteTvshowsProductionCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteTvshowsProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  tvshowId: Scalars['Int'];
};

/** The output of our delete `TvshowsProductionCountry` mutation. */
export type DeleteTvshowsProductionCountryPayload = {
  __typename?: 'DeleteTvshowsProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTvshowsProductionCountryNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsProductionCountry`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsProductionCountry` that was deleted by this mutation. */
  tvshowsProductionCountry?: Maybe<TvshowsProductionCountry>;
  /** An edge for our `TvshowsProductionCountry`. May be used by Relay 1. */
  tvshowsProductionCountryEdge?: Maybe<TvshowsProductionCountriesEdge>;
};


/** The output of our delete `TvshowsProductionCountry` mutation. */
export type DeleteTvshowsProductionCountryPayloadTvshowsProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsProductionCountriesOrderBy>>;
};

/**
 * All input for the `deleteTvshowsTag` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteTvshowsTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  tvshowId: Scalars['Int'];
};

/** The output of our delete `TvshowsTag` mutation. */
export type DeleteTvshowsTagPayload = {
  __typename?: 'DeleteTvshowsTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTvshowsTagNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsTag`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsTag` that was deleted by this mutation. */
  tvshowsTag?: Maybe<TvshowsTag>;
  /** An edge for our `TvshowsTag`. May be used by Relay 1. */
  tvshowsTagEdge?: Maybe<TvshowsTagsEdge>;
};


/** The output of our delete `TvshowsTag` mutation. */
export type DeleteTvshowsTagPayloadTvshowsTagEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsTagsOrderBy>>;
};

/**
 * All input for the `deleteTvshowsTrailer` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteTvshowsTrailerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  tvshowId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/** The output of our delete `TvshowsTrailer` mutation. */
export type DeleteTvshowsTrailerPayload = {
  __typename?: 'DeleteTvshowsTrailerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTvshowsTrailerNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsTrailer`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsTrailer` that was deleted by this mutation. */
  tvshowsTrailer?: Maybe<TvshowsTrailer>;
  /** An edge for our `TvshowsTrailer`. May be used by Relay 1. */
  tvshowsTrailerEdge?: Maybe<TvshowsTrailersEdge>;
};


/** The output of our delete `TvshowsTrailer` mutation. */
export type DeleteTvshowsTrailerPayloadTvshowsTrailerEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsTrailersOrderBy>>;
};

/**
 * All input for the `deleteTvshowsTvshowGenre` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type DeleteTvshowsTvshowGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  tvshowGenresId: Scalars['Int'];
  tvshowId: Scalars['Int'];
};

/** The output of our delete `TvshowsTvshowGenre` mutation. */
export type DeleteTvshowsTvshowGenrePayload = {
  __typename?: 'DeleteTvshowsTvshowGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTvshowsTvshowGenreNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsTvshowGenre`. */
  tvshow?: Maybe<Tvshow>;
  /** Reads a single `TvshowGenre` that is related to this `TvshowsTvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenre>;
  /** The `TvshowsTvshowGenre` that was deleted by this mutation. */
  tvshowsTvshowGenre?: Maybe<TvshowsTvshowGenre>;
  /** An edge for our `TvshowsTvshowGenre`. May be used by Relay 1. */
  tvshowsTvshowGenreEdge?: Maybe<TvshowsTvshowGenresEdge>;
};


/** The output of our delete `TvshowsTvshowGenre` mutation. */
export type DeleteTvshowsTvshowGenrePayloadTvshowsTvshowGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsTvshowGenresOrderBy>>;
};

export enum EntityType {
  /** Collection */
  Collection = 'COLLECTION',
  /** Episode */
  Episode = 'EPISODE',
  /** Movie */
  Movie = 'MOVIE',
  /** Movie Genre */
  MovieGenre = 'MOVIE_GENRE',
  /** Season */
  Season = 'SEASON',
  /** Tvshow */
  Tvshow = 'TVSHOW',
  /** Tvshow Genre */
  TvshowGenre = 'TVSHOW_GENRE'
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

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type Episode = {
  __typename?: 'Episode';
  /** Reads and enables pagination through a set of `CollectionRelation`. */
  collectionRelations: CollectionRelationsConnection;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `EpisodesCast`. */
  episodesCasts: EpisodesCastsConnection;
  /** Reads and enables pagination through a set of `EpisodesImage`. */
  episodesImages: EpisodesImagesConnection;
  /** Reads and enables pagination through a set of `EpisodesLicense`. */
  episodesLicenses: EpisodesLicensesConnection;
  /** Reads and enables pagination through a set of `EpisodesProductionCountry`. */
  episodesProductionCountries: EpisodesProductionCountriesConnection;
  /** Reads and enables pagination through a set of `EpisodesSnapshot`. */
  episodesSnapshots: EpisodesSnapshotsConnection;
  /** Reads and enables pagination through a set of `EpisodesTag`. */
  episodesTags: EpisodesTagsConnection;
  /** Reads and enables pagination through a set of `EpisodesTrailer`. */
  episodesTrailers: EpisodesTrailersConnection;
  /** Reads and enables pagination through a set of `EpisodesTvshowGenre`. */
  episodesTvshowGenres: EpisodesTvshowGenresConnection;
  externalId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  index: Scalars['Int'];
  mainVideoId?: Maybe<Scalars['UUID']>;
  originalTitle?: Maybe<Scalars['String']>;
  publishStatus: PublishStatus;
  publishedDate?: Maybe<Scalars['Datetime']>;
  publishedUser?: Maybe<Scalars['String']>;
  released?: Maybe<Scalars['Date']>;
  /** Reads a single `Season` that is related to this `Episode`. */
  season?: Maybe<Season>;
  seasonId?: Maybe<Scalars['Int']>;
  studio?: Maybe<Scalars['String']>;
  synopsis?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodeCollectionRelationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionRelationCondition>;
  filter?: InputMaybe<CollectionRelationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionRelationsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodeEpisodesCastsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesCastCondition>;
  filter?: InputMaybe<EpisodesCastFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesCastsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodeEpisodesImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesImageCondition>;
  filter?: InputMaybe<EpisodesImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesImagesOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodeEpisodesLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesLicenseCondition>;
  filter?: InputMaybe<EpisodesLicenseFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesLicensesOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodeEpisodesProductionCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesProductionCountryCondition>;
  filter?: InputMaybe<EpisodesProductionCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesProductionCountriesOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodeEpisodesSnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesSnapshotCondition>;
  filter?: InputMaybe<EpisodesSnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesSnapshotsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodeEpisodesTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesTagCondition>;
  filter?: InputMaybe<EpisodesTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesTagsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodeEpisodesTrailersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesTrailerCondition>;
  filter?: InputMaybe<EpisodesTrailerFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesTrailersOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodeEpisodesTvshowGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesTvshowGenreCondition>;
  filter?: InputMaybe<EpisodesTvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesTvshowGenresOrderBy>>;
};

/** A condition to be used against `Episode` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type EpisodeCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `index` field. */
  index?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `mainVideoId` field. */
  mainVideoId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `originalTitle` field. */
  originalTitle?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `publishStatus` field. */
  publishStatus?: InputMaybe<PublishStatus>;
  /** Checks for equality with the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `released` field. */
  released?: InputMaybe<Scalars['Date']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `studio` field. */
  studio?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `synopsis` field. */
  synopsis?: InputMaybe<Scalars['String']>;
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
};

/** A filter to be used against `Episode` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodeFilter>>;
  /** Filter by the object’s `collectionRelations` relation. */
  collectionRelations?: InputMaybe<EpisodeToManyCollectionRelationFilter>;
  /** Some related `collectionRelations` exist. */
  collectionRelationsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `episodesCasts` relation. */
  episodesCasts?: InputMaybe<EpisodeToManyEpisodesCastFilter>;
  /** Some related `episodesCasts` exist. */
  episodesCastsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `episodesImages` relation. */
  episodesImages?: InputMaybe<EpisodeToManyEpisodesImageFilter>;
  /** Some related `episodesImages` exist. */
  episodesImagesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `episodesLicenses` relation. */
  episodesLicenses?: InputMaybe<EpisodeToManyEpisodesLicenseFilter>;
  /** Some related `episodesLicenses` exist. */
  episodesLicensesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `episodesProductionCountries` relation. */
  episodesProductionCountries?: InputMaybe<EpisodeToManyEpisodesProductionCountryFilter>;
  /** Some related `episodesProductionCountries` exist. */
  episodesProductionCountriesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `episodesSnapshots` relation. */
  episodesSnapshots?: InputMaybe<EpisodeToManyEpisodesSnapshotFilter>;
  /** Some related `episodesSnapshots` exist. */
  episodesSnapshotsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `episodesTags` relation. */
  episodesTags?: InputMaybe<EpisodeToManyEpisodesTagFilter>;
  /** Some related `episodesTags` exist. */
  episodesTagsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `episodesTrailers` relation. */
  episodesTrailers?: InputMaybe<EpisodeToManyEpisodesTrailerFilter>;
  /** Some related `episodesTrailers` exist. */
  episodesTrailersExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `episodesTvshowGenres` relation. */
  episodesTvshowGenres?: InputMaybe<EpisodeToManyEpisodesTvshowGenreFilter>;
  /** Some related `episodesTvshowGenres` exist. */
  episodesTvshowGenresExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `externalId` field. */
  externalId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `index` field. */
  index?: InputMaybe<IntFilter>;
  /** Filter by the object’s `mainVideoId` field. */
  mainVideoId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodeFilter>>;
  /** Filter by the object’s `originalTitle` field. */
  originalTitle?: InputMaybe<StringFilter>;
  /** Filter by the object’s `publishStatus` field. */
  publishStatus?: InputMaybe<PublishStatusFilter>;
  /** Filter by the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `released` field. */
  released?: InputMaybe<DateFilter>;
  /** Filter by the object’s `season` relation. */
  season?: InputMaybe<SeasonFilter>;
  /** A related `season` exists. */
  seasonExists?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `studio` field. */
  studio?: InputMaybe<StringFilter>;
  /** Filter by the object’s `synopsis` field. */
  synopsis?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

export enum EpisodeImageType {
  /** Cover */
  Cover = 'COVER',
  /** Teaser */
  Teaser = 'TEASER'
}

/** A filter to be used against EpisodeImageType fields. All fields are combined with a logical ‘and.’ */
export type EpisodeImageTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<EpisodeImageType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<EpisodeImageType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<EpisodeImageType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<EpisodeImageType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<EpisodeImageType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<EpisodeImageType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<EpisodeImageType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<EpisodeImageType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<EpisodeImageType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<EpisodeImageType>>;
};

/** An input for mutations affecting `Episode` */
export type EpisodeInput = {
  description?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  index: Scalars['Int'];
  mainVideoId?: InputMaybe<Scalars['UUID']>;
  originalTitle?: InputMaybe<Scalars['String']>;
  released?: InputMaybe<Scalars['Date']>;
  seasonId?: InputMaybe<Scalars['Int']>;
  studio?: InputMaybe<Scalars['String']>;
  synopsis?: InputMaybe<Scalars['String']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title: Scalars['String'];
};

/** Represents an update to a `Episode`. Fields that are set will be updated. */
export type EpisodePatch = {
  description?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  index?: InputMaybe<Scalars['Int']>;
  mainVideoId?: InputMaybe<Scalars['UUID']>;
  originalTitle?: InputMaybe<Scalars['String']>;
  released?: InputMaybe<Scalars['Date']>;
  seasonId?: InputMaybe<Scalars['Int']>;
  studio?: InputMaybe<Scalars['String']>;
  synopsis?: InputMaybe<Scalars['String']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

export type EpisodeSubscriptionPayload = {
  __typename?: 'EpisodeSubscriptionPayload';
  episode?: Maybe<Episode>;
  event?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** A filter to be used against many `CollectionRelation` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeToManyCollectionRelationFilter = {
  /** Every related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CollectionRelationFilter>;
  /** No related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CollectionRelationFilter>;
  /** Some related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CollectionRelationFilter>;
};

/** A filter to be used against many `EpisodesCast` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeToManyEpisodesCastFilter = {
  /** Every related `EpisodesCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesCastFilter>;
  /** No related `EpisodesCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesCastFilter>;
  /** Some related `EpisodesCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesCastFilter>;
};

/** A filter to be used against many `EpisodesImage` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeToManyEpisodesImageFilter = {
  /** Every related `EpisodesImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesImageFilter>;
  /** No related `EpisodesImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesImageFilter>;
  /** Some related `EpisodesImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesImageFilter>;
};

/** A filter to be used against many `EpisodesLicense` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeToManyEpisodesLicenseFilter = {
  /** Every related `EpisodesLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesLicenseFilter>;
  /** No related `EpisodesLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesLicenseFilter>;
  /** Some related `EpisodesLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesLicenseFilter>;
};

/** A filter to be used against many `EpisodesProductionCountry` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeToManyEpisodesProductionCountryFilter = {
  /** Every related `EpisodesProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesProductionCountryFilter>;
  /** No related `EpisodesProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesProductionCountryFilter>;
  /** Some related `EpisodesProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesProductionCountryFilter>;
};

/** A filter to be used against many `EpisodesSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeToManyEpisodesSnapshotFilter = {
  /** Every related `EpisodesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesSnapshotFilter>;
  /** No related `EpisodesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesSnapshotFilter>;
  /** Some related `EpisodesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesSnapshotFilter>;
};

/** A filter to be used against many `EpisodesTag` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeToManyEpisodesTagFilter = {
  /** Every related `EpisodesTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesTagFilter>;
  /** No related `EpisodesTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesTagFilter>;
  /** Some related `EpisodesTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesTagFilter>;
};

/** A filter to be used against many `EpisodesTrailer` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeToManyEpisodesTrailerFilter = {
  /** Every related `EpisodesTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesTrailerFilter>;
  /** No related `EpisodesTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesTrailerFilter>;
  /** Some related `EpisodesTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesTrailerFilter>;
};

/** A filter to be used against many `EpisodesTvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type EpisodeToManyEpisodesTvshowGenreFilter = {
  /** Every related `EpisodesTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesTvshowGenreFilter>;
  /** No related `EpisodesTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesTvshowGenreFilter>;
  /** Some related `EpisodesTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesTvshowGenreFilter>;
};

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodesCast = {
  __typename?: 'EpisodesCast';
  /** Reads a single `Episode` that is related to this `EpisodesCast`. */
  episode?: Maybe<Episode>;
  episodeId: Scalars['Int'];
  name: Scalars['String'];
};

/**
 * A condition to be used against `EpisodesCast` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EpisodesCastCondition = {
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `EpisodesCast` object types. All fields are combined with a logical ‘and.’ */
export type EpisodesCastFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodesCastFilter>>;
  /** Filter by the object’s `episode` relation. */
  episode?: InputMaybe<EpisodeFilter>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodesCastFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodesCastFilter>>;
};

/** An input for mutations affecting `EpisodesCast` */
export type EpisodesCastInput = {
  episodeId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** Represents an update to a `EpisodesCast`. Fields that are set will be updated. */
export type EpisodesCastPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `EpisodesCast` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type EpisodesCastsConnection = {
  __typename?: 'EpisodesCastsConnection';
  /** A list of edges which contains the `EpisodesCast` and cursor to aid in pagination. */
  edges: Array<EpisodesCastsEdge>;
  /** A list of `EpisodesCast` objects. */
  nodes: Array<EpisodesCast>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodesCast` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EpisodesCast` edge in the connection. */
export type EpisodesCastsEdge = {
  __typename?: 'EpisodesCastsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EpisodesCast` at the end of the edge. */
  node: EpisodesCast;
};

/** Methods to use when ordering `EpisodesCast`. */
export enum EpisodesCastsOrderBy {
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A connection to a list of `Episode` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type EpisodesConnection = {
  __typename?: 'EpisodesConnection';
  /** A list of edges which contains the `Episode` and cursor to aid in pagination. */
  edges: Array<EpisodesEdge>;
  /** A list of `Episode` objects. */
  nodes: Array<Episode>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Episode` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Episode` edge in the connection. */
export type EpisodesEdge = {
  __typename?: 'EpisodesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Episode` at the end of the edge. */
  node: Episode;
};

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodesImage = {
  __typename?: 'EpisodesImage';
  /** Reads a single `Episode` that is related to this `EpisodesImage`. */
  episode?: Maybe<Episode>;
  episodeId: Scalars['Int'];
  imageId: Scalars['UUID'];
  imageType: EpisodeImageType;
};

/**
 * A condition to be used against `EpisodesImage` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EpisodesImageCondition = {
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `imageType` field. */
  imageType?: InputMaybe<EpisodeImageType>;
};

/** A filter to be used against `EpisodesImage` object types. All fields are combined with a logical ‘and.’ */
export type EpisodesImageFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodesImageFilter>>;
  /** Filter by the object’s `episode` relation. */
  episode?: InputMaybe<EpisodeFilter>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `imageId` field. */
  imageId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `imageType` field. */
  imageType?: InputMaybe<EpisodeImageTypeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodesImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodesImageFilter>>;
};

/** An input for mutations affecting `EpisodesImage` */
export type EpisodesImageInput = {
  episodeId: Scalars['Int'];
  imageId: Scalars['UUID'];
  imageType: EpisodeImageType;
};

/** Represents an update to a `EpisodesImage`. Fields that are set will be updated. */
export type EpisodesImagePatch = {
  episodeId?: InputMaybe<Scalars['Int']>;
  imageId?: InputMaybe<Scalars['UUID']>;
  imageType?: InputMaybe<EpisodeImageType>;
};

/**
 * A connection to a list of `EpisodesImage` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type EpisodesImagesConnection = {
  __typename?: 'EpisodesImagesConnection';
  /** A list of edges which contains the `EpisodesImage` and cursor to aid in pagination. */
  edges: Array<EpisodesImagesEdge>;
  /** A list of `EpisodesImage` objects. */
  nodes: Array<EpisodesImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodesImage` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EpisodesImage` edge in the connection. */
export type EpisodesImagesEdge = {
  __typename?: 'EpisodesImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EpisodesImage` at the end of the edge. */
  node: EpisodesImage;
};

/** Methods to use when ordering `EpisodesImage`. */
export enum EpisodesImagesOrderBy {
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  ImageTypeAsc = 'IMAGE_TYPE_ASC',
  ImageTypeDesc = 'IMAGE_TYPE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodesLicense = {
  __typename?: 'EpisodesLicense';
  createdDate: Scalars['Datetime'];
  /** Reads a single `Episode` that is related to this `EpisodesLicense`. */
  episode?: Maybe<Episode>;
  episodeId: Scalars['Int'];
  /** Reads and enables pagination through a set of `EpisodesLicensesCountry`. */
  episodesLicensesCountries: EpisodesLicensesCountriesConnection;
  id: Scalars['Int'];
  licenseEnd?: Maybe<Scalars['Datetime']>;
  licenseStart?: Maybe<Scalars['Datetime']>;
  updatedDate: Scalars['Datetime'];
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodesLicenseEpisodesLicensesCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesLicensesCountryCondition>;
  filter?: InputMaybe<EpisodesLicensesCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesLicensesCountriesOrderBy>>;
};

/**
 * A condition to be used against `EpisodesLicense` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EpisodesLicenseCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `licenseEnd` field. */
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `licenseStart` field. */
  licenseStart?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
};

/** A filter to be used against `EpisodesLicense` object types. All fields are combined with a logical ‘and.’ */
export type EpisodesLicenseFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodesLicenseFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `episode` relation. */
  episode?: InputMaybe<EpisodeFilter>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `episodesLicensesCountries` relation. */
  episodesLicensesCountries?: InputMaybe<EpisodesLicenseToManyEpisodesLicensesCountryFilter>;
  /** Some related `episodesLicensesCountries` exist. */
  episodesLicensesCountriesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `licenseEnd` field. */
  licenseEnd?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `licenseStart` field. */
  licenseStart?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodesLicenseFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodesLicenseFilter>>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
};

/** An input for mutations affecting `EpisodesLicense` */
export type EpisodesLicenseInput = {
  episodeId: Scalars['Int'];
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  licenseStart?: InputMaybe<Scalars['Datetime']>;
};

/** Represents an update to a `EpisodesLicense`. Fields that are set will be updated. */
export type EpisodesLicensePatch = {
  episodeId?: InputMaybe<Scalars['Int']>;
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  licenseStart?: InputMaybe<Scalars['Datetime']>;
};

/** A filter to be used against many `EpisodesLicensesCountry` object types. All fields are combined with a logical ‘and.’ */
export type EpisodesLicenseToManyEpisodesLicensesCountryFilter = {
  /** Every related `EpisodesLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesLicensesCountryFilter>;
  /** No related `EpisodesLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesLicensesCountryFilter>;
  /** Some related `EpisodesLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesLicensesCountryFilter>;
};

/**
 * A connection to a list of `EpisodesLicense` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type EpisodesLicensesConnection = {
  __typename?: 'EpisodesLicensesConnection';
  /** A list of edges which contains the `EpisodesLicense` and cursor to aid in pagination. */
  edges: Array<EpisodesLicensesEdge>;
  /** A list of `EpisodesLicense` objects. */
  nodes: Array<EpisodesLicense>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodesLicense` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/**
 * A connection to a list of `EpisodesLicensesCountry` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type EpisodesLicensesCountriesConnection = {
  __typename?: 'EpisodesLicensesCountriesConnection';
  /** A list of edges which contains the `EpisodesLicensesCountry` and cursor to aid in pagination. */
  edges: Array<EpisodesLicensesCountriesEdge>;
  /** A list of `EpisodesLicensesCountry` objects. */
  nodes: Array<EpisodesLicensesCountry>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodesLicensesCountry` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EpisodesLicensesCountry` edge in the connection. */
export type EpisodesLicensesCountriesEdge = {
  __typename?: 'EpisodesLicensesCountriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EpisodesLicensesCountry` at the end of the edge. */
  node: EpisodesLicensesCountry;
};

/** Methods to use when ordering `EpisodesLicensesCountry`. */
export enum EpisodesLicensesCountriesOrderBy {
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  EpisodesLicenseIdAsc = 'EPISODES_LICENSE_ID_ASC',
  EpisodesLicenseIdDesc = 'EPISODES_LICENSE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodesLicensesCountry = {
  __typename?: 'EpisodesLicensesCountry';
  code: IsoAlphaTwoCountryCodes;
  /** Reads a single `EpisodesLicense` that is related to this `EpisodesLicensesCountry`. */
  episodesLicense?: Maybe<EpisodesLicense>;
  episodesLicenseId: Scalars['Int'];
};

/**
 * A condition to be used against `EpisodesLicensesCountry` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EpisodesLicensesCountryCondition = {
  /** Checks for equality with the object’s `code` field. */
  code?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Checks for equality with the object’s `episodesLicenseId` field. */
  episodesLicenseId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `EpisodesLicensesCountry` object types. All fields are combined with a logical ‘and.’ */
export type EpisodesLicensesCountryFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodesLicensesCountryFilter>>;
  /** Filter by the object’s `code` field. */
  code?: InputMaybe<IsoAlphaTwoCountryCodesFilter>;
  /** Filter by the object’s `episodesLicense` relation. */
  episodesLicense?: InputMaybe<EpisodesLicenseFilter>;
  /** Filter by the object’s `episodesLicenseId` field. */
  episodesLicenseId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodesLicensesCountryFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodesLicensesCountryFilter>>;
};

/** An input for mutations affecting `EpisodesLicensesCountry` */
export type EpisodesLicensesCountryInput = {
  code: IsoAlphaTwoCountryCodes;
  episodesLicenseId: Scalars['Int'];
};

/** Represents an update to a `EpisodesLicensesCountry`. Fields that are set will be updated. */
export type EpisodesLicensesCountryPatch = {
  code?: InputMaybe<IsoAlphaTwoCountryCodes>;
};

/** A `EpisodesLicense` edge in the connection. */
export type EpisodesLicensesEdge = {
  __typename?: 'EpisodesLicensesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EpisodesLicense` at the end of the edge. */
  node: EpisodesLicense;
};

/** Methods to use when ordering `EpisodesLicense`. */
export enum EpisodesLicensesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LicenseEndAsc = 'LICENSE_END_ASC',
  LicenseEndDesc = 'LICENSE_END_DESC',
  LicenseStartAsc = 'LICENSE_START_ASC',
  LicenseStartDesc = 'LICENSE_START_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC'
}

/** Methods to use when ordering `Episode`. */
export enum EpisodesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IndexAsc = 'INDEX_ASC',
  IndexDesc = 'INDEX_DESC',
  MainVideoIdAsc = 'MAIN_VIDEO_ID_ASC',
  MainVideoIdDesc = 'MAIN_VIDEO_ID_DESC',
  Natural = 'NATURAL',
  OriginalTitleAsc = 'ORIGINAL_TITLE_ASC',
  OriginalTitleDesc = 'ORIGINAL_TITLE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PublishedDateAsc = 'PUBLISHED_DATE_ASC',
  PublishedDateDesc = 'PUBLISHED_DATE_DESC',
  PublishedUserAsc = 'PUBLISHED_USER_ASC',
  PublishedUserDesc = 'PUBLISHED_USER_DESC',
  PublishStatusAsc = 'PUBLISH_STATUS_ASC',
  PublishStatusDesc = 'PUBLISH_STATUS_DESC',
  ReleasedAsc = 'RELEASED_ASC',
  ReleasedDesc = 'RELEASED_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC',
  StudioAsc = 'STUDIO_ASC',
  StudioDesc = 'STUDIO_DESC',
  SynopsisAsc = 'SYNOPSIS_ASC',
  SynopsisDesc = 'SYNOPSIS_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/**
 * A connection to a list of `EpisodesProductionCountry` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type EpisodesProductionCountriesConnection = {
  __typename?: 'EpisodesProductionCountriesConnection';
  /** A list of edges which contains the `EpisodesProductionCountry` and cursor to aid in pagination. */
  edges: Array<EpisodesProductionCountriesEdge>;
  /** A list of `EpisodesProductionCountry` objects. */
  nodes: Array<EpisodesProductionCountry>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodesProductionCountry` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EpisodesProductionCountry` edge in the connection. */
export type EpisodesProductionCountriesEdge = {
  __typename?: 'EpisodesProductionCountriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EpisodesProductionCountry` at the end of the edge. */
  node: EpisodesProductionCountry;
};

/** Methods to use when ordering `EpisodesProductionCountry`. */
export enum EpisodesProductionCountriesOrderBy {
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodesProductionCountry = {
  __typename?: 'EpisodesProductionCountry';
  /** Reads a single `Episode` that is related to this `EpisodesProductionCountry`. */
  episode?: Maybe<Episode>;
  episodeId: Scalars['Int'];
  name: Scalars['String'];
};

/**
 * A condition to be used against `EpisodesProductionCountry` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type EpisodesProductionCountryCondition = {
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `EpisodesProductionCountry` object types. All fields are combined with a logical ‘and.’ */
export type EpisodesProductionCountryFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodesProductionCountryFilter>>;
  /** Filter by the object’s `episode` relation. */
  episode?: InputMaybe<EpisodeFilter>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodesProductionCountryFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodesProductionCountryFilter>>;
};

/** An input for mutations affecting `EpisodesProductionCountry` */
export type EpisodesProductionCountryInput = {
  episodeId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** Represents an update to a `EpisodesProductionCountry`. Fields that are set will be updated. */
export type EpisodesProductionCountryPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodesSnapshot = {
  __typename?: 'EpisodesSnapshot';
  /** Reads a single `Episode` that is related to this `EpisodesSnapshot`. */
  episode?: Maybe<Episode>;
  episodeId: Scalars['Int'];
  /** Reads a single `Snapshot` that is related to this `EpisodesSnapshot`. */
  snapshot?: Maybe<Snapshot>;
  snapshotId: Scalars['Int'];
};

/**
 * A condition to be used against `EpisodesSnapshot` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EpisodesSnapshotCondition = {
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `EpisodesSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type EpisodesSnapshotFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodesSnapshotFilter>>;
  /** Filter by the object’s `episode` relation. */
  episode?: InputMaybe<EpisodeFilter>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodesSnapshotFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodesSnapshotFilter>>;
  /** Filter by the object’s `snapshot` relation. */
  snapshot?: InputMaybe<SnapshotFilter>;
  /** Filter by the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<IntFilter>;
};

/**
 * A connection to a list of `EpisodesSnapshot` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type EpisodesSnapshotsConnection = {
  __typename?: 'EpisodesSnapshotsConnection';
  /** A list of edges which contains the `EpisodesSnapshot` and cursor to aid in pagination. */
  edges: Array<EpisodesSnapshotsEdge>;
  /** A list of `EpisodesSnapshot` objects. */
  nodes: Array<EpisodesSnapshot>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodesSnapshot` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EpisodesSnapshot` edge in the connection. */
export type EpisodesSnapshotsEdge = {
  __typename?: 'EpisodesSnapshotsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EpisodesSnapshot` at the end of the edge. */
  node: EpisodesSnapshot;
};

/** Methods to use when ordering `EpisodesSnapshot`. */
export enum EpisodesSnapshotsOrderBy {
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SnapshotIdAsc = 'SNAPSHOT_ID_ASC',
  SnapshotIdDesc = 'SNAPSHOT_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodesTag = {
  __typename?: 'EpisodesTag';
  /** Reads a single `Episode` that is related to this `EpisodesTag`. */
  episode?: Maybe<Episode>;
  episodeId: Scalars['Int'];
  name: Scalars['String'];
};

/**
 * A condition to be used against `EpisodesTag` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type EpisodesTagCondition = {
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `EpisodesTag` object types. All fields are combined with a logical ‘and.’ */
export type EpisodesTagFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodesTagFilter>>;
  /** Filter by the object’s `episode` relation. */
  episode?: InputMaybe<EpisodeFilter>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodesTagFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodesTagFilter>>;
};

/** An input for mutations affecting `EpisodesTag` */
export type EpisodesTagInput = {
  episodeId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** Represents an update to a `EpisodesTag`. Fields that are set will be updated. */
export type EpisodesTagPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `EpisodesTag` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type EpisodesTagsConnection = {
  __typename?: 'EpisodesTagsConnection';
  /** A list of edges which contains the `EpisodesTag` and cursor to aid in pagination. */
  edges: Array<EpisodesTagsEdge>;
  /** A list of `EpisodesTag` objects. */
  nodes: Array<EpisodesTag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodesTag` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EpisodesTag` edge in the connection. */
export type EpisodesTagsEdge = {
  __typename?: 'EpisodesTagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EpisodesTag` at the end of the edge. */
  node: EpisodesTag;
};

/** Methods to use when ordering `EpisodesTag`. */
export enum EpisodesTagsOrderBy {
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodesTrailer = {
  __typename?: 'EpisodesTrailer';
  /** Reads a single `Episode` that is related to this `EpisodesTrailer`. */
  episode?: Maybe<Episode>;
  episodeId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/**
 * A condition to be used against `EpisodesTrailer` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type EpisodesTrailerCondition = {
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `EpisodesTrailer` object types. All fields are combined with a logical ‘and.’ */
export type EpisodesTrailerFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodesTrailerFilter>>;
  /** Filter by the object’s `episode` relation. */
  episode?: InputMaybe<EpisodeFilter>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodesTrailerFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodesTrailerFilter>>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `EpisodesTrailer` */
export type EpisodesTrailerInput = {
  episodeId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/**
 * A connection to a list of `EpisodesTrailer` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type EpisodesTrailersConnection = {
  __typename?: 'EpisodesTrailersConnection';
  /** A list of edges which contains the `EpisodesTrailer` and cursor to aid in pagination. */
  edges: Array<EpisodesTrailersEdge>;
  /** A list of `EpisodesTrailer` objects. */
  nodes: Array<EpisodesTrailer>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodesTrailer` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EpisodesTrailer` edge in the connection. */
export type EpisodesTrailersEdge = {
  __typename?: 'EpisodesTrailersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EpisodesTrailer` at the end of the edge. */
  node: EpisodesTrailer;
};

/** Methods to use when ordering `EpisodesTrailer`. */
export enum EpisodesTrailersOrderBy {
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type EpisodesTvshowGenre = {
  __typename?: 'EpisodesTvshowGenre';
  /** Reads a single `Episode` that is related to this `EpisodesTvshowGenre`. */
  episode?: Maybe<Episode>;
  episodeId: Scalars['Int'];
  /** Reads a single `TvshowGenre` that is related to this `EpisodesTvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenre>;
  tvshowGenresId: Scalars['Int'];
};

/**
 * A condition to be used against `EpisodesTvshowGenre` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type EpisodesTvshowGenreCondition = {
  /** Checks for equality with the object’s `episodeId` field. */
  episodeId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `tvshowGenresId` field. */
  tvshowGenresId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `EpisodesTvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type EpisodesTvshowGenreFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EpisodesTvshowGenreFilter>>;
  /** Filter by the object’s `episode` relation. */
  episode?: InputMaybe<EpisodeFilter>;
  /** Filter by the object’s `episodeId` field. */
  episodeId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EpisodesTvshowGenreFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EpisodesTvshowGenreFilter>>;
  /** Filter by the object’s `tvshowGenres` relation. */
  tvshowGenres?: InputMaybe<TvshowGenreFilter>;
  /** Filter by the object’s `tvshowGenresId` field. */
  tvshowGenresId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `EpisodesTvshowGenre` */
export type EpisodesTvshowGenreInput = {
  episodeId: Scalars['Int'];
  tvshowGenresId: Scalars['Int'];
};

/**
 * A connection to a list of `EpisodesTvshowGenre` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type EpisodesTvshowGenresConnection = {
  __typename?: 'EpisodesTvshowGenresConnection';
  /** A list of edges which contains the `EpisodesTvshowGenre` and cursor to aid in pagination. */
  edges: Array<EpisodesTvshowGenresEdge>;
  /** A list of `EpisodesTvshowGenre` objects. */
  nodes: Array<EpisodesTvshowGenre>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EpisodesTvshowGenre` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `EpisodesTvshowGenre` edge in the connection. */
export type EpisodesTvshowGenresEdge = {
  __typename?: 'EpisodesTvshowGenresEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `EpisodesTvshowGenre` at the end of the edge. */
  node: EpisodesTvshowGenre;
};

/** Methods to use when ordering `EpisodesTvshowGenre`. */
export enum EpisodesTvshowGenresOrderBy {
  EpisodeIdAsc = 'EPISODE_ID_ASC',
  EpisodeIdDesc = 'EPISODE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowGenresIdAsc = 'TVSHOW_GENRES_ID_ASC',
  TvshowGenresIdDesc = 'TVSHOW_GENRES_ID_DESC'
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
  /** Attempt to create a media snapshot has failed. */
  CreateSnapshotError = 'CREATE_SNAPSHOT_ERROR',
  /** An authorization database error has occurred. The user might not have enough permissions. */
  DatabasePermissionsCheckFailed = 'DATABASE_PERMISSIONS_CHECK_FAILED',
  /** An expected and handled database constraint error has occurred. The actual message will have more information. */
  DatabaseValidationFailed = 'DATABASE_VALIDATION_FAILED',
  /** This is a wrapper error for the original unhandled error of unsupported type. */
  ErrorWrapper = 'ERROR_WRAPPER',
  /** A GraphQL validation error has occurred. Please make sure that the GraphQL request is made with correct syntax or parameters. */
  GraphqlValidationFailed = 'GRAPHQL_VALIDATION_FAILED',
  /** The Identity service is not accessible. Please contact Axinom support. */
  IdentityServiceNotAccessible = 'IDENTITY_SERVICE_NOT_ACCESSIBLE',
  /** An error has occurred during the ingest process. The actual message will have more information. */
  IngestError = 'INGEST_ERROR',
  /** Ingest Document validation has failed. */
  IngestValidationError = 'INGEST_VALIDATION_ERROR',
  /** An unhandled and unexpected error has occurred. Please contact the service support. */
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  /** Error occurred while trying to fetch signing keys from the JWKS endpoint for the Tenant/Environment/Application. */
  JwksError = 'JWKS_ERROR',
  /** Passed JWT is not a Mosaic End-User Token. Cannot be verified. */
  JwtIsNotMosaicToken = 'JWT_IS_NOT_MOSAIC_TOKEN',
  /** Malformed access token received */
  MalformedToken = 'MALFORMED_TOKEN',
  /** %s with ID '%s' was not found. */
  MediaNotFound = 'MEDIA_NOT_FOUND',
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
  /** The subject was provided, but it does not have enough permissions to perform the operation. */
  NotEnoughPermissions = 'NOT_ENOUGH_PERMISSIONS',
  /** The object is not a GenericAuthenticatedSubject */
  NotGenericAuthenticatedSubject = 'NOT_GENERIC_AUTHENTICATED_SUBJECT',
  /** The object is not a ManagementAuthenticationContext */
  NotManagementAuthenticationContext = 'NOT_MANAGEMENT_AUTHENTICATION_CONTEXT',
  /** Attempt to publish media has failed. */
  PublishError = 'PUBLISH_ERROR',
  /** Unable to retrieve images metadata. */
  PublishImagesMetadataRequestError = 'PUBLISH_IMAGES_METADATA_REQUEST_ERROR',
  /** Unable to retrieve videos metadata. */
  PublishVideosMetadataRequestError = 'PUBLISH_VIDEOS_METADATA_REQUEST_ERROR',
  /** Could not find a matching signing key to verify the access token. The signing key used to create the token may have been revoked or the Tenant/Environment/Application configuration is erroneous. */
  SigningKeyNotFound = 'SIGNING_KEY_NOT_FOUND',
  /** The snapshot with ID '%s' was not found. */
  SnapshotNotFound = 'SNAPSHOT_NOT_FOUND',
  /** An application startup error has occurred. The actual message will have more information. */
  StartupError = 'STARTUP_ERROR',
  /** An unhandled database-related has occurred. Please contact the service support. */
  UnhandledDatabaseError = 'UNHANDLED_DATABASE_ERROR',
  /** An unhandled error has occurred. Please contact the service support. */
  UnhandledError = 'UNHANDLED_ERROR',
  /** Attempt to unpublish media has failed. */
  UnpublishError = 'UNPUBLISH_ERROR',
  /** Unable to generate display title for ingest item. Ingest media type '%s' is not supported. */
  UnsupportedIngestMediaType = 'UNSUPPORTED_INGEST_MEDIA_TYPE',
  /** User is not authorized to access the operation. */
  UserNotAuthorized = 'USER_NOT_AUTHORIZED',
  /** The User service is not accessible. Please contact Axinom support. */
  UserServiceNotAccessible = 'USER_SERVICE_NOT_ACCESSIBLE'
}

/** A `String` edge in the connection. */
export type GetCollectionsTagsValueEdge = {
  __typename?: 'GetCollectionsTagsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetCollectionsTagsValuesConnection = {
  __typename?: 'GetCollectionsTagsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetCollectionsTagsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetEpisodesCastsValueEdge = {
  __typename?: 'GetEpisodesCastsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetEpisodesCastsValuesConnection = {
  __typename?: 'GetEpisodesCastsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetEpisodesCastsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetEpisodesProductionCountriesValueEdge = {
  __typename?: 'GetEpisodesProductionCountriesValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetEpisodesProductionCountriesValuesConnection = {
  __typename?: 'GetEpisodesProductionCountriesValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetEpisodesProductionCountriesValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetEpisodesTagsValueEdge = {
  __typename?: 'GetEpisodesTagsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetEpisodesTagsValuesConnection = {
  __typename?: 'GetEpisodesTagsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetEpisodesTagsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetMoviesCastsValueEdge = {
  __typename?: 'GetMoviesCastsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetMoviesCastsValuesConnection = {
  __typename?: 'GetMoviesCastsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetMoviesCastsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetMoviesProductionCountriesValueEdge = {
  __typename?: 'GetMoviesProductionCountriesValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetMoviesProductionCountriesValuesConnection = {
  __typename?: 'GetMoviesProductionCountriesValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetMoviesProductionCountriesValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetMoviesTagsValueEdge = {
  __typename?: 'GetMoviesTagsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetMoviesTagsValuesConnection = {
  __typename?: 'GetMoviesTagsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetMoviesTagsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetSeasonsCastsValueEdge = {
  __typename?: 'GetSeasonsCastsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetSeasonsCastsValuesConnection = {
  __typename?: 'GetSeasonsCastsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetSeasonsCastsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetSeasonsProductionCountriesValueEdge = {
  __typename?: 'GetSeasonsProductionCountriesValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetSeasonsProductionCountriesValuesConnection = {
  __typename?: 'GetSeasonsProductionCountriesValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetSeasonsProductionCountriesValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetSeasonsTagsValueEdge = {
  __typename?: 'GetSeasonsTagsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetSeasonsTagsValuesConnection = {
  __typename?: 'GetSeasonsTagsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetSeasonsTagsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetTvshowsCastsValueEdge = {
  __typename?: 'GetTvshowsCastsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetTvshowsCastsValuesConnection = {
  __typename?: 'GetTvshowsCastsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetTvshowsCastsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetTvshowsProductionCountriesValueEdge = {
  __typename?: 'GetTvshowsProductionCountriesValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetTvshowsProductionCountriesValuesConnection = {
  __typename?: 'GetTvshowsProductionCountriesValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetTvshowsProductionCountriesValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetTvshowsTagsValueEdge = {
  __typename?: 'GetTvshowsTagsValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type GetTvshowsTagsValuesConnection = {
  __typename?: 'GetTvshowsTagsValuesConnection';
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetTvshowsTagsValueEdge>;
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** @permissions: INGESTS_VIEW,INGESTS_EDIT,ADMIN */
export type IngestDocument = {
  __typename?: 'IngestDocument';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  document: Scalars['IngestDocumentObject'];
  documentCreated?: Maybe<Scalars['Datetime']>;
  errorCount: Scalars['Int'];
  errors: Array<Maybe<Scalars['JSON']>>;
  id: Scalars['Int'];
  inProgressCount: Scalars['Int'];
  /** Reads and enables pagination through a set of `IngestItem`. */
  ingestItems: IngestItemsConnection;
  itemsCount: Scalars['Int'];
  name: Scalars['String'];
  status: IngestStatus;
  successCount: Scalars['Int'];
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: INGESTS_VIEW,INGESTS_EDIT,ADMIN */
export type IngestDocumentIngestItemsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<IngestItemCondition>;
  filter?: InputMaybe<IngestItemFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<IngestItemsOrderBy>>;
};

/**
 * A condition to be used against `IngestDocument` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type IngestDocumentCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `document` field. */
  document?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Checks for equality with the object’s `documentCreated` field. */
  documentCreated?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `errorCount` field. */
  errorCount?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `errors` field. */
  errors?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `inProgressCount` field. */
  inProgressCount?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `itemsCount` field. */
  itemsCount?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<IngestStatus>;
  /** Checks for equality with the object’s `successCount` field. */
  successCount?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `title` field.
   * @maxLength(50)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `IngestDocument` object types. All fields are combined with a logical ‘and.’ */
export type IngestDocumentFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<IngestDocumentFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `document` field. */
  document?: InputMaybe<IngestDocumentObjectFilter>;
  /** Filter by the object’s `documentCreated` field. */
  documentCreated?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `errorCount` field. */
  errorCount?: InputMaybe<IntFilter>;
  /** Filter by the object’s `errors` field. */
  errors?: InputMaybe<JsonListFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `inProgressCount` field. */
  inProgressCount?: InputMaybe<IntFilter>;
  /** Filter by the object’s `ingestItems` relation. */
  ingestItems?: InputMaybe<IngestDocumentToManyIngestItemFilter>;
  /** Some related `ingestItems` exist. */
  ingestItemsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `itemsCount` field. */
  itemsCount?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<IngestDocumentFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<IngestDocumentFilter>>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<IngestStatusFilter>;
  /** Filter by the object’s `successCount` field. */
  successCount?: InputMaybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** A filter to be used against IngestDocumentObject fields. All fields are combined with a logical ‘and.’ */
export type IngestDocumentObjectFilter = {
  /** Contained by the specified JSON. */
  containedBy?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Contains the specified JSON. */
  contains?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: InputMaybe<Array<Scalars['String']>>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified key. */
  containsKey?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['IngestDocumentObject']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['IngestDocumentObject']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['IngestDocumentObject']>>;
};

/** Represents an update to a `IngestDocument`. Fields that are set will be updated. */
export type IngestDocumentPatch = {
  /**
   * @maxLength(50)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

export type IngestDocumentSubscriptionPayload = {
  __typename?: 'IngestDocumentSubscriptionPayload';
  event?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  ingestDocument?: Maybe<IngestDocument>;
};

/** A filter to be used against many `IngestItem` object types. All fields are combined with a logical ‘and.’ */
export type IngestDocumentToManyIngestItemFilter = {
  /** Every related `IngestItem` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<IngestItemFilter>;
  /** No related `IngestItem` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<IngestItemFilter>;
  /** Some related `IngestItem` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<IngestItemFilter>;
};

/**
 * A connection to a list of `IngestDocument` values.
 * @permissions: INGESTS_VIEW,INGESTS_EDIT,ADMIN
 */
export type IngestDocumentsConnection = {
  __typename?: 'IngestDocumentsConnection';
  /** A list of edges which contains the `IngestDocument` and cursor to aid in pagination. */
  edges: Array<IngestDocumentsEdge>;
  /** A list of `IngestDocument` objects. */
  nodes: Array<IngestDocument>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `IngestDocument` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `IngestDocument` edge in the connection. */
export type IngestDocumentsEdge = {
  __typename?: 'IngestDocumentsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `IngestDocument` at the end of the edge. */
  node: IngestDocument;
};

/** Methods to use when ordering `IngestDocument`. */
export enum IngestDocumentsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DocumentAsc = 'DOCUMENT_ASC',
  DocumentCreatedAsc = 'DOCUMENT_CREATED_ASC',
  DocumentCreatedDesc = 'DOCUMENT_CREATED_DESC',
  DocumentDesc = 'DOCUMENT_DESC',
  ErrorsAsc = 'ERRORS_ASC',
  ErrorsDesc = 'ERRORS_DESC',
  ErrorCountAsc = 'ERROR_COUNT_ASC',
  ErrorCountDesc = 'ERROR_COUNT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  InProgressCountAsc = 'IN_PROGRESS_COUNT_ASC',
  InProgressCountDesc = 'IN_PROGRESS_COUNT_DESC',
  ItemsCountAsc = 'ITEMS_COUNT_ASC',
  ItemsCountDesc = 'ITEMS_COUNT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  SuccessCountAsc = 'SUCCESS_COUNT_ASC',
  SuccessCountDesc = 'SUCCESS_COUNT_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

export enum IngestEntityExistsStatus {
  /** Created */
  Created = 'CREATED',
  /** Error */
  Error = 'ERROR',
  /** Existed */
  Existed = 'EXISTED'
}

/** A filter to be used against IngestEntityExistsStatus fields. All fields are combined with a logical ‘and.’ */
export type IngestEntityExistsStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<IngestEntityExistsStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<IngestEntityExistsStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<IngestEntityExistsStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<IngestEntityExistsStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<IngestEntityExistsStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<IngestEntityExistsStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<IngestEntityExistsStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<IngestEntityExistsStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<IngestEntityExistsStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<IngestEntityExistsStatus>>;
};

/** @permissions: INGESTS_VIEW,INGESTS_EDIT,ADMIN */
export type IngestItem = {
  __typename?: 'IngestItem';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  displayTitle: Scalars['String'];
  entityId: Scalars['Int'];
  errors: Array<Maybe<Scalars['JSON']>>;
  existsStatus: IngestEntityExistsStatus;
  externalId: Scalars['String'];
  id: Scalars['Int'];
  /** Reads a single `IngestDocument` that is related to this `IngestItem`. */
  ingestDocument?: Maybe<IngestDocument>;
  ingestDocumentId: Scalars['Int'];
  /** Reads and enables pagination through a set of `IngestItemStep`. */
  ingestItemSteps: IngestItemStepsConnection;
  item: Scalars['IngestItemObject'];
  processedTrailerIds: Array<Maybe<Scalars['UUID']>>;
  status: IngestItemStatus;
  type: IngestItemType;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: INGESTS_VIEW,INGESTS_EDIT,ADMIN */
export type IngestItemIngestItemStepsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<IngestItemStepCondition>;
  filter?: InputMaybe<IngestItemStepFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<IngestItemStepsOrderBy>>;
};

/**
 * A condition to be used against `IngestItem` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type IngestItemCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `displayTitle` field. */
  displayTitle?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `entityId` field. */
  entityId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `errors` field. */
  errors?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Checks for equality with the object’s `existsStatus` field. */
  existsStatus?: InputMaybe<IngestEntityExistsStatus>;
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `ingestDocumentId` field. */
  ingestDocumentId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `item` field. */
  item?: InputMaybe<Scalars['IngestItemObject']>;
  /** Checks for equality with the object’s `processedTrailerIds` field. */
  processedTrailerIds?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<IngestItemStatus>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<IngestItemType>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `IngestItem` object types. All fields are combined with a logical ‘and.’ */
export type IngestItemFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<IngestItemFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `displayTitle` field. */
  displayTitle?: InputMaybe<StringFilter>;
  /** Filter by the object’s `entityId` field. */
  entityId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `errors` field. */
  errors?: InputMaybe<JsonListFilter>;
  /** Filter by the object’s `existsStatus` field. */
  existsStatus?: InputMaybe<IngestEntityExistsStatusFilter>;
  /** Filter by the object’s `externalId` field. */
  externalId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `ingestDocument` relation. */
  ingestDocument?: InputMaybe<IngestDocumentFilter>;
  /** Filter by the object’s `ingestDocumentId` field. */
  ingestDocumentId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `ingestItemSteps` relation. */
  ingestItemSteps?: InputMaybe<IngestItemToManyIngestItemStepFilter>;
  /** Some related `ingestItemSteps` exist. */
  ingestItemStepsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `item` field. */
  item?: InputMaybe<IngestItemObjectFilter>;
  /** Negates the expression. */
  not?: InputMaybe<IngestItemFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<IngestItemFilter>>;
  /** Filter by the object’s `processedTrailerIds` field. */
  processedTrailerIds?: InputMaybe<UuidListFilter>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<IngestItemStatusFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<IngestItemTypeFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** A filter to be used against IngestItemObject fields. All fields are combined with a logical ‘and.’ */
export type IngestItemObjectFilter = {
  /** Contained by the specified JSON. */
  containedBy?: InputMaybe<Scalars['IngestItemObject']>;
  /** Contains the specified JSON. */
  contains?: InputMaybe<Scalars['IngestItemObject']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: InputMaybe<Array<Scalars['String']>>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified key. */
  containsKey?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['IngestItemObject']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['IngestItemObject']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['IngestItemObject']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['IngestItemObject']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['IngestItemObject']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['IngestItemObject']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['IngestItemObject']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['IngestItemObject']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['IngestItemObject']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['IngestItemObject']>>;
};

export enum IngestItemStatus {
  /** Error */
  Error = 'ERROR',
  /** In Progress */
  InProgress = 'IN_PROGRESS',
  /** Success */
  Success = 'SUCCESS'
}

/** A filter to be used against IngestItemStatus fields. All fields are combined with a logical ‘and.’ */
export type IngestItemStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<IngestItemStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<IngestItemStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<IngestItemStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<IngestItemStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<IngestItemStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<IngestItemStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<IngestItemStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<IngestItemStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<IngestItemStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<IngestItemStatus>>;
};

/** @permissions: INGESTS_VIEW,INGESTS_EDIT,ADMIN */
export type IngestItemStep = {
  __typename?: 'IngestItemStep';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  entityId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** Reads a single `IngestItem` that is related to this `IngestItemStep`. */
  ingestItem?: Maybe<IngestItem>;
  ingestItemId: Scalars['Int'];
  responseMessage?: Maybe<Scalars['String']>;
  status: IngestItemStepStatus;
  subType: Scalars['String'];
  type: IngestItemStepType;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};

/**
 * A condition to be used against `IngestItemStep` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type IngestItemStepCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `entityId` field. */
  entityId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `ingestItemId` field. */
  ingestItemId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `responseMessage` field. */
  responseMessage?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<IngestItemStepStatus>;
  /** Checks for equality with the object’s `subType` field. */
  subType?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<IngestItemStepType>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `IngestItemStep` object types. All fields are combined with a logical ‘and.’ */
export type IngestItemStepFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<IngestItemStepFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `entityId` field. */
  entityId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `ingestItem` relation. */
  ingestItem?: InputMaybe<IngestItemFilter>;
  /** Filter by the object’s `ingestItemId` field. */
  ingestItemId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<IngestItemStepFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<IngestItemStepFilter>>;
  /** Filter by the object’s `responseMessage` field. */
  responseMessage?: InputMaybe<StringFilter>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<IngestItemStepStatusFilter>;
  /** Filter by the object’s `subType` field. */
  subType?: InputMaybe<StringFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<IngestItemStepTypeFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

export enum IngestItemStepStatus {
  /** Error */
  Error = 'ERROR',
  /** In Progress */
  InProgress = 'IN_PROGRESS',
  /** Success */
  Success = 'SUCCESS'
}

/** A filter to be used against IngestItemStepStatus fields. All fields are combined with a logical ‘and.’ */
export type IngestItemStepStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<IngestItemStepStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<IngestItemStepStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<IngestItemStepStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<IngestItemStepStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<IngestItemStepStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<IngestItemStepStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<IngestItemStepStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<IngestItemStepStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<IngestItemStepStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<IngestItemStepStatus>>;
};

export enum IngestItemStepType {
  /** Entity */
  Entity = 'ENTITY',
  /** Image */
  Image = 'IMAGE',
  /** Video */
  Video = 'VIDEO'
}

/** A filter to be used against IngestItemStepType fields. All fields are combined with a logical ‘and.’ */
export type IngestItemStepTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<IngestItemStepType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<IngestItemStepType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<IngestItemStepType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<IngestItemStepType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<IngestItemStepType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<IngestItemStepType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<IngestItemStepType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<IngestItemStepType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<IngestItemStepType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<IngestItemStepType>>;
};

/**
 * A connection to a list of `IngestItemStep` values.
 * @permissions: INGESTS_VIEW,INGESTS_EDIT,ADMIN
 */
export type IngestItemStepsConnection = {
  __typename?: 'IngestItemStepsConnection';
  /** A list of edges which contains the `IngestItemStep` and cursor to aid in pagination. */
  edges: Array<IngestItemStepsEdge>;
  /** A list of `IngestItemStep` objects. */
  nodes: Array<IngestItemStep>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `IngestItemStep` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `IngestItemStep` edge in the connection. */
export type IngestItemStepsEdge = {
  __typename?: 'IngestItemStepsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `IngestItemStep` at the end of the edge. */
  node: IngestItemStep;
};

/** Methods to use when ordering `IngestItemStep`. */
export enum IngestItemStepsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  EntityIdAsc = 'ENTITY_ID_ASC',
  EntityIdDesc = 'ENTITY_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IngestItemIdAsc = 'INGEST_ITEM_ID_ASC',
  IngestItemIdDesc = 'INGEST_ITEM_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ResponseMessageAsc = 'RESPONSE_MESSAGE_ASC',
  ResponseMessageDesc = 'RESPONSE_MESSAGE_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  SubTypeAsc = 'SUB_TYPE_ASC',
  SubTypeDesc = 'SUB_TYPE_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** A filter to be used against many `IngestItemStep` object types. All fields are combined with a logical ‘and.’ */
export type IngestItemToManyIngestItemStepFilter = {
  /** Every related `IngestItemStep` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<IngestItemStepFilter>;
  /** No related `IngestItemStep` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<IngestItemStepFilter>;
  /** Some related `IngestItemStep` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<IngestItemStepFilter>;
};

export enum IngestItemType {
  /** Episode */
  Episode = 'EPISODE',
  /** Movie */
  Movie = 'MOVIE',
  /** Season */
  Season = 'SEASON',
  /** Tvshow */
  Tvshow = 'TVSHOW'
}

/** A filter to be used against IngestItemType fields. All fields are combined with a logical ‘and.’ */
export type IngestItemTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<IngestItemType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<IngestItemType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<IngestItemType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<IngestItemType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<IngestItemType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<IngestItemType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<IngestItemType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<IngestItemType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<IngestItemType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<IngestItemType>>;
};

/**
 * A connection to a list of `IngestItem` values.
 * @permissions: INGESTS_VIEW,INGESTS_EDIT,ADMIN
 */
export type IngestItemsConnection = {
  __typename?: 'IngestItemsConnection';
  /** A list of edges which contains the `IngestItem` and cursor to aid in pagination. */
  edges: Array<IngestItemsEdge>;
  /** A list of `IngestItem` objects. */
  nodes: Array<IngestItem>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `IngestItem` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `IngestItem` edge in the connection. */
export type IngestItemsEdge = {
  __typename?: 'IngestItemsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `IngestItem` at the end of the edge. */
  node: IngestItem;
};

/** Methods to use when ordering `IngestItem`. */
export enum IngestItemsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DisplayTitleAsc = 'DISPLAY_TITLE_ASC',
  DisplayTitleDesc = 'DISPLAY_TITLE_DESC',
  EntityIdAsc = 'ENTITY_ID_ASC',
  EntityIdDesc = 'ENTITY_ID_DESC',
  ErrorsAsc = 'ERRORS_ASC',
  ErrorsDesc = 'ERRORS_DESC',
  ExistsStatusAsc = 'EXISTS_STATUS_ASC',
  ExistsStatusDesc = 'EXISTS_STATUS_DESC',
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IngestDocumentIdAsc = 'INGEST_DOCUMENT_ID_ASC',
  IngestDocumentIdDesc = 'INGEST_DOCUMENT_ID_DESC',
  ItemAsc = 'ITEM_ASC',
  ItemDesc = 'ITEM_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProcessedTrailerIdsAsc = 'PROCESSED_TRAILER_IDS_ASC',
  ProcessedTrailerIdsDesc = 'PROCESSED_TRAILER_IDS_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

export enum IngestStatus {
  /** Error */
  Error = 'ERROR',
  /** In Progress */
  InProgress = 'IN_PROGRESS',
  /** Partial Success */
  PartialSuccess = 'PARTIAL_SUCCESS',
  /** Success */
  Success = 'SUCCESS'
}

/** A filter to be used against IngestStatus fields. All fields are combined with a logical ‘and.’ */
export type IngestStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<IngestStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<IngestStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<IngestStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<IngestStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<IngestStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<IngestStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<IngestStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<IngestStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<IngestStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<IngestStatus>>;
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

export enum IsoAlphaTwoCountryCodes {
  Ad = 'AD',
  Ae = 'AE',
  Af = 'AF',
  Ag = 'AG',
  Ai = 'AI',
  Al = 'AL',
  Am = 'AM',
  Ao = 'AO',
  Aq = 'AQ',
  Ar = 'AR',
  As = 'AS',
  At = 'AT',
  Au = 'AU',
  Aw = 'AW',
  Ax = 'AX',
  Az = 'AZ',
  Ba = 'BA',
  Bb = 'BB',
  Bd = 'BD',
  Be = 'BE',
  Bf = 'BF',
  Bg = 'BG',
  Bh = 'BH',
  Bi = 'BI',
  Bj = 'BJ',
  Bl = 'BL',
  Bm = 'BM',
  Bn = 'BN',
  Bo = 'BO',
  Bq = 'BQ',
  Br = 'BR',
  Bs = 'BS',
  Bt = 'BT',
  Bv = 'BV',
  Bw = 'BW',
  By = 'BY',
  Bz = 'BZ',
  Ca = 'CA',
  Cc = 'CC',
  Cd = 'CD',
  Cf = 'CF',
  Cg = 'CG',
  Ch = 'CH',
  Ci = 'CI',
  Ck = 'CK',
  Cl = 'CL',
  Cm = 'CM',
  Cn = 'CN',
  Co = 'CO',
  Cr = 'CR',
  Cu = 'CU',
  Cv = 'CV',
  Cw = 'CW',
  Cx = 'CX',
  Cy = 'CY',
  Cz = 'CZ',
  De = 'DE',
  Dj = 'DJ',
  Dk = 'DK',
  Dm = 'DM',
  Do = 'DO',
  Dz = 'DZ',
  Ec = 'EC',
  Ee = 'EE',
  Eg = 'EG',
  Eh = 'EH',
  Er = 'ER',
  Es = 'ES',
  Et = 'ET',
  Fi = 'FI',
  Fj = 'FJ',
  Fk = 'FK',
  Fm = 'FM',
  Fo = 'FO',
  Fr = 'FR',
  Ga = 'GA',
  Gb = 'GB',
  Gd = 'GD',
  Ge = 'GE',
  Gf = 'GF',
  Gg = 'GG',
  Gh = 'GH',
  Gi = 'GI',
  Gl = 'GL',
  Gm = 'GM',
  Gn = 'GN',
  Gp = 'GP',
  Gq = 'GQ',
  Gr = 'GR',
  Gs = 'GS',
  Gt = 'GT',
  Gu = 'GU',
  Gw = 'GW',
  Gy = 'GY',
  Hk = 'HK',
  Hm = 'HM',
  Hn = 'HN',
  Hr = 'HR',
  Ht = 'HT',
  Hu = 'HU',
  Id = 'ID',
  Ie = 'IE',
  Il = 'IL',
  Im = 'IM',
  In = 'IN',
  Io = 'IO',
  Iq = 'IQ',
  Ir = 'IR',
  Is = 'IS',
  It = 'IT',
  Je = 'JE',
  Jm = 'JM',
  Jo = 'JO',
  Jp = 'JP',
  Ke = 'KE',
  Kg = 'KG',
  Kh = 'KH',
  Ki = 'KI',
  Km = 'KM',
  Kn = 'KN',
  Kp = 'KP',
  Kr = 'KR',
  Kw = 'KW',
  Ky = 'KY',
  Kz = 'KZ',
  La = 'LA',
  Lb = 'LB',
  Lc = 'LC',
  Li = 'LI',
  Lk = 'LK',
  Lr = 'LR',
  Ls = 'LS',
  Lt = 'LT',
  Lu = 'LU',
  Lv = 'LV',
  Ly = 'LY',
  Ma = 'MA',
  Mc = 'MC',
  Md = 'MD',
  Me = 'ME',
  Mf = 'MF',
  Mg = 'MG',
  Mh = 'MH',
  Mk = 'MK',
  Ml = 'ML',
  Mm = 'MM',
  Mn = 'MN',
  Mo = 'MO',
  Mp = 'MP',
  Mq = 'MQ',
  Mr = 'MR',
  Ms = 'MS',
  Mt = 'MT',
  Mu = 'MU',
  Mv = 'MV',
  Mw = 'MW',
  Mx = 'MX',
  My = 'MY',
  Mz = 'MZ',
  Na = 'NA',
  Nc = 'NC',
  Ne = 'NE',
  Nf = 'NF',
  Ng = 'NG',
  Ni = 'NI',
  Nl = 'NL',
  No = 'NO',
  Np = 'NP',
  Nr = 'NR',
  Nu = 'NU',
  Nz = 'NZ',
  Om = 'OM',
  Pa = 'PA',
  Pe = 'PE',
  Pf = 'PF',
  Pg = 'PG',
  Ph = 'PH',
  Pk = 'PK',
  Pl = 'PL',
  Pm = 'PM',
  Pn = 'PN',
  Pr = 'PR',
  Ps = 'PS',
  Pt = 'PT',
  Pw = 'PW',
  Py = 'PY',
  Qa = 'QA',
  Re = 'RE',
  Ro = 'RO',
  Rs = 'RS',
  Ru = 'RU',
  Rw = 'RW',
  Sa = 'SA',
  Sb = 'SB',
  Sc = 'SC',
  Sd = 'SD',
  Se = 'SE',
  Sg = 'SG',
  Sh = 'SH',
  Si = 'SI',
  Sj = 'SJ',
  Sk = 'SK',
  Sl = 'SL',
  Sm = 'SM',
  Sn = 'SN',
  So = 'SO',
  Sr = 'SR',
  Ss = 'SS',
  St = 'ST',
  Sv = 'SV',
  Sx = 'SX',
  Sy = 'SY',
  Sz = 'SZ',
  Tc = 'TC',
  Td = 'TD',
  Tf = 'TF',
  Tg = 'TG',
  Th = 'TH',
  Tj = 'TJ',
  Tk = 'TK',
  Tl = 'TL',
  Tm = 'TM',
  Tn = 'TN',
  To = 'TO',
  Tr = 'TR',
  Tt = 'TT',
  Tv = 'TV',
  Tw = 'TW',
  Tz = 'TZ',
  Ua = 'UA',
  Ug = 'UG',
  Um = 'UM',
  Us = 'US',
  Uy = 'UY',
  Uz = 'UZ',
  Va = 'VA',
  Vc = 'VC',
  Ve = 'VE',
  Vg = 'VG',
  Vi = 'VI',
  Vn = 'VN',
  Vu = 'VU',
  Wf = 'WF',
  Ws = 'WS',
  Ye = 'YE',
  Yt = 'YT',
  Za = 'ZA',
  Zm = 'ZM',
  Zw = 'ZW'
}

/** A filter to be used against IsoAlphaTwoCountryCodes fields. All fields are combined with a logical ‘and.’ */
export type IsoAlphaTwoCountryCodesFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<IsoAlphaTwoCountryCodes>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<IsoAlphaTwoCountryCodes>>;
};

/** A filter to be used against JSON List fields. All fields are combined with a logical ‘and.’ */
export type JsonListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['JSON']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['JSON']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['JSON']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['JSON']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['JSON']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['JSON']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>;
};

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type Movie = {
  __typename?: 'Movie';
  /** Reads and enables pagination through a set of `CollectionRelation`. */
  collectionRelations: CollectionRelationsConnection;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  externalId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  mainVideoId?: Maybe<Scalars['UUID']>;
  /** Reads and enables pagination through a set of `MoviesCast`. */
  moviesCasts: MoviesCastsConnection;
  /** Reads and enables pagination through a set of `MoviesImage`. */
  moviesImages: MoviesImagesConnection;
  /** Reads and enables pagination through a set of `MoviesLicense`. */
  moviesLicenses: MoviesLicensesConnection;
  /** Reads and enables pagination through a set of `MoviesMovieGenre`. */
  moviesMovieGenres: MoviesMovieGenresConnection;
  /** Reads and enables pagination through a set of `MoviesProductionCountry`. */
  moviesProductionCountries: MoviesProductionCountriesConnection;
  /** Reads and enables pagination through a set of `MoviesSnapshot`. */
  moviesSnapshots: MoviesSnapshotsConnection;
  /** Reads and enables pagination through a set of `MoviesTag`. */
  moviesTags: MoviesTagsConnection;
  /** Reads and enables pagination through a set of `MoviesTrailer`. */
  moviesTrailers: MoviesTrailersConnection;
  originalTitle?: Maybe<Scalars['String']>;
  publishStatus: PublishStatus;
  publishedDate?: Maybe<Scalars['Datetime']>;
  publishedUser?: Maybe<Scalars['String']>;
  released?: Maybe<Scalars['Date']>;
  studio?: Maybe<Scalars['String']>;
  synopsis?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MovieCollectionRelationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionRelationCondition>;
  filter?: InputMaybe<CollectionRelationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionRelationsOrderBy>>;
};


/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MovieMoviesCastsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesCastCondition>;
  filter?: InputMaybe<MoviesCastFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesCastsOrderBy>>;
};


/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MovieMoviesImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesImageCondition>;
  filter?: InputMaybe<MoviesImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesImagesOrderBy>>;
};


/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MovieMoviesLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesLicenseCondition>;
  filter?: InputMaybe<MoviesLicenseFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesLicensesOrderBy>>;
};


/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MovieMoviesMovieGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesMovieGenreCondition>;
  filter?: InputMaybe<MoviesMovieGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesMovieGenresOrderBy>>;
};


/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MovieMoviesProductionCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesProductionCountryCondition>;
  filter?: InputMaybe<MoviesProductionCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesProductionCountriesOrderBy>>;
};


/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MovieMoviesSnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesSnapshotCondition>;
  filter?: InputMaybe<MoviesSnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesSnapshotsOrderBy>>;
};


/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MovieMoviesTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesTagCondition>;
  filter?: InputMaybe<MoviesTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesTagsOrderBy>>;
};


/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MovieMoviesTrailersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesTrailerCondition>;
  filter?: InputMaybe<MoviesTrailerFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesTrailersOrderBy>>;
};

/** A condition to be used against `Movie` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MovieCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `mainVideoId` field. */
  mainVideoId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `originalTitle` field. */
  originalTitle?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `publishStatus` field. */
  publishStatus?: InputMaybe<PublishStatus>;
  /** Checks for equality with the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `released` field. */
  released?: InputMaybe<Scalars['Date']>;
  /** Checks for equality with the object’s `studio` field. */
  studio?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `synopsis` field. */
  synopsis?: InputMaybe<Scalars['String']>;
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
};

/** A filter to be used against `Movie` object types. All fields are combined with a logical ‘and.’ */
export type MovieFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MovieFilter>>;
  /** Filter by the object’s `collectionRelations` relation. */
  collectionRelations?: InputMaybe<MovieToManyCollectionRelationFilter>;
  /** Some related `collectionRelations` exist. */
  collectionRelationsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalId` field. */
  externalId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `mainVideoId` field. */
  mainVideoId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `moviesCasts` relation. */
  moviesCasts?: InputMaybe<MovieToManyMoviesCastFilter>;
  /** Some related `moviesCasts` exist. */
  moviesCastsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `moviesImages` relation. */
  moviesImages?: InputMaybe<MovieToManyMoviesImageFilter>;
  /** Some related `moviesImages` exist. */
  moviesImagesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `moviesLicenses` relation. */
  moviesLicenses?: InputMaybe<MovieToManyMoviesLicenseFilter>;
  /** Some related `moviesLicenses` exist. */
  moviesLicensesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `moviesMovieGenres` relation. */
  moviesMovieGenres?: InputMaybe<MovieToManyMoviesMovieGenreFilter>;
  /** Some related `moviesMovieGenres` exist. */
  moviesMovieGenresExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `moviesProductionCountries` relation. */
  moviesProductionCountries?: InputMaybe<MovieToManyMoviesProductionCountryFilter>;
  /** Some related `moviesProductionCountries` exist. */
  moviesProductionCountriesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `moviesSnapshots` relation. */
  moviesSnapshots?: InputMaybe<MovieToManyMoviesSnapshotFilter>;
  /** Some related `moviesSnapshots` exist. */
  moviesSnapshotsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `moviesTags` relation. */
  moviesTags?: InputMaybe<MovieToManyMoviesTagFilter>;
  /** Some related `moviesTags` exist. */
  moviesTagsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `moviesTrailers` relation. */
  moviesTrailers?: InputMaybe<MovieToManyMoviesTrailerFilter>;
  /** Some related `moviesTrailers` exist. */
  moviesTrailersExist?: InputMaybe<Scalars['Boolean']>;
  /** Negates the expression. */
  not?: InputMaybe<MovieFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MovieFilter>>;
  /** Filter by the object’s `originalTitle` field. */
  originalTitle?: InputMaybe<StringFilter>;
  /** Filter by the object’s `publishStatus` field. */
  publishStatus?: InputMaybe<PublishStatusFilter>;
  /** Filter by the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `released` field. */
  released?: InputMaybe<DateFilter>;
  /** Filter by the object’s `studio` field. */
  studio?: InputMaybe<StringFilter>;
  /** Filter by the object’s `synopsis` field. */
  synopsis?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type MovieGenre = {
  __typename?: 'MovieGenre';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  id: Scalars['Int'];
  /** Reads and enables pagination through a set of `MoviesMovieGenre`. */
  moviesMovieGenresByMovieGenresId: MoviesMovieGenresConnection;
  sortOrder: Scalars['Int'];
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type MovieGenreMoviesMovieGenresByMovieGenresIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesMovieGenreCondition>;
  filter?: InputMaybe<MoviesMovieGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesMovieGenresOrderBy>>;
};

/**
 * A condition to be used against `MovieGenre` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type MovieGenreCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `sortOrder` field. */
  sortOrder?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `title` field.
   * @isTrimmed()
   * @maxLength(50)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `MovieGenre` object types. All fields are combined with a logical ‘and.’ */
export type MovieGenreFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MovieGenreFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `moviesMovieGenresByMovieGenresId` relation. */
  moviesMovieGenresByMovieGenresId?: InputMaybe<MovieGenreToManyMoviesMovieGenreFilter>;
  /** Some related `moviesMovieGenresByMovieGenresId` exist. */
  moviesMovieGenresByMovieGenresIdExist?: InputMaybe<Scalars['Boolean']>;
  /** Negates the expression. */
  not?: InputMaybe<MovieGenreFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MovieGenreFilter>>;
  /** Filter by the object’s `sortOrder` field. */
  sortOrder?: InputMaybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `MovieGenre` */
export type MovieGenreInput = {
  sortOrder: Scalars['Int'];
  /**
   * @isTrimmed()
   * @maxLength(50)
   * @notEmpty()
   */
  title: Scalars['String'];
};

/** Represents an update to a `MovieGenre`. Fields that are set will be updated. */
export type MovieGenrePatch = {
  sortOrder?: InputMaybe<Scalars['Int']>;
  /**
   * @isTrimmed()
   * @maxLength(50)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

export type MovieGenreSubscriptionPayload = {
  __typename?: 'MovieGenreSubscriptionPayload';
  event?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  movieGenre?: Maybe<MovieGenre>;
};

/** A filter to be used against many `MoviesMovieGenre` object types. All fields are combined with a logical ‘and.’ */
export type MovieGenreToManyMoviesMovieGenreFilter = {
  /** Every related `MoviesMovieGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesMovieGenreFilter>;
  /** No related `MoviesMovieGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesMovieGenreFilter>;
  /** Some related `MoviesMovieGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesMovieGenreFilter>;
};

/**
 * A connection to a list of `MovieGenre` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN
 */
export type MovieGenresConnection = {
  __typename?: 'MovieGenresConnection';
  /** A list of edges which contains the `MovieGenre` and cursor to aid in pagination. */
  edges: Array<MovieGenresEdge>;
  /** A list of `MovieGenre` objects. */
  nodes: Array<MovieGenre>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MovieGenre` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `MovieGenre` edge in the connection. */
export type MovieGenresEdge = {
  __typename?: 'MovieGenresEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `MovieGenre` at the end of the edge. */
  node: MovieGenre;
};

/** Methods to use when ordering `MovieGenre`. */
export enum MovieGenresOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SortOrderAsc = 'SORT_ORDER_ASC',
  SortOrderDesc = 'SORT_ORDER_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

export enum MovieImageType {
  /** Cover */
  Cover = 'COVER',
  /** Teaser */
  Teaser = 'TEASER'
}

/** A filter to be used against MovieImageType fields. All fields are combined with a logical ‘and.’ */
export type MovieImageTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<MovieImageType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<MovieImageType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<MovieImageType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<MovieImageType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<MovieImageType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<MovieImageType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<MovieImageType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<MovieImageType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<MovieImageType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<MovieImageType>>;
};

/** An input for mutations affecting `Movie` */
export type MovieInput = {
  description?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  mainVideoId?: InputMaybe<Scalars['UUID']>;
  originalTitle?: InputMaybe<Scalars['String']>;
  released?: InputMaybe<Scalars['Date']>;
  studio?: InputMaybe<Scalars['String']>;
  synopsis?: InputMaybe<Scalars['String']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title: Scalars['String'];
};

/** Represents an update to a `Movie`. Fields that are set will be updated. */
export type MoviePatch = {
  description?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  mainVideoId?: InputMaybe<Scalars['UUID']>;
  originalTitle?: InputMaybe<Scalars['String']>;
  released?: InputMaybe<Scalars['Date']>;
  studio?: InputMaybe<Scalars['String']>;
  synopsis?: InputMaybe<Scalars['String']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

export type MovieSubscriptionPayload = {
  __typename?: 'MovieSubscriptionPayload';
  event?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  movie?: Maybe<Movie>;
};

/** A filter to be used against many `CollectionRelation` object types. All fields are combined with a logical ‘and.’ */
export type MovieToManyCollectionRelationFilter = {
  /** Every related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CollectionRelationFilter>;
  /** No related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CollectionRelationFilter>;
  /** Some related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CollectionRelationFilter>;
};

/** A filter to be used against many `MoviesCast` object types. All fields are combined with a logical ‘and.’ */
export type MovieToManyMoviesCastFilter = {
  /** Every related `MoviesCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesCastFilter>;
  /** No related `MoviesCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesCastFilter>;
  /** Some related `MoviesCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesCastFilter>;
};

/** A filter to be used against many `MoviesImage` object types. All fields are combined with a logical ‘and.’ */
export type MovieToManyMoviesImageFilter = {
  /** Every related `MoviesImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesImageFilter>;
  /** No related `MoviesImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesImageFilter>;
  /** Some related `MoviesImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesImageFilter>;
};

/** A filter to be used against many `MoviesLicense` object types. All fields are combined with a logical ‘and.’ */
export type MovieToManyMoviesLicenseFilter = {
  /** Every related `MoviesLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesLicenseFilter>;
  /** No related `MoviesLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesLicenseFilter>;
  /** Some related `MoviesLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesLicenseFilter>;
};

/** A filter to be used against many `MoviesMovieGenre` object types. All fields are combined with a logical ‘and.’ */
export type MovieToManyMoviesMovieGenreFilter = {
  /** Every related `MoviesMovieGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesMovieGenreFilter>;
  /** No related `MoviesMovieGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesMovieGenreFilter>;
  /** Some related `MoviesMovieGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesMovieGenreFilter>;
};

/** A filter to be used against many `MoviesProductionCountry` object types. All fields are combined with a logical ‘and.’ */
export type MovieToManyMoviesProductionCountryFilter = {
  /** Every related `MoviesProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesProductionCountryFilter>;
  /** No related `MoviesProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesProductionCountryFilter>;
  /** Some related `MoviesProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesProductionCountryFilter>;
};

/** A filter to be used against many `MoviesSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type MovieToManyMoviesSnapshotFilter = {
  /** Every related `MoviesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesSnapshotFilter>;
  /** No related `MoviesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesSnapshotFilter>;
  /** Some related `MoviesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesSnapshotFilter>;
};

/** A filter to be used against many `MoviesTag` object types. All fields are combined with a logical ‘and.’ */
export type MovieToManyMoviesTagFilter = {
  /** Every related `MoviesTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesTagFilter>;
  /** No related `MoviesTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesTagFilter>;
  /** Some related `MoviesTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesTagFilter>;
};

/** A filter to be used against many `MoviesTrailer` object types. All fields are combined with a logical ‘and.’ */
export type MovieToManyMoviesTrailerFilter = {
  /** Every related `MoviesTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesTrailerFilter>;
  /** No related `MoviesTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesTrailerFilter>;
  /** Some related `MoviesTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesTrailerFilter>;
};

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MoviesCast = {
  __typename?: 'MoviesCast';
  /** Reads a single `Movie` that is related to this `MoviesCast`. */
  movie?: Maybe<Movie>;
  movieId: Scalars['Int'];
  name: Scalars['String'];
};

/**
 * A condition to be used against `MoviesCast` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type MoviesCastCondition = {
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `MoviesCast` object types. All fields are combined with a logical ‘and.’ */
export type MoviesCastFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MoviesCastFilter>>;
  /** Filter by the object’s `movie` relation. */
  movie?: InputMaybe<MovieFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MoviesCastFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MoviesCastFilter>>;
};

/** An input for mutations affecting `MoviesCast` */
export type MoviesCastInput = {
  movieId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** Represents an update to a `MoviesCast`. Fields that are set will be updated. */
export type MoviesCastPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `MoviesCast` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN
 */
export type MoviesCastsConnection = {
  __typename?: 'MoviesCastsConnection';
  /** A list of edges which contains the `MoviesCast` and cursor to aid in pagination. */
  edges: Array<MoviesCastsEdge>;
  /** A list of `MoviesCast` objects. */
  nodes: Array<MoviesCast>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MoviesCast` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `MoviesCast` edge in the connection. */
export type MoviesCastsEdge = {
  __typename?: 'MoviesCastsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `MoviesCast` at the end of the edge. */
  node: MoviesCast;
};

/** Methods to use when ordering `MoviesCast`. */
export enum MoviesCastsOrderBy {
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A connection to a list of `Movie` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN
 */
export type MoviesConnection = {
  __typename?: 'MoviesConnection';
  /** A list of edges which contains the `Movie` and cursor to aid in pagination. */
  edges: Array<MoviesEdge>;
  /** A list of `Movie` objects. */
  nodes: Array<Movie>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Movie` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Movie` edge in the connection. */
export type MoviesEdge = {
  __typename?: 'MoviesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Movie` at the end of the edge. */
  node: Movie;
};

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MoviesImage = {
  __typename?: 'MoviesImage';
  imageId: Scalars['UUID'];
  imageType: MovieImageType;
  /** Reads a single `Movie` that is related to this `MoviesImage`. */
  movie?: Maybe<Movie>;
  movieId: Scalars['Int'];
};

/**
 * A condition to be used against `MoviesImage` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type MoviesImageCondition = {
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `imageType` field. */
  imageType?: InputMaybe<MovieImageType>;
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `MoviesImage` object types. All fields are combined with a logical ‘and.’ */
export type MoviesImageFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MoviesImageFilter>>;
  /** Filter by the object’s `imageId` field. */
  imageId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `imageType` field. */
  imageType?: InputMaybe<MovieImageTypeFilter>;
  /** Filter by the object’s `movie` relation. */
  movie?: InputMaybe<MovieFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MoviesImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MoviesImageFilter>>;
};

/** An input for mutations affecting `MoviesImage` */
export type MoviesImageInput = {
  imageId: Scalars['UUID'];
  imageType: MovieImageType;
  movieId: Scalars['Int'];
};

/** Represents an update to a `MoviesImage`. Fields that are set will be updated. */
export type MoviesImagePatch = {
  imageId?: InputMaybe<Scalars['UUID']>;
  imageType?: InputMaybe<MovieImageType>;
  movieId?: InputMaybe<Scalars['Int']>;
};

/**
 * A connection to a list of `MoviesImage` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN
 */
export type MoviesImagesConnection = {
  __typename?: 'MoviesImagesConnection';
  /** A list of edges which contains the `MoviesImage` and cursor to aid in pagination. */
  edges: Array<MoviesImagesEdge>;
  /** A list of `MoviesImage` objects. */
  nodes: Array<MoviesImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MoviesImage` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `MoviesImage` edge in the connection. */
export type MoviesImagesEdge = {
  __typename?: 'MoviesImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `MoviesImage` at the end of the edge. */
  node: MoviesImage;
};

/** Methods to use when ordering `MoviesImage`. */
export enum MoviesImagesOrderBy {
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  ImageTypeAsc = 'IMAGE_TYPE_ASC',
  ImageTypeDesc = 'IMAGE_TYPE_DESC',
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MoviesLicense = {
  __typename?: 'MoviesLicense';
  createdDate: Scalars['Datetime'];
  id: Scalars['Int'];
  licenseEnd?: Maybe<Scalars['Datetime']>;
  licenseStart?: Maybe<Scalars['Datetime']>;
  /** Reads a single `Movie` that is related to this `MoviesLicense`. */
  movie?: Maybe<Movie>;
  movieId: Scalars['Int'];
  /** Reads and enables pagination through a set of `MoviesLicensesCountry`. */
  moviesLicensesCountries: MoviesLicensesCountriesConnection;
  updatedDate: Scalars['Datetime'];
};


/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MoviesLicenseMoviesLicensesCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesLicensesCountryCondition>;
  filter?: InputMaybe<MoviesLicensesCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesLicensesCountriesOrderBy>>;
};

/**
 * A condition to be used against `MoviesLicense` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type MoviesLicenseCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `licenseEnd` field. */
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `licenseStart` field. */
  licenseStart?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
};

/** A filter to be used against `MoviesLicense` object types. All fields are combined with a logical ‘and.’ */
export type MoviesLicenseFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MoviesLicenseFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `licenseEnd` field. */
  licenseEnd?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `licenseStart` field. */
  licenseStart?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `movie` relation. */
  movie?: InputMaybe<MovieFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `moviesLicensesCountries` relation. */
  moviesLicensesCountries?: InputMaybe<MoviesLicenseToManyMoviesLicensesCountryFilter>;
  /** Some related `moviesLicensesCountries` exist. */
  moviesLicensesCountriesExist?: InputMaybe<Scalars['Boolean']>;
  /** Negates the expression. */
  not?: InputMaybe<MoviesLicenseFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MoviesLicenseFilter>>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
};

/** An input for mutations affecting `MoviesLicense` */
export type MoviesLicenseInput = {
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  licenseStart?: InputMaybe<Scalars['Datetime']>;
  movieId: Scalars['Int'];
};

/** Represents an update to a `MoviesLicense`. Fields that are set will be updated. */
export type MoviesLicensePatch = {
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  licenseStart?: InputMaybe<Scalars['Datetime']>;
  movieId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against many `MoviesLicensesCountry` object types. All fields are combined with a logical ‘and.’ */
export type MoviesLicenseToManyMoviesLicensesCountryFilter = {
  /** Every related `MoviesLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesLicensesCountryFilter>;
  /** No related `MoviesLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesLicensesCountryFilter>;
  /** Some related `MoviesLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesLicensesCountryFilter>;
};

/**
 * A connection to a list of `MoviesLicense` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN
 */
export type MoviesLicensesConnection = {
  __typename?: 'MoviesLicensesConnection';
  /** A list of edges which contains the `MoviesLicense` and cursor to aid in pagination. */
  edges: Array<MoviesLicensesEdge>;
  /** A list of `MoviesLicense` objects. */
  nodes: Array<MoviesLicense>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MoviesLicense` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/**
 * A connection to a list of `MoviesLicensesCountry` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN
 */
export type MoviesLicensesCountriesConnection = {
  __typename?: 'MoviesLicensesCountriesConnection';
  /** A list of edges which contains the `MoviesLicensesCountry` and cursor to aid in pagination. */
  edges: Array<MoviesLicensesCountriesEdge>;
  /** A list of `MoviesLicensesCountry` objects. */
  nodes: Array<MoviesLicensesCountry>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MoviesLicensesCountry` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `MoviesLicensesCountry` edge in the connection. */
export type MoviesLicensesCountriesEdge = {
  __typename?: 'MoviesLicensesCountriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `MoviesLicensesCountry` at the end of the edge. */
  node: MoviesLicensesCountry;
};

/** Methods to use when ordering `MoviesLicensesCountry`. */
export enum MoviesLicensesCountriesOrderBy {
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  MoviesLicenseIdAsc = 'MOVIES_LICENSE_ID_ASC',
  MoviesLicenseIdDesc = 'MOVIES_LICENSE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MoviesLicensesCountry = {
  __typename?: 'MoviesLicensesCountry';
  code: IsoAlphaTwoCountryCodes;
  /** Reads a single `MoviesLicense` that is related to this `MoviesLicensesCountry`. */
  moviesLicense?: Maybe<MoviesLicense>;
  moviesLicenseId: Scalars['Int'];
};

/**
 * A condition to be used against `MoviesLicensesCountry` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type MoviesLicensesCountryCondition = {
  /** Checks for equality with the object’s `code` field. */
  code?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Checks for equality with the object’s `moviesLicenseId` field. */
  moviesLicenseId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `MoviesLicensesCountry` object types. All fields are combined with a logical ‘and.’ */
export type MoviesLicensesCountryFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MoviesLicensesCountryFilter>>;
  /** Filter by the object’s `code` field. */
  code?: InputMaybe<IsoAlphaTwoCountryCodesFilter>;
  /** Filter by the object’s `moviesLicense` relation. */
  moviesLicense?: InputMaybe<MoviesLicenseFilter>;
  /** Filter by the object’s `moviesLicenseId` field. */
  moviesLicenseId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MoviesLicensesCountryFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MoviesLicensesCountryFilter>>;
};

/** An input for mutations affecting `MoviesLicensesCountry` */
export type MoviesLicensesCountryInput = {
  code: IsoAlphaTwoCountryCodes;
  moviesLicenseId: Scalars['Int'];
};

/** Represents an update to a `MoviesLicensesCountry`. Fields that are set will be updated. */
export type MoviesLicensesCountryPatch = {
  code?: InputMaybe<IsoAlphaTwoCountryCodes>;
};

/** A `MoviesLicense` edge in the connection. */
export type MoviesLicensesEdge = {
  __typename?: 'MoviesLicensesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `MoviesLicense` at the end of the edge. */
  node: MoviesLicense;
};

/** Methods to use when ordering `MoviesLicense`. */
export enum MoviesLicensesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LicenseEndAsc = 'LICENSE_END_ASC',
  LicenseEndDesc = 'LICENSE_END_DESC',
  LicenseStartAsc = 'LICENSE_START_ASC',
  LicenseStartDesc = 'LICENSE_START_DESC',
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC'
}

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MoviesMovieGenre = {
  __typename?: 'MoviesMovieGenre';
  /** Reads a single `Movie` that is related to this `MoviesMovieGenre`. */
  movie?: Maybe<Movie>;
  /** Reads a single `MovieGenre` that is related to this `MoviesMovieGenre`. */
  movieGenres?: Maybe<MovieGenre>;
  movieGenresId: Scalars['Int'];
  movieId: Scalars['Int'];
};

/**
 * A condition to be used against `MoviesMovieGenre` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type MoviesMovieGenreCondition = {
  /** Checks for equality with the object’s `movieGenresId` field. */
  movieGenresId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `MoviesMovieGenre` object types. All fields are combined with a logical ‘and.’ */
export type MoviesMovieGenreFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MoviesMovieGenreFilter>>;
  /** Filter by the object’s `movie` relation. */
  movie?: InputMaybe<MovieFilter>;
  /** Filter by the object’s `movieGenres` relation. */
  movieGenres?: InputMaybe<MovieGenreFilter>;
  /** Filter by the object’s `movieGenresId` field. */
  movieGenresId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MoviesMovieGenreFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MoviesMovieGenreFilter>>;
};

/** An input for mutations affecting `MoviesMovieGenre` */
export type MoviesMovieGenreInput = {
  movieGenresId: Scalars['Int'];
  movieId: Scalars['Int'];
};

/**
 * A connection to a list of `MoviesMovieGenre` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN
 */
export type MoviesMovieGenresConnection = {
  __typename?: 'MoviesMovieGenresConnection';
  /** A list of edges which contains the `MoviesMovieGenre` and cursor to aid in pagination. */
  edges: Array<MoviesMovieGenresEdge>;
  /** A list of `MoviesMovieGenre` objects. */
  nodes: Array<MoviesMovieGenre>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MoviesMovieGenre` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `MoviesMovieGenre` edge in the connection. */
export type MoviesMovieGenresEdge = {
  __typename?: 'MoviesMovieGenresEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `MoviesMovieGenre` at the end of the edge. */
  node: MoviesMovieGenre;
};

/** Methods to use when ordering `MoviesMovieGenre`. */
export enum MoviesMovieGenresOrderBy {
  MovieGenresIdAsc = 'MOVIE_GENRES_ID_ASC',
  MovieGenresIdDesc = 'MOVIE_GENRES_ID_DESC',
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** Methods to use when ordering `Movie`. */
export enum MoviesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MainVideoIdAsc = 'MAIN_VIDEO_ID_ASC',
  MainVideoIdDesc = 'MAIN_VIDEO_ID_DESC',
  Natural = 'NATURAL',
  OriginalTitleAsc = 'ORIGINAL_TITLE_ASC',
  OriginalTitleDesc = 'ORIGINAL_TITLE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PublishedDateAsc = 'PUBLISHED_DATE_ASC',
  PublishedDateDesc = 'PUBLISHED_DATE_DESC',
  PublishedUserAsc = 'PUBLISHED_USER_ASC',
  PublishedUserDesc = 'PUBLISHED_USER_DESC',
  PublishStatusAsc = 'PUBLISH_STATUS_ASC',
  PublishStatusDesc = 'PUBLISH_STATUS_DESC',
  ReleasedAsc = 'RELEASED_ASC',
  ReleasedDesc = 'RELEASED_DESC',
  StudioAsc = 'STUDIO_ASC',
  StudioDesc = 'STUDIO_DESC',
  SynopsisAsc = 'SYNOPSIS_ASC',
  SynopsisDesc = 'SYNOPSIS_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/**
 * A connection to a list of `MoviesProductionCountry` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN
 */
export type MoviesProductionCountriesConnection = {
  __typename?: 'MoviesProductionCountriesConnection';
  /** A list of edges which contains the `MoviesProductionCountry` and cursor to aid in pagination. */
  edges: Array<MoviesProductionCountriesEdge>;
  /** A list of `MoviesProductionCountry` objects. */
  nodes: Array<MoviesProductionCountry>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MoviesProductionCountry` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `MoviesProductionCountry` edge in the connection. */
export type MoviesProductionCountriesEdge = {
  __typename?: 'MoviesProductionCountriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `MoviesProductionCountry` at the end of the edge. */
  node: MoviesProductionCountry;
};

/** Methods to use when ordering `MoviesProductionCountry`. */
export enum MoviesProductionCountriesOrderBy {
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MoviesProductionCountry = {
  __typename?: 'MoviesProductionCountry';
  /** Reads a single `Movie` that is related to this `MoviesProductionCountry`. */
  movie?: Maybe<Movie>;
  movieId: Scalars['Int'];
  name: Scalars['String'];
};

/**
 * A condition to be used against `MoviesProductionCountry` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type MoviesProductionCountryCondition = {
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `MoviesProductionCountry` object types. All fields are combined with a logical ‘and.’ */
export type MoviesProductionCountryFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MoviesProductionCountryFilter>>;
  /** Filter by the object’s `movie` relation. */
  movie?: InputMaybe<MovieFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MoviesProductionCountryFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MoviesProductionCountryFilter>>;
};

/** An input for mutations affecting `MoviesProductionCountry` */
export type MoviesProductionCountryInput = {
  movieId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** Represents an update to a `MoviesProductionCountry`. Fields that are set will be updated. */
export type MoviesProductionCountryPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MoviesSnapshot = {
  __typename?: 'MoviesSnapshot';
  /** Reads a single `Movie` that is related to this `MoviesSnapshot`. */
  movie?: Maybe<Movie>;
  movieId: Scalars['Int'];
  /** Reads a single `Snapshot` that is related to this `MoviesSnapshot`. */
  snapshot?: Maybe<Snapshot>;
  snapshotId: Scalars['Int'];
};

/**
 * A condition to be used against `MoviesSnapshot` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type MoviesSnapshotCondition = {
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `MoviesSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type MoviesSnapshotFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MoviesSnapshotFilter>>;
  /** Filter by the object’s `movie` relation. */
  movie?: InputMaybe<MovieFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MoviesSnapshotFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MoviesSnapshotFilter>>;
  /** Filter by the object’s `snapshot` relation. */
  snapshot?: InputMaybe<SnapshotFilter>;
  /** Filter by the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<IntFilter>;
};

/**
 * A connection to a list of `MoviesSnapshot` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN
 */
export type MoviesSnapshotsConnection = {
  __typename?: 'MoviesSnapshotsConnection';
  /** A list of edges which contains the `MoviesSnapshot` and cursor to aid in pagination. */
  edges: Array<MoviesSnapshotsEdge>;
  /** A list of `MoviesSnapshot` objects. */
  nodes: Array<MoviesSnapshot>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MoviesSnapshot` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `MoviesSnapshot` edge in the connection. */
export type MoviesSnapshotsEdge = {
  __typename?: 'MoviesSnapshotsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `MoviesSnapshot` at the end of the edge. */
  node: MoviesSnapshot;
};

/** Methods to use when ordering `MoviesSnapshot`. */
export enum MoviesSnapshotsOrderBy {
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SnapshotIdAsc = 'SNAPSHOT_ID_ASC',
  SnapshotIdDesc = 'SNAPSHOT_ID_DESC'
}

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MoviesTag = {
  __typename?: 'MoviesTag';
  /** Reads a single `Movie` that is related to this `MoviesTag`. */
  movie?: Maybe<Movie>;
  movieId: Scalars['Int'];
  name: Scalars['String'];
};

/**
 * A condition to be used against `MoviesTag` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type MoviesTagCondition = {
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `MoviesTag` object types. All fields are combined with a logical ‘and.’ */
export type MoviesTagFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MoviesTagFilter>>;
  /** Filter by the object’s `movie` relation. */
  movie?: InputMaybe<MovieFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MoviesTagFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MoviesTagFilter>>;
};

/** An input for mutations affecting `MoviesTag` */
export type MoviesTagInput = {
  movieId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
};

/** Represents an update to a `MoviesTag`. Fields that are set will be updated. */
export type MoviesTagPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `MoviesTag` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN
 */
export type MoviesTagsConnection = {
  __typename?: 'MoviesTagsConnection';
  /** A list of edges which contains the `MoviesTag` and cursor to aid in pagination. */
  edges: Array<MoviesTagsEdge>;
  /** A list of `MoviesTag` objects. */
  nodes: Array<MoviesTag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MoviesTag` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `MoviesTag` edge in the connection. */
export type MoviesTagsEdge = {
  __typename?: 'MoviesTagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `MoviesTag` at the end of the edge. */
  node: MoviesTag;
};

/** Methods to use when ordering `MoviesTag`. */
export enum MoviesTagsOrderBy {
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN */
export type MoviesTrailer = {
  __typename?: 'MoviesTrailer';
  /** Reads a single `Movie` that is related to this `MoviesTrailer`. */
  movie?: Maybe<Movie>;
  movieId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/**
 * A condition to be used against `MoviesTrailer` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type MoviesTrailerCondition = {
  /** Checks for equality with the object’s `movieId` field. */
  movieId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `MoviesTrailer` object types. All fields are combined with a logical ‘and.’ */
export type MoviesTrailerFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MoviesTrailerFilter>>;
  /** Filter by the object’s `movie` relation. */
  movie?: InputMaybe<MovieFilter>;
  /** Filter by the object’s `movieId` field. */
  movieId?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MoviesTrailerFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MoviesTrailerFilter>>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `MoviesTrailer` */
export type MoviesTrailerInput = {
  movieId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/**
 * A connection to a list of `MoviesTrailer` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,ADMIN
 */
export type MoviesTrailersConnection = {
  __typename?: 'MoviesTrailersConnection';
  /** A list of edges which contains the `MoviesTrailer` and cursor to aid in pagination. */
  edges: Array<MoviesTrailersEdge>;
  /** A list of `MoviesTrailer` objects. */
  nodes: Array<MoviesTrailer>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MoviesTrailer` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `MoviesTrailer` edge in the connection. */
export type MoviesTrailersEdge = {
  __typename?: 'MoviesTrailersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `MoviesTrailer` at the end of the edge. */
  node: MoviesTrailer;
};

/** Methods to use when ordering `MoviesTrailer`. */
export enum MoviesTrailersOrderBy {
  MovieIdAsc = 'MOVIE_ID_ASC',
  MovieIdDesc = 'MOVIE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Collection`. */
  createCollection?: Maybe<CreateCollectionPayload>;
  /** Creates a single `CollectionRelation`. */
  createCollectionRelation?: Maybe<CreateCollectionRelationPayload>;
  /** Creates a new Collection snapshot. */
  createCollectionSnapshot?: Maybe<Snapshot>;
  createCollectionSnapshots?: Maybe<BulkPublishingPayload>;
  /** Creates a single `CollectionsImage`. */
  createCollectionsImage?: Maybe<CreateCollectionsImagePayload>;
  /** Creates a single `CollectionsTag`. */
  createCollectionsTag?: Maybe<CreateCollectionsTagPayload>;
  /** Creates a single `Episode`. */
  createEpisode?: Maybe<CreateEpisodePayload>;
  /** Creates a new Episode snapshot. */
  createEpisodeSnapshot?: Maybe<Snapshot>;
  createEpisodeSnapshots?: Maybe<BulkPublishingPayload>;
  /** Creates a single `EpisodesCast`. */
  createEpisodesCast?: Maybe<CreateEpisodesCastPayload>;
  /** Creates a single `EpisodesImage`. */
  createEpisodesImage?: Maybe<CreateEpisodesImagePayload>;
  /** Creates a single `EpisodesLicense`. */
  createEpisodesLicense?: Maybe<CreateEpisodesLicensePayload>;
  /** Creates a single `EpisodesLicensesCountry`. */
  createEpisodesLicensesCountry?: Maybe<CreateEpisodesLicensesCountryPayload>;
  /** Creates a single `EpisodesProductionCountry`. */
  createEpisodesProductionCountry?: Maybe<CreateEpisodesProductionCountryPayload>;
  /** Creates a single `EpisodesTag`. */
  createEpisodesTag?: Maybe<CreateEpisodesTagPayload>;
  /** Creates a single `EpisodesTrailer`. */
  createEpisodesTrailer?: Maybe<CreateEpisodesTrailerPayload>;
  /** Creates a single `EpisodesTvshowGenre`. */
  createEpisodesTvshowGenre?: Maybe<CreateEpisodesTvshowGenrePayload>;
  /** Creates a single `Movie`. */
  createMovie?: Maybe<CreateMoviePayload>;
  /** Creates a single `MovieGenre`. */
  createMovieGenre?: Maybe<CreateMovieGenrePayload>;
  /** Creates a new Movie genres snapshot. */
  createMovieGenresSnapshot?: Maybe<Snapshot>;
  /** Creates a new Movie snapshot. */
  createMovieSnapshot?: Maybe<Snapshot>;
  createMovieSnapshots?: Maybe<BulkPublishingPayload>;
  /** Creates a single `MoviesCast`. */
  createMoviesCast?: Maybe<CreateMoviesCastPayload>;
  /** Creates a single `MoviesImage`. */
  createMoviesImage?: Maybe<CreateMoviesImagePayload>;
  /** Creates a single `MoviesLicense`. */
  createMoviesLicense?: Maybe<CreateMoviesLicensePayload>;
  /** Creates a single `MoviesLicensesCountry`. */
  createMoviesLicensesCountry?: Maybe<CreateMoviesLicensesCountryPayload>;
  /** Creates a single `MoviesMovieGenre`. */
  createMoviesMovieGenre?: Maybe<CreateMoviesMovieGenrePayload>;
  /** Creates a single `MoviesProductionCountry`. */
  createMoviesProductionCountry?: Maybe<CreateMoviesProductionCountryPayload>;
  /** Creates a single `MoviesTag`. */
  createMoviesTag?: Maybe<CreateMoviesTagPayload>;
  /** Creates a single `MoviesTrailer`. */
  createMoviesTrailer?: Maybe<CreateMoviesTrailerPayload>;
  /** Creates a single `Review`. */
  createReview?: Maybe<CreateReviewPayload>;
  /** Creates a single `Season`. */
  createSeason?: Maybe<CreateSeasonPayload>;
  /** Creates a new Season snapshot. */
  createSeasonSnapshot?: Maybe<Snapshot>;
  createSeasonSnapshots?: Maybe<BulkPublishingPayload>;
  /** Creates a single `SeasonsCast`. */
  createSeasonsCast?: Maybe<CreateSeasonsCastPayload>;
  /** Creates a single `SeasonsImage`. */
  createSeasonsImage?: Maybe<CreateSeasonsImagePayload>;
  /** Creates a single `SeasonsLicense`. */
  createSeasonsLicense?: Maybe<CreateSeasonsLicensePayload>;
  /** Creates a single `SeasonsLicensesCountry`. */
  createSeasonsLicensesCountry?: Maybe<CreateSeasonsLicensesCountryPayload>;
  /** Creates a single `SeasonsProductionCountry`. */
  createSeasonsProductionCountry?: Maybe<CreateSeasonsProductionCountryPayload>;
  /** Creates a single `SeasonsTag`. */
  createSeasonsTag?: Maybe<CreateSeasonsTagPayload>;
  /** Creates a single `SeasonsTrailer`. */
  createSeasonsTrailer?: Maybe<CreateSeasonsTrailerPayload>;
  /** Creates a single `SeasonsTvshowGenre`. */
  createSeasonsTvshowGenre?: Maybe<CreateSeasonsTvshowGenrePayload>;
  /** Creates a single `Tvshow`. */
  createTvshow?: Maybe<CreateTvshowPayload>;
  /** Creates a single `TvshowGenre`. */
  createTvshowGenre?: Maybe<CreateTvshowGenrePayload>;
  /** Creates a new Tvshow genres snapshot. */
  createTvshowGenresSnapshot?: Maybe<Snapshot>;
  /** Creates a new Tvshow snapshot. */
  createTvshowSnapshot?: Maybe<Snapshot>;
  createTvshowSnapshots?: Maybe<BulkPublishingPayload>;
  /** Creates a single `TvshowsCast`. */
  createTvshowsCast?: Maybe<CreateTvshowsCastPayload>;
  /** Creates a single `TvshowsImage`. */
  createTvshowsImage?: Maybe<CreateTvshowsImagePayload>;
  /** Creates a single `TvshowsLicense`. */
  createTvshowsLicense?: Maybe<CreateTvshowsLicensePayload>;
  /** Creates a single `TvshowsLicensesCountry`. */
  createTvshowsLicensesCountry?: Maybe<CreateTvshowsLicensesCountryPayload>;
  /** Creates a single `TvshowsProductionCountry`. */
  createTvshowsProductionCountry?: Maybe<CreateTvshowsProductionCountryPayload>;
  /** Creates a single `TvshowsTag`. */
  createTvshowsTag?: Maybe<CreateTvshowsTagPayload>;
  /** Creates a single `TvshowsTrailer`. */
  createTvshowsTrailer?: Maybe<CreateTvshowsTrailerPayload>;
  /** Creates a single `TvshowsTvshowGenre`. */
  createTvshowsTvshowGenre?: Maybe<CreateTvshowsTvshowGenrePayload>;
  /** Deletes a single `Collection` using a unique key. */
  deleteCollection?: Maybe<DeleteCollectionPayload>;
  /** Deletes a single `Collection` using a unique key. */
  deleteCollectionByExternalId?: Maybe<DeleteCollectionPayload>;
  /** Deletes a single `CollectionRelation` using a unique key. */
  deleteCollectionRelation?: Maybe<DeleteCollectionRelationPayload>;
  deleteCollectionRelations?: Maybe<BulkMutationIntPayload>;
  deleteCollections?: Maybe<BulkMutationIntPayload>;
  /** Deletes a single `CollectionsImage` using a unique key. */
  deleteCollectionsImageByCollectionIdAndImageType?: Maybe<DeleteCollectionsImagePayload>;
  /** Deletes a single `CollectionsTag` using a unique key. */
  deleteCollectionsTag?: Maybe<DeleteCollectionsTagPayload>;
  /** Deletes a single `Episode` using a unique key. */
  deleteEpisode?: Maybe<DeleteEpisodePayload>;
  /** Deletes a single `Episode` using a unique key. */
  deleteEpisodeByExternalId?: Maybe<DeleteEpisodePayload>;
  deleteEpisodes?: Maybe<BulkMutationIntPayload>;
  /** Deletes a single `EpisodesCast` using a unique key. */
  deleteEpisodesCast?: Maybe<DeleteEpisodesCastPayload>;
  /** Deletes a single `EpisodesImage` using a unique key. */
  deleteEpisodesImageByEpisodeIdAndImageType?: Maybe<DeleteEpisodesImagePayload>;
  /** Deletes a single `EpisodesLicense` using a unique key. */
  deleteEpisodesLicense?: Maybe<DeleteEpisodesLicensePayload>;
  deleteEpisodesLicenses?: Maybe<BulkMutationIntPayload>;
  /** Deletes a single `EpisodesLicensesCountry` using a unique key. */
  deleteEpisodesLicensesCountry?: Maybe<DeleteEpisodesLicensesCountryPayload>;
  /** Deletes a single `EpisodesProductionCountry` using a unique key. */
  deleteEpisodesProductionCountry?: Maybe<DeleteEpisodesProductionCountryPayload>;
  /** Deletes a single `EpisodesTag` using a unique key. */
  deleteEpisodesTag?: Maybe<DeleteEpisodesTagPayload>;
  /** Deletes a single `EpisodesTrailer` using a unique key. */
  deleteEpisodesTrailer?: Maybe<DeleteEpisodesTrailerPayload>;
  /** Deletes a single `EpisodesTvshowGenre` using a unique key. */
  deleteEpisodesTvshowGenre?: Maybe<DeleteEpisodesTvshowGenrePayload>;
  /** Deletes a single `Movie` using a unique key. */
  deleteMovie?: Maybe<DeleteMoviePayload>;
  /** Deletes a single `Movie` using a unique key. */
  deleteMovieByExternalId?: Maybe<DeleteMoviePayload>;
  /** Deletes a single `MovieGenre` using a unique key. */
  deleteMovieGenre?: Maybe<DeleteMovieGenrePayload>;
  deleteMovieGenres?: Maybe<BulkMutationIntPayload>;
  deleteMovies?: Maybe<BulkMutationIntPayload>;
  /** Deletes a single `MoviesCast` using a unique key. */
  deleteMoviesCast?: Maybe<DeleteMoviesCastPayload>;
  /** Deletes a single `MoviesImage` using a unique key. */
  deleteMoviesImageByMovieIdAndImageType?: Maybe<DeleteMoviesImagePayload>;
  /** Deletes a single `MoviesLicense` using a unique key. */
  deleteMoviesLicense?: Maybe<DeleteMoviesLicensePayload>;
  deleteMoviesLicenses?: Maybe<BulkMutationIntPayload>;
  /** Deletes a single `MoviesLicensesCountry` using a unique key. */
  deleteMoviesLicensesCountry?: Maybe<DeleteMoviesLicensesCountryPayload>;
  /** Deletes a single `MoviesMovieGenre` using a unique key. */
  deleteMoviesMovieGenre?: Maybe<DeleteMoviesMovieGenrePayload>;
  /** Deletes a single `MoviesProductionCountry` using a unique key. */
  deleteMoviesProductionCountry?: Maybe<DeleteMoviesProductionCountryPayload>;
  /** Deletes a single `MoviesTag` using a unique key. */
  deleteMoviesTag?: Maybe<DeleteMoviesTagPayload>;
  /** Deletes a single `MoviesTrailer` using a unique key. */
  deleteMoviesTrailer?: Maybe<DeleteMoviesTrailerPayload>;
  /** Deletes a single `Review` using a unique key. */
  deleteReview?: Maybe<DeleteReviewPayload>;
  /** Deletes a single `Season` using a unique key. */
  deleteSeason?: Maybe<DeleteSeasonPayload>;
  /** Deletes a single `Season` using a unique key. */
  deleteSeasonByExternalId?: Maybe<DeleteSeasonPayload>;
  deleteSeasons?: Maybe<BulkMutationIntPayload>;
  /** Deletes a single `SeasonsCast` using a unique key. */
  deleteSeasonsCast?: Maybe<DeleteSeasonsCastPayload>;
  /** Deletes a single `SeasonsImage` using a unique key. */
  deleteSeasonsImageBySeasonIdAndImageType?: Maybe<DeleteSeasonsImagePayload>;
  /** Deletes a single `SeasonsLicense` using a unique key. */
  deleteSeasonsLicense?: Maybe<DeleteSeasonsLicensePayload>;
  deleteSeasonsLicenses?: Maybe<BulkMutationIntPayload>;
  /** Deletes a single `SeasonsLicensesCountry` using a unique key. */
  deleteSeasonsLicensesCountry?: Maybe<DeleteSeasonsLicensesCountryPayload>;
  /** Deletes a single `SeasonsProductionCountry` using a unique key. */
  deleteSeasonsProductionCountry?: Maybe<DeleteSeasonsProductionCountryPayload>;
  /** Deletes a single `SeasonsTag` using a unique key. */
  deleteSeasonsTag?: Maybe<DeleteSeasonsTagPayload>;
  /** Deletes a single `SeasonsTrailer` using a unique key. */
  deleteSeasonsTrailer?: Maybe<DeleteSeasonsTrailerPayload>;
  /** Deletes a single `SeasonsTvshowGenre` using a unique key. */
  deleteSeasonsTvshowGenre?: Maybe<DeleteSeasonsTvshowGenrePayload>;
  /** Deletes a single `Snapshot` using a unique key. */
  deleteSnapshot?: Maybe<DeleteSnapshotPayload>;
  deleteSnapshots?: Maybe<BulkMutationIntPayload>;
  /** Deletes a single `Tvshow` using a unique key. */
  deleteTvshow?: Maybe<DeleteTvshowPayload>;
  /** Deletes a single `Tvshow` using a unique key. */
  deleteTvshowByExternalId?: Maybe<DeleteTvshowPayload>;
  /** Deletes a single `TvshowGenre` using a unique key. */
  deleteTvshowGenre?: Maybe<DeleteTvshowGenrePayload>;
  deleteTvshowGenres?: Maybe<BulkMutationIntPayload>;
  deleteTvshows?: Maybe<BulkMutationIntPayload>;
  /** Deletes a single `TvshowsCast` using a unique key. */
  deleteTvshowsCast?: Maybe<DeleteTvshowsCastPayload>;
  /** Deletes a single `TvshowsImage` using a unique key. */
  deleteTvshowsImageByTvshowIdAndImageType?: Maybe<DeleteTvshowsImagePayload>;
  /** Deletes a single `TvshowsLicense` using a unique key. */
  deleteTvshowsLicense?: Maybe<DeleteTvshowsLicensePayload>;
  deleteTvshowsLicenses?: Maybe<BulkMutationIntPayload>;
  /** Deletes a single `TvshowsLicensesCountry` using a unique key. */
  deleteTvshowsLicensesCountry?: Maybe<DeleteTvshowsLicensesCountryPayload>;
  /** Deletes a single `TvshowsProductionCountry` using a unique key. */
  deleteTvshowsProductionCountry?: Maybe<DeleteTvshowsProductionCountryPayload>;
  /** Deletes a single `TvshowsTag` using a unique key. */
  deleteTvshowsTag?: Maybe<DeleteTvshowsTagPayload>;
  /** Deletes a single `TvshowsTrailer` using a unique key. */
  deleteTvshowsTrailer?: Maybe<DeleteTvshowsTrailerPayload>;
  /** Deletes a single `TvshowsTvshowGenre` using a unique key. */
  deleteTvshowsTvshowGenre?: Maybe<DeleteTvshowsTvshowGenrePayload>;
  populateCollections?: Maybe<PopulatePayload>;
  populateMovies?: Maybe<PopulatePayload>;
  populateTvshows?: Maybe<PopulatePayload>;
  /** Creates a Collection snapshot and immediately publishes it if it's valid. */
  publishCollection?: Maybe<Snapshot>;
  publishCollections?: Maybe<BulkPublishingPayload>;
  /** Creates a Episode snapshot and immediately publishes it if it's valid. */
  publishEpisode?: Maybe<Snapshot>;
  publishEpisodes?: Maybe<BulkPublishingPayload>;
  /** Creates a Movie snapshot and immediately publishes it if it's valid. */
  publishMovie?: Maybe<Snapshot>;
  /** Creates a Movie genres snapshot and immediately publishes it if it's valid. */
  publishMovieGenres?: Maybe<Snapshot>;
  publishMovies?: Maybe<BulkPublishingPayload>;
  /** Creates a Season snapshot and immediately publishes it if it's valid. */
  publishSeason?: Maybe<Snapshot>;
  publishSeasons?: Maybe<BulkPublishingPayload>;
  publishSnapshot?: Maybe<Snapshot>;
  publishSnapshots?: Maybe<BulkPublishingPayload>;
  /** Creates a Tvshow snapshot and immediately publishes it if it's valid. */
  publishTvshow?: Maybe<Snapshot>;
  /** Creates a Tvshow genres snapshot and immediately publishes it if it's valid. */
  publishTvshowGenres?: Maybe<Snapshot>;
  publishTvshows?: Maybe<BulkPublishingPayload>;
  recreateSnapshots?: Maybe<BulkPublishingPayload>;
  startIngest?: Maybe<StartIngestPayload>;
  /** Unpublishes the currently published Collection snapshot. */
  unpublishCollection?: Maybe<Snapshot>;
  unpublishCollections?: Maybe<BulkMutationPayload>;
  /** Unpublishes the currently published Episode snapshot. */
  unpublishEpisode?: Maybe<Snapshot>;
  unpublishEpisodes?: Maybe<BulkMutationPayload>;
  /** Unpublishes the currently published Movie snapshot. */
  unpublishMovie?: Maybe<Snapshot>;
  /** Unpublishes the currently published Movie genres snapshot. */
  unpublishMovieGenres?: Maybe<Snapshot>;
  unpublishMovies?: Maybe<BulkMutationPayload>;
  /** Unpublishes the currently published Season snapshot. */
  unpublishSeason?: Maybe<Snapshot>;
  unpublishSeasons?: Maybe<BulkMutationPayload>;
  unpublishSnapshot?: Maybe<Snapshot>;
  unpublishSnapshots?: Maybe<BulkMutationPayload>;
  /** Unpublishes the currently published Tvshow snapshot. */
  unpublishTvshow?: Maybe<Snapshot>;
  /** Unpublishes the currently published Tvshow genres snapshot. */
  unpublishTvshowGenres?: Maybe<Snapshot>;
  unpublishTvshows?: Maybe<BulkMutationPayload>;
  /** Updates a single `Collection` using a unique key and a patch. */
  updateCollection?: Maybe<UpdateCollectionPayload>;
  /** Updates a single `Collection` using a unique key and a patch. */
  updateCollectionByExternalId?: Maybe<UpdateCollectionPayload>;
  /** Updates a single `CollectionRelation` using a unique key and a patch. */
  updateCollectionRelation?: Maybe<UpdateCollectionRelationPayload>;
  /** Updates a single `CollectionsImage` using a unique key and a patch. */
  updateCollectionsImageByCollectionIdAndImageType?: Maybe<UpdateCollectionsImagePayload>;
  /** Updates a single `CollectionsTag` using a unique key and a patch. */
  updateCollectionsTag?: Maybe<UpdateCollectionsTagPayload>;
  /** Updates a single `Episode` using a unique key and a patch. */
  updateEpisode?: Maybe<UpdateEpisodePayload>;
  /** Updates a single `Episode` using a unique key and a patch. */
  updateEpisodeByExternalId?: Maybe<UpdateEpisodePayload>;
  /** Updates a single `EpisodesCast` using a unique key and a patch. */
  updateEpisodesCast?: Maybe<UpdateEpisodesCastPayload>;
  /** Updates a single `EpisodesImage` using a unique key and a patch. */
  updateEpisodesImageByEpisodeIdAndImageType?: Maybe<UpdateEpisodesImagePayload>;
  /** Updates a single `EpisodesLicense` using a unique key and a patch. */
  updateEpisodesLicense?: Maybe<UpdateEpisodesLicensePayload>;
  /** Updates a single `EpisodesLicensesCountry` using a unique key and a patch. */
  updateEpisodesLicensesCountry?: Maybe<UpdateEpisodesLicensesCountryPayload>;
  /** Updates a single `EpisodesProductionCountry` using a unique key and a patch. */
  updateEpisodesProductionCountry?: Maybe<UpdateEpisodesProductionCountryPayload>;
  /** Updates a single `EpisodesTag` using a unique key and a patch. */
  updateEpisodesTag?: Maybe<UpdateEpisodesTagPayload>;
  /** Updates a single `IngestDocument` using a unique key and a patch. */
  updateIngestDocument?: Maybe<UpdateIngestDocumentPayload>;
  /** Updates a single `Movie` using a unique key and a patch. */
  updateMovie?: Maybe<UpdateMoviePayload>;
  /** Updates a single `Movie` using a unique key and a patch. */
  updateMovieByExternalId?: Maybe<UpdateMoviePayload>;
  /** Updates a single `MovieGenre` using a unique key and a patch. */
  updateMovieGenre?: Maybe<UpdateMovieGenrePayload>;
  /** Updates a single `MoviesCast` using a unique key and a patch. */
  updateMoviesCast?: Maybe<UpdateMoviesCastPayload>;
  /** Updates a single `MoviesImage` using a unique key and a patch. */
  updateMoviesImageByMovieIdAndImageType?: Maybe<UpdateMoviesImagePayload>;
  /** Updates a single `MoviesLicense` using a unique key and a patch. */
  updateMoviesLicense?: Maybe<UpdateMoviesLicensePayload>;
  /** Updates a single `MoviesLicensesCountry` using a unique key and a patch. */
  updateMoviesLicensesCountry?: Maybe<UpdateMoviesLicensesCountryPayload>;
  /** Updates a single `MoviesProductionCountry` using a unique key and a patch. */
  updateMoviesProductionCountry?: Maybe<UpdateMoviesProductionCountryPayload>;
  /** Updates a single `MoviesTag` using a unique key and a patch. */
  updateMoviesTag?: Maybe<UpdateMoviesTagPayload>;
  /** Updates a single `Review` using a unique key and a patch. */
  updateReview?: Maybe<UpdateReviewPayload>;
  /** Updates a single `Season` using a unique key and a patch. */
  updateSeason?: Maybe<UpdateSeasonPayload>;
  /** Updates a single `Season` using a unique key and a patch. */
  updateSeasonByExternalId?: Maybe<UpdateSeasonPayload>;
  /** Updates a single `SeasonsCast` using a unique key and a patch. */
  updateSeasonsCast?: Maybe<UpdateSeasonsCastPayload>;
  /** Updates a single `SeasonsImage` using a unique key and a patch. */
  updateSeasonsImageBySeasonIdAndImageType?: Maybe<UpdateSeasonsImagePayload>;
  /** Updates a single `SeasonsLicense` using a unique key and a patch. */
  updateSeasonsLicense?: Maybe<UpdateSeasonsLicensePayload>;
  /** Updates a single `SeasonsLicensesCountry` using a unique key and a patch. */
  updateSeasonsLicensesCountry?: Maybe<UpdateSeasonsLicensesCountryPayload>;
  /** Updates a single `SeasonsProductionCountry` using a unique key and a patch. */
  updateSeasonsProductionCountry?: Maybe<UpdateSeasonsProductionCountryPayload>;
  /** Updates a single `SeasonsTag` using a unique key and a patch. */
  updateSeasonsTag?: Maybe<UpdateSeasonsTagPayload>;
  /** Updates a single `Tvshow` using a unique key and a patch. */
  updateTvshow?: Maybe<UpdateTvshowPayload>;
  /** Updates a single `Tvshow` using a unique key and a patch. */
  updateTvshowByExternalId?: Maybe<UpdateTvshowPayload>;
  /** Updates a single `TvshowGenre` using a unique key and a patch. */
  updateTvshowGenre?: Maybe<UpdateTvshowGenrePayload>;
  /** Updates a single `TvshowsCast` using a unique key and a patch. */
  updateTvshowsCast?: Maybe<UpdateTvshowsCastPayload>;
  /** Updates a single `TvshowsImage` using a unique key and a patch. */
  updateTvshowsImageByTvshowIdAndImageType?: Maybe<UpdateTvshowsImagePayload>;
  /** Updates a single `TvshowsLicense` using a unique key and a patch. */
  updateTvshowsLicense?: Maybe<UpdateTvshowsLicensePayload>;
  /** Updates a single `TvshowsLicensesCountry` using a unique key and a patch. */
  updateTvshowsLicensesCountry?: Maybe<UpdateTvshowsLicensesCountryPayload>;
  /** Updates a single `TvshowsProductionCountry` using a unique key and a patch. */
  updateTvshowsProductionCountry?: Maybe<UpdateTvshowsProductionCountryPayload>;
  /** Updates a single `TvshowsTag` using a unique key and a patch. */
  updateTvshowsTag?: Maybe<UpdateTvshowsTagPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCollectionRelationArgs = {
  input: CreateCollectionRelationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCollectionSnapshotArgs = {
  collectionId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCollectionSnapshotsArgs = {
  filter?: InputMaybe<CollectionFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCollectionsImageArgs = {
  input: CreateCollectionsImageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCollectionsTagArgs = {
  input: CreateCollectionsTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodeArgs = {
  input: CreateEpisodeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodeSnapshotArgs = {
  episodeId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodeSnapshotsArgs = {
  filter?: InputMaybe<EpisodeFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodesCastArgs = {
  input: CreateEpisodesCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodesImageArgs = {
  input: CreateEpisodesImageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodesLicenseArgs = {
  input: CreateEpisodesLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodesLicensesCountryArgs = {
  input: CreateEpisodesLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodesProductionCountryArgs = {
  input: CreateEpisodesProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodesTagArgs = {
  input: CreateEpisodesTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodesTrailerArgs = {
  input: CreateEpisodesTrailerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateEpisodesTvshowGenreArgs = {
  input: CreateEpisodesTvshowGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMovieArgs = {
  input: CreateMovieInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMovieGenreArgs = {
  input: CreateMovieGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMovieSnapshotArgs = {
  movieId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMovieSnapshotsArgs = {
  filter?: InputMaybe<MovieFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMoviesCastArgs = {
  input: CreateMoviesCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMoviesImageArgs = {
  input: CreateMoviesImageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMoviesLicenseArgs = {
  input: CreateMoviesLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMoviesLicensesCountryArgs = {
  input: CreateMoviesLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMoviesMovieGenreArgs = {
  input: CreateMoviesMovieGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMoviesProductionCountryArgs = {
  input: CreateMoviesProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMoviesTagArgs = {
  input: CreateMoviesTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMoviesTrailerArgs = {
  input: CreateMoviesTrailerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonArgs = {
  input: CreateSeasonInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonSnapshotArgs = {
  seasonId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonSnapshotsArgs = {
  filter?: InputMaybe<SeasonFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonsCastArgs = {
  input: CreateSeasonsCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonsImageArgs = {
  input: CreateSeasonsImageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonsLicenseArgs = {
  input: CreateSeasonsLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonsLicensesCountryArgs = {
  input: CreateSeasonsLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonsProductionCountryArgs = {
  input: CreateSeasonsProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonsTagArgs = {
  input: CreateSeasonsTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonsTrailerArgs = {
  input: CreateSeasonsTrailerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeasonsTvshowGenreArgs = {
  input: CreateSeasonsTvshowGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowArgs = {
  input: CreateTvshowInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowGenreArgs = {
  input: CreateTvshowGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowSnapshotArgs = {
  tvshowId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowSnapshotsArgs = {
  filter?: InputMaybe<TvshowFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowsCastArgs = {
  input: CreateTvshowsCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowsImageArgs = {
  input: CreateTvshowsImageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowsLicenseArgs = {
  input: CreateTvshowsLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowsLicensesCountryArgs = {
  input: CreateTvshowsLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowsProductionCountryArgs = {
  input: CreateTvshowsProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowsTagArgs = {
  input: CreateTvshowsTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowsTrailerArgs = {
  input: CreateTvshowsTrailerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTvshowsTvshowGenreArgs = {
  input: CreateTvshowsTvshowGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCollectionArgs = {
  input: DeleteCollectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCollectionByExternalIdArgs = {
  input: DeleteCollectionByExternalIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCollectionRelationArgs = {
  input: DeleteCollectionRelationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCollectionRelationsArgs = {
  filter?: InputMaybe<CollectionRelationFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCollectionsArgs = {
  filter?: InputMaybe<CollectionFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCollectionsImageByCollectionIdAndImageTypeArgs = {
  input: DeleteCollectionsImageByCollectionIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCollectionsTagArgs = {
  input: DeleteCollectionsTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodeArgs = {
  input: DeleteEpisodeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodeByExternalIdArgs = {
  input: DeleteEpisodeByExternalIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodesArgs = {
  filter?: InputMaybe<EpisodeFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodesCastArgs = {
  input: DeleteEpisodesCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodesImageByEpisodeIdAndImageTypeArgs = {
  input: DeleteEpisodesImageByEpisodeIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodesLicenseArgs = {
  input: DeleteEpisodesLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodesLicensesArgs = {
  filter?: InputMaybe<EpisodesLicenseFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodesLicensesCountryArgs = {
  input: DeleteEpisodesLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodesProductionCountryArgs = {
  input: DeleteEpisodesProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodesTagArgs = {
  input: DeleteEpisodesTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodesTrailerArgs = {
  input: DeleteEpisodesTrailerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEpisodesTvshowGenreArgs = {
  input: DeleteEpisodesTvshowGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMovieArgs = {
  input: DeleteMovieInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMovieByExternalIdArgs = {
  input: DeleteMovieByExternalIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMovieGenreArgs = {
  input: DeleteMovieGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMovieGenresArgs = {
  filter?: InputMaybe<MovieGenreFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMoviesArgs = {
  filter?: InputMaybe<MovieFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMoviesCastArgs = {
  input: DeleteMoviesCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMoviesImageByMovieIdAndImageTypeArgs = {
  input: DeleteMoviesImageByMovieIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMoviesLicenseArgs = {
  input: DeleteMoviesLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMoviesLicensesArgs = {
  filter?: InputMaybe<MoviesLicenseFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMoviesLicensesCountryArgs = {
  input: DeleteMoviesLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMoviesMovieGenreArgs = {
  input: DeleteMoviesMovieGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMoviesProductionCountryArgs = {
  input: DeleteMoviesProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMoviesTagArgs = {
  input: DeleteMoviesTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMoviesTrailerArgs = {
  input: DeleteMoviesTrailerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewArgs = {
  input: DeleteReviewInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonArgs = {
  input: DeleteSeasonInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonByExternalIdArgs = {
  input: DeleteSeasonByExternalIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonsArgs = {
  filter?: InputMaybe<SeasonFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonsCastArgs = {
  input: DeleteSeasonsCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonsImageBySeasonIdAndImageTypeArgs = {
  input: DeleteSeasonsImageBySeasonIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonsLicenseArgs = {
  input: DeleteSeasonsLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonsLicensesArgs = {
  filter?: InputMaybe<SeasonsLicenseFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonsLicensesCountryArgs = {
  input: DeleteSeasonsLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonsProductionCountryArgs = {
  input: DeleteSeasonsProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonsTagArgs = {
  input: DeleteSeasonsTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonsTrailerArgs = {
  input: DeleteSeasonsTrailerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeasonsTvshowGenreArgs = {
  input: DeleteSeasonsTvshowGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSnapshotArgs = {
  input: DeleteSnapshotInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSnapshotsArgs = {
  filter?: InputMaybe<SnapshotFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowArgs = {
  input: DeleteTvshowInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowByExternalIdArgs = {
  input: DeleteTvshowByExternalIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowGenreArgs = {
  input: DeleteTvshowGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowGenresArgs = {
  filter?: InputMaybe<TvshowGenreFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowsArgs = {
  filter?: InputMaybe<TvshowFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowsCastArgs = {
  input: DeleteTvshowsCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowsImageByTvshowIdAndImageTypeArgs = {
  input: DeleteTvshowsImageByTvshowIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowsLicenseArgs = {
  input: DeleteTvshowsLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowsLicensesArgs = {
  filter?: InputMaybe<TvshowsLicenseFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowsLicensesCountryArgs = {
  input: DeleteTvshowsLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowsProductionCountryArgs = {
  input: DeleteTvshowsProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowsTagArgs = {
  input: DeleteTvshowsTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowsTrailerArgs = {
  input: DeleteTvshowsTrailerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTvshowsTvshowGenreArgs = {
  input: DeleteTvshowsTvshowGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPopulateCollectionsArgs = {
  input: PopulateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPopulateMoviesArgs = {
  input: PopulateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPopulateTvshowsArgs = {
  input: PopulateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishCollectionArgs = {
  collectionId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishCollectionsArgs = {
  filter?: InputMaybe<CollectionFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishEpisodeArgs = {
  episodeId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishEpisodesArgs = {
  filter?: InputMaybe<EpisodeFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishMovieArgs = {
  movieId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishMoviesArgs = {
  filter?: InputMaybe<MovieFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishSeasonArgs = {
  seasonId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishSeasonsArgs = {
  filter?: InputMaybe<SeasonFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishSnapshotArgs = {
  snapshotId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishSnapshotsArgs = {
  filter?: InputMaybe<SnapshotFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishTvshowArgs = {
  tvshowId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPublishTvshowsArgs = {
  filter?: InputMaybe<TvshowFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationRecreateSnapshotsArgs = {
  filter?: InputMaybe<SnapshotFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationStartIngestArgs = {
  input: StartIngestInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishCollectionArgs = {
  collectionId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishCollectionsArgs = {
  filter?: InputMaybe<CollectionFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishEpisodeArgs = {
  episodeId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishEpisodesArgs = {
  filter?: InputMaybe<EpisodeFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishMovieArgs = {
  movieId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishMoviesArgs = {
  filter?: InputMaybe<MovieFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishSeasonArgs = {
  seasonId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishSeasonsArgs = {
  filter?: InputMaybe<SeasonFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishSnapshotArgs = {
  snapshotId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishSnapshotsArgs = {
  filter?: InputMaybe<SnapshotFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishTvshowArgs = {
  tvshowId: Scalars['Int'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnpublishTvshowsArgs = {
  filter?: InputMaybe<TvshowFilter>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCollectionArgs = {
  input: UpdateCollectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCollectionByExternalIdArgs = {
  input: UpdateCollectionByExternalIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCollectionRelationArgs = {
  input: UpdateCollectionRelationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCollectionsImageByCollectionIdAndImageTypeArgs = {
  input: UpdateCollectionsImageByCollectionIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCollectionsTagArgs = {
  input: UpdateCollectionsTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEpisodeArgs = {
  input: UpdateEpisodeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEpisodeByExternalIdArgs = {
  input: UpdateEpisodeByExternalIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEpisodesCastArgs = {
  input: UpdateEpisodesCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEpisodesImageByEpisodeIdAndImageTypeArgs = {
  input: UpdateEpisodesImageByEpisodeIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEpisodesLicenseArgs = {
  input: UpdateEpisodesLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEpisodesLicensesCountryArgs = {
  input: UpdateEpisodesLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEpisodesProductionCountryArgs = {
  input: UpdateEpisodesProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEpisodesTagArgs = {
  input: UpdateEpisodesTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateIngestDocumentArgs = {
  input: UpdateIngestDocumentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMovieArgs = {
  input: UpdateMovieInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMovieByExternalIdArgs = {
  input: UpdateMovieByExternalIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMovieGenreArgs = {
  input: UpdateMovieGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMoviesCastArgs = {
  input: UpdateMoviesCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMoviesImageByMovieIdAndImageTypeArgs = {
  input: UpdateMoviesImageByMovieIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMoviesLicenseArgs = {
  input: UpdateMoviesLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMoviesLicensesCountryArgs = {
  input: UpdateMoviesLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMoviesProductionCountryArgs = {
  input: UpdateMoviesProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMoviesTagArgs = {
  input: UpdateMoviesTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSeasonArgs = {
  input: UpdateSeasonInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSeasonByExternalIdArgs = {
  input: UpdateSeasonByExternalIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSeasonsCastArgs = {
  input: UpdateSeasonsCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSeasonsImageBySeasonIdAndImageTypeArgs = {
  input: UpdateSeasonsImageBySeasonIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSeasonsLicenseArgs = {
  input: UpdateSeasonsLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSeasonsLicensesCountryArgs = {
  input: UpdateSeasonsLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSeasonsProductionCountryArgs = {
  input: UpdateSeasonsProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSeasonsTagArgs = {
  input: UpdateSeasonsTagInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTvshowArgs = {
  input: UpdateTvshowInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTvshowByExternalIdArgs = {
  input: UpdateTvshowByExternalIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTvshowGenreArgs = {
  input: UpdateTvshowGenreInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTvshowsCastArgs = {
  input: UpdateTvshowsCastInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTvshowsImageByTvshowIdAndImageTypeArgs = {
  input: UpdateTvshowsImageByTvshowIdAndImageTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTvshowsLicenseArgs = {
  input: UpdateTvshowsLicenseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTvshowsLicensesCountryArgs = {
  input: UpdateTvshowsLicensesCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTvshowsProductionCountryArgs = {
  input: UpdateTvshowsProductionCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTvshowsTagArgs = {
  input: UpdateTvshowsTagInput;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  count: Scalars['Int'];
};

export type PopulatePayload = {
  __typename?: 'PopulatePayload';
  count: Scalars['Int'];
  query?: Maybe<Query>;
};

export enum PublishStatus {
  /** Changed */
  Changed = 'CHANGED',
  /** Not published */
  NotPublished = 'NOT_PUBLISHED',
  /** Published */
  Published = 'PUBLISHED'
}

/** A filter to be used against PublishStatus fields. All fields are combined with a logical ‘and.’ */
export type PublishStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<PublishStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<PublishStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<PublishStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<PublishStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<PublishStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<PublishStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<PublishStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<PublishStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<PublishStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<PublishStatus>>;
};

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  collection?: Maybe<Collection>;
  collectionByExternalId?: Maybe<Collection>;
  collectionRelation?: Maybe<CollectionRelation>;
  /** Reads and enables pagination through a set of `CollectionRelation`. */
  collectionRelations?: Maybe<CollectionRelationsConnection>;
  /** Reads and enables pagination through a set of `Collection`. */
  collections?: Maybe<CollectionsConnection>;
  /** Reads and enables pagination through a set of `CollectionsImage`. */
  collectionsImages?: Maybe<CollectionsImagesConnection>;
  collectionsTag?: Maybe<CollectionsTag>;
  /** Reads and enables pagination through a set of `CollectionsTag`. */
  collectionsTags?: Maybe<CollectionsTagsConnection>;
  episode?: Maybe<Episode>;
  episodeByExternalId?: Maybe<Episode>;
  /** Reads and enables pagination through a set of `Episode`. */
  episodes?: Maybe<EpisodesConnection>;
  episodesCast?: Maybe<EpisodesCast>;
  /** Reads and enables pagination through a set of `EpisodesCast`. */
  episodesCasts?: Maybe<EpisodesCastsConnection>;
  /** Reads and enables pagination through a set of `EpisodesImage`. */
  episodesImages?: Maybe<EpisodesImagesConnection>;
  episodesLicense?: Maybe<EpisodesLicense>;
  /** Reads and enables pagination through a set of `EpisodesLicense`. */
  episodesLicenses?: Maybe<EpisodesLicensesConnection>;
  /** Reads and enables pagination through a set of `EpisodesLicensesCountry`. */
  episodesLicensesCountries?: Maybe<EpisodesLicensesCountriesConnection>;
  episodesLicensesCountry?: Maybe<EpisodesLicensesCountry>;
  /** Reads and enables pagination through a set of `EpisodesProductionCountry`. */
  episodesProductionCountries?: Maybe<EpisodesProductionCountriesConnection>;
  episodesProductionCountry?: Maybe<EpisodesProductionCountry>;
  episodesTag?: Maybe<EpisodesTag>;
  /** Reads and enables pagination through a set of `EpisodesTag`. */
  episodesTags?: Maybe<EpisodesTagsConnection>;
  episodesTrailer?: Maybe<EpisodesTrailer>;
  /** Reads and enables pagination through a set of `EpisodesTrailer`. */
  episodesTrailers?: Maybe<EpisodesTrailersConnection>;
  episodesTvshowGenre?: Maybe<EpisodesTvshowGenre>;
  /** Reads and enables pagination through a set of `EpisodesTvshowGenre`. */
  episodesTvshowGenres?: Maybe<EpisodesTvshowGenresConnection>;
  getCollectionsTagsValues?: Maybe<GetCollectionsTagsValuesConnection>;
  getEpisodesCastsValues?: Maybe<GetEpisodesCastsValuesConnection>;
  getEpisodesProductionCountriesValues?: Maybe<GetEpisodesProductionCountriesValuesConnection>;
  getEpisodesTagsValues?: Maybe<GetEpisodesTagsValuesConnection>;
  getMoviesCastsValues?: Maybe<GetMoviesCastsValuesConnection>;
  getMoviesProductionCountriesValues?: Maybe<GetMoviesProductionCountriesValuesConnection>;
  getMoviesTagsValues?: Maybe<GetMoviesTagsValuesConnection>;
  getSeasonsCastsValues?: Maybe<GetSeasonsCastsValuesConnection>;
  getSeasonsProductionCountriesValues?: Maybe<GetSeasonsProductionCountriesValuesConnection>;
  getSeasonsTagsValues?: Maybe<GetSeasonsTagsValuesConnection>;
  getTvshowsCastsValues?: Maybe<GetTvshowsCastsValuesConnection>;
  getTvshowsProductionCountriesValues?: Maybe<GetTvshowsProductionCountriesValuesConnection>;
  getTvshowsTagsValues?: Maybe<GetTvshowsTagsValuesConnection>;
  ingestDocument?: Maybe<IngestDocument>;
  /** Reads and enables pagination through a set of `IngestDocument`. */
  ingestDocuments?: Maybe<IngestDocumentsConnection>;
  ingestItem?: Maybe<IngestItem>;
  ingestItemStep?: Maybe<IngestItemStep>;
  /** Reads and enables pagination through a set of `IngestItemStep`. */
  ingestItemSteps?: Maybe<IngestItemStepsConnection>;
  /** Reads and enables pagination through a set of `IngestItem`. */
  ingestItems?: Maybe<IngestItemsConnection>;
  movie?: Maybe<Movie>;
  movieByExternalId?: Maybe<Movie>;
  movieGenre?: Maybe<MovieGenre>;
  /** Reads and enables pagination through a set of `MovieGenre`. */
  movieGenres?: Maybe<MovieGenresConnection>;
  /** Reads and enables pagination through a set of `Movie`. */
  movies?: Maybe<MoviesConnection>;
  moviesCast?: Maybe<MoviesCast>;
  /** Reads and enables pagination through a set of `MoviesCast`. */
  moviesCasts?: Maybe<MoviesCastsConnection>;
  /** Reads and enables pagination through a set of `MoviesImage`. */
  moviesImages?: Maybe<MoviesImagesConnection>;
  moviesLicense?: Maybe<MoviesLicense>;
  /** Reads and enables pagination through a set of `MoviesLicense`. */
  moviesLicenses?: Maybe<MoviesLicensesConnection>;
  /** Reads and enables pagination through a set of `MoviesLicensesCountry`. */
  moviesLicensesCountries?: Maybe<MoviesLicensesCountriesConnection>;
  moviesLicensesCountry?: Maybe<MoviesLicensesCountry>;
  moviesMovieGenre?: Maybe<MoviesMovieGenre>;
  /** Reads and enables pagination through a set of `MoviesMovieGenre`. */
  moviesMovieGenres?: Maybe<MoviesMovieGenresConnection>;
  /** Reads and enables pagination through a set of `MoviesProductionCountry`. */
  moviesProductionCountries?: Maybe<MoviesProductionCountriesConnection>;
  moviesProductionCountry?: Maybe<MoviesProductionCountry>;
  moviesTag?: Maybe<MoviesTag>;
  /** Reads and enables pagination through a set of `MoviesTag`. */
  moviesTags?: Maybe<MoviesTagsConnection>;
  moviesTrailer?: Maybe<MoviesTrailer>;
  /** Reads and enables pagination through a set of `MoviesTrailer`. */
  moviesTrailers?: Maybe<MoviesTrailersConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  review?: Maybe<Review>;
  /** Reads and enables pagination through a set of `Review`. */
  reviews?: Maybe<ReviewsConnection>;
  season?: Maybe<Season>;
  seasonByExternalId?: Maybe<Season>;
  /** Reads and enables pagination through a set of `Season`. */
  seasons?: Maybe<SeasonsConnection>;
  seasonsCast?: Maybe<SeasonsCast>;
  /** Reads and enables pagination through a set of `SeasonsCast`. */
  seasonsCasts?: Maybe<SeasonsCastsConnection>;
  /** Reads and enables pagination through a set of `SeasonsImage`. */
  seasonsImages?: Maybe<SeasonsImagesConnection>;
  seasonsLicense?: Maybe<SeasonsLicense>;
  /** Reads and enables pagination through a set of `SeasonsLicense`. */
  seasonsLicenses?: Maybe<SeasonsLicensesConnection>;
  /** Reads and enables pagination through a set of `SeasonsLicensesCountry`. */
  seasonsLicensesCountries?: Maybe<SeasonsLicensesCountriesConnection>;
  seasonsLicensesCountry?: Maybe<SeasonsLicensesCountry>;
  /** Reads and enables pagination through a set of `SeasonsProductionCountry`. */
  seasonsProductionCountries?: Maybe<SeasonsProductionCountriesConnection>;
  seasonsProductionCountry?: Maybe<SeasonsProductionCountry>;
  seasonsTag?: Maybe<SeasonsTag>;
  /** Reads and enables pagination through a set of `SeasonsTag`. */
  seasonsTags?: Maybe<SeasonsTagsConnection>;
  seasonsTrailer?: Maybe<SeasonsTrailer>;
  /** Reads and enables pagination through a set of `SeasonsTrailer`. */
  seasonsTrailers?: Maybe<SeasonsTrailersConnection>;
  seasonsTvshowGenre?: Maybe<SeasonsTvshowGenre>;
  /** Reads and enables pagination through a set of `SeasonsTvshowGenre`. */
  seasonsTvshowGenres?: Maybe<SeasonsTvshowGenresConnection>;
  snapshot?: Maybe<Snapshot>;
  /** Reads and enables pagination through a set of `Snapshot`. */
  snapshots?: Maybe<SnapshotsConnection>;
  tvshow?: Maybe<Tvshow>;
  tvshowByExternalId?: Maybe<Tvshow>;
  tvshowGenre?: Maybe<TvshowGenre>;
  /** Reads and enables pagination through a set of `TvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenresConnection>;
  /** Reads and enables pagination through a set of `Tvshow`. */
  tvshows?: Maybe<TvshowsConnection>;
  tvshowsCast?: Maybe<TvshowsCast>;
  /** Reads and enables pagination through a set of `TvshowsCast`. */
  tvshowsCasts?: Maybe<TvshowsCastsConnection>;
  /** Reads and enables pagination through a set of `TvshowsImage`. */
  tvshowsImages?: Maybe<TvshowsImagesConnection>;
  tvshowsLicense?: Maybe<TvshowsLicense>;
  /** Reads and enables pagination through a set of `TvshowsLicense`. */
  tvshowsLicenses?: Maybe<TvshowsLicensesConnection>;
  /** Reads and enables pagination through a set of `TvshowsLicensesCountry`. */
  tvshowsLicensesCountries?: Maybe<TvshowsLicensesCountriesConnection>;
  tvshowsLicensesCountry?: Maybe<TvshowsLicensesCountry>;
  /** Reads and enables pagination through a set of `TvshowsProductionCountry`. */
  tvshowsProductionCountries?: Maybe<TvshowsProductionCountriesConnection>;
  tvshowsProductionCountry?: Maybe<TvshowsProductionCountry>;
  tvshowsTag?: Maybe<TvshowsTag>;
  /** Reads and enables pagination through a set of `TvshowsTag`. */
  tvshowsTags?: Maybe<TvshowsTagsConnection>;
  tvshowsTrailer?: Maybe<TvshowsTrailer>;
  /** Reads and enables pagination through a set of `TvshowsTrailer`. */
  tvshowsTrailers?: Maybe<TvshowsTrailersConnection>;
  tvshowsTvshowGenre?: Maybe<TvshowsTvshowGenre>;
  /** Reads and enables pagination through a set of `TvshowsTvshowGenre`. */
  tvshowsTvshowGenres?: Maybe<TvshowsTvshowGenresConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCollectionArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCollectionByExternalIdArgs = {
  externalId: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCollectionRelationArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCollectionRelationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionRelationCondition>;
  filter?: InputMaybe<CollectionRelationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionRelationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCollectionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionCondition>;
  filter?: InputMaybe<CollectionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCollectionsImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionsImageCondition>;
  filter?: InputMaybe<CollectionsImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionsImagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCollectionsTagArgs = {
  collectionId: Scalars['Int'];
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCollectionsTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionsTagCondition>;
  filter?: InputMaybe<CollectionsTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionsTagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodeArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodeByExternalIdArgs = {
  externalId: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodeCondition>;
  filter?: InputMaybe<EpisodeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesCastArgs = {
  episodeId: Scalars['Int'];
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesCastsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesCastCondition>;
  filter?: InputMaybe<EpisodesCastFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesCastsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesImageCondition>;
  filter?: InputMaybe<EpisodesImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesImagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesLicenseArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesLicenseCondition>;
  filter?: InputMaybe<EpisodesLicenseFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesLicensesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesLicensesCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesLicensesCountryCondition>;
  filter?: InputMaybe<EpisodesLicensesCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesLicensesCountriesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesLicensesCountryArgs = {
  code: IsoAlphaTwoCountryCodes;
  episodesLicenseId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesProductionCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesProductionCountryCondition>;
  filter?: InputMaybe<EpisodesProductionCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesProductionCountriesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesProductionCountryArgs = {
  episodeId: Scalars['Int'];
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesTagArgs = {
  episodeId: Scalars['Int'];
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesTagCondition>;
  filter?: InputMaybe<EpisodesTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesTagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesTrailerArgs = {
  episodeId: Scalars['Int'];
  videoId: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesTrailersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesTrailerCondition>;
  filter?: InputMaybe<EpisodesTrailerFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesTrailersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesTvshowGenreArgs = {
  episodeId: Scalars['Int'];
  tvshowGenresId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEpisodesTvshowGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesTvshowGenreCondition>;
  filter?: InputMaybe<EpisodesTvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesTvshowGenresOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetCollectionsTagsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetEpisodesCastsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetEpisodesProductionCountriesValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetEpisodesTagsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetMoviesCastsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetMoviesProductionCountriesValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetMoviesTagsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetSeasonsCastsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetSeasonsProductionCountriesValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetSeasonsTagsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetTvshowsCastsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetTvshowsProductionCountriesValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryGetTvshowsTagsValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<StringFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryIngestDocumentArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryIngestDocumentsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<IngestDocumentCondition>;
  filter?: InputMaybe<IngestDocumentFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<IngestDocumentsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryIngestItemArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryIngestItemStepArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryIngestItemStepsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<IngestItemStepCondition>;
  filter?: InputMaybe<IngestItemStepFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<IngestItemStepsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryIngestItemsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<IngestItemCondition>;
  filter?: InputMaybe<IngestItemFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<IngestItemsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMovieArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMovieByExternalIdArgs = {
  externalId: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMovieGenreArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMovieGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MovieGenreCondition>;
  filter?: InputMaybe<MovieGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MovieGenresOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MovieCondition>;
  filter?: InputMaybe<MovieFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesCastArgs = {
  movieId: Scalars['Int'];
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesCastsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesCastCondition>;
  filter?: InputMaybe<MoviesCastFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesCastsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesImageCondition>;
  filter?: InputMaybe<MoviesImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesImagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesLicenseArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesLicenseCondition>;
  filter?: InputMaybe<MoviesLicenseFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesLicensesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesLicensesCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesLicensesCountryCondition>;
  filter?: InputMaybe<MoviesLicensesCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesLicensesCountriesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesLicensesCountryArgs = {
  code: IsoAlphaTwoCountryCodes;
  moviesLicenseId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesMovieGenreArgs = {
  movieGenresId: Scalars['Int'];
  movieId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesMovieGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesMovieGenreCondition>;
  filter?: InputMaybe<MoviesMovieGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesMovieGenresOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesProductionCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesProductionCountryCondition>;
  filter?: InputMaybe<MoviesProductionCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesProductionCountriesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesProductionCountryArgs = {
  movieId: Scalars['Int'];
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesTagArgs = {
  movieId: Scalars['Int'];
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesTagCondition>;
  filter?: InputMaybe<MoviesTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesTagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesTrailerArgs = {
  movieId: Scalars['Int'];
  videoId: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMoviesTrailersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesTrailerCondition>;
  filter?: InputMaybe<MoviesTrailerFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesTrailersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<ReviewCondition>;
  filter?: InputMaybe<ReviewFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ReviewsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonByExternalIdArgs = {
  externalId: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonCondition>;
  filter?: InputMaybe<SeasonFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsCastArgs = {
  name: Scalars['String'];
  seasonId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsCastsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsCastCondition>;
  filter?: InputMaybe<SeasonsCastFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsCastsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsImageCondition>;
  filter?: InputMaybe<SeasonsImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsImagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsLicenseArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsLicenseCondition>;
  filter?: InputMaybe<SeasonsLicenseFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsLicensesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsLicensesCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsLicensesCountryCondition>;
  filter?: InputMaybe<SeasonsLicensesCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsLicensesCountriesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsLicensesCountryArgs = {
  code: IsoAlphaTwoCountryCodes;
  seasonsLicenseId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsProductionCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsProductionCountryCondition>;
  filter?: InputMaybe<SeasonsProductionCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsProductionCountriesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsProductionCountryArgs = {
  name: Scalars['String'];
  seasonId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsTagArgs = {
  name: Scalars['String'];
  seasonId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsTagCondition>;
  filter?: InputMaybe<SeasonsTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsTagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsTrailerArgs = {
  seasonId: Scalars['Int'];
  videoId: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsTrailersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsTrailerCondition>;
  filter?: InputMaybe<SeasonsTrailerFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsTrailersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsTvshowGenreArgs = {
  seasonId: Scalars['Int'];
  tvshowGenresId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySeasonsTvshowGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsTvshowGenreCondition>;
  filter?: InputMaybe<SeasonsTvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsTvshowGenresOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySnapshotArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SnapshotCondition>;
  filter?: InputMaybe<SnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SnapshotsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowByExternalIdArgs = {
  externalId: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowGenreArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowGenreCondition>;
  filter?: InputMaybe<TvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowGenresOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowCondition>;
  filter?: InputMaybe<TvshowFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsCastArgs = {
  name: Scalars['String'];
  tvshowId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsCastsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsCastCondition>;
  filter?: InputMaybe<TvshowsCastFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsCastsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsImageCondition>;
  filter?: InputMaybe<TvshowsImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsImagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsLicenseArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsLicenseCondition>;
  filter?: InputMaybe<TvshowsLicenseFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsLicensesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsLicensesCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsLicensesCountryCondition>;
  filter?: InputMaybe<TvshowsLicensesCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsLicensesCountriesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsLicensesCountryArgs = {
  code: IsoAlphaTwoCountryCodes;
  tvshowsLicenseId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsProductionCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsProductionCountryCondition>;
  filter?: InputMaybe<TvshowsProductionCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsProductionCountriesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsProductionCountryArgs = {
  name: Scalars['String'];
  tvshowId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsTagArgs = {
  name: Scalars['String'];
  tvshowId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsTagCondition>;
  filter?: InputMaybe<TvshowsTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsTagsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsTrailerArgs = {
  tvshowId: Scalars['Int'];
  videoId: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsTrailersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsTrailerCondition>;
  filter?: InputMaybe<TvshowsTrailerFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsTrailersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsTvshowGenreArgs = {
  tvshowGenresId: Scalars['Int'];
  tvshowId: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTvshowsTvshowGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsTvshowGenreCondition>;
  filter?: InputMaybe<TvshowsTvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsTvshowGenresOrderBy>>;
};

/** @permissions: REVIEWS_VIEW,REVIEWS_EDIT,ADMIN */
export type Review = {
  __typename?: 'Review';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['Int'];
  rating?: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};

/** A condition to be used against `Review` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `rating` field. */
  rating?: InputMaybe<Scalars['Int']>;
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
};

/** A filter to be used against `Review` object types. All fields are combined with a logical ‘and.’ */
export type ReviewFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ReviewFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ReviewFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ReviewFilter>>;
  /** Filter by the object’s `rating` field. */
  rating?: InputMaybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Review` */
export type ReviewInput = {
  description: Scalars['String'];
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title: Scalars['String'];
};

/** Represents an update to a `Review`. Fields that are set will be updated. */
export type ReviewPatch = {
  description?: InputMaybe<Scalars['String']>;
  rating?: InputMaybe<Scalars['Int']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `Review` values.
 * @permissions: REVIEWS_VIEW,REVIEWS_EDIT,ADMIN
 */
export type ReviewsConnection = {
  __typename?: 'ReviewsConnection';
  /** A list of edges which contains the `Review` and cursor to aid in pagination. */
  edges: Array<ReviewsEdge>;
  /** A list of `Review` objects. */
  nodes: Array<Review>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Review` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Review` edge in the connection. */
export type ReviewsEdge = {
  __typename?: 'ReviewsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Review` at the end of the edge. */
  node: Review;
};

/** Methods to use when ordering `Review`. */
export enum ReviewsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RatingAsc = 'RATING_ASC',
  RatingDesc = 'RATING_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type Season = {
  __typename?: 'Season';
  /** Reads and enables pagination through a set of `CollectionRelation`. */
  collectionRelations: CollectionRelationsConnection;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `Episode`. */
  episodes: EpisodesConnection;
  externalId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  index: Scalars['Int'];
  publishStatus: PublishStatus;
  publishedDate?: Maybe<Scalars['Datetime']>;
  publishedUser?: Maybe<Scalars['String']>;
  released?: Maybe<Scalars['Date']>;
  /** Reads and enables pagination through a set of `SeasonsCast`. */
  seasonsCasts: SeasonsCastsConnection;
  /** Reads and enables pagination through a set of `SeasonsImage`. */
  seasonsImages: SeasonsImagesConnection;
  /** Reads and enables pagination through a set of `SeasonsLicense`. */
  seasonsLicenses: SeasonsLicensesConnection;
  /** Reads and enables pagination through a set of `SeasonsProductionCountry`. */
  seasonsProductionCountries: SeasonsProductionCountriesConnection;
  /** Reads and enables pagination through a set of `SeasonsSnapshot`. */
  seasonsSnapshots: SeasonsSnapshotsConnection;
  /** Reads and enables pagination through a set of `SeasonsTag`. */
  seasonsTags: SeasonsTagsConnection;
  /** Reads and enables pagination through a set of `SeasonsTrailer`. */
  seasonsTrailers: SeasonsTrailersConnection;
  /** Reads and enables pagination through a set of `SeasonsTvshowGenre`. */
  seasonsTvshowGenres: SeasonsTvshowGenresConnection;
  studio?: Maybe<Scalars['String']>;
  synopsis?: Maybe<Scalars['String']>;
  /** Reads a single `Tvshow` that is related to this `Season`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId?: Maybe<Scalars['Int']>;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonCollectionRelationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionRelationCondition>;
  filter?: InputMaybe<CollectionRelationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionRelationsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonEpisodesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodeCondition>;
  filter?: InputMaybe<EpisodeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonSeasonsCastsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsCastCondition>;
  filter?: InputMaybe<SeasonsCastFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsCastsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonSeasonsImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsImageCondition>;
  filter?: InputMaybe<SeasonsImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsImagesOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonSeasonsLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsLicenseCondition>;
  filter?: InputMaybe<SeasonsLicenseFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsLicensesOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonSeasonsProductionCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsProductionCountryCondition>;
  filter?: InputMaybe<SeasonsProductionCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsProductionCountriesOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonSeasonsSnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsSnapshotCondition>;
  filter?: InputMaybe<SeasonsSnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsSnapshotsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonSeasonsTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsTagCondition>;
  filter?: InputMaybe<SeasonsTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsTagsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonSeasonsTrailersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsTrailerCondition>;
  filter?: InputMaybe<SeasonsTrailerFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsTrailersOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonSeasonsTvshowGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsTvshowGenreCondition>;
  filter?: InputMaybe<SeasonsTvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsTvshowGenresOrderBy>>;
};

/** A condition to be used against `Season` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SeasonCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `index` field. */
  index?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `publishStatus` field. */
  publishStatus?: InputMaybe<PublishStatus>;
  /** Checks for equality with the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `released` field. */
  released?: InputMaybe<Scalars['Date']>;
  /** Checks for equality with the object’s `studio` field. */
  studio?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `synopsis` field. */
  synopsis?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `Season` object types. All fields are combined with a logical ‘and.’ */
export type SeasonFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonFilter>>;
  /** Filter by the object’s `collectionRelations` relation. */
  collectionRelations?: InputMaybe<SeasonToManyCollectionRelationFilter>;
  /** Some related `collectionRelations` exist. */
  collectionRelationsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `episodes` relation. */
  episodes?: InputMaybe<SeasonToManyEpisodeFilter>;
  /** Some related `episodes` exist. */
  episodesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `externalId` field. */
  externalId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `index` field. */
  index?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonFilter>>;
  /** Filter by the object’s `publishStatus` field. */
  publishStatus?: InputMaybe<PublishStatusFilter>;
  /** Filter by the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `released` field. */
  released?: InputMaybe<DateFilter>;
  /** Filter by the object’s `seasonsCasts` relation. */
  seasonsCasts?: InputMaybe<SeasonToManySeasonsCastFilter>;
  /** Some related `seasonsCasts` exist. */
  seasonsCastsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `seasonsImages` relation. */
  seasonsImages?: InputMaybe<SeasonToManySeasonsImageFilter>;
  /** Some related `seasonsImages` exist. */
  seasonsImagesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `seasonsLicenses` relation. */
  seasonsLicenses?: InputMaybe<SeasonToManySeasonsLicenseFilter>;
  /** Some related `seasonsLicenses` exist. */
  seasonsLicensesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `seasonsProductionCountries` relation. */
  seasonsProductionCountries?: InputMaybe<SeasonToManySeasonsProductionCountryFilter>;
  /** Some related `seasonsProductionCountries` exist. */
  seasonsProductionCountriesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `seasonsSnapshots` relation. */
  seasonsSnapshots?: InputMaybe<SeasonToManySeasonsSnapshotFilter>;
  /** Some related `seasonsSnapshots` exist. */
  seasonsSnapshotsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `seasonsTags` relation. */
  seasonsTags?: InputMaybe<SeasonToManySeasonsTagFilter>;
  /** Some related `seasonsTags` exist. */
  seasonsTagsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `seasonsTrailers` relation. */
  seasonsTrailers?: InputMaybe<SeasonToManySeasonsTrailerFilter>;
  /** Some related `seasonsTrailers` exist. */
  seasonsTrailersExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `seasonsTvshowGenres` relation. */
  seasonsTvshowGenres?: InputMaybe<SeasonToManySeasonsTvshowGenreFilter>;
  /** Some related `seasonsTvshowGenres` exist. */
  seasonsTvshowGenresExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `studio` field. */
  studio?: InputMaybe<StringFilter>;
  /** Filter by the object’s `synopsis` field. */
  synopsis?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tvshow` relation. */
  tvshow?: InputMaybe<TvshowFilter>;
  /** A related `tvshow` exists. */
  tvshowExists?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

export enum SeasonImageType {
  /** Cover */
  Cover = 'COVER',
  /** Teaser */
  Teaser = 'TEASER'
}

/** A filter to be used against SeasonImageType fields. All fields are combined with a logical ‘and.’ */
export type SeasonImageTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<SeasonImageType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<SeasonImageType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<SeasonImageType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<SeasonImageType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<SeasonImageType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<SeasonImageType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<SeasonImageType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<SeasonImageType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<SeasonImageType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<SeasonImageType>>;
};

/** An input for mutations affecting `Season` */
export type SeasonInput = {
  description?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  index: Scalars['Int'];
  released?: InputMaybe<Scalars['Date']>;
  studio?: InputMaybe<Scalars['String']>;
  synopsis?: InputMaybe<Scalars['String']>;
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/** Represents an update to a `Season`. Fields that are set will be updated. */
export type SeasonPatch = {
  description?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  index?: InputMaybe<Scalars['Int']>;
  released?: InputMaybe<Scalars['Date']>;
  studio?: InputMaybe<Scalars['String']>;
  synopsis?: InputMaybe<Scalars['String']>;
  tvshowId?: InputMaybe<Scalars['Int']>;
};

export type SeasonSubscriptionPayload = {
  __typename?: 'SeasonSubscriptionPayload';
  event?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  season?: Maybe<Season>;
};

/** A filter to be used against many `CollectionRelation` object types. All fields are combined with a logical ‘and.’ */
export type SeasonToManyCollectionRelationFilter = {
  /** Every related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CollectionRelationFilter>;
  /** No related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CollectionRelationFilter>;
  /** Some related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CollectionRelationFilter>;
};

/** A filter to be used against many `Episode` object types. All fields are combined with a logical ‘and.’ */
export type SeasonToManyEpisodeFilter = {
  /** Every related `Episode` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodeFilter>;
  /** No related `Episode` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodeFilter>;
  /** Some related `Episode` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodeFilter>;
};

/** A filter to be used against many `SeasonsCast` object types. All fields are combined with a logical ‘and.’ */
export type SeasonToManySeasonsCastFilter = {
  /** Every related `SeasonsCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsCastFilter>;
  /** No related `SeasonsCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsCastFilter>;
  /** Some related `SeasonsCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsCastFilter>;
};

/** A filter to be used against many `SeasonsImage` object types. All fields are combined with a logical ‘and.’ */
export type SeasonToManySeasonsImageFilter = {
  /** Every related `SeasonsImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsImageFilter>;
  /** No related `SeasonsImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsImageFilter>;
  /** Some related `SeasonsImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsImageFilter>;
};

/** A filter to be used against many `SeasonsLicense` object types. All fields are combined with a logical ‘and.’ */
export type SeasonToManySeasonsLicenseFilter = {
  /** Every related `SeasonsLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsLicenseFilter>;
  /** No related `SeasonsLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsLicenseFilter>;
  /** Some related `SeasonsLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsLicenseFilter>;
};

/** A filter to be used against many `SeasonsProductionCountry` object types. All fields are combined with a logical ‘and.’ */
export type SeasonToManySeasonsProductionCountryFilter = {
  /** Every related `SeasonsProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsProductionCountryFilter>;
  /** No related `SeasonsProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsProductionCountryFilter>;
  /** Some related `SeasonsProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsProductionCountryFilter>;
};

/** A filter to be used against many `SeasonsSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type SeasonToManySeasonsSnapshotFilter = {
  /** Every related `SeasonsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsSnapshotFilter>;
  /** No related `SeasonsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsSnapshotFilter>;
  /** Some related `SeasonsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsSnapshotFilter>;
};

/** A filter to be used against many `SeasonsTag` object types. All fields are combined with a logical ‘and.’ */
export type SeasonToManySeasonsTagFilter = {
  /** Every related `SeasonsTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsTagFilter>;
  /** No related `SeasonsTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsTagFilter>;
  /** Some related `SeasonsTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsTagFilter>;
};

/** A filter to be used against many `SeasonsTrailer` object types. All fields are combined with a logical ‘and.’ */
export type SeasonToManySeasonsTrailerFilter = {
  /** Every related `SeasonsTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsTrailerFilter>;
  /** No related `SeasonsTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsTrailerFilter>;
  /** Some related `SeasonsTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsTrailerFilter>;
};

/** A filter to be used against many `SeasonsTvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type SeasonToManySeasonsTvshowGenreFilter = {
  /** Every related `SeasonsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsTvshowGenreFilter>;
  /** No related `SeasonsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsTvshowGenreFilter>;
  /** Some related `SeasonsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsTvshowGenreFilter>;
};

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonsCast = {
  __typename?: 'SeasonsCast';
  name: Scalars['String'];
  /** Reads a single `Season` that is related to this `SeasonsCast`. */
  season?: Maybe<Season>;
  seasonId: Scalars['Int'];
};

/**
 * A condition to be used against `SeasonsCast` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type SeasonsCastCondition = {
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `SeasonsCast` object types. All fields are combined with a logical ‘and.’ */
export type SeasonsCastFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonsCastFilter>>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonsCastFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonsCastFilter>>;
  /** Filter by the object’s `season` relation. */
  season?: InputMaybe<SeasonFilter>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `SeasonsCast` */
export type SeasonsCastInput = {
  /** @notEmpty() */
  name: Scalars['String'];
  seasonId: Scalars['Int'];
};

/** Represents an update to a `SeasonsCast`. Fields that are set will be updated. */
export type SeasonsCastPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `SeasonsCast` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type SeasonsCastsConnection = {
  __typename?: 'SeasonsCastsConnection';
  /** A list of edges which contains the `SeasonsCast` and cursor to aid in pagination. */
  edges: Array<SeasonsCastsEdge>;
  /** A list of `SeasonsCast` objects. */
  nodes: Array<SeasonsCast>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonsCast` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SeasonsCast` edge in the connection. */
export type SeasonsCastsEdge = {
  __typename?: 'SeasonsCastsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SeasonsCast` at the end of the edge. */
  node: SeasonsCast;
};

/** Methods to use when ordering `SeasonsCast`. */
export enum SeasonsCastsOrderBy {
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC'
}

/**
 * A connection to a list of `Season` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type SeasonsConnection = {
  __typename?: 'SeasonsConnection';
  /** A list of edges which contains the `Season` and cursor to aid in pagination. */
  edges: Array<SeasonsEdge>;
  /** A list of `Season` objects. */
  nodes: Array<Season>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Season` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Season` edge in the connection. */
export type SeasonsEdge = {
  __typename?: 'SeasonsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Season` at the end of the edge. */
  node: Season;
};

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonsImage = {
  __typename?: 'SeasonsImage';
  imageId: Scalars['UUID'];
  imageType: SeasonImageType;
  /** Reads a single `Season` that is related to this `SeasonsImage`. */
  season?: Maybe<Season>;
  seasonId: Scalars['Int'];
};

/**
 * A condition to be used against `SeasonsImage` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SeasonsImageCondition = {
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `imageType` field. */
  imageType?: InputMaybe<SeasonImageType>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `SeasonsImage` object types. All fields are combined with a logical ‘and.’ */
export type SeasonsImageFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonsImageFilter>>;
  /** Filter by the object’s `imageId` field. */
  imageId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `imageType` field. */
  imageType?: InputMaybe<SeasonImageTypeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonsImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonsImageFilter>>;
  /** Filter by the object’s `season` relation. */
  season?: InputMaybe<SeasonFilter>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `SeasonsImage` */
export type SeasonsImageInput = {
  imageId: Scalars['UUID'];
  imageType: SeasonImageType;
  seasonId: Scalars['Int'];
};

/** Represents an update to a `SeasonsImage`. Fields that are set will be updated. */
export type SeasonsImagePatch = {
  imageId?: InputMaybe<Scalars['UUID']>;
  imageType?: InputMaybe<SeasonImageType>;
  seasonId?: InputMaybe<Scalars['Int']>;
};

/**
 * A connection to a list of `SeasonsImage` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type SeasonsImagesConnection = {
  __typename?: 'SeasonsImagesConnection';
  /** A list of edges which contains the `SeasonsImage` and cursor to aid in pagination. */
  edges: Array<SeasonsImagesEdge>;
  /** A list of `SeasonsImage` objects. */
  nodes: Array<SeasonsImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonsImage` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SeasonsImage` edge in the connection. */
export type SeasonsImagesEdge = {
  __typename?: 'SeasonsImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SeasonsImage` at the end of the edge. */
  node: SeasonsImage;
};

/** Methods to use when ordering `SeasonsImage`. */
export enum SeasonsImagesOrderBy {
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  ImageTypeAsc = 'IMAGE_TYPE_ASC',
  ImageTypeDesc = 'IMAGE_TYPE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonsLicense = {
  __typename?: 'SeasonsLicense';
  createdDate: Scalars['Datetime'];
  id: Scalars['Int'];
  licenseEnd?: Maybe<Scalars['Datetime']>;
  licenseStart?: Maybe<Scalars['Datetime']>;
  /** Reads a single `Season` that is related to this `SeasonsLicense`. */
  season?: Maybe<Season>;
  seasonId: Scalars['Int'];
  /** Reads and enables pagination through a set of `SeasonsLicensesCountry`. */
  seasonsLicensesCountries: SeasonsLicensesCountriesConnection;
  updatedDate: Scalars['Datetime'];
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonsLicenseSeasonsLicensesCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsLicensesCountryCondition>;
  filter?: InputMaybe<SeasonsLicensesCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsLicensesCountriesOrderBy>>;
};

/**
 * A condition to be used against `SeasonsLicense` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SeasonsLicenseCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `licenseEnd` field. */
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `licenseStart` field. */
  licenseStart?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
};

/** A filter to be used against `SeasonsLicense` object types. All fields are combined with a logical ‘and.’ */
export type SeasonsLicenseFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonsLicenseFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `licenseEnd` field. */
  licenseEnd?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `licenseStart` field. */
  licenseStart?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonsLicenseFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonsLicenseFilter>>;
  /** Filter by the object’s `season` relation. */
  season?: InputMaybe<SeasonFilter>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `seasonsLicensesCountries` relation. */
  seasonsLicensesCountries?: InputMaybe<SeasonsLicenseToManySeasonsLicensesCountryFilter>;
  /** Some related `seasonsLicensesCountries` exist. */
  seasonsLicensesCountriesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
};

/** An input for mutations affecting `SeasonsLicense` */
export type SeasonsLicenseInput = {
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  licenseStart?: InputMaybe<Scalars['Datetime']>;
  seasonId: Scalars['Int'];
};

/** Represents an update to a `SeasonsLicense`. Fields that are set will be updated. */
export type SeasonsLicensePatch = {
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  licenseStart?: InputMaybe<Scalars['Datetime']>;
  seasonId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against many `SeasonsLicensesCountry` object types. All fields are combined with a logical ‘and.’ */
export type SeasonsLicenseToManySeasonsLicensesCountryFilter = {
  /** Every related `SeasonsLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsLicensesCountryFilter>;
  /** No related `SeasonsLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsLicensesCountryFilter>;
  /** Some related `SeasonsLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsLicensesCountryFilter>;
};

/**
 * A connection to a list of `SeasonsLicense` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type SeasonsLicensesConnection = {
  __typename?: 'SeasonsLicensesConnection';
  /** A list of edges which contains the `SeasonsLicense` and cursor to aid in pagination. */
  edges: Array<SeasonsLicensesEdge>;
  /** A list of `SeasonsLicense` objects. */
  nodes: Array<SeasonsLicense>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonsLicense` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/**
 * A connection to a list of `SeasonsLicensesCountry` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type SeasonsLicensesCountriesConnection = {
  __typename?: 'SeasonsLicensesCountriesConnection';
  /** A list of edges which contains the `SeasonsLicensesCountry` and cursor to aid in pagination. */
  edges: Array<SeasonsLicensesCountriesEdge>;
  /** A list of `SeasonsLicensesCountry` objects. */
  nodes: Array<SeasonsLicensesCountry>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonsLicensesCountry` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SeasonsLicensesCountry` edge in the connection. */
export type SeasonsLicensesCountriesEdge = {
  __typename?: 'SeasonsLicensesCountriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SeasonsLicensesCountry` at the end of the edge. */
  node: SeasonsLicensesCountry;
};

/** Methods to use when ordering `SeasonsLicensesCountry`. */
export enum SeasonsLicensesCountriesOrderBy {
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonsLicenseIdAsc = 'SEASONS_LICENSE_ID_ASC',
  SeasonsLicenseIdDesc = 'SEASONS_LICENSE_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonsLicensesCountry = {
  __typename?: 'SeasonsLicensesCountry';
  code: IsoAlphaTwoCountryCodes;
  /** Reads a single `SeasonsLicense` that is related to this `SeasonsLicensesCountry`. */
  seasonsLicense?: Maybe<SeasonsLicense>;
  seasonsLicenseId: Scalars['Int'];
};

/**
 * A condition to be used against `SeasonsLicensesCountry` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type SeasonsLicensesCountryCondition = {
  /** Checks for equality with the object’s `code` field. */
  code?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Checks for equality with the object’s `seasonsLicenseId` field. */
  seasonsLicenseId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `SeasonsLicensesCountry` object types. All fields are combined with a logical ‘and.’ */
export type SeasonsLicensesCountryFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonsLicensesCountryFilter>>;
  /** Filter by the object’s `code` field. */
  code?: InputMaybe<IsoAlphaTwoCountryCodesFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonsLicensesCountryFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonsLicensesCountryFilter>>;
  /** Filter by the object’s `seasonsLicense` relation. */
  seasonsLicense?: InputMaybe<SeasonsLicenseFilter>;
  /** Filter by the object’s `seasonsLicenseId` field. */
  seasonsLicenseId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `SeasonsLicensesCountry` */
export type SeasonsLicensesCountryInput = {
  code: IsoAlphaTwoCountryCodes;
  seasonsLicenseId: Scalars['Int'];
};

/** Represents an update to a `SeasonsLicensesCountry`. Fields that are set will be updated. */
export type SeasonsLicensesCountryPatch = {
  code?: InputMaybe<IsoAlphaTwoCountryCodes>;
};

/** A `SeasonsLicense` edge in the connection. */
export type SeasonsLicensesEdge = {
  __typename?: 'SeasonsLicensesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SeasonsLicense` at the end of the edge. */
  node: SeasonsLicense;
};

/** Methods to use when ordering `SeasonsLicense`. */
export enum SeasonsLicensesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LicenseEndAsc = 'LICENSE_END_ASC',
  LicenseEndDesc = 'LICENSE_END_DESC',
  LicenseStartAsc = 'LICENSE_START_ASC',
  LicenseStartDesc = 'LICENSE_START_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC'
}

/** Methods to use when ordering `Season`. */
export enum SeasonsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IndexAsc = 'INDEX_ASC',
  IndexDesc = 'INDEX_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PublishedDateAsc = 'PUBLISHED_DATE_ASC',
  PublishedDateDesc = 'PUBLISHED_DATE_DESC',
  PublishedUserAsc = 'PUBLISHED_USER_ASC',
  PublishedUserDesc = 'PUBLISHED_USER_DESC',
  PublishStatusAsc = 'PUBLISH_STATUS_ASC',
  PublishStatusDesc = 'PUBLISH_STATUS_DESC',
  ReleasedAsc = 'RELEASED_ASC',
  ReleasedDesc = 'RELEASED_DESC',
  StudioAsc = 'STUDIO_ASC',
  StudioDesc = 'STUDIO_DESC',
  SynopsisAsc = 'SYNOPSIS_ASC',
  SynopsisDesc = 'SYNOPSIS_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/**
 * A connection to a list of `SeasonsProductionCountry` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type SeasonsProductionCountriesConnection = {
  __typename?: 'SeasonsProductionCountriesConnection';
  /** A list of edges which contains the `SeasonsProductionCountry` and cursor to aid in pagination. */
  edges: Array<SeasonsProductionCountriesEdge>;
  /** A list of `SeasonsProductionCountry` objects. */
  nodes: Array<SeasonsProductionCountry>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonsProductionCountry` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SeasonsProductionCountry` edge in the connection. */
export type SeasonsProductionCountriesEdge = {
  __typename?: 'SeasonsProductionCountriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SeasonsProductionCountry` at the end of the edge. */
  node: SeasonsProductionCountry;
};

/** Methods to use when ordering `SeasonsProductionCountry`. */
export enum SeasonsProductionCountriesOrderBy {
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonsProductionCountry = {
  __typename?: 'SeasonsProductionCountry';
  name: Scalars['String'];
  /** Reads a single `Season` that is related to this `SeasonsProductionCountry`. */
  season?: Maybe<Season>;
  seasonId: Scalars['Int'];
};

/**
 * A condition to be used against `SeasonsProductionCountry` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type SeasonsProductionCountryCondition = {
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `SeasonsProductionCountry` object types. All fields are combined with a logical ‘and.’ */
export type SeasonsProductionCountryFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonsProductionCountryFilter>>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonsProductionCountryFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonsProductionCountryFilter>>;
  /** Filter by the object’s `season` relation. */
  season?: InputMaybe<SeasonFilter>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `SeasonsProductionCountry` */
export type SeasonsProductionCountryInput = {
  /** @notEmpty() */
  name: Scalars['String'];
  seasonId: Scalars['Int'];
};

/** Represents an update to a `SeasonsProductionCountry`. Fields that are set will be updated. */
export type SeasonsProductionCountryPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonsSnapshot = {
  __typename?: 'SeasonsSnapshot';
  /** Reads a single `Season` that is related to this `SeasonsSnapshot`. */
  season?: Maybe<Season>;
  seasonId: Scalars['Int'];
  /** Reads a single `Snapshot` that is related to this `SeasonsSnapshot`. */
  snapshot?: Maybe<Snapshot>;
  snapshotId: Scalars['Int'];
};

/**
 * A condition to be used against `SeasonsSnapshot` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SeasonsSnapshotCondition = {
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `SeasonsSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type SeasonsSnapshotFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonsSnapshotFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonsSnapshotFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonsSnapshotFilter>>;
  /** Filter by the object’s `season` relation. */
  season?: InputMaybe<SeasonFilter>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `snapshot` relation. */
  snapshot?: InputMaybe<SnapshotFilter>;
  /** Filter by the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<IntFilter>;
};

/**
 * A connection to a list of `SeasonsSnapshot` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type SeasonsSnapshotsConnection = {
  __typename?: 'SeasonsSnapshotsConnection';
  /** A list of edges which contains the `SeasonsSnapshot` and cursor to aid in pagination. */
  edges: Array<SeasonsSnapshotsEdge>;
  /** A list of `SeasonsSnapshot` objects. */
  nodes: Array<SeasonsSnapshot>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonsSnapshot` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SeasonsSnapshot` edge in the connection. */
export type SeasonsSnapshotsEdge = {
  __typename?: 'SeasonsSnapshotsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SeasonsSnapshot` at the end of the edge. */
  node: SeasonsSnapshot;
};

/** Methods to use when ordering `SeasonsSnapshot`. */
export enum SeasonsSnapshotsOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC',
  SnapshotIdAsc = 'SNAPSHOT_ID_ASC',
  SnapshotIdDesc = 'SNAPSHOT_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonsTag = {
  __typename?: 'SeasonsTag';
  name: Scalars['String'];
  /** Reads a single `Season` that is related to this `SeasonsTag`. */
  season?: Maybe<Season>;
  seasonId: Scalars['Int'];
};

/**
 * A condition to be used against `SeasonsTag` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type SeasonsTagCondition = {
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `SeasonsTag` object types. All fields are combined with a logical ‘and.’ */
export type SeasonsTagFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonsTagFilter>>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonsTagFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonsTagFilter>>;
  /** Filter by the object’s `season` relation. */
  season?: InputMaybe<SeasonFilter>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `SeasonsTag` */
export type SeasonsTagInput = {
  /** @notEmpty() */
  name: Scalars['String'];
  seasonId: Scalars['Int'];
};

/** Represents an update to a `SeasonsTag`. Fields that are set will be updated. */
export type SeasonsTagPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `SeasonsTag` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type SeasonsTagsConnection = {
  __typename?: 'SeasonsTagsConnection';
  /** A list of edges which contains the `SeasonsTag` and cursor to aid in pagination. */
  edges: Array<SeasonsTagsEdge>;
  /** A list of `SeasonsTag` objects. */
  nodes: Array<SeasonsTag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonsTag` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SeasonsTag` edge in the connection. */
export type SeasonsTagsEdge = {
  __typename?: 'SeasonsTagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SeasonsTag` at the end of the edge. */
  node: SeasonsTag;
};

/** Methods to use when ordering `SeasonsTag`. */
export enum SeasonsTagsOrderBy {
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonsTrailer = {
  __typename?: 'SeasonsTrailer';
  /** Reads a single `Season` that is related to this `SeasonsTrailer`. */
  season?: Maybe<Season>;
  seasonId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/**
 * A condition to be used against `SeasonsTrailer` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SeasonsTrailerCondition = {
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `SeasonsTrailer` object types. All fields are combined with a logical ‘and.’ */
export type SeasonsTrailerFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonsTrailerFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonsTrailerFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonsTrailerFilter>>;
  /** Filter by the object’s `season` relation. */
  season?: InputMaybe<SeasonFilter>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `SeasonsTrailer` */
export type SeasonsTrailerInput = {
  seasonId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/**
 * A connection to a list of `SeasonsTrailer` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type SeasonsTrailersConnection = {
  __typename?: 'SeasonsTrailersConnection';
  /** A list of edges which contains the `SeasonsTrailer` and cursor to aid in pagination. */
  edges: Array<SeasonsTrailersEdge>;
  /** A list of `SeasonsTrailer` objects. */
  nodes: Array<SeasonsTrailer>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonsTrailer` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SeasonsTrailer` edge in the connection. */
export type SeasonsTrailersEdge = {
  __typename?: 'SeasonsTrailersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SeasonsTrailer` at the end of the edge. */
  node: SeasonsTrailer;
};

/** Methods to use when ordering `SeasonsTrailer`. */
export enum SeasonsTrailersOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type SeasonsTvshowGenre = {
  __typename?: 'SeasonsTvshowGenre';
  /** Reads a single `Season` that is related to this `SeasonsTvshowGenre`. */
  season?: Maybe<Season>;
  seasonId: Scalars['Int'];
  /** Reads a single `TvshowGenre` that is related to this `SeasonsTvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenre>;
  tvshowGenresId: Scalars['Int'];
};

/**
 * A condition to be used against `SeasonsTvshowGenre` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SeasonsTvshowGenreCondition = {
  /** Checks for equality with the object’s `seasonId` field. */
  seasonId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `tvshowGenresId` field. */
  tvshowGenresId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `SeasonsTvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type SeasonsTvshowGenreFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeasonsTvshowGenreFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<SeasonsTvshowGenreFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeasonsTvshowGenreFilter>>;
  /** Filter by the object’s `season` relation. */
  season?: InputMaybe<SeasonFilter>;
  /** Filter by the object’s `seasonId` field. */
  seasonId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `tvshowGenres` relation. */
  tvshowGenres?: InputMaybe<TvshowGenreFilter>;
  /** Filter by the object’s `tvshowGenresId` field. */
  tvshowGenresId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `SeasonsTvshowGenre` */
export type SeasonsTvshowGenreInput = {
  seasonId: Scalars['Int'];
  tvshowGenresId: Scalars['Int'];
};

/**
 * A connection to a list of `SeasonsTvshowGenre` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type SeasonsTvshowGenresConnection = {
  __typename?: 'SeasonsTvshowGenresConnection';
  /** A list of edges which contains the `SeasonsTvshowGenre` and cursor to aid in pagination. */
  edges: Array<SeasonsTvshowGenresEdge>;
  /** A list of `SeasonsTvshowGenre` objects. */
  nodes: Array<SeasonsTvshowGenre>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeasonsTvshowGenre` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SeasonsTvshowGenre` edge in the connection. */
export type SeasonsTvshowGenresEdge = {
  __typename?: 'SeasonsTvshowGenresEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SeasonsTvshowGenre` at the end of the edge. */
  node: SeasonsTvshowGenre;
};

/** Methods to use when ordering `SeasonsTvshowGenre`. */
export enum SeasonsTvshowGenresOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeasonIdAsc = 'SEASON_ID_ASC',
  SeasonIdDesc = 'SEASON_ID_DESC',
  TvshowGenresIdAsc = 'TVSHOW_GENRES_ID_ASC',
  TvshowGenresIdDesc = 'TVSHOW_GENRES_ID_DESC'
}

/**
 * Snapshots have custom RLS filtering, showing only snapshots of appropriate types based on user permissions.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type Snapshot = {
  __typename?: 'Snapshot';
  /** Reads and enables pagination through a set of `CollectionsSnapshot`. */
  collectionsSnapshots: CollectionsSnapshotsConnection;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  entityId: Scalars['Int'];
  entityTitle?: Maybe<Scalars['String']>;
  entityType: EntityType;
  /** Reads and enables pagination through a set of `EpisodesSnapshot`. */
  episodesSnapshots: EpisodesSnapshotsConnection;
  id: Scalars['Int'];
  isListSnapshot: Scalars['Boolean'];
  jobId: Scalars['String'];
  /** Reads and enables pagination through a set of `MoviesSnapshot`. */
  moviesSnapshots: MoviesSnapshotsConnection;
  publishId: Scalars['String'];
  publishedDate?: Maybe<Scalars['Datetime']>;
  scheduledDate?: Maybe<Scalars['Datetime']>;
  /** Reads and enables pagination through a set of `SeasonsSnapshot`. */
  seasonsSnapshots: SeasonsSnapshotsConnection;
  snapshotJson?: Maybe<Scalars['JSON']>;
  snapshotNo: Scalars['Int'];
  snapshotState: SnapshotState;
  /** Reads and enables pagination through a set of `SnapshotValidationResult`. */
  snapshotValidationResults: SnapshotValidationResultsConnection;
  /** Reads and enables pagination through a set of `TvshowsSnapshot`. */
  tvshowsSnapshots: TvshowsSnapshotsConnection;
  unpublishedDate?: Maybe<Scalars['Datetime']>;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
  validationStatus?: Maybe<SnapshotValidationStatus>;
};


/**
 * Snapshots have custom RLS filtering, showing only snapshots of appropriate types based on user permissions.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type SnapshotCollectionsSnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionsSnapshotCondition>;
  filter?: InputMaybe<CollectionsSnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionsSnapshotsOrderBy>>;
};


/**
 * Snapshots have custom RLS filtering, showing only snapshots of appropriate types based on user permissions.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type SnapshotEpisodesSnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesSnapshotCondition>;
  filter?: InputMaybe<EpisodesSnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesSnapshotsOrderBy>>;
};


/**
 * Snapshots have custom RLS filtering, showing only snapshots of appropriate types based on user permissions.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type SnapshotMoviesSnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<MoviesSnapshotCondition>;
  filter?: InputMaybe<MoviesSnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MoviesSnapshotsOrderBy>>;
};


/**
 * Snapshots have custom RLS filtering, showing only snapshots of appropriate types based on user permissions.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type SnapshotSeasonsSnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsSnapshotCondition>;
  filter?: InputMaybe<SeasonsSnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsSnapshotsOrderBy>>;
};


/**
 * Snapshots have custom RLS filtering, showing only snapshots of appropriate types based on user permissions.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type SnapshotSnapshotValidationResultsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SnapshotValidationResultCondition>;
  filter?: InputMaybe<SnapshotValidationResultFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SnapshotValidationResultsOrderBy>>;
};


/**
 * Snapshots have custom RLS filtering, showing only snapshots of appropriate types based on user permissions.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type SnapshotTvshowsSnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsSnapshotCondition>;
  filter?: InputMaybe<TvshowsSnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsSnapshotsOrderBy>>;
};

/**
 * A condition to be used against `Snapshot` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type SnapshotCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `entityId` field. */
  entityId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `entityTitle` field. */
  entityTitle?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `entityType` field. */
  entityType?: InputMaybe<EntityType>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `isListSnapshot` field. */
  isListSnapshot?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `jobId` field. */
  jobId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `publishId` field. */
  publishId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `scheduledDate` field. */
  scheduledDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `snapshotJson` field. */
  snapshotJson?: InputMaybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `snapshotNo` field. */
  snapshotNo?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `snapshotState` field. */
  snapshotState?: InputMaybe<SnapshotState>;
  /** Checks for equality with the object’s `unpublishedDate` field. */
  unpublishedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `validationStatus` field. */
  validationStatus?: InputMaybe<SnapshotValidationStatus>;
};

/** A filter to be used against `Snapshot` object types. All fields are combined with a logical ‘and.’ */
export type SnapshotFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SnapshotFilter>>;
  /** Filter by the object’s `collectionsSnapshots` relation. */
  collectionsSnapshots?: InputMaybe<SnapshotToManyCollectionsSnapshotFilter>;
  /** Some related `collectionsSnapshots` exist. */
  collectionsSnapshotsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `entityId` field. */
  entityId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `entityTitle` field. */
  entityTitle?: InputMaybe<StringFilter>;
  /** Filter by the object’s `entityType` field. */
  entityType?: InputMaybe<EntityTypeFilter>;
  /** Filter by the object’s `episodesSnapshots` relation. */
  episodesSnapshots?: InputMaybe<SnapshotToManyEpisodesSnapshotFilter>;
  /** Some related `episodesSnapshots` exist. */
  episodesSnapshotsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `isListSnapshot` field. */
  isListSnapshot?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `jobId` field. */
  jobId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `moviesSnapshots` relation. */
  moviesSnapshots?: InputMaybe<SnapshotToManyMoviesSnapshotFilter>;
  /** Some related `moviesSnapshots` exist. */
  moviesSnapshotsExist?: InputMaybe<Scalars['Boolean']>;
  /** Negates the expression. */
  not?: InputMaybe<SnapshotFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SnapshotFilter>>;
  /** Filter by the object’s `publishId` field. */
  publishId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `scheduledDate` field. */
  scheduledDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `seasonsSnapshots` relation. */
  seasonsSnapshots?: InputMaybe<SnapshotToManySeasonsSnapshotFilter>;
  /** Some related `seasonsSnapshots` exist. */
  seasonsSnapshotsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `snapshotNo` field. */
  snapshotNo?: InputMaybe<IntFilter>;
  /** Filter by the object’s `snapshotState` field. */
  snapshotState?: InputMaybe<SnapshotStateFilter>;
  /** Filter by the object’s `snapshotValidationResults` relation. */
  snapshotValidationResults?: InputMaybe<SnapshotToManySnapshotValidationResultFilter>;
  /** Some related `snapshotValidationResults` exist. */
  snapshotValidationResultsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `tvshowsSnapshots` relation. */
  tvshowsSnapshots?: InputMaybe<SnapshotToManyTvshowsSnapshotFilter>;
  /** Some related `tvshowsSnapshots` exist. */
  tvshowsSnapshotsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `unpublishedDate` field. */
  unpublishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `validationStatus` field. */
  validationStatus?: InputMaybe<SnapshotValidationStatusFilter>;
};

export enum SnapshotState {
  /** Error */
  Error = 'ERROR',
  /** Initialization */
  Initialization = 'INITIALIZATION',
  /** Invalid */
  Invalid = 'INVALID',
  /** Published */
  Published = 'PUBLISHED',
  /** Ready */
  Ready = 'READY',
  /** Scheduled */
  Scheduled = 'SCHEDULED',
  /** Unpublished */
  Unpublished = 'UNPUBLISHED',
  /** Validation */
  Validation = 'VALIDATION',
  /** Version Mismatch */
  VersionMismatch = 'VERSION_MISMATCH'
}

/** A filter to be used against SnapshotState fields. All fields are combined with a logical ‘and.’ */
export type SnapshotStateFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<SnapshotState>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<SnapshotState>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<SnapshotState>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<SnapshotState>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<SnapshotState>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<SnapshotState>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<SnapshotState>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<SnapshotState>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<SnapshotState>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<SnapshotState>>;
};

export type SnapshotSubscriptionPayload = {
  __typename?: 'SnapshotSubscriptionPayload';
  event?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  snapshot?: Maybe<Snapshot>;
};

/** A filter to be used against many `CollectionsSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type SnapshotToManyCollectionsSnapshotFilter = {
  /** Every related `CollectionsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CollectionsSnapshotFilter>;
  /** No related `CollectionsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CollectionsSnapshotFilter>;
  /** Some related `CollectionsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CollectionsSnapshotFilter>;
};

/** A filter to be used against many `EpisodesSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type SnapshotToManyEpisodesSnapshotFilter = {
  /** Every related `EpisodesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesSnapshotFilter>;
  /** No related `EpisodesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesSnapshotFilter>;
  /** Some related `EpisodesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesSnapshotFilter>;
};

/** A filter to be used against many `MoviesSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type SnapshotToManyMoviesSnapshotFilter = {
  /** Every related `MoviesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MoviesSnapshotFilter>;
  /** No related `MoviesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MoviesSnapshotFilter>;
  /** Some related `MoviesSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MoviesSnapshotFilter>;
};

/** A filter to be used against many `SeasonsSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type SnapshotToManySeasonsSnapshotFilter = {
  /** Every related `SeasonsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsSnapshotFilter>;
  /** No related `SeasonsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsSnapshotFilter>;
  /** Some related `SeasonsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsSnapshotFilter>;
};

/** A filter to be used against many `SnapshotValidationResult` object types. All fields are combined with a logical ‘and.’ */
export type SnapshotToManySnapshotValidationResultFilter = {
  /** Every related `SnapshotValidationResult` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SnapshotValidationResultFilter>;
  /** No related `SnapshotValidationResult` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SnapshotValidationResultFilter>;
  /** Some related `SnapshotValidationResult` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SnapshotValidationResultFilter>;
};

/** A filter to be used against many `TvshowsSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type SnapshotToManyTvshowsSnapshotFilter = {
  /** Every related `TvshowsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsSnapshotFilter>;
  /** No related `TvshowsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsSnapshotFilter>;
  /** Some related `TvshowsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsSnapshotFilter>;
};

export enum SnapshotValidationIssueContext {
  /** Image */
  Image = 'IMAGE',
  /** Licensing */
  Licensing = 'LICENSING',
  /** Metadata */
  Metadata = 'METADATA',
  /** Video */
  Video = 'VIDEO'
}

/** A filter to be used against SnapshotValidationIssueContext fields. All fields are combined with a logical ‘and.’ */
export type SnapshotValidationIssueContextFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<SnapshotValidationIssueContext>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<SnapshotValidationIssueContext>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<SnapshotValidationIssueContext>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<SnapshotValidationIssueContext>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<SnapshotValidationIssueContext>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<SnapshotValidationIssueContext>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<SnapshotValidationIssueContext>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<SnapshotValidationIssueContext>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<SnapshotValidationIssueContext>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<SnapshotValidationIssueContext>>;
};

export enum SnapshotValidationIssueSeverity {
  /** Error */
  Error = 'ERROR',
  /** Warning */
  Warning = 'WARNING'
}

/** A filter to be used against SnapshotValidationIssueSeverity fields. All fields are combined with a logical ‘and.’ */
export type SnapshotValidationIssueSeverityFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<SnapshotValidationIssueSeverity>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<SnapshotValidationIssueSeverity>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<SnapshotValidationIssueSeverity>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<SnapshotValidationIssueSeverity>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<SnapshotValidationIssueSeverity>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<SnapshotValidationIssueSeverity>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<SnapshotValidationIssueSeverity>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<SnapshotValidationIssueSeverity>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<SnapshotValidationIssueSeverity>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<SnapshotValidationIssueSeverity>>;
};

/** @permissions: MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN */
export type SnapshotValidationResult = {
  __typename?: 'SnapshotValidationResult';
  context: SnapshotValidationIssueContext;
  entityType: EntityType;
  id: Scalars['Int'];
  message: Scalars['String'];
  severity: SnapshotValidationIssueSeverity;
  /** Reads a single `Snapshot` that is related to this `SnapshotValidationResult`. */
  snapshot?: Maybe<Snapshot>;
  snapshotId: Scalars['Int'];
};

/**
 * A condition to be used against `SnapshotValidationResult` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type SnapshotValidationResultCondition = {
  /** Checks for equality with the object’s `context` field. */
  context?: InputMaybe<SnapshotValidationIssueContext>;
  /** Checks for equality with the object’s `entityType` field. */
  entityType?: InputMaybe<EntityType>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `message` field. */
  message?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `severity` field. */
  severity?: InputMaybe<SnapshotValidationIssueSeverity>;
  /** Checks for equality with the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `SnapshotValidationResult` object types. All fields are combined with a logical ‘and.’ */
export type SnapshotValidationResultFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SnapshotValidationResultFilter>>;
  /** Filter by the object’s `context` field. */
  context?: InputMaybe<SnapshotValidationIssueContextFilter>;
  /** Filter by the object’s `entityType` field. */
  entityType?: InputMaybe<EntityTypeFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `message` field. */
  message?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SnapshotValidationResultFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SnapshotValidationResultFilter>>;
  /** Filter by the object’s `severity` field. */
  severity?: InputMaybe<SnapshotValidationIssueSeverityFilter>;
  /** Filter by the object’s `snapshot` relation. */
  snapshot?: InputMaybe<SnapshotFilter>;
  /** Filter by the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<IntFilter>;
};

/**
 * A connection to a list of `SnapshotValidationResult` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type SnapshotValidationResultsConnection = {
  __typename?: 'SnapshotValidationResultsConnection';
  /** A list of edges which contains the `SnapshotValidationResult` and cursor to aid in pagination. */
  edges: Array<SnapshotValidationResultsEdge>;
  /** A list of `SnapshotValidationResult` objects. */
  nodes: Array<SnapshotValidationResult>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SnapshotValidationResult` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SnapshotValidationResult` edge in the connection. */
export type SnapshotValidationResultsEdge = {
  __typename?: 'SnapshotValidationResultsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SnapshotValidationResult` at the end of the edge. */
  node: SnapshotValidationResult;
};

/** Methods to use when ordering `SnapshotValidationResult`. */
export enum SnapshotValidationResultsOrderBy {
  ContextAsc = 'CONTEXT_ASC',
  ContextDesc = 'CONTEXT_DESC',
  EntityTypeAsc = 'ENTITY_TYPE_ASC',
  EntityTypeDesc = 'ENTITY_TYPE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MessageAsc = 'MESSAGE_ASC',
  MessageDesc = 'MESSAGE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SeverityAsc = 'SEVERITY_ASC',
  SeverityDesc = 'SEVERITY_DESC',
  SnapshotIdAsc = 'SNAPSHOT_ID_ASC',
  SnapshotIdDesc = 'SNAPSHOT_ID_DESC'
}

export enum SnapshotValidationStatus {
  /** Errors */
  Errors = 'ERRORS',
  /** OK */
  Ok = 'OK',
  /** Warnings */
  Warnings = 'WARNINGS'
}

/** A filter to be used against SnapshotValidationStatus fields. All fields are combined with a logical ‘and.’ */
export type SnapshotValidationStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<SnapshotValidationStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<SnapshotValidationStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<SnapshotValidationStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<SnapshotValidationStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<SnapshotValidationStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<SnapshotValidationStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<SnapshotValidationStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<SnapshotValidationStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<SnapshotValidationStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<SnapshotValidationStatus>>;
};

/**
 * A connection to a list of `Snapshot` values.
 * @permissions: MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN
 */
export type SnapshotsConnection = {
  __typename?: 'SnapshotsConnection';
  /** A list of edges which contains the `Snapshot` and cursor to aid in pagination. */
  edges: Array<SnapshotsEdge>;
  /** A list of `Snapshot` objects. */
  nodes: Array<Snapshot>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Snapshot` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Snapshot` edge in the connection. */
export type SnapshotsEdge = {
  __typename?: 'SnapshotsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Snapshot` at the end of the edge. */
  node: Snapshot;
};

/** Methods to use when ordering `Snapshot`. */
export enum SnapshotsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  EntityIdAsc = 'ENTITY_ID_ASC',
  EntityIdDesc = 'ENTITY_ID_DESC',
  EntityTitleAsc = 'ENTITY_TITLE_ASC',
  EntityTitleDesc = 'ENTITY_TITLE_DESC',
  EntityTypeAsc = 'ENTITY_TYPE_ASC',
  EntityTypeDesc = 'ENTITY_TYPE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsListSnapshotAsc = 'IS_LIST_SNAPSHOT_ASC',
  IsListSnapshotDesc = 'IS_LIST_SNAPSHOT_DESC',
  JobIdAsc = 'JOB_ID_ASC',
  JobIdDesc = 'JOB_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PublishedDateAsc = 'PUBLISHED_DATE_ASC',
  PublishedDateDesc = 'PUBLISHED_DATE_DESC',
  PublishIdAsc = 'PUBLISH_ID_ASC',
  PublishIdDesc = 'PUBLISH_ID_DESC',
  ScheduledDateAsc = 'SCHEDULED_DATE_ASC',
  ScheduledDateDesc = 'SCHEDULED_DATE_DESC',
  SnapshotJsonAsc = 'SNAPSHOT_JSON_ASC',
  SnapshotJsonDesc = 'SNAPSHOT_JSON_DESC',
  SnapshotNoAsc = 'SNAPSHOT_NO_ASC',
  SnapshotNoDesc = 'SNAPSHOT_NO_DESC',
  SnapshotStateAsc = 'SNAPSHOT_STATE_ASC',
  SnapshotStateDesc = 'SNAPSHOT_STATE_DESC',
  UnpublishedDateAsc = 'UNPUBLISHED_DATE_ASC',
  UnpublishedDateDesc = 'UNPUBLISHED_DATE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC',
  ValidationStatusAsc = 'VALIDATION_STATUS_ASC',
  ValidationStatusDesc = 'VALIDATION_STATUS_DESC'
}

export type StartIngestInput = {
  file: Scalars['Upload'];
};

export type StartIngestPayload = {
  __typename?: 'StartIngestPayload';
  ingestDocument?: Maybe<IngestDocument>;
  query?: Maybe<Query>;
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
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']>;
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
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']>;
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
  /** Triggered when a Collection is mutated (insert, update or delete).  */
  collectionMutated?: Maybe<CollectionSubscriptionPayload>;
  /** Triggered when a Episode is mutated (insert, update or delete).  */
  episodeMutated?: Maybe<EpisodeSubscriptionPayload>;
  /** Triggered when a IngestDocument is mutated (insert, update or delete).  */
  ingestDocumentMutated?: Maybe<IngestDocumentSubscriptionPayload>;
  /** Triggered when a MovieGenre is mutated (insert, update or delete).  */
  movieGenreMutated?: Maybe<MovieGenreSubscriptionPayload>;
  /** Triggered when a Movie is mutated (insert, update or delete).  */
  movieMutated?: Maybe<MovieSubscriptionPayload>;
  /** Triggered when a Season is mutated (insert, update or delete).  */
  seasonMutated?: Maybe<SeasonSubscriptionPayload>;
  /** Triggered when a Snapshot is mutated (insert, update or delete).  */
  snapshotMutated?: Maybe<SnapshotSubscriptionPayload>;
  /** Triggered when a TvshowGenre is mutated (insert, update or delete).  */
  tvshowGenreMutated?: Maybe<TvshowGenreSubscriptionPayload>;
  /** Triggered when a Tvshow is mutated (insert, update or delete).  */
  tvshowMutated?: Maybe<TvshowSubscriptionPayload>;
};

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type Tvshow = {
  __typename?: 'Tvshow';
  /** Reads and enables pagination through a set of `CollectionRelation`. */
  collectionRelations: CollectionRelationsConnection;
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  externalId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  originalTitle?: Maybe<Scalars['String']>;
  publishStatus: PublishStatus;
  publishedDate?: Maybe<Scalars['Datetime']>;
  publishedUser?: Maybe<Scalars['String']>;
  released?: Maybe<Scalars['Date']>;
  /** Reads and enables pagination through a set of `Season`. */
  seasons: SeasonsConnection;
  studio?: Maybe<Scalars['String']>;
  synopsis?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  /** Reads and enables pagination through a set of `TvshowsCast`. */
  tvshowsCasts: TvshowsCastsConnection;
  /** Reads and enables pagination through a set of `TvshowsImage`. */
  tvshowsImages: TvshowsImagesConnection;
  /** Reads and enables pagination through a set of `TvshowsLicense`. */
  tvshowsLicenses: TvshowsLicensesConnection;
  /** Reads and enables pagination through a set of `TvshowsProductionCountry`. */
  tvshowsProductionCountries: TvshowsProductionCountriesConnection;
  /** Reads and enables pagination through a set of `TvshowsSnapshot`. */
  tvshowsSnapshots: TvshowsSnapshotsConnection;
  /** Reads and enables pagination through a set of `TvshowsTag`. */
  tvshowsTags: TvshowsTagsConnection;
  /** Reads and enables pagination through a set of `TvshowsTrailer`. */
  tvshowsTrailers: TvshowsTrailersConnection;
  /** Reads and enables pagination through a set of `TvshowsTvshowGenre`. */
  tvshowsTvshowGenres: TvshowsTvshowGenresConnection;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowCollectionRelationsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<CollectionRelationCondition>;
  filter?: InputMaybe<CollectionRelationFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<CollectionRelationsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowSeasonsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonCondition>;
  filter?: InputMaybe<SeasonFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowTvshowsCastsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsCastCondition>;
  filter?: InputMaybe<TvshowsCastFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsCastsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowTvshowsImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsImageCondition>;
  filter?: InputMaybe<TvshowsImageFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsImagesOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowTvshowsLicensesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsLicenseCondition>;
  filter?: InputMaybe<TvshowsLicenseFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsLicensesOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowTvshowsProductionCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsProductionCountryCondition>;
  filter?: InputMaybe<TvshowsProductionCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsProductionCountriesOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowTvshowsSnapshotsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsSnapshotCondition>;
  filter?: InputMaybe<TvshowsSnapshotFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsSnapshotsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowTvshowsTagsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsTagCondition>;
  filter?: InputMaybe<TvshowsTagFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsTagsOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowTvshowsTrailersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsTrailerCondition>;
  filter?: InputMaybe<TvshowsTrailerFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsTrailersOrderBy>>;
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowTvshowsTvshowGenresArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsTvshowGenreCondition>;
  filter?: InputMaybe<TvshowsTvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsTvshowGenresOrderBy>>;
};

/** A condition to be used against `Tvshow` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TvshowCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `originalTitle` field. */
  originalTitle?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `publishStatus` field. */
  publishStatus?: InputMaybe<PublishStatus>;
  /** Checks for equality with the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `released` field. */
  released?: InputMaybe<Scalars['Date']>;
  /** Checks for equality with the object’s `studio` field. */
  studio?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `synopsis` field. */
  synopsis?: InputMaybe<Scalars['String']>;
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
};

/** A filter to be used against `Tvshow` object types. All fields are combined with a logical ‘and.’ */
export type TvshowFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowFilter>>;
  /** Filter by the object’s `collectionRelations` relation. */
  collectionRelations?: InputMaybe<TvshowToManyCollectionRelationFilter>;
  /** Some related `collectionRelations` exist. */
  collectionRelationsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalId` field. */
  externalId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowFilter>>;
  /** Filter by the object’s `originalTitle` field. */
  originalTitle?: InputMaybe<StringFilter>;
  /** Filter by the object’s `publishStatus` field. */
  publishStatus?: InputMaybe<PublishStatusFilter>;
  /** Filter by the object’s `publishedDate` field. */
  publishedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `publishedUser` field. */
  publishedUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `released` field. */
  released?: InputMaybe<DateFilter>;
  /** Filter by the object’s `seasons` relation. */
  seasons?: InputMaybe<TvshowToManySeasonFilter>;
  /** Some related `seasons` exist. */
  seasonsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `studio` field. */
  studio?: InputMaybe<StringFilter>;
  /** Filter by the object’s `synopsis` field. */
  synopsis?: InputMaybe<StringFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tvshowsCasts` relation. */
  tvshowsCasts?: InputMaybe<TvshowToManyTvshowsCastFilter>;
  /** Some related `tvshowsCasts` exist. */
  tvshowsCastsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `tvshowsImages` relation. */
  tvshowsImages?: InputMaybe<TvshowToManyTvshowsImageFilter>;
  /** Some related `tvshowsImages` exist. */
  tvshowsImagesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `tvshowsLicenses` relation. */
  tvshowsLicenses?: InputMaybe<TvshowToManyTvshowsLicenseFilter>;
  /** Some related `tvshowsLicenses` exist. */
  tvshowsLicensesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `tvshowsProductionCountries` relation. */
  tvshowsProductionCountries?: InputMaybe<TvshowToManyTvshowsProductionCountryFilter>;
  /** Some related `tvshowsProductionCountries` exist. */
  tvshowsProductionCountriesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `tvshowsSnapshots` relation. */
  tvshowsSnapshots?: InputMaybe<TvshowToManyTvshowsSnapshotFilter>;
  /** Some related `tvshowsSnapshots` exist. */
  tvshowsSnapshotsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `tvshowsTags` relation. */
  tvshowsTags?: InputMaybe<TvshowToManyTvshowsTagFilter>;
  /** Some related `tvshowsTags` exist. */
  tvshowsTagsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `tvshowsTrailers` relation. */
  tvshowsTrailers?: InputMaybe<TvshowToManyTvshowsTrailerFilter>;
  /** Some related `tvshowsTrailers` exist. */
  tvshowsTrailersExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `tvshowsTvshowGenres` relation. */
  tvshowsTvshowGenres?: InputMaybe<TvshowToManyTvshowsTvshowGenreFilter>;
  /** Some related `tvshowsTvshowGenres` exist. */
  tvshowsTvshowGenresExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type TvshowGenre = {
  __typename?: 'TvshowGenre';
  createdDate: Scalars['Datetime'];
  createdUser: Scalars['String'];
  /** Reads and enables pagination through a set of `EpisodesTvshowGenre`. */
  episodesTvshowGenresByTvshowGenresId: EpisodesTvshowGenresConnection;
  id: Scalars['Int'];
  /** Reads and enables pagination through a set of `SeasonsTvshowGenre`. */
  seasonsTvshowGenresByTvshowGenresId: SeasonsTvshowGenresConnection;
  sortOrder: Scalars['Int'];
  title: Scalars['String'];
  /** Reads and enables pagination through a set of `TvshowsTvshowGenre`. */
  tvshowsTvshowGenresByTvshowGenresId: TvshowsTvshowGenresConnection;
  updatedDate: Scalars['Datetime'];
  updatedUser: Scalars['String'];
};


/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type TvshowGenreEpisodesTvshowGenresByTvshowGenresIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<EpisodesTvshowGenreCondition>;
  filter?: InputMaybe<EpisodesTvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<EpisodesTvshowGenresOrderBy>>;
};


/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type TvshowGenreSeasonsTvshowGenresByTvshowGenresIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SeasonsTvshowGenreCondition>;
  filter?: InputMaybe<SeasonsTvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SeasonsTvshowGenresOrderBy>>;
};


/** @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN */
export type TvshowGenreTvshowsTvshowGenresByTvshowGenresIdArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsTvshowGenreCondition>;
  filter?: InputMaybe<TvshowsTvshowGenreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsTvshowGenresOrderBy>>;
};

/**
 * A condition to be used against `TvshowGenre` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TvshowGenreCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `createdUser` field. */
  createdUser?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `sortOrder` field. */
  sortOrder?: InputMaybe<Scalars['Int']>;
  /**
   * Checks for equality with the object’s `title` field.
   * @isTrimmed()
   * @maxLength(50)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `TvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type TvshowGenreFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowGenreFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `createdUser` field. */
  createdUser?: InputMaybe<StringFilter>;
  /** Filter by the object’s `episodesTvshowGenresByTvshowGenresId` relation. */
  episodesTvshowGenresByTvshowGenresId?: InputMaybe<TvshowGenreToManyEpisodesTvshowGenreFilter>;
  /** Some related `episodesTvshowGenresByTvshowGenresId` exist. */
  episodesTvshowGenresByTvshowGenresIdExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowGenreFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowGenreFilter>>;
  /** Filter by the object’s `seasonsTvshowGenresByTvshowGenresId` relation. */
  seasonsTvshowGenresByTvshowGenresId?: InputMaybe<TvshowGenreToManySeasonsTvshowGenreFilter>;
  /** Some related `seasonsTvshowGenresByTvshowGenresId` exist. */
  seasonsTvshowGenresByTvshowGenresIdExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `sortOrder` field. */
  sortOrder?: InputMaybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tvshowsTvshowGenresByTvshowGenresId` relation. */
  tvshowsTvshowGenresByTvshowGenresId?: InputMaybe<TvshowGenreToManyTvshowsTvshowGenreFilter>;
  /** Some related `tvshowsTvshowGenresByTvshowGenresId` exist. */
  tvshowsTvshowGenresByTvshowGenresIdExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `updatedUser` field. */
  updatedUser?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `TvshowGenre` */
export type TvshowGenreInput = {
  sortOrder: Scalars['Int'];
  /**
   * @isTrimmed()
   * @maxLength(50)
   * @notEmpty()
   */
  title: Scalars['String'];
};

/** Represents an update to a `TvshowGenre`. Fields that are set will be updated. */
export type TvshowGenrePatch = {
  sortOrder?: InputMaybe<Scalars['Int']>;
  /**
   * @isTrimmed()
   * @maxLength(50)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

export type TvshowGenreSubscriptionPayload = {
  __typename?: 'TvshowGenreSubscriptionPayload';
  event?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  tvshowGenre?: Maybe<TvshowGenre>;
};

/** A filter to be used against many `EpisodesTvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type TvshowGenreToManyEpisodesTvshowGenreFilter = {
  /** Every related `EpisodesTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EpisodesTvshowGenreFilter>;
  /** No related `EpisodesTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EpisodesTvshowGenreFilter>;
  /** Some related `EpisodesTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EpisodesTvshowGenreFilter>;
};

/** A filter to be used against many `SeasonsTvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type TvshowGenreToManySeasonsTvshowGenreFilter = {
  /** Every related `SeasonsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonsTvshowGenreFilter>;
  /** No related `SeasonsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonsTvshowGenreFilter>;
  /** Some related `SeasonsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonsTvshowGenreFilter>;
};

/** A filter to be used against many `TvshowsTvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type TvshowGenreToManyTvshowsTvshowGenreFilter = {
  /** Every related `TvshowsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsTvshowGenreFilter>;
  /** No related `TvshowsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsTvshowGenreFilter>;
  /** Some related `TvshowsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsTvshowGenreFilter>;
};

/**
 * A connection to a list of `TvshowGenre` values.
 * @permissions: SETTINGS_VIEW,SETTINGS_EDIT,ADMIN
 */
export type TvshowGenresConnection = {
  __typename?: 'TvshowGenresConnection';
  /** A list of edges which contains the `TvshowGenre` and cursor to aid in pagination. */
  edges: Array<TvshowGenresEdge>;
  /** A list of `TvshowGenre` objects. */
  nodes: Array<TvshowGenre>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowGenre` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TvshowGenre` edge in the connection. */
export type TvshowGenresEdge = {
  __typename?: 'TvshowGenresEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TvshowGenre` at the end of the edge. */
  node: TvshowGenre;
};

/** Methods to use when ordering `TvshowGenre`. */
export enum TvshowGenresOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SortOrderAsc = 'SORT_ORDER_ASC',
  SortOrderDesc = 'SORT_ORDER_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

export enum TvshowImageType {
  /** Cover */
  Cover = 'COVER',
  /** Teaser */
  Teaser = 'TEASER'
}

/** A filter to be used against TvshowImageType fields. All fields are combined with a logical ‘and.’ */
export type TvshowImageTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<TvshowImageType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<TvshowImageType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<TvshowImageType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<TvshowImageType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<TvshowImageType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<TvshowImageType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<TvshowImageType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<TvshowImageType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<TvshowImageType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<TvshowImageType>>;
};

/** An input for mutations affecting `Tvshow` */
export type TvshowInput = {
  description?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  originalTitle?: InputMaybe<Scalars['String']>;
  released?: InputMaybe<Scalars['Date']>;
  studio?: InputMaybe<Scalars['String']>;
  synopsis?: InputMaybe<Scalars['String']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title: Scalars['String'];
};

/** Represents an update to a `Tvshow`. Fields that are set will be updated. */
export type TvshowPatch = {
  description?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  originalTitle?: InputMaybe<Scalars['String']>;
  released?: InputMaybe<Scalars['Date']>;
  studio?: InputMaybe<Scalars['String']>;
  synopsis?: InputMaybe<Scalars['String']>;
  /**
   * @maxLength(100)
   * @notEmpty()
   */
  title?: InputMaybe<Scalars['String']>;
};

export type TvshowSubscriptionPayload = {
  __typename?: 'TvshowSubscriptionPayload';
  event?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  tvshow?: Maybe<Tvshow>;
};

/** A filter to be used against many `CollectionRelation` object types. All fields are combined with a logical ‘and.’ */
export type TvshowToManyCollectionRelationFilter = {
  /** Every related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CollectionRelationFilter>;
  /** No related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CollectionRelationFilter>;
  /** Some related `CollectionRelation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CollectionRelationFilter>;
};

/** A filter to be used against many `Season` object types. All fields are combined with a logical ‘and.’ */
export type TvshowToManySeasonFilter = {
  /** Every related `Season` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SeasonFilter>;
  /** No related `Season` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SeasonFilter>;
  /** Some related `Season` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SeasonFilter>;
};

/** A filter to be used against many `TvshowsCast` object types. All fields are combined with a logical ‘and.’ */
export type TvshowToManyTvshowsCastFilter = {
  /** Every related `TvshowsCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsCastFilter>;
  /** No related `TvshowsCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsCastFilter>;
  /** Some related `TvshowsCast` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsCastFilter>;
};

/** A filter to be used against many `TvshowsImage` object types. All fields are combined with a logical ‘and.’ */
export type TvshowToManyTvshowsImageFilter = {
  /** Every related `TvshowsImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsImageFilter>;
  /** No related `TvshowsImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsImageFilter>;
  /** Some related `TvshowsImage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsImageFilter>;
};

/** A filter to be used against many `TvshowsLicense` object types. All fields are combined with a logical ‘and.’ */
export type TvshowToManyTvshowsLicenseFilter = {
  /** Every related `TvshowsLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsLicenseFilter>;
  /** No related `TvshowsLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsLicenseFilter>;
  /** Some related `TvshowsLicense` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsLicenseFilter>;
};

/** A filter to be used against many `TvshowsProductionCountry` object types. All fields are combined with a logical ‘and.’ */
export type TvshowToManyTvshowsProductionCountryFilter = {
  /** Every related `TvshowsProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsProductionCountryFilter>;
  /** No related `TvshowsProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsProductionCountryFilter>;
  /** Some related `TvshowsProductionCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsProductionCountryFilter>;
};

/** A filter to be used against many `TvshowsSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type TvshowToManyTvshowsSnapshotFilter = {
  /** Every related `TvshowsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsSnapshotFilter>;
  /** No related `TvshowsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsSnapshotFilter>;
  /** Some related `TvshowsSnapshot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsSnapshotFilter>;
};

/** A filter to be used against many `TvshowsTag` object types. All fields are combined with a logical ‘and.’ */
export type TvshowToManyTvshowsTagFilter = {
  /** Every related `TvshowsTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsTagFilter>;
  /** No related `TvshowsTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsTagFilter>;
  /** Some related `TvshowsTag` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsTagFilter>;
};

/** A filter to be used against many `TvshowsTrailer` object types. All fields are combined with a logical ‘and.’ */
export type TvshowToManyTvshowsTrailerFilter = {
  /** Every related `TvshowsTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsTrailerFilter>;
  /** No related `TvshowsTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsTrailerFilter>;
  /** Some related `TvshowsTrailer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsTrailerFilter>;
};

/** A filter to be used against many `TvshowsTvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type TvshowToManyTvshowsTvshowGenreFilter = {
  /** Every related `TvshowsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsTvshowGenreFilter>;
  /** No related `TvshowsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsTvshowGenreFilter>;
  /** Some related `TvshowsTvshowGenre` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsTvshowGenreFilter>;
};

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowsCast = {
  __typename?: 'TvshowsCast';
  name: Scalars['String'];
  /** Reads a single `Tvshow` that is related to this `TvshowsCast`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId: Scalars['Int'];
};

/**
 * A condition to be used against `TvshowsCast` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TvshowsCastCondition = {
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `TvshowsCast` object types. All fields are combined with a logical ‘and.’ */
export type TvshowsCastFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowsCastFilter>>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowsCastFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowsCastFilter>>;
  /** Filter by the object’s `tvshow` relation. */
  tvshow?: InputMaybe<TvshowFilter>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `TvshowsCast` */
export type TvshowsCastInput = {
  /** @notEmpty() */
  name: Scalars['String'];
  tvshowId: Scalars['Int'];
};

/** Represents an update to a `TvshowsCast`. Fields that are set will be updated. */
export type TvshowsCastPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `TvshowsCast` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type TvshowsCastsConnection = {
  __typename?: 'TvshowsCastsConnection';
  /** A list of edges which contains the `TvshowsCast` and cursor to aid in pagination. */
  edges: Array<TvshowsCastsEdge>;
  /** A list of `TvshowsCast` objects. */
  nodes: Array<TvshowsCast>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowsCast` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TvshowsCast` edge in the connection. */
export type TvshowsCastsEdge = {
  __typename?: 'TvshowsCastsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TvshowsCast` at the end of the edge. */
  node: TvshowsCast;
};

/** Methods to use when ordering `TvshowsCast`. */
export enum TvshowsCastsOrderBy {
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/**
 * A connection to a list of `Tvshow` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type TvshowsConnection = {
  __typename?: 'TvshowsConnection';
  /** A list of edges which contains the `Tvshow` and cursor to aid in pagination. */
  edges: Array<TvshowsEdge>;
  /** A list of `Tvshow` objects. */
  nodes: Array<Tvshow>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Tvshow` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Tvshow` edge in the connection. */
export type TvshowsEdge = {
  __typename?: 'TvshowsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Tvshow` at the end of the edge. */
  node: Tvshow;
};

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowsImage = {
  __typename?: 'TvshowsImage';
  imageId: Scalars['UUID'];
  imageType: TvshowImageType;
  /** Reads a single `Tvshow` that is related to this `TvshowsImage`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId: Scalars['Int'];
};

/**
 * A condition to be used against `TvshowsImage` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TvshowsImageCondition = {
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `imageType` field. */
  imageType?: InputMaybe<TvshowImageType>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `TvshowsImage` object types. All fields are combined with a logical ‘and.’ */
export type TvshowsImageFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowsImageFilter>>;
  /** Filter by the object’s `imageId` field. */
  imageId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `imageType` field. */
  imageType?: InputMaybe<TvshowImageTypeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowsImageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowsImageFilter>>;
  /** Filter by the object’s `tvshow` relation. */
  tvshow?: InputMaybe<TvshowFilter>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `TvshowsImage` */
export type TvshowsImageInput = {
  imageId: Scalars['UUID'];
  imageType: TvshowImageType;
  tvshowId: Scalars['Int'];
};

/** Represents an update to a `TvshowsImage`. Fields that are set will be updated. */
export type TvshowsImagePatch = {
  imageId?: InputMaybe<Scalars['UUID']>;
  imageType?: InputMaybe<TvshowImageType>;
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/**
 * A connection to a list of `TvshowsImage` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type TvshowsImagesConnection = {
  __typename?: 'TvshowsImagesConnection';
  /** A list of edges which contains the `TvshowsImage` and cursor to aid in pagination. */
  edges: Array<TvshowsImagesEdge>;
  /** A list of `TvshowsImage` objects. */
  nodes: Array<TvshowsImage>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowsImage` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TvshowsImage` edge in the connection. */
export type TvshowsImagesEdge = {
  __typename?: 'TvshowsImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TvshowsImage` at the end of the edge. */
  node: TvshowsImage;
};

/** Methods to use when ordering `TvshowsImage`. */
export enum TvshowsImagesOrderBy {
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  ImageTypeAsc = 'IMAGE_TYPE_ASC',
  ImageTypeDesc = 'IMAGE_TYPE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowsLicense = {
  __typename?: 'TvshowsLicense';
  createdDate: Scalars['Datetime'];
  id: Scalars['Int'];
  licenseEnd?: Maybe<Scalars['Datetime']>;
  licenseStart?: Maybe<Scalars['Datetime']>;
  /** Reads a single `Tvshow` that is related to this `TvshowsLicense`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId: Scalars['Int'];
  /** Reads and enables pagination through a set of `TvshowsLicensesCountry`. */
  tvshowsLicensesCountries: TvshowsLicensesCountriesConnection;
  updatedDate: Scalars['Datetime'];
};


/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowsLicenseTvshowsLicensesCountriesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TvshowsLicensesCountryCondition>;
  filter?: InputMaybe<TvshowsLicensesCountryFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TvshowsLicensesCountriesOrderBy>>;
};

/**
 * A condition to be used against `TvshowsLicense` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TvshowsLicenseCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `licenseEnd` field. */
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `licenseStart` field. */
  licenseStart?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
};

/** A filter to be used against `TvshowsLicense` object types. All fields are combined with a logical ‘and.’ */
export type TvshowsLicenseFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowsLicenseFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `licenseEnd` field. */
  licenseEnd?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `licenseStart` field. */
  licenseStart?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowsLicenseFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowsLicenseFilter>>;
  /** Filter by the object’s `tvshow` relation. */
  tvshow?: InputMaybe<TvshowFilter>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `tvshowsLicensesCountries` relation. */
  tvshowsLicensesCountries?: InputMaybe<TvshowsLicenseToManyTvshowsLicensesCountryFilter>;
  /** Some related `tvshowsLicensesCountries` exist. */
  tvshowsLicensesCountriesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
};

/** An input for mutations affecting `TvshowsLicense` */
export type TvshowsLicenseInput = {
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  licenseStart?: InputMaybe<Scalars['Datetime']>;
  tvshowId: Scalars['Int'];
};

/** Represents an update to a `TvshowsLicense`. Fields that are set will be updated. */
export type TvshowsLicensePatch = {
  licenseEnd?: InputMaybe<Scalars['Datetime']>;
  licenseStart?: InputMaybe<Scalars['Datetime']>;
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against many `TvshowsLicensesCountry` object types. All fields are combined with a logical ‘and.’ */
export type TvshowsLicenseToManyTvshowsLicensesCountryFilter = {
  /** Every related `TvshowsLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TvshowsLicensesCountryFilter>;
  /** No related `TvshowsLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TvshowsLicensesCountryFilter>;
  /** Some related `TvshowsLicensesCountry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TvshowsLicensesCountryFilter>;
};

/**
 * A connection to a list of `TvshowsLicense` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type TvshowsLicensesConnection = {
  __typename?: 'TvshowsLicensesConnection';
  /** A list of edges which contains the `TvshowsLicense` and cursor to aid in pagination. */
  edges: Array<TvshowsLicensesEdge>;
  /** A list of `TvshowsLicense` objects. */
  nodes: Array<TvshowsLicense>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowsLicense` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/**
 * A connection to a list of `TvshowsLicensesCountry` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type TvshowsLicensesCountriesConnection = {
  __typename?: 'TvshowsLicensesCountriesConnection';
  /** A list of edges which contains the `TvshowsLicensesCountry` and cursor to aid in pagination. */
  edges: Array<TvshowsLicensesCountriesEdge>;
  /** A list of `TvshowsLicensesCountry` objects. */
  nodes: Array<TvshowsLicensesCountry>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowsLicensesCountry` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TvshowsLicensesCountry` edge in the connection. */
export type TvshowsLicensesCountriesEdge = {
  __typename?: 'TvshowsLicensesCountriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TvshowsLicensesCountry` at the end of the edge. */
  node: TvshowsLicensesCountry;
};

/** Methods to use when ordering `TvshowsLicensesCountry`. */
export enum TvshowsLicensesCountriesOrderBy {
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowsLicenseIdAsc = 'TVSHOWS_LICENSE_ID_ASC',
  TvshowsLicenseIdDesc = 'TVSHOWS_LICENSE_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowsLicensesCountry = {
  __typename?: 'TvshowsLicensesCountry';
  code: IsoAlphaTwoCountryCodes;
  /** Reads a single `TvshowsLicense` that is related to this `TvshowsLicensesCountry`. */
  tvshowsLicense?: Maybe<TvshowsLicense>;
  tvshowsLicenseId: Scalars['Int'];
};

/**
 * A condition to be used against `TvshowsLicensesCountry` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type TvshowsLicensesCountryCondition = {
  /** Checks for equality with the object’s `code` field. */
  code?: InputMaybe<IsoAlphaTwoCountryCodes>;
  /** Checks for equality with the object’s `tvshowsLicenseId` field. */
  tvshowsLicenseId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `TvshowsLicensesCountry` object types. All fields are combined with a logical ‘and.’ */
export type TvshowsLicensesCountryFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowsLicensesCountryFilter>>;
  /** Filter by the object’s `code` field. */
  code?: InputMaybe<IsoAlphaTwoCountryCodesFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowsLicensesCountryFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowsLicensesCountryFilter>>;
  /** Filter by the object’s `tvshowsLicense` relation. */
  tvshowsLicense?: InputMaybe<TvshowsLicenseFilter>;
  /** Filter by the object’s `tvshowsLicenseId` field. */
  tvshowsLicenseId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `TvshowsLicensesCountry` */
export type TvshowsLicensesCountryInput = {
  code: IsoAlphaTwoCountryCodes;
  tvshowsLicenseId: Scalars['Int'];
};

/** Represents an update to a `TvshowsLicensesCountry`. Fields that are set will be updated. */
export type TvshowsLicensesCountryPatch = {
  code?: InputMaybe<IsoAlphaTwoCountryCodes>;
};

/** A `TvshowsLicense` edge in the connection. */
export type TvshowsLicensesEdge = {
  __typename?: 'TvshowsLicensesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TvshowsLicense` at the end of the edge. */
  node: TvshowsLicense;
};

/** Methods to use when ordering `TvshowsLicense`. */
export enum TvshowsLicensesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LicenseEndAsc = 'LICENSE_END_ASC',
  LicenseEndDesc = 'LICENSE_END_DESC',
  LicenseStartAsc = 'LICENSE_START_ASC',
  LicenseStartDesc = 'LICENSE_START_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC'
}

/** Methods to use when ordering `Tvshow`. */
export enum TvshowsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CreatedUserAsc = 'CREATED_USER_ASC',
  CreatedUserDesc = 'CREATED_USER_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OriginalTitleAsc = 'ORIGINAL_TITLE_ASC',
  OriginalTitleDesc = 'ORIGINAL_TITLE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PublishedDateAsc = 'PUBLISHED_DATE_ASC',
  PublishedDateDesc = 'PUBLISHED_DATE_DESC',
  PublishedUserAsc = 'PUBLISHED_USER_ASC',
  PublishedUserDesc = 'PUBLISHED_USER_DESC',
  PublishStatusAsc = 'PUBLISH_STATUS_ASC',
  PublishStatusDesc = 'PUBLISH_STATUS_DESC',
  ReleasedAsc = 'RELEASED_ASC',
  ReleasedDesc = 'RELEASED_DESC',
  StudioAsc = 'STUDIO_ASC',
  StudioDesc = 'STUDIO_DESC',
  SynopsisAsc = 'SYNOPSIS_ASC',
  SynopsisDesc = 'SYNOPSIS_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UpdatedUserAsc = 'UPDATED_USER_ASC',
  UpdatedUserDesc = 'UPDATED_USER_DESC'
}

/**
 * A connection to a list of `TvshowsProductionCountry` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type TvshowsProductionCountriesConnection = {
  __typename?: 'TvshowsProductionCountriesConnection';
  /** A list of edges which contains the `TvshowsProductionCountry` and cursor to aid in pagination. */
  edges: Array<TvshowsProductionCountriesEdge>;
  /** A list of `TvshowsProductionCountry` objects. */
  nodes: Array<TvshowsProductionCountry>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowsProductionCountry` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TvshowsProductionCountry` edge in the connection. */
export type TvshowsProductionCountriesEdge = {
  __typename?: 'TvshowsProductionCountriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TvshowsProductionCountry` at the end of the edge. */
  node: TvshowsProductionCountry;
};

/** Methods to use when ordering `TvshowsProductionCountry`. */
export enum TvshowsProductionCountriesOrderBy {
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowsProductionCountry = {
  __typename?: 'TvshowsProductionCountry';
  name: Scalars['String'];
  /** Reads a single `Tvshow` that is related to this `TvshowsProductionCountry`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId: Scalars['Int'];
};

/**
 * A condition to be used against `TvshowsProductionCountry` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type TvshowsProductionCountryCondition = {
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `TvshowsProductionCountry` object types. All fields are combined with a logical ‘and.’ */
export type TvshowsProductionCountryFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowsProductionCountryFilter>>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowsProductionCountryFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowsProductionCountryFilter>>;
  /** Filter by the object’s `tvshow` relation. */
  tvshow?: InputMaybe<TvshowFilter>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `TvshowsProductionCountry` */
export type TvshowsProductionCountryInput = {
  /** @notEmpty() */
  name: Scalars['String'];
  tvshowId: Scalars['Int'];
};

/** Represents an update to a `TvshowsProductionCountry`. Fields that are set will be updated. */
export type TvshowsProductionCountryPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowsSnapshot = {
  __typename?: 'TvshowsSnapshot';
  /** Reads a single `Snapshot` that is related to this `TvshowsSnapshot`. */
  snapshot?: Maybe<Snapshot>;
  snapshotId: Scalars['Int'];
  /** Reads a single `Tvshow` that is related to this `TvshowsSnapshot`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId: Scalars['Int'];
};

/**
 * A condition to be used against `TvshowsSnapshot` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TvshowsSnapshotCondition = {
  /** Checks for equality with the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `TvshowsSnapshot` object types. All fields are combined with a logical ‘and.’ */
export type TvshowsSnapshotFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowsSnapshotFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowsSnapshotFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowsSnapshotFilter>>;
  /** Filter by the object’s `snapshot` relation. */
  snapshot?: InputMaybe<SnapshotFilter>;
  /** Filter by the object’s `snapshotId` field. */
  snapshotId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `tvshow` relation. */
  tvshow?: InputMaybe<TvshowFilter>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<IntFilter>;
};

/**
 * A connection to a list of `TvshowsSnapshot` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type TvshowsSnapshotsConnection = {
  __typename?: 'TvshowsSnapshotsConnection';
  /** A list of edges which contains the `TvshowsSnapshot` and cursor to aid in pagination. */
  edges: Array<TvshowsSnapshotsEdge>;
  /** A list of `TvshowsSnapshot` objects. */
  nodes: Array<TvshowsSnapshot>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowsSnapshot` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TvshowsSnapshot` edge in the connection. */
export type TvshowsSnapshotsEdge = {
  __typename?: 'TvshowsSnapshotsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TvshowsSnapshot` at the end of the edge. */
  node: TvshowsSnapshot;
};

/** Methods to use when ordering `TvshowsSnapshot`. */
export enum TvshowsSnapshotsOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SnapshotIdAsc = 'SNAPSHOT_ID_ASC',
  SnapshotIdDesc = 'SNAPSHOT_ID_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowsTag = {
  __typename?: 'TvshowsTag';
  name: Scalars['String'];
  /** Reads a single `Tvshow` that is related to this `TvshowsTag`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId: Scalars['Int'];
};

/**
 * A condition to be used against `TvshowsTag` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TvshowsTagCondition = {
  /**
   * Checks for equality with the object’s `name` field.
   * @notEmpty()
   */
  name?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `TvshowsTag` object types. All fields are combined with a logical ‘and.’ */
export type TvshowsTagFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowsTagFilter>>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowsTagFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowsTagFilter>>;
  /** Filter by the object’s `tvshow` relation. */
  tvshow?: InputMaybe<TvshowFilter>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `TvshowsTag` */
export type TvshowsTagInput = {
  /** @notEmpty() */
  name: Scalars['String'];
  tvshowId: Scalars['Int'];
};

/** Represents an update to a `TvshowsTag`. Fields that are set will be updated. */
export type TvshowsTagPatch = {
  /** @notEmpty() */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * A connection to a list of `TvshowsTag` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type TvshowsTagsConnection = {
  __typename?: 'TvshowsTagsConnection';
  /** A list of edges which contains the `TvshowsTag` and cursor to aid in pagination. */
  edges: Array<TvshowsTagsEdge>;
  /** A list of `TvshowsTag` objects. */
  nodes: Array<TvshowsTag>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowsTag` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TvshowsTag` edge in the connection. */
export type TvshowsTagsEdge = {
  __typename?: 'TvshowsTagsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TvshowsTag` at the end of the edge. */
  node: TvshowsTag;
};

/** Methods to use when ordering `TvshowsTag`. */
export enum TvshowsTagsOrderBy {
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowsTrailer = {
  __typename?: 'TvshowsTrailer';
  /** Reads a single `Tvshow` that is related to this `TvshowsTrailer`. */
  tvshow?: Maybe<Tvshow>;
  tvshowId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/**
 * A condition to be used against `TvshowsTrailer` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TvshowsTrailerCondition = {
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `videoId` field. */
  videoId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `TvshowsTrailer` object types. All fields are combined with a logical ‘and.’ */
export type TvshowsTrailerFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowsTrailerFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowsTrailerFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowsTrailerFilter>>;
  /** Filter by the object’s `tvshow` relation. */
  tvshow?: InputMaybe<TvshowFilter>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `videoId` field. */
  videoId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `TvshowsTrailer` */
export type TvshowsTrailerInput = {
  tvshowId: Scalars['Int'];
  videoId: Scalars['UUID'];
};

/**
 * A connection to a list of `TvshowsTrailer` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type TvshowsTrailersConnection = {
  __typename?: 'TvshowsTrailersConnection';
  /** A list of edges which contains the `TvshowsTrailer` and cursor to aid in pagination. */
  edges: Array<TvshowsTrailersEdge>;
  /** A list of `TvshowsTrailer` objects. */
  nodes: Array<TvshowsTrailer>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowsTrailer` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TvshowsTrailer` edge in the connection. */
export type TvshowsTrailersEdge = {
  __typename?: 'TvshowsTrailersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TvshowsTrailer` at the end of the edge. */
  node: TvshowsTrailer;
};

/** Methods to use when ordering `TvshowsTrailer`. */
export enum TvshowsTrailersOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC',
  VideoIdAsc = 'VIDEO_ID_ASC',
  VideoIdDesc = 'VIDEO_ID_DESC'
}

/** @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN */
export type TvshowsTvshowGenre = {
  __typename?: 'TvshowsTvshowGenre';
  /** Reads a single `Tvshow` that is related to this `TvshowsTvshowGenre`. */
  tvshow?: Maybe<Tvshow>;
  /** Reads a single `TvshowGenre` that is related to this `TvshowsTvshowGenre`. */
  tvshowGenres?: Maybe<TvshowGenre>;
  tvshowGenresId: Scalars['Int'];
  tvshowId: Scalars['Int'];
};

/**
 * A condition to be used against `TvshowsTvshowGenre` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TvshowsTvshowGenreCondition = {
  /** Checks for equality with the object’s `tvshowGenresId` field. */
  tvshowGenresId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<Scalars['Int']>;
};

/** A filter to be used against `TvshowsTvshowGenre` object types. All fields are combined with a logical ‘and.’ */
export type TvshowsTvshowGenreFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TvshowsTvshowGenreFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<TvshowsTvshowGenreFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TvshowsTvshowGenreFilter>>;
  /** Filter by the object’s `tvshow` relation. */
  tvshow?: InputMaybe<TvshowFilter>;
  /** Filter by the object’s `tvshowGenres` relation. */
  tvshowGenres?: InputMaybe<TvshowGenreFilter>;
  /** Filter by the object’s `tvshowGenresId` field. */
  tvshowGenresId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `tvshowId` field. */
  tvshowId?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `TvshowsTvshowGenre` */
export type TvshowsTvshowGenreInput = {
  tvshowGenresId: Scalars['Int'];
  tvshowId: Scalars['Int'];
};

/**
 * A connection to a list of `TvshowsTvshowGenre` values.
 * @permissions: TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN
 */
export type TvshowsTvshowGenresConnection = {
  __typename?: 'TvshowsTvshowGenresConnection';
  /** A list of edges which contains the `TvshowsTvshowGenre` and cursor to aid in pagination. */
  edges: Array<TvshowsTvshowGenresEdge>;
  /** A list of `TvshowsTvshowGenre` objects. */
  nodes: Array<TvshowsTvshowGenre>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TvshowsTvshowGenre` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TvshowsTvshowGenre` edge in the connection. */
export type TvshowsTvshowGenresEdge = {
  __typename?: 'TvshowsTvshowGenresEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TvshowsTvshowGenre` at the end of the edge. */
  node: TvshowsTvshowGenre;
};

/** Methods to use when ordering `TvshowsTvshowGenre`. */
export enum TvshowsTvshowGenresOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TvshowGenresIdAsc = 'TVSHOW_GENRES_ID_ASC',
  TvshowGenresIdDesc = 'TVSHOW_GENRES_ID_DESC',
  TvshowIdAsc = 'TVSHOW_ID_ASC',
  TvshowIdDesc = 'TVSHOW_ID_DESC'
}

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

/** A filter to be used against UUID List fields. All fields are combined with a logical ‘and.’ */
export type UuidListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['UUID']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['UUID']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
};

/**
 * All input for the `updateCollectionByExternalId` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type UpdateCollectionByExternalIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalId: Scalars['String'];
  /** An object where the defined keys will be set on the `Collection` being updated. */
  patch: CollectionPatch;
};

/**
 * All input for the `updateCollection` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type UpdateCollectionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `Collection` being updated. */
  patch: CollectionPatch;
};

/** The output of our update `Collection` mutation. */
export type UpdateCollectionPayload = {
  __typename?: 'UpdateCollectionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Collection` that was updated by this mutation. */
  collection?: Maybe<Collection>;
  /** An edge for our `Collection`. May be used by Relay 1. */
  collectionEdge?: Maybe<CollectionsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Collection` mutation. */
export type UpdateCollectionPayloadCollectionEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionsOrderBy>>;
};

/**
 * All input for the `updateCollectionRelation` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type UpdateCollectionRelationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `CollectionRelation` being updated. */
  patch: CollectionRelationPatch;
};

/** The output of our update `CollectionRelation` mutation. */
export type UpdateCollectionRelationPayload = {
  __typename?: 'UpdateCollectionRelationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Collection` that is related to this `CollectionRelation`. */
  collection?: Maybe<Collection>;
  /** The `CollectionRelation` that was updated by this mutation. */
  collectionRelation?: Maybe<CollectionRelation>;
  /** An edge for our `CollectionRelation`. May be used by Relay 1. */
  collectionRelationEdge?: Maybe<CollectionRelationsEdge>;
  /** Reads a single `Episode` that is related to this `CollectionRelation`. */
  episode?: Maybe<Episode>;
  /** Reads a single `Movie` that is related to this `CollectionRelation`. */
  movie?: Maybe<Movie>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `CollectionRelation`. */
  season?: Maybe<Season>;
  /** Reads a single `Tvshow` that is related to this `CollectionRelation`. */
  tvshow?: Maybe<Tvshow>;
};


/** The output of our update `CollectionRelation` mutation. */
export type UpdateCollectionRelationPayloadCollectionRelationEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionRelationsOrderBy>>;
};

/**
 * All input for the `updateCollectionsImageByCollectionIdAndImageType` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type UpdateCollectionsImageByCollectionIdAndImageTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  collectionId: Scalars['Int'];
  imageType: CollectionImageType;
  /** An object where the defined keys will be set on the `CollectionsImage` being updated. */
  patch: CollectionsImagePatch;
};

/** The output of our update `CollectionsImage` mutation. */
export type UpdateCollectionsImagePayload = {
  __typename?: 'UpdateCollectionsImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Collection` that is related to this `CollectionsImage`. */
  collection?: Maybe<Collection>;
  /** The `CollectionsImage` that was updated by this mutation. */
  collectionsImage?: Maybe<CollectionsImage>;
  /** An edge for our `CollectionsImage`. May be used by Relay 1. */
  collectionsImageEdge?: Maybe<CollectionsImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `CollectionsImage` mutation. */
export type UpdateCollectionsImagePayloadCollectionsImageEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionsImagesOrderBy>>;
};

/**
 * All input for the `updateCollectionsTag` mutation.
 * @permissions: COLLECTIONS_EDIT,ADMIN
 */
export type UpdateCollectionsTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  collectionId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `CollectionsTag` being updated. */
  patch: CollectionsTagPatch;
};

/** The output of our update `CollectionsTag` mutation. */
export type UpdateCollectionsTagPayload = {
  __typename?: 'UpdateCollectionsTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Collection` that is related to this `CollectionsTag`. */
  collection?: Maybe<Collection>;
  /** The `CollectionsTag` that was updated by this mutation. */
  collectionsTag?: Maybe<CollectionsTag>;
  /** An edge for our `CollectionsTag`. May be used by Relay 1. */
  collectionsTagEdge?: Maybe<CollectionsTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `CollectionsTag` mutation. */
export type UpdateCollectionsTagPayloadCollectionsTagEdgeArgs = {
  orderBy?: InputMaybe<Array<CollectionsTagsOrderBy>>;
};

/**
 * All input for the `updateEpisodeByExternalId` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateEpisodeByExternalIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalId: Scalars['String'];
  /** An object where the defined keys will be set on the `Episode` being updated. */
  patch: EpisodePatch;
};

/**
 * All input for the `updateEpisode` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateEpisodeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `Episode` being updated. */
  patch: EpisodePatch;
};

/** The output of our update `Episode` mutation. */
export type UpdateEpisodePayload = {
  __typename?: 'UpdateEpisodePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Episode` that was updated by this mutation. */
  episode?: Maybe<Episode>;
  /** An edge for our `Episode`. May be used by Relay 1. */
  episodeEdge?: Maybe<EpisodesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `Episode`. */
  season?: Maybe<Season>;
};


/** The output of our update `Episode` mutation. */
export type UpdateEpisodePayloadEpisodeEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesOrderBy>>;
};

/**
 * All input for the `updateEpisodesCast` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateEpisodesCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  episodeId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `EpisodesCast` being updated. */
  patch: EpisodesCastPatch;
};

/** The output of our update `EpisodesCast` mutation. */
export type UpdateEpisodesCastPayload = {
  __typename?: 'UpdateEpisodesCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesCast`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesCast` that was updated by this mutation. */
  episodesCast?: Maybe<EpisodesCast>;
  /** An edge for our `EpisodesCast`. May be used by Relay 1. */
  episodesCastEdge?: Maybe<EpisodesCastsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EpisodesCast` mutation. */
export type UpdateEpisodesCastPayloadEpisodesCastEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesCastsOrderBy>>;
};

/**
 * All input for the `updateEpisodesImageByEpisodeIdAndImageType` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateEpisodesImageByEpisodeIdAndImageTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  episodeId: Scalars['Int'];
  imageType: EpisodeImageType;
  /** An object where the defined keys will be set on the `EpisodesImage` being updated. */
  patch: EpisodesImagePatch;
};

/** The output of our update `EpisodesImage` mutation. */
export type UpdateEpisodesImagePayload = {
  __typename?: 'UpdateEpisodesImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesImage`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesImage` that was updated by this mutation. */
  episodesImage?: Maybe<EpisodesImage>;
  /** An edge for our `EpisodesImage`. May be used by Relay 1. */
  episodesImageEdge?: Maybe<EpisodesImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EpisodesImage` mutation. */
export type UpdateEpisodesImagePayloadEpisodesImageEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesImagesOrderBy>>;
};

/**
 * All input for the `updateEpisodesLicense` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateEpisodesLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `EpisodesLicense` being updated. */
  patch: EpisodesLicensePatch;
};

/** The output of our update `EpisodesLicense` mutation. */
export type UpdateEpisodesLicensePayload = {
  __typename?: 'UpdateEpisodesLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesLicense`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesLicense` that was updated by this mutation. */
  episodesLicense?: Maybe<EpisodesLicense>;
  /** An edge for our `EpisodesLicense`. May be used by Relay 1. */
  episodesLicenseEdge?: Maybe<EpisodesLicensesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EpisodesLicense` mutation. */
export type UpdateEpisodesLicensePayloadEpisodesLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesLicensesOrderBy>>;
};

/**
 * All input for the `updateEpisodesLicensesCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateEpisodesLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  code: IsoAlphaTwoCountryCodes;
  episodesLicenseId: Scalars['Int'];
  /** An object where the defined keys will be set on the `EpisodesLicensesCountry` being updated. */
  patch: EpisodesLicensesCountryPatch;
};

/** The output of our update `EpisodesLicensesCountry` mutation. */
export type UpdateEpisodesLicensesCountryPayload = {
  __typename?: 'UpdateEpisodesLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `EpisodesLicense` that is related to this `EpisodesLicensesCountry`. */
  episodesLicense?: Maybe<EpisodesLicense>;
  /** The `EpisodesLicensesCountry` that was updated by this mutation. */
  episodesLicensesCountry?: Maybe<EpisodesLicensesCountry>;
  /** An edge for our `EpisodesLicensesCountry`. May be used by Relay 1. */
  episodesLicensesCountryEdge?: Maybe<EpisodesLicensesCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EpisodesLicensesCountry` mutation. */
export type UpdateEpisodesLicensesCountryPayloadEpisodesLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesLicensesCountriesOrderBy>>;
};

/**
 * All input for the `updateEpisodesProductionCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateEpisodesProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  episodeId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `EpisodesProductionCountry` being updated. */
  patch: EpisodesProductionCountryPatch;
};

/** The output of our update `EpisodesProductionCountry` mutation. */
export type UpdateEpisodesProductionCountryPayload = {
  __typename?: 'UpdateEpisodesProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesProductionCountry`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesProductionCountry` that was updated by this mutation. */
  episodesProductionCountry?: Maybe<EpisodesProductionCountry>;
  /** An edge for our `EpisodesProductionCountry`. May be used by Relay 1. */
  episodesProductionCountryEdge?: Maybe<EpisodesProductionCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EpisodesProductionCountry` mutation. */
export type UpdateEpisodesProductionCountryPayloadEpisodesProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesProductionCountriesOrderBy>>;
};

/**
 * All input for the `updateEpisodesTag` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateEpisodesTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  episodeId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `EpisodesTag` being updated. */
  patch: EpisodesTagPatch;
};

/** The output of our update `EpisodesTag` mutation. */
export type UpdateEpisodesTagPayload = {
  __typename?: 'UpdateEpisodesTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Episode` that is related to this `EpisodesTag`. */
  episode?: Maybe<Episode>;
  /** The `EpisodesTag` that was updated by this mutation. */
  episodesTag?: Maybe<EpisodesTag>;
  /** An edge for our `EpisodesTag`. May be used by Relay 1. */
  episodesTagEdge?: Maybe<EpisodesTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `EpisodesTag` mutation. */
export type UpdateEpisodesTagPayloadEpisodesTagEdgeArgs = {
  orderBy?: InputMaybe<Array<EpisodesTagsOrderBy>>;
};

/**
 * All input for the `updateIngestDocument` mutation.
 * @permissions: INGESTS_EDIT,ADMIN
 */
export type UpdateIngestDocumentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `IngestDocument` being updated. */
  patch: IngestDocumentPatch;
};

/** The output of our update `IngestDocument` mutation. */
export type UpdateIngestDocumentPayload = {
  __typename?: 'UpdateIngestDocumentPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `IngestDocument` that was updated by this mutation. */
  ingestDocument?: Maybe<IngestDocument>;
  /** An edge for our `IngestDocument`. May be used by Relay 1. */
  ingestDocumentEdge?: Maybe<IngestDocumentsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `IngestDocument` mutation. */
export type UpdateIngestDocumentPayloadIngestDocumentEdgeArgs = {
  orderBy?: InputMaybe<Array<IngestDocumentsOrderBy>>;
};

/**
 * All input for the `updateMovieByExternalId` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type UpdateMovieByExternalIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalId: Scalars['String'];
  /** An object where the defined keys will be set on the `Movie` being updated. */
  patch: MoviePatch;
};

/**
 * All input for the `updateMovieGenre` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type UpdateMovieGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `MovieGenre` being updated. */
  patch: MovieGenrePatch;
};

/** The output of our update `MovieGenre` mutation. */
export type UpdateMovieGenrePayload = {
  __typename?: 'UpdateMovieGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `MovieGenre` that was updated by this mutation. */
  movieGenre?: Maybe<MovieGenre>;
  /** An edge for our `MovieGenre`. May be used by Relay 1. */
  movieGenreEdge?: Maybe<MovieGenresEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `MovieGenre` mutation. */
export type UpdateMovieGenrePayloadMovieGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<MovieGenresOrderBy>>;
};

/**
 * All input for the `updateMovie` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type UpdateMovieInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `Movie` being updated. */
  patch: MoviePatch;
};

/** The output of our update `Movie` mutation. */
export type UpdateMoviePayload = {
  __typename?: 'UpdateMoviePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Movie` that was updated by this mutation. */
  movie?: Maybe<Movie>;
  /** An edge for our `Movie`. May be used by Relay 1. */
  movieEdge?: Maybe<MoviesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Movie` mutation. */
export type UpdateMoviePayloadMovieEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesOrderBy>>;
};

/**
 * All input for the `updateMoviesCast` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type UpdateMoviesCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  movieId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `MoviesCast` being updated. */
  patch: MoviesCastPatch;
};

/** The output of our update `MoviesCast` mutation. */
export type UpdateMoviesCastPayload = {
  __typename?: 'UpdateMoviesCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesCast`. */
  movie?: Maybe<Movie>;
  /** The `MoviesCast` that was updated by this mutation. */
  moviesCast?: Maybe<MoviesCast>;
  /** An edge for our `MoviesCast`. May be used by Relay 1. */
  moviesCastEdge?: Maybe<MoviesCastsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `MoviesCast` mutation. */
export type UpdateMoviesCastPayloadMoviesCastEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesCastsOrderBy>>;
};

/**
 * All input for the `updateMoviesImageByMovieIdAndImageType` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type UpdateMoviesImageByMovieIdAndImageTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageType: MovieImageType;
  movieId: Scalars['Int'];
  /** An object where the defined keys will be set on the `MoviesImage` being updated. */
  patch: MoviesImagePatch;
};

/** The output of our update `MoviesImage` mutation. */
export type UpdateMoviesImagePayload = {
  __typename?: 'UpdateMoviesImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesImage`. */
  movie?: Maybe<Movie>;
  /** The `MoviesImage` that was updated by this mutation. */
  moviesImage?: Maybe<MoviesImage>;
  /** An edge for our `MoviesImage`. May be used by Relay 1. */
  moviesImageEdge?: Maybe<MoviesImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `MoviesImage` mutation. */
export type UpdateMoviesImagePayloadMoviesImageEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesImagesOrderBy>>;
};

/**
 * All input for the `updateMoviesLicense` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type UpdateMoviesLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `MoviesLicense` being updated. */
  patch: MoviesLicensePatch;
};

/** The output of our update `MoviesLicense` mutation. */
export type UpdateMoviesLicensePayload = {
  __typename?: 'UpdateMoviesLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesLicense`. */
  movie?: Maybe<Movie>;
  /** The `MoviesLicense` that was updated by this mutation. */
  moviesLicense?: Maybe<MoviesLicense>;
  /** An edge for our `MoviesLicense`. May be used by Relay 1. */
  moviesLicenseEdge?: Maybe<MoviesLicensesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `MoviesLicense` mutation. */
export type UpdateMoviesLicensePayloadMoviesLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesLicensesOrderBy>>;
};

/**
 * All input for the `updateMoviesLicensesCountry` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type UpdateMoviesLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  code: IsoAlphaTwoCountryCodes;
  moviesLicenseId: Scalars['Int'];
  /** An object where the defined keys will be set on the `MoviesLicensesCountry` being updated. */
  patch: MoviesLicensesCountryPatch;
};

/** The output of our update `MoviesLicensesCountry` mutation. */
export type UpdateMoviesLicensesCountryPayload = {
  __typename?: 'UpdateMoviesLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `MoviesLicense` that is related to this `MoviesLicensesCountry`. */
  moviesLicense?: Maybe<MoviesLicense>;
  /** The `MoviesLicensesCountry` that was updated by this mutation. */
  moviesLicensesCountry?: Maybe<MoviesLicensesCountry>;
  /** An edge for our `MoviesLicensesCountry`. May be used by Relay 1. */
  moviesLicensesCountryEdge?: Maybe<MoviesLicensesCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `MoviesLicensesCountry` mutation. */
export type UpdateMoviesLicensesCountryPayloadMoviesLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesLicensesCountriesOrderBy>>;
};

/**
 * All input for the `updateMoviesProductionCountry` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type UpdateMoviesProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  movieId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `MoviesProductionCountry` being updated. */
  patch: MoviesProductionCountryPatch;
};

/** The output of our update `MoviesProductionCountry` mutation. */
export type UpdateMoviesProductionCountryPayload = {
  __typename?: 'UpdateMoviesProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesProductionCountry`. */
  movie?: Maybe<Movie>;
  /** The `MoviesProductionCountry` that was updated by this mutation. */
  moviesProductionCountry?: Maybe<MoviesProductionCountry>;
  /** An edge for our `MoviesProductionCountry`. May be used by Relay 1. */
  moviesProductionCountryEdge?: Maybe<MoviesProductionCountriesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `MoviesProductionCountry` mutation. */
export type UpdateMoviesProductionCountryPayloadMoviesProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesProductionCountriesOrderBy>>;
};

/**
 * All input for the `updateMoviesTag` mutation.
 * @permissions: MOVIES_EDIT,ADMIN
 */
export type UpdateMoviesTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  movieId: Scalars['Int'];
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `MoviesTag` being updated. */
  patch: MoviesTagPatch;
};

/** The output of our update `MoviesTag` mutation. */
export type UpdateMoviesTagPayload = {
  __typename?: 'UpdateMoviesTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Reads a single `Movie` that is related to this `MoviesTag`. */
  movie?: Maybe<Movie>;
  /** The `MoviesTag` that was updated by this mutation. */
  moviesTag?: Maybe<MoviesTag>;
  /** An edge for our `MoviesTag`. May be used by Relay 1. */
  moviesTagEdge?: Maybe<MoviesTagsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `MoviesTag` mutation. */
export type UpdateMoviesTagPayloadMoviesTagEdgeArgs = {
  orderBy?: InputMaybe<Array<MoviesTagsOrderBy>>;
};

/**
 * All input for the `updateReview` mutation.
 * @permissions: REVIEWS_EDIT,ADMIN
 */
export type UpdateReviewInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `Review` being updated. */
  patch: ReviewPatch;
};

/** The output of our update `Review` mutation. */
export type UpdateReviewPayload = {
  __typename?: 'UpdateReviewPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Review` that was updated by this mutation. */
  review?: Maybe<Review>;
  /** An edge for our `Review`. May be used by Relay 1. */
  reviewEdge?: Maybe<ReviewsEdge>;
};


/** The output of our update `Review` mutation. */
export type UpdateReviewPayloadReviewEdgeArgs = {
  orderBy?: InputMaybe<Array<ReviewsOrderBy>>;
};

/**
 * All input for the `updateSeasonByExternalId` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateSeasonByExternalIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalId: Scalars['String'];
  /** An object where the defined keys will be set on the `Season` being updated. */
  patch: SeasonPatch;
};

/**
 * All input for the `updateSeason` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateSeasonInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `Season` being updated. */
  patch: SeasonPatch;
};

/** The output of our update `Season` mutation. */
export type UpdateSeasonPayload = {
  __typename?: 'UpdateSeasonPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Season` that was updated by this mutation. */
  season?: Maybe<Season>;
  /** An edge for our `Season`. May be used by Relay 1. */
  seasonEdge?: Maybe<SeasonsEdge>;
  /** Reads a single `Tvshow` that is related to this `Season`. */
  tvshow?: Maybe<Tvshow>;
};


/** The output of our update `Season` mutation. */
export type UpdateSeasonPayloadSeasonEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsOrderBy>>;
};

/**
 * All input for the `updateSeasonsCast` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateSeasonsCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `SeasonsCast` being updated. */
  patch: SeasonsCastPatch;
  seasonId: Scalars['Int'];
};

/** The output of our update `SeasonsCast` mutation. */
export type UpdateSeasonsCastPayload = {
  __typename?: 'UpdateSeasonsCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsCast`. */
  season?: Maybe<Season>;
  /** The `SeasonsCast` that was updated by this mutation. */
  seasonsCast?: Maybe<SeasonsCast>;
  /** An edge for our `SeasonsCast`. May be used by Relay 1. */
  seasonsCastEdge?: Maybe<SeasonsCastsEdge>;
};


/** The output of our update `SeasonsCast` mutation. */
export type UpdateSeasonsCastPayloadSeasonsCastEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsCastsOrderBy>>;
};

/**
 * All input for the `updateSeasonsImageBySeasonIdAndImageType` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateSeasonsImageBySeasonIdAndImageTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageType: SeasonImageType;
  /** An object where the defined keys will be set on the `SeasonsImage` being updated. */
  patch: SeasonsImagePatch;
  seasonId: Scalars['Int'];
};

/** The output of our update `SeasonsImage` mutation. */
export type UpdateSeasonsImagePayload = {
  __typename?: 'UpdateSeasonsImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsImage`. */
  season?: Maybe<Season>;
  /** The `SeasonsImage` that was updated by this mutation. */
  seasonsImage?: Maybe<SeasonsImage>;
  /** An edge for our `SeasonsImage`. May be used by Relay 1. */
  seasonsImageEdge?: Maybe<SeasonsImagesEdge>;
};


/** The output of our update `SeasonsImage` mutation. */
export type UpdateSeasonsImagePayloadSeasonsImageEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsImagesOrderBy>>;
};

/**
 * All input for the `updateSeasonsLicense` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateSeasonsLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `SeasonsLicense` being updated. */
  patch: SeasonsLicensePatch;
};

/** The output of our update `SeasonsLicense` mutation. */
export type UpdateSeasonsLicensePayload = {
  __typename?: 'UpdateSeasonsLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsLicense`. */
  season?: Maybe<Season>;
  /** The `SeasonsLicense` that was updated by this mutation. */
  seasonsLicense?: Maybe<SeasonsLicense>;
  /** An edge for our `SeasonsLicense`. May be used by Relay 1. */
  seasonsLicenseEdge?: Maybe<SeasonsLicensesEdge>;
};


/** The output of our update `SeasonsLicense` mutation. */
export type UpdateSeasonsLicensePayloadSeasonsLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsLicensesOrderBy>>;
};

/**
 * All input for the `updateSeasonsLicensesCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateSeasonsLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  code: IsoAlphaTwoCountryCodes;
  /** An object where the defined keys will be set on the `SeasonsLicensesCountry` being updated. */
  patch: SeasonsLicensesCountryPatch;
  seasonsLicenseId: Scalars['Int'];
};

/** The output of our update `SeasonsLicensesCountry` mutation. */
export type UpdateSeasonsLicensesCountryPayload = {
  __typename?: 'UpdateSeasonsLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `SeasonsLicense` that is related to this `SeasonsLicensesCountry`. */
  seasonsLicense?: Maybe<SeasonsLicense>;
  /** The `SeasonsLicensesCountry` that was updated by this mutation. */
  seasonsLicensesCountry?: Maybe<SeasonsLicensesCountry>;
  /** An edge for our `SeasonsLicensesCountry`. May be used by Relay 1. */
  seasonsLicensesCountryEdge?: Maybe<SeasonsLicensesCountriesEdge>;
};


/** The output of our update `SeasonsLicensesCountry` mutation. */
export type UpdateSeasonsLicensesCountryPayloadSeasonsLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsLicensesCountriesOrderBy>>;
};

/**
 * All input for the `updateSeasonsProductionCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateSeasonsProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `SeasonsProductionCountry` being updated. */
  patch: SeasonsProductionCountryPatch;
  seasonId: Scalars['Int'];
};

/** The output of our update `SeasonsProductionCountry` mutation. */
export type UpdateSeasonsProductionCountryPayload = {
  __typename?: 'UpdateSeasonsProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsProductionCountry`. */
  season?: Maybe<Season>;
  /** The `SeasonsProductionCountry` that was updated by this mutation. */
  seasonsProductionCountry?: Maybe<SeasonsProductionCountry>;
  /** An edge for our `SeasonsProductionCountry`. May be used by Relay 1. */
  seasonsProductionCountryEdge?: Maybe<SeasonsProductionCountriesEdge>;
};


/** The output of our update `SeasonsProductionCountry` mutation. */
export type UpdateSeasonsProductionCountryPayloadSeasonsProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsProductionCountriesOrderBy>>;
};

/**
 * All input for the `updateSeasonsTag` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateSeasonsTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `SeasonsTag` being updated. */
  patch: SeasonsTagPatch;
  seasonId: Scalars['Int'];
};

/** The output of our update `SeasonsTag` mutation. */
export type UpdateSeasonsTagPayload = {
  __typename?: 'UpdateSeasonsTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Season` that is related to this `SeasonsTag`. */
  season?: Maybe<Season>;
  /** The `SeasonsTag` that was updated by this mutation. */
  seasonsTag?: Maybe<SeasonsTag>;
  /** An edge for our `SeasonsTag`. May be used by Relay 1. */
  seasonsTagEdge?: Maybe<SeasonsTagsEdge>;
};


/** The output of our update `SeasonsTag` mutation. */
export type UpdateSeasonsTagPayloadSeasonsTagEdgeArgs = {
  orderBy?: InputMaybe<Array<SeasonsTagsOrderBy>>;
};

/**
 * All input for the `updateTvshowByExternalId` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateTvshowByExternalIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  externalId: Scalars['String'];
  /** An object where the defined keys will be set on the `Tvshow` being updated. */
  patch: TvshowPatch;
};

/**
 * All input for the `updateTvshowGenre` mutation.
 * @permissions: SETTINGS_EDIT,ADMIN
 */
export type UpdateTvshowGenreInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `TvshowGenre` being updated. */
  patch: TvshowGenrePatch;
};

/** The output of our update `TvshowGenre` mutation. */
export type UpdateTvshowGenrePayload = {
  __typename?: 'UpdateTvshowGenrePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TvshowGenre` that was updated by this mutation. */
  tvshowGenre?: Maybe<TvshowGenre>;
  /** An edge for our `TvshowGenre`. May be used by Relay 1. */
  tvshowGenreEdge?: Maybe<TvshowGenresEdge>;
};


/** The output of our update `TvshowGenre` mutation. */
export type UpdateTvshowGenrePayloadTvshowGenreEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowGenresOrderBy>>;
};

/**
 * All input for the `updateTvshow` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateTvshowInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `Tvshow` being updated. */
  patch: TvshowPatch;
};

/** The output of our update `Tvshow` mutation. */
export type UpdateTvshowPayload = {
  __typename?: 'UpdateTvshowPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tvshow` that was updated by this mutation. */
  tvshow?: Maybe<Tvshow>;
  /** An edge for our `Tvshow`. May be used by Relay 1. */
  tvshowEdge?: Maybe<TvshowsEdge>;
};


/** The output of our update `Tvshow` mutation. */
export type UpdateTvshowPayloadTvshowEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsOrderBy>>;
};

/**
 * All input for the `updateTvshowsCast` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateTvshowsCastInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `TvshowsCast` being updated. */
  patch: TvshowsCastPatch;
  tvshowId: Scalars['Int'];
};

/** The output of our update `TvshowsCast` mutation. */
export type UpdateTvshowsCastPayload = {
  __typename?: 'UpdateTvshowsCastPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsCast`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsCast` that was updated by this mutation. */
  tvshowsCast?: Maybe<TvshowsCast>;
  /** An edge for our `TvshowsCast`. May be used by Relay 1. */
  tvshowsCastEdge?: Maybe<TvshowsCastsEdge>;
};


/** The output of our update `TvshowsCast` mutation. */
export type UpdateTvshowsCastPayloadTvshowsCastEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsCastsOrderBy>>;
};

/**
 * All input for the `updateTvshowsImageByTvshowIdAndImageType` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateTvshowsImageByTvshowIdAndImageTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  imageType: TvshowImageType;
  /** An object where the defined keys will be set on the `TvshowsImage` being updated. */
  patch: TvshowsImagePatch;
  tvshowId: Scalars['Int'];
};

/** The output of our update `TvshowsImage` mutation. */
export type UpdateTvshowsImagePayload = {
  __typename?: 'UpdateTvshowsImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsImage`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsImage` that was updated by this mutation. */
  tvshowsImage?: Maybe<TvshowsImage>;
  /** An edge for our `TvshowsImage`. May be used by Relay 1. */
  tvshowsImageEdge?: Maybe<TvshowsImagesEdge>;
};


/** The output of our update `TvshowsImage` mutation. */
export type UpdateTvshowsImagePayloadTvshowsImageEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsImagesOrderBy>>;
};

/**
 * All input for the `updateTvshowsLicense` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateTvshowsLicenseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `TvshowsLicense` being updated. */
  patch: TvshowsLicensePatch;
};

/** The output of our update `TvshowsLicense` mutation. */
export type UpdateTvshowsLicensePayload = {
  __typename?: 'UpdateTvshowsLicensePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsLicense`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsLicense` that was updated by this mutation. */
  tvshowsLicense?: Maybe<TvshowsLicense>;
  /** An edge for our `TvshowsLicense`. May be used by Relay 1. */
  tvshowsLicenseEdge?: Maybe<TvshowsLicensesEdge>;
};


/** The output of our update `TvshowsLicense` mutation. */
export type UpdateTvshowsLicensePayloadTvshowsLicenseEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsLicensesOrderBy>>;
};

/**
 * All input for the `updateTvshowsLicensesCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateTvshowsLicensesCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  code: IsoAlphaTwoCountryCodes;
  /** An object where the defined keys will be set on the `TvshowsLicensesCountry` being updated. */
  patch: TvshowsLicensesCountryPatch;
  tvshowsLicenseId: Scalars['Int'];
};

/** The output of our update `TvshowsLicensesCountry` mutation. */
export type UpdateTvshowsLicensesCountryPayload = {
  __typename?: 'UpdateTvshowsLicensesCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TvshowsLicense` that is related to this `TvshowsLicensesCountry`. */
  tvshowsLicense?: Maybe<TvshowsLicense>;
  /** The `TvshowsLicensesCountry` that was updated by this mutation. */
  tvshowsLicensesCountry?: Maybe<TvshowsLicensesCountry>;
  /** An edge for our `TvshowsLicensesCountry`. May be used by Relay 1. */
  tvshowsLicensesCountryEdge?: Maybe<TvshowsLicensesCountriesEdge>;
};


/** The output of our update `TvshowsLicensesCountry` mutation. */
export type UpdateTvshowsLicensesCountryPayloadTvshowsLicensesCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsLicensesCountriesOrderBy>>;
};

/**
 * All input for the `updateTvshowsProductionCountry` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateTvshowsProductionCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `TvshowsProductionCountry` being updated. */
  patch: TvshowsProductionCountryPatch;
  tvshowId: Scalars['Int'];
};

/** The output of our update `TvshowsProductionCountry` mutation. */
export type UpdateTvshowsProductionCountryPayload = {
  __typename?: 'UpdateTvshowsProductionCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsProductionCountry`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsProductionCountry` that was updated by this mutation. */
  tvshowsProductionCountry?: Maybe<TvshowsProductionCountry>;
  /** An edge for our `TvshowsProductionCountry`. May be used by Relay 1. */
  tvshowsProductionCountryEdge?: Maybe<TvshowsProductionCountriesEdge>;
};


/** The output of our update `TvshowsProductionCountry` mutation. */
export type UpdateTvshowsProductionCountryPayloadTvshowsProductionCountryEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsProductionCountriesOrderBy>>;
};

/**
 * All input for the `updateTvshowsTag` mutation.
 * @permissions: TVSHOWS_EDIT,ADMIN
 */
export type UpdateTvshowsTagInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** @notEmpty() */
  name: Scalars['String'];
  /** An object where the defined keys will be set on the `TvshowsTag` being updated. */
  patch: TvshowsTagPatch;
  tvshowId: Scalars['Int'];
};

/** The output of our update `TvshowsTag` mutation. */
export type UpdateTvshowsTagPayload = {
  __typename?: 'UpdateTvshowsTagPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Tvshow` that is related to this `TvshowsTag`. */
  tvshow?: Maybe<Tvshow>;
  /** The `TvshowsTag` that was updated by this mutation. */
  tvshowsTag?: Maybe<TvshowsTag>;
  /** An edge for our `TvshowsTag`. May be used by Relay 1. */
  tvshowsTagEdge?: Maybe<TvshowsTagsEdge>;
};


/** The output of our update `TvshowsTag` mutation. */
export type UpdateTvshowsTagPayloadTvshowsTagEdgeArgs = {
  orderBy?: InputMaybe<Array<TvshowsTagsOrderBy>>;
};

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection?: { __typename?: 'CreateCollectionPayload', collection?: { __typename?: 'Collection', id: number, title: string } | null } | null };

export type CollectionQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', title: string, synopsis?: string | null, description?: string | null, externalId?: string | null, id: number, createdDate: any, createdUser: string, updatedDate: any, updatedUser: string, publishStatus: PublishStatus, publishedDate?: any | null, publishedUser?: string | null, collectionsTags: { __typename?: 'CollectionsTagsConnection', nodes: Array<{ __typename?: 'CollectionsTag', name: string }> }, collectionsImages: { __typename?: 'CollectionsImagesConnection', nodes: Array<{ __typename?: 'CollectionsImage', imageType: CollectionImageType, imageId: any }> }, movies: { __typename?: 'CollectionRelationsConnection', totalCount: number }, tvshows: { __typename?: 'CollectionRelationsConnection', totalCount: number }, seasons: { __typename?: 'CollectionRelationsConnection', totalCount: number }, episodes: { __typename?: 'CollectionRelationsConnection', totalCount: number } } | null };

export type DeleteCollectionMutationVariables = Exact<{
  input: DeleteCollectionInput;
}>;


export type DeleteCollectionMutation = { __typename?: 'Mutation', deleteCollection?: { __typename?: 'DeleteCollectionPayload', clientMutationId?: string | null } | null };

export type PublishCollectionMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PublishCollectionMutation = { __typename?: 'Mutation', publishCollection?: { __typename?: 'Snapshot', id: number } | null };

export type UnpublishCollectionMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UnpublishCollectionMutation = { __typename?: 'Mutation', unpublishCollection?: { __typename?: 'Snapshot', id: number } | null };

export type CollectionTitleQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CollectionTitleQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: number, title: string } | null };

export type SearchCollectionTagsQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchCollectionTagsQuery = { __typename?: 'Query', getCollectionsTagsValues?: { __typename?: 'GetCollectionsTagsValuesConnection', nodes: Array<string | null> } | null };

export type CollectionRelatedEntitiesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CollectionRelatedEntitiesQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', collectionRelations: { __typename?: 'CollectionRelationsConnection', nodes: Array<{ __typename?: 'CollectionRelation', id: number, sortOrder: number, movie?: { __typename?: 'Movie', title: string, publishStatus: PublishStatus, entityId: number, entityImages: { __typename?: 'MoviesImagesConnection', nodes: Array<{ __typename?: 'MoviesImage', imageId: any }> } } | null, tvshow?: { __typename?: 'Tvshow', title: string, publishStatus: PublishStatus, entityId: number, entityImages: { __typename?: 'TvshowsImagesConnection', nodes: Array<{ __typename?: 'TvshowsImage', imageId: any }> } } | null, season?: { __typename?: 'Season', index: number, publishStatus: PublishStatus, entityId: number, entityImages: { __typename?: 'SeasonsImagesConnection', nodes: Array<{ __typename?: 'SeasonsImage', imageId: any }> } } | null, episode?: { __typename?: 'Episode', title: string, publishStatus: PublishStatus, entityId: number, entityImages: { __typename?: 'EpisodesImagesConnection', nodes: Array<{ __typename?: 'EpisodesImage', imageId: any }> } } | null }> } } | null };

export type CollectionImagesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CollectionImagesQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', collectionsImages: { __typename?: 'CollectionsImagesConnection', nodes: Array<{ __typename?: 'CollectionsImage', imageId: any, imageType: CollectionImageType }> } } | null };

export type CreateCollectionSnapshotMutationVariables = Exact<{
  collectionId: Scalars['Int'];
}>;


export type CreateCollectionSnapshotMutation = { __typename?: 'Mutation', createCollectionSnapshot?: { __typename?: 'Snapshot', id: number } | null };

export type CollectionExplorerPropertiesFragment = { __typename?: 'Collection', id: number, title: string, externalId?: string | null, publishedDate?: any | null, createdDate: any, updatedDate: any, publishStatus: PublishStatus, collectionsTags: { __typename?: 'CollectionsTagsConnection', nodes: Array<{ __typename?: 'CollectionsTag', name: string }> }, collectionsImages: { __typename?: 'CollectionsImagesConnection', nodes: Array<{ __typename?: 'CollectionsImage', imageId: any }> } };

export type CollectionsQueryVariables = Exact<{
  filter?: InputMaybe<CollectionFilter>;
  orderBy?: InputMaybe<Array<CollectionsOrderBy> | CollectionsOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type CollectionsQuery = { __typename?: 'Query', filtered?: { __typename?: 'CollectionsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'Collection', id: number, title: string, externalId?: string | null, publishedDate?: any | null, createdDate: any, updatedDate: any, publishStatus: PublishStatus, collectionsTags: { __typename?: 'CollectionsTagsConnection', nodes: Array<{ __typename?: 'CollectionsTag', name: string }> }, collectionsImages: { __typename?: 'CollectionsImagesConnection', nodes: Array<{ __typename?: 'CollectionsImage', imageId: any }> } }> } | null, nonFiltered?: { __typename?: 'CollectionsConnection', totalCount: number } | null };

export type CollectionsMutatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CollectionsMutatedSubscription = { __typename?: 'Subscription', collectionMutated?: { __typename?: 'CollectionSubscriptionPayload', id: number, event?: string | null, collection?: { __typename?: 'Collection', id: number, title: string, externalId?: string | null, publishedDate?: any | null, createdDate: any, updatedDate: any, publishStatus: PublishStatus, collectionsTags: { __typename?: 'CollectionsTagsConnection', nodes: Array<{ __typename?: 'CollectionsTag', name: string }> }, collectionsImages: { __typename?: 'CollectionsImagesConnection', nodes: Array<{ __typename?: 'CollectionsImage', imageId: any }> } } | null } | null };

export type BulkDeleteCollectionsMutationVariables = Exact<{
  filter?: InputMaybe<CollectionFilter>;
}>;


export type BulkDeleteCollectionsMutation = { __typename?: 'Mutation', deleteCollections?: { __typename?: 'BulkMutationIntPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkPublishCollectionsMutationVariables = Exact<{
  filter?: InputMaybe<CollectionFilter>;
}>;


export type BulkPublishCollectionsMutation = { __typename?: 'Mutation', publishCollections?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkUnpublishCollectionsMutationVariables = Exact<{
  filter?: InputMaybe<CollectionFilter>;
}>;


export type BulkUnpublishCollectionsMutation = { __typename?: 'Mutation', unpublishCollections?: { __typename?: 'BulkMutationPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkCreateCollectionSnapshotsMutationVariables = Exact<{
  filter?: InputMaybe<CollectionFilter>;
}>;


export type BulkCreateCollectionSnapshotsMutation = { __typename?: 'Mutation', createCollectionSnapshots?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type CreateEpisodeMutationVariables = Exact<{
  input: CreateEpisodeInput;
}>;


export type CreateEpisodeMutation = { __typename?: 'Mutation', createEpisode?: { __typename?: 'CreateEpisodePayload', episode?: { __typename?: 'Episode', id: number, title: string } | null } | null };

export type EpisodeQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EpisodeQuery = { __typename?: 'Query', episode?: { __typename?: 'Episode', title: string, originalTitle?: string | null, index: number, synopsis?: string | null, description?: string | null, externalId?: string | null, studio?: string | null, released?: any | null, id: number, createdDate: any, createdUser: string, updatedDate: any, updatedUser: string, mainVideoId?: any | null, publishStatus: PublishStatus, publishedDate?: any | null, publishedUser?: string | null, episodesTags: { __typename?: 'EpisodesTagsConnection', nodes: Array<{ __typename?: 'EpisodesTag', name: string }> }, episodesTvshowGenres: { __typename?: 'EpisodesTvshowGenresConnection', nodes: Array<{ __typename?: 'EpisodesTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, episodesCasts: { __typename?: 'EpisodesCastsConnection', nodes: Array<{ __typename?: 'EpisodesCast', name: string }> }, episodesProductionCountries: { __typename?: 'EpisodesProductionCountriesConnection', nodes: Array<{ __typename?: 'EpisodesProductionCountry', name: string }> }, episodesTrailers: { __typename?: 'EpisodesTrailersConnection', totalCount: number }, episodesImages: { __typename?: 'EpisodesImagesConnection', nodes: Array<{ __typename?: 'EpisodesImage', imageType: EpisodeImageType, imageId: any }> } } | null, tvshowGenres?: { __typename?: 'TvshowGenresConnection', nodes: Array<{ __typename?: 'TvshowGenre', title: string, id: number }> } | null };

export type UpdateEpisodeMutationVariables = Exact<{
  input: UpdateEpisodeInput;
}>;


export type UpdateEpisodeMutation = { __typename?: 'Mutation', updateEpisode?: { __typename?: 'UpdateEpisodePayload', clientMutationId?: string | null, episode?: { __typename?: 'Episode', id: number, title: string } | null } | null };

export type DeleteEpisodeMutationVariables = Exact<{
  input: DeleteEpisodeInput;
}>;


export type DeleteEpisodeMutation = { __typename?: 'Mutation', deleteEpisode?: { __typename?: 'DeleteEpisodePayload', clientMutationId?: string | null } | null };

export type PublishEpisodeMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PublishEpisodeMutation = { __typename?: 'Mutation', publishEpisode?: { __typename?: 'Snapshot', id: number } | null };

export type UnpublishEpisodeMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UnpublishEpisodeMutation = { __typename?: 'Mutation', unpublishEpisode?: { __typename?: 'Snapshot', id: number } | null };

export type EpisodeTitleQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EpisodeTitleQuery = { __typename?: 'Query', episode?: { __typename?: 'Episode', id: number, title: string } | null };

export type SearchEpisodeTagsQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchEpisodeTagsQuery = { __typename?: 'Query', getEpisodesTagsValues?: { __typename?: 'GetEpisodesTagsValuesConnection', nodes: Array<string | null> } | null };

export type SearchEpisodeCastQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchEpisodeCastQuery = { __typename?: 'Query', getEpisodesCastsValues?: { __typename?: 'GetEpisodesCastsValuesConnection', nodes: Array<string | null> } | null };

export type SearchEpisodeProductionCountriesQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchEpisodeProductionCountriesQuery = { __typename?: 'Query', getEpisodesProductionCountriesValues?: { __typename?: 'GetEpisodesProductionCountriesValuesConnection', nodes: Array<string | null> } | null };

export type EpisodeExplorerPropertiesFragment = { __typename?: 'Episode', publishStatus: PublishStatus, title: string, index: number, externalId?: string | null, createdDate: any, updatedDate: any, originalTitle?: string | null, released?: any | null, studio?: string | null, publishedDate?: any | null, id: number, episodesImages: { __typename?: 'EpisodesImagesConnection', nodes: Array<{ __typename?: 'EpisodesImage', imageId: any }> }, episodesTvshowGenres: { __typename?: 'EpisodesTvshowGenresConnection', nodes: Array<{ __typename?: 'EpisodesTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, episodesTags: { __typename?: 'EpisodesTagsConnection', nodes: Array<{ __typename?: 'EpisodesTag', name: string }> }, episodesCasts: { __typename?: 'EpisodesCastsConnection', nodes: Array<{ __typename?: 'EpisodesCast', name: string }> }, episodesProductionCountries: { __typename?: 'EpisodesProductionCountriesConnection', nodes: Array<{ __typename?: 'EpisodesProductionCountry', name: string }> } };

export type EpisodesQueryVariables = Exact<{
  filter?: InputMaybe<EpisodeFilter>;
  orderBy?: InputMaybe<Array<EpisodesOrderBy> | EpisodesOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type EpisodesQuery = { __typename?: 'Query', filtered?: { __typename?: 'EpisodesConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'Episode', publishStatus: PublishStatus, title: string, index: number, externalId?: string | null, createdDate: any, updatedDate: any, originalTitle?: string | null, released?: any | null, studio?: string | null, publishedDate?: any | null, id: number, episodesImages: { __typename?: 'EpisodesImagesConnection', nodes: Array<{ __typename?: 'EpisodesImage', imageId: any }> }, episodesTvshowGenres: { __typename?: 'EpisodesTvshowGenresConnection', nodes: Array<{ __typename?: 'EpisodesTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, episodesTags: { __typename?: 'EpisodesTagsConnection', nodes: Array<{ __typename?: 'EpisodesTag', name: string }> }, episodesCasts: { __typename?: 'EpisodesCastsConnection', nodes: Array<{ __typename?: 'EpisodesCast', name: string }> }, episodesProductionCountries: { __typename?: 'EpisodesProductionCountriesConnection', nodes: Array<{ __typename?: 'EpisodesProductionCountry', name: string }> } }> } | null, nonFiltered?: { __typename?: 'EpisodesConnection', totalCount: number } | null };

export type EpisodesMutatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type EpisodesMutatedSubscription = { __typename?: 'Subscription', episodeMutated?: { __typename?: 'EpisodeSubscriptionPayload', id: number, event?: string | null, episode?: { __typename?: 'Episode', publishStatus: PublishStatus, title: string, index: number, externalId?: string | null, createdDate: any, updatedDate: any, originalTitle?: string | null, released?: any | null, studio?: string | null, publishedDate?: any | null, id: number, episodesImages: { __typename?: 'EpisodesImagesConnection', nodes: Array<{ __typename?: 'EpisodesImage', imageId: any }> }, episodesTvshowGenres: { __typename?: 'EpisodesTvshowGenresConnection', nodes: Array<{ __typename?: 'EpisodesTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, episodesTags: { __typename?: 'EpisodesTagsConnection', nodes: Array<{ __typename?: 'EpisodesTag', name: string }> }, episodesCasts: { __typename?: 'EpisodesCastsConnection', nodes: Array<{ __typename?: 'EpisodesCast', name: string }> }, episodesProductionCountries: { __typename?: 'EpisodesProductionCountriesConnection', nodes: Array<{ __typename?: 'EpisodesProductionCountry', name: string }> } } | null } | null };

export type EpisodeImagesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EpisodeImagesQuery = { __typename?: 'Query', episode?: { __typename?: 'Episode', episodesImages: { __typename?: 'EpisodesImagesConnection', nodes: Array<{ __typename?: 'EpisodesImage', imageId: any, imageType: EpisodeImageType }> } } | null };

export type EpisodesLicensesQueryVariables = Exact<{
  filter?: InputMaybe<EpisodesLicenseFilter>;
  orderBy?: InputMaybe<Array<EpisodesLicensesOrderBy> | EpisodesLicensesOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type EpisodesLicensesQuery = { __typename?: 'Query', episodesLicenses?: { __typename?: 'EpisodesLicensesConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'EpisodesLicense', id: number, licenseEnd?: any | null, licenseStart?: any | null, episodesLicensesCountries: { __typename?: 'EpisodesLicensesCountriesConnection', nodes: Array<{ __typename?: 'EpisodesLicensesCountry', code: IsoAlphaTwoCountryCodes }> } }> } | null };

export type CreateEpisodesLicenseMutationVariables = Exact<{
  input: CreateEpisodesLicenseInput;
}>;


export type CreateEpisodesLicenseMutation = { __typename?: 'Mutation', createEpisodesLicense?: { __typename?: 'CreateEpisodesLicensePayload', episodesLicense?: { __typename?: 'EpisodesLicense', id: number } | null } | null };

export type EpisodesLicenseQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EpisodesLicenseQuery = { __typename?: 'Query', episodesLicense?: { __typename?: 'EpisodesLicense', episodeId: number, licenseEnd?: any | null, licenseStart?: any | null, episodesLicensesCountries: { __typename?: 'EpisodesLicensesCountriesConnection', nodes: Array<{ __typename?: 'EpisodesLicensesCountry', code: IsoAlphaTwoCountryCodes }> } } | null };

export type UpdateEpisodesLicenseMutationVariables = Exact<{
  input: UpdateEpisodesLicenseInput;
}>;


export type UpdateEpisodesLicenseMutation = { __typename?: 'Mutation', updateEpisodesLicense?: { __typename?: 'UpdateEpisodesLicensePayload', clientMutationId?: string | null } | null };

export type DeleteEpisodesLicenseMutationVariables = Exact<{
  input: DeleteEpisodesLicenseInput;
}>;


export type DeleteEpisodesLicenseMutation = { __typename?: 'Mutation', deleteEpisodesLicense?: { __typename?: 'DeleteEpisodesLicensePayload', clientMutationId?: string | null } | null };

export type CreateEpisodeSnapshotMutationVariables = Exact<{
  episodeId: Scalars['Int'];
}>;


export type CreateEpisodeSnapshotMutation = { __typename?: 'Mutation', createEpisodeSnapshot?: { __typename?: 'Snapshot', id: number } | null };

export type EpisodeVideosQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type EpisodeVideosQuery = { __typename?: 'Query', episode?: { __typename?: 'Episode', mainVideoId?: any | null, episodesTrailers: { __typename?: 'EpisodesTrailersConnection', nodes: Array<{ __typename?: 'EpisodesTrailer', videoId: any }> } } | null };

export type BulkDeleteEpisodesMutationVariables = Exact<{
  filter?: InputMaybe<EpisodeFilter>;
}>;


export type BulkDeleteEpisodesMutation = { __typename?: 'Mutation', deleteEpisodes?: { __typename?: 'BulkMutationIntPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkPublishEpisodesMutationVariables = Exact<{
  filter?: InputMaybe<EpisodeFilter>;
}>;


export type BulkPublishEpisodesMutation = { __typename?: 'Mutation', publishEpisodes?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkUnpublishEpisodesMutationVariables = Exact<{
  filter?: InputMaybe<EpisodeFilter>;
}>;


export type BulkUnpublishEpisodesMutation = { __typename?: 'Mutation', unpublishEpisodes?: { __typename?: 'BulkMutationPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkCreateEpisodeSnapshotsMutationVariables = Exact<{
  filter?: InputMaybe<EpisodeFilter>;
}>;


export type BulkCreateEpisodeSnapshotsMutation = { __typename?: 'Mutation', createEpisodeSnapshots?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type IngestDocumentQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type IngestDocumentQuery = { __typename?: 'Query', ingestDocument?: { __typename?: 'IngestDocument', id: number, title: string, errorCount: number, itemsCount: number, successCount: number, inProgressCount: number, updatedDate: any, createdDate: any, status: IngestStatus, document: any, ingestItems: { __typename?: 'IngestItemsConnection', nodes: Array<{ __typename?: 'IngestItem', id: number, status: IngestItemStatus, externalId: string, type: IngestItemType, existsStatus: IngestEntityExistsStatus, errors: Array<any | null>, item: any, displayTitle: string, ingestItemSteps: { __typename?: 'IngestItemStepsConnection', nodes: Array<{ __typename?: 'IngestItemStep', id: any, status: IngestItemStepStatus, subType: string, type: IngestItemStepType, responseMessage?: string | null }> } }> } } | null };

export type UpdateIngestDocumentMutationVariables = Exact<{
  input: UpdateIngestDocumentInput;
}>;


export type UpdateIngestDocumentMutation = { __typename?: 'Mutation', updateIngestDocument?: { __typename?: 'UpdateIngestDocumentPayload', clientMutationId?: string | null } | null };

export type IngestDocumentTitleQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type IngestDocumentTitleQuery = { __typename?: 'Query', ingestDocument?: { __typename?: 'IngestDocument', title: string } | null };

export type IngestDocumentUploadMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type IngestDocumentUploadMutation = { __typename?: 'Mutation', startIngest?: { __typename?: 'StartIngestPayload', ingestDocument?: { __typename?: 'IngestDocument', id: number } | null } | null };

export type IngestDocumentExplorerPropertiesFragment = { __typename?: 'IngestDocument', id: number, title: string, status: IngestStatus, itemsCount: number, errorCount: number, successCount: number, inProgressCount: number, createdDate: any, updatedDate: any };

export type IngestDocumentsQueryVariables = Exact<{
  orderBy?: InputMaybe<Array<IngestDocumentsOrderBy> | IngestDocumentsOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type IngestDocumentsQuery = { __typename?: 'Query', filtered?: { __typename?: 'IngestDocumentsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'IngestDocument', id: number, title: string, status: IngestStatus, itemsCount: number, errorCount: number, successCount: number, inProgressCount: number, createdDate: any, updatedDate: any }> } | null, nonFiltered?: { __typename?: 'IngestDocumentsConnection', totalCount: number } | null };

export type IngestDocumentsMutatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type IngestDocumentsMutatedSubscription = { __typename?: 'Subscription', ingestDocumentMutated?: { __typename?: 'IngestDocumentSubscriptionPayload', id: number, event?: string | null, ingestDocument?: { __typename?: 'IngestDocument', id: number, title: string, status: IngestStatus, itemsCount: number, errorCount: number, successCount: number, inProgressCount: number, createdDate: any, updatedDate: any } | null } | null };

export type CreateMovieMutationVariables = Exact<{
  input: CreateMovieInput;
}>;


export type CreateMovieMutation = { __typename?: 'Mutation', createMovie?: { __typename?: 'CreateMoviePayload', movie?: { __typename?: 'Movie', id: number, title: string } | null } | null };

export type MovieQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type MovieQuery = { __typename?: 'Query', movie?: { __typename?: 'Movie', title: string, originalTitle?: string | null, synopsis?: string | null, description?: string | null, externalId?: string | null, released?: any | null, studio?: string | null, mainVideoId?: any | null, id: number, createdDate: any, createdUser: string, updatedDate: any, updatedUser: string, publishStatus: PublishStatus, publishedDate?: any | null, publishedUser?: string | null, moviesTags: { __typename?: 'MoviesTagsConnection', nodes: Array<{ __typename?: 'MoviesTag', name: string }> }, moviesMovieGenres: { __typename?: 'MoviesMovieGenresConnection', nodes: Array<{ __typename?: 'MoviesMovieGenre', movieGenres?: { __typename?: 'MovieGenre', title: string } | null }> }, moviesCasts: { __typename?: 'MoviesCastsConnection', nodes: Array<{ __typename?: 'MoviesCast', name: string }> }, moviesProductionCountries: { __typename?: 'MoviesProductionCountriesConnection', nodes: Array<{ __typename?: 'MoviesProductionCountry', name: string }> }, moviesTrailers: { __typename?: 'MoviesTrailersConnection', totalCount: number }, moviesImages: { __typename?: 'MoviesImagesConnection', nodes: Array<{ __typename?: 'MoviesImage', imageType: MovieImageType, imageId: any }> } } | null, movieGenres?: { __typename?: 'MovieGenresConnection', nodes: Array<{ __typename?: 'MovieGenre', title: string, id: number }> } | null };

export type DeleteMovieMutationVariables = Exact<{
  input: DeleteMovieInput;
}>;


export type DeleteMovieMutation = { __typename?: 'Mutation', deleteMovie?: { __typename?: 'DeleteMoviePayload', clientMutationId?: string | null } | null };

export type PublishMovieMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PublishMovieMutation = { __typename?: 'Mutation', publishMovie?: { __typename?: 'Snapshot', id: number } | null };

export type UnpublishMovieMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UnpublishMovieMutation = { __typename?: 'Mutation', unpublishMovie?: { __typename?: 'Snapshot', id: number } | null };

export type MovieTitleQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type MovieTitleQuery = { __typename?: 'Query', movie?: { __typename?: 'Movie', id: number, title: string } | null };

export type SearchMovieTagsQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchMovieTagsQuery = { __typename?: 'Query', getMoviesTagsValues?: { __typename?: 'GetMoviesTagsValuesConnection', nodes: Array<string | null> } | null };

export type SearchMovieCastQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchMovieCastQuery = { __typename?: 'Query', getMoviesCastsValues?: { __typename?: 'GetMoviesCastsValuesConnection', nodes: Array<string | null> } | null };

export type SearchMovieProductionCountriesQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchMovieProductionCountriesQuery = { __typename?: 'Query', getMoviesProductionCountriesValues?: { __typename?: 'GetMoviesProductionCountriesValuesConnection', nodes: Array<string | null> } | null };

export type MovieExplorerPropertiesFragment = { __typename?: 'Movie', id: number, title: string, originalTitle?: string | null, externalId?: string | null, released?: any | null, studio?: string | null, publishedDate?: any | null, createdDate: any, updatedDate: any, publishStatus: PublishStatus, moviesImages: { __typename?: 'MoviesImagesConnection', nodes: Array<{ __typename?: 'MoviesImage', imageId: any }> }, moviesTags: { __typename?: 'MoviesTagsConnection', nodes: Array<{ __typename?: 'MoviesTag', name: string }> }, moviesMovieGenres: { __typename?: 'MoviesMovieGenresConnection', nodes: Array<{ __typename?: 'MoviesMovieGenre', movieGenres?: { __typename?: 'MovieGenre', title: string } | null }> }, moviesCasts: { __typename?: 'MoviesCastsConnection', nodes: Array<{ __typename?: 'MoviesCast', name: string }> }, moviesProductionCountries: { __typename?: 'MoviesProductionCountriesConnection', nodes: Array<{ __typename?: 'MoviesProductionCountry', name: string }> } };

export type MoviesQueryVariables = Exact<{
  filter?: InputMaybe<MovieFilter>;
  orderBy?: InputMaybe<Array<MoviesOrderBy> | MoviesOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type MoviesQuery = { __typename?: 'Query', filtered?: { __typename?: 'MoviesConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'Movie', id: number, title: string, originalTitle?: string | null, externalId?: string | null, released?: any | null, studio?: string | null, publishedDate?: any | null, createdDate: any, updatedDate: any, publishStatus: PublishStatus, moviesImages: { __typename?: 'MoviesImagesConnection', nodes: Array<{ __typename?: 'MoviesImage', imageId: any }> }, moviesTags: { __typename?: 'MoviesTagsConnection', nodes: Array<{ __typename?: 'MoviesTag', name: string }> }, moviesMovieGenres: { __typename?: 'MoviesMovieGenresConnection', nodes: Array<{ __typename?: 'MoviesMovieGenre', movieGenres?: { __typename?: 'MovieGenre', title: string } | null }> }, moviesCasts: { __typename?: 'MoviesCastsConnection', nodes: Array<{ __typename?: 'MoviesCast', name: string }> }, moviesProductionCountries: { __typename?: 'MoviesProductionCountriesConnection', nodes: Array<{ __typename?: 'MoviesProductionCountry', name: string }> } }> } | null, nonFiltered?: { __typename?: 'MoviesConnection', totalCount: number } | null };

export type MoviesMutatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MoviesMutatedSubscription = { __typename?: 'Subscription', movieMutated?: { __typename?: 'MovieSubscriptionPayload', id: number, event?: string | null, movie?: { __typename?: 'Movie', id: number, title: string, originalTitle?: string | null, externalId?: string | null, released?: any | null, studio?: string | null, publishedDate?: any | null, createdDate: any, updatedDate: any, publishStatus: PublishStatus, moviesImages: { __typename?: 'MoviesImagesConnection', nodes: Array<{ __typename?: 'MoviesImage', imageId: any }> }, moviesTags: { __typename?: 'MoviesTagsConnection', nodes: Array<{ __typename?: 'MoviesTag', name: string }> }, moviesMovieGenres: { __typename?: 'MoviesMovieGenresConnection', nodes: Array<{ __typename?: 'MoviesMovieGenre', movieGenres?: { __typename?: 'MovieGenre', title: string } | null }> }, moviesCasts: { __typename?: 'MoviesCastsConnection', nodes: Array<{ __typename?: 'MoviesCast', name: string }> }, moviesProductionCountries: { __typename?: 'MoviesProductionCountriesConnection', nodes: Array<{ __typename?: 'MoviesProductionCountry', name: string }> } } | null } | null };

export type MovieGenresQueryVariables = Exact<{ [key: string]: never; }>;


export type MovieGenresQuery = { __typename?: 'Query', movieGenres?: { __typename?: 'MovieGenresConnection', totalCount: number, nodes: Array<{ __typename?: 'MovieGenre', sortOrder: number, title: string, id: number, updatedDate: any, updatedUser: string }> } | null, snapshots?: { __typename?: 'SnapshotsConnection', nodes: Array<{ __typename?: 'Snapshot', updatedUser: string, publishedDate?: any | null, snapshotState: SnapshotState }> } | null };

export type PublishMovieGenresMutationVariables = Exact<{ [key: string]: never; }>;


export type PublishMovieGenresMutation = { __typename?: 'Mutation', publishMovieGenres?: { __typename?: 'Snapshot', id: number } | null };

export type UnpublishMovieGenresMutationVariables = Exact<{ [key: string]: never; }>;


export type UnpublishMovieGenresMutation = { __typename?: 'Mutation', unpublishMovieGenres?: { __typename?: 'Snapshot', id: number } | null };

export type CreateMovieGenresSnapshotMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateMovieGenresSnapshotMutation = { __typename?: 'Mutation', createMovieGenresSnapshot?: { __typename?: 'Snapshot', id: number } | null };

export type MovieImagesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type MovieImagesQuery = { __typename?: 'Query', movie?: { __typename?: 'Movie', moviesImages: { __typename?: 'MoviesImagesConnection', nodes: Array<{ __typename?: 'MoviesImage', imageId: any, imageType: MovieImageType }> } } | null };

export type MoviesLicensesQueryVariables = Exact<{
  filter?: InputMaybe<MoviesLicenseFilter>;
  orderBy?: InputMaybe<Array<MoviesLicensesOrderBy> | MoviesLicensesOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type MoviesLicensesQuery = { __typename?: 'Query', moviesLicenses?: { __typename?: 'MoviesLicensesConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'MoviesLicense', id: number, licenseEnd?: any | null, licenseStart?: any | null, moviesLicensesCountries: { __typename?: 'MoviesLicensesCountriesConnection', nodes: Array<{ __typename?: 'MoviesLicensesCountry', code: IsoAlphaTwoCountryCodes }> } }> } | null };

export type CreateMoviesLicenseMutationVariables = Exact<{
  input: CreateMoviesLicenseInput;
}>;


export type CreateMoviesLicenseMutation = { __typename?: 'Mutation', createMoviesLicense?: { __typename?: 'CreateMoviesLicensePayload', moviesLicense?: { __typename?: 'MoviesLicense', id: number } | null } | null };

export type MoviesLicenseQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type MoviesLicenseQuery = { __typename?: 'Query', moviesLicense?: { __typename?: 'MoviesLicense', licenseEnd?: any | null, licenseStart?: any | null, movieId: number, moviesLicensesCountries: { __typename?: 'MoviesLicensesCountriesConnection', nodes: Array<{ __typename?: 'MoviesLicensesCountry', code: IsoAlphaTwoCountryCodes }> } } | null };

export type UpdateMoviesLicenseMutationVariables = Exact<{
  input: UpdateMoviesLicenseInput;
}>;


export type UpdateMoviesLicenseMutation = { __typename?: 'Mutation', updateMoviesLicense?: { __typename?: 'UpdateMoviesLicensePayload', clientMutationId?: string | null } | null };

export type DeleteMoviesLicenseMutationVariables = Exact<{
  input: DeleteMoviesLicenseInput;
}>;


export type DeleteMoviesLicenseMutation = { __typename?: 'Mutation', deleteMoviesLicense?: { __typename?: 'DeleteMoviesLicensePayload', clientMutationId?: string | null } | null };

export type CreateMovieSnapshotMutationVariables = Exact<{
  movieId: Scalars['Int'];
}>;


export type CreateMovieSnapshotMutation = { __typename?: 'Mutation', createMovieSnapshot?: { __typename?: 'Snapshot', id: number } | null };

export type MovieVideosQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type MovieVideosQuery = { __typename?: 'Query', movie?: { __typename?: 'Movie', mainVideoId?: any | null, moviesTrailers: { __typename?: 'MoviesTrailersConnection', nodes: Array<{ __typename?: 'MoviesTrailer', videoId: any }> } } | null };

export type BulkDeleteMoviesMutationVariables = Exact<{
  filter?: InputMaybe<MovieFilter>;
}>;


export type BulkDeleteMoviesMutation = { __typename?: 'Mutation', deleteMovies?: { __typename?: 'BulkMutationIntPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkPublishMoviesMutationVariables = Exact<{
  filter?: InputMaybe<MovieFilter>;
}>;


export type BulkPublishMoviesMutation = { __typename?: 'Mutation', publishMovies?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkUnpublishMoviesMutationVariables = Exact<{
  filter?: InputMaybe<MovieFilter>;
}>;


export type BulkUnpublishMoviesMutation = { __typename?: 'Mutation', unpublishMovies?: { __typename?: 'BulkMutationPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkCreateMovieSnapshotsMutationVariables = Exact<{
  filter?: InputMaybe<MovieFilter>;
}>;


export type BulkCreateMovieSnapshotsMutation = { __typename?: 'Mutation', createMovieSnapshots?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type PublishingSnapshotQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PublishingSnapshotQuery = { __typename?: 'Query', snapshot?: { __typename?: 'Snapshot', id: number, entityType: EntityType, createdDate: any, createdUser: string, snapshotState: SnapshotState, updatedDate: any, updatedUser: string, snapshotJson?: any | null, snapshotValidationResults: { __typename?: 'SnapshotValidationResultsConnection', nodes: Array<{ __typename?: 'SnapshotValidationResult', id: number, context: SnapshotValidationIssueContext, severity: SnapshotValidationIssueSeverity, message: string }> } } | null };

export type PublishingSnapshotTitleQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PublishingSnapshotTitleQuery = { __typename?: 'Query', snapshot?: { __typename?: 'Snapshot', entityType: EntityType, snapshotNo: number } | null };

export type PublishSnapshotMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PublishSnapshotMutation = { __typename?: 'Mutation', publishSnapshot?: { __typename?: 'Snapshot', id: number } | null };

export type UnpublishSnapshotMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UnpublishSnapshotMutation = { __typename?: 'Mutation', unpublishSnapshot?: { __typename?: 'Snapshot', id: number } | null };

export type DeleteSnapshotMutationVariables = Exact<{
  input: DeleteSnapshotInput;
}>;


export type DeleteSnapshotMutation = { __typename?: 'Mutation', deleteSnapshot?: { __typename?: 'DeleteSnapshotPayload', clientMutationId?: string | null } | null };

export type PublishingSnapshotExplorerPropertiesFragment = { __typename?: 'Snapshot', id: number, createdDate: any, createdUser: string, snapshotNo: number, snapshotState: SnapshotState, updatedDate: any, updatedUser: string, validationStatus?: SnapshotValidationStatus | null, snapshotValidationResults: { __typename?: 'SnapshotValidationResultsConnection', nodes: Array<{ __typename?: 'SnapshotValidationResult', severity: SnapshotValidationIssueSeverity }> } };

export type PublishingSnapshotsQueryVariables = Exact<{
  entityType: EntityType;
  entityId?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<SnapshotFilter>;
  orderBy?: InputMaybe<Array<SnapshotsOrderBy> | SnapshotsOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type PublishingSnapshotsQuery = { __typename?: 'Query', filtered?: { __typename?: 'SnapshotsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'Snapshot', id: number, createdDate: any, createdUser: string, snapshotNo: number, snapshotState: SnapshotState, updatedDate: any, updatedUser: string, validationStatus?: SnapshotValidationStatus | null, snapshotValidationResults: { __typename?: 'SnapshotValidationResultsConnection', nodes: Array<{ __typename?: 'SnapshotValidationResult', severity: SnapshotValidationIssueSeverity }> } }> } | null, nonFiltered?: { __typename?: 'SnapshotsConnection', totalCount: number } | null };

export type PublishingSnapshotMutatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PublishingSnapshotMutatedSubscription = { __typename?: 'Subscription', snapshotMutated?: { __typename?: 'SnapshotSubscriptionPayload', id: number, event?: string | null, snapshot?: { __typename?: 'Snapshot', entityType: EntityType, entityId: number, id: number, createdDate: any, createdUser: string, snapshotNo: number, snapshotState: SnapshotState, updatedDate: any, updatedUser: string, validationStatus?: SnapshotValidationStatus | null, snapshotValidationResults: { __typename?: 'SnapshotValidationResultsConnection', nodes: Array<{ __typename?: 'SnapshotValidationResult', severity: SnapshotValidationIssueSeverity }> } } | null } | null };

export type SnapshotExplorerPropertiesFragment = { __typename?: 'Snapshot', id: number, entityId: number, entityType: EntityType, entityTitle?: string | null, jobId: string, createdDate: any, createdUser: string, snapshotState: SnapshotState, updatedDate: any, updatedUser: string, validationStatus?: SnapshotValidationStatus | null, publishedDate?: any | null, unpublishedDate?: any | null, snapshotValidationResults: { __typename?: 'SnapshotValidationResultsConnection', nodes: Array<{ __typename?: 'SnapshotValidationResult', id: number, context: SnapshotValidationIssueContext, message: string, severity: SnapshotValidationIssueSeverity }> } };

export type SnapshotsQueryVariables = Exact<{
  filter?: InputMaybe<SnapshotFilter>;
  orderBy?: InputMaybe<Array<SnapshotsOrderBy> | SnapshotsOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type SnapshotsQuery = { __typename?: 'Query', filtered?: { __typename?: 'SnapshotsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'Snapshot', id: number, entityId: number, entityType: EntityType, entityTitle?: string | null, jobId: string, createdDate: any, createdUser: string, snapshotState: SnapshotState, updatedDate: any, updatedUser: string, validationStatus?: SnapshotValidationStatus | null, publishedDate?: any | null, unpublishedDate?: any | null, snapshotValidationResults: { __typename?: 'SnapshotValidationResultsConnection', nodes: Array<{ __typename?: 'SnapshotValidationResult', id: number, context: SnapshotValidationIssueContext, message: string, severity: SnapshotValidationIssueSeverity }> } }> } | null, nonFiltered?: { __typename?: 'SnapshotsConnection', totalCount: number } | null };

export type SnapshotsMutatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SnapshotsMutatedSubscription = { __typename?: 'Subscription', snapshotMutated?: { __typename?: 'SnapshotSubscriptionPayload', id: number, event?: string | null, snapshot?: { __typename?: 'Snapshot', id: number, entityId: number, entityType: EntityType, entityTitle?: string | null, jobId: string, createdDate: any, createdUser: string, snapshotState: SnapshotState, updatedDate: any, updatedUser: string, validationStatus?: SnapshotValidationStatus | null, publishedDate?: any | null, unpublishedDate?: any | null, snapshotValidationResults: { __typename?: 'SnapshotValidationResultsConnection', nodes: Array<{ __typename?: 'SnapshotValidationResult', id: number, context: SnapshotValidationIssueContext, message: string, severity: SnapshotValidationIssueSeverity }> } } | null } | null };

export type BulkDeleteSnapshotsMutationVariables = Exact<{
  filter?: InputMaybe<SnapshotFilter>;
}>;


export type BulkDeleteSnapshotsMutation = { __typename?: 'Mutation', deleteSnapshots?: { __typename?: 'BulkMutationIntPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkPublishSnapshotsMutationVariables = Exact<{
  filter?: InputMaybe<SnapshotFilter>;
}>;


export type BulkPublishSnapshotsMutation = { __typename?: 'Mutation', publishSnapshots?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkUnpublishSnapshotsMutationVariables = Exact<{
  filter?: InputMaybe<SnapshotFilter>;
}>;


export type BulkUnpublishSnapshotsMutation = { __typename?: 'Mutation', unpublishSnapshots?: { __typename?: 'BulkMutationPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkRecreateSnapshotsMutationVariables = Exact<{
  filter?: InputMaybe<SnapshotFilter>;
}>;


export type BulkRecreateSnapshotsMutation = { __typename?: 'Mutation', recreateSnapshots?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type CreateReviewMutationVariables = Exact<{
  input: CreateReviewInput;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview?: { __typename?: 'CreateReviewPayload', review?: { __typename?: 'Review', id: number } | null } | null };

export type ReviewQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ReviewQuery = { __typename?: 'Query', review?: { __typename?: 'Review', title: string, rating?: number | null, description: string, id: number, createdDate: any, createdUser: string, updatedDate: any, updatedUser: string } | null };

export type UpdateReviewMutationVariables = Exact<{
  input: UpdateReviewInput;
}>;


export type UpdateReviewMutation = { __typename?: 'Mutation', updateReview?: { __typename?: 'UpdateReviewPayload', review?: { __typename?: 'Review', id: number, title: string } | null } | null };

export type DeleteReviewMutationVariables = Exact<{
  input: DeleteReviewInput;
}>;


export type DeleteReviewMutation = { __typename?: 'Mutation', deleteReview?: { __typename?: 'DeleteReviewPayload', clientMutationId?: string | null } | null };

export type ReviewTitleQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ReviewTitleQuery = { __typename?: 'Query', review?: { __typename?: 'Review', title: string } | null };

export type ReviewsQueryVariables = Exact<{
  filter?: InputMaybe<ReviewFilter>;
  orderBy?: InputMaybe<Array<ReviewsOrderBy> | ReviewsOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type ReviewsQuery = { __typename?: 'Query', filtered?: { __typename?: 'ReviewsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'Review', id: number, title: string, rating?: number | null, createdDate: any, updatedDate: any }> } | null, nonFiltered?: { __typename?: 'ReviewsConnection', totalCount: number } | null };

export type CreateSeasonMutationVariables = Exact<{
  input: CreateSeasonInput;
}>;


export type CreateSeasonMutation = { __typename?: 'Mutation', createSeason?: { __typename?: 'CreateSeasonPayload', season?: { __typename?: 'Season', id: number, index: number } | null } | null };

export type SeasonQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type SeasonQuery = { __typename?: 'Query', season?: { __typename?: 'Season', index: number, synopsis?: string | null, description?: string | null, externalId?: string | null, studio?: string | null, released?: any | null, id: number, createdDate: any, createdUser: string, updatedDate: any, updatedUser: string, publishStatus: PublishStatus, publishedDate?: any | null, publishedUser?: string | null, seasonsTags: { __typename?: 'SeasonsTagsConnection', nodes: Array<{ __typename?: 'SeasonsTag', name: string }> }, seasonsTvshowGenres: { __typename?: 'SeasonsTvshowGenresConnection', nodes: Array<{ __typename?: 'SeasonsTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, seasonsCasts: { __typename?: 'SeasonsCastsConnection', nodes: Array<{ __typename?: 'SeasonsCast', name: string }> }, seasonsProductionCountries: { __typename?: 'SeasonsProductionCountriesConnection', nodes: Array<{ __typename?: 'SeasonsProductionCountry', name: string }> }, episodes: { __typename?: 'EpisodesConnection', totalCount: number }, seasonsTrailers: { __typename?: 'SeasonsTrailersConnection', totalCount: number }, seasonsImages: { __typename?: 'SeasonsImagesConnection', nodes: Array<{ __typename?: 'SeasonsImage', imageType: SeasonImageType, imageId: any }> } } | null, tvshowGenres?: { __typename?: 'TvshowGenresConnection', nodes: Array<{ __typename?: 'TvshowGenre', title: string, id: number }> } | null };

export type DeleteSeasonMutationVariables = Exact<{
  input: DeleteSeasonInput;
}>;


export type DeleteSeasonMutation = { __typename?: 'Mutation', deleteSeason?: { __typename?: 'DeleteSeasonPayload', clientMutationId?: string | null } | null };

export type PublishSeasonMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PublishSeasonMutation = { __typename?: 'Mutation', publishSeason?: { __typename?: 'Snapshot', id: number } | null };

export type UnpublishSeasonMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UnpublishSeasonMutation = { __typename?: 'Mutation', unpublishSeason?: { __typename?: 'Snapshot', id: number } | null };

export type SeasonTitleQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type SeasonTitleQuery = { __typename?: 'Query', season?: { __typename?: 'Season', id: number, index: number } | null };

export type SearchSeasonTagsQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchSeasonTagsQuery = { __typename?: 'Query', getSeasonsTagsValues?: { __typename?: 'GetSeasonsTagsValuesConnection', nodes: Array<string | null> } | null };

export type SearchSeasonCastQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchSeasonCastQuery = { __typename?: 'Query', getSeasonsCastsValues?: { __typename?: 'GetSeasonsCastsValuesConnection', nodes: Array<string | null> } | null };

export type SearchSeasonProductionCountriesQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchSeasonProductionCountriesQuery = { __typename?: 'Query', getSeasonsProductionCountriesValues?: { __typename?: 'GetSeasonsProductionCountriesValuesConnection', nodes: Array<string | null> } | null };

export type SeasonEpisodesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type SeasonEpisodesQuery = { __typename?: 'Query', season?: { __typename?: 'Season', episodes: { __typename?: 'EpisodesConnection', nodes: Array<{ __typename?: 'Episode', id: number, index: number, externalId?: string | null, title: string }> } } | null };

export type SeasonExplorerPropertiesFragment = { __typename?: 'Season', id: number, publishStatus: PublishStatus, index: number, externalId?: string | null, createdDate: any, updatedDate: any, released?: any | null, studio?: string | null, publishedDate?: any | null, seasonsImages: { __typename?: 'SeasonsImagesConnection', nodes: Array<{ __typename?: 'SeasonsImage', imageId: any }> }, seasonsTvshowGenres: { __typename?: 'SeasonsTvshowGenresConnection', nodes: Array<{ __typename?: 'SeasonsTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, seasonsTags: { __typename?: 'SeasonsTagsConnection', nodes: Array<{ __typename?: 'SeasonsTag', name: string }> }, seasonsCasts: { __typename?: 'SeasonsCastsConnection', nodes: Array<{ __typename?: 'SeasonsCast', name: string }> }, seasonsProductionCountries: { __typename?: 'SeasonsProductionCountriesConnection', nodes: Array<{ __typename?: 'SeasonsProductionCountry', name: string }> } };

export type SeasonsQueryVariables = Exact<{
  filter?: InputMaybe<SeasonFilter>;
  orderBy?: InputMaybe<Array<SeasonsOrderBy> | SeasonsOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type SeasonsQuery = { __typename?: 'Query', filtered?: { __typename?: 'SeasonsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'Season', id: number, publishStatus: PublishStatus, index: number, externalId?: string | null, createdDate: any, updatedDate: any, released?: any | null, studio?: string | null, publishedDate?: any | null, seasonsImages: { __typename?: 'SeasonsImagesConnection', nodes: Array<{ __typename?: 'SeasonsImage', imageId: any }> }, seasonsTvshowGenres: { __typename?: 'SeasonsTvshowGenresConnection', nodes: Array<{ __typename?: 'SeasonsTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, seasonsTags: { __typename?: 'SeasonsTagsConnection', nodes: Array<{ __typename?: 'SeasonsTag', name: string }> }, seasonsCasts: { __typename?: 'SeasonsCastsConnection', nodes: Array<{ __typename?: 'SeasonsCast', name: string }> }, seasonsProductionCountries: { __typename?: 'SeasonsProductionCountriesConnection', nodes: Array<{ __typename?: 'SeasonsProductionCountry', name: string }> } }> } | null, nonFiltered?: { __typename?: 'SeasonsConnection', totalCount: number } | null };

export type SeasonsMutatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SeasonsMutatedSubscription = { __typename?: 'Subscription', seasonMutated?: { __typename?: 'SeasonSubscriptionPayload', id: number, event?: string | null, season?: { __typename?: 'Season', id: number, publishStatus: PublishStatus, index: number, externalId?: string | null, createdDate: any, updatedDate: any, released?: any | null, studio?: string | null, publishedDate?: any | null, seasonsImages: { __typename?: 'SeasonsImagesConnection', nodes: Array<{ __typename?: 'SeasonsImage', imageId: any }> }, seasonsTvshowGenres: { __typename?: 'SeasonsTvshowGenresConnection', nodes: Array<{ __typename?: 'SeasonsTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, seasonsTags: { __typename?: 'SeasonsTagsConnection', nodes: Array<{ __typename?: 'SeasonsTag', name: string }> }, seasonsCasts: { __typename?: 'SeasonsCastsConnection', nodes: Array<{ __typename?: 'SeasonsCast', name: string }> }, seasonsProductionCountries: { __typename?: 'SeasonsProductionCountriesConnection', nodes: Array<{ __typename?: 'SeasonsProductionCountry', name: string }> } } | null } | null };

export type SeasonImagesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type SeasonImagesQuery = { __typename?: 'Query', season?: { __typename?: 'Season', seasonsImages: { __typename?: 'SeasonsImagesConnection', nodes: Array<{ __typename?: 'SeasonsImage', imageId: any, imageType: SeasonImageType }> } } | null };

export type SeasonsLicensesQueryVariables = Exact<{
  filter?: InputMaybe<SeasonsLicenseFilter>;
  orderBy?: InputMaybe<Array<SeasonsLicensesOrderBy> | SeasonsLicensesOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type SeasonsLicensesQuery = { __typename?: 'Query', seasonsLicenses?: { __typename?: 'SeasonsLicensesConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'SeasonsLicense', id: number, licenseEnd?: any | null, licenseStart?: any | null, seasonsLicensesCountries: { __typename?: 'SeasonsLicensesCountriesConnection', nodes: Array<{ __typename?: 'SeasonsLicensesCountry', code: IsoAlphaTwoCountryCodes }> } }> } | null };

export type CreateSeasonsLicenseMutationVariables = Exact<{
  input: CreateSeasonsLicenseInput;
}>;


export type CreateSeasonsLicenseMutation = { __typename?: 'Mutation', createSeasonsLicense?: { __typename?: 'CreateSeasonsLicensePayload', seasonsLicense?: { __typename?: 'SeasonsLicense', id: number } | null } | null };

export type SeasonsLicenseQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type SeasonsLicenseQuery = { __typename?: 'Query', seasonsLicense?: { __typename?: 'SeasonsLicense', licenseEnd?: any | null, licenseStart?: any | null, seasonId: number, seasonsLicensesCountries: { __typename?: 'SeasonsLicensesCountriesConnection', nodes: Array<{ __typename?: 'SeasonsLicensesCountry', code: IsoAlphaTwoCountryCodes }> } } | null };

export type UpdateSeasonsLicenseMutationVariables = Exact<{
  input: UpdateSeasonsLicenseInput;
}>;


export type UpdateSeasonsLicenseMutation = { __typename?: 'Mutation', updateSeasonsLicense?: { __typename?: 'UpdateSeasonsLicensePayload', clientMutationId?: string | null } | null };

export type DeleteSeasonsLicenseMutationVariables = Exact<{
  input: DeleteSeasonsLicenseInput;
}>;


export type DeleteSeasonsLicenseMutation = { __typename?: 'Mutation', deleteSeasonsLicense?: { __typename?: 'DeleteSeasonsLicensePayload', clientMutationId?: string | null } | null };

export type CreateSeasonSnapshotMutationVariables = Exact<{
  seasonId: Scalars['Int'];
}>;


export type CreateSeasonSnapshotMutation = { __typename?: 'Mutation', createSeasonSnapshot?: { __typename?: 'Snapshot', id: number } | null };

export type SeasonVideosQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type SeasonVideosQuery = { __typename?: 'Query', season?: { __typename?: 'Season', seasonsTrailers: { __typename?: 'SeasonsTrailersConnection', nodes: Array<{ __typename?: 'SeasonsTrailer', videoId: any }> } } | null };

export type BulkDeleteSeasonsMutationVariables = Exact<{
  filter?: InputMaybe<SeasonFilter>;
}>;


export type BulkDeleteSeasonsMutation = { __typename?: 'Mutation', deleteSeasons?: { __typename?: 'BulkMutationIntPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkPublishSeasonsMutationVariables = Exact<{
  filter?: InputMaybe<SeasonFilter>;
}>;


export type BulkPublishSeasonsMutation = { __typename?: 'Mutation', publishSeasons?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkUnpublishSeasonsMutationVariables = Exact<{
  filter?: InputMaybe<SeasonFilter>;
}>;


export type BulkUnpublishSeasonsMutation = { __typename?: 'Mutation', unpublishSeasons?: { __typename?: 'BulkMutationPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkCreateSeasonSnapshotsMutationVariables = Exact<{
  filter?: InputMaybe<SeasonFilter>;
}>;


export type BulkCreateSeasonSnapshotsMutation = { __typename?: 'Mutation', createSeasonSnapshots?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type CreateTvShowMutationVariables = Exact<{
  input: CreateTvshowInput;
}>;


export type CreateTvShowMutation = { __typename?: 'Mutation', createTvshow?: { __typename?: 'CreateTvshowPayload', tvshow?: { __typename?: 'Tvshow', id: number, title: string } | null } | null };

export type TvShowQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TvShowQuery = { __typename?: 'Query', tvshow?: { __typename?: 'Tvshow', title: string, originalTitle?: string | null, synopsis?: string | null, description?: string | null, externalId?: string | null, studio?: string | null, released?: any | null, id: number, createdDate: any, createdUser: string, updatedDate: any, updatedUser: string, publishStatus: PublishStatus, publishedDate?: any | null, publishedUser?: string | null, tvshowsTags: { __typename?: 'TvshowsTagsConnection', nodes: Array<{ __typename?: 'TvshowsTag', name: string }> }, tvshowsTvshowGenres: { __typename?: 'TvshowsTvshowGenresConnection', nodes: Array<{ __typename?: 'TvshowsTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, tvshowsCasts: { __typename?: 'TvshowsCastsConnection', nodes: Array<{ __typename?: 'TvshowsCast', name: string }> }, tvshowsProductionCountries: { __typename?: 'TvshowsProductionCountriesConnection', nodes: Array<{ __typename?: 'TvshowsProductionCountry', name: string }> }, seasons: { __typename?: 'SeasonsConnection', totalCount: number }, tvshowsImages: { __typename?: 'TvshowsImagesConnection', nodes: Array<{ __typename?: 'TvshowsImage', imageType: TvshowImageType, imageId: any }> }, tvshowsTrailers: { __typename?: 'TvshowsTrailersConnection', totalCount: number } } | null, tvshowGenres?: { __typename?: 'TvshowGenresConnection', nodes: Array<{ __typename?: 'TvshowGenre', title: string, id: number }> } | null };

export type DeleteTvShowMutationVariables = Exact<{
  input: DeleteTvshowInput;
}>;


export type DeleteTvShowMutation = { __typename?: 'Mutation', deleteTvshow?: { __typename?: 'DeleteTvshowPayload', clientMutationId?: string | null } | null };

export type PublishTvShowMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PublishTvShowMutation = { __typename?: 'Mutation', publishTvshow?: { __typename?: 'Snapshot', id: number } | null };

export type UnpublishTvShowMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UnpublishTvShowMutation = { __typename?: 'Mutation', unpublishTvshow?: { __typename?: 'Snapshot', id: number } | null };

export type TvShowTitleQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TvShowTitleQuery = { __typename?: 'Query', tvshow?: { __typename?: 'Tvshow', id: number, title: string } | null };

export type SearchTvShowTagsQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchTvShowTagsQuery = { __typename?: 'Query', getTvshowsTagsValues?: { __typename?: 'GetTvshowsTagsValuesConnection', nodes: Array<string | null> } | null };

export type SearchTvShowCastQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchTvShowCastQuery = { __typename?: 'Query', getTvshowsCastsValues?: { __typename?: 'GetTvshowsCastsValuesConnection', nodes: Array<string | null> } | null };

export type SearchTvShowProductionCountriesQueryVariables = Exact<{
  searchKey: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type SearchTvShowProductionCountriesQuery = { __typename?: 'Query', getTvshowsProductionCountriesValues?: { __typename?: 'GetTvshowsProductionCountriesValuesConnection', nodes: Array<string | null> } | null };

export type TvShowExplorerPropertiesFragment = { __typename?: 'Tvshow', id: number, publishStatus: PublishStatus, title: string, externalId?: string | null, createdDate: any, updatedDate: any, originalTitle?: string | null, released?: any | null, studio?: string | null, publishedDate?: any | null, tvshowsImages: { __typename?: 'TvshowsImagesConnection', nodes: Array<{ __typename?: 'TvshowsImage', imageId: any }> }, tvshowsTvshowGenres: { __typename?: 'TvshowsTvshowGenresConnection', nodes: Array<{ __typename?: 'TvshowsTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, tvshowsTags: { __typename?: 'TvshowsTagsConnection', nodes: Array<{ __typename?: 'TvshowsTag', name: string }> }, tvshowsCasts: { __typename?: 'TvshowsCastsConnection', nodes: Array<{ __typename?: 'TvshowsCast', name: string }> }, tvshowsProductionCountries: { __typename?: 'TvshowsProductionCountriesConnection', nodes: Array<{ __typename?: 'TvshowsProductionCountry', name: string }> } };

export type TvShowsQueryVariables = Exact<{
  filter?: InputMaybe<TvshowFilter>;
  orderBy?: InputMaybe<Array<TvshowsOrderBy> | TvshowsOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type TvShowsQuery = { __typename?: 'Query', filtered?: { __typename?: 'TvshowsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'Tvshow', id: number, publishStatus: PublishStatus, title: string, externalId?: string | null, createdDate: any, updatedDate: any, originalTitle?: string | null, released?: any | null, studio?: string | null, publishedDate?: any | null, tvshowsImages: { __typename?: 'TvshowsImagesConnection', nodes: Array<{ __typename?: 'TvshowsImage', imageId: any }> }, tvshowsTvshowGenres: { __typename?: 'TvshowsTvshowGenresConnection', nodes: Array<{ __typename?: 'TvshowsTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, tvshowsTags: { __typename?: 'TvshowsTagsConnection', nodes: Array<{ __typename?: 'TvshowsTag', name: string }> }, tvshowsCasts: { __typename?: 'TvshowsCastsConnection', nodes: Array<{ __typename?: 'TvshowsCast', name: string }> }, tvshowsProductionCountries: { __typename?: 'TvshowsProductionCountriesConnection', nodes: Array<{ __typename?: 'TvshowsProductionCountry', name: string }> } }> } | null, nonFiltered?: { __typename?: 'TvshowsConnection', totalCount: number } | null };

export type TvShowsMutatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TvShowsMutatedSubscription = { __typename?: 'Subscription', tvshowMutated?: { __typename?: 'TvshowSubscriptionPayload', id: number, event?: string | null, tvshow?: { __typename?: 'Tvshow', id: number, publishStatus: PublishStatus, title: string, externalId?: string | null, createdDate: any, updatedDate: any, originalTitle?: string | null, released?: any | null, studio?: string | null, publishedDate?: any | null, tvshowsImages: { __typename?: 'TvshowsImagesConnection', nodes: Array<{ __typename?: 'TvshowsImage', imageId: any }> }, tvshowsTvshowGenres: { __typename?: 'TvshowsTvshowGenresConnection', nodes: Array<{ __typename?: 'TvshowsTvshowGenre', tvshowGenres?: { __typename?: 'TvshowGenre', title: string } | null }> }, tvshowsTags: { __typename?: 'TvshowsTagsConnection', nodes: Array<{ __typename?: 'TvshowsTag', name: string }> }, tvshowsCasts: { __typename?: 'TvshowsCastsConnection', nodes: Array<{ __typename?: 'TvshowsCast', name: string }> }, tvshowsProductionCountries: { __typename?: 'TvshowsProductionCountriesConnection', nodes: Array<{ __typename?: 'TvshowsProductionCountry', name: string }> } } | null } | null };

export type TvShowGenresQueryVariables = Exact<{ [key: string]: never; }>;


export type TvShowGenresQuery = { __typename?: 'Query', tvshowGenres?: { __typename?: 'TvshowGenresConnection', totalCount: number, nodes: Array<{ __typename?: 'TvshowGenre', sortOrder: number, title: string, id: number, updatedDate: any, updatedUser: string }> } | null, snapshots?: { __typename?: 'SnapshotsConnection', nodes: Array<{ __typename?: 'Snapshot', updatedUser: string, publishedDate?: any | null, snapshotState: SnapshotState }> } | null };

export type PublishTvShowGenresMutationVariables = Exact<{ [key: string]: never; }>;


export type PublishTvShowGenresMutation = { __typename?: 'Mutation', publishTvshowGenres?: { __typename?: 'Snapshot', id: number } | null };

export type UnpublishTvShowGenresMutationVariables = Exact<{ [key: string]: never; }>;


export type UnpublishTvShowGenresMutation = { __typename?: 'Mutation', unpublishTvshowGenres?: { __typename?: 'Snapshot', id: number } | null };

export type CreateTvShowGenresMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateTvShowGenresMutation = { __typename?: 'Mutation', createTvshowGenresSnapshot?: { __typename?: 'Snapshot', id: number } | null };

export type TvshowImagesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TvshowImagesQuery = { __typename?: 'Query', tvshow?: { __typename?: 'Tvshow', tvshowsImages: { __typename?: 'TvshowsImagesConnection', nodes: Array<{ __typename?: 'TvshowsImage', imageId: any, imageType: TvshowImageType }> } } | null };

export type TvshowsLicensesQueryVariables = Exact<{
  filter?: InputMaybe<TvshowsLicenseFilter>;
  orderBy?: InputMaybe<Array<TvshowsLicensesOrderBy> | TvshowsLicensesOrderBy>;
  after?: InputMaybe<Scalars['Cursor']>;
}>;


export type TvshowsLicensesQuery = { __typename?: 'Query', tvshowsLicenses?: { __typename?: 'TvshowsLicensesConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: any | null }, nodes: Array<{ __typename?: 'TvshowsLicense', id: number, licenseEnd?: any | null, licenseStart?: any | null, tvshowsLicensesCountries: { __typename?: 'TvshowsLicensesCountriesConnection', nodes: Array<{ __typename?: 'TvshowsLicensesCountry', code: IsoAlphaTwoCountryCodes }> } }> } | null };

export type CreateTvshowsLicenseMutationVariables = Exact<{
  input: CreateTvshowsLicenseInput;
}>;


export type CreateTvshowsLicenseMutation = { __typename?: 'Mutation', createTvshowsLicense?: { __typename?: 'CreateTvshowsLicensePayload', tvshowsLicense?: { __typename?: 'TvshowsLicense', id: number } | null } | null };

export type TvshowsLicenseQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TvshowsLicenseQuery = { __typename?: 'Query', tvshowsLicense?: { __typename?: 'TvshowsLicense', licenseEnd?: any | null, licenseStart?: any | null, tvshowId: number, tvshowsLicensesCountries: { __typename?: 'TvshowsLicensesCountriesConnection', nodes: Array<{ __typename?: 'TvshowsLicensesCountry', code: IsoAlphaTwoCountryCodes }> } } | null };

export type UpdateTvshowsLicenseMutationVariables = Exact<{
  input: UpdateTvshowsLicenseInput;
}>;


export type UpdateTvshowsLicenseMutation = { __typename?: 'Mutation', updateTvshowsLicense?: { __typename?: 'UpdateTvshowsLicensePayload', clientMutationId?: string | null } | null };

export type DeleteTvshowsLicenseMutationVariables = Exact<{
  input: DeleteTvshowsLicenseInput;
}>;


export type DeleteTvshowsLicenseMutation = { __typename?: 'Mutation', deleteTvshowsLicense?: { __typename?: 'DeleteTvshowsLicensePayload', clientMutationId?: string | null } | null };

export type TvShowSeasonsQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TvShowSeasonsQuery = { __typename?: 'Query', tvshow?: { __typename?: 'Tvshow', seasons: { __typename?: 'SeasonsConnection', nodes: Array<{ __typename?: 'Season', id: number, index: number, externalId?: string | null }> } } | null };

export type CreateTvShowSnapshotMutationVariables = Exact<{
  tvshowId: Scalars['Int'];
}>;


export type CreateTvShowSnapshotMutation = { __typename?: 'Mutation', createTvshowSnapshot?: { __typename?: 'Snapshot', id: number } | null };

export type TvShowVideosQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TvShowVideosQuery = { __typename?: 'Query', tvshow?: { __typename?: 'Tvshow', tvshowsTrailers: { __typename?: 'TvshowsTrailersConnection', nodes: Array<{ __typename?: 'TvshowsTrailer', videoId: any }> } } | null };

export type BulkDeleteTvShowsMutationVariables = Exact<{
  filter?: InputMaybe<TvshowFilter>;
}>;


export type BulkDeleteTvShowsMutation = { __typename?: 'Mutation', deleteTvshows?: { __typename?: 'BulkMutationIntPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkPublishTvShowsMutationVariables = Exact<{
  filter?: InputMaybe<TvshowFilter>;
}>;


export type BulkPublishTvShowsMutation = { __typename?: 'Mutation', publishTvshows?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkUnpublishTvShowsMutationVariables = Exact<{
  filter?: InputMaybe<TvshowFilter>;
}>;


export type BulkUnpublishTvShowsMutation = { __typename?: 'Mutation', unpublishTvshows?: { __typename?: 'BulkMutationPayload', affectedIds?: Array<number | null> | null } | null };

export type BulkCreateTvShowSnapshotsMutationVariables = Exact<{
  filter?: InputMaybe<TvshowFilter>;
}>;


export type BulkCreateTvShowSnapshotsMutation = { __typename?: 'Mutation', createTvshowSnapshots?: { __typename?: 'BulkPublishingPayload', affectedIds?: Array<number | null> | null } | null };

export const CollectionExplorerPropertiesFragmentDoc = gql`
    fragment CollectionExplorerProperties on Collection {
  id
  title
  externalId
  collectionsTags {
    nodes {
      name
    }
  }
  publishedDate
  createdDate
  updatedDate
  publishStatus
  collectionsImages {
    nodes {
      imageId
    }
  }
}
    `;
export const EpisodeExplorerPropertiesFragmentDoc = gql`
    fragment EpisodeExplorerProperties on Episode {
  publishStatus
  title
  index
  externalId
  episodesImages(condition: {imageType: COVER}) {
    nodes {
      imageId
    }
  }
  episodesTvshowGenres {
    nodes {
      tvshowGenres {
        title
      }
    }
  }
  createdDate
  updatedDate
  originalTitle
  episodesTags {
    nodes {
      name
    }
  }
  episodesCasts {
    nodes {
      name
    }
  }
  released
  episodesProductionCountries {
    nodes {
      name
    }
  }
  studio
  publishedDate
  id
}
    `;
export const IngestDocumentExplorerPropertiesFragmentDoc = gql`
    fragment IngestDocumentExplorerProperties on IngestDocument {
  id
  title
  status
  itemsCount
  errorCount
  successCount
  inProgressCount
  createdDate
  updatedDate
}
    `;
export const MovieExplorerPropertiesFragmentDoc = gql`
    fragment MovieExplorerProperties on Movie {
  id
  title
  originalTitle
  externalId
  moviesImages(condition: {imageType: COVER}) {
    nodes {
      imageId
    }
  }
  moviesTags {
    nodes {
      name
    }
  }
  moviesMovieGenres {
    nodes {
      movieGenres {
        title
      }
    }
  }
  moviesCasts {
    nodes {
      name
    }
  }
  released
  moviesProductionCountries {
    nodes {
      name
    }
  }
  studio
  publishedDate
  createdDate
  updatedDate
  publishStatus
}
    `;
export const PublishingSnapshotExplorerPropertiesFragmentDoc = gql`
    fragment PublishingSnapshotExplorerProperties on Snapshot {
  id
  createdDate
  createdUser
  snapshotValidationResults {
    nodes {
      severity
    }
  }
  snapshotNo
  snapshotState
  updatedDate
  updatedUser
  validationStatus
}
    `;
export const SnapshotExplorerPropertiesFragmentDoc = gql`
    fragment SnapshotExplorerProperties on Snapshot {
  id
  entityId
  entityType
  entityTitle
  jobId
  createdDate
  createdUser
  snapshotValidationResults {
    nodes {
      id
      context
      message
      severity
    }
  }
  snapshotState
  updatedDate
  updatedUser
  validationStatus
  publishedDate
  unpublishedDate
}
    `;
export const SeasonExplorerPropertiesFragmentDoc = gql`
    fragment SeasonExplorerProperties on Season {
  id
  publishStatus
  index
  externalId
  seasonsImages(condition: {imageType: COVER}) {
    nodes {
      imageId
    }
  }
  seasonsTvshowGenres {
    nodes {
      tvshowGenres {
        title
      }
    }
  }
  createdDate
  updatedDate
  seasonsTags {
    nodes {
      name
    }
  }
  seasonsCasts {
    nodes {
      name
    }
  }
  released
  seasonsProductionCountries {
    nodes {
      name
    }
  }
  studio
  publishedDate
}
    `;
export const TvShowExplorerPropertiesFragmentDoc = gql`
    fragment TVShowExplorerProperties on Tvshow {
  id
  publishStatus
  title
  externalId
  tvshowsImages(condition: {imageType: COVER}) {
    nodes {
      imageId
    }
  }
  tvshowsTvshowGenres {
    nodes {
      tvshowGenres {
        title
      }
    }
  }
  createdDate
  updatedDate
  originalTitle
  tvshowsTags {
    nodes {
      name
    }
  }
  tvshowsCasts {
    nodes {
      name
    }
  }
  released
  tvshowsProductionCountries {
    nodes {
      name
    }
  }
  studio
  publishedDate
}
    `;
export const CreateCollectionDocument = gql`
    mutation CreateCollection($input: CreateCollectionInput!) {
  createCollection(input: $input) {
    collection {
      id
      title
    }
  }
}
    `;
export type CreateCollectionMutationFn = Apollo.MutationFunction<CreateCollectionMutation, CreateCollectionMutationVariables>;

/**
 * __useCreateCollectionMutation__
 *
 * To run a mutation, you first call `useCreateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionMutation, { data, loading, error }] = useCreateCollectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCollectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateCollectionMutation, CreateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCollectionMutation, CreateCollectionMutationVariables>(CreateCollectionDocument, options);
      }
export type CreateCollectionMutationHookResult = ReturnType<typeof useCreateCollectionMutation>;
export type CreateCollectionMutationResult = Apollo.MutationResult<CreateCollectionMutation>;
export type CreateCollectionMutationOptions = Apollo.BaseMutationOptions<CreateCollectionMutation, CreateCollectionMutationVariables>;
export const CollectionDocument = gql`
    query Collection($id: Int!) {
  collection(id: $id) {
    title
    synopsis
    description
    externalId
    collectionsTags {
      nodes {
        name
      }
    }
    collectionsImages {
      nodes {
        imageType
        imageId
      }
    }
    id
    createdDate
    createdUser
    updatedDate
    updatedUser
    publishStatus
    publishedDate
    publishedUser
    movies: collectionRelations(filter: {movieExists: true}) {
      totalCount
    }
    tvshows: collectionRelations(filter: {tvshowExists: true}) {
      totalCount
    }
    seasons: collectionRelations(filter: {seasonExists: true}) {
      totalCount
    }
    episodes: collectionRelations(filter: {episodeExists: true}) {
      totalCount
    }
  }
}
    `;

/**
 * __useCollectionQuery__
 *
 * To run a query within a React component, call `useCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionQuery(baseOptions: Apollo.QueryHookOptions<CollectionQuery, CollectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
      }
export function useCollectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionQuery, CollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
        }
export type CollectionQueryHookResult = ReturnType<typeof useCollectionQuery>;
export type CollectionLazyQueryHookResult = ReturnType<typeof useCollectionLazyQuery>;
export type CollectionQueryResult = Apollo.QueryResult<CollectionQuery, CollectionQueryVariables>;
export const DeleteCollectionDocument = gql`
    mutation DeleteCollection($input: DeleteCollectionInput!) {
  deleteCollection(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteCollectionMutationFn = Apollo.MutationFunction<DeleteCollectionMutation, DeleteCollectionMutationVariables>;

/**
 * __useDeleteCollectionMutation__
 *
 * To run a mutation, you first call `useDeleteCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCollectionMutation, { data, loading, error }] = useDeleteCollectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteCollectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCollectionMutation, DeleteCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCollectionMutation, DeleteCollectionMutationVariables>(DeleteCollectionDocument, options);
      }
export type DeleteCollectionMutationHookResult = ReturnType<typeof useDeleteCollectionMutation>;
export type DeleteCollectionMutationResult = Apollo.MutationResult<DeleteCollectionMutation>;
export type DeleteCollectionMutationOptions = Apollo.BaseMutationOptions<DeleteCollectionMutation, DeleteCollectionMutationVariables>;
export const PublishCollectionDocument = gql`
    mutation PublishCollection($id: Int!) {
  publishCollection(collectionId: $id) {
    id
  }
}
    `;
export type PublishCollectionMutationFn = Apollo.MutationFunction<PublishCollectionMutation, PublishCollectionMutationVariables>;

/**
 * __usePublishCollectionMutation__
 *
 * To run a mutation, you first call `usePublishCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishCollectionMutation, { data, loading, error }] = usePublishCollectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePublishCollectionMutation(baseOptions?: Apollo.MutationHookOptions<PublishCollectionMutation, PublishCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishCollectionMutation, PublishCollectionMutationVariables>(PublishCollectionDocument, options);
      }
export type PublishCollectionMutationHookResult = ReturnType<typeof usePublishCollectionMutation>;
export type PublishCollectionMutationResult = Apollo.MutationResult<PublishCollectionMutation>;
export type PublishCollectionMutationOptions = Apollo.BaseMutationOptions<PublishCollectionMutation, PublishCollectionMutationVariables>;
export const UnpublishCollectionDocument = gql`
    mutation UnpublishCollection($id: Int!) {
  unpublishCollection(collectionId: $id) {
    id
  }
}
    `;
export type UnpublishCollectionMutationFn = Apollo.MutationFunction<UnpublishCollectionMutation, UnpublishCollectionMutationVariables>;

/**
 * __useUnpublishCollectionMutation__
 *
 * To run a mutation, you first call `useUnpublishCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishCollectionMutation, { data, loading, error }] = useUnpublishCollectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnpublishCollectionMutation(baseOptions?: Apollo.MutationHookOptions<UnpublishCollectionMutation, UnpublishCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpublishCollectionMutation, UnpublishCollectionMutationVariables>(UnpublishCollectionDocument, options);
      }
export type UnpublishCollectionMutationHookResult = ReturnType<typeof useUnpublishCollectionMutation>;
export type UnpublishCollectionMutationResult = Apollo.MutationResult<UnpublishCollectionMutation>;
export type UnpublishCollectionMutationOptions = Apollo.BaseMutationOptions<UnpublishCollectionMutation, UnpublishCollectionMutationVariables>;
export const CollectionTitleDocument = gql`
    query CollectionTitle($id: Int!) {
  collection(id: $id) {
    id
    title
  }
}
    `;

/**
 * __useCollectionTitleQuery__
 *
 * To run a query within a React component, call `useCollectionTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionTitleQuery(baseOptions: Apollo.QueryHookOptions<CollectionTitleQuery, CollectionTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionTitleQuery, CollectionTitleQueryVariables>(CollectionTitleDocument, options);
      }
export function useCollectionTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionTitleQuery, CollectionTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionTitleQuery, CollectionTitleQueryVariables>(CollectionTitleDocument, options);
        }
export type CollectionTitleQueryHookResult = ReturnType<typeof useCollectionTitleQuery>;
export type CollectionTitleLazyQueryHookResult = ReturnType<typeof useCollectionTitleLazyQuery>;
export type CollectionTitleQueryResult = Apollo.QueryResult<CollectionTitleQuery, CollectionTitleQueryVariables>;
export const SearchCollectionTagsDocument = gql`
    query SearchCollectionTags($searchKey: String!, $limit: Int!) {
  getCollectionsTagsValues(
    filter: {startsWithInsensitive: $searchKey}
    first: $limit
  ) {
    nodes
  }
}
    `;

/**
 * __useSearchCollectionTagsQuery__
 *
 * To run a query within a React component, call `useSearchCollectionTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCollectionTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCollectionTagsQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchCollectionTagsQuery(baseOptions: Apollo.QueryHookOptions<SearchCollectionTagsQuery, SearchCollectionTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchCollectionTagsQuery, SearchCollectionTagsQueryVariables>(SearchCollectionTagsDocument, options);
      }
export function useSearchCollectionTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCollectionTagsQuery, SearchCollectionTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchCollectionTagsQuery, SearchCollectionTagsQueryVariables>(SearchCollectionTagsDocument, options);
        }
export type SearchCollectionTagsQueryHookResult = ReturnType<typeof useSearchCollectionTagsQuery>;
export type SearchCollectionTagsLazyQueryHookResult = ReturnType<typeof useSearchCollectionTagsLazyQuery>;
export type SearchCollectionTagsQueryResult = Apollo.QueryResult<SearchCollectionTagsQuery, SearchCollectionTagsQueryVariables>;
export const CollectionRelatedEntitiesDocument = gql`
    query CollectionRelatedEntities($id: Int!) {
  collection(id: $id) {
    collectionRelations {
      nodes {
        movie {
          entityId: id
          title
          publishStatus
          entityImages: moviesImages {
            nodes {
              imageId
            }
          }
        }
        tvshow {
          entityId: id
          title
          publishStatus
          entityImages: tvshowsImages {
            nodes {
              imageId
            }
          }
        }
        season {
          entityId: id
          index
          publishStatus
          entityImages: seasonsImages {
            nodes {
              imageId
            }
          }
        }
        episode {
          entityId: id
          title
          publishStatus
          entityImages: episodesImages {
            nodes {
              imageId
            }
          }
        }
        id
        sortOrder
      }
    }
  }
}
    `;

/**
 * __useCollectionRelatedEntitiesQuery__
 *
 * To run a query within a React component, call `useCollectionRelatedEntitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionRelatedEntitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionRelatedEntitiesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionRelatedEntitiesQuery(baseOptions: Apollo.QueryHookOptions<CollectionRelatedEntitiesQuery, CollectionRelatedEntitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionRelatedEntitiesQuery, CollectionRelatedEntitiesQueryVariables>(CollectionRelatedEntitiesDocument, options);
      }
export function useCollectionRelatedEntitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionRelatedEntitiesQuery, CollectionRelatedEntitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionRelatedEntitiesQuery, CollectionRelatedEntitiesQueryVariables>(CollectionRelatedEntitiesDocument, options);
        }
export type CollectionRelatedEntitiesQueryHookResult = ReturnType<typeof useCollectionRelatedEntitiesQuery>;
export type CollectionRelatedEntitiesLazyQueryHookResult = ReturnType<typeof useCollectionRelatedEntitiesLazyQuery>;
export type CollectionRelatedEntitiesQueryResult = Apollo.QueryResult<CollectionRelatedEntitiesQuery, CollectionRelatedEntitiesQueryVariables>;
export const CollectionImagesDocument = gql`
    query CollectionImages($id: Int!) {
  collection(id: $id) {
    collectionsImages {
      nodes {
        imageId
        imageType
      }
    }
  }
}
    `;

/**
 * __useCollectionImagesQuery__
 *
 * To run a query within a React component, call `useCollectionImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionImagesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionImagesQuery(baseOptions: Apollo.QueryHookOptions<CollectionImagesQuery, CollectionImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionImagesQuery, CollectionImagesQueryVariables>(CollectionImagesDocument, options);
      }
export function useCollectionImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionImagesQuery, CollectionImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionImagesQuery, CollectionImagesQueryVariables>(CollectionImagesDocument, options);
        }
export type CollectionImagesQueryHookResult = ReturnType<typeof useCollectionImagesQuery>;
export type CollectionImagesLazyQueryHookResult = ReturnType<typeof useCollectionImagesLazyQuery>;
export type CollectionImagesQueryResult = Apollo.QueryResult<CollectionImagesQuery, CollectionImagesQueryVariables>;
export const CreateCollectionSnapshotDocument = gql`
    mutation CreateCollectionSnapshot($collectionId: Int!) {
  createCollectionSnapshot(collectionId: $collectionId) {
    id
  }
}
    `;
export type CreateCollectionSnapshotMutationFn = Apollo.MutationFunction<CreateCollectionSnapshotMutation, CreateCollectionSnapshotMutationVariables>;

/**
 * __useCreateCollectionSnapshotMutation__
 *
 * To run a mutation, you first call `useCreateCollectionSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionSnapshotMutation, { data, loading, error }] = useCreateCollectionSnapshotMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useCreateCollectionSnapshotMutation(baseOptions?: Apollo.MutationHookOptions<CreateCollectionSnapshotMutation, CreateCollectionSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCollectionSnapshotMutation, CreateCollectionSnapshotMutationVariables>(CreateCollectionSnapshotDocument, options);
      }
export type CreateCollectionSnapshotMutationHookResult = ReturnType<typeof useCreateCollectionSnapshotMutation>;
export type CreateCollectionSnapshotMutationResult = Apollo.MutationResult<CreateCollectionSnapshotMutation>;
export type CreateCollectionSnapshotMutationOptions = Apollo.BaseMutationOptions<CreateCollectionSnapshotMutation, CreateCollectionSnapshotMutationVariables>;
export const CollectionsDocument = gql`
    query Collections($filter: CollectionFilter, $orderBy: [CollectionsOrderBy!], $after: Cursor) {
  filtered: collections(
    filter: $filter
    orderBy: $orderBy
    first: 30
    after: $after
  ) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...CollectionExplorerProperties
    }
  }
  nonFiltered: collections {
    totalCount
  }
}
    ${CollectionExplorerPropertiesFragmentDoc}`;

/**
 * __useCollectionsQuery__
 *
 * To run a query within a React component, call `useCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useCollectionsQuery(baseOptions?: Apollo.QueryHookOptions<CollectionsQuery, CollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionsQuery, CollectionsQueryVariables>(CollectionsDocument, options);
      }
export function useCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionsQuery, CollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionsQuery, CollectionsQueryVariables>(CollectionsDocument, options);
        }
export type CollectionsQueryHookResult = ReturnType<typeof useCollectionsQuery>;
export type CollectionsLazyQueryHookResult = ReturnType<typeof useCollectionsLazyQuery>;
export type CollectionsQueryResult = Apollo.QueryResult<CollectionsQuery, CollectionsQueryVariables>;
export const CollectionsMutatedDocument = gql`
    subscription CollectionsMutated {
  collectionMutated {
    id
    event
    collection {
      ...CollectionExplorerProperties
    }
  }
}
    ${CollectionExplorerPropertiesFragmentDoc}`;

/**
 * __useCollectionsMutatedSubscription__
 *
 * To run a query within a React component, call `useCollectionsMutatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCollectionsMutatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionsMutatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCollectionsMutatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CollectionsMutatedSubscription, CollectionsMutatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CollectionsMutatedSubscription, CollectionsMutatedSubscriptionVariables>(CollectionsMutatedDocument, options);
      }
export type CollectionsMutatedSubscriptionHookResult = ReturnType<typeof useCollectionsMutatedSubscription>;
export type CollectionsMutatedSubscriptionResult = Apollo.SubscriptionResult<CollectionsMutatedSubscription>;
export const BulkDeleteCollectionsDocument = gql`
    mutation BulkDeleteCollections($filter: CollectionFilter) {
  deleteCollections(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkDeleteCollectionsMutationFn = Apollo.MutationFunction<BulkDeleteCollectionsMutation, BulkDeleteCollectionsMutationVariables>;

/**
 * __useBulkDeleteCollectionsMutation__
 *
 * To run a mutation, you first call `useBulkDeleteCollectionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteCollectionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteCollectionsMutation, { data, loading, error }] = useBulkDeleteCollectionsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkDeleteCollectionsMutation(baseOptions?: Apollo.MutationHookOptions<BulkDeleteCollectionsMutation, BulkDeleteCollectionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkDeleteCollectionsMutation, BulkDeleteCollectionsMutationVariables>(BulkDeleteCollectionsDocument, options);
      }
export type BulkDeleteCollectionsMutationHookResult = ReturnType<typeof useBulkDeleteCollectionsMutation>;
export type BulkDeleteCollectionsMutationResult = Apollo.MutationResult<BulkDeleteCollectionsMutation>;
export type BulkDeleteCollectionsMutationOptions = Apollo.BaseMutationOptions<BulkDeleteCollectionsMutation, BulkDeleteCollectionsMutationVariables>;
export const BulkPublishCollectionsDocument = gql`
    mutation BulkPublishCollections($filter: CollectionFilter) {
  publishCollections(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkPublishCollectionsMutationFn = Apollo.MutationFunction<BulkPublishCollectionsMutation, BulkPublishCollectionsMutationVariables>;

/**
 * __useBulkPublishCollectionsMutation__
 *
 * To run a mutation, you first call `useBulkPublishCollectionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkPublishCollectionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkPublishCollectionsMutation, { data, loading, error }] = useBulkPublishCollectionsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkPublishCollectionsMutation(baseOptions?: Apollo.MutationHookOptions<BulkPublishCollectionsMutation, BulkPublishCollectionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkPublishCollectionsMutation, BulkPublishCollectionsMutationVariables>(BulkPublishCollectionsDocument, options);
      }
export type BulkPublishCollectionsMutationHookResult = ReturnType<typeof useBulkPublishCollectionsMutation>;
export type BulkPublishCollectionsMutationResult = Apollo.MutationResult<BulkPublishCollectionsMutation>;
export type BulkPublishCollectionsMutationOptions = Apollo.BaseMutationOptions<BulkPublishCollectionsMutation, BulkPublishCollectionsMutationVariables>;
export const BulkUnpublishCollectionsDocument = gql`
    mutation BulkUnpublishCollections($filter: CollectionFilter) {
  unpublishCollections(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkUnpublishCollectionsMutationFn = Apollo.MutationFunction<BulkUnpublishCollectionsMutation, BulkUnpublishCollectionsMutationVariables>;

/**
 * __useBulkUnpublishCollectionsMutation__
 *
 * To run a mutation, you first call `useBulkUnpublishCollectionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkUnpublishCollectionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkUnpublishCollectionsMutation, { data, loading, error }] = useBulkUnpublishCollectionsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkUnpublishCollectionsMutation(baseOptions?: Apollo.MutationHookOptions<BulkUnpublishCollectionsMutation, BulkUnpublishCollectionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkUnpublishCollectionsMutation, BulkUnpublishCollectionsMutationVariables>(BulkUnpublishCollectionsDocument, options);
      }
export type BulkUnpublishCollectionsMutationHookResult = ReturnType<typeof useBulkUnpublishCollectionsMutation>;
export type BulkUnpublishCollectionsMutationResult = Apollo.MutationResult<BulkUnpublishCollectionsMutation>;
export type BulkUnpublishCollectionsMutationOptions = Apollo.BaseMutationOptions<BulkUnpublishCollectionsMutation, BulkUnpublishCollectionsMutationVariables>;
export const BulkCreateCollectionSnapshotsDocument = gql`
    mutation BulkCreateCollectionSnapshots($filter: CollectionFilter) {
  createCollectionSnapshots(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkCreateCollectionSnapshotsMutationFn = Apollo.MutationFunction<BulkCreateCollectionSnapshotsMutation, BulkCreateCollectionSnapshotsMutationVariables>;

/**
 * __useBulkCreateCollectionSnapshotsMutation__
 *
 * To run a mutation, you first call `useBulkCreateCollectionSnapshotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkCreateCollectionSnapshotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkCreateCollectionSnapshotsMutation, { data, loading, error }] = useBulkCreateCollectionSnapshotsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkCreateCollectionSnapshotsMutation(baseOptions?: Apollo.MutationHookOptions<BulkCreateCollectionSnapshotsMutation, BulkCreateCollectionSnapshotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkCreateCollectionSnapshotsMutation, BulkCreateCollectionSnapshotsMutationVariables>(BulkCreateCollectionSnapshotsDocument, options);
      }
export type BulkCreateCollectionSnapshotsMutationHookResult = ReturnType<typeof useBulkCreateCollectionSnapshotsMutation>;
export type BulkCreateCollectionSnapshotsMutationResult = Apollo.MutationResult<BulkCreateCollectionSnapshotsMutation>;
export type BulkCreateCollectionSnapshotsMutationOptions = Apollo.BaseMutationOptions<BulkCreateCollectionSnapshotsMutation, BulkCreateCollectionSnapshotsMutationVariables>;
export const CreateEpisodeDocument = gql`
    mutation CreateEpisode($input: CreateEpisodeInput!) {
  createEpisode(input: $input) {
    episode {
      id
      title
    }
  }
}
    `;
export type CreateEpisodeMutationFn = Apollo.MutationFunction<CreateEpisodeMutation, CreateEpisodeMutationVariables>;

/**
 * __useCreateEpisodeMutation__
 *
 * To run a mutation, you first call `useCreateEpisodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEpisodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEpisodeMutation, { data, loading, error }] = useCreateEpisodeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEpisodeMutation(baseOptions?: Apollo.MutationHookOptions<CreateEpisodeMutation, CreateEpisodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEpisodeMutation, CreateEpisodeMutationVariables>(CreateEpisodeDocument, options);
      }
export type CreateEpisodeMutationHookResult = ReturnType<typeof useCreateEpisodeMutation>;
export type CreateEpisodeMutationResult = Apollo.MutationResult<CreateEpisodeMutation>;
export type CreateEpisodeMutationOptions = Apollo.BaseMutationOptions<CreateEpisodeMutation, CreateEpisodeMutationVariables>;
export const EpisodeDocument = gql`
    query Episode($id: Int!) {
  episode(id: $id) {
    title
    originalTitle
    index
    synopsis
    description
    externalId
    episodesTags {
      nodes {
        name
      }
    }
    episodesTvshowGenres {
      nodes {
        tvshowGenres {
          title
        }
      }
    }
    episodesCasts {
      nodes {
        name
      }
    }
    studio
    episodesProductionCountries {
      nodes {
        name
      }
    }
    released
    id
    createdDate
    createdUser
    updatedDate
    updatedUser
    mainVideoId
    episodesTrailers {
      totalCount
    }
    episodesImages {
      nodes {
        imageType
        imageId
      }
    }
    publishStatus
    publishedDate
    publishedUser
  }
  tvshowGenres {
    nodes {
      title
      id
    }
  }
}
    `;

/**
 * __useEpisodeQuery__
 *
 * To run a query within a React component, call `useEpisodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useEpisodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEpisodeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEpisodeQuery(baseOptions: Apollo.QueryHookOptions<EpisodeQuery, EpisodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EpisodeQuery, EpisodeQueryVariables>(EpisodeDocument, options);
      }
export function useEpisodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EpisodeQuery, EpisodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EpisodeQuery, EpisodeQueryVariables>(EpisodeDocument, options);
        }
export type EpisodeQueryHookResult = ReturnType<typeof useEpisodeQuery>;
export type EpisodeLazyQueryHookResult = ReturnType<typeof useEpisodeLazyQuery>;
export type EpisodeQueryResult = Apollo.QueryResult<EpisodeQuery, EpisodeQueryVariables>;
export const UpdateEpisodeDocument = gql`
    mutation UpdateEpisode($input: UpdateEpisodeInput!) {
  updateEpisode(input: $input) {
    clientMutationId
    episode {
      id
      title
    }
  }
}
    `;
export type UpdateEpisodeMutationFn = Apollo.MutationFunction<UpdateEpisodeMutation, UpdateEpisodeMutationVariables>;

/**
 * __useUpdateEpisodeMutation__
 *
 * To run a mutation, you first call `useUpdateEpisodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEpisodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEpisodeMutation, { data, loading, error }] = useUpdateEpisodeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEpisodeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEpisodeMutation, UpdateEpisodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEpisodeMutation, UpdateEpisodeMutationVariables>(UpdateEpisodeDocument, options);
      }
export type UpdateEpisodeMutationHookResult = ReturnType<typeof useUpdateEpisodeMutation>;
export type UpdateEpisodeMutationResult = Apollo.MutationResult<UpdateEpisodeMutation>;
export type UpdateEpisodeMutationOptions = Apollo.BaseMutationOptions<UpdateEpisodeMutation, UpdateEpisodeMutationVariables>;
export const DeleteEpisodeDocument = gql`
    mutation DeleteEpisode($input: DeleteEpisodeInput!) {
  deleteEpisode(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteEpisodeMutationFn = Apollo.MutationFunction<DeleteEpisodeMutation, DeleteEpisodeMutationVariables>;

/**
 * __useDeleteEpisodeMutation__
 *
 * To run a mutation, you first call `useDeleteEpisodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEpisodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEpisodeMutation, { data, loading, error }] = useDeleteEpisodeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteEpisodeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEpisodeMutation, DeleteEpisodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEpisodeMutation, DeleteEpisodeMutationVariables>(DeleteEpisodeDocument, options);
      }
export type DeleteEpisodeMutationHookResult = ReturnType<typeof useDeleteEpisodeMutation>;
export type DeleteEpisodeMutationResult = Apollo.MutationResult<DeleteEpisodeMutation>;
export type DeleteEpisodeMutationOptions = Apollo.BaseMutationOptions<DeleteEpisodeMutation, DeleteEpisodeMutationVariables>;
export const PublishEpisodeDocument = gql`
    mutation PublishEpisode($id: Int!) {
  publishEpisode(episodeId: $id) {
    id
  }
}
    `;
export type PublishEpisodeMutationFn = Apollo.MutationFunction<PublishEpisodeMutation, PublishEpisodeMutationVariables>;

/**
 * __usePublishEpisodeMutation__
 *
 * To run a mutation, you first call `usePublishEpisodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishEpisodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishEpisodeMutation, { data, loading, error }] = usePublishEpisodeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePublishEpisodeMutation(baseOptions?: Apollo.MutationHookOptions<PublishEpisodeMutation, PublishEpisodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishEpisodeMutation, PublishEpisodeMutationVariables>(PublishEpisodeDocument, options);
      }
export type PublishEpisodeMutationHookResult = ReturnType<typeof usePublishEpisodeMutation>;
export type PublishEpisodeMutationResult = Apollo.MutationResult<PublishEpisodeMutation>;
export type PublishEpisodeMutationOptions = Apollo.BaseMutationOptions<PublishEpisodeMutation, PublishEpisodeMutationVariables>;
export const UnpublishEpisodeDocument = gql`
    mutation UnpublishEpisode($id: Int!) {
  unpublishEpisode(episodeId: $id) {
    id
  }
}
    `;
export type UnpublishEpisodeMutationFn = Apollo.MutationFunction<UnpublishEpisodeMutation, UnpublishEpisodeMutationVariables>;

/**
 * __useUnpublishEpisodeMutation__
 *
 * To run a mutation, you first call `useUnpublishEpisodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishEpisodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishEpisodeMutation, { data, loading, error }] = useUnpublishEpisodeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnpublishEpisodeMutation(baseOptions?: Apollo.MutationHookOptions<UnpublishEpisodeMutation, UnpublishEpisodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpublishEpisodeMutation, UnpublishEpisodeMutationVariables>(UnpublishEpisodeDocument, options);
      }
export type UnpublishEpisodeMutationHookResult = ReturnType<typeof useUnpublishEpisodeMutation>;
export type UnpublishEpisodeMutationResult = Apollo.MutationResult<UnpublishEpisodeMutation>;
export type UnpublishEpisodeMutationOptions = Apollo.BaseMutationOptions<UnpublishEpisodeMutation, UnpublishEpisodeMutationVariables>;
export const EpisodeTitleDocument = gql`
    query EpisodeTitle($id: Int!) {
  episode(id: $id) {
    id
    title
  }
}
    `;

/**
 * __useEpisodeTitleQuery__
 *
 * To run a query within a React component, call `useEpisodeTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useEpisodeTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEpisodeTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEpisodeTitleQuery(baseOptions: Apollo.QueryHookOptions<EpisodeTitleQuery, EpisodeTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EpisodeTitleQuery, EpisodeTitleQueryVariables>(EpisodeTitleDocument, options);
      }
export function useEpisodeTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EpisodeTitleQuery, EpisodeTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EpisodeTitleQuery, EpisodeTitleQueryVariables>(EpisodeTitleDocument, options);
        }
export type EpisodeTitleQueryHookResult = ReturnType<typeof useEpisodeTitleQuery>;
export type EpisodeTitleLazyQueryHookResult = ReturnType<typeof useEpisodeTitleLazyQuery>;
export type EpisodeTitleQueryResult = Apollo.QueryResult<EpisodeTitleQuery, EpisodeTitleQueryVariables>;
export const SearchEpisodeTagsDocument = gql`
    query SearchEpisodeTags($searchKey: String!, $limit: Int!) {
  getEpisodesTagsValues(
    filter: {startsWithInsensitive: $searchKey}
    first: $limit
  ) {
    nodes
  }
}
    `;

/**
 * __useSearchEpisodeTagsQuery__
 *
 * To run a query within a React component, call `useSearchEpisodeTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEpisodeTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEpisodeTagsQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchEpisodeTagsQuery(baseOptions: Apollo.QueryHookOptions<SearchEpisodeTagsQuery, SearchEpisodeTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchEpisodeTagsQuery, SearchEpisodeTagsQueryVariables>(SearchEpisodeTagsDocument, options);
      }
export function useSearchEpisodeTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchEpisodeTagsQuery, SearchEpisodeTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchEpisodeTagsQuery, SearchEpisodeTagsQueryVariables>(SearchEpisodeTagsDocument, options);
        }
export type SearchEpisodeTagsQueryHookResult = ReturnType<typeof useSearchEpisodeTagsQuery>;
export type SearchEpisodeTagsLazyQueryHookResult = ReturnType<typeof useSearchEpisodeTagsLazyQuery>;
export type SearchEpisodeTagsQueryResult = Apollo.QueryResult<SearchEpisodeTagsQuery, SearchEpisodeTagsQueryVariables>;
export const SearchEpisodeCastDocument = gql`
    query SearchEpisodeCast($searchKey: String!, $limit: Int!) {
  getEpisodesCastsValues(
    filter: {startsWithInsensitive: $searchKey}
    first: $limit
  ) {
    nodes
  }
}
    `;

/**
 * __useSearchEpisodeCastQuery__
 *
 * To run a query within a React component, call `useSearchEpisodeCastQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEpisodeCastQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEpisodeCastQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchEpisodeCastQuery(baseOptions: Apollo.QueryHookOptions<SearchEpisodeCastQuery, SearchEpisodeCastQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchEpisodeCastQuery, SearchEpisodeCastQueryVariables>(SearchEpisodeCastDocument, options);
      }
export function useSearchEpisodeCastLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchEpisodeCastQuery, SearchEpisodeCastQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchEpisodeCastQuery, SearchEpisodeCastQueryVariables>(SearchEpisodeCastDocument, options);
        }
export type SearchEpisodeCastQueryHookResult = ReturnType<typeof useSearchEpisodeCastQuery>;
export type SearchEpisodeCastLazyQueryHookResult = ReturnType<typeof useSearchEpisodeCastLazyQuery>;
export type SearchEpisodeCastQueryResult = Apollo.QueryResult<SearchEpisodeCastQuery, SearchEpisodeCastQueryVariables>;
export const SearchEpisodeProductionCountriesDocument = gql`
    query SearchEpisodeProductionCountries($searchKey: String!, $limit: Int!) {
  getEpisodesProductionCountriesValues(
    filter: {startsWithInsensitive: $searchKey}
    first: $limit
  ) {
    nodes
  }
}
    `;

/**
 * __useSearchEpisodeProductionCountriesQuery__
 *
 * To run a query within a React component, call `useSearchEpisodeProductionCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEpisodeProductionCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEpisodeProductionCountriesQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchEpisodeProductionCountriesQuery(baseOptions: Apollo.QueryHookOptions<SearchEpisodeProductionCountriesQuery, SearchEpisodeProductionCountriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchEpisodeProductionCountriesQuery, SearchEpisodeProductionCountriesQueryVariables>(SearchEpisodeProductionCountriesDocument, options);
      }
export function useSearchEpisodeProductionCountriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchEpisodeProductionCountriesQuery, SearchEpisodeProductionCountriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchEpisodeProductionCountriesQuery, SearchEpisodeProductionCountriesQueryVariables>(SearchEpisodeProductionCountriesDocument, options);
        }
export type SearchEpisodeProductionCountriesQueryHookResult = ReturnType<typeof useSearchEpisodeProductionCountriesQuery>;
export type SearchEpisodeProductionCountriesLazyQueryHookResult = ReturnType<typeof useSearchEpisodeProductionCountriesLazyQuery>;
export type SearchEpisodeProductionCountriesQueryResult = Apollo.QueryResult<SearchEpisodeProductionCountriesQuery, SearchEpisodeProductionCountriesQueryVariables>;
export const EpisodesDocument = gql`
    query Episodes($filter: EpisodeFilter, $orderBy: [EpisodesOrderBy!], $after: Cursor) {
  filtered: episodes(filter: $filter, orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...EpisodeExplorerProperties
    }
  }
  nonFiltered: episodes {
    totalCount
  }
}
    ${EpisodeExplorerPropertiesFragmentDoc}`;

/**
 * __useEpisodesQuery__
 *
 * To run a query within a React component, call `useEpisodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEpisodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEpisodesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useEpisodesQuery(baseOptions?: Apollo.QueryHookOptions<EpisodesQuery, EpisodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EpisodesQuery, EpisodesQueryVariables>(EpisodesDocument, options);
      }
export function useEpisodesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EpisodesQuery, EpisodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EpisodesQuery, EpisodesQueryVariables>(EpisodesDocument, options);
        }
export type EpisodesQueryHookResult = ReturnType<typeof useEpisodesQuery>;
export type EpisodesLazyQueryHookResult = ReturnType<typeof useEpisodesLazyQuery>;
export type EpisodesQueryResult = Apollo.QueryResult<EpisodesQuery, EpisodesQueryVariables>;
export const EpisodesMutatedDocument = gql`
    subscription EpisodesMutated {
  episodeMutated {
    id
    event
    episode {
      ...EpisodeExplorerProperties
    }
  }
}
    ${EpisodeExplorerPropertiesFragmentDoc}`;

/**
 * __useEpisodesMutatedSubscription__
 *
 * To run a query within a React component, call `useEpisodesMutatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useEpisodesMutatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEpisodesMutatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useEpisodesMutatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<EpisodesMutatedSubscription, EpisodesMutatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<EpisodesMutatedSubscription, EpisodesMutatedSubscriptionVariables>(EpisodesMutatedDocument, options);
      }
export type EpisodesMutatedSubscriptionHookResult = ReturnType<typeof useEpisodesMutatedSubscription>;
export type EpisodesMutatedSubscriptionResult = Apollo.SubscriptionResult<EpisodesMutatedSubscription>;
export const EpisodeImagesDocument = gql`
    query EpisodeImages($id: Int!) {
  episode(id: $id) {
    episodesImages {
      nodes {
        imageId
        imageType
      }
    }
  }
}
    `;

/**
 * __useEpisodeImagesQuery__
 *
 * To run a query within a React component, call `useEpisodeImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEpisodeImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEpisodeImagesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEpisodeImagesQuery(baseOptions: Apollo.QueryHookOptions<EpisodeImagesQuery, EpisodeImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EpisodeImagesQuery, EpisodeImagesQueryVariables>(EpisodeImagesDocument, options);
      }
export function useEpisodeImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EpisodeImagesQuery, EpisodeImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EpisodeImagesQuery, EpisodeImagesQueryVariables>(EpisodeImagesDocument, options);
        }
export type EpisodeImagesQueryHookResult = ReturnType<typeof useEpisodeImagesQuery>;
export type EpisodeImagesLazyQueryHookResult = ReturnType<typeof useEpisodeImagesLazyQuery>;
export type EpisodeImagesQueryResult = Apollo.QueryResult<EpisodeImagesQuery, EpisodeImagesQueryVariables>;
export const EpisodesLicensesDocument = gql`
    query EpisodesLicenses($filter: EpisodesLicenseFilter, $orderBy: [EpisodesLicensesOrderBy!], $after: Cursor) {
  episodesLicenses(filter: $filter, orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      episodesLicensesCountries {
        nodes {
          code
        }
      }
      licenseEnd
      licenseStart
    }
  }
}
    `;

/**
 * __useEpisodesLicensesQuery__
 *
 * To run a query within a React component, call `useEpisodesLicensesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEpisodesLicensesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEpisodesLicensesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useEpisodesLicensesQuery(baseOptions?: Apollo.QueryHookOptions<EpisodesLicensesQuery, EpisodesLicensesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EpisodesLicensesQuery, EpisodesLicensesQueryVariables>(EpisodesLicensesDocument, options);
      }
export function useEpisodesLicensesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EpisodesLicensesQuery, EpisodesLicensesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EpisodesLicensesQuery, EpisodesLicensesQueryVariables>(EpisodesLicensesDocument, options);
        }
export type EpisodesLicensesQueryHookResult = ReturnType<typeof useEpisodesLicensesQuery>;
export type EpisodesLicensesLazyQueryHookResult = ReturnType<typeof useEpisodesLicensesLazyQuery>;
export type EpisodesLicensesQueryResult = Apollo.QueryResult<EpisodesLicensesQuery, EpisodesLicensesQueryVariables>;
export const CreateEpisodesLicenseDocument = gql`
    mutation CreateEpisodesLicense($input: CreateEpisodesLicenseInput!) {
  createEpisodesLicense(input: $input) {
    episodesLicense {
      id
    }
  }
}
    `;
export type CreateEpisodesLicenseMutationFn = Apollo.MutationFunction<CreateEpisodesLicenseMutation, CreateEpisodesLicenseMutationVariables>;

/**
 * __useCreateEpisodesLicenseMutation__
 *
 * To run a mutation, you first call `useCreateEpisodesLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEpisodesLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEpisodesLicenseMutation, { data, loading, error }] = useCreateEpisodesLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEpisodesLicenseMutation(baseOptions?: Apollo.MutationHookOptions<CreateEpisodesLicenseMutation, CreateEpisodesLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEpisodesLicenseMutation, CreateEpisodesLicenseMutationVariables>(CreateEpisodesLicenseDocument, options);
      }
export type CreateEpisodesLicenseMutationHookResult = ReturnType<typeof useCreateEpisodesLicenseMutation>;
export type CreateEpisodesLicenseMutationResult = Apollo.MutationResult<CreateEpisodesLicenseMutation>;
export type CreateEpisodesLicenseMutationOptions = Apollo.BaseMutationOptions<CreateEpisodesLicenseMutation, CreateEpisodesLicenseMutationVariables>;
export const EpisodesLicenseDocument = gql`
    query EpisodesLicense($id: Int!) {
  episodesLicense(id: $id) {
    episodeId
    episodesLicensesCountries {
      nodes {
        code
      }
    }
    licenseEnd
    licenseStart
  }
}
    `;

/**
 * __useEpisodesLicenseQuery__
 *
 * To run a query within a React component, call `useEpisodesLicenseQuery` and pass it any options that fit your needs.
 * When your component renders, `useEpisodesLicenseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEpisodesLicenseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEpisodesLicenseQuery(baseOptions: Apollo.QueryHookOptions<EpisodesLicenseQuery, EpisodesLicenseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EpisodesLicenseQuery, EpisodesLicenseQueryVariables>(EpisodesLicenseDocument, options);
      }
export function useEpisodesLicenseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EpisodesLicenseQuery, EpisodesLicenseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EpisodesLicenseQuery, EpisodesLicenseQueryVariables>(EpisodesLicenseDocument, options);
        }
export type EpisodesLicenseQueryHookResult = ReturnType<typeof useEpisodesLicenseQuery>;
export type EpisodesLicenseLazyQueryHookResult = ReturnType<typeof useEpisodesLicenseLazyQuery>;
export type EpisodesLicenseQueryResult = Apollo.QueryResult<EpisodesLicenseQuery, EpisodesLicenseQueryVariables>;
export const UpdateEpisodesLicenseDocument = gql`
    mutation UpdateEpisodesLicense($input: UpdateEpisodesLicenseInput!) {
  updateEpisodesLicense(input: $input) {
    clientMutationId
  }
}
    `;
export type UpdateEpisodesLicenseMutationFn = Apollo.MutationFunction<UpdateEpisodesLicenseMutation, UpdateEpisodesLicenseMutationVariables>;

/**
 * __useUpdateEpisodesLicenseMutation__
 *
 * To run a mutation, you first call `useUpdateEpisodesLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEpisodesLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEpisodesLicenseMutation, { data, loading, error }] = useUpdateEpisodesLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEpisodesLicenseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEpisodesLicenseMutation, UpdateEpisodesLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEpisodesLicenseMutation, UpdateEpisodesLicenseMutationVariables>(UpdateEpisodesLicenseDocument, options);
      }
export type UpdateEpisodesLicenseMutationHookResult = ReturnType<typeof useUpdateEpisodesLicenseMutation>;
export type UpdateEpisodesLicenseMutationResult = Apollo.MutationResult<UpdateEpisodesLicenseMutation>;
export type UpdateEpisodesLicenseMutationOptions = Apollo.BaseMutationOptions<UpdateEpisodesLicenseMutation, UpdateEpisodesLicenseMutationVariables>;
export const DeleteEpisodesLicenseDocument = gql`
    mutation DeleteEpisodesLicense($input: DeleteEpisodesLicenseInput!) {
  deleteEpisodesLicense(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteEpisodesLicenseMutationFn = Apollo.MutationFunction<DeleteEpisodesLicenseMutation, DeleteEpisodesLicenseMutationVariables>;

/**
 * __useDeleteEpisodesLicenseMutation__
 *
 * To run a mutation, you first call `useDeleteEpisodesLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEpisodesLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEpisodesLicenseMutation, { data, loading, error }] = useDeleteEpisodesLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteEpisodesLicenseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEpisodesLicenseMutation, DeleteEpisodesLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEpisodesLicenseMutation, DeleteEpisodesLicenseMutationVariables>(DeleteEpisodesLicenseDocument, options);
      }
export type DeleteEpisodesLicenseMutationHookResult = ReturnType<typeof useDeleteEpisodesLicenseMutation>;
export type DeleteEpisodesLicenseMutationResult = Apollo.MutationResult<DeleteEpisodesLicenseMutation>;
export type DeleteEpisodesLicenseMutationOptions = Apollo.BaseMutationOptions<DeleteEpisodesLicenseMutation, DeleteEpisodesLicenseMutationVariables>;
export const CreateEpisodeSnapshotDocument = gql`
    mutation CreateEpisodeSnapshot($episodeId: Int!) {
  createEpisodeSnapshot(episodeId: $episodeId) {
    id
  }
}
    `;
export type CreateEpisodeSnapshotMutationFn = Apollo.MutationFunction<CreateEpisodeSnapshotMutation, CreateEpisodeSnapshotMutationVariables>;

/**
 * __useCreateEpisodeSnapshotMutation__
 *
 * To run a mutation, you first call `useCreateEpisodeSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEpisodeSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEpisodeSnapshotMutation, { data, loading, error }] = useCreateEpisodeSnapshotMutation({
 *   variables: {
 *      episodeId: // value for 'episodeId'
 *   },
 * });
 */
export function useCreateEpisodeSnapshotMutation(baseOptions?: Apollo.MutationHookOptions<CreateEpisodeSnapshotMutation, CreateEpisodeSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEpisodeSnapshotMutation, CreateEpisodeSnapshotMutationVariables>(CreateEpisodeSnapshotDocument, options);
      }
export type CreateEpisodeSnapshotMutationHookResult = ReturnType<typeof useCreateEpisodeSnapshotMutation>;
export type CreateEpisodeSnapshotMutationResult = Apollo.MutationResult<CreateEpisodeSnapshotMutation>;
export type CreateEpisodeSnapshotMutationOptions = Apollo.BaseMutationOptions<CreateEpisodeSnapshotMutation, CreateEpisodeSnapshotMutationVariables>;
export const EpisodeVideosDocument = gql`
    query EpisodeVideos($id: Int!) {
  episode(id: $id) {
    episodesTrailers {
      nodes {
        videoId
      }
    }
    mainVideoId
  }
}
    `;

/**
 * __useEpisodeVideosQuery__
 *
 * To run a query within a React component, call `useEpisodeVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useEpisodeVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEpisodeVideosQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEpisodeVideosQuery(baseOptions: Apollo.QueryHookOptions<EpisodeVideosQuery, EpisodeVideosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EpisodeVideosQuery, EpisodeVideosQueryVariables>(EpisodeVideosDocument, options);
      }
export function useEpisodeVideosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EpisodeVideosQuery, EpisodeVideosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EpisodeVideosQuery, EpisodeVideosQueryVariables>(EpisodeVideosDocument, options);
        }
export type EpisodeVideosQueryHookResult = ReturnType<typeof useEpisodeVideosQuery>;
export type EpisodeVideosLazyQueryHookResult = ReturnType<typeof useEpisodeVideosLazyQuery>;
export type EpisodeVideosQueryResult = Apollo.QueryResult<EpisodeVideosQuery, EpisodeVideosQueryVariables>;
export const BulkDeleteEpisodesDocument = gql`
    mutation BulkDeleteEpisodes($filter: EpisodeFilter) {
  deleteEpisodes(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkDeleteEpisodesMutationFn = Apollo.MutationFunction<BulkDeleteEpisodesMutation, BulkDeleteEpisodesMutationVariables>;

/**
 * __useBulkDeleteEpisodesMutation__
 *
 * To run a mutation, you first call `useBulkDeleteEpisodesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteEpisodesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteEpisodesMutation, { data, loading, error }] = useBulkDeleteEpisodesMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkDeleteEpisodesMutation(baseOptions?: Apollo.MutationHookOptions<BulkDeleteEpisodesMutation, BulkDeleteEpisodesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkDeleteEpisodesMutation, BulkDeleteEpisodesMutationVariables>(BulkDeleteEpisodesDocument, options);
      }
export type BulkDeleteEpisodesMutationHookResult = ReturnType<typeof useBulkDeleteEpisodesMutation>;
export type BulkDeleteEpisodesMutationResult = Apollo.MutationResult<BulkDeleteEpisodesMutation>;
export type BulkDeleteEpisodesMutationOptions = Apollo.BaseMutationOptions<BulkDeleteEpisodesMutation, BulkDeleteEpisodesMutationVariables>;
export const BulkPublishEpisodesDocument = gql`
    mutation BulkPublishEpisodes($filter: EpisodeFilter) {
  publishEpisodes(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkPublishEpisodesMutationFn = Apollo.MutationFunction<BulkPublishEpisodesMutation, BulkPublishEpisodesMutationVariables>;

/**
 * __useBulkPublishEpisodesMutation__
 *
 * To run a mutation, you first call `useBulkPublishEpisodesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkPublishEpisodesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkPublishEpisodesMutation, { data, loading, error }] = useBulkPublishEpisodesMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkPublishEpisodesMutation(baseOptions?: Apollo.MutationHookOptions<BulkPublishEpisodesMutation, BulkPublishEpisodesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkPublishEpisodesMutation, BulkPublishEpisodesMutationVariables>(BulkPublishEpisodesDocument, options);
      }
export type BulkPublishEpisodesMutationHookResult = ReturnType<typeof useBulkPublishEpisodesMutation>;
export type BulkPublishEpisodesMutationResult = Apollo.MutationResult<BulkPublishEpisodesMutation>;
export type BulkPublishEpisodesMutationOptions = Apollo.BaseMutationOptions<BulkPublishEpisodesMutation, BulkPublishEpisodesMutationVariables>;
export const BulkUnpublishEpisodesDocument = gql`
    mutation BulkUnpublishEpisodes($filter: EpisodeFilter) {
  unpublishEpisodes(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkUnpublishEpisodesMutationFn = Apollo.MutationFunction<BulkUnpublishEpisodesMutation, BulkUnpublishEpisodesMutationVariables>;

/**
 * __useBulkUnpublishEpisodesMutation__
 *
 * To run a mutation, you first call `useBulkUnpublishEpisodesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkUnpublishEpisodesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkUnpublishEpisodesMutation, { data, loading, error }] = useBulkUnpublishEpisodesMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkUnpublishEpisodesMutation(baseOptions?: Apollo.MutationHookOptions<BulkUnpublishEpisodesMutation, BulkUnpublishEpisodesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkUnpublishEpisodesMutation, BulkUnpublishEpisodesMutationVariables>(BulkUnpublishEpisodesDocument, options);
      }
export type BulkUnpublishEpisodesMutationHookResult = ReturnType<typeof useBulkUnpublishEpisodesMutation>;
export type BulkUnpublishEpisodesMutationResult = Apollo.MutationResult<BulkUnpublishEpisodesMutation>;
export type BulkUnpublishEpisodesMutationOptions = Apollo.BaseMutationOptions<BulkUnpublishEpisodesMutation, BulkUnpublishEpisodesMutationVariables>;
export const BulkCreateEpisodeSnapshotsDocument = gql`
    mutation BulkCreateEpisodeSnapshots($filter: EpisodeFilter) {
  createEpisodeSnapshots(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkCreateEpisodeSnapshotsMutationFn = Apollo.MutationFunction<BulkCreateEpisodeSnapshotsMutation, BulkCreateEpisodeSnapshotsMutationVariables>;

/**
 * __useBulkCreateEpisodeSnapshotsMutation__
 *
 * To run a mutation, you first call `useBulkCreateEpisodeSnapshotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkCreateEpisodeSnapshotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkCreateEpisodeSnapshotsMutation, { data, loading, error }] = useBulkCreateEpisodeSnapshotsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkCreateEpisodeSnapshotsMutation(baseOptions?: Apollo.MutationHookOptions<BulkCreateEpisodeSnapshotsMutation, BulkCreateEpisodeSnapshotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkCreateEpisodeSnapshotsMutation, BulkCreateEpisodeSnapshotsMutationVariables>(BulkCreateEpisodeSnapshotsDocument, options);
      }
export type BulkCreateEpisodeSnapshotsMutationHookResult = ReturnType<typeof useBulkCreateEpisodeSnapshotsMutation>;
export type BulkCreateEpisodeSnapshotsMutationResult = Apollo.MutationResult<BulkCreateEpisodeSnapshotsMutation>;
export type BulkCreateEpisodeSnapshotsMutationOptions = Apollo.BaseMutationOptions<BulkCreateEpisodeSnapshotsMutation, BulkCreateEpisodeSnapshotsMutationVariables>;
export const IngestDocumentDocument = gql`
    query IngestDocument($id: Int!) {
  ingestDocument(id: $id) {
    id
    title
    errorCount
    itemsCount
    successCount
    inProgressCount
    updatedDate
    createdDate
    status
    ingestItems {
      nodes {
        id
        status
        externalId
        type
        existsStatus
        errors
        item
        displayTitle
        ingestItemSteps {
          nodes {
            id
            status
            subType
            type
            responseMessage
          }
        }
      }
    }
    document
  }
}
    `;

/**
 * __useIngestDocumentQuery__
 *
 * To run a query within a React component, call `useIngestDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useIngestDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIngestDocumentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useIngestDocumentQuery(baseOptions: Apollo.QueryHookOptions<IngestDocumentQuery, IngestDocumentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IngestDocumentQuery, IngestDocumentQueryVariables>(IngestDocumentDocument, options);
      }
export function useIngestDocumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IngestDocumentQuery, IngestDocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IngestDocumentQuery, IngestDocumentQueryVariables>(IngestDocumentDocument, options);
        }
export type IngestDocumentQueryHookResult = ReturnType<typeof useIngestDocumentQuery>;
export type IngestDocumentLazyQueryHookResult = ReturnType<typeof useIngestDocumentLazyQuery>;
export type IngestDocumentQueryResult = Apollo.QueryResult<IngestDocumentQuery, IngestDocumentQueryVariables>;
export const UpdateIngestDocumentDocument = gql`
    mutation UpdateIngestDocument($input: UpdateIngestDocumentInput!) {
  updateIngestDocument(input: $input) {
    clientMutationId
  }
}
    `;
export type UpdateIngestDocumentMutationFn = Apollo.MutationFunction<UpdateIngestDocumentMutation, UpdateIngestDocumentMutationVariables>;

/**
 * __useUpdateIngestDocumentMutation__
 *
 * To run a mutation, you first call `useUpdateIngestDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateIngestDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateIngestDocumentMutation, { data, loading, error }] = useUpdateIngestDocumentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateIngestDocumentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateIngestDocumentMutation, UpdateIngestDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateIngestDocumentMutation, UpdateIngestDocumentMutationVariables>(UpdateIngestDocumentDocument, options);
      }
export type UpdateIngestDocumentMutationHookResult = ReturnType<typeof useUpdateIngestDocumentMutation>;
export type UpdateIngestDocumentMutationResult = Apollo.MutationResult<UpdateIngestDocumentMutation>;
export type UpdateIngestDocumentMutationOptions = Apollo.BaseMutationOptions<UpdateIngestDocumentMutation, UpdateIngestDocumentMutationVariables>;
export const IngestDocumentTitleDocument = gql`
    query IngestDocumentTitle($id: Int!) {
  ingestDocument(id: $id) {
    title
  }
}
    `;

/**
 * __useIngestDocumentTitleQuery__
 *
 * To run a query within a React component, call `useIngestDocumentTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useIngestDocumentTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIngestDocumentTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useIngestDocumentTitleQuery(baseOptions: Apollo.QueryHookOptions<IngestDocumentTitleQuery, IngestDocumentTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IngestDocumentTitleQuery, IngestDocumentTitleQueryVariables>(IngestDocumentTitleDocument, options);
      }
export function useIngestDocumentTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IngestDocumentTitleQuery, IngestDocumentTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IngestDocumentTitleQuery, IngestDocumentTitleQueryVariables>(IngestDocumentTitleDocument, options);
        }
export type IngestDocumentTitleQueryHookResult = ReturnType<typeof useIngestDocumentTitleQuery>;
export type IngestDocumentTitleLazyQueryHookResult = ReturnType<typeof useIngestDocumentTitleLazyQuery>;
export type IngestDocumentTitleQueryResult = Apollo.QueryResult<IngestDocumentTitleQuery, IngestDocumentTitleQueryVariables>;
export const IngestDocumentUploadDocument = gql`
    mutation IngestDocumentUpload($file: Upload!) {
  startIngest(input: {file: $file}) {
    ingestDocument {
      id
    }
  }
}
    `;
export type IngestDocumentUploadMutationFn = Apollo.MutationFunction<IngestDocumentUploadMutation, IngestDocumentUploadMutationVariables>;

/**
 * __useIngestDocumentUploadMutation__
 *
 * To run a mutation, you first call `useIngestDocumentUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIngestDocumentUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ingestDocumentUploadMutation, { data, loading, error }] = useIngestDocumentUploadMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useIngestDocumentUploadMutation(baseOptions?: Apollo.MutationHookOptions<IngestDocumentUploadMutation, IngestDocumentUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<IngestDocumentUploadMutation, IngestDocumentUploadMutationVariables>(IngestDocumentUploadDocument, options);
      }
export type IngestDocumentUploadMutationHookResult = ReturnType<typeof useIngestDocumentUploadMutation>;
export type IngestDocumentUploadMutationResult = Apollo.MutationResult<IngestDocumentUploadMutation>;
export type IngestDocumentUploadMutationOptions = Apollo.BaseMutationOptions<IngestDocumentUploadMutation, IngestDocumentUploadMutationVariables>;
export const IngestDocumentsDocument = gql`
    query IngestDocuments($orderBy: [IngestDocumentsOrderBy!], $after: Cursor) {
  filtered: ingestDocuments(orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...IngestDocumentExplorerProperties
    }
  }
  nonFiltered: ingestDocuments {
    totalCount
  }
}
    ${IngestDocumentExplorerPropertiesFragmentDoc}`;

/**
 * __useIngestDocumentsQuery__
 *
 * To run a query within a React component, call `useIngestDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useIngestDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIngestDocumentsQuery({
 *   variables: {
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useIngestDocumentsQuery(baseOptions?: Apollo.QueryHookOptions<IngestDocumentsQuery, IngestDocumentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IngestDocumentsQuery, IngestDocumentsQueryVariables>(IngestDocumentsDocument, options);
      }
export function useIngestDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IngestDocumentsQuery, IngestDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IngestDocumentsQuery, IngestDocumentsQueryVariables>(IngestDocumentsDocument, options);
        }
export type IngestDocumentsQueryHookResult = ReturnType<typeof useIngestDocumentsQuery>;
export type IngestDocumentsLazyQueryHookResult = ReturnType<typeof useIngestDocumentsLazyQuery>;
export type IngestDocumentsQueryResult = Apollo.QueryResult<IngestDocumentsQuery, IngestDocumentsQueryVariables>;
export const IngestDocumentsMutatedDocument = gql`
    subscription IngestDocumentsMutated {
  ingestDocumentMutated {
    id
    event
    ingestDocument {
      ...IngestDocumentExplorerProperties
    }
  }
}
    ${IngestDocumentExplorerPropertiesFragmentDoc}`;

/**
 * __useIngestDocumentsMutatedSubscription__
 *
 * To run a query within a React component, call `useIngestDocumentsMutatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useIngestDocumentsMutatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIngestDocumentsMutatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useIngestDocumentsMutatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<IngestDocumentsMutatedSubscription, IngestDocumentsMutatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<IngestDocumentsMutatedSubscription, IngestDocumentsMutatedSubscriptionVariables>(IngestDocumentsMutatedDocument, options);
      }
export type IngestDocumentsMutatedSubscriptionHookResult = ReturnType<typeof useIngestDocumentsMutatedSubscription>;
export type IngestDocumentsMutatedSubscriptionResult = Apollo.SubscriptionResult<IngestDocumentsMutatedSubscription>;
export const CreateMovieDocument = gql`
    mutation CreateMovie($input: CreateMovieInput!) {
  createMovie(input: $input) {
    movie {
      id
      title
    }
  }
}
    `;
export type CreateMovieMutationFn = Apollo.MutationFunction<CreateMovieMutation, CreateMovieMutationVariables>;

/**
 * __useCreateMovieMutation__
 *
 * To run a mutation, you first call `useCreateMovieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMovieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMovieMutation, { data, loading, error }] = useCreateMovieMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMovieMutation(baseOptions?: Apollo.MutationHookOptions<CreateMovieMutation, CreateMovieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMovieMutation, CreateMovieMutationVariables>(CreateMovieDocument, options);
      }
export type CreateMovieMutationHookResult = ReturnType<typeof useCreateMovieMutation>;
export type CreateMovieMutationResult = Apollo.MutationResult<CreateMovieMutation>;
export type CreateMovieMutationOptions = Apollo.BaseMutationOptions<CreateMovieMutation, CreateMovieMutationVariables>;
export const MovieDocument = gql`
    query Movie($id: Int!) {
  movie(id: $id) {
    title
    originalTitle
    synopsis
    description
    externalId
    moviesTags {
      nodes {
        name
      }
    }
    moviesMovieGenres {
      nodes {
        movieGenres {
          title
        }
      }
    }
    moviesCasts {
      nodes {
        name
      }
    }
    released
    moviesProductionCountries {
      nodes {
        name
      }
    }
    studio
    mainVideoId
    moviesTrailers {
      totalCount
    }
    moviesImages {
      nodes {
        imageType
        imageId
      }
    }
    id
    createdDate
    createdUser
    updatedDate
    updatedUser
    publishStatus
    publishedDate
    publishedUser
  }
  movieGenres {
    nodes {
      title
      id
    }
  }
}
    `;

/**
 * __useMovieQuery__
 *
 * To run a query within a React component, call `useMovieQuery` and pass it any options that fit your needs.
 * When your component renders, `useMovieQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMovieQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMovieQuery(baseOptions: Apollo.QueryHookOptions<MovieQuery, MovieQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MovieQuery, MovieQueryVariables>(MovieDocument, options);
      }
export function useMovieLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MovieQuery, MovieQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MovieQuery, MovieQueryVariables>(MovieDocument, options);
        }
export type MovieQueryHookResult = ReturnType<typeof useMovieQuery>;
export type MovieLazyQueryHookResult = ReturnType<typeof useMovieLazyQuery>;
export type MovieQueryResult = Apollo.QueryResult<MovieQuery, MovieQueryVariables>;
export const DeleteMovieDocument = gql`
    mutation DeleteMovie($input: DeleteMovieInput!) {
  deleteMovie(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteMovieMutationFn = Apollo.MutationFunction<DeleteMovieMutation, DeleteMovieMutationVariables>;

/**
 * __useDeleteMovieMutation__
 *
 * To run a mutation, you first call `useDeleteMovieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMovieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMovieMutation, { data, loading, error }] = useDeleteMovieMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteMovieMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMovieMutation, DeleteMovieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMovieMutation, DeleteMovieMutationVariables>(DeleteMovieDocument, options);
      }
export type DeleteMovieMutationHookResult = ReturnType<typeof useDeleteMovieMutation>;
export type DeleteMovieMutationResult = Apollo.MutationResult<DeleteMovieMutation>;
export type DeleteMovieMutationOptions = Apollo.BaseMutationOptions<DeleteMovieMutation, DeleteMovieMutationVariables>;
export const PublishMovieDocument = gql`
    mutation PublishMovie($id: Int!) {
  publishMovie(movieId: $id) {
    id
  }
}
    `;
export type PublishMovieMutationFn = Apollo.MutationFunction<PublishMovieMutation, PublishMovieMutationVariables>;

/**
 * __usePublishMovieMutation__
 *
 * To run a mutation, you first call `usePublishMovieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishMovieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishMovieMutation, { data, loading, error }] = usePublishMovieMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePublishMovieMutation(baseOptions?: Apollo.MutationHookOptions<PublishMovieMutation, PublishMovieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishMovieMutation, PublishMovieMutationVariables>(PublishMovieDocument, options);
      }
export type PublishMovieMutationHookResult = ReturnType<typeof usePublishMovieMutation>;
export type PublishMovieMutationResult = Apollo.MutationResult<PublishMovieMutation>;
export type PublishMovieMutationOptions = Apollo.BaseMutationOptions<PublishMovieMutation, PublishMovieMutationVariables>;
export const UnpublishMovieDocument = gql`
    mutation UnpublishMovie($id: Int!) {
  unpublishMovie(movieId: $id) {
    id
  }
}
    `;
export type UnpublishMovieMutationFn = Apollo.MutationFunction<UnpublishMovieMutation, UnpublishMovieMutationVariables>;

/**
 * __useUnpublishMovieMutation__
 *
 * To run a mutation, you first call `useUnpublishMovieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishMovieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishMovieMutation, { data, loading, error }] = useUnpublishMovieMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnpublishMovieMutation(baseOptions?: Apollo.MutationHookOptions<UnpublishMovieMutation, UnpublishMovieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpublishMovieMutation, UnpublishMovieMutationVariables>(UnpublishMovieDocument, options);
      }
export type UnpublishMovieMutationHookResult = ReturnType<typeof useUnpublishMovieMutation>;
export type UnpublishMovieMutationResult = Apollo.MutationResult<UnpublishMovieMutation>;
export type UnpublishMovieMutationOptions = Apollo.BaseMutationOptions<UnpublishMovieMutation, UnpublishMovieMutationVariables>;
export const MovieTitleDocument = gql`
    query MovieTitle($id: Int!) {
  movie(id: $id) {
    id
    title
  }
}
    `;

/**
 * __useMovieTitleQuery__
 *
 * To run a query within a React component, call `useMovieTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useMovieTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMovieTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMovieTitleQuery(baseOptions: Apollo.QueryHookOptions<MovieTitleQuery, MovieTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MovieTitleQuery, MovieTitleQueryVariables>(MovieTitleDocument, options);
      }
export function useMovieTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MovieTitleQuery, MovieTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MovieTitleQuery, MovieTitleQueryVariables>(MovieTitleDocument, options);
        }
export type MovieTitleQueryHookResult = ReturnType<typeof useMovieTitleQuery>;
export type MovieTitleLazyQueryHookResult = ReturnType<typeof useMovieTitleLazyQuery>;
export type MovieTitleQueryResult = Apollo.QueryResult<MovieTitleQuery, MovieTitleQueryVariables>;
export const SearchMovieTagsDocument = gql`
    query SearchMovieTags($searchKey: String!, $limit: Int!) {
  getMoviesTagsValues(filter: {startsWithInsensitive: $searchKey}, first: $limit) {
    nodes
  }
}
    `;

/**
 * __useSearchMovieTagsQuery__
 *
 * To run a query within a React component, call `useSearchMovieTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMovieTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMovieTagsQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchMovieTagsQuery(baseOptions: Apollo.QueryHookOptions<SearchMovieTagsQuery, SearchMovieTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchMovieTagsQuery, SearchMovieTagsQueryVariables>(SearchMovieTagsDocument, options);
      }
export function useSearchMovieTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchMovieTagsQuery, SearchMovieTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchMovieTagsQuery, SearchMovieTagsQueryVariables>(SearchMovieTagsDocument, options);
        }
export type SearchMovieTagsQueryHookResult = ReturnType<typeof useSearchMovieTagsQuery>;
export type SearchMovieTagsLazyQueryHookResult = ReturnType<typeof useSearchMovieTagsLazyQuery>;
export type SearchMovieTagsQueryResult = Apollo.QueryResult<SearchMovieTagsQuery, SearchMovieTagsQueryVariables>;
export const SearchMovieCastDocument = gql`
    query SearchMovieCast($searchKey: String!, $limit: Int!) {
  getMoviesCastsValues(filter: {startsWithInsensitive: $searchKey}, first: $limit) {
    nodes
  }
}
    `;

/**
 * __useSearchMovieCastQuery__
 *
 * To run a query within a React component, call `useSearchMovieCastQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMovieCastQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMovieCastQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchMovieCastQuery(baseOptions: Apollo.QueryHookOptions<SearchMovieCastQuery, SearchMovieCastQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchMovieCastQuery, SearchMovieCastQueryVariables>(SearchMovieCastDocument, options);
      }
export function useSearchMovieCastLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchMovieCastQuery, SearchMovieCastQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchMovieCastQuery, SearchMovieCastQueryVariables>(SearchMovieCastDocument, options);
        }
export type SearchMovieCastQueryHookResult = ReturnType<typeof useSearchMovieCastQuery>;
export type SearchMovieCastLazyQueryHookResult = ReturnType<typeof useSearchMovieCastLazyQuery>;
export type SearchMovieCastQueryResult = Apollo.QueryResult<SearchMovieCastQuery, SearchMovieCastQueryVariables>;
export const SearchMovieProductionCountriesDocument = gql`
    query SearchMovieProductionCountries($searchKey: String!, $limit: Int!) {
  getMoviesProductionCountriesValues(
    filter: {startsWithInsensitive: $searchKey}
    first: $limit
  ) {
    nodes
  }
}
    `;

/**
 * __useSearchMovieProductionCountriesQuery__
 *
 * To run a query within a React component, call `useSearchMovieProductionCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMovieProductionCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMovieProductionCountriesQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchMovieProductionCountriesQuery(baseOptions: Apollo.QueryHookOptions<SearchMovieProductionCountriesQuery, SearchMovieProductionCountriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchMovieProductionCountriesQuery, SearchMovieProductionCountriesQueryVariables>(SearchMovieProductionCountriesDocument, options);
      }
export function useSearchMovieProductionCountriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchMovieProductionCountriesQuery, SearchMovieProductionCountriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchMovieProductionCountriesQuery, SearchMovieProductionCountriesQueryVariables>(SearchMovieProductionCountriesDocument, options);
        }
export type SearchMovieProductionCountriesQueryHookResult = ReturnType<typeof useSearchMovieProductionCountriesQuery>;
export type SearchMovieProductionCountriesLazyQueryHookResult = ReturnType<typeof useSearchMovieProductionCountriesLazyQuery>;
export type SearchMovieProductionCountriesQueryResult = Apollo.QueryResult<SearchMovieProductionCountriesQuery, SearchMovieProductionCountriesQueryVariables>;
export const MoviesDocument = gql`
    query Movies($filter: MovieFilter, $orderBy: [MoviesOrderBy!], $after: Cursor) {
  filtered: movies(filter: $filter, orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...MovieExplorerProperties
    }
  }
  nonFiltered: movies {
    totalCount
  }
}
    ${MovieExplorerPropertiesFragmentDoc}`;

/**
 * __useMoviesQuery__
 *
 * To run a query within a React component, call `useMoviesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMoviesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMoviesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useMoviesQuery(baseOptions?: Apollo.QueryHookOptions<MoviesQuery, MoviesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MoviesQuery, MoviesQueryVariables>(MoviesDocument, options);
      }
export function useMoviesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MoviesQuery, MoviesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MoviesQuery, MoviesQueryVariables>(MoviesDocument, options);
        }
export type MoviesQueryHookResult = ReturnType<typeof useMoviesQuery>;
export type MoviesLazyQueryHookResult = ReturnType<typeof useMoviesLazyQuery>;
export type MoviesQueryResult = Apollo.QueryResult<MoviesQuery, MoviesQueryVariables>;
export const MoviesMutatedDocument = gql`
    subscription MoviesMutated {
  movieMutated {
    id
    event
    movie {
      ...MovieExplorerProperties
    }
  }
}
    ${MovieExplorerPropertiesFragmentDoc}`;

/**
 * __useMoviesMutatedSubscription__
 *
 * To run a query within a React component, call `useMoviesMutatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMoviesMutatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMoviesMutatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useMoviesMutatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MoviesMutatedSubscription, MoviesMutatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MoviesMutatedSubscription, MoviesMutatedSubscriptionVariables>(MoviesMutatedDocument, options);
      }
export type MoviesMutatedSubscriptionHookResult = ReturnType<typeof useMoviesMutatedSubscription>;
export type MoviesMutatedSubscriptionResult = Apollo.SubscriptionResult<MoviesMutatedSubscription>;
export const MovieGenresDocument = gql`
    query MovieGenres {
  movieGenres(orderBy: UPDATED_DATE_DESC) {
    nodes {
      sortOrder
      title
      id
      updatedDate
      updatedUser
    }
    totalCount
  }
  snapshots(
    filter: {entityType: {equalTo: MOVIE_GENRE}, snapshotState: {equalTo: PUBLISHED}}
  ) {
    nodes {
      updatedUser
      publishedDate
      snapshotState
    }
  }
}
    `;

/**
 * __useMovieGenresQuery__
 *
 * To run a query within a React component, call `useMovieGenresQuery` and pass it any options that fit your needs.
 * When your component renders, `useMovieGenresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMovieGenresQuery({
 *   variables: {
 *   },
 * });
 */
export function useMovieGenresQuery(baseOptions?: Apollo.QueryHookOptions<MovieGenresQuery, MovieGenresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MovieGenresQuery, MovieGenresQueryVariables>(MovieGenresDocument, options);
      }
export function useMovieGenresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MovieGenresQuery, MovieGenresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MovieGenresQuery, MovieGenresQueryVariables>(MovieGenresDocument, options);
        }
export type MovieGenresQueryHookResult = ReturnType<typeof useMovieGenresQuery>;
export type MovieGenresLazyQueryHookResult = ReturnType<typeof useMovieGenresLazyQuery>;
export type MovieGenresQueryResult = Apollo.QueryResult<MovieGenresQuery, MovieGenresQueryVariables>;
export const PublishMovieGenresDocument = gql`
    mutation PublishMovieGenres {
  publishMovieGenres {
    id
  }
}
    `;
export type PublishMovieGenresMutationFn = Apollo.MutationFunction<PublishMovieGenresMutation, PublishMovieGenresMutationVariables>;

/**
 * __usePublishMovieGenresMutation__
 *
 * To run a mutation, you first call `usePublishMovieGenresMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishMovieGenresMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishMovieGenresMutation, { data, loading, error }] = usePublishMovieGenresMutation({
 *   variables: {
 *   },
 * });
 */
export function usePublishMovieGenresMutation(baseOptions?: Apollo.MutationHookOptions<PublishMovieGenresMutation, PublishMovieGenresMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishMovieGenresMutation, PublishMovieGenresMutationVariables>(PublishMovieGenresDocument, options);
      }
export type PublishMovieGenresMutationHookResult = ReturnType<typeof usePublishMovieGenresMutation>;
export type PublishMovieGenresMutationResult = Apollo.MutationResult<PublishMovieGenresMutation>;
export type PublishMovieGenresMutationOptions = Apollo.BaseMutationOptions<PublishMovieGenresMutation, PublishMovieGenresMutationVariables>;
export const UnpublishMovieGenresDocument = gql`
    mutation UnpublishMovieGenres {
  unpublishMovieGenres {
    id
  }
}
    `;
export type UnpublishMovieGenresMutationFn = Apollo.MutationFunction<UnpublishMovieGenresMutation, UnpublishMovieGenresMutationVariables>;

/**
 * __useUnpublishMovieGenresMutation__
 *
 * To run a mutation, you first call `useUnpublishMovieGenresMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishMovieGenresMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishMovieGenresMutation, { data, loading, error }] = useUnpublishMovieGenresMutation({
 *   variables: {
 *   },
 * });
 */
export function useUnpublishMovieGenresMutation(baseOptions?: Apollo.MutationHookOptions<UnpublishMovieGenresMutation, UnpublishMovieGenresMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpublishMovieGenresMutation, UnpublishMovieGenresMutationVariables>(UnpublishMovieGenresDocument, options);
      }
export type UnpublishMovieGenresMutationHookResult = ReturnType<typeof useUnpublishMovieGenresMutation>;
export type UnpublishMovieGenresMutationResult = Apollo.MutationResult<UnpublishMovieGenresMutation>;
export type UnpublishMovieGenresMutationOptions = Apollo.BaseMutationOptions<UnpublishMovieGenresMutation, UnpublishMovieGenresMutationVariables>;
export const CreateMovieGenresSnapshotDocument = gql`
    mutation CreateMovieGenresSnapshot {
  createMovieGenresSnapshot {
    id
  }
}
    `;
export type CreateMovieGenresSnapshotMutationFn = Apollo.MutationFunction<CreateMovieGenresSnapshotMutation, CreateMovieGenresSnapshotMutationVariables>;

/**
 * __useCreateMovieGenresSnapshotMutation__
 *
 * To run a mutation, you first call `useCreateMovieGenresSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMovieGenresSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMovieGenresSnapshotMutation, { data, loading, error }] = useCreateMovieGenresSnapshotMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateMovieGenresSnapshotMutation(baseOptions?: Apollo.MutationHookOptions<CreateMovieGenresSnapshotMutation, CreateMovieGenresSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMovieGenresSnapshotMutation, CreateMovieGenresSnapshotMutationVariables>(CreateMovieGenresSnapshotDocument, options);
      }
export type CreateMovieGenresSnapshotMutationHookResult = ReturnType<typeof useCreateMovieGenresSnapshotMutation>;
export type CreateMovieGenresSnapshotMutationResult = Apollo.MutationResult<CreateMovieGenresSnapshotMutation>;
export type CreateMovieGenresSnapshotMutationOptions = Apollo.BaseMutationOptions<CreateMovieGenresSnapshotMutation, CreateMovieGenresSnapshotMutationVariables>;
export const MovieImagesDocument = gql`
    query MovieImages($id: Int!) {
  movie(id: $id) {
    moviesImages {
      nodes {
        imageId
        imageType
      }
    }
  }
}
    `;

/**
 * __useMovieImagesQuery__
 *
 * To run a query within a React component, call `useMovieImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMovieImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMovieImagesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMovieImagesQuery(baseOptions: Apollo.QueryHookOptions<MovieImagesQuery, MovieImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MovieImagesQuery, MovieImagesQueryVariables>(MovieImagesDocument, options);
      }
export function useMovieImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MovieImagesQuery, MovieImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MovieImagesQuery, MovieImagesQueryVariables>(MovieImagesDocument, options);
        }
export type MovieImagesQueryHookResult = ReturnType<typeof useMovieImagesQuery>;
export type MovieImagesLazyQueryHookResult = ReturnType<typeof useMovieImagesLazyQuery>;
export type MovieImagesQueryResult = Apollo.QueryResult<MovieImagesQuery, MovieImagesQueryVariables>;
export const MoviesLicensesDocument = gql`
    query MoviesLicenses($filter: MoviesLicenseFilter, $orderBy: [MoviesLicensesOrderBy!], $after: Cursor) {
  moviesLicenses(filter: $filter, orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      moviesLicensesCountries {
        nodes {
          code
        }
      }
      licenseEnd
      licenseStart
    }
  }
}
    `;

/**
 * __useMoviesLicensesQuery__
 *
 * To run a query within a React component, call `useMoviesLicensesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMoviesLicensesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMoviesLicensesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useMoviesLicensesQuery(baseOptions?: Apollo.QueryHookOptions<MoviesLicensesQuery, MoviesLicensesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MoviesLicensesQuery, MoviesLicensesQueryVariables>(MoviesLicensesDocument, options);
      }
export function useMoviesLicensesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MoviesLicensesQuery, MoviesLicensesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MoviesLicensesQuery, MoviesLicensesQueryVariables>(MoviesLicensesDocument, options);
        }
export type MoviesLicensesQueryHookResult = ReturnType<typeof useMoviesLicensesQuery>;
export type MoviesLicensesLazyQueryHookResult = ReturnType<typeof useMoviesLicensesLazyQuery>;
export type MoviesLicensesQueryResult = Apollo.QueryResult<MoviesLicensesQuery, MoviesLicensesQueryVariables>;
export const CreateMoviesLicenseDocument = gql`
    mutation CreateMoviesLicense($input: CreateMoviesLicenseInput!) {
  createMoviesLicense(input: $input) {
    moviesLicense {
      id
    }
  }
}
    `;
export type CreateMoviesLicenseMutationFn = Apollo.MutationFunction<CreateMoviesLicenseMutation, CreateMoviesLicenseMutationVariables>;

/**
 * __useCreateMoviesLicenseMutation__
 *
 * To run a mutation, you first call `useCreateMoviesLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMoviesLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMoviesLicenseMutation, { data, loading, error }] = useCreateMoviesLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMoviesLicenseMutation(baseOptions?: Apollo.MutationHookOptions<CreateMoviesLicenseMutation, CreateMoviesLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMoviesLicenseMutation, CreateMoviesLicenseMutationVariables>(CreateMoviesLicenseDocument, options);
      }
export type CreateMoviesLicenseMutationHookResult = ReturnType<typeof useCreateMoviesLicenseMutation>;
export type CreateMoviesLicenseMutationResult = Apollo.MutationResult<CreateMoviesLicenseMutation>;
export type CreateMoviesLicenseMutationOptions = Apollo.BaseMutationOptions<CreateMoviesLicenseMutation, CreateMoviesLicenseMutationVariables>;
export const MoviesLicenseDocument = gql`
    query MoviesLicense($id: Int!) {
  moviesLicense(id: $id) {
    moviesLicensesCountries {
      nodes {
        code
      }
    }
    licenseEnd
    licenseStart
    movieId
  }
}
    `;

/**
 * __useMoviesLicenseQuery__
 *
 * To run a query within a React component, call `useMoviesLicenseQuery` and pass it any options that fit your needs.
 * When your component renders, `useMoviesLicenseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMoviesLicenseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMoviesLicenseQuery(baseOptions: Apollo.QueryHookOptions<MoviesLicenseQuery, MoviesLicenseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MoviesLicenseQuery, MoviesLicenseQueryVariables>(MoviesLicenseDocument, options);
      }
export function useMoviesLicenseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MoviesLicenseQuery, MoviesLicenseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MoviesLicenseQuery, MoviesLicenseQueryVariables>(MoviesLicenseDocument, options);
        }
export type MoviesLicenseQueryHookResult = ReturnType<typeof useMoviesLicenseQuery>;
export type MoviesLicenseLazyQueryHookResult = ReturnType<typeof useMoviesLicenseLazyQuery>;
export type MoviesLicenseQueryResult = Apollo.QueryResult<MoviesLicenseQuery, MoviesLicenseQueryVariables>;
export const UpdateMoviesLicenseDocument = gql`
    mutation UpdateMoviesLicense($input: UpdateMoviesLicenseInput!) {
  updateMoviesLicense(input: $input) {
    clientMutationId
  }
}
    `;
export type UpdateMoviesLicenseMutationFn = Apollo.MutationFunction<UpdateMoviesLicenseMutation, UpdateMoviesLicenseMutationVariables>;

/**
 * __useUpdateMoviesLicenseMutation__
 *
 * To run a mutation, you first call `useUpdateMoviesLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMoviesLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMoviesLicenseMutation, { data, loading, error }] = useUpdateMoviesLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMoviesLicenseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMoviesLicenseMutation, UpdateMoviesLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMoviesLicenseMutation, UpdateMoviesLicenseMutationVariables>(UpdateMoviesLicenseDocument, options);
      }
export type UpdateMoviesLicenseMutationHookResult = ReturnType<typeof useUpdateMoviesLicenseMutation>;
export type UpdateMoviesLicenseMutationResult = Apollo.MutationResult<UpdateMoviesLicenseMutation>;
export type UpdateMoviesLicenseMutationOptions = Apollo.BaseMutationOptions<UpdateMoviesLicenseMutation, UpdateMoviesLicenseMutationVariables>;
export const DeleteMoviesLicenseDocument = gql`
    mutation DeleteMoviesLicense($input: DeleteMoviesLicenseInput!) {
  deleteMoviesLicense(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteMoviesLicenseMutationFn = Apollo.MutationFunction<DeleteMoviesLicenseMutation, DeleteMoviesLicenseMutationVariables>;

/**
 * __useDeleteMoviesLicenseMutation__
 *
 * To run a mutation, you first call `useDeleteMoviesLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMoviesLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMoviesLicenseMutation, { data, loading, error }] = useDeleteMoviesLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteMoviesLicenseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMoviesLicenseMutation, DeleteMoviesLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMoviesLicenseMutation, DeleteMoviesLicenseMutationVariables>(DeleteMoviesLicenseDocument, options);
      }
export type DeleteMoviesLicenseMutationHookResult = ReturnType<typeof useDeleteMoviesLicenseMutation>;
export type DeleteMoviesLicenseMutationResult = Apollo.MutationResult<DeleteMoviesLicenseMutation>;
export type DeleteMoviesLicenseMutationOptions = Apollo.BaseMutationOptions<DeleteMoviesLicenseMutation, DeleteMoviesLicenseMutationVariables>;
export const CreateMovieSnapshotDocument = gql`
    mutation CreateMovieSnapshot($movieId: Int!) {
  createMovieSnapshot(movieId: $movieId) {
    id
  }
}
    `;
export type CreateMovieSnapshotMutationFn = Apollo.MutationFunction<CreateMovieSnapshotMutation, CreateMovieSnapshotMutationVariables>;

/**
 * __useCreateMovieSnapshotMutation__
 *
 * To run a mutation, you first call `useCreateMovieSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMovieSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMovieSnapshotMutation, { data, loading, error }] = useCreateMovieSnapshotMutation({
 *   variables: {
 *      movieId: // value for 'movieId'
 *   },
 * });
 */
export function useCreateMovieSnapshotMutation(baseOptions?: Apollo.MutationHookOptions<CreateMovieSnapshotMutation, CreateMovieSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMovieSnapshotMutation, CreateMovieSnapshotMutationVariables>(CreateMovieSnapshotDocument, options);
      }
export type CreateMovieSnapshotMutationHookResult = ReturnType<typeof useCreateMovieSnapshotMutation>;
export type CreateMovieSnapshotMutationResult = Apollo.MutationResult<CreateMovieSnapshotMutation>;
export type CreateMovieSnapshotMutationOptions = Apollo.BaseMutationOptions<CreateMovieSnapshotMutation, CreateMovieSnapshotMutationVariables>;
export const MovieVideosDocument = gql`
    query MovieVideos($id: Int!) {
  movie(id: $id) {
    moviesTrailers {
      nodes {
        videoId
      }
    }
    mainVideoId
  }
}
    `;

/**
 * __useMovieVideosQuery__
 *
 * To run a query within a React component, call `useMovieVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useMovieVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMovieVideosQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMovieVideosQuery(baseOptions: Apollo.QueryHookOptions<MovieVideosQuery, MovieVideosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MovieVideosQuery, MovieVideosQueryVariables>(MovieVideosDocument, options);
      }
export function useMovieVideosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MovieVideosQuery, MovieVideosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MovieVideosQuery, MovieVideosQueryVariables>(MovieVideosDocument, options);
        }
export type MovieVideosQueryHookResult = ReturnType<typeof useMovieVideosQuery>;
export type MovieVideosLazyQueryHookResult = ReturnType<typeof useMovieVideosLazyQuery>;
export type MovieVideosQueryResult = Apollo.QueryResult<MovieVideosQuery, MovieVideosQueryVariables>;
export const BulkDeleteMoviesDocument = gql`
    mutation BulkDeleteMovies($filter: MovieFilter) {
  deleteMovies(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkDeleteMoviesMutationFn = Apollo.MutationFunction<BulkDeleteMoviesMutation, BulkDeleteMoviesMutationVariables>;

/**
 * __useBulkDeleteMoviesMutation__
 *
 * To run a mutation, you first call `useBulkDeleteMoviesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteMoviesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteMoviesMutation, { data, loading, error }] = useBulkDeleteMoviesMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkDeleteMoviesMutation(baseOptions?: Apollo.MutationHookOptions<BulkDeleteMoviesMutation, BulkDeleteMoviesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkDeleteMoviesMutation, BulkDeleteMoviesMutationVariables>(BulkDeleteMoviesDocument, options);
      }
export type BulkDeleteMoviesMutationHookResult = ReturnType<typeof useBulkDeleteMoviesMutation>;
export type BulkDeleteMoviesMutationResult = Apollo.MutationResult<BulkDeleteMoviesMutation>;
export type BulkDeleteMoviesMutationOptions = Apollo.BaseMutationOptions<BulkDeleteMoviesMutation, BulkDeleteMoviesMutationVariables>;
export const BulkPublishMoviesDocument = gql`
    mutation BulkPublishMovies($filter: MovieFilter) {
  publishMovies(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkPublishMoviesMutationFn = Apollo.MutationFunction<BulkPublishMoviesMutation, BulkPublishMoviesMutationVariables>;

/**
 * __useBulkPublishMoviesMutation__
 *
 * To run a mutation, you first call `useBulkPublishMoviesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkPublishMoviesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkPublishMoviesMutation, { data, loading, error }] = useBulkPublishMoviesMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkPublishMoviesMutation(baseOptions?: Apollo.MutationHookOptions<BulkPublishMoviesMutation, BulkPublishMoviesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkPublishMoviesMutation, BulkPublishMoviesMutationVariables>(BulkPublishMoviesDocument, options);
      }
export type BulkPublishMoviesMutationHookResult = ReturnType<typeof useBulkPublishMoviesMutation>;
export type BulkPublishMoviesMutationResult = Apollo.MutationResult<BulkPublishMoviesMutation>;
export type BulkPublishMoviesMutationOptions = Apollo.BaseMutationOptions<BulkPublishMoviesMutation, BulkPublishMoviesMutationVariables>;
export const BulkUnpublishMoviesDocument = gql`
    mutation BulkUnpublishMovies($filter: MovieFilter) {
  unpublishMovies(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkUnpublishMoviesMutationFn = Apollo.MutationFunction<BulkUnpublishMoviesMutation, BulkUnpublishMoviesMutationVariables>;

/**
 * __useBulkUnpublishMoviesMutation__
 *
 * To run a mutation, you first call `useBulkUnpublishMoviesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkUnpublishMoviesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkUnpublishMoviesMutation, { data, loading, error }] = useBulkUnpublishMoviesMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkUnpublishMoviesMutation(baseOptions?: Apollo.MutationHookOptions<BulkUnpublishMoviesMutation, BulkUnpublishMoviesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkUnpublishMoviesMutation, BulkUnpublishMoviesMutationVariables>(BulkUnpublishMoviesDocument, options);
      }
export type BulkUnpublishMoviesMutationHookResult = ReturnType<typeof useBulkUnpublishMoviesMutation>;
export type BulkUnpublishMoviesMutationResult = Apollo.MutationResult<BulkUnpublishMoviesMutation>;
export type BulkUnpublishMoviesMutationOptions = Apollo.BaseMutationOptions<BulkUnpublishMoviesMutation, BulkUnpublishMoviesMutationVariables>;
export const BulkCreateMovieSnapshotsDocument = gql`
    mutation BulkCreateMovieSnapshots($filter: MovieFilter) {
  createMovieSnapshots(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkCreateMovieSnapshotsMutationFn = Apollo.MutationFunction<BulkCreateMovieSnapshotsMutation, BulkCreateMovieSnapshotsMutationVariables>;

/**
 * __useBulkCreateMovieSnapshotsMutation__
 *
 * To run a mutation, you first call `useBulkCreateMovieSnapshotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkCreateMovieSnapshotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkCreateMovieSnapshotsMutation, { data, loading, error }] = useBulkCreateMovieSnapshotsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkCreateMovieSnapshotsMutation(baseOptions?: Apollo.MutationHookOptions<BulkCreateMovieSnapshotsMutation, BulkCreateMovieSnapshotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkCreateMovieSnapshotsMutation, BulkCreateMovieSnapshotsMutationVariables>(BulkCreateMovieSnapshotsDocument, options);
      }
export type BulkCreateMovieSnapshotsMutationHookResult = ReturnType<typeof useBulkCreateMovieSnapshotsMutation>;
export type BulkCreateMovieSnapshotsMutationResult = Apollo.MutationResult<BulkCreateMovieSnapshotsMutation>;
export type BulkCreateMovieSnapshotsMutationOptions = Apollo.BaseMutationOptions<BulkCreateMovieSnapshotsMutation, BulkCreateMovieSnapshotsMutationVariables>;
export const PublishingSnapshotDocument = gql`
    query PublishingSnapshot($id: Int!) {
  snapshot(id: $id) {
    id
    entityType
    createdDate
    createdUser
    snapshotState
    updatedDate
    updatedUser
    snapshotJson
    snapshotValidationResults {
      nodes {
        id
        context
        severity
        message
      }
    }
  }
}
    `;

/**
 * __usePublishingSnapshotQuery__
 *
 * To run a query within a React component, call `usePublishingSnapshotQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublishingSnapshotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublishingSnapshotQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePublishingSnapshotQuery(baseOptions: Apollo.QueryHookOptions<PublishingSnapshotQuery, PublishingSnapshotQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PublishingSnapshotQuery, PublishingSnapshotQueryVariables>(PublishingSnapshotDocument, options);
      }
export function usePublishingSnapshotLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PublishingSnapshotQuery, PublishingSnapshotQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PublishingSnapshotQuery, PublishingSnapshotQueryVariables>(PublishingSnapshotDocument, options);
        }
export type PublishingSnapshotQueryHookResult = ReturnType<typeof usePublishingSnapshotQuery>;
export type PublishingSnapshotLazyQueryHookResult = ReturnType<typeof usePublishingSnapshotLazyQuery>;
export type PublishingSnapshotQueryResult = Apollo.QueryResult<PublishingSnapshotQuery, PublishingSnapshotQueryVariables>;
export const PublishingSnapshotTitleDocument = gql`
    query PublishingSnapshotTitle($id: Int!) {
  snapshot(id: $id) {
    entityType
    snapshotNo
  }
}
    `;

/**
 * __usePublishingSnapshotTitleQuery__
 *
 * To run a query within a React component, call `usePublishingSnapshotTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublishingSnapshotTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublishingSnapshotTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePublishingSnapshotTitleQuery(baseOptions: Apollo.QueryHookOptions<PublishingSnapshotTitleQuery, PublishingSnapshotTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PublishingSnapshotTitleQuery, PublishingSnapshotTitleQueryVariables>(PublishingSnapshotTitleDocument, options);
      }
export function usePublishingSnapshotTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PublishingSnapshotTitleQuery, PublishingSnapshotTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PublishingSnapshotTitleQuery, PublishingSnapshotTitleQueryVariables>(PublishingSnapshotTitleDocument, options);
        }
export type PublishingSnapshotTitleQueryHookResult = ReturnType<typeof usePublishingSnapshotTitleQuery>;
export type PublishingSnapshotTitleLazyQueryHookResult = ReturnType<typeof usePublishingSnapshotTitleLazyQuery>;
export type PublishingSnapshotTitleQueryResult = Apollo.QueryResult<PublishingSnapshotTitleQuery, PublishingSnapshotTitleQueryVariables>;
export const PublishSnapshotDocument = gql`
    mutation PublishSnapshot($id: Int!) {
  publishSnapshot(snapshotId: $id) {
    id
  }
}
    `;
export type PublishSnapshotMutationFn = Apollo.MutationFunction<PublishSnapshotMutation, PublishSnapshotMutationVariables>;

/**
 * __usePublishSnapshotMutation__
 *
 * To run a mutation, you first call `usePublishSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishSnapshotMutation, { data, loading, error }] = usePublishSnapshotMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePublishSnapshotMutation(baseOptions?: Apollo.MutationHookOptions<PublishSnapshotMutation, PublishSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishSnapshotMutation, PublishSnapshotMutationVariables>(PublishSnapshotDocument, options);
      }
export type PublishSnapshotMutationHookResult = ReturnType<typeof usePublishSnapshotMutation>;
export type PublishSnapshotMutationResult = Apollo.MutationResult<PublishSnapshotMutation>;
export type PublishSnapshotMutationOptions = Apollo.BaseMutationOptions<PublishSnapshotMutation, PublishSnapshotMutationVariables>;
export const UnpublishSnapshotDocument = gql`
    mutation UnpublishSnapshot($id: Int!) {
  unpublishSnapshot(snapshotId: $id) {
    id
  }
}
    `;
export type UnpublishSnapshotMutationFn = Apollo.MutationFunction<UnpublishSnapshotMutation, UnpublishSnapshotMutationVariables>;

/**
 * __useUnpublishSnapshotMutation__
 *
 * To run a mutation, you first call `useUnpublishSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishSnapshotMutation, { data, loading, error }] = useUnpublishSnapshotMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnpublishSnapshotMutation(baseOptions?: Apollo.MutationHookOptions<UnpublishSnapshotMutation, UnpublishSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpublishSnapshotMutation, UnpublishSnapshotMutationVariables>(UnpublishSnapshotDocument, options);
      }
export type UnpublishSnapshotMutationHookResult = ReturnType<typeof useUnpublishSnapshotMutation>;
export type UnpublishSnapshotMutationResult = Apollo.MutationResult<UnpublishSnapshotMutation>;
export type UnpublishSnapshotMutationOptions = Apollo.BaseMutationOptions<UnpublishSnapshotMutation, UnpublishSnapshotMutationVariables>;
export const DeleteSnapshotDocument = gql`
    mutation DeleteSnapshot($input: DeleteSnapshotInput!) {
  deleteSnapshot(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteSnapshotMutationFn = Apollo.MutationFunction<DeleteSnapshotMutation, DeleteSnapshotMutationVariables>;

/**
 * __useDeleteSnapshotMutation__
 *
 * To run a mutation, you first call `useDeleteSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSnapshotMutation, { data, loading, error }] = useDeleteSnapshotMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteSnapshotMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSnapshotMutation, DeleteSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSnapshotMutation, DeleteSnapshotMutationVariables>(DeleteSnapshotDocument, options);
      }
export type DeleteSnapshotMutationHookResult = ReturnType<typeof useDeleteSnapshotMutation>;
export type DeleteSnapshotMutationResult = Apollo.MutationResult<DeleteSnapshotMutation>;
export type DeleteSnapshotMutationOptions = Apollo.BaseMutationOptions<DeleteSnapshotMutation, DeleteSnapshotMutationVariables>;
export const PublishingSnapshotsDocument = gql`
    query PublishingSnapshots($entityType: EntityType!, $entityId: Int, $filter: SnapshotFilter, $orderBy: [SnapshotsOrderBy!], $after: Cursor) {
  filtered: snapshots(
    condition: {entityType: $entityType, entityId: $entityId}
    filter: $filter
    orderBy: $orderBy
    after: $after
  ) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...PublishingSnapshotExplorerProperties
    }
  }
  nonFiltered: snapshots(
    condition: {entityType: $entityType, entityId: $entityId}
  ) {
    totalCount
  }
}
    ${PublishingSnapshotExplorerPropertiesFragmentDoc}`;

/**
 * __usePublishingSnapshotsQuery__
 *
 * To run a query within a React component, call `usePublishingSnapshotsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublishingSnapshotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublishingSnapshotsQuery({
 *   variables: {
 *      entityType: // value for 'entityType'
 *      entityId: // value for 'entityId'
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function usePublishingSnapshotsQuery(baseOptions: Apollo.QueryHookOptions<PublishingSnapshotsQuery, PublishingSnapshotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PublishingSnapshotsQuery, PublishingSnapshotsQueryVariables>(PublishingSnapshotsDocument, options);
      }
export function usePublishingSnapshotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PublishingSnapshotsQuery, PublishingSnapshotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PublishingSnapshotsQuery, PublishingSnapshotsQueryVariables>(PublishingSnapshotsDocument, options);
        }
export type PublishingSnapshotsQueryHookResult = ReturnType<typeof usePublishingSnapshotsQuery>;
export type PublishingSnapshotsLazyQueryHookResult = ReturnType<typeof usePublishingSnapshotsLazyQuery>;
export type PublishingSnapshotsQueryResult = Apollo.QueryResult<PublishingSnapshotsQuery, PublishingSnapshotsQueryVariables>;
export const PublishingSnapshotMutatedDocument = gql`
    subscription PublishingSnapshotMutated {
  snapshotMutated {
    id
    event
    snapshot {
      entityType
      entityId
      ...PublishingSnapshotExplorerProperties
    }
  }
}
    ${PublishingSnapshotExplorerPropertiesFragmentDoc}`;

/**
 * __usePublishingSnapshotMutatedSubscription__
 *
 * To run a query within a React component, call `usePublishingSnapshotMutatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePublishingSnapshotMutatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublishingSnapshotMutatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function usePublishingSnapshotMutatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<PublishingSnapshotMutatedSubscription, PublishingSnapshotMutatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<PublishingSnapshotMutatedSubscription, PublishingSnapshotMutatedSubscriptionVariables>(PublishingSnapshotMutatedDocument, options);
      }
export type PublishingSnapshotMutatedSubscriptionHookResult = ReturnType<typeof usePublishingSnapshotMutatedSubscription>;
export type PublishingSnapshotMutatedSubscriptionResult = Apollo.SubscriptionResult<PublishingSnapshotMutatedSubscription>;
export const SnapshotsDocument = gql`
    query Snapshots($filter: SnapshotFilter, $orderBy: [SnapshotsOrderBy!], $after: Cursor) {
  filtered: snapshots(
    filter: $filter
    orderBy: $orderBy
    first: 30
    after: $after
  ) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...SnapshotExplorerProperties
    }
  }
  nonFiltered: snapshots {
    totalCount
  }
}
    ${SnapshotExplorerPropertiesFragmentDoc}`;

/**
 * __useSnapshotsQuery__
 *
 * To run a query within a React component, call `useSnapshotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSnapshotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSnapshotsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useSnapshotsQuery(baseOptions?: Apollo.QueryHookOptions<SnapshotsQuery, SnapshotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SnapshotsQuery, SnapshotsQueryVariables>(SnapshotsDocument, options);
      }
export function useSnapshotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SnapshotsQuery, SnapshotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SnapshotsQuery, SnapshotsQueryVariables>(SnapshotsDocument, options);
        }
export type SnapshotsQueryHookResult = ReturnType<typeof useSnapshotsQuery>;
export type SnapshotsLazyQueryHookResult = ReturnType<typeof useSnapshotsLazyQuery>;
export type SnapshotsQueryResult = Apollo.QueryResult<SnapshotsQuery, SnapshotsQueryVariables>;
export const SnapshotsMutatedDocument = gql`
    subscription SnapshotsMutated {
  snapshotMutated {
    id
    event
    snapshot {
      ...SnapshotExplorerProperties
    }
  }
}
    ${SnapshotExplorerPropertiesFragmentDoc}`;

/**
 * __useSnapshotsMutatedSubscription__
 *
 * To run a query within a React component, call `useSnapshotsMutatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSnapshotsMutatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSnapshotsMutatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSnapshotsMutatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SnapshotsMutatedSubscription, SnapshotsMutatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SnapshotsMutatedSubscription, SnapshotsMutatedSubscriptionVariables>(SnapshotsMutatedDocument, options);
      }
export type SnapshotsMutatedSubscriptionHookResult = ReturnType<typeof useSnapshotsMutatedSubscription>;
export type SnapshotsMutatedSubscriptionResult = Apollo.SubscriptionResult<SnapshotsMutatedSubscription>;
export const BulkDeleteSnapshotsDocument = gql`
    mutation BulkDeleteSnapshots($filter: SnapshotFilter) {
  deleteSnapshots(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkDeleteSnapshotsMutationFn = Apollo.MutationFunction<BulkDeleteSnapshotsMutation, BulkDeleteSnapshotsMutationVariables>;

/**
 * __useBulkDeleteSnapshotsMutation__
 *
 * To run a mutation, you first call `useBulkDeleteSnapshotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteSnapshotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteSnapshotsMutation, { data, loading, error }] = useBulkDeleteSnapshotsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkDeleteSnapshotsMutation(baseOptions?: Apollo.MutationHookOptions<BulkDeleteSnapshotsMutation, BulkDeleteSnapshotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkDeleteSnapshotsMutation, BulkDeleteSnapshotsMutationVariables>(BulkDeleteSnapshotsDocument, options);
      }
export type BulkDeleteSnapshotsMutationHookResult = ReturnType<typeof useBulkDeleteSnapshotsMutation>;
export type BulkDeleteSnapshotsMutationResult = Apollo.MutationResult<BulkDeleteSnapshotsMutation>;
export type BulkDeleteSnapshotsMutationOptions = Apollo.BaseMutationOptions<BulkDeleteSnapshotsMutation, BulkDeleteSnapshotsMutationVariables>;
export const BulkPublishSnapshotsDocument = gql`
    mutation BulkPublishSnapshots($filter: SnapshotFilter) {
  publishSnapshots(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkPublishSnapshotsMutationFn = Apollo.MutationFunction<BulkPublishSnapshotsMutation, BulkPublishSnapshotsMutationVariables>;

/**
 * __useBulkPublishSnapshotsMutation__
 *
 * To run a mutation, you first call `useBulkPublishSnapshotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkPublishSnapshotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkPublishSnapshotsMutation, { data, loading, error }] = useBulkPublishSnapshotsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkPublishSnapshotsMutation(baseOptions?: Apollo.MutationHookOptions<BulkPublishSnapshotsMutation, BulkPublishSnapshotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkPublishSnapshotsMutation, BulkPublishSnapshotsMutationVariables>(BulkPublishSnapshotsDocument, options);
      }
export type BulkPublishSnapshotsMutationHookResult = ReturnType<typeof useBulkPublishSnapshotsMutation>;
export type BulkPublishSnapshotsMutationResult = Apollo.MutationResult<BulkPublishSnapshotsMutation>;
export type BulkPublishSnapshotsMutationOptions = Apollo.BaseMutationOptions<BulkPublishSnapshotsMutation, BulkPublishSnapshotsMutationVariables>;
export const BulkUnpublishSnapshotsDocument = gql`
    mutation BulkUnpublishSnapshots($filter: SnapshotFilter) {
  unpublishSnapshots(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkUnpublishSnapshotsMutationFn = Apollo.MutationFunction<BulkUnpublishSnapshotsMutation, BulkUnpublishSnapshotsMutationVariables>;

/**
 * __useBulkUnpublishSnapshotsMutation__
 *
 * To run a mutation, you first call `useBulkUnpublishSnapshotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkUnpublishSnapshotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkUnpublishSnapshotsMutation, { data, loading, error }] = useBulkUnpublishSnapshotsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkUnpublishSnapshotsMutation(baseOptions?: Apollo.MutationHookOptions<BulkUnpublishSnapshotsMutation, BulkUnpublishSnapshotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkUnpublishSnapshotsMutation, BulkUnpublishSnapshotsMutationVariables>(BulkUnpublishSnapshotsDocument, options);
      }
export type BulkUnpublishSnapshotsMutationHookResult = ReturnType<typeof useBulkUnpublishSnapshotsMutation>;
export type BulkUnpublishSnapshotsMutationResult = Apollo.MutationResult<BulkUnpublishSnapshotsMutation>;
export type BulkUnpublishSnapshotsMutationOptions = Apollo.BaseMutationOptions<BulkUnpublishSnapshotsMutation, BulkUnpublishSnapshotsMutationVariables>;
export const BulkRecreateSnapshotsDocument = gql`
    mutation BulkRecreateSnapshots($filter: SnapshotFilter) {
  recreateSnapshots(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkRecreateSnapshotsMutationFn = Apollo.MutationFunction<BulkRecreateSnapshotsMutation, BulkRecreateSnapshotsMutationVariables>;

/**
 * __useBulkRecreateSnapshotsMutation__
 *
 * To run a mutation, you first call `useBulkRecreateSnapshotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkRecreateSnapshotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkRecreateSnapshotsMutation, { data, loading, error }] = useBulkRecreateSnapshotsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkRecreateSnapshotsMutation(baseOptions?: Apollo.MutationHookOptions<BulkRecreateSnapshotsMutation, BulkRecreateSnapshotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkRecreateSnapshotsMutation, BulkRecreateSnapshotsMutationVariables>(BulkRecreateSnapshotsDocument, options);
      }
export type BulkRecreateSnapshotsMutationHookResult = ReturnType<typeof useBulkRecreateSnapshotsMutation>;
export type BulkRecreateSnapshotsMutationResult = Apollo.MutationResult<BulkRecreateSnapshotsMutation>;
export type BulkRecreateSnapshotsMutationOptions = Apollo.BaseMutationOptions<BulkRecreateSnapshotsMutation, BulkRecreateSnapshotsMutationVariables>;
export const CreateReviewDocument = gql`
    mutation CreateReview($input: CreateReviewInput!) {
  createReview(input: $input) {
    review {
      id
    }
  }
}
    `;
export type CreateReviewMutationFn = Apollo.MutationFunction<CreateReviewMutation, CreateReviewMutationVariables>;

/**
 * __useCreateReviewMutation__
 *
 * To run a mutation, you first call `useCreateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReviewMutation, { data, loading, error }] = useCreateReviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateReviewMutation(baseOptions?: Apollo.MutationHookOptions<CreateReviewMutation, CreateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReviewMutation, CreateReviewMutationVariables>(CreateReviewDocument, options);
      }
export type CreateReviewMutationHookResult = ReturnType<typeof useCreateReviewMutation>;
export type CreateReviewMutationResult = Apollo.MutationResult<CreateReviewMutation>;
export type CreateReviewMutationOptions = Apollo.BaseMutationOptions<CreateReviewMutation, CreateReviewMutationVariables>;
export const ReviewDocument = gql`
    query Review($id: Int!) {
  review(id: $id) {
    title
    rating
    description
    id
    createdDate
    createdUser
    updatedDate
    updatedUser
  }
}
    `;

/**
 * __useReviewQuery__
 *
 * To run a query within a React component, call `useReviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useReviewQuery(baseOptions: Apollo.QueryHookOptions<ReviewQuery, ReviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReviewQuery, ReviewQueryVariables>(ReviewDocument, options);
      }
export function useReviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewQuery, ReviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReviewQuery, ReviewQueryVariables>(ReviewDocument, options);
        }
export type ReviewQueryHookResult = ReturnType<typeof useReviewQuery>;
export type ReviewLazyQueryHookResult = ReturnType<typeof useReviewLazyQuery>;
export type ReviewQueryResult = Apollo.QueryResult<ReviewQuery, ReviewQueryVariables>;
export const UpdateReviewDocument = gql`
    mutation UpdateReview($input: UpdateReviewInput!) {
  updateReview(input: $input) {
    review {
      id
      title
    }
  }
}
    `;
export type UpdateReviewMutationFn = Apollo.MutationFunction<UpdateReviewMutation, UpdateReviewMutationVariables>;

/**
 * __useUpdateReviewMutation__
 *
 * To run a mutation, you first call `useUpdateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReviewMutation, { data, loading, error }] = useUpdateReviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateReviewMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReviewMutation, UpdateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReviewMutation, UpdateReviewMutationVariables>(UpdateReviewDocument, options);
      }
export type UpdateReviewMutationHookResult = ReturnType<typeof useUpdateReviewMutation>;
export type UpdateReviewMutationResult = Apollo.MutationResult<UpdateReviewMutation>;
export type UpdateReviewMutationOptions = Apollo.BaseMutationOptions<UpdateReviewMutation, UpdateReviewMutationVariables>;
export const DeleteReviewDocument = gql`
    mutation DeleteReview($input: DeleteReviewInput!) {
  deleteReview(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteReviewMutationFn = Apollo.MutationFunction<DeleteReviewMutation, DeleteReviewMutationVariables>;

/**
 * __useDeleteReviewMutation__
 *
 * To run a mutation, you first call `useDeleteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReviewMutation, { data, loading, error }] = useDeleteReviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteReviewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReviewMutation, DeleteReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReviewMutation, DeleteReviewMutationVariables>(DeleteReviewDocument, options);
      }
export type DeleteReviewMutationHookResult = ReturnType<typeof useDeleteReviewMutation>;
export type DeleteReviewMutationResult = Apollo.MutationResult<DeleteReviewMutation>;
export type DeleteReviewMutationOptions = Apollo.BaseMutationOptions<DeleteReviewMutation, DeleteReviewMutationVariables>;
export const ReviewTitleDocument = gql`
    query ReviewTitle($id: Int!) {
  review(id: $id) {
    title
  }
}
    `;

/**
 * __useReviewTitleQuery__
 *
 * To run a query within a React component, call `useReviewTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useReviewTitleQuery(baseOptions: Apollo.QueryHookOptions<ReviewTitleQuery, ReviewTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReviewTitleQuery, ReviewTitleQueryVariables>(ReviewTitleDocument, options);
      }
export function useReviewTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewTitleQuery, ReviewTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReviewTitleQuery, ReviewTitleQueryVariables>(ReviewTitleDocument, options);
        }
export type ReviewTitleQueryHookResult = ReturnType<typeof useReviewTitleQuery>;
export type ReviewTitleLazyQueryHookResult = ReturnType<typeof useReviewTitleLazyQuery>;
export type ReviewTitleQueryResult = Apollo.QueryResult<ReviewTitleQuery, ReviewTitleQueryVariables>;
export const ReviewsDocument = gql`
    query Reviews($filter: ReviewFilter, $orderBy: [ReviewsOrderBy!], $after: Cursor) {
  filtered: reviews(filter: $filter, orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      title
      rating
      createdDate
      updatedDate
    }
  }
  nonFiltered: reviews {
    totalCount
  }
}
    `;

/**
 * __useReviewsQuery__
 *
 * To run a query within a React component, call `useReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useReviewsQuery(baseOptions?: Apollo.QueryHookOptions<ReviewsQuery, ReviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReviewsQuery, ReviewsQueryVariables>(ReviewsDocument, options);
      }
export function useReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewsQuery, ReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReviewsQuery, ReviewsQueryVariables>(ReviewsDocument, options);
        }
export type ReviewsQueryHookResult = ReturnType<typeof useReviewsQuery>;
export type ReviewsLazyQueryHookResult = ReturnType<typeof useReviewsLazyQuery>;
export type ReviewsQueryResult = Apollo.QueryResult<ReviewsQuery, ReviewsQueryVariables>;
export const CreateSeasonDocument = gql`
    mutation CreateSeason($input: CreateSeasonInput!) {
  createSeason(input: $input) {
    season {
      id
      index
    }
  }
}
    `;
export type CreateSeasonMutationFn = Apollo.MutationFunction<CreateSeasonMutation, CreateSeasonMutationVariables>;

/**
 * __useCreateSeasonMutation__
 *
 * To run a mutation, you first call `useCreateSeasonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSeasonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSeasonMutation, { data, loading, error }] = useCreateSeasonMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSeasonMutation(baseOptions?: Apollo.MutationHookOptions<CreateSeasonMutation, CreateSeasonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSeasonMutation, CreateSeasonMutationVariables>(CreateSeasonDocument, options);
      }
export type CreateSeasonMutationHookResult = ReturnType<typeof useCreateSeasonMutation>;
export type CreateSeasonMutationResult = Apollo.MutationResult<CreateSeasonMutation>;
export type CreateSeasonMutationOptions = Apollo.BaseMutationOptions<CreateSeasonMutation, CreateSeasonMutationVariables>;
export const SeasonDocument = gql`
    query Season($id: Int!) {
  season(id: $id) {
    index
    synopsis
    description
    externalId
    seasonsTags {
      nodes {
        name
      }
    }
    seasonsTvshowGenres {
      nodes {
        tvshowGenres {
          title
        }
      }
    }
    seasonsCasts {
      nodes {
        name
      }
    }
    studio
    seasonsProductionCountries {
      nodes {
        name
      }
    }
    released
    id
    createdDate
    createdUser
    updatedDate
    updatedUser
    episodes {
      totalCount
    }
    seasonsTrailers {
      totalCount
    }
    seasonsImages {
      nodes {
        imageType
        imageId
      }
    }
    publishStatus
    publishedDate
    publishedUser
  }
  tvshowGenres {
    nodes {
      title
      id
    }
  }
}
    `;

/**
 * __useSeasonQuery__
 *
 * To run a query within a React component, call `useSeasonQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSeasonQuery(baseOptions: Apollo.QueryHookOptions<SeasonQuery, SeasonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonQuery, SeasonQueryVariables>(SeasonDocument, options);
      }
export function useSeasonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonQuery, SeasonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonQuery, SeasonQueryVariables>(SeasonDocument, options);
        }
export type SeasonQueryHookResult = ReturnType<typeof useSeasonQuery>;
export type SeasonLazyQueryHookResult = ReturnType<typeof useSeasonLazyQuery>;
export type SeasonQueryResult = Apollo.QueryResult<SeasonQuery, SeasonQueryVariables>;
export const DeleteSeasonDocument = gql`
    mutation DeleteSeason($input: DeleteSeasonInput!) {
  deleteSeason(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteSeasonMutationFn = Apollo.MutationFunction<DeleteSeasonMutation, DeleteSeasonMutationVariables>;

/**
 * __useDeleteSeasonMutation__
 *
 * To run a mutation, you first call `useDeleteSeasonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSeasonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSeasonMutation, { data, loading, error }] = useDeleteSeasonMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteSeasonMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSeasonMutation, DeleteSeasonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSeasonMutation, DeleteSeasonMutationVariables>(DeleteSeasonDocument, options);
      }
export type DeleteSeasonMutationHookResult = ReturnType<typeof useDeleteSeasonMutation>;
export type DeleteSeasonMutationResult = Apollo.MutationResult<DeleteSeasonMutation>;
export type DeleteSeasonMutationOptions = Apollo.BaseMutationOptions<DeleteSeasonMutation, DeleteSeasonMutationVariables>;
export const PublishSeasonDocument = gql`
    mutation PublishSeason($id: Int!) {
  publishSeason(seasonId: $id) {
    id
  }
}
    `;
export type PublishSeasonMutationFn = Apollo.MutationFunction<PublishSeasonMutation, PublishSeasonMutationVariables>;

/**
 * __usePublishSeasonMutation__
 *
 * To run a mutation, you first call `usePublishSeasonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishSeasonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishSeasonMutation, { data, loading, error }] = usePublishSeasonMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePublishSeasonMutation(baseOptions?: Apollo.MutationHookOptions<PublishSeasonMutation, PublishSeasonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishSeasonMutation, PublishSeasonMutationVariables>(PublishSeasonDocument, options);
      }
export type PublishSeasonMutationHookResult = ReturnType<typeof usePublishSeasonMutation>;
export type PublishSeasonMutationResult = Apollo.MutationResult<PublishSeasonMutation>;
export type PublishSeasonMutationOptions = Apollo.BaseMutationOptions<PublishSeasonMutation, PublishSeasonMutationVariables>;
export const UnpublishSeasonDocument = gql`
    mutation UnpublishSeason($id: Int!) {
  unpublishSeason(seasonId: $id) {
    id
  }
}
    `;
export type UnpublishSeasonMutationFn = Apollo.MutationFunction<UnpublishSeasonMutation, UnpublishSeasonMutationVariables>;

/**
 * __useUnpublishSeasonMutation__
 *
 * To run a mutation, you first call `useUnpublishSeasonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishSeasonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishSeasonMutation, { data, loading, error }] = useUnpublishSeasonMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnpublishSeasonMutation(baseOptions?: Apollo.MutationHookOptions<UnpublishSeasonMutation, UnpublishSeasonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpublishSeasonMutation, UnpublishSeasonMutationVariables>(UnpublishSeasonDocument, options);
      }
export type UnpublishSeasonMutationHookResult = ReturnType<typeof useUnpublishSeasonMutation>;
export type UnpublishSeasonMutationResult = Apollo.MutationResult<UnpublishSeasonMutation>;
export type UnpublishSeasonMutationOptions = Apollo.BaseMutationOptions<UnpublishSeasonMutation, UnpublishSeasonMutationVariables>;
export const SeasonTitleDocument = gql`
    query SeasonTitle($id: Int!) {
  season(id: $id) {
    id
    index
  }
}
    `;

/**
 * __useSeasonTitleQuery__
 *
 * To run a query within a React component, call `useSeasonTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSeasonTitleQuery(baseOptions: Apollo.QueryHookOptions<SeasonTitleQuery, SeasonTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonTitleQuery, SeasonTitleQueryVariables>(SeasonTitleDocument, options);
      }
export function useSeasonTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonTitleQuery, SeasonTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonTitleQuery, SeasonTitleQueryVariables>(SeasonTitleDocument, options);
        }
export type SeasonTitleQueryHookResult = ReturnType<typeof useSeasonTitleQuery>;
export type SeasonTitleLazyQueryHookResult = ReturnType<typeof useSeasonTitleLazyQuery>;
export type SeasonTitleQueryResult = Apollo.QueryResult<SeasonTitleQuery, SeasonTitleQueryVariables>;
export const SearchSeasonTagsDocument = gql`
    query SearchSeasonTags($searchKey: String!, $limit: Int!) {
  getSeasonsTagsValues(filter: {startsWithInsensitive: $searchKey}, first: $limit) {
    nodes
  }
}
    `;

/**
 * __useSearchSeasonTagsQuery__
 *
 * To run a query within a React component, call `useSearchSeasonTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSeasonTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSeasonTagsQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchSeasonTagsQuery(baseOptions: Apollo.QueryHookOptions<SearchSeasonTagsQuery, SearchSeasonTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchSeasonTagsQuery, SearchSeasonTagsQueryVariables>(SearchSeasonTagsDocument, options);
      }
export function useSearchSeasonTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchSeasonTagsQuery, SearchSeasonTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchSeasonTagsQuery, SearchSeasonTagsQueryVariables>(SearchSeasonTagsDocument, options);
        }
export type SearchSeasonTagsQueryHookResult = ReturnType<typeof useSearchSeasonTagsQuery>;
export type SearchSeasonTagsLazyQueryHookResult = ReturnType<typeof useSearchSeasonTagsLazyQuery>;
export type SearchSeasonTagsQueryResult = Apollo.QueryResult<SearchSeasonTagsQuery, SearchSeasonTagsQueryVariables>;
export const SearchSeasonCastDocument = gql`
    query SearchSeasonCast($searchKey: String!, $limit: Int!) {
  getSeasonsCastsValues(
    filter: {startsWithInsensitive: $searchKey}
    first: $limit
  ) {
    nodes
  }
}
    `;

/**
 * __useSearchSeasonCastQuery__
 *
 * To run a query within a React component, call `useSearchSeasonCastQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSeasonCastQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSeasonCastQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchSeasonCastQuery(baseOptions: Apollo.QueryHookOptions<SearchSeasonCastQuery, SearchSeasonCastQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchSeasonCastQuery, SearchSeasonCastQueryVariables>(SearchSeasonCastDocument, options);
      }
export function useSearchSeasonCastLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchSeasonCastQuery, SearchSeasonCastQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchSeasonCastQuery, SearchSeasonCastQueryVariables>(SearchSeasonCastDocument, options);
        }
export type SearchSeasonCastQueryHookResult = ReturnType<typeof useSearchSeasonCastQuery>;
export type SearchSeasonCastLazyQueryHookResult = ReturnType<typeof useSearchSeasonCastLazyQuery>;
export type SearchSeasonCastQueryResult = Apollo.QueryResult<SearchSeasonCastQuery, SearchSeasonCastQueryVariables>;
export const SearchSeasonProductionCountriesDocument = gql`
    query SearchSeasonProductionCountries($searchKey: String!, $limit: Int!) {
  getSeasonsProductionCountriesValues(
    filter: {startsWithInsensitive: $searchKey}
    first: $limit
  ) {
    nodes
  }
}
    `;

/**
 * __useSearchSeasonProductionCountriesQuery__
 *
 * To run a query within a React component, call `useSearchSeasonProductionCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSeasonProductionCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSeasonProductionCountriesQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchSeasonProductionCountriesQuery(baseOptions: Apollo.QueryHookOptions<SearchSeasonProductionCountriesQuery, SearchSeasonProductionCountriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchSeasonProductionCountriesQuery, SearchSeasonProductionCountriesQueryVariables>(SearchSeasonProductionCountriesDocument, options);
      }
export function useSearchSeasonProductionCountriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchSeasonProductionCountriesQuery, SearchSeasonProductionCountriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchSeasonProductionCountriesQuery, SearchSeasonProductionCountriesQueryVariables>(SearchSeasonProductionCountriesDocument, options);
        }
export type SearchSeasonProductionCountriesQueryHookResult = ReturnType<typeof useSearchSeasonProductionCountriesQuery>;
export type SearchSeasonProductionCountriesLazyQueryHookResult = ReturnType<typeof useSearchSeasonProductionCountriesLazyQuery>;
export type SearchSeasonProductionCountriesQueryResult = Apollo.QueryResult<SearchSeasonProductionCountriesQuery, SearchSeasonProductionCountriesQueryVariables>;
export const SeasonEpisodesDocument = gql`
    query SeasonEpisodes($id: Int!) {
  season(id: $id) {
    episodes {
      nodes {
        id
        index
        externalId
        title
      }
    }
  }
}
    `;

/**
 * __useSeasonEpisodesQuery__
 *
 * To run a query within a React component, call `useSeasonEpisodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonEpisodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonEpisodesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSeasonEpisodesQuery(baseOptions: Apollo.QueryHookOptions<SeasonEpisodesQuery, SeasonEpisodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonEpisodesQuery, SeasonEpisodesQueryVariables>(SeasonEpisodesDocument, options);
      }
export function useSeasonEpisodesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonEpisodesQuery, SeasonEpisodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonEpisodesQuery, SeasonEpisodesQueryVariables>(SeasonEpisodesDocument, options);
        }
export type SeasonEpisodesQueryHookResult = ReturnType<typeof useSeasonEpisodesQuery>;
export type SeasonEpisodesLazyQueryHookResult = ReturnType<typeof useSeasonEpisodesLazyQuery>;
export type SeasonEpisodesQueryResult = Apollo.QueryResult<SeasonEpisodesQuery, SeasonEpisodesQueryVariables>;
export const SeasonsDocument = gql`
    query Seasons($filter: SeasonFilter, $orderBy: [SeasonsOrderBy!], $after: Cursor) {
  filtered: seasons(filter: $filter, orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...SeasonExplorerProperties
    }
  }
  nonFiltered: seasons {
    totalCount
  }
}
    ${SeasonExplorerPropertiesFragmentDoc}`;

/**
 * __useSeasonsQuery__
 *
 * To run a query within a React component, call `useSeasonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useSeasonsQuery(baseOptions?: Apollo.QueryHookOptions<SeasonsQuery, SeasonsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonsQuery, SeasonsQueryVariables>(SeasonsDocument, options);
      }
export function useSeasonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonsQuery, SeasonsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonsQuery, SeasonsQueryVariables>(SeasonsDocument, options);
        }
export type SeasonsQueryHookResult = ReturnType<typeof useSeasonsQuery>;
export type SeasonsLazyQueryHookResult = ReturnType<typeof useSeasonsLazyQuery>;
export type SeasonsQueryResult = Apollo.QueryResult<SeasonsQuery, SeasonsQueryVariables>;
export const SeasonsMutatedDocument = gql`
    subscription SeasonsMutated {
  seasonMutated {
    id
    event
    season {
      ...SeasonExplorerProperties
    }
  }
}
    ${SeasonExplorerPropertiesFragmentDoc}`;

/**
 * __useSeasonsMutatedSubscription__
 *
 * To run a query within a React component, call `useSeasonsMutatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSeasonsMutatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonsMutatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSeasonsMutatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SeasonsMutatedSubscription, SeasonsMutatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SeasonsMutatedSubscription, SeasonsMutatedSubscriptionVariables>(SeasonsMutatedDocument, options);
      }
export type SeasonsMutatedSubscriptionHookResult = ReturnType<typeof useSeasonsMutatedSubscription>;
export type SeasonsMutatedSubscriptionResult = Apollo.SubscriptionResult<SeasonsMutatedSubscription>;
export const SeasonImagesDocument = gql`
    query SeasonImages($id: Int!) {
  season(id: $id) {
    seasonsImages {
      nodes {
        imageId
        imageType
      }
    }
  }
}
    `;

/**
 * __useSeasonImagesQuery__
 *
 * To run a query within a React component, call `useSeasonImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonImagesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSeasonImagesQuery(baseOptions: Apollo.QueryHookOptions<SeasonImagesQuery, SeasonImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonImagesQuery, SeasonImagesQueryVariables>(SeasonImagesDocument, options);
      }
export function useSeasonImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonImagesQuery, SeasonImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonImagesQuery, SeasonImagesQueryVariables>(SeasonImagesDocument, options);
        }
export type SeasonImagesQueryHookResult = ReturnType<typeof useSeasonImagesQuery>;
export type SeasonImagesLazyQueryHookResult = ReturnType<typeof useSeasonImagesLazyQuery>;
export type SeasonImagesQueryResult = Apollo.QueryResult<SeasonImagesQuery, SeasonImagesQueryVariables>;
export const SeasonsLicensesDocument = gql`
    query SeasonsLicenses($filter: SeasonsLicenseFilter, $orderBy: [SeasonsLicensesOrderBy!], $after: Cursor) {
  seasonsLicenses(filter: $filter, orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      seasonsLicensesCountries {
        nodes {
          code
        }
      }
      licenseEnd
      licenseStart
    }
  }
}
    `;

/**
 * __useSeasonsLicensesQuery__
 *
 * To run a query within a React component, call `useSeasonsLicensesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonsLicensesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonsLicensesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useSeasonsLicensesQuery(baseOptions?: Apollo.QueryHookOptions<SeasonsLicensesQuery, SeasonsLicensesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonsLicensesQuery, SeasonsLicensesQueryVariables>(SeasonsLicensesDocument, options);
      }
export function useSeasonsLicensesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonsLicensesQuery, SeasonsLicensesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonsLicensesQuery, SeasonsLicensesQueryVariables>(SeasonsLicensesDocument, options);
        }
export type SeasonsLicensesQueryHookResult = ReturnType<typeof useSeasonsLicensesQuery>;
export type SeasonsLicensesLazyQueryHookResult = ReturnType<typeof useSeasonsLicensesLazyQuery>;
export type SeasonsLicensesQueryResult = Apollo.QueryResult<SeasonsLicensesQuery, SeasonsLicensesQueryVariables>;
export const CreateSeasonsLicenseDocument = gql`
    mutation CreateSeasonsLicense($input: CreateSeasonsLicenseInput!) {
  createSeasonsLicense(input: $input) {
    seasonsLicense {
      id
    }
  }
}
    `;
export type CreateSeasonsLicenseMutationFn = Apollo.MutationFunction<CreateSeasonsLicenseMutation, CreateSeasonsLicenseMutationVariables>;

/**
 * __useCreateSeasonsLicenseMutation__
 *
 * To run a mutation, you first call `useCreateSeasonsLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSeasonsLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSeasonsLicenseMutation, { data, loading, error }] = useCreateSeasonsLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSeasonsLicenseMutation(baseOptions?: Apollo.MutationHookOptions<CreateSeasonsLicenseMutation, CreateSeasonsLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSeasonsLicenseMutation, CreateSeasonsLicenseMutationVariables>(CreateSeasonsLicenseDocument, options);
      }
export type CreateSeasonsLicenseMutationHookResult = ReturnType<typeof useCreateSeasonsLicenseMutation>;
export type CreateSeasonsLicenseMutationResult = Apollo.MutationResult<CreateSeasonsLicenseMutation>;
export type CreateSeasonsLicenseMutationOptions = Apollo.BaseMutationOptions<CreateSeasonsLicenseMutation, CreateSeasonsLicenseMutationVariables>;
export const SeasonsLicenseDocument = gql`
    query SeasonsLicense($id: Int!) {
  seasonsLicense(id: $id) {
    seasonsLicensesCountries {
      nodes {
        code
      }
    }
    licenseEnd
    licenseStart
    seasonId
  }
}
    `;

/**
 * __useSeasonsLicenseQuery__
 *
 * To run a query within a React component, call `useSeasonsLicenseQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonsLicenseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonsLicenseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSeasonsLicenseQuery(baseOptions: Apollo.QueryHookOptions<SeasonsLicenseQuery, SeasonsLicenseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonsLicenseQuery, SeasonsLicenseQueryVariables>(SeasonsLicenseDocument, options);
      }
export function useSeasonsLicenseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonsLicenseQuery, SeasonsLicenseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonsLicenseQuery, SeasonsLicenseQueryVariables>(SeasonsLicenseDocument, options);
        }
export type SeasonsLicenseQueryHookResult = ReturnType<typeof useSeasonsLicenseQuery>;
export type SeasonsLicenseLazyQueryHookResult = ReturnType<typeof useSeasonsLicenseLazyQuery>;
export type SeasonsLicenseQueryResult = Apollo.QueryResult<SeasonsLicenseQuery, SeasonsLicenseQueryVariables>;
export const UpdateSeasonsLicenseDocument = gql`
    mutation UpdateSeasonsLicense($input: UpdateSeasonsLicenseInput!) {
  updateSeasonsLicense(input: $input) {
    clientMutationId
  }
}
    `;
export type UpdateSeasonsLicenseMutationFn = Apollo.MutationFunction<UpdateSeasonsLicenseMutation, UpdateSeasonsLicenseMutationVariables>;

/**
 * __useUpdateSeasonsLicenseMutation__
 *
 * To run a mutation, you first call `useUpdateSeasonsLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSeasonsLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSeasonsLicenseMutation, { data, loading, error }] = useUpdateSeasonsLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSeasonsLicenseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSeasonsLicenseMutation, UpdateSeasonsLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSeasonsLicenseMutation, UpdateSeasonsLicenseMutationVariables>(UpdateSeasonsLicenseDocument, options);
      }
export type UpdateSeasonsLicenseMutationHookResult = ReturnType<typeof useUpdateSeasonsLicenseMutation>;
export type UpdateSeasonsLicenseMutationResult = Apollo.MutationResult<UpdateSeasonsLicenseMutation>;
export type UpdateSeasonsLicenseMutationOptions = Apollo.BaseMutationOptions<UpdateSeasonsLicenseMutation, UpdateSeasonsLicenseMutationVariables>;
export const DeleteSeasonsLicenseDocument = gql`
    mutation DeleteSeasonsLicense($input: DeleteSeasonsLicenseInput!) {
  deleteSeasonsLicense(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteSeasonsLicenseMutationFn = Apollo.MutationFunction<DeleteSeasonsLicenseMutation, DeleteSeasonsLicenseMutationVariables>;

/**
 * __useDeleteSeasonsLicenseMutation__
 *
 * To run a mutation, you first call `useDeleteSeasonsLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSeasonsLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSeasonsLicenseMutation, { data, loading, error }] = useDeleteSeasonsLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteSeasonsLicenseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSeasonsLicenseMutation, DeleteSeasonsLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSeasonsLicenseMutation, DeleteSeasonsLicenseMutationVariables>(DeleteSeasonsLicenseDocument, options);
      }
export type DeleteSeasonsLicenseMutationHookResult = ReturnType<typeof useDeleteSeasonsLicenseMutation>;
export type DeleteSeasonsLicenseMutationResult = Apollo.MutationResult<DeleteSeasonsLicenseMutation>;
export type DeleteSeasonsLicenseMutationOptions = Apollo.BaseMutationOptions<DeleteSeasonsLicenseMutation, DeleteSeasonsLicenseMutationVariables>;
export const CreateSeasonSnapshotDocument = gql`
    mutation CreateSeasonSnapshot($seasonId: Int!) {
  createSeasonSnapshot(seasonId: $seasonId) {
    id
  }
}
    `;
export type CreateSeasonSnapshotMutationFn = Apollo.MutationFunction<CreateSeasonSnapshotMutation, CreateSeasonSnapshotMutationVariables>;

/**
 * __useCreateSeasonSnapshotMutation__
 *
 * To run a mutation, you first call `useCreateSeasonSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSeasonSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSeasonSnapshotMutation, { data, loading, error }] = useCreateSeasonSnapshotMutation({
 *   variables: {
 *      seasonId: // value for 'seasonId'
 *   },
 * });
 */
export function useCreateSeasonSnapshotMutation(baseOptions?: Apollo.MutationHookOptions<CreateSeasonSnapshotMutation, CreateSeasonSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSeasonSnapshotMutation, CreateSeasonSnapshotMutationVariables>(CreateSeasonSnapshotDocument, options);
      }
export type CreateSeasonSnapshotMutationHookResult = ReturnType<typeof useCreateSeasonSnapshotMutation>;
export type CreateSeasonSnapshotMutationResult = Apollo.MutationResult<CreateSeasonSnapshotMutation>;
export type CreateSeasonSnapshotMutationOptions = Apollo.BaseMutationOptions<CreateSeasonSnapshotMutation, CreateSeasonSnapshotMutationVariables>;
export const SeasonVideosDocument = gql`
    query SeasonVideos($id: Int!) {
  season(id: $id) {
    seasonsTrailers {
      nodes {
        videoId
      }
    }
  }
}
    `;

/**
 * __useSeasonVideosQuery__
 *
 * To run a query within a React component, call `useSeasonVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useSeasonVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSeasonVideosQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSeasonVideosQuery(baseOptions: Apollo.QueryHookOptions<SeasonVideosQuery, SeasonVideosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SeasonVideosQuery, SeasonVideosQueryVariables>(SeasonVideosDocument, options);
      }
export function useSeasonVideosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SeasonVideosQuery, SeasonVideosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SeasonVideosQuery, SeasonVideosQueryVariables>(SeasonVideosDocument, options);
        }
export type SeasonVideosQueryHookResult = ReturnType<typeof useSeasonVideosQuery>;
export type SeasonVideosLazyQueryHookResult = ReturnType<typeof useSeasonVideosLazyQuery>;
export type SeasonVideosQueryResult = Apollo.QueryResult<SeasonVideosQuery, SeasonVideosQueryVariables>;
export const BulkDeleteSeasonsDocument = gql`
    mutation BulkDeleteSeasons($filter: SeasonFilter) {
  deleteSeasons(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkDeleteSeasonsMutationFn = Apollo.MutationFunction<BulkDeleteSeasonsMutation, BulkDeleteSeasonsMutationVariables>;

/**
 * __useBulkDeleteSeasonsMutation__
 *
 * To run a mutation, you first call `useBulkDeleteSeasonsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteSeasonsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteSeasonsMutation, { data, loading, error }] = useBulkDeleteSeasonsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkDeleteSeasonsMutation(baseOptions?: Apollo.MutationHookOptions<BulkDeleteSeasonsMutation, BulkDeleteSeasonsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkDeleteSeasonsMutation, BulkDeleteSeasonsMutationVariables>(BulkDeleteSeasonsDocument, options);
      }
export type BulkDeleteSeasonsMutationHookResult = ReturnType<typeof useBulkDeleteSeasonsMutation>;
export type BulkDeleteSeasonsMutationResult = Apollo.MutationResult<BulkDeleteSeasonsMutation>;
export type BulkDeleteSeasonsMutationOptions = Apollo.BaseMutationOptions<BulkDeleteSeasonsMutation, BulkDeleteSeasonsMutationVariables>;
export const BulkPublishSeasonsDocument = gql`
    mutation BulkPublishSeasons($filter: SeasonFilter) {
  publishSeasons(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkPublishSeasonsMutationFn = Apollo.MutationFunction<BulkPublishSeasonsMutation, BulkPublishSeasonsMutationVariables>;

/**
 * __useBulkPublishSeasonsMutation__
 *
 * To run a mutation, you first call `useBulkPublishSeasonsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkPublishSeasonsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkPublishSeasonsMutation, { data, loading, error }] = useBulkPublishSeasonsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkPublishSeasonsMutation(baseOptions?: Apollo.MutationHookOptions<BulkPublishSeasonsMutation, BulkPublishSeasonsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkPublishSeasonsMutation, BulkPublishSeasonsMutationVariables>(BulkPublishSeasonsDocument, options);
      }
export type BulkPublishSeasonsMutationHookResult = ReturnType<typeof useBulkPublishSeasonsMutation>;
export type BulkPublishSeasonsMutationResult = Apollo.MutationResult<BulkPublishSeasonsMutation>;
export type BulkPublishSeasonsMutationOptions = Apollo.BaseMutationOptions<BulkPublishSeasonsMutation, BulkPublishSeasonsMutationVariables>;
export const BulkUnpublishSeasonsDocument = gql`
    mutation BulkUnpublishSeasons($filter: SeasonFilter) {
  unpublishSeasons(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkUnpublishSeasonsMutationFn = Apollo.MutationFunction<BulkUnpublishSeasonsMutation, BulkUnpublishSeasonsMutationVariables>;

/**
 * __useBulkUnpublishSeasonsMutation__
 *
 * To run a mutation, you first call `useBulkUnpublishSeasonsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkUnpublishSeasonsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkUnpublishSeasonsMutation, { data, loading, error }] = useBulkUnpublishSeasonsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkUnpublishSeasonsMutation(baseOptions?: Apollo.MutationHookOptions<BulkUnpublishSeasonsMutation, BulkUnpublishSeasonsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkUnpublishSeasonsMutation, BulkUnpublishSeasonsMutationVariables>(BulkUnpublishSeasonsDocument, options);
      }
export type BulkUnpublishSeasonsMutationHookResult = ReturnType<typeof useBulkUnpublishSeasonsMutation>;
export type BulkUnpublishSeasonsMutationResult = Apollo.MutationResult<BulkUnpublishSeasonsMutation>;
export type BulkUnpublishSeasonsMutationOptions = Apollo.BaseMutationOptions<BulkUnpublishSeasonsMutation, BulkUnpublishSeasonsMutationVariables>;
export const BulkCreateSeasonSnapshotsDocument = gql`
    mutation BulkCreateSeasonSnapshots($filter: SeasonFilter) {
  createSeasonSnapshots(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkCreateSeasonSnapshotsMutationFn = Apollo.MutationFunction<BulkCreateSeasonSnapshotsMutation, BulkCreateSeasonSnapshotsMutationVariables>;

/**
 * __useBulkCreateSeasonSnapshotsMutation__
 *
 * To run a mutation, you first call `useBulkCreateSeasonSnapshotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkCreateSeasonSnapshotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkCreateSeasonSnapshotsMutation, { data, loading, error }] = useBulkCreateSeasonSnapshotsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkCreateSeasonSnapshotsMutation(baseOptions?: Apollo.MutationHookOptions<BulkCreateSeasonSnapshotsMutation, BulkCreateSeasonSnapshotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkCreateSeasonSnapshotsMutation, BulkCreateSeasonSnapshotsMutationVariables>(BulkCreateSeasonSnapshotsDocument, options);
      }
export type BulkCreateSeasonSnapshotsMutationHookResult = ReturnType<typeof useBulkCreateSeasonSnapshotsMutation>;
export type BulkCreateSeasonSnapshotsMutationResult = Apollo.MutationResult<BulkCreateSeasonSnapshotsMutation>;
export type BulkCreateSeasonSnapshotsMutationOptions = Apollo.BaseMutationOptions<BulkCreateSeasonSnapshotsMutation, BulkCreateSeasonSnapshotsMutationVariables>;
export const CreateTvShowDocument = gql`
    mutation CreateTvShow($input: CreateTvshowInput!) {
  createTvshow(input: $input) {
    tvshow {
      id
      title
    }
  }
}
    `;
export type CreateTvShowMutationFn = Apollo.MutationFunction<CreateTvShowMutation, CreateTvShowMutationVariables>;

/**
 * __useCreateTvShowMutation__
 *
 * To run a mutation, you first call `useCreateTvShowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTvShowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTvShowMutation, { data, loading, error }] = useCreateTvShowMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTvShowMutation(baseOptions?: Apollo.MutationHookOptions<CreateTvShowMutation, CreateTvShowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTvShowMutation, CreateTvShowMutationVariables>(CreateTvShowDocument, options);
      }
export type CreateTvShowMutationHookResult = ReturnType<typeof useCreateTvShowMutation>;
export type CreateTvShowMutationResult = Apollo.MutationResult<CreateTvShowMutation>;
export type CreateTvShowMutationOptions = Apollo.BaseMutationOptions<CreateTvShowMutation, CreateTvShowMutationVariables>;
export const TvShowDocument = gql`
    query TvShow($id: Int!) {
  tvshow(id: $id) {
    title
    originalTitle
    synopsis
    description
    externalId
    tvshowsTags {
      nodes {
        name
      }
    }
    tvshowsTvshowGenres {
      nodes {
        tvshowGenres {
          title
        }
      }
    }
    tvshowsCasts {
      nodes {
        name
      }
    }
    studio
    tvshowsProductionCountries {
      nodes {
        name
      }
    }
    released
    id
    createdDate
    createdUser
    updatedDate
    updatedUser
    seasons {
      totalCount
    }
    tvshowsImages {
      nodes {
        imageType
        imageId
      }
    }
    publishStatus
    publishedDate
    publishedUser
    tvshowsTrailers {
      totalCount
    }
  }
  tvshowGenres {
    nodes {
      title
      id
    }
  }
}
    `;

/**
 * __useTvShowQuery__
 *
 * To run a query within a React component, call `useTvShowQuery` and pass it any options that fit your needs.
 * When your component renders, `useTvShowQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTvShowQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTvShowQuery(baseOptions: Apollo.QueryHookOptions<TvShowQuery, TvShowQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TvShowQuery, TvShowQueryVariables>(TvShowDocument, options);
      }
export function useTvShowLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TvShowQuery, TvShowQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TvShowQuery, TvShowQueryVariables>(TvShowDocument, options);
        }
export type TvShowQueryHookResult = ReturnType<typeof useTvShowQuery>;
export type TvShowLazyQueryHookResult = ReturnType<typeof useTvShowLazyQuery>;
export type TvShowQueryResult = Apollo.QueryResult<TvShowQuery, TvShowQueryVariables>;
export const DeleteTvShowDocument = gql`
    mutation DeleteTvShow($input: DeleteTvshowInput!) {
  deleteTvshow(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteTvShowMutationFn = Apollo.MutationFunction<DeleteTvShowMutation, DeleteTvShowMutationVariables>;

/**
 * __useDeleteTvShowMutation__
 *
 * To run a mutation, you first call `useDeleteTvShowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTvShowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTvShowMutation, { data, loading, error }] = useDeleteTvShowMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteTvShowMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTvShowMutation, DeleteTvShowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTvShowMutation, DeleteTvShowMutationVariables>(DeleteTvShowDocument, options);
      }
export type DeleteTvShowMutationHookResult = ReturnType<typeof useDeleteTvShowMutation>;
export type DeleteTvShowMutationResult = Apollo.MutationResult<DeleteTvShowMutation>;
export type DeleteTvShowMutationOptions = Apollo.BaseMutationOptions<DeleteTvShowMutation, DeleteTvShowMutationVariables>;
export const PublishTvShowDocument = gql`
    mutation PublishTvShow($id: Int!) {
  publishTvshow(tvshowId: $id) {
    id
  }
}
    `;
export type PublishTvShowMutationFn = Apollo.MutationFunction<PublishTvShowMutation, PublishTvShowMutationVariables>;

/**
 * __usePublishTvShowMutation__
 *
 * To run a mutation, you first call `usePublishTvShowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishTvShowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishTvShowMutation, { data, loading, error }] = usePublishTvShowMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePublishTvShowMutation(baseOptions?: Apollo.MutationHookOptions<PublishTvShowMutation, PublishTvShowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishTvShowMutation, PublishTvShowMutationVariables>(PublishTvShowDocument, options);
      }
export type PublishTvShowMutationHookResult = ReturnType<typeof usePublishTvShowMutation>;
export type PublishTvShowMutationResult = Apollo.MutationResult<PublishTvShowMutation>;
export type PublishTvShowMutationOptions = Apollo.BaseMutationOptions<PublishTvShowMutation, PublishTvShowMutationVariables>;
export const UnpublishTvShowDocument = gql`
    mutation UnpublishTvShow($id: Int!) {
  unpublishTvshow(tvshowId: $id) {
    id
  }
}
    `;
export type UnpublishTvShowMutationFn = Apollo.MutationFunction<UnpublishTvShowMutation, UnpublishTvShowMutationVariables>;

/**
 * __useUnpublishTvShowMutation__
 *
 * To run a mutation, you first call `useUnpublishTvShowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishTvShowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishTvShowMutation, { data, loading, error }] = useUnpublishTvShowMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnpublishTvShowMutation(baseOptions?: Apollo.MutationHookOptions<UnpublishTvShowMutation, UnpublishTvShowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpublishTvShowMutation, UnpublishTvShowMutationVariables>(UnpublishTvShowDocument, options);
      }
export type UnpublishTvShowMutationHookResult = ReturnType<typeof useUnpublishTvShowMutation>;
export type UnpublishTvShowMutationResult = Apollo.MutationResult<UnpublishTvShowMutation>;
export type UnpublishTvShowMutationOptions = Apollo.BaseMutationOptions<UnpublishTvShowMutation, UnpublishTvShowMutationVariables>;
export const TvShowTitleDocument = gql`
    query TvShowTitle($id: Int!) {
  tvshow(id: $id) {
    id
    title
  }
}
    `;

/**
 * __useTvShowTitleQuery__
 *
 * To run a query within a React component, call `useTvShowTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useTvShowTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTvShowTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTvShowTitleQuery(baseOptions: Apollo.QueryHookOptions<TvShowTitleQuery, TvShowTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TvShowTitleQuery, TvShowTitleQueryVariables>(TvShowTitleDocument, options);
      }
export function useTvShowTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TvShowTitleQuery, TvShowTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TvShowTitleQuery, TvShowTitleQueryVariables>(TvShowTitleDocument, options);
        }
export type TvShowTitleQueryHookResult = ReturnType<typeof useTvShowTitleQuery>;
export type TvShowTitleLazyQueryHookResult = ReturnType<typeof useTvShowTitleLazyQuery>;
export type TvShowTitleQueryResult = Apollo.QueryResult<TvShowTitleQuery, TvShowTitleQueryVariables>;
export const SearchTvShowTagsDocument = gql`
    query SearchTvShowTags($searchKey: String!, $limit: Int!) {
  getTvshowsTagsValues(filter: {startsWithInsensitive: $searchKey}, first: $limit) {
    nodes
  }
}
    `;

/**
 * __useSearchTvShowTagsQuery__
 *
 * To run a query within a React component, call `useSearchTvShowTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTvShowTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTvShowTagsQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchTvShowTagsQuery(baseOptions: Apollo.QueryHookOptions<SearchTvShowTagsQuery, SearchTvShowTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchTvShowTagsQuery, SearchTvShowTagsQueryVariables>(SearchTvShowTagsDocument, options);
      }
export function useSearchTvShowTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchTvShowTagsQuery, SearchTvShowTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchTvShowTagsQuery, SearchTvShowTagsQueryVariables>(SearchTvShowTagsDocument, options);
        }
export type SearchTvShowTagsQueryHookResult = ReturnType<typeof useSearchTvShowTagsQuery>;
export type SearchTvShowTagsLazyQueryHookResult = ReturnType<typeof useSearchTvShowTagsLazyQuery>;
export type SearchTvShowTagsQueryResult = Apollo.QueryResult<SearchTvShowTagsQuery, SearchTvShowTagsQueryVariables>;
export const SearchTvShowCastDocument = gql`
    query SearchTvShowCast($searchKey: String!, $limit: Int!) {
  getTvshowsCastsValues(
    filter: {startsWithInsensitive: $searchKey}
    first: $limit
  ) {
    nodes
  }
}
    `;

/**
 * __useSearchTvShowCastQuery__
 *
 * To run a query within a React component, call `useSearchTvShowCastQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTvShowCastQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTvShowCastQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchTvShowCastQuery(baseOptions: Apollo.QueryHookOptions<SearchTvShowCastQuery, SearchTvShowCastQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchTvShowCastQuery, SearchTvShowCastQueryVariables>(SearchTvShowCastDocument, options);
      }
export function useSearchTvShowCastLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchTvShowCastQuery, SearchTvShowCastQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchTvShowCastQuery, SearchTvShowCastQueryVariables>(SearchTvShowCastDocument, options);
        }
export type SearchTvShowCastQueryHookResult = ReturnType<typeof useSearchTvShowCastQuery>;
export type SearchTvShowCastLazyQueryHookResult = ReturnType<typeof useSearchTvShowCastLazyQuery>;
export type SearchTvShowCastQueryResult = Apollo.QueryResult<SearchTvShowCastQuery, SearchTvShowCastQueryVariables>;
export const SearchTvShowProductionCountriesDocument = gql`
    query SearchTvShowProductionCountries($searchKey: String!, $limit: Int!) {
  getTvshowsProductionCountriesValues(
    filter: {startsWithInsensitive: $searchKey}
    first: $limit
  ) {
    nodes
  }
}
    `;

/**
 * __useSearchTvShowProductionCountriesQuery__
 *
 * To run a query within a React component, call `useSearchTvShowProductionCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTvShowProductionCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTvShowProductionCountriesQuery({
 *   variables: {
 *      searchKey: // value for 'searchKey'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchTvShowProductionCountriesQuery(baseOptions: Apollo.QueryHookOptions<SearchTvShowProductionCountriesQuery, SearchTvShowProductionCountriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchTvShowProductionCountriesQuery, SearchTvShowProductionCountriesQueryVariables>(SearchTvShowProductionCountriesDocument, options);
      }
export function useSearchTvShowProductionCountriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchTvShowProductionCountriesQuery, SearchTvShowProductionCountriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchTvShowProductionCountriesQuery, SearchTvShowProductionCountriesQueryVariables>(SearchTvShowProductionCountriesDocument, options);
        }
export type SearchTvShowProductionCountriesQueryHookResult = ReturnType<typeof useSearchTvShowProductionCountriesQuery>;
export type SearchTvShowProductionCountriesLazyQueryHookResult = ReturnType<typeof useSearchTvShowProductionCountriesLazyQuery>;
export type SearchTvShowProductionCountriesQueryResult = Apollo.QueryResult<SearchTvShowProductionCountriesQuery, SearchTvShowProductionCountriesQueryVariables>;
export const TvShowsDocument = gql`
    query TVShows($filter: TvshowFilter, $orderBy: [TvshowsOrderBy!], $after: Cursor) {
  filtered: tvshows(filter: $filter, orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ...TVShowExplorerProperties
    }
  }
  nonFiltered: tvshows {
    totalCount
  }
}
    ${TvShowExplorerPropertiesFragmentDoc}`;

/**
 * __useTvShowsQuery__
 *
 * To run a query within a React component, call `useTvShowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTvShowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTvShowsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useTvShowsQuery(baseOptions?: Apollo.QueryHookOptions<TvShowsQuery, TvShowsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TvShowsQuery, TvShowsQueryVariables>(TvShowsDocument, options);
      }
export function useTvShowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TvShowsQuery, TvShowsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TvShowsQuery, TvShowsQueryVariables>(TvShowsDocument, options);
        }
export type TvShowsQueryHookResult = ReturnType<typeof useTvShowsQuery>;
export type TvShowsLazyQueryHookResult = ReturnType<typeof useTvShowsLazyQuery>;
export type TvShowsQueryResult = Apollo.QueryResult<TvShowsQuery, TvShowsQueryVariables>;
export const TvShowsMutatedDocument = gql`
    subscription TVShowsMutated {
  tvshowMutated {
    id
    event
    tvshow {
      ...TVShowExplorerProperties
    }
  }
}
    ${TvShowExplorerPropertiesFragmentDoc}`;

/**
 * __useTvShowsMutatedSubscription__
 *
 * To run a query within a React component, call `useTvShowsMutatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTvShowsMutatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTvShowsMutatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTvShowsMutatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TvShowsMutatedSubscription, TvShowsMutatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TvShowsMutatedSubscription, TvShowsMutatedSubscriptionVariables>(TvShowsMutatedDocument, options);
      }
export type TvShowsMutatedSubscriptionHookResult = ReturnType<typeof useTvShowsMutatedSubscription>;
export type TvShowsMutatedSubscriptionResult = Apollo.SubscriptionResult<TvShowsMutatedSubscription>;
export const TvShowGenresDocument = gql`
    query TvShowGenres {
  tvshowGenres(orderBy: UPDATED_DATE_DESC) {
    nodes {
      sortOrder
      title
      id
      updatedDate
      updatedUser
    }
    totalCount
  }
  snapshots(
    filter: {entityType: {equalTo: TVSHOW_GENRE}, snapshotState: {equalTo: PUBLISHED}}
  ) {
    nodes {
      updatedUser
      publishedDate
      snapshotState
    }
  }
}
    `;

/**
 * __useTvShowGenresQuery__
 *
 * To run a query within a React component, call `useTvShowGenresQuery` and pass it any options that fit your needs.
 * When your component renders, `useTvShowGenresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTvShowGenresQuery({
 *   variables: {
 *   },
 * });
 */
export function useTvShowGenresQuery(baseOptions?: Apollo.QueryHookOptions<TvShowGenresQuery, TvShowGenresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TvShowGenresQuery, TvShowGenresQueryVariables>(TvShowGenresDocument, options);
      }
export function useTvShowGenresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TvShowGenresQuery, TvShowGenresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TvShowGenresQuery, TvShowGenresQueryVariables>(TvShowGenresDocument, options);
        }
export type TvShowGenresQueryHookResult = ReturnType<typeof useTvShowGenresQuery>;
export type TvShowGenresLazyQueryHookResult = ReturnType<typeof useTvShowGenresLazyQuery>;
export type TvShowGenresQueryResult = Apollo.QueryResult<TvShowGenresQuery, TvShowGenresQueryVariables>;
export const PublishTvShowGenresDocument = gql`
    mutation PublishTvShowGenres {
  publishTvshowGenres {
    id
  }
}
    `;
export type PublishTvShowGenresMutationFn = Apollo.MutationFunction<PublishTvShowGenresMutation, PublishTvShowGenresMutationVariables>;

/**
 * __usePublishTvShowGenresMutation__
 *
 * To run a mutation, you first call `usePublishTvShowGenresMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishTvShowGenresMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishTvShowGenresMutation, { data, loading, error }] = usePublishTvShowGenresMutation({
 *   variables: {
 *   },
 * });
 */
export function usePublishTvShowGenresMutation(baseOptions?: Apollo.MutationHookOptions<PublishTvShowGenresMutation, PublishTvShowGenresMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishTvShowGenresMutation, PublishTvShowGenresMutationVariables>(PublishTvShowGenresDocument, options);
      }
export type PublishTvShowGenresMutationHookResult = ReturnType<typeof usePublishTvShowGenresMutation>;
export type PublishTvShowGenresMutationResult = Apollo.MutationResult<PublishTvShowGenresMutation>;
export type PublishTvShowGenresMutationOptions = Apollo.BaseMutationOptions<PublishTvShowGenresMutation, PublishTvShowGenresMutationVariables>;
export const UnpublishTvShowGenresDocument = gql`
    mutation UnpublishTvShowGenres {
  unpublishTvshowGenres {
    id
  }
}
    `;
export type UnpublishTvShowGenresMutationFn = Apollo.MutationFunction<UnpublishTvShowGenresMutation, UnpublishTvShowGenresMutationVariables>;

/**
 * __useUnpublishTvShowGenresMutation__
 *
 * To run a mutation, you first call `useUnpublishTvShowGenresMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpublishTvShowGenresMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpublishTvShowGenresMutation, { data, loading, error }] = useUnpublishTvShowGenresMutation({
 *   variables: {
 *   },
 * });
 */
export function useUnpublishTvShowGenresMutation(baseOptions?: Apollo.MutationHookOptions<UnpublishTvShowGenresMutation, UnpublishTvShowGenresMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpublishTvShowGenresMutation, UnpublishTvShowGenresMutationVariables>(UnpublishTvShowGenresDocument, options);
      }
export type UnpublishTvShowGenresMutationHookResult = ReturnType<typeof useUnpublishTvShowGenresMutation>;
export type UnpublishTvShowGenresMutationResult = Apollo.MutationResult<UnpublishTvShowGenresMutation>;
export type UnpublishTvShowGenresMutationOptions = Apollo.BaseMutationOptions<UnpublishTvShowGenresMutation, UnpublishTvShowGenresMutationVariables>;
export const CreateTvShowGenresDocument = gql`
    mutation CreateTvShowGenres {
  createTvshowGenresSnapshot {
    id
  }
}
    `;
export type CreateTvShowGenresMutationFn = Apollo.MutationFunction<CreateTvShowGenresMutation, CreateTvShowGenresMutationVariables>;

/**
 * __useCreateTvShowGenresMutation__
 *
 * To run a mutation, you first call `useCreateTvShowGenresMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTvShowGenresMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTvShowGenresMutation, { data, loading, error }] = useCreateTvShowGenresMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateTvShowGenresMutation(baseOptions?: Apollo.MutationHookOptions<CreateTvShowGenresMutation, CreateTvShowGenresMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTvShowGenresMutation, CreateTvShowGenresMutationVariables>(CreateTvShowGenresDocument, options);
      }
export type CreateTvShowGenresMutationHookResult = ReturnType<typeof useCreateTvShowGenresMutation>;
export type CreateTvShowGenresMutationResult = Apollo.MutationResult<CreateTvShowGenresMutation>;
export type CreateTvShowGenresMutationOptions = Apollo.BaseMutationOptions<CreateTvShowGenresMutation, CreateTvShowGenresMutationVariables>;
export const TvshowImagesDocument = gql`
    query TvshowImages($id: Int!) {
  tvshow(id: $id) {
    tvshowsImages {
      nodes {
        imageId
        imageType
      }
    }
  }
}
    `;

/**
 * __useTvshowImagesQuery__
 *
 * To run a query within a React component, call `useTvshowImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTvshowImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTvshowImagesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTvshowImagesQuery(baseOptions: Apollo.QueryHookOptions<TvshowImagesQuery, TvshowImagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TvshowImagesQuery, TvshowImagesQueryVariables>(TvshowImagesDocument, options);
      }
export function useTvshowImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TvshowImagesQuery, TvshowImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TvshowImagesQuery, TvshowImagesQueryVariables>(TvshowImagesDocument, options);
        }
export type TvshowImagesQueryHookResult = ReturnType<typeof useTvshowImagesQuery>;
export type TvshowImagesLazyQueryHookResult = ReturnType<typeof useTvshowImagesLazyQuery>;
export type TvshowImagesQueryResult = Apollo.QueryResult<TvshowImagesQuery, TvshowImagesQueryVariables>;
export const TvshowsLicensesDocument = gql`
    query TvshowsLicenses($filter: TvshowsLicenseFilter, $orderBy: [TvshowsLicensesOrderBy!], $after: Cursor) {
  tvshowsLicenses(filter: $filter, orderBy: $orderBy, first: 30, after: $after) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      tvshowsLicensesCountries {
        nodes {
          code
        }
      }
      licenseEnd
      licenseStart
    }
  }
}
    `;

/**
 * __useTvshowsLicensesQuery__
 *
 * To run a query within a React component, call `useTvshowsLicensesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTvshowsLicensesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTvshowsLicensesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useTvshowsLicensesQuery(baseOptions?: Apollo.QueryHookOptions<TvshowsLicensesQuery, TvshowsLicensesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TvshowsLicensesQuery, TvshowsLicensesQueryVariables>(TvshowsLicensesDocument, options);
      }
export function useTvshowsLicensesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TvshowsLicensesQuery, TvshowsLicensesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TvshowsLicensesQuery, TvshowsLicensesQueryVariables>(TvshowsLicensesDocument, options);
        }
export type TvshowsLicensesQueryHookResult = ReturnType<typeof useTvshowsLicensesQuery>;
export type TvshowsLicensesLazyQueryHookResult = ReturnType<typeof useTvshowsLicensesLazyQuery>;
export type TvshowsLicensesQueryResult = Apollo.QueryResult<TvshowsLicensesQuery, TvshowsLicensesQueryVariables>;
export const CreateTvshowsLicenseDocument = gql`
    mutation CreateTvshowsLicense($input: CreateTvshowsLicenseInput!) {
  createTvshowsLicense(input: $input) {
    tvshowsLicense {
      id
    }
  }
}
    `;
export type CreateTvshowsLicenseMutationFn = Apollo.MutationFunction<CreateTvshowsLicenseMutation, CreateTvshowsLicenseMutationVariables>;

/**
 * __useCreateTvshowsLicenseMutation__
 *
 * To run a mutation, you first call `useCreateTvshowsLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTvshowsLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTvshowsLicenseMutation, { data, loading, error }] = useCreateTvshowsLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTvshowsLicenseMutation(baseOptions?: Apollo.MutationHookOptions<CreateTvshowsLicenseMutation, CreateTvshowsLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTvshowsLicenseMutation, CreateTvshowsLicenseMutationVariables>(CreateTvshowsLicenseDocument, options);
      }
export type CreateTvshowsLicenseMutationHookResult = ReturnType<typeof useCreateTvshowsLicenseMutation>;
export type CreateTvshowsLicenseMutationResult = Apollo.MutationResult<CreateTvshowsLicenseMutation>;
export type CreateTvshowsLicenseMutationOptions = Apollo.BaseMutationOptions<CreateTvshowsLicenseMutation, CreateTvshowsLicenseMutationVariables>;
export const TvshowsLicenseDocument = gql`
    query TvshowsLicense($id: Int!) {
  tvshowsLicense(id: $id) {
    tvshowsLicensesCountries {
      nodes {
        code
      }
    }
    licenseEnd
    licenseStart
    tvshowId
  }
}
    `;

/**
 * __useTvshowsLicenseQuery__
 *
 * To run a query within a React component, call `useTvshowsLicenseQuery` and pass it any options that fit your needs.
 * When your component renders, `useTvshowsLicenseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTvshowsLicenseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTvshowsLicenseQuery(baseOptions: Apollo.QueryHookOptions<TvshowsLicenseQuery, TvshowsLicenseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TvshowsLicenseQuery, TvshowsLicenseQueryVariables>(TvshowsLicenseDocument, options);
      }
export function useTvshowsLicenseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TvshowsLicenseQuery, TvshowsLicenseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TvshowsLicenseQuery, TvshowsLicenseQueryVariables>(TvshowsLicenseDocument, options);
        }
export type TvshowsLicenseQueryHookResult = ReturnType<typeof useTvshowsLicenseQuery>;
export type TvshowsLicenseLazyQueryHookResult = ReturnType<typeof useTvshowsLicenseLazyQuery>;
export type TvshowsLicenseQueryResult = Apollo.QueryResult<TvshowsLicenseQuery, TvshowsLicenseQueryVariables>;
export const UpdateTvshowsLicenseDocument = gql`
    mutation UpdateTvshowsLicense($input: UpdateTvshowsLicenseInput!) {
  updateTvshowsLicense(input: $input) {
    clientMutationId
  }
}
    `;
export type UpdateTvshowsLicenseMutationFn = Apollo.MutationFunction<UpdateTvshowsLicenseMutation, UpdateTvshowsLicenseMutationVariables>;

/**
 * __useUpdateTvshowsLicenseMutation__
 *
 * To run a mutation, you first call `useUpdateTvshowsLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTvshowsLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTvshowsLicenseMutation, { data, loading, error }] = useUpdateTvshowsLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTvshowsLicenseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTvshowsLicenseMutation, UpdateTvshowsLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTvshowsLicenseMutation, UpdateTvshowsLicenseMutationVariables>(UpdateTvshowsLicenseDocument, options);
      }
export type UpdateTvshowsLicenseMutationHookResult = ReturnType<typeof useUpdateTvshowsLicenseMutation>;
export type UpdateTvshowsLicenseMutationResult = Apollo.MutationResult<UpdateTvshowsLicenseMutation>;
export type UpdateTvshowsLicenseMutationOptions = Apollo.BaseMutationOptions<UpdateTvshowsLicenseMutation, UpdateTvshowsLicenseMutationVariables>;
export const DeleteTvshowsLicenseDocument = gql`
    mutation DeleteTvshowsLicense($input: DeleteTvshowsLicenseInput!) {
  deleteTvshowsLicense(input: $input) {
    clientMutationId
  }
}
    `;
export type DeleteTvshowsLicenseMutationFn = Apollo.MutationFunction<DeleteTvshowsLicenseMutation, DeleteTvshowsLicenseMutationVariables>;

/**
 * __useDeleteTvshowsLicenseMutation__
 *
 * To run a mutation, you first call `useDeleteTvshowsLicenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTvshowsLicenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTvshowsLicenseMutation, { data, loading, error }] = useDeleteTvshowsLicenseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteTvshowsLicenseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTvshowsLicenseMutation, DeleteTvshowsLicenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTvshowsLicenseMutation, DeleteTvshowsLicenseMutationVariables>(DeleteTvshowsLicenseDocument, options);
      }
export type DeleteTvshowsLicenseMutationHookResult = ReturnType<typeof useDeleteTvshowsLicenseMutation>;
export type DeleteTvshowsLicenseMutationResult = Apollo.MutationResult<DeleteTvshowsLicenseMutation>;
export type DeleteTvshowsLicenseMutationOptions = Apollo.BaseMutationOptions<DeleteTvshowsLicenseMutation, DeleteTvshowsLicenseMutationVariables>;
export const TvShowSeasonsDocument = gql`
    query TvShowSeasons($id: Int!) {
  tvshow(id: $id) {
    seasons {
      nodes {
        id
        index
        externalId
      }
    }
  }
}
    `;

/**
 * __useTvShowSeasonsQuery__
 *
 * To run a query within a React component, call `useTvShowSeasonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTvShowSeasonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTvShowSeasonsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTvShowSeasonsQuery(baseOptions: Apollo.QueryHookOptions<TvShowSeasonsQuery, TvShowSeasonsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TvShowSeasonsQuery, TvShowSeasonsQueryVariables>(TvShowSeasonsDocument, options);
      }
export function useTvShowSeasonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TvShowSeasonsQuery, TvShowSeasonsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TvShowSeasonsQuery, TvShowSeasonsQueryVariables>(TvShowSeasonsDocument, options);
        }
export type TvShowSeasonsQueryHookResult = ReturnType<typeof useTvShowSeasonsQuery>;
export type TvShowSeasonsLazyQueryHookResult = ReturnType<typeof useTvShowSeasonsLazyQuery>;
export type TvShowSeasonsQueryResult = Apollo.QueryResult<TvShowSeasonsQuery, TvShowSeasonsQueryVariables>;
export const CreateTvShowSnapshotDocument = gql`
    mutation CreateTvShowSnapshot($tvshowId: Int!) {
  createTvshowSnapshot(tvshowId: $tvshowId) {
    id
  }
}
    `;
export type CreateTvShowSnapshotMutationFn = Apollo.MutationFunction<CreateTvShowSnapshotMutation, CreateTvShowSnapshotMutationVariables>;

/**
 * __useCreateTvShowSnapshotMutation__
 *
 * To run a mutation, you first call `useCreateTvShowSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTvShowSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTvShowSnapshotMutation, { data, loading, error }] = useCreateTvShowSnapshotMutation({
 *   variables: {
 *      tvshowId: // value for 'tvshowId'
 *   },
 * });
 */
export function useCreateTvShowSnapshotMutation(baseOptions?: Apollo.MutationHookOptions<CreateTvShowSnapshotMutation, CreateTvShowSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTvShowSnapshotMutation, CreateTvShowSnapshotMutationVariables>(CreateTvShowSnapshotDocument, options);
      }
export type CreateTvShowSnapshotMutationHookResult = ReturnType<typeof useCreateTvShowSnapshotMutation>;
export type CreateTvShowSnapshotMutationResult = Apollo.MutationResult<CreateTvShowSnapshotMutation>;
export type CreateTvShowSnapshotMutationOptions = Apollo.BaseMutationOptions<CreateTvShowSnapshotMutation, CreateTvShowSnapshotMutationVariables>;
export const TvShowVideosDocument = gql`
    query TvShowVideos($id: Int!) {
  tvshow(id: $id) {
    tvshowsTrailers {
      nodes {
        videoId
      }
    }
  }
}
    `;

/**
 * __useTvShowVideosQuery__
 *
 * To run a query within a React component, call `useTvShowVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useTvShowVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTvShowVideosQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTvShowVideosQuery(baseOptions: Apollo.QueryHookOptions<TvShowVideosQuery, TvShowVideosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TvShowVideosQuery, TvShowVideosQueryVariables>(TvShowVideosDocument, options);
      }
export function useTvShowVideosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TvShowVideosQuery, TvShowVideosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TvShowVideosQuery, TvShowVideosQueryVariables>(TvShowVideosDocument, options);
        }
export type TvShowVideosQueryHookResult = ReturnType<typeof useTvShowVideosQuery>;
export type TvShowVideosLazyQueryHookResult = ReturnType<typeof useTvShowVideosLazyQuery>;
export type TvShowVideosQueryResult = Apollo.QueryResult<TvShowVideosQuery, TvShowVideosQueryVariables>;
export const BulkDeleteTvShowsDocument = gql`
    mutation BulkDeleteTvShows($filter: TvshowFilter) {
  deleteTvshows(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkDeleteTvShowsMutationFn = Apollo.MutationFunction<BulkDeleteTvShowsMutation, BulkDeleteTvShowsMutationVariables>;

/**
 * __useBulkDeleteTvShowsMutation__
 *
 * To run a mutation, you first call `useBulkDeleteTvShowsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteTvShowsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteTvShowsMutation, { data, loading, error }] = useBulkDeleteTvShowsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkDeleteTvShowsMutation(baseOptions?: Apollo.MutationHookOptions<BulkDeleteTvShowsMutation, BulkDeleteTvShowsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkDeleteTvShowsMutation, BulkDeleteTvShowsMutationVariables>(BulkDeleteTvShowsDocument, options);
      }
export type BulkDeleteTvShowsMutationHookResult = ReturnType<typeof useBulkDeleteTvShowsMutation>;
export type BulkDeleteTvShowsMutationResult = Apollo.MutationResult<BulkDeleteTvShowsMutation>;
export type BulkDeleteTvShowsMutationOptions = Apollo.BaseMutationOptions<BulkDeleteTvShowsMutation, BulkDeleteTvShowsMutationVariables>;
export const BulkPublishTvShowsDocument = gql`
    mutation BulkPublishTvShows($filter: TvshowFilter) {
  publishTvshows(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkPublishTvShowsMutationFn = Apollo.MutationFunction<BulkPublishTvShowsMutation, BulkPublishTvShowsMutationVariables>;

/**
 * __useBulkPublishTvShowsMutation__
 *
 * To run a mutation, you first call `useBulkPublishTvShowsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkPublishTvShowsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkPublishTvShowsMutation, { data, loading, error }] = useBulkPublishTvShowsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkPublishTvShowsMutation(baseOptions?: Apollo.MutationHookOptions<BulkPublishTvShowsMutation, BulkPublishTvShowsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkPublishTvShowsMutation, BulkPublishTvShowsMutationVariables>(BulkPublishTvShowsDocument, options);
      }
export type BulkPublishTvShowsMutationHookResult = ReturnType<typeof useBulkPublishTvShowsMutation>;
export type BulkPublishTvShowsMutationResult = Apollo.MutationResult<BulkPublishTvShowsMutation>;
export type BulkPublishTvShowsMutationOptions = Apollo.BaseMutationOptions<BulkPublishTvShowsMutation, BulkPublishTvShowsMutationVariables>;
export const BulkUnpublishTvShowsDocument = gql`
    mutation BulkUnpublishTvShows($filter: TvshowFilter) {
  unpublishTvshows(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkUnpublishTvShowsMutationFn = Apollo.MutationFunction<BulkUnpublishTvShowsMutation, BulkUnpublishTvShowsMutationVariables>;

/**
 * __useBulkUnpublishTvShowsMutation__
 *
 * To run a mutation, you first call `useBulkUnpublishTvShowsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkUnpublishTvShowsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkUnpublishTvShowsMutation, { data, loading, error }] = useBulkUnpublishTvShowsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkUnpublishTvShowsMutation(baseOptions?: Apollo.MutationHookOptions<BulkUnpublishTvShowsMutation, BulkUnpublishTvShowsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkUnpublishTvShowsMutation, BulkUnpublishTvShowsMutationVariables>(BulkUnpublishTvShowsDocument, options);
      }
export type BulkUnpublishTvShowsMutationHookResult = ReturnType<typeof useBulkUnpublishTvShowsMutation>;
export type BulkUnpublishTvShowsMutationResult = Apollo.MutationResult<BulkUnpublishTvShowsMutation>;
export type BulkUnpublishTvShowsMutationOptions = Apollo.BaseMutationOptions<BulkUnpublishTvShowsMutation, BulkUnpublishTvShowsMutationVariables>;
export const BulkCreateTvShowSnapshotsDocument = gql`
    mutation BulkCreateTvShowSnapshots($filter: TvshowFilter) {
  createTvshowSnapshots(filter: $filter) {
    affectedIds
  }
}
    `;
export type BulkCreateTvShowSnapshotsMutationFn = Apollo.MutationFunction<BulkCreateTvShowSnapshotsMutation, BulkCreateTvShowSnapshotsMutationVariables>;

/**
 * __useBulkCreateTvShowSnapshotsMutation__
 *
 * To run a mutation, you first call `useBulkCreateTvShowSnapshotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkCreateTvShowSnapshotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkCreateTvShowSnapshotsMutation, { data, loading, error }] = useBulkCreateTvShowSnapshotsMutation({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useBulkCreateTvShowSnapshotsMutation(baseOptions?: Apollo.MutationHookOptions<BulkCreateTvShowSnapshotsMutation, BulkCreateTvShowSnapshotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkCreateTvShowSnapshotsMutation, BulkCreateTvShowSnapshotsMutationVariables>(BulkCreateTvShowSnapshotsDocument, options);
      }
export type BulkCreateTvShowSnapshotsMutationHookResult = ReturnType<typeof useBulkCreateTvShowSnapshotsMutation>;
export type BulkCreateTvShowSnapshotsMutationResult = Apollo.MutationResult<BulkCreateTvShowSnapshotsMutation>;
export type BulkCreateTvShowSnapshotsMutationOptions = Apollo.BaseMutationOptions<BulkCreateTvShowSnapshotsMutation, BulkCreateTvShowSnapshotsMutationVariables>;