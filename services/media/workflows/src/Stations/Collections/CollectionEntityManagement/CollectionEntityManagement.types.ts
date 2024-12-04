import {
  CollectionRelatedEntitiesQuery,
  EntityType,
} from '../../../generated/graphql';

export type CollectionRelatedEntity = (
  | CollectionRelatedMovie
  | CollectionRelatedTvShow
  | CollectionRelatedSeason
  | CollectionRelatedEpisode
  | CollectionRelatedCollection
) & { sortOrder: number; id?: number };

export type CollectionRelatedMovie = CollectionRelation['movie'] & {
  entityType: EntityType.Movie;
};

export type CollectionRelatedTvShow = CollectionRelation['tvshow'] & {
  entityType: EntityType.Tvshow;
};

export type CollectionRelatedSeason = CollectionRelation['season'] & {
  entityType: EntityType.Season;
  title: string;
};
export type CollectionRelatedEpisode = NonNullable<
  CollectionRelation['episode']
> & {
  entityType: EntityType.Episode;
};

export type CollectionRelatedCollection =
  CollectionRelation['childCollection'] & {
    entityType: EntityType.Collection;
    title: string;
  };

type CollectionRelation = NonNullable<
  CollectionRelatedEntitiesQuery['collection']
>['collectionRelations']['nodes'][number];
