import {
  EntityType,
  TvshowRelatedCollectionsQuery,
} from '../../../generated/graphql';

export type TvshowRelatedCollections = CollectionRelation['collection'] & {
  sortOrder: number;
  entityId: number;
  entityType: EntityType.Collection;
  id?: number;
};

type CollectionRelation = NonNullable<
  TvshowRelatedCollectionsQuery['tvshow']
>['collectionRelations']['nodes'][number];
