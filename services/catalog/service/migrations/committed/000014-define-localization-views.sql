--! Previous: sha1:70d257dd2762855775713a0331d6d5cac66c5d7c
--! Hash: sha1:3ecd8b7c4bd5d115962f96d5facd39b2d8318bd6
--! Message: define-localization-views

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

SELECT app_private.define_localization_view(
  ARRAY['title', 'description'],
  'channel',
  'channel_localizations',
  'channel_id');
