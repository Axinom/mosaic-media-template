--! Previous: sha1:a7d4a819fa6031f45fbe35ee49c7095e9c314d96
--! Hash: sha1:9753a05634f6e5f0244761b1665ded686ec7dbdd
--! Message: create-tables

-- NAVIGATION:
-- search for this to jump to the corresponding sections:
-- * #movie
-- * #movie_genre
-- * #tvshow
-- * #tvshow_genre
-- * #season
-- * #episode
-- * #collection
-- * #post_setup

GRANT USAGE ON SCHEMA ax_utils, ax_define TO ":DATABASE_GQL_ROLE";

--;
-- #movie;
--;
DROP TABLE IF EXISTS app_public.movie CASCADE;
CREATE TABLE app_public.movie(
  id TEXT PRIMARY KEY,
  title TEXT,
  original_title TEXT,
  synopsis TEXT,
  description TEXT,
  studio TEXT,
  released TIMESTAMPTZ,
  movie_cast TEXT [],
  production_countries TEXT [],
  tags TEXT []
);

DROP TABLE IF EXISTS app_public.movie_images CASCADE;
CREATE TABLE app_public.movie_images(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  movie_id TEXT REFERENCES movie ON DELETE CASCADE,
  type TEXT,
  path TEXT,
  width INTEGER,
  height INTEGER
);
CREATE INDEX ON app_public.movie_images (movie_id);

DROP TABLE IF EXISTS app_public.movie_licenses CASCADE;
CREATE TABLE app_public.movie_licenses(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  movie_id TEXT REFERENCES movie ON DELETE CASCADE,
  countries TEXT [],
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ
);
SELECT ax_define.define_index('movie_id', 'movie_licenses', 'app_public');

DROP TABLE IF EXISTS app_public.movie_videos CASCADE;
CREATE TABLE app_public.movie_videos(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  movie_id TEXT REFERENCES movie ON DELETE CASCADE,
  type TEXT,
  title TEXT,
  duration INTEGER,
  audio_languages TEXT [],
  subtitle_languages TEXT [],
  caption_languages TEXT [],
  dash_manifest TEXT,
  hls_manifest TEXT,
  drm_key_ids TEXT[],
  is_protected BOOLEAN,
  output_format TEXT
);
SELECT ax_define.define_index('movie_id', 'movie_videos', 'app_public');
SELECT ax_define.define_index('type', 'movie_videos', 'app_public');

DROP TABLE IF EXISTS app_public.movie_genres_relation CASCADE;
CREATE TABLE app_public.movie_genres_relation(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  movie_id TEXT REFERENCES movie ON DELETE CASCADE,
  movie_genre_id TEXT,
  order_no INTEGER NOT NULL DEFAULT 0
);
SELECT ax_define.define_index('movie_id', 'movie_genres_relation', 'app_public');
SELECT ax_define.define_index('movie_genre_id', 'movie_genres_relation', 'app_public');
SELECT ax_define.define_index('order_no', 'movie_genres_relation', 'app_public');

--;
--;
--;
--;
-- #movie_genre;
--;
DROP TABLE IF EXISTS app_public.movie_genre CASCADE;
CREATE TABLE app_public.movie_genre(
  id TEXT PRIMARY KEY,
  title TEXT,
  order_no INTEGER
);
SELECT ax_define.define_index('order_no', 'movie_genre', 'app_public');

--;
--;
--;
--;
-- #tvshow;
--;
DROP TABLE IF EXISTS app_public.tvshow CASCADE;
CREATE TABLE app_public.tvshow(
  id TEXT PRIMARY KEY,
  title TEXT,
  original_title TEXT,
  synopsis TEXT,
  description TEXT,
  studio TEXT,
  released TIMESTAMPTZ,
  tvshow_cast TEXT [],
  production_countries TEXT [],
  tags TEXT []
);

DROP TABLE IF EXISTS app_public.tvshow_images CASCADE;
CREATE TABLE app_public.tvshow_images(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  tvshow_id TEXT REFERENCES tvshow ON DELETE CASCADE,
  type TEXT,
  path TEXT,
  width INTEGER,
  height INTEGER
);
SELECT ax_define.define_index('tvshow_id', 'tvshow_images', 'app_public');

DROP TABLE IF EXISTS app_public.tvshow_licenses CASCADE;
CREATE TABLE app_public.tvshow_licenses(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  tvshow_id TEXT REFERENCES tvshow ON DELETE CASCADE,
  countries TEXT [],
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ
);
SELECT ax_define.define_index('tvshow_id', 'tvshow_licenses', 'app_public');

DROP TABLE IF EXISTS app_public.tvshow_videos CASCADE;
CREATE TABLE app_public.tvshow_videos(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  tvshow_id TEXT REFERENCES tvshow ON DELETE CASCADE,
  type TEXT,
  title TEXT,
  duration INTEGER,
  audio_languages TEXT [],
  subtitle_languages TEXT [],
  caption_languages TEXT [],
  dash_manifest TEXT,
  hls_manifest TEXT,
  drm_key_ids TEXT[],
  is_protected BOOLEAN,
  output_format TEXT
);
SELECT ax_define.define_index('tvshow_id', 'tvshow_videos', 'app_public');

DROP TABLE IF EXISTS app_public.tvshow_genres_relation CASCADE;
CREATE TABLE app_public.tvshow_genres_relation(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  tvshow_id TEXT REFERENCES tvshow ON DELETE CASCADE,
  tvshow_genre_id TEXT,
  order_no INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX ON app_public.tvshow_genres_relation (tvshow_id);
CREATE INDEX ON app_public.tvshow_genres_relation (tvshow_genre_id);
CREATE INDEX ON app_public.tvshow_genres_relation (order_no);
SELECT ax_define.define_index('tvshow_id', 'tvshow_genres_relation', 'app_public');
SELECT ax_define.define_index('tvshow_genre_id', 'tvshow_genres_relation', 'app_public');
SELECT ax_define.define_index('order_no', 'tvshow_genres_relation', 'app_public');

--;
--;
--;
--;
-- #tvshow_genre;
--;
DROP TABLE IF EXISTS app_public.tvshow_genre CASCADE;
CREATE TABLE app_public.tvshow_genre(
  id TEXT PRIMARY KEY,
  title TEXT,
  order_no INTEGER
);
CREATE INDEX ON app_public.tvshow_genre (order_no);
SELECT ax_define.define_index('order_no', 'tvshow_genre', 'app_public');

--;
--;
--;
--;
-- #season;
--;
DROP TABLE IF EXISTS app_public.season CASCADE;
CREATE TABLE app_public.season(
  id TEXT PRIMARY KEY,
  tvshow_id TEXT,
  index INTEGER,
  synopsis TEXT,
  description TEXT,
  studio TEXT,
  released TIMESTAMPTZ,
  season_cast TEXT [],
  production_countries TEXT [],
  tags TEXT []
);
SELECT ax_define.define_index('tvshow_id', 'season', 'app_public');

DROP TABLE IF EXISTS app_public.season_images CASCADE;
CREATE TABLE app_public.season_images(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  season_id TEXT REFERENCES season ON DELETE CASCADE,
  type TEXT,
  path TEXT,
  width INTEGER,
  height INTEGER
);
SELECT ax_define.define_index('season_id', 'season_images', 'app_public');

DROP TABLE IF EXISTS app_public.season_licenses CASCADE;
CREATE TABLE app_public.season_licenses(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  season_id TEXT REFERENCES season ON DELETE CASCADE,
  countries TEXT [],
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ
);
SELECT ax_define.define_index('season_id', 'season_licenses', 'app_public');

DROP TABLE IF EXISTS app_public.season_videos CASCADE;
CREATE TABLE app_public.season_videos(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  season_id TEXT REFERENCES season ON DELETE CASCADE,
  type TEXT,
  title TEXT,
  duration INTEGER,
  audio_languages TEXT [],
  subtitle_languages TEXT [],
  caption_languages TEXT [],
  dash_manifest TEXT,
  hls_manifest TEXT,
  drm_key_ids TEXT[],
  is_protected BOOLEAN,
  output_format TEXT
);
SELECT ax_define.define_index('season_id', 'season_videos', 'app_public');

DROP TABLE IF EXISTS app_public.season_genres_relation CASCADE;
CREATE TABLE app_public.season_genres_relation(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  season_id TEXT REFERENCES season ON DELETE CASCADE,
  tvshow_genre_id TEXT,
  order_no INTEGER NOT NULL DEFAULT 0
);
SELECT ax_define.define_index('season_id', 'season_genres_relation', 'app_public');
SELECT ax_define.define_index('tvshow_genre_id', 'season_genres_relation', 'app_public');
SELECT ax_define.define_index('order_no', 'season_genres_relation', 'app_public');


--;
--;
--;
--;
-- #episode;
--;
DROP TABLE IF EXISTS app_public.episode CASCADE;
CREATE TABLE app_public.episode(
  id TEXT PRIMARY KEY,
  season_id TEXT,
  index INTEGER,
  title TEXT,
  original_title TEXT,
  synopsis TEXT,
  description TEXT,
  studio TEXT,
  released TIMESTAMPTZ,
  episode_cast TEXT [],
  tags TEXT [],
  production_countries TEXT[]
);
SELECT ax_define.define_index('season_id', 'episode', 'app_public');

DROP TABLE IF EXISTS app_public.episode_images CASCADE;
CREATE TABLE app_public.episode_images(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  episode_id TEXT REFERENCES episode ON DELETE CASCADE,
  type TEXT,
  path TEXT,
  width INTEGER,
  height INTEGER
);
SELECT ax_define.define_index('episode_id', 'episode_images', 'app_public');

DROP TABLE IF EXISTS app_public.episode_licenses CASCADE;
CREATE TABLE app_public.episode_licenses(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  episode_id TEXT REFERENCES episode ON DELETE CASCADE,
  countries TEXT [],
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ
);
SELECT ax_define.define_index('episode_id', 'episode_licenses', 'app_public');

DROP TABLE IF EXISTS app_public.episode_videos CASCADE;
CREATE TABLE app_public.episode_videos(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  episode_id TEXT REFERENCES episode ON DELETE CASCADE,
  type TEXT,
  title TEXT,
  duration INTEGER,
  audio_languages TEXT [],
  subtitle_languages TEXT [],
  caption_languages TEXT [],
  dash_manifest TEXT,
  hls_manifest TEXT,
  drm_key_ids TEXT[],
  is_protected BOOLEAN,
  output_format TEXT
);
SELECT ax_define.define_index('episode_id', 'episode_videos', 'app_public');
SELECT ax_define.define_index('type', 'episode_videos', 'app_public');

DROP TABLE IF EXISTS app_public.episode_genres_relation CASCADE;
CREATE TABLE app_public.episode_genres_relation(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  episode_id TEXT REFERENCES episode ON DELETE CASCADE,
  tvshow_genre_id TEXT,
  order_no INTEGER NOT NULL DEFAULT 0
);
SELECT ax_define.define_index('episode_id', 'episode_genres_relation', 'app_public');
SELECT ax_define.define_index('tvshow_genre_id', 'episode_genres_relation', 'app_public');
SELECT ax_define.define_index('order_no', 'episode_genres_relation', 'app_public');

--;
--;
--;
--;
-- #collection;
--;
DROP TABLE IF EXISTS app_public.collection CASCADE;
CREATE TABLE app_public.collection(
  id TEXT PRIMARY KEY,
  title TEXT,
  synopsis TEXT,
  description TEXT,
  tags TEXT []
);

DROP TABLE IF EXISTS app_public.collection_images CASCADE;
CREATE TABLE app_public.collection_images(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  collection_id TEXT REFERENCES collection ON DELETE CASCADE,
  type TEXT,
  path TEXT,
  width INTEGER,
  height INTEGER
);
SELECT ax_define.define_index('collection_id', 'collection_images', 'app_public');

DROP TABLE IF EXISTS app_public.collection_items_relation CASCADE;
CREATE TABLE app_public.collection_items_relation(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  collection_id TEXT REFERENCES collection ON DELETE CASCADE,
  movie_id TEXT,
  tvshow_id TEXT,
  season_id TEXT,
  episode_id TEXT,
  order_no INTEGER NOT NULL DEFAULT 0,
  relation_type TEXT
);
SELECT ax_define.define_index('collection_id', 'collection_items_relation', 'app_public');
SELECT ax_define.define_index('movie_id', 'collection_items_relation', 'app_public');
SELECT ax_define.define_index('tvshow_id', 'collection_items_relation', 'app_public');
SELECT ax_define.define_index('season_id', 'collection_items_relation', 'app_public');
SELECT ax_define.define_index('episode_id', 'collection_items_relation', 'app_public');
SELECT ax_define.define_index('order_no', 'collection_items_relation', 'app_public');

--;
--;
--;
--;
-- #post_setup;
--;

-- create the messaging counter table
SELECT ax_define.create_messaging_counter_table();

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app_public TO ":DATABASE_GQL_ROLE";
