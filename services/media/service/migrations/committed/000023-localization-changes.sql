--! Previous: sha1:52b6978cfa3f2038977e75c1872e67df8699651c
--! Hash: sha1:50966f45912651069b92071e3c73262b023ad48e
--! Message: localization-changes

INSERT INTO app_public.snapshot_validation_issue_context (value, description)
VALUES ('LOCALIZATION', 'Localization')
ON CONFLICT (value) DO NOTHING;

INSERT INTO app_public.ingest_item_step_type (value, description)
VALUES ('LOCALIZATIONS', 'Localizations')
ON CONFLICT (value) DO NOTHING;

/*
During ingest, it is important to first send the source entity metadata to the
Localization service, and only after that to send the actual localizations for
specific locales. `ingest_correlation_id` is a dedicated column created for such
purpose. The logic looks roughly like this:
- Process the UpdateMetadata ingest item step.
- Set ingest_correlation_id to ingestItemId along with other metadata (and then
  un-set it within the same transaction).
- This triggers the sending of UpsertLocalizationSourceEntity command with an
  ingest_correlation_id value as the message context.
- Because of this, UpsertLocalizationSourceEntity handler in the localization
  service will send back a response event.
- This event is received by the media service as part of the ingest process,
  indicating that processing of the Localization Source metadata is finished, so
  Localizations can be safely sent now.
*/
ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS ingest_correlation_id INT;
GRANT UPDATE (ingest_correlation_id) ON app_public.movies TO ":DATABASE_GQL_ROLE";
COMMENT ON COLUMN app_public.movies.ingest_correlation_id is E'@omit';

ALTER TABLE app_public.episodes ADD COLUMN IF NOT EXISTS ingest_correlation_id INT;
GRANT UPDATE (ingest_correlation_id) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
COMMENT ON COLUMN app_public.episodes.ingest_correlation_id is E'@omit';

ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS ingest_correlation_id INT;
GRANT UPDATE (ingest_correlation_id) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
COMMENT ON COLUMN app_public.seasons.ingest_correlation_id is E'@omit';

ALTER TABLE app_public.tvshows ADD COLUMN IF NOT EXISTS ingest_correlation_id INT;
GRANT UPDATE (ingest_correlation_id) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
COMMENT ON COLUMN app_public.tvshows.ingest_correlation_id is E'@omit';

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
              E'\t' || 'VALUES (uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), NEW.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Created'', ''parallel'', _payload, NOW());' || E'\n' ||
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
                E'\t\t' || 'VALUES (uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), NEW.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Updated'', ''parallel'', _payload, _metadata, NOW());' || E'\n' ||
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
              E'\t' || 'VALUES (uuid_generate_v4(), app_hidden.to_kebab_case(''' || entityType || '''), OLD.' || aggregateId || ', ''Localizable'' || app_hidden.to_pascal_case(''' || entityType || ''') || ''Deleted'', ''parallel'', _payload, NOW());' || E'\n' ||
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
