--! Previous: sha1:fc9415fd1858d514f88cce07b2bd0be73c05d3e8
--! Hash: sha1:677b5e78a2bfb199af4c633568e2c80a8aebc78b
--! Message: image-alt-text-added

-- Media Service
ALTER TABLE app_public.movie_images
DROP COLUMN IF EXISTS alt_text CASCADE;

ALTER TABLE app_public.movie_images 
ADD COLUMN alt_text TEXT;

ALTER TABLE app_public.tvshow_images
DROP COLUMN IF EXISTS alt_text CASCADE;

ALTER TABLE app_public.tvshow_images 
ADD COLUMN alt_text TEXT;

ALTER TABLE app_public.season_images
DROP COLUMN IF EXISTS alt_text CASCADE;

ALTER TABLE app_public.season_images 
ADD COLUMN alt_text TEXT;

ALTER TABLE app_public.episode_images
DROP COLUMN IF EXISTS alt_text CASCADE;

ALTER TABLE app_public.episode_images 
ADD COLUMN alt_text TEXT;

ALTER TABLE app_public.collection_images
DROP COLUMN IF EXISTS alt_text CASCADE;

ALTER TABLE app_public.collection_images 
ADD COLUMN alt_text TEXT;

-- Channel Service
ALTER TABLE app_public.channel_images
DROP COLUMN IF EXISTS alt_text CASCADE;

ALTER TABLE app_public.channel_images 
ADD COLUMN alt_text TEXT;

ALTER TABLE app_public.program_images
DROP COLUMN IF EXISTS alt_text CASCADE;

ALTER TABLE app_public.program_images 
ADD COLUMN alt_text TEXT;
