--! Previous: sha1:f148ea5da10af569eccf3bc2ba67aca780387074
--! Hash: sha1:2f9095c5577c51ca1511c9757bcd5128a5e24dbb
--! Message: add-publishing-id-columns

-- Add publishing_id columns to movies, tvshows, seasons, episodes, and collections tables
ALTER TABLE app_public.movies ADD COLUMN publishing_id TEXT;
ALTER TABLE app_public.tvshows ADD COLUMN publishing_id TEXT;
ALTER TABLE app_public.seasons ADD COLUMN publishing_id TEXT;
ALTER TABLE app_public.episodes ADD COLUMN publishing_id TEXT;
ALTER TABLE app_public.collections ADD COLUMN publishing_id TEXT;

-- Grant INSERT and UPDATE permissions on publishing_id
GRANT INSERT (publishing_id) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (publishing_id) ON app_public.movies TO ":DATABASE_GQL_ROLE";

GRANT INSERT (publishing_id) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (publishing_id) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";

GRANT INSERT (publishing_id) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (publishing_id) ON app_public.seasons TO ":DATABASE_GQL_ROLE";

GRANT INSERT (publishing_id) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (publishing_id) ON app_public.episodes TO ":DATABASE_GQL_ROLE";

GRANT INSERT (publishing_id) ON app_public.collections TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (publishing_id) ON app_public.collections TO ":DATABASE_GQL_ROLE";
