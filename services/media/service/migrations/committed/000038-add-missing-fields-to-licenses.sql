--! Previous: sha1:cbef1a7c7d58c08a2959c41d8b7c30a3327b6478
--! Hash: sha1:3441b4c0ec81d4f4d2bac47a8aa021d34ac064d7
--! Message: add-missing-fields-to-licenses

-- change business-type enum values
ALTER TABLE app_public.movies ALTER COLUMN business_type DROP DEFAULT;
ALTER TABLE app_public.movies ALTER COLUMN business_type SET DEFAULT 'free';

UPDATE app_public.movies SET business_type = 'free' WHERE business_type = 'free_downloadable';
DELETE FROM app_public.business_type WHERE value = 'free_downloadable';

UPDATE app_public.movies SET business_type = 'advertisement' WHERE business_type = 'advertisement_downloadable';
DELETE FROM app_public.business_type WHERE value = 'advertisement_downloadable';

UPDATE app_public.movies SET business_type = 'premium' WHERE business_type = 'premium_downloadable';
DELETE FROM app_public.business_type WHERE value = 'premium_downloadable';

UPDATE app_public.movies SET business_type = 'advertisement' WHERE business_type = 'advertisement_authenticated';
DELETE FROM app_public.business_type WHERE value = 'advertisement_authenticated';

-- add missing fields to movies_licenses
SELECT ax_define.define_audit_user_fields_on_table('movies_licenses', 'app_public', ':DEFAULT_USERNAME');

ALTER TABLE app_public.movies_licenses ADD COLUMN IF NOT EXISTS downloaded_asset_lifespan INTEGER DEFAULT 0;
GRANT INSERT (downloaded_asset_lifespan) ON app_public.movies_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (downloaded_asset_lifespan) ON app_public.movies_licenses TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.movies_licenses ADD COLUMN IF NOT EXISTS is_downloadable BOOLEAN NOT NULL DEFAULT FALSE;
GRANT INSERT (is_downloadable) ON app_public.movies_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (is_downloadable) ON app_public.movies_licenses TO ":DATABASE_GQL_ROLE";

-- add missing fields to tvshows_licenses
SELECT ax_define.define_audit_user_fields_on_table('tvshows_licenses', 'app_public', ':DEFAULT_USERNAME');

ALTER TABLE app_public.tvshows_licenses ADD COLUMN IF NOT EXISTS downloaded_asset_lifespan INTEGER DEFAULT 0;
GRANT INSERT (downloaded_asset_lifespan) ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (downloaded_asset_lifespan) ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.tvshows_licenses ADD COLUMN IF NOT EXISTS is_downloadable BOOLEAN NOT NULL DEFAULT FALSE;
GRANT INSERT (is_downloadable) ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (is_downloadable) ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";

-- add missing fields to seasons_licenses
SELECT ax_define.define_audit_user_fields_on_table('seasons_licenses', 'app_public', ':DEFAULT_USERNAME');

ALTER TABLE app_public.seasons_licenses ADD COLUMN IF NOT EXISTS downloaded_asset_lifespan INTEGER DEFAULT 0;
GRANT INSERT (downloaded_asset_lifespan) ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (downloaded_asset_lifespan) ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.seasons_licenses ADD COLUMN IF NOT EXISTS is_downloadable BOOLEAN NOT NULL DEFAULT FALSE;
GRANT INSERT (is_downloadable) ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (is_downloadable) ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";

-- add missing fields to episodes_licenses
SELECT ax_define.define_audit_user_fields_on_table('episodes_licenses', 'app_public', ':DEFAULT_USERNAME');

ALTER TABLE app_public.episodes_licenses ADD COLUMN IF NOT EXISTS downloaded_asset_lifespan INTEGER DEFAULT 0;
GRANT INSERT (downloaded_asset_lifespan) ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (downloaded_asset_lifespan) ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";

ALTER TABLE app_public.episodes_licenses ADD COLUMN IF NOT EXISTS is_downloadable BOOLEAN NOT NULL DEFAULT FALSE;
GRANT INSERT (is_downloadable) ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (is_downloadable) ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";
