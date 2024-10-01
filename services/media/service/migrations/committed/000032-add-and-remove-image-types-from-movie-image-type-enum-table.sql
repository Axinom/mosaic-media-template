--! Previous: sha1:97414ab5b38903fb0a0d6698a39f4a8b20d552f7
--! Hash: sha1:63d97d52b5370e8275179d483925f5de9ae5d2fe
--! Message: add-and-remove-image-types-from-movie-image-type-enum-table

-- movie_image_type enum
UPDATE app_public.movies_images SET image_type = 'LIST' WHERE image_type = 'TEASER';
DELETE FROM app_public.movie_image_type WHERE value = 'TEASER';

INSERT INTO app_public.movie_image_type (value, description)
VALUES 
    ('CLEAN_COVER', 'Clean Cover'),
    ('LIST', 'List')
ON CONFLICT (value) DO NOTHING;
