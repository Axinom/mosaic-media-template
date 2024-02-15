--! Previous: sha1:8c2406bddb2aec8bcab649daf4039e6f830e4bf1
--! Hash: sha1:ee68b0f09af5693a0539a04dfe28107943427399
--! Message: localizable-entity-triggers-added

-- transactional inbox table
DROP TABLE IF EXISTS app_hidden.inbox CASCADE;
CREATE TABLE app_hidden.inbox (
  id uuid PRIMARY KEY,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  message_type TEXT NOT NULL,
  segment TEXT,
  concurrency TEXT NOT NULL DEFAULT 'sequential',
  payload JSONB NOT NULL,
  metadata JSONB,
  locked_until TIMESTAMPTZ NOT NULL DEFAULT to_timestamp(0),
  created_at TIMESTAMPTZ NOT NULL,
  processed_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ,
  started_attempts smallint NOT NULL DEFAULT 0,
  finished_attempts smallint NOT NULL DEFAULT 0
);

GRANT SELECT ON app_hidden.inbox TO ":DATABASE_GQL_ROLE";
GRANT INSERT (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) ON app_hidden.inbox TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (started_attempts, finished_attempts, processed_at, abandoned_at) ON app_hidden.inbox TO ":DATABASE_GQL_ROLE";

-- Localizable trigger helpers
CREATE OR REPLACE FUNCTION app_hidden.to_pascal_case(input_value text) RETURNS TEXT  AS $$
BEGIN
  RETURN replace(initcap(replace(input_value, '_', ' ')), ' ', '');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION app_hidden.to_kebab_case(input_value text) RETURNS TEXT  AS $$
BEGIN
  RETURN lower(replace(input_value, '_', '-'));
END;
$$ LANGUAGE plpgsql;

/*
This is the initial implementation to make sure that triggers below can be
created. This function is overridden on every service startup using 
`setIsLocalizationEnabledDbFunction` call and depends on the value of
`IS_LOCALIZATION_ENABLED` environment variable.
*/
CREATE OR REPLACE FUNCTION app_hidden.is_localization_enabled()
  RETURNS boolean AS
  $f$SELECT FALSE $f$ LANGUAGE sql IMMUTABLE;

/*
Generates an AFTER INSERT, AFTER UPDATE, and AFTER DELETE trigger for the
specified table. Triggers insert an entry into the app_hidden.inbox table
whenever a change that is relevant for the localization is done on the table.
Localizable and Required field parameters are used to determine in entry should
be inserted on update operation. Insert and delete operations are unconditional.

`tests/localization` folder contains tests for these triggers, including mapping
of messaging-related columns to the MessagingSettings that would be used for
pulling the inbox entries and executing relevant message handler logic. 
*/
CREATE OR REPLACE FUNCTION app_hidden.create_localizable_entity_triggers(aggregateId text, tableName text, entityType text, localizable_fields text, required_fields text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.localizable_' || entityType || '_insert() RETURNS TRIGGER AS $body$ ' ||
            'DECLARE ' ||
              '_jsonb_new jsonb := row_to_json(NEW.*); ' ||
              '_fields text[] := string_to_array(''' || localizable_fields || ''', '','') || string_to_array(''' || required_fields || ''', '',''); ' ||
              '_payload jsonb := ''{}''::jsonb; ' ||
              '_field text; ' ||
            'BEGIN ' ||
              'FOREACH _field IN ARRAY _fields ' ||
              'LOOP ' ||
                'IF coalesce(_jsonb_new ->> _field, '''') != '''' THEN ' ||
                  '_payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); '
                'END IF; ' ||
              'END LOOP; ' ||
              'INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) ' ||
              'VALUES (uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), NEW.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Created'', ''parallel'', _payload, NOW()); ' ||
              'RETURN NEW; ' ||
            'END; ' ||
            '$body$ LANGUAGE plpgsql volatile;';

    EXECUTE 'DROP trigger IF EXISTS _900_localizable_' || entityType || '_insert on app_public.' || tableName || ';';
    EXECUTE 'CREATE trigger _900_localizable_' || entityType || '_insert ' ||
            'AFTER INSERT ON app_public.' || tableName || ' FOR EACH ROW WHEN (app_hidden.is_localization_enabled() IS TRUE) ' ||
            'EXECUTE PROCEDURE app_hidden.localizable_' || entityType || '_insert();';

    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.localizable_' || entityType || '_update() RETURNS TRIGGER AS $body$ ' ||
            'DECLARE ' ||
              '_jsonb_old jsonb := row_to_json(OLD.*); ' ||
              '_jsonb_new jsonb := row_to_json(NEW.*); ' ||
              '_required_fields text[] := string_to_array(''' || required_fields || ''', '',''); ' ||
              '_localizable_fields text[] := string_to_array(''' || localizable_fields || ''', '',''); ' ||
              '_payload jsonb := ''{}''::jsonb; ' ||
              '_metadata jsonb; ' ||
              '_field text; ' ||
            'BEGIN ' ||
              'FOREACH _field IN ARRAY _localizable_fields ' ||
              'LOOP ' ||
                'IF coalesce(_jsonb_old ->> _field, '''') != coalesce(_jsonb_new ->> _field, '''') THEN ' ||
                  '_payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); '
                'END IF; ' ||
              'END LOOP; ' ||
              'IF _jsonb_new ->> ''ingest_correlation_id'' IS NOT NULL THEN ' ||
                  '_metadata := jsonb_build_object(''messageContext'', jsonb_build_object(''ingestItemId'', _jsonb_new -> ''ingest_correlation_id'')); '
              'END IF; ' ||
              'IF _payload != ''{}''::jsonb OR _metadata IS NOT NULL THEN ' ||          
                'FOREACH _field IN ARRAY _required_fields ' ||
                'LOOP ' ||
                  '_payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); '
                'END LOOP; ' ||
                'INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) ' ||
                'VALUES (uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), NEW.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Updated'', ''parallel'', _payload, _metadata, NOW()); ' ||
              'END IF; ' ||
              'RETURN NEW; ' ||
            'END; ' ||
            '$body$ LANGUAGE plpgsql volatile;';

    EXECUTE 'DROP trigger IF EXISTS _900_localizable_' || entityType || '_update on app_public.' || tableName || ';';
    EXECUTE 'CREATE trigger _900_localizable_' || entityType || '_update ' ||
            'AFTER UPDATE ON app_public.' || tableName || ' FOR EACH ROW WHEN (app_hidden.is_localization_enabled() IS TRUE) ' ||
            'EXECUTE PROCEDURE app_hidden.localizable_' || entityType || '_update();';

    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.localizable_' || entityType || '_delete() RETURNS TRIGGER AS $body$ ' ||
            'DECLARE ' ||
              '_jsonb_old jsonb := row_to_json(OLD.*); ' ||
              '_fields text[] := string_to_array(''' || required_fields || ''', '',''); ' ||
              '_payload jsonb := ''{}''::jsonb; ' ||
            'BEGIN ' ||
              'SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) ' ||
              'FROM (SELECT unnest(_fields) AS field) as f INTO _payload; ' ||
              'INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) ' ||
              'VALUES (uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), OLD.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Deleted'', ''parallel'', _payload, NOW()); ' ||
              'RETURN OLD; ' ||
            'END; ' ||
            '$body$ LANGUAGE plpgsql volatile;';

    EXECUTE 'DROP trigger IF EXISTS _900_localizable_' || entityType || '_delete on app_public.' || tableName || ';';
    EXECUTE 'CREATE trigger _900_localizable_' || entityType || '_delete ' ||
            'AFTER DELETE ON app_public.' || tableName || ' FOR EACH ROW WHEN (app_hidden.is_localization_enabled() IS TRUE) ' ||
            'EXECUTE PROCEDURE app_hidden.localizable_' || entityType || '_delete();';
END;
$$;


SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'movie_genres', 'MOVIE_GENRE', ':MOVIE_GENRE_LOCALIZABLE_FIELDS',':MOVIE_GENRE_LOCALIZATION_REQUIRED_FIELDS');
SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'movies', 'MOVIE', ':MOVIE_LOCALIZABLE_FIELDS',':MOVIE_LOCALIZATION_REQUIRED_FIELDS');
SELECT app_hidden.create_localizable_entity_triggers(
  'image_id', 'movies_images', 'MOVIE_IMAGE', ':MOVIE_IMAGE_LOCALIZABLE_FIELDS',':MOVIE_IMAGE_LOCALIZATION_REQUIRED_FIELDS');

SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'tvshow_genres', 'TVSHOW_GENRE', ':TVSHOW_GENRE_LOCALIZABLE_FIELDS',':TVSHOW_GENRE_LOCALIZATION_REQUIRED_FIELDS');
SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'tvshows', 'TVSHOW', ':TVSHOW_LOCALIZABLE_FIELDS',':TVSHOW_LOCALIZATION_REQUIRED_FIELDS');
SELECT app_hidden.create_localizable_entity_triggers(
  'image_id', 'tvshows_images', 'TVSHOW_IMAGE', ':TVSHOW_IMAGE_LOCALIZABLE_FIELDS',':TVSHOW_IMAGE_LOCALIZATION_REQUIRED_FIELDS');

SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'seasons', 'SEASON', ':SEASON_LOCALIZABLE_FIELDS',':SEASON_LOCALIZATION_REQUIRED_FIELDS');
SELECT app_hidden.create_localizable_entity_triggers(
  'image_id', 'seasons_images', 'SEASON_IMAGE', ':SEASON_IMAGE_LOCALIZABLE_FIELDS',':SEASON_IMAGE_LOCALIZATION_REQUIRED_FIELDS');

SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'episodes', 'EPISODE', ':EPISODE_LOCALIZABLE_FIELDS',':EPISODE_LOCALIZATION_REQUIRED_FIELDS');
SELECT app_hidden.create_localizable_entity_triggers(
  'image_id', 'episodes_images', 'EPISODE_IMAGE', ':EPISODE_IMAGE_LOCALIZABLE_FIELDS',':EPISODE_IMAGE_LOCALIZATION_REQUIRED_FIELDS');

SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'collections', 'COLLECTION', ':COLLECTION_LOCALIZABLE_FIELDS',':COLLECTION_LOCALIZATION_REQUIRED_FIELDS');
SELECT app_hidden.create_localizable_entity_triggers(
  'image_id', 'collections_images', 'COLLECTION_IMAGE', ':COLLECTION_IMAGE_LOCALIZABLE_FIELDS',':COLLECTION_IMAGE_LOCALIZATION_REQUIRED_FIELDS');
