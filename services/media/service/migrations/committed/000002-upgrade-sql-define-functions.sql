--! Previous: sha1:7a50d1553e24e89387eec24fbe58ba89aeeb8e98
--! Hash: sha1:a220d7bef090e23a63b05215d16a379d80abbb14
--! Message: upgrade SQL define functions

-- remove the define functions from the ax_utils schema
DROP FUNCTION IF EXISTS ax_utils.bind_enum_schema_table_to_table(text, text, text, text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.bind_enum_schema_table_to_table(text, text, text, text); -- drop old version
DROP FUNCTION IF EXISTS ax_utils.bind_enum_table_to_table(text, text, text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.column_exists(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.create_enum_table(text, text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.create_messaging_counter_table();
DROP FUNCTION IF EXISTS ax_utils.define_audit_date_fields_on_table(text, text);
DROP FUNCTION IF EXISTS ax_utils.define_audit_user_fields_on_table(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_authentication(text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_authentication(text, text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_consumer_authentication(text, text);
DROP FUNCTION IF EXISTS ax_utils.define_deferred_unique_constraint(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_index(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_indexes_with_id(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_like_index(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_multitenancy_index(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_multitenancy_multi_unique_constraint(text[], text, text);
DROP FUNCTION IF EXISTS ax_utils.define_multitenancy_on_table(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_multitenancy_relation(text, text, text, text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_multitenancy_unique_constraint(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_multitenancy_unique_constraint(text, text);
DROP FUNCTION IF EXISTS ax_utils.define_multitenant_authentication(text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_multitenant_authentication(text, text, boolean, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_readonly_authentication(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_readonly_multitenant_authentication(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_subscription_triggers(text, text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_tenant_environment_trigger(text, text);
DROP FUNCTION IF EXISTS ax_utils.define_timestamps_trigger(text, text);
DROP FUNCTION IF EXISTS ax_utils.define_unique_constraint(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_unique_index(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.define_user_id_on_table(text, text);
DROP FUNCTION IF EXISTS ax_utils.define_user_id_trigger(text, text);
DROP FUNCTION IF EXISTS ax_utils.define_users_trigger(text, text);
DROP FUNCTION IF EXISTS ax_utils.drop_enum_type_and_create_enum_table(text, text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.drop_index(text, text);
DROP FUNCTION IF EXISTS ax_utils.drop_indexes_with_id(text, text);
DROP FUNCTION IF EXISTS ax_utils.drop_like_index(text, text);
DROP FUNCTION IF EXISTS ax_utils.drop_multitenancy_relation(text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.drop_tenant_environment_trigger(text, text);
DROP FUNCTION IF EXISTS ax_utils.drop_timestamps_trigger(text, text);
DROP FUNCTION IF EXISTS ax_utils.drop_unique_constraint(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.drop_user_id_trigger(text, text);
DROP FUNCTION IF EXISTS ax_utils.drop_users_trigger(text, text);
DROP FUNCTION IF EXISTS ax_utils.expose_enum_endpoint(text, text);
DROP FUNCTION IF EXISTS ax_utils.live_suggestions_endpoint(text, text, text);
DROP FUNCTION IF EXISTS ax_utils.set_enum_domain(text, text, text, text, text);
DROP FUNCTION IF EXISTS ax_utils.unbind_enum_type_from_table(text, text, text, text, boolean);

-- first clean up and delete all now obsolete define functions
DO $$
DECLARE 
  func RECORD;
BEGIN
  FOR func IN (
    SELECT ns.nspname as schema, p.proname as name, oidvectortypes(p.proargtypes) as parameters
    FROM pg_proc p INNER JOIN pg_namespace ns ON (p.pronamespace = ns.oid)
    WHERE ns.nspname = 'ax_define'  order by p.proname
  )
  LOOP
    execute 'DROP FUNCTION ' || func.schema || '.' || func.name || '(' || func.parameters || ');';
  END LOOP;
END$$;

-- creation method to help on consistently create subscription triggers
CREATE OR REPLACE FUNCTION ax_define.define_subscription_triggers(idColumn text, tableName text, schemaName text, mainTableName text, eventType text) RETURNS void
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

-- drop method to help on consistently drop timestamp triggers
CREATE OR REPLACE FUNCTION ax_define.drop_timestamps_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _100_timestamps on ' || schemaName || '.' || tableName || ';';
END;
$$;

-- creation method to help on consistently create timestamp triggers
CREATE OR REPLACE FUNCTION ax_define.define_timestamps_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_timestamps_trigger(tableName, schemaName);
  EXECUTE 'CREATE trigger _100_timestamps BEFORE UPDATE ON ' || schemaName || '.' || tableName ||
          ' for each ROW EXECUTE PROCEDURE ax_utils.tg__timestamps();';
END;
$$;

-- drop method to help on consistently drop users triggers
CREATE OR REPLACE FUNCTION ax_define.drop_users_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _200_username on ' || schemaName || '.' || tableName || ';';
END;
$$;

-- creation method to help on consistently create users triggers
CREATE OR REPLACE FUNCTION ax_define.define_users_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_users_trigger(tableName, schemaName);
  EXECUTE 'CREATE trigger _200_username BEFORE INSERT OR UPDATE ON ' || schemaName || '.' || tableName ||
          ' for each ROW EXECUTE PROCEDURE ax_utils.tg__username();';
END;
$$;

-- drop method to help on consistently drop tenant/environment triggers
CREATE OR REPLACE FUNCTION ax_define.drop_tenant_environment_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _200_tenant_environment on ' || schemaName || '.' || tableName || ';';
END;
$$;

-- creation method to help on consistently create tenant/environment triggers
CREATE OR REPLACE FUNCTION ax_define.define_tenant_environment_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_tenant_environment_trigger(tableName, schemaName);
  EXECUTE 'CREATE trigger _200_tenant_environment BEFORE INSERT OR UPDATE ON ' || schemaName || '.' || tableName ||
          ' for each ROW EXECUTE PROCEDURE ax_utils.tg__tenant_environment();';
END;
$$;

-- drop method to help consistently drop user_id triggers
CREATE OR REPLACE FUNCTION ax_define.drop_user_id_trigger(tablename text, schemaname text)
 RETURNS void
 LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _200_user_id on ' || schemaName || '.' || tableName || ';';
END;
$$
;

-- creation method to consistently create user_id triggers
CREATE OR REPLACE FUNCTION ax_define.define_user_id_trigger(tablename text, schemaname text)
 RETURNS void
 LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM ax_define.drop_user_id_trigger(tableName, schemaName);
  EXECUTE 'CREATE trigger _200_user_id BEFORE INSERT OR UPDATE ON ' || schemaName || '.' || tableName ||
          ' for each ROW EXECUTE PROCEDURE ax_utils.tg__user_id();';
END;
$$
;

-- deletion method to help on consistently delete "normal" indexes
CREATE OR REPLACE FUNCTION ax_define.drop_index(fieldName text, tableName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP INDEX IF EXISTS idx_' || tableName || '_' || fieldName || ' cascade;';
END;
$$;

-- creation method to help on consistently create "normal" indexes in an idempotent way for a single field
CREATE OR REPLACE FUNCTION ax_define.define_index(fieldName text, tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_index(fieldName, tableName);
  EXECUTE 'CREATE INDEX idx_' || tableName || '_' || fieldName || ' ON ' || schemaName || '.' || tableName || ' (' || fieldName || ');';
END;
$$;

-- deletion method to help on consistently delete indexes for a field plus the id field for explorer sorting
CREATE OR REPLACE FUNCTION ax_define.drop_indexes_with_id(fieldName text, tableName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP INDEX IF EXISTS idx_' || tableName || '_' || fieldName || '_asc_with_id cascade;';
  EXECUTE 'DROP INDEX IF EXISTS idx_' || tableName || '_' || fieldName || '_desc_with_id cascade;';
END;
$$;

-- creation method to help on consistently create indexes in an idempotent way for a field plus the id field for explorer sorting
CREATE OR REPLACE FUNCTION ax_define.define_indexes_with_id(fieldName text, tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_indexes_with_id(fieldName, tableName);
  EXECUTE 'CREATE INDEX idx_' || tableName || '_' || fieldName || '_asc_with_id ON ' || schemaName || '.' || tableName || ' (' || fieldName || ' ASC, id ASC);';
  EXECUTE 'CREATE INDEX idx_' || tableName || '_' || fieldName || '_desc_with_id ON ' || schemaName || '.' || tableName || ' (' || fieldName || ' DESC, id ASC);';
END;
$$;

-- creation method to help on consistently create UNIQUE indexes in an idempotent way
CREATE OR REPLACE FUNCTION ax_define.define_unique_index(fieldName text, tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_index(fieldName, tableName);
  EXECUTE 'CREATE UNIQUE INDEX idx_' || tableName || '_' || fieldName || ' ON ' || schemaName || '.' || tableName || ' (' || fieldName || ');';
END;
$$;

CREATE OR REPLACE FUNCTION ax_define.drop_unique_constraint(fieldName text, tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' DROP CONSTRAINT IF EXISTS ' || tableName || '_' || fieldName || '_is_unique;';
END;
$$;

-- creation method to help on consistently create UNIQUE constraint in an idempotent way
CREATE OR REPLACE FUNCTION ax_define.define_unique_constraint(fieldName text, tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_unique_constraint(fieldName, tableName, schemaName);
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ADD CONSTRAINT ' || tableName || '_' || fieldName || '_is_unique UNIQUE (' || fieldName || ');';
END;
$$;

-- creation method to help on consistently create UNIQUE deferred constraint in an idempotent way. Uniqueness is only checked when the transaction is committed.
CREATE OR REPLACE FUNCTION ax_define.define_deferred_unique_constraint(fieldName text, tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_unique_constraint(fieldName, tableName, schemaName);
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ADD CONSTRAINT ' || tableName || '_' || fieldName || '_is_unique UNIQUE (' || fieldName || ') DEFERRABLE INITIALLY DEFERRED;';
END;
$$;

-- deletion method to help on consistently delete index that support LIKE/ILIKE searches
CREATE OR REPLACE FUNCTION ax_define.drop_like_index(fieldName text, tableName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP INDEX IF EXISTS idx_trgm_' || tableName || '_' || fieldName || ' cascade;';
END;
$$;

-- creation method to help on consistently create indexes in an idempotent way that support LIKE/ILIKE searches
-- read more here: https://niallburkley.com/blog/index-columns-for-like-in-postgres/
CREATE OR REPLACE FUNCTION ax_define.define_like_index(fieldName text, tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_like_index(fieldName, tableName);
  EXECUTE 'CREATE INDEX idx_trgm_' || tableName || '_' || fieldName || ' ON ' || schemaName || '.' || tableName || ' USING gin (' || fieldName || ' gin_trgm_ops);';
END;
$$;

-- create authentication for a table via row level security based on permissions
-- usage: SELECT ax_define.define_authentication('VIDEOS_VIEW,VIDEOS_EDIT,ADMIN', 'VIDEOS_EDIT,ADMIN', 'videos', 'app_public');
-- readPermissions (optional): comma separated list of permission names to grant read permissions.
-- modifyPermissions (optional): comma separated list of permission names to grant write permissions. If this is an empty string, only read permissions are granted.
-- tableName: the name of the table to protect
-- additionalRls (optional): any additional RLS check to add to the policies
-- schemaName: the database schema name of the table to protect
CREATE OR REPLACE FUNCTION ax_define.define_authentication(readPermissions text, modifyPermissions text, tableName text, schemaName text, additionalRls text default '1=1') RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ENABLE ROW LEVEL SECURITY;';
  EXECUTE 'DROP POLICY IF EXISTS ' || tableName || '_authorization ON ' || schemaName || '.' || tableName || ';';

  if (readPermissions <> '' and modifyPermissions <> '') then
    EXECUTE 'CREATE POLICY ' || tableName || '_authorization ON ' || schemaName || '.' || tableName || ' FOR ALL
      USING (ax_utils.user_has_permission(''' || readPermissions || ''') AND ' || additionalRls || ')
      WITH CHECK (ax_utils.user_has_permission(''' || modifyPermissions || ''') AND ' || additionalRls || ');';
    EXECUTE 'DROP POLICY IF EXISTS ' || tableName || '_authorization_delete ON ' || schemaName || '.' || tableName || ';';
    EXECUTE 'CREATE POLICY ' || tableName || '_authorization_delete ON ' || schemaName || '.' || tableName || ' AS restrictive FOR DELETE
    USING (ax_utils.user_has_permission(''' || modifyPermissions || '''));';
  elsif (readPermissions <> '') then
    EXECUTE 'CREATE POLICY ' || tableName || '_authorization ON ' || schemaName || '.' || tableName || ' FOR SELECT
      USING (ax_utils.user_has_permission(''' || readPermissions || ''') AND ' || additionalRls || ');';
  elsif (additionalRls <> '') then
    EXECUTE 'CREATE POLICY ' || tableName || '_authorization ON ' || schemaName || '.' || tableName || ' FOR ALL
      USING (' || tenant_rls_string || ');';
  else
    perform ax_utils.raise_error('Invalid parameters provided to "define_authentication". At least the "readPermissions" or "additionalRls" must be provided.', 'SETUP');
  end if;

END;
$$;

-- create readonly authentication for a table via row level security
CREATE OR REPLACE FUNCTION ax_define.define_readonly_authentication(readPermissions text, tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  perform ax_define.define_authentication(readPermissions, '', tableName, schemaName);
END;
$$;

-- creation method to help consistently create GraphQL endpoints for enum SQL types
CREATE OR REPLACE FUNCTION ax_define.expose_enum_endpoint(typeName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'CREATE OR REPLACE FUNCTION ' || schemaName || '.get_' || typeName || '_values() ' ||
    'RETURNS SETOF ' || schemaName || '.' || typeName || ' AS $get$ ' ||
    'SELECT unnest(enum_range(NULL::' || schemaName || '.' || typeName || '));' ||
    '$get$ LANGUAGE SQL STABLE;';
END;
$$;

-- creation method to help consistently create GraphQL endpoints for live suggestions
-- Endpoint selects a single text column, performs a DISTINCT and orders by ASC. Other operations are provided by postgraphile
CREATE OR REPLACE FUNCTION ax_define.live_suggestions_endpoint(
  propertyName text, 
  typeName text, 
  schemaName text
  ) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'CREATE OR REPLACE FUNCTION ' || schemaName || '.get_' || typeName || '_values() ' ||
    'RETURNS SETOF text AS $get$ ' ||
      'SELECT DISTINCT ' || propertyName || ' FROM '|| schemaName || '.' || typeName || ' ' ||
      'ORDER BY ' || propertyName || ' ASC' ||
    '$get$ LANGUAGE SQL STABLE;';
END;
$$;

-- define created/updated user columns
CREATE OR REPLACE FUNCTION ax_define.define_audit_user_fields_on_table(
  tableName text,
  schemaName text,
  defaultUserName text
  ) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;

-- define created/updated date columns
CREATE OR REPLACE FUNCTION ax_define.define_audit_date_fields_on_table(
  tableName text,
  schemaName text
  ) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;

-- checks if column exists in specific table and schema
CREATE OR REPLACE FUNCTION ax_define.column_exists(
  columnName text,
  tableName text,
  schemaName text
) RETURNS boolean
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

-- Alters the table by switching type of a specified column from enum to text or text[]
-- Execution is skipped if column does not exist
CREATE OR REPLACE FUNCTION ax_define.unbind_enum_type_from_table(
  columnName text, -- 'status'
  tableName text, -- 'example_table'
  schemaName text, -- 'app_public'
  defaultValue text default NULL, -- 'IN_PROGRESS'
  isArray bool default false
  ) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  fk_constraint_name TEXT = tableName || '_' || columnName || '_fkey';
  arraySuffix TEXT = '';
BEGIN
  IF NOT ax_define.column_exists(columnName, tableName, schemaName) THEN
    return;
  END IF; 

  IF isArray THEN
    arraySuffix = '[]';
  END IF;

  -- Drop FK constraint to support idempotency of enum type-to-table migration
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' DROP CONSTRAINT IF EXISTS ' || fk_constraint_name || ';';

  -- Change the type of enum column to unbind enum type
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ALTER COLUMN ' || columnName || ' TYPE text' || arraySuffix || ';';

  IF defaultValue IS NOT NULL THEN
    -- Reset default value for enum column, because changing column type clears it's default value
    EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ALTER COLUMN ' || columnName || ' SET DEFAULT ''' || defaultValue ||''';';
  END IF;
END;
$$;

-- Drops enum type and creates an enum table with the same name
-- Must be called after 'unbind_enum_type_from_table' is called for each table that is using this enum
CREATE OR REPLACE FUNCTION ax_define.drop_enum_type_and_create_enum_table(
  enumName text, -- 'example_status'
  schemaName text, -- 'app_public'
  loginRolePlaceholder text, -- ':DATABASE_LOGIN'
  enumValues text, -- '{SUCCESS,IN_PROGRESS,ERROR}'
  enumDesriptions text default NULL -- '{Success,In Progress,Error}'
  ) RETURNS void LANGUAGE plpgsql AS $$
BEGIN

  -- N.B! Needs to be executed before DROP TYPE to support both enum-to-table migration and idempotency, even if it's called later in "create_enum_table"
  EXECUTE 'DROP TABLE IF EXISTS ' || schemaName || '.' || enumName || ' CASCADE;';
  
  -- Delete enum type to free up the name for enum table
  EXECUTE 'DROP TYPE IF EXISTS ' || schemaName || '.' || enumName || ' CASCADE;';

  PERFORM ax_define.create_enum_table(enumName, schemaName, loginRolePlaceholder, enumValues, enumDesriptions);
END;
$$;

-- Creates an enum table and initializes it with the possible enum values
CREATE OR REPLACE FUNCTION ax_define.create_enum_table(
  enumName text, -- 'example_status'
  schemaName text, -- 'app_public'
  loginRolePlaceholder text, -- ':DATABASE_LOGIN'
  enumValues text, -- '{"SUCCESS","IN_PROGRESS","ERROR"}'
  enumDesriptions text default NULL -- '{"Success","In Progress","Error"}'
  ) RETURNS void LANGUAGE plpgsql AS $$
BEGIN

  EXECUTE 'DROP TABLE IF EXISTS ' || schemaName || '.' || enumName || ' CASCADE;';

  -- Define an enum table. The value field is the enum key and the description will be used for graphql type annotations.
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

  -- This is needed for postgraphile introspection to retrieve the values from enum table and use those values to construct a graphql enum type
  EXECUTE 'GRANT SELECT ON ' || schemaName || '.' || enumName || ' TO ' || loginRolePlaceholder || ';';

  -- Put a smart comment on an enum table so that postgraphile introspection is able to find it
  EXECUTE 'COMMENT ON TABLE ' || schemaName || '.' || enumName || '  IS E''@enum'';';
END;
$$;

-- Adds a foreign key to the enum table for a specific column
-- If columnd does not exist - it is created with type text.
DROP FUNCTION IF EXISTS ax_define.bind_enum_table_to_table(text, text, text, text); -- drop old version
CREATE OR REPLACE FUNCTION ax_define.bind_enum_table_to_table(
  columnName text, -- 'status'
  tableName text, -- 'example_table'
  schemaName text, -- 'app_public'
  enumName text, -- 'example_status'
  defaultEnumValue text default '', -- 'DASH'
  notNullOptions text default 'NOT NULL' -- 'NOT NULL'
  ) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  fk_constraint_name TEXT = tableName || '_' || columnName || '_fkey';
  default_setting TEXT = '';
BEGIN
  IF NOT coalesce(defaultEnumValue, '') = '' THEN
    default_setting = 'DEFAULT ''' || defaultEnumValue || '''::text';
  END IF;
  IF NOT ax_define.column_exists(columnName, tableName, schemaName) THEN
    EXECUTE 'ALTER TABLE  ' || schemaName || '.' || tableName || ' ADD COLUMN ' || columnName ||' text ' || default_setting || ' ' || notNullOptions || ';';
  END IF; 

  -- Set the column that uses enum value as a foreign key
  EXECUTE 'ALTER TABLE  ' || schemaName || '.' || tableName || ' ADD CONSTRAINT ' || fk_constraint_name || ' FOREIGN KEY ('|| columnName ||') REFERENCES ' || schemaName || '.' || enumName || '(value);'; 
END;
$$;

-- Adds a foreign key to the enum table in differant schema for a specific column
-- If columnd does not exist - it is created with type text.
CREATE OR REPLACE FUNCTION ax_define.bind_enum_schema_table_to_table(
  columnName text, -- 'status'
  tableName text, -- 'example_table'
  schemaName text, -- 'app_public'
  enumName text, -- 'example_status'
  enumSchemaName text, -- 'app_public'
  defaultEnumValue text default '', -- 'DASH'
  notNullOptions text default 'NOT NULL' -- 'NOT NULL'
  ) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  fk_constraint_name TEXT = tableName || '_' || columnName || '_fkey';
  default_setting TEXT = '';
BEGIN
  IF NOT coalesce(defaultEnumValue, '') = '' THEN
    default_setting = 'DEFAULT ''' || defaultEnumValue || '''::text';
  END IF;
  IF NOT ax_define.column_exists(columnName, tableName, schemaName) THEN
    EXECUTE 'ALTER TABLE  ' || schemaName || '.' || tableName || ' ADD COLUMN ' || columnName ||' text ' || default_setting || ' ' || notNullOptions || ';';
  END IF; 

  -- Set the column that uses enum value as a foreign key
  EXECUTE 'ALTER TABLE  ' || schemaName || '.' || tableName || ' ADD CONSTRAINT ' || fk_constraint_name || ' FOREIGN KEY ('|| columnName ||') REFERENCES ' || enumSchemaName || '.' || enumName || '(value);'; 
END;
$$;

-- create a domain for a enum table based property
-- Read more about custom types here: https://jawj.github.io/zapatos/#custom-types-and-domains
CREATE OR REPLACE FUNCTION ax_define.set_enum_domain(
  columnName text, -- 'status'
  tableName text, -- 'example_table'
  schemaName text, -- 'app_public'
  enumName text, -- 'example_status'
  enumSchemaName text -- 'app_public'
  ) RETURNS void LANGUAGE plpgsql AS $$
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
$$;

-- Creates a table that will count how often a message was processed e.g. due server crashes
CREATE OR REPLACE FUNCTION ax_define.create_messaging_counter_table()
  RETURNS void LANGUAGE plpgsql AS $$
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

-- define user_id column and logic
CREATE OR REPLACE FUNCTION ax_define.define_user_id_on_table(tablename text, schemaname text)
 RETURNS void
 LANGUAGE plpgsql
AS $$
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
$$;

-- Define RLS policy for user_id column in a given table
-- This is a RESTRICTIVE policy.
CREATE OR REPLACE FUNCTION ax_define.define_consumer_authentication(tablename text, schemaname text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  consumer_rls_string TEXT := '((user_id = ax_utils.current_user_id() OR ax_utils.current_user_id() = uuid_nil()))';
BEGIN
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ENABLE ROW LEVEL SECURITY;';
  EXECUTE 'DROP POLICY IF EXISTS ' || tableName || '_consumer_authorization ON ' || schemaName || '.' || tableName || ';';
  
 
  EXECUTE 'CREATE POLICY ' || tableName || '_consumer_authorization ON ' || schemaName || '.' || tableName || ' AS RESTRICTIVE FOR ALL
    USING (' || consumer_rls_string || ');';


END;
$function$;
