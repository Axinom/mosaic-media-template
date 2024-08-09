import {
  CollectionRelatedEntitiesQuery,
  EntityType,
} from '../../../generated/graphql';

export type CollectionRelatedEntity = CollectionRelatedMovie & {
  sortOrder: number;
  id?: number;
};

export type CollectionRelatedMovie = CollectionRelation['movie'] & {
  entityType: EntityType.Movie;
};

type CollectionRelation = NonNullable<
  CollectionRelatedEntitiesQuery['collection']
>['collectionRelations']['nodes'][number];
