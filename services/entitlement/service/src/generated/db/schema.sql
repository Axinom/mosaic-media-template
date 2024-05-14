--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

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


SET default_tablespace = '';

SET default_table_access_method = heap;

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
BEGIN
  EXECUTE 'DROP TRIGGER IF EXISTS _500_gql_' || tableName || '_inserted ON ' || schemaName || '.' || tableName;
  EXECUTE 'CREATE TRIGGER _500_gql_' || tableName || '_inserted after insert on ' || schemaName || '.' || tableName || ' ' ||
          'for each row execute procedure ax_utils.tg__graphql_subscription(''' || eventType || 'Created'',''graphql:' || mainTableName || ''',''' || idColumn || ''');';

  EXECUTE 'DROP TRIGGER IF EXISTS _500_gql_' || tableName || '_updated ON ' || schemaName || '.' || tableName;
  EXECUTE 'CREATE TRIGGER _500_gql_' || tableName || '_updated after update on ' || schemaName || '.' || tableName || ' ' ||
          'for each row execute procedure ax_utils.tg__graphql_subscription(''' || eventType || 'Changed'',''graphql:' || mainTableName || ''',''' || idColumn || ''');';

  EXECUTE 'DROP TRIGGER IF EXISTS _500_gql_' || tableName || '_deleted ON ' || schemaName || '.' || tableName;
  EXECUTE 'CREATE TRIGGER _500_gql_' || tableName || '_deleted before delete on ' || schemaName || '.' || tableName || ' ' ||
          'for each row execute procedure ax_utils.tg__graphql_subscription(''' || eventType || 'Deleted'',''graphql:' || mainTableName || ''',''' || idColumn || ''');';
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
-- Name: claim_sets; Type: TABLE; Schema: app_hidden; Owner: -
--

CREATE TABLE app_hidden.claim_sets (
    key text NOT NULL,
    title text NOT NULL,
    description text,
    claims text[] DEFAULT '{}'::text[] NOT NULL,
    created_date timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    updated_date timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL
);


--
-- Name: subscription_plans; Type: TABLE; Schema: app_hidden; Owner: -
--

CREATE TABLE app_hidden.subscription_plans (
    id uuid NOT NULL,
    title text NOT NULL,
    description text,
    claim_set_keys text[] DEFAULT '{}'::text[] NOT NULL,
    created_date timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    updated_date timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    created_user text DEFAULT 'Unknown'::text NOT NULL,
    updated_user text DEFAULT 'Unknown'::text NOT NULL
);


--
-- Name: messaging_counter; Type: TABLE; Schema: app_private; Owner: -
--

CREATE TABLE app_private.messaging_counter (
    key text NOT NULL,
    counter integer DEFAULT 1,
    expiration_date timestamp with time zone DEFAULT ((now() + '1 day'::interval) AT TIME ZONE 'utc'::text) NOT NULL
);


--
-- Name: claim_sets claim_sets_pkey; Type: CONSTRAINT; Schema: app_hidden; Owner: -
--

ALTER TABLE ONLY app_hidden.claim_sets
    ADD CONSTRAINT claim_sets_pkey PRIMARY KEY (key);


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
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: app_hidden; Owner: -
--

ALTER TABLE ONLY app_hidden.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: messaging_counter messaging_counter_pkey; Type: CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.messaging_counter
    ADD CONSTRAINT messaging_counter_pkey PRIMARY KEY (key);


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
-- Name: idx_subscription_plans_claim_set_keys; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE INDEX idx_subscription_plans_claim_set_keys ON app_hidden.subscription_plans USING btree (claim_set_keys);


--
-- Name: claim_sets _100_timestamps; Type: TRIGGER; Schema: app_hidden; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_hidden.claim_sets FOR EACH ROW EXECUTE FUNCTION ax_utils.tg__timestamps();


--
-- Name: subscription_plans _100_timestamps; Type: TRIGGER; Schema: app_hidden; Owner: -
--

CREATE TRIGGER _100_timestamps BEFORE UPDATE ON app_hidden.subscription_plans FOR EACH ROW EXECUTE FUNCTION ax_utils.tg__timestamps();


--
-- Name: claim_sets _200_username; Type: TRIGGER; Schema: app_hidden; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_hidden.claim_sets FOR EACH ROW EXECUTE FUNCTION ax_utils.tg__username();


--
-- Name: subscription_plans _200_username; Type: TRIGGER; Schema: app_hidden; Owner: -
--

CREATE TRIGGER _200_username BEFORE INSERT OR UPDATE ON app_hidden.subscription_plans FOR EACH ROW EXECUTE FUNCTION ax_utils.tg__username();


--
-- Name: SCHEMA app_hidden; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_hidden TO entitlement_service_gql_role;


--
-- Name: SCHEMA app_public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_public TO entitlement_service_gql_role;
GRANT USAGE ON SCHEMA app_public TO entitlement_service_login;


--
-- Name: SCHEMA ax_define; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA ax_define TO entitlement_service_gql_role;


--
-- Name: SCHEMA ax_utils; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA ax_utils TO entitlement_service_gql_role;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA public TO entitlement_service_gql_role;


--
-- Name: TABLE inbox; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_hidden.inbox TO entitlement_service_gql_role;


--
-- Name: COLUMN inbox.locked_until; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(locked_until) ON TABLE app_hidden.inbox TO entitlement_service_gql_role;


--
-- Name: COLUMN inbox.processed_at; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(processed_at) ON TABLE app_hidden.inbox TO entitlement_service_gql_role;


--
-- Name: COLUMN inbox.abandoned_at; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(abandoned_at) ON TABLE app_hidden.inbox TO entitlement_service_gql_role;


--
-- Name: COLUMN inbox.started_attempts; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(started_attempts) ON TABLE app_hidden.inbox TO entitlement_service_gql_role;


--
-- Name: COLUMN inbox.finished_attempts; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(finished_attempts) ON TABLE app_hidden.inbox TO entitlement_service_gql_role;


--
-- Name: FUNCTION next_inbox_messages(max_size integer, lock_ms integer); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.next_inbox_messages(max_size integer, lock_ms integer) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.next_inbox_messages(max_size integer, lock_ms integer) TO entitlement_service_gql_role;


--
-- Name: TABLE outbox; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT SELECT,INSERT,DELETE ON TABLE app_hidden.outbox TO entitlement_service_gql_role;


--
-- Name: COLUMN outbox.locked_until; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(locked_until) ON TABLE app_hidden.outbox TO entitlement_service_gql_role;


--
-- Name: COLUMN outbox.processed_at; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(processed_at) ON TABLE app_hidden.outbox TO entitlement_service_gql_role;


--
-- Name: COLUMN outbox.abandoned_at; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(abandoned_at) ON TABLE app_hidden.outbox TO entitlement_service_gql_role;


--
-- Name: COLUMN outbox.started_attempts; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(started_attempts) ON TABLE app_hidden.outbox TO entitlement_service_gql_role;


--
-- Name: COLUMN outbox.finished_attempts; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT UPDATE(finished_attempts) ON TABLE app_hidden.outbox TO entitlement_service_gql_role;


--
-- Name: FUNCTION next_outbox_messages(max_size integer, lock_ms integer); Type: ACL; Schema: app_hidden; Owner: -
--

REVOKE ALL ON FUNCTION app_hidden.next_outbox_messages(max_size integer, lock_ms integer) FROM PUBLIC;
GRANT ALL ON FUNCTION app_hidden.next_outbox_messages(max_size integer, lock_ms integer) TO entitlement_service_gql_role;


--
-- Name: FUNCTION column_exists(columnname text, tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.column_exists(columnname text, tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.column_exists(columnname text, tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION create_enum_table(enumname text, schemaname text, loginroleplaceholder text, enumvalues text, enumdesriptions text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.create_enum_table(enumname text, schemaname text, loginroleplaceholder text, enumvalues text, enumdesriptions text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.create_enum_table(enumname text, schemaname text, loginroleplaceholder text, enumvalues text, enumdesriptions text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION create_messaging_counter_table(); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.create_messaging_counter_table() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.create_messaging_counter_table() TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_audit_date_fields_on_table(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_audit_date_fields_on_table(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_audit_date_fields_on_table(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_audit_user_fields_on_table(tablename text, schemaname text, defaultusername text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_audit_user_fields_on_table(tablename text, schemaname text, defaultusername text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_audit_user_fields_on_table(tablename text, schemaname text, defaultusername text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_authentication(readpermissions text, modifypermissions text, tablename text, schemaname text, additionalrls text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_authentication(readpermissions text, modifypermissions text, tablename text, schemaname text, additionalrls text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_authentication(readpermissions text, modifypermissions text, tablename text, schemaname text, additionalrls text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_deferred_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_deferred_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_deferred_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_end_user_authentication(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_end_user_authentication(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_end_user_authentication(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_index(fieldname text, tablename text, schemaname text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_index(fieldname text, tablename text, schemaname text, indexname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_index(fieldname text, tablename text, schemaname text, indexname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_indexes_with_id(fieldname text, tablename text, schemaname text, indexnameasc text, indexnamedesc text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_indexes_with_id(fieldname text, tablename text, schemaname text, indexnameasc text, indexnamedesc text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_indexes_with_id(fieldname text, tablename text, schemaname text, indexnameasc text, indexnamedesc text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_like_index(fieldname text, tablename text, schemaname text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_like_index(fieldname text, tablename text, schemaname text, indexname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_like_index(fieldname text, tablename text, schemaname text, indexname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_multiple_field_index(fieldnames text[], tablename text, schemaname text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_multiple_field_index(fieldnames text[], tablename text, schemaname text, indexname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_multiple_field_index(fieldnames text[], tablename text, schemaname text, indexname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_readonly_authentication(readpermissions text, tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_readonly_authentication(readpermissions text, tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_readonly_authentication(readpermissions text, tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_subscription_triggers(idcolumn text, tablename text, schemaname text, maintablename text, eventtype text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_subscription_triggers(idcolumn text, tablename text, schemaname text, maintablename text, eventtype text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_subscription_triggers(idcolumn text, tablename text, schemaname text, maintablename text, eventtype text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_tenant_environment_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_tenant_environment_trigger(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_tenant_environment_trigger(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_timestamps_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_timestamps_trigger(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_timestamps_trigger(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_unique_index(fieldname text, tablename text, schemaname text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_unique_index(fieldname text, tablename text, schemaname text, indexname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_unique_index(fieldname text, tablename text, schemaname text, indexname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_user_id_on_table(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_user_id_on_table(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_user_id_on_table(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_user_id_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_user_id_trigger(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_user_id_trigger(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION define_users_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.define_users_trigger(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.define_users_trigger(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION drop_index(fieldname text, tablename text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_index(fieldname text, tablename text, indexname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.drop_index(fieldname text, tablename text, indexname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION drop_indexes_with_id(fieldname text, tablename text, indexnameasc text, indexnamedesc text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_indexes_with_id(fieldname text, tablename text, indexnameasc text, indexnamedesc text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.drop_indexes_with_id(fieldname text, tablename text, indexnameasc text, indexnamedesc text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION drop_like_index(fieldname text, tablename text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_like_index(fieldname text, tablename text, indexname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.drop_like_index(fieldname text, tablename text, indexname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION drop_multiple_field_index(fieldnames text[], tablename text, indexname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_multiple_field_index(fieldnames text[], tablename text, indexname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.drop_multiple_field_index(fieldnames text[], tablename text, indexname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION drop_tenant_environment_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_tenant_environment_trigger(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.drop_tenant_environment_trigger(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION drop_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.drop_timestamp_propagation(idcolumnname text, tablename text, schemaname text, foreignidcolumnname text, foreigntablename text, foreignschemaname text, functionname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION drop_timestamps_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_timestamps_trigger(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.drop_timestamps_trigger(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION drop_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.drop_unique_constraint(fieldname text, tablename text, schemaname text, constraintname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION drop_user_id_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_user_id_trigger(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.drop_user_id_trigger(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION drop_users_trigger(tablename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.drop_users_trigger(tablename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.drop_users_trigger(tablename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION live_suggestions_endpoint(propertyname text, typename text, schemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.live_suggestions_endpoint(propertyname text, typename text, schemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.live_suggestions_endpoint(propertyname text, typename text, schemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION set_enum_as_column_type(columnname text, tablename text, schemaname text, enumname text, enumschemaname text, defaultenumvalue text, notnulloptions text, constraintname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.set_enum_as_column_type(columnname text, tablename text, schemaname text, enumname text, enumschemaname text, defaultenumvalue text, notnulloptions text, constraintname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.set_enum_as_column_type(columnname text, tablename text, schemaname text, enumname text, enumschemaname text, defaultenumvalue text, notnulloptions text, constraintname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION set_enum_domain(columnname text, tablename text, schemaname text, enumname text, enumschemaname text); Type: ACL; Schema: ax_define; Owner: -
--

REVOKE ALL ON FUNCTION ax_define.set_enum_domain(columnname text, tablename text, schemaname text, enumname text, enumschemaname text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_define.set_enum_domain(columnname text, tablename text, schemaname text, enumname text, enumschemaname text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_has_allowed_value(input_value text, allowed_values text[], error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_has_allowed_value(input_value text, allowed_values text[], error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_has_allowed_value(input_value text, allowed_values text[], error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_is_base64(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_base64(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_base64(input_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_is_identifier_key(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_identifier_key(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_identifier_key(input_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_is_trimmed(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_trimmed(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_trimmed(input_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_is_url(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_is_url(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_is_url(input_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_matches_pattern(input_value text, pattern text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_matches_pattern(input_value text, pattern text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_matches_pattern(input_value text, pattern text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_max_length(input_value text, max_length integer, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_max_length(input_value text, max_length integer, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_max_length(input_value text, max_length integer, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_max_value(input_value numeric, max_value numeric, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_max_value(input_value numeric, max_value numeric, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_max_value(input_value numeric, max_value numeric, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_min_length(input_value text, min_length integer, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_min_length(input_value text, min_length integer, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_min_length(input_value text, min_length integer, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_min_value(input_value numeric, min_value numeric, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_min_value(input_value numeric, min_value numeric, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_min_value(input_value numeric, min_value numeric, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_not_default_uuid(input_value uuid, default_uuid uuid, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_not_default_uuid(input_value uuid, default_uuid uuid, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_not_default_uuid(input_value uuid, default_uuid uuid, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_not_empty(input_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_not_empty(input_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_not_empty(input_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_not_empty_array(input_value text[], error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_not_empty_array(input_value text[], error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_not_empty_array(input_value text[], error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION constraint_starts_with(input_value text, prefix_value text, error_message text, error_code text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.constraint_starts_with(input_value text, prefix_value text, error_message text, error_code text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.constraint_starts_with(input_value text, prefix_value text, error_message text, error_code text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION current_environment_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.current_environment_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.current_environment_id() TO entitlement_service_gql_role;


--
-- Name: FUNCTION current_tenant_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.current_tenant_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.current_tenant_id() TO entitlement_service_gql_role;


--
-- Name: FUNCTION current_user_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.current_user_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.current_user_id() TO entitlement_service_gql_role;


--
-- Name: FUNCTION raise_error(error_message text, error_code text, VARIADIC placeholder_values text[]); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.raise_error(error_message text, error_code text, VARIADIC placeholder_values text[]) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.raise_error(error_message text, error_code text, VARIADIC placeholder_values text[]) TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__graphql_subscription(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__graphql_subscription() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__graphql_subscription() TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__tenant_environment(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__tenant_environment() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__tenant_environment() TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__tenant_environment_on_delete(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__tenant_environment_on_delete() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__tenant_environment_on_delete() TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__timestamps(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__timestamps() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__timestamps() TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__user_id(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__user_id() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__user_id() TO entitlement_service_gql_role;


--
-- Name: FUNCTION tg__username(); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.tg__username() FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.tg__username() TO entitlement_service_gql_role;


--
-- Name: FUNCTION user_has_permission(required_permissions text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_permission(required_permissions text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_permission(required_permissions text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION user_has_permission_and_tag(required_permissions text, fieldvalue text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_permission_and_tag(required_permissions text, fieldvalue text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_permission_and_tag(required_permissions text, fieldvalue text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION user_has_setting(required_settings text, local_variable_field text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_setting(required_settings text, local_variable_field text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_setting(required_settings text, local_variable_field text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION user_has_tag(required_permissions text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.user_has_tag(required_permissions text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.user_has_tag(required_permissions text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validate_identifier_length(identifier text, hint text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validate_identifier_length(identifier text, hint text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validate_identifier_length(identifier text, hint text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_is_base64(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_base64(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_base64(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_is_identifier_key(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_identifier_key(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_identifier_key(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_is_optional_url(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_optional_url(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_optional_url(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_is_trimmed(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_trimmed(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_trimmed(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_is_url(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_is_url(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_is_url(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_not_empty(input_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_not_empty(input_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_not_empty(input_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_not_empty_array(input_value text[]); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_not_empty_array(input_value text[]) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_not_empty_array(input_value text[]) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_starts_with(input_value text, prefix_value text); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_starts_with(input_value text, prefix_value text) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_starts_with(input_value text, prefix_value text) TO entitlement_service_gql_role;


--
-- Name: FUNCTION validation_valid_url_array(input_value text[]); Type: ACL; Schema: ax_utils; Owner: -
--

REVOKE ALL ON FUNCTION ax_utils.validation_valid_url_array(input_value text[]) FROM PUBLIC;
GRANT ALL ON FUNCTION ax_utils.validation_valid_url_array(input_value text[]) TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_hidden GRANT SELECT,USAGE ON SEQUENCES TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_hidden GRANT ALL ON FUNCTIONS TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_public GRANT SELECT,USAGE ON SEQUENCES TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA app_public GRANT ALL ON FUNCTIONS TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: ax_define; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_define GRANT SELECT,USAGE ON SEQUENCES TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: ax_define; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_define GRANT ALL ON FUNCTIONS TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: ax_utils; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_utils GRANT SELECT,USAGE ON SEQUENCES TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: ax_utils; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA ax_utils GRANT ALL ON FUNCTIONS TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner IN SCHEMA public GRANT ALL ON FUNCTIONS TO entitlement_service_gql_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE entitlement_service_owner REVOKE ALL ON FUNCTIONS FROM PUBLIC;


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_ddl();


--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_drop();


--
-- PostgreSQL database dump complete
--

