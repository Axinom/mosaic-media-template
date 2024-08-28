import { MutationUpdateTvshowArgs } from '../../../generated/graphql';

export type TvShowDetailsFormData =
  MutationUpdateTvshowArgs['input']['patch'] & {
    tags?: string[];
    genres?: string[];
    cast?: string[];
    productionCountries?: string[];
    businessType?: string[];
    adLanguages?: string[];
    sbLanguages?: string[];
    ccLanguages?: string[];
  };
