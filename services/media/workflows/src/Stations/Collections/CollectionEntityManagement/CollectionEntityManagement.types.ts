import {
  CollectionRelatedEntitiesQuery,
  EntityType,
} from '../../../generated/graphql';

export type CollectionRelatedEntity = (
  | CollectionRelatedMovie
  | CollectionRelatedTvShow
  | CollectionRelatedSeason
  | CollectionRelatedEpisode
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

type CollectionRelation = NonNullable<
  CollectionRelatedEntitiesQuery['collection']
>['collectionRelations']['nodes'][number];
