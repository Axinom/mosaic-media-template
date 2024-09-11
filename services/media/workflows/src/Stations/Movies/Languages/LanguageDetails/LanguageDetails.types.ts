import { Nullable } from '@axinom/mosaic-ui';
import { MutationUpdateLanguageArgs } from '../../../../generated/graphql';

export type LanguageDetailsFormData = Nullable<
  MutationUpdateLanguageArgs['input']['patch']
> & {
  tags?: string[];
  genres?: string[];
  cast?: string[];
  director?: string[];
  productionCountries?: string[];
  audioLangs?: string;
};
