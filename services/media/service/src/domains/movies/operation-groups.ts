import {
  Mutations as M,
  Queries as Q,
  Relations as R,
  Subscriptions as S,
} from '../../generated/graphql/operations';

export enum Sub { // Required to allow requesting these endpoints as child properties. Endpoints are excluded from the root Query via smart tags.
  moviesSnapshots = 'moviesSnapshots',
  snapshotValidationResults = 'snapshotValidationResults',
}

export const MovieAdditionalOperations = [
  Sub.moviesSnapshots,
  Sub.snapshotValidationResults,
];

export const MovieIgnoreOperations = [
  Q.moviesImage,
  Q.movieGenreBySortOrder,
  M.updateMovieGenreBySortOrder,
  M.deleteMovieGenreBySortOrder,
];

export const MovieGenresReadOperations = [
  Q.movieGenre,
  Q.movieGenres,
  S.movieGenreMutated,
  R.moviesMovieGenresByMovieGenresId,
];

export const MovieGenresMutateOperations = [
  M.createMovieGenre,
  M.deleteMovieGenre,
  M.deleteMovieGenres,
  M.updateMovieGenre,
  M.publishMovieGenres,
  M.unpublishMovieGenres,
  M.createMovieGenresSnapshot,
];

export const MoviesReadOperations = [
  Q.getMoviesCastsValues,
  Q.getMoviesProductionCountriesValues,
  Q.getMoviesTagsValues,
  Q.movie,
  Q.movieByExternalId,
  Q.movies,
  Q.moviesCast,
  Q.moviesCasts,
  Q.moviesImages,
  Q.moviesLicense,
  Q.moviesLicenses,
  Q.moviesLicensesCountries,
  Q.moviesLicensesCountry,
  Q.moviesMovieGenre,
  Q.moviesMovieGenres,
  Q.moviesProductionCountries,
  Q.moviesProductionCountry,
  Q.moviesTag,
  Q.moviesTags,
  Q.moviesTrailer,
  Q.moviesTrailers,
  Sub.moviesSnapshots,
  Sub.snapshotValidationResults,
  S.movieMutated,
];

export const MoviesMutateOperations = [
  M.createMovie,
  M.createMoviesCast,
  M.createMoviesImage,
  M.createMoviesLicense,
  M.createMoviesLicensesCountry,
  M.createMoviesMovieGenre,
  M.createMoviesProductionCountry,
  M.createMoviesTag,
  M.createMoviesTrailer,
  M.deleteMovie,
  M.deleteMovieByExternalId,
  M.deleteMovies,
  M.deleteMoviesCast,
  M.deleteMoviesImageByMovieIdAndImageType,
  M.deleteMoviesLicense,
  M.deleteMoviesLicenses,
  M.deleteMoviesLicensesCountry,
  M.deleteMoviesMovieGenre,
  M.deleteMoviesProductionCountry,
  M.deleteMoviesTag,
  M.deleteMoviesTrailer,
  M.updateMovie,
  M.updateMovieByExternalId,
  M.updateMoviesCast,
  M.updateMoviesImageByMovieIdAndImageType,
  M.updateMoviesLicense,
  M.updateMoviesLicensesCountry,
  M.updateMoviesProductionCountry,
  M.updateMoviesTag,
  M.publishMovie,
  M.publishMovies,
  M.unpublishMovie,
  M.unpublishMovies,
  M.createMovieSnapshot,
  M.createMovieSnapshots,
];

export const MoviesDevOperations = [M.populateMovies];
