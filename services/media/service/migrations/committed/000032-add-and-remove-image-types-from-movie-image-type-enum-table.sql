--! Previous: sha1:97414ab5b38903fb0a0d6698a39f4a8b20d552f7
--! Hash: sha1:33dd6526e51e4c02a562908f22a359a30cb65668
--! Message: add-and-remove-image-types-from-movie-image-type-enum-table

-- movie_image_type enum

INSERT INTO app_public.movie_image_type (value, description)
VALUES 
    ('COVER_1x1', 'Cover 1x1'),
    ('COVER_16x9', 'Cover 16x9'),
    ('CLEAN_COVER_1x1', 'Clean Cover 1x1'),
    ('CLEAN_COVER_16x9', 'Clean Cover 16x9'),
    ('LIST_9x13', 'List 9x13')
ON CONFLICT (value) DO NOTHING;

UPDATE app_public.movies_images SET image_type = 'COVER_1x1' WHERE image_type = 'COVER';
DELETE FROM app_public.movie_image_type WHERE value = 'COVER';

UPDATE app_public.movies_images SET image_type = 'COVER_1x1' WHERE image_type = 'TEASER';
DELETE FROM app_public.movie_image_type WHERE value = 'TEASER';
