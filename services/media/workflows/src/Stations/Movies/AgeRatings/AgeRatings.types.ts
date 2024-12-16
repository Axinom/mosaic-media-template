import { AgeRating } from '../../../generated/graphql';

export type FormDataAgeRatings = Pick<AgeRating, 'name' | 'id'>;

export interface AssetAgeRatingsFormData {
  ageRatings?: FormDataAgeRatings[];
}
