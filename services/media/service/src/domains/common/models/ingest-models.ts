import {
  collections_tags,
  episodes,
  episodes_casts,
  episodes_images,
  episodes_licenses,
  episodes_licenses_countries,
  episodes_production_countries,
  episodes_tags,
  episodes_trailers,
  episodes_tvshow_genres,
  movies,
  movies_casts,
  movies_images,
  movies_licenses,
  movies_licenses_countries,
  movies_movie_genres,
  movies_production_countries,
  movies_tags,
  movies_trailers,
  seasons,
  seasons_casts,
  seasons_images,
  seasons_licenses,
  seasons_licenses_countries,
  seasons_production_countries,
  seasons_tags,
  seasons_trailers,
  seasons_tvshow_genres,
  tvshows,
  tvshows_casts,
  tvshows_images,
  tvshows_licenses,
  tvshows_licenses_countries,
  tvshows_production_countries,
  tvshows_tags,
  tvshows_trailers,
  tvshows_tvshow_genres,
} from 'zapatos/schema';

export type IngestibleTable =
  | movies.Table
  | tvshows.Table
  | seasons.Table
  | episodes.Table;

export type IngestInsertable =
  | movies.Insertable
  | tvshows.Insertable
  | seasons.Insertable
  | episodes.Insertable;

export type NamedRelationTable =
  | collections_tags.Table
  | episodes_casts.Table
  | episodes_production_countries.Table
  | episodes_tags.Table
  | movies_casts.Table
  | movies_production_countries.Table
  | movies_tags.Table
  | seasons_casts.Table
  | seasons_production_countries.Table
  | seasons_tags.Table
  | tvshows_casts.Table
  | tvshows_production_countries.Table
  | tvshows_tags.Table;

export type NamedRelationFKSelector =
  | { movie_id: number }
  | { tvshow_id: number }
  | { season_id: number }
  | { episode_id: number }
  | { collection_id: number };

export type GenreRelationTable =
  | movies_movie_genres.Table
  | tvshows_tvshow_genres.Table
  | seasons_tvshow_genres.Table
  | episodes_tvshow_genres.Table;

export type GenreRelationInsertable =
  | movies_movie_genres.Insertable
  | tvshows_tvshow_genres.Insertable
  | seasons_tvshow_genres.Insertable
  | episodes_tvshow_genres.Insertable;

export type TrailerRelationTable =
  | movies_trailers.Table
  | tvshows_trailers.Table
  | seasons_trailers.Table
  | episodes_trailers.Table;

export type ImagesRelationTable =
  | movies_images.Table
  | tvshows_images.Table
  | seasons_images.Table
  | episodes_images.Table;

export type LicensesRelationTable =
  | movies_licenses.Table
  | tvshows_licenses.Table
  | seasons_licenses.Table
  | episodes_licenses.Table;

export type LicenseCountriesRelationTable =
  | movies_licenses_countries.Table
  | tvshows_licenses_countries.Table
  | seasons_licenses_countries.Table
  | episodes_licenses_countries.Table;

export type LicenseRelationInsertable =
  | movies_licenses.Insertable
  | tvshows_licenses.Insertable
  | seasons_licenses.Insertable
  | episodes_licenses.Insertable;

export type RelationFKSelector =
  | { movie_id: number }
  | { tvshow_id: number }
  | { season_id: number }
  | { episode_id: number };

export type LicenseFKSelector =
  | { movies_license_id: number }
  | { tvshows_license_id: number }
  | { seasons_license_id: number }
  | { episodes_license_id: number };
