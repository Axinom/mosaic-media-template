--! Previous: sha1:be0c253b661930f7866804ec4aa5409e0e798561
--! Hash: sha1:f976448088c61d3d058d2eb1c4a0894a14da7aa5
--! Message: add-missing-fields-for-licenses

-- add missing fields to seasons-licenses
SELECT ax_define.define_audit_user_fields_on_table('seasons_licenses', 'app_public', ':DEFAULT_USERNAME');
ALTER TABLE app_public.seasons_licenses ADD COLUMN IF NOT EXISTS downloaded_asset_lifespan INTEGER DEFAULT 0;
GRANT INSERT (downloaded_asset_lifespan) ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (downloaded_asset_lifespan) ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";
ALTER TABLE app_public.seasons_licenses ADD COLUMN IF NOT EXISTS is_downloadable BOOLEAN NOT NULL DEFAULT FALSE;
GRANT INSERT (is_downloadable) ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (is_downloadable) ON app_public.seasons_licenses TO ":DATABASE_GQL_ROLE";

-- add missing fields to tv-shows-licenses
SELECT ax_define.define_audit_user_fields_on_table('tvshows_licenses', 'app_public', ':DEFAULT_USERNAME');
ALTER TABLE app_public.tvshows_licenses ADD COLUMN IF NOT EXISTS downloaded_asset_lifespan INTEGER DEFAULT 0;
GRANT INSERT (downloaded_asset_lifespan) ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (downloaded_asset_lifespan) ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";
ALTER TABLE app_public.tvshows_licenses ADD COLUMN IF NOT EXISTS is_downloadable BOOLEAN NOT NULL DEFAULT FALSE;
GRANT INSERT (is_downloadable) ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (is_downloadable) ON app_public.tvshows_licenses TO ":DATABASE_GQL_ROLE";
