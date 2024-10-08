--! Message: add-and-remove-image-types-from-movie-image-type-enum-table

-- movie_image_type enum
UPDATE app_public.movies_images SET image_type = 'COVER_1X1' WHERE image_type = 'COVER';
DELETE FROM app_public.movie_image_type WHERE value = 'COVER';

UPDATE app_public.movies_images SET image_type = 'COVER_1X1' WHERE image_type = 'TEASER';
DELETE FROM app_public.movie_image_type WHERE value = 'TEASER';

UPDATE app_public.movies_images SET image_type = 'COVER_1X1' WHERE image_type = 'MOVIE_COVER_1x1';
DELETE FROM app_public.movie_image_type WHERE value = 'MOVIE_COVER_1x1';

UPDATE app_public.movies_images SET image_type = 'COVER_16X9' WHERE image_type = 'MOVIE_COVER_16x9';
DELETE FROM app_public.movie_image_type WHERE value = 'MOVIE_COVER_16x9';

UPDATE app_public.movies_images SET image_type = 'CLEAN_COVER_1X1' WHERE image_type = 'MOVIE_CLEAN_COVER_1x1';
DELETE FROM app_public.movie_image_type WHERE value = 'MOVIE_CLEAN_COVER_1x1';

UPDATE app_public.movies_images SET image_type = 'CLEAN_COVER_16X9' WHERE image_type = 'MOVIE_CLEAN_COVER_16x9';
DELETE FROM app_public.movie_image_type WHERE value = 'MOVIE_CLEAN_COVER_16x9';

UPDATE app_public.movies_images SET image_type = 'LIST_9X13' WHERE image_type = 'MOVIE_LIST_9x13';
DELETE FROM app_public.movie_image_type WHERE value = 'MOVIE_LIST_9x13';

INSERT INTO app_public.movie_image_type (value, description)
VALUES 
    ('COVER_1x1', 'Cover 1x1'),
    ('COVER_16x9', 'Cover 16x9'),
    ('CLEAN_COVER_1x1', 'Clean Cover 1x1'),
    ('CLEAN_COVER_16x9', 'Clean Cover 16x9'),
    ('LIST_9x13', 'List 9x13')
ON CONFLICT (value) DO NOTHING;
