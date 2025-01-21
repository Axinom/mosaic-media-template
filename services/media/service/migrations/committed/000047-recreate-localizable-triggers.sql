--! Previous: sha1:642fb5b2ab308dab7a08173fa46c6d7b276ad822
--! Hash: sha1:4242e4d447c4279479cfce85990fde64387fe514
--! Message: recreate-localizable-triggers

-- Add public. prefix to uuid_generate_v4() function
/*
Generates an AFTER INSERT, AFTER UPDATE, and AFTER DELETE trigger for the
specified table. Triggers insert an entry into the app_hidden.inbox table
whenever a change that is relevant for the localization is done on the table.
INSERT and DELETE triggers will always insert an entry into the inbox table.
UPDATE trigger is conditional and will only insert the inbox table entry if at
least one localizable field was changed, or if ingest_correlation_id was set
during entity update operation.

`tests/localization` folder contains tests for these triggers, including mapping
of messaging-related columns to the MessagingSettings that would be used for
pulling the inbox entries and executing relevant message handler logic. 
*/
CREATE OR REPLACE FUNCTION app_hidden.create_localizable_entity_triggers(aggregateId text, tableName text, entityType text, localizable_fields text, required_fields text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.localizable_' || entityType || '_insert() RETURNS TRIGGER AS $body$' || E'\n' ||
            'DECLARE' || E'\n' ||
              E'\t' || '_jsonb_new jsonb := row_to_json(NEW.*);' || E'\n' ||
              E'\t' || '_fields text[] := string_to_array(''' || localizable_fields || ''', '','') || string_to_array(''' || required_fields || ''', '','');' || E'\n' ||
              E'\t' || '_payload jsonb := ''{}''::jsonb;' || E'\n' ||
              E'\t' || '_field text;' || E'\n' ||
            'BEGIN' || E'\n' ||
              E'\t' || 'FOREACH _field IN ARRAY _fields' || E'\n' ||
              E'\t' || 'LOOP' || E'\n' ||
                E'\t\t' || 'IF coalesce(_jsonb_new ->> _field, '''') != '''' THEN' || E'\n' ||
                  E'\t\t\t' || '_payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field);' || E'\n' ||
                E'\t\t' || 'END IF;' || E'\n' ||
              E'\t' || 'END LOOP;' || E'\n' ||
              E'\t' || 'INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at)' || E'\n' ||
              E'\t' || 'VALUES (public.uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), NEW.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Created'', ''parallel'', _payload, NOW());' || E'\n' ||
              E'\t' || 'RETURN NEW;' || E'\n' ||
            'END;' || E'\n' ||
            '$body$ LANGUAGE plpgsql volatile;';

    EXECUTE 'DROP trigger IF EXISTS _900_localizable_' || entityType || '_insert on app_public.' || tableName || ';';
    EXECUTE 'CREATE trigger _900_localizable_' || entityType || '_insert ' ||
            'AFTER INSERT ON app_public.' || tableName || ' FOR EACH ROW WHEN (app_hidden.is_localization_enabled() IS TRUE) ' ||
            'EXECUTE PROCEDURE app_hidden.localizable_' || entityType || '_insert();';

    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.localizable_' || entityType || '_update() RETURNS TRIGGER AS $body$' || E'\n' ||
            'DECLARE' || E'\n' ||
              E'\t' || '_jsonb_old jsonb := row_to_json(OLD.*);' || E'\n' ||
              E'\t' || '_jsonb_new jsonb := row_to_json(NEW.*);' || E'\n' ||
              E'\t' || '_required_fields text[] := string_to_array(''' || required_fields || ''', '','');' || E'\n' ||
              E'\t' || '_localizable_fields text[] := string_to_array(''' || localizable_fields || ''', '','');' || E'\n' ||
              E'\t' || '_payload jsonb := ''{}''::jsonb;' || E'\n' ||
              E'\t' || '_metadata jsonb;' || E'\n' ||
              E'\t' || '_field text;' || E'\n' ||
            'BEGIN' || E'\n' ||
              E'\t' || 'FOREACH _field IN ARRAY _localizable_fields' || E'\n' ||
              E'\t' || 'LOOP' || E'\n' ||
                E'\t\t' || 'IF coalesce(_jsonb_old ->> _field, '''') != coalesce(_jsonb_new ->> _field, '''') THEN' || E'\n' ||
                  E'\t\t\t' || '_payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field);' || E'\n' ||
                E'\t\t' || 'END IF;' || E'\n' ||
              E'\t' || 'END LOOP;' || E'\n' ||
              E'\t' || 'IF _jsonb_new ->> ''ingest_correlation_id'' IS NOT NULL THEN' || E'\n' ||
                  E'\t\t\t' || '_metadata := jsonb_build_object(''messageContext'', jsonb_build_object(''ingestItemId'', _jsonb_new -> ''ingest_correlation_id''));' || E'\n' ||
              E'\t' || 'END IF;' || E'\n' ||
              E'\t' || 'IF _payload != ''{}''::jsonb OR _metadata IS NOT NULL THEN' ||  E'\n' ||        
                E'\t\t' || 'FOREACH _field IN ARRAY _required_fields' || E'\n' ||
                E'\t\t' || 'LOOP' || E'\n' ||
                  E'\t\t\t' || '_payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field);' || E'\n' ||
                E'\t\t' || 'END LOOP;' || E'\n' ||
                E'\t\t' || 'INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at)' || E'\n' ||
                E'\t\t' || 'VALUES (public.uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), NEW.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Updated'', ''parallel'', _payload, _metadata, NOW());' || E'\n' ||
              E'\t' || 'END IF;' || E'\n' ||
              E'\t' || 'RETURN NEW;' || E'\n' ||
            'END;' || E'\n' ||
            '$body$ LANGUAGE plpgsql volatile;';

    EXECUTE 'DROP trigger IF EXISTS _900_localizable_' || entityType || '_update on app_public.' || tableName || ';';
    EXECUTE 'CREATE trigger _900_localizable_' || entityType || '_update ' ||
            'AFTER UPDATE ON app_public.' || tableName || ' FOR EACH ROW WHEN (app_hidden.is_localization_enabled() IS TRUE) ' ||
            'EXECUTE PROCEDURE app_hidden.localizable_' || entityType || '_update();';

    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.localizable_' || entityType || '_delete() RETURNS TRIGGER AS $body$' || E'\n' ||
            'DECLARE' || E'\n' ||
              E'\t' || '_jsonb_old jsonb := row_to_json(OLD.*);' || E'\n' ||
              E'\t' || '_fields text[] := string_to_array(''' || required_fields || ''', '','');' || E'\n' ||
              E'\t' || '_payload jsonb := ''{}''::jsonb;' || E'\n' ||
            'BEGIN' || E'\n' ||
              E'\t' || 'SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field)' || E'\n' ||
              E'\t' || 'FROM (SELECT unnest(_fields) AS field) as f INTO _payload;' || E'\n' ||
              E'\t' || 'INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at)' || E'\n' ||
              E'\t' || 'VALUES (public.uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), OLD.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Deleted'', ''parallel'', _payload, NOW());' || E'\n' ||
              E'\t' || 'RETURN OLD;' || E'\n' ||
            'END;' || E'\n' ||
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
