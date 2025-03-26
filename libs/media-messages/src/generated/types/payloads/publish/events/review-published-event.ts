import { ReviewLocalization } from '../types/review-localization';
/**
 * Definition of the review publish format.
 */
export interface ReviewPublishedEvent {
  /**
   * Content ID of a review. Must match the pattern`^(review)-([a-zA-Z0-9_-]+)$.`
   */
  content_id: string;
  /**
   * Review rating
   */
  rating: number;
  /**
   * Localizations for every defined locale.
   */
  localizations: ReviewLocalization[];
}