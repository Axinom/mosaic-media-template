--! Previous: sha1:4242e4d447c4279479cfce85990fde64387fe514
--! Hash: sha1:e6ef20efc970aba45f27f24b79db4c037c66f4e2
--! Message: redefine-image-types-with-type-prefix

INSERT INTO app_public.movie_image_type (value, description)
VALUES 
    ('MOVIE_COVER_1x1', 'Movie Cover 1x1'),
    ('MOVIE_COVER_16x9', 'Movie Cover 16x9'),
    ('MOVIE_CLEAN_COVER_1x1', 'MovieClean Cover 1x1'),
    ('MOVIE_CLEAN_COVER_16x9', 'Movie Clean Cover 16x9'),
    ('MOVIE_LIST_1x1', 'Movie List 1x1'),
    ('MOVIE_LIST_9x13', 'Movie List 9x13')
ON CONFLICT (value) DO NOTHING;

UPDATE app_public.movies_images SET image_type = 'MOVIE_COVER_1x1' WHERE image_type = 'COVER_1x1';
DELETE FROM app_public.movie_image_type WHERE value = 'COVER_1x1';

UPDATE app_public.movies_images SET image_type = 'MOVIE_COVER_16x9' WHERE image_type = 'COVER_16x9';
DELETE FROM app_public.movie_image_type WHERE value = 'COVER_16x9';

UPDATE app_public.movies_images SET image_type = 'MOVIE_CLEAN_COVER_1x1' WHERE image_type = 'CLEAN_COVER_1x1';
DELETE FROM app_public.movie_image_type WHERE value = 'CLEAN_COVER_1x1';

UPDATE app_public.movies_images SET image_type = 'MOVIE_CLEAN_COVER_16x9' WHERE image_type = 'CLEAN_COVER_16x9';
DELETE FROM app_public.movie_image_type WHERE value = 'CLEAN_COVER_16x9';

UPDATE app_public.movies_images SET image_type = 'MOVIE_LIST_1x1' WHERE image_type = 'LIST_1x1';
DELETE FROM app_public.movie_image_type WHERE value = 'LIST_1x1';

UPDATE app_public.movies_images SET image_type = 'MOVIE_LIST_9x13' WHERE image_type = 'LIST_9x13';
DELETE FROM app_public.movie_image_type WHERE value = 'LIST_9x13';


-- tvshow_image_type enum
INSERT INTO app_public.tvshow_image_type (value, description)
VALUES 
    ('TVSHOW_COVER_1x1', 'TV Show Cover 1x1'),
    ('TVSHOW_COVER_16x9', 'TV Show Cover 16x9'),
    ('TVSHOW_CLEAN_COVER_1x1', 'TV Show Clean Cover 1x1'),
    ('TVSHOW_CLEAN_COVER_16x9', 'TV Show Clean Cover 16x9'),
    ('TVSHOW_LIST_1x1', 'TV Show List 1x1'),
    ('TVSHOW_LIST_9x13', 'TV Show List 9x13')
ON CONFLICT (value) DO NOTHING;

UPDATE app_public.tvshows_images SET image_type = 'TVSHOW_COVER_1x1' WHERE image_type = 'COVER_1x1';
DELETE FROM app_public.tvshow_image_type WHERE value = 'COVER_1x1';

UPDATE app_public.tvshows_images SET image_type = 'TVSHOW_COVER_16x9' WHERE image_type = 'COVER_16x9';
DELETE FROM app_public.tvshow_image_type WHERE value = 'COVER_16x9';

UPDATE app_public.tvshows_images SET image_type = 'TVSHOW_CLEAN_COVER_1x1' WHERE image_type = 'CLEAN_COVER_1x1';
DELETE FROM app_public.tvshow_image_type WHERE value = 'CLEAN_COVER_1x1';

UPDATE app_public.tvshows_images SET image_type = 'TVSHOW_CLEAN_COVER_16x9' WHERE image_type = 'CLEAN_COVER_16x9';
DELETE FROM app_public.tvshow_image_type WHERE value = 'CLEAN_COVER_16x9';

UPDATE app_public.tvshows_images SET image_type = 'TVSHOW_LIST_1x1' WHERE image_type = 'LIST_1x1';
DELETE FROM app_public.tvshow_image_type WHERE value = 'LIST_1x1';

UPDATE app_public.tvshows_images SET image_type = 'TVSHOW_LIST_9x13' WHERE image_type = 'LIST_9x13';
DELETE FROM app_public.tvshow_image_type WHERE value = 'LIST_9x13';

-- season_image_type enum
INSERT INTO app_public.season_image_type (value, description)
VALUES 
    ('SEASON_COVER_1x1', 'Season Cover 1x1'),
    ('SEASON_COVER_16x9', 'Season Cover 16x9'),
    ('SEASON_CLEAN_COVER_1x1', 'Season Clean Cover 1x1'),
    ('SEASON_CLEAN_COVER_16x9', 'Season Clean Cover 16x9'),
    ('SEASON_LIST_9x13', 'Season List 9x13'),
    ('SEASON_LIST_1x1', 'Season List 1x1')
ON CONFLICT (value) DO NOTHING;

UPDATE app_public.seasons_images SET image_type = 'SEASON_COVER_1x1' WHERE image_type = 'COVER_1x1';
DELETE FROM app_public.season_image_type WHERE value = 'COVER_1x1';

UPDATE app_public.seasons_images SET image_type = 'SEASON_COVER_16x9' WHERE image_type = 'COVER_16x9';
DELETE FROM app_public.season_image_type WHERE value = 'COVER_16x9';

UPDATE app_public.seasons_images SET image_type = 'SEASON_CLEAN_COVER_1x1' WHERE image_type = 'SEASON_CLEAN_COVER_1x1';
DELETE FROM app_public.season_image_type WHERE value = 'CLEAN_COVER_1x1';

UPDATE app_public.seasons_images SET image_type = 'SEASON_CLEAN_COVER_16x9' WHERE image_type = 'SEASON_CLEAN_COVER_16x9';
DELETE FROM app_public.season_image_type WHERE value = 'CLEAN_COVER_16x9';

UPDATE app_public.seasons_images SET image_type = 'SEASON_LIST_9x13' WHERE image_type = 'LIST_9x13';
DELETE FROM app_public.season_image_type WHERE value = 'LIST_9x13';

UPDATE app_public.seasons_images SET image_type = 'SEASON_LIST_1x1' WHERE image_type = 'LIST_1x1';
DELETE FROM app_public.season_image_type WHERE value = 'LIST_1x1';

-- episode_image_type enum
INSERT INTO app_public.episode_image_type (value, description)
VALUES 
    ('EPISODE_COVER_1x1', 'Episode Cover 1x1'),
    ('EPISODE_COVER_16x9', 'Episode Cover 16x9'),
    ('EPISODE_CLEAN_COVER_1x1', 'Episode Clean Cover 1x1'),
    ('EPISODE_CLEAN_COVER_16x9', 'Episode Clean Cover 16x9'),
    ('EPISODE_LIST_1x1', 'Episode List 1x1'),
    ('EPISODE_LIST_9x13', 'Episode List 9x13')
ON CONFLICT (value) DO NOTHING;

UPDATE app_public.episodes_images SET image_type = 'EPISODE_COVER_1x1' WHERE image_type = 'COVER_1x1';
DELETE FROM app_public.episode_image_type WHERE value = 'COVER_1x1';

UPDATE app_public.episodes_images SET image_type = 'EPISODE_COVER_16x9' WHERE image_type = 'COVER_16x9';
DELETE FROM app_public.episode_image_type WHERE value = 'COVER_16x9';

UPDATE app_public.episodes_images SET image_type = 'EPISODE_CLEAN_COVER_1x1' WHERE image_type = 'EPISODE_CLEAN_COVER_1x1';
DELETE FROM app_public.episode_image_type WHERE value = 'CLEAN_COVER_1x1';

UPDATE app_public.episodes_images SET image_type = 'EPISODE_CLEAN_COVER_16x9' WHERE image_type = 'EPISODE_CLEAN_COVER_16x9';
DELETE FROM app_public.episode_image_type WHERE value = 'CLEAN_COVER_16x9';

UPDATE app_public.episodes_images SET image_type = 'EPISODE_LIST_1x1' WHERE image_type = 'EPISODE_LIST_1x1';
DELETE FROM app_public.episode_image_type WHERE value = 'LIST_1x1';

UPDATE app_public.episodes_images SET image_type = 'EPISODE_LIST_9x13' WHERE image_type = 'EPISODE_LIST_9x13';
DELETE FROM app_public.episode_image_type WHERE value = 'LIST_9x13';

-- collection_image_type enum
INSERT INTO app_public.collection_image_type (value, description)
VALUES 
    ('COLLECTION_COVER_1x1', 'Collection Cover 1x1'),
    ('COLLECTION_COVER_4x1', 'Collection Cover 4x1'),
    ('COLLECTION_CLEAN_COVER_1x1', 'Collection Clean Cover 1x1'),
    ('COLLECTION_CLEAN_COVER_4x1', 'Collection Clean Cover 4x1'),
    ('COLLECTION_LIST_1x1', 'Collection List 1x1'),
    ('COLLECTION_LIST_15x16', 'Collection List 15x16')
ON CONFLICT (value) DO NOTHING;

UPDATE app_public.collections_images SET image_type = 'COLLECTION_COVER_1x1' WHERE image_type = 'COVER_1x1';
DELETE FROM app_public.collection_image_type WHERE value = 'COVER_1x1';

UPDATE app_public.collections_images SET image_type = 'COLLECTION_COVER_4x1' WHERE image_type = 'COVER_4x1';
DELETE FROM app_public.collection_image_type WHERE value = 'COVER_4x1';

UPDATE app_public.collections_images SET image_type = 'COLLECTION_CLEAN_COVER_1x1' WHERE image_type = 'CLEAN_COVER_1x1';
DELETE FROM app_public.collection_image_type WHERE value = 'CLEAN_COVER_1x1';

UPDATE app_public.collections_images SET image_type = 'COLLECTION_CLEAN_COVER_4x1' WHERE image_type = 'CLEAN_COVER_4x1';
DELETE FROM app_public.collection_image_type WHERE value = 'CLEAN_COVER_4x1';

UPDATE app_public.collections_images SET image_type = 'COLLECTION_LIST_1x1' WHERE image_type = 'LIST_1x1';
DELETE FROM app_public.collection_image_type WHERE value = 'LIST_1x1';

UPDATE app_public.collections_images SET image_type = 'COLLECTION_LIST_15x16' WHERE image_type = 'LIST_15x16';
DELETE FROM app_public.collection_image_type WHERE value = 'LIST_15x16';


-- Remove unused business_type column in seasons and episodes
ALTER TABLE app_public.seasons DROP COLUMN IF EXISTS business_type;
ALTER TABLE app_public.episodes DROP COLUMN IF EXISTS business_type;
