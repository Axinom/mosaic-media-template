import {
  EpisodeQuery,
  MutationUpdateEpisodeArgs,
} from '../../../generated/graphql';

export type EpisodeDetailsFormData =
  MutationUpdateEpisodeArgs['input']['patch'] & {
    tags?: string[];
    genres?: string[];
    cast?: string[];
    productionCountries?: string[];
    season?: NonNullable<EpisodeQuery['episode']>['season'];
  };
