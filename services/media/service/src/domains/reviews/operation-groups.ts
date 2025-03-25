import {
  Mutations as M,
  Queries as Q,
} from '../../generated/graphql/operations';

export const ReviewsReadOperations = [Q.review, Q.reviews];

export const ReviewsMutateOperations = [
  M.createReview,
  M.deleteReview,
  M.updateReview,
];
