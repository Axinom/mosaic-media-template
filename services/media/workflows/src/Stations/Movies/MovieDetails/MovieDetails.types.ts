import { Nullable } from '@axinom/mosaic-ui';
import { MutationUpdateMovieArgs } from '../../../generated/graphql';

export type MovieDetailsFormData = Nullable<
  MutationUpdateMovieArgs['input']['patch']
> & {
  tags?: string[];
  genres?: string[];
  cast?: string[];
  productionCountries?: string[];
  businessType?: string[];
  adLanguages?: string[];
  sbLanguages?: string[];
  ccLanguages?: string[];
};
