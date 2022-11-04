-- Some extensions require superuser privileges, so we create them before migration time.
-- Also, this code needs to be ran against shadow database as well to successfully apply migrations
-- This means that after-reset sql scripts must be run for both shadow and regular database and we should utilize graphile-migrate reset command
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public; -- used for generation of short unique string values, e.g. salt in extenal_id
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public; -- used for gin indexes which optimize requests that use LIKE/ILIKE operators, e.g. filter by title
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public; -- used for generating UUID values for PK fields
