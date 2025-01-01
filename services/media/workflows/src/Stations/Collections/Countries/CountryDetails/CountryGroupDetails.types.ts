import { Nullable } from '@axinom/mosaic-ui';
import { UUID } from 'crypto';
import {
  IsoAlphaTwoCountryCodes,
  MutationUpdateCountryGroupArgs,
} from '../../../../generated/graphql';

export type CountryGroupDetailsFormData = Nullable<
  MutationUpdateCountryGroupArgs['input']['patch']
> & {
  id?: UUID;
  name?: string;
  countries?: IsoAlphaTwoCountryCodes[];
};
