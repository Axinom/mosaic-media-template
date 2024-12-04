--! Previous: sha1:4f6e88a3de6454ca1b2b623179dfda7c427916cf
--! Hash: sha1:cbef1a7c7d58c08a2959c41d8b7c30a3327b6478
--! Message: add-and-remove-image-types-from-tvshow-image-type-enum-table

-- tvshow_image_type enum
INSERT INTO app_public.tvshow_image_type (value, description)
VALUES 
    ('COVER_1x1', 'Cover 1x1'),
    ('COVER_16x9', 'Cover 16x9'),
    ('CLEAN_COVER_1x1', 'Clean Cover 1x1'),
    ('CLEAN_COVER_16x9', 'Clean Cover 16x9'),
    ('LIST_1x1', 'List 1x1'),
    ('LIST_9x13', 'List 9x13')
ON CONFLICT (value) DO NOTHING;

UPDATE app_public.tvshows_images SET image_type = 'COVER_1x1' WHERE image_type = 'COVER';
DELETE FROM app_public.tvshow_image_type WHERE value = 'COVER';

UPDATE app_public.tvshows_images SET image_type = 'COVER_1x1' WHERE image_type = 'TEASER';
DELETE FROM app_public.tvshow_image_type WHERE value = 'TEASER';
