--! Previous: sha1:959055d039bbb8e76e507b67f683e7e6e88df070
--! Hash: sha1:be0c253b661930f7866804ec4aa5409e0e798561
--! Message: Add missing fields to episodes table

-- episode_image_type enum
INSERT INTO app_public.episode_image_type (value, description)
VALUES 
    ('COVER_1x1', 'Cover 1x1'),
    ('COVER_16x9', 'Cover 16x9'),
    ('CLEAN_COVER_1x1', 'Clean Cover 1x1'),
    ('CLEAN_COVER_16x9', 'Clean Cover 16x9'),
    ('LIST_1x1', 'List 1x1'),
    ('LIST_9x13', 'List 9x13')
ON CONFLICT (value) DO NOTHING;

UPDATE app_public.episodes_images SET image_type = 'COVER_1x1' WHERE image_type = 'COVER';
DELETE FROM app_public.episode_image_type WHERE value = 'COVER';

UPDATE app_public.episodes_images SET image_type = 'COVER_1x1' WHERE image_type = 'TEASER';
DELETE FROM app_public.episode_image_type WHERE value = 'TEASER';

-- add missing fields to episodes_licenses
SELECT ax_define.define_audit_user_fields_on_table('episodes_licenses', 'app_public', ':DEFAULT_USERNAME');
ALTER TABLE app_public.episodes_licenses ADD COLUMN IF NOT EXISTS downloaded_asset_lifespan INTEGER DEFAULT 0;
GRANT INSERT (downloaded_asset_lifespan) ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (downloaded_asset_lifespan) ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";
ALTER TABLE app_public.episodes_licenses ADD COLUMN IF NOT EXISTS is_downloadable BOOLEAN NOT NULL DEFAULT FALSE;
GRANT INSERT (is_downloadable) ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (is_downloadable) ON app_public.episodes_licenses TO ":DATABASE_GQL_ROLE";
