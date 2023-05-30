import { TvShowSeasonsQuery } from '../../../generated/graphql';

export type TvShowSeason = NonNullable<
  TvShowSeasonsQuery['tvshow']
>['seasons']['nodes'][number];
