import { MovieGenre } from '../types/movie-genre';
/**
 * Definition of the movie genre publish format.
 */
export interface MovieGenresPublishedEvent {
  /**
   * List of movie genres.
   */
  genres: MovieGenre[];
}