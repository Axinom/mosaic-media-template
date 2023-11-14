--! Previous: sha1:c9457b917399b9a43ac0fc04d0e130cf728bfcb7
--! Hash: sha1:5649571f066e1b27f59ba0e5c248d5a997579aae
--! Message: localizations-added

/*
  Defines a view that joins the parent table and localization table, returning a
  combined set of properties. The view is exposed to the GraphQL API, replacing
  the underlying table. Naming conflicts are avoided using Postgraphile smart
  comments.
  It is recommended to use smart tags to fine-tune the resulting GraphQL schema,
  such as adding virtual constraints, adding comments, and marking fields as not-null.
*/
CREATE OR REPLACE FUNCTION app_private.define_localization_view(localizableFields text[], tableName text, localizationsTableName text, fkColumn text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  localizableFieldsSelect text = 'l.' || array_to_string(localizableFields, ', l.');
BEGIN
  EXECUTE 'DROP VIEW IF EXISTS app_public.' || tableName || '_view CASCADE;';
  EXECUTE 'CREATE VIEW app_public.' || tableName || '_view AS ' ||
          'SELECT p.*, c.* FROM app_public.' || tableName || ' p ' ||
          'LEFT OUTER JOIN LATERAL ( ' ||
          'SELECT ' || localizableFieldsSelect || ' ' ||
          'FROM app_public.' || localizationsTableName || ' l ' ||
          'WHERE l.' || fkColumn || ' = p.id AND (l.locale = (SELECT pg_catalog.current_setting('':MOSAIC_LOCALE'', true)) OR l.is_default_locale IS TRUE) ' ||
          'ORDER BY l.is_default_locale ASC LIMIT 1) c ON TRUE;';

  EXECUTE 'GRANT SELECT ON app_public.' || tableName || '_view TO ":DATABASE_GQL_ROLE";';

  EXECUTE 'COMMENT ON TABLE app_public.' || tableName || ' IS E''@omit\n@name ' || tableName || '_data'';';
  EXECUTE 'COMMENT ON TABLE app_public.' || localizationsTableName || ' IS E''@omit'';';
  EXECUTE 'COMMENT ON VIEW app_public.' || tableName || '_view IS E''@name ' || tableName || '\n@primaryKey id'';';
END;
$$;

-- Movies
CREATE TABLE IF NOT EXISTS app_public.movie_localizations(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  movie_id TEXT REFERENCES movie ON DELETE CASCADE,
  locale TEXT NOT NULL,
  is_default_locale BOOLEAN NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  synopsis TEXT
);

SELECT ax_define.define_index('movie_id', 'movie_localizations', 'app_public');
SELECT ax_define.define_index('locale', 'movie_localizations', 'app_public');

-- Migrate values for the default locale into the table.
DO $$ BEGIN
  IF ax_define.column_exists('title', 'movie', 'app_public') THEN
    INSERT INTO app_public.movie_localizations
    (movie_id, title, description, synopsis, locale, is_default_locale)
    SELECT m.id, m.title, m.description, m.synopsis, ':DEFAULT_LOCALE_TAG', true
    FROM app_public.movie m
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

ALTER TABLE app_public.movie DROP COLUMN IF EXISTS title;
ALTER TABLE app_public.movie DROP COLUMN IF EXISTS description;
ALTER TABLE app_public.movie DROP COLUMN IF EXISTS synopsis;

SELECT app_private.define_localization_view(
  ARRAY['title', 'description', 'synopsis'],
  'movie',
  'movie_localizations',
  'movie_id');

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movie_localizations TO ":DATABASE_GQL_ROLE";

-- Movie Genres
CREATE TABLE IF NOT EXISTS app_public.movie_genre_localizations(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  movie_genre_id TEXT REFERENCES movie_genre ON DELETE CASCADE,
  locale TEXT NOT NULL,
  is_default_locale BOOLEAN NOT NULL,
  title TEXT NOT NULL
);

SELECT ax_define.define_index('movie_genre_id', 'movie_genre_localizations', 'app_public');
SELECT ax_define.define_index('locale', 'movie_genre_localizations', 'app_public');

-- Migrate values for the default locale into the table.
DO $$ BEGIN
  IF ax_define.column_exists('title', 'movie_genre', 'app_public') THEN
    INSERT INTO app_public.movie_genre_localizations
    (movie_genre_id, title, locale, is_default_locale)
    SELECT g.id, g.title, ':DEFAULT_LOCALE_TAG', true
    FROM app_public.movie_genre g
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

ALTER TABLE app_public.movie_genre DROP COLUMN IF EXISTS title;

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.movie_genre_localizations TO ":DATABASE_GQL_ROLE";

SELECT app_private.define_localization_view(
  ARRAY['title'],
  'movie_genre',
  'movie_genre_localizations',
  'movie_genre_id');

-- Tvshows
CREATE TABLE IF NOT EXISTS app_public.tvshow_localizations(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  tvshow_id TEXT REFERENCES tvshow ON DELETE CASCADE,
  locale TEXT NOT NULL,
  is_default_locale BOOLEAN NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  synopsis TEXT
);

SELECT ax_define.define_index('tvshow_id', 'tvshow_localizations', 'app_public');
SELECT ax_define.define_index('locale', 'tvshow_localizations', 'app_public');

-- Migrate values for the default locale into the table.
DO $$ BEGIN
  IF ax_define.column_exists('title', 'tvshow', 'app_public') THEN
    INSERT INTO app_public.tvshow_localizations
    (tvshow_id, title, description, synopsis, locale, is_default_locale)
    SELECT t.id, t.title, t.description, t.synopsis, ':DEFAULT_LOCALE_TAG', true
    FROM app_public.tvshow t
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

ALTER TABLE app_public.tvshow DROP COLUMN IF EXISTS title;
ALTER TABLE app_public.tvshow DROP COLUMN IF EXISTS description;
ALTER TABLE app_public.tvshow DROP COLUMN IF EXISTS synopsis;

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.tvshow_localizations TO ":DATABASE_GQL_ROLE";

SELECT app_private.define_localization_view(
  ARRAY['title', 'description', 'synopsis'],
  'tvshow',
  'tvshow_localizations',
  'tvshow_id');

-- Tvshow Genres
CREATE TABLE IF NOT EXISTS app_public.tvshow_genre_localizations(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  tvshow_genre_id TEXT REFERENCES tvshow_genre ON DELETE CASCADE,
  locale TEXT NOT NULL,
  is_default_locale BOOLEAN NOT NULL,
  title TEXT NOT NULL
);

SELECT ax_define.define_index('tvshow_genre_id', 'tvshow_genre_localizations', 'app_public');
SELECT ax_define.define_index('locale', 'tvshow_genre_localizations', 'app_public');

-- Migrate values for the default locale into the table.
DO $$ BEGIN
  IF ax_define.column_exists('title', 'tvshow_genre', 'app_public') THEN
    INSERT INTO app_public.tvshow_genre_localizations
    (tvshow_genre_id, title, locale, is_default_locale)
    SELECT g.id, g.title, ':DEFAULT_LOCALE_TAG', true
    FROM app_public.tvshow_genre g
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

ALTER TABLE app_public.tvshow_genre DROP COLUMN IF EXISTS title;

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.tvshow_genre_localizations TO ":DATABASE_GQL_ROLE";

SELECT app_private.define_localization_view(
  ARRAY['title'],
  'tvshow_genre',
  'tvshow_genre_localizations',
  'tvshow_genre_id');

-- Seasons
CREATE TABLE IF NOT EXISTS app_public.season_localizations(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  season_id TEXT REFERENCES season ON DELETE CASCADE,
  locale TEXT NOT NULL,
  is_default_locale BOOLEAN NOT NULL,
  description TEXT,
  synopsis TEXT
);

SELECT ax_define.define_index('season_id', 'season_localizations', 'app_public');
SELECT ax_define.define_index('locale', 'season_localizations', 'app_public');

-- Migrate values for the default locale into the table.
DO $$ BEGIN
  IF ax_define.column_exists('description', 'season', 'app_public') THEN
    INSERT INTO app_public.season_localizations
    (season_id, description, synopsis, locale, is_default_locale)
    SELECT s.id, s.description, s.synopsis, ':DEFAULT_LOCALE_TAG', true
    FROM app_public.season s
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

ALTER TABLE app_public.season DROP COLUMN IF EXISTS description;
ALTER TABLE app_public.season DROP COLUMN IF EXISTS synopsis;

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.season_localizations TO ":DATABASE_GQL_ROLE";

SELECT app_private.define_localization_view(
  ARRAY['description', 'synopsis'],
  'season',
  'season_localizations',
  'season_id');

-- Episodes
CREATE TABLE IF NOT EXISTS app_public.episode_localizations(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  episode_id TEXT REFERENCES episode ON DELETE CASCADE,
  locale TEXT NOT NULL,
  is_default_locale BOOLEAN NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  synopsis TEXT
);

SELECT ax_define.define_index('episode_id', 'episode_localizations', 'app_public');
SELECT ax_define.define_index('locale', 'episode_localizations', 'app_public');

-- Migrate values for the default locale into the table.
DO $$ BEGIN
  IF ax_define.column_exists('title', 'episode', 'app_public') THEN
    INSERT INTO app_public.episode_localizations
    (episode_id, title, description, synopsis, locale, is_default_locale)
    SELECT e.id, e.title, e.description, e.synopsis, ':DEFAULT_LOCALE_TAG', true
    FROM app_public.episode e
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

ALTER TABLE app_public.episode DROP COLUMN IF EXISTS title;
ALTER TABLE app_public.episode DROP COLUMN IF EXISTS description;
ALTER TABLE app_public.episode DROP COLUMN IF EXISTS synopsis;

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.episode_localizations TO ":DATABASE_GQL_ROLE";

SELECT app_private.define_localization_view(
  ARRAY['title', 'description', 'synopsis'],
  'episode',
  'episode_localizations',
  'episode_id');

-- Collections
CREATE TABLE IF NOT EXISTS app_public.collection_localizations(
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  collection_id TEXT REFERENCES collection ON DELETE CASCADE,
  locale TEXT NOT NULL,
  is_default_locale BOOLEAN NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  synopsis TEXT
);

SELECT ax_define.define_index('collection_id', 'collection_localizations', 'app_public');
SELECT ax_define.define_index('locale', 'collection_localizations', 'app_public');

-- Migrate values for the default locale into the table.
DO $$ BEGIN
  IF ax_define.column_exists('title', 'collection', 'app_public') THEN
    INSERT INTO app_public.collection_localizations
    (collection_id, title, description, synopsis, locale, is_default_locale)
    SELECT c.id, c.title, c.description, c.synopsis, ':DEFAULT_LOCALE_TAG', true
    FROM app_public.collection c
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

ALTER TABLE app_public.collection DROP COLUMN IF EXISTS title;
ALTER TABLE app_public.collection DROP COLUMN IF EXISTS description;
ALTER TABLE app_public.collection DROP COLUMN IF EXISTS synopsis;

GRANT SELECT, INSERT, UPDATE, DELETE ON app_public.collection_localizations TO ":DATABASE_GQL_ROLE";

SELECT app_private.define_localization_view(
  ARRAY['title', 'description', 'synopsis'],
  'collection',
  'collection_localizations',
  'collection_id');