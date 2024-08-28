import { AgeRating } from '../../../generated/graphql';

export type FormDataAgeRatings = Pick<AgeRating, 'name' | 'sortOrder' | 'id'>;

export interface AgeRatingsFormData {
  ageRatings?: FormDataAgeRatings[];
}
