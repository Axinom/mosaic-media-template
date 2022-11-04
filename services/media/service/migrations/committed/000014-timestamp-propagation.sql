--! Previous: sha1:ac2d5bf7add3062937fb93b527ff39f0f93b9453
--! Hash: sha1:6ef7379103826822eaf8e561cee86cf39421fbed
--! Message: timestamp propagation

-- movies
-- any change to relations or child entities which alters the published json should update the updated_date
select ax_define.define_timestamp_propagation('movie_id', 'movies_tags', 'app_public', 'id', 'movies', 'app_public');
select ax_define.define_timestamp_propagation('movie_id', 'movies_casts', 'app_public', 'id', 'movies', 'app_public');
select ax_define.define_timestamp_propagation('movie_id', 'movies_movie_genres', 'app_public', 'id', 'movies', 'app_public');
select ax_define.define_timestamp_propagation('movie_id', 'movies_production_countries', 'app_public', 'id', 'movies', 'app_public');
select ax_define.define_timestamp_propagation('movie_id', 'movies_licenses', 'app_public', 'id', 'movies', 'app_public');
select ax_define.define_timestamp_propagation('movie_id', 'movies_images', 'app_public', 'id', 'movies', 'app_public');
select ax_define.define_timestamp_propagation('movie_id', 'movies_trailers', 'app_public', 'id', 'movies', 'app_public');
select ax_define.define_timestamp_propagation('movies_license_id', 'movies_licenses_countries', 'app_public', 'id', 'movies_licenses', 'app_public');
-- propogation through movies_licenses requires that it has as 'updated_date' column
select ax_define.define_audit_date_fields_on_table('movies_licenses', 'app_public');
-- timestamp trigger must be updated on all target tables for correct propagation
SELECT ax_define.define_timestamps_trigger('movies', 'app_public');

-- tvshows
select ax_define.define_timestamp_propagation('tvshow_id', 'tvshows_tags', 'app_public', 'id', 'tvshows', 'app_public');
select ax_define.define_timestamp_propagation('tvshow_id', 'tvshows_casts', 'app_public', 'id', 'tvshows', 'app_public');
select ax_define.define_timestamp_propagation('tvshow_id', 'tvshows_tvshow_genres', 'app_public', 'id', 'tvshows', 'app_public');
select ax_define.define_timestamp_propagation('tvshow_id', 'tvshows_production_countries', 'app_public', 'id', 'tvshows', 'app_public');
select ax_define.define_timestamp_propagation('tvshow_id', 'tvshows_licenses', 'app_public', 'id', 'tvshows', 'app_public');
select ax_define.define_timestamp_propagation('tvshow_id', 'tvshows_images', 'app_public', 'id', 'tvshows', 'app_public');
select ax_define.define_timestamp_propagation('tvshow_id', 'tvshows_trailers', 'app_public', 'id', 'tvshows', 'app_public');
select ax_define.define_timestamp_propagation('tvshows_license_id', 'tvshows_licenses_countries', 'app_public', 'id', 'tvshows_licenses', 'app_public');
select ax_define.define_audit_date_fields_on_table('tvshows_licenses', 'app_public');
SELECT ax_define.define_timestamps_trigger('tvshows', 'app_public');

-- seasons
select ax_define.define_timestamp_propagation('season_id', 'seasons_tags', 'app_public', 'id', 'seasons', 'app_public');
select ax_define.define_timestamp_propagation('season_id', 'seasons_casts', 'app_public', 'id', 'seasons', 'app_public');
select ax_define.define_timestamp_propagation('season_id', 'seasons_tvshow_genres', 'app_public', 'id', 'seasons', 'app_public');
select ax_define.define_timestamp_propagation('season_id', 'seasons_production_countries', 'app_public', 'id', 'seasons', 'app_public');
select ax_define.define_timestamp_propagation('season_id', 'seasons_licenses', 'app_public', 'id', 'seasons', 'app_public');
select ax_define.define_timestamp_propagation('season_id', 'seasons_images', 'app_public', 'id', 'seasons', 'app_public');
select ax_define.define_timestamp_propagation('season_id', 'seasons_trailers', 'app_public', 'id', 'seasons', 'app_public');
select ax_define.define_timestamp_propagation('seasons_license_id', 'seasons_licenses_countries', 'app_public', 'id', 'seasons_licenses', 'app_public');
select ax_define.define_audit_date_fields_on_table('seasons_licenses', 'app_public');
SELECT ax_define.define_timestamps_trigger('seasons', 'app_public');

-- episodes
select ax_define.define_timestamp_propagation('episode_id', 'episodes_tags', 'app_public', 'id', 'episodes', 'app_public');
select ax_define.define_timestamp_propagation('episode_id', 'episodes_casts', 'app_public', 'id', 'episodes', 'app_public');
select ax_define.define_timestamp_propagation('episode_id', 'episodes_tvshow_genres', 'app_public', 'id', 'episodes', 'app_public');
select ax_define.define_timestamp_propagation('episode_id', 'episodes_production_countries', 'app_public', 'id', 'episodes', 'app_public');
select ax_define.define_timestamp_propagation('episode_id', 'episodes_licenses', 'app_public', 'id', 'episodes', 'app_public');
select ax_define.define_timestamp_propagation('episode_id', 'episodes_images', 'app_public', 'id', 'episodes', 'app_public');
select ax_define.define_timestamp_propagation('episode_id', 'episodes_trailers', 'app_public', 'id', 'episodes', 'app_public');
select ax_define.define_timestamp_propagation('episodes_license_id', 'episodes_licenses_countries', 'app_public', 'id', 'episodes_licenses', 'app_public', 'tg_episodes_licenses_countries__episodes_licenses_ts_propagtn');
select ax_define.define_audit_date_fields_on_table('episodes_licenses', 'app_public');
SELECT ax_define.define_timestamps_trigger('episodes', 'app_public');

-- collections
select ax_define.define_timestamp_propagation('collection_id', 'collection_relations', 'app_public', 'id', 'collections', 'app_public');
select ax_define.define_timestamp_propagation('collection_id', 'collections_tags', 'app_public', 'id', 'collections', 'app_public');
select ax_define.define_timestamp_propagation('collection_id', 'collections_images', 'app_public', 'id', 'collections', 'app_public');
SELECT ax_define.define_timestamps_trigger('collections', 'app_public');
