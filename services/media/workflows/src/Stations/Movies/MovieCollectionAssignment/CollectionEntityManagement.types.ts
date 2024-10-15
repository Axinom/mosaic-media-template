import {
  EntityType,
  MovieRelatedCollectionsQuery,
} from '../../../generated/graphql';

export type MovieRelatedCollections = CollectionRelation['collection'] & {
  sortOrder: number;
  entityId: number;
  entityType: EntityType.Collection;
  id?: number;
};

type CollectionRelation = NonNullable<
  MovieRelatedCollectionsQuery['movie']
>['collectionRelations']['nodes'][number];
