import {
  Mutations as M,
  Queries as Q,
  Subscriptions as S,
} from '../../generated/graphql/operations';

export enum Sub { // Required to allow requesting these endpoints as child properties. Endpoints are excluded from the root Query via smart tags.
  collectionsSnapshots = 'collectionsSnapshots',
  snapshotValidationResults = 'snapshotValidationResults',
}

export const CollectionAdditionalOperations = [
  Sub.collectionsSnapshots,
  Sub.snapshotValidationResults,
];

export const CollectionsIgnoreOperations = [
  Q.collectionsImage,
  Q.collectionRelationByCollectionIdAndSortOrder,
  M.updateCollectionRelationByCollectionIdAndSortOrder,
  M.deleteCollectionRelationByCollectionIdAndSortOrder,
];

export const CollectionsReadOperations = [
  Q.collection,
  Q.collectionByExternalId,
  Q.collectionRelation,
  Q.collectionRelations,
  Q.collections,
  Q.collectionsImages,
  Q.collectionsTag,
  Q.collectionsTags,
  Q.getCollectionsTagsValues,
  Sub.collectionsSnapshots,
  Sub.snapshotValidationResults,
  S.collectionMutated,
];

export const CollectionsMutateOperations = [
  M.createCollection,
  M.createCollectionRelation,
  M.createCollectionsImage,
  M.createCollectionsTag,
  M.deleteCollection,
  M.deleteCollectionByExternalId,
  M.deleteCollectionRelation,
  M.deleteCollectionRelations,
  M.deleteCollections,
  M.deleteCollectionsImageByCollectionIdAndImageType,
  M.deleteCollectionsTag,
  M.updateCollection,
  M.updateCollectionByExternalId,
  M.updateCollectionRelation,
  M.updateCollectionsImageByCollectionIdAndImageType,
  M.updateCollectionsTag,
  M.publishCollection,
  M.publishCollections,
  M.unpublishCollection,
  M.unpublishCollections,
  M.createCollectionSnapshot,
  M.createCollectionSnapshots,
];

export const CollectionDevOperations = [M.populateCollections];

// Endpoints that are needed to find related items in collections
export const SelectEndpoints = [
  Q.movies,
  Q.tvshows,
  Q.seasons,
  Q.episodes,
  Q.collections,
  Q.movieGenres,
  Q.tvshowGenres,
];
