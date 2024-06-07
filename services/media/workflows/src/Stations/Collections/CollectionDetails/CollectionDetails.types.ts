import { MutationUpdateCollectionArgs } from '../../../generated/graphql';

export type CollectionDetailsFormData =
  MutationUpdateCollectionArgs['input']['patch'] & {
    tags?: string[];
    genres?: string[];
    cast?: string[];
    productionCountries?: string[];
  };
