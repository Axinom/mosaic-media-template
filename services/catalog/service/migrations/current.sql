--! Message: cms-movies-publish-integration-improvements

ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS audio_languages TEXT[];
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS caption_languages TEXT[];
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS subtitle_languages TEXT[];
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS directors TEXT[];
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS business_type TEXT;
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS credits_start_time TEXT;
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS length_in_seconds NUMERIC(13,5);
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS dynamic_field TEXT;
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS extended_field TEXT;
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS rating NUMERIC(18,2);
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS custom_rating TEXT;
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS age_rating TEXT;
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS asset_type int;
ALTER TABLE app_public.movie ADD COLUMN IF NOT EXISTS asset_subtype TEXT;

ALTER TABLE app_public.movie_licenses ADD COLUMN IF NOT EXISTS is_downloadable bool;
ALTER TABLE app_public.movie_licenses ADD COLUMN IF NOT EXISTS downloaded_asset_lifespan INT;
ALTER TABLE app_public.movie_licenses ADD COLUMN IF NOT EXISTS business_type TEXT;
ALTER TABLE app_public.movie_licenses ADD COLUMN IF NOT EXISTS tier TEXT;
ALTER TABLE app_public.movie_licenses ADD COLUMN IF NOT EXISTS content_owner TEXT;

ALTER TABLE app_public.movie_videos ADD COLUMN IF NOT EXISTS drm_key_id TEXT;
ALTER TABLE app_public.movie_videos ADD COLUMN IF NOT EXISTS file_size_in_bytes bigint;
ALTER TABLE app_public.movie_videos ADD COLUMN IF NOT EXISTS main_url TEXT;

GRANT INSERT (audio_languages) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (audio_languages) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (caption_languages) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (caption_languages) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (subtitle_languages) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (subtitle_languages) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (directors) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (directors) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (business_type) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (business_type) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (credits_start_time) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (credits_start_time) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (length_in_seconds) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (length_in_seconds) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (dynamic_field) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (dynamic_field) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (extended_field) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (extended_field) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (rating) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (rating) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (custom_rating) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (custom_rating) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (age_rating) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (age_rating) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (asset_type) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (asset_type) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT INSERT (asset_subtype) ON app_public.movie TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (asset_subtype) ON app_public.movie TO ":DATABASE_GQL_ROLE";

GRANT INSERT (is_downloadable) ON app_public.movie_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (is_downloadable) ON app_public.movie_licenses TO ":DATABASE_GQL_ROLE";
GRANT INSERT (downloaded_asset_lifespan) ON app_public.movie_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (downloaded_asset_lifespan) ON app_public.movie_licenses TO ":DATABASE_GQL_ROLE";
GRANT INSERT (business_type) ON app_public.movie_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (business_type) ON app_public.movie_licenses TO ":DATABASE_GQL_ROLE";
GRANT INSERT (tier) ON app_public.movie_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (tier) ON app_public.movie_licenses TO ":DATABASE_GQL_ROLE";
GRANT INSERT (content_owner) ON app_public.movie_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (content_owner) ON app_public.movie_licenses TO ":DATABASE_GQL_ROLE";

GRANT INSERT (drm_key_id) ON app_public.movie_videos TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (drm_key_id) ON app_public.movie_videos TO ":DATABASE_GQL_ROLE";
GRANT INSERT (file_size_in_bytes) ON app_public.movie_videos TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (file_size_in_bytes) ON app_public.movie_videos TO ":DATABASE_GQL_ROLE";
GRANT INSERT (main_url) ON app_public.movie_videos TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (main_url) ON app_public.movie_videos TO ":DATABASE_GQL_ROLE";