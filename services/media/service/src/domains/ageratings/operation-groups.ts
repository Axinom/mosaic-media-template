import {
  Mutations as M,
  Queries as Q,
} from '../../generated/graphql/operations';

export const AgeRatingsReadOperations = [Q.ageRatings, Q.ageRating];

export const AgeRatingsWriteOperations = [
  M.createAgeRating,
  M.updateAgeRating,
  M.deleteAgeRating,
];
