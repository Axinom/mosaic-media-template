--
-- PostgreSQL database dump
--

-- Dumped from database version 11.12
-- Dumped by pg_dump version 11.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: app_hidden; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_hidden;


--
-- Name: app_private; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_private;


--
-- Name: app_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_public;


--
-- Name: ax_define; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA ax_define;


--
-- Name: ax_utils; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA ax_utils;


--
-- Name: postgraphile_watch; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA postgraphile_watch;


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: collection_image_type_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.collection_image_type_enum AS text;


--
-- Name: entity_type_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.entity_type_enum AS text;


--
-- Name: episode_image_type_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.episode_image_type_enum AS text;


--
-- Name: ingest_document_object; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.ingest_document_object AS jsonb;


--
-- Name: ingest_entity_exists_status_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.ingest_entity_exists_status_enum AS text;


--
-- Name: ingest_item_object; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.ingest_item_object AS jsonb;


--
-- Name: ingest_item_status_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.ingest_item_status_enum AS text;


--
-- Name: ingest_item_step_status_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.ingest_item_step_status_enum AS text;


--
-- Name: ingest_item_step_type_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.ingest_item_step_type_enum AS text;


--
-- Name: ingest_item_type_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.ingest_item_type_enum AS text;


--
-- Name: ingest_status_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.ingest_status_enum AS text;


--
-- Name: iso_alpha_two_country_codes_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.iso_alpha_two_country_codes_enum AS text;


--
-- Name: movie_image_type_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.movie_image_type_enum AS text;


--
-- Name: publish_status_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.publish_status_enum AS text;


--
-- Name: season_image_type_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.season_image_type_enum AS text;


--
-- Name: snapshot_state_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.snapshot_state_enum AS text;


--
-- Name: snapshot_validation_issue_context_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.snapshot_validation_issue_context_enum AS text;


--
-- Name: snapshot_validation_issue_severity_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.snapshot_validation_issue_severity_enum AS text;


--
-- Name: snapshot_validation_status_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.snapshot_validation_status_enum AS text;


--
-- Name: tvshow_image_type_enum; Type: DOMAIN; Schema: app_public; Owner: -
--

CREATE DOMAIN app_public.tvshow_image_type_enum AS text;


--
-- Name: create_active_snapshots_before_delete_trigger(text, text, text, text); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.create_active_snapshots_before_delete_trigger(tablename text, relationtablename text, relationfkname text, entitytypename text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
  EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.tg_' || tableName || '__check_active_snapshots() RETURNS trigger AS $snap$ ' ||
          'BEGIN ' ||
            'IF EXISTS (SELECT '''' ' ||
                       'FROM app_public.snapshots s ' ||
                       'INNER JOIN app_public.' || relationTableName || ' es ON es.snapshot_id = s.id ' ||
                       'WHERE es.' || relationFkName || ' = OLD.id AND s.snapshot_state IN (''INITIALIZATION'', ''VALIDATION'', ''PUBLISHED'')) THEN ' ||
              'perform ax_utils.raise_error(''%s with ID %s cannot be deleted as it has active snapshots.'', ''ACSNS'', ''' || entityTypeName || ''', OLD.id::text); ' ||
            'END IF; ' ||
            'RETURN OLD; ' ||
          'END; ' ||
          '$snap$ LANGUAGE plpgsql STABLE;';

  EXECUTE 'DROP trigger IF EXISTS _100_check_active_snapshots on app_public.' || tableName || ';';
  EXECUTE 'CREATE trigger _100_check_active_snapshots ' ||
          'BEFORE DELETE ON app_public.' || tableName || ' ' ||
          'for each ROW ' ||
          'EXECUTE PROCEDURE app_hidden.tg_' || tableName || '__check_active_snapshots();';
END;
$_$;


--
-- Name: create_localizable_entity_triggers(text, text, text, text, text); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.create_localizable_entity_triggers(aggregateid text, tablename text, entitytype text, localizable_fields text, required_fields text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
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
$_$;


--
-- Name: create_propagate_publish_state_trigger(text, text); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.create_propagate_publish_state_trigger(tablename text, entitytype text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
    EXECUTE 'CREATE OR REPLACE FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_' || tableName || '() RETURNS trigger AS $snap$ ' ||
            'BEGIN ' ||
              'IF (NEW.snapshot_state = ''PUBLISHED'') THEN ' ||
                'UPDATE app_public.' || tableName || ' SET published_date = NEW.published_date, published_user = NEW.updated_user, ' ||
                -- if entity was changed after snapshot was created then is has unpublished changes.. so the correct status is CHANGED
                'publish_status = CASE WHEN updated_date > NEW.created_date THEN ''CHANGED'' ELSE ''PUBLISHED'' END ' ||
                'WHERE id = NEW.entity_id;'
              'ELSIF (NEW.snapshot_state = ''UNPUBLISHED'') THEN ' ||
                'UPDATE app_public.' || tableName || ' SET publish_status = ''NOT_PUBLISHED'', published_date = NULL, published_user = NULL WHERE id = NEW.entity_id;' ||
              'END IF; ' ||
              'RETURN NEW; ' ||
            'END; ' ||
            '$snap$ LANGUAGE plpgsql volatile SECURITY DEFINER;';

    EXECUTE 'DROP trigger IF EXISTS _300_propagate_publish_state_to_' || tableName || ' on app_public.snapshots;';
    EXECUTE 'CREATE trigger _300_propagate_publish_state_to_' || tableName || ' ' ||
            'BEFORE UPDATE ON app_public.snapshots ' ||
            'for each ROW WHEN (NEW.entity_type = ''' || entityType || ''') ' ||
            'EXECUTE PROCEDURE app_hidden.tg_snapshots__propagate_publish_state_to_' || tableName || '();';

    EXECUTE 'DROP TRIGGER IF EXISTS _300_publish_state_changed' || ' ON app_public.' || tableName || ';';
    EXECUTE 'CREATE trigger _300_publish_state_changed 
             BEFORE UPDATE ON app_public.' || tableName || '
             FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg__update_publish_state();';
END;
$_$;


--
-- Name: define_snapshot_authentication(text, text, text, text); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.define_snapshot_authentication(entitytype text, allowedreadpermissions text, filterreadpermissions text, allowedmodifypermissions text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  type_rls_string TEXT = '(entity_type = ''' || entityType || ''')';
BEGIN
  PERFORM app_hidden.drop_snapshot_authentication(entityType);
  EXECUTE 'ALTER TABLE app_public.snapshots ENABLE ROW LEVEL SECURITY;';
  EXECUTE 'ALTER TABLE app_public.snapshot_validation_results ENABLE ROW LEVEL SECURITY;';

  if (filterReadPermissions <> '' and allowedModifyPermissions <> '' and allowedReadPermissions <> '') then
    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_select ON app_public.snapshots FOR SELECT 
      USING (' || type_rls_string || ' AND (SELECT app_hidden.user_has_filter_permission(''' || filterReadPermissions || ''')) AND (SELECT ax_utils.user_has_permission(''' || allowedReadPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_insert ON app_public.snapshots FOR INSERT
      WITH CHECK (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_update ON app_public.snapshots FOR UPDATE
      USING (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')))
      WITH CHECK (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_' || entityType || '_authorization_delete ON app_public.snapshots FOR DELETE
      USING (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_select ON app_public.snapshot_validation_results FOR SELECT 
      USING (' || type_rls_string || ' AND (SELECT app_hidden.user_has_filter_permission(''' || filterReadPermissions || ''')) AND (SELECT ax_utils.user_has_permission(''' || allowedReadPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_insert ON app_public.snapshot_validation_results FOR INSERT
      WITH CHECK (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_update ON app_public.snapshot_validation_results FOR UPDATE
      USING (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')))
      WITH CHECK (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';

    EXECUTE 'CREATE POLICY snapshots_validation_' || entityType || '_authorization_delete ON app_public.snapshot_validation_results FOR DELETE
      USING (' || type_rls_string || ' AND (SELECT ax_utils.user_has_permission(''' || allowedModifyPermissions || ''')));';
  else
    perform ax_utils.raise_error('Invalid parameters provided to "ax_utils.define_snapshot_authentication".', 'SETUP');
  end if;
END;
$$;


--
-- Name: drop_snapshot_authentication(text); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.drop_snapshot_authentication(entitytype text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'ALTER TABLE app_public.snapshots DISABLE ROW LEVEL SECURITY;';
  EXECUTE 'ALTER TABLE app_public.snapshot_validation_results DISABLE ROW LEVEL SECURITY;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_' || entityType || '_authorization_select ON app_public.snapshots;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_' || entityType || '_authorization_insert ON app_public.snapshots;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_' || entityType || '_authorization_update ON app_public.snapshots;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_' || entityType || '_authorization_delete ON app_public.snapshots;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_validation_' || entityType || '_authorization_select ON app_public.snapshot_validation_results;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_validation_' || entityType || '_authorization_insert ON app_public.snapshot_validation_results;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_validation_' || entityType || '_authorization_update ON app_public.snapshot_validation_results;';
  EXECUTE 'DROP POLICY IF EXISTS snapshots_validation_' || entityType || '_authorization_delete ON app_public.snapshot_validation_results;';
END;
$$;


--
-- Name: is_localization_enabled(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.is_localization_enabled() RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $$SELECT FALSE $$;


--
-- Name: localizable_collection_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_collection_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('id', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('COLLECTION'), OLD.id, 'Localizable' || app_hidden.to_pascal_case('COLLECTION') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_collection_image_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_collection_image_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('collection_id,image_id,image_type', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('COLLECTION_IMAGE'), OLD.image_id, 'Localizable' || app_hidden.to_pascal_case('COLLECTION_IMAGE') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_collection_image_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_collection_image_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('image_id', ',') || string_to_array('collection_id,image_id,image_type', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('COLLECTION_IMAGE'), NEW.image_id, 'Localizable' || app_hidden.to_pascal_case('COLLECTION_IMAGE') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_collection_image_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_collection_image_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('collection_id,image_id,image_type', ','); _localizable_fields text[] := string_to_array('image_id', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('COLLECTION_IMAGE'), NEW.image_id, 'Localizable' || app_hidden.to_pascal_case('COLLECTION_IMAGE') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_collection_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_collection_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('title,synopsis,description', ',') || string_to_array('id', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('COLLECTION'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('COLLECTION') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_collection_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_collection_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('id', ','); _localizable_fields text[] := string_to_array('title,synopsis,description', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('COLLECTION'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('COLLECTION') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_episode_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_episode_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('id,index', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('EPISODE'), OLD.id, 'Localizable' || app_hidden.to_pascal_case('EPISODE') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_episode_image_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_episode_image_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('episode_id,image_id,image_type', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('EPISODE_IMAGE'), OLD.image_id, 'Localizable' || app_hidden.to_pascal_case('EPISODE_IMAGE') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_episode_image_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_episode_image_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('image_id', ',') || string_to_array('episode_id,image_id,image_type', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('EPISODE_IMAGE'), NEW.image_id, 'Localizable' || app_hidden.to_pascal_case('EPISODE_IMAGE') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_episode_image_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_episode_image_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('episode_id,image_id,image_type', ','); _localizable_fields text[] := string_to_array('image_id', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('EPISODE_IMAGE'), NEW.image_id, 'Localizable' || app_hidden.to_pascal_case('EPISODE_IMAGE') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_episode_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_episode_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('title,synopsis,description,season_id', ',') || string_to_array('id,index', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('EPISODE'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('EPISODE') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_episode_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_episode_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('id,index', ','); _localizable_fields text[] := string_to_array('title,synopsis,description,season_id', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('EPISODE'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('EPISODE') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_movie_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_movie_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('id', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('MOVIE'), OLD.id, 'Localizable' || app_hidden.to_pascal_case('MOVIE') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_movie_genre_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_movie_genre_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('id', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('MOVIE_GENRE'), OLD.id, 'Localizable' || app_hidden.to_pascal_case('MOVIE_GENRE') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_movie_genre_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_movie_genre_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('title', ',') || string_to_array('id', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('MOVIE_GENRE'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('MOVIE_GENRE') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_movie_genre_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_movie_genre_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('id', ','); _localizable_fields text[] := string_to_array('title', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('MOVIE_GENRE'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('MOVIE_GENRE') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_movie_image_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_movie_image_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('movie_id,image_id,image_type', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('MOVIE_IMAGE'), OLD.image_id, 'Localizable' || app_hidden.to_pascal_case('MOVIE_IMAGE') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_movie_image_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_movie_image_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('image_id', ',') || string_to_array('movie_id,image_id,image_type', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('MOVIE_IMAGE'), NEW.image_id, 'Localizable' || app_hidden.to_pascal_case('MOVIE_IMAGE') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_movie_image_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_movie_image_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('movie_id,image_id,image_type', ','); _localizable_fields text[] := string_to_array('image_id', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('MOVIE_IMAGE'), NEW.image_id, 'Localizable' || app_hidden.to_pascal_case('MOVIE_IMAGE') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_movie_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_movie_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('title,synopsis,description', ',') || string_to_array('id', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('MOVIE'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('MOVIE') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_movie_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_movie_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('id', ','); _localizable_fields text[] := string_to_array('title,synopsis,description', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('MOVIE'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('MOVIE') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_season_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_season_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('id,index', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('SEASON'), OLD.id, 'Localizable' || app_hidden.to_pascal_case('SEASON') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_season_image_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_season_image_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('season_id,image_id,image_type', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('SEASON_IMAGE'), OLD.image_id, 'Localizable' || app_hidden.to_pascal_case('SEASON_IMAGE') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_season_image_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_season_image_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('image_id', ',') || string_to_array('season_id,image_id,image_type', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('SEASON_IMAGE'), NEW.image_id, 'Localizable' || app_hidden.to_pascal_case('SEASON_IMAGE') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_season_image_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_season_image_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('season_id,image_id,image_type', ','); _localizable_fields text[] := string_to_array('image_id', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('SEASON_IMAGE'), NEW.image_id, 'Localizable' || app_hidden.to_pascal_case('SEASON_IMAGE') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_season_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_season_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('synopsis,description,tvshow_id', ',') || string_to_array('id,index', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('SEASON'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('SEASON') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_season_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_season_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('id,index', ','); _localizable_fields text[] := string_to_array('synopsis,description,tvshow_id', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('SEASON'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('SEASON') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_tvshow_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_tvshow_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('id', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('TVSHOW'), OLD.id, 'Localizable' || app_hidden.to_pascal_case('TVSHOW') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_tvshow_genre_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_tvshow_genre_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('id', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('TVSHOW_GENRE'), OLD.id, 'Localizable' || app_hidden.to_pascal_case('TVSHOW_GENRE') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_tvshow_genre_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_tvshow_genre_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('title', ',') || string_to_array('id', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('TVSHOW_GENRE'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('TVSHOW_GENRE') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_tvshow_genre_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_tvshow_genre_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('id', ','); _localizable_fields text[] := string_to_array('title', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('TVSHOW_GENRE'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('TVSHOW_GENRE') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_tvshow_image_delete(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_tvshow_image_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _fields text[] := string_to_array('tvshow_id,image_id,image_type', ','); _payload jsonb := '{}'::jsonb; BEGIN SELECT jsonb_object_agg(f.field, _jsonb_old -> f.field) FROM (SELECT unnest(_fields) AS field) as f INTO _payload; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('TVSHOW_IMAGE'), OLD.image_id, 'Localizable' || app_hidden.to_pascal_case('TVSHOW_IMAGE') || 'Deleted', 'parallel', _payload, NOW()); RETURN OLD; END; $$;


--
-- Name: localizable_tvshow_image_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_tvshow_image_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('image_id', ',') || string_to_array('tvshow_id,image_id,image_type', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('TVSHOW_IMAGE'), NEW.image_id, 'Localizable' || app_hidden.to_pascal_case('TVSHOW_IMAGE') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_tvshow_image_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_tvshow_image_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('tvshow_id,image_id,image_type', ','); _localizable_fields text[] := string_to_array('image_id', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('TVSHOW_IMAGE'), NEW.image_id, 'Localizable' || app_hidden.to_pascal_case('TVSHOW_IMAGE') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


--
-- Name: localizable_tvshow_insert(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_tvshow_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_new jsonb := row_to_json(NEW.*); _fields text[] := string_to_array('title,synopsis,description', ',') || string_to_array('id', ','); _payload jsonb := '{}'::jsonb; _field text; BEGIN FOREACH _field IN ARRAY _fields LOOP IF coalesce(_jsonb_new ->> _field, '') != '' THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('TVSHOW'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('TVSHOW') || 'Created', 'parallel', _payload, NOW()); RETURN NEW; END; $$;


--
-- Name: localizable_tvshow_update(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.localizable_tvshow_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE _jsonb_old jsonb := row_to_json(OLD.*); _jsonb_new jsonb := row_to_json(NEW.*); _required_fields text[] := string_to_array('id', ','); _localizable_fields text[] := string_to_array('title,synopsis,description', ','); _payload jsonb := '{}'::jsonb; _metadata jsonb; _field text; BEGIN FOREACH _field IN ARRAY _localizable_fields LOOP IF coalesce(_jsonb_old ->> _field, '') != coalesce(_jsonb_new ->> _field, '') THEN _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END IF; END LOOP; IF _jsonb_new ->> 'ingest_correlation_id' IS NOT NULL THEN _metadata := jsonb_build_object('messageContext', jsonb_build_object('ingestItemId', _jsonb_new -> 'ingest_correlation_id')); END IF; IF _payload != '{}'::jsonb OR _metadata IS NOT NULL THEN FOREACH _field IN ARRAY _required_fields LOOP _payload := _payload || jsonb_build_object(_field, _jsonb_new -> _field); END LOOP; INSERT INTO app_hidden.inbox (id, aggregate_type, aggregate_id, message_type, concurrency, payload, metadata, created_at) VALUES (uuid_generate_v4(), app_hidden.to_kebab_case('TVSHOW'), NEW.id, 'Localizable' || app_hidden.to_pascal_case('TVSHOW') || 'Updated', 'parallel', _payload, _metadata, NOW()); END IF; RETURN NEW; END; $$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: inbox; Type: TABLE; Schema: app_hidden; Owner: -
--

CREATE TABLE app_hidden.inbox (
    id uuid NOT NULL,
    aggregate_type text NOT NULL,
    aggregate_id text NOT NULL,
    message_type text NOT NULL,
    segment text,
    concurrency text DEFAULT 'sequential'::text NOT NULL,
    payload jsonb NOT NULL,
    metadata jsonb,
    locked_until timestamp with time zone DEFAULT to_timestamp((0)::double precision) NOT NULL,
    created_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    processed_at timestamp with time zone,
    abandoned_at timestamp with time zone,
    started_attempts smallint DEFAULT 0 NOT NULL,
    finished_attempts smallint DEFAULT 0 NOT NULL,
    CONSTRAINT inbox_concurrency_check CHECK ((concurrency = ANY (ARRAY['sequential'::text, 'parallel'::text])))
);


--
-- Name: next_inbox_messages(integer, integer); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.next_inbox_messages(max_size integer, lock_ms integer) RETURNS SETOF app_hidden.inbox
    LANGUAGE plpgsql
    AS $$
DECLARE 
  loop_row app_hidden.inbox%ROWTYPE;
  message_row app_hidden.inbox%ROWTYPE;
  ids uuid[] := '{}';
BEGIN

  IF max_size < 1 THEN
    RAISE EXCEPTION 'The max_size for the next messages batch must be at least one.' using errcode = 'MAXNR';
  END IF;

  -- get (only) the oldest message of every segment but only return it if it is not locked
  FOR loop_row IN
    SELECT * FROM app_hidden.inbox m WHERE m.id in (SELECT DISTINCT ON (segment) id
      FROM app_hidden.inbox
      WHERE processed_at IS NULL AND abandoned_at IS NULL
      ORDER BY segment, created_at) order by created_at
  LOOP
    BEGIN
      EXIT WHEN cardinality(ids) >= max_size;
    
      SELECT *
        INTO message_row
        FROM app_hidden.inbox
        WHERE id = loop_row.id
        FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked
      
      IF message_row.locked_until > NOW() THEN
        CONTINUE;
      END IF;
      
      ids := array_append(ids, message_row.id);
    EXCEPTION 
      WHEN lock_not_available THEN
        CONTINUE;
      WHEN serialization_failure THEN
        CONTINUE;
    END;
  END LOOP;
  
  -- if max_size not reached: get the oldest parallelizable message independent of segment
  IF cardinality(ids) < max_size THEN
    FOR loop_row IN
      SELECT * FROM app_hidden.inbox
        WHERE concurrency = 'parallel' AND processed_at IS NULL AND abandoned_at IS NULL AND locked_until < NOW() 
          AND id NOT IN (SELECT UNNEST(ids))
        order by created_at
    LOOP
      BEGIN
        EXIT WHEN cardinality(ids) >= max_size;

        SELECT *
          INTO message_row
          FROM app_hidden.inbox
          WHERE id = loop_row.id
          FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked

        ids := array_append(ids, message_row.id);
    EXCEPTION 
      WHEN lock_not_available THEN
        CONTINUE;
      WHEN serialization_failure THEN
        CONTINUE;
      END;
    END LOOP;
  END IF;
  
  -- set a short lock value so the the workers can each process a message
  IF cardinality(ids) > 0 THEN

    RETURN QUERY 
      UPDATE app_hidden.inbox
        SET locked_until = clock_timestamp() + (lock_ms || ' milliseconds')::INTERVAL, started_attempts = started_attempts + 1
        WHERE ID = ANY(ids)
        RETURNING *;

  END IF;
END;
$$;


--
-- Name: outbox; Type: TABLE; Schema: app_hidden; Owner: -
--

CREATE TABLE app_hidden.outbox (
    id uuid NOT NULL,
    aggregate_type text NOT NULL,
    aggregate_id text NOT NULL,
    message_type text NOT NULL,
    segment text,
    concurrency text DEFAULT 'sequential'::text NOT NULL,
    payload jsonb NOT NULL,
    metadata jsonb,
    locked_until timestamp with time zone DEFAULT to_timestamp((0)::double precision) NOT NULL,
    created_at timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    processed_at timestamp with time zone,
    abandoned_at timestamp with time zone,
    started_attempts smallint DEFAULT 0 NOT NULL,
    finished_attempts smallint DEFAULT 0 NOT NULL,
    CONSTRAINT outbox_concurrency_check CHECK ((concurrency = ANY (ARRAY['sequential'::text, 'parallel'::text])))
);


--
-- Name: next_outbox_messages(integer, integer); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.next_outbox_messages(max_size integer, lock_ms integer) RETURNS SETOF app_hidden.outbox
    LANGUAGE plpgsql
    AS $$
DECLARE 
  loop_row app_hidden.outbox%ROWTYPE;
  message_row app_hidden.outbox%ROWTYPE;
  ids uuid[] := '{}';
BEGIN

  IF max_size < 1 THEN
    RAISE EXCEPTION 'The max_size for the next messages batch must be at least one.' using errcode = 'MAXNR';
  END IF;

  -- get (only) the oldest message of every segment but only return it if it is not locked
  FOR loop_row IN
    SELECT * FROM app_hidden.outbox m WHERE m.id in (SELECT DISTINCT ON (segment) id
      FROM app_hidden.outbox
      WHERE processed_at IS NULL AND abandoned_at IS NULL
      ORDER BY segment, created_at) order by created_at
  LOOP
    BEGIN
      EXIT WHEN cardinality(ids) >= max_size;
    
      SELECT *
        INTO message_row
        FROM app_hidden.outbox
        WHERE id = loop_row.id
        FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked
      
      IF message_row.locked_until > NOW() THEN
        CONTINUE;
      END IF;
      
      ids := array_append(ids, message_row.id);
    EXCEPTION 
      WHEN lock_not_available THEN
        CONTINUE;
      WHEN serialization_failure THEN
        CONTINUE;
    END;
  END LOOP;
  
  -- if max_size not reached: get the oldest parallelizable message independent of segment
  IF cardinality(ids) < max_size THEN
    FOR loop_row IN
      SELECT * FROM app_hidden.outbox
        WHERE concurrency = 'parallel' AND processed_at IS NULL AND abandoned_at IS NULL AND locked_until < NOW() 
          AND id NOT IN (SELECT UNNEST(ids))
        order by created_at
    LOOP
      BEGIN
        EXIT WHEN cardinality(ids) >= max_size;

        SELECT *
          INTO message_row
          FROM app_hidden.outbox
          WHERE id = loop_row.id
          FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked

        ids := array_append(ids, message_row.id);
    EXCEPTION 
      WHEN lock_not_available THEN
        CONTINUE;
      WHEN serialization_failure THEN
        CONTINUE;
      END;
    END LOOP;
  END IF;
  
  -- set a short lock value so the the workers can each process a message
  IF cardinality(ids) > 0 THEN

    RETURN QUERY 
      UPDATE app_hidden.outbox
        SET locked_until = clock_timestamp() + (lock_ms || ' milliseconds')::INTERVAL, started_attempts = started_attempts + 1
        WHERE ID = ANY(ids)
        RETURNING *;

  END IF;
END;
$$;


--
-- Name: tg__update_publish_state(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg__update_publish_state() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Don't change updated date due to publication changes. Publishing some old snapshot is not a change.
    -- We must be able to compare real changes with snapshot creation date.
    IF COALESCE(NEW.published_date, to_timestamp(0)) <> COALESCE(OLD.published_date, to_timestamp(0)) THEN
      NEW.updated_date = OLD.updated_date;

    -- A published entity always become changed on subsequent changes
    ELSIF NEW.publish_status = 'PUBLISHED' THEN
        NEW.publish_status = 'CHANGED';
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: tg_collections__check_active_snapshots(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_collections__check_active_snapshots() RETURNS trigger
    LANGUAGE plpgsql STABLE
    AS $$ BEGIN IF EXISTS (SELECT '' FROM app_public.snapshots s INNER JOIN app_public.collections_snapshots es ON es.snapshot_id = s.id WHERE es.collection_id = OLD.id AND s.snapshot_state IN ('INITIALIZATION', 'VALIDATION', 'PUBLISHED')) THEN perform ax_utils.raise_error('%s with ID %s cannot be deleted as it has active snapshots.', 'ACSNS', 'Collection', OLD.id::text); END IF; RETURN OLD; END; $$;


--
-- Name: tg_episodes__check_active_snapshots(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_episodes__check_active_snapshots() RETURNS trigger
    LANGUAGE plpgsql STABLE
    AS $$ BEGIN IF EXISTS (SELECT '' FROM app_public.snapshots s INNER JOIN app_public.episodes_snapshots es ON es.snapshot_id = s.id WHERE es.episode_id = OLD.id AND s.snapshot_state IN ('INITIALIZATION', 'VALIDATION', 'PUBLISHED')) THEN perform ax_utils.raise_error('%s with ID %s cannot be deleted as it has active snapshots.', 'ACSNS', 'Episode', OLD.id::text); END IF; RETURN OLD; END; $$;


--
-- Name: tg_movies__check_active_snapshots(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_movies__check_active_snapshots() RETURNS trigger
    LANGUAGE plpgsql STABLE
    AS $$ BEGIN IF EXISTS (SELECT '' FROM app_public.snapshots s INNER JOIN app_public.movies_snapshots es ON es.snapshot_id = s.id WHERE es.movie_id = OLD.id AND s.snapshot_state IN ('INITIALIZATION', 'VALIDATION', 'PUBLISHED')) THEN perform ax_utils.raise_error('%s with ID %s cannot be deleted as it has active snapshots.', 'ACSNS', 'Movie', OLD.id::text); END IF; RETURN OLD; END; $$;


--
-- Name: tg_seasons__check_active_snapshots(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_seasons__check_active_snapshots() RETURNS trigger
    LANGUAGE plpgsql STABLE
    AS $$ BEGIN IF EXISTS (SELECT '' FROM app_public.snapshots s INNER JOIN app_public.seasons_snapshots es ON es.snapshot_id = s.id WHERE es.season_id = OLD.id AND s.snapshot_state IN ('INITIALIZATION', 'VALIDATION', 'PUBLISHED')) THEN perform ax_utils.raise_error('%s with ID %s cannot be deleted as it has active snapshots.', 'ACSNS', 'Season', OLD.id::text); END IF; RETURN OLD; END; $$;


--
-- Name: tg_snapshots__check_active_state(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_snapshots__check_active_state() RETURNS trigger
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
  IF (OLD.snapshot_state IN ('INITIALIZATION', 'VALIDATION', 'PUBLISHED')) THEN
    perform ax_utils.raise_error('Snapshot with ID %s cannot be deleted as it has an active ''%s'' state.', 'ACSNS', OLD.id::text, OLD.snapshot_state);
  END IF;
  RETURN OLD;
END;
$$;


--
-- Name: tg_snapshots__propagate_publish_state_to_collections(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_collections() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ BEGIN IF (NEW.snapshot_state = 'PUBLISHED') THEN UPDATE app_public.collections SET published_date = NEW.published_date, published_user = NEW.updated_user, publish_status = CASE WHEN updated_date > NEW.created_date THEN 'CHANGED' ELSE 'PUBLISHED' END WHERE id = NEW.entity_id;ELSIF (NEW.snapshot_state = 'UNPUBLISHED') THEN UPDATE app_public.collections SET publish_status = 'NOT_PUBLISHED', published_date = NULL, published_user = NULL WHERE id = NEW.entity_id;END IF; RETURN NEW; END; $$;


--
-- Name: tg_snapshots__propagate_publish_state_to_episodes(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_episodes() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ BEGIN IF (NEW.snapshot_state = 'PUBLISHED') THEN UPDATE app_public.episodes SET published_date = NEW.published_date, published_user = NEW.updated_user, publish_status = CASE WHEN updated_date > NEW.created_date THEN 'CHANGED' ELSE 'PUBLISHED' END WHERE id = NEW.entity_id;ELSIF (NEW.snapshot_state = 'UNPUBLISHED') THEN UPDATE app_public.episodes SET publish_status = 'NOT_PUBLISHED', published_date = NULL, published_user = NULL WHERE id = NEW.entity_id;END IF; RETURN NEW; END; $$;


--
-- Name: tg_snapshots__propagate_publish_state_to_movies(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_movies() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ BEGIN IF (NEW.snapshot_state = 'PUBLISHED') THEN UPDATE app_public.movies SET published_date = NEW.published_date, published_user = NEW.updated_user, publish_status = CASE WHEN updated_date > NEW.created_date THEN 'CHANGED' ELSE 'PUBLISHED' END WHERE id = NEW.entity_id;ELSIF (NEW.snapshot_state = 'UNPUBLISHED') THEN UPDATE app_public.movies SET publish_status = 'NOT_PUBLISHED', published_date = NULL, published_user = NULL WHERE id = NEW.entity_id;END IF; RETURN NEW; END; $$;


--
-- Name: tg_snapshots__propagate_publish_state_to_seasons(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_seasons() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ BEGIN IF (NEW.snapshot_state = 'PUBLISHED') THEN UPDATE app_public.seasons SET published_date = NEW.published_date, published_user = NEW.updated_user, publish_status = CASE WHEN updated_date > NEW.created_date THEN 'CHANGED' ELSE 'PUBLISHED' END WHERE id = NEW.entity_id;ELSIF (NEW.snapshot_state = 'UNPUBLISHED') THEN UPDATE app_public.seasons SET publish_status = 'NOT_PUBLISHED', published_date = NULL, published_user = NULL WHERE id = NEW.entity_id;END IF; RETURN NEW; END; $$;


--
-- Name: tg_snapshots__propagate_publish_state_to_tvshows(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_tvshows() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$ BEGIN IF (NEW.snapshot_state = 'PUBLISHED') THEN UPDATE app_public.tvshows SET published_date = NEW.published_date, published_user = NEW.updated_user, publish_status = CASE WHEN updated_date > NEW.created_date THEN 'CHANGED' ELSE 'PUBLISHED' END WHERE id = NEW.entity_id;ELSIF (NEW.snapshot_state = 'UNPUBLISHED') THEN UPDATE app_public.tvshows SET publish_status = 'NOT_PUBLISHED', published_date = NULL, published_user = NULL WHERE id = NEW.entity_id;END IF; RETURN NEW; END; $$;


--
-- Name: tg_tvshows__check_active_snapshots(); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.tg_tvshows__check_active_snapshots() RETURNS trigger
    LANGUAGE plpgsql STABLE
    AS $$ BEGIN IF EXISTS (SELECT '' FROM app_public.snapshots s INNER JOIN app_public.tvshows_snapshots es ON es.snapshot_id = s.id WHERE es.tvshow_id = OLD.id AND s.snapshot_state IN ('INITIALIZATION', 'VALIDATION', 'PUBLISHED')) THEN perform ax_utils.raise_error('%s with ID %s cannot be deleted as it has active snapshots.', 'ACSNS', 'TV Show', OLD.id::text); END IF; RETURN OLD; END; $$;


--
-- Name: to_kebab_case(text); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.to_kebab_case(input_value text) RETURNS text
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN lower(replace(input_value, '_', '-'));
END;
$$;


--
-- Name: to_pascal_case(text); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.to_pascal_case(input_value text) RETURNS text
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN replace(initcap(replace(input_value, '_', ' ')), ' ', '');
END;
$$;


--
-- Name: user_has_filter_permission(text); Type: FUNCTION; Schema: app_hidden; Owner: -
--

CREATE FUNCTION app_hidden.user_has_filter_permission(required_permissions text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
   return ax_utils.user_has_setting(required_permissions, 'mosaic.auth.permissions');
END;
$$;


--
-- Name: get_collections_tags_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_collections_tags_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.collections_tags ORDER BY name ASC$$;


--
-- Name: get_episodes_casts_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_episodes_casts_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.episodes_casts ORDER BY name ASC$$;


--
-- Name: get_episodes_production_countries_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_episodes_production_countries_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.episodes_production_countries ORDER BY name ASC$$;


--
-- Name: get_episodes_tags_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_episodes_tags_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.episodes_tags ORDER BY name ASC$$;


--
-- Name: get_movies_casts_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_movies_casts_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.movies_casts ORDER BY name ASC$$;


--
-- Name: get_movies_production_countries_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_movies_production_countries_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.movies_production_countries ORDER BY name ASC$$;


--
-- Name: get_movies_tags_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_movies_tags_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.movies_tags ORDER BY name ASC$$;


--
-- Name: get_seasons_casts_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_seasons_casts_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.seasons_casts ORDER BY name ASC$$;


--
-- Name: get_seasons_production_countries_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_seasons_production_countries_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.seasons_production_countries ORDER BY name ASC$$;


--
-- Name: get_seasons_tags_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_seasons_tags_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.seasons_tags ORDER BY name ASC$$;


--
-- Name: get_tvshows_casts_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_tvshows_casts_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.tvshows_casts ORDER BY name ASC$$;


--
-- Name: get_tvshows_production_countries_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_tvshows_production_countries_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.tvshows_production_countries ORDER BY name ASC$$;


--
-- Name: get_tvshows_tags_values(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.get_tvshows_tags_values() RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$ SELECT DISTINCT name FROM app_public.tvshows_tags ORDER BY name ASC$$;


--
-- Name: remove_orphaned_snapshot(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.remove_orphaned_snapshot() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	DELETE
	FROM
		snapshots
	WHERE
		id = OLD.snapshot_id;
	RETURN NULL;
END
$$;


--
-- Name: tg_collection_relations__collections_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_collection_relations__collections_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.collection_id IS NOT NULL AND NEW.collection_id IS NOT NULL) THEN
                    UPDATE app_public.collections SET updated_date=now()
                    WHERE (id = OLD.collection_id) OR (id = NEW.collection_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.collection_id IS NOT NULL) THEN
                    UPDATE app_public.collections SET updated_date=now()
                    WHERE id = NEW.collection_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.collection_id IS NOT NULL) THEN
                    UPDATE app_public.collections SET updated_date=now()
                    WHERE id = OLD.collection_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_collections_images__collections_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_collections_images__collections_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.collection_id IS NOT NULL AND NEW.collection_id IS NOT NULL) THEN
                    UPDATE app_public.collections SET updated_date=now()
                    WHERE (id = OLD.collection_id) OR (id = NEW.collection_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.collection_id IS NOT NULL) THEN
                    UPDATE app_public.collections SET updated_date=now()
                    WHERE id = NEW.collection_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.collection_id IS NOT NULL) THEN
                    UPDATE app_public.collections SET updated_date=now()
                    WHERE id = OLD.collection_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_collections_tags__collections_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_collections_tags__collections_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.collection_id IS NOT NULL AND NEW.collection_id IS NOT NULL) THEN
                    UPDATE app_public.collections SET updated_date=now()
                    WHERE (id = OLD.collection_id) OR (id = NEW.collection_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.collection_id IS NOT NULL) THEN
                    UPDATE app_public.collections SET updated_date=now()
                    WHERE id = NEW.collection_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.collection_id IS NOT NULL) THEN
                    UPDATE app_public.collections SET updated_date=now()
                    WHERE id = OLD.collection_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_episodes_casts__episodes_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_episodes_casts__episodes_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.episode_id IS NOT NULL AND NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE (id = OLD.episode_id) OR (id = NEW.episode_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = NEW.episode_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = OLD.episode_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_episodes_images__episodes_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_episodes_images__episodes_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.episode_id IS NOT NULL AND NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE (id = OLD.episode_id) OR (id = NEW.episode_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = NEW.episode_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = OLD.episode_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_episodes_licenses__episodes_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_episodes_licenses__episodes_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.episode_id IS NOT NULL AND NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE (id = OLD.episode_id) OR (id = NEW.episode_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = NEW.episode_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = OLD.episode_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_episodes_licenses_countries__episodes_licenses_ts_propagtn(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_episodes_licenses_countries__episodes_licenses_ts_propagtn() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.episodes_license_id IS NOT NULL AND NEW.episodes_license_id IS NOT NULL) THEN
                    UPDATE app_public.episodes_licenses SET updated_date=now()
                    WHERE (id = OLD.episodes_license_id) OR (id = NEW.episodes_license_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.episodes_license_id IS NOT NULL) THEN
                    UPDATE app_public.episodes_licenses SET updated_date=now()
                    WHERE id = NEW.episodes_license_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.episodes_license_id IS NOT NULL) THEN
                    UPDATE app_public.episodes_licenses SET updated_date=now()
                    WHERE id = OLD.episodes_license_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_episodes_production_countries__episodes_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_episodes_production_countries__episodes_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.episode_id IS NOT NULL AND NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE (id = OLD.episode_id) OR (id = NEW.episode_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = NEW.episode_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = OLD.episode_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_episodes_tags__episodes_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_episodes_tags__episodes_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.episode_id IS NOT NULL AND NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE (id = OLD.episode_id) OR (id = NEW.episode_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = NEW.episode_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = OLD.episode_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_episodes_trailers__episodes_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_episodes_trailers__episodes_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.episode_id IS NOT NULL AND NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE (id = OLD.episode_id) OR (id = NEW.episode_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = NEW.episode_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = OLD.episode_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_episodes_tvshow_genres__episodes_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_episodes_tvshow_genres__episodes_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.episode_id IS NOT NULL AND NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE (id = OLD.episode_id) OR (id = NEW.episode_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = NEW.episode_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.episode_id IS NOT NULL) THEN
                    UPDATE app_public.episodes SET updated_date=now()
                    WHERE id = OLD.episode_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_movies_casts__movies_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_movies_casts__movies_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.movie_id IS NOT NULL AND NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE (id = OLD.movie_id) OR (id = NEW.movie_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = NEW.movie_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = OLD.movie_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_movies_images__movies_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_movies_images__movies_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.movie_id IS NOT NULL AND NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE (id = OLD.movie_id) OR (id = NEW.movie_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = NEW.movie_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = OLD.movie_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_movies_licenses__movies_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_movies_licenses__movies_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.movie_id IS NOT NULL AND NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE (id = OLD.movie_id) OR (id = NEW.movie_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = NEW.movie_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = OLD.movie_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_movies_licenses_countries__movies_licenses_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_movies_licenses_countries__movies_licenses_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.movies_license_id IS NOT NULL AND NEW.movies_license_id IS NOT NULL) THEN
                    UPDATE app_public.movies_licenses SET updated_date=now()
                    WHERE (id = OLD.movies_license_id) OR (id = NEW.movies_license_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.movies_license_id IS NOT NULL) THEN
                    UPDATE app_public.movies_licenses SET updated_date=now()
                    WHERE id = NEW.movies_license_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.movies_license_id IS NOT NULL) THEN
                    UPDATE app_public.movies_licenses SET updated_date=now()
                    WHERE id = OLD.movies_license_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_movies_movie_genres__movies_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_movies_movie_genres__movies_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.movie_id IS NOT NULL AND NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE (id = OLD.movie_id) OR (id = NEW.movie_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = NEW.movie_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = OLD.movie_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_movies_production_countries__movies_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_movies_production_countries__movies_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.movie_id IS NOT NULL AND NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE (id = OLD.movie_id) OR (id = NEW.movie_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = NEW.movie_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = OLD.movie_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_movies_tags__movies_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_movies_tags__movies_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.movie_id IS NOT NULL AND NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE (id = OLD.movie_id) OR (id = NEW.movie_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = NEW.movie_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = OLD.movie_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_movies_trailers__movies_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_movies_trailers__movies_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.movie_id IS NOT NULL AND NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE (id = OLD.movie_id) OR (id = NEW.movie_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = NEW.movie_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.movie_id IS NOT NULL) THEN
                    UPDATE app_public.movies SET updated_date=now()
                    WHERE id = OLD.movie_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_seasons_casts__seasons_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_seasons_casts__seasons_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.season_id IS NOT NULL AND NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE (id = OLD.season_id) OR (id = NEW.season_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = NEW.season_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = OLD.season_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_seasons_images__seasons_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_seasons_images__seasons_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.season_id IS NOT NULL AND NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE (id = OLD.season_id) OR (id = NEW.season_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = NEW.season_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = OLD.season_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_seasons_licenses__seasons_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_seasons_licenses__seasons_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.season_id IS NOT NULL AND NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE (id = OLD.season_id) OR (id = NEW.season_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = NEW.season_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = OLD.season_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_seasons_licenses_countries__seasons_licenses_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_seasons_licenses_countries__seasons_licenses_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.seasons_license_id IS NOT NULL AND NEW.seasons_license_id IS NOT NULL) THEN
                    UPDATE app_public.seasons_licenses SET updated_date=now()
                    WHERE (id = OLD.seasons_license_id) OR (id = NEW.seasons_license_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.seasons_license_id IS NOT NULL) THEN
                    UPDATE app_public.seasons_licenses SET updated_date=now()
                    WHERE id = NEW.seasons_license_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.seasons_license_id IS NOT NULL) THEN
                    UPDATE app_public.seasons_licenses SET updated_date=now()
                    WHERE id = OLD.seasons_license_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_seasons_production_countries__seasons_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_seasons_production_countries__seasons_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.season_id IS NOT NULL AND NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE (id = OLD.season_id) OR (id = NEW.season_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = NEW.season_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = OLD.season_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_seasons_tags__seasons_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_seasons_tags__seasons_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.season_id IS NOT NULL AND NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE (id = OLD.season_id) OR (id = NEW.season_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = NEW.season_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = OLD.season_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_seasons_trailers__seasons_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_seasons_trailers__seasons_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.season_id IS NOT NULL AND NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE (id = OLD.season_id) OR (id = NEW.season_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = NEW.season_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = OLD.season_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_seasons_tvshow_genres__seasons_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_seasons_tvshow_genres__seasons_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.season_id IS NOT NULL AND NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE (id = OLD.season_id) OR (id = NEW.season_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = NEW.season_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.season_id IS NOT NULL) THEN
                    UPDATE app_public.seasons SET updated_date=now()
                    WHERE id = OLD.season_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_tvshows_casts__tvshows_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_tvshows_casts__tvshows_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.tvshow_id IS NOT NULL AND NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE (id = OLD.tvshow_id) OR (id = NEW.tvshow_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = NEW.tvshow_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = OLD.tvshow_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_tvshows_images__tvshows_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_tvshows_images__tvshows_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.tvshow_id IS NOT NULL AND NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE (id = OLD.tvshow_id) OR (id = NEW.tvshow_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = NEW.tvshow_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = OLD.tvshow_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_tvshows_licenses__tvshows_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_tvshows_licenses__tvshows_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.tvshow_id IS NOT NULL AND NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE (id = OLD.tvshow_id) OR (id = NEW.tvshow_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = NEW.tvshow_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = OLD.tvshow_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_tvshows_licenses_countries__tvshows_licenses_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_tvshows_licenses_countries__tvshows_licenses_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.tvshows_license_id IS NOT NULL AND NEW.tvshows_license_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows_licenses SET updated_date=now()
                    WHERE (id = OLD.tvshows_license_id) OR (id = NEW.tvshows_license_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.tvshows_license_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows_licenses SET updated_date=now()
                    WHERE id = NEW.tvshows_license_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.tvshows_license_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows_licenses SET updated_date=now()
                    WHERE id = OLD.tvshows_license_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_tvshows_production_countries__tvshows_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_tvshows_production_countries__tvshows_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.tvshow_id IS NOT NULL AND NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE (id = OLD.tvshow_id) OR (id = NEW.tvshow_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = NEW.tvshow_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = OLD.tvshow_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_tvshows_tags__tvshows_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_tvshows_tags__tvshows_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.tvshow_id IS NOT NULL AND NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE (id = OLD.tvshow_id) OR (id = NEW.tvshow_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = NEW.tvshow_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = OLD.tvshow_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_tvshows_trailers__tvshows_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_tvshows_trailers__tvshows_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.tvshow_id IS NOT NULL AND NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE (id = OLD.tvshow_id) OR (id = NEW.tvshow_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = NEW.tvshow_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = OLD.tvshow_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: tg_tvshows_tvshow_genres__tvshows_ts_propagation(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.tg_tvshows_tvshow_genres__tvshows_ts_propagation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_temp'
    AS $$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? 'updated_date') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;
                
                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.tvshow_id IS NOT NULL AND NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE (id = OLD.tvshow_id) OR (id = NEW.tvshow_id);
                
                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = NEW.tvshow_id;
                
                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.tvshow_id IS NOT NULL) THEN
                    UPDATE app_public.tvshows SET updated_date=now()
                    WHERE id = OLD.tvshow_id;
                    
                END IF;
                RETURN NULL;
            END $$;


--
-- Name: column_exists(text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.column_exists(columnname text, tablename text, schemaname text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  found_column text;
begin
  EXECUTE '
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema='''||schemaName||''' and table_name='''||tableName||''' and column_name='''||columnName||''';
  ' INTO found_column;

    IF found_column IS NULL THEN
      RETURN false;
    END IF;
    RETURN true;
end;
$$;


--
-- Name: create_enum_table(text, text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.create_enum_table(enumname text, schemaname text, loginroleplaceholder text, enumvalues text, enumdesriptions text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN

  EXECUTE 'DROP TABLE IF EXISTS ' || schemaName || '.' || enumName || ' CASCADE;';

  -- Define an enum table. The value field is the enum key and the description will be used for GraphQL type annotations.
  EXECUTE '
  CREATE TABLE ' || schemaName || '.' || enumName || ' (
    value text primary key,
    description text
  );
  ';

  -- Insert the enum values. This needs to be done here - otherwise migrating existing tables will throw FK errors.
  IF enumDesriptions IS NULL THEN
    EXECUTE '
      INSERT INTO ' || schemaName || '.' || enumName || ' (value)
      SELECT * FROM unnest(''' || enumValues || '''::text[]);
    ';
  ELSE
    EXECUTE '
      INSERT INTO ' || schemaName || '.' || enumName || ' (value, description)
      SELECT * FROM unnest(''' || enumValues || '''::text[], ''' || enumDesriptions || '''::text[]);
    ';
  END IF;

  -- This is needed for Postgraphile introspection to retrieve the values from enum table and use those values to construct a GraphQL enum type
  EXECUTE 'GRANT SELECT ON ' || schemaName || '.' || enumName || ' TO ' || loginRolePlaceholder || ';';

  -- Put a smart comment on an enum table so that Postgraphile introspection is able to find it
  EXECUTE 'COMMENT ON TABLE ' || schemaName || '.' || enumName || '  IS E''@enum'';';
END;
$$;


--
-- Name: create_messaging_counter_table(); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.create_messaging_counter_table() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN

  EXECUTE 'DROP TABLE IF EXISTS app_private.messaging_counter CASCADE;';
  EXECUTE '
  CREATE TABLE app_private.messaging_counter (
    key text primary key,
    counter INT DEFAULT 1,
    expiration_date timestamptz NOT NULL DEFAULT ((now() + INTERVAL ''1 days'') at time zone ''utc'')
  );
  ';

END;
$$;


--
-- Name: define_audit_date_fields_on_table(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_audit_date_fields_on_table(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
  EXECUTE '
    DO $do$ BEGIN
      BEGIN
          ALTER TABLE ' || schemaName || '.' || tableName || ' ADD COLUMN created_date timestamptz NOT NULL DEFAULT (now() at time zone ''utc'');
          ALTER TABLE ' || schemaName || '.' || tableName || ' ADD COLUMN updated_date timestamptz NOT NULL DEFAULT (now() at time zone ''utc'');
      EXCEPTION
          WHEN duplicate_column THEN RAISE NOTICE ''The column created_date already exists in the ' || schemaName || '.' || tableName || ' table.'';
      END;
    END $do$;
  ';
  PERFORM ax_define.define_timestamps_trigger(tableName, schemaName);
END;
$_$;


--
-- Name: define_audit_user_fields_on_table(text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_audit_user_fields_on_table(tablename text, schemaname text, defaultusername text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
  EXECUTE '
    DO $do$ BEGIN
      BEGIN
          ALTER TABLE ' || schemaName || '.' || tableName || ' ADD COLUMN created_user text NOT NULL DEFAULT ''' || defaultUserName || ''';
          ALTER TABLE ' || schemaName || '.' || tableName || ' ADD COLUMN updated_user text NOT NULL DEFAULT ''' || defaultUserName || ''';
      EXCEPTION
          WHEN duplicate_column THEN RAISE NOTICE ''The column created_user already exists in the ' || schemaName || '.' || tableName || ' table.'';
      END;
    END $do$;
  ';
  PERFORM ax_define.define_users_trigger(tableName, schemaName);
END;
$_$;


--
-- Name: define_authentication(text, text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_authentication(readpermissions text, modifypermissions text, tablename text, schemaname text, additionalrls text DEFAULT '1=1'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ENABLE ROW LEVEL SECURITY;';
  EXECUTE 'DROP POLICY IF EXISTS ' || tableName || '_authorization ON ' || schemaName || '.' || tableName || ';';

  if (readPermissions <> '' and modifyPermissions <> '') then
    EXECUTE 'CREATE POLICY ' || tableName || '_authorization ON ' || schemaName || '.' || tableName || ' FOR ALL
      USING ((SELECT ax_utils.user_has_permission(''' || readPermissions || ''')) AND ' || additionalRls || ')
      WITH CHECK ((SELECT ax_utils.user_has_permission(''' || modifyPermissions || ''')) AND ' || additionalRls || ');';
    EXECUTE 'DROP POLICY IF EXISTS ' || tableName || '_authorization_delete ON ' || schemaName || '.' || tableName || ';';
    EXECUTE 'CREATE POLICY ' || tableName || '_authorization_delete ON ' || schemaName || '.' || tableName || ' AS restrictive FOR DELETE
    USING ((SELECT ax_utils.user_has_permission(''' || modifyPermissions || ''')));';
  elsif (readPermissions <> '') then
    EXECUTE 'CREATE POLICY ' || tableName || '_authorization ON ' || schemaName || '.' || tableName || ' FOR SELECT
      USING ((SELECT ax_utils.user_has_permission(''' || readPermissions || ''')) AND ' || additionalRls || ');';
  elsif (additionalRls <> '') then
    EXECUTE 'CREATE POLICY ' || tableName || '_authorization ON ' || schemaName || '.' || tableName || ' FOR ALL
      USING (' || additionalRls || ');';
  else
    perform ax_utils.raise_error('Invalid parameters provided to "define_authentication". At least the "readPermissions" or "additionalRls" must be provided.', 'SETUP');
  end if;

END;
$$;


--
-- Name: define_deferred_unique_constraint(text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_deferred_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
SELECT COALESCE(constraintName, tableName || '_' || fieldName || '_is_unique') INTO constraintName;
  PERFORM ax_utils.validate_identifier_length(constraintName, 'If the auto-generated name is too long then a "constraintName" argument must be provided.');
  PERFORM ax_define.drop_unique_constraint(fieldName, tableName, schemaName, constraintName);
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ADD CONSTRAINT ' || constraintName || ' UNIQUE (' || fieldName || ') DEFERRABLE INITIALLY DEFERRED;';
END;
$$;


--
-- Name: define_end_user_authentication(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_end_user_authentication(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  end_user_rls_string TEXT := '((user_id = (SELECT ax_utils.current_user_id()) OR (SELECT ax_utils.current_user_id()) = uuid_nil()))';
BEGIN
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ENABLE ROW LEVEL SECURITY;';
  EXECUTE 'DROP POLICY IF EXISTS ' || tableName || '_end_user_authorization ON ' || schemaName || '.' || tableName || ';';


  EXECUTE 'CREATE POLICY ' || tableName || '_end_user_authorization ON ' || schemaName || '.' || tableName || ' AS RESTRICTIVE FOR ALL
    USING (' || end_user_rls_string || ');';


END;
$$;


--
-- Name: define_index(text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_index(fieldname text, tablename text, schemaname text, indexname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexName, 'idx_' || tableName || '_' || fieldName) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  PERFORM ax_define.drop_index(fieldName, tableName, indexName);
  EXECUTE 'CREATE INDEX ' || indexName || ' ON ' || schemaName || '.' || tableName || ' (' || fieldName || ');';
END;
$$;


--
-- Name: define_indexes_with_id(text, text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_indexes_with_id(fieldname text, tablename text, schemaname text, indexnameasc text DEFAULT NULL::text, indexnamedesc text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexNameAsc, 'idx_' || tableName || '_' || fieldName || '_asc_with_id') INTO indexNameAsc;
  SELECT COALESCE(indexNameDesc, 'idx_' || tableName || '_' || fieldName || '_desc_with_id') INTO indexNameDesc;
  PERFORM ax_utils.validate_identifier_length(indexNameAsc, 'If the auto-generated name is too long then an "indexNameAsc" argument must be provided.');
  PERFORM ax_utils.validate_identifier_length(indexNameDesc, 'If the auto-generated name is too long then an "indexNameDesc" argument must be provided.');
  PERFORM ax_define.drop_indexes_with_id(fieldName, tableName, indexNameAsc, indexNameDesc);
  EXECUTE 'CREATE INDEX idx_' || tableName || '_' || fieldName || '_asc_with_id ON ' || schemaName || '.' || tableName || ' (' || fieldName || ' ASC, id ASC);';
  EXECUTE 'CREATE INDEX idx_' || tableName || '_' || fieldName || '_desc_with_id ON ' || schemaName || '.' || tableName || ' (' || fieldName || ' DESC, id ASC);';
END;
$$;


--
-- Name: define_like_index(text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_like_index(fieldname text, tablename text, schemaname text, indexname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexName, 'idx_trgm_' || tableName || '_' || fieldName) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  PERFORM ax_define.drop_like_index(fieldName, tableName, indexName);
  EXECUTE 'CREATE INDEX ' || indexName || ' ON ' || schemaName || '.' || tableName || ' USING gin (' || fieldName || ' gin_trgm_ops);';
END;
$$;


--
-- Name: define_multiple_field_index(text[], text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_multiple_field_index(fieldnames text[], tablename text, schemaname text, indexname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  fieldNamesConcat text = array_to_string(array_agg(fieldNames), '_');
  fieldList text = array_to_string(array_agg(fieldNames), ', ');
BEGIN
  SELECT COALESCE(indexName, 'idx_' || tableName || '_' || fieldNamesConcat) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  PERFORM ax_define.drop_multiple_field_index(fieldNames, tableName, indexName);
  EXECUTE 'CREATE INDEX ' || indexName || ' ON ' || schemaName || '.' || tableName || ' (' || fieldList || ');';
END;
$$;


--
-- Name: define_readonly_authentication(text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_readonly_authentication(readpermissions text, tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  perform ax_define.define_authentication(readPermissions, '', tableName, schemaName);
END;
$$;


--
-- Name: define_subscription_triggers(text, text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_subscription_triggers(idcolumn text, tablename text, schemaname text, maintablename text, eventtype text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  createEvent text = eventType || '_CREATED';
  changeEvent text = eventType || '_CHANGED';
  deleteEvent text = eventType || '_DELETED';
BEGIN
  EXECUTE 'COMMENT ON TABLE ' || schemaName || '.' || tableName || '  IS E''@subscription_events_' || mainTableName || ' ' || createEvent || ',' || changeEvent || ',' || deleteEvent || ''';';
  
  EXECUTE 'DROP TRIGGER IF EXISTS _500_gql_' || tableName || '_inserted ON ' || schemaName || '.' || tableName;
  EXECUTE 'CREATE TRIGGER _500_gql_' || tableName || '_inserted after insert on ' || schemaName || '.' || tableName || ' ' ||
          'for each row execute procedure ax_utils.tg__graphql_subscription(''' || createEvent || ''',''graphql:' || mainTableName || ''',''' || idColumn || ''');';

  EXECUTE 'DROP TRIGGER IF EXISTS _500_gql_' || tableName || '_updated ON ' || schemaName || '.' || tableName;
  EXECUTE 'CREATE TRIGGER _500_gql_' || tableName || '_updated after update on ' || schemaName || '.' || tableName || ' ' ||
          'for each row execute procedure ax_utils.tg__graphql_subscription(''' || changeEvent || ''',''graphql:' || mainTableName || ''',''' || idColumn || ''');';

  EXECUTE 'DROP TRIGGER IF EXISTS _500_gql_' || tableName || '_deleted ON ' || schemaName || '.' || tableName;
  EXECUTE 'CREATE TRIGGER _500_gql_' || tableName || '_deleted before delete on ' || schemaName || '.' || tableName || ' ' ||
          'for each row execute procedure ax_utils.tg__graphql_subscription(''' || deleteEvent || ''',''graphql:' || mainTableName || ''',''' || idColumn || ''');';
END;
$$;


--
-- Name: define_tenant_environment_trigger(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_tenant_environment_trigger(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_tenant_environment_trigger(tableName, schemaName);
  EXECUTE 'CREATE trigger _200_tenant_environment BEFORE INSERT OR UPDATE ON ' || schemaName || '.' || tableName ||
          ' for each ROW EXECUTE PROCEDURE ax_utils.tg__tenant_environment();';
  EXECUTE 'CREATE trigger _200_tenant_environment_on_delete BEFORE DELETE ON ' || schemaName || '.' || tableName ||
          ' for each ROW EXECUTE PROCEDURE ax_utils.tg__tenant_environment_on_delete();';
END;
$$;


--
-- Name: define_timestamp_propagation(text, text, text, text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
  SELECT COALESCE(functionName, 'tg_' || tableName || '__' || foreignTableName || '_ts_propagation') INTO functionName;
  PERFORM ax_utils.validate_identifier_length(functionName, 'If the auto-generated name is too long then a "functionName" argument must be provided.');
  -- Set updated_date=now() on the foreign table. This will propogate UPDATE triggers.
  --
  -- A new function is created for each table to do this.
  --     It *may* be possible to use a stock function with trigger arguments but its not easy as NEW and OLD cannot be accessed with dynamic column names. A possible
  --     solution to that is described here: https://itectec.com/database/postgresql-assignment-of-a-column-with-dynamic-column-name/. But even there the advise is
  --     to: "Just write a new trigger function for each table. Less hassle, better performance. Byte the bullet on code duplication:"
  --
  -- WARNING: This function uses "SECURITY DEFINER". This is required to ensure that update to the target table is allowed. This means that the function is
  --          executed with role "DB_OWNER". Any propogated trigger functions will also execute with role "DB_OWNER".
  EXECUTE  '
            CREATE OR REPLACE FUNCTION ' || schemaName || '.' || functionName || '() RETURNS TRIGGER
            LANGUAGE plpgsql
            SECURITY DEFINER
            SET search_path = pg_temp
            AS $b$
            BEGIN
                -- if updated_date exists on source and its not changed, then exit here
                -- this prevents multiple propogation from different children in one transaction
                if (to_jsonb(NEW) ? ''updated_date'') THEN
                    -- must be a seperate condition to prevent exception if column does not exist
                    IF (OLD.updated_date = NEW.updated_date) THEN
                        RETURN NULL;
                    END IF;
                END IF;

                -- UPDATE (where relationship is unchanged, or changed to another entity in which case a change is triggered on both the old and new relation)
                IF (OLD.' || idColumnName || ' IS NOT NULL AND NEW.' || idColumnName || ' IS NOT NULL) THEN
                    UPDATE ' || foreignSchemaName || '.' || foreignTableName || ' SET updated_date=now()
                    WHERE (' || foreignIdColumnName || ' = OLD.' || idColumnName || ') OR (' || foreignIdColumnName || ' = NEW.' || idColumnName || ');

                -- INSERT (or UPDATE which sets nullable relationship)
                ELSIF (NEW.' || idColumnName || ' IS NOT NULL) THEN
                    UPDATE ' || foreignSchemaName || '.' || foreignTableName || ' SET updated_date=now()
                    WHERE ' || foreignIdColumnName || ' = NEW.' || idColumnName || ';

                -- DELETE (or UPDATE which removes nullable relationship)
                ELSIF (OLD.' || idColumnName || ' IS NOT NULL) THEN
                    UPDATE ' || foreignSchemaName || '.' || foreignTableName || ' SET updated_date=now()
                    WHERE ' || foreignIdColumnName || ' = OLD.' || idColumnName || ';

                END IF;
                RETURN NULL;
            END $b$;
            REVOKE EXECUTE ON FUNCTION ' || schemaName || '.' || functionName || '() FROM public;
            ';

  -- Function runs *AFTER* INSERT, UPDATE, DELETE. Propogated queries can still raise an error and rollback the transaction
  EXECUTE  'DROP TRIGGER IF EXISTS _200_propogate_timestamps on ' || schemaName || '.' || tableName;
  EXECUTE  'CREATE trigger _200_propogate_timestamps
            AFTER INSERT OR UPDATE OR DELETE ON ' || schemaName || '.' || tableName || '
            FOR EACH ROW EXECUTE PROCEDURE ' || schemaName || '.' || functionName || '();';
END;
$_$;


--
-- Name: define_timestamps_trigger(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_timestamps_trigger(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_timestamps_trigger(tableName, schemaName);
  -- Full row comparison is not compatible with column type JSON. Expect error: "could not identify an equality operator for type json"
  EXECUTE 'CREATE trigger _100_timestamps BEFORE UPDATE ON ' || schemaName || '.' || tableName ||
          ' for each ROW when (old.* is distinct from new.*) EXECUTE PROCEDURE ax_utils.tg__timestamps();';
END;
$$;


--
-- Name: define_unique_constraint(text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(constraintName, tableName || '_' || fieldName || '_is_unique') INTO constraintName;
  PERFORM ax_utils.validate_identifier_length(constraintName, 'If the auto-generated name is too long then a "constraintName" argument must be provided.');
  PERFORM ax_define.drop_unique_constraint(fieldName, tableName, schemaName, constraintName);
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ADD CONSTRAINT ' ||constraintName || ' UNIQUE (' || fieldName || ');';
END;
$$;


--
-- Name: define_unique_index(text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_unique_index(fieldname text, tablename text, schemaname text, indexname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexName, 'idx_' || tableName || '_' || fieldName) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  PERFORM ax_define.drop_index(fieldName, tableName, indexName);
  EXECUTE 'CREATE UNIQUE INDEX ' || indexName || ' ON ' || schemaName || '.' || tableName || ' (' || fieldName || ');';
END;
$$;


--
-- Name: define_user_id_on_table(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_user_id_on_table(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
  EXECUTE '
    DO $do$ BEGIN
      BEGIN
          ALTER TABLE ' || schemaName || '.' || tableName || ' ADD COLUMN user_id UUID NOT NULL DEFAULT ''00000000-0000-0000-0000-000000000000'';
      EXCEPTION
          WHEN duplicate_column THEN RAISE NOTICE ''The column user_id already exists in the ' || schemaName || '.' || tableName || ' table.'';
      END;
    END $do$;

    ALTER TABLE ' || schemaName || '.' || tableName || ' DROP CONSTRAINT IF EXISTS user_id_not_default;
    ALTER TABLE ' || schemaName || '.' || tableName || ' ADD CONSTRAINT user_id_not_default CHECK (ax_utils.constraint_not_default_uuid(user_id, uuid_nil()));

    SELECT ax_define.define_user_id_trigger(''' || tableName || ''', ''' || schemaName || ''');
  ';
END;
$_$;


--
-- Name: define_user_id_trigger(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_user_id_trigger(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_user_id_trigger(tableName, schemaName);
  EXECUTE 'CREATE trigger _200_user_id BEFORE INSERT OR UPDATE ON ' || schemaName || '.' || tableName ||
          ' for each ROW EXECUTE PROCEDURE ax_utils.tg__user_id();';
END;
$$;


--
-- Name: define_users_trigger(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.define_users_trigger(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_users_trigger(tableName, schemaName);
  -- Full row comparison is not compatible with column type JSON. Expect error: "could not identify an equality operator for type json"
  EXECUTE 'CREATE trigger _200_username BEFORE UPDATE ON ' || schemaName || '.' || tableName ||
          ' for each ROW when (old.* is distinct from new.*) EXECUTE PROCEDURE ax_utils.tg__username();';
  -- INSERT trigger's WHEN condition cannot reference OLD values
  EXECUTE 'CREATE trigger _200_username_before_insert BEFORE INSERT ON ' || schemaName || '.' || tableName ||
          ' for each ROW EXECUTE PROCEDURE ax_utils.tg__username();';
END;
$$;


--
-- Name: drop_index(text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.drop_index(fieldname text, tablename text, indexname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexName, 'idx_' || tableName || '_' || fieldName) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  EXECUTE 'DROP INDEX IF EXISTS ' || indexName || ' cascade;';
END;
$$;


--
-- Name: drop_indexes_with_id(text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.drop_indexes_with_id(fieldname text, tablename text, indexnameasc text DEFAULT NULL::text, indexnamedesc text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexNameAsc, 'idx_' || tableName || '_' || fieldName || '_asc_with_id') INTO indexNameAsc;
  SELECT COALESCE(indexNameDesc, 'idx_' || tableName || '_' || fieldName || '_desc_with_id') INTO indexNameDesc;
  PERFORM ax_utils.validate_identifier_length(indexNameAsc, 'If the auto-generated name is too long then an "indexNameAsc" argument must be provided.');
  PERFORM ax_utils.validate_identifier_length(indexNameDesc, 'If the auto-generated name is too long then an "indexNameDesc" argument must be provided.');
  EXECUTE 'DROP INDEX IF EXISTS ' || indexNameAsc || ' cascade;';
  EXECUTE 'DROP INDEX IF EXISTS ' || indexNameDesc || ' cascade;';
END;
$$;


--
-- Name: drop_like_index(text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.drop_like_index(fieldname text, tablename text, indexname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexName, 'idx_trgm_' || tableName || '_' || fieldName) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  EXECUTE 'DROP INDEX IF EXISTS ' || indexName || ' cascade;';
END;
$$;


--
-- Name: drop_multiple_field_index(text[], text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.drop_multiple_field_index(fieldnames text[], tablename text, indexname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  fieldNamesConcat text = array_to_string(array_agg(fieldNames), '_');
BEGIN
  SELECT COALESCE(indexName, 'idx_' || tableName || '_' || fieldNamesConcat) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  EXECUTE 'DROP INDEX IF EXISTS ' || indexName || ' cascade;';
END;
$$;


--
-- Name: drop_tenant_environment_trigger(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.drop_tenant_environment_trigger(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _200_tenant_environment on ' || schemaName || '.' || tableName || ';';
  EXECUTE 'DROP trigger IF EXISTS _200_tenant_environment_on_delete on ' || schemaName || '.' || tableName || ';';
END;
$$;


--
-- Name: drop_timestamp_propagation(text, text, text, text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.drop_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(functionName, 'tg_' || tableName || '__' || foreignTableName || '_ts_propagation') INTO functionName;
  PERFORM ax_utils.validate_identifier_length(functionName, 'If the auto-generated name is too long then a "functionName" argument must be provided.');
  EXECUTE  'DROP TRIGGER IF EXISTS _200_propogate_timestamps on ' || schemaName || '.' || tableName;
  EXECUTE  'DROP FUNCTION IF EXISTS ' || schemaName || '.' || functionName || '()';
END;
$$;


--
-- Name: drop_timestamps_trigger(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.drop_timestamps_trigger(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _100_timestamps on ' || schemaName || '.' || tableName || ';';
END;
$$;


--
-- Name: drop_unique_constraint(text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.drop_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(constraintName, tableName || '_' || fieldName || '_is_unique') INTO constraintName;
  PERFORM ax_utils.validate_identifier_length(constraintName, 'If the auto-generated name is too long then a "constraintName" argument must be provided.');
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' DROP CONSTRAINT IF EXISTS ' || constraintName || ';';
END;
$$;


--
-- Name: drop_user_id_trigger(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.drop_user_id_trigger(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _200_user_id on ' || schemaName || '.' || tableName || ';';
END;
$$;


--
-- Name: drop_users_trigger(text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.drop_users_trigger(tablename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _200_username on ' || schemaName || '.' || tableName || ';';
  EXECUTE 'DROP trigger IF EXISTS _200_username_before_insert on ' || schemaName || '.' || tableName || ';';
END;
$$;


--
-- Name: live_suggestions_endpoint(text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.live_suggestions_endpoint(propertyname text, typename text, schemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
  EXECUTE 'CREATE OR REPLACE FUNCTION ' || schemaName || '.get_' || typeName || '_values() ' ||
    'RETURNS SETOF text AS $get$ ' ||
      'SELECT DISTINCT ' || propertyName || ' FROM '|| schemaName || '.' || typeName || ' ' ||
      'ORDER BY ' || propertyName || ' ASC' ||
    '$get$ LANGUAGE SQL STABLE;';
END;
$_$;


--
-- Name: pgmemento_create_table_audit(text, text, text, boolean, boolean, boolean); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.pgmemento_create_table_audit(table_name text, schema_name text DEFAULT 'app_public'::text, audit_id_column_name text DEFAULT 'pgmemento_audit_id'::text, log_old_data boolean DEFAULT true, log_new_data boolean DEFAULT false, log_state boolean DEFAULT false) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
    PERFORM pgmemento.create_table_audit($1, $2, $3, $4, $5, $6, TRUE);
EXCEPTION
    -- If this has been run before the table will already have the pgmemento_audit_id column and an error will be thrown.
    WHEN duplicate_column THEN
        RAISE INFO 'Column % already exists on %.%', $3, $2, $1 ;
END;
$_$;


--
-- Name: pgmemento_delete_old_logs(interval); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.pgmemento_delete_old_logs(age interval) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    counter INTEGER;
    transaction_id INTEGER;
    tablename TEXT;
    schemaname TEXT;
BEGIN
    counter := 0;
    FOR transaction_id, tablename, schemaname IN (
        -- 1. Get all transaction metadata and associated table event metadata older than specified age.
        SELECT DISTINCT
            tl.id, el.table_name, el.schema_name
        FROM
            pgmemento.transaction_log tl
            JOIN pgmemento.table_event_log el ON tl.id = el.transaction_id
        WHERE
            tl.txid_time  < NOW() - age)
    LOOP
        -- 2. Delete all table event metadata and row log entries associated with the transaction.
        PERFORM  pgmemento.delete_table_event_log(transaction_id, tablename, schemaname);
        -- 3. Delete the transaction metadata itself.
        PERFORM pgmemento.delete_txid_log(transaction_id);
        counter := counter + 1;
    END LOOP;

    RETURN counter;
END;
$$;


--
-- Name: set_enum_as_column_type(text, text, text, text, text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.set_enum_as_column_type(columnname text, tablename text, schemaname text, enumname text, enumschemaname text, defaultenumvalue text DEFAULT ''::text, notnulloptions text DEFAULT 'NOT NULL'::text, constraintname text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  default_setting TEXT = '';
BEGIN
  SELECT COALESCE(constraintName, tableName || '_' || columnName || '_fkey') INTO constraintName;
  PERFORM ax_utils.validate_identifier_length(constraintName, 'If the auto-generated name is too long then a "constraintName" argument must be provided.');
  IF NOT coalesce(defaultEnumValue, '') = '' THEN
    default_setting = 'DEFAULT ''' || defaultEnumValue || '''::text';
  END IF;
  IF NOT ax_define.column_exists(columnName, tableName, schemaName) THEN
    EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ADD COLUMN ' || columnName ||' text ' || default_setting || ' ' || notNullOptions || ';';
  END IF;

  -- Set the column that uses enum value as a foreign key
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ADD CONSTRAINT ' || constraintName || ' FOREIGN KEY ('|| columnName ||') REFERENCES ' || enumSchemaName || '.' || enumName || '(value);';
END;
$$;


--
-- Name: set_enum_domain(text, text, text, text, text); Type: FUNCTION; Schema: ax_define; Owner: -
--

CREATE FUNCTION ax_define.set_enum_domain(columnname text, tablename text, schemaname text, enumname text, enumschemaname text) RETURNS void
    LANGUAGE plpgsql
    AS $_$
BEGIN
  EXECUTE '
    DO $do$ BEGIN
      BEGIN
        CREATE DOMAIN ' || enumSchemaName || '.' || enumName || ' AS text;
      EXCEPTION
        WHEN duplicate_object THEN RAISE NOTICE ''Domain already existed.'';
      END;
    END $do$;
    ALTER TABLE ' || schemaName || '.' || tableName || ' ALTER COLUMN ' || columnName || ' TYPE ' || enumSchemaName || '.' || enumName || ';
  ';
END;
$_$;


--
-- Name: constraint_has_allowed_value(text, text[], text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_has_allowed_value(input_value text, allowed_values text[], error_message text DEFAULT 'The value "%s" is not in the list of allowed values ("%s").'::text, error_code text DEFAULT 'ALWDV'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if input_value = ANY(allowed_values) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code, input_value, array_to_string(allowed_values, '", "'));
end;
$$;


--
-- Name: constraint_is_base64(text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_is_base64(input_value text, error_message text DEFAULT 'The property must be a Base64 encoded value.'::text, error_code text DEFAULT 'BAS64'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if ax_utils.validation_is_base64(input_value) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code);
end;
$$;


--
-- Name: constraint_is_identifier_key(text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_is_identifier_key(input_value text, error_message text DEFAULT 'The property must only contain letters, numbers, underscores, and dashes.'::text, error_code text DEFAULT 'IDKEY'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if ax_utils.validation_is_identifier_key(input_value) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code);
end;
$$;


--
-- Name: constraint_is_trimmed(text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_is_trimmed(input_value text, error_message text DEFAULT 'The property value must not start or end with whitespace characters.'::text, error_code text DEFAULT 'NTRIM'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if ax_utils.validation_is_trimmed(input_value) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code);
end;
$$;


--
-- Name: constraint_is_url(text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_is_url(input_value text, error_message text DEFAULT 'The property must be a valid URL.'::text, error_code text DEFAULT 'NVURL'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF ax_utils.validation_is_optional_url(input_value) THEN
    RETURN true;
  END IF;
  perform ax_utils.raise_error(error_message, error_code);
END;
$$;


--
-- Name: constraint_matches_pattern(text, text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_matches_pattern(input_value text, pattern text, error_message text DEFAULT 'The value "%s" does not match the pattern "%s".'::text, error_code text DEFAULT 'PATRN'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF input_value !~* pattern THEN
      perform ax_utils.raise_error(error_message, error_code, input_value, pattern);
  END IF;
  RETURN true;
END;
$$;


--
-- Name: constraint_max_length(text, integer, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_max_length(input_value text, max_length integer, error_message text DEFAULT 'The value "%s" is too long. It must be a maximum of %s characters long.'::text, error_code text DEFAULT 'MXLEN'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF length(input_value) > max_length THEN
      perform ax_utils.raise_error(error_message, error_code, input_value, max_length::text);
  END IF;
  RETURN true;
END;
$$;


--
-- Name: constraint_max_value(numeric, numeric, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_max_value(input_value numeric, max_value numeric, error_message text DEFAULT 'The value "%s" is too big. The maximum is %s.'::text, error_code text DEFAULT 'MXVAL'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF input_value > max_value THEN
      perform ax_utils.raise_error(error_message, error_code, input_value::text, max_value::text);
  END IF;
  RETURN true;
END;
$$;


--
-- Name: constraint_min_length(text, integer, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_min_length(input_value text, min_length integer, error_message text DEFAULT 'The value "%s" is not long enough. It must be at least %s characters long.'::text, error_code text DEFAULT 'MNLEN'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF length(input_value) < min_length THEN
  	perform ax_utils.raise_error(error_message, error_code, input_value, min_length::text);
  END IF;
  RETURN true;
END;
$$;


--
-- Name: constraint_min_value(numeric, numeric, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_min_value(input_value numeric, min_value numeric, error_message text DEFAULT 'The value "%s" is too small. The minimum is %s.'::text, error_code text DEFAULT 'MNVAL'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF input_value < min_value THEN
  	perform ax_utils.raise_error(error_message, error_code, input_value::text, min_value::text);
  END IF;
  RETURN true;
END;
$$;


--
-- Name: constraint_not_default_uuid(uuid, uuid, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_not_default_uuid(input_value uuid, default_uuid uuid DEFAULT 'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid, error_message text DEFAULT 'A valid UUID must be provided - the value "%s" is not valid.'::text, error_code text DEFAULT 'UUID0'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if input_value IS NULL OR input_value = default_uuid then
    perform ax_utils.raise_error(error_message, error_code, input_value::text);
  end if;
  return true;
end;
$$;


--
-- Name: constraint_not_empty(text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_not_empty(input_value text, error_message text DEFAULT 'The property value must not be empty.'::text, error_code text DEFAULT 'EMPTY'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if ax_utils.validation_not_empty(input_value) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code);
end;
$$;


--
-- Name: constraint_not_empty_array(text[], text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_not_empty_array(input_value text[], error_message text DEFAULT 'The property must not be an empty array or contain empty/whitespace elements.'::text, error_code text DEFAULT 'EMPTY'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF ax_utils.validation_not_empty_array(input_value) THEN
    RETURN true;
  END IF;
  perform ax_utils.raise_error(error_message, error_code);
END;
$$;


--
-- Name: constraint_starts_with(text, text, text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.constraint_starts_with(input_value text, prefix_value text, error_message text DEFAULT 'The property must start with "%2$s".'::text, error_code text DEFAULT 'STRWT'::text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if ax_utils.validation_starts_with(input_value, prefix_value) then
    return true;
  end if;
  perform ax_utils.raise_error(error_message, error_code, input_value, prefix_value::text);
end;
$$;


--
-- Name: current_environment_id(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.current_environment_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT coalesce(nullif(current_setting('mosaic.environment_id', TRUE), ''), 'ffffffff-ffff-ffff-ffff-ffffffffffff')::UUID;
$$;


--
-- Name: current_tenant_id(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.current_tenant_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT coalesce(nullif(current_setting('mosaic.tenant_id', TRUE), ''), 'ffffffff-ffff-ffff-ffff-ffffffffffff')::UUID;
$$;


--
-- Name: current_user_id(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.current_user_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT coalesce(nullif(current_setting('mosaic.auth.user_id', TRUE), ''), uuid_nil()::TEXT)::UUID;
$$;


--
-- Name: raise_error(text, text, text[]); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.raise_error(error_message text, error_code text, VARIADIC placeholder_values text[] DEFAULT '{}'::text[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  RAISE EXCEPTION '%', format(error_message, VARIADIC placeholder_values) using errcode = error_code;
END;
$$;


--
-- Name: tg__graphql_subscription(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__graphql_subscription() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
  v_process_new bool = (TG_OP = 'INSERT' OR TG_OP = 'UPDATE');
  v_process_old bool = (TG_OP = 'UPDATE' OR TG_OP = 'DELETE');
  v_event text = TG_ARGV[0];
  v_topic_template text = TG_ARGV[1];
  v_attribute text = TG_ARGV[2];
  v_record record;
  v_sub text;
  v_topic text;
  v_i int = 0;
  v_last_topic text;
BEGIN
  FOR v_i IN 0..1 LOOP
    IF (v_i = 0) AND v_process_new IS TRUE THEN
      v_record = new;
    ELSIF (v_i = 1) AND v_process_old IS TRUE THEN
      v_record = old;
    ELSE
      CONTINUE;
    END IF;
    IF v_attribute IS NOT NULL THEN
      EXECUTE 'select $1.' || quote_ident(v_attribute)
        USING v_record
        INTO  v_sub;
    END IF;
    IF v_sub IS NOT NULL THEN
      v_topic = replace(v_topic_template, '$1', v_sub);
    ELSE
      v_topic = v_topic_template;
    END IF;
    IF v_topic IS DISTINCT FROM v_last_topic THEN
      -- This if statement prevents us from triggering the same notification twice
      v_last_topic = v_topic; 
      perform pg_notify(v_topic, json_build_object(
        'event', v_event,
        'subject', v_sub
      )::text);
    END IF;
  END LOOP;
  RETURN v_record;
END;
$_$;


--
-- Name: FUNCTION tg__graphql_subscription(); Type: COMMENT; Schema: ax_utils; Owner: -
--

COMMENT ON FUNCTION ax_utils.tg__graphql_subscription() IS 'This function enables the creation of simple focussed GraphQL subscriptions using database triggers. Read more here: https://www.graphile.org/postgraphile/subscriptions/#custom-subscriptions';


--
-- Name: tg__tenant_environment(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__tenant_environment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	tenant_id text = current_setting('mosaic.tenant_id', TRUE);
  environment_id text = current_setting('mosaic.environment_id', TRUE);
  is_superuser text = current_setting('is_superuser', TRUE);
  ignore_multitenancy text = current_setting('mosaic.ignore_multitenancy', TRUE);
BEGIN
  IF tenant_id <> '' THEN   -- Not null and not empty
    IF NEW.tenant_id::TEXT <> 'ffffffff-ffff-ffff-ffff-ffffffffffff' AND NEW.tenant_id::TEXT <> tenant_id THEN
      perform ax_utils.raise_error('The "mosaic.tenant_id" set via set_config must match the updated/inserted row.', 'TENAN');
    END IF;
    NEW.tenant_id = tenant_id;
  ELSIF is_superuser <> 'on' AND ignore_multitenancy <> 'on' THEN
    perform ax_utils.raise_error('The "mosaic.tenant_id" must be set via set_config value.', 'TENAN');
  END IF;
  IF environment_id <> '' THEN   -- Not null and not empty
    IF NEW.environment_id::TEXT <> 'ffffffff-ffff-ffff-ffff-ffffffffffff' AND NEW.environment_id::TEXT <> environment_id THEN
      perform ax_utils.raise_error('The "mosaic.environment_id" set via set_config must match the updated/inserted row.', 'ENVVV');
    END IF;
    NEW.environment_id = environment_id;
  ELSIF is_superuser <> 'on' AND ignore_multitenancy <> 'on' THEN
    perform ax_utils.raise_error('The "mosaic.environment_id" must be set via set_config value.', 'ENVVV');
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: FUNCTION tg__tenant_environment(); Type: COMMENT; Schema: ax_utils; Owner: -
--

COMMENT ON FUNCTION ax_utils.tg__tenant_environment() IS 'This trigger should be called on tables needing automatic tenant_id, environment_id - to support multi-tenancy';


--
-- Name: tg__tenant_environment_on_delete(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__tenant_environment_on_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	tenant_id text = current_setting('mosaic.tenant_id', TRUE);
  environment_id text = current_setting('mosaic.environment_id', TRUE);
  is_superuser text = current_setting('is_superuser', TRUE);
  ignore_multitenancy text = current_setting('mosaic.ignore_multitenancy', TRUE);
BEGIN
  IF tenant_id <> '' THEN   -- Not null and not empty
    IF OLD.tenant_id::TEXT <> tenant_id THEN
      perform ax_utils.raise_error('The "mosaic.tenant_id" set via set_config must match the deleted row.', 'TENAN');
    END IF;
  ELSIF is_superuser <> 'on' AND ignore_multitenancy <> 'on' THEN
    perform ax_utils.raise_error('The "mosaic.tenant_id" must be set via set_config value.', 'TENAN');
  END IF;
  IF environment_id <> '' THEN   -- Not null and not empty
    IF OLD.environment_id::TEXT <> environment_id THEN
      perform ax_utils.raise_error('The "mosaic.environment_id" set via set_config must match the deleted row.', 'ENVVV');
    END IF;
  ELSIF is_superuser <> 'on' AND ignore_multitenancy <> 'on' THEN
    perform ax_utils.raise_error('The "mosaic.environment_id" must be set via set_config value.', 'ENVVV');
  END IF;
  RETURN OLD;
END;
$$;


--
-- Name: FUNCTION tg__tenant_environment_on_delete(); Type: COMMENT; Schema: ax_utils; Owner: -
--

COMMENT ON FUNCTION ax_utils.tg__tenant_environment_on_delete() IS 'This trigger should be called on tables needing automatic tenant_id, environment_id - to support multi-tenancy';


--
-- Name: tg__timestamps(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__timestamps() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
BEGIN
  NEW.created_date = (CASE WHEN TG_OP = 'INSERT' THEN (now() at time zone 'utc') ELSE OLD.created_date END);
  NEW.updated_date = (CASE WHEN TG_OP = 'UPDATE' AND OLD.updated_date  >= (now() at time zone 'utc') THEN OLD.updated_date  + interval '1 millisecond' ELSE (now() at time zone 'utc') END);
  RETURN NEW;
END;
$$;


--
-- Name: FUNCTION tg__timestamps(); Type: COMMENT; Schema: ax_utils; Owner: -
--

COMMENT ON FUNCTION ax_utils.tg__timestamps() IS 'This trigger should be called on all tables with created_date , updated_date  - it ensures that they cannot be manipulated and that updated_date  will always be larger than the previous updated_date .';


--
-- Name: tg__user_id(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__user_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  user_id_ text = current_setting('mosaic.auth.user_id', TRUE);
BEGIN
  IF user_id_ <> '' AND user_id_ <> uuid_nil()::TEXT THEN -- NOT NULL AND NOT DEFAULT
    NEW.user_id = user_id_;
  ELSEIF NEW.user_id IS NULL THEN
    perform ax_utils.raise_error('The "mosaic.auth.user_id" must be set via set_config value.', 'USRID');
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: FUNCTION tg__user_id(); Type: COMMENT; Schema: ax_utils; Owner: -
--

COMMENT ON FUNCTION ax_utils.tg__user_id() IS 'This trigger should be called on tables needing automatic user_id.';


--
-- Name: tg__username(); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.tg__username() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS $$
DECLARE
	username text = pg_catalog.current_setting('mosaic.auth.subject_name', true);
BEGIN
  if username IS NULL OR username::char(5) = ''::char(5) then
  	RETURN NEW;
  end if;
  
  NEW.created_user = (CASE WHEN TG_OP = 'INSERT' THEN username ELSE OLD.created_user END);
  NEW.updated_user = (CASE WHEN TG_OP = 'UPDATE' OR TG_OP = 'INSERT' THEN username ELSE OLD.updated_user END);
  RETURN NEW;
END;
$$;


--
-- Name: user_has_permission(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.user_has_permission(required_permissions text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
   if ax_utils.user_has_setting(required_permissions, 'mosaic.auth.permissions') = false then
    PERFORM ax_utils.raise_error('At least one of these permissions must be granted: %s', 'PERMI', required_permissions);
   end if;
   return true;
END;
$$;


--
-- Name: user_has_permission_and_tag(text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.user_has_permission_and_tag(required_permissions text, fieldvalue text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
	v_part text;
	v_user_permissions text = ',' || pg_catalog.current_setting('mosaic.auth.permissions', true) || ',';
	v_user_tags text = pg_catalog.current_setting('mosaic.auth.tags', true);
BEGIN
   -- check if the user has the needed permission - otherwise skip
   if ax_utils.user_has_setting(required_permissions, 'mosaic.auth.permissions') = false then
       RAISE EXCEPTION 'At least one of these permissions must be granted: (%)', required_permissions using errcode = 'PERMI'; 
   end if;   
   -- check if any tag matches the discrete column value
   foreach v_part in array string_to_array(v_user_tags, ',')
   loop
       if v_part = CAST (fieldValue AS TEXT) then
           return true;
       end if;
   end loop;
   return false;
END;
$$;


--
-- Name: user_has_setting(text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.user_has_setting(required_settings text, local_variable_field text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
	v_part text;
	v_user_settings text = ',' || pg_catalog.current_setting(local_variable_field, true) || ',';
BEGIN
   foreach v_part in array string_to_array(required_settings, ',')
   loop
       if v_user_settings like '%,' || v_part || ',%' then
           return true;
       end if;
   end loop;
   return false;
END;
$$;


--
-- Name: user_has_tag(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.user_has_tag(required_permissions text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
   return ax_utils.user_has_setting(required_permissions, 'mosaic.auth.tags');
END;
$$;


--
-- Name: validate_identifier_length(text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validate_identifier_length(identifier text, hint text DEFAULT ''::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  stack text; fcesig text; callinfo text;
BEGIN
  IF LENGTH(identifier) > 63 THEN
    -- get sig of calling function
    GET DIAGNOSTICS stack = PG_CONTEXT;
    fcesig := substring(substring(stack from 'function (.*)') from 'function (.*?) line');
    callinfo := CASE WHEN fcesig IS NULL THEN '' ELSE 'Long identifier in ' || fcesig::regprocedure::text || '. ' END;
    perform ax_utils.raise_error('%sIdentifier "%s" exceeds 63 bytes. %s', 'SETUP', callinfo, identifier, hint);
  END IF;
END;
$$;


--
-- Name: validation_is_base64(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_is_base64(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  if input_value !~* '^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$' then
  	return false;
  end if;
  return true;
end;
$_$;


--
-- Name: validation_is_identifier_key(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_is_identifier_key(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  if input_value !~* '^([A-Za-z0-9_\-])*$' then
  	return false;
  end if;
  return true;
end;
$_$;


--
-- Name: validation_is_optional_url(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_is_optional_url(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  if not ax_utils.validation_not_empty(input_value) THEN
    return true;
  end if;

  if input_value !~* 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,255}(\.[a-z]{2,9})?\y([-a-zA-Z0-9@:%_\+.~#?&//=]*)$' then
  	return false;
  end if;
  return true;
end;
$_$;


--
-- Name: validation_is_trimmed(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_is_trimmed(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  if input_value !~* '^(?!.*^[\s])(?!.*[\s]$).*$' then
  	return false;
  end if;
  return true;
end;
$_$;


--
-- Name: validation_is_url(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_is_url(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
begin
  if input_value !~* 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,255}(\.[a-z]{2,9})?\y([-a-zA-Z0-9@:%_\+.~#?&//=]*)$' then
  	return false;
  end if;
  return true;
end;
$_$;


--
-- Name: validation_not_empty(text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_not_empty(input_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if input_value IS NULL OR input_value !~* '.*\S.*' then
  	return false;
  end if;
  return true;
end;
$$;


--
-- Name: validation_not_empty_array(text[]); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_not_empty_array(input_value text[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  val_ TEXT;
BEGIN
  IF array_length(input_value, 1) IS NULL THEN 
    RETURN FALSE;
  END IF;
 
 
  FOREACH val_ IN ARRAY input_value LOOP
 	  IF val_ IS NULL OR val_ !~* '.*\S.*' THEN
  	  	RETURN FALSE;
  	END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$;


--
-- Name: validation_starts_with(text, text); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_starts_with(input_value text, prefix_value text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
  if input_value like prefix_value || '%' then
  	return true;
  end if;
  return false;
end;
$$;


--
-- Name: validation_valid_url_array(text[]); Type: FUNCTION; Schema: ax_utils; Owner: -
--

CREATE FUNCTION ax_utils.validation_valid_url_array(input_value text[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  val_ TEXT;
BEGIN
  IF array_length(input_value, 1) IS NOT NULL THEN 
    FOREACH val_ IN ARRAY input_value LOOP
      IF val_ IS NOT NULL THEN
        IF NOT ax_utils.validation_is_url(val_) THEN
          RETURN FALSE;
        END IF;
      ELSIF val_ IS NULL OR val_ !~* '.*\S.*' THEN
  	  	RETURN FALSE;
      END IF;
    END LOOP;
  END IF;
  RETURN TRUE;
END;
$$;


--
-- Name: notify_watchers_ddl(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;


--
-- Name: notify_watchers_drop(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;


--
-- Name: messaging_counter; Type: TABLE; Schema: app_private; Owner: -
--

CREATE TABLE app_private.messaging_counter (
    key text NOT NULL,
    counter integer DEFAULT 1,
    expiration_date timestamp with time zone DEFAULT timezone('utc'::text, (now() + '1 day'::interval)) NOT NULL
);


--
-- Name: collection_image_type; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.collection_image_type (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE collection_image_type; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.collection_image_type IS '@enum';


--
-- Name: collection_relations; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.collection_relations (
    id integer NOT NULL,
    collection_id integer NOT NULL,
    sort_order integer NOT NULL,
    movie_id integer,
    tvshow_id integer,
    season_id integer,
    episode_id integer,
    CONSTRAINT exactly_one_relation CHECK ((num_nonnulls(movie_id, tvshow_id, season_id, episode_id) = 1))
);


--
-- Name: TABLE collection_relations; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.collection_relations IS '@subscription_events_collections COLLECTION_RELATION_CREATED,COLLECTION_RELATION_CHANGED,COLLECTION_RELATION_DELETED';


--
-- Name: collection_relations_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.collection_relations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.collection_relations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: collections; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.collections (
    id integer NOT NULL,
    title text NOT NULL,
    external_id text,
    synopsis text,
    description text,
    published_date timestamp with time zone,
    published_user text,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    publish_status app_public.publish_status_enum DEFAULT 'NOT_PUBLISHED'::text NOT NULL,
    CONSTRAINT title_max_length CHECK (ax_utils.constraint_max_length(title, 100, 'The title can only be %2$s characters long.'::text)),
    CONSTRAINT title_not_empty CHECK (ax_utils.constraint_not_empty(title, 'The title cannot be empty.'::text))
);


--
-- Name: TABLE collections; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.collections IS '@subscription_events_collections COLLECTION_CREATED,COLLECTION_CHANGED,COLLECTION_DELETED';


--
-- Name: collections_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.collections ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.collections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: collections_images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.collections_images (
    collection_id integer NOT NULL,
    image_id uuid NOT NULL,
    image_type app_public.collection_image_type_enum NOT NULL
);


--
-- Name: TABLE collections_images; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.collections_images IS '@subscription_events_collections COLLECTION_IMAGE_CREATED,COLLECTION_IMAGE_CHANGED,COLLECTION_IMAGE_DELETED';


--
-- Name: collections_snapshots; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.collections_snapshots (
    collection_id integer NOT NULL,
    snapshot_id integer NOT NULL
);


--
-- Name: collections_tags; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.collections_tags (
    collection_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE collections_tags; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.collections_tags IS '@subscription_events_collections COLLECTION_TAG_CREATED,COLLECTION_TAG_CHANGED,COLLECTION_TAG_DELETED';


--
-- Name: entity_type; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.entity_type (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE entity_type; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.entity_type IS '@enum';


--
-- Name: episode_image_type; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episode_image_type (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE episode_image_type; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.episode_image_type IS '@enum';


--
-- Name: episodes; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episodes (
    id integer NOT NULL,
    season_id integer,
    index integer NOT NULL,
    title text NOT NULL,
    external_id text,
    original_title text,
    synopsis text,
    description text,
    studio text,
    released date,
    main_video_id uuid,
    published_date timestamp with time zone,
    published_user text,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    publish_status app_public.publish_status_enum DEFAULT 'NOT_PUBLISHED'::text NOT NULL,
    ingest_correlation_id integer,
    CONSTRAINT title_max_length CHECK (ax_utils.constraint_max_length(title, 100, 'The title can only be %2$s characters long.'::text)),
    CONSTRAINT title_not_empty CHECK (ax_utils.constraint_not_empty(title, 'The title cannot be empty.'::text))
);


--
-- Name: TABLE episodes; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.episodes IS '@subscription_events_episodes EPISODE_CREATED,EPISODE_CHANGED,EPISODE_DELETED';


--
-- Name: COLUMN episodes.ingest_correlation_id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.episodes.ingest_correlation_id IS '@omit';


--
-- Name: episodes_casts; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episodes_casts (
    episode_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE episodes_casts; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.episodes_casts IS '@subscription_events_episodes EPISODE_CAST_CREATED,EPISODE_CAST_CHANGED,EPISODE_CAST_DELETED';


--
-- Name: episodes_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.episodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: episodes_images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episodes_images (
    episode_id integer NOT NULL,
    image_id uuid NOT NULL,
    image_type app_public.episode_image_type_enum NOT NULL
);


--
-- Name: TABLE episodes_images; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.episodes_images IS '@subscription_events_episodes EPISODE_IMAGE_CREATED,EPISODE_IMAGE_CHANGED,EPISODE_IMAGE_DELETED';


--
-- Name: episodes_licenses; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episodes_licenses (
    id integer NOT NULL,
    episode_id integer NOT NULL,
    license_start timestamp with time zone,
    license_end timestamp with time zone,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: TABLE episodes_licenses; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.episodes_licenses IS '@subscription_events_episodes EPISODE_LICENSE_CREATED,EPISODE_LICENSE_CHANGED,EPISODE_LICENSE_DELETED';


--
-- Name: episodes_licenses_countries; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episodes_licenses_countries (
    episodes_license_id integer NOT NULL,
    code app_public.iso_alpha_two_country_codes_enum NOT NULL
);


--
-- Name: TABLE episodes_licenses_countries; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.episodes_licenses_countries IS '@subscription_events_episodes_licenses EPISODE_LICENSE_COUNTRY_CREATED,EPISODE_LICENSE_COUNTRY_CHANGED,EPISODE_LICENSE_COUNTRY_DELETED';


--
-- Name: episodes_licenses_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes_licenses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.episodes_licenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: episodes_production_countries; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episodes_production_countries (
    episode_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE episodes_production_countries; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.episodes_production_countries IS '@subscription_events_episodes EPISODE_PRODUCTION_COUNTRY_CREATED,EPISODE_PRODUCTION_COUNTRY_CHANGED,EPISODE_PRODUCTION_COUNTRY_DELETED';


--
-- Name: episodes_snapshots; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episodes_snapshots (
    episode_id integer NOT NULL,
    snapshot_id integer NOT NULL
);


--
-- Name: episodes_tags; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episodes_tags (
    episode_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE episodes_tags; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.episodes_tags IS '@subscription_events_episodes EPISODE_TAG_CREATED,EPISODE_TAG_CHANGED,EPISODE_TAG_DELETED';


--
-- Name: episodes_trailers; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episodes_trailers (
    episode_id integer NOT NULL,
    video_id uuid NOT NULL
);


--
-- Name: TABLE episodes_trailers; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.episodes_trailers IS '@subscription_events_episodes EPISODE_TRAILER_CREATED,EPISODE_TRAILER_CHANGED,EPISODE_TRAILER_DELETED';


--
-- Name: episodes_tvshow_genres; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.episodes_tvshow_genres (
    episode_id integer NOT NULL,
    tvshow_genres_id integer NOT NULL
);


--
-- Name: TABLE episodes_tvshow_genres; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.episodes_tvshow_genres IS '@subscription_events_episodes EPISODE_TVSHOW_GENRE_CREATED,EPISODE_TVSHOW_GENRE_CHANGED,EPISODE_TVSHOW_GENRE_DELETED';


--
-- Name: ingest_documents; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.ingest_documents (
    id integer NOT NULL,
    name text NOT NULL,
    document_created timestamp with time zone,
    document app_public.ingest_document_object NOT NULL,
    title text NOT NULL,
    items_count integer NOT NULL,
    error_count integer DEFAULT 0 NOT NULL,
    success_count integer DEFAULT 0 NOT NULL,
    in_progress_count integer DEFAULT 0 NOT NULL,
    errors jsonb[] DEFAULT '{}'::jsonb[] NOT NULL,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    status app_public.ingest_status_enum DEFAULT 'IN_PROGRESS'::text NOT NULL,
    CONSTRAINT title_max_length CHECK (ax_utils.constraint_max_length(title, 50, 'The title can only be %2$s characters long.'::text)),
    CONSTRAINT title_not_empty CHECK (ax_utils.constraint_not_empty(title, 'The title cannot be empty.'::text))
);


--
-- Name: TABLE ingest_documents; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.ingest_documents IS '@subscription_events_ingest_documents INGEST_DOCUMENT_CREATED,INGEST_DOCUMENT_CHANGED,INGEST_DOCUMENT_DELETED';


--
-- Name: ingest_documents_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.ingest_documents ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.ingest_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ingest_entity_exists_status; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.ingest_entity_exists_status (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE ingest_entity_exists_status; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.ingest_entity_exists_status IS '@enum';


--
-- Name: ingest_item_status; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.ingest_item_status (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE ingest_item_status; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.ingest_item_status IS '@enum';


--
-- Name: ingest_item_step_status; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.ingest_item_step_status (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE ingest_item_step_status; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.ingest_item_step_status IS '@enum';


--
-- Name: ingest_item_step_type; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.ingest_item_step_type (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE ingest_item_step_type; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.ingest_item_step_type IS '@enum';


--
-- Name: ingest_item_steps; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.ingest_item_steps (
    id uuid NOT NULL,
    ingest_item_id integer NOT NULL,
    sub_type text NOT NULL,
    response_message text,
    type app_public.ingest_item_step_type_enum NOT NULL,
    status app_public.ingest_item_step_status_enum DEFAULT 'IN_PROGRESS'::text NOT NULL,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    entity_id text
);


--
-- Name: ingest_item_type; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.ingest_item_type (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE ingest_item_type; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.ingest_item_type IS '@enum';


--
-- Name: ingest_items; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.ingest_items (
    id integer NOT NULL,
    ingest_document_id integer NOT NULL,
    external_id text NOT NULL,
    entity_id integer NOT NULL,
    item app_public.ingest_item_object NOT NULL,
    display_title text NOT NULL,
    processed_trailer_ids uuid[] DEFAULT '{}'::uuid[] NOT NULL,
    errors jsonb[] DEFAULT '{}'::jsonb[] NOT NULL,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    status app_public.ingest_item_status_enum DEFAULT 'IN_PROGRESS'::text NOT NULL,
    exists_status app_public.ingest_entity_exists_status_enum NOT NULL,
    type app_public.ingest_item_type_enum NOT NULL
);


--
-- Name: TABLE ingest_items; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.ingest_items IS '@subscription_events_ingest_documents INGEST_ITEM_CREATED,INGEST_ITEM_CHANGED,INGEST_ITEM_DELETED';


--
-- Name: ingest_items_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.ingest_items ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.ingest_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ingest_status; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.ingest_status (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE ingest_status; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.ingest_status IS '@enum';


--
-- Name: iso_alpha_two_country_codes; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.iso_alpha_two_country_codes (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE iso_alpha_two_country_codes; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.iso_alpha_two_country_codes IS '@enum';


--
-- Name: movie_genres; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movie_genres (
    id integer NOT NULL,
    title text NOT NULL,
    sort_order integer NOT NULL,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    CONSTRAINT title_is_trimmed CHECK (ax_utils.constraint_is_trimmed(title, 'The title must not start or end with whitespace value.'::text)),
    CONSTRAINT title_max_length CHECK (ax_utils.constraint_max_length(title, 50, 'The title can only be %2$s characters long.'::text)),
    CONSTRAINT title_not_empty CHECK (ax_utils.constraint_not_empty(title, 'The title cannot be empty.'::text))
);


--
-- Name: TABLE movie_genres; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movie_genres IS '@subscription_events_movie_genres MOVIE_GENRE_CREATED,MOVIE_GENRE_CHANGED,MOVIE_GENRE_DELETED';


--
-- Name: movie_genres_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movie_genres ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.movie_genres_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: movie_image_type; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movie_image_type (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE movie_image_type; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movie_image_type IS '@enum';


--
-- Name: movies; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movies (
    id integer NOT NULL,
    title text NOT NULL,
    external_id text,
    original_title text,
    synopsis text,
    description text,
    studio text,
    released date,
    main_video_id uuid,
    published_date timestamp with time zone,
    published_user text,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    publish_status app_public.publish_status_enum DEFAULT 'NOT_PUBLISHED'::text NOT NULL,
    ingest_correlation_id integer,
    CONSTRAINT title_max_length CHECK (ax_utils.constraint_max_length(title, 100, 'The title can only be %2$s characters long.'::text)),
    CONSTRAINT title_not_empty CHECK (ax_utils.constraint_not_empty(title, 'The title cannot be empty.'::text))
);


--
-- Name: TABLE movies; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movies IS '@subscription_events_movies MOVIE_CREATED,MOVIE_CHANGED,MOVIE_DELETED';


--
-- Name: COLUMN movies.ingest_correlation_id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.movies.ingest_correlation_id IS '@omit';


--
-- Name: movies_casts; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movies_casts (
    movie_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE movies_casts; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movies_casts IS '@subscription_events_movies MOVIE_CAST_CREATED,MOVIE_CAST_CHANGED,MOVIE_CAST_DELETED';


--
-- Name: movies_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.movies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: movies_images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movies_images (
    movie_id integer NOT NULL,
    image_id uuid NOT NULL,
    image_type app_public.movie_image_type_enum NOT NULL
);


--
-- Name: TABLE movies_images; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movies_images IS '@subscription_events_movies MOVIE_IMAGE_CREATED,MOVIE_IMAGE_CHANGED,MOVIE_IMAGE_DELETED';


--
-- Name: movies_licenses; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movies_licenses (
    id integer NOT NULL,
    movie_id integer NOT NULL,
    license_start timestamp with time zone,
    license_end timestamp with time zone,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: TABLE movies_licenses; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movies_licenses IS '@subscription_events_movies MOVIE_LICENSE_CREATED,MOVIE_LICENSE_CHANGED,MOVIE_LICENSE_DELETED';


--
-- Name: movies_licenses_countries; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movies_licenses_countries (
    movies_license_id integer NOT NULL,
    code app_public.iso_alpha_two_country_codes_enum NOT NULL
);


--
-- Name: TABLE movies_licenses_countries; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movies_licenses_countries IS '@subscription_events_movies_licenses MOVIE_LICENSE_COUNTRY_CREATED,MOVIE_LICENSE_COUNTRY_CHANGED,MOVIE_LICENSE_COUNTRY_DELETED';


--
-- Name: movies_licenses_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies_licenses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.movies_licenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: movies_movie_genres; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movies_movie_genres (
    movie_id integer NOT NULL,
    movie_genres_id integer NOT NULL
);


--
-- Name: TABLE movies_movie_genres; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movies_movie_genres IS '@subscription_events_movies MOVIE_MOVIE_GENRE_CREATED,MOVIE_MOVIE_GENRE_CHANGED,MOVIE_MOVIE_GENRE_DELETED';


--
-- Name: movies_production_countries; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movies_production_countries (
    movie_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE movies_production_countries; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movies_production_countries IS '@subscription_events_movies MOVIE_PRODUCTION_COUNTRY_CREATED,MOVIE_PRODUCTION_COUNTRY_CHANGED,MOVIE_PRODUCTION_COUNTRY_DELETED';


--
-- Name: movies_snapshots; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movies_snapshots (
    movie_id integer NOT NULL,
    snapshot_id integer NOT NULL
);


--
-- Name: movies_tags; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movies_tags (
    movie_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE movies_tags; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movies_tags IS '@subscription_events_movies MOVIE_TAG_CREATED,MOVIE_TAG_CHANGED,MOVIE_TAG_DELETED';


--
-- Name: movies_trailers; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.movies_trailers (
    movie_id integer NOT NULL,
    video_id uuid NOT NULL
);


--
-- Name: TABLE movies_trailers; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.movies_trailers IS '@subscription_events_movies MOVIE_TRAILER_CREATED,MOVIE_TRAILER_CHANGED,MOVIE_TRAILER_DELETED';


--
-- Name: publish_status; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.publish_status (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE publish_status; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.publish_status IS '@enum';


--
-- Name: season_image_type; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.season_image_type (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE season_image_type; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.season_image_type IS '@enum';


--
-- Name: seasons; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.seasons (
    id integer NOT NULL,
    tvshow_id integer,
    index integer NOT NULL,
    external_id text,
    synopsis text,
    description text,
    studio text,
    released date,
    published_date timestamp with time zone,
    published_user text,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    publish_status app_public.publish_status_enum DEFAULT 'NOT_PUBLISHED'::text NOT NULL,
    ingest_correlation_id integer
);


--
-- Name: TABLE seasons; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.seasons IS '@subscription_events_seasons SEASON_CREATED,SEASON_CHANGED,SEASON_DELETED';


--
-- Name: COLUMN seasons.ingest_correlation_id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.seasons.ingest_correlation_id IS '@omit';


--
-- Name: seasons_casts; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.seasons_casts (
    season_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE seasons_casts; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.seasons_casts IS '@subscription_events_seasons SEASON_CAST_CREATED,SEASON_CAST_CHANGED,SEASON_CAST_DELETED';


--
-- Name: seasons_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.seasons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: seasons_images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.seasons_images (
    season_id integer NOT NULL,
    image_id uuid NOT NULL,
    image_type app_public.season_image_type_enum NOT NULL
);


--
-- Name: TABLE seasons_images; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.seasons_images IS '@subscription_events_seasons SEASON_IMAGE_CREATED,SEASON_IMAGE_CHANGED,SEASON_IMAGE_DELETED';


--
-- Name: seasons_licenses; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.seasons_licenses (
    id integer NOT NULL,
    season_id integer NOT NULL,
    license_start timestamp with time zone,
    license_end timestamp with time zone,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: TABLE seasons_licenses; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.seasons_licenses IS '@subscription_events_seasons SEASON_LICENSE_CREATED,SEASON_LICENSE_CHANGED,SEASON_LICENSE_DELETED';


--
-- Name: seasons_licenses_countries; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.seasons_licenses_countries (
    seasons_license_id integer NOT NULL,
    code app_public.iso_alpha_two_country_codes_enum NOT NULL
);


--
-- Name: TABLE seasons_licenses_countries; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.seasons_licenses_countries IS '@subscription_events_seasons_licenses SEASON_LICENSE_COUNTRY_CREATED,SEASON_LICENSE_COUNTRY_CHANGED,SEASON_LICENSE_COUNTRY_DELETED';


--
-- Name: seasons_licenses_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons_licenses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.seasons_licenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: seasons_production_countries; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.seasons_production_countries (
    season_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE seasons_production_countries; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.seasons_production_countries IS '@subscription_events_seasons SEASON_PRODUCTION_COUNTRY_CREATED,SEASON_PRODUCTION_COUNTRY_CHANGED,SEASON_PRODUCTION_COUNTRY_DELETED';


--
-- Name: seasons_snapshots; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.seasons_snapshots (
    season_id integer NOT NULL,
    snapshot_id integer NOT NULL
);


--
-- Name: seasons_tags; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.seasons_tags (
    season_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE seasons_tags; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.seasons_tags IS '@subscription_events_seasons SEASON_TAG_CREATED,SEASON_TAG_CHANGED,SEASON_TAG_DELETED';


--
-- Name: seasons_trailers; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.seasons_trailers (
    season_id integer NOT NULL,
    video_id uuid NOT NULL
);


--
-- Name: TABLE seasons_trailers; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.seasons_trailers IS '@subscription_events_seasons SEASON_TRAILER_CREATED,SEASON_TRAILER_CHANGED,SEASON_TRAILER_DELETED';


--
-- Name: seasons_tvshow_genres; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.seasons_tvshow_genres (
    season_id integer NOT NULL,
    tvshow_genres_id integer NOT NULL
);


--
-- Name: TABLE seasons_tvshow_genres; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.seasons_tvshow_genres IS '@subscription_events_seasons SEASON_TVSHOW_GENRE_CREATED,SEASON_TVSHOW_GENRE_CHANGED,SEASON_TVSHOW_GENRE_DELETED';


--
-- Name: snapshot_state; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.snapshot_state (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE snapshot_state; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.snapshot_state IS '@enum';


--
-- Name: snapshot_validation_issue_context; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.snapshot_validation_issue_context (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE snapshot_validation_issue_context; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.snapshot_validation_issue_context IS '@enum';


--
-- Name: snapshot_validation_issue_severity; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.snapshot_validation_issue_severity (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE snapshot_validation_issue_severity; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.snapshot_validation_issue_severity IS '@enum';


--
-- Name: snapshot_validation_results; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.snapshot_validation_results (
    id integer NOT NULL,
    snapshot_id integer NOT NULL,
    severity app_public.snapshot_validation_issue_severity_enum NOT NULL,
    context app_public.snapshot_validation_issue_context_enum NOT NULL,
    message text NOT NULL,
    entity_type app_public.entity_type_enum NOT NULL
);


--
-- Name: TABLE snapshot_validation_results; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.snapshot_validation_results IS '@subscription_events_snapshots SNAPSHOT_VALIDATION_RESULT_CREATED,SNAPSHOT_VALIDATION_RESULT_CHANGED,SNAPSHOT_VALIDATION_RESULT_DELETED';


--
-- Name: snapshot_validation_results_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.snapshot_validation_results ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.snapshot_validation_results_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: snapshot_validation_status; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.snapshot_validation_status (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE snapshot_validation_status; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.snapshot_validation_status IS '@enum';


--
-- Name: snapshots; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.snapshots (
    id integer NOT NULL,
    entity_id integer NOT NULL,
    publish_id text NOT NULL,
    job_id text NOT NULL,
    snapshot_no integer NOT NULL,
    entity_title text,
    entity_type app_public.entity_type_enum NOT NULL,
    validation_status app_public.snapshot_validation_status_enum,
    snapshot_json json,
    snapshot_state app_public.snapshot_state_enum DEFAULT 'INITIALIZATION'::text NOT NULL,
    scheduled_date timestamp with time zone,
    published_date timestamp with time zone,
    unpublished_date timestamp with time zone,
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    is_list_snapshot boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE snapshots; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.snapshots IS '@subscription_events_snapshots SNAPSHOT_CREATED,SNAPSHOT_CHANGED,SNAPSHOT_DELETED';


--
-- Name: snapshots_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.snapshots ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.snapshots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tvshow_genres; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshow_genres (
    id integer NOT NULL,
    title text NOT NULL,
    sort_order integer NOT NULL,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    CONSTRAINT title_is_trimmed CHECK (ax_utils.constraint_is_trimmed(title, 'The title must not start or end with whitespace value.'::text)),
    CONSTRAINT title_max_length CHECK (ax_utils.constraint_max_length(title, 50, 'The title can only be %2$s characters long.'::text)),
    CONSTRAINT title_not_empty CHECK (ax_utils.constraint_not_empty(title, 'The title cannot be empty.'::text))
);


--
-- Name: TABLE tvshow_genres; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshow_genres IS '@subscription_events_tvshow_genres TVSHOW_GENRE_CREATED,TVSHOW_GENRE_CHANGED,TVSHOW_GENRE_DELETED';


--
-- Name: tvshow_genres_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshow_genres ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.tvshow_genres_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tvshow_image_type; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshow_image_type (
    value text NOT NULL,
    description text
);


--
-- Name: TABLE tvshow_image_type; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshow_image_type IS '@enum';


--
-- Name: tvshows; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshows (
    id integer NOT NULL,
    title text NOT NULL,
    external_id text,
    original_title text,
    synopsis text,
    description text,
    studio text,
    released date,
    published_date timestamp with time zone,
    published_user text,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL,
    publish_status app_public.publish_status_enum DEFAULT 'NOT_PUBLISHED'::text NOT NULL,
    ingest_correlation_id integer,
    CONSTRAINT title_max_length CHECK (ax_utils.constraint_max_length(title, 100, 'The title can only be %2$s characters long.'::text)),
    CONSTRAINT title_not_empty CHECK (ax_utils.constraint_not_empty(title, 'The title cannot be empty.'::text))
);


--
-- Name: TABLE tvshows; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshows IS '@subscription_events_tvshows TVSHOW_CREATED,TVSHOW_CHANGED,TVSHOW_DELETED';


--
-- Name: COLUMN tvshows.ingest_correlation_id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.tvshows.ingest_correlation_id IS '@omit';


--
-- Name: tvshows_casts; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshows_casts (
    tvshow_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE tvshows_casts; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshows_casts IS '@subscription_events_tvshows TVSHOW_CAST_CREATED,TVSHOW_CAST_CHANGED,TVSHOW_CAST_DELETED';


--
-- Name: tvshows_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.tvshows_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tvshows_images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshows_images (
    tvshow_id integer NOT NULL,
    image_id uuid NOT NULL,
    image_type app_public.tvshow_image_type_enum NOT NULL
);


--
-- Name: TABLE tvshows_images; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshows_images IS '@subscription_events_tvshows TVSHOW_IMAGE_CREATED,TVSHOW_IMAGE_CHANGED,TVSHOW_IMAGE_DELETED';


--
-- Name: tvshows_licenses; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshows_licenses (
    id integer NOT NULL,
    tvshow_id integer NOT NULL,
    license_start timestamp with time zone,
    license_end timestamp with time zone,
    created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: TABLE tvshows_licenses; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshows_licenses IS '@subscription_events_tvshows TVSHOW_LICENSE_CREATED,TVSHOW_LICENSE_CHANGED,TVSHOW_LICENSE_DELETED';


--
-- Name: tvshows_licenses_countries; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshows_licenses_countries (
    tvshows_license_id integer NOT NULL,
    code app_public.iso_alpha_two_country_codes_enum NOT NULL
);


--
-- Name: TABLE tvshows_licenses_countries; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshows_licenses_countries IS '@subscription_events_tvshows_licenses TVSHOW_LICENSE_COUNTRY_CREATED,TVSHOW_LICENSE_COUNTRY_CHANGED,TVSHOW_LICENSE_COUNTRY_DELETED';


--
-- Name: tvshows_licenses_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows_licenses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME app_public.tvshows_licenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tvshows_production_countries; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshows_production_countries (
    tvshow_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE tvshows_production_countries; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshows_production_countries IS '@subscription_events_tvshows TVSHOW_PRODUCTION_COUNTRY_CREATED,TVSHOW_PRODUCTION_COUNTRY_CHANGED,TVSHOW_PRODUCTION_COUNTRY_DELETED';


--
-- Name: tvshows_snapshots; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshows_snapshots (
    tvshow_id integer NOT NULL,
    snapshot_id integer NOT NULL
);


--
-- Name: tvshows_tags; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshows_tags (
    tvshow_id integer NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK (ax_utils.constraint_not_empty(name, 'The name cannot be empty.'::text))
);


--
-- Name: TABLE tvshows_tags; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshows_tags IS '@subscription_events_tvshows TVSHOW_TAG_CREATED,TVSHOW_TAG_CHANGED,TVSHOW_TAG_DELETED';


--
-- Name: tvshows_trailers; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshows_trailers (
    tvshow_id integer NOT NULL,
    video_id uuid NOT NULL
);


--
-- Name: TABLE tvshows_trailers; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshows_trailers IS '@subscription_events_tvshows TVSHOW_TRAILER_CREATED,TVSHOW_TRAILER_CHANGED,TVSHOW_TRAILER_DELETED';


--
-- Name: tvshows_tvshow_genres; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.tvshows_tvshow_genres (
    tvshow_id integer NOT NULL,
    tvshow_genres_id integer NOT NULL
);


--
-- Name: TABLE tvshows_tvshow_genres; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON TABLE app_public.tvshows_tvshow_genres IS '@subscription_events_tvshows TVSHOW_TVSHOW_GENRE_CREATED,TVSHOW_TVSHOW_GENRE_CHANGED,TVSHOW_TVSHOW_GENRE_DELETED';


--
-- Name: inbox inbox_pkey; Type: CONSTRAINT; Schema: app_hidden; Owner: -
--

ALTER TABLE ONLY app_hidden.inbox
    ADD CONSTRAINT inbox_pkey PRIMARY KEY (id);


--
-- Name: outbox outbox_pkey; Type: CONSTRAINT; Schema: app_hidden; Owner: -
--

ALTER TABLE ONLY app_hidden.outbox
    ADD CONSTRAINT outbox_pkey PRIMARY KEY (id);


--
-- Name: messaging_counter messaging_counter_pkey; Type: CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.messaging_counter
    ADD CONSTRAINT messaging_counter_pkey PRIMARY KEY (key);


--
-- Name: collections_images collection_id_image_type_are_unique; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections_images
    ADD CONSTRAINT collection_id_image_type_are_unique UNIQUE (collection_id, image_type);


--
-- Name: collection_image_type collection_image_type_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_image_type
    ADD CONSTRAINT collection_image_type_pkey PRIMARY KEY (value);


--
-- Name: collection_relations collection_relations_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT collection_relations_pkey PRIMARY KEY (id);


--
-- Name: collection_relations collection_relations_sort_order_is_unique; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT collection_relations_sort_order_is_unique UNIQUE (collection_id, sort_order) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: collections collections_external_id_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections
    ADD CONSTRAINT collections_external_id_key UNIQUE (external_id);


--
-- Name: collections_images collections_images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections_images
    ADD CONSTRAINT collections_images_pkey PRIMARY KEY (collection_id, image_id, image_type);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: collections_snapshots collections_snapshots_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections_snapshots
    ADD CONSTRAINT collections_snapshots_pkey PRIMARY KEY (collection_id, snapshot_id);


--
-- Name: collections_tags collections_tags_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections_tags
    ADD CONSTRAINT collections_tags_pkey PRIMARY KEY (collection_id, name);


--
-- Name: entity_type entity_type_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.entity_type
    ADD CONSTRAINT entity_type_pkey PRIMARY KEY (value);


--
-- Name: episodes_images episode_id_image_type_are_unique; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_images
    ADD CONSTRAINT episode_id_image_type_are_unique UNIQUE (episode_id, image_type);


--
-- Name: episode_image_type episode_image_type_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episode_image_type
    ADD CONSTRAINT episode_image_type_pkey PRIMARY KEY (value);


--
-- Name: episodes_casts episodes_casts_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_casts
    ADD CONSTRAINT episodes_casts_pkey PRIMARY KEY (episode_id, name);


--
-- Name: episodes episodes_external_id_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes
    ADD CONSTRAINT episodes_external_id_key UNIQUE (external_id);


--
-- Name: episodes_images episodes_images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_images
    ADD CONSTRAINT episodes_images_pkey PRIMARY KEY (episode_id, image_id, image_type);


--
-- Name: episodes_licenses_countries episodes_licenses_countries_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_licenses_countries
    ADD CONSTRAINT episodes_licenses_countries_pkey PRIMARY KEY (episodes_license_id, code);


--
-- Name: episodes_licenses episodes_licenses_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_licenses
    ADD CONSTRAINT episodes_licenses_pkey PRIMARY KEY (id);


--
-- Name: episodes episodes_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes
    ADD CONSTRAINT episodes_pkey PRIMARY KEY (id);


--
-- Name: episodes_production_countries episodes_production_countries_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_production_countries
    ADD CONSTRAINT episodes_production_countries_pkey PRIMARY KEY (episode_id, name);


--
-- Name: episodes_snapshots episodes_snapshots_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_snapshots
    ADD CONSTRAINT episodes_snapshots_pkey PRIMARY KEY (episode_id, snapshot_id);


--
-- Name: episodes_tags episodes_tags_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_tags
    ADD CONSTRAINT episodes_tags_pkey PRIMARY KEY (episode_id, name);


--
-- Name: episodes_trailers episodes_trailers_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_trailers
    ADD CONSTRAINT episodes_trailers_pkey PRIMARY KEY (episode_id, video_id);


--
-- Name: episodes_tvshow_genres episodes_tvshow_genres_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_tvshow_genres
    ADD CONSTRAINT episodes_tvshow_genres_pkey PRIMARY KEY (episode_id, tvshow_genres_id);


--
-- Name: ingest_documents ingest_documents_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_documents
    ADD CONSTRAINT ingest_documents_pkey PRIMARY KEY (id);


--
-- Name: ingest_entity_exists_status ingest_entity_exists_status_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_entity_exists_status
    ADD CONSTRAINT ingest_entity_exists_status_pkey PRIMARY KEY (value);


--
-- Name: ingest_item_status ingest_item_status_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_item_status
    ADD CONSTRAINT ingest_item_status_pkey PRIMARY KEY (value);


--
-- Name: ingest_item_step_status ingest_item_step_status_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_item_step_status
    ADD CONSTRAINT ingest_item_step_status_pkey PRIMARY KEY (value);


--
-- Name: ingest_item_step_type ingest_item_step_type_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_item_step_type
    ADD CONSTRAINT ingest_item_step_type_pkey PRIMARY KEY (value);


--
-- Name: ingest_item_steps ingest_item_steps_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_item_steps
    ADD CONSTRAINT ingest_item_steps_pkey PRIMARY KEY (id);


--
-- Name: ingest_item_type ingest_item_type_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_item_type
    ADD CONSTRAINT ingest_item_type_pkey PRIMARY KEY (value);


--
-- Name: ingest_items ingest_items_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_items
    ADD CONSTRAINT ingest_items_pkey PRIMARY KEY (id);


--
-- Name: ingest_status ingest_status_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_status
    ADD CONSTRAINT ingest_status_pkey PRIMARY KEY (value);


--
-- Name: iso_alpha_two_country_codes iso_alpha_two_country_codes_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.iso_alpha_two_country_codes
    ADD CONSTRAINT iso_alpha_two_country_codes_pkey PRIMARY KEY (value);


--
-- Name: movie_genres movie_genres_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movie_genres
    ADD CONSTRAINT movie_genres_pkey PRIMARY KEY (id);


--
-- Name: movie_genres movie_genres_sort_order_is_unique; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movie_genres
    ADD CONSTRAINT movie_genres_sort_order_is_unique UNIQUE (sort_order) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: movies_images movie_id_image_type_are_unique; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_images
    ADD CONSTRAINT movie_id_image_type_are_unique UNIQUE (movie_id, image_type);


--
-- Name: movie_image_type movie_image_type_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movie_image_type
    ADD CONSTRAINT movie_image_type_pkey PRIMARY KEY (value);


--
-- Name: movies_casts movies_casts_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_casts
    ADD CONSTRAINT movies_casts_pkey PRIMARY KEY (movie_id, name);


--
-- Name: movies movies_external_id_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies
    ADD CONSTRAINT movies_external_id_key UNIQUE (external_id);


--
-- Name: movies_images movies_images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_images
    ADD CONSTRAINT movies_images_pkey PRIMARY KEY (movie_id, image_id, image_type);


--
-- Name: movies_licenses_countries movies_licenses_countries_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_licenses_countries
    ADD CONSTRAINT movies_licenses_countries_pkey PRIMARY KEY (movies_license_id, code);


--
-- Name: movies_licenses movies_licenses_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_licenses
    ADD CONSTRAINT movies_licenses_pkey PRIMARY KEY (id);


--
-- Name: movies_movie_genres movies_movie_genres_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_movie_genres
    ADD CONSTRAINT movies_movie_genres_pkey PRIMARY KEY (movie_id, movie_genres_id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- Name: movies_production_countries movies_production_countries_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_production_countries
    ADD CONSTRAINT movies_production_countries_pkey PRIMARY KEY (movie_id, name);


--
-- Name: movies_snapshots movies_snapshots_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_snapshots
    ADD CONSTRAINT movies_snapshots_pkey PRIMARY KEY (movie_id, snapshot_id);


--
-- Name: movies_tags movies_tags_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_tags
    ADD CONSTRAINT movies_tags_pkey PRIMARY KEY (movie_id, name);


--
-- Name: movies_trailers movies_trailers_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_trailers
    ADD CONSTRAINT movies_trailers_pkey PRIMARY KEY (movie_id, video_id);


--
-- Name: publish_status publish_status_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.publish_status
    ADD CONSTRAINT publish_status_pkey PRIMARY KEY (value);


--
-- Name: seasons_images season_id_image_type_are_unique; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_images
    ADD CONSTRAINT season_id_image_type_are_unique UNIQUE (season_id, image_type);


--
-- Name: season_image_type season_image_type_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.season_image_type
    ADD CONSTRAINT season_image_type_pkey PRIMARY KEY (value);


--
-- Name: seasons_casts seasons_casts_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_casts
    ADD CONSTRAINT seasons_casts_pkey PRIMARY KEY (season_id, name);


--
-- Name: seasons seasons_external_id_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons
    ADD CONSTRAINT seasons_external_id_key UNIQUE (external_id);


--
-- Name: seasons_images seasons_images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_images
    ADD CONSTRAINT seasons_images_pkey PRIMARY KEY (season_id, image_id, image_type);


--
-- Name: seasons_licenses_countries seasons_licenses_countries_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_licenses_countries
    ADD CONSTRAINT seasons_licenses_countries_pkey PRIMARY KEY (seasons_license_id, code);


--
-- Name: seasons_licenses seasons_licenses_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_licenses
    ADD CONSTRAINT seasons_licenses_pkey PRIMARY KEY (id);


--
-- Name: seasons seasons_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons
    ADD CONSTRAINT seasons_pkey PRIMARY KEY (id);


--
-- Name: seasons_production_countries seasons_production_countries_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_production_countries
    ADD CONSTRAINT seasons_production_countries_pkey PRIMARY KEY (season_id, name);


--
-- Name: seasons_snapshots seasons_snapshots_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_snapshots
    ADD CONSTRAINT seasons_snapshots_pkey PRIMARY KEY (season_id, snapshot_id);


--
-- Name: seasons_tags seasons_tags_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_tags
    ADD CONSTRAINT seasons_tags_pkey PRIMARY KEY (season_id, name);


--
-- Name: seasons_trailers seasons_trailers_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_trailers
    ADD CONSTRAINT seasons_trailers_pkey PRIMARY KEY (season_id, video_id);


--
-- Name: seasons_tvshow_genres seasons_tvshow_genres_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_tvshow_genres
    ADD CONSTRAINT seasons_tvshow_genres_pkey PRIMARY KEY (season_id, tvshow_genres_id);


--
-- Name: snapshot_state snapshot_state_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshot_state
    ADD CONSTRAINT snapshot_state_pkey PRIMARY KEY (value);


--
-- Name: snapshot_validation_issue_context snapshot_validation_issue_context_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshot_validation_issue_context
    ADD CONSTRAINT snapshot_validation_issue_context_pkey PRIMARY KEY (value);


--
-- Name: snapshot_validation_issue_severity snapshot_validation_issue_severity_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshot_validation_issue_severity
    ADD CONSTRAINT snapshot_validation_issue_severity_pkey PRIMARY KEY (value);


--
-- Name: snapshot_validation_results snapshot_validation_results_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshot_validation_results
    ADD CONSTRAINT snapshot_validation_results_pkey PRIMARY KEY (id);


--
-- Name: snapshot_validation_status snapshot_validation_status_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshot_validation_status
    ADD CONSTRAINT snapshot_validation_status_pkey PRIMARY KEY (value);


--
-- Name: snapshots snapshots_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshots
    ADD CONSTRAINT snapshots_pkey PRIMARY KEY (id);


--
-- Name: tvshow_genres tvshow_genres_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshow_genres
    ADD CONSTRAINT tvshow_genres_pkey PRIMARY KEY (id);


--
-- Name: tvshow_genres tvshow_genres_sort_order_is_unique; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshow_genres
    ADD CONSTRAINT tvshow_genres_sort_order_is_unique UNIQUE (sort_order) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: tvshows_images tvshow_id_image_type_are_unique; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_images
    ADD CONSTRAINT tvshow_id_image_type_are_unique UNIQUE (tvshow_id, image_type);


--
-- Name: tvshow_image_type tvshow_image_type_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshow_image_type
    ADD CONSTRAINT tvshow_image_type_pkey PRIMARY KEY (value);


--
-- Name: tvshows_casts tvshows_casts_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_casts
    ADD CONSTRAINT tvshows_casts_pkey PRIMARY KEY (tvshow_id, name);


--
-- Name: tvshows tvshows_external_id_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows
    ADD CONSTRAINT tvshows_external_id_key UNIQUE (external_id);


--
-- Name: tvshows_images tvshows_images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_images
    ADD CONSTRAINT tvshows_images_pkey PRIMARY KEY (tvshow_id, image_id, image_type);


--
-- Name: tvshows_licenses_countries tvshows_licenses_countries_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_licenses_countries
    ADD CONSTRAINT tvshows_licenses_countries_pkey PRIMARY KEY (tvshows_license_id, code);


--
-- Name: tvshows_licenses tvshows_licenses_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_licenses
    ADD CONSTRAINT tvshows_licenses_pkey PRIMARY KEY (id);


--
-- Name: tvshows tvshows_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows
    ADD CONSTRAINT tvshows_pkey PRIMARY KEY (id);


--
-- Name: tvshows_production_countries tvshows_production_countries_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_production_countries
    ADD CONSTRAINT tvshows_production_countries_pkey PRIMARY KEY (tvshow_id, name);


--
-- Name: tvshows_snapshots tvshows_snapshots_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_snapshots
    ADD CONSTRAINT tvshows_snapshots_pkey PRIMARY KEY (tvshow_id, snapshot_id);


--
-- Name: tvshows_tags tvshows_tags_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_tags
    ADD CONSTRAINT tvshows_tags_pkey PRIMARY KEY (tvshow_id, name);


--
-- Name: tvshows_trailers tvshows_trailers_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_trailers
    ADD CONSTRAINT tvshows_trailers_pkey PRIMARY KEY (tvshow_id, video_id);


--
-- Name: tvshows_tvshow_genres tvshows_tvshow_genres_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_tvshow_genres
    ADD CONSTRAINT tvshows_tvshow_genres_pkey PRIMARY KEY (tvshow_id, tvshow_genres_id);


--
-- Name: collection_relations unique_episode_per_collection; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT unique_episode_per_collection UNIQUE (collection_id, episode_id);


--
-- Name: collection_relations unique_movie_per_collection; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT unique_movie_per_collection UNIQUE (collection_id, movie_id);


--
-- Name: collection_relations unique_season_per_collection; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT unique_season_per_collection UNIQUE (collection_id, season_id);


--
-- Name: collection_relations unique_tvshow_per_collection; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT unique_tvshow_per_collection UNIQUE (collection_id, tvshow_id);


--
-- Name: idx_inbox_abandoned_at; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_inbox_abandoned_at ON app_hidden.inbox USING btree (abandoned_at);


--
-- Name: idx_inbox_created_at; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_inbox_created_at ON app_hidden.inbox USING btree (created_at);


--
-- Name: idx_inbox_locked_until; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_inbox_locked_until ON app_hidden.inbox USING btree (locked_until);


--
-- Name: idx_inbox_processed_at; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_inbox_processed_at ON app_hidden.inbox USING btree (processed_at);


--
-- Name: idx_inbox_segment; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_inbox_segment ON app_hidden.inbox USING btree (segment);


--
-- Name: idx_outbox_abandoned_at; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_outbox_abandoned_at ON app_hidden.outbox USING btree (abandoned_at);


--
-- Name: idx_outbox_created_at; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_outbox_created_at ON app_hidden.outbox USING btree (created_at);


--
-- Name: idx_outbox_locked_until; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_outbox_locked_until ON app_hidden.outbox USING btree (locked_until);


--
-- Name: idx_outbox_processed_at; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_outbox_processed_at ON app_hidden.outbox USING btree (processed_at);


--
-- Name: idx_outbox_segment; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_outbox_segment ON app_hidden.outbox USING btree (segment);


--
-- Name: idx_collection_relations_episode_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collection_relations_episode_id ON app_public.collection_relations USING btree (episode_id);


--
-- Name: idx_collection_relations_movie_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collection_relations_movie_id ON app_public.collection_relations USING btree (movie_id);


--
-- Name: idx_collection_relations_season_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collection_relations_season_id ON app_public.collection_relations USING btree (season_id);


--
-- Name: idx_collection_relations_tvshow_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collection_relations_tvshow_id ON app_public.collection_relations USING btree (tvshow_id);


--
-- Name: idx_collections_created_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_created_date_asc_with_id ON app_public.collections USING btree (created_date, id);


--
-- Name: idx_collections_created_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_created_date_desc_with_id ON app_public.collections USING btree (created_date DESC, id);


--
-- Name: idx_collections_external_id_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_external_id_asc_with_id ON app_public.collections USING btree (external_id, id);


--
-- Name: idx_collections_external_id_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_external_id_desc_with_id ON app_public.collections USING btree (external_id DESC, id);


--
-- Name: idx_collections_images_collection_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_images_collection_id ON app_public.collections_images USING btree (collection_id);


--
-- Name: idx_collections_publish_status; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_publish_status ON app_public.collections USING btree (publish_status);


--
-- Name: idx_collections_tags_collection_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_tags_collection_id ON app_public.collections_tags USING btree (collection_id);


--
-- Name: idx_collections_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_title_asc_with_id ON app_public.collections USING btree (title, id);


--
-- Name: idx_collections_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_title_desc_with_id ON app_public.collections USING btree (title DESC, id);


--
-- Name: idx_collections_updated_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_updated_date_asc_with_id ON app_public.collections USING btree (updated_date, id);


--
-- Name: idx_collections_updated_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_collections_updated_date_desc_with_id ON app_public.collections USING btree (updated_date DESC, id);


--
-- Name: idx_episodes_casts_episode_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_casts_episode_id ON app_public.episodes_casts USING btree (episode_id);


--
-- Name: idx_episodes_created_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_created_date_asc_with_id ON app_public.episodes USING btree (created_date, id);


--
-- Name: idx_episodes_created_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_created_date_desc_with_id ON app_public.episodes USING btree (created_date DESC, id);


--
-- Name: idx_episodes_external_id_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_external_id_asc_with_id ON app_public.episodes USING btree (external_id, id);


--
-- Name: idx_episodes_external_id_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_external_id_desc_with_id ON app_public.episodes USING btree (external_id DESC, id);


--
-- Name: idx_episodes_images_episode_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_images_episode_id ON app_public.episodes_images USING btree (episode_id);


--
-- Name: idx_episodes_index_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_index_asc_with_id ON app_public.episodes USING btree (index, id);


--
-- Name: idx_episodes_index_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_index_desc_with_id ON app_public.episodes USING btree (index DESC, id);


--
-- Name: idx_episodes_licenses_countries_code; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_licenses_countries_code ON app_public.episodes_licenses_countries USING btree (code);


--
-- Name: idx_episodes_licenses_countries_episodes_license_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_licenses_countries_episodes_license_id ON app_public.episodes_licenses_countries USING btree (episodes_license_id);


--
-- Name: idx_episodes_licenses_episode_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_licenses_episode_id ON app_public.episodes_licenses USING btree (episode_id);


--
-- Name: idx_episodes_licenses_license_end_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_licenses_license_end_asc_with_id ON app_public.episodes_licenses USING btree (license_end, id);


--
-- Name: idx_episodes_licenses_license_end_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_licenses_license_end_desc_with_id ON app_public.episodes_licenses USING btree (license_end DESC, id);


--
-- Name: idx_episodes_licenses_license_start_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_licenses_license_start_asc_with_id ON app_public.episodes_licenses USING btree (license_start, id);


--
-- Name: idx_episodes_licenses_license_start_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_licenses_license_start_desc_with_id ON app_public.episodes_licenses USING btree (license_start DESC, id);


--
-- Name: idx_episodes_original_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_original_title_asc_with_id ON app_public.episodes USING btree (original_title, id);


--
-- Name: idx_episodes_original_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_original_title_desc_with_id ON app_public.episodes USING btree (original_title DESC, id);


--
-- Name: idx_episodes_production_countries_episode_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_production_countries_episode_id ON app_public.episodes_production_countries USING btree (episode_id);


--
-- Name: idx_episodes_publish_status; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_publish_status ON app_public.episodes USING btree (publish_status);


--
-- Name: idx_episodes_released_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_released_asc_with_id ON app_public.episodes USING btree (released, id);


--
-- Name: idx_episodes_released_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_released_desc_with_id ON app_public.episodes USING btree (released DESC, id);


--
-- Name: idx_episodes_season_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_season_id ON app_public.episodes USING btree (season_id);


--
-- Name: idx_episodes_tags_episode_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_tags_episode_id ON app_public.episodes_tags USING btree (episode_id);


--
-- Name: idx_episodes_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_title_asc_with_id ON app_public.episodes USING btree (title, id);


--
-- Name: idx_episodes_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_title_desc_with_id ON app_public.episodes USING btree (title DESC, id);


--
-- Name: idx_episodes_trailers_episode_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_trailers_episode_id ON app_public.episodes_trailers USING btree (episode_id);


--
-- Name: idx_episodes_tvshow_genres_episode_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_tvshow_genres_episode_id ON app_public.episodes_tvshow_genres USING btree (episode_id);


--
-- Name: idx_episodes_tvshow_genres_tvshow_genres_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_tvshow_genres_tvshow_genres_id ON app_public.episodes_tvshow_genres USING btree (tvshow_genres_id);


--
-- Name: idx_episodes_updated_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_updated_date_asc_with_id ON app_public.episodes USING btree (updated_date, id);


--
-- Name: idx_episodes_updated_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_episodes_updated_date_desc_with_id ON app_public.episodes USING btree (updated_date DESC, id);


--
-- Name: idx_ingest_documents_created_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_created_date_asc_with_id ON app_public.ingest_documents USING btree (created_date, id);


--
-- Name: idx_ingest_documents_created_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_created_date_desc_with_id ON app_public.ingest_documents USING btree (created_date DESC, id);


--
-- Name: idx_ingest_documents_error_count_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_error_count_asc_with_id ON app_public.ingest_documents USING btree (error_count, id);


--
-- Name: idx_ingest_documents_error_count_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_error_count_desc_with_id ON app_public.ingest_documents USING btree (error_count DESC, id);


--
-- Name: idx_ingest_documents_in_progress_count_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_in_progress_count_asc_with_id ON app_public.ingest_documents USING btree (in_progress_count, id);


--
-- Name: idx_ingest_documents_in_progress_count_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_in_progress_count_desc_with_id ON app_public.ingest_documents USING btree (in_progress_count DESC, id);


--
-- Name: idx_ingest_documents_items_count_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_items_count_asc_with_id ON app_public.ingest_documents USING btree (items_count, id);


--
-- Name: idx_ingest_documents_items_count_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_items_count_desc_with_id ON app_public.ingest_documents USING btree (items_count DESC, id);


--
-- Name: idx_ingest_documents_name_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_name_asc_with_id ON app_public.ingest_documents USING btree (name, id);


--
-- Name: idx_ingest_documents_name_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_name_desc_with_id ON app_public.ingest_documents USING btree (name DESC, id);


--
-- Name: idx_ingest_documents_status_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_status_asc_with_id ON app_public.ingest_documents USING btree (status, id);


--
-- Name: idx_ingest_documents_status_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_status_desc_with_id ON app_public.ingest_documents USING btree (status DESC, id);


--
-- Name: idx_ingest_documents_success_count_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_success_count_asc_with_id ON app_public.ingest_documents USING btree (success_count, id);


--
-- Name: idx_ingest_documents_success_count_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_success_count_desc_with_id ON app_public.ingest_documents USING btree (success_count DESC, id);


--
-- Name: idx_ingest_documents_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_title_asc_with_id ON app_public.ingest_documents USING btree (title, id);


--
-- Name: idx_ingest_documents_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_title_desc_with_id ON app_public.ingest_documents USING btree (title DESC, id);


--
-- Name: idx_ingest_documents_updated_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_updated_date_asc_with_id ON app_public.ingest_documents USING btree (updated_date, id);


--
-- Name: idx_ingest_documents_updated_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_documents_updated_date_desc_with_id ON app_public.ingest_documents USING btree (updated_date DESC, id);


--
-- Name: idx_ingest_item_steps_ingest_item_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_item_steps_ingest_item_id ON app_public.ingest_item_steps USING btree (ingest_item_id);


--
-- Name: idx_ingest_item_steps_status; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_item_steps_status ON app_public.ingest_item_steps USING btree (status);


--
-- Name: idx_ingest_item_steps_sub_type; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_item_steps_sub_type ON app_public.ingest_item_steps USING btree (sub_type);


--
-- Name: idx_ingest_item_steps_type; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_item_steps_type ON app_public.ingest_item_steps USING btree (type);


--
-- Name: idx_ingest_items_exists_status_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_items_exists_status_asc_with_id ON app_public.ingest_items USING btree (exists_status, id);


--
-- Name: idx_ingest_items_exists_status_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_items_exists_status_desc_with_id ON app_public.ingest_items USING btree (exists_status DESC, id);


--
-- Name: idx_ingest_items_external_id_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_items_external_id_asc_with_id ON app_public.ingest_items USING btree (external_id, id);


--
-- Name: idx_ingest_items_external_id_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_items_external_id_desc_with_id ON app_public.ingest_items USING btree (external_id DESC, id);


--
-- Name: idx_ingest_items_ingest_document_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_items_ingest_document_id ON app_public.ingest_items USING btree (ingest_document_id);


--
-- Name: idx_ingest_items_status_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_items_status_asc_with_id ON app_public.ingest_items USING btree (status, id);


--
-- Name: idx_ingest_items_status_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_items_status_desc_with_id ON app_public.ingest_items USING btree (status DESC, id);


--
-- Name: idx_ingest_items_type_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_items_type_asc_with_id ON app_public.ingest_items USING btree (type, id);


--
-- Name: idx_ingest_items_type_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_ingest_items_type_desc_with_id ON app_public.ingest_items USING btree (type DESC, id);


--
-- Name: idx_movie_genres_created_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movie_genres_created_date_asc_with_id ON app_public.movie_genres USING btree (created_date, id);


--
-- Name: idx_movie_genres_created_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movie_genres_created_date_desc_with_id ON app_public.movie_genres USING btree (created_date DESC, id);


--
-- Name: idx_movie_genres_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE UNIQUE INDEX idx_movie_genres_title ON app_public.movie_genres USING btree (title);


--
-- Name: idx_movie_genres_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movie_genres_title_asc_with_id ON app_public.movie_genres USING btree (title, id);


--
-- Name: idx_movie_genres_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movie_genres_title_desc_with_id ON app_public.movie_genres USING btree (title DESC, id);


--
-- Name: idx_movie_genres_updated_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movie_genres_updated_date_asc_with_id ON app_public.movie_genres USING btree (updated_date, id);


--
-- Name: idx_movie_genres_updated_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movie_genres_updated_date_desc_with_id ON app_public.movie_genres USING btree (updated_date DESC, id);


--
-- Name: idx_movies_casts_movie_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_casts_movie_id ON app_public.movies_casts USING btree (movie_id);


--
-- Name: idx_movies_created_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_created_date_asc_with_id ON app_public.movies USING btree (created_date, id);


--
-- Name: idx_movies_created_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_created_date_desc_with_id ON app_public.movies USING btree (created_date DESC, id);


--
-- Name: idx_movies_external_id_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_external_id_asc_with_id ON app_public.movies USING btree (external_id, id);


--
-- Name: idx_movies_external_id_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_external_id_desc_with_id ON app_public.movies USING btree (external_id DESC, id);


--
-- Name: idx_movies_images_movie_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_images_movie_id ON app_public.movies_images USING btree (movie_id);


--
-- Name: idx_movies_licenses_countries_code; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_licenses_countries_code ON app_public.movies_licenses_countries USING btree (code);


--
-- Name: idx_movies_licenses_countries_movies_license_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_licenses_countries_movies_license_id ON app_public.movies_licenses_countries USING btree (movies_license_id);


--
-- Name: idx_movies_licenses_license_end_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_licenses_license_end_asc_with_id ON app_public.movies_licenses USING btree (license_end, id);


--
-- Name: idx_movies_licenses_license_end_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_licenses_license_end_desc_with_id ON app_public.movies_licenses USING btree (license_end DESC, id);


--
-- Name: idx_movies_licenses_license_start_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_licenses_license_start_asc_with_id ON app_public.movies_licenses USING btree (license_start, id);


--
-- Name: idx_movies_licenses_license_start_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_licenses_license_start_desc_with_id ON app_public.movies_licenses USING btree (license_start DESC, id);


--
-- Name: idx_movies_licenses_movie_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_licenses_movie_id ON app_public.movies_licenses USING btree (movie_id);


--
-- Name: idx_movies_movie_genres_movie_genres_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_movie_genres_movie_genres_id ON app_public.movies_movie_genres USING btree (movie_genres_id);


--
-- Name: idx_movies_movie_genres_movie_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_movie_genres_movie_id ON app_public.movies_movie_genres USING btree (movie_id);


--
-- Name: idx_movies_original_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_original_title_asc_with_id ON app_public.movies USING btree (original_title, id);


--
-- Name: idx_movies_original_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_original_title_desc_with_id ON app_public.movies USING btree (original_title DESC, id);


--
-- Name: idx_movies_production_countries_movie_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_production_countries_movie_id ON app_public.movies_production_countries USING btree (movie_id);


--
-- Name: idx_movies_publish_status; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_publish_status ON app_public.movies USING btree (publish_status);


--
-- Name: idx_movies_released_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_released_asc_with_id ON app_public.movies USING btree (released, id);


--
-- Name: idx_movies_released_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_released_desc_with_id ON app_public.movies USING btree (released DESC, id);


--
-- Name: idx_movies_tags_movie_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_tags_movie_id ON app_public.movies_tags USING btree (movie_id);


--
-- Name: idx_movies_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_title_asc_with_id ON app_public.movies USING btree (title, id);


--
-- Name: idx_movies_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_title_desc_with_id ON app_public.movies USING btree (title DESC, id);


--
-- Name: idx_movies_trailers_movie_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_trailers_movie_id ON app_public.movies_trailers USING btree (movie_id);


--
-- Name: idx_movies_updated_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_updated_date_asc_with_id ON app_public.movies USING btree (updated_date, id);


--
-- Name: idx_movies_updated_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_movies_updated_date_desc_with_id ON app_public.movies USING btree (updated_date DESC, id);


--
-- Name: idx_seasons_casts_season_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_casts_season_id ON app_public.seasons_casts USING btree (season_id);


--
-- Name: idx_seasons_created_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_created_date_asc_with_id ON app_public.seasons USING btree (created_date, id);


--
-- Name: idx_seasons_created_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_created_date_desc_with_id ON app_public.seasons USING btree (created_date DESC, id);


--
-- Name: idx_seasons_external_id_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_external_id_asc_with_id ON app_public.seasons USING btree (external_id, id);


--
-- Name: idx_seasons_external_id_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_external_id_desc_with_id ON app_public.seasons USING btree (external_id DESC, id);


--
-- Name: idx_seasons_images_season_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_images_season_id ON app_public.seasons_images USING btree (season_id);


--
-- Name: idx_seasons_index_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_index_asc_with_id ON app_public.seasons USING btree (index, id);


--
-- Name: idx_seasons_index_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_index_desc_with_id ON app_public.seasons USING btree (index DESC, id);


--
-- Name: idx_seasons_licenses_countries_code; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_licenses_countries_code ON app_public.seasons_licenses_countries USING btree (code);


--
-- Name: idx_seasons_licenses_countries_seasons_license_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_licenses_countries_seasons_license_id ON app_public.seasons_licenses_countries USING btree (seasons_license_id);


--
-- Name: idx_seasons_licenses_license_end_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_licenses_license_end_asc_with_id ON app_public.seasons_licenses USING btree (license_end, id);


--
-- Name: idx_seasons_licenses_license_end_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_licenses_license_end_desc_with_id ON app_public.seasons_licenses USING btree (license_end DESC, id);


--
-- Name: idx_seasons_licenses_license_start_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_licenses_license_start_asc_with_id ON app_public.seasons_licenses USING btree (license_start, id);


--
-- Name: idx_seasons_licenses_license_start_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_licenses_license_start_desc_with_id ON app_public.seasons_licenses USING btree (license_start DESC, id);


--
-- Name: idx_seasons_licenses_season_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_licenses_season_id ON app_public.seasons_licenses USING btree (season_id);


--
-- Name: idx_seasons_production_countries_season_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_production_countries_season_id ON app_public.seasons_production_countries USING btree (season_id);


--
-- Name: idx_seasons_publish_status; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_publish_status ON app_public.seasons USING btree (publish_status);


--
-- Name: idx_seasons_released_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_released_asc_with_id ON app_public.seasons USING btree (released, id);


--
-- Name: idx_seasons_released_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_released_desc_with_id ON app_public.seasons USING btree (released DESC, id);


--
-- Name: idx_seasons_tags_season_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_tags_season_id ON app_public.seasons_tags USING btree (season_id);


--
-- Name: idx_seasons_trailers_season_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_trailers_season_id ON app_public.seasons_trailers USING btree (season_id);


--
-- Name: idx_seasons_tvshow_genres_season_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_tvshow_genres_season_id ON app_public.seasons_tvshow_genres USING btree (season_id);


--
-- Name: idx_seasons_tvshow_genres_tvshow_genres_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_tvshow_genres_tvshow_genres_id ON app_public.seasons_tvshow_genres USING btree (tvshow_genres_id);


--
-- Name: idx_seasons_tvshow_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_tvshow_id ON app_public.seasons USING btree (tvshow_id);


--
-- Name: idx_seasons_updated_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_updated_date_asc_with_id ON app_public.seasons USING btree (updated_date, id);


--
-- Name: idx_seasons_updated_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_seasons_updated_date_desc_with_id ON app_public.seasons USING btree (updated_date DESC, id);


--
-- Name: idx_snapshot_validation_results_severity; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshot_validation_results_severity ON app_public.snapshot_validation_results USING btree (severity);


--
-- Name: idx_snapshot_validation_results_snapshot_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshot_validation_results_snapshot_id ON app_public.snapshot_validation_results USING btree (snapshot_id);


--
-- Name: idx_snapshots_created_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_created_date_asc_with_id ON app_public.snapshots USING btree (created_date, id);


--
-- Name: idx_snapshots_created_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_created_date_desc_with_id ON app_public.snapshots USING btree (created_date DESC, id);


--
-- Name: idx_snapshots_created_user_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_created_user_asc_with_id ON app_public.snapshots USING btree (created_user, id);


--
-- Name: idx_snapshots_created_user_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_created_user_desc_with_id ON app_public.snapshots USING btree (created_user DESC, id);


--
-- Name: idx_snapshots_entity_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_entity_id ON app_public.snapshots USING btree (entity_id);


--
-- Name: idx_snapshots_entity_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_entity_title_asc_with_id ON app_public.snapshots USING btree (entity_title, id);


--
-- Name: idx_snapshots_entity_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_entity_title_desc_with_id ON app_public.snapshots USING btree (entity_title DESC, id);


--
-- Name: idx_snapshots_entity_type_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_entity_type_asc_with_id ON app_public.snapshots USING btree (entity_type, id);


--
-- Name: idx_snapshots_entity_type_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_entity_type_desc_with_id ON app_public.snapshots USING btree (entity_type DESC, id);


--
-- Name: idx_snapshots_job_id_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_job_id_asc_with_id ON app_public.snapshots USING btree (job_id, id);


--
-- Name: idx_snapshots_job_id_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_job_id_desc_with_id ON app_public.snapshots USING btree (job_id DESC, id);


--
-- Name: idx_snapshots_published_date; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_published_date ON app_public.snapshots USING btree (published_date);


--
-- Name: idx_snapshots_scheduled_date; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_scheduled_date ON app_public.snapshots USING btree (scheduled_date);


--
-- Name: idx_snapshots_snapshot_state_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_snapshot_state_asc_with_id ON app_public.snapshots USING btree (snapshot_state, id);


--
-- Name: idx_snapshots_snapshot_state_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_snapshot_state_desc_with_id ON app_public.snapshots USING btree (snapshot_state DESC, id);


--
-- Name: idx_snapshots_unpublished_date; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_unpublished_date ON app_public.snapshots USING btree (unpublished_date);


--
-- Name: idx_snapshots_updated_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_updated_date_asc_with_id ON app_public.snapshots USING btree (updated_date, id);


--
-- Name: idx_snapshots_updated_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_updated_date_desc_with_id ON app_public.snapshots USING btree (updated_date DESC, id);


--
-- Name: idx_snapshots_updated_user_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_updated_user_asc_with_id ON app_public.snapshots USING btree (updated_user, id);


--
-- Name: idx_snapshots_updated_user_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_updated_user_desc_with_id ON app_public.snapshots USING btree (updated_user DESC, id);


--
-- Name: idx_snapshots_validation_status_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_validation_status_asc_with_id ON app_public.snapshots USING btree (validation_status, id);


--
-- Name: idx_snapshots_validation_status_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_snapshots_validation_status_desc_with_id ON app_public.snapshots USING btree (validation_status DESC, id);


--
-- Name: idx_trgm_collections_tags_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_collections_tags_name ON app_public.collections_tags USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_collections_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_collections_title ON app_public.collections USING gin (title public.gin_trgm_ops);


--
-- Name: idx_trgm_episodes_casts_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_episodes_casts_name ON app_public.episodes_casts USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_episodes_original_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_episodes_original_title ON app_public.episodes USING gin (original_title public.gin_trgm_ops);


--
-- Name: idx_trgm_episodes_production_countries_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_episodes_production_countries_name ON app_public.episodes_production_countries USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_episodes_tags_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_episodes_tags_name ON app_public.episodes_tags USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_episodes_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_episodes_title ON app_public.episodes USING gin (title public.gin_trgm_ops);


--
-- Name: idx_trgm_ingest_documents_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_ingest_documents_name ON app_public.ingest_documents USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_ingest_documents_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_ingest_documents_title ON app_public.ingest_documents USING gin (title public.gin_trgm_ops);


--
-- Name: idx_trgm_ingest_items_external_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_ingest_items_external_id ON app_public.ingest_items USING gin (external_id public.gin_trgm_ops);


--
-- Name: idx_trgm_movie_genres_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_movie_genres_title ON app_public.movie_genres USING gin (title public.gin_trgm_ops);


--
-- Name: idx_trgm_movies_casts_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_movies_casts_name ON app_public.movies_casts USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_movies_original_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_movies_original_title ON app_public.movies USING gin (original_title public.gin_trgm_ops);


--
-- Name: idx_trgm_movies_production_countries_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_movies_production_countries_name ON app_public.movies_production_countries USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_movies_tags_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_movies_tags_name ON app_public.movies_tags USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_movies_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_movies_title ON app_public.movies USING gin (title public.gin_trgm_ops);


--
-- Name: idx_trgm_seasons_casts_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_seasons_casts_name ON app_public.seasons_casts USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_seasons_production_countries_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_seasons_production_countries_name ON app_public.seasons_production_countries USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_seasons_tags_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_seasons_tags_name ON app_public.seasons_tags USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_tvshow_genres_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_tvshow_genres_title ON app_public.tvshow_genres USING gin (title public.gin_trgm_ops);


--
-- Name: idx_trgm_tvshows_casts_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_tvshows_casts_name ON app_public.tvshows_casts USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_tvshows_original_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_tvshows_original_title ON app_public.tvshows USING gin (original_title public.gin_trgm_ops);


--
-- Name: idx_trgm_tvshows_production_countries_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_tvshows_production_countries_name ON app_public.tvshows_production_countries USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_tvshows_tags_name; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_tvshows_tags_name ON app_public.tvshows_tags USING gin (name public.gin_trgm_ops);


--
-- Name: idx_trgm_tvshows_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_trgm_tvshows_title ON app_public.tvshows USING gin (title public.gin_trgm_ops);


--
-- Name: idx_tvshow_genres_created_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshow_genres_created_date_asc_with_id ON app_public.tvshow_genres USING btree (created_date, id);


--
-- Name: idx_tvshow_genres_created_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshow_genres_created_date_desc_with_id ON app_public.tvshow_genres USING btree (created_date DESC, id);


--
-- Name: idx_tvshow_genres_title; Type: INDEX; Schema: app_public; Owner: -
--

CREATE UNIQUE INDEX idx_tvshow_genres_title ON app_public.tvshow_genres USING btree (title);


--
-- Name: idx_tvshow_genres_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshow_genres_title_asc_with_id ON app_public.tvshow_genres USING btree (title, id);


--
-- Name: idx_tvshow_genres_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshow_genres_title_desc_with_id ON app_public.tvshow_genres USING btree (title DESC, id);


--
-- Name: idx_tvshow_genres_updated_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshow_genres_updated_date_asc_with_id ON app_public.tvshow_genres USING btree (updated_date, id);


--
-- Name: idx_tvshow_genres_updated_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshow_genres_updated_date_desc_with_id ON app_public.tvshow_genres USING btree (updated_date DESC, id);


--
-- Name: idx_tvshows_casts_tvshow_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_casts_tvshow_id ON app_public.tvshows_casts USING btree (tvshow_id);


--
-- Name: idx_tvshows_created_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_created_date_asc_with_id ON app_public.tvshows USING btree (created_date, id);


--
-- Name: idx_tvshows_created_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_created_date_desc_with_id ON app_public.tvshows USING btree (created_date DESC, id);


--
-- Name: idx_tvshows_external_id_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_external_id_asc_with_id ON app_public.tvshows USING btree (external_id, id);


--
-- Name: idx_tvshows_external_id_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_external_id_desc_with_id ON app_public.tvshows USING btree (external_id DESC, id);


--
-- Name: idx_tvshows_images_tvshow_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_images_tvshow_id ON app_public.tvshows_images USING btree (tvshow_id);


--
-- Name: idx_tvshows_licenses_countries_code; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_licenses_countries_code ON app_public.tvshows_licenses_countries USING btree (code);


--
-- Name: idx_tvshows_licenses_countries_tvshows_license_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_licenses_countries_tvshows_license_id ON app_public.tvshows_licenses_countries USING btree (tvshows_license_id);


--
-- Name: idx_tvshows_licenses_license_end_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_licenses_license_end_asc_with_id ON app_public.tvshows_licenses USING btree (license_end, id);


--
-- Name: idx_tvshows_licenses_license_end_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_licenses_license_end_desc_with_id ON app_public.tvshows_licenses USING btree (license_end DESC, id);


--
-- Name: idx_tvshows_licenses_license_start_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_licenses_license_start_asc_with_id ON app_public.tvshows_licenses USING btree (license_start, id);


--
-- Name: idx_tvshows_licenses_license_start_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_licenses_license_start_desc_with_id ON app_public.tvshows_licenses USING btree (license_start DESC, id);


--
-- Name: idx_tvshows_licenses_tvshow_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_licenses_tvshow_id ON app_public.tvshows_licenses USING btree (tvshow_id);


--
-- Name: idx_tvshows_original_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_original_title_asc_with_id ON app_public.tvshows USING btree (original_title, id);


--
-- Name: idx_tvshows_original_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_original_title_desc_with_id ON app_public.tvshows USING btree (original_title DESC, id);


--
-- Name: idx_tvshows_production_countries_tvshow_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_production_countries_tvshow_id ON app_public.tvshows_production_countries USING btree (tvshow_id);


--
-- Name: idx_tvshows_publish_status; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_publish_status ON app_public.tvshows USING btree (publish_status);


--
-- Name: idx_tvshows_released_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_released_asc_with_id ON app_public.tvshows USING btree (released, id);


--
-- Name: idx_tvshows_released_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_released_desc_with_id ON app_public.tvshows USING btree (released DESC, id);


--
-- Name: idx_tvshows_tags_tvshow_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_tags_tvshow_id ON app_public.tvshows_tags USING btree (tvshow_id);


--
-- Name: idx_tvshows_title_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_title_asc_with_id ON app_public.tvshows USING btree (title, id);


--
-- Name: idx_tvshows_title_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_title_desc_with_id ON app_public.tvshows USING btree (title DESC, id);


--
-- Name: idx_tvshows_trailers_tvshow_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_trailers_tvshow_id ON app_public.tvshows_trailers USING btree (tvshow_id);


--
-- Name: idx_tvshows_tvshow_genres_tvshow_genres_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_tvshow_genres_tvshow_genres_id ON app_public.tvshows_tvshow_genres USING btree (tvshow_genres_id);


--
-- Name: idx_tvshows_tvshow_genres_tvshow_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_tvshow_genres_tvshow_id ON app_public.tvshows_tvshow_genres USING btree (tvshow_id);


--
-- Name: idx_tvshows_updated_date_asc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_updated_date_asc_with_id ON app_public.tvshows USING btree (updated_date, id);


--
-- Name: idx_tvshows_updated_date_desc_with_id; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX idx_tvshows_updated_date_desc_with_id ON app_public.tvshows USING btree (updated_date DESC, id);


--
-- Name: collections _100_check_active_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_check_active_snapshots BEFORE DELETE ON app_public.collections FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg_collections__check_active_snapshots();


--
-- Name: episodes _100_check_active_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_check_active_snapshots BEFORE DELETE ON app_public.episodes FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg_episodes__check_active_snapshots();


--
-- Name: movies _100_check_active_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_check_active_snapshots BEFORE DELETE ON app_public.movies FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg_movies__check_active_snapshots();


--
-- Name: seasons _100_check_active_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_check_active_snapshots BEFORE DELETE ON app_public.seasons FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg_seasons__check_active_snapshots();


--
-- Name: snapshots _100_check_active_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_check_active_snapshots BEFORE DELETE ON app_public.snapshots FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg_snapshots__check_active_state();


--
-- Name: tvshows _100_check_active_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_check_active_snapshots BEFORE DELETE ON app_public.tvshows FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg_tvshows__check_active_snapshots();


--
-- Name: collections _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.collections FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: episodes _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.episodes FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: episodes_licenses _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.episodes_licenses FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: ingest_documents _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.ingest_documents FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: ingest_item_steps _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.ingest_item_steps FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: ingest_items _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.ingest_items FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: movie_genres _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.movie_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: movies _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.movies FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: movies_licenses _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.movies_licenses FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: seasons _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.seasons FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: seasons_licenses _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.seasons_licenses FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: snapshots _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.snapshots FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: tvshow_genres _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: tvshows _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.tvshows FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: tvshows_licenses _100_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_public.tvshows_licenses FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE PROCEDURE ax_utils.tg__timestamps();


--
-- Name: collection_relations _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.collection_relations FOR EACH ROW EXECUTE PROCEDURE app_public.tg_collection_relations__collections_ts_propagation();


--
-- Name: collections_images _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.collections_images FOR EACH ROW EXECUTE PROCEDURE app_public.tg_collections_images__collections_ts_propagation();


--
-- Name: collections_tags _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.collections_tags FOR EACH ROW EXECUTE PROCEDURE app_public.tg_collections_tags__collections_ts_propagation();


--
-- Name: episodes_casts _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.episodes_casts FOR EACH ROW EXECUTE PROCEDURE app_public.tg_episodes_casts__episodes_ts_propagation();


--
-- Name: episodes_images _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.episodes_images FOR EACH ROW EXECUTE PROCEDURE app_public.tg_episodes_images__episodes_ts_propagation();


--
-- Name: episodes_licenses _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.episodes_licenses FOR EACH ROW EXECUTE PROCEDURE app_public.tg_episodes_licenses__episodes_ts_propagation();


--
-- Name: episodes_licenses_countries _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.episodes_licenses_countries FOR EACH ROW EXECUTE PROCEDURE app_public.tg_episodes_licenses_countries__episodes_licenses_ts_propagtn();


--
-- Name: episodes_production_countries _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.episodes_production_countries FOR EACH ROW EXECUTE PROCEDURE app_public.tg_episodes_production_countries__episodes_ts_propagation();


--
-- Name: episodes_tags _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.episodes_tags FOR EACH ROW EXECUTE PROCEDURE app_public.tg_episodes_tags__episodes_ts_propagation();


--
-- Name: episodes_trailers _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.episodes_trailers FOR EACH ROW EXECUTE PROCEDURE app_public.tg_episodes_trailers__episodes_ts_propagation();


--
-- Name: episodes_tvshow_genres _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.episodes_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE app_public.tg_episodes_tvshow_genres__episodes_ts_propagation();


--
-- Name: movies_casts _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.movies_casts FOR EACH ROW EXECUTE PROCEDURE app_public.tg_movies_casts__movies_ts_propagation();


--
-- Name: movies_images _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.movies_images FOR EACH ROW EXECUTE PROCEDURE app_public.tg_movies_images__movies_ts_propagation();


--
-- Name: movies_licenses _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.movies_licenses FOR EACH ROW EXECUTE PROCEDURE app_public.tg_movies_licenses__movies_ts_propagation();


--
-- Name: movies_licenses_countries _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.movies_licenses_countries FOR EACH ROW EXECUTE PROCEDURE app_public.tg_movies_licenses_countries__movies_licenses_ts_propagation();


--
-- Name: movies_movie_genres _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.movies_movie_genres FOR EACH ROW EXECUTE PROCEDURE app_public.tg_movies_movie_genres__movies_ts_propagation();


--
-- Name: movies_production_countries _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.movies_production_countries FOR EACH ROW EXECUTE PROCEDURE app_public.tg_movies_production_countries__movies_ts_propagation();


--
-- Name: movies_tags _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.movies_tags FOR EACH ROW EXECUTE PROCEDURE app_public.tg_movies_tags__movies_ts_propagation();


--
-- Name: movies_trailers _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.movies_trailers FOR EACH ROW EXECUTE PROCEDURE app_public.tg_movies_trailers__movies_ts_propagation();


--
-- Name: seasons_casts _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.seasons_casts FOR EACH ROW EXECUTE PROCEDURE app_public.tg_seasons_casts__seasons_ts_propagation();


--
-- Name: seasons_images _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.seasons_images FOR EACH ROW EXECUTE PROCEDURE app_public.tg_seasons_images__seasons_ts_propagation();


--
-- Name: seasons_licenses _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.seasons_licenses FOR EACH ROW EXECUTE PROCEDURE app_public.tg_seasons_licenses__seasons_ts_propagation();


--
-- Name: seasons_licenses_countries _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.seasons_licenses_countries FOR EACH ROW EXECUTE PROCEDURE app_public.tg_seasons_licenses_countries__seasons_licenses_ts_propagation();


--
-- Name: seasons_production_countries _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.seasons_production_countries FOR EACH ROW EXECUTE PROCEDURE app_public.tg_seasons_production_countries__seasons_ts_propagation();


--
-- Name: seasons_tags _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.seasons_tags FOR EACH ROW EXECUTE PROCEDURE app_public.tg_seasons_tags__seasons_ts_propagation();


--
-- Name: seasons_trailers _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.seasons_trailers FOR EACH ROW EXECUTE PROCEDURE app_public.tg_seasons_trailers__seasons_ts_propagation();


--
-- Name: seasons_tvshow_genres _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.seasons_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE app_public.tg_seasons_tvshow_genres__seasons_ts_propagation();


--
-- Name: tvshows_casts _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.tvshows_casts FOR EACH ROW EXECUTE PROCEDURE app_public.tg_tvshows_casts__tvshows_ts_propagation();


--
-- Name: tvshows_images _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.tvshows_images FOR EACH ROW EXECUTE PROCEDURE app_public.tg_tvshows_images__tvshows_ts_propagation();


--
-- Name: tvshows_licenses _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.tvshows_licenses FOR EACH ROW EXECUTE PROCEDURE app_public.tg_tvshows_licenses__tvshows_ts_propagation();


--
-- Name: tvshows_licenses_countries _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.tvshows_licenses_countries FOR EACH ROW EXECUTE PROCEDURE app_public.tg_tvshows_licenses_countries__tvshows_licenses_ts_propagation();


--
-- Name: tvshows_production_countries _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.tvshows_production_countries FOR EACH ROW EXECUTE PROCEDURE app_public.tg_tvshows_production_countries__tvshows_ts_propagation();


--
-- Name: tvshows_tags _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.tvshows_tags FOR EACH ROW EXECUTE PROCEDURE app_public.tg_tvshows_tags__tvshows_ts_propagation();


--
-- Name: tvshows_trailers _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.tvshows_trailers FOR EACH ROW EXECUTE PROCEDURE app_public.tg_tvshows_trailers__tvshows_ts_propagation();


--
-- Name: tvshows_tvshow_genres _200_propogate_timestamps; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_propogate_timestamps AFTER INSERT OR DELETE OR UPDATE ON app_public.tvshows_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE app_public.tg_tvshows_tvshow_genres__tvshows_ts_propagation();


--
-- Name: collections _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.collections FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: episodes _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.episodes FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: ingest_documents _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.ingest_documents FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: ingest_item_steps _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.ingest_item_steps FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: ingest_items _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.ingest_items FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: movie_genres _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.movie_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: movies _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.movies FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: seasons _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.seasons FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: snapshots _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.snapshots FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: tvshow_genres _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: tvshows _200_username; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_public.tvshows FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__username();


--
-- Name: snapshots _300_propagate_publish_state_to_collections; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _300_propagate_publish_state_to_collections BEFORE UPDATE ON app_public.snapshots FOR EACH ROW WHEN (((new.entity_type)::text = 'COLLECTION'::text)) EXECUTE PROCEDURE app_hidden.tg_snapshots__propagate_publish_state_to_collections();


--
-- Name: snapshots _300_propagate_publish_state_to_episodes; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _300_propagate_publish_state_to_episodes BEFORE UPDATE ON app_public.snapshots FOR EACH ROW WHEN (((new.entity_type)::text = 'EPISODE'::text)) EXECUTE PROCEDURE app_hidden.tg_snapshots__propagate_publish_state_to_episodes();


--
-- Name: snapshots _300_propagate_publish_state_to_movies; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _300_propagate_publish_state_to_movies BEFORE UPDATE ON app_public.snapshots FOR EACH ROW WHEN (((new.entity_type)::text = 'MOVIE'::text)) EXECUTE PROCEDURE app_hidden.tg_snapshots__propagate_publish_state_to_movies();


--
-- Name: snapshots _300_propagate_publish_state_to_seasons; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _300_propagate_publish_state_to_seasons BEFORE UPDATE ON app_public.snapshots FOR EACH ROW WHEN (((new.entity_type)::text = 'SEASON'::text)) EXECUTE PROCEDURE app_hidden.tg_snapshots__propagate_publish_state_to_seasons();


--
-- Name: snapshots _300_propagate_publish_state_to_tvshows; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _300_propagate_publish_state_to_tvshows BEFORE UPDATE ON app_public.snapshots FOR EACH ROW WHEN (((new.entity_type)::text = 'TVSHOW'::text)) EXECUTE PROCEDURE app_hidden.tg_snapshots__propagate_publish_state_to_tvshows();


--
-- Name: collections _300_publish_state_changed; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _300_publish_state_changed BEFORE UPDATE ON app_public.collections FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg__update_publish_state();


--
-- Name: episodes _300_publish_state_changed; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _300_publish_state_changed BEFORE UPDATE ON app_public.episodes FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg__update_publish_state();


--
-- Name: movies _300_publish_state_changed; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _300_publish_state_changed BEFORE UPDATE ON app_public.movies FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg__update_publish_state();


--
-- Name: seasons _300_publish_state_changed; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _300_publish_state_changed BEFORE UPDATE ON app_public.seasons FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg__update_publish_state();


--
-- Name: tvshows _300_publish_state_changed; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _300_publish_state_changed BEFORE UPDATE ON app_public.tvshows FOR EACH ROW EXECUTE PROCEDURE app_hidden.tg__update_publish_state();


--
-- Name: collection_relations _500_gql_collection_relations_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collection_relations_deleted BEFORE DELETE ON app_public.collection_relations FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_RELATION_DELETED', 'graphql:collections', 'collection_id');


--
-- Name: collection_relations _500_gql_collection_relations_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collection_relations_inserted AFTER INSERT ON app_public.collection_relations FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_RELATION_CREATED', 'graphql:collections', 'collection_id');


--
-- Name: collection_relations _500_gql_collection_relations_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collection_relations_updated AFTER UPDATE ON app_public.collection_relations FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_RELATION_CHANGED', 'graphql:collections', 'collection_id');


--
-- Name: collections _500_gql_collections_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collections_deleted BEFORE DELETE ON app_public.collections FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_DELETED', 'graphql:collections', 'id');


--
-- Name: collections_images _500_gql_collections_images_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collections_images_deleted BEFORE DELETE ON app_public.collections_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_IMAGE_DELETED', 'graphql:collections', 'collection_id');


--
-- Name: collections_images _500_gql_collections_images_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collections_images_inserted AFTER INSERT ON app_public.collections_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_IMAGE_CREATED', 'graphql:collections', 'collection_id');


--
-- Name: collections_images _500_gql_collections_images_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collections_images_updated AFTER UPDATE ON app_public.collections_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_IMAGE_CHANGED', 'graphql:collections', 'collection_id');


--
-- Name: collections _500_gql_collections_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collections_inserted AFTER INSERT ON app_public.collections FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_CREATED', 'graphql:collections', 'id');


--
-- Name: collections_tags _500_gql_collections_tags_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collections_tags_deleted BEFORE DELETE ON app_public.collections_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_TAG_DELETED', 'graphql:collections', 'collection_id');


--
-- Name: collections_tags _500_gql_collections_tags_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collections_tags_inserted AFTER INSERT ON app_public.collections_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_TAG_CREATED', 'graphql:collections', 'collection_id');


--
-- Name: collections_tags _500_gql_collections_tags_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collections_tags_updated AFTER UPDATE ON app_public.collections_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_TAG_CHANGED', 'graphql:collections', 'collection_id');


--
-- Name: collections _500_gql_collections_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_collections_updated AFTER UPDATE ON app_public.collections FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('COLLECTION_CHANGED', 'graphql:collections', 'id');


--
-- Name: episodes_casts _500_gql_episodes_casts_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_casts_deleted BEFORE DELETE ON app_public.episodes_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_CAST_DELETED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_casts _500_gql_episodes_casts_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_casts_inserted AFTER INSERT ON app_public.episodes_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_CAST_CREATED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_casts _500_gql_episodes_casts_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_casts_updated AFTER UPDATE ON app_public.episodes_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_CAST_CHANGED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes _500_gql_episodes_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_deleted BEFORE DELETE ON app_public.episodes FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_DELETED', 'graphql:episodes', 'id');


--
-- Name: episodes_images _500_gql_episodes_images_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_images_deleted BEFORE DELETE ON app_public.episodes_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_IMAGE_DELETED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_images _500_gql_episodes_images_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_images_inserted AFTER INSERT ON app_public.episodes_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_IMAGE_CREATED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_images _500_gql_episodes_images_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_images_updated AFTER UPDATE ON app_public.episodes_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_IMAGE_CHANGED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes _500_gql_episodes_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_inserted AFTER INSERT ON app_public.episodes FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_CREATED', 'graphql:episodes', 'id');


--
-- Name: episodes_licenses_countries _500_gql_episodes_licenses_countries_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_licenses_countries_deleted BEFORE DELETE ON app_public.episodes_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_LICENSE_COUNTRY_DELETED', 'graphql:episodes_licenses', 'episodes_license_id');


--
-- Name: episodes_licenses_countries _500_gql_episodes_licenses_countries_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_licenses_countries_inserted AFTER INSERT ON app_public.episodes_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_LICENSE_COUNTRY_CREATED', 'graphql:episodes_licenses', 'episodes_license_id');


--
-- Name: episodes_licenses_countries _500_gql_episodes_licenses_countries_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_licenses_countries_updated AFTER UPDATE ON app_public.episodes_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_LICENSE_COUNTRY_CHANGED', 'graphql:episodes_licenses', 'episodes_license_id');


--
-- Name: episodes_licenses _500_gql_episodes_licenses_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_licenses_deleted BEFORE DELETE ON app_public.episodes_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_LICENSE_DELETED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_licenses _500_gql_episodes_licenses_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_licenses_inserted AFTER INSERT ON app_public.episodes_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_LICENSE_CREATED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_licenses _500_gql_episodes_licenses_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_licenses_updated AFTER UPDATE ON app_public.episodes_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_LICENSE_CHANGED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_production_countries _500_gql_episodes_production_countries_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_production_countries_deleted BEFORE DELETE ON app_public.episodes_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_PRODUCTION_COUNTRY_DELETED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_production_countries _500_gql_episodes_production_countries_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_production_countries_inserted AFTER INSERT ON app_public.episodes_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_PRODUCTION_COUNTRY_CREATED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_production_countries _500_gql_episodes_production_countries_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_production_countries_updated AFTER UPDATE ON app_public.episodes_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_PRODUCTION_COUNTRY_CHANGED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_tags _500_gql_episodes_tags_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_tags_deleted BEFORE DELETE ON app_public.episodes_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_TAG_DELETED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_tags _500_gql_episodes_tags_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_tags_inserted AFTER INSERT ON app_public.episodes_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_TAG_CREATED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_tags _500_gql_episodes_tags_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_tags_updated AFTER UPDATE ON app_public.episodes_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_TAG_CHANGED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_trailers _500_gql_episodes_trailers_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_trailers_deleted BEFORE DELETE ON app_public.episodes_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_TRAILER_DELETED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_trailers _500_gql_episodes_trailers_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_trailers_inserted AFTER INSERT ON app_public.episodes_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_TRAILER_CREATED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_trailers _500_gql_episodes_trailers_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_trailers_updated AFTER UPDATE ON app_public.episodes_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_TRAILER_CHANGED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_tvshow_genres _500_gql_episodes_tvshow_genres_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_tvshow_genres_deleted BEFORE DELETE ON app_public.episodes_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_TVSHOW_GENRE_DELETED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_tvshow_genres _500_gql_episodes_tvshow_genres_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_tvshow_genres_inserted AFTER INSERT ON app_public.episodes_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_TVSHOW_GENRE_CREATED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes_tvshow_genres _500_gql_episodes_tvshow_genres_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_tvshow_genres_updated AFTER UPDATE ON app_public.episodes_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_TVSHOW_GENRE_CHANGED', 'graphql:episodes', 'episode_id');


--
-- Name: episodes _500_gql_episodes_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_episodes_updated AFTER UPDATE ON app_public.episodes FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('EPISODE_CHANGED', 'graphql:episodes', 'id');


--
-- Name: ingest_documents _500_gql_ingest_documents_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_ingest_documents_deleted BEFORE DELETE ON app_public.ingest_documents FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('INGEST_DOCUMENT_DELETED', 'graphql:ingest_documents', 'id');


--
-- Name: ingest_documents _500_gql_ingest_documents_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_ingest_documents_inserted AFTER INSERT ON app_public.ingest_documents FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('INGEST_DOCUMENT_CREATED', 'graphql:ingest_documents', 'id');


--
-- Name: ingest_documents _500_gql_ingest_documents_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_ingest_documents_updated AFTER UPDATE ON app_public.ingest_documents FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('INGEST_DOCUMENT_CHANGED', 'graphql:ingest_documents', 'id');


--
-- Name: ingest_items _500_gql_ingest_items_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_ingest_items_deleted BEFORE DELETE ON app_public.ingest_items FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('INGEST_ITEM_DELETED', 'graphql:ingest_documents', 'ingest_document_id');


--
-- Name: ingest_items _500_gql_ingest_items_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_ingest_items_inserted AFTER INSERT ON app_public.ingest_items FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('INGEST_ITEM_CREATED', 'graphql:ingest_documents', 'ingest_document_id');


--
-- Name: ingest_items _500_gql_ingest_items_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_ingest_items_updated AFTER UPDATE ON app_public.ingest_items FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('INGEST_ITEM_CHANGED', 'graphql:ingest_documents', 'ingest_document_id');


--
-- Name: movie_genres _500_gql_movie_genres_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movie_genres_deleted BEFORE DELETE ON app_public.movie_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_GENRE_DELETED', 'graphql:movie_genres', 'id');


--
-- Name: movie_genres _500_gql_movie_genres_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movie_genres_inserted AFTER INSERT ON app_public.movie_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_GENRE_CREATED', 'graphql:movie_genres', 'id');


--
-- Name: movie_genres _500_gql_movie_genres_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movie_genres_updated AFTER UPDATE ON app_public.movie_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_GENRE_CHANGED', 'graphql:movie_genres', 'id');


--
-- Name: movies_casts _500_gql_movies_casts_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_casts_deleted BEFORE DELETE ON app_public.movies_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_CAST_DELETED', 'graphql:movies', 'movie_id');


--
-- Name: movies_casts _500_gql_movies_casts_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_casts_inserted AFTER INSERT ON app_public.movies_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_CAST_CREATED', 'graphql:movies', 'movie_id');


--
-- Name: movies_casts _500_gql_movies_casts_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_casts_updated AFTER UPDATE ON app_public.movies_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_CAST_CHANGED', 'graphql:movies', 'movie_id');


--
-- Name: movies _500_gql_movies_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_deleted BEFORE DELETE ON app_public.movies FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_DELETED', 'graphql:movies', 'id');


--
-- Name: movies_images _500_gql_movies_images_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_images_deleted BEFORE DELETE ON app_public.movies_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_IMAGE_DELETED', 'graphql:movies', 'movie_id');


--
-- Name: movies_images _500_gql_movies_images_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_images_inserted AFTER INSERT ON app_public.movies_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_IMAGE_CREATED', 'graphql:movies', 'movie_id');


--
-- Name: movies_images _500_gql_movies_images_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_images_updated AFTER UPDATE ON app_public.movies_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_IMAGE_CHANGED', 'graphql:movies', 'movie_id');


--
-- Name: movies _500_gql_movies_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_inserted AFTER INSERT ON app_public.movies FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_CREATED', 'graphql:movies', 'id');


--
-- Name: movies_licenses_countries _500_gql_movies_licenses_countries_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_licenses_countries_deleted BEFORE DELETE ON app_public.movies_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_LICENSE_COUNTRY_DELETED', 'graphql:movies_licenses', 'movies_license_id');


--
-- Name: movies_licenses_countries _500_gql_movies_licenses_countries_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_licenses_countries_inserted AFTER INSERT ON app_public.movies_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_LICENSE_COUNTRY_CREATED', 'graphql:movies_licenses', 'movies_license_id');


--
-- Name: movies_licenses_countries _500_gql_movies_licenses_countries_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_licenses_countries_updated AFTER UPDATE ON app_public.movies_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_LICENSE_COUNTRY_CHANGED', 'graphql:movies_licenses', 'movies_license_id');


--
-- Name: movies_licenses _500_gql_movies_licenses_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_licenses_deleted BEFORE DELETE ON app_public.movies_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_LICENSE_DELETED', 'graphql:movies', 'movie_id');


--
-- Name: movies_licenses _500_gql_movies_licenses_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_licenses_inserted AFTER INSERT ON app_public.movies_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_LICENSE_CREATED', 'graphql:movies', 'movie_id');


--
-- Name: movies_licenses _500_gql_movies_licenses_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_licenses_updated AFTER UPDATE ON app_public.movies_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_LICENSE_CHANGED', 'graphql:movies', 'movie_id');


--
-- Name: movies_movie_genres _500_gql_movies_movie_genres_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_movie_genres_deleted BEFORE DELETE ON app_public.movies_movie_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_MOVIE_GENRE_DELETED', 'graphql:movies', 'movie_id');


--
-- Name: movies_movie_genres _500_gql_movies_movie_genres_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_movie_genres_inserted AFTER INSERT ON app_public.movies_movie_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_MOVIE_GENRE_CREATED', 'graphql:movies', 'movie_id');


--
-- Name: movies_movie_genres _500_gql_movies_movie_genres_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_movie_genres_updated AFTER UPDATE ON app_public.movies_movie_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_MOVIE_GENRE_CHANGED', 'graphql:movies', 'movie_id');


--
-- Name: movies_production_countries _500_gql_movies_production_countries_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_production_countries_deleted BEFORE DELETE ON app_public.movies_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_PRODUCTION_COUNTRY_DELETED', 'graphql:movies', 'movie_id');


--
-- Name: movies_production_countries _500_gql_movies_production_countries_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_production_countries_inserted AFTER INSERT ON app_public.movies_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_PRODUCTION_COUNTRY_CREATED', 'graphql:movies', 'movie_id');


--
-- Name: movies_production_countries _500_gql_movies_production_countries_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_production_countries_updated AFTER UPDATE ON app_public.movies_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_PRODUCTION_COUNTRY_CHANGED', 'graphql:movies', 'movie_id');


--
-- Name: movies_tags _500_gql_movies_tags_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_tags_deleted BEFORE DELETE ON app_public.movies_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_TAG_DELETED', 'graphql:movies', 'movie_id');


--
-- Name: movies_tags _500_gql_movies_tags_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_tags_inserted AFTER INSERT ON app_public.movies_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_TAG_CREATED', 'graphql:movies', 'movie_id');


--
-- Name: movies_tags _500_gql_movies_tags_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_tags_updated AFTER UPDATE ON app_public.movies_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_TAG_CHANGED', 'graphql:movies', 'movie_id');


--
-- Name: movies_trailers _500_gql_movies_trailers_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_trailers_deleted BEFORE DELETE ON app_public.movies_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_TRAILER_DELETED', 'graphql:movies', 'movie_id');


--
-- Name: movies_trailers _500_gql_movies_trailers_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_trailers_inserted AFTER INSERT ON app_public.movies_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_TRAILER_CREATED', 'graphql:movies', 'movie_id');


--
-- Name: movies_trailers _500_gql_movies_trailers_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_trailers_updated AFTER UPDATE ON app_public.movies_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_TRAILER_CHANGED', 'graphql:movies', 'movie_id');


--
-- Name: movies _500_gql_movies_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_movies_updated AFTER UPDATE ON app_public.movies FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('MOVIE_CHANGED', 'graphql:movies', 'id');


--
-- Name: seasons_casts _500_gql_seasons_casts_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_casts_deleted BEFORE DELETE ON app_public.seasons_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_CAST_DELETED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_casts _500_gql_seasons_casts_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_casts_inserted AFTER INSERT ON app_public.seasons_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_CAST_CREATED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_casts _500_gql_seasons_casts_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_casts_updated AFTER UPDATE ON app_public.seasons_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_CAST_CHANGED', 'graphql:seasons', 'season_id');


--
-- Name: seasons _500_gql_seasons_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_deleted BEFORE DELETE ON app_public.seasons FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_DELETED', 'graphql:seasons', 'id');


--
-- Name: seasons_images _500_gql_seasons_images_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_images_deleted BEFORE DELETE ON app_public.seasons_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_IMAGE_DELETED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_images _500_gql_seasons_images_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_images_inserted AFTER INSERT ON app_public.seasons_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_IMAGE_CREATED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_images _500_gql_seasons_images_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_images_updated AFTER UPDATE ON app_public.seasons_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_IMAGE_CHANGED', 'graphql:seasons', 'season_id');


--
-- Name: seasons _500_gql_seasons_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_inserted AFTER INSERT ON app_public.seasons FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_CREATED', 'graphql:seasons', 'id');


--
-- Name: seasons_licenses_countries _500_gql_seasons_licenses_countries_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_licenses_countries_deleted BEFORE DELETE ON app_public.seasons_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_LICENSE_COUNTRY_DELETED', 'graphql:seasons_licenses', 'seasons_license_id');


--
-- Name: seasons_licenses_countries _500_gql_seasons_licenses_countries_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_licenses_countries_inserted AFTER INSERT ON app_public.seasons_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_LICENSE_COUNTRY_CREATED', 'graphql:seasons_licenses', 'seasons_license_id');


--
-- Name: seasons_licenses_countries _500_gql_seasons_licenses_countries_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_licenses_countries_updated AFTER UPDATE ON app_public.seasons_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_LICENSE_COUNTRY_CHANGED', 'graphql:seasons_licenses', 'seasons_license_id');


--
-- Name: seasons_licenses _500_gql_seasons_licenses_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_licenses_deleted BEFORE DELETE ON app_public.seasons_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_LICENSE_DELETED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_licenses _500_gql_seasons_licenses_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_licenses_inserted AFTER INSERT ON app_public.seasons_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_LICENSE_CREATED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_licenses _500_gql_seasons_licenses_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_licenses_updated AFTER UPDATE ON app_public.seasons_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_LICENSE_CHANGED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_production_countries _500_gql_seasons_production_countries_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_production_countries_deleted BEFORE DELETE ON app_public.seasons_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_PRODUCTION_COUNTRY_DELETED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_production_countries _500_gql_seasons_production_countries_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_production_countries_inserted AFTER INSERT ON app_public.seasons_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_PRODUCTION_COUNTRY_CREATED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_production_countries _500_gql_seasons_production_countries_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_production_countries_updated AFTER UPDATE ON app_public.seasons_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_PRODUCTION_COUNTRY_CHANGED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_tags _500_gql_seasons_tags_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_tags_deleted BEFORE DELETE ON app_public.seasons_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_TAG_DELETED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_tags _500_gql_seasons_tags_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_tags_inserted AFTER INSERT ON app_public.seasons_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_TAG_CREATED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_tags _500_gql_seasons_tags_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_tags_updated AFTER UPDATE ON app_public.seasons_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_TAG_CHANGED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_trailers _500_gql_seasons_trailers_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_trailers_deleted BEFORE DELETE ON app_public.seasons_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_TRAILER_DELETED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_trailers _500_gql_seasons_trailers_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_trailers_inserted AFTER INSERT ON app_public.seasons_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_TRAILER_CREATED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_trailers _500_gql_seasons_trailers_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_trailers_updated AFTER UPDATE ON app_public.seasons_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_TRAILER_CHANGED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_tvshow_genres _500_gql_seasons_tvshow_genres_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_tvshow_genres_deleted BEFORE DELETE ON app_public.seasons_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_TVSHOW_GENRE_DELETED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_tvshow_genres _500_gql_seasons_tvshow_genres_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_tvshow_genres_inserted AFTER INSERT ON app_public.seasons_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_TVSHOW_GENRE_CREATED', 'graphql:seasons', 'season_id');


--
-- Name: seasons_tvshow_genres _500_gql_seasons_tvshow_genres_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_tvshow_genres_updated AFTER UPDATE ON app_public.seasons_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_TVSHOW_GENRE_CHANGED', 'graphql:seasons', 'season_id');


--
-- Name: seasons _500_gql_seasons_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_seasons_updated AFTER UPDATE ON app_public.seasons FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SEASON_CHANGED', 'graphql:seasons', 'id');


--
-- Name: snapshot_validation_results _500_gql_snapshot_validation_results_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_snapshot_validation_results_deleted BEFORE DELETE ON app_public.snapshot_validation_results FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SNAPSHOT_VALIDATION_RESULT_DELETED', 'graphql:snapshots', 'snapshot_id');


--
-- Name: snapshot_validation_results _500_gql_snapshot_validation_results_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_snapshot_validation_results_inserted AFTER INSERT ON app_public.snapshot_validation_results FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SNAPSHOT_VALIDATION_RESULT_CREATED', 'graphql:snapshots', 'snapshot_id');


--
-- Name: snapshot_validation_results _500_gql_snapshot_validation_results_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_snapshot_validation_results_updated AFTER UPDATE ON app_public.snapshot_validation_results FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SNAPSHOT_VALIDATION_RESULT_CHANGED', 'graphql:snapshots', 'snapshot_id');


--
-- Name: snapshots _500_gql_snapshots_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_snapshots_deleted BEFORE DELETE ON app_public.snapshots FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SNAPSHOT_DELETED', 'graphql:snapshots', 'id');


--
-- Name: snapshots _500_gql_snapshots_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_snapshots_inserted AFTER INSERT ON app_public.snapshots FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SNAPSHOT_CREATED', 'graphql:snapshots', 'id');


--
-- Name: snapshots _500_gql_snapshots_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_snapshots_updated AFTER UPDATE ON app_public.snapshots FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('SNAPSHOT_CHANGED', 'graphql:snapshots', 'id');


--
-- Name: tvshow_genres _500_gql_tvshow_genres_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshow_genres_deleted BEFORE DELETE ON app_public.tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_GENRE_DELETED', 'graphql:tvshow_genres', 'id');


--
-- Name: tvshow_genres _500_gql_tvshow_genres_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshow_genres_inserted AFTER INSERT ON app_public.tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_GENRE_CREATED', 'graphql:tvshow_genres', 'id');


--
-- Name: tvshow_genres _500_gql_tvshow_genres_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshow_genres_updated AFTER UPDATE ON app_public.tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_GENRE_CHANGED', 'graphql:tvshow_genres', 'id');


--
-- Name: tvshows_casts _500_gql_tvshows_casts_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_casts_deleted BEFORE DELETE ON app_public.tvshows_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_CAST_DELETED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_casts _500_gql_tvshows_casts_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_casts_inserted AFTER INSERT ON app_public.tvshows_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_CAST_CREATED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_casts _500_gql_tvshows_casts_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_casts_updated AFTER UPDATE ON app_public.tvshows_casts FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_CAST_CHANGED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows _500_gql_tvshows_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_deleted BEFORE DELETE ON app_public.tvshows FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_DELETED', 'graphql:tvshows', 'id');


--
-- Name: tvshows_images _500_gql_tvshows_images_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_images_deleted BEFORE DELETE ON app_public.tvshows_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_IMAGE_DELETED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_images _500_gql_tvshows_images_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_images_inserted AFTER INSERT ON app_public.tvshows_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_IMAGE_CREATED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_images _500_gql_tvshows_images_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_images_updated AFTER UPDATE ON app_public.tvshows_images FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_IMAGE_CHANGED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows _500_gql_tvshows_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_inserted AFTER INSERT ON app_public.tvshows FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_CREATED', 'graphql:tvshows', 'id');


--
-- Name: tvshows_licenses_countries _500_gql_tvshows_licenses_countries_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_licenses_countries_deleted BEFORE DELETE ON app_public.tvshows_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_LICENSE_COUNTRY_DELETED', 'graphql:tvshows_licenses', 'tvshows_license_id');


--
-- Name: tvshows_licenses_countries _500_gql_tvshows_licenses_countries_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_licenses_countries_inserted AFTER INSERT ON app_public.tvshows_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_LICENSE_COUNTRY_CREATED', 'graphql:tvshows_licenses', 'tvshows_license_id');


--
-- Name: tvshows_licenses_countries _500_gql_tvshows_licenses_countries_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_licenses_countries_updated AFTER UPDATE ON app_public.tvshows_licenses_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_LICENSE_COUNTRY_CHANGED', 'graphql:tvshows_licenses', 'tvshows_license_id');


--
-- Name: tvshows_licenses _500_gql_tvshows_licenses_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_licenses_deleted BEFORE DELETE ON app_public.tvshows_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_LICENSE_DELETED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_licenses _500_gql_tvshows_licenses_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_licenses_inserted AFTER INSERT ON app_public.tvshows_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_LICENSE_CREATED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_licenses _500_gql_tvshows_licenses_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_licenses_updated AFTER UPDATE ON app_public.tvshows_licenses FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_LICENSE_CHANGED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_production_countries _500_gql_tvshows_production_countries_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_production_countries_deleted BEFORE DELETE ON app_public.tvshows_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_PRODUCTION_COUNTRY_DELETED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_production_countries _500_gql_tvshows_production_countries_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_production_countries_inserted AFTER INSERT ON app_public.tvshows_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_PRODUCTION_COUNTRY_CREATED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_production_countries _500_gql_tvshows_production_countries_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_production_countries_updated AFTER UPDATE ON app_public.tvshows_production_countries FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_PRODUCTION_COUNTRY_CHANGED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_tags _500_gql_tvshows_tags_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_tags_deleted BEFORE DELETE ON app_public.tvshows_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_TAG_DELETED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_tags _500_gql_tvshows_tags_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_tags_inserted AFTER INSERT ON app_public.tvshows_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_TAG_CREATED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_tags _500_gql_tvshows_tags_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_tags_updated AFTER UPDATE ON app_public.tvshows_tags FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_TAG_CHANGED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_trailers _500_gql_tvshows_trailers_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_trailers_deleted BEFORE DELETE ON app_public.tvshows_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_TRAILER_DELETED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_trailers _500_gql_tvshows_trailers_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_trailers_inserted AFTER INSERT ON app_public.tvshows_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_TRAILER_CREATED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_trailers _500_gql_tvshows_trailers_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_trailers_updated AFTER UPDATE ON app_public.tvshows_trailers FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_TRAILER_CHANGED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_tvshow_genres _500_gql_tvshows_tvshow_genres_deleted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_tvshow_genres_deleted BEFORE DELETE ON app_public.tvshows_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_TVSHOW_GENRE_DELETED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_tvshow_genres _500_gql_tvshows_tvshow_genres_inserted; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_tvshow_genres_inserted AFTER INSERT ON app_public.tvshows_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_TVSHOW_GENRE_CREATED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows_tvshow_genres _500_gql_tvshows_tvshow_genres_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_tvshow_genres_updated AFTER UPDATE ON app_public.tvshows_tvshow_genres FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_TVSHOW_GENRE_CHANGED', 'graphql:tvshows', 'tvshow_id');


--
-- Name: tvshows _500_gql_tvshows_updated; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_gql_tvshows_updated AFTER UPDATE ON app_public.tvshows FOR EACH ROW EXECUTE PROCEDURE ax_utils.tg__graphql_subscription('TVSHOW_CHANGED', 'graphql:tvshows', 'id');


--
-- Name: collections _900_localizable_collection_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_collection_delete AFTER DELETE ON app_public.collections FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_collection_delete();


--
-- Name: collections_images _900_localizable_collection_image_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_collection_image_delete AFTER DELETE ON app_public.collections_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_collection_image_delete();


--
-- Name: collections_images _900_localizable_collection_image_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_collection_image_insert AFTER INSERT ON app_public.collections_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_collection_image_insert();


--
-- Name: collections_images _900_localizable_collection_image_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_collection_image_update AFTER UPDATE ON app_public.collections_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_collection_image_update();


--
-- Name: collections _900_localizable_collection_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_collection_insert AFTER INSERT ON app_public.collections FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_collection_insert();


--
-- Name: collections _900_localizable_collection_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_collection_update AFTER UPDATE ON app_public.collections FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_collection_update();


--
-- Name: episodes _900_localizable_episode_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_episode_delete AFTER DELETE ON app_public.episodes FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_episode_delete();


--
-- Name: episodes_images _900_localizable_episode_image_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_episode_image_delete AFTER DELETE ON app_public.episodes_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_episode_image_delete();


--
-- Name: episodes_images _900_localizable_episode_image_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_episode_image_insert AFTER INSERT ON app_public.episodes_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_episode_image_insert();


--
-- Name: episodes_images _900_localizable_episode_image_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_episode_image_update AFTER UPDATE ON app_public.episodes_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_episode_image_update();


--
-- Name: episodes _900_localizable_episode_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_episode_insert AFTER INSERT ON app_public.episodes FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_episode_insert();


--
-- Name: episodes _900_localizable_episode_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_episode_update AFTER UPDATE ON app_public.episodes FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_episode_update();


--
-- Name: movies _900_localizable_movie_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_movie_delete AFTER DELETE ON app_public.movies FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_movie_delete();


--
-- Name: movie_genres _900_localizable_movie_genre_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_movie_genre_delete AFTER DELETE ON app_public.movie_genres FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_movie_genre_delete();


--
-- Name: movie_genres _900_localizable_movie_genre_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_movie_genre_insert AFTER INSERT ON app_public.movie_genres FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_movie_genre_insert();


--
-- Name: movie_genres _900_localizable_movie_genre_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_movie_genre_update AFTER UPDATE ON app_public.movie_genres FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_movie_genre_update();


--
-- Name: movies_images _900_localizable_movie_image_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_movie_image_delete AFTER DELETE ON app_public.movies_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_movie_image_delete();


--
-- Name: movies_images _900_localizable_movie_image_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_movie_image_insert AFTER INSERT ON app_public.movies_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_movie_image_insert();


--
-- Name: movies_images _900_localizable_movie_image_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_movie_image_update AFTER UPDATE ON app_public.movies_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_movie_image_update();


--
-- Name: movies _900_localizable_movie_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_movie_insert AFTER INSERT ON app_public.movies FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_movie_insert();


--
-- Name: movies _900_localizable_movie_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_movie_update AFTER UPDATE ON app_public.movies FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_movie_update();


--
-- Name: seasons _900_localizable_season_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_season_delete AFTER DELETE ON app_public.seasons FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_season_delete();


--
-- Name: seasons_images _900_localizable_season_image_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_season_image_delete AFTER DELETE ON app_public.seasons_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_season_image_delete();


--
-- Name: seasons_images _900_localizable_season_image_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_season_image_insert AFTER INSERT ON app_public.seasons_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_season_image_insert();


--
-- Name: seasons_images _900_localizable_season_image_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_season_image_update AFTER UPDATE ON app_public.seasons_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_season_image_update();


--
-- Name: seasons _900_localizable_season_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_season_insert AFTER INSERT ON app_public.seasons FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_season_insert();


--
-- Name: seasons _900_localizable_season_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_season_update AFTER UPDATE ON app_public.seasons FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_season_update();


--
-- Name: tvshows _900_localizable_tvshow_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_tvshow_delete AFTER DELETE ON app_public.tvshows FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_tvshow_delete();


--
-- Name: tvshow_genres _900_localizable_tvshow_genre_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_tvshow_genre_delete AFTER DELETE ON app_public.tvshow_genres FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_tvshow_genre_delete();


--
-- Name: tvshow_genres _900_localizable_tvshow_genre_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_tvshow_genre_insert AFTER INSERT ON app_public.tvshow_genres FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_tvshow_genre_insert();


--
-- Name: tvshow_genres _900_localizable_tvshow_genre_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_tvshow_genre_update AFTER UPDATE ON app_public.tvshow_genres FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_tvshow_genre_update();


--
-- Name: tvshows_images _900_localizable_tvshow_image_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_tvshow_image_delete AFTER DELETE ON app_public.tvshows_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_tvshow_image_delete();


--
-- Name: tvshows_images _900_localizable_tvshow_image_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_tvshow_image_insert AFTER INSERT ON app_public.tvshows_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_tvshow_image_insert();


--
-- Name: tvshows_images _900_localizable_tvshow_image_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_tvshow_image_update AFTER UPDATE ON app_public.tvshows_images FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_tvshow_image_update();


--
-- Name: tvshows _900_localizable_tvshow_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_tvshow_insert AFTER INSERT ON app_public.tvshows FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_tvshow_insert();


--
-- Name: tvshows _900_localizable_tvshow_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _900_localizable_tvshow_update AFTER UPDATE ON app_public.tvshows FOR EACH ROW WHEN ((app_hidden.is_localization_enabled() IS TRUE)) EXECUTE PROCEDURE app_hidden.localizable_tvshow_update();


--
-- Name: collections_snapshots tg_cleanup_orphaned_collection_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER tg_cleanup_orphaned_collection_snapshots AFTER DELETE ON app_public.collections_snapshots FOR EACH ROW EXECUTE PROCEDURE app_public.remove_orphaned_snapshot();


--
-- Name: episodes_snapshots tg_cleanup_orphaned_episode_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER tg_cleanup_orphaned_episode_snapshots AFTER DELETE ON app_public.episodes_snapshots FOR EACH ROW EXECUTE PROCEDURE app_public.remove_orphaned_snapshot();


--
-- Name: movies_snapshots tg_cleanup_orphaned_movie_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER tg_cleanup_orphaned_movie_snapshots AFTER DELETE ON app_public.movies_snapshots FOR EACH ROW EXECUTE PROCEDURE app_public.remove_orphaned_snapshot();


--
-- Name: seasons_snapshots tg_cleanup_orphaned_season_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER tg_cleanup_orphaned_season_snapshots AFTER DELETE ON app_public.seasons_snapshots FOR EACH ROW EXECUTE PROCEDURE app_public.remove_orphaned_snapshot();


--
-- Name: tvshows_snapshots tg_cleanup_orphaned_tvshow_snapshots; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER tg_cleanup_orphaned_tvshow_snapshots AFTER DELETE ON app_public.tvshows_snapshots FOR EACH ROW EXECUTE PROCEDURE app_public.remove_orphaned_snapshot();


--
-- Name: collection_relations collection_relations_collection_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT collection_relations_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES app_public.collections(id) ON DELETE CASCADE;


--
-- Name: collection_relations collection_relations_episode_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT collection_relations_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES app_public.episodes(id) ON DELETE CASCADE;


--
-- Name: collection_relations collection_relations_movie_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT collection_relations_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES app_public.movies(id) ON DELETE CASCADE;


--
-- Name: collection_relations collection_relations_season_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT collection_relations_season_id_fkey FOREIGN KEY (season_id) REFERENCES app_public.seasons(id) ON DELETE CASCADE;


--
-- Name: collection_relations collection_relations_tvshow_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collection_relations
    ADD CONSTRAINT collection_relations_tvshow_id_fkey FOREIGN KEY (tvshow_id) REFERENCES app_public.tvshows(id) ON DELETE CASCADE;


--
-- Name: collections_images collections_images_collection_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections_images
    ADD CONSTRAINT collections_images_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES app_public.collections(id) ON DELETE CASCADE;


--
-- Name: collections_images collections_images_image_type_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections_images
    ADD CONSTRAINT collections_images_image_type_fkey FOREIGN KEY (image_type) REFERENCES app_public.collection_image_type(value);


--
-- Name: collections collections_publish_status_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections
    ADD CONSTRAINT collections_publish_status_fkey FOREIGN KEY (publish_status) REFERENCES app_public.publish_status(value);


--
-- Name: collections_snapshots collections_snapshots_collection_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections_snapshots
    ADD CONSTRAINT collections_snapshots_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES app_public.collections(id) ON DELETE CASCADE;


--
-- Name: collections_snapshots collections_snapshots_snapshot_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections_snapshots
    ADD CONSTRAINT collections_snapshots_snapshot_id_fkey FOREIGN KEY (snapshot_id) REFERENCES app_public.snapshots(id) ON DELETE CASCADE;


--
-- Name: collections_tags collections_tags_collection_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.collections_tags
    ADD CONSTRAINT collections_tags_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES app_public.collections(id) ON DELETE CASCADE;


--
-- Name: episodes_casts episodes_casts_episode_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_casts
    ADD CONSTRAINT episodes_casts_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES app_public.episodes(id) ON DELETE CASCADE;


--
-- Name: episodes_images episodes_images_episode_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_images
    ADD CONSTRAINT episodes_images_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES app_public.episodes(id) ON DELETE CASCADE;


--
-- Name: episodes_images episodes_images_image_type_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_images
    ADD CONSTRAINT episodes_images_image_type_fkey FOREIGN KEY (image_type) REFERENCES app_public.episode_image_type(value);


--
-- Name: episodes_licenses_countries episodes_licenses_countries_code_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_licenses_countries
    ADD CONSTRAINT episodes_licenses_countries_code_fkey FOREIGN KEY (code) REFERENCES app_public.iso_alpha_two_country_codes(value);


--
-- Name: episodes_licenses_countries episodes_licenses_countries_episodes_license_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_licenses_countries
    ADD CONSTRAINT episodes_licenses_countries_episodes_license_id_fkey FOREIGN KEY (episodes_license_id) REFERENCES app_public.episodes_licenses(id) ON DELETE CASCADE;


--
-- Name: episodes_licenses episodes_licenses_episode_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_licenses
    ADD CONSTRAINT episodes_licenses_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES app_public.episodes(id) ON DELETE CASCADE;


--
-- Name: episodes_production_countries episodes_production_countries_episode_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_production_countries
    ADD CONSTRAINT episodes_production_countries_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES app_public.episodes(id) ON DELETE CASCADE;


--
-- Name: episodes episodes_publish_status_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes
    ADD CONSTRAINT episodes_publish_status_fkey FOREIGN KEY (publish_status) REFERENCES app_public.publish_status(value);


--
-- Name: episodes episodes_season_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes
    ADD CONSTRAINT episodes_season_id_fkey FOREIGN KEY (season_id) REFERENCES app_public.seasons(id) ON DELETE SET NULL;


--
-- Name: episodes_snapshots episodes_snapshots_episode_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_snapshots
    ADD CONSTRAINT episodes_snapshots_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES app_public.episodes(id) ON DELETE CASCADE;


--
-- Name: episodes_snapshots episodes_snapshots_snapshot_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_snapshots
    ADD CONSTRAINT episodes_snapshots_snapshot_id_fkey FOREIGN KEY (snapshot_id) REFERENCES app_public.snapshots(id) ON DELETE CASCADE;


--
-- Name: episodes_tags episodes_tags_episode_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_tags
    ADD CONSTRAINT episodes_tags_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES app_public.episodes(id) ON DELETE CASCADE;


--
-- Name: episodes_trailers episodes_trailers_episode_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_trailers
    ADD CONSTRAINT episodes_trailers_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES app_public.episodes(id) ON DELETE CASCADE;


--
-- Name: episodes_tvshow_genres episodes_tvshow_genres_episode_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_tvshow_genres
    ADD CONSTRAINT episodes_tvshow_genres_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES app_public.episodes(id) ON DELETE CASCADE;


--
-- Name: episodes_tvshow_genres episodes_tvshow_genres_tvshow_genres_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.episodes_tvshow_genres
    ADD CONSTRAINT episodes_tvshow_genres_tvshow_genres_id_fkey FOREIGN KEY (tvshow_genres_id) REFERENCES app_public.tvshow_genres(id) ON DELETE CASCADE;


--
-- Name: ingest_documents ingest_documents_status_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_documents
    ADD CONSTRAINT ingest_documents_status_fkey FOREIGN KEY (status) REFERENCES app_public.ingest_status(value);


--
-- Name: ingest_item_steps ingest_item_steps_ingest_item_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_item_steps
    ADD CONSTRAINT ingest_item_steps_ingest_item_id_fkey FOREIGN KEY (ingest_item_id) REFERENCES app_public.ingest_items(id) ON DELETE CASCADE;


--
-- Name: ingest_item_steps ingest_item_steps_status_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_item_steps
    ADD CONSTRAINT ingest_item_steps_status_fkey FOREIGN KEY (status) REFERENCES app_public.ingest_item_step_status(value);


--
-- Name: ingest_item_steps ingest_item_steps_type_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_item_steps
    ADD CONSTRAINT ingest_item_steps_type_fkey FOREIGN KEY (type) REFERENCES app_public.ingest_item_step_type(value);


--
-- Name: ingest_items ingest_items_exists_status_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_items
    ADD CONSTRAINT ingest_items_exists_status_fkey FOREIGN KEY (exists_status) REFERENCES app_public.ingest_entity_exists_status(value);


--
-- Name: ingest_items ingest_items_ingest_document_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_items
    ADD CONSTRAINT ingest_items_ingest_document_id_fkey FOREIGN KEY (ingest_document_id) REFERENCES app_public.ingest_documents(id) ON DELETE CASCADE;


--
-- Name: ingest_items ingest_items_status_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_items
    ADD CONSTRAINT ingest_items_status_fkey FOREIGN KEY (status) REFERENCES app_public.ingest_item_status(value);


--
-- Name: ingest_items ingest_items_type_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.ingest_items
    ADD CONSTRAINT ingest_items_type_fkey FOREIGN KEY (type) REFERENCES app_public.ingest_item_type(value);


--
-- Name: movies_casts movies_casts_movie_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_casts
    ADD CONSTRAINT movies_casts_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES app_public.movies(id) ON DELETE CASCADE;


--
-- Name: movies_images movies_images_image_type_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_images
    ADD CONSTRAINT movies_images_image_type_fkey FOREIGN KEY (image_type) REFERENCES app_public.movie_image_type(value);


--
-- Name: movies_images movies_images_movie_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_images
    ADD CONSTRAINT movies_images_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES app_public.movies(id) ON DELETE CASCADE;


--
-- Name: movies_licenses_countries movies_licenses_countries_code_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_licenses_countries
    ADD CONSTRAINT movies_licenses_countries_code_fkey FOREIGN KEY (code) REFERENCES app_public.iso_alpha_two_country_codes(value);


--
-- Name: movies_licenses_countries movies_licenses_countries_movies_license_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_licenses_countries
    ADD CONSTRAINT movies_licenses_countries_movies_license_id_fkey FOREIGN KEY (movies_license_id) REFERENCES app_public.movies_licenses(id) ON DELETE CASCADE;


--
-- Name: movies_licenses movies_licenses_movie_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_licenses
    ADD CONSTRAINT movies_licenses_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES app_public.movies(id) ON DELETE CASCADE;


--
-- Name: movies_movie_genres movies_movie_genres_movie_genres_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_movie_genres
    ADD CONSTRAINT movies_movie_genres_movie_genres_id_fkey FOREIGN KEY (movie_genres_id) REFERENCES app_public.movie_genres(id) ON DELETE CASCADE;


--
-- Name: movies_movie_genres movies_movie_genres_movie_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_movie_genres
    ADD CONSTRAINT movies_movie_genres_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES app_public.movies(id) ON DELETE CASCADE;


--
-- Name: movies_production_countries movies_production_countries_movie_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_production_countries
    ADD CONSTRAINT movies_production_countries_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES app_public.movies(id) ON DELETE CASCADE;


--
-- Name: movies movies_publish_status_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies
    ADD CONSTRAINT movies_publish_status_fkey FOREIGN KEY (publish_status) REFERENCES app_public.publish_status(value);


--
-- Name: movies_snapshots movies_snapshots_movie_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_snapshots
    ADD CONSTRAINT movies_snapshots_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES app_public.movies(id) ON DELETE CASCADE;


--
-- Name: movies_snapshots movies_snapshots_snapshot_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_snapshots
    ADD CONSTRAINT movies_snapshots_snapshot_id_fkey FOREIGN KEY (snapshot_id) REFERENCES app_public.snapshots(id) ON DELETE CASCADE;


--
-- Name: movies_tags movies_tags_movie_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_tags
    ADD CONSTRAINT movies_tags_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES app_public.movies(id) ON DELETE CASCADE;


--
-- Name: movies_trailers movies_trailers_movie_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.movies_trailers
    ADD CONSTRAINT movies_trailers_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES app_public.movies(id) ON DELETE CASCADE;


--
-- Name: seasons_casts seasons_casts_season_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_casts
    ADD CONSTRAINT seasons_casts_season_id_fkey FOREIGN KEY (season_id) REFERENCES app_public.seasons(id) ON DELETE CASCADE;


--
-- Name: seasons_images seasons_images_image_type_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_images
    ADD CONSTRAINT seasons_images_image_type_fkey FOREIGN KEY (image_type) REFERENCES app_public.season_image_type(value);


--
-- Name: seasons_images seasons_images_season_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_images
    ADD CONSTRAINT seasons_images_season_id_fkey FOREIGN KEY (season_id) REFERENCES app_public.seasons(id) ON DELETE CASCADE;


--
-- Name: seasons_licenses_countries seasons_licenses_countries_code_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_licenses_countries
    ADD CONSTRAINT seasons_licenses_countries_code_fkey FOREIGN KEY (code) REFERENCES app_public.iso_alpha_two_country_codes(value);


--
-- Name: seasons_licenses_countries seasons_licenses_countries_seasons_license_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_licenses_countries
    ADD CONSTRAINT seasons_licenses_countries_seasons_license_id_fkey FOREIGN KEY (seasons_license_id) REFERENCES app_public.seasons_licenses(id) ON DELETE CASCADE;


--
-- Name: seasons_licenses seasons_licenses_season_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_licenses
    ADD CONSTRAINT seasons_licenses_season_id_fkey FOREIGN KEY (season_id) REFERENCES app_public.seasons(id) ON DELETE CASCADE;


--
-- Name: seasons_production_countries seasons_production_countries_season_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_production_countries
    ADD CONSTRAINT seasons_production_countries_season_id_fkey FOREIGN KEY (season_id) REFERENCES app_public.seasons(id) ON DELETE CASCADE;


--
-- Name: seasons seasons_publish_status_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons
    ADD CONSTRAINT seasons_publish_status_fkey FOREIGN KEY (publish_status) REFERENCES app_public.publish_status(value);


--
-- Name: seasons_snapshots seasons_snapshots_season_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_snapshots
    ADD CONSTRAINT seasons_snapshots_season_id_fkey FOREIGN KEY (season_id) REFERENCES app_public.seasons(id) ON DELETE CASCADE;


--
-- Name: seasons_snapshots seasons_snapshots_snapshot_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_snapshots
    ADD CONSTRAINT seasons_snapshots_snapshot_id_fkey FOREIGN KEY (snapshot_id) REFERENCES app_public.snapshots(id) ON DELETE CASCADE;


--
-- Name: seasons_tags seasons_tags_season_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_tags
    ADD CONSTRAINT seasons_tags_season_id_fkey FOREIGN KEY (season_id) REFERENCES app_public.seasons(id) ON DELETE CASCADE;


--
-- Name: seasons_trailers seasons_trailers_season_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_trailers
    ADD CONSTRAINT seasons_trailers_season_id_fkey FOREIGN KEY (season_id) REFERENCES app_public.seasons(id) ON DELETE CASCADE;


--
-- Name: seasons_tvshow_genres seasons_tvshow_genres_season_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_tvshow_genres
    ADD CONSTRAINT seasons_tvshow_genres_season_id_fkey FOREIGN KEY (season_id) REFERENCES app_public.seasons(id) ON DELETE CASCADE;


--
-- Name: seasons_tvshow_genres seasons_tvshow_genres_tvshow_genres_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons_tvshow_genres
    ADD CONSTRAINT seasons_tvshow_genres_tvshow_genres_id_fkey FOREIGN KEY (tvshow_genres_id) REFERENCES app_public.tvshow_genres(id) ON DELETE CASCADE;


--
-- Name: seasons seasons_tvshow_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.seasons
    ADD CONSTRAINT seasons_tvshow_id_fkey FOREIGN KEY (tvshow_id) REFERENCES app_public.tvshows(id) ON DELETE SET NULL;


--
-- Name: snapshot_validation_results snapshot_validation_results_context_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshot_validation_results
    ADD CONSTRAINT snapshot_validation_results_context_fkey FOREIGN KEY (context) REFERENCES app_public.snapshot_validation_issue_context(value);


--
-- Name: snapshot_validation_results snapshot_validation_results_entity_type_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshot_validation_results
    ADD CONSTRAINT snapshot_validation_results_entity_type_fkey FOREIGN KEY (entity_type) REFERENCES app_public.entity_type(value);


--
-- Name: snapshot_validation_results snapshot_validation_results_severity_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshot_validation_results
    ADD CONSTRAINT snapshot_validation_results_severity_fkey FOREIGN KEY (severity) REFERENCES app_public.snapshot_validation_issue_severity(value);


--
-- Name: snapshot_validation_results snapshot_validation_results_snapshot_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshot_validation_results
    ADD CONSTRAINT snapshot_validation_results_snapshot_id_fkey FOREIGN KEY (snapshot_id) REFERENCES app_public.snapshots(id) ON DELETE CASCADE;


--
-- Name: snapshots snapshots_entity_type_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshots
    ADD CONSTRAINT snapshots_entity_type_fkey FOREIGN KEY (entity_type) REFERENCES app_public.entity_type(value);


--
-- Name: snapshots snapshots_snapshot_state_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshots
    ADD CONSTRAINT snapshots_snapshot_state_fkey FOREIGN KEY (snapshot_state) REFERENCES app_public.snapshot_state(value);


--
-- Name: snapshots snapshots_validation_status_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.snapshots
    ADD CONSTRAINT snapshots_validation_status_fkey FOREIGN KEY (validation_status) REFERENCES app_public.snapshot_validation_status(value);


--
-- Name: tvshows_casts tvshows_casts_tvshow_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_casts
    ADD CONSTRAINT tvshows_casts_tvshow_id_fkey FOREIGN KEY (tvshow_id) REFERENCES app_public.tvshows(id) ON DELETE CASCADE;


--
-- Name: tvshows_images tvshows_images_image_type_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_images
    ADD CONSTRAINT tvshows_images_image_type_fkey FOREIGN KEY (image_type) REFERENCES app_public.tvshow_image_type(value);


--
-- Name: tvshows_images tvshows_images_tvshow_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_images
    ADD CONSTRAINT tvshows_images_tvshow_id_fkey FOREIGN KEY (tvshow_id) REFERENCES app_public.tvshows(id) ON DELETE CASCADE;


--
-- Name: tvshows_licenses_countries tvshows_licenses_countries_code_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_licenses_countries
    ADD CONSTRAINT tvshows_licenses_countries_code_fkey FOREIGN KEY (code) REFERENCES app_public.iso_alpha_two_country_codes(value);


--
-- Name: tvshows_licenses_countries tvshows_licenses_countries_tvshows_license_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_licenses_countries
    ADD CONSTRAINT tvshows_licenses_countries_tvshows_license_id_fkey FOREIGN KEY (tvshows_license_id) REFERENCES app_public.tvshows_licenses(id) ON DELETE CASCADE;


--
-- Name: tvshows_licenses tvshows_licenses_tvshow_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_licenses
    ADD CONSTRAINT tvshows_licenses_tvshow_id_fkey FOREIGN KEY (tvshow_id) REFERENCES app_public.tvshows(id) ON DELETE CASCADE;


--
-- Name: tvshows_production_countries tvshows_production_countries_tvshow_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_production_countries
    ADD CONSTRAINT tvshows_production_countries_tvshow_id_fkey FOREIGN KEY (tvshow_id) REFERENCES app_public.tvshows(id) ON DELETE CASCADE;


--
-- Name: tvshows tvshows_publish_status_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows
    ADD CONSTRAINT tvshows_publish_status_fkey FOREIGN KEY (publish_status) REFERENCES app_public.publish_status(value);


--
-- Name: tvshows_snapshots tvshows_snapshots_snapshot_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_snapshots
    ADD CONSTRAINT tvshows_snapshots_snapshot_id_fkey FOREIGN KEY (snapshot_id) REFERENCES app_public.snapshots(id) ON DELETE CASCADE;


--
-- Name: tvshows_snapshots tvshows_snapshots_tvshow_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_snapshots
    ADD CONSTRAINT tvshows_snapshots_tvshow_id_fkey FOREIGN KEY (tvshow_id) REFERENCES app_public.tvshows(id) ON DELETE CASCADE;


--
-- Name: tvshows_tags tvshows_tags_tvshow_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_tags
    ADD CONSTRAINT tvshows_tags_tvshow_id_fkey FOREIGN KEY (tvshow_id) REFERENCES app_public.tvshows(id) ON DELETE CASCADE;


--
-- Name: tvshows_trailers tvshows_trailers_tvshow_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_trailers
    ADD CONSTRAINT tvshows_trailers_tvshow_id_fkey FOREIGN KEY (tvshow_id) REFERENCES app_public.tvshows(id) ON DELETE CASCADE;


--
-- Name: tvshows_tvshow_genres tvshows_tvshow_genres_tvshow_genres_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_tvshow_genres
    ADD CONSTRAINT tvshows_tvshow_genres_tvshow_genres_id_fkey FOREIGN KEY (tvshow_genres_id) REFERENCES app_public.tvshow_genres(id) ON DELETE CASCADE;


--
-- Name: tvshows_tvshow_genres tvshows_tvshow_genres_tvshow_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.tvshows_tvshow_genres
    ADD CONSTRAINT tvshows_tvshow_genres_tvshow_id_fkey FOREIGN KEY (tvshow_id) REFERENCES app_public.tvshows(id) ON DELETE CASCADE;


--
-- Name: collection_relations; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.collection_relations ENABLE ROW LEVEL SECURITY;

--
-- Name: collection_relations collection_relations_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY collection_relations_authorization ON app_public.collection_relations USING ((( SELECT ax_utils.user_has_permission('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: collection_relations collection_relations_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY collection_relations_authorization_delete ON app_public.collection_relations AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: collections; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.collections ENABLE ROW LEVEL SECURITY;

--
-- Name: collections collections_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY collections_authorization ON app_public.collections USING ((( SELECT ax_utils.user_has_permission('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: collections collections_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY collections_authorization_delete ON app_public.collections AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: collections_images; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.collections_images ENABLE ROW LEVEL SECURITY;

--
-- Name: collections_images collections_images_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY collections_images_authorization ON app_public.collections_images USING ((( SELECT ax_utils.user_has_permission('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: collections_images collections_images_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY collections_images_authorization_delete ON app_public.collections_images AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: collections_snapshots; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.collections_snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: collections_snapshots collections_snapshots_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY collections_snapshots_authorization ON app_public.collections_snapshots USING ((( SELECT ax_utils.user_has_permission('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: collections_snapshots collections_snapshots_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY collections_snapshots_authorization_delete ON app_public.collections_snapshots AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: collections_tags; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.collections_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: collections_tags collections_tags_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY collections_tags_authorization ON app_public.collections_tags USING ((( SELECT ax_utils.user_has_permission('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: collections_tags collections_tags_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY collections_tags_authorization_delete ON app_public.collections_tags AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: episodes; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes ENABLE ROW LEVEL SECURITY;

--
-- Name: episodes episodes_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_authorization ON app_public.episodes USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: episodes episodes_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_authorization_delete ON app_public.episodes AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: episodes_casts; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes_casts ENABLE ROW LEVEL SECURITY;

--
-- Name: episodes_casts episodes_casts_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_casts_authorization ON app_public.episodes_casts USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: episodes_casts episodes_casts_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_casts_authorization_delete ON app_public.episodes_casts AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: episodes_images; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes_images ENABLE ROW LEVEL SECURITY;

--
-- Name: episodes_images episodes_images_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_images_authorization ON app_public.episodes_images USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: episodes_images episodes_images_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_images_authorization_delete ON app_public.episodes_images AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: episodes_licenses; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes_licenses ENABLE ROW LEVEL SECURITY;

--
-- Name: episodes_licenses episodes_licenses_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_licenses_authorization ON app_public.episodes_licenses USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: episodes_licenses episodes_licenses_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_licenses_authorization_delete ON app_public.episodes_licenses AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: episodes_licenses_countries; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes_licenses_countries ENABLE ROW LEVEL SECURITY;

--
-- Name: episodes_licenses_countries episodes_licenses_countries_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_licenses_countries_authorization ON app_public.episodes_licenses_countries USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: episodes_licenses_countries episodes_licenses_countries_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_licenses_countries_authorization_delete ON app_public.episodes_licenses_countries AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: episodes_production_countries; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes_production_countries ENABLE ROW LEVEL SECURITY;

--
-- Name: episodes_production_countries episodes_production_countries_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_production_countries_authorization ON app_public.episodes_production_countries USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: episodes_production_countries episodes_production_countries_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_production_countries_authorization_delete ON app_public.episodes_production_countries AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: episodes_snapshots; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes_snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: episodes_snapshots episodes_snapshots_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_snapshots_authorization ON app_public.episodes_snapshots USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: episodes_snapshots episodes_snapshots_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_snapshots_authorization_delete ON app_public.episodes_snapshots AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: episodes_tags; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: episodes_tags episodes_tags_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_tags_authorization ON app_public.episodes_tags USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: episodes_tags episodes_tags_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_tags_authorization_delete ON app_public.episodes_tags AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: episodes_trailers; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes_trailers ENABLE ROW LEVEL SECURITY;

--
-- Name: episodes_trailers episodes_trailers_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_trailers_authorization ON app_public.episodes_trailers USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: episodes_trailers episodes_trailers_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_trailers_authorization_delete ON app_public.episodes_trailers AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: episodes_tvshow_genres; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.episodes_tvshow_genres ENABLE ROW LEVEL SECURITY;

--
-- Name: episodes_tvshow_genres episodes_tvshow_genres_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_tvshow_genres_authorization ON app_public.episodes_tvshow_genres USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: episodes_tvshow_genres episodes_tvshow_genres_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY episodes_tvshow_genres_authorization_delete ON app_public.episodes_tvshow_genres AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: ingest_documents; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.ingest_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: ingest_documents ingest_documents_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY ingest_documents_authorization ON app_public.ingest_documents USING ((( SELECT ax_utils.user_has_permission('INGESTS_VIEW,INGESTS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('INGESTS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: ingest_documents ingest_documents_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY ingest_documents_authorization_delete ON app_public.ingest_documents AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('INGESTS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: ingest_item_steps; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.ingest_item_steps ENABLE ROW LEVEL SECURITY;

--
-- Name: ingest_item_steps ingest_item_steps_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY ingest_item_steps_authorization ON app_public.ingest_item_steps USING ((( SELECT ax_utils.user_has_permission('INGESTS_VIEW,INGESTS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('INGESTS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: ingest_item_steps ingest_item_steps_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY ingest_item_steps_authorization_delete ON app_public.ingest_item_steps AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('INGESTS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: ingest_items; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.ingest_items ENABLE ROW LEVEL SECURITY;

--
-- Name: ingest_items ingest_items_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY ingest_items_authorization ON app_public.ingest_items USING ((( SELECT ax_utils.user_has_permission('INGESTS_VIEW,INGESTS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('INGESTS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: ingest_items ingest_items_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY ingest_items_authorization_delete ON app_public.ingest_items AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('INGESTS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movie_genres; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movie_genres ENABLE ROW LEVEL SECURITY;

--
-- Name: movie_genres movie_genres_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movie_genres_authorization ON app_public.movie_genres USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,SETTINGS_VIEW,SETTINGS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movie_genres movie_genres_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movie_genres_authorization_delete ON app_public.movie_genres AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movies; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies ENABLE ROW LEVEL SECURITY;

--
-- Name: movies movies_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_authorization ON app_public.movies USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movies movies_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_authorization_delete ON app_public.movies AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movies_casts; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies_casts ENABLE ROW LEVEL SECURITY;

--
-- Name: movies_casts movies_casts_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_casts_authorization ON app_public.movies_casts USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movies_casts movies_casts_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_casts_authorization_delete ON app_public.movies_casts AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movies_images; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies_images ENABLE ROW LEVEL SECURITY;

--
-- Name: movies_images movies_images_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_images_authorization ON app_public.movies_images USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movies_images movies_images_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_images_authorization_delete ON app_public.movies_images AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movies_licenses; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies_licenses ENABLE ROW LEVEL SECURITY;

--
-- Name: movies_licenses movies_licenses_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_licenses_authorization ON app_public.movies_licenses USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movies_licenses movies_licenses_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_licenses_authorization_delete ON app_public.movies_licenses AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movies_licenses_countries; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies_licenses_countries ENABLE ROW LEVEL SECURITY;

--
-- Name: movies_licenses_countries movies_licenses_countries_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_licenses_countries_authorization ON app_public.movies_licenses_countries USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movies_licenses_countries movies_licenses_countries_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_licenses_countries_authorization_delete ON app_public.movies_licenses_countries AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movies_movie_genres; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies_movie_genres ENABLE ROW LEVEL SECURITY;

--
-- Name: movies_movie_genres movies_movie_genres_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_movie_genres_authorization ON app_public.movies_movie_genres USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movies_movie_genres movies_movie_genres_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_movie_genres_authorization_delete ON app_public.movies_movie_genres AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movies_production_countries; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies_production_countries ENABLE ROW LEVEL SECURITY;

--
-- Name: movies_production_countries movies_production_countries_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_production_countries_authorization ON app_public.movies_production_countries USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movies_production_countries movies_production_countries_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_production_countries_authorization_delete ON app_public.movies_production_countries AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movies_snapshots; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies_snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: movies_snapshots movies_snapshots_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_snapshots_authorization ON app_public.movies_snapshots USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movies_snapshots movies_snapshots_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_snapshots_authorization_delete ON app_public.movies_snapshots AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movies_tags; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: movies_tags movies_tags_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_tags_authorization ON app_public.movies_tags USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movies_tags movies_tags_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_tags_authorization_delete ON app_public.movies_tags AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: movies_trailers; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.movies_trailers ENABLE ROW LEVEL SECURITY;

--
-- Name: movies_trailers movies_trailers_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_trailers_authorization ON app_public.movies_trailers USING ((( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: movies_trailers movies_trailers_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY movies_trailers_authorization_delete ON app_public.movies_trailers AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: seasons; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons seasons_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_authorization ON app_public.seasons USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: seasons seasons_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_authorization_delete ON app_public.seasons AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: seasons_casts; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons_casts ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons_casts seasons_casts_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_casts_authorization ON app_public.seasons_casts USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: seasons_casts seasons_casts_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_casts_authorization_delete ON app_public.seasons_casts AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: seasons_images; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons_images ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons_images seasons_images_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_images_authorization ON app_public.seasons_images USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: seasons_images seasons_images_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_images_authorization_delete ON app_public.seasons_images AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: seasons_licenses; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons_licenses ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons_licenses seasons_licenses_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_licenses_authorization ON app_public.seasons_licenses USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: seasons_licenses seasons_licenses_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_licenses_authorization_delete ON app_public.seasons_licenses AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: seasons_licenses_countries; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons_licenses_countries ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons_licenses_countries seasons_licenses_countries_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_licenses_countries_authorization ON app_public.seasons_licenses_countries USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: seasons_licenses_countries seasons_licenses_countries_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_licenses_countries_authorization_delete ON app_public.seasons_licenses_countries AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: seasons_production_countries; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons_production_countries ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons_production_countries seasons_production_countries_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_production_countries_authorization ON app_public.seasons_production_countries USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: seasons_production_countries seasons_production_countries_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_production_countries_authorization_delete ON app_public.seasons_production_countries AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: seasons_snapshots; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons_snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons_snapshots seasons_snapshots_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_snapshots_authorization ON app_public.seasons_snapshots USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: seasons_snapshots seasons_snapshots_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_snapshots_authorization_delete ON app_public.seasons_snapshots AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: seasons_tags; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons_tags seasons_tags_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_tags_authorization ON app_public.seasons_tags USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: seasons_tags seasons_tags_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_tags_authorization_delete ON app_public.seasons_tags AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: seasons_trailers; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons_trailers ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons_trailers seasons_trailers_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_trailers_authorization ON app_public.seasons_trailers USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: seasons_trailers seasons_trailers_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_trailers_authorization_delete ON app_public.seasons_trailers AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: seasons_tvshow_genres; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.seasons_tvshow_genres ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons_tvshow_genres seasons_tvshow_genres_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_tvshow_genres_authorization ON app_public.seasons_tvshow_genres USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: seasons_tvshow_genres seasons_tvshow_genres_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY seasons_tvshow_genres_authorization_delete ON app_public.seasons_tvshow_genres AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: snapshot_validation_results; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.snapshot_validation_results ENABLE ROW LEVEL SECURITY;

--
-- Name: snapshots; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: snapshots snapshots_collection_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_collection_authorization_delete ON app_public.snapshots FOR DELETE USING ((((entity_type)::text = 'COLLECTION'::text) AND ( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_collection_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_collection_authorization_insert ON app_public.snapshots FOR INSERT WITH CHECK ((((entity_type)::text = 'COLLECTION'::text) AND ( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_collection_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_collection_authorization_select ON app_public.snapshots FOR SELECT USING ((((entity_type)::text = 'COLLECTION'::text) AND ( SELECT app_hidden.user_has_filter_permission('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_collection_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_collection_authorization_update ON app_public.snapshots FOR UPDATE USING ((((entity_type)::text = 'COLLECTION'::text) AND ( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'COLLECTION'::text) AND ( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_episode_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_episode_authorization_delete ON app_public.snapshots FOR DELETE USING ((((entity_type)::text = 'EPISODE'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_episode_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_episode_authorization_insert ON app_public.snapshots FOR INSERT WITH CHECK ((((entity_type)::text = 'EPISODE'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_episode_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_episode_authorization_select ON app_public.snapshots FOR SELECT USING ((((entity_type)::text = 'EPISODE'::text) AND ( SELECT app_hidden.user_has_filter_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_episode_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_episode_authorization_update ON app_public.snapshots FOR UPDATE USING ((((entity_type)::text = 'EPISODE'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'EPISODE'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_movie_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_movie_authorization_delete ON app_public.snapshots FOR DELETE USING ((((entity_type)::text = 'MOVIE'::text) AND ( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_movie_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_movie_authorization_insert ON app_public.snapshots FOR INSERT WITH CHECK ((((entity_type)::text = 'MOVIE'::text) AND ( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_movie_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_movie_authorization_select ON app_public.snapshots FOR SELECT USING ((((entity_type)::text = 'MOVIE'::text) AND ( SELECT app_hidden.user_has_filter_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_movie_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_movie_authorization_update ON app_public.snapshots FOR UPDATE USING ((((entity_type)::text = 'MOVIE'::text) AND ( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'MOVIE'::text) AND ( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_movie_genre_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_movie_genre_authorization_delete ON app_public.snapshots FOR DELETE USING ((((entity_type)::text = 'MOVIE_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_movie_genre_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_movie_genre_authorization_insert ON app_public.snapshots FOR INSERT WITH CHECK ((((entity_type)::text = 'MOVIE_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_movie_genre_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_movie_genre_authorization_select ON app_public.snapshots FOR SELECT USING ((((entity_type)::text = 'MOVIE_GENRE'::text) AND ( SELECT app_hidden.user_has_filter_permission('SETTINGS_VIEW,SETTINGS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_movie_genre_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_movie_genre_authorization_update ON app_public.snapshots FOR UPDATE USING ((((entity_type)::text = 'MOVIE_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'MOVIE_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_season_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_season_authorization_delete ON app_public.snapshots FOR DELETE USING ((((entity_type)::text = 'SEASON'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_season_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_season_authorization_insert ON app_public.snapshots FOR INSERT WITH CHECK ((((entity_type)::text = 'SEASON'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_season_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_season_authorization_select ON app_public.snapshots FOR SELECT USING ((((entity_type)::text = 'SEASON'::text) AND ( SELECT app_hidden.user_has_filter_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_season_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_season_authorization_update ON app_public.snapshots FOR UPDATE USING ((((entity_type)::text = 'SEASON'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'SEASON'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_tvshow_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_tvshow_authorization_delete ON app_public.snapshots FOR DELETE USING ((((entity_type)::text = 'TVSHOW'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_tvshow_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_tvshow_authorization_insert ON app_public.snapshots FOR INSERT WITH CHECK ((((entity_type)::text = 'TVSHOW'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_tvshow_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_tvshow_authorization_select ON app_public.snapshots FOR SELECT USING ((((entity_type)::text = 'TVSHOW'::text) AND ( SELECT app_hidden.user_has_filter_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_tvshow_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_tvshow_authorization_update ON app_public.snapshots FOR UPDATE USING ((((entity_type)::text = 'TVSHOW'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'TVSHOW'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_tvshow_genre_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_tvshow_genre_authorization_delete ON app_public.snapshots FOR DELETE USING ((((entity_type)::text = 'TVSHOW_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_tvshow_genre_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_tvshow_genre_authorization_insert ON app_public.snapshots FOR INSERT WITH CHECK ((((entity_type)::text = 'TVSHOW_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_tvshow_genre_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_tvshow_genre_authorization_select ON app_public.snapshots FOR SELECT USING ((((entity_type)::text = 'TVSHOW_GENRE'::text) AND ( SELECT app_hidden.user_has_filter_permission('SETTINGS_VIEW,SETTINGS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshots snapshots_tvshow_genre_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_tvshow_genre_authorization_update ON app_public.snapshots FOR UPDATE USING ((((entity_type)::text = 'TVSHOW_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'TVSHOW_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_collection_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_collection_authorization_delete ON app_public.snapshot_validation_results FOR DELETE USING ((((entity_type)::text = 'COLLECTION'::text) AND ( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_collection_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_collection_authorization_insert ON app_public.snapshot_validation_results FOR INSERT WITH CHECK ((((entity_type)::text = 'COLLECTION'::text) AND ( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_collection_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_collection_authorization_select ON app_public.snapshot_validation_results FOR SELECT USING ((((entity_type)::text = 'COLLECTION'::text) AND ( SELECT app_hidden.user_has_filter_permission('COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_collection_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_collection_authorization_update ON app_public.snapshot_validation_results FOR UPDATE USING ((((entity_type)::text = 'COLLECTION'::text) AND ( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'COLLECTION'::text) AND ( SELECT ax_utils.user_has_permission('COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_episode_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_episode_authorization_delete ON app_public.snapshot_validation_results FOR DELETE USING ((((entity_type)::text = 'EPISODE'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_episode_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_episode_authorization_insert ON app_public.snapshot_validation_results FOR INSERT WITH CHECK ((((entity_type)::text = 'EPISODE'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_episode_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_episode_authorization_select ON app_public.snapshot_validation_results FOR SELECT USING ((((entity_type)::text = 'EPISODE'::text) AND ( SELECT app_hidden.user_has_filter_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_episode_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_episode_authorization_update ON app_public.snapshot_validation_results FOR UPDATE USING ((((entity_type)::text = 'EPISODE'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'EPISODE'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_movie_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_movie_authorization_delete ON app_public.snapshot_validation_results FOR DELETE USING ((((entity_type)::text = 'MOVIE'::text) AND ( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_movie_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_movie_authorization_insert ON app_public.snapshot_validation_results FOR INSERT WITH CHECK ((((entity_type)::text = 'MOVIE'::text) AND ( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_movie_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_movie_authorization_select ON app_public.snapshot_validation_results FOR SELECT USING ((((entity_type)::text = 'MOVIE'::text) AND ( SELECT app_hidden.user_has_filter_permission('MOVIES_VIEW,MOVIES_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_movie_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_movie_authorization_update ON app_public.snapshot_validation_results FOR UPDATE USING ((((entity_type)::text = 'MOVIE'::text) AND ( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'MOVIE'::text) AND ( SELECT ax_utils.user_has_permission('MOVIES_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_movie_genre_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_movie_genre_authorization_delete ON app_public.snapshot_validation_results FOR DELETE USING ((((entity_type)::text = 'MOVIE_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_movie_genre_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_movie_genre_authorization_insert ON app_public.snapshot_validation_results FOR INSERT WITH CHECK ((((entity_type)::text = 'MOVIE_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_movie_genre_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_movie_genre_authorization_select ON app_public.snapshot_validation_results FOR SELECT USING ((((entity_type)::text = 'MOVIE_GENRE'::text) AND ( SELECT app_hidden.user_has_filter_permission('SETTINGS_VIEW,SETTINGS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_movie_genre_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_movie_genre_authorization_update ON app_public.snapshot_validation_results FOR UPDATE USING ((((entity_type)::text = 'MOVIE_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'MOVIE_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_season_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_season_authorization_delete ON app_public.snapshot_validation_results FOR DELETE USING ((((entity_type)::text = 'SEASON'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_season_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_season_authorization_insert ON app_public.snapshot_validation_results FOR INSERT WITH CHECK ((((entity_type)::text = 'SEASON'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_season_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_season_authorization_select ON app_public.snapshot_validation_results FOR SELECT USING ((((entity_type)::text = 'SEASON'::text) AND ( SELECT app_hidden.user_has_filter_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_season_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_season_authorization_update ON app_public.snapshot_validation_results FOR UPDATE USING ((((entity_type)::text = 'SEASON'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'SEASON'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_tvshow_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_tvshow_authorization_delete ON app_public.snapshot_validation_results FOR DELETE USING ((((entity_type)::text = 'TVSHOW'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_tvshow_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_tvshow_authorization_insert ON app_public.snapshot_validation_results FOR INSERT WITH CHECK ((((entity_type)::text = 'TVSHOW'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_tvshow_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_tvshow_authorization_select ON app_public.snapshot_validation_results FOR SELECT USING ((((entity_type)::text = 'TVSHOW'::text) AND ( SELECT app_hidden.user_has_filter_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_tvshow_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_tvshow_authorization_update ON app_public.snapshot_validation_results FOR UPDATE USING ((((entity_type)::text = 'TVSHOW'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'TVSHOW'::text) AND ( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_tvshow_genre_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_tvshow_genre_authorization_delete ON app_public.snapshot_validation_results FOR DELETE USING ((((entity_type)::text = 'TVSHOW_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_tvshow_genre_authorization_insert; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_tvshow_genre_authorization_insert ON app_public.snapshot_validation_results FOR INSERT WITH CHECK ((((entity_type)::text = 'TVSHOW_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_tvshow_genre_authorization_select; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_tvshow_genre_authorization_select ON app_public.snapshot_validation_results FOR SELECT USING ((((entity_type)::text = 'TVSHOW_GENRE'::text) AND ( SELECT app_hidden.user_has_filter_permission('SETTINGS_VIEW,SETTINGS_EDIT,ADMIN'::text) AS user_has_filter_permission) AND ( SELECT ax_utils.user_has_permission('MOVIES_VIEW,MOVIES_EDIT,TVSHOWS_VIEW,TVSHOWS_EDIT,SETTINGS_VIEW,SETTINGS_EDIT,COLLECTIONS_VIEW,COLLECTIONS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: snapshot_validation_results snapshots_validation_tvshow_genre_authorization_update; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY snapshots_validation_tvshow_genre_authorization_update ON app_public.snapshot_validation_results FOR UPDATE USING ((((entity_type)::text = 'TVSHOW_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission))) WITH CHECK ((((entity_type)::text = 'TVSHOW_GENRE'::text) AND ( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission)));


--
-- Name: tvshow_genres; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshow_genres ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshow_genres tvshow_genres_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshow_genres_authorization ON app_public.tvshow_genres USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,SETTINGS_VIEW,SETTINGS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshow_genres tvshow_genres_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshow_genres_authorization_delete ON app_public.tvshow_genres AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('SETTINGS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: tvshows; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshows tvshows_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_authorization ON app_public.tvshows USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshows tvshows_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_authorization_delete ON app_public.tvshows AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: tvshows_casts; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows_casts ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshows_casts tvshows_casts_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_casts_authorization ON app_public.tvshows_casts USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshows_casts tvshows_casts_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_casts_authorization_delete ON app_public.tvshows_casts AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: tvshows_images; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows_images ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshows_images tvshows_images_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_images_authorization ON app_public.tvshows_images USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshows_images tvshows_images_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_images_authorization_delete ON app_public.tvshows_images AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: tvshows_licenses; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows_licenses ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshows_licenses tvshows_licenses_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_licenses_authorization ON app_public.tvshows_licenses USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshows_licenses tvshows_licenses_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_licenses_authorization_delete ON app_public.tvshows_licenses AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: tvshows_licenses_countries; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows_licenses_countries ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshows_licenses_countries tvshows_licenses_countries_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_licenses_countries_authorization ON app_public.tvshows_licenses_countries USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshows_licenses_countries tvshows_licenses_countries_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_licenses_countries_authorization_delete ON app_public.tvshows_licenses_countries AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: tvshows_production_countries; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows_production_countries ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshows_production_countries tvshows_production_countries_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_production_countries_authorization ON app_public.tvshows_production_countries USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshows_production_countries tvshows_production_countries_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_production_countries_authorization_delete ON app_public.tvshows_production_countries AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: tvshows_snapshots; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows_snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshows_snapshots tvshows_snapshots_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_snapshots_authorization ON app_public.tvshows_snapshots USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshows_snapshots tvshows_snapshots_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_snapshots_authorization_delete ON app_public.tvshows_snapshots AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: tvshows_tags; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshows_tags tvshows_tags_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_tags_authorization ON app_public.tvshows_tags USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshows_tags tvshows_tags_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_tags_authorization_delete ON app_public.tvshows_tags AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: tvshows_trailers; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows_trailers ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshows_trailers tvshows_trailers_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_trailers_authorization ON app_public.tvshows_trailers USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshows_trailers tvshows_trailers_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_trailers_authorization_delete ON app_public.tvshows_trailers AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: tvshows_tvshow_genres; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.tvshows_tvshow_genres ENABLE ROW LEVEL SECURITY;

--
-- Name: tvshows_tvshow_genres tvshows_tvshow_genres_authorization; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_tvshow_genres_authorization ON app_public.tvshows_tvshow_genres USING ((( SELECT ax_utils.user_has_permission('TVSHOWS_VIEW,TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1))) WITH CHECK ((( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission) AND (1 = 1)));


--
-- Name: tvshows_tvshow_genres tvshows_tvshow_genres_authorization_delete; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY tvshows_tvshow_genres_authorization_delete ON app_public.tvshows_tvshow_genres AS RESTRICTIVE FOR DELETE USING (( SELECT ax_utils.user_has_permission('TVSHOWS_EDIT,ADMIN'::text) AS user_has_permission));


--
-- Name: SCHEMA app_hidden; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_hidden TO media_service_gql_role;


--
-- Name: SCHEMA app_public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_public TO media_service_gql_role;
GRANT USAGE ON SCHEMA app_public TO media_service_login;


--
-- Name: SCHEMA ax_utils; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA ax_utils TO media_service_gql_role;


--
-- Name: FUNCTION create_active_snapshots_before_delete_trigger(tablename text, relationtablename text, relationfkname text, entitytypename text); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.create_active_snapshots_before_delete_trigger(tablename text, relationtablename text, relationfkname text, entitytypename text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.create_active_snapshots_before_delete_trigger(tablename text, relationtablename text, relationfkname text, entitytypename text) TO media_service_gql_role;


--
-- Name: FUNCTION create_localizable_entity_triggers(aggregateid text, tablename text, entitytype text, localizable_fields text, required_fields text); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.create_localizable_entity_triggers(aggregateid text, tablename text, entitytype text, localizable_fields text, required_fields text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.create_localizable_entity_triggers(aggregateid text, tablename text, entitytype text, localizable_fields text, required_fields text) TO media_service_gql_role;


--
-- Name: FUNCTION create_propagate_publish_state_trigger(tablename text, entitytype text); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.create_propagate_publish_state_trigger(tablename text, entitytype text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.create_propagate_publish_state_trigger(tablename text, entitytype text) TO media_service_gql_role;


--
-- Name: FUNCTION define_snapshot_authentication(entitytype text, allowedreadpermissions text, filterreadpermissions text, allowedmodifypermissions text); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.define_snapshot_authentication(entitytype text, allowedreadpermissions text, filterreadpermissions text, allowedmodifypermissions text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.define_snapshot_authentication(entitytype text, allowedreadpermissions text, filterreadpermissions text, allowedmodifypermissions text) TO media_service_gql_role;


--
-- Name: FUNCTION drop_snapshot_authentication(entitytype text); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.drop_snapshot_authentication(entitytype text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.drop_snapshot_authentication(entitytype text) TO media_service_gql_role;


--
-- Name: FUNCTION is_localization_enabled(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.is_localization_enabled() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.is_localization_enabled() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_collection_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_collection_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_collection_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_collection_image_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_collection_image_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_collection_image_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_collection_image_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_collection_image_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_collection_image_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_collection_image_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_collection_image_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_collection_image_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_collection_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_collection_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_collection_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_collection_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_collection_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_collection_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_episode_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_episode_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_episode_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_episode_image_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_episode_image_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_episode_image_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_episode_image_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_episode_image_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_episode_image_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_episode_image_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_episode_image_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_episode_image_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_episode_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_episode_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_episode_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_episode_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_episode_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_episode_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_movie_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_movie_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_movie_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_movie_genre_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_movie_genre_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_movie_genre_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_movie_genre_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_movie_genre_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_movie_genre_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_movie_genre_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_movie_genre_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_movie_genre_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_movie_image_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_movie_image_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_movie_image_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_movie_image_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_movie_image_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_movie_image_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_movie_image_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_movie_image_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_movie_image_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_movie_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_movie_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_movie_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_movie_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_movie_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_movie_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_season_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_season_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_season_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_season_image_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_season_image_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_season_image_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_season_image_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_season_image_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_season_image_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_season_image_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_season_image_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_season_image_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_season_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_season_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_season_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_season_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_season_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_season_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_tvshow_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_tvshow_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_tvshow_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_tvshow_genre_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_tvshow_genre_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_tvshow_genre_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_tvshow_genre_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_tvshow_genre_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_tvshow_genre_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_tvshow_genre_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_tvshow_genre_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_tvshow_genre_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_tvshow_image_delete(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_tvshow_image_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_tvshow_image_delete() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_tvshow_image_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_tvshow_image_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_tvshow_image_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_tvshow_image_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_tvshow_image_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_tvshow_image_update() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_tvshow_insert(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_tvshow_insert() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_tvshow_insert() TO media_service_gql_role;


--
-- Name: FUNCTION localizable_tvshow_update(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.localizable_tvshow_update() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.localizable_tvshow_update() TO media_service_gql_role;


--
-- Name: TABLE inbox; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_hidden.inbox TO media_service_gql_role;


--
-- Name: COLUMN inbox.locked_until; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(locked_until) ON TABLE app_hidden.inbox TO media_service_gql_role;


--
-- Name: COLUMN inbox.processed_at; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(processed_at) ON TABLE app_hidden.inbox TO media_service_gql_role;


--
-- Name: COLUMN inbox.abandoned_at; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(abandoned_at) ON TABLE app_hidden.inbox TO media_service_gql_role;


--
-- Name: COLUMN inbox.started_attempts; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(started_attempts) ON TABLE app_hidden.inbox TO media_service_gql_role;


--
-- Name: COLUMN inbox.finished_attempts; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(finished_attempts) ON TABLE app_hidden.inbox TO media_service_gql_role;


--
-- Name: FUNCTION next_inbox_messages(max_size integer, lock_ms integer); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.next_inbox_messages(max_size integer, lock_ms integer) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.next_inbox_messages(max_size integer, lock_ms integer) TO media_service_gql_role;


--
-- Name: TABLE outbox; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_hidden.outbox TO media_service_gql_role;


--
-- Name: COLUMN outbox.locked_until; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(locked_until) ON TABLE app_hidden.outbox TO media_service_gql_role;


--
-- Name: COLUMN outbox.processed_at; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(processed_at) ON TABLE app_hidden.outbox TO media_service_gql_role;


--
-- Name: COLUMN outbox.abandoned_at; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(abandoned_at) ON TABLE app_hidden.outbox TO media_service_gql_role;


--
-- Name: COLUMN outbox.started_attempts; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(started_attempts) ON TABLE app_hidden.outbox TO media_service_gql_role;


--
-- Name: COLUMN outbox.finished_attempts; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(finished_attempts) ON TABLE app_hidden.outbox TO media_service_gql_role;


--
-- Name: FUNCTION next_outbox_messages(max_size integer, lock_ms integer); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.next_outbox_messages(max_size integer, lock_ms integer) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.next_outbox_messages(max_size integer, lock_ms integer) TO media_service_gql_role;


--
-- Name: FUNCTION tg__update_publish_state(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg__update_publish_state() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg__update_publish_state() TO media_service_gql_role;


--
-- Name: FUNCTION tg_collections__check_active_snapshots(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_collections__check_active_snapshots() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_collections__check_active_snapshots() TO media_service_gql_role;


--
-- Name: FUNCTION tg_episodes__check_active_snapshots(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_episodes__check_active_snapshots() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_episodes__check_active_snapshots() TO media_service_gql_role;


--
-- Name: FUNCTION tg_movies__check_active_snapshots(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_movies__check_active_snapshots() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_movies__check_active_snapshots() TO media_service_gql_role;


--
-- Name: FUNCTION tg_seasons__check_active_snapshots(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_seasons__check_active_snapshots() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_seasons__check_active_snapshots() TO media_service_gql_role;


--
-- Name: FUNCTION tg_snapshots__check_active_state(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_snapshots__check_active_state() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_snapshots__check_active_state() TO media_service_gql_role;


--
-- Name: FUNCTION tg_snapshots__propagate_publish_state_to_collections(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_collections() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_collections() TO media_service_gql_role;


--
-- Name: FUNCTION tg_snapshots__propagate_publish_state_to_episodes(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_episodes() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_episodes() TO media_service_gql_role;


--
-- Name: FUNCTION tg_snapshots__propagate_publish_state_to_movies(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_movies() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_movies() TO media_service_gql_role;


--
-- Name: FUNCTION tg_snapshots__propagate_publish_state_to_seasons(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_seasons() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_seasons() TO media_service_gql_role;


--
-- Name: FUNCTION tg_snapshots__propagate_publish_state_to_tvshows(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_tvshows() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_snapshots__propagate_publish_state_to_tvshows() TO media_service_gql_role;


--
-- Name: FUNCTION tg_tvshows__check_active_snapshots(); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.tg_tvshows__check_active_snapshots() FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.tg_tvshows__check_active_snapshots() TO media_service_gql_role;


--
-- Name: FUNCTION to_kebab_case(input_value text); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.to_kebab_case(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.to_kebab_case(input_value text) TO media_service_gql_role;


--
-- Name: FUNCTION to_pascal_case(input_value text); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.to_pascal_case(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.to_pascal_case(input_value text) TO media_service_gql_role;


--
-- Name: FUNCTION user_has_filter_permission(required_permissions text); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.user_has_filter_permission(required_permissions text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.user_has_filter_permission(required_permissions text) TO media_service_gql_role;


--
-- Name: FUNCTION get_collections_tags_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_collections_tags_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_collections_tags_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_episodes_casts_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_episodes_casts_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_episodes_casts_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_episodes_production_countries_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_episodes_production_countries_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_episodes_production_countries_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_episodes_tags_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_episodes_tags_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_episodes_tags_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_movies_casts_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_movies_casts_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_movies_casts_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_movies_production_countries_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_movies_production_countries_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_movies_production_countries_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_movies_tags_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_movies_tags_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_movies_tags_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_seasons_casts_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_seasons_casts_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_seasons_casts_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_seasons_production_countries_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_seasons_production_countries_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_seasons_production_countries_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_seasons_tags_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_seasons_tags_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_seasons_tags_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_tvshows_casts_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_tvshows_casts_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_tvshows_casts_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_tvshows_production_countries_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_tvshows_production_countries_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_tvshows_production_countries_values() TO media_service_gql_role;


--
-- Name: FUNCTION get_tvshows_tags_values(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.get_tvshows_tags_values() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.get_tvshows_tags_values() TO media_service_gql_role;


--
-- Name: FUNCTION remove_orphaned_snapshot(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.remove_orphaned_snapshot() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.remove_orphaned_snapshot() TO media_service_gql_role;


--
-- Name: FUNCTION tg_collection_relations__collections_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_collection_relations__collections_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_collection_relations__collections_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_collections_images__collections_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_collections_images__collections_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_collections_images__collections_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_collections_tags__collections_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_collections_tags__collections_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_collections_tags__collections_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_episodes_casts__episodes_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_episodes_casts__episodes_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_episodes_casts__episodes_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_episodes_images__episodes_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_episodes_images__episodes_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_episodes_images__episodes_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_episodes_licenses__episodes_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_episodes_licenses__episodes_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_episodes_licenses__episodes_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_episodes_licenses_countries__episodes_licenses_ts_propagtn(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_episodes_licenses_countries__episodes_licenses_ts_propagtn() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_episodes_licenses_countries__episodes_licenses_ts_propagtn() TO media_service_gql_role;


--
-- Name: FUNCTION tg_episodes_production_countries__episodes_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_episodes_production_countries__episodes_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_episodes_production_countries__episodes_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_episodes_tags__episodes_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_episodes_tags__episodes_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_episodes_tags__episodes_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_episodes_trailers__episodes_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_episodes_trailers__episodes_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_episodes_trailers__episodes_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_episodes_tvshow_genres__episodes_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_episodes_tvshow_genres__episodes_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_episodes_tvshow_genres__episodes_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_movies_casts__movies_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_movies_casts__movies_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_movies_casts__movies_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_movies_images__movies_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_movies_images__movies_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_movies_images__movies_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_movies_licenses__movies_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_movies_licenses__movies_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_movies_licenses__movies_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_movies_licenses_countries__movies_licenses_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_movies_licenses_countries__movies_licenses_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_movies_licenses_countries__movies_licenses_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_movies_movie_genres__movies_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_movies_movie_genres__movies_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_movies_movie_genres__movies_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_movies_production_countries__movies_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_movies_production_countries__movies_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_movies_production_countries__movies_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_movies_tags__movies_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_movies_tags__movies_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_movies_tags__movies_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_movies_trailers__movies_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_movies_trailers__movies_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_movies_trailers__movies_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_seasons_casts__seasons_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_seasons_casts__seasons_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_seasons_casts__seasons_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_seasons_images__seasons_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_seasons_images__seasons_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_seasons_images__seasons_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_seasons_licenses__seasons_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_seasons_licenses__seasons_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_seasons_licenses__seasons_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_seasons_licenses_countries__seasons_licenses_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_seasons_licenses_countries__seasons_licenses_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_seasons_licenses_countries__seasons_licenses_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_seasons_production_countries__seasons_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_seasons_production_countries__seasons_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_seasons_production_countries__seasons_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_seasons_tags__seasons_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_seasons_tags__seasons_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_seasons_tags__seasons_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_seasons_trailers__seasons_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_seasons_trailers__seasons_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_seasons_trailers__seasons_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_seasons_tvshow_genres__seasons_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_seasons_tvshow_genres__seasons_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_seasons_tvshow_genres__seasons_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_tvshows_casts__tvshows_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_tvshows_casts__tvshows_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_tvshows_casts__tvshows_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_tvshows_images__tvshows_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_tvshows_images__tvshows_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_tvshows_images__tvshows_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_tvshows_licenses__tvshows_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_tvshows_licenses__tvshows_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_tvshows_licenses__tvshows_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_tvshows_licenses_countries__tvshows_licenses_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_tvshows_licenses_countries__tvshows_licenses_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_tvshows_licenses_countries__tvshows_licenses_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_tvshows_production_countries__tvshows_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_tvshows_production_countries__tvshows_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_tvshows_production_countries__tvshows_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_tvshows_tags__tvshows_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_tvshows_tags__tvshows_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_tvshows_tags__tvshows_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_tvshows_trailers__tvshows_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_tvshows_trailers__tvshows_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_tvshows_trailers__tvshows_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION tg_tvshows_tvshow_genres__tvshows_ts_propagation(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.tg_tvshows_tvshow_genres__tvshows_ts_propagation() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.tg_tvshows_tvshow_genres__tvshows_ts_propagation() TO media_service_gql_role;


--
-- Name: FUNCTION column_exists(columnname text, tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.column_exists(columnname text, tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION create_enum_table(enumname text, schemaname text, loginroleplaceholder text, enumvalues text, enumdesriptions text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.create_enum_table(enumname text, schemaname text, loginroleplaceholder text, enumvalues text, enumdesriptions text) FROM PUBLIC;


--
-- Name: FUNCTION create_messaging_counter_table(); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.create_messaging_counter_table() FROM PUBLIC;


--
-- Name: FUNCTION define_audit_date_fields_on_table(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_audit_date_fields_on_table(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION define_audit_user_fields_on_table(tablename text, schemaname text, defaultusername text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_audit_user_fields_on_table(tablename text, schemaname text, defaultusername text) FROM PUBLIC;


--
-- Name: FUNCTION define_authentication(readpermissions text, modifypermissions text, tablename text, schemaname text, additionalrls text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_authentication(readpermissions text, modifypermissions text, tablename text, schemaname text, additionalrls text) FROM PUBLIC;


--
-- Name: FUNCTION define_deferred_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_deferred_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text) FROM PUBLIC;


--
-- Name: FUNCTION define_end_user_authentication(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_end_user_authentication(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION define_index(fieldname text, tablename text, schemaname text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_index(fieldname text, tablename text, schemaname text, indexname text) FROM PUBLIC;


--
-- Name: FUNCTION define_indexes_with_id(fieldname text, tablename text, schemaname text, indexnameasc text, indexnamedesc text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_indexes_with_id(fieldname text, tablename text, schemaname text, indexnameasc text, indexnamedesc text) FROM PUBLIC;


--
-- Name: FUNCTION define_like_index(fieldname text, tablename text, schemaname text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_like_index(fieldname text, tablename text, schemaname text, indexname text) FROM PUBLIC;


--
-- Name: FUNCTION define_multiple_field_index(fieldnames text[], tablename text, schemaname text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_multiple_field_index(fieldnames text[], tablename text, schemaname text, indexname text) FROM PUBLIC;


--
-- Name: FUNCTION define_readonly_authentication(readpermissions text, tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_readonly_authentication(readpermissions text, tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION define_subscription_triggers(idcolumn text, tablename text, schemaname text, maintablename text, eventtype text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_subscription_triggers(idcolumn text, tablename text, schemaname text, maintablename text, eventtype text) FROM PUBLIC;


--
-- Name: FUNCTION define_tenant_environment_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_tenant_environment_trigger(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION define_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text) FROM PUBLIC;


--
-- Name: FUNCTION define_timestamps_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_timestamps_trigger(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION define_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text) FROM PUBLIC;


--
-- Name: FUNCTION define_unique_index(fieldname text, tablename text, schemaname text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_unique_index(fieldname text, tablename text, schemaname text, indexname text) FROM PUBLIC;


--
-- Name: FUNCTION define_user_id_on_table(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_user_id_on_table(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION define_user_id_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_user_id_trigger(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION define_users_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_users_trigger(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION drop_index(fieldname text, tablename text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_index(fieldname text, tablename text, indexname text) FROM PUBLIC;


--
-- Name: FUNCTION drop_indexes_with_id(fieldname text, tablename text, indexnameasc text, indexnamedesc text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_indexes_with_id(fieldname text, tablename text, indexnameasc text, indexnamedesc text) FROM PUBLIC;


--
-- Name: FUNCTION drop_like_index(fieldname text, tablename text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_like_index(fieldname text, tablename text, indexname text) FROM PUBLIC;


--
-- Name: FUNCTION drop_multiple_field_index(fieldnames text[], tablename text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_multiple_field_index(fieldnames text[], tablename text, indexname text) FROM PUBLIC;


--
-- Name: FUNCTION drop_tenant_environment_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_tenant_environment_trigger(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION drop_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text) FROM PUBLIC;


--
-- Name: FUNCTION drop_timestamps_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_timestamps_trigger(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION drop_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text) FROM PUBLIC;


--
-- Name: FUNCTION drop_user_id_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_user_id_trigger(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION drop_users_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_users_trigger(tablename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION live_suggestions_endpoint(propertyname text, typename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.live_suggestions_endpoint(propertyname text, typename text, schemaname text) FROM PUBLIC;


--
-- Name: FUNCTION pgmemento_create_table_audit(table_name text, schema_name text, audit_id_column_name text, log_old_data boolean, log_new_data boolean, log_state boolean); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.pgmemento_create_table_audit(table_name text, schema_name text, audit_id_column_name text, log_old_data boolean, log_new_data boolean, log_state boolean) FROM PUBLIC;


--
-- Name: FUNCTION pgmemento_delete_old_logs(age interval); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.pgmemento_delete_old_logs(age interval) FROM PUBLIC;


--
-- Name: FUNCTION set_enum_as_column_type(columnname text, tablename text, schemaname text, enumname text, enumschemaname text, defaultenumvalue text, notnulloptions text, constraintname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.set_enum_as_column_type(columnname text, tablename text, schemaname text, enumname text, enumschemaname text, defaultenumvalue text, notnulloptions text, constraintname text) FROM PUBLIC;


--
-- Name: FUNCTION set_enum_domain(columnname text, tablename text, schemaname text, enumname text, enumschemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.set_enum_domain(columnname text, tablename text, schemaname text, enumname text, enumschemaname text) FROM PUBLIC;


--
-- Name: FUNCTION constraint_has_allowed_value(input_value text, allowed_values text[], error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_has_allowed_value(input_value text, allowed_values text[], error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_has_allowed_value(input_value text, allowed_values text[], error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_is_base64(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_base64(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_base64(input_value text, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_is_identifier_key(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_identifier_key(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_identifier_key(input_value text, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_is_trimmed(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_trimmed(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_trimmed(input_value text, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_is_url(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_url(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_url(input_value text, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_matches_pattern(input_value text, pattern text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_matches_pattern(input_value text, pattern text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_matches_pattern(input_value text, pattern text, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_max_length(input_value text, max_length integer, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_max_length(input_value text, max_length integer, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_max_length(input_value text, max_length integer, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_max_value(input_value numeric, max_value numeric, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_max_value(input_value numeric, max_value numeric, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_max_value(input_value numeric, max_value numeric, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_min_length(input_value text, min_length integer, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_min_length(input_value text, min_length integer, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_min_length(input_value text, min_length integer, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_min_value(input_value numeric, min_value numeric, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_min_value(input_value numeric, min_value numeric, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_min_value(input_value numeric, min_value numeric, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_not_default_uuid(input_value uuid, default_uuid uuid, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_not_default_uuid(input_value uuid, default_uuid uuid, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_not_default_uuid(input_value uuid, default_uuid uuid, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_not_empty(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_not_empty(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_not_empty(input_value text, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_not_empty_array(input_value text[], error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_not_empty_array(input_value text[], error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_not_empty_array(input_value text[], error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION constraint_starts_with(input_value text, prefix_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_starts_with(input_value text, prefix_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_starts_with(input_value text, prefix_value text, error_message text, error_code text) TO media_service_gql_role;


--
-- Name: FUNCTION current_environment_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.current_environment_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.current_environment_id() TO media_service_gql_role;


--
-- Name: FUNCTION current_tenant_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.current_tenant_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.current_tenant_id() TO media_service_gql_role;


--
-- Name: FUNCTION current_user_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.current_user_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.current_user_id() TO media_service_gql_role;


--
-- Name: FUNCTION raise_error(error_message text, error_code text, VARIADIC placeholder_values text[]); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.raise_error(error_message text, error_code text, VARIADIC placeholder_values text[]) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.raise_error(error_message text, error_code text, VARIADIC placeholder_values text[]) TO media_service_gql_role;


--
-- Name: FUNCTION tg__graphql_subscription(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__graphql_subscription() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__graphql_subscription() TO media_service_gql_role;


--
-- Name: FUNCTION tg__tenant_environment(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__tenant_environment() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__tenant_environment() TO media_service_gql_role;


--
-- Name: FUNCTION tg__tenant_environment_on_delete(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__tenant_environment_on_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__tenant_environment_on_delete() TO media_service_gql_role;


--
-- Name: FUNCTION tg__timestamps(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__timestamps() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__timestamps() TO media_service_gql_role;


--
-- Name: FUNCTION tg__user_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__user_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__user_id() TO media_service_gql_role;


--
-- Name: FUNCTION tg__username(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__username() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__username() TO media_service_gql_role;


--
-- Name: FUNCTION user_has_permission(required_permissions text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_permission(required_permissions text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_permission(required_permissions text) TO media_service_gql_role;


--
-- Name: FUNCTION user_has_permission_and_tag(required_permissions text, fieldvalue text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_permission_and_tag(required_permissions text, fieldvalue text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_permission_and_tag(required_permissions text, fieldvalue text) TO media_service_gql_role;


--
-- Name: FUNCTION user_has_setting(required_settings text, local_variable_field text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_setting(required_settings text, local_variable_field text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_setting(required_settings text, local_variable_field text) TO media_service_gql_role;


--
-- Name: FUNCTION user_has_tag(required_permissions text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_tag(required_permissions text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_tag(required_permissions text) TO media_service_gql_role;


--
-- Name: FUNCTION validate_identifier_length(identifier text, hint text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validate_identifier_length(identifier text, hint text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validate_identifier_length(identifier text, hint text) TO media_service_gql_role;


--
-- Name: FUNCTION validation_is_base64(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_base64(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_base64(input_value text) TO media_service_gql_role;


--
-- Name: FUNCTION validation_is_identifier_key(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_identifier_key(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_identifier_key(input_value text) TO media_service_gql_role;


--
-- Name: FUNCTION validation_is_optional_url(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_optional_url(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_optional_url(input_value text) TO media_service_gql_role;


--
-- Name: FUNCTION validation_is_trimmed(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_trimmed(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_trimmed(input_value text) TO media_service_gql_role;


--
-- Name: FUNCTION validation_is_url(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_url(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_url(input_value text) TO media_service_gql_role;


--
-- Name: FUNCTION validation_not_empty(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_not_empty(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_not_empty(input_value text) TO media_service_gql_role;


--
-- Name: FUNCTION validation_not_empty_array(input_value text[]); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_not_empty_array(input_value text[]) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_not_empty_array(input_value text[]) TO media_service_gql_role;


--
-- Name: FUNCTION validation_starts_with(input_value text, prefix_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_starts_with(input_value text, prefix_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_starts_with(input_value text, prefix_value text) TO media_service_gql_role;


--
-- Name: FUNCTION validation_valid_url_array(input_value text[]); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_valid_url_array(input_value text[]) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_valid_url_array(input_value text[]) TO media_service_gql_role;


--
-- Name: TABLE collection_image_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.collection_image_type TO media_service_login;


--
-- Name: TABLE collection_relations; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.collection_relations TO media_service_gql_role;


--
-- Name: COLUMN collection_relations.collection_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(collection_id) ON TABLE app_public.collection_relations TO media_service_gql_role;


--
-- Name: COLUMN collection_relations.sort_order; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(sort_order) ON TABLE app_public.collection_relations TO media_service_gql_role;


--
-- Name: COLUMN collection_relations.movie_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(movie_id) ON TABLE app_public.collection_relations TO media_service_gql_role;


--
-- Name: COLUMN collection_relations.tvshow_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(tvshow_id) ON TABLE app_public.collection_relations TO media_service_gql_role;


--
-- Name: COLUMN collection_relations.season_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(season_id) ON TABLE app_public.collection_relations TO media_service_gql_role;


--
-- Name: COLUMN collection_relations.episode_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(episode_id) ON TABLE app_public.collection_relations TO media_service_gql_role;


--
-- Name: SEQUENCE collection_relations_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.collection_relations_id_seq TO media_service_gql_role;


--
-- Name: TABLE collections; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.collections TO media_service_gql_role;


--
-- Name: COLUMN collections.title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(title),UPDATE(title) ON TABLE app_public.collections TO media_service_gql_role;


--
-- Name: COLUMN collections.external_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(external_id),UPDATE(external_id) ON TABLE app_public.collections TO media_service_gql_role;


--
-- Name: COLUMN collections.synopsis; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(synopsis),UPDATE(synopsis) ON TABLE app_public.collections TO media_service_gql_role;


--
-- Name: COLUMN collections.description; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(description),UPDATE(description) ON TABLE app_public.collections TO media_service_gql_role;


--
-- Name: SEQUENCE collections_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.collections_id_seq TO media_service_gql_role;


--
-- Name: TABLE collections_images; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.collections_images TO media_service_gql_role;


--
-- Name: TABLE collections_snapshots; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.collections_snapshots TO media_service_gql_role;


--
-- Name: TABLE collections_tags; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.collections_tags TO media_service_gql_role;


--
-- Name: COLUMN collections_tags.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.collections_tags TO media_service_gql_role;


--
-- Name: TABLE entity_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.entity_type TO media_service_login;


--
-- Name: TABLE episode_image_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.episode_image_type TO media_service_login;


--
-- Name: TABLE episodes; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.season_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(season_id),UPDATE(season_id) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.index; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(index),UPDATE(index) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(title),UPDATE(title) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.external_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(external_id),UPDATE(external_id) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.original_title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(original_title),UPDATE(original_title) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.synopsis; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(synopsis),UPDATE(synopsis) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.description; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(description),UPDATE(description) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.studio; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(studio),UPDATE(studio) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.released; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(released),UPDATE(released) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.main_video_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(main_video_id),UPDATE(main_video_id) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: COLUMN episodes.ingest_correlation_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(ingest_correlation_id) ON TABLE app_public.episodes TO media_service_gql_role;


--
-- Name: TABLE episodes_casts; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.episodes_casts TO media_service_gql_role;


--
-- Name: COLUMN episodes_casts.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.episodes_casts TO media_service_gql_role;


--
-- Name: SEQUENCE episodes_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.episodes_id_seq TO media_service_gql_role;


--
-- Name: TABLE episodes_images; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.episodes_images TO media_service_gql_role;


--
-- Name: TABLE episodes_licenses; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.episodes_licenses TO media_service_gql_role;


--
-- Name: COLUMN episodes_licenses.episode_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(episode_id),UPDATE(episode_id) ON TABLE app_public.episodes_licenses TO media_service_gql_role;


--
-- Name: COLUMN episodes_licenses.license_start; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(license_start),UPDATE(license_start) ON TABLE app_public.episodes_licenses TO media_service_gql_role;


--
-- Name: COLUMN episodes_licenses.license_end; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(license_end),UPDATE(license_end) ON TABLE app_public.episodes_licenses TO media_service_gql_role;


--
-- Name: TABLE episodes_licenses_countries; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.episodes_licenses_countries TO media_service_gql_role;


--
-- Name: COLUMN episodes_licenses_countries.code; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(code) ON TABLE app_public.episodes_licenses_countries TO media_service_gql_role;


--
-- Name: SEQUENCE episodes_licenses_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.episodes_licenses_id_seq TO media_service_gql_role;


--
-- Name: TABLE episodes_production_countries; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.episodes_production_countries TO media_service_gql_role;


--
-- Name: COLUMN episodes_production_countries.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.episodes_production_countries TO media_service_gql_role;


--
-- Name: TABLE episodes_snapshots; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.episodes_snapshots TO media_service_gql_role;


--
-- Name: TABLE episodes_tags; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.episodes_tags TO media_service_gql_role;


--
-- Name: COLUMN episodes_tags.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.episodes_tags TO media_service_gql_role;


--
-- Name: TABLE episodes_trailers; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.episodes_trailers TO media_service_gql_role;


--
-- Name: TABLE episodes_tvshow_genres; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.episodes_tvshow_genres TO media_service_gql_role;


--
-- Name: TABLE ingest_documents; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: COLUMN ingest_documents.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(name) ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: COLUMN ingest_documents.document_created; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(document_created) ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: COLUMN ingest_documents.document; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(document) ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: COLUMN ingest_documents.title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(title),UPDATE(title) ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: COLUMN ingest_documents.items_count; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(items_count) ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: COLUMN ingest_documents.error_count; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(error_count) ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: COLUMN ingest_documents.success_count; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(success_count) ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: COLUMN ingest_documents.in_progress_count; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(in_progress_count),UPDATE(in_progress_count) ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: COLUMN ingest_documents.errors; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(errors) ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: COLUMN ingest_documents.status; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(status),UPDATE(status) ON TABLE app_public.ingest_documents TO media_service_gql_role;


--
-- Name: SEQUENCE ingest_documents_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.ingest_documents_id_seq TO media_service_gql_role;


--
-- Name: TABLE ingest_entity_exists_status; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.ingest_entity_exists_status TO media_service_login;


--
-- Name: TABLE ingest_item_status; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.ingest_item_status TO media_service_login;


--
-- Name: TABLE ingest_item_step_status; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.ingest_item_step_status TO media_service_login;


--
-- Name: TABLE ingest_item_step_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.ingest_item_step_type TO media_service_login;


--
-- Name: TABLE ingest_item_steps; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.ingest_item_steps TO media_service_gql_role;


--
-- Name: COLUMN ingest_item_steps.id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(id) ON TABLE app_public.ingest_item_steps TO media_service_gql_role;


--
-- Name: COLUMN ingest_item_steps.ingest_item_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(ingest_item_id) ON TABLE app_public.ingest_item_steps TO media_service_gql_role;


--
-- Name: COLUMN ingest_item_steps.sub_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(sub_type) ON TABLE app_public.ingest_item_steps TO media_service_gql_role;


--
-- Name: COLUMN ingest_item_steps.response_message; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(response_message) ON TABLE app_public.ingest_item_steps TO media_service_gql_role;


--
-- Name: COLUMN ingest_item_steps.type; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(type) ON TABLE app_public.ingest_item_steps TO media_service_gql_role;


--
-- Name: COLUMN ingest_item_steps.status; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(status),UPDATE(status) ON TABLE app_public.ingest_item_steps TO media_service_gql_role;


--
-- Name: COLUMN ingest_item_steps.entity_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(entity_id),UPDATE(entity_id) ON TABLE app_public.ingest_item_steps TO media_service_gql_role;


--
-- Name: TABLE ingest_item_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.ingest_item_type TO media_service_login;


--
-- Name: TABLE ingest_items; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: COLUMN ingest_items.ingest_document_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(ingest_document_id) ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: COLUMN ingest_items.external_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(external_id) ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: COLUMN ingest_items.entity_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(entity_id) ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: COLUMN ingest_items.item; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(item) ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: COLUMN ingest_items.display_title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(display_title) ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: COLUMN ingest_items.processed_trailer_ids; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(processed_trailer_ids) ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: COLUMN ingest_items.errors; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(errors) ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: COLUMN ingest_items.status; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(status) ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: COLUMN ingest_items.exists_status; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(exists_status) ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: COLUMN ingest_items.type; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(type) ON TABLE app_public.ingest_items TO media_service_gql_role;


--
-- Name: SEQUENCE ingest_items_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.ingest_items_id_seq TO media_service_gql_role;


--
-- Name: TABLE ingest_status; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.ingest_status TO media_service_login;


--
-- Name: TABLE iso_alpha_two_country_codes; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.iso_alpha_two_country_codes TO media_service_login;


--
-- Name: TABLE movie_genres; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.movie_genres TO media_service_gql_role;


--
-- Name: COLUMN movie_genres.title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(title),UPDATE(title) ON TABLE app_public.movie_genres TO media_service_gql_role;


--
-- Name: COLUMN movie_genres.sort_order; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(sort_order),UPDATE(sort_order) ON TABLE app_public.movie_genres TO media_service_gql_role;


--
-- Name: SEQUENCE movie_genres_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.movie_genres_id_seq TO media_service_gql_role;


--
-- Name: TABLE movie_image_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.movie_image_type TO media_service_login;


--
-- Name: TABLE movies; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.movies TO media_service_gql_role;


--
-- Name: COLUMN movies.title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(title),UPDATE(title) ON TABLE app_public.movies TO media_service_gql_role;


--
-- Name: COLUMN movies.external_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(external_id),UPDATE(external_id) ON TABLE app_public.movies TO media_service_gql_role;


--
-- Name: COLUMN movies.original_title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(original_title),UPDATE(original_title) ON TABLE app_public.movies TO media_service_gql_role;


--
-- Name: COLUMN movies.synopsis; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(synopsis),UPDATE(synopsis) ON TABLE app_public.movies TO media_service_gql_role;


--
-- Name: COLUMN movies.description; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(description),UPDATE(description) ON TABLE app_public.movies TO media_service_gql_role;


--
-- Name: COLUMN movies.studio; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(studio),UPDATE(studio) ON TABLE app_public.movies TO media_service_gql_role;


--
-- Name: COLUMN movies.released; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(released),UPDATE(released) ON TABLE app_public.movies TO media_service_gql_role;


--
-- Name: COLUMN movies.main_video_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(main_video_id),UPDATE(main_video_id) ON TABLE app_public.movies TO media_service_gql_role;


--
-- Name: COLUMN movies.ingest_correlation_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(ingest_correlation_id) ON TABLE app_public.movies TO media_service_gql_role;


--
-- Name: TABLE movies_casts; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.movies_casts TO media_service_gql_role;


--
-- Name: COLUMN movies_casts.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.movies_casts TO media_service_gql_role;


--
-- Name: SEQUENCE movies_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.movies_id_seq TO media_service_gql_role;


--
-- Name: TABLE movies_images; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.movies_images TO media_service_gql_role;


--
-- Name: TABLE movies_licenses; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.movies_licenses TO media_service_gql_role;


--
-- Name: COLUMN movies_licenses.movie_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(movie_id),UPDATE(movie_id) ON TABLE app_public.movies_licenses TO media_service_gql_role;


--
-- Name: COLUMN movies_licenses.license_start; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(license_start),UPDATE(license_start) ON TABLE app_public.movies_licenses TO media_service_gql_role;


--
-- Name: COLUMN movies_licenses.license_end; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(license_end),UPDATE(license_end) ON TABLE app_public.movies_licenses TO media_service_gql_role;


--
-- Name: TABLE movies_licenses_countries; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.movies_licenses_countries TO media_service_gql_role;


--
-- Name: COLUMN movies_licenses_countries.code; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(code) ON TABLE app_public.movies_licenses_countries TO media_service_gql_role;


--
-- Name: SEQUENCE movies_licenses_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.movies_licenses_id_seq TO media_service_gql_role;


--
-- Name: TABLE movies_movie_genres; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.movies_movie_genres TO media_service_gql_role;


--
-- Name: TABLE movies_production_countries; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.movies_production_countries TO media_service_gql_role;


--
-- Name: COLUMN movies_production_countries.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.movies_production_countries TO media_service_gql_role;


--
-- Name: TABLE movies_snapshots; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.movies_snapshots TO media_service_gql_role;


--
-- Name: TABLE movies_tags; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.movies_tags TO media_service_gql_role;


--
-- Name: COLUMN movies_tags.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.movies_tags TO media_service_gql_role;


--
-- Name: TABLE movies_trailers; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.movies_trailers TO media_service_gql_role;


--
-- Name: TABLE publish_status; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.publish_status TO media_service_login;


--
-- Name: TABLE season_image_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.season_image_type TO media_service_login;


--
-- Name: TABLE seasons; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.seasons TO media_service_gql_role;


--
-- Name: COLUMN seasons.tvshow_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(tvshow_id),UPDATE(tvshow_id) ON TABLE app_public.seasons TO media_service_gql_role;


--
-- Name: COLUMN seasons.index; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(index),UPDATE(index) ON TABLE app_public.seasons TO media_service_gql_role;


--
-- Name: COLUMN seasons.external_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(external_id),UPDATE(external_id) ON TABLE app_public.seasons TO media_service_gql_role;


--
-- Name: COLUMN seasons.synopsis; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(synopsis),UPDATE(synopsis) ON TABLE app_public.seasons TO media_service_gql_role;


--
-- Name: COLUMN seasons.description; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(description),UPDATE(description) ON TABLE app_public.seasons TO media_service_gql_role;


--
-- Name: COLUMN seasons.studio; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(studio),UPDATE(studio) ON TABLE app_public.seasons TO media_service_gql_role;


--
-- Name: COLUMN seasons.released; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(released),UPDATE(released) ON TABLE app_public.seasons TO media_service_gql_role;


--
-- Name: COLUMN seasons.ingest_correlation_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(ingest_correlation_id) ON TABLE app_public.seasons TO media_service_gql_role;


--
-- Name: TABLE seasons_casts; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.seasons_casts TO media_service_gql_role;


--
-- Name: COLUMN seasons_casts.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.seasons_casts TO media_service_gql_role;


--
-- Name: SEQUENCE seasons_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.seasons_id_seq TO media_service_gql_role;


--
-- Name: TABLE seasons_images; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.seasons_images TO media_service_gql_role;


--
-- Name: TABLE seasons_licenses; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.seasons_licenses TO media_service_gql_role;


--
-- Name: COLUMN seasons_licenses.season_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(season_id),UPDATE(season_id) ON TABLE app_public.seasons_licenses TO media_service_gql_role;


--
-- Name: COLUMN seasons_licenses.license_start; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(license_start),UPDATE(license_start) ON TABLE app_public.seasons_licenses TO media_service_gql_role;


--
-- Name: COLUMN seasons_licenses.license_end; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(license_end),UPDATE(license_end) ON TABLE app_public.seasons_licenses TO media_service_gql_role;


--
-- Name: TABLE seasons_licenses_countries; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.seasons_licenses_countries TO media_service_gql_role;


--
-- Name: COLUMN seasons_licenses_countries.code; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(code) ON TABLE app_public.seasons_licenses_countries TO media_service_gql_role;


--
-- Name: SEQUENCE seasons_licenses_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.seasons_licenses_id_seq TO media_service_gql_role;


--
-- Name: TABLE seasons_production_countries; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.seasons_production_countries TO media_service_gql_role;


--
-- Name: COLUMN seasons_production_countries.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.seasons_production_countries TO media_service_gql_role;


--
-- Name: TABLE seasons_snapshots; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.seasons_snapshots TO media_service_gql_role;


--
-- Name: TABLE seasons_tags; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.seasons_tags TO media_service_gql_role;


--
-- Name: COLUMN seasons_tags.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.seasons_tags TO media_service_gql_role;


--
-- Name: TABLE seasons_trailers; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.seasons_trailers TO media_service_gql_role;


--
-- Name: TABLE seasons_tvshow_genres; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.seasons_tvshow_genres TO media_service_gql_role;


--
-- Name: TABLE snapshot_state; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.snapshot_state TO media_service_login;


--
-- Name: TABLE snapshot_validation_issue_context; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.snapshot_validation_issue_context TO media_service_login;


--
-- Name: TABLE snapshot_validation_issue_severity; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.snapshot_validation_issue_severity TO media_service_login;


--
-- Name: TABLE snapshot_validation_results; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.snapshot_validation_results TO media_service_gql_role;


--
-- Name: COLUMN snapshot_validation_results.snapshot_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(snapshot_id) ON TABLE app_public.snapshot_validation_results TO media_service_gql_role;


--
-- Name: COLUMN snapshot_validation_results.severity; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(severity) ON TABLE app_public.snapshot_validation_results TO media_service_gql_role;


--
-- Name: COLUMN snapshot_validation_results.context; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(context) ON TABLE app_public.snapshot_validation_results TO media_service_gql_role;


--
-- Name: COLUMN snapshot_validation_results.message; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(message) ON TABLE app_public.snapshot_validation_results TO media_service_gql_role;


--
-- Name: COLUMN snapshot_validation_results.entity_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(entity_type) ON TABLE app_public.snapshot_validation_results TO media_service_gql_role;


--
-- Name: SEQUENCE snapshot_validation_results_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.snapshot_validation_results_id_seq TO media_service_gql_role;


--
-- Name: TABLE snapshot_validation_status; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.snapshot_validation_status TO media_service_login;


--
-- Name: TABLE snapshots; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.entity_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(entity_id) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.publish_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(publish_id) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.job_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(job_id) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.snapshot_no; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(snapshot_no) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.entity_title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(entity_title),UPDATE(entity_title) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.entity_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(entity_type) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.validation_status; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(validation_status) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.snapshot_json; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(snapshot_json) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.snapshot_state; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(snapshot_state) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.scheduled_date; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(scheduled_date) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.published_date; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(published_date) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.unpublished_date; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(unpublished_date) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: COLUMN snapshots.is_list_snapshot; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(is_list_snapshot),UPDATE(is_list_snapshot) ON TABLE app_public.snapshots TO media_service_gql_role;


--
-- Name: SEQUENCE snapshots_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.snapshots_id_seq TO media_service_gql_role;


--
-- Name: TABLE tvshow_genres; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.tvshow_genres TO media_service_gql_role;


--
-- Name: COLUMN tvshow_genres.title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(title),UPDATE(title) ON TABLE app_public.tvshow_genres TO media_service_gql_role;


--
-- Name: COLUMN tvshow_genres.sort_order; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(sort_order),UPDATE(sort_order) ON TABLE app_public.tvshow_genres TO media_service_gql_role;


--
-- Name: SEQUENCE tvshow_genres_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.tvshow_genres_id_seq TO media_service_gql_role;


--
-- Name: TABLE tvshow_image_type; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT ON TABLE app_public.tvshow_image_type TO media_service_login;


--
-- Name: TABLE tvshows; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.tvshows TO media_service_gql_role;


--
-- Name: COLUMN tvshows.title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(title),UPDATE(title) ON TABLE app_public.tvshows TO media_service_gql_role;


--
-- Name: COLUMN tvshows.external_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(external_id),UPDATE(external_id) ON TABLE app_public.tvshows TO media_service_gql_role;


--
-- Name: COLUMN tvshows.original_title; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(original_title),UPDATE(original_title) ON TABLE app_public.tvshows TO media_service_gql_role;


--
-- Name: COLUMN tvshows.synopsis; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(synopsis),UPDATE(synopsis) ON TABLE app_public.tvshows TO media_service_gql_role;


--
-- Name: COLUMN tvshows.description; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(description),UPDATE(description) ON TABLE app_public.tvshows TO media_service_gql_role;


--
-- Name: COLUMN tvshows.studio; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(studio),UPDATE(studio) ON TABLE app_public.tvshows TO media_service_gql_role;


--
-- Name: COLUMN tvshows.released; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(released),UPDATE(released) ON TABLE app_public.tvshows TO media_service_gql_role;


--
-- Name: COLUMN tvshows.ingest_correlation_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(ingest_correlation_id) ON TABLE app_public.tvshows TO media_service_gql_role;


--
-- Name: TABLE tvshows_casts; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.tvshows_casts TO media_service_gql_role;


--
-- Name: COLUMN tvshows_casts.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.tvshows_casts TO media_service_gql_role;


--
-- Name: SEQUENCE tvshows_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.tvshows_id_seq TO media_service_gql_role;


--
-- Name: TABLE tvshows_images; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE app_public.tvshows_images TO media_service_gql_role;


--
-- Name: TABLE tvshows_licenses; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,DELETE ON TABLE app_public.tvshows_licenses TO media_service_gql_role;


--
-- Name: COLUMN tvshows_licenses.tvshow_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(tvshow_id),UPDATE(tvshow_id) ON TABLE app_public.tvshows_licenses TO media_service_gql_role;


--
-- Name: COLUMN tvshows_licenses.license_start; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(license_start),UPDATE(license_start) ON TABLE app_public.tvshows_licenses TO media_service_gql_role;


--
-- Name: COLUMN tvshows_licenses.license_end; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(license_end),UPDATE(license_end) ON TABLE app_public.tvshows_licenses TO media_service_gql_role;


--
-- Name: TABLE tvshows_licenses_countries; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.tvshows_licenses_countries TO media_service_gql_role;


--
-- Name: COLUMN tvshows_licenses_countries.code; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(code) ON TABLE app_public.tvshows_licenses_countries TO media_service_gql_role;


--
-- Name: SEQUENCE tvshows_licenses_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.tvshows_licenses_id_seq TO media_service_gql_role;


--
-- Name: TABLE tvshows_production_countries; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.tvshows_production_countries TO media_service_gql_role;


--
-- Name: COLUMN tvshows_production_countries.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.tvshows_production_countries TO media_service_gql_role;


--
-- Name: TABLE tvshows_snapshots; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.tvshows_snapshots TO media_service_gql_role;


--
-- Name: TABLE tvshows_tags; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.tvshows_tags TO media_service_gql_role;


--
-- Name: COLUMN tvshows_tags.name; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(name) ON TABLE app_public.tvshows_tags TO media_service_gql_role;


--
-- Name: TABLE tvshows_trailers; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.tvshows_trailers TO media_service_gql_role;


--
-- Name: TABLE tvshows_tvshow_genres; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_public.tvshows_tvshow_genres TO media_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA app_hidden REVOKE ALL ON SEQUENCES  FROM media_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA app_hidden GRANT SELECT,USAGE ON SEQUENCES  TO media_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA app_hidden REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA app_hidden REVOKE ALL ON FUNCTIONS  FROM media_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA app_hidden GRANT ALL ON FUNCTIONS  TO media_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA app_public REVOKE ALL ON SEQUENCES  FROM media_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA app_public GRANT SELECT,USAGE ON SEQUENCES  TO media_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA app_public REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA app_public REVOKE ALL ON FUNCTIONS  FROM media_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA app_public GRANT ALL ON FUNCTIONS  TO media_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: ax_utils; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA ax_utils REVOKE ALL ON SEQUENCES  FROM media_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA ax_utils GRANT SELECT,USAGE ON SEQUENCES  TO media_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: ax_utils; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA ax_utils REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA ax_utils REVOKE ALL ON FUNCTIONS  FROM media_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA ax_utils GRANT ALL ON FUNCTIONS  TO media_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA public REVOKE ALL ON SEQUENCES  FROM media_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES  TO media_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM media_service_owner;
ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner IN SCHEMA public GRANT ALL ON FUNCTIONS  TO media_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE media_service_owner REVOKE ALL ON FUNCTIONS  FROM PUBLIC;


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE PROCEDURE postgraphile_watch.notify_watchers_ddl();


--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE PROCEDURE postgraphile_watch.notify_watchers_drop();


--
-- PostgreSQL database dump complete
--

