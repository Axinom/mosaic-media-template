--! Previous: sha1:52145cb9ff6bafebc7e770574ad43d74203885c8
--! Hash: sha1:3d5edb6b496271bcc8c8ffd6cf237913a12ce1ce
--! Message: upgrade SQL define functions

-- first, clean up and delete all now obsolete define functions
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

/*-snippet
{
  "body": [
    "SELECT ax_define.define_subscription_triggers('id', '${1:table_name}', '${3:app_public}', '${1:table_name}', '${2:SingularTableNameInPascalCase}');",
    "-- TODO: To enable subscriptions:",
    "-- - Use `setupHttpServerWithWebsockets` with `setupManagementGQLSubscriptionAuthentication` as 3rd parameter to enable authentication.",
    "-- - Create the plugin via SubscriptionsPluginFactory('${1:table_name}', '${2:SingularTableNameInPascalCase}', '${4|UUID,Int|}')",
    "-- - Use `enableSubscriptions` on the `PostgraphileOptionsBuilder`.",
    "-- - Enhance your HTTP server with websocket support with `enhanceHttpServerWithSubscriptions`."
  ],
  "description": [
    "Defines PostgreSQL triggers for the specified table to enable GraphQL subscriptions functionality.\n",
    "3rd parameter of SubscriptionsPluginFactory must be either 'Int' or `UUID' depending on the type of 'id' column."
  ]
}
snippet-*/
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

/*-snippet
{
  "body": [
    "SELECT ax_define.drop_timestamps_trigger('${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Drops previously defined timestamp trigger which automatically populated 'created_date' and 'updated_date' columns."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.drop_timestamps_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _100_timestamps on ' || schemaName || '.' || tableName || ';';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.define_timestamps_trigger('${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Defines timestamp trigger which automatically populates 'created_date' and 'updated_date' columns.",
    "It is recommended to use 'ax_define.define_audit_date_fields_on_table' to define both columns and triggers in one go.",
    "Use this one if you really need to define triggers separately.\n",
    "N.B! The trigger function is not compatible with JSON columns. Use JSONB instead."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_timestamps_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM ax_define.drop_timestamps_trigger(tableName, schemaName);
  -- Full row comparison is not compatible with column type JSON. Expect error: "could not identify an equality operator for type json"
  EXECUTE 'CREATE trigger _100_timestamps BEFORE UPDATE ON ' || schemaName || '.' || tableName ||
          ' for each ROW when (old.* is distinct from new.*) EXECUTE PROCEDURE ax_utils.tg__timestamps();';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.drop_users_trigger('${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Drops previously defined users trigger which automatically populated 'created_user' and 'updated_user' columns."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.drop_users_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _200_username on ' || schemaName || '.' || tableName || ';';
  EXECUTE 'DROP trigger IF EXISTS _200_username_before_insert on ' || schemaName || '.' || tableName || ';';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.define_users_trigger('${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Defines users trigger which automatically populates 'created_user' and 'updated_user' columns.",
    "It is recommended to use 'ax_define.define_audit_user_fields_on_table' to define both columns and triggers in one go.",
    "Use this one if you really need to define triggers separately.\n",
    "N.B! The trigger function is not compatible with JSON columns. Use JSONB instead."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_users_trigger(tableName text, schemaName text) RETURNS void
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

/*-snippet
{
  "body": [
    "SELECT ax_define.drop_tenant_environment_trigger('${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Drops previously defined tenant/environment trigger which automatically populated 'tenant_id' and 'environment_id' columns."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.drop_tenant_environment_trigger(tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _200_tenant_environment on ' || schemaName || '.' || tableName || ';';
  EXECUTE 'DROP trigger IF EXISTS _200_tenant_environment_on_delete on ' || schemaName || '.' || tableName || ';';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.define_tenant_environment_trigger('${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Defines tenant/environment trigger which automatically populates 'tenant_id' and 'environment_id' columns."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_tenant_environment_trigger(tableName text, schemaName text) RETURNS void
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

/*-snippet
{
  "body": [
    "SELECT ax_define.drop_user_id_trigger('${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Drops previously defined user id trigger which automatically populated 'user_id' column."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.drop_user_id_trigger(tablename text, schemaname text)
 RETURNS void
 LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE 'DROP trigger IF EXISTS _200_user_id on ' || schemaName || '.' || tableName || ';';
END;
$$
;

/*-snippet
{
  "body": [
    "SELECT ax_define.define_user_id_trigger('${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Defines user id trigger which automatically populates 'user_id' column."
  ]
}
snippet-*/
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

/*-snippet
{
  "body": [
    "SELECT ax_define.drop_index('${1:column_name}', '${2:table_name}');"
  ],
  "description": [
    "Drops previously defined index. Applies to both regular and unique indexes.\n",
    "Third (optional) parameter: the unique name for this index. If the value is NULL then the name will be generated from the table & field name."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.drop_index(fieldName text, tableName text, indexName text default NULL) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexName, 'idx_' || tableName || '_' || fieldName) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  EXECUTE 'DROP INDEX IF EXISTS ' || indexName || ' cascade;';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.define_index('${1:column_name}', '${2:table_name}', '${3:app_public}');"
  ],
  "description": [
    "Defines a regular index on a column.\n",
    "Fourth (optional) parameter: a unique name for this index. If the value is NULL then a name will be generated from the table & field name."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_index(fieldName text, tableName text, schemaName text, indexName text default NULL) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexName, 'idx_' || tableName || '_' || fieldName) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  PERFORM ax_define.drop_index(fieldName, tableName, indexName);
  EXECUTE 'CREATE INDEX ' || indexName || ' ON ' || schemaName || '.' || tableName || ' (' || fieldName || ');';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.drop_multiple_field_index('{\"${1:column_name_one}\", \"${2:column_name_two}\"}','${3:table_name}');"
  ],
  "description": [
    "Drops previously defined multi-field index.\n",
    "Third (optional) parameter: the unique name for this index. If the value is NULL then the name will be generated from the table & field names."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.drop_multiple_field_index(fieldNames text[], tableName text, indexName text default NULL) RETURNS void
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

/*-snippet
{
  "body": [
    "SELECT ax_define.define_multiple_field_index('{\"${1:column_name_one}\", \"${2:column_name_two}\"}', '${3:table_name}', '${4:app_public}');"
  ],
  "description": [
    "Defines a regular index on multiple columns.\n",
    "Fourth (optional) parameter: a unique name for this index. If the value is NULL then a name will be generated from the table & field names."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_multiple_field_index(fieldNames text[], tableName text, schemaName text, indexName text default NULL) RETURNS void
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


/*-snippet
{
  "body": [
    "SELECT ax_define.drop_indexes_with_id('${1:column_name}', '${2:table_name}');"
  ],
  "description": [
    "Drops previously defined ASC/DESC indexes based on id and one other column.\n",
    "Third & fourth (optional) parameters: unique names for the indexes. If either value is NULL then the name will be generated from the table & field name."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.drop_indexes_with_id(fieldName text, tableName text, indexNameAsc text default NULL, indexNameDesc text default NULL) RETURNS void
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

/*-snippet
{
  "body": [
    "SELECT ax_define.define_indexes_with_id('${1:column_name}', '${2:table_name}', '${3:app_public}');"
  ],
  "description": [
    "Defines ASC/DESC indexes based on id and one other column.",
    "Use these indexes if there is a plan to perform sorting by this column.\n",
    "Fourth & fifth (optional) parameters: unique names for the indexes. If either value is NULL then a name will be generated from the table & field name."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_indexes_with_id(fieldName text, tableName text, schemaName text, indexNameAsc text default NULL, indexNameDesc text default NULL) RETURNS void
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

/*-snippet
{
  "body": [
    "SELECT ax_define.define_unique_index('${1:column_name}', '${2:table_name}', '${3:app_public}');"
  ],
  "description": [
    "Defines a UNIQUE index on a column.",
    "You can drop a unique index by using the normal 'ax_define.drop_index' function.\n",
    "Fourth (optional) parameter: a unique name for the index. If the value is NULL then a name will be generated from the table & field name."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_unique_index(fieldName text, tableName text, schemaName text, indexName text default NULL) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexName, 'idx_' || tableName || '_' || fieldName) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  PERFORM ax_define.drop_index(fieldName, tableName, indexName);
  EXECUTE 'CREATE UNIQUE INDEX ' || indexName || ' ON ' || schemaName || '.' || tableName || ' (' || fieldName || ');';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.drop_unique_constraint('${1:column_name}', '${2:table_name}', '${3:app_public}');"
  ],
  "description": [
    "Drops a UNIQUE constraint based on a column.\n",
    "Fourth (optional) parameter: the unique name for the contraint. If the value is NULL then the name will be generated from the table & field name."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.drop_unique_constraint(fieldName text, tableName text, schemaName text, constraintName text default NULL) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(constraintName, tableName || '_' || fieldName || '_is_unique') INTO constraintName;
  PERFORM ax_utils.validate_identifier_length(constraintName, 'If the auto-generated name is too long then a "constraintName" argument must be provided.');
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' DROP CONSTRAINT IF EXISTS ' || constraintName || ';';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.define_unique_constraint('${1:column_name}', '${2:table_name}', '${3:app_public}');"
  ],
  "description": [
    "Defines a UNIQUE constraint on a column.\n",
    "Fourth (optional) parameter: a unique name for the contraint. If the value is NULL then a name will be generated from the table & field name."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_unique_constraint(fieldName text, tableName text, schemaName text, constraintName text default NULL) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(constraintName, tableName || '_' || fieldName || '_is_unique') INTO constraintName;
  PERFORM ax_utils.validate_identifier_length(constraintName, 'If the auto-generated name is too long then a "constraintName" argument must be provided.');
  PERFORM ax_define.drop_unique_constraint(fieldName, tableName, schemaName, constraintName);
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ADD CONSTRAINT ' ||constraintName || ' UNIQUE (' || fieldName || ');';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.define_deferred_unique_constraint('${1:column_name}', '${2:table_name}', '${3:app_public}');"
  ],
  "description": [
    "Defines a deferred UNIQUE constraint on a column.\n",
    "Uniqueness is only checked when the transaction is committed.",
    "If you want to drop it - use 'ax_define.drop_unique_constraint'.\n",
    "Fourth (optional) parameter: a unique name for the contraint. If the value is NULL then a name will be generated from the table & field name."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_deferred_unique_constraint(fieldName text, tableName text, schemaName text, constraintName text default NULL) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
SELECT COALESCE(constraintName, tableName || '_' || fieldName || '_is_unique') INTO constraintName;
  PERFORM ax_utils.validate_identifier_length(constraintName, 'If the auto-generated name is too long then a "constraintName" argument must be provided.');
  PERFORM ax_define.drop_unique_constraint(fieldName, tableName, schemaName, constraintName);
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ADD CONSTRAINT ' || constraintName || ' UNIQUE (' || fieldName || ') DEFERRABLE INITIALLY DEFERRED;';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.drop_like_index('${1:column_name}', '${2:table_name}');"
  ],
  "description": [
    "Drops a gin_trgm_ops index (for LIKE/ILIKE searches) based on a column.\n",
    "Third (optional) parameter: the unique name for the index. If the value is NULL then the name will be generated from the table & field name."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.drop_like_index(fieldName text, tableName text, indexName text default NULL) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexName, 'idx_trgm_' || tableName || '_' || fieldName) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  EXECUTE 'DROP INDEX IF EXISTS ' || indexName || ' cascade;';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.define_like_index('${1:column_name}', '${2:table_name}', '${3:app_public}');"
  ],
  "description": [
    "Defines a gin_trgm_ops index (for LIKE/ILIKE searches) on a column.",
    "Read more here: https://niallburkley.com/blog/index-columns-for-like-in-postgres/\n",
    "Fourth (optional) parameter: a unique name for the index. If the value is NULL then a name will be generated from the table & field name."
  ]
}
snippet-*/

CREATE OR REPLACE FUNCTION ax_define.define_like_index(fieldName text, tableName text, schemaName text, indexName text default NULL) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(indexName, 'idx_trgm_' || tableName || '_' || fieldName) INTO indexName;
  PERFORM ax_utils.validate_identifier_length(indexName, 'If the auto-generated name is too long then an "indexName" argument must be provided.');
  PERFORM ax_define.drop_like_index(fieldName, tableName, indexName);
  EXECUTE 'CREATE INDEX ' || indexName || ' ON ' || schemaName || '.' || tableName || ' USING gin (' || fieldName || ' gin_trgm_ops);';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.define_authentication('${1/(.*)/${1:/upcase}/}_VIEW,${1/(.*)/${1:/upcase}/}_EDIT,ADMIN', '${1/(.*)/${1:/upcase}/}_EDIT,ADMIN', '${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Defines authentication for a table via row level security based on permissions.\n",
    "First parameter: comma-separated list of permission names to grant read permissions.",
    "Second parameter: comma-separated list of permission names to grant write permissions.",
    " - If the second parameter is an empty string, only read permissions are granted.",
    "Third parameter: the name of the table to protect.",
    "Fourth parameter: the database schema name of the table to protect.",
    "Fifth (optional) parameter: an additional RLS check to add to the policies."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_authentication(readPermissions text, modifyPermissions text, tableName text, schemaName text, additionalRls text default '1=1') RETURNS void
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

/*-snippet
{
  "body": [
    "SELECT ax_define.define_readonly_authentication('${1/(.*)/${1:/upcase}/}_VIEW,${1/(.*)/${1:/upcase}/}_EDIT,ADMIN', '${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Defines read-only authentication for a table via row level security based on permissions.\n",
    "First parameter: comma-separated list of permission names to grant read permissions.",
    "Second parameter: the name of the table to protect.",
    "Third parameter: the database schema name of the table to protect."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_readonly_authentication(readPermissions text, tableName text, schemaName text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  perform ax_define.define_authentication(readPermissions, '', tableName, schemaName);
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.live_suggestions_endpoint('${1:text_column_name}','${2:table_name}', '${3:app_public}');"
  ],
  "description": [
    "Creates custom GraphQL query endpoint to request values of a single column from the table.\n",
    "Endpoint selects a single text column, performs a DISTINCT, and orders by ASC."
  ]
}
snippet-*/
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

/*-snippet
{
  "body": [
    "SELECT ax_define.define_audit_user_fields_on_table('${1:table_name}', '${2:app_public}', ':DEFAULT_USERNAME');"
  ],
  "description": [
    "Defines 'created_user' and 'updated_user' columns for specified table.",
    "Also defines triggers that populate these columns on row create/update.\n",
    "The third parameter is a placeholder for the default username value.",
    "Please make sure that this placeholder is defined in the 'graphile-migrate' settings object,",
    "in the placeholders property with the same name e.g. ':DEFAULT_USERNAME'.\n",
    "N.B! The trigger functions are not compatible with JSON columns. Use JSONB instead."
  ]
}
snippet-*/
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

/*-snippet
{
  "body": [
    "SELECT ax_define.define_audit_date_fields_on_table('${1:table_name}', '${3:app_public}');"
  ],
  "description": [
    "Defines 'created_date' and 'updated_date' columns for the specified table.",
    "Also defines triggers that populate these columns on row create/update."
  ]
}
snippet-*/
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

/*-snippet
{
  "body": [
    "SELECT ax_define.column_exists('${1:column_name}', '${2:table_name}', '${3:app_public}');"
  ],
  "description": [
    "Checks if the column exists in a specific table and schema."
  ]
}
snippet-*/
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

/*-snippet
{
  "body": [
      "SELECT ax_define.create_enum_table(",
      "  '${1:enum_table_name}',",
      "  '${2:app_public}',",
      "  ':${6:DATABASE_LOGIN}',",
      "  '{\"${3:DEFAULT_VALUE}\",\"${4:OTHER_VALUE}\",\"${5:ANOTHER_VALUE}\"}',",
      "  '{\"${3/(?:([A-Z])([A-Z]+))*(_)?([A-Z]+)/${1:/capitalize}${2:/downcase}${3:+ }${4:/downcase}/g}\",\"${4/(?:([A-Z])([A-Z]+))*(_)?([A-Z]+)/${1:/capitalize}${2:/downcase}${3:+ }${4:/downcase}/g}\",\"${5/(?:([A-Z])([A-Z]+))*(_)?([A-Z]+)/${1:/capitalize}${2:/downcase}${3:+ }${4:/downcase}/g}\"}');"
  ],
  "description": [
    "Creates the enum table and initializes it with the possible enum values.\n",
    "To support the enum table approach, Postgraphile requires the login role to have a SELECT grant on the enum table.\n",
    "This is one of the functions that is needed to create an enum table and bind it to a column.",
    "Use 'ax-add-enum-and-column' for a full code example."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.create_enum_table(
  enumName text,
  schemaName text,
  loginRolePlaceholder text,
  enumValues text,
  enumDesriptions text default NULL
  ) RETURNS void LANGUAGE plpgsql AS $$
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

/*-snippet
{
  "body": [
      "SELECT ax_define.set_enum_as_column_type('${3:column_name}', '${4:entity_table_name}', '${5:app_public}', '${1:enum_table_name}', '${2:app_public}', '${6:DEFAULT_VALUE}');"
  ],
  "description": [
    "Adds a foreign key to the enum table for a specific column that can reside in a different schema.",
    "If the column does not exist - it is created with type text.\n",
    "The sixth parameter is optional. Do not define if the column already exists or if the new column should not have a default value.",
    "The seventh parameter is optional and decides if the column should be required or optional.",
    "The default value is 'NOT NULL'. Use 'NULL' if the new column should be optional.",
    "The eighth parameter is optional: a unique name for the generated constraint. If the value is NULL then a name will be generated from the table & column name."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.set_enum_as_column_type(
  columnName text, -- 'status'
  tableName text, -- 'example_table'
  schemaName text, -- 'app_public'
  enumName text, -- 'example_status'
  enumSchemaName text, -- 'app_public'
  defaultEnumValue text default '', -- 'Success'
  notNullOptions text default 'NOT NULL', -- 'NOT NULL'
  constraintName text default NULL
  ) RETURNS void LANGUAGE plpgsql AS $$
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

/*-snippet
{
  "body": [
    "SELECT ax_define.set_enum_domain('${3:column_name}', '${4:entity_table_name}', '${5:app_public}', '${1:enum_table_name}_enum', '${2:app_public}');"
  ],
  "description": [
    "Create a domain for an enum table based property.",
    "Enables strong typing when working with 'zapatos' npm package by defining custom types for enums.",
    "Read more about custom types here: https://jawj.github.io/zapatos/#custom-types-and-domains"
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.set_enum_domain(
  columnName text,
  tableName text,
  schemaName text,
  enumName text,
  enumSchemaName text
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

/*-snippet
{
  "body": [
    "SELECT ax_define.create_messaging_counter_table();"
  ],
  "description": [
    "Creates a table that will count how often a message was already processed via Mosaic-based messaging e.g. multiple retries due to server crashes."
  ]
}
snippet-*/
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

/*-snippet
{
  "body": [
    "SELECT ax_define.define_user_id_on_table('${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Defines 'user_id' column for the specified table.",
    "Also defines a trigger that populates this column on row create/update."
  ]
}
snippet-*/
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

/*-snippet
{
  "body": [
    "SELECT ax_define.define_end_user_authentication('${1:table_name}', '${2:app_public}');"
  ],
  "description": [
    "Defines RLS policy for user_id column in a given table",
    "This is a RESTRICTIVE policy."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_end_user_authentication(tablename text, schemaname text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  end_user_rls_string TEXT := '((user_id = (SELECT ax_utils.current_user_id()) OR (SELECT ax_utils.current_user_id()) = uuid_nil()))';
BEGIN
  EXECUTE 'ALTER TABLE ' || schemaName || '.' || tableName || ' ENABLE ROW LEVEL SECURITY;';
  EXECUTE 'DROP POLICY IF EXISTS ' || tableName || '_end_user_authorization ON ' || schemaName || '.' || tableName || ';';
  
 
  EXECUTE 'CREATE POLICY ' || tableName || '_end_user_authorization ON ' || schemaName || '.' || tableName || ' AS RESTRICTIVE FOR ALL
    USING (' || end_user_rls_string || ');';


END;
$function$;

/*-snippet
{
  "body": [
    "SELECT ax_define.drop_timestamp_propagation('${1:fk_column}', '${2:table_name}', '${3:app_public}', '${4:id}', '${5:parent_table}', '${6:app_public}');"
  ],
  "description": [
    "Removes a function and trigger created by 'ax_define.define_timestamp_propagation' in an idempotent way.\n",
    "The call signature mirrors 'ax_define.define_timestamp_propagation' and should be applied with the same arguments.\n",
    "Seventh (optional) parameter: the unique name for the generated function. If the value is NULL then the name will be generated from the table names."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.drop_timestamp_propagation(
  idColumnName text,
  tableName text,
  schemaName text,
  foreignIdColumnName text,
  foreignTableName text,
  foreignSchemaName text,
  functionName text default NULL
  ) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  SELECT COALESCE(functionName, 'tg_' || tableName || '__' || foreignTableName || '_ts_propagation') INTO functionName;
  PERFORM ax_utils.validate_identifier_length(functionName, 'If the auto-generated name is too long then a "functionName" argument must be provided.');
  EXECUTE  'DROP TRIGGER IF EXISTS _200_propogate_timestamps on ' || schemaName || '.' || tableName;
  EXECUTE  'DROP FUNCTION IF EXISTS ' || schemaName || '.' || functionName || '()';
END;
$$;

/*-snippet
{
  "body": [
    "SELECT ax_define.define_timestamp_propagation('${1:fk_column}', '${2:table_name}', '${3:app_public}', '${4:id}', '${5:parent_table}', '${6:app_public}');"
  ],
  "description": [
    "Defines a function and trigger to propagate 'updated_date' changes to related entities.\n",
    "Propagation can trigger 'UPDATED' triggers on the target entity including chained timestamp propagation.\n",
    "First parameter: a column name from the \"table_name\" table that the trigger should be associated with.",
    "Fourth parameter: a column name from the \"parent_table\" that 'updated_date' should be propagated to.",
    "Seventh (optional) parameter: a unique name for the generated function. If the value is NULL then a name will be generated from the table names.\n",
    "NB!. This function uses SECURITY DEFINER permission. It will always be executed as DB_OWNER."
  ]
}
snippet-*/
CREATE OR REPLACE FUNCTION ax_define.define_timestamp_propagation(
  idColumnName text,
  tableName text,
  schemaName text,
  foreignIdColumnName text,
  foreignTableName text,
  foreignSchemaName text,
  functionName text default NULL
  ) RETURNS void
    LANGUAGE plpgsql
    AS $a$
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
$a$;
