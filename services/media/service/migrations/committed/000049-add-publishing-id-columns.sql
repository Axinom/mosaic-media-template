--! Previous: sha1:e6ef20efc970aba45f27f24b79db4c037c66f4e2
--! Hash: sha1:2202c018c5c99752da0e8d37322d66bc35867242
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
