--! Previous: sha1:ed200bb5de90a7d4d7ab04cc493b5e8c3da35189
--! Hash: sha1:2bf6facfe4d784a9d5e284749eb7987fe27c9cf2
--! Message: localizations-view-approach-adjusted

-- Update the localization views

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
          'SELECT p.*, ' || localizableFieldsSelect || ' FROM app_public.' || localizationsTableName || ' as l ' ||
          'JOIN app_public.' || tableName || ' AS p ON l.' || fkColumn || ' = p.id ' ||
          'WHERE l.locale = (SELECT pg_catalog.current_setting('':MOSAIC_LOCALE'', true));';

  EXECUTE 'GRANT SELECT ON app_public.' || tableName || '_view TO ":DATABASE_GQL_ROLE";';

  EXECUTE 'COMMENT ON TABLE app_public.' || tableName || ' IS E''@omit\n@name ' || tableName || '_data'';';
  EXECUTE 'COMMENT ON TABLE app_public.' || localizationsTableName || ' IS E''@omit'';';
  EXECUTE 'COMMENT ON VIEW app_public.' || tableName || '_view IS E''@name ' || tableName || '\n@primaryKey id'';';
END;
$$;

SELECT app_private.define_localization_view(
  ARRAY['title', 'description', 'synopsis'],
  'movie',
  'movie_localizations',
  'movie_id');

SELECT app_private.define_localization_view(
  ARRAY['title'],
  'movie_genre',
  'movie_genre_localizations',
  'movie_genre_id');

SELECT app_private.define_localization_view(
  ARRAY['title', 'description', 'synopsis'],
  'tvshow',
  'tvshow_localizations',
  'tvshow_id');

SELECT app_private.define_localization_view(
  ARRAY['title'],
  'tvshow_genre',
  'tvshow_genre_localizations',
  'tvshow_genre_id');

SELECT app_private.define_localization_view(
  ARRAY['description', 'synopsis'],
  'season',
  'season_localizations',
  'season_id');

SELECT app_private.define_localization_view(
  ARRAY['title', 'description', 'synopsis'],
  'episode',
  'episode_localizations',
  'episode_id');

SELECT app_private.define_localization_view(
  ARRAY['title', 'description', 'synopsis'],
  'collection',
  'collection_localizations',
  'collection_id');

-- Add a table to store a list of available locales
DROP TABLE IF EXISTS app_public.locales CASCADE;
CREATE TABLE app_public.locales (
  locale TEXT NOT NULL PRIMARY KEY,
  is_default BOOLEAN NOT NULL DEFAULT FALSE
);

GRANT SELECT ON app_public.locales TO ":DATABASE_GQL_ROLE";

/*
* A function to be called only when `app_public.locales` table has no entries to 
* populate it using the contents of *_localizations tables. Expectation for each
* table to have the same locales, so only the first non-empty table would be
* used to populate the locales.
*/
CREATE OR REPLACE FUNCTION app_private.set_initial_locales()
RETURNS text[] AS $$
DECLARE
    tableName text;
    localeRecord RECORD;
    localesFound text[] := '{}';
    query text;
BEGIN
    FOR tableName IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'app_public' AND table_name LIKE '%_localizations'
    LOOP
        IF localesFound != '{}' THEN
            -- If locales have been found in a previous iteration, exit the loop
            EXIT;
        END IF;

        query := 'SELECT DISTINCT locale, is_default_locale FROM app_public.' || tableName || ';';
        FOR localeRecord IN EXECUTE query
        LOOP
          IF localesFound = '{}' THEN
            -- If something is found and this is the first locale to be
            -- processed - drop existing locales
            DELETE FROM app_public.locales;
          END IF;

          INSERT INTO app_public.locales (locale, is_default)
          VALUES (localeRecord.locale, localeRecord.is_default_locale)
          ON CONFLICT (locale) DO NOTHING;

          localesFound := array_append(localesFound, localeRecord.locale);
        END LOOP;
    END LOOP;

    RETURN localesFound;
END;
$$ LANGUAGE plpgsql;

-- Add indexes for localizable titles
SELECT ax_define.define_like_index('title', 'movie_localizations', 'app_public');
SELECT ax_define.define_indexes_with_id(
  fieldName => 'title', 
  tableName => 'movie_localizations', 
  schemaName => 'app_public', 
  idFieldName => 'movie_id');

SELECT ax_define.define_like_index('title', 'movie_genre_localizations', 'app_public');
SELECT ax_define.define_indexes_with_id(
  fieldName => 'title', 
  tableName => 'movie_genre_localizations', 
  schemaName => 'app_public', 
  idFieldName => 'movie_genre_id');

SELECT ax_define.define_like_index('title', 'tvshow_localizations', 'app_public');
SELECT ax_define.define_indexes_with_id(
  fieldName => 'title', 
  tableName => 'tvshow_localizations', 
  schemaName => 'app_public', 
  idFieldName => 'tvshow_id');

SELECT ax_define.define_like_index('title', 'tvshow_genre_localizations', 'app_public');
SELECT ax_define.define_indexes_with_id(
  fieldName => 'title', 
  tableName => 'tvshow_genre_localizations', 
  schemaName => 'app_public', 
  idFieldName => 'tvshow_genre_id');

SELECT ax_define.define_like_index('title', 'episode_localizations', 'app_public');
SELECT ax_define.define_indexes_with_id(
  fieldName => 'title', 
  tableName => 'episode_localizations', 
  schemaName => 'app_public', 
  idFieldName => 'episode_id');

SELECT ax_define.define_like_index('title', 'collection_localizations', 'app_public');
SELECT ax_define.define_indexes_with_id(
  fieldName => 'title', 
  tableName => 'collection_localizations', 
  schemaName => 'app_public', 
  idFieldName => 'collection_id');

-- Make sure only one row can be added for each combination of locale and FK
ALTER TABLE app_public.movie_localizations DROP CONSTRAINT IF EXISTS unique_by_movie_id_and_locale;
ALTER TABLE app_public.movie_localizations ADD CONSTRAINT unique_by_movie_id_and_locale UNIQUE(movie_id, locale);

ALTER TABLE app_public.movie_genre_localizations DROP CONSTRAINT IF EXISTS unique_by_movie_genre_id_and_locale;
ALTER TABLE app_public.movie_genre_localizations ADD CONSTRAINT unique_by_movie_genre_id_and_locale UNIQUE(movie_genre_id, locale);

ALTER TABLE app_public.tvshow_localizations DROP CONSTRAINT IF EXISTS unique_by_tvshow_id_and_locale;
ALTER TABLE app_public.tvshow_localizations ADD CONSTRAINT unique_by_tvshow_id_and_locale UNIQUE(tvshow_id, locale);

ALTER TABLE app_public.tvshow_genre_localizations DROP CONSTRAINT IF EXISTS unique_by_tvshow_genre_id_and_locale;
ALTER TABLE app_public.tvshow_genre_localizations ADD CONSTRAINT unique_by_tvshow_genre_id_and_locale UNIQUE(tvshow_genre_id, locale);

ALTER TABLE app_public.season_localizations DROP CONSTRAINT IF EXISTS unique_by_season_id_and_locale;
ALTER TABLE app_public.season_localizations ADD CONSTRAINT unique_by_season_id_and_locale UNIQUE(season_id, locale);

ALTER TABLE app_public.episode_localizations DROP CONSTRAINT IF EXISTS unique_by_episode_id_and_locale;
ALTER TABLE app_public.episode_localizations ADD CONSTRAINT unique_by_episode_id_and_locale UNIQUE(episode_id, locale);

ALTER TABLE app_public.collection_localizations DROP CONSTRAINT IF EXISTS unique_by_collection_id_and_locale;
ALTER TABLE app_public.collection_localizations ADD CONSTRAINT unique_by_collection_id_and_locale UNIQUE(collection_id, locale);

-- Add migration function to call whenever a new locale is added.

/*
* Migration function to add default fallback entries for new locales, in case
* not all entities are published while including the new locale values.
* Finds names of all existing tables in `app_public` schema that end with
* `_localizations`, iterates through each name. For each found table, gets all
* rows where is_default_locale is true, and re-inserts them with new UUID and
* new locale. Skips already existing rows.
*/
CREATE OR REPLACE FUNCTION app_private.add_default_placeholder_localizations(newLocale text)
RETURNS void AS $$
DECLARE
    tableName text;
    columnNames text[];
    columnNamesStr text;
    foreignKey text;
BEGIN
    FOR tableName IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'app_public' AND table_name LIKE '%_localizations'
    LOOP
        SELECT array_agg(column_name)
        INTO columnNames
        FROM information_schema.columns
        WHERE table_schema = 'app_public' AND table_name = tableName AND column_name != 'locale' AND column_name != 'id' AND column_name != 'is_default_locale';
        
        SELECT columnName
        INTO foreignKey
        FROM UNNEST(columnNames) AS columnName
        WHERE columnName ILIKE '%_id';

        columnNamesStr := array_to_string(columnNames, ', ');
        EXECUTE 'INSERT INTO app_public.' || tableName || ' (' || columnNamesStr || ', locale, is_default_locale) ' ||
            'SELECT ' || columnNamesStr || ', ''' || newLocale || ''', FALSE ' ||
            'FROM app_public.' || tableName || ' ' ||
            'WHERE is_default_locale = TRUE ' ||
            'ON CONFLICT (' || foreignKey || ', locale) DO NOTHING;';
    END LOOP;
END;
$$ LANGUAGE plpgsql;
