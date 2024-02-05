--! Previous: sha1:74178f124101f69a8a98fa5512c746d242166853
--! Hash: sha1:95f2cb8f12acd7bc84f7438f981092e254f74973
--! Message: update-subscription-triggers

SELECT ax_define.define_subscription_triggers('id', 'movie_genres', 'app_public', 'movie_genres', 'MOVIE_GENRE');
SELECT ax_define.define_subscription_triggers('id', 'tvshow_genres', 'app_public', 'tvshow_genres', 'TVSHOW_GENRE');

SELECT ax_define.define_subscription_triggers('id', 'movies', 'app_public', 'movies', 'MOVIE');
SELECT ax_define.define_subscription_triggers('movie_id', 'movies_tags', 'app_public', 'movies', 'MOVIE_TAG');
SELECT ax_define.define_subscription_triggers('movie_id', 'movies_casts', 'app_public', 'movies', 'MOVIE_CAST');
SELECT ax_define.define_subscription_triggers('movie_id', 'movies_licenses', 'app_public', 'movies', 'MOVIE_LICENSE');
SELECT ax_define.define_subscription_triggers('movies_license_id', 'movies_licenses_countries', 'app_public', 'movies_licenses', 'MOVIE_LICENSE_COUNTRY');
SELECT ax_define.define_subscription_triggers('movie_id', 'movies_production_countries', 'app_public', 'movies', 'MOVIE_PRODUCTION_COUNTRY');
SELECT ax_define.define_subscription_triggers('movie_id', 'movies_movie_genres', 'app_public', 'movies', 'MOVIE_MOVIE_GENRE');
SELECT ax_define.define_subscription_triggers('movie_id', 'movies_images', 'app_public', 'movies', 'MOVIE_IMAGE');
SELECT ax_define.define_subscription_triggers('movie_id', 'movies_trailers', 'app_public', 'movies', 'MOVIE_TRAILER');

SELECT ax_define.define_subscription_triggers('id', 'tvshows', 'app_public', 'tvshows', 'TVSHOW');
SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_tags', 'app_public', 'tvshows', 'TVSHOW_TAG');
SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_casts', 'app_public', 'tvshows', 'TVSHOW_CAST');
SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_licenses', 'app_public', 'tvshows', 'TVSHOW_LICENSE');
SELECT ax_define.define_subscription_triggers('tvshows_license_id', 'tvshows_licenses_countries', 'app_public', 'tvshows_licenses', 'TVSHOW_LICENSE_COUNTRY');
SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_production_countries', 'app_public', 'tvshows', 'TVSHOW_PRODUCTION_COUNTRY');
SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_tvshow_genres', 'app_public', 'tvshows', 'TVSHOW_TVSHOW_GENRE');
SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_images', 'app_public', 'tvshows', 'TVSHOW_IMAGE');
SELECT ax_define.define_subscription_triggers('tvshow_id', 'tvshows_trailers', 'app_public', 'tvshows', 'TVSHOW_TRAILER');

SELECT ax_define.define_subscription_triggers('id', 'seasons', 'app_public', 'seasons', 'SEASON');
SELECT ax_define.define_subscription_triggers('season_id', 'seasons_tags', 'app_public', 'seasons', 'SEASON_TAG');
SELECT ax_define.define_subscription_triggers('season_id', 'seasons_casts', 'app_public', 'seasons', 'SEASON_CAST');
SELECT ax_define.define_subscription_triggers('season_id', 'seasons_licenses', 'app_public', 'seasons', 'SEASON_LICENSE');
SELECT ax_define.define_subscription_triggers('seasons_license_id', 'seasons_licenses_countries', 'app_public', 'seasons_licenses', 'SEASON_LICENSE_COUNTRY');
SELECT ax_define.define_subscription_triggers('season_id', 'seasons_production_countries', 'app_public', 'seasons', 'SEASON_PRODUCTION_COUNTRY');
SELECT ax_define.define_subscription_triggers('season_id', 'seasons_tvshow_genres', 'app_public', 'seasons', 'SEASON_TVSHOW_GENRE');
SELECT ax_define.define_subscription_triggers('season_id', 'seasons_images', 'app_public', 'seasons', 'SEASON_IMAGE');
SELECT ax_define.define_subscription_triggers('season_id', 'seasons_trailers', 'app_public', 'seasons', 'SEASON_TRAILER');

SELECT ax_define.define_subscription_triggers('id', 'episodes', 'app_public', 'episodes', 'EPISODE');
SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_tags', 'app_public', 'episodes', 'EPISODE_TAG');
SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_casts', 'app_public', 'episodes', 'EPISODE_CAST');
SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_licenses', 'app_public', 'episodes', 'EPISODE_LICENSE');
SELECT ax_define.define_subscription_triggers('episodes_license_id', 'episodes_licenses_countries', 'app_public', 'episodes_licenses', 'EPISODE_LICENSE_COUNTRY');
SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_production_countries', 'app_public', 'episodes', 'EPISODE_PRODUCTION_COUNTRY');
SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_tvshow_genres', 'app_public', 'episodes', 'EPISODE_TVSHOW_GENRE');
SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_images', 'app_public', 'episodes', 'EPISODE_IMAGE');
SELECT ax_define.define_subscription_triggers('episode_id', 'episodes_trailers', 'app_public', 'episodes', 'EPISODE_TRAILER');

SELECT ax_define.define_subscription_triggers('id', 'collections', 'app_public', 'collections', 'COLLECTION');
SELECT ax_define.define_subscription_triggers('collection_id', 'collection_relations', 'app_public', 'collections', 'COLLECTION_RELATION');
SELECT ax_define.define_subscription_triggers('collection_id', 'collections_tags', 'app_public', 'collections', 'COLLECTION_TAG');
SELECT ax_define.define_subscription_triggers('collection_id', 'collections_images', 'app_public', 'collections', 'COLLECTION_IMAGE');

SELECT ax_define.define_subscription_triggers('id', 'ingest_documents', 'app_public', 'ingest_documents', 'INGEST_DOCUMENT');
SELECT ax_define.define_subscription_triggers('ingest_document_id', 'ingest_items', 'app_public', 'ingest_documents', 'INGEST_ITEM');

SELECT ax_define.define_subscription_triggers('id', 'snapshots', 'app_public', 'snapshots', 'SNAPSHOT');
SELECT ax_define.define_subscription_triggers('snapshot_id', 'snapshot_validation_results', 'app_public', 'snapshots', 'SNAPSHOT_VALIDATION_RESULT');
