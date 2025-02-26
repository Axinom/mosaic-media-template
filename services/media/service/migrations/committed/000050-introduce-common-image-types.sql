--! Previous: sha1:2202c018c5c99752da0e8d37322d66bc35867242
--! Hash: sha1:8ce6ef0bff665ea7c4ba78e76f08818a585b2d07
--! Message: introduce-common-image-types

INSERT INTO app_public.movie_image_type (value, description)
VALUES 
    ('MOVIE_COVER', 'Movie Cover'),
    ('MOVIE_CLEAN_COVER', 'MovieClean Cover'),
    ('MOVIE_LIST', 'Movie List')
ON CONFLICT (value) DO NOTHING;

INSERT INTO app_public.tvshow_image_type (value, description)
VALUES 
    ('TVSHOW_COVER', 'TV Show Cover'),
    ('TVSHOW_CLEAN_COVER', 'TV Show Cover'),
    ('TVSHOW_LIST', 'TV Show List')
ON CONFLICT (value) DO NOTHING;

INSERT INTO app_public.season_image_type (value, description)
VALUES 
    ('SEASON_COVER', 'Season Cover'),
    ('SEASON_CLEAN_COVER', 'Season Cover'),
    ('SEASON_LIST', 'Season List')
ON CONFLICT (value) DO NOTHING;

INSERT INTO app_public.episode_image_type (value, description)
VALUES 
    ('EPISODE_COVER', 'Episode Cover'),
    ('EPISODE_CLEAN_COVER', 'Episode Cover'),
    ('EPISODE_LIST', 'Episode List')
ON CONFLICT (value) DO NOTHING;

INSERT INTO app_public.collection_image_type (value, description)
VALUES 
    ('COLLECTION_COVER', 'Collection Cover'),
    ('COLLECTION_CLEAN_COVER', 'Collection Cover'),
    ('COLLECTION_LIST', 'Collection List')
ON CONFLICT (value) DO NOTHING;
