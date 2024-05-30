import { TvshowGenre } from '../types/tvshow-genre';
/**
 * Definition of the TV show genre publish format.
 */
export interface TvshowGenresPublishedEvent {
  /**
   * List of TV show genres.
   */
  genres: TvshowGenre[];
}