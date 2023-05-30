import { Nullable } from '@axinom/mosaic-ui';
import { MutationUpdateSeasonArgs } from '../../../generated/graphql';

export type SeasonDetailsFormData = Nullable<
  MutationUpdateSeasonArgs['input']['patch']
> & {
  tags?: string[];
  genres?: string[];
  cast?: string[];
  productionCountries?: string[];
};
