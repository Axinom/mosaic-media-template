--! Previous: sha1:a178c831db3d4ffd837307bb142e59bcfbef7fa5
--! Hash: sha1:2341b843c16da70691a2ffedcb53aa5f86bb9479
--! Message: introduce-directors

-- table: movies_directors
DROP TABLE IF EXISTS app_public.movies_directors CASCADE;
CREATE TABLE app_public.movies_directors (
  movie_id integer NOT NULL REFERENCES app_public.movies(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(movie_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movies_directors TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_index('movie_id', 'movies_directors', 'app_public');
SELECT ax_define.define_like_index('name', 'movies_directors', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'movies_directors', 'app_public');
SELECT ax_define.define_authentication('MOVIE_READER,MOVIE_EDITOR,ADMIN', 'MOVIE_EDITOR,ADMIN', 'movies_directors', 'app_public');

-- table: tvshows_directors
DROP TABLE IF EXISTS app_public.tvshows_directors CASCADE;
CREATE TABLE app_public.tvshows_directors (
  tvshow_id integer NOT NULL REFERENCES app_public.tvshows(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(tvshow_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.tvshows_directors TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_index('tvshow_id', 'tvshows_directors', 'app_public');
SELECT ax_define.define_like_index('name', 'tvshows_directors', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'tvshows_directors', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'tvshows_directors', 'app_public');

-- table: seasons_directors
DROP TABLE IF EXISTS app_public.seasons_directors CASCADE;
CREATE TABLE app_public.seasons_directors (
  season_id integer NOT NULL REFERENCES app_public.seasons(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(season_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.seasons_directors TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_index('season_id', 'seasons_directors', 'app_public');
SELECT ax_define.define_like_index('name', 'seasons_directors', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'seasons_directors', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'seasons_directors', 'app_public');

-- table: episodes_directors
DROP TABLE IF EXISTS app_public.episodes_directors CASCADE;
CREATE TABLE app_public.episodes_directors (
  episode_id integer NOT NULL REFERENCES app_public.episodes(id) ON DELETE CASCADE,
  name text NOT NULL,

  PRIMARY KEY(episode_id, name),
  CONSTRAINT name_not_empty CHECK(ax_utils.constraint_not_empty(name, 'The name cannot be empty.'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.episodes_directors TO ":DATABASE_GQL_ROLE";

SELECT ax_define.define_index('episode_id', 'episodes_directors', 'app_public');
SELECT ax_define.define_like_index('name', 'episodes_directors', 'app_public');
SELECT ax_define.live_suggestions_endpoint('name', 'episodes_directors', 'app_public');
SELECT ax_define.define_authentication('TVSHOW_READER,TVSHOW_EDITOR,ADMIN', 'TVSHOW_EDITOR,ADMIN', 'episodes_directors', 'app_public');
