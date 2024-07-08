--! Previous: -
--! Hash: sha1:b2e7302ea0833ec41715a6e068db7bac2c229acb
--! Message: initial-schema

-------------- #setup ---------------

GRANT CONNECT ON DATABASE ":DB_NAME" TO ":DATABASE_LOGIN";

-- Create new schema to isolate objects that are exposed to postgraphile
DROP SCHEMA IF EXISTS app_public CASCADE;
CREATE SCHEMA app_public;

-- Create new schema for private objects which will never be exposed to postgraphile
DROP SCHEMA IF EXISTS app_private CASCADE;
CREATE SCHEMA app_private;

-- Create new schema for hidden objects which will never be exposed to postgraphile but ${config.dbGqlRole} will have access to
DROP SCHEMA IF EXISTS app_hidden CASCADE;
CREATE SCHEMA app_hidden;

-- Create new schema for Mosaic SQL define table functions
DROP SCHEMA IF EXISTS ax_define CASCADE;
CREATE SCHEMA ax_define;

-- Grant public schema USAGE to ${config.dbGqlRole}
GRANT USAGE ON SCHEMA public, app_public, app_hidden, ax_utils, ax_define TO ":DATABASE_GQL_ROLE";

-- Grant app_public usage for PostGraphile enum table introspection
-- More info here: https://github.com/graphile/postgraphile/releases/tag/v4.8.0
GRANT USAGE ON SCHEMA app_public TO ":DATABASE_LOGIN";

-- All newly created sequences and functions will be automatically granted to ${config.dbGqlRole}
ALTER default privileges IN SCHEMA public, app_public, app_hidden, ax_utils, ax_define GRANT usage, SELECT ON sequences TO ":DATABASE_GQL_ROLE";
ALTER default privileges IN SCHEMA public, app_public, app_hidden, ax_utils, ax_define GRANT EXECUTE ON functions TO ":DATABASE_GQL_ROLE";

-- Grant library DB objection from app_hidden to ${config.dbGqlRole}
GRANT USAGE, SELECT ON ALL sequences IN SCHEMA ax_utils TO ":DATABASE_GQL_ROLE";
GRANT EXECUTE ON ALL functions IN SCHEMA ax_utils TO ":DATABASE_GQL_ROLE";

-- make sure the database is set to UTC timezone
ALTER DATABASE ":DB_NAME" SET timezone TO 'UTC';

-- Set search_path for zapatos
ALTER DATABASE ":DB_NAME" SET "search_path" TO "app_public", "ax_utils", "app_hidden", "app_private", "public";
