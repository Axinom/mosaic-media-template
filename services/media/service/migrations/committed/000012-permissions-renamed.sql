--! Previous: sha1:9851a1af4f103e96e085e41f08b5a661399acde2
--! Hash: sha1:7d195977395ec5e4a14dbf48def809c501fee122
--! Message: permissions-renamed

SELECT ax_define.define_authentication('SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 'SETTINGS_EDIT,ADMIN', 'movie_genres', 'app_public');
SELECT ax_define.define_authentication('SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 'SETTINGS_EDIT,ADMIN', 'tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_tags', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_casts', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_licenses', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_production_countries', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_movie_genres', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_images', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_trailers', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_tags', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_casts', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_licenses', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_production_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_images', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_trailers', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_tags', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_casts', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_licenses', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_production_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_images', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_trailers', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_tags', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_casts', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_licenses', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_licenses_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_production_countries', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_tvshow_genres', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_images', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_trailers', 'app_public');
SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collections', 'app_public');
SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collection_relations', 'app_public');
SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collections_tags', 'app_public');
SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collections_images', 'app_public');
SELECT ax_define.define_authentication('INGESTS_VIEW,INGESTS_EDIT,ADMIN', 'INGESTS_EDIT,ADMIN', 'ingest_documents', 'app_public');
SELECT ax_define.define_authentication('INGESTS_VIEW,INGESTS_EDIT,ADMIN', 'INGESTS_EDIT,ADMIN', 'ingest_items', 'app_public');
SELECT ax_define.define_authentication('INGESTS_VIEW,INGESTS_EDIT,ADMIN', 'INGESTS_EDIT,ADMIN', 'ingest_item_steps', 'app_public');
SELECT ax_define.define_authentication('MOVIES_VIEW,MOVIES_EDIT,ADMIN', 'MOVIES_EDIT,ADMIN', 'movies_snapshots', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'tvshows_snapshots', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'seasons_snapshots', 'app_public');
SELECT ax_define.define_authentication('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 'TVSHOWS_EDIT,ADMIN', 'episodes_snapshots', 'app_public');
SELECT ax_define.define_authentication('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 'COLLECTIONS_EDIT,ADMIN', 'collections_snapshots', 'app_public');

SELECT app_hidden.define_snapshot_authentication(
  'MOVIE',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'MOVIES_VIEW,MOVIES_EDIT,ADMIN', 
  'MOVIES_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'TVSHOW',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 
  'TVSHOWS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'SEASON',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 
  'TVSHOWS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'EPISODE',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN', 
  'TVSHOWS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'MOVIE_GENRE',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 
  'SETTINGS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'TVSHOW_GENRE',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'SETTINGS_VIEW,SETTINGS_EDIT,ADMIN', 
  'SETTINGS_EDIT,ADMIN');
SELECT app_hidden.define_snapshot_authentication(
  'COLLECTION',
  'MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN',
  'COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN', 
  'COLLECTIONS_EDIT,ADMIN');
