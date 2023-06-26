import { Genre } from '../types/genre';
/**
 * Definition of the movie genre publish format.
 */
export interface MovieGenresPublishedEvent {
  /**
   * List of movie genres.
   */
  genres: Genre[];
}