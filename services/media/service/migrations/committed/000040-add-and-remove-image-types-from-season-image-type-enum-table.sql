--! Previous: sha1:2335564ab3bb983447fe05ee3d0becccf0cf9641
--! Hash: sha1:959055d039bbb8e76e507b67f683e7e6e88df070
--! Message: add-and-remove-image-types-from-season-image-type-enum-table

-- season_image_type enum

INSERT INTO app_public.season_image_type (value, description)
VALUES 
    ('COVER_1x1', 'Cover 1x1'),
    ('COVER_16x9', 'Cover 16x9'),
    ('CLEAN_COVER_1x1', 'Clean Cover 1x1'),
    ('CLEAN_COVER_16x9', 'Clean Cover 16x9'),
    ('LIST_9x13', 'List 9x13'),
    ('LIST_1x1', 'List 1x1')
ON CONFLICT (value) DO NOTHING;

UPDATE app_public.seasons_images SET image_type = 'COVER_1x1' WHERE image_type = 'COVER';
DELETE FROM app_public.season_image_type WHERE value = 'COVER';

UPDATE app_public.seasons_images SET image_type = 'COVER_1x1' WHERE image_type = 'TEASER';
DELETE FROM app_public.season_image_type WHERE value = 'TEASER';

-- Add title to season
ALTER TABLE app_public.seasons ADD COLUMN IF NOT EXISTS title TEXT;
UPDATE app_public.seasons SET title = 'Season' || index WHERE title IS NULL;
ALTER TABLE app_public.seasons ALTER COLUMN title SET NOT NULL;

GRANT INSERT(title) ON TABLE app_public.seasons TO  ":DATABASE_GQL_ROLE";
GRANT UPDATE(title) ON TABLE app_public.seasons TO  ":DATABASE_GQL_ROLE";


SELECT app_hidden.create_localizable_entity_triggers(
  'id', 'seasons', 'SEASON', ':SEASON_LOCALIZABLE_FIELDS',':SEASON_LOCALIZATION_REQUIRED_FIELDS');
