--! Previous: sha1:055167d5c74f49f62ad19b8bbab08b7ab9dd79d7
--! Hash: sha1:b05881780901d16912aa491b36b956a0e884dc7b
--! Message: add-list-image-type

INSERT INTO app_public.movie_image_type (value, description)
VALUES 
    ('LIST_1x1', 'List 1x1')
ON CONFLICT (value) DO NOTHING;
