import {
  Mutations as M,
  Queries as Q,
} from '../../generated/graphql/operations';

export enum Sub { // Required to allow requesting these endpoints as child properties. Endpoints are excluded from the root Query via smart tags.
  reviewsSnapshots = 'reviewsSnapshots',
  snapshotValidationResults = 'snapshotValidationResults',
}

export const ReviewsReadOperations = [
  Q.review,
  Q.reviews,
  Sub.reviewsSnapshots,
  Sub.snapshotValidationResults,
];

export const ReviewsMutateOperations = [
  M.createReview,
  M.deleteReview,
  M.updateReview,
  M.publishReview,
  M.publishReviews,
  M.unpublishReview,
  M.unpublishReviews,
  M.createReviewSnapshot,
  M.createReviewSnapshots,
];
