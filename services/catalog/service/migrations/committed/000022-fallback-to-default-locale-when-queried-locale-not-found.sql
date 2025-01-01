--! Previous: sha1:b435c8f8592d3829683853f3d4ec57b438b63324
--! Hash: sha1:10f63e534bd7698f73c7252d270f5f07f3e2544b
--! Message: fallback-to-default-locale-when-queried-locale-not-found

/*
  Defines a view that joins the parent table and localization table, returning a
  combined set of properties. The view is exposed to the GraphQL API, replacing
  the underlying table. Naming conflicts are avoided using Postgraphile smart
  comments.
  It is recommended to use smart tags to fine-tune the resulting GraphQL schema,
  such as adding virtual constraints, adding comments, and marking fields as not-null.

  BeyondDutch: In case a locale is not found, default locale is used.
*/
DROP FUNCTION IF EXISTS app_private.define_localization_view(text[], text, text, text);
CREATE OR REPLACE FUNCTION app_private.define_localization_view(tableName text, localizationsTableName text, fkColumn text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  localizableFieldsSelect text;
BEGIN
  SELECT string_agg(c, ', ')
	INTO localizableFieldsSelect
	FROM (
		SELECT 'COALESCE(pl.' || column_name ||', dl.'||column_name||') as '|| column_name as c
		FROM information_schema.columns
		WHERE table_schema = 'app_public' AND table_name = localizationsTableName AND column_name != 'locale' AND column_name != 'id' AND column_name != 'is_default_locale' AND column_name != fkColumn
	);
        
  EXECUTE 'DROP VIEW IF EXISTS app_public.' || tableName || '_view CASCADE;';
  EXECUTE 'CREATE VIEW app_public.' || tableName || '_view AS ' ||
          'SELECT p.*, ' || localizableFieldsSelect || ' FROM app_public.' || tableName || ' as p ' ||
          'LEFT JOIN app_public.' || localizationsTableName || ' AS pl ON pl.' || fkColumn || ' = p.id AND pl.locale = (SELECT pg_catalog.current_setting('':MOSAIC_LOCALE'', true)) ' ||
		  'LEFT JOIN app_public.' || localizationsTableName || ' AS dl ON dl.' || fkColumn || ' = p.id AND dl.locale = '||' ''default'''||''; -- in case a locale is not found, default locale is used

  EXECUTE 'GRANT SELECT ON app_public.' || tableName || '_view TO ":DATABASE_GQL_ROLE";';

  EXECUTE 'COMMENT ON TABLE app_public.' || tableName || ' IS E''@omit\n@name ' || tableName || '_data'';';
  EXECUTE 'COMMENT ON TABLE app_public.' || localizationsTableName || ' IS E''@omit'';';
  EXECUTE 'COMMENT ON VIEW app_public.' || tableName || '_view IS E''@name ' || tableName || '\n@primaryKey id'';';
END;
$$;

SELECT app_private.define_localization_view(
  'movie',
  'movie_localizations',
  'movie_id');

SELECT app_private.define_localization_view(
  'movie_genre',
  'movie_genre_localizations',
  'movie_genre_id');

SELECT app_private.define_localization_view(
  'tvshow',
  'tvshow_localizations',
  'tvshow_id');

SELECT app_private.define_localization_view(
  'tvshow_genre',
  'tvshow_genre_localizations',
  'tvshow_genre_id');

SELECT app_private.define_localization_view(
  'season',
  'season_localizations',
  'season_id');

SELECT app_private.define_localization_view(
  'episode',
  'episode_localizations',
  'episode_id');

SELECT app_private.define_localization_view(
  'collection',
  'collection_localizations',
  'collection_id');
