import { SeasonEpisodesQuery } from '../../../generated/graphql';

export type SeasonEpisode = NonNullable<
  SeasonEpisodesQuery['season']
>['episodes']['nodes'][number];
