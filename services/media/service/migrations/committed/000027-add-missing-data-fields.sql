--! Previous: sha1:2341b843c16da70691a2ffedcb53aa5f86bb9479
--! Hash: sha1:61cb809618133aa2ad96ff019cfcf16c844a95b7
--! Message: add-missing-data-fields

ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS rating NUMERIC(18,2);
ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS custom_rating TEXT;
ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS credits_start_time TEXT;
ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS length_in_seconds NUMERIC(13,5);
ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS dynamic_field TEXT;
ALTER TABLE app_public.movies ADD COLUMN IF NOT EXISTS extended_field TEXT;
GRANT INSERT (rating) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (rating) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT INSERT (custom_rating) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (custom_rating) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT INSERT (credits_start_time) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (credits_start_time) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT INSERT (length_in_seconds) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (length_in_seconds) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT INSERT (dynamic_field) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (dynamic_field) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT INSERT (extended_field) ON app_public.movies TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (extended_field) ON app_public.movies TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.tvshows ADD COLUMN IF NOT EXISTS rating NUMERIC(18,2);
ALTER TABLE app_public.tvshows ADD COLUMN IF NOT EXISTS custom_rating TEXT;
ALTER TABLE app_public.tvshows ADD COLUMN IF NOT EXISTS credits_start_time TEXT;
ALTER TABLE app_public.tvshows ADD COLUMN IF NOT EXISTS length_in_seconds NUMERIC(13,5);
ALTER TABLE app_public.tvshows ADD COLUMN IF NOT EXISTS dynamic_field TEXT;
ALTER TABLE app_public.tvshows ADD COLUMN IF NOT EXISTS extended_field TEXT;
GRANT INSERT (rating) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (rating) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT INSERT (custom_rating) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (custom_rating) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT INSERT (credits_start_time) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (credits_start_time) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT INSERT (length_in_seconds) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (length_in_seconds) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT INSERT (dynamic_field) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (dynamic_field) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT INSERT (extended_field) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (extended_field) ON app_public.tvshows TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS rating NUMERIC(18,2);
ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS custom_rating TEXT;
ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS credits_start_time TEXT;
ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS length_in_seconds NUMERIC(13,5);
ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS dynamic_field TEXT;
ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS extended_field TEXT;
GRANT INSERT (rating) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (rating) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT INSERT (custom_rating) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (custom_rating) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT INSERT (credits_start_time) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (credits_start_time) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT INSERT (length_in_seconds) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (length_in_seconds) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT INSERT (dynamic_field) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (dynamic_field) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT INSERT (extended_field) ON app_public.seasons TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (extended_field) ON app_public.seasons TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.episodes ADD COLUMN IF NOT EXISTS rating NUMERIC(18,2);
ALTER TABLE app_public.episodes ADD COLUMN IF NOT EXISTS custom_rating TEXT;
ALTER TABLE app_public.episodes ADD COLUMN IF NOT EXISTS credits_start_time TEXT;
ALTER TABLE app_public.episodes ADD COLUMN IF NOT EXISTS length_in_seconds NUMERIC(13,5);
ALTER TABLE app_public.episodes ADD COLUMN IF NOT EXISTS dynamic_field TEXT;
ALTER TABLE app_public.episodes ADD COLUMN IF NOT EXISTS extended_field TEXT;
GRANT INSERT (rating) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (rating) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT INSERT (custom_rating) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (custom_rating) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT INSERT (credits_start_time) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (credits_start_time) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT INSERT (length_in_seconds) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (length_in_seconds) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT INSERT (dynamic_field) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (dynamic_field) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT INSERT (extended_field) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (extended_field) ON app_public.episodes TO ":DATABASE_GQL_ROLE";
