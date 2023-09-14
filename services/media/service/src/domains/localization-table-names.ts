import { Table } from 'zapatos/schema';

/**
 * An array of database table names that are associated with publication to
 * observe changes on.
 */
export const localizationTableNames: Table[] = [
  'movies',
  'movies_images',
  'movie_genres',
  'tvshows',
  'tvshows_images',
  'tvshow_genres',
  'seasons',
  'seasons_images',
  'episodes',
  'episodes_images',
  'collections',
  'collections_images',
];
